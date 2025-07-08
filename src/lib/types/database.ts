export type SubscriptionStatus = 'trial' | 'active' | 'canceled' | 'past_due'
export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise'
export type SessionStatus = 'draft' | 'completed' | 'billed'

export interface Profile {
  id: string
  email: string
  full_name?: string
  practice_name?: string
  phone?: string
  license_number?: string
  subscription_status: SubscriptionStatus
  subscription_plan: SubscriptionPlan
  stripe_customer_id?: string
  trial_ends_at: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  therapist_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  intake_date: string
  treatment_goals?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TherapySession {
  id: string
  client_id: string
  therapist_id: string
  session_date: string
  duration_minutes: number
  session_type: string
  bullet_notes?: string
  soap_summary?: string
  follow_up_email?: string
  status: SessionStatus
  session_number?: number
  created_at: string
  updated_at: string
}

export interface ClientFile {
  id: string
  client_id: string
  therapist_id: string
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  description?: string
  uploaded_at: string
}

export interface SubscriptionHistory {
  id: string
  user_id: string
  stripe_subscription_id?: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_start?: string
  current_period_end?: string
  created_at: string
}

export interface UsageTracking {
  id: string
  user_id: string
  feature_type: string
  usage_date: string
  usage_count: number
  created_at: string
}

// Form types
export interface CreateClientForm {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  treatment_goals?: string
  notes?: string
}

export interface CreateSessionForm {
  client_id: string
  session_date: string
  duration_minutes: number
  session_type: string
  bullet_notes?: string
}

export interface UpdateProfileForm {
  full_name?: string
  practice_name?: string
  phone?: string
  license_number?: string
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  per_page: number
  total_pages: number
}

// Dashboard stats
export interface DashboardStats {
  total_clients: number
  active_clients: number
  sessions_this_week: number
  sessions_this_month: number
  upcoming_sessions: number
}

// OpenAI API types
export interface SoapGenerationRequest {
  bulletNotes: string
  clientName: string
  sessionDate: string
}

export interface SoapGenerationResponse {
  soapSummary: string
}

export interface FollowUpEmailRequest {
  soapSummary: string
  clientName: string
  therapistName: string
}

export interface FollowUpEmailResponse {
  followUpEmail: string
}

// Stripe types
export interface StripeCheckoutRequest {
  priceId: string
  successUrl: string
  cancelUrl: string
}

export interface StripeCheckoutResponse {
  sessionId: string
}

// File upload types
export interface FileUploadResponse {
  url: string
  path: string
}

export interface UploadedFile {
  file: File
  preview?: string
}

// Subscription limits
export const SUBSCRIPTION_LIMITS = {
  starter: {
    soap_generation: 50,
    follow_up_email: 25,
    pdf_export: 10,
    max_clients: 50,
  },
  professional: {
    soap_generation: 500,
    follow_up_email: 200,
    pdf_export: 100,
    max_clients: -1, // unlimited
  },
  enterprise: {
    soap_generation: -1, // unlimited
    follow_up_email: -1, // unlimited
    pdf_export: -1, // unlimited
    max_clients: -1, // unlimited
  },
} as const 