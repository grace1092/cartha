import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';
import { comprehensiveAuth } from '@/lib/auth/comprehensiveAuth';
import { enhancedSyncService } from '@/lib/services/enhancedSyncService';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/data-storage/sync - List sync jobs and configurations
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_sync_jobs', null, 'read');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'jobs', 'configs', 'conflicts', or 'metrics'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const tableName = searchParams.get('table');

    if (type === 'configs') {
      // Get sync configurations
      const { data: configs, error: configError } = await supabase
        .from('sync_configs')
        .select('*')
        .order('priority', { ascending: false })
        .range(offset, offset + limit - 1);

      if (configError) {
        return NextResponse.json({ error: configError.message }, { status: 500 });
      }

      return NextResponse.json({ configs: configs || [] });

    } else if (type === 'conflicts') {
      // Get unresolved conflicts
      const conflicts = await enhancedSyncService.getUnresolvedConflicts();
      return NextResponse.json({ conflicts });

    } else if (type === 'metrics') {
      // Get sync metrics
      const metrics = await enhancedSyncService.getSyncMetrics();
      return NextResponse.json({ metrics });

    } else {
      // Get sync jobs
      let query = supabase
        .from('enhanced_sync_jobs')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('sync_status', status);
      }

      if (tableName) {
        query = query.eq('table_name', tableName);
      }

      const { data: jobs, error: jobError } = await query;

      if (jobError) {
        return NextResponse.json({ error: jobError.message }, { status: 500 });
      }

      return NextResponse.json({ jobs: jobs || [] });
    }

  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/data-storage/sync - Create sync job or configuration
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_sync_jobs', null, 'write');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { action, data } = body;

    if (action === 'create_job') {
      // Create a new sync job
      const { jobId, error } = await enhancedSyncService.createSyncJob(
        data.tableName,
        data.operation,
        data.recordId,
        data.oldData,
        data.newData,
        data.priority || 5,
        data.batchId
      );

      if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }

      // Log the sync job creation
      await comprehensiveAuth.logSecurityEvent(user.id, 'data_access', 'medium', {
        job_id: jobId,
        table_name: data.tableName,
        operation: data.operation
      });

      return NextResponse.json({ jobId });

    } else if (action === 'create_config') {
      // Create sync configuration
      const { configId, error } = await enhancedSyncService.createSyncConfig({
        table_name: data.tableName,
        sync_enabled: data.syncEnabled !== false,
        sync_interval_seconds: data.syncIntervalSeconds || 300,
        conflict_resolution: data.conflictResolution || 'last_write_wins',
        retry_strategy: data.retryStrategy || 'exponential_backoff',
        max_retries: data.maxRetries || 3,
        batch_size: data.batchSize || 100,
        priority: data.priority || 5,
        encryption_enabled: data.encryptionEnabled || false,
        compression_enabled: data.compressionEnabled || false
      });

      if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }

      return NextResponse.json({ configId });

    } else if (action === 'process_batch') {
      // Process sync batch
      const result = await enhancedSyncService.processSyncBatch(data.tableName);
      return NextResponse.json(result);

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/data-storage/sync - Update sync job, configuration, or resolve conflict
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_sync_jobs', null, 'write');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { action, id, updates, resolution, mergedData } = body;

    if (action === 'update_config') {
      // Update sync configuration
      const { error } = await enhancedSyncService.updateSyncConfig(id, updates);
      
      if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }

      return NextResponse.json({ success: true });

    } else if (action === 'resolve_conflict') {
      // Resolve sync conflict
      const { error } = await enhancedSyncService.resolveConflict(
        id,
        resolution,
        mergedData,
        user.id
      );

      if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }

      return NextResponse.json({ success: true });

    } else if (action === 'retry_job') {
      // Retry failed sync job
      const { data: job, error: fetchError } = await supabase
        .from('enhanced_sync_jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
      }

      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      // Reset job for retry
      const { error: updateError } = await supabase
        .from('enhanced_sync_jobs')
        .update({
          sync_status: 'pending',
          sync_attempts: 0,
          error_message: null,
          next_retry_at: null
        })
        .eq('id', id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/data-storage/sync - Delete sync job or configuration
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_sync_jobs', null, 'delete');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // 'job' or 'config'

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (type === 'config') {
      const { error } = await supabase
        .from('sync_configs')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await supabase
        .from('enhanced_sync_jobs')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Log the deletion
    await comprehensiveAuth.logSecurityEvent(user.id, 'data_access', 'medium', {
      deleted_id: id,
      type: type
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 