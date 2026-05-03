import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - AiVolo.studio',
  description: 'AiVolo.studio terms of service',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-bg px-6 py-20 text-brand-text">
      <article className="mx-auto max-w-3xl space-y-12">
        <header className="border-b-2 border-brand-primary pb-8">
          <h1 className="font-heading text-5xl font-semibold text-white">Terms of Service</h1>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-brand-cta">Last updated: April 28, 2026</p>
        </header>

        {[
          ['1. Service Overview', 'AiVolo.studio provides AI image and video generation tools. By using the service, you agree to follow these terms and any policies referenced here.'],
          ['2. Account Registration', 'You may sign in with Google OAuth. You are responsible for activity under your account and should notify us if you believe your account has been accessed without permission.'],
          ['3. Acceptable Use', 'You may not use AiVolo.studio to create unlawful, infringing, deceptive, abusive, exploitative, or harmful content. You are responsible for your prompts and for how generated outputs are used.'],
          ['4. Generated Content', 'You retain rights you may have in your inputs and generated outputs, subject to applicable law and third-party rights. You must make sure your use of generated content is lawful.'],
          ['5. Credits and Subscriptions', 'Credits are used to access generation features and have no cash value. Paid subscription checkout is not active until subscriptions officially open.'],
          ['6. Service Availability', 'We work to keep the service reliable, but availability may vary due to maintenance, provider limits, network issues, or third-party outages.'],
          ['7. Disclaimers', 'The service is provided as is. We do not guarantee that every output will meet your expectations, be error-free, or be suitable for a specific commercial use.'],
          ['8. Changes to These Terms', 'We may update these terms from time to time. Continued use of the service after changes are posted means you accept the updated terms.'],
          ['9. Contact', 'Questions about these terms can be sent to wang19904@gmail.com.'],
        ].map(([title, body]) => (
          <section key={title} className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">{title}</h2>
            <p className="text-lg leading-relaxed text-slate-400">{body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}
