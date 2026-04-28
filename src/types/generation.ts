/**
 * 生成相关类型定义
 */

/** 生成记录状态枚举 */
export type GenerationStatus = 'pending' | 'completed' | 'failed';

/** 生成类型枚举 */
export type GenerationType = 'text_to_image' | 'image_to_image' | 'text_to_video' | 'image_to_video';

/** 图片比例枚举 */
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

/** 生成记录接口 */
export interface Generation {
  id: string;
  user_id: string;
  prompt: string;
  model_id: string;
  image_url: string | null;
  video_url: string | null;
  status: GenerationStatus;
  credits_used: number;
  generation_type: GenerationType;
  cost_usd: number;
  created_at: string;
}

/** 创建生成的输入参数 */
export interface CreateGenerationInput {
  prompt: string;
  model_id: string;
  generation_type: GenerationType;
  aspect_ratio?: AspectRatio;
}

/** 文生图 API 请求参数 */
export interface TextToImageRequest {
  prompt: string;
  model_id: string;
  aspect_ratio: AspectRatio;
}

/** 文生图 API 响应 */
export interface TextToImageResponse {
  success: boolean;
  generation?: {
    id: string;
    image_url: string;
    status: GenerationStatus;
  };
  error?: string;
}

/** 积分扣除 RPC 调用结果 */
export interface DeductCreditsResult {
  success: boolean;
  generation_id?: string;
  error?: string;
}
