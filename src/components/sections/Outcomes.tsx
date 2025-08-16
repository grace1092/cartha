'use client';

import { motion } from 'framer-motion'
import { Card } from '../ui/Card'
import { HeartIcon, CheckBadgeIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

const outcomes = [
  {
    title: 'Money Talks Become Your Favorite Dates',
    description: 'Money conversations become your favorite part of date night. You both feel excited to share your dreams, fears, and financial goals. These talks bring you closer together instead of creating tension.',
    icon: <HeartIcon className="w-8 h-8" />
  },
  {
    title: 'Complete Financial Transparency',
    description: 'You know exactly where you stand financially - their debt situation, spending habits, and money values. No surprises, no discoveries months later that make you question everything.',
    icon: <CheckBadgeIcon className="w-8 h-8" />
  },
  {
    title: 'Confident Relationship Decisions',
    description: 'You either confirm you\'re amazingly compatible (and move forward with confidence) or discover incompatibilities early when it\'s easier to make decisions without massive emotional investment.',
    icon: <RocketLaunchIcon className="w-8 h-8" />
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Outcomes() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-r from-primary-start/5 to-primary-end/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Imagine Having Complete Financial Clarity By Date 10
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your dating experience from uncertainty to confidence with meaningful conversations that matter.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {outcomes.map((outcome, index) => (
            <motion.div key={index} variants={item}>
              <Card
                title={outcome.title}
                description={outcome.description}
                icon={outcome.icon}
                variant="gradient"
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 