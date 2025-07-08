'use client'

import { useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { revealOnScroll } from '@/lib/utils'

export default function Testimonials() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Licensed Clinical Psychologist',
      practice: 'Mindful Therapy Group',
      content: 'Cartha has completely transformed how I manage my practice. The AI session notes save me hours every week, and my clients love the automated follow-ups. It\'s like having a virtual assistant that actually understands therapy.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Marriage & Family Therapist',
      practice: 'Chen Family Counseling',
      content: 'The client dashboard is incredible. I can track progress, manage appointments, and generate reports all in one place. My practice efficiency has improved by 40% since switching to Cartha.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Clinical Social Worker',
      practice: 'Healing Hearts Therapy',
      content: 'As a solo practitioner, I was drowning in administrative tasks. Cartha automated everything from scheduling to note-taking. Now I can focus on what I do best - helping my clients heal.',
      rating: 5,
      avatar: 'ER'
    }
  ]

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-modern">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="scroll-reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What therapists are saying
            </h2>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join hundreds of satisfied therapists who have transformed their practice with Cartha
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="scroll-reveal group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full">
                {/* Quote Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 mb-8 leading-relaxed italic">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.practice}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="scroll-reveal" style={{ animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 max-w-4xl mx-auto text-white shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Ready to join them?
              </h3>
              <p className="text-lg mb-8 text-blue-100 leading-relaxed">
                Start your free trial today and see why hundreds of therapists choose Cartha
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Start Free Trial
                </button>
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
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