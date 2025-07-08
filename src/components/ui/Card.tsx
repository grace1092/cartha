'use client';

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  title?: string
  description?: string
  icon?: ReactNode
  className?: string
  variant?: 'default' | 'gradient' | 'outline'
  children?: ReactNode
}

export default function Card({
  title,
  description,
  icon,
  className,
  variant = 'default',
  children
}: CardProps) {
  const variants = {
    default: 'bg-white shadow-lg',
    gradient: 'bg-gradient-to-r from-primary-start to-primary-end text-white',
    outline: 'border-2 border-gray-200 hover:border-primary-start',
  }

  return (
    <motion.div
      className={cn(
        'rounded-xl p-6 transition-all',
        variants[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}
      {title && (
        <h3 className={cn(
          'text-xl font-bold mb-2',
          variant === 'gradient' ? 'text-white' : 'text-gray-900'
        )}>
          {title}
        </h3>
      )}
      {description && (
        <p className={cn(
          'text-base',
          variant === 'gradient' ? 'text-white/90' : 'text-gray-600'
        )}>
          {description}
        </p>
      )}
      {children}
    </motion.div>
  )
} 