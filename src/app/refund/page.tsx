import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy - AiVolo.studio',
  description: 'AiVolo.studio refund policy',
};

const planCreditValues = [
  ['Free', '$0', '20', '$0.000000'],
  ['Lite Monthly', '$15', '300', '$0.050000'],
  ['Lite Yearly', '$10 monthly equivalent', '300 / month', '$0.033333'],
  ['Pro Monthly', '$29', '800', '$0.036250'],
  ['Pro Yearly', '$14.5 monthly equivalent', '800 / month', '$0.018125'],
];

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[oklch(13%_0.016_270)] px-6 py-14 text-[oklch(94%_0.01_270)]">
      <article className="mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-4xl font-semibold tracking-normal">Refund Policy</h1>
          <p className="mt-3 text-sm text-[oklch(66%_0.016_270)]">Last updated: April 30, 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Overview</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            We want AiVolo.studio to feel fair and transparent. Refund requests are reviewed within 3 to 5 business days after we receive the required account and order details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Credit-Based Refund Logic</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            Refunds are calculated from the paid credit value attached to your subscription. Credits used for image or video generation reduce the refundable amount. Free signup credits, promotional credits, and compensation credits have no cash refund value.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Credit Value for Refund Calculations</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            Used value = consumed paid credits multiplied by the unit credit value of the plan and billing period that issued those credits. Refund amount = amount paid minus used value.
          </p>
          <div className="overflow-x-auto rounded-lg border border-[oklch(31%_0.02_270)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[oklch(18%_0.014_270)] text-[oklch(88%_0.012_270)]">
                <tr>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Effective monthly price</th>
                  <th className="px-4 py-3">Monthly credits</th>
                  <th className="px-4 py-3">Unit credit value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(29%_0.018_270)] text-[oklch(74%_0.018_270)]">
                {planCreditValues.map(([plan, price, credits, value]) => (
                  <tr key={plan}>
                    <td className="px-4 py-3">{plan}</td>
                    <td className="px-4 py-3">{price}</td>
                    <td className="px-4 py-3">{credits}</td>
                    <td className="px-4 py-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            Example: Pro Yearly has an effective monthly price of $14.5 and 800 monthly credits. If 200 paid credits from that billing period are used, the used value is 200 x $0.018125 = $3.625.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Subscription Refunds</h2>
          <p className="leading-7 text-[oklch(74%_0.018_270)]">
            First-time subscribers may request a refund within 7 days. We review the order, the billing period, and the paid credits already consumed. Any unused paid value may be refunded through the original payment method where supported by our payment provider.
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
