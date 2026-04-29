import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy - AiVolo.studio',
  description: 'AiVolo.studio refund policy',
};

const creditPricing = [
  ['Text to image, basic model', '$0.020 / image', 'Imagen 3'],
  ['Text to image, advanced model', '$0.050 / image', 'GPT Image 2'],
  ['Image to image, basic model', '$0.030 / image', 'Imagen 3'],
  ['Image to image, advanced model', '$0.080 / image', 'GPT Image 2'],
  ['Text to video', '$0.200 / second', 'GPT Video'],
  ['Image to video', '$0.300 / second', 'GPT Video'],
];

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[oklch(13%_0.016_270)] px-6 py-14 text-[oklch(94%_0.01_270)]">
      <article className="mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-4xl font-semibold tracking-normal">Refund Policy</h1>
          <p className="mt-3 text-sm text-[oklch(66%_0.016_270)]">Last updated: April 28, 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Overview</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            We want AiVolo.studio to feel fair and transparent. Refund requests are reviewed within 3 to 5 business days after we receive the required account and order details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Credit Refunds</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            Purchased credits may be refundable within 7 days if no more than 20% of the purchased credits have been used. Used credits are not refundable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Usage Pricing for Refund Calculations</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            Refund amount = order amount minus used generation value.
          </p>
          <div className="overflow-x-auto rounded-lg border border-[oklch(31%_0.02_270)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[oklch(18%_0.014_270)] text-[oklch(88%_0.012_270)]">
                <tr>
                  <th className="px-4 py-3">Usage type</th>
                  <th className="px-4 py-3">Unit price</th>
                  <th className="px-4 py-3">Model note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(29%_0.018_270)] text-[oklch(74%_0.018_270)]">
                {creditPricing.map(([type, price, note]) => (
                  <tr key={type}>
                    <td className="px-4 py-3">{type}</td>
                    <td className="px-4 py-3">{price}</td>
                    <td className="px-4 py-3">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Subscription Refunds</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            First-time subscribers may request a refund within 7 days. If a service outage prevents normal use for more than 24 continuous hours, we may provide a proportional refund.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. How to Request a Refund</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            Email support@aivolo.studio with the subject “Refund Request” and include your account email, order number if available, and the reason for the request.
          </p>
        </section>
      </article>
    </main>
  );
}
