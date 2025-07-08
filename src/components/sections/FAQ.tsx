'use client';

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

const faqs = [
  {
    question: 'How does Cartha help with session documentation?',
    answer: 'Cartha provides AI-powered transcription and analysis that automatically creates detailed session notes. Instead of spending hours writing notes, our app creates comprehensive documentation that tracks client progress and treatment plans.'
  },
  {
    question: 'Is my client data secure and HIPAA compliant?',
    answer: 'Yes, Cartha is built with healthcare-grade security and is fully HIPAA compliant. All client data is encrypted, and we follow strict privacy protocols to protect sensitive information.'
  },
  {
    question: 'Can I customize the automated follow-up emails?',
    answer: 'Absolutely! Cartha provides personalized email templates that you can customize for your practice. The system automatically sends follow-ups while maintaining your professional voice and brand.'
  },
  {
    question: 'How does the client dashboard work?',
    answer: 'The client dashboard provides a comprehensive overview of each client\'s progress, including session history, treatment milestones, and interactive charts. You can track outcomes and share progress reports with clients.'
  },
  {
    question: 'What integrations does Cartha support?',
    answer: 'Cartha integrates with popular practice management tools like Stripe for payments, Alma for insurance, and SimplePractice for scheduling. We\'re constantly adding new integrations based on therapist needs.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 lg:py-32 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container-modern relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="scroll-reveal">
            <h2 className="heading-xl mb-6">
              Frequently Asked
              <span className="gradient-text"> Questions</span>
            </h2>
          </div>
          <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
            <p className="body-lg max-w-3xl mx-auto">
              Everything you need to know about Cartha and how it can transform your therapy practice.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-gray-600">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 