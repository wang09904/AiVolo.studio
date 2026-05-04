'use client';

import { useState } from 'react';
import { PLAN_BENEFITS, PRICING_PLANS, type BillingCycle } from '@/lib/product';

export default function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

  return (
    <div className="w-full">
      <div className="mb-16 flex justify-center">
        <div className="inline-flex rounded-full border border-brand-border bg-white p-1.5 shadow-sm">
          {([
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setBillingCycle(tab.value)}
              className={`rounded-full px-8 py-3 text-sm font-bold transition-all duration-300 ${
                billingCycle === tab.value
                  ? 'bg-brand-cta text-white shadow-md'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {PRICING_PLANS.map((plan) => {
          const isYearly = billingCycle === 'yearly';
          const benefitKey = plan.benefitKey as 'lite' | 'pro';

          return (
            <article
              key={plan.key}
              className={`relative flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                isYearly
                  ? 'border-brand-cta shadow-[0_8px_30px_rgb(124,58,237,0.1)]'
                  : 'border-brand-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
              }`}
            >
              <div className="flex flex-col gap-8 p-10 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-bold tracking-tight text-brand-text">{plan.plan}</h3>
                    <span className="rounded-full bg-brand-secondary px-4 py-1.5 text-xs font-bold text-brand-cta">
                      {isYearly ? plan.yearlyBadge : plan.monthlyBadge}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-brand-muted">
                    {isYearly ? 'Billed yearly. Monthly equivalent shown.' : 'Billed monthly.'}
                  </p>
                </div>

                {isYearly ? (
                  <div className="text-right">
                    <div className="flex items-end justify-end gap-2">
                      <span className="mb-1 text-sm font-bold text-brand-muted line-through decoration-brand-text/50 decoration-2">
                        {plan.yearlyOriginalPrice}
                      </span>
                      <span className="text-5xl font-bold tracking-tight text-brand-text">
                        {plan.yearlyPrice}
                      </span>
                      <span className="mb-1 text-sm font-bold text-brand-muted">/mo</span>
                    </div>
                    <p className="mt-2 text-xs font-bold text-brand-cta">{plan.yearlySavings}</p>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="flex items-end justify-end gap-2">
                      <span className="text-5xl font-bold tracking-tight text-brand-text">{plan.monthlyPrice}</span>
                      <span className="mb-1 text-sm font-bold text-brand-muted">/mo</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-10 pb-10">
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl bg-brand-bg px-6 py-4 text-base font-bold text-brand-muted transition-colors"
                >
                  Coming Soon
                </button>
              </div>

              <div className="mt-auto bg-brand-bg/50 p-10 border-t border-brand-border">
                <p className="mb-6 text-sm font-bold text-brand-text">
                  Included Benefits
                </p>
                <ul className="grid gap-y-4 gap-x-8 text-sm text-brand-muted sm:grid-cols-2">
                  {PLAN_BENEFITS.map((benefit) => (
                    <li key={benefit.label} className="flex items-center justify-between border-b border-brand-border/50 pb-3">
                      <span className="font-medium">{benefit.label}</span>
                      <span className="font-bold text-brand-text">
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

      <aside className="mt-12 rounded-3xl border border-brand-border bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-brand-text">Free Trial</h3>
            <p className="mt-2 max-w-[60ch] text-base font-medium text-brand-muted">
              Start with 20 credits, standard speed, basic models, 7-day history, and community support. No credit card required.
            </p>
          </div>
          <div className="flex items-baseline gap-2 rounded-2xl bg-brand-bg px-6 py-4">
            <span className="text-4xl font-bold tracking-tight text-brand-text">$0</span>
            <span className="text-base font-bold text-brand-muted">forever</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
