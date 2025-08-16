import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  
  // Check database connection and table existence
  try {
    const { data: tableCheck, error: tableError } = await supabase
      .from('waitlist_subscribers')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('Database table error:', tableError);
      return NextResponse.json(
        { error: 'Database table not found. Please check your Supabase setup.' },
        { status: 500 }
      );
    }
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return NextResponse.json(
      { error: 'Database connection failed. Please check your environment variables.' },
      { status: 500 }
    );
  }
  
  try {
    const body = await request.json();
    const headersList = headers();
    
    // Extract data from request
    const {
      email,
      first_name,
      last_name,
      practice_name,
      practice_type = 'individual',
      license_type,
      state,
      country = 'US',
      phone,
      source = 'website',
      referral_code,
      interest_level = 'medium',
      estimated_patients,
      current_emr,
      pain_points = [],
      timeline = '3-6_months',
      budget_range = '300_500',
      gdpr_consent = false,
      marketing_consent = false
    } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('waitlist_subscribers')
      .select('id, email_confirmed, status')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.email_confirmed) {
        return NextResponse.json(
          { error: 'Email already confirmed on waitlist' },
          { status: 409 }
        );
      } else if (existingSubscriber.status === 'unsubscribed') {
        // Allow resubscription
        await supabase
          .from('waitlist_subscribers')
          .update({
            status: 'pending',
            gdpr_consent,
            marketing_consent,
            consent_given_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id);
      } else {
        return NextResponse.json(
          { error: 'Email already on waitlist. Please check your email for confirmation.' },
          { status: 409 }
        );
      }
    }

    // Get client IP and user agent
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Simplified insert - focus on essential fields
    const { data: subscriber, error: insertError } = await supabase
      .from('waitlist_subscribers')
      .insert({
        email,
        first_name: first_name || '',
        last_name: last_name || '',
        practice_name: practice_name || '',
        practice_type,
        license_type: license_type || '',
        state: state || '',
        country,
        phone: phone || '',
        source,
        referral_code: referral_code || '',
        interest_level,
        estimated_patients: estimated_patients || 0,
        current_emr: current_emr || '',
        pain_points: Array.isArray(pain_points) ? pain_points : [],
        timeline,
        budget_range,
        gdpr_consent,
        marketing_consent,
        consent_given_at: new Date().toISOString(),
        ip_address: ip,
        user_agent: userAgent,
        status: 'pending',
        email_confirmed: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting subscriber:', insertError);
      return NextResponse.json(
        { error: `Database error: ${insertError.message}` },
        { status: 500 }
      );
    }

    // Simplified success response - no email sending for now
    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist! We\'ll be in touch soon.',
      subscriber_id: subscriber.id
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify token and get subscriber
    const { data: tokenData } = await supabase
      .from('waitlist_confirmation_tokens')
      .select(`
        *,
        waitlist_subscribers (*)
      `)
      .eq('token', token)
      .eq('type', 'confirmation')
      .eq('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriber: tokenData.waitlist_subscribers
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 