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
      {/* Asymmetric Hero Section */}
      <section className="relative overflow-hidden border-b border-brand-border">
        <div className="mx-auto grid min-h-[calc(100dvh-80px)] max-w-[1400px] gap-12 px-6 py-20 lg:grid-cols-2 lg:px-12 lg:py-0">

          {/* Left: Content */}
          <div className="flex flex-col justify-center pb-12 pt-10 lg:py-24">
            <div className="inline-flex items-center gap-2 mb-8 rounded-full border border-brand-border bg-brand-surface/30 px-3 py-1 text-xs font-medium tracking-wide text-brand-muted backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cta opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-cta"></span>
              </span>
              Text to image is live.
            </div>

            <h1 className="text-5xl font-light tracking-tighter leading-[1.1] md:text-7xl lg:text-[5rem]">
              Ready for the feed. <br />
              <span className="text-brand-muted">Not the prompt lab.</span>
            </h1>

            <p className="mt-8 max-w-[45ch] text-lg leading-relaxed text-brand-muted">
              AiVolo.studio provides an uncompromising, high-efficiency generation engine for modern creators. Transform clear ideas into polished visual assets instantly.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link
                href="#generate"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-brand-cta px-8 py-4 text-sm font-medium text-white transition-all duration-300 ease-out active:scale-[0.98] hover:bg-blue-500"
              >
                <span>Try the engine</span>
              </Link>
              <Link
                href="/pricing"
                className="group relative inline-flex items-center justify-center px-6 py-4 text-sm font-medium text-brand-muted transition-all duration-300 ease-out active:scale-[0.98] hover:text-brand-text"
              >
                <span className="relative">
                  View pricing
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-brand-text transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </div>
          </div>

          {/* Right: Visual/Structural Element instead of just empty space */}
          <div className="relative hidden lg:block border-l border-brand-border bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
             <div className="absolute inset-0 bg-gradient-to-r from-brand-bg to-transparent"></div>
             <div className="absolute inset-0 bg-brand-bg/40 backdrop-blur-[2px]"></div>
          </div>

        </div>
      </section>

      {/* Generation Interface - Stripped of heavy cards */}
      <section id="generate" className="border-b border-brand-border bg-brand-bg px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-4 text-xs font-medium tracking-widest uppercase text-brand-cta">Generation Engine</p>
              <h2 className="text-4xl font-light tracking-tighter md:text-5xl">
                Describe. Configure. Execute.
              </h2>
            </div>
            <p className="max-w-[45ch] text-base leading-relaxed text-brand-muted lg:justify-self-end">
              The homepage console offers immediate access to the core engine. Configure your parameters here, then seamlessly transition to the live workspace.
            </p>
          </div>

          <form action="/create" className="grid gap-12 border-t border-brand-border pt-12 lg:grid-cols-[1fr_400px]">
            {/* Left: Prompt Input */}
            <div className="flex flex-col gap-6">
              <label htmlFor="home-prompt" className="text-sm font-medium tracking-wide text-brand-muted">
                01. Core Directive
              </label>
              <textarea
                id="home-prompt"
                name="prompt"
                required
                rows={4}
                placeholder="Enter prompt description..."
                className="w-full resize-none rounded-md border border-brand-border bg-brand-surface/40 px-5 py-5 text-xl font-light leading-relaxed text-brand-text placeholder:text-zinc-600 focus:border-brand-cta focus:bg-brand-surface focus:outline-none focus:ring-1 focus:ring-brand-cta/50 transition-all"
              />

              <div className="mt-2 flex flex-wrap gap-3">
                {promptExamples.map((example, i) => (
                  <p key={i} className="cursor-default rounded-full border border-brand-border bg-brand-surface/30 px-4 py-2 text-xs font-medium text-brand-muted transition-colors hover:border-brand-muted hover:text-brand-text hover:bg-brand-surface">
                    {example}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: Parameters & Submission */}
            <div className="flex flex-col gap-8 lg:border-l lg:border-brand-border lg:pl-12">
              <div className="flex flex-col gap-3">
                 <label htmlFor="home-model" className="text-sm font-medium tracking-wide text-brand-muted">
                  02. Model Selection
                </label>
                <select
                  id="home-model"
                  name="model_id"
                  defaultValue={TEXT_TO_IMAGE_MODEL.id}
                  className="w-full cursor-pointer appearance-none rounded-md border border-brand-border bg-brand-surface/40 px-4 py-4 text-base font-medium text-brand-text focus:border-brand-cta focus:bg-brand-surface focus:outline-none focus:ring-1 focus:ring-brand-cta/50 transition-all"
                >
                  <option value={TEXT_TO_IMAGE_MODEL.id} className="bg-brand-surface">{TEXT_TO_IMAGE_MODEL.name}</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="home-ratio" className="text-sm font-medium tracking-wide text-brand-muted">
                  03. Aspect Ratio
                </label>
                <select
                  id="home-ratio"
                  name="aspect_ratio"
                  defaultValue="1:1"
                  className="w-full cursor-pointer appearance-none rounded-md border border-brand-border bg-brand-surface/40 px-4 py-4 text-base font-medium text-brand-text focus:border-brand-cta focus:bg-brand-surface focus:outline-none focus:ring-1 focus:ring-brand-cta/50 transition-all"
                >
                  {ASPECT_RATIOS.map((ratio) => (
                    <option key={ratio.value} value={ratio.value} className="bg-brand-surface">
                      {ratio.value} — {ratio.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="submit"
                  className="group flex w-full items-center justify-between rounded-sm bg-brand-text px-6 py-4 text-sm font-medium text-brand-bg transition-all duration-300 ease-out active:scale-[0.98] hover:bg-white"
                >
                  <span>Initialize Workspace</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Pricing Preview - Minimalist */}
      <section className="px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-20 flex flex-col items-center text-center">
            <p className="mb-4 text-xs font-medium tracking-widest uppercase text-brand-cta">Membership</p>
            <h2 className="max-w-[20ch] text-4xl font-light tracking-tighter md:text-5xl">
              Uncompromising performance. Predictable pricing.
            </h2>
          </div>
          <PricingCards />
        </div>
      </section>
    </main>
  );
}
