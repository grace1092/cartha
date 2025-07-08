import { NextRequest, NextResponse } from 'next/server'
import { subscriptionService } from '@/lib/services/subscriptionService'

export async function GET(request: NextRequest) {
  try {
    const tiers = await subscriptionService.getTiers()
    
    return NextResponse.json({
      success: true,
      data: tiers
    })
  } catch (error) {
    console.error('Error fetching subscription tiers:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch subscription tiers'
    }, { status: 500 })
  }
} 