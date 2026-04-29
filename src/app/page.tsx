import Link from 'next/link';
import PricingCards from '@/components/ui/PricingCards';
import { ASPECT_RATIOS, TEXT_TO_IMAGE_MODEL } from '@/lib/product';

const promptExamples = [
  'A playful product photo of handmade ceramic mugs on a Lisbon balcony, morning sun, creator-friendly composition',
  'A cinematic thumbnail of a tiny robot cooking street food in Bangkok, warm neon, vertical social format',
  'A colorful poster for a weekend market in Barcelona, friendly premium style, sharp readable details',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[oklch(13%_0.016_270)] text-[oklch(96%_0.01_270)]">
      <section className="relative overflow-hidden border-b border-[oklch(28%_0.018_270)]">
        <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
          <div className="flex max-w-5xl flex-col justify-center">
            <p className="mb-5 max-w-max rounded-full border border-[oklch(72%_0.18_270_/_0.35)] bg-[oklch(19%_0.035_270)] px-4 py-2 text-sm font-medium text-[oklch(82%_0.08_270)]">
              Text to image is live. Video and templates come next.
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-[oklch(98%_0.008_270)] md:text-7xl">
              Make AI visuals that feel ready for the feed, not the prompt lab.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[oklch(76%_0.018_270)]">
              AiVolo.studio gives short-video creators and everyday makers a simple way to turn a clear idea into polished images. Start with 20 free credits after Google login.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#generate"
                className="rounded-md bg-[oklch(72%_0.18_270)] px-5 py-3 text-sm font-semibold text-[oklch(16%_0.03_270)] transition-colors hover:bg-[oklch(68%_0.18_270)]"
              >
                Try the generator
              </Link>
              <Link
                href="/pricing"
                className="rounded-md border border-[oklch(35%_0.02_270)] px-5 py-3 text-sm font-semibold text-[oklch(90%_0.012_270)] transition-colors hover:border-[oklch(72%_0.18_270)]"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="generate" className="border-b border-[oklch(28%_0.018_270)] bg-[oklch(15%_0.014_270)] px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold text-[oklch(72%_0.18_270)]">Image generator</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[oklch(97%_0.01_270)] md:text-5xl">
              Describe it here, finish it on the create page.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[oklch(72%_0.018_270)]">
              The homepage generator keeps the path short: write a prompt, pick a frame, then continue to the live generation workspace. Login is requested only when you actually generate.
            </p>
          </div>

          <form action="/create" className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(18%_0.014_270)] p-5">
            <label htmlFor="home-prompt" className="text-sm font-medium text-[oklch(82%_0.018_270)]">
              Prompt
            </label>
            <textarea
              id="home-prompt"
              name="prompt"
              required
              rows={5}
              placeholder="Describe the image you want to create..."
              className="mt-3 w-full resize-none rounded-md border border-[oklch(31%_0.02_270)] bg-[oklch(13%_0.014_270)] px-4 py-3 text-[oklch(96%_0.01_270)] outline-none transition-colors placeholder:text-[oklch(52%_0.015_270)] focus:border-[oklch(72%_0.18_270)]"
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="home-model" className="text-sm font-medium text-[oklch(82%_0.018_270)]">
                  Model
                </label>
                <select
                  id="home-model"
                  name="model_id"
                  defaultValue={TEXT_TO_IMAGE_MODEL.id}
                  className="mt-3 w-full rounded-md border border-[oklch(31%_0.02_270)] bg-[oklch(13%_0.014_270)] px-4 py-3 text-[oklch(94%_0.01_270)] outline-none focus:border-[oklch(72%_0.18_270)]"
                >
                  <option value={TEXT_TO_IMAGE_MODEL.id}>{TEXT_TO_IMAGE_MODEL.name}</option>
                </select>
              </div>

              <div>
                <label htmlFor="home-ratio" className="text-sm font-medium text-[oklch(82%_0.018_270)]">
                  Aspect ratio
                </label>
                <select
                  id="home-ratio"
                  name="aspect_ratio"
                  defaultValue="1:1"
                  className="mt-3 w-full rounded-md border border-[oklch(31%_0.02_270)] bg-[oklch(13%_0.014_270)] px-4 py-3 text-[oklch(94%_0.01_270)] outline-none focus:border-[oklch(72%_0.18_270)]"
                >
                  {ASPECT_RATIOS.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>
                      {ratio.value} · {ratio.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {promptExamples.map((example) => (
                <p key={example} className="rounded-md bg-[oklch(22%_0.018_270)] px-3 py-2 text-sm text-[oklch(75%_0.018_270)]">
                  {example}
                </p>
              ))}
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-[oklch(72%_0.18_270)] px-5 py-3 text-sm font-semibold text-[oklch(16%_0.03_270)] transition-colors hover:bg-[oklch(68%_0.18_270)]"
            >
              Continue to create
            </button>
          </form>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold text-[oklch(72%_0.18_270)]">Pricing preview</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[oklch(97%_0.01_270)] md:text-5xl">
              Monthly and yearly memberships with the same benefits, built to make yearly plans feel worth it.
            </h2>
          </div>
          <PricingCards />
        </div>
      </section>
    </main>
  );
}
