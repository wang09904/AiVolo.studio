-- Fix OAuth profile initialization for existing Supabase projects.
-- The previous function could fail with an ambiguous credits_balance reference
-- because RETURNS TABLE exposes credits_balance as a PL/pgSQL variable.

CREATE OR REPLACE FUNCTION ensure_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_avatar TEXT DEFAULT NULL
)
RETURNS TABLE(
  email TEXT,
  name TEXT,
  avatar TEXT,
  credits_balance INTEGER,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  v_transaction_count BIGINT;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO users AS target (id, email, name, avatar, credits_balance)
  VALUES (p_user_id, COALESCE(p_email, p_user_id::TEXT || '@aivolo.local'), p_name, p_avatar, 20)
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, target.email),
    name = COALESCE(EXCLUDED.name, target.name),
    avatar = COALESCE(EXCLUDED.avatar, target.avatar);

  SELECT COUNT(*) INTO v_transaction_count
  FROM credits_transactions ct
  WHERE ct.user_id = p_user_id;

  IF v_transaction_count = 0 THEN
    UPDATE users AS target
    SET credits_balance = GREATEST(target.credits_balance, 20)
    WHERE target.id = p_user_id;

    INSERT INTO credits_transactions (user_id, amount, type, description)
    VALUES (p_user_id, 20, 'credit', 'New user free credits');
  END IF;

  RETURN QUERY
  SELECT u.email, u.name, u.avatar, u.credits_balance, u.created_at
  FROM users u
  WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION ensure_user_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;
