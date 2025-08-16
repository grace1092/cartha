'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      title: "Licensed Clinical Psychologist",
      practice: "Mindful Therapy Center",
      content: "Cartha has revolutionized my practice. What used to take me 30 minutes of documentation now takes less than 3 minutes. The AI-generated notes are incredibly accurate and capture nuances I sometimes miss during sessions.",
      rating: 5,
      image: "/api/placeholder/64/64" // Placeholder for professional headshot
    },
    {
      name: "Marcus Rodriguez, LMFT",
      title: "Marriage & Family Therapist",
      practice: "Couples Connect Therapy",
      content: "The quality of session notes is outstanding. Cartha doesn't just transcribe—it understands therapeutic concepts and formats everything perfectly for insurance and clinical review. It's like having a skilled assistant.",
      rating: 5,
      image: "/api/placeholder/64/64"
    }
  ];

  const stats = [
    { value: "92%", label: "Time saved on documentation" },
    { value: "99%", label: "Accuracy in session notes" },
    { value: "4.9/5", label: "Average therapist rating" }
  ];

  return (
    <section className="section-spacing section-secondary">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="heading-xl mb-6">
            Trusted by professionals who care about quality
          </h2>
          <p className="subheading max-w-2xl mx-auto">
            Join hundreds of therapists, psychologists, and counselors who've transformed 
            their practice with AI-powered documentation.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 lg:mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="heading-xl text-blue-600 mb-2">{stat.value}</div>
              <p className="body-md text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-blue-200" />
                </div>

                {/* Testimonial Content */}
                <blockquote className="body-lg text-slate-700 mb-8 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl flex items-center justify-center">
                      <span className="text-blue-700 font-semibold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">
                      {testimonial.name}
                    </div>
                    <div className="body-sm text-slate-600 mb-1">
                      {testimonial.title}
                    </div>
                    <div className="body-sm text-slate-500">
                      {testimonial.practice}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="inline-flex items-center gap-8 text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="body-sm">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="body-sm">SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="body-sm">256-bit Encryption</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="btn-primary">
            Join These Professionals
          </button>
          <p className="body-sm text-slate-500 mt-4">
            Start your free trial • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;