import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/lib/services/subscriptionService'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase/database.types'

export async function GET(request: NextRequest) {
  try {
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const subscription = await SubscriptionService.getUserSubscription(user.id)
    
    return NextResponse.json({
      success: true,
      data: subscription
    })
  } catch (error) {
    console.error('Error fetching user subscription:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user subscription'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const { subscription_tier } = body

    // For now, just return success since we're using Stripe for subscription management
    const subscription = await SubscriptionService.getUserSubscription(user.id)
    
    return NextResponse.json({
      success: true,
      data: subscription
    })
  } catch (error) {
    console.error('Error updating user subscription:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update user subscription'
    }, { status: 500 })
  }
} 