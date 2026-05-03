-- Fix generation persistence for Phase 1 text-to-image.
-- Symptoms:
-- 1. create/complete generation API returned success.
-- 2. The same authenticated user could not read the generation row afterward.
-- 3. Direct authenticated insert failed with RLS.

-- ============================================
-- generations RLS policies
-- ============================================

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "generations_self_all" ON public.generations;
DROP POLICY IF EXISTS "generations_self_select" ON public.generations;
DROP POLICY IF EXISTS "generations_self_insert" ON public.generations;
DROP POLICY IF EXISTS "generations_self_update" ON public.generations;

CREATE POLICY "generations_self_select"
ON public.generations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "generations_self_insert"
ON public.generations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "generations_self_update"
ON public.generations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- generation reservation and completion RPCs
-- ============================================

CREATE OR REPLACE FUNCTION public.create_generation_pending_atomic(
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
  FROM public.users u
  WHERE u.id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF v_current_balance < p_credits_to_reserve THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  UPDATE public.users AS target
  SET credits_balance = target.credits_balance - p_credits_to_reserve
  WHERE target.id = p_user_id;

  INSERT INTO public.credits_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_credits_to_reserve, 'debit', 'Reserved credits: ' || p_generation_type);

  INSERT INTO public.generations (
    id,
    user_id,
    prompt,
    model_id,
    generation_type,
    status,
    credits_used,
    cost_usd
  )
  VALUES (
    gen_random_uuid(),
    p_user_id,
    p_prompt,
    p_model_id,
    p_generation_type,
    'pending',
    p_credits_to_reserve,
    p_cost_usd
  )
  RETURNING id INTO v_generation_id;

  RETURN v_generation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.complete_generation_atomic(
  p_user_id UUID,
  p_generation_id UUID,
  p_image_url TEXT,
  p_storage_key TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.generations AS target
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

CREATE OR REPLACE FUNCTION public.fail_generation_refund_atomic(
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
  FROM public.generations g
  WHERE g.id = p_generation_id
    AND g.user_id = p_user_id
    AND g.status = 'pending'
  FOR UPDATE;

  IF v_credits_used IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE public.generations AS target
  SET status = 'failed'
  WHERE target.id = p_generation_id
    AND target.user_id = p_user_id
    AND target.status = 'pending';

  UPDATE public.users AS target
  SET credits_balance = target.credits_balance + v_credits_used
  WHERE target.id = p_user_id;

  INSERT INTO public.credits_transactions (user_id, amount, type, description)
  VALUES (p_user_id, v_credits_used, 'credit', 'Refunded credits: ' || p_reason);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.create_generation_pending_atomic(UUID, TEXT, TEXT, TEXT, INTEGER, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_generation_atomic(UUID, UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fail_generation_refund_atomic(UUID, UUID, TEXT) TO authenticated;
