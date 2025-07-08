'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/supabase/database.types';
import Button from '../ui/Button';

interface UsageGatingProps {
  children: ReactNode;
  featureKey: string;
  requiredTier?: 'core' | 'premium';
  usageLimit?: number;
  upgradeMessage?: string;
}

interface FeatureAccess {
  hasAccess: boolean;
  currentUsage: number;
  reason?: string;
}

type SubscriptionTier = 'free' | 'core' | 'premium';

export default function UsageGating({
  children,
  featureKey,
  requiredTier,
  usageLimit,
  upgradeMessage = 'Upgrade your plan to access this feature',
}: UsageGatingProps) {
  const [access, setAccess] = useState<FeatureAccess>({
    hasAccess: false,
    currentUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function checkAccess() {
      try {
        // Get current user's subscription
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setAccess({ hasAccess: false, currentUsage: 0, reason: 'Please sign in to access this feature' });
          return;
        }

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('tier, status')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .single();

        // Check tier requirements
        if (requiredTier) {
          const tierLevels: Record<SubscriptionTier, number> = { free: 0, core: 1, premium: 2 };
          const userTierLevel = tierLevels[(subscription?.tier as SubscriptionTier) || 'free'];
          const requiredTierLevel = tierLevels[requiredTier];

          if (userTierLevel < requiredTierLevel) {
            setAccess({
              hasAccess: false,
              currentUsage: 0,
              reason: `This feature requires the ${requiredTier} plan`,
            });
            return;
          }
        }

        // Check usage limits
        if (usageLimit) {
          const { data: usage } = await supabase
            .from('usage_tracking')
            .select('usage_count')
            .eq('user_id', session.user.id)
            .eq('feature_key', featureKey)
            .single();

          const currentUsage = usage?.usage_count || 0;

          if (currentUsage >= usageLimit) {
            setAccess({
              hasAccess: false,
              currentUsage,
              reason: `You've reached the usage limit for this feature`,
            });
            return;
          }

          setAccess({ hasAccess: true, currentUsage });
        } else {
          setAccess({ hasAccess: true, currentUsage: 0 });
        }
      } catch (error) {
        console.error('Error checking feature access:', error);
        setAccess({
          hasAccess: false,
          currentUsage: 0,
          reason: 'Error checking feature access',
        });
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [featureKey, requiredTier, usageLimit, supabase]);

  const trackUsage = async () => {
    if (!access.hasAccess) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.rpc('increment_feature_usage', {
        p_user_id: session.user.id,
        p_feature_key: featureKey,
      });
    } catch (error) {
      console.error('Error tracking feature usage:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!access.hasAccess) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 rounded-lg bg-gradient-to-br from-purple-50 to-teal-50 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {access.reason}
          </h3>
          <p className="text-gray-600 mb-4">{upgradeMessage}</p>
          <Button
            onClick={() => window.location.href = '/pricing'}
            className="bg-gradient-to-r from-purple-600 to-teal-600 text-white"
          >
            View Plans
          </Button>
          {usageLimit && (
            <p className="mt-4 text-sm text-gray-500">
              Current usage: {access.currentUsage}/{usageLimit}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div onClick={trackUsage}>
      {children}
    </div>
  );
} 