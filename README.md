# AiVolo.studio Development Status

Last updated: 2026-04-29

## Current Stage

AiVolo.studio is in the first usable MVP implementation stage. The app currently covers Google login, free credits, text-to-image generation, account workspace, pricing display, legal pages, Supabase-backed credit records, and Cloudflare R2 media storage.

## Completed Work

- Reworked authentication flow so visitors can browse `/create`, and Google login is required only when generation starts.
- Fixed logout state refresh so signed-out users immediately see the logged-out UI.
- Added user profile initialization with 20 free credits for new Google users.
- Reworked pricing into monthly/yearly tabs with same-tier benefit parity and yearly discount presentation.
- Rebuilt the homepage and create page around the current text-to-image MVP.
- Added English legal/contact pages and English footer legal labels.
- Integrated image generation through the configured OpenAI-compatible provider.
- Added R2 upload for generated images.
- Added reservation-based generation pipeline design:
  - `create_generation_pending_atomic`: reserve credits and create a pending generation.
  - `complete_generation_atomic`: mark successful generation completed.
  - `fail_generation_refund_atomic`: mark failed generation and refund reserved credits.
- Added Supabase migrations `003` through `006` for profile initialization, credit/generation RPC fixes, constraints, and reservation pipeline.

## Current Known Issues

These two issues are still unresolved after the latest local code changes and user retest:

1. Image download still fails.
   Browser reports it cannot extract/download the image from the site. The intended behavior is direct browser download, not opening the image in a new tab. Current implementation uses `/api/download/generation/[id]` with `Content-Disposition: attachment`, but the user retest still fails.

2. Account generation history still shows no records.
   The user generated two images successfully, but `/account` still shows no generation history. Possible causes include Supabase migration `006` not fully applied, old RPC still active, rows not written to `public.generations`, RLS/select mismatch, or the running dev server still serving older code.

## Next Debugging Checklist

1. Confirm Supabase has the latest `006_generation_reservation_pipeline.sql` applied.
2. In Supabase SQL Editor, inspect `public.generations` columns:
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name = 'generations'
   ORDER BY ordinal_position;
   ```
3. Check whether generation rows exist for the current user:
   ```sql
   SELECT id, user_id, prompt, image_url, storage_key, status, credits_used, created_at
   FROM public.generations
   ORDER BY created_at DESC
   LIMIT 10;
   ```
4. Verify current RPC signatures exist:
   ```sql
   SELECT routine_name
   FROM information_schema.routines
   WHERE routine_schema = 'public'
     AND routine_name IN (
       'create_generation_pending_atomic',
       'complete_generation_atomic',
       'fail_generation_refund_atomic'
     );
   ```
5. Generate one new image after migration `006`, then inspect the API response from `/api/generate/image` and the matching row in `public.generations`.
6. Test `/api/download/generation/<generation_id>` directly while logged in and inspect its HTTP status and response headers.

## Verification Commands

Local validation currently passes:

```bash
npm run build
npx tsc --noEmit
```

Manual start command:

```bash
cd "/Users/wangyong/Documents/项目/AiVolo.studio"
npm run dev
```

## Important Notes

- The user confirmed credits now initialize correctly at 20 credits.
- The user confirmed image generation can succeed.
- The unresolved problems are now limited to generated image download and account history persistence/display.
- Treat `SPEC.md`, `DEVELOPMENT_PLAN.md`, `CLAUDE.md`, and this `README.md` as the current task-status sources when resuming work.
