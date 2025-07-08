'use client'

import { useEffect } from 'react'
import { Users, Clock, Star, TrendingUp } from 'lucide-react'
import { revealOnScroll } from '@/lib/utils'

export default function Stats() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  const stats = [
    {
      icon: Users,
      number: '500+',
      label: 'Therapists',
      description: 'Trust Cartha to manage their practice'
    },
    {
      icon: Clock,
      number: '10,000+',
      label: 'Sessions',
      description: 'Successfully managed this month'
    },
    {
      icon: Star,
      number: '95%',
      label: 'Satisfaction',
      description: 'Client satisfaction rate'
    },
    {
      icon: TrendingUp,
      number: '40%',
      label: 'Time Saved',
      description: 'Average time saved per session'
    }
  ]

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container-modern">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="scroll-reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by therapists nationwide
            </h2>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join hundreds of mental health professionals who have transformed their practice with Cartha
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.label}
                className="scroll-reveal group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Number */}
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-lg font-semibold text-gray-700 mb-3">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-gray-600 text-sm leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="scroll-reveal" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-600 mb-8">
              Trusted by leading mental health organizations
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="text-sm font-semibold text-gray-700">HIPAA Compliant</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="text-sm font-semibold text-gray-700">SOC 2 Type II</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="text-sm font-semibold text-gray-700">256-bit SSL</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="text-sm font-semibold text-gray-700">GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 