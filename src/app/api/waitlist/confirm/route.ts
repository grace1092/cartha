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
      .eq('type', 'confirmation')
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

    // Check if already confirmed
    if (subscriber.email_confirmed) {
      return NextResponse.json(
        { error: 'Email already confirmed' },
        { status: 400 }
      );
    }

    // Mark token as used
    await supabase
      .from('waitlist_confirmation_tokens')
      .update({
        used_at: new Date().toISOString()
      })
      .eq('id', tokenData.id);

    // Confirm subscriber
    const { error: updateError } = await supabase
      .from('waitlist_subscribers')
      .update({
        email_confirmed: true,
        confirmed_at: new Date().toISOString(),
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Error confirming subscriber:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm subscription' },
        { status: 500 }
      );
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(supabase, subscriber);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the confirmation if email fails
    }

    // Log admin action
    await supabase
      .from('waitlist_admin_logs')
      .insert({
        action: 'email_confirmed',
        subscriber_id: subscriber.id,
        details: {
          confirmed_at: new Date().toISOString(),
          token_id: tokenData.id
        }
      });

    // Redirect to success page
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/waitlist/confirmed?email=${encodeURIComponent(subscriber.email)}`;
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('Email confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendWelcomeEmail(supabase: any, subscriber: any) {
  // Get welcome email template
  const { data: template } = await supabase
    .from('waitlist_email_templates')
    .select('*')
    .eq('name', 'welcome')
    .eq('is_active', true)
    .single();

  if (!template) {
    throw new Error('Welcome email template not found');
  }

  // Create unsubscribe token
  const { data: unsubscribeToken } = await supabase
    .from('waitlist_confirmation_tokens')
    .insert({
      subscriber_id: subscriber.id,
      type: 'unsubscribe',
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
    })
    .select()
    .single();

  // Prepare email variables
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/waitlist/unsubscribe?token=${unsubscribeToken?.token}`;
  
  const variables = {
    first_name: subscriber.first_name || 'there',
    email: subscriber.email,
    unsubscribe_url: unsubscribeUrl
  };

  // Replace variables in template
  let htmlContent = template.html_content;
  let textContent = template.text_content;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    htmlContent = htmlContent.replace(regex, value as string);
    textContent = textContent.replace(regex, value as string);
  });

  // Log email attempt
  await supabase
    .from('waitlist_email_logs')
    .insert({
      subscriber_id: subscriber.id,
      template_id: template.id,
      email_type: 'welcome',
      status: 'pending'
    });

  // TODO: Integrate with actual email service
  const emailData = {
    to: subscriber.email,
    subject: template.subject,
    html: htmlContent,
    text: textContent
  };

  console.log('Sending welcome email:', emailData);
  
  // For now, simulate successful email sending
  await supabase
    .from('waitlist_email_logs')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    .eq('subscriber_id', subscriber.id)
    .eq('email_type', 'welcome');
} 