'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const supabase = createClientSupabaseClient();

interface Subscription {
  id: string;
  stripe_subscription_id: string;
  status: string;
  current_period_end: string;
}

export default function BillingManagement() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading subscription:', error);
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setCanceling(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.stripe_subscription_id }),
      });

      if (response.ok) {
        await loadSubscription();
      } else {
        console.error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading billing information...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Active Subscription</h2>
        <p className="text-gray-600 mb-6">You don't have an active subscription.</p>
        <Link href="/pricing">
          <Button>View Plans</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`font-medium ${
              subscription.status === 'active' ? 'text-green-600' : 
              subscription.status === 'canceled' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Next billing date:</span>
            <span className="font-medium">
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {subscription.status === 'active' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Cancel Subscription</h4>
          <p className="text-yellow-700 mb-4">
            Your subscription will remain active until the end of the current billing period.
          </p>
          <Button
            onClick={handleCancelSubscription}
            disabled={canceling}
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            {canceling ? 'Canceling...' : 'Cancel Subscription'}
          </Button>
        </div>
      )}
    </div>
  );
} 