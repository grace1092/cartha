'use client';

import { motion } from 'framer-motion'
import { Card } from '../ui/Card'
import { APP_CONSTANTS } from '@/lib/utils'
import {
  CreditCardIcon,
  ChartBarIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ChartBarSquareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    title: `${APP_CONSTANTS.CARD_COUNT} Expert Cards`,
    description: 'Carefully curated questions designed by relationship and financial experts.',
    icon: <CreditCardIcon className="w-8 h-8" />
  },
  {
    title: 'Progressive Intimacy',
    description: 'Questions organized by intimacy level, perfect for naturally deepening your connection.',
    icon: <ChartBarIcon className="w-8 h-8" />
  },
  {
    title: 'Deep Topics',
    description: 'Explore money beliefs, prenups, lifestyle sacrifices, and more with thoughtful prompts.',
    icon: <HeartIcon className="w-8 h-8" />
  },
  {
    title: 'Conversation Starters',
    description: 'Built-in follow-up questions to keep the conversation flowing naturally.',
    icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your compatibility journey and identify areas for deeper discussion.',
    icon: <ChartBarSquareIcon className="w-8 h-8" />
  },
  {
    title: 'Red Flag Guidance',
    description: 'Expert insights on potential warning signs and how to address them constructively.',
    icon: <ExclamationTriangleIcon className="w-8 h-8" />
  }
]

const steps = [
  {
    title: 'Pick Your Moment',
    description: 'Choose perfect settings with app suggestions for meaningful conversations.'
  },
  {
    title: 'Draw & Discuss',
    description: 'Explore thoughtful prompts about money beliefs and values together.'
  },
  {
    title: 'Discover & Decide',
    description: 'Build a clear picture of your financial compatibility over multiple dates.'
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Product() {
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
            Introducing {APP_CONSTANTS.APP_NAME}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            The couples compatibility card game app with {APP_CONSTANTS.CARD_COUNT} curated conversation prompts designed specifically for dating couples (dates 3-10).
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex items-center"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-start text-white font-bold text-lg mr-4">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-3">
                      {feature.icon}
                    </div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#222]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 