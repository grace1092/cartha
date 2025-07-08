'use client'

import { useEffect } from 'react'
import { APP_CONSTANTS, revealOnScroll } from '@/lib/utils'

export default function Features() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  const features = [
    {
      ...APP_CONSTANTS.FEATURES.SESSION_NOTES,
      gradient: 'from-blue-500 to-cyan-500',
      delay: '0s',
      details: [
        'AI-powered transcription and analysis',
        'Automatic progress tracking',
        'Smart template suggestions',
        'Integration with treatment plans'
      ]
    },
    {
      ...APP_CONSTANTS.FEATURES.FOLLOW_UP_EMAILS,
      gradient: 'from-purple-500 to-pink-500',
      delay: '0.2s',
      details: [
        'Personalized email templates',
        'Automated scheduling',
        'Client engagement tracking',
        'HIPAA-compliant communication'
      ]
    },
    {
      ...APP_CONSTANTS.FEATURES.CLIENT_DASHBOARD,
      gradient: 'from-indigo-500 to-purple-500',
      delay: '0.4s',
      details: [
        'Comprehensive progress overview',
        'Interactive charts and graphs',
        'Treatment milestone tracking',
        'Customizable reporting'
      ]
    }
  ]

  return (
    <section id="features" className="py-20 lg:py-32 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container-modern relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="scroll-reveal">
            <h2 className="heading-xl mb-6">
              Everything you need to run your
              <span className="gradient-text"> therapy practice</span>
            </h2>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="body-lg max-w-3xl mx-auto">
              Streamline your workflow with powerful tools designed specifically for mental health professionals. 
              Focus on what matters most – your clients.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="scroll-reveal feature-card group"
              style={{ animationDelay: feature.delay }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              {/* Title */}
              <h3 className="heading-md mb-4">{feature.title}</h3>

              {/* Description */}
              <p className="body-md mb-6">{feature.description}</p>

              {/* Feature Details */}
              <ul className="space-y-3 mb-8">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} mt-2 flex-shrink-0`} />
                    <span className="body-sm text-gray-600">{detail}</span>
                  </li>
                ))}
              </ul>

              {/* Learn More Link */}
              <button className="btn-ghost text-sm group-hover:translate-x-1 transition-transform duration-300">
                Learn more
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="scroll-reveal" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
              <h3 className="heading-lg mb-6">
                Ready to transform your practice?
              </h3>
              <p className="body-lg mb-8 text-gray-600">
                Join thousands of therapists who have streamlined their workflow with Cartha. 
                Start your free trial today and see the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  Start Free Trial
                </button>
                <button className="btn-secondary">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 