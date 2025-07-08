'use client';

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import Button from './Button'

interface EmailFormProps {
  onSubmit: (data: { email: string }) => Promise<void>
  placeholder?: string
  buttonText?: string
  className?: string
}

export default function EmailForm({
  onSubmit,
  placeholder = 'Enter your email',
  buttonText = 'Get Early Access',
  className = '',
}: EmailFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<{ email: string }>()

  const handleFormSubmit = async (data: { email: string }) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      setIsSuccess(true)
      reset()
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`relative flex flex-col sm:flex-row gap-3 ${className}`}
    >
      <div className="flex-1">
        <input
          type="email"
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent`}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          disabled={isSubmitting}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="sm:w-auto"
      >
        {isSuccess ? '✓ Success!' : buttonText}
      </Button>
    </form>
  )
} 