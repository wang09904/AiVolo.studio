-- 积分系统数据库函数
-- 创建于 2026-04-28

-- 获取用户积分余额
CREATE OR REPLACE FUNCTION get_user_credits(p_user_id UUID)
RETURNS TABLE(credits BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(credits, 0)::BIGINT
  FROM users
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 扣除积分（原子操作，防止超扣）
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_amount BIGINT,
  p_description TEXT DEFAULT '消费'
)
RETURNS TABLE(success BOOLEAN, new_balance BIGINT, message TEXT) AS $$
DECLARE
  v_current_credits BIGINT;
  v_new_balance BIGINT;
BEGIN
  -- 获取当前积分
  SELECT credits INTO v_current_credits
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  -- 检查用户是否存在
  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, 0::BIGINT, '用户不存在'::TEXT;
    RETURN;
  END IF;

  -- 检查积分是否充足
  IF v_current_credits < p_amount THEN
    RETURN QUERY SELECT FALSE, v_current_credits, '积分不足'::TEXT;
    RETURN;
  END IF;

  -- 扣除积分
  v_new_balance := v_current_credits - p_amount;
  UPDATE users SET credits = v_new_balance WHERE id = p_user_id;

  -- 记录流水
  INSERT INTO credits_transactions (user_id, type, amount, description)
  VALUES (p_user_id, 'deduct', p_amount, p_description);

  RETURN QUERY SELECT TRUE, v_new_balance, '扣除成功'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 增加积分
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount BIGINT,
  p_type TEXT DEFAULT 'reward',
  p_description TEXT DEFAULT ''
)
RETURNS TABLE(success BOOLEAN, new_balance BIGINT, message TEXT) AS $$
DECLARE
  v_current_credits BIGINT;
  v_new_balance BIGINT;
BEGIN
  -- 获取当前积分
  SELECT credits INTO v_current_credits
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  -- 检查用户是否存在
  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, 0::BIGINT, '用户不存在'::TEXT;
    RETURN;
  END IF;

  -- 增加积分
  v_new_balance := v_current_credits + p_amount;
  UPDATE users SET credits = v_new_balance WHERE id = p_user_id;

  -- 记录流水
  INSERT INTO credits_transactions (user_id, type, amount, description)
  VALUES (p_user_id, p_type, p_amount, COALESCE(p_description, ''));

  RETURN QUERY SELECT TRUE, v_new_balance, '增加成功'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取积分流水
CREATE OR REPLACE FUNCTION get_credits_history(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  type TEXT,
  amount BIGINT,
  description TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ct.id,
    ct.type,
    ct.amount,
    ct.description,
    ct.created_at
  FROM credits_transactions ct
  WHERE ct.user_id = p_user_id
  ORDER BY ct.created_at DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 授予新用户初始积分（20积分）
CREATE OR REPLACE FUNCTION grant_initial_credits(p_user_id UUID)
RETURNS TABLE(success BOOLEAN, new_balance BIGINT, message TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM add_credits(p_user_id, 20, 'reward', '新用户注册奖励');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;