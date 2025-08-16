'use client';

import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, FireIcon, ChatBubbleBottomCenterTextIcon, HeartIcon } from '@heroicons/react/24/outline'
import { Card } from '../ui/Card'

const painPoints = [
  {
    title: 'The Awkward Money Talk Dilemma',
    description: 'You\'ve been dating a few months and really like them, but you have no idea if they\'re financially compatible. You want to know about their money habits, debt, and future goals - but how do you bring it up without killing the romance?',
    icon: <ChatBubbleBottomCenterTextIcon className="w-8 h-8" />
  },
  {
    title: 'Been Burned Before',
    description: 'You\'ve been hurt by getting serious with someone only to discover they have completely different money values. Maybe they were secretly drowning in debt, or had wildly unrealistic financial expectations.',
    icon: <FireIcon className="w-8 h-8" />
  },
  {
    title: 'The Romance vs. Reality Struggle',
    description: 'You know money is the #1 cause of relationship problems, but talking about finances feels awkward, boring, or like you\'re giving them a \'test.\' You want to connect deeper but don\'t know how to make money conversations feel natural.',
    icon: <ExclamationTriangleIcon className="w-8 h-8" />
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

export default function PainPoints() {
  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Sound Familiar?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            You're not alone. These are the most common challenges couples face when trying to discuss money early in their relationship.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {painPoints.map((point, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-3">
                      {point.icon}
                    </div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#222]">
                      {point.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600">
                    {point.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-xl p-8 shadow-lg max-w-3xl mx-auto text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            What Couples Get Wrong About Money Conversations
          </h3>
          <p className="text-gray-600">
            Most couples wait too long to discuss finances, thinking it will "kill the romance." But the truth is, having these conversations early - in a fun, low-pressure way - actually builds trust and intimacy. It's not about judging; it's about understanding each other's values and dreams.
          </p>
        </motion.div>
      </div>
    </section>
  )
} 