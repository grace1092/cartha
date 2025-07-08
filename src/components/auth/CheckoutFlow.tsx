'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { HiCheck, HiShieldCheck, HiCreditCard } from 'react-icons/hi2';
import Button from '../ui/Button';
import { Database } from '@/lib/supabase/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFlowProps {
  priceId: string;
  interval: 'month' | 'year';
  amount: number;
  trialDays?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function CheckoutForm({ priceId, interval, amount, trialDays, onSuccess, onCancel }: CheckoutFlowProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the subscription on the server
      const { data: { clientSecret, subscriptionId } } = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          interval,
          trialDays,
        }),
      }).then(r => r.json());

      // Confirm the payment with Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.origin + '/dashboard',
          payment_method_data: {
            billing_details: {
              // Add any additional billing details here
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Something went wrong');
        return;
      }

      // Update the user's subscription in Supabase
      const { error: supabaseError } = await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('stripe_subscription_id', subscriptionId);

      if (supabaseError) {
        console.error('Error updating subscription status:', supabaseError);
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error in checkout:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <PaymentElement />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="w-full justify-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <HiCreditCard className="h-5 w-5" />
              Pay ${amount}/{interval}
            </span>
          )}
        </Button>

        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900 text-sm text-center"
        >
          Cancel
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
        <HiShieldCheck className="h-5 w-5 text-teal-500" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
}

export default function CheckoutFlow(props: CheckoutFlowProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Fetch the client secret when the component mounts
  useState(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: props.priceId,
        interval: props.interval,
      }),
    })
      .then(r => r.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => console.error('Error fetching client secret:', err));
  });

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete your subscription
        </h2>
        <p className="text-gray-600">
          {props.trialDays
            ? `Start your ${props.trialDays}-day free trial`
            : 'Set up your payment method'}
        </p>
      </div>

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#6366f1',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
              },
            },
          }}
        >
          <CheckoutForm {...props} />
        </Elements>
      )}

      <div className="mt-8 space-y-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <HiCheck className="h-5 w-5 text-teal-500" />
          <span>SSL encrypted payment</span>
        </div>
        <div className="flex items-center gap-2">
          <HiCheck className="h-5 w-5 text-teal-500" />
          <span>30-day money-back guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <HiCheck className="h-5 w-5 text-teal-500" />
          <span>Cancel anytime</span>
        </div>
      </div>
    </div>
  );
} 