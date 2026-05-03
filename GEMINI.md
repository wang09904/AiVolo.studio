# AiVolo.studio / Gemini Root Rules

This file serves as the foundational mandate for Gemini CLI interactions within the **AiVolo.studio** workspace. Instructions herein take absolute precedence over general defaults.

## 1. Project Overview
**AiVolo.studio** is an AI-powered image and video entertainment creation platform focused on the global market.
- **Tech Stack**: Next.js 15, React 19, Tailwind CSS, Supabase, Cloudflare R2.
- **Design System**: "Vibrant & Block-based" style with "Cinema Dark + Play Red" palette.

## 2. Source of Truth & Priorities
1. **Product Spec**: [docs/development/SPEC_V2.md](./docs/development/SPEC_V2.md)
2. **Dev Plan**: [docs/development/DEVELOPMENT_PLAN_V2.md](./docs/development/DEVELOPMENT_PLAN_V2.md)
3. **Design System**: [design-system/MASTER.md](./design-system/MASTER.md)
4. **Current Status**: [README.md](./README.md)
*Note: Any conflict between docs, code, or verbal instructions is resolved by the latest `V2` documents.*

## 3. Project Structure
| Path | Purpose |
| --- | --- |
| `src/app/` | Next.js App Router pages and API routes |
| `src/components/` | Product and UI components |
| `src/lib/` | Supabase, R2, product config, and server utilities |
| `src/hooks/` | React hooks |
| `src/types/` | TypeScript types |
| `docs/development/` | Current product spec, dev plan, and production protection docs |
| `docs/archive/` | Deprecated historical docs; use only when explicitly requested |
| `docs/research/` | Research material |
| `references/` | Reference implementations and examples, not runtime code |
| `design-system/` | Design system documentation |
| `scripts/` | Local verification, production guard, and helper scripts |
| `tests/e2e/` | Playwright E2E tests |
| `.env.local` | Local private environment variables; never commit |
| `.next/`, `node_modules/`, `test-results/`, `playwright-report/` | Generated output or dependencies; do not edit manually |

## 4. Communication & Documentation
- **Language**: All responses, explanations, and documentation (unless they are user-facing UI copy) MUST be in **Chinese**.
- **Style**: Concise, factual, and actionable. Avoid conversational filler.
- **Updates**: Provide a brief progress summary before starting complex work and keep the user updated during long tasks.
- **Honesty**: If a task is not finished or failed, state it clearly. Do not imply completion.

## 5. Workflow Principles
- **Analyze First**: Understand the code and confirm the scope before making any modifications.
- **Surgical Changes**: Only modify what is necessary for the current task. Do not refactor unrelated code or rewrite files without explicit instruction.
- **Speculation**: Do not include unconfirmed speculation in code or docs.
- **Security & Integrity**: Prioritize atomic operations, explicit error handling, and traceable records for auth, credits, and database operations.

## 6. Engineering & Code Quality
- **Building & Running**:
  - Agent Guard: `npm run guard:agent`
  - Release Guard: `npm run guard:release`
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Lint: `npm run lint`
  - Typecheck: `npx tsc --noEmit`
  - Local Verify: `npm run verify:local`
  - Full Verify: `npm run verify:full`
- **Validation**: Every code change MUST be verified with `npm run lint` and `npx tsc --noEmit`. UI changes require visual confirmation.
- **Tech Habits**: Maintain the existing tech stack, naming conventions, and directory structure. Use semantic brand classes from `tailwind.config.ts`.
- **UI Copy**: User-facing text (buttons, labels, messages) must remain in **English** for Phase 1.

## 7. Tooling & Git
- **Tool Preference**: Use search and grep tools for analysis. Read only the minimum necessary content.
- **Git**: Proposed commit messages must focus on "why" (the rationale) more than "what" (the change). Always check `git diff` before committing.
- **Safety**: No destructive operations (reset, delete folders, force overwrite) unless explicitly requested.

## 8. Production Protection & Branch Policy
- `main` is the production-stable branch. Pushing it can affect `https://aivolo.studio`.
- Do not do normal development work directly on `main`; run `npm run guard:agent` before starting code or documentation work.
- If the guard blocks the task, create a `feature/*`, `fix/*`, or `hotfix/*` branch from `main`.
- Only release, merge-to-main, or hotfix tasks explicitly requested by the user may operate on `main`.
- Development branches should be pushed only for Vercel Preview. Merge or push to `main` only after Preview acceptance.
- Before pushing `main`, run `npm run guard:release`, `npm run verify:full`, and `git diff --check`, then check for secrets, temporary diagnostics, and mock env vars.
- Production must not configure `AIVOLO_E2E_MOCKS` or `NEXT_PUBLIC_AIVOLO_E2E_MOCKS`.
- Supabase production database, R2 production bucket, and Vercel Production env vars are production resources; explain impact and get user confirmation before changing them.
- Details: [docs/development/PRODUCTION_PROTECTION.md](./docs/development/PRODUCTION_PROTECTION.md).

## 9. Current Project Phase
- **MVP Stage**: Finalizing text-to-image loop and account history.
- **Key Focus**: Solving image download failures and ensuring generation history persistence.
