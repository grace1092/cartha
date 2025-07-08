import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase/database.types'

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

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
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription limits
    const { data: canUse } = await supabase.rpc(
      'check_subscription_limits',
      {
        p_user_id: session.user.id,
        p_feature_type: 'follow_up_email'
      }
    )

    if (!canUse) {
      return NextResponse.json(
        { error: 'Usage limit reached for your current plan' },
        { status: 403 }
      )
    }

    const { soapSummary, clientName, therapistName } = await request.json()

    if (!soapSummary || !clientName || !therapistName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const prompt = `
Generate a professional follow-up email based on this therapy session:

Client: ${clientName}
Therapist: ${therapistName}
Session Summary: ${soapSummary}

Create a warm, professional email that:
- Thanks them for the session
- Briefly recaps key points discussed (general themes, not specific details)
- Includes any relevant homework or action items mentioned
- Mentions next appointment scheduling if appropriate
- Maintains therapeutic boundaries and confidentiality
- Uses supportive, encouraging language
- Keeps it under 200 words
- Is professionally appropriate for a therapist-client relationship

Format as a complete email with subject line and body. Do not include specific therapy details that could compromise confidentiality if the email were forwarded.
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 600,
    })

    const followUpEmail = response.choices[0].message.content

    if (!followUpEmail) {
      return NextResponse.json(
        { error: 'Failed to generate follow-up email' },
        { status: 500 }
      )
    }

    // Increment usage tracking
    await supabase.rpc('increment_usage', {
      p_user_id: session.user.id,
      p_feature_type: 'follow_up_email'
    })

    return NextResponse.json({ followUpEmail })

  } catch (error) {
    console.error('Follow-up email generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate follow-up email' },
      { status: 500 }
    )
  }
} 