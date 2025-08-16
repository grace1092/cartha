import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { hipaaAuth } from '@/lib/auth/hipaaAuth';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view audit logs
    const hasPermission = await hipaaAuth.checkDataAccess(user.id, 'audit_logs', null, 'read');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const tableName = searchParams.get('tableName');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get audit logs
    const auditLogs = await hipaaAuth.getAuditLogs(
      userId || undefined,
      tableName || undefined,
      startDate || undefined,
      endDate || undefined,
      limit
    );

    return NextResponse.json({ auditLogs });

  } catch (error) {
    console.error('Get audit logs error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve audit logs' },
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
    const { tableName, recordId, action, oldValues, newValues } = body;

    // Validate required fields
    if (!tableName || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log audit event
    await hipaaAuth.logAuditEvent(tableName, recordId, action, oldValues, newValues);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Log audit event error:', error);
    return NextResponse.json(
      { error: 'Failed to log audit event' },
      { status: 500 }
    );
  }
} 