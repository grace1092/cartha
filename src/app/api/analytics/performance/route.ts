import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/serverClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Extract performance data
    const {
      name,
      value,
      category,
      timestamp,
      url,
      userAgent,
    } = body;

    // Store performance metric in database
    const { error } = await supabase
      .from('performance_metrics')
      .insert({
        metric_name: name,
        metric_value: value,
        metric_category: category,
        timestamp: timestamp || new Date().toISOString(),
        url: url || request.url,
        user_agent: userAgent || request.headers.get('user-agent'),
        session_id: request.headers.get('x-session-id'),
        user_id: request.headers.get('x-user-id'),
      });

    if (error) {
      console.error('Error storing performance metric:', error);
      return NextResponse.json({ error: 'Failed to store metric' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing performance metric:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '100');
    const category = searchParams.get('category');
    const metric = searchParams.get('metric');

    let query = supabase
      .from('performance_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('metric_category', category);
    }

    if (metric) {
      query = query.eq('metric_name', metric);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching performance metrics:', error);
      return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }

    // Calculate aggregated statistics
    const stats = data.reduce((acc, metric) => {
      if (!acc[metric.metric_name]) {
        acc[metric.metric_name] = {
          count: 0,
          sum: 0,
          min: Infinity,
          max: -Infinity,
          avg: 0,
        };
      }

      const stat = acc[metric.metric_name];
      stat.count++;
      stat.sum += metric.metric_value;
      stat.min = Math.min(stat.min, metric.metric_value);
      stat.max = Math.max(stat.max, metric.metric_value);
      stat.avg = stat.sum / stat.count;

      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      metrics: data,
      statistics: stats,
      total: data.length,
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 