'use client'

import { useEffect, useState } from 'react'
import { Crown, Lock, Gift, Users, Clock, Star, TrendingUp } from 'lucide-react'
import { revealOnScroll } from '@/lib/utils'

export default function Stats() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    revealOnScroll()
    
    // Set deadline to 7 days from now
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 7)
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = deadline.getTime() - now
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const foundingMemberBenefits = [
    {
      icon: Crown,
      title: '30% Lifetime Discount',
      description: 'Lock in the founding member rate forever'
    },
    {
      icon: Gift,
      title: '3 Invite Codes',
      description: 'Share with colleagues and earn rewards'
    },
    {
      icon: Users,
      title: 'Exclusive Community',
      description: 'Access to founding member network'
    },
    {
      icon: Lock,
      title: 'Early Access',
      description: 'Be first to try new features'
    }
  ]

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container-modern">
        {/* Founding Member Countdown */}
        <div className="text-center mb-16">
          <div className="scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown className="w-10 h-10 text-yellow-500" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Founding Member Access
              </h2>
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join the first 500 therapists and secure exclusive benefits that will never be offered again
            </p>
          </div>
          
          {/* Countdown Timer */}
          <div className="scroll-reveal" style={{ animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Limited Time Offer Ends In:</h3>
              <div className="flex justify-center gap-4 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-white/20 rounded-lg px-4 py-2">
                    {timeLeft.days}
                  </div>
                  <div className="text-sm mt-2">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-white/20 rounded-lg px-4 py-2">
                    {timeLeft.hours}
                  </div>
                  <div className="text-sm mt-2">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-white/20 rounded-lg px-4 py-2">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-sm mt-2">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-white/20 rounded-lg px-4 py-2">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-sm mt-2">Seconds</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className="text-yellow-300 font-bold text-lg">87/500 Seats Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Founding Member Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {foundingMemberBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={benefit.title}
                className="scroll-reveal group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <div className="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    {benefit.title}
                  </div>

                  {/* Description */}
                  <div className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Removed the CTA section as requested */}

      </div>
    </section>
  )
} 