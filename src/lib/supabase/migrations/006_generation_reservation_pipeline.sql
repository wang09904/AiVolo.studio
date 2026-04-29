-- Reservation-based generation pipeline:
-- 1. reserve credits and create a pending generation
-- 2. complete the generation after provider success
-- 3. mark failed and refund reserved credits after provider/storage failure

ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cost_usd DECIMAL(10, 4) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS generation_type TEXT,
  ADD COLUMN IF NOT EXISTS storage_key TEXT;

UPDATE public.generations
SET generation_type = COALESCE(generation_type, 'text_to_image'),
    status = COALESCE(status, 'completed'),
    credits_used = COALESCE(credits_used, 0),
    cost_usd = COALESCE(cost_usd, 0)
WHERE generation_type IS NULL
   OR status IS NULL
   OR credits_used IS NULL
   OR cost_usd IS NULL;

UPDATE public.generations
SET generation_type = 'text_to_image'
WHERE generation_type NOT IN ('image', 'video', 'text_to_image', 'image_to_image', 'text_to_video', 'image_to_video');

UPDATE public.generations
SET status = CASE
  WHEN status IN ('pending', 'completed', 'failed') THEN status
  WHEN status IN ('success', 'succeeded', 'complete') THEN 'completed'
  WHEN status IN ('error', 'cancelled', 'canceled') THEN 'failed'
  ELSE 'completed'
END;

DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'generations'
      AND con.contype = 'c'
      AND (
        pg_get_constraintdef(con.oid) ILIKE '%generation_type%'
        OR pg_get_constraintdef(con.oid) ILIKE '%status%'
      )
  LOOP
    EXECUTE format('ALTER TABLE public.generations DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE public.generations
  ADD CONSTRAINT generations_generation_type_check
  CHECK (generation_type IN ('image', 'video', 'text_to_image', 'image_to_image', 'text_to_video', 'image_to_video'));

ALTER TABLE public.generations
  ADD CONSTRAINT generations_status_check
  CHECK (status IN ('pending', 'completed', 'failed'));

DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'credits_transactions'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%type%'
  LOOP
    EXECUTE format('ALTER TABLE public.credits_transactions DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE public.credits_transactions
  ADD CONSTRAINT credits_transactions_type_check
  CHECK (type IN ('credit', 'debit', 'reward', 'deduct', 'purchase', 'consume'));

CREATE OR REPLACE FUNCTION create_generation_pending_atomic(
  p_user_id UUID,
  p_generation_type TEXT,
  p_model_id TEXT,
  p_prompt TEXT,
  p_credits_to_reserve INTEGER,
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

  IF v_current_balance < p_credits_to_reserve THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  UPDATE users AS target
  SET credits_balance = target.credits_balance - p_credits_to_reserve
  WHERE target.id = p_user_id;

  INSERT INTO credits_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_credits_to_reserve, 'debit', 'Reserved credits: ' || p_generation_type);

  INSERT INTO generations (id, user_id, prompt, model_id, generation_type, status, credits_used, cost_usd)
  VALUES (gen_random_uuid(), p_user_id, p_prompt, p_model_id, p_generation_type, 'pending', p_credits_to_reserve, p_cost_usd)
  RETURNING id INTO v_generation_id;

  RETURN v_generation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION complete_generation_atomic(
  p_user_id UUID,
  p_generation_id UUID,
  p_image_url TEXT,
  p_storage_key TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE generations AS target
  SET status = 'completed',
      image_url = p_image_url,
      storage_key = p_storage_key
  WHERE target.id = p_generation_id
    AND target.user_id = p_user_id
    AND target.status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending generation not found';
  END IF;

  RETURN p_generation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION fail_generation_refund_atomic(
  p_user_id UUID,
  p_generation_id UUID,
  p_reason TEXT DEFAULT 'Generation failed'
) RETURNS BOOLEAN AS $$
DECLARE
  v_credits_used INTEGER;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT g.credits_used
  INTO v_credits_used
  FROM generations g
  WHERE g.id = p_generation_id
    AND g.user_id = p_user_id
    AND g.status = 'pending'
  FOR UPDATE;

  IF v_credits_used IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE generations AS target
  SET status = 'failed'
  WHERE target.id = p_generation_id
    AND target.user_id = p_user_id
    AND target.status = 'pending';

  UPDATE users AS target
  SET credits_balance = target.credits_balance + v_credits_used
  WHERE target.id = p_user_id;

  INSERT INTO credits_transactions (user_id, amount, type, description)
  VALUES (p_user_id, v_credits_used, 'credit', 'Refund: ' || COALESCE(p_reason, 'Generation failed'));

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION create_generation_pending_atomic(UUID, TEXT, TEXT, TEXT, INTEGER, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_generation_atomic(UUID, UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION fail_generation_refund_atomic(UUID, UUID, TEXT) TO authenticated;
