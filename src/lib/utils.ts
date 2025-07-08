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
          entry.target.classList.add('animate-in')
          entry.target.classList.remove('opacity-0', 'translate-y-8')
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  )

  const elements = document.querySelectorAll('.reveal-on-scroll')
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
  PRICE: '$29/month',
  SOCIAL_LINKS: {
    TWITTER: 'https://twitter.com/cartha',
    LINKEDIN: 'https://linkedin.com/company/cartha',
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