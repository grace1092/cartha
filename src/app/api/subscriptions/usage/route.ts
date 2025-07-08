import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/lib/services/subscriptionService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'user_id is required'
      }, { status: 400 })
    }

    const limitInfo = await SubscriptionService.canStartConversation(userId)
    
    return NextResponse.json({
      success: true,
      data: limitInfo
    })
  } catch (error) {
    console.error('Error fetching usage info:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch usage information'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'user_id is required'
      }, { status: 400 })
    }

    // Check if user can start conversation first
    const canStart = await SubscriptionService.canStartConversation(user_id)
    
    if (!canStart.canStart) {
      return NextResponse.json({
        success: false,
        error: 'Conversation limit exceeded',
        code: 'LIMIT_EXCEEDED'
      }, { status: 429 })
    }

    // Track the usage
    await SubscriptionService.recordConversation(user_id)
    
    return NextResponse.json({
      success: true,
      data: { tracked: true },
      message: 'Usage tracked successfully'
    })
  } catch (error) {
    console.error('Error tracking usage:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to track usage'
    }, { status: 500 })
  }
} 