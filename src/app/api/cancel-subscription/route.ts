import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/supabase/database.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  try {
    const { cancel } = await req.json();

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

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return new NextResponse('Subscription not found', { status: 404 });
    }

    // Update subscription in Stripe
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: cancel,
    });

    // Update subscription in database
    await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: cancel })
      .eq('stripe_subscription_id', subscription.stripe_subscription_id);

    return new NextResponse(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('Error canceling subscription:', err);
    return new NextResponse('Error canceling subscription', { status: 500 });
  }
} 