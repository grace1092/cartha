'use client'

import { useEffect, useState } from 'react'
import { Check, Star, Shield, Users, Building } from 'lucide-react'
import { revealOnScroll } from '@/lib/utils'

export default function Pricing() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    revealOnScroll()
  }, [])

  const plans = [
    {
      name: 'Solo',
      icon: Users,
      price: billingInterval === 'monthly' ? 49 : 39,
      description: 'Perfect for individual therapists and solo practitioners',
      features: [
        'Up to 50 client sessions per month',
        'AI-powered session notes',
        'Client progress tracking',
        'Automated follow-up emails',
        'Basic scheduling tools',
        'HIPAA-compliant security',
        'Email support',
        'Mobile app access'
      ],
      gradient: 'from-blue-500 to-cyan-500',
      popular: false,
      savings: billingInterval === 'yearly' ? 'Save 20%' : null
    },
    {
      name: 'Group',
      icon: Building,
      price: billingInterval === 'monthly' ? 149 : 119,
      description: 'Ideal for group practices and growing teams',
      features: [
        'Up to 200 client sessions per month',
        'All Solo features included',
        'Team collaboration tools',
        'Advanced analytics dashboard',
        'Custom client worksheets',
        'Priority support',
        'Practice performance insights',
        'Multi-user access',
        'Custom integrations'
      ],
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
      savings: billingInterval === 'yearly' ? 'Save 20%' : null
    },
    {
      name: 'Enterprise',
      icon: Shield,
      price: billingInterval === 'monthly' ? 499 : 399,
      description: 'For large clinics and multi-location practices',
      features: [
        'Unlimited client sessions',
        'All Group features included',
        'Dedicated account manager',
        'Custom API access',
        'White-label options',
        'Advanced security features',
        'Training & onboarding',
        'Custom integrations',
        '24/7 priority support'
      ],
      gradient: 'from-indigo-500 to-purple-500',
      popular: false,
      savings: billingInterval === 'yearly' ? 'Save 20%' : null
    }
  ]

  const handleStartTrial = async (planName: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement Stripe checkout
      console.log(`Starting trial for ${planName}`)
    } catch (error) {
      console.error('Error starting trial:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="pricing" className="py-20 lg:py-32 relative bg-gradient-to-b from-gray-50 to-white">
      <div className="container-modern relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="scroll-reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h2>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your practice. All plans include a 14-day free trial with no setup fees.
            </p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="scroll-reveal" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setBillingInterval('monthly')}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingInterval === 'monthly'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval('yearly')}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingInterval === 'yearly'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Yearly
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <div
                key={plan.name}
                className={`scroll-reveal relative ${
                  plan.popular ? 'lg:scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-6 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Savings Badge */}
                {plan.savings && (
                  <div className="absolute -top-4 right-4 z-10">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {plan.savings}
                    </div>
                  </div>
                )}

                <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600 ml-2">
                        /{billingInterval === 'monthly' ? 'month' : 'month, billed yearly'}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleStartTrial(plan.name)}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                    } hover:scale-105 shadow-lg`}
                  >
                    {isLoading ? 'Starting...' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust Signals */}
        <div className="text-center">
          <div className="scroll-reveal" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-600 mb-8">Trusted by leading mental health organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">HIPAA Compliant</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">SOC 2 Type II</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">256-bit SSL</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 