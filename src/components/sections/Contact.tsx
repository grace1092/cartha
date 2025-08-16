'use client'

import { useState, useEffect } from 'react'
import { revealOnScroll } from '@/lib/utils'
import { Mail, Phone, MapPin, Clock, Shield, MessageSquare, Users, HelpCircle, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    practiceType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null)

  useEffect(() => {
    revealOnScroll()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: '', email: '', practiceType: '', message: '' })
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  const faqData = [
    {
      question: "Is CARTHA HIPAA compliant?",
      answer: "Yes, CARTHA is fully HIPAA compliant. We implement enterprise-grade security measures including end-to-end encryption, secure data centers, and regular security audits. All data is encrypted both in transit and at rest."
    },
    {
      question: "How quickly can I get started with CARTHA?",
      answer: "You can start using CARTHA immediately after signing up. Our platform is designed for instant onboarding with guided setup wizards, video tutorials, and dedicated support to get you up and running within minutes."
    },
    {
      question: "What types of therapy practices does CARTHA support?",
      answer: "CARTHA is designed for all types of mental health professionals including individual therapists, group practices, clinics, and mental health organizations. We support various specialties and practice sizes."
    },
    {
      question: "Can I integrate CARTHA with my existing systems?",
      answer: "Yes, CARTHA offers seamless integrations with popular EHR systems, calendar applications, payment processors, and other healthcare tools. Our API allows for custom integrations as well."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide comprehensive support including live chat, email support, video calls, and extensive documentation. Our support team includes healthcare professionals who understand your specific needs."
    },
    {
      question: "Is my client data secure and private?",
      answer: "Absolutely. We take data security seriously with SOC 2 Type II certification, 256-bit SSL encryption, regular security audits, and strict access controls. Your clients' privacy is our top priority."
    }
  ]

  return (
    <section id="contact" className="py-20 section-contact">
      <div className="container-modern">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 opacity-0 animate-fade-in">
            <span className="animated-gradient bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h2>
          <p className="text-xl text-body mb-8 leading-relaxed opacity-0 animate-fade-in-delay">
            Ready to transform your therapy practice? Our team of healthcare technology experts is here to help you get started.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-0 animate-fade-in-delay-2">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-body">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Clock className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-body">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-body">SOC 2 Certified</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="opacity-0 animate-fade-in-delay-3">
              <div className="bg-card rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-heading">Send us a Message</h3>
                
                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-medium">Thank you! We'll get back to you within 24 hours.</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-body mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-input text-body"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-body mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-input text-body"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="practiceType" className="block text-sm font-medium text-body mb-2">
                      Practice Type
                    </label>
                    <select
                      id="practiceType"
                      name="practiceType"
                      value={formData.practiceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-input text-body"
                    >
                      <option value="">Select your practice type</option>
                      <option value="individual">Individual Therapist</option>
                      <option value="group">Group Practice</option>
                      <option value="clinic">Mental Health Clinic</option>
                      <option value="organization">Healthcare Organization</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-body mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-input-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none bg-input text-body"
                      placeholder="Tell us about your practice and how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-primary-800 font-medium mb-1">HIPAA Compliant Contact</p>
                      <p className="text-xs text-primary-700">
                        All information submitted through this form is encrypted and handled in accordance with HIPAA guidelines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 opacity-0 animate-fade-in-delay-4">
              {/* Contact Methods */}
              <div className="bg-card rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-heading">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-heading mb-1">Email Support</h4>
                      <p className="text-body mb-2">support@cartha.com</p>
                      <p className="text-sm text-muted">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-heading mb-1">Phone Support</h4>
                      <p className="text-body mb-2">+1 (555) 123-4567</p>
                      <p className="text-sm text-muted">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-heading mb-1">Office Location</h4>
                      <p className="text-body mb-2">123 Healthcare Ave, Suite 100<br />San Francisco, CA 94105</p>
                      <p className="text-sm text-muted">By appointment only</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-card rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-heading">Frequently Asked Questions</h3>
                
                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <div key={index} className="border border-card-border rounded-lg">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-card-hover transition-colors"
                      >
                        <span className="font-medium text-heading">{faq.question}</span>
                        <HelpCircle className={`w-5 h-5 text-muted transition-transform ${activeFAQ === index ? 'rotate-180' : ''}`} />
                      </button>
                      {activeFAQ === index && (
                        <div className="px-4 pb-3">
                          <p className="text-body text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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
        
        .animate-fade-in-delay-4 {
          animation: fadeIn 0.8s ease-out 0.8s forwards;
        }
      `}</style>
    </section>
  )
} 