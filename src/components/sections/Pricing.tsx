'use client'

import { useEffect, useState } from 'react'
import { Check, Star, Shield, Users, Building, Lock, Clock, TrendingUp, DollarSign, Zap, Brain, Target } from 'lucide-react'
import { revealOnScroll } from '@/lib/utils'

export default function Pricing() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isLoading, setIsLoading] = useState(false)

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
      name: 'Solo Therapist',
      icon: Users,
      price: 120,
      originalPrice: 171,
      description: 'This is your clinic\'s brain — not just software',
      subtitle: 'Professional operating cost, not a nice-to-have',
      features: [
        'AI-powered session notes & documentation',
        'Client progress tracking & analytics',
        'Automated follow-up & appointment reminders',
        'HIPAA-compliant security & encryption',
        'Mobile app for on-the-go access',
        'Apple/Epic/Stripe ecosystem integration',
        'Priority email support',
        'Practice growth insights'
      ],
      gradient: 'from-blue-500 to-cyan-500',
      popular: false,
      foundingMemberPrice: 84,
      savings: '30% off for life'
    },
    {
      name: 'Group Practice',
      icon: Building,
      price: 360,
      originalPrice: 514,
      description: 'Cartha scales with your care',
      subtitle: '5 users → $72 per therapist',
      features: [
        'Everything in Solo, plus:',
        'Multi-user team collaboration',
        'Advanced practice analytics dashboard',
        'Custom client worksheets & forms',
        'Practice performance insights',
        'Team scheduling & coordination',
        'Priority phone support',
        'Custom integrations & API access'
      ],
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
      foundingMemberPrice: 252,
      savings: '30% off for life'
    },
    {
      name: 'Clinic Tier',
      icon: Shield,
      price: 1200,
      originalPrice: 1714,
      description: 'Not per seat — this is your operational core',
      subtitle: 'Enterprise-level positioning',
      features: [
        'Everything in Group Practice, plus:',
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
      foundingMemberPrice: 840,
      savings: '30% off for life'
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

  const handleJoinWaitlist = async (planName: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement waitlist signup
      console.log(`Joining waitlist for ${planName}`)
    } catch (error) {
      console.error('Error joining waitlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="pricing" className="py-20 lg:py-32 relative bg-gradient-to-b from-gray-50 to-white">
      <div className="container-modern relative z-10">
        {/* Founding Member Countdown */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 mb-16 shadow-xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Lock className="w-5 h-5" />
              <h3 className="text-xl font-bold">Founding Member Access</h3>
            </div>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Only 500 total seats across all tiers. Must join by September 15, 2025. 
              Private rollout. After this, prices go up — forever.
            </p>
            
            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{timeLeft.days}</div>
                <div className="text-sm text-purple-100">Days</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{timeLeft.hours}</div>
                <div className="text-sm text-purple-100">Hours</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                <div className="text-sm text-purple-100">Minutes</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                <div className="text-sm text-purple-100">Seconds</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">30% off for life</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">3 invite codes</span>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="scroll-reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Professional operating cost — not a nice-to-have
            </h2>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Therapists who generate $10K+/month shouldn't waste 10+ hours on admin. 
              Cartha saves you time, protects your license, and sharpens your clinical edge.
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Starting at $120/month. Founding members save 30% for life.
            </p>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-16 border border-blue-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Value Justification</h3>
            <p className="text-gray-600">See the real impact on your practice</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {roiMetrics.map((metric, index) => {
              const IconComponent = metric.icon
              return (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                    <IconComponent className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              )
            })}
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
                {/* Founding Member Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="px-6 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Founding Member</span>
                  </div>
                </div>

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 right-4 z-10">
                    <div className="px-4 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                      Most Popular
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
                  <p className="text-gray-600 mb-2">{plan.description}</p>
                  <p className="text-sm text-gray-500 mb-6">{plan.subtitle}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">${plan.foundingMemberPrice}</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-lg text-gray-400 line-through">${plan.originalPrice}</span>
                      <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {plan.savings}
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
                    onClick={() => handleJoinWaitlist(plan.name)}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                    } hover:scale-105 shadow-lg`}
                  >
                    {isLoading ? 'Joining...' : 'Join the Waitlist'}
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