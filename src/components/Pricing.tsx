'use client'

import { useEffect, useMemo, useState } from 'react'
import { PRICING } from '@/lib/pricing'
import { Check } from 'lucide-react'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: PRICING.currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  // Respect prefers-reduced-motion for hover/focus animations
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) {
      document.documentElement.classList.add('reduce-motion')
    }
    return () => document.documentElement.classList.remove('reduce-motion')
  }, [])

  const tiers = useMemo(() => PRICING.tiers, [])

  return (
    <section className="py-16 md:py-20" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <h1 id="pricing-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Simple, transparent pricing for therapy practices
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            HIPAA-compliant by design with encryption, audit logs, and access controls.
          </p>

          {/* Toggle */}
          <div className="mt-6 inline-flex items-center gap-3" role="group" aria-label="Billing interval">
            <span className="text-sm text-gray-700 dark:text-gray-300">Monthly</span>
            <button
              type="button"
              aria-pressed={annual}
              aria-label="Toggle annual billing"
              onClick={() => setAnnual((v) => !v)}
              className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Annual <span className="ml-1 rounded bg-amber-100 px-2 py-0.5 text-amber-800 text-xs">2 months free</span>
            </span>
          </div>
        </header>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3" role="list">
          {tiers.map((tier) => {
            const price = annual ? tier.priceAnnual : tier.priceMonthly
            const priceLabel = annual ? 'yr' : 'mo'
            const isPopular = Boolean((tier as any).popular)
            return (
              <article
                role="listitem"
                key={tier.id}
                className={`relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 backdrop-blur shadow-sm hover:shadow-md focus-within:shadow-md transition ${
                  isPopular ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{tier.name}</h2>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(price)}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">/{priceLabel}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {typeof tier.seatsIncluded === 'number' ? `${tier.seatsIncluded} seat` : tier.seatsIncluded}
                  </p>

                  {(() => {
                    const featuresList = tier.features as unknown as ReadonlyArray<string>
                    return (
                      <ul className="mt-6 space-y-3" aria-label={`${tier.name} features`}>
                        {featuresList.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                            <span className="text-sm text-gray-800 dark:text-gray-200">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  })()}
                  

                  {(tier as any).addonNote && (
                    <p className="mt-4 text-xs text-gray-600 dark:text-gray-300">{(tier as any).addonNote}</p>
                  )}

                  <div className="mt-6">
                    <a
                      href={tier.cta.href}
                      className={`group inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        tier.id === 'enterprise'
                          ? 'bg-gray-900 text-white hover:bg-black focus-visible:ring-gray-900'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-600'
                      }`}
                    >
                      {tier.cta.label}
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Footnotes */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>{PRICING.annualDiscountNote}</p>
          <p className="mt-1">Group add-on seats: {formatCurrency(PRICING.seatAddon.priceMonthly)}/mo per additional seat.</p>
        </div>

        {/* FAQ (schema.org) */}
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="sr-only">Frequently asked questions</h2>
          <div className="mx-auto max-w-3xl divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60">
            <details className="group p-5">
              <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                Is Cartha HIPAA compliant?
              </summary>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Yes. Cartha provides HIPAA-grade encryption at rest and in transit, audit logs, and access controls.
              </p>
            </details>
            <details className="group p-5">
              <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                Can I pilot before paying?
              </summary>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Yes. Solo and Group include a free pilot to validate fit for your practice before committing.
              </p>
            </details>
            <details className="group p-5">
              <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                How does seat pricing work for Group?
              </summary>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Group includes up to 5 seats. Additional seats are {formatCurrency(PRICING.seatAddon.priceMonthly)}/month each.
              </p>
            </details>
          </div>

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'Is Cartha HIPAA compliant?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text:
                        'Yes. Cartha provides HIPAA-grade encryption at rest and in transit, audit logs, and access controls.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Can I pilot before paying?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text:
                        'Yes. Solo and Group include a free pilot to validate fit for your practice before committing.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How does seat pricing work for Group?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text:
                        `Group includes up to 5 seats. Additional seats are ${formatCurrency(
                          PRICING.seatAddon.priceMonthly,
                        )}/month each.`,
                    },
                  },
                ],
              }),
            }}
          />
        </section>
      </div>
    </section>
  )
}


