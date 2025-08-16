import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  // Check if we're in build time
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
  
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'stats':
        return await getStats();
      case 'subscribers':
        return await getSubscribers(request);
      case 'export':
        return await exportData(request);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin waitlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check if we're in build time
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'update_subscriber':
        return await updateSubscriber(body);
      case 'delete_subscriber':
        return await deleteSubscriber(body);
      case 'resend_confirmation':
        return await resendConfirmation(body);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin waitlist POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getStats() {
  const supabase = getSupabaseClient();
  const { data: subscribers, error } = await supabase
    .from('waitlist_subscribers')
    .select('*');

  if (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats = {
    total_subscribers: subscribers.length,
    confirmed_subscribers: subscribers.filter(s => s.email_confirmed).length,
    pending_confirmation: subscribers.filter(s => !s.email_confirmed && s.status === 'pending').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    bounced: subscribers.filter(s => s.status === 'bounced').length,
    today_signups: subscribers.filter(s => new Date(s.created_at) >= today).length,
    this_week_signups: subscribers.filter(s => new Date(s.created_at) >= weekAgo).length,
    this_month_signups: subscribers.filter(s => new Date(s.created_at) >= monthAgo).length,
    avg_priority_score: 0 // Placeholder for future priority scoring
  };

  return NextResponse.json({ stats });
}

async function getSubscribers(request: NextRequest) {
  const supabase = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const status = searchParams.get('status');
  const practice_type = searchParams.get('practice_type');
  const interest_level = searchParams.get('interest_level');
  const search = searchParams.get('search');

  let query = supabase
    .from('waitlist_subscribers')
    .select('*', { count: 'exact' });

  // Apply filters
  if (status) {
    query = query.eq('status', status);
  }
  if (practice_type) {
    query = query.eq('practice_type', practice_type);
  }
  if (interest_level) {
    query = query.eq('interest_level', interest_level);
  }
  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,practice_name.ilike.%${search}%`);
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to).order('created_at', { ascending: false });

  const { data: subscribers, error, count } = await query;

  if (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return NextResponse.json({
    subscribers,
    pagination: {
      current_page: page,
      total_pages: totalPages,
      total_count: count,
      limit
    }
  });
}

async function exportData(request: NextRequest) {
  const supabase = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'csv';
  const filtersParam = searchParams.get('filters');
  
  let filters: {
    status?: string;
    practice_type?: string;
    interest_level?: string;
    search?: string;
  } = {};
  if (filtersParam) {
    try {
      filters = JSON.parse(filtersParam);
    } catch (e) {
      console.error('Error parsing filters:', e);
    }
  }

  let query = supabase
    .from('waitlist_subscribers')
    .select('*');

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.practice_type) {
    query = query.eq('practice_type', filters.practice_type);
  }
  if (filters.interest_level) {
    query = query.eq('interest_level', filters.interest_level);
  }
  if (filters.search) {
    query = query.or(`email.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,practice_name.ilike.%${filters.search}%`);
  }

  const { data: subscribers, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }

  let data: string;
  let filename: string;
  let contentType: string;

  if (type === 'csv') {
    const headers = [
      'ID', 'Email', 'First Name', 'Last Name', 'Practice Name', 'Practice Type',
      'License Type', 'State', 'Country', 'Phone', 'Source', 'Referral Code',
      'Interest Level', 'Estimated Patients', 'Current EMR', 'Pain Points',
      'Timeline', 'Budget Range', 'GDPR Consent', 'Marketing Consent',
      'Status', 'Email Confirmed', 'Created At'
    ];

    const rows = subscribers.map(s => [
      s.id,
      s.email,
      s.first_name || '',
      s.last_name || '',
      s.practice_name || '',
      s.practice_type || '',
      s.license_type || '',
      s.state || '',
      s.country || '',
      s.phone || '',
      s.source || '',
      s.referral_code || '',
      s.interest_level || '',
      s.estimated_patients || '',
      s.current_emr || '',
      Array.isArray(s.pain_points) ? s.pain_points.join(', ') : '',
      s.timeline || '',
      s.budget_range || '',
      s.gdpr_consent ? 'Yes' : 'No',
      s.marketing_consent ? 'Yes' : 'No',
      s.status || '',
      s.email_confirmed ? 'Yes' : 'No',
      s.created_at
    ]);

    data = [headers, ...rows].map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    filename = `waitlist_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    contentType = 'text/csv';
  } else {
    data = JSON.stringify(subscribers, null, 2);
    filename = `waitlist_subscribers_${new Date().toISOString().split('T')[0]}.json`;
    contentType = 'application/json';
  }

  return NextResponse.json({
    data,
    filename,
    contentType
  });
}

async function updateSubscriber(body: any) {
  const { subscriber_id, ...updates } = body;
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('waitlist_subscribers')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriber_id);

  if (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

async function deleteSubscriber(body: any) {
  const { subscriber_id } = body;
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('waitlist_subscribers')
    .delete()
    .eq('id', subscriber_id);

  if (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

async function resendConfirmation(body: any) {
  const { subscriber_id } = body;

  // For now, just log that we would resend confirmation
  // In a real implementation, you'd integrate with your email service
  console.log(`Would resend confirmation email to subscriber: ${subscriber_id}`);

  return NextResponse.json({ 
    success: true,
    message: 'Confirmation email would be resent (email service not configured)'
  });
} 