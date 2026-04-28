import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 图片生成 API
 * POST /api/generate/image
 * Body: { prompt, model_id, aspect_ratio }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model_id, aspect_ratio } = body;

    // 1. 验证必填参数
    if (!prompt || !model_id) {
      return NextResponse.json(
        { success: false, error: '缺少必填参数' },
        { status: 400 }
      );
    }

    // 2. 验证登录状态
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    // 3. 检查用户积分
    const { data: credits } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    const balance = credits?.balance ?? 0;
    const generationCost = 10; // 每次生成消耗积分

    if (balance < generationCost) {
      return NextResponse.json(
        { success: false, error: '积分不足，请先充值' },
        { status: 402 }
      );
    }

    // 4. 调用 OpenAI 中转 API 生成图片
    const apiUrl = process.env.OPENAI_API_URL;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiUrl || !apiKey) {
      console.error('API 配置不完整');
      return NextResponse.json(
        { success: false, error: '服务配置错误' },
        { status: 500 }
      );
    }

    // 计算宽高比
    const aspectRatios: Record<string, { width: number; height: number }> = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1344, height: 756 },
      '9:16': { width: 756, height: 1344 },
      '4:3': { width: 1152, height: 864 },
      '3:4': { width: 864, height: 1152 },
    };
    const dimensions = aspectRatios[aspect_ratio] || aspectRatios['1:1'];

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model_id,
        prompt: prompt,
        n: 1,
        size: `${dimensions.width}x${dimensions.height}`,
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API 调用失败:', response.status, errorData);
      return NextResponse.json(
        { success: false, error: '生成失败，请稍后重试' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: '生成结果无效' },
        { status: 500 }
      );
    }

    // 5. 扣除积分并创建生成记录（原子操作）
    const { data: result, error: dbError } = await supabase.rpc('create_generation_atomic', {
      p_user_id: user.id,
      p_generation_type: 'image',
      p_model_id: model_id,
      p_prompt: prompt,
      p_image_url: imageUrl,
      p_cost: generationCost,
      p_cost_usd: 0.1,
    });

    if (dbError) {
      console.error('数据库操作失败:', dbError);
      return NextResponse.json(
        { success: false, error: '积分扣除失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      generation: {
        id: result,
        image_url: imageUrl,
        prompt: prompt,
        model_id: model_id,
        created_at: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('生成图片错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
