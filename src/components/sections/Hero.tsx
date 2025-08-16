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
    // Route to dashboard for trial
    window.location.href = '/dashboard';
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
      
      <div className="container-luxury relative z-10">
        <div className="max-w-6xl mx-auto text-center">
                    {/* Main Headline */}
          <h1 className="heading-hero mb-8 opacity-0 animate-fade-in">
            <span className="block mb-6">
              Modern practice management for therapists,
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              not busywork.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="subheading mb-16 max-w-4xl mx-auto opacity-0 animate-fade-in-delay">
            AI session notes, follow-ups, and client dashboards in one secure place.
          </p>
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 opacity-0 animate-fade-in-delay-2">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={handleDashboardClick}
                  className="group btn-luxury flex items-center gap-3"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  onClick={handleSeeFeatures}
                  className="group btn-secondary flex items-center gap-3"
                >
                  See Features
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <>
                                 <button
                   onClick={handleGetDemo}
                   className="group btn-luxury flex items-center gap-3"
                 >
                   Start Free Trial
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <button
                   onClick={handleSeeFeatures}
                   className="group btn-secondary flex items-center gap-3"
                 >
                   Watch 60-sec Demo
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
              </>
            )}
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 opacity-0 animate-fade-in-delay-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">HIPAA-ready architecture</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <CheckCircle className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">SOC 2 audit in progress</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Lock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Security-first design</span>
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