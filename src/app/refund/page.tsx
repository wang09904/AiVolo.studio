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
    <main className="min-h-screen bg-brand-bg px-6 py-20 text-brand-text">
      <article className="mx-auto max-w-4xl space-y-12">
        <header className="border-b-2 border-brand-primary pb-8">
          <h1 className="font-heading text-5xl font-semibold text-white">Refund Policy</h1>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-brand-cta">Last updated: April 30, 2026</p>
        </header>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">1. Overview</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            We want AiVolo.studio to feel fair and transparent. Refund requests are reviewed within 3 to 5 business days after we receive the required account and order details.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">2. Credit-Based Refund Logic</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            Refunds are calculated from the paid credit value attached to your subscription. Credits used for image or video generation reduce the refundable amount. Free signup credits, promotional credits, and compensation credits have no cash refund value.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold text-white">3. Credit Value for Refund Calculations</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            Used value = consumed paid credits multiplied by the unit credit value of the plan and billing period that issued those credits. Refund amount = amount paid minus used value.
          </p>
          <div className="overflow-x-auto rounded-2xl border-2 border-brand-primary bg-brand-primary shadow-xl">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-brand-bg/50 text-white">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest">Plan</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest">Effective monthly price</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest">Monthly credits</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest">Unit credit value</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-brand-secondary text-slate-400">
                {planCreditValues.map(([plan, price, credits, value]) => (
                  <tr key={plan} className="transition-colors hover:bg-brand-bg/20">
                    <td className="px-6 py-4 font-medium">{plan}</td>
                    <td className="px-6 py-4">{price}</td>
                    <td className="px-6 py-4 font-bold text-white">{credits}</td>
                    <td className="px-6 py-4 font-mono text-brand-cta">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm italic leading-relaxed text-slate-500">
            Example: Pro Yearly has an effective monthly price of $14.5 and 800 monthly credits. If 200 paid credits from that billing period are used, the used value is 200 x $0.018125 = $3.625.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">4. Subscription Refunds</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            First-time subscribers may request a refund within 7 days. We review the order, the billing period, and the paid credits already consumed. Any unused paid value may be refunded through the original payment method where supported by our payment provider.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-white">5. How to Request a Refund</h2>
          <p className="text-lg leading-relaxed text-slate-400">
            This policy page is the only user-facing refund request entry point. To apply, email <a href="mailto:wang19904@gmail.com" className="font-bold text-brand-cta hover:underline">wang19904@gmail.com</a> with the subject “Refund Request” and include your AiVolo account email, payment email if different, order or invoice ID if available, subscription plan, and reason for the request.
          </p>
          <p className="text-lg leading-relaxed text-slate-400">
            During the refund flow we may show or confirm the refundable amount and calculation basis. Eligible refunds are returned through the original payment method where supported. Exceptions such as provider failure, ledger mismatch, duplicate request, or unavailable provider refund may require manual review.
          </p>
        </section>
      </article>
    </main>
  );
}
