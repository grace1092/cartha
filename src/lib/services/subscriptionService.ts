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

export class SubscriptionService {
  private static instance: SubscriptionService
  private tiersCache: SubscriptionTier[] | null = null
  private cacheExpiry: number = 0

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService()
    }
    return SubscriptionService.instance
  }

  /**
   * Get all available subscription tiers
   */
  async getTiers(): Promise<SubscriptionTier[]> {
    // Check cache first
    if (this.tiersCache && Date.now() < this.cacheExpiry) {
      return this.tiersCache
    }

    const { data, error } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error('Error fetching subscription tiers:', error)
      throw new Error('Failed to fetch subscription tiers')
    }

    // Cache for 5 minutes
    this.tiersCache = data
    this.cacheExpiry = Date.now() + 5 * 60 * 1000

    return data
  }

  /**
   * Get a specific tier by ID
   */
  async getTier(tierId: number): Promise<SubscriptionTier | null> {
    const tiers = await this.getTiers()
    return tiers.find(tier => tier.id === tierId) || null
  }

  /**
   * Get a specific tier by slug
   */
  async getTierBySlug(slug: string): Promise<SubscriptionTier | null> {
    const tiers = await this.getTiers()
    return tiers.find(tier => tier.slug === slug) || null
  }

  /**
   * Get user's current subscription information
   */
  async getUserSubscription(userId: string): Promise<UserSubscriptionInfo | null> {
    const { data, error } = await supabase
      .rpc('get_user_subscription', { user_uuid: userId })

    if (error) {
      console.error('Error fetching user subscription:', error)
      throw new Error('Failed to fetch user subscription')
    }

    return data?.[0] || null
  }

  /**
   * Check if user can start a new conversation
   */
  async canStartConversation(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('can_start_conversation', { user_uuid: userId })

    if (error) {
      console.error('Error checking conversation limit:', error)
      return false
    }

    return data || false
  }

  /**
   * Get detailed conversation limit information
   */
  async getConversationLimitInfo(userId: string): Promise<ConversationLimitInfo> {
    const subscription = await this.getUserSubscription(userId)
    
    if (!subscription) {
      throw new Error('No subscription found')
    }

    // Get current month usage
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01'
    const { data: usage } = await supabase
      .from('conversation_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .single()

    const usageThisMonth = usage?.conversations_used || 0
    const limit = subscription.conversation_limit
    
    // Calculate reset date (first day of next month)
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    nextMonth.setDate(1)
    const resetDate = nextMonth.toISOString()

    const percentageUsed = limit ? (usageThisMonth / limit) * 100 : 0

    return {
      canStart: limit === null || usageThisMonth < limit,
      usageThisMonth,
      limit,
      resetDate,
      percentageUsed
    }
  }

  /**
   * Track a new conversation usage
   */
  async trackConversationUsage(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('track_conversation_usage', { user_uuid: userId })

    if (error) {
      console.error('Error tracking conversation usage:', error)
      return false
    }

    return data || false
  }

  /**
   * Get subscription features for a user
   */
  async getUserFeatures(userId: string): Promise<SubscriptionFeatures> {
    const subscription = await this.getUserSubscription(userId)
    
    if (!subscription) {
      // Default to free tier features
      return this.getDefaultFeatures()
    }

    return this.parseFeatures(subscription.features)
  }

  /**
   * Check if user has access to a specific feature
   */
  async hasFeatureAccess(userId: string, feature: string): Promise<AccessControl> {
    const userFeatures = await this.getUserFeatures(userId)
    const hasAccess = userFeatures[feature as keyof SubscriptionFeatures] || false

    if (hasAccess) {
      return {
        feature,
        hasAccess: true
      }
    }

    // Find which tier has this feature
    const tiers = await this.getTiers()
    const tierWithFeature = tiers.find(tier => 
      tier.features.includes(feature)
    )

    return {
      feature,
      hasAccess: false,
      tier_required: tierWithFeature?.id,
      upgrade_message: tierWithFeature 
        ? `This feature is available in ${tierWithFeature.name} plan. Upgrade to unlock!`
        : 'This feature is not available in any plan.'
    }
  }

  /**
   * Update user subscription
   */
  async updateSubscription(
    userId: string, 
    tierId: number, 
    stripeSubscriptionId?: string,
    billingInterval: 'monthly' | 'yearly' = 'monthly'
  ): Promise<string> {
    const { data, error } = await supabase
      .rpc('update_user_subscription', {
        user_uuid: userId,
        new_tier_id: tierId,
        stripe_sub_id: stripeSubscriptionId,
        billing_period: billingInterval
      })

    if (error) {
      console.error('Error updating subscription:', error)
      throw new Error('Failed to update subscription')
    }

    return data
  }

  /**
   * Cancel user subscription
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'canceled',
        cancel_at_period_end: true,
        canceled_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'active')

    if (error) {
      console.error('Error canceling subscription:', error)
      return false
    }

    return true
  }

  /**
   * Get usage analytics for a user
   */
  async getUsageAnalytics(userId: string, months: number = 6): Promise<ConversationUsage[]> {
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)
    
    const { data, error } = await supabase
      .from('conversation_usage')
      .select('*')
      .eq('user_id', userId)
      .gte('month_year', startDate.toISOString().slice(0, 7) + '-01')
      .order('month_year', { ascending: true })

    if (error) {
      console.error('Error fetching usage analytics:', error)
      return []
    }

    return data || []
  }

  /**
   * Get recommended tier based on usage patterns
   */
  async getRecommendedTier(userId: string): Promise<SubscriptionTier | null> {
    const analytics = await this.getUsageAnalytics(userId, 3)
    const tiers = await this.getTiers()
    
    if (analytics.length === 0) {
      // New user, recommend tier 2 (Building Together)
      return tiers.find(tier => tier.id === 2) || null
    }

    // Calculate average monthly usage
    const avgUsage = analytics.reduce((sum, usage) => sum + usage.conversations_used, 0) / analytics.length

    // Recommend tier based on usage patterns
    if (avgUsage <= 5) {
      return tiers.find(tier => tier.id === 1) || null // First Steps
    } else if (avgUsage <= 25) {
      return tiers.find(tier => tier.id === 2) || null // Building Together
    } else if (avgUsage <= 50) {
      return tiers.find(tier => tier.id === 3) || null // Financial Partners
    } else {
      return tiers.find(tier => tier.id === 4) || null // Wealth Builders
    }
  }

  /**
   * Calculate pricing for tier change
   */
  calculatePricing(
    currentTier: SubscriptionTier,
    newTier: SubscriptionTier,
    billingInterval: 'monthly' | 'yearly'
  ): { 
    basePrice: number
    discount: number
    finalPrice: number
    savings: number
  } {
    const basePrice = billingInterval === 'yearly' 
      ? newTier.price_yearly 
      : newTier.price_monthly

    const monthlyEquivalent = billingInterval === 'yearly'
      ? newTier.price_monthly * 12
      : newTier.price_monthly

    const discount = billingInterval === 'yearly'
      ? monthlyEquivalent - newTier.price_yearly
      : 0

    const savings = discount > 0 ? (discount / monthlyEquivalent) * 100 : 0

    return {
      basePrice,
      discount,
      finalPrice: basePrice,
      savings
    }
  }

  /**
   * Private helper methods
   */
  private getDefaultFeatures(): SubscriptionFeatures {
    return {
      basic_templates: true,
      advanced_templates: false,
      custom_templates: false,
      unlimited_conversations: false,
      compatibility_assessment: true,
      goal_tracking: false,
      progress_reports: false,
      analytics_dashboard: false,
      foundational_articles: true,
      financial_worksheets: false,
      early_access: false,
      community_readonly: true,
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

  private parseFeatures(features: string[]): SubscriptionFeatures {
    const defaultFeatures = this.getDefaultFeatures()
    
    // Set features to true if they're in the user's tier
    features.forEach(feature => {
      if (feature in defaultFeatures) {
        (defaultFeatures as any)[feature] = true
      }
    })

    return defaultFeatures
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.tiersCache = null
    this.cacheExpiry = 0
  }
}

// Export singleton instance
export const subscriptionService = SubscriptionService.getInstance() 