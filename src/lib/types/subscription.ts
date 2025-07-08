export interface SubscriptionTier {
  id: number
  name: string
  slug: string
  price_monthly: number
  price_yearly: number
  conversation_limit: number | null // null means unlimited
  features: string[]
  stripe_price_id_monthly?: string
  stripe_price_id_yearly?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  tier_id: number
  stripe_customer_id?: string
  stripe_subscription_id?: string
  billing_interval: 'monthly' | 'yearly'
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete'
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  canceled_at?: string
  trial_start?: string
  trial_end?: string
  created_at: string
  updated_at: string
  tier?: SubscriptionTier
}

export interface ConversationUsage {
  id: string
  user_id: string
  month_year: string // YYYY-MM-DD format (first day of month)
  conversations_used: number
  conversations_limit: number | null
  reset_date: string
  created_at: string
  updated_at: string
}

export interface FeatureAccess {
  id: string
  user_id: string
  feature_name: string
  access_level: 'none' | 'basic' | 'full'
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  partner_id?: string
  template_id?: string
  title: string
  category?: string
  ai_model: string
  conversation_data: Record<string, any>
  status: 'draft' | 'active' | 'completed' | 'archived'
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface ConversationMessage {
  id: string
  conversation_id: string
  user_id: string
  message_type: 'user' | 'ai' | 'system'
  content: string
  metadata: Record<string, any>
  created_at: string
}

export interface ProgressTracking {
  id: string
  user_id: string
  partner_id?: string
  metric_name: string
  metric_value: number
  period_start: string
  period_end: string
  metadata: Record<string, any>
  created_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  assigned_to?: string
  resolved_at?: string
  created_at: string
  updated_at: string
}

export interface CoachingSession {
  id: string
  user_id: string
  partner_id?: string
  session_type: 'video_call' | 'group_session' | 'one_on_one'
  status: 'scheduled' | 'completed' | 'canceled' | 'no_show'
  scheduled_at: string
  duration_minutes: number
  coach_name?: string
  session_notes?: string
  recording_url?: string
  created_at: string
  updated_at: string
}

// Subscription helper types
export interface UserSubscriptionInfo {
  tier_name: string
  tier_slug: string
  conversation_limit: number | null
  features: string[]
  status: string
  period_end?: string
}

export interface ConversationLimitInfo {
  canStart: boolean
  usageThisMonth: number
  limit: number | null
  resetDate: string
  percentageUsed: number
}

export interface SubscriptionFeatures {
  // Conversation features
  basic_templates: boolean
  advanced_templates: boolean
  custom_templates: boolean
  unlimited_conversations: boolean
  
  // Analysis & tracking
  compatibility_assessment: boolean
  goal_tracking: boolean
  progress_reports: boolean
  analytics_dashboard: boolean
  
  // Content & resources
  foundational_articles: boolean
  financial_worksheets: boolean
  early_access: boolean
  
  // Community & support
  community_readonly: boolean
  community_participation: boolean
  email_support: boolean
  video_support: boolean
  priority_support: boolean
  
  // Premium features
  personal_ai_advisor: boolean
  financial_modeling: boolean
  account_integration: boolean
  expert_sessions: boolean
  coaching_calls: boolean
}

// Upgrade/downgrade types
export interface SubscriptionChange {
  from_tier_id: number
  to_tier_id: number
  billing_interval: 'monthly' | 'yearly'
  proration_amount?: number
  effective_date: string
}

export interface PricingCalculation {
  base_price: number
  discount_amount: number
  final_price: number
  savings_percentage: number
  next_billing_date: string
}

// Stripe-related types
export interface StripeCheckoutSession {
  session_id: string
  tier_id: number
  billing_interval: 'monthly' | 'yearly'
  success_url: string
  cancel_url: string
  customer_email?: string
}

export interface StripeWebhookEvent {
  id: string
  type: string
  data: {
    object: any
  }
  created: number
}

// API response types
export interface SubscriptionApiResponse {
  success: boolean
  data?: UserSubscription | UserSubscription[]
  error?: string
  message?: string
}

export interface UsageApiResponse {
  success: boolean
  data?: ConversationUsage | ConversationLimitInfo
  error?: string
  message?: string
}

export interface TierComparisonData {
  tiers: SubscriptionTier[]
  currentTier?: SubscriptionTier
  recommendedTier?: SubscriptionTier
  usageData?: ConversationUsage
}

// Feature flags and access control
export interface FeatureFlag {
  name: string
  enabled: boolean
  tiers: number[] // which tier IDs have access
  rollout_percentage?: number
}

export interface AccessControl {
  feature: string
  hasAccess: boolean
  tier_required?: number
  upgrade_message?: string
} 