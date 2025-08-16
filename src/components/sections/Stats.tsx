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
    <section className="py-20 lg:py-28 section-stats">
      <div className="container-modern">
        {/* Founding Member Program Header */}
        <div className="text-center mb-16">
          <div className="scroll-reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-heading mb-6">
              Founding Member Program
            </h2>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-body max-w-3xl mx-auto mb-8">
              Charter member pricing honored for life. Exclusive member enrollment. Enrollment closes August 1, 2024.
            </p>
          </div>
        </div>

        {/* Professional Value Bullets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-card-border h-full text-left flex flex-col justify-center">
            <ul className="space-y-6 text-lg text-body">
              <li><span className="font-bold text-primary-600">•</span> Join the first 500 therapists shaping the future of practice management</li>
              <li><span className="font-bold text-primary-600">•</span> Collaborate directly with our team on product development</li>
              <li><span className="font-bold text-primary-600">•</span> Access to exclusive clinical workflows and templates</li>
              <li><span className="font-bold text-primary-600">•</span> Priority support from healthcare technology specialists</li>
              <li><span className="font-bold text-primary-600">•</span> Direct access to founders and clinical advisors</li>
              <li><span className="font-bold text-primary-600">•</span> Professional development & influence in roadmap</li>
              <li><span className="font-bold text-primary-600">•</span> Investment protection: Charter pricing locked for life</li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <div className="flex items-center gap-2 bg-card/90 px-4 py-2 rounded-lg shadow border border-card-border">
                <span className="text-green-600 font-bold">●</span>
                <span className="text-sm font-semibold text-body">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-card/90 px-4 py-2 rounded-lg shadow border border-card-border">
                <span className="text-primary-600 font-bold">●</span>
                <span className="text-sm font-semibold text-body">APA Approved</span>
              </div>
              <div className="flex items-center gap-2 bg-card/90 px-4 py-2 rounded-lg shadow border border-card-border">
                <span className="text-purple-600 font-bold">●</span>
                <span className="text-sm font-semibold text-body">SOC 2 Type II</span>
              </div>
            </div>
            <div className="text-center text-muted text-sm">Enrollment closes <span className="font-semibold text-body">August 1, 2024</span></div>
          </div>
        </div>

        {/* Testimonials Placeholder */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6 text-heading">What Respected Therapists Are Saying</h3>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {/* Example testimonial card */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-card-border max-w-md mx-auto flex flex-col justify-between">
              <p className="text-lg text-body mb-4">"Cartha's founding member program gave me a real voice in shaping the tools I use every day. The team truly listens."</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-primary-200" />
                <div className="text-left">
                  <div className="font-semibold text-heading">Dr. Jane Smith, PhD</div>
                  <div className="text-sm text-muted">Licensed Clinical Psychologist</div>
                </div>
              </div>
            </div>
            {/* Add more testimonials as needed */}
          </div>
        </div>
      </div>
    </section>
  )
} 