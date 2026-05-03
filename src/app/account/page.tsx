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
        <div className="mb-16 flex flex-col justify-between gap-8 border-b border-brand-border pb-10 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-medium tracking-widest uppercase text-brand-cta">Account</p>
            <h1 className="text-4xl font-light tracking-tighter md:text-5xl text-brand-text">Your Workspace</h1>
          </div>
          <SignOutButton
            className="group flex items-center justify-center border border-brand-border bg-transparent px-6 py-3 text-xs font-medium uppercase tracking-widest text-brand-muted transition-all duration-300 hover:border-brand-text hover:text-brand-text"
          />
        </div>

        {/* Dashboard Metrics - Strip away heavy cards, use subtle separation */}
        <section className="grid gap-8 md:grid-cols-3 md:divide-x md:divide-brand-border md:border-b md:border-brand-border md:pb-12">

          <article className="flex flex-col gap-4 md:pr-8">
            <div className="flex items-center gap-5">
              <UserAvatar src={avatar} label={displayName} />
              <div className="min-w-0">
                <h2 className="truncate text-lg font-medium text-brand-text">{displayName}</h2>
                <p className="truncate text-sm text-brand-muted">{profile?.email || user.email}</p>
              </div>
            </div>
          </article>

          <article className="flex flex-col gap-2 md:px-8">
            <p className="text-xs font-medium tracking-widest uppercase text-brand-muted">Available Credits</p>
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-5xl font-light text-brand-text">
                {profileError ? '—' : profile?.credits_balance ?? 0}
              </p>
              <span className="text-sm font-medium text-brand-cta">CRD</span>
            </div>
            <p className="text-xs text-brand-muted">
              {profileError ? 'Refresh after initialization.' : 'New users start with 20 credits.'}
            </p>
          </article>

          <article className="flex flex-col gap-2 md:pl-8">
            <p className="text-xs font-medium tracking-widest uppercase text-brand-muted">Current Plan</p>
            <p className="text-3xl font-light text-brand-text">Free Trial</p>
            <p className="text-xs text-brand-muted">Paid subscriptions coming soon.</p>
          </article>
        </section>

        {/* Main Content Area */}
        <section className="mt-16 grid gap-16 lg:grid-cols-[1fr_400px]">

          {/* History */}
          <div data-testid="account-generation-history">
            <div className="mb-10 flex items-end justify-between gap-4 border-b border-brand-border pb-4">
              <div>
                <h2 className="text-2xl font-light tracking-tight text-brand-text">Generation History</h2>
              </div>
              <Link
                href="/create"
                className="text-xs font-medium uppercase tracking-widest text-brand-cta transition-colors hover:text-blue-400"
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
          <aside>
            <h2 className="mb-10 border-b border-brand-border pb-4 text-2xl font-light tracking-tight text-brand-text">Credit Ledger</h2>
            <div className="rounded-sm border border-brand-border bg-brand-surface/10 p-6">
              <CreditHistory />
            </div>
          </aside>

        </section>
      </div>
    </main>
  )
}
