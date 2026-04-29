'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

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
              <a href="mailto:support@aivolo.studio" className="mt-1 block text-[oklch(82%_0.08_270)]">
                support@aivolo.studio
              </a>
            </div>
            <div>
              <h2 className="font-semibold">Response time</h2>
              <p className="mt-1 text-sm text-[oklch(70%_0.018_270)]">Most messages receive a reply within 1 to 2 business days.</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-6">
          {submitted ? (
            <div className="grid min-h-80 place-items-center text-center">
              <div>
                <h2 className="text-2xl font-semibold">Message ready</h2>
                <p className="mt-3 text-[oklch(74%_0.018_270)]">
                  This form is a local preview. Please send your message to support@aivolo.studio.
                </p>
              </div>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-2 w-full rounded-md border border-[oklch(31%_0.02_270)] bg-[oklch(12%_0.014_270)] px-4 py-3 outline-none focus:border-[oklch(72%_0.18_270)]"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-md border border-[oklch(31%_0.02_270)] bg-[oklch(12%_0.014_270)] px-4 py-3 outline-none focus:border-[oklch(72%_0.18_270)]"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  className="mt-2 w-full resize-none rounded-md border border-[oklch(31%_0.02_270)] bg-[oklch(12%_0.014_270)] px-4 py-3 outline-none focus:border-[oklch(72%_0.18_270)]"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[oklch(72%_0.18_270)] px-5 py-3 text-sm font-semibold text-[oklch(16%_0.03_270)]"
              >
                Prepare message
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
