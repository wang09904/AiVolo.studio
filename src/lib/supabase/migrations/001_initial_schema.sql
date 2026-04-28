-- AiVolo.studio 数据库初始化迁移
-- 版本：v1.0
-- 日期：2026-04-28

-- ============================================
-- 用户表
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  credits_balance INTEGER DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 订阅表
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('lite', 'pro')),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 积分流水表
-- ============================================
CREATE TABLE credits_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 生成记录表
-- ============================================
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  model_id TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  credits_used INTEGER DEFAULT 0,
  generation_type TEXT NOT NULL CHECK (generation_type IN ('text_to_image', 'image_to_image', 'text_to_video', 'image_to_video')),
  cost_usd DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 模型配置表
-- ============================================
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  api_format TEXT DEFAULT 'openai',
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 模板表
-- ============================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hot', 'ecommerce', 'interior')),
  prompt_template TEXT NOT NULL,
  aspect_ratios TEXT,
  example_image_url TEXT,
  example_video_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 智能缓存表
-- ============================================
CREATE TABLE generations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  final_prompt TEXT NOT NULL,
  model_id TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  similarity_score DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '3 months'
);

-- ============================================
-- Webhook 日志表
-- ============================================
CREATE TABLE webhooks_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 原子操作 RPC：创建生成任务并扣积分
-- ============================================
CREATE OR REPLACE FUNCTION create_generation_atomic(
  p_user_id UUID,
  p_prompt TEXT,
  p_model_id TEXT,
  p_generation_type TEXT,
  p_credits_to_deduct INTEGER
) RETURNS UUID AS $$
DECLARE
  v_generation_id UUID;
  v_current_balance INTEGER;
BEGIN
  -- 获取当前余额
  SELECT credits_balance INTO v_current_balance FROM users WHERE id = p_user_id FOR UPDATE;

  -- 检查余额是否充足
  IF v_current_balance < p_credits_to_deduct THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- 扣减积分
  UPDATE users SET credits_balance = credits_balance - p_credits_to_deduct WHERE id = p_user_id;

  -- 记录积分流水
  INSERT INTO credits_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_credits_to_deduct, 'debit', 'Generation: ' || p_generation_type);

  -- 创建生成记录
  INSERT INTO generations (id, user_id, prompt, model_id, generation_type, credits_used, status)
  VALUES (gen_random_uuid(), p_user_id, p_prompt, p_model_id, p_generation_type, p_credits_to_deduct, 'pending')
  RETURNING id INTO v_generation_id;

  RETURN v_generation_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 索引
-- ============================================
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created_at ON generations(created_at);
CREATE INDEX idx_credits_transactions_user_id ON credits_transactions(user_id);
CREATE INDEX idx_generations_cache_final_prompt ON generations_cache(final_prompt);
CREATE INDEX idx_generations_cache_expires_at ON generations_cache(expires_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_webhooks_log_event_id ON webhooks_log(event_id);

-- ============================================
-- RLS 策略
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks_log ENABLE ROW LEVEL SECURITY;

-- users 策略：用户只能查看和更新自己的数据
CREATE POLICY "users_self_select" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_self_update" ON users FOR UPDATE USING (auth.uid() = id);

-- subscriptions 策略：用户只能操作自己的订阅
CREATE POLICY "subscriptions_self_all" ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- credits_transactions 策略：用户只能查看自己的积分流水
CREATE POLICY "credits_transactions_self_all" ON credits_transactions FOR ALL USING (auth.uid() = user_id);

-- generations 策略：用户只能操作自己的生成记录
CREATE POLICY "generations_self_all" ON generations FOR ALL USING (auth.uid() = user_id);

-- models 策略：所有已激活模型可被所有用户查看
CREATE POLICY "models_active_read" ON models FOR SELECT USING (is_active = true);

-- templates 策略：所有已激活模板可被所有用户查看
CREATE POLICY "templates_active_read" ON templates FOR SELECT USING (is_active = true);

-- generations_cache 策略：缓存数据可被所有用户读取（用于快速返回）
CREATE POLICY "generations_cache_read" ON generations_cache FOR SELECT USING (expires_at > NOW());

-- webhooks_log 策略：只有服务端可以插入日志
CREATE POLICY "webhooks_log_insert" ON webhooks_log FOR INSERT WITH CHECK (true);

-- ============================================
-- 初始数据
-- ============================================
-- 插入默认模型
INSERT INTO models (name, provider, type, api_format, logo_url, is_active) VALUES
  ('GPT Image 1', 'OpenAI', 'image', 'openai', '/models/gpt-image.svg', true),
  ('DALL-E 3', 'OpenAI', 'image', 'openai', '/models/dalle.svg', true),
  ('Stable Diffusion 3', 'Stability AI', 'image', 'openai', '/models/sd3.svg', true),
  ('Flux Pro', 'Black Forest Labs', 'image', 'openai', '/models/flux.svg', true),
  ('Sora', 'OpenAI', 'video', 'openai', '/models/sora.svg', true),
  ('Runway Gen-3', 'Runway', 'video', 'openai', '/models/runway.svg', true),
  ('Kling', 'Kuaishou', 'video', 'openai', '/models/kling.svg', true);

-- 插入示例模板
INSERT INTO templates (name, category, prompt_template, aspect_ratios, example_image_url) VALUES
  ('流行风格', 'hot', 'Create a trendy viral image with the following prompt: {prompt}. Style: modern, eye-catching, TikTok-worthy.', '1:1, 16:9, 9:16', '/templates/hot_01.jpg'),
  ('电商主图', 'ecommerce', 'Professional e-commerce product shot: {prompt}. Clean background, studio lighting, commercial quality.', '1:1, 4:3', '/templates/ecom_01.jpg'),
  ('室内设计', 'interior', 'Interior design render: {prompt}. Realistic, modern, photorealistic quality.', '16:9, 4:3', '/templates/interior_01.jpg');
