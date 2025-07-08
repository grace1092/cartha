'use client';

import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { APP_CONSTANTS } from '@/lib/utils'

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-500 to-pink-500 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Don't Waste Another Month Wondering 'What If'
          </h2>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
            Join {APP_CONSTANTS.TOTAL_USERS} couples who've taken control of their relationship's future by understanding their financial compatibility early.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              className="bg-white text-red-500 hover:bg-white/90 min-w-[200px]"
            >
              Download MoneyTalks Tonight
            </Button>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-lg text-white/80">
              30-day money-back guarantee
            </p>
            <p className="text-white/60">
              Available on iOS and Android
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 