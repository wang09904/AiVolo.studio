import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { TextToImageRequest, TextToImageResponse } from '@/types/generation';

const CREDITS_PER_IMAGE = 10;

/**
 * 文生图 API 路由
 * POST /api/generate/image
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body: TextToImageRequest = await request.json();
    const { prompt, model_id, aspect_ratio } = body;

    // 参数验证
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!model_id || typeof model_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Model ID is required' },
        { status: 400 }
      );
    }

    // 创建 Supabase 客户端
    const supabase = await createClient();

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 调用原子操作 RPC：扣积分 + 创建生成记录
    const { data: generationId, error: rpcError } = await supabase.rpc(
      'create_generation_atomic',
      {
        p_user_id: user.id,
        p_prompt: prompt.trim(),
        p_model_id: model_id,
        p_generation_type: 'text_to_image',
        p_credits_to_deduct: CREDITS_PER_IMAGE,
      }
    );

    if (rpcError) {
      console.error('RPC error:', rpcError);
      // 检查是否是积分不足错误
      if (rpcError.message?.includes('Insufficient credits')) {
        return NextResponse.json(
          { success: false, error: 'Insufficient credits' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Failed to create generation' },
        { status: 500 }
      );
    }

    if (!generationId) {
      return NextResponse.json(
        { success: false, error: 'Failed to create generation' },
        { status: 500 }
      );
    }

    // 调用中转 API 生成图片
    const imageUrl = await generateImage(prompt, model_id, aspect_ratio);

    // 更新生成记录：设置图片 URL 和状态
    const { error: updateError } = await supabase
      .from('generations')
      .update({
        image_url: imageUrl,
        status: imageUrl ? 'completed' : 'failed',
      })
      .eq('id', generationId);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    // 返回结果
    const response: TextToImageResponse = {
      success: !!imageUrl,
      generation: imageUrl
        ? {
            id: generationId,
            image_url: imageUrl,
            status: 'completed' as const,
          }
        : undefined,
      error: imageUrl ? undefined : 'Image generation failed',
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 调用中转 API 生成图片
 */
async function generateImage(
  prompt: string,
  modelId: string,
  aspectRatio?: string
): Promise<string | null> {
  const apiUrl = process.env.OPENAI_API_URL;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error('Missing API configuration');
    return null;
  }

  try {
    // 构建请求体（OpenAI 格式）
    const requestBody: Record<string, unknown> = {
      model: modelId,
      prompt: prompt,
      n: 1,
      size: aspectRatioToSize(aspectRatio),
    };

    const response = await fetch(`${apiUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', response.status, errorText);
      return null;
    }

    const data = await response.json();

    // 提取图片 URL（OpenAI 格式：{ data: [{ url: "..." }] }）
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data[0].url || null;
    }

    return null;
  } catch (error) {
    console.error('Generate image error:', error);
    return null;
  }
}

/**
 * 将 aspect_ratio 转换为 OpenAI API 尺寸格式
 */
function aspectRatioToSize(aspectRatio?: string): string {
  const sizeMap: Record<string, string> = {
    '1:1': '1024x1024',
    '16:9': '1792x1024',
    '9:16': '1024x1792',
    '4:3': '1024x768',
    '3:4': '768x1024',
  };
  return sizeMap[aspectRatio || '1:1'] || '1024x1024';
}
