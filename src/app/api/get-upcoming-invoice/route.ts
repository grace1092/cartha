import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/supabase/database.types';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
  });

  try {
    const { subscriptionId } = await req.json();
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

    // Get the subscription to find the customer
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Get upcoming invoice - using a different approach
    const upcomingInvoice = await (stripe.invoices as any).retrieveUpcoming({
      customer: subscription.customer as string,
      subscription: subscriptionId,
    });

    return NextResponse.json({ invoice: upcomingInvoice });
  } catch (error) {
    console.error('Error getting upcoming invoice:', error);
    return NextResponse.json(
      { error: 'Failed to get upcoming invoice' },
      { status: 500 }
    );
  }
} 