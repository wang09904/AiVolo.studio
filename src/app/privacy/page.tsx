import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - AiVolo.studio',
  description: 'AiVolo.studio privacy policy',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[oklch(13%_0.016_270)] px-6 py-14 text-[oklch(94%_0.01_270)]">
      <article className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-4xl font-semibold tracking-normal">Privacy Policy</h1>
          <p className="mt-3 text-sm text-[oklch(66%_0.016_270)]">Last updated: April 28, 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            We collect account information from Google OAuth, generation prompts and outputs, usage records, credit activity, basic device information, and cookies needed to keep you signed in.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. How We Use Information</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            We use information to provide the service, process generation requests, manage credits and account history, prevent abuse, improve product quality, and communicate important service updates.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Storage and Retention</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            Generated results are retained based on account level: free users for 7 days, Lite members for 30 days, and Pro members for 1 year. We may delete expired or abusive content.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Sharing</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            We do not sell personal data. We may share data with service providers such as authentication, cloud storage, analytics, and payment partners when required to operate the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Your Rights</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            Depending on your location, you may request access, correction, deletion, portability, or restriction of your personal data. Contact privacy@aivolo.studio to make a request.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Security</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            We use reasonable technical and organizational measures, including encrypted transport, access control, and provider-side security controls, to protect user data.
          </p>
        </section>
      </article>
    </main>
  );
}
