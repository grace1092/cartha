import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/supabase/database.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new NextResponse('Webhook signature verification failed', { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            stripe_subscription_id: subscription.id,
            user_id: subscription.metadata?.user_id,
            status: subscription.status,
            stripe_price_id: subscription.items.data[0].price.id,
            interval: subscription.items.data[0].price.recurring?.interval || 'month',
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null,
            trial_start: subscription.trial_start
              ? new Date(subscription.trial_start * 1000).toISOString()
              : null,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          });

        if (error) {
          console.error('Error updating subscription:', error);
          return new NextResponse('Error updating subscription', { status: 500 });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled', canceled_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error deleting subscription:', error);
          return new NextResponse('Error deleting subscription', { status: 500 });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const { error } = await supabase.from('billing_events').insert({
          user_id: invoice.metadata?.user_id,
          subscription_id: (invoice as any).subscription?.toString(),
          event_type: 'payment_succeeded',
          amount: invoice.amount_paid,
          currency: invoice.currency,
          stripe_event_id: event.id,
        });

        if (error) {
          console.error('Error recording payment:', error);
          return new NextResponse('Error recording payment', { status: 500 });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const { error } = await supabase.from('billing_events').insert({
          user_id: invoice.metadata?.user_id,
          subscription_id: (invoice as any).subscription?.toString(),
          event_type: 'payment_failed',
          amount: invoice.amount_due,
          currency: invoice.currency,
          stripe_event_id: event.id,
          metadata: {
            payment_intent: (invoice as any).payment_intent?.toString(),
            failure_reason: invoice.last_finalization_error?.message,
          },
        });

        if (error) {
          console.error('Error recording payment failure:', error);
          return new NextResponse('Error recording payment failure', { status: 500 });
        }

        // TODO: Send email notification to user about failed payment
        break;
      }
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new NextResponse('Webhook error', { status: 500 });
  }
} 