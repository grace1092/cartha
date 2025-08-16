import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';
import { comprehensiveAuth } from '@/lib/auth/comprehensiveAuth';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/data-storage/backup - List backups and configurations
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionToken = authHeader.replace('Bearer ', '');
    const { valid, user } = await comprehensiveAuth.validateSession(sessionToken);
    
    if (!valid || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Check permissions
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_backups', null, 'read');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'backups' or 'configs'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (type === 'configs') {
      // Get backup configurations
      const { data: configs, error: configError } = await supabase
        .from('data_storage_configs')
        .select('*')
        .eq('config_type', 'backup')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (configError) {
        return NextResponse.json({ error: configError.message }, { status: 500 });
      }

      return NextResponse.json({ configs: configs || [] });

    } else {
      // Get backup jobs
      const { data: backups, error: backupError } = await supabase
        .from('enhanced_backups')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (backupError) {
        return NextResponse.json({ error: backupError.message }, { status: 500 });
      }

      return NextResponse.json({ backups: backups || [] });
    }

  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/data-storage/backup - Create backup or configuration
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionToken = authHeader.replace('Bearer ', '');
    const { valid, user } = await comprehensiveAuth.validateSession(sessionToken);
    
    if (!valid || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Check permissions
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_backups', null, 'write');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { action, data } = body;

    if (action === 'create_backup') {
      // Create a new backup
      const { data: backup, error } = await supabase
        .from('enhanced_backups')
        .insert({
          backup_name: data.backupName,
          backup_type: data.backupType,
          status: 'pending',
          retention_days: data.retentionDays || 30,
          metadata: data.metadata || {}
        })
        .select('*')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Log the backup creation
      await comprehensiveAuth.logSecurityEvent(user.id, 'backup_request', 'medium', {
        backup_id: backup.id,
        backup_name: data.backupName,
        backup_type: data.backupType
      });

      return NextResponse.json({ backup });

    } else if (action === 'create_config') {
      // Create backup configuration
      const { data: config, error } = await supabase
        .from('data_storage_configs')
        .insert({
          config_name: data.configName,
          config_type: 'backup',
          settings: data.settings,
          is_active: data.isActive !== false,
          created_by: user.id
        })
        .select('*')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ config });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/data-storage/backup - Update backup or configuration
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionToken = authHeader.replace('Bearer ', '');
    const { valid, user } = await comprehensiveAuth.validateSession(sessionToken);
    
    if (!valid || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Check permissions
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_backups', null, 'write');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { action, id, updates } = body;

    if (action === 'update_config') {
      const { data: config, error } = await supabase
        .from('data_storage_configs')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ config });

    } else if (action === 'restore_backup') {
      // Mark backup as restored
      const { data: backup, error } = await supabase
        .from('enhanced_backups')
        .update({
          status: 'restored',
          restored_at: new Date().toISOString(),
          restored_by: user.id
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Log the restore action
      await comprehensiveAuth.logSecurityEvent(user.id, 'backup_request', 'high', {
        backup_id: id,
        action: 'restore'
      });

      return NextResponse.json({ backup });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/data-storage/backup - Delete backup or configuration
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionToken = authHeader.replace('Bearer ', '');
    const { valid, user } = await comprehensiveAuth.validateSession(sessionToken);
    
    if (!valid || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Check permissions
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_backups', null, 'delete');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // 'backup' or 'config'

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (type === 'config') {
      const { error } = await supabase
        .from('data_storage_configs')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await supabase
        .from('enhanced_backups')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Log the deletion
    await comprehensiveAuth.logSecurityEvent(user.id, 'backup_request', 'medium', {
      deleted_id: id,
      type: type
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 