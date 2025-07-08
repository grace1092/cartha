import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata.userId
    if (!userId) return

    // Determine plan from price ID
    const priceId = subscription.items.data[0]?.price.id
    let plan = 'starter'
    
    // Map price IDs to plans (you'll need to set these up in Stripe)
    const priceToplan = {
      'price_starter': 'starter',
      'price_professional': 'professional',
      'price_enterprise': 'enterprise',
    } as const

    if (priceId && priceId in priceToplan) {
      plan = priceToplan[priceId as keyof typeof priceToplan]
    }

    // Update user profile
    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: subscription.status as any,
        subscription_plan: plan as any,
      })
      .eq('id', userId)

        // Record subscription history
    await supabaseAdmin
      .from('subscription_history')
      .insert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        plan: plan as any,
        status: subscription.status as any,
      })

  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata.userId
    if (!userId) return

    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'canceled',
      })
      .eq('id', userId)

    // Record subscription history
    await supabaseAdmin
      .from('subscription_history')
      .insert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        plan: 'starter',
        status: 'canceled',
      })

  } catch (error) {
    console.error('Error handling subscription cancelation:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string
    
    // Get user by customer ID
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (!profile) return

    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'past_due',
      })
      .eq('id', profile.id)

  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string
    
    // Get user by customer ID
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (!profile) return

    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'active',
      })
      .eq('id', profile.id)

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
} 