export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-bg px-6 py-20 text-brand-text">
      <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-cta">Contact</p>
          <h1 className="mt-4 font-heading text-5xl font-semibold tracking-tight text-white">Talk to AiVolo<span className="text-brand-cta">.</span>studio</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            For support, refunds, or partnerships, email us and include your Google account email.
          </p>

          <div className="mt-10 space-y-6 rounded-2xl border-2 border-brand-primary bg-brand-primary/50 p-8 shadow-xl">
            <div>
              <h2 className="font-heading text-xl font-semibold text-white">Email</h2>
              <a href="mailto:wang19904@gmail.com" className="mt-2 block text-2xl font-bold text-brand-cta hover:underline">
                wang19904@gmail.com
              </a>
            </div>
            <div className="border-t-2 border-brand-secondary pt-6">
              <h2 className="font-heading text-xl font-semibold text-white">Response Time</h2>
              <p className="mt-2 text-sm font-medium text-slate-400">Most messages receive a reply within 1 to 2 business days.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border-2 border-brand-primary bg-brand-primary p-10 shadow-2xl">
          <h2 className="font-heading text-3xl font-semibold text-white">What to include</h2>
          <ul className="mt-8 space-y-4">
            {[
              'Account email used with Google login',
              'Order number for billing or refund requests',
              'A short description of the issue or request',
            ].map((item) => (
              <li key={item} className="flex items-center gap-4 text-lg text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-cta text-xs font-bold text-white">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href="mailto:wang19904@gmail.com?subject=AiVolo.studio%20Support%20Request"
            className="mt-12 inline-flex w-full items-center justify-center rounded-xl bg-brand-cta px-8 py-5 text-base font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-cta/90"
          >
            Email Support
          </a>
        </section>
      </div>
    </main>
  );
}
