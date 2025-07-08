import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase/database.types'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
})

export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();

    const cookieStore = cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get subscription to verify ownership
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', session.user.id)
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (!subscription) {
      return new NextResponse('Subscription not found', { status: 404 });
    }

    // Get subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Get default payment method
    const paymentMethod = await stripe.paymentMethods.retrieve(
      stripeSubscription.default_payment_method as string
    );

    return new NextResponse(JSON.stringify({ card: paymentMethod.card }));
  } catch (err) {
    console.error('Error getting payment method:', err);
    return new NextResponse('Error getting payment method', { status: 500 });
  }
} 