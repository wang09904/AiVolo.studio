import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ensureUserProfile } from '@/lib/auth/profile'
import CreditHistory from '@/components/credits/CreditHistory'
import UserAvatar from '@/components/account/UserAvatar'
import GenerationHistory, { type GenerationHistoryRow } from '@/components/generation/GenerationHistory'
import SignOutButton from '@/components/auth/SignOutButton'
import MockAccountPage from '@/components/e2e/MockAccountPage'
import { isE2EMockMode } from '@/lib/e2e/mockGeneration'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type GenerationRow = {
  id: string
  prompt: string
  image_url: string | null
  storage_key?: string | null
  model_id: string
  credits_used: number
  created_at: string
}

function getSafeAvatarUrl(values: Array<unknown>): string | null {
  for (const value of values) {
    if (typeof value !== 'string') continue

    const url = value.trim()
    if (!url || ['null', 'undefined'].includes(url.toLowerCase())) continue
    if (url.startsWith('/') || url.startsWith('data:image/') || /^https?:\/\//.test(url)) return url
  }

  return null
}

async function getGenerationRows(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const query = (select: string) =>
    supabase
      .from('generations')
      .select(select)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(12)

  const withStorageKey = await query('id, prompt, image_url, storage_key, model_id, credits_used, created_at')

  if (!withStorageKey.error) {
    return withStorageKey
  }

  const message =
    'message' in withStorageKey.error && typeof withStorageKey.error.message === 'string'
      ? withStorageKey.error.message
      : ''

  if (!message.includes('storage_key')) {
    return withStorageKey
  }

  return query('id, prompt, image_url, model_id, credits_used, created_at')
}

export default async function AccountPage() {
  if (isE2EMockMode()) {
    return <MockAccountPage />
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { profile, error: profileError } = await ensureUserProfile(supabase, user)

  const { data: generations, error: generationsError } = await getGenerationRows(supabase, user.id)

  const displayName = profile?.name || user.user_metadata?.full_name || user.email || 'Creator'
  const avatar = getSafeAvatarUrl([profile?.avatar, user.user_metadata?.avatar_url, user.user_metadata?.picture])
  if (generationsError) {
    console.error('Account generation history failed:', generationsError)
  }

  const generationRows = ((generations || []) as unknown as GenerationRow[]).map<GenerationHistoryRow>((generation) => ({
    id: generation.id,
    prompt: generation.prompt,
    imageUrl: generation.image_url || '',
    storageKey: generation.storage_key || null,
    modelId: generation.model_id,
    creditsUsed: generation.credits_used,
    createdAt: generation.created_at,
  }))

  return (
    <main className="min-h-[100dvh] bg-brand-bg px-6 py-12 text-brand-text lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1400px]">

        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-cta">Account</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-brand-text">Your Workspace</h1>
          </div>
          <SignOutButton
            className="group flex items-center justify-center rounded-2xl border-2 border-brand-border bg-white px-6 py-3 text-sm font-bold text-brand-muted shadow-sm transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-bg hover:text-brand-text"
          />
        </div>

        {/* Dashboard Metrics - Bento Cards */}
        <section className="grid gap-6 md:grid-cols-3">

          <article className="flex flex-col gap-4 rounded-3xl border border-brand-border bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-5">
              <UserAvatar src={avatar} label={displayName} />
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-brand-text">{displayName}</h2>
                <p className="truncate text-sm font-medium text-brand-muted">{profile?.email || user.email}</p>
              </div>
            </div>
          </article>

          <article className="flex flex-col gap-2 rounded-3xl border border-brand-border bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-cta">Available Credits</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-5xl font-bold tracking-tight text-brand-text">
                {profileError ? '—' : profile?.credits_balance ?? 0}
              </p>
              <span className="text-lg font-bold text-brand-muted">CRD</span>
            </div>
            <p className="mt-2 text-sm font-medium text-brand-muted">
              {profileError ? 'Refresh after initialization.' : 'New users start with 20 credits.'}
            </p>
          </article>

          <article className="flex flex-col gap-2 rounded-3xl border border-brand-border bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-cta">Current Plan</p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-brand-text">Free Trial</p>
            <p className="mt-2 text-sm font-medium text-brand-muted">Paid subscriptions coming soon.</p>
          </article>
        </section>

        {/* Main Content Area */}
        <section className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">

          {/* History */}
          <div data-testid="account-generation-history" className="rounded-3xl border border-brand-border bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:p-10">
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-brand-border pb-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-brand-text">Generation History</h2>
              </div>
              <Link
                href="/create"
                className="rounded-2xl bg-brand-cta px-6 py-3 text-sm font-bold text-white shadow-md transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-cta/90"
              >
                Create New
              </Link>
            </div>

            <GenerationHistory
              serverRows={generationRows}
              errorMessage={
                generationsError
                  ? 'History unavailable. Please refresh after migrations.'
                  : null
              }
            />
          </div>

          {/* Credit Activity */}
          <aside className="rounded-3xl border border-brand-border bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:p-10">
            <h2 className="mb-8 border-b border-brand-border pb-6 text-3xl font-bold tracking-tight text-brand-text">Credit Ledger</h2>
            <div>
              <CreditHistory />
            </div>
          </aside>

        </section>
      </div>
    </main>
  )
}
