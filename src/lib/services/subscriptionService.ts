import { createClientSupabaseClient } from '@/lib/supabase/browserClient'
import type { 
  SubscriptionTier, 
  UserSubscription, 
  ConversationUsage, 
  ConversationLimitInfo,
  UserSubscriptionInfo,
  SubscriptionFeatures,
  AccessControl
} from '@/lib/types/subscription'

const supabase = createClientSupabaseClient()

export class SubscriptionService {
  // Get all available subscription tiers
  static async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    const { data, error } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error('Error fetching subscription tiers:', error)
      return []
    }

    return data || []
  }

  // Get user's current subscription
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        tier:subscription_tiers(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user subscription:', error)
      return null
    }

    return data
  }

  // Get conversation usage for current period
  static async getConversationUsage(userId: string): Promise<{ count: number, limit: number }> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const { data, error } = await supabase
      .from('conversation_usage')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', now.toISOString())

    if (error) {
      console.error('Error fetching conversation usage:', error)
      return { count: 0, limit: 0 }
    }

    const count = data?.length || 0
    const subscription = await this.getUserSubscription(userId)
    const limit = subscription?.tier?.conversation_limit || 5

    return { count, limit }
  }

  // Check if user can start a new conversation
  static async canStartConversation(userId: string): Promise<ConversationLimitInfo> {
    const usage = await this.getConversationUsage(userId)
    const canStart = usage.count < usage.limit
    // For now, we don't have resetDate or percentageUsed, so use placeholders
    return {
      canStart,
      usageThisMonth: usage.count,
      limit: usage.limit,
      resetDate: '',
      percentageUsed: usage.limit > 0 ? Math.round((usage.count / usage.limit) * 100) : 0
    }
  }

  // Record a new conversation
  static async recordConversation(userId: string): Promise<void> {
    const { error } = await supabase
      .from('conversation_usage')
      .insert({
        user_id: userId,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error recording conversation:', error)
    }
  }

  // Get comprehensive subscription info for user
  static async getUserSubscriptionInfo(userId: string): Promise<UserSubscriptionInfo> {
    const [subscription] = await Promise.all([
      this.getUserSubscription(userId)
    ])

    return {
      tier_name: subscription?.tier?.name || 'Free',
      tier_slug: subscription?.tier?.slug || 'free',
      conversation_limit: subscription?.tier?.conversation_limit || 5,
      features: subscription?.tier?.features || [],
      status: subscription?.status || 'inactive',
      period_end: subscription?.current_period_end
    }
  }

  // Get features for a subscription tier
  static getSubscriptionFeatures(tier: SubscriptionTier | undefined): SubscriptionFeatures {
    // Return all features as false if no tier
    if (!tier) {
      return {
        basic_templates: false,
        advanced_templates: false,
        custom_templates: false,
        unlimited_conversations: false,
        compatibility_assessment: false,
        goal_tracking: false,
        progress_reports: false,
        analytics_dashboard: false,
        foundational_articles: false,
        financial_worksheets: false,
        early_access: false,
        community_readonly: false,
        community_participation: false,
        email_support: false,
        video_support: false,
        priority_support: false,
        personal_ai_advisor: false,
        financial_modeling: false,
        account_integration: false,
        expert_sessions: false,
        coaching_calls: false
      }
    }
    // You may want to map tier.features (string[]) to SubscriptionFeatures here if you use feature flags
    // For now, just return all as false except unlimited_conversations if conversation_limit is null
    return {
      basic_templates: false,
      advanced_templates: false,
      custom_templates: false,
      unlimited_conversations: tier.conversation_limit === null,
      compatibility_assessment: false,
      goal_tracking: false,
      progress_reports: false,
      analytics_dashboard: false,
      foundational_articles: false,
      financial_worksheets: false,
      early_access: false,
      community_readonly: false,
      community_participation: false,
      email_support: false,
      video_support: false,
      priority_support: false,
      personal_ai_advisor: false,
      financial_modeling: false,
      account_integration: false,
      expert_sessions: false,
      coaching_calls: false
    }
  }

  // Check access control for features
  static async checkAccess(userId: string, feature: keyof SubscriptionFeatures): Promise<AccessControl> {
    const subscriptionInfo = await this.getUserSubscriptionInfo(userId)
    // features is a string[]; check if feature is included
    const hasAccess = subscriptionInfo.features.includes(feature as string)
    return {
      feature: feature as string,
      hasAccess
    }
  }

  // Create Stripe checkout session
  static async createCheckoutSession(priceId: string, userId: string): Promise<{ sessionId: string } | null> {
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return null
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId })
      })

      return response.ok
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return false
    }
  }
} 