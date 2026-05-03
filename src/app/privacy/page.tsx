import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - AiVolo.studio',
  description: 'AiVolo.studio privacy policy',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-bg px-6 py-20 text-brand-text">
      <article className="mx-auto max-w-3xl space-y-12">
        <header className="border-b-2 border-brand-primary pb-8">
          <h1 className="font-heading text-5xl font-semibold text-white">Privacy Policy</h1>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-brand-cta">Last updated: April 28, 2026</p>
        </header>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">1. Information We Collect</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            We collect account information from Google OAuth, generation prompts and outputs, usage records, credit activity, basic device information, and cookies needed to keep you signed in.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">2. How We Use Information</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            We use information to provide the service, process generation requests, manage credits and account history, prevent abuse, improve product quality, and communicate important service updates.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">3. Storage and Retention</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            Generated results are retained based on account level: free users for 7 days, Lite members for 30 days, and Pro members for 1 year. We may delete expired or abusive content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">4. Sharing</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            We do not sell personal data. We may share data with service providers such as authentication, cloud storage, analytics, and payment partners when required to operate the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">5. Your Rights</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            Depending on your location, you may request access, correction, deletion, portability, or restriction of your personal data. Contact wang19904@gmail.com to make a request.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">6. Security</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            We use reasonable technical and organizational measures, including encrypted transport, access control, and provider-side security controls, to protect user data.
          </p>
        </section>
      </article>
    </main>
  );
}
