'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, TrendingUp } from 'lucide-react';

const MakeDifference = () => {
  const impactAreas = [
    {
      icon: Heart,
      title: "Change Your Relationship",
      description: "Use the app to understand your partner like never before — build emotional security, make aligned choices, and avoid years of painful miscommunication.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Inspire Others", 
      description: "Every couple who gets clarity adds to a generation of relationships that are healthier, wiser, and better equipped for real life.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: TrendingUp,
      title: "Break the Taboo",
      description: "Money shouldn't be a mystery or a power struggle in love. By normalizing financial intimacy, you're helping shift culture for good.",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            🌱 Make a Difference in Your Own Relationship — and for Others
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your relationship while contributing to a cultural shift toward healthier, more transparent partnerships.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {impactAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  {/* Number Badge */}
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${area.color} flex items-center justify-center text-white font-bold text-lg mr-4`}>
                      {index + 1}
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${area.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {area.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {area.description}
                  </p>

                  {/* Decorative gradient line */}
                  <div className={`w-full h-1 bg-gradient-to-r ${area.color} rounded-full mt-6`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to be part of the change?
            </h3>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of couples who are already transforming their relationships and helping create a new standard for love and money.
            </p>
            <button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors duration-200 text-lg">
              Start Your Journey Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MakeDifference; 