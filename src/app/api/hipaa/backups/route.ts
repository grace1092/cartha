import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { backupService } from '@/lib/services/backupService';
import { hipaaAuth } from '@/lib/auth/hipaaAuth';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view backups
    const hasPermission = await hipaaAuth.checkDataAccess(user.id, 'data_backups', null, 'read');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get backups
    const backups = await backupService.getBackups(limit);

    return NextResponse.json({ backups });

  } catch (error) {
    console.error('Get backups error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve backups' },
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

    // Check if user has permission to create backups
    const hasPermission = await hipaaAuth.checkDataAccess(user.id, 'data_backups', null, 'write');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { backupName, backupType = 'full' } = body;

    // Validate required fields
    if (!backupName) {
      return NextResponse.json(
        { error: 'Backup name is required' },
        { status: 400 }
      );
    }

    // Create backup
    const { backupId, error } = await backupService.createBackup(backupName, backupType);
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ backupId, success: true });

  } catch (error) {
    console.error('Create backup error:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
} 