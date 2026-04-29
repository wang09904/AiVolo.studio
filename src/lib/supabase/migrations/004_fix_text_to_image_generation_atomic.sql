-- Keep the generation API, credit deduction, and history insert in one database transaction.
-- This migration is safe to run on existing projects and replaces older function signatures.

CREATE OR REPLACE FUNCTION create_generation_atomic(
  p_user_id UUID,
  p_generation_type TEXT,
  p_model_id TEXT,
  p_prompt TEXT,
  p_image_url TEXT,
  p_credits_to_deduct INTEGER,
  p_cost_usd DECIMAL DEFAULT 0
) RETURNS UUID AS $$
DECLARE
  v_generation_id UUID;
  v_current_balance INTEGER;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT u.credits_balance
  INTO v_current_balance
  FROM users u
  WHERE u.id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF v_current_balance < p_credits_to_deduct THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  UPDATE users AS target
  SET credits_balance = target.credits_balance - p_credits_to_deduct
  WHERE target.id = p_user_id;

  INSERT INTO credits_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_credits_to_deduct, 'debit', 'Generation: ' || p_generation_type);

  INSERT INTO generations (id, user_id, prompt, model_id, generation_type, image_url, credits_used, cost_usd, status)
  VALUES (gen_random_uuid(), p_user_id, p_prompt, p_model_id, p_generation_type, p_image_url, p_credits_to_deduct, p_cost_usd, 'completed')
  RETURNING id INTO v_generation_id;

  RETURN v_generation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION create_generation_atomic(UUID, TEXT, TEXT, TEXT, TEXT, INTEGER, DECIMAL) TO authenticated;
