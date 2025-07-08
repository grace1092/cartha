'use client'

import { useEffect } from 'react'
import { APP_CONSTANTS, revealOnScroll } from '@/lib/utils'

export default function Pricing() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  const plans = [
    {
      name: 'Starter',
      price: '$19',
      description: 'Perfect for solo practitioners starting out',
      features: [
        'Up to 50 clients',
        'Basic session notes',
        'Email templates',
        'Progress tracking',
        'HIPAA compliance',
        'Email support'
      ],
      gradient: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      description: 'Most popular for growing practices',
      features: [
        'Unlimited clients',
        'AI-powered session notes',
        'Automated follow-ups',
        'Advanced analytics',
        'Client dashboard',
        'Priority support',
        'Custom templates',
        'API access'
      ],
      gradient: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large practices and clinics',
      features: [
        'Everything in Professional',
        'Multi-therapist management',
        'Advanced reporting',
        'Custom integrations',
        'Dedicated account manager',
        'Training & onboarding',
        'SLA guarantee'
      ],
      gradient: 'from-indigo-500 to-purple-500',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20 lg:py-32 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container-modern relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="scroll-reveal">
            <h2 className="heading-xl mb-6">
              Simple, transparent
              <span className="gradient-text"> pricing</span>
            </h2>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="body-lg max-w-3xl mx-auto">
              Choose the plan that's right for your practice. All plans include our core features 
              with a 14-day free trial and no setup fees.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`scroll-reveal relative ${
                plan.popular ? 'scale-105 lg:scale-110' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`px-6 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${plan.gradient}`}>
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`feature-card h-full ${plan.popular ? 'border-2 border-purple-200' : ''}`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="heading-md mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center space-x-2 mb-4">
                    <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                    {plan.price !== 'Custom' && (
                      <span className="text-gray-500">/month</span>
                    )}
                  </div>
                  <p className="body-md text-gray-600">{plan.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${plan.gradient} mt-2 flex-shrink-0`} />
                      <span className="body-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button 
                  className={`w-full ${
                    plan.popular 
                      ? 'btn-primary' 
                      : 'btn-secondary'
                  }`}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-16">
          <div className="scroll-reveal" style={{ animationDelay: '0.6s' }}>
            <p className="body-md text-gray-600 mb-4">
              Have questions about our pricing?
            </p>
            <button className="btn-ghost">
              View FAQ
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <div className="scroll-reveal" style={{ animationDelay: '0.8s' }}>
            <div className="glass-card p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="body-md font-semibold text-gray-900">
                  30-day money-back guarantee
                </span>
              </div>
              <p className="body-sm text-gray-600 mt-2">
                Try Cartha risk-free. If you're not completely satisfied, we'll refund your money.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 