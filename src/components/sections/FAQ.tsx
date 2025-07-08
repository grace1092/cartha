'use client';

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

const faqs = [
  {
    question: 'How is this different from just talking about money?',
    answer: 'MoneyTalks provides expertly crafted questions that progressively build intimacy and trust. Instead of awkward direct questions, our app creates a game-like experience that makes these conversations natural and fun. Plus, our structured approach ensures you cover all important topics systematically.'
  },
  {
    question: 'Is this appropriate for early dating?',
    answer: "Yes! In fact, dates 3-10 are the perfect time to start these conversations. Our questions are designed to start light and gradually become deeper as trust builds. This helps you discover financial compatibility before you're too emotionally invested.",
  },
  {
    question: 'What if we discover we\'re incompatible?',
    answer: 'Better to know early! Our app helps you identify both compatibility and potential areas for compromise. If major incompatibilities are discovered, you can make informed decisions about your relationship\'s future before investing years of emotional energy.'
  },
  {
    question: 'How long does each conversation take?',
    answer: 'Most couples spend 15-30 minutes per session, but you can go at your own pace. The app is designed to be flexible - use it during dinner, on walks, or any time you want to deepen your connection.'
  },
  {
    question: 'Do we need to use all the cards?',
    answer: 'No, you can use the app however works best for you. Some couples go through all cards systematically, while others pick topics that feel most relevant. The app tracks your progress so you can easily pick up where you left off.'
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied with the app for any reason, we\'ll refund your purchase, no questions asked.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about MoneyTalks Before Marriage™
          </p>
        </motion.div>

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