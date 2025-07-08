import { useState, useEffect, useCallback } from 'react'
import type { 
  SubscriptionTier, 
  UserSubscriptionInfo, 
  ConversationLimitInfo 
} from '@/lib/types/subscription'

interface UseSubscriptionReturn {
  // State
  tiers: SubscriptionTier[]
  currentSubscription: UserSubscriptionInfo | null
  usageInfo: ConversationLimitInfo | null
  loading: boolean
  error: string | null

  // Methods
  refreshSubscription: () => Promise<void>
  refreshUsage: () => Promise<void>
  checkCanStartConversation: () => Promise<boolean>
  trackConversationUsage: () => Promise<boolean>
  
  // Computed values
  isFreeTier: boolean
  isPremiumTier: boolean
  conversationsRemaining: number
  daysUntilReset: number
}

export function useSubscription(userId?: string): UseSubscriptionReturn {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscriptionInfo | null>(null)
  const [usageInfo, setUsageInfo] = useState<ConversationLimitInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all subscription tiers
  const fetchTiers = useCallback(async () => {
    try {
      const response = await fetch('/api/subscriptions/tiers')
      const result = await response.json()
      
      if (result.success) {
        setTiers(result.data)
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Error fetching tiers:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tiers')
    }
  }, [])

  // Fetch user's current subscription
  const fetchSubscription = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch('/api/subscriptions/user')
      const result = await response.json()
      
      if (result.success) {
        setCurrentSubscription(result.data)
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Error fetching subscription:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription')
    }
  }, [userId])

  // Fetch usage information
  const fetchUsage = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/subscriptions/usage?user_id=${userId}`)
      const result = await response.json()
      
      if (result.success) {
        setUsageInfo(result.data)
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Error fetching usage:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch usage')
    }
  }, [userId])

  // Refresh subscription data
  const refreshSubscription = useCallback(async () => {
    setLoading(true)
    await fetchSubscription()
    setLoading(false)
  }, [fetchSubscription])

  // Refresh usage data
  const refreshUsage = useCallback(async () => {
    await fetchUsage()
  }, [fetchUsage])

  // Check if user can start a new conversation
  const checkCanStartConversation = useCallback(async (): Promise<boolean> => {
    if (!userId || !usageInfo) return false
    return usageInfo.canStart
  }, [userId, usageInfo])

  // Track conversation usage
  const trackConversationUsage = useCallback(async (): Promise<boolean> => {
    if (!userId) return false

    try {
      const response = await fetch('/api/subscriptions/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Refresh usage info after tracking
        await fetchUsage()
        return true
      } else if (result.code === 'LIMIT_EXCEEDED') {
        // Handle limit exceeded case
        await fetchUsage() // Refresh to get latest state
        return false
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Error tracking usage:', err)
      return false
    }
  }, [userId, fetchUsage])

  // Computed values
  const isFreeTier = currentSubscription?.tier_slug === 'first-steps' || !currentSubscription
  const isPremiumTier = currentSubscription?.tier_slug === 'wealth-builders'
  
  const conversationsRemaining = usageInfo?.limit 
    ? Math.max(0, usageInfo.limit - usageInfo.usageThisMonth)
    : Infinity

  const daysUntilReset = usageInfo?.resetDate 
    ? Math.ceil((new Date(usageInfo.resetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        await Promise.all([
          fetchTiers(),
          ...(userId ? [fetchSubscription(), fetchUsage()] : [])
        ])
      } catch (err) {
        console.error('Error loading subscription data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [fetchTiers, fetchSubscription, fetchUsage, userId])

  return {
    // State
    tiers,
    currentSubscription,
    usageInfo,
    loading,
    error,

    // Methods
    refreshSubscription,
    refreshUsage,
    checkCanStartConversation,
    trackConversationUsage,

    // Computed values
    isFreeTier,
    isPremiumTier,
    conversationsRemaining,
    daysUntilReset,
  }
}

// Hook for getting tier information without user context
export function useTiers() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch('/api/subscriptions/tiers')
        const result = await response.json()
        
        if (result.success) {
          setTiers(result.data)
        } else {
          throw new Error(result.error)
        }
      } catch (err) {
        console.error('Error fetching tiers:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch tiers')
      } finally {
        setLoading(false)
      }
    }

    fetchTiers()
  }, [])

  return { tiers, loading, error }
} 