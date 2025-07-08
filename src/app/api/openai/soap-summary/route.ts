import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase/client'
import { createServerSupabaseClient } from '@/lib/supabase/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const supabaseServer = createServerSupabaseClient()
    const { data: { session } } = await supabaseServer.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription limits
    const { data: canUse } = await supabaseServer.rpc(
      'check_subscription_limits',
      {
        p_user_id: session.user.id,
        p_feature_type: 'soap_generation'
      }
    )

    if (!canUse) {
      return NextResponse.json(
        { error: 'Usage limit reached for your current plan' },
        { status: 403 }
      )
    }

    const { bulletNotes, clientName, sessionDate } = await request.json()

    if (!bulletNotes || !clientName || !sessionDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const prompt = `
Convert these therapy session bullet points into a professional SOAP note format:

Client: ${clientName}
Date: ${sessionDate}
Notes: ${bulletNotes}

Format as:
S (Subjective): Patient's reported experience, thoughts, feelings, and concerns
O (Objective): Observable behaviors, presentation, and clinical observations
A (Assessment): Clinical impressions, progress toward goals, and diagnostic considerations
P (Plan): Treatment recommendations, interventions, homework, and next steps

Guidelines:
- Keep it professional, concise, and HIPAA-compliant
- Use clinical language appropriate for medical records
- Focus on therapeutically relevant information
- Ensure each section is substantive and meaningful
- Do not include identifying information beyond what's provided
- Maintain confidentiality and professional boundaries
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const soapSummary = response.choices[0].message.content

    if (!soapSummary) {
      return NextResponse.json(
        { error: 'Failed to generate SOAP summary' },
        { status: 500 }
      )
    }

    // Increment usage tracking
    await supabaseServer.rpc('increment_usage', {
      p_user_id: session.user.id,
      p_feature_type: 'soap_generation'
    })

    return NextResponse.json({ soapSummary })

  } catch (error) {
    console.error('SOAP generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate SOAP summary' },
      { status: 500 }
    )
  }
} 