'use client'

import { useEffect } from 'react'
import { APP_CONSTANTS, revealOnScroll } from '@/lib/utils'

export default function Hero() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container-modern relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading */}
          <div className="scroll-reveal">
            <h1 className="heading-hero mb-8">
              Modern Practice<br />
              Management for<br />
              <span className="gradient-text-secondary">Therapists</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="body-lg max-w-3xl mx-auto mb-12">
              {APP_CONSTANTS.DESCRIPTION} Transform your practice with intelligent automation, 
              seamless workflows, and data-driven insights.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="scroll-reveal flex flex-col sm:flex-row gap-6 justify-center items-center mb-16" style={{ animationDelay: '0.4s' }}>
            <button className="btn-primary text-lg">
              Start Your Free Trial
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="btn-secondary text-lg">
              Watch Demo
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card p-6 text-center">
              <div className="heading-md gradient-text mb-2">{APP_CONSTANTS.THERAPISTS_COUNT}</div>
              <div className="body-sm">Active Therapists</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="heading-md gradient-text mb-2">{APP_CONSTANTS.SESSIONS_COUNT}</div>
              <div className="body-sm">Sessions Managed</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="heading-md gradient-text mb-2">98%</div>
              <div className="body-sm">Client Satisfaction</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="scroll-reveal mt-16" style={{ animationDelay: '0.8s' }}>
            <p className="body-sm text-gray-500 mb-8">Trusted by leading therapy practices</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="glass-card px-6 py-3">
                <span className="font-semibold text-gray-700">HIPAA Compliant</span>
              </div>
              <div className="glass-card px-6 py-3">
                <span className="font-semibold text-gray-700">SOC 2 Type II</span>
              </div>
              <div className="glass-card px-6 py-3">
                <span className="font-semibold text-gray-700">256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
} 