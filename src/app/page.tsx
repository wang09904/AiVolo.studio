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
    <main className="min-h-[100dvh] bg-brand-bg text-brand-text selection:bg-brand-cta selection:text-white">
      {/* Friendly Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 mb-8 rounded-full border border-brand-border bg-white px-4 py-1.5 text-sm font-bold text-brand-cta shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cta opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-cta"></span>
            </span>
            Text to image is live!
          </div>

          <h1 className="text-5xl font-bold tracking-tight leading-[1.1] md:text-7xl lg:text-[5rem]">
            Ready for the feed. <br />
            <span className="text-brand-muted">Not the prompt lab.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-[45ch] text-lg leading-relaxed text-brand-muted">
            AiVolo.studio is the simplest way for creators to turn ideas into polished visual assets. Jump in and make something fun.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#generate"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-brand-cta px-8 py-4 text-base font-bold text-white shadow-lg transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-cta/90"
            >
              Start Creating
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-brand-border bg-white px-8 py-4 text-base font-bold text-brand-text shadow-sm transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-bg"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Generation Interface - Friendly Bento Style */}
      <section id="generate" className="px-6 py-24 lg:px-12 bg-white rounded-t-[3rem] border-t border-brand-border shadow-[0_-20px_40px_rgb(0,0,0,0.02)]">
        <div className="mx-auto max-w-[1200px]">

          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Create your masterpiece.
            </h2>
            <p className="mt-4 text-lg text-brand-muted">
              Configure parameters here, then seamlessly transition to the live workspace.
            </p>
          </div>

          <form action="/create" className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Left: Prompt Input Bento Box */}
            <div className="flex flex-col gap-6 rounded-3xl border border-brand-border bg-brand-bg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <label htmlFor="home-prompt" className="text-lg font-bold text-brand-text">
                What do you want to see?
              </label>
              <textarea
                id="home-prompt"
                name="prompt"
                required
                rows={4}
                placeholder="A cinematic thumbnail of a tiny robot cooking street food in Bangkok..."
                className="w-full resize-none rounded-2xl border-2 border-brand-border bg-white px-6 py-5 text-xl font-medium leading-relaxed text-brand-text placeholder:text-brand-muted focus:border-brand-cta focus:outline-none focus:ring-4 focus:ring-brand-cta/20 transition-all"
              />

              <div className="mt-2 flex flex-wrap gap-2">
                {promptExamples.map((example, i) => (
                  <p key={i} className="cursor-default rounded-full bg-brand-secondary px-4 py-2 text-sm font-bold text-brand-cta transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-secondary/80">
                    &quot;{example}&quot;
                  </p>
                ))}
              </div>
            </div>

            {/* Right: Parameters Bento Box */}
            <div className="flex flex-col gap-6 rounded-3xl border border-brand-border bg-brand-bg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex flex-col gap-3">
                 <label htmlFor="home-model" className="text-base font-bold text-brand-text">
                  Model Selection
                </label>
                <select
                  id="home-model"
                  name="model_id"
                  defaultValue={TEXT_TO_IMAGE_MODEL.id}
                  className="w-full cursor-pointer appearance-none rounded-xl border-2 border-brand-border bg-white px-5 py-4 text-base font-bold text-brand-text focus:border-brand-cta focus:outline-none focus:ring-4 focus:ring-brand-cta/20 transition-all"
                >
                  <option value={TEXT_TO_IMAGE_MODEL.id}>{TEXT_TO_IMAGE_MODEL.name}</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="home-ratio" className="text-base font-bold text-brand-text">
                  Aspect Ratio
                </label>
                <select
                  id="home-ratio"
                  name="aspect_ratio"
                  defaultValue="1:1"
                  className="w-full cursor-pointer appearance-none rounded-xl border-2 border-brand-border bg-white px-5 py-4 text-base font-bold text-brand-text focus:border-brand-cta focus:outline-none focus:ring-4 focus:ring-brand-cta/20 transition-all"
                >
                  {ASPECT_RATIOS.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>
                      {ratio.value} — {ratio.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="submit"
                  className="group flex w-full items-center justify-between rounded-2xl bg-brand-text px-6 py-5 text-base font-bold text-white transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-text/90 shadow-lg"
                >
                  <span>Initialize Workspace</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-brand-bg px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Pricing built for creators.
            </h2>
          </div>
          <PricingCards />
        </div>
      </section>
    </main>
  );
}
