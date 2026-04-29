import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ensureUserProfile } from '@/lib/auth/profile'
import CreditHistory from '@/components/credits/CreditHistory'
import SignOutButton from '@/components/auth/SignOutButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type GenerationRow = {
  id: string
  prompt: string
  image_url: string | null
  model_id: string
  credits_used: number
  created_at: string
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { profile, error: profileError } = await ensureUserProfile(supabase, user)

  const [{ data: generations, error: generationsError }] = await Promise.all([
    supabase
      .from('generations')
      .select('id, prompt, image_url, model_id, credits_used, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  const displayName = profile?.name || user.user_metadata?.full_name || user.email || 'Creator'
  const avatar = profile?.avatar || user.user_metadata?.avatar_url || user.user_metadata?.picture
  if (generationsError) {
    console.error('Account generation history failed:', generationsError)
  }

  const generationRows = (generations || []) as GenerationRow[]

  return (
    <main className="min-h-screen bg-[oklch(13%_0.016_270)] px-6 py-12 text-[oklch(96%_0.01_270)] lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[oklch(72%_0.18_270)]">Account</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">Your workspace</h1>
          </div>
          <SignOutButton
            className="w-max rounded-md border border-[oklch(35%_0.02_270)] px-4 py-3 text-sm font-semibold text-[oklch(88%_0.012_270)]"
          />
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
            <div className="flex items-center gap-4">
              {avatar ? (
                <img src={avatar} alt="" className="h-14 w-14 rounded-md object-cover" />
              ) : (
                <div className="grid h-14 w-14 place-items-center rounded-md bg-[oklch(72%_0.18_270)] text-xl font-semibold text-[oklch(16%_0.03_270)]">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{displayName}</h2>
                <p className="truncate text-sm text-[oklch(68%_0.018_270)]">{profile?.email || user.email}</p>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
            <p className="text-sm text-[oklch(68%_0.018_270)]">Credits</p>
            <p className="mt-3 text-4xl font-semibold">
              {profileError ? 'Unavailable' : profile?.credits_balance ?? 0}
            </p>
            <p className="mt-2 text-sm text-[oklch(68%_0.018_270)]">
              {profileError ? 'Refresh after your credits finish initializing.' : 'New users start with 20 credits.'}
            </p>
          </article>

          <article className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
            <p className="text-sm text-[oklch(68%_0.018_270)]">Subscription</p>
            <p className="mt-3 text-2xl font-semibold">Free</p>
            <p className="mt-2 text-sm text-[oklch(68%_0.018_270)]">Paid subscriptions are coming soon.</p>
          </article>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Generation history</h2>
                <p className="mt-1 text-sm text-[oklch(68%_0.018_270)]">Recent text-to-image results.</p>
              </div>
              <Link
                href="/create"
                className="rounded-md bg-[oklch(72%_0.18_270)] px-4 py-3 text-sm font-semibold text-[oklch(16%_0.03_270)]"
              >
                Create
              </Link>
            </div>

            {generationRows.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {generationRows.map((generation) => (
                  <article
                    key={generation.id}
                    className="overflow-hidden rounded-lg border border-[oklch(29%_0.018_270)] bg-[oklch(12%_0.014_270)]"
                  >
                    {generation.image_url ? (
                      <img src={generation.image_url} alt="" className="aspect-video w-full object-cover" />
                    ) : (
                      <div className="grid aspect-video place-items-center bg-[oklch(18%_0.014_270)] text-sm text-[oklch(62%_0.016_270)]">
                        No preview
                      </div>
                    )}
                    <div className="p-4">
                      <p className="line-clamp-2 text-sm leading-6 text-[oklch(82%_0.018_270)]">
                        {generation.prompt}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[oklch(62%_0.016_270)]">
                        <span>{generation.model_id}</span>
                        <span>{generation.credits_used} credits</span>
                      </div>
                      {generation.image_url && (
                        <a
                          href={`/api/download/generation/${generation.id}`}
                          download={`aivolo-${generation.id}.png`}
                          className="mt-4 block rounded-md border border-[oklch(35%_0.02_270)] px-3 py-2 text-center text-sm font-semibold text-[oklch(88%_0.012_270)]"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : generationsError ? (
              <div className="rounded-md border border-[oklch(42%_0.08_25)] bg-[oklch(20%_0.04_25)] p-5 text-sm text-[oklch(82%_0.09_25)]">
                Generation history is unavailable. Please refresh after the database migration is applied.
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-[oklch(34%_0.02_270)] p-10 text-center">
                <p className="text-lg font-semibold">No generations yet</p>
                <p className="mt-2 text-sm text-[oklch(68%_0.018_270)]">Create your first image to see it here.</p>
              </div>
            )}
          </div>

          <aside className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
            <h2 className="mb-5 text-xl font-semibold">Credit activity</h2>
            <CreditHistory />
          </aside>
        </section>
      </div>
    </main>
  )
}
