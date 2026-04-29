import PricingCards from '@/components/ui/PricingCards';
import { TEXT_TO_IMAGE_MODEL } from '@/lib/product';

const faqs = [
  {
    q: 'What is available now?',
    a: 'You can sign in with Google, use free credits, generate images from text, review account history, and read the legal pages. Payments, templates, image-to-image, and video generation are coming soon.',
  },
  {
    q: 'How many credits does one image use?',
    a: `${TEXT_TO_IMAGE_MODEL.name} uses ${TEXT_TO_IMAGE_MODEL.creditCost} credits per generated image. New users receive 20 free credits after login.`,
  },
  {
    q: 'Can I subscribe today?',
    a: 'Not yet. Lite and Pro subscriptions are visible now, and checkout will open once payment activation is complete.',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[oklch(13%_0.016_270)] px-6 py-16 text-[oklch(96%_0.01_270)] lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold text-[oklch(72%_0.18_270)]">Pricing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal md:text-6xl">
            Lite and Pro, monthly or yearly.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[oklch(74%_0.018_270)]">
            Switch between monthly and yearly billing. Yearly plans show the same benefits at a lower monthly equivalent, with checkout marked Coming Soon until subscriptions open.
          </p>
        </div>

        <PricingCards />

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {faqs.map((item) => (
            <article
              key={item.q}
              className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5"
            >
              <h2 className="text-lg font-semibold">{item.q}</h2>
              <p className="mt-3 text-sm leading-6 text-[oklch(72%_0.018_270)]">{item.a}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
