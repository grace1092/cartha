import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { exportService } from '@/lib/services/exportService';
import { hipaaAuth } from '@/lib/auth/hipaaAuth';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get user's exports
    const exports = await exportService.getExports(user.id, limit);

    return NextResponse.json({ exports });

  } catch (error) {
    console.error('Get exports error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve exports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      exportType, 
      format, 
      filters = {}, 
      customFields 
    } = body;

    // Validate required fields
    if (!exportType || !format) {
      return NextResponse.json(
        { error: 'Export type and format are required' },
        { status: 400 }
      );
    }

    // Request export
    const { exportId, error } = await exportService.requestExport(
      user.id,
      exportType,
      format,
      filters,
      customFields
    );
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ exportId, success: true });

  } catch (error) {
    console.error('Request export error:', error);
    return NextResponse.json(
      { error: 'Failed to request export' },
      { status: 500 }
    );
  }
} 