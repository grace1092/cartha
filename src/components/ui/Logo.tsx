'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center justify-center ${className}`}
    >
      <div className={`flex items-center ${sizes[size]}`}>
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl px-4 py-2 flex items-center justify-center">
          <span className="text-2xl">MT</span>
        </div>
        <div className="ml-3">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#667eea] to-[#764ba2]">
            MoneyTalks
          </div>
          <div className="text-sm text-gray-600">
            Before Marriage™
          </div>
        </div>
      </div>
    </motion.div>
  );
} 