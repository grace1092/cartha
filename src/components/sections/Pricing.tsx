'use client'

import { useEffect, useState } from 'react'
import { Check, Star, Shield, Users, Building, Lock, Clock, TrendingUp, DollarSign, Zap, Brain, Target } from 'lucide-react'
import { revealOnScroll } from '@/lib/utils'
import { WaitlistModal } from '@/components/ui/WaitlistModal'

export default function Pricing() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  useEffect(() => {
    revealOnScroll()
  }, [])

  // Countdown timer to September 15, 2025
  useEffect(() => {
    const targetDate = new Date('2025-09-15T23:59:59').getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const plans = [
    {
      name: 'Solo Practitioner',
      icon: Users,
      price: 50,
      originalPrice: 75,
      description: 'Perfect for individual therapists, psychologists, and counselors',
      subtitle: 'Everything you need to manage your practice',
      features: [
        'AI-powered session notes & documentation',
        'Client progress tracking & analytics',
        'Automated follow-up & appointment reminders',
        'HIPAA-compliant security & encryption',
        'Mobile app for on-the-go access',
        'Billing & invoicing tools',
        'Email support',
        'Calendar integration'
      ],
      gradient: 'from-blue-500 to-cyan-500',
      popular: false,
      // Beta Launch Pricing (first 10 signups, locked for life)
      foundingMemberPrice: 50,
      savings: 'Locked for life'
    },
    {
      name: 'Small Group Practice',
      icon: Building,
      price: 150,
      originalPrice: 200,
      description: 'For small teams and group practices',
      subtitle: '2-10 practitioners',
      features: [
        'Everything in Solo, plus:',
        'Multi-user team collaboration',
        'Advanced practice analytics dashboard',
        'Custom client worksheets & forms',
        'Practice performance insights',
        'Team scheduling & coordination',
        'Priority phone support',
        'Custom integrations'
      ],
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
      // Beta Launch Pricing (first 10 signups, locked for life)
      foundingMemberPrice: 150,
      savings: 'Locked for life'
    },
    {
      name: 'Large Organization',
      icon: Shield,
      price: 500,
      originalPrice: 600,
      description: 'For clinics, hospitals, and large practices',
      subtitle: '10+ practitioners',
      features: [
        'Everything in Small Group, plus:',
        'Unlimited users & locations',
        'Dedicated account manager',
        'Custom API & white-label options',
        'Advanced security & compliance',
        'Training & onboarding included',
        '24/7 priority support',
        'Custom development & integrations'
      ],
      gradient: 'from-indigo-500 to-purple-500',
      popular: false,
      // Beta Launch Pricing (first 10 signups, locked for life)
      foundingMemberPrice: 500,
      savings: 'Locked for life'
    }
  ]

  const roiMetrics = [
    { label: 'Additional Monthly Revenue', value: '$1,800+', icon: DollarSign, color: 'text-green-600' },
    { label: 'Time Saved Per Week', value: '2.5+ hours', icon: Clock, color: 'text-blue-600' },
    { label: 'Treatment Outcomes', value: '35% improvement', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Client Retention', value: '50% drop in churn', icon: Target, color: 'text-orange-600' },
    { label: 'Annual Practice Gains', value: '$10K–$15K', icon: Zap, color: 'text-indigo-600' },
    { label: 'Return on Investment', value: '10x ROI', icon: Brain, color: 'text-pink-600' }
  ]

  const handleJoinWaitlist = (planName: string) => {
    setSelectedPlan(planName)
    setShowWaitlistModal(true)
  }

  return (
    <section id="pricing" className="section-spacing section-pricing relative">
      <div className="container-luxury relative z-10">
        {/* Founding Member Countdown */}
        <div className="bg-gradient-to-r from-primary-700 to-purple-700 text-white rounded-2xl p-6 mb-16 shadow-xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Lock className="w-5 h-5" />
              <h3 className="text-xl font-bold">Beta Launch Pricing</h3>
            </div>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              First 10 signups across all tiers. Lock in your price for life.
            </p>
            
            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-card/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{timeLeft.days}</div>
                <div className="text-sm text-primary-100">Days</div>
              </div>
              <div className="bg-card/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{timeLeft.hours}</div>
                <div className="text-sm text-primary-100">Hours</div>
              </div>
              <div className="bg-card/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                <div className="text-sm text-primary-100">Minutes</div>
              </div>
              <div className="bg-card/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                <div className="text-sm text-primary-100">Seconds</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="bg-card/20 px-3 py-1 rounded-full font-semibold">Locked for life</span>
              <span className="bg-card/20 px-3 py-1 rounded-full font-semibold">First 10 signups</span>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="scroll-reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-heading mb-6">
              Lightweight client management — not another bloated system
            </h2>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-body max-w-3xl mx-auto mb-8">
              For therapists, psychologists, and counselors who work one-on-one or in small groups. 
              Cartha handles your notes, billing, and client communication so you can focus on what matters.
            </p>
            <p className="text-lg font-semibold text-heading">
              Starting at $50/month. Founding members save 60% for life.
            </p>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="bg-card rounded-2xl p-8 mb-16 border border-card-border shadow-lg dark:shadow-[0_4px_32px_0_rgba(0,0,0,0.7)]">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-heading mb-2">Value Justification</h3>
            <p className="text-body">See the real impact on your practice</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {roiMetrics.map((metric, index) => {
              const IconComponent = metric.icon
              return (
                <div key={index} className="scroll-reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bg-card rounded-xl p-4 text-center shadow-sm border border-card-border dark:shadow-[0_2px_16px_0_rgba(0,0,0,0.5)]">
                    <IconComponent className={`w-8 h-8 mx-auto mb-2 ${metric.color} dark:text-primary-300`} />
                    <div className="text-lg font-bold text-heading dark:text-primary-100">{metric.value}</div>
                    <div className="text-sm text-body dark:text-primary-200">{metric.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <div
                key={plan.name}
                className={`scroll-reveal relative bg-card rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl dark:shadow-[0_8px_40px_0_rgba(0,0,0,0.7)] ${
                   plan.popular ? 'border-purple-500 scale-105' : 'border-card-border hover:border-primary-500'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-700 to-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg dark:shadow-[0_2px_12px_0_rgba(0,0,0,0.5)]">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg dark:shadow-[0_2px_12px_0_rgba(0,0,0,0.5)]`}>
                      <IconComponent className="w-8 h-8 text-white dark:text-primary-100" />
                    </div>
                    <h3 className="text-2xl font-bold text-heading mb-2 dark:text-primary-100">{plan.name}</h3>
                    {/* First 10 Signups badge */}
                    <div className="flex items-center justify-center mb-3">
                      <span className="inline-block rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5">
                        First 10 Signups Only
                      </span>
                    </div>
                    <p className="text-body mb-4 font-medium dark:text-primary-200">{plan.description}</p>
                    <p className="text-sm text-muted dark:text-primary-300">{plan.subtitle}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-4xl font-bold text-heading dark:text-primary-100">${plan.foundingMemberPrice}</span>
                      <span className="text-lg text-muted dark:text-primary-300">/month</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-lg text-muted line-through dark:text-primary-400">${plan.originalPrice}</span>
                      <span className="text-sm font-semibold text-green-400 dark:text-green-300">{plan.savings}</span>
                    </div>
                    <div className="text-xs text-muted dark:text-primary-400">
                      Founding member pricing • Help shape Cartha and keep your price for life.
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-400 dark:text-green-300 mt-0.5 flex-shrink-0" />
                        <span className="text-body font-medium dark:text-primary-200">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleJoinWaitlist(plan.name)}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-700 to-purple-700 text-white hover:from-primary-800 hover:to-purple-800'
                        : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 dark:shadow-[0_2px_12px_0_rgba(0,0,0,0.5)]`}
                  >
                    {isLoading ? 'Joining...' : plan.name === 'Large Organization' ? 'Contact Sales' : 'Join the Waitlist'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="scroll-reveal">
            <h3 className="text-2xl font-bold text-heading mb-4">
              Ready to transform your practice?
            </h3>
            <p className="text-lg text-body mb-8 max-w-2xl mx-auto">
              Join 500+ therapists who are already on the waitlist. 
              Get exclusive founding member pricing and early access to CARTHA.
            </p>
            <button
              onClick={() => handleJoinWaitlist('General')}
              className="bg-gradient-to-r from-primary-700 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-primary-800 hover:to-purple-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Join Founding Member Program
            </button>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        source="pricing_page"
      />
    </section>
  )
} 