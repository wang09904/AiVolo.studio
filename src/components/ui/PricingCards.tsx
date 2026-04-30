'use client';

import { useState } from 'react';
import { PLAN_BENEFITS, PRICING_PLANS, type BillingCycle } from '@/lib/product';

export default function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-center">
        <div className="grid grid-cols-2 rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(16%_0.014_270)] p-1">
          {([
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setBillingCycle(tab.value)}
              className={`rounded-md px-6 py-3 text-sm font-semibold transition-colors ${
                billingCycle === tab.value
                  ? 'bg-[oklch(72%_0.18_270)] text-[oklch(16%_0.03_270)]'
                  : 'text-[oklch(72%_0.018_270)] hover:text-[oklch(96%_0.01_270)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {PRICING_PLANS.map((plan) => {
          const isYearly = billingCycle === 'yearly';
          const benefitKey = plan.benefitKey as 'lite' | 'pro';

          return (
            <article
              key={plan.key}
              className={`rounded-lg border p-6 transition-colors ${
                isYearly
                  ? 'border-[oklch(72%_0.18_270_/_0.7)] bg-[oklch(19%_0.035_270)]'
                  : 'border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)]'
              }`}
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-3xl font-semibold text-[oklch(98%_0.01_270)]">{plan.plan}</h3>
                    <span className="rounded-full bg-[oklch(72%_0.18_270)] px-3 py-1 text-xs font-semibold text-[oklch(16%_0.03_270)]">
                      {isYearly ? plan.yearlyBadge : plan.monthlyBadge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[oklch(70%_0.018_270)]">
                    {isYearly ? 'Billed yearly. Monthly equivalent shown.' : 'Billed monthly.'}
                  </p>
                </div>

                {isYearly ? (
                  <div className="rounded-md border border-[oklch(72%_0.18_270_/_0.45)] bg-[oklch(15%_0.02_270)] px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-[oklch(67%_0.018_270)] line-through">
                        {plan.yearlyOriginalPrice}
                      </span>
                      <span className="text-3xl font-semibold text-[oklch(98%_0.01_270)]">
                        {plan.yearlyPrice}
                      </span>
                      <span className="text-sm text-[oklch(72%_0.018_270)]">/ month</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-[oklch(82%_0.08_270)]">{plan.yearlySavings}</p>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-4xl font-semibold text-[oklch(98%_0.01_270)]">{plan.monthlyPrice}</span>
                    <span className="text-sm text-[oklch(72%_0.018_270)]"> / month</span>
                  </div>
                )}
              </div>

              <button
                disabled
                className="mb-6 w-full rounded-md border border-[oklch(34%_0.02_270)] bg-[oklch(24%_0.015_270)] px-4 py-3 text-sm font-semibold text-[oklch(66%_0.015_270)]"
              >
                Coming Soon
              </button>

              <div className="border-t border-[oklch(29%_0.018_270)] pt-5">
                <p className="mb-4 text-sm font-semibold text-[oklch(90%_0.012_270)]">
                  Plan benefits after subscriptions open
                </p>
                <ul className="grid gap-3 text-sm text-[oklch(76%_0.018_270)] sm:grid-cols-2">
                  {PLAN_BENEFITS.map((benefit) => (
                    <li key={benefit.label} className="flex items-start justify-between gap-4">
                      <span>{benefit.label}</span>
                      <span className="shrink-0 font-semibold text-[oklch(90%_0.012_270)]">
                        {benefit[benefitKey]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="mt-5 rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(15%_0.014_270)] p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold text-[oklch(96%_0.01_270)]">Free trial</h3>
            <p className="mt-1 text-sm text-[oklch(70%_0.018_270)]">
              Start with 20 credits, standard speed, basic models, 7-day history, and community support.
            </p>
          </div>
          <span className="text-3xl font-semibold text-[oklch(98%_0.01_270)]">$0</span>
        </div>
      </aside>
    </div>
  );
}
