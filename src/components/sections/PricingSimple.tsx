'use client';

import React from 'react';
import { Check, Users, Building, Shield } from 'lucide-react';

const PricingSimple = () => {
  const plans = [
    {
      name: 'Solo',
      price: 50,
      originalPrice: 75,
      description: 'Perfect for individual therapists and counselors',
      features: [
        'AI-powered session notes',
        'Client scheduling & management', 
        'Secure messaging portal',
        'Basic billing & invoicing',
        'HIPAA-ready architecture',
        'Email support'
      ],
      icon: Users,
      popular: false
    },
    {
      name: 'Group',
      price: 150,
      originalPrice: 200,
      description: 'For small practices and teams',
      features: [
        'Everything in Solo, plus:',
        'Multi-user collaboration',
        'Shared client records',
        'Team scheduling',
        'Advanced billing features',
        'Priority support'
      ],
      icon: Building,
      popular: true
    },
    {
      name: 'Organization',
      price: 500,
      originalPrice: 600,
      description: 'For clinics and large practices',
      features: [
        'Everything in Group, plus:',
        'Unlimited users',
        'Custom integrations',
        'Advanced analytics',
        'Dedicated account manager',
        '24/7 priority support'
      ],
      icon: Shield,
      popular: false
    }
  ];

  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-xl mb-6">Simple pricing for therapy practices</h2>
          <p className="subheading mb-8 max-w-2xl mx-auto">
            Cancel anytime • No setup fees • 14-day free trial
          </p>
          
          {/* Founding Member Banner */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 border border-amber-200 rounded-full text-amber-800 mb-4">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            <span className="font-semibold">⚡ Founding Member pricing (30% off for life) • 10 seats left</span>
          </div>
          <div>
            <button className="text-sm text-gray-600 hover:text-gray-800 underline">
              See standard pricing →
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-500 line-through">${plan.originalPrice}/month</span>
                    <span className="text-sm font-medium text-green-600">30% off</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  Start Free Trial
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Elements */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-600 mb-6">
            Trusted by mental health professionals • HIPAA-ready architecture • SOC 2 audit in progress
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <span>Cancel anytime</span>
            <span>•</span>
            <span>No setup fees</span>
            <span>•</span>
            <span>14-day free trial</span>
            <span>•</span>
            <span>Migration support included</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSimple;
