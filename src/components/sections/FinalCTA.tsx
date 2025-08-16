'use client'

import { useEffect } from 'react'
import { ArrowRight, CheckCircle, Clock, Users } from 'lucide-react'
import { revealOnScroll } from '@/lib/utils'

export default function FinalCTA() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  const benefits = [
    {
      icon: Clock,
      text: '14-day free trial'
    },
    {
      icon: CheckCircle,
      text: 'No setup fees'
    },
    {
      icon: Users,
      text: 'Cancel anytime'
    }
  ]

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container-modern relative z-10">
        <div className="text-center">
          <div className="scroll-reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to transform your practice?
            </h2>
          </div>
          
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join hundreds of therapists who have streamlined their workflow with Cartha. 
              Start your free trial today and see the difference AI-powered practice management can make.
            </p>
          </div>

          {/* Benefits */}
          <div className="scroll-reveal mb-12" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div key={benefit.text} className="flex items-center space-x-2 text-blue-100">
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="scroll-reveal" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                Schedule Demo
                <Clock className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="scroll-reveal mt-12" style={{ animationDelay: '0.5s' }}>
            <p className="text-blue-200 text-sm mb-6">
              Trusted by leading mental health organizations
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 opacity-80">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-white">HIPAA Compliant</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-white">SOC 2 Type II</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-white">256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
