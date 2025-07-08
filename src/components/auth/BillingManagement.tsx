'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/supabase/database.types';
import { HiCreditCard, HiDocumentText, HiArrowPath, HiXMark } from 'react-icons/hi2';
import Button from '../ui/Button';

interface BillingManagementProps {
  onClose?: () => void;
}

interface BillingDetails {
  subscription: {
    tier: string;
    status: string;
    interval: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
  paymentMethod: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  } | null;
  upcomingInvoice: {
    amount: number;
    currency: string;
    date: string;
  } | null;
  recentInvoices: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    date: string;
  }>;
}

export default function BillingManagement({ onClose }: BillingManagementProps) {
  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    loadBillingDetails();
  }, []);

  const loadBillingDetails = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get subscription details
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      // Get recent billing events
      const { data: billingEvents } = await supabase
        .from('billing_events')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (subscription) {
        // Fetch payment method and upcoming invoice from Stripe
        const [paymentMethod, upcomingInvoice] = await Promise.all([
          fetch('/api/get-payment-method', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriptionId: subscription.stripe_subscription_id }),
          }).then(r => r.json()),
          fetch('/api/get-upcoming-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriptionId: subscription.stripe_subscription_id }),
          }).then(r => r.json()),
        ]);

        setBillingDetails({
          subscription: {
            tier: subscription.tier,
            status: subscription.status,
            interval: subscription.interval,
            currentPeriodEnd: new Date(subscription.current_period_end).toLocaleDateString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          paymentMethod: paymentMethod?.card ? {
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            expiryMonth: paymentMethod.card.exp_month,
            expiryYear: paymentMethod.card.exp_year,
          } : null,
          upcomingInvoice: upcomingInvoice?.invoice ? {
            amount: upcomingInvoice.invoice.amount_due,
            currency: upcomingInvoice.invoice.currency,
            date: new Date(upcomingInvoice.invoice.next_payment_attempt * 1000).toLocaleDateString(),
          } : null,
          recentInvoices: billingEvents?.map(event => ({
            id: event.id,
            amount: event.amount,
            currency: event.currency,
            status: event.event_type,
            date: new Date(event.created_at).toLocaleDateString(),
          })) || [],
        });
      }
    } catch (error) {
      console.error('Error loading billing details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!billingDetails?.subscription) return;
    
    try {
      setUpdating(true);
      await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancel: !billingDetails.subscription.cancelAtPeriodEnd }),
      });
      await loadBillingDetails();
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-xl max-w-2xl mx-auto p-6"
    >
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Billing & Subscription
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <HiXMark className="h-6 w-6" />
          </button>
        )}
      </div>

      {billingDetails?.subscription && (
        <>
          {/* Subscription Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Current Plan
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium text-gray-900">
                    {billingDetails.subscription.tier.charAt(0).toUpperCase() + billingDetails.subscription.tier.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Billing Period</p>
                  <p className="font-medium text-gray-900">
                    {billingDetails.subscription.interval.charAt(0).toUpperCase() + billingDetails.subscription.interval.slice(1)}ly
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">
                    {billingDetails.subscription.status.charAt(0).toUpperCase() + billingDetails.subscription.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Billing Date</p>
                  <p className="font-medium text-gray-900">
                    {billingDetails.subscription.currentPeriodEnd}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleCancelSubscription}
                  variant="secondary"
                  disabled={updating}
                >
                  {billingDetails.subscription.cancelAtPeriodEnd
                    ? 'Resume Subscription'
                    : 'Cancel Subscription'}
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Method
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {billingDetails.paymentMethod ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HiCreditCard className="h-6 w-6 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {billingDetails.paymentMethod.brand.charAt(0).toUpperCase() + billingDetails.paymentMethod.brand.slice(1)} ****{billingDetails.paymentMethod.last4}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {billingDetails.paymentMethod.expiryMonth}/{billingDetails.paymentMethod.expiryYear}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary">
                    Update
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">No payment method on file</p>
                  <Button>Add Payment Method</Button>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Payment */}
          {billingDetails.upcomingInvoice && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upcoming Payment
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(billingDetails.upcomingInvoice.amount, billingDetails.upcomingInvoice.currency)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due on {billingDetails.upcomingInvoice.date}
                    </p>
                  </div>
                  <HiArrowPath className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Recent Invoices */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Billing History
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {billingDetails.recentInvoices.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {billingDetails.recentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <HiDocumentText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {invoice.date}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        invoice.status === 'payment_succeeded'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status === 'payment_succeeded' ? 'Paid' : 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No billing history available
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
} 