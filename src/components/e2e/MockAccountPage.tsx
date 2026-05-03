'use client';

import Link from 'next/link';
import GenerationHistory from '@/components/generation/GenerationHistory';

export default function MockAccountPage() {
  return (
    <main
      data-testid="e2e-account-page"
      className="min-h-screen bg-[oklch(13%_0.016_270)] px-6 py-12 text-[oklch(96%_0.01_270)] lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[oklch(72%_0.18_270)]">Account</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">Your workspace</h1>
          </div>
          <Link
            href="/create"
            className="w-max rounded-md bg-[oklch(72%_0.18_270)] px-4 py-3 text-sm font-semibold text-[oklch(16%_0.03_270)]"
          >
            Create
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
            <p className="text-sm text-[oklch(68%_0.018_270)]">Creator</p>
            <p className="mt-3 text-2xl font-semibold">E2E test user</p>
          </article>

          <article className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
            <p className="text-sm text-[oklch(68%_0.018_270)]">Credits</p>
            <p className="mt-3 text-4xl font-semibold">20</p>
          </article>

          <article className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
            <p className="text-sm text-[oklch(68%_0.018_270)]">Subscription</p>
            <p className="mt-3 text-2xl font-semibold">Free</p>
          </article>
        </section>

        <section
          data-testid="e2e-account-history"
          className="mt-8 rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Generation history</h2>
              <p className="mt-1 text-sm text-[oklch(68%_0.018_270)]">Recent text-to-image results.</p>
            </div>
          </div>

          <GenerationHistory />
        </section>
      </div>
    </main>
  );
}
