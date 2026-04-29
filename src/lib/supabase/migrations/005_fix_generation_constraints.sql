-- Repair constraints from early local schemas so the current generation API can write history.
-- Safe to run after 004. It keeps old generation_type values readable while allowing the current SPEC values.

ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cost_usd DECIMAL(10, 4) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';

ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS generation_type TEXT;

UPDATE public.generations
SET generation_type = COALESCE(generation_type, 'text_to_image')
WHERE generation_type IS NULL;

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
      AND pg_get_constraintdef(con.oid) ILIKE '%generation_type%'
  LOOP
    EXECUTE format('ALTER TABLE public.generations DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE public.generations
  DROP CONSTRAINT IF EXISTS generations_generation_type_check;

ALTER TABLE public.generations
  ADD CONSTRAINT generations_generation_type_check
  CHECK (generation_type IN ('image', 'video', 'text_to_image', 'image_to_image', 'text_to_video', 'image_to_video'));

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
  DROP CONSTRAINT IF EXISTS credits_transactions_type_check;

ALTER TABLE public.credits_transactions
  ADD CONSTRAINT credits_transactions_type_check
  CHECK (type IN ('credit', 'debit', 'reward', 'deduct', 'purchase', 'consume'));
