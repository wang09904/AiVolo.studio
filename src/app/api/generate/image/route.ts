import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/lib/auth/profile';
import { ASPECT_RATIO_DIMENSIONS, TEXT_TO_IMAGE_MODEL } from '@/lib/product';
import { E2E_MOCK_IMAGE_DATA_URL, isE2EMockMode } from '@/lib/e2e/mockGeneration';
import { getSignedDownloadUrl, uploadBufferToR2 } from '@/lib/storage/r2';
import type { AspectRatio } from '@/types/generation';

type OpenAIImageResponse = {
  data?: Array<{
    url?: string;
    b64_json?: string;
    task_id?: string;
  }>;
  code?: number;
  error?: {
    message?: string;
  } | string;
  message?: string;
};

type ProviderErrorResponse = {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  } | string;
};

type GenerationPersistenceCheck = {
  id: string;
  image_url: string | null;
  storage_key?: string | null;
  status: string | null;
};

const isAspectRatio = (value: unknown): value is AspectRatio =>
  typeof value === 'string' && value in ASPECT_RATIO_DIMENSIONS;

function normalizeImageEndpoint(rawUrl: string): string {
  const trimmedUrl = rawUrl.trim().replace(/\/+$/, '');

  if (/\/v1\/images\/generations$/.test(trimmedUrl)) return trimmedUrl;
  if (/\/images\/generations$/.test(trimmedUrl)) return trimmedUrl;

  return trimmedUrl
    .replace(/\/v1\/chat\/completions$/, '/v1/images/generations')
    .replace(/\/chat\/completions$/, '/images/generations')
    .replace(/\/v1$/, '/v1/images/generations')
    .replace(/$/, '/v1/images/generations');
}

function getTaskEndpoint(imageEndpoint: string, taskId: string): string | null {
  try {
    const url = new URL(imageEndpoint);
    url.pathname = url.pathname
      .replace(/\/images\/generations\/?$/, `/tasks/${encodeURIComponent(taskId)}`)
      .replace(/\/chat\/completions\/?$/, `/tasks/${encodeURIComponent(taskId)}`);
    return url.toString();
  } catch {
    return null;
  }
}

function getProviderMessage(data: ProviderErrorResponse | OpenAIImageResponse): string | undefined {
  if (typeof data.error === 'string') return data.error;
  if (data.error?.message) return data.error.message;
  return 'message' in data && typeof data.message === 'string' ? data.message : undefined;
}

async function findVisibleGeneration(
  supabase: Awaited<ReturnType<typeof createClient>>,
  generationId: string
): Promise<{ row: GenerationPersistenceCheck | null; error: unknown | null }> {
  const query = supabase
    .from('generations')
    .select('id, image_url, storage_key, status')
    .eq('id', generationId)
    .maybeSingle();

  const { data, error } = await query;

  if (!error) {
    return { row: data as GenerationPersistenceCheck | null, error: null };
  }

  const message = 'message' in error && typeof error.message === 'string' ? error.message : '';

  if (!message.includes('storage_key')) {
    return { row: null, error };
  }

  const fallback = await supabase
    .from('generations')
    .select('id, image_url, status')
    .eq('id', generationId)
    .maybeSingle();

  if (fallback.error) {
    return { row: null, error: fallback.error };
  }

  return {
    row: fallback.data
      ? { ...(fallback.data as Omit<GenerationPersistenceCheck, 'storage_key'>), storage_key: null }
      : null,
    error: null,
  };
}

function extractImageUrl(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return null;
}

async function getGeneratedImageBuffer(data: OpenAIImageResponse): Promise<Buffer | null> {
  const image = data.data?.[0];

  if (image?.b64_json) {
    return Buffer.from(image.b64_json, 'base64');
  }

  const imageUrl = extractImageUrl(image?.url);

  if (imageUrl) {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) return null;
    return Buffer.from(await imageResponse.arrayBuffer());
  }

  return null;
}

async function pollGeneratedImage(
  imageEndpoint: string,
  taskId: string,
  apiKey: string
): Promise<{ imageBuffer: Buffer | null; error?: string }> {
  const taskEndpoint = getTaskEndpoint(imageEndpoint, taskId);
  if (!taskEndpoint) return { imageBuffer: null, error: 'Invalid task endpoint.' };

  for (let attempt = 0; attempt < 24; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 12000 : 5000));

    const response = await fetch(taskEndpoint, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = (await response.json().catch(() => ({}))) as {
      code?: number;
      data?: {
        status?: string;
        error?: { message?: string };
        result?: { images?: Array<{ url?: string | string[] }> };
      };
      error?: { message?: string } | string;
      message?: string;
    };

    if (!response.ok || (typeof data.code === 'number' && data.code !== 200)) {
      return { imageBuffer: null, error: getProviderMessage(data) || 'Task polling failed.' };
    }

    const status = data.data?.status;

    if (status === 'failed') {
      return { imageBuffer: null, error: data.data?.error?.message || 'Image task failed.' };
    }

    if (status === 'completed') {
      const imageUrl = extractImageUrl(data.data?.result?.images?.[0]?.url);
      if (!imageUrl) return { imageBuffer: null, error: 'Completed task did not include an image URL.' };

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) return { imageBuffer: null, error: 'Generated image download failed.' };

      return { imageBuffer: Buffer.from(await imageResponse.arrayBuffer()) };
    }
  }

  return { imageBuffer: null, error: 'Image generation timed out.' };
}

export async function POST(request: NextRequest) {
  let refundContext: {
    supabase: Awaited<ReturnType<typeof createClient>>;
    userId: string;
    generationId: string;
  } | null = null;

  const refundReservedCredits = async (reason: string) => {
    if (!refundContext) return;

    const { error } = await refundContext.supabase.rpc('fail_generation_refund_atomic', {
      p_user_id: refundContext.userId,
      p_generation_id: refundContext.generationId,
      p_reason: reason,
    });

    if (error) {
      console.error('Reserved credits refund failed:', error);
    }
  };

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const modelId = typeof body.model_id === 'string' ? body.model_id : '';
    const aspectRatio = isAspectRatio(body.aspect_ratio) ? body.aspect_ratio : '1:1';

    if (!prompt || !modelId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters.' },
        { status: 400 }
      );
    }

    if (modelId !== TEXT_TO_IMAGE_MODEL.id) {
      return NextResponse.json(
        { success: false, error: 'This model is not available yet.' },
        { status: 400 }
      );
    }

    if (isE2EMockMode()) {
      return NextResponse.json({
        success: true,
        generation: {
          id: randomUUID(),
          image_url: E2E_MOCK_IMAGE_DATA_URL,
          status: 'completed',
        },
      });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Please sign in first.' },
        { status: 401 }
      );
    }

    const { profile, error: profileError } = await ensureUserProfile(supabase, user);

    if (profileError || !profile) {
      console.error('User profile missing:', profileError);
      return NextResponse.json(
        { success: false, error: 'We could not prepare your free credits. Please refresh and try again.' },
        { status: 500 }
      );
    }

    if ((profile.credits_balance ?? 0) < TEXT_TO_IMAGE_MODEL.creditCost) {
      return NextResponse.json(
        { success: false, error: 'Not enough credits.' },
        { status: 402 }
      );
    }

    const apiUrl = process.env.OPENAI_API_URL || process.env.OPENAI_BASE_URL;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiUrl || !apiKey) {
      console.error('OpenAI proxy API configuration is incomplete.');
      return NextResponse.json(
        { success: false, error: 'Service configuration error.' },
        { status: 500 }
      );
    }

    const { data: pendingGenerationId, error: reserveError } = await supabase.rpc(
      'create_generation_pending_atomic',
      {
        p_user_id: user.id,
        p_generation_type: 'text_to_image',
        p_model_id: TEXT_TO_IMAGE_MODEL.id,
        p_prompt: prompt,
        p_credits_to_reserve: TEXT_TO_IMAGE_MODEL.creditCost,
        p_cost_usd: TEXT_TO_IMAGE_MODEL.costUsd,
      }
    );

    if (reserveError || !pendingGenerationId) {
      console.error('Generation reservation failed:', reserveError);
      return NextResponse.json(
        {
          success: false,
          error:
            process.env.NODE_ENV === 'development'
              ? `Could not reserve credits: ${reserveError?.message || 'Unknown database error'}`
              : 'Could not reserve credits.',
        },
        { status: 500 }
      );
    }

    refundContext = {
      supabase,
      userId: user.id,
      generationId: pendingGenerationId as string,
    };

    const imageEndpoint = normalizeImageEndpoint(apiUrl);
    const isUiUiApi = imageEndpoint.includes('uiuiapi.com');
    const dimensions = ASPECT_RATIO_DIMENSIONS[aspectRatio];
    const response = await fetch(imageEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: isUiUiApi ? TEXT_TO_IMAGE_MODEL.apiModelId : TEXT_TO_IMAGE_MODEL.openaiApiModelId,
        prompt,
        n: 1,
        size: isUiUiApi ? aspectRatio : `${dimensions.width}x${dimensions.height}`,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as ProviderErrorResponse;
      console.error('Image generation provider failed:', response.status, errorData);
      const providerMessage = getProviderMessage(errorData);
      await refundReservedCredits(providerMessage || 'Image provider rejected the request');

      return NextResponse.json(
        {
          success: false,
          error:
            process.env.NODE_ENV === 'development' && providerMessage
              ? `Image provider rejected the request: ${providerMessage}`
              : 'Image provider rejected the request. Please try again later.',
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as OpenAIImageResponse;
    const taskId = data.data?.[0]?.task_id;
    const providerMessage = getProviderMessage(data);
    let imageBuffer = await getGeneratedImageBuffer(data);

    if (!imageBuffer && taskId) {
      const pollResult = await pollGeneratedImage(imageEndpoint, taskId, apiKey);
      imageBuffer = pollResult.imageBuffer;

      if (!imageBuffer && pollResult.error) {
        await refundReservedCredits(pollResult.error);
        return NextResponse.json(
          {
            success: false,
            error:
              process.env.NODE_ENV === 'development'
                ? `Image provider task failed: ${pollResult.error}`
                : 'Image provider task failed. Please try again later.',
          },
          { status: 502 }
        );
      }
    }

    if (!imageBuffer) {
      await refundReservedCredits(providerMessage || 'Generation result was invalid');
      return NextResponse.json(
        {
          success: false,
          error:
            process.env.NODE_ENV === 'development' && providerMessage
              ? `Generation result was invalid: ${providerMessage}`
              : 'Generation result was invalid.',
        },
        { status: 502 }
      );
    }

    const objectKey = `generations/${user.id}/${randomUUID()}.png`;
    let imageUrl: string;

    try {
      await uploadBufferToR2(objectKey, imageBuffer, 'image/png');
      imageUrl = await getSignedDownloadUrl(objectKey);
    } catch (storageError) {
      console.error('Generated image storage failed:', storageError);
      await refundReservedCredits('Generated image could not be saved');
      return NextResponse.json(
        { success: false, error: 'Generated image could not be saved. Please try again later.' },
        { status: 502 }
      );
    }

    const { data: generationId, error: dbError } = await supabase.rpc('complete_generation_atomic', {
      p_user_id: user.id,
      p_generation_id: pendingGenerationId,
      p_image_url: imageUrl,
      p_storage_key: objectKey,
    });

    if (dbError) {
      console.error('Generation completion failed:', dbError);
      await refundReservedCredits('Generation completion failed');
      return NextResponse.json(
        {
          success: false,
          error:
            process.env.NODE_ENV === 'development'
              ? `Generation completion failed: ${dbError.message}`
              : 'Generation completion failed.',
          details:
            process.env.NODE_ENV === 'development'
              ? {
                  code: dbError.code,
                  details: dbError.details,
                  hint: dbError.hint,
                }
              : undefined,
        },
        { status: 500 }
      );
    }

    const visibleGenerationId = typeof generationId === 'string' ? generationId : pendingGenerationId;
    let { row: visibleGeneration, error: visibilityError } = await findVisibleGeneration(
      supabase,
      visibleGenerationId
    );

    if (visibilityError) {
      console.error('Generation persistence check failed:', visibilityError);
    }

    if (!visibleGeneration) {
      console.error('Generation was not visible after completion; attempting direct repair insert.', {
        generationId: visibleGenerationId,
        userId: user.id,
      });

      const { error: repairError } = await supabase
        .from('generations')
        .insert({
          id: visibleGenerationId,
          user_id: user.id,
          prompt,
          model_id: TEXT_TO_IMAGE_MODEL.id,
          generation_type: 'text_to_image',
          status: 'completed',
          credits_used: TEXT_TO_IMAGE_MODEL.creditCost,
          cost_usd: TEXT_TO_IMAGE_MODEL.costUsd,
          image_url: imageUrl,
          storage_key: objectKey,
        });

      if (repairError) {
        console.error('Generation direct repair insert failed:', repairError);
        await refundReservedCredits('Generation persistence failed');
        return NextResponse.json(
          {
            success: false,
            error:
              process.env.NODE_ENV === 'development'
                ? `Generation persistence failed: ${repairError.message}`
                : 'Generation persistence failed.',
          },
          { status: 500 }
        );
      }

      const repairCheck = await findVisibleGeneration(supabase, visibleGenerationId);
      visibleGeneration = repairCheck.row;
      visibilityError = repairCheck.error;
    }

    if (!visibleGeneration) {
      console.error('Generation persistence still missing after repair:', visibilityError);
      await refundReservedCredits('Generation persistence verification failed');
      return NextResponse.json(
        { success: false, error: 'Generation persistence verification failed.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      generation: {
        id: visibleGeneration.id,
        image_url: imageUrl,
        status: 'completed',
      },
    });
  } catch (error) {
    console.error('Generate image route failed:', error);
    await refundReservedCredits('Unexpected server error');
    return NextResponse.json(
      { success: false, error: 'Server error.' },
      { status: 500 }
    );
  }
}
