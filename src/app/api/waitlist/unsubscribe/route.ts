import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
    const { data: tokenData, error: tokenError } = await supabase
      .from('waitlist_confirmation_tokens')
      .select(`
        *,
        waitlist_subscribers (*)
      `)
      .eq('token', token)
      .eq('type', 'unsubscribe')
      .eq('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    const subscriber = tokenData.waitlist_subscribers;

    // Mark token as used
    await supabase
      .from('waitlist_confirmation_tokens')
      .update({
        used_at: new Date().toISOString()
      })
      .eq('id', tokenData.id);

    // Unsubscribe subscriber
    const { error: updateError } = await supabase
      .from('waitlist_subscribers')
      .update({
        status: 'unsubscribed',
        marketing_consent: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Error unsubscribing:', updateError);
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    // Log GDPR action
    await supabase
      .from('waitlist_gdpr_logs')
      .insert({
        subscriber_id: subscriber.id,
        action: 'consent_withdrawn',
        consent_type: 'marketing',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      });

    // Log admin action
    await supabase
      .from('waitlist_admin_logs')
      .insert({
        action: 'unsubscribed',
        subscriber_id: subscriber.id,
        details: {
          unsubscribed_at: new Date().toISOString(),
          token_id: tokenData.id
        }
      });

    // Redirect to unsubscribe confirmation page
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/waitlist/unsubscribed?email=${encodeURIComponent(subscriber.email)}`;
    return NextResponse.redirect(unsubscribeUrl);

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  try {
    const body = await request.json();
    const { email, reason } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find subscriber by email
    const { data: subscriber, error: findError } = await supabase
      .from('waitlist_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    // Unsubscribe subscriber
    const { error: updateError } = await supabase
      .from('waitlist_subscribers')
      .update({
        status: 'unsubscribed',
        marketing_consent: false,
        admin_notes: reason ? `Unsubscribed via API. Reason: ${reason}` : 'Unsubscribed via API',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Error unsubscribing:', updateError);
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    // Log GDPR action
    await supabase
      .from('waitlist_gdpr_logs')
      .insert({
        subscriber_id: subscriber.id,
        action: 'consent_withdrawn',
        consent_type: 'marketing',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from waitlist'
    });

  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 