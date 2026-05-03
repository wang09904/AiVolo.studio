'use client';

import { useState } from 'react';
import { PLAN_BENEFITS, PRICING_PLANS, type BillingCycle } from '@/lib/product';

export default function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

  return (
    <div className="w-full">
      <div className="mb-16 flex justify-center">
        <div className="inline-flex rounded-full border border-brand-border bg-brand-bg p-1">
          {([
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setBillingCycle(tab.value)}
              className={`rounded-full px-8 py-2.5 text-sm font-medium transition-all duration-300 ${
                billingCycle === tab.value
                  ? 'bg-brand-surface text-brand-text'
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
              className={`relative flex flex-col overflow-hidden border transition-colors duration-500 ${
                isYearly
                  ? 'border-brand-cta/50 bg-brand-surface/30'
                  : 'border-brand-border bg-transparent'
              }`}
            >
              {/* Top Accent Line */}
              {isYearly && <div className="absolute top-0 left-0 right-0 h-1 bg-brand-cta" />}

              <div className="flex flex-col gap-8 p-10 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-light tracking-tight text-brand-text">{plan.plan}</h3>
                    <span className="rounded-sm border border-brand-cta/30 bg-brand-cta/10 px-3 py-1 text-xs font-medium tracking-wide text-brand-cta">
                      {isYearly ? plan.yearlyBadge : plan.monthlyBadge}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-brand-muted">
                    {isYearly ? 'Billed yearly. Monthly equivalent shown.' : 'Billed monthly.'}
                  </p>
                </div>

                {isYearly ? (
                  <div className="text-right">
                    <div className="flex items-end justify-end gap-2">
                      <span className="mb-1 text-sm text-brand-muted line-through decoration-brand-border">
                        {plan.yearlyOriginalPrice}
                      </span>
                      <span className="text-4xl font-light tracking-tight text-brand-text">
                        {plan.yearlyPrice}
                      </span>
                      <span className="mb-1 text-sm text-brand-muted">/mo</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-brand-cta">{plan.yearlySavings}</p>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="flex items-end justify-end gap-2">
                      <span className="text-4xl font-light tracking-tight text-brand-text">{plan.monthlyPrice}</span>
                      <span className="mb-1 text-sm text-brand-muted">/mo</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-10 pb-10">
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-sm border border-brand-border bg-brand-surface/50 px-6 py-4 text-sm font-medium tracking-wide text-brand-muted transition-colors"
                >
                  Coming Soon
                </button>
              </div>

              <div className="mt-auto border-t border-brand-border bg-brand-surface/10 p-10">
                <p className="mb-6 text-xs font-medium tracking-widest uppercase text-brand-text">
                  Included Benefits
                </p>
                <ul className="grid gap-y-4 gap-x-8 text-sm text-brand-muted sm:grid-cols-2">
                  {PLAN_BENEFITS.map((benefit) => (
                    <li key={benefit.label} className="flex items-center justify-between border-b border-brand-border/50 pb-2">
                      <span>{benefit.label}</span>
                      <span className="font-medium text-brand-text">
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

      <aside className="mt-8 border border-brand-border bg-brand-surface/20 p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-medium tracking-tight text-brand-text">Free Trial</h3>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-brand-muted">
              Start with 20 credits, standard speed, basic models, 7-day history, and community support. No credit card required.
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light tracking-tight text-brand-text">$0</span>
            <span className="text-sm font-medium text-brand-muted">forever</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
