'use client'

import { useEffect, useCallback } from 'react'
import { APP_CONSTANTS, revealOnScroll } from '@/lib/utils'
import { ArrowRight, Shield, Lock, CheckCircle, Crown, Gift, Users } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { performanceMonitor, performanceUtils } from '@/lib/performance/monitor'
import Link from 'next/link'

export default function Hero() {
  const { user } = useAuth();
  
  useEffect(() => {
    // Measure hero section load time
    performanceUtils.measureExecutionTime(() => {
      revealOnScroll()
    }, 'hero_reveal_animation');
  }, [])

  const handleGetDemo = useCallback(() => {
    performanceMonitor.measureUserInteraction('hero_get_demo_click', 0);
    // Open Calendly for demo booking
    window.open('https://calendly.com/cartha-demo/30min', '_blank', 'width=800,height=600');
  }, []);

  const handleSeeFeatures = useCallback(() => {
    performanceMonitor.measureUserInteraction('hero_see_features_click', 0);
    // Scroll to features section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleDashboardClick = useCallback(() => {
    performanceMonitor.measureUserInteraction('hero_dashboard_click', 0);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden section-hero">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" />
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="container-modern relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 opacity-0 animate-fade-in">
            <span className="block mb-4 text-heading">
              Lightweight Client Management
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              That Actually Works
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-body mt-4">
              for Client-Focused Professionals
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-body mb-12 max-w-4xl mx-auto leading-relaxed opacity-0 animate-fade-in-delay">
            For therapists, psychologists, and counselors who work one-on-one or in small groups. Cartha handles your notes, billing, and client communication so you can focus on what matters: your clients.
          </p>
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 opacity-0 animate-fade-in-delay-2">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={handleDashboardClick}
                  className="group btn-primary px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl font-semibold flex items-center gap-3"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  onClick={handleSeeFeatures}
                  className="group btn-secondary px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl font-semibold flex items-center gap-3"
                >
                  See Features
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleGetDemo}
                  className="group btn-primary px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl font-semibold flex items-center gap-3"
                >
                  Get Private Demo
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={handleSeeFeatures}
                  className="group btn-secondary px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl font-semibold flex items-center gap-3"
                >
                  See Features
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 opacity-0 animate-fade-in-delay-4">
            <div className="flex items-center gap-2 card-primary px-4 py-3 rounded-lg backdrop-blur-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-body">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 card-primary px-4 py-3 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-body">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2 card-primary px-4 py-3 rounded-lg backdrop-blur-sm">
              <Lock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-body">256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance optimized styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
          will-change: opacity, transform;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.2s forwards;
          will-change: opacity, transform;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 0.4s forwards;
          will-change: opacity, transform;
        }
        
        .animate-fade-in-delay-4 {
          animation: fadeIn 1s ease-out 0.6s forwards;
          will-change: opacity, transform;
        }
      `}</style>
    </section>
  )
} 