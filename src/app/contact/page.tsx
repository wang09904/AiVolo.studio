export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[oklch(13%_0.016_270)] px-6 py-14 text-[oklch(94%_0.01_270)]">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="text-sm font-semibold text-[oklch(72%_0.18_270)]">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Talk to AiVolo.studio</h1>
          <p className="mt-5 leading-7 text-[oklch(74%_0.018_270)]">
            For support, refunds, privacy requests, or partnership questions, email us and include the Google account email you use with AiVolo.studio.
          </p>

          <div className="mt-8 space-y-5 rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
            <div>
              <h2 className="font-semibold">Email</h2>
              <a href="mailto:wang19904@gmail.com" className="mt-1 block text-[oklch(82%_0.08_270)]">
                wang19904@gmail.com
              </a>
            </div>
            <div>
              <h2 className="font-semibold">Response time</h2>
              <p className="mt-1 text-sm text-[oklch(70%_0.018_270)]">Most messages receive a reply within 1 to 2 business days.</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-6">
          <h2 className="text-2xl font-semibold">What to include</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-[oklch(74%_0.018_270)]">
            <li>Account email used with Google login.</li>
            <li>Order number if your message is about billing or refunds.</li>
            <li>A short description of the issue or request.</li>
          </ul>
          <a
            href="mailto:wang19904@gmail.com?subject=AiVolo.studio%20Support%20Request"
            className="mt-8 inline-flex rounded-md bg-[oklch(72%_0.18_270)] px-5 py-3 text-sm font-semibold text-[oklch(16%_0.03_270)]"
          >
            Email AiVolo.studio
          </a>
        </section>
      </div>
    </main>
  );
}
