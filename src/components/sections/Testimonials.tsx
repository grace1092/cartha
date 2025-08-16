'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "LMFT in CA",
      title: "Marriage & Family Therapist",
      practice: "Private Practice",
      content: "The AI note-taking feature helps streamline my documentation process. The interface feels secure and designed specifically for mental health professionals.",
      rating: 5,
      image: null // Anonymized for privacy
    },
    {
      name: "Licensed Psychologist",
      title: "Clinical Psychologist", 
      practice: "Group Practice",
      content: "The scheduling and client management tools work well for our small practice. The system feels thoughtfully designed for therapists rather than generic healthcare.",
      rating: 5,
      image: null // Anonymized for privacy
    }
  ];

  const stats = [
    { value: "Early access", label: "Beta testing program" },
    { value: "HIPAA-ready", label: "Security architecture" },
    { value: "In development", label: "SOC 2 compliance" }
  ];

  return (
    <section className="section-spacing section-secondary">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="heading-xl mb-6">
            Early user feedback
          </h2>
          <p className="subheading max-w-2xl mx-auto">
            Insights from mental health professionals testing our beta platform.
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