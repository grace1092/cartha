'use client';

import { motion } from 'framer-motion'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid'

export default function Founder() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute -top-4 left-0 text-primary-start/10">
            <ChatBubbleLeftIcon className="w-16 h-16" />
          </div>
          
          <div className="relative bg-white rounded-xl shadow-lg p-8 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                A Message From Our Founder
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-start to-primary-end mx-auto" />
            </div>

            <div className="text-lg sm:text-xl text-gray-600 space-y-6">
              <p>
                "We created MoneyTalks Before Marriage™ after watching too many friends waste years in financially incompatible relationships. The couples who make it aren't lucky - they're informed."
              </p>
              <p>
                "They have these conversations early, when it's still fun and low-stakes. We've turned relationship experts' best questions into a game that actually brings couples closer together while revealing the truth about financial compatibility."
              </p>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-start to-primary-end flex items-center justify-center">
                  <span className="text-white font-bold text-xl">GT</span>
                </div>
                <div className="ml-4 text-left">
                  <div className="font-semibold text-gray-900">Grace Tan</div>
                  <div className="text-sm text-gray-500">Founder & CEO</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 