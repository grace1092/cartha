'use client'

import { useEffect } from 'react'
import { APP_CONSTANTS, revealOnScroll } from '@/lib/utils'
import { ArrowRight, Shield, Lock, CheckCircle } from 'lucide-react'

export default function Hero() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="container-modern relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 opacity-0 animate-fade-in">
            <span className="animated-gradient bg-clip-text text-transparent inline-block">
              Modern Practice Management That Actually Saves Time for Therapists
            </span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-delay">
            Intelligent session notes, automated follow-ups, and comprehensive client management designed specifically for therapists. Spend less time on paperwork, more time with clients.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 opacity-0 animate-fade-in-delay-2">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 transform">
              Start Your Free Trial <ArrowRight className="w-6 h-6" />
            </button>
            <button className="bg-white border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-xl text-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transform">
              Watch Demo <span className="ml-1">😊</span>
            </button>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-0 animate-fade-in-delay-3">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Lock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
        }
        
        .animate-fade-in-delay-3 {
          animation: fadeIn 0.8s ease-out 0.6s forwards;
        }
      `}</style>
    </section>
  )
} 