'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/supabase/database.types';
import { HiExclamationTriangle, HiCreditCard } from 'react-icons/hi2';
import Button from '../ui/Button';

interface PaymentFailureProps {
  onUpdatePayment?: () => void;
  onDismiss?: () => void;
}

interface PaymentFailureState {
  lastFailedAmount: number;
  failureReason: string;
  nextAttemptDate: string;
  attemptsRemaining: number;
  currency: string;
}

export default function PaymentFailure({ onUpdatePayment, onDismiss }: PaymentFailureProps) {
  const [failureState, setFailureState] = useState<PaymentFailureState | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function checkPaymentStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Get the most recent failed payment
        const { data: failedPayment } = await supabase
          .from('billing_events')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('event_type', 'payment_failed')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (failedPayment) {
          // Get subscription details for next attempt info
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('id', failedPayment.subscription_id)
            .single();

          if (subscription) {
            setFailureState({
              lastFailedAmount: failedPayment.amount,
              failureReason: failedPayment.metadata?.failure_reason || 'Payment method declined',
              nextAttemptDate: new Date(subscription.current_period_end).toLocaleDateString(),
              attemptsRemaining: 3, // This should come from your dunning settings
              currency: failedPayment.currency,
            });
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkPaymentStatus();
  }, [supabase]);

  if (loading || !failureState) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: failureState.currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-red-50 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <HiExclamationTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900">
            Payment Failed
          </h3>
          <p className="mt-2 text-red-700">
            We were unable to charge {formatCurrency(failureState.lastFailedAmount)} to your payment method.
            Reason: {failureState.failureReason}
          </p>
          <p className="mt-2 text-sm text-red-600">
            Next payment attempt: {failureState.nextAttemptDate} ({failureState.attemptsRemaining} attempts remaining)
          </p>
          <div className="mt-4 flex gap-4">
            <Button
              onClick={onUpdatePayment}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <HiCreditCard className="h-5 w-5" />
              Update Payment Method
            </Button>
            <button
              onClick={onDismiss}
              className="text-red-700 hover:text-red-800 text-sm"
            >
              Dismiss
            </button>
          </div>
          <p className="mt-4 text-sm text-red-600">
            Your subscription will be paused if payment cannot be collected.
            Please update your payment method to maintain access to premium features.
          </p>
        </div>
      </div>
    </motion.div>
  );
} 