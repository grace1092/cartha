import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone number validation
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone)
}

// Generate invitation email content
export function generateInvitationEmail(senderName: string, customMessage?: string): string {
  return `
Hi there!

${senderName} has invited you to join MoneyTalks Before Marriage - a safe space for couples to have important money conversations.

${customMessage ? `Personal message: "${customMessage}"` : ''}

Getting started with financial discussions has never been easier. Join thousands of couples who are building stronger relationships through better money communication.

Click the link below to accept the invitation and start your journey together.

Best regards,
The MoneyTalks Team
  `.trim()
}

// Generate SMS invitation content
export function generateSMSInvitation(senderName: string): string {
  return `${senderName} invited you to MoneyTalks Before Marriage! Join thousands of couples building stronger relationships through better money conversations. Click to accept:`
}

// Get relationship status color
export function getRelationshipStatusColor(status: string): string {
  switch (status) {
    case 'dating':
      return 'bg-blue-100 text-blue-800'
    case 'engaged':
      return 'bg-purple-100 text-purple-800'
    case 'married':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get connection strength label
export function getConnectionStrengthLabel(strength: number): string {
  if (strength >= 80) return 'Strong'
  if (strength >= 60) return 'Good'
  if (strength >= 40) return 'Fair'
  return 'Needs Work'
}

// Get connection strength color
export function getConnectionStrengthColor(strength: number): string {
  if (strength >= 80) return 'text-green-600'
  if (strength >= 60) return 'text-blue-600'
  if (strength >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

// Smooth scrolling
export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

// Scroll reveal animation
export function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  )

  const elements = document.querySelectorAll('.scroll-reveal')
  elements.forEach((el) => observer.observe(el))

  return () => {
    elements.forEach((el) => observer.unobserve(el))
  }
}

// Format date for display
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format time for display
export function formatTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Generate client initials
export function getClientInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Calculate age from date of birth
export function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const APP_CONSTANTS = {
  APP_NAME: 'Cartha',
  TAGLINE: 'Modern Practice Management for Therapists',
  DESCRIPTION: 'Streamline your therapy practice with intelligent session notes, automated follow-ups, and comprehensive client dashboards.',
  USERS_COUNT: '10,000+',
  THERAPISTS_COUNT: '5,000+',
  SESSIONS_COUNT: '100,000+',
  CARD_COUNT: '150+',
  PRICE: '$29/month',
  SOCIAL_LINKS: {
    TWITTER: 'https://twitter.com/cartha',
    LINKEDIN: 'https://linkedin.com/company/cartha',
    INSTAGRAM: 'https://instagram.com/cartha',
    EMAIL: 'hello@cartha.com',
  },
  FEATURES: {
    SESSION_NOTES: {
      title: 'Smart Session Notes',
      description: 'AI-powered transcription and SOAP note generation',
      icon: '📝',
    },
    FOLLOW_UP_EMAILS: {
      title: 'Follow-up Emails',
      description: 'Automated, personalized client communications',
      icon: '📧',
    },
    CLIENT_DASHBOARD: {
      title: 'Client Dashboard',
      description: 'Comprehensive progress tracking and insights',
      icon: '📊',
    },
  },
} 