import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';
import { hipaaAuth } from '../auth/hipaaAuth';

export interface EnhancedSyncJob {
  id: string;
  table_name: string;
  operation: 'insert' | 'update' | 'delete' | 'bulk_update' | 'schema_change';
  record_id: string | null;
  sync_status: 'pending' | 'synced' | 'failed' | 'conflict' | 'retry' | 'cancelled';
  sync_attempts: number;
  max_retries: number;
  last_sync_attempt: string | null;
  next_retry_at: string | null;
  error_message: string | null;
  old_data: any;
  new_data: any;
  conflict_id: string | null;
  priority: number; // 1-10, higher is more important
  batch_id: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface SyncConflict {
  id: string;
  table_name: string;
  record_id: string;
  local_data: any;
  remote_data: any;
  conflict_type: 'update_conflict' | 'delete_conflict' | 'insert_conflict' | 'schema_conflict';
  conflict_reason: string;
  resolution_strategy: 'last_write_wins' | 'manual' | 'timestamp_based' | 'field_merge';
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution: 'local_wins' | 'remote_wins' | 'manual_merge' | 'field_merge' | null;
  merged_data: any;
}

export interface SyncMetrics {
  total_jobs: number;
  pending_jobs: number;
  synced_jobs: number;
  failed_jobs: number;
  conflict_jobs: number;
  average_sync_time_ms: number;
  sync_success_rate: number;
  last_sync_at: string | null;
  table_breakdown: Record<string, {
    total: number;
    pending: number;
    synced: number;
    failed: number;
  }>;
}

export interface SyncConfig {
  id: string;
  table_name: string;
  sync_enabled: boolean;
  sync_interval_seconds: number;
  conflict_resolution: 'last_write_wins' | 'manual' | 'timestamp_based' | 'field_merge';
  retry_strategy: 'exponential_backoff' | 'linear_backoff' | 'immediate';
  max_retries: number;
  batch_size: number;
  priority: number;
  encryption_enabled: boolean;
  compression_enabled: boolean;
  last_sync_at: string | null;
  next_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export class EnhancedSyncService {
  private supabase;
  private syncInterval: number = 5000; // 5 seconds
  private maxBatchSize: number = 100;
  private syncTimeout: number = 30000; // 30 seconds
  private isRunning: boolean = false;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Enhanced Sync Configuration Management
  async createSyncConfig(config: Omit<SyncConfig, 'id' | 'last_sync_at' | 'next_sync_at' | 'created_at' | 'updated_at'>): Promise<{ configId: string; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('sync_configs')
        .insert({
          table_name: config.table_name,
          sync_enabled: config.sync_enabled,
          sync_interval_seconds: config.sync_interval_seconds,
          conflict_resolution: config.conflict_resolution,
          retry_strategy: config.retry_strategy,
          max_retries: config.max_retries,
          batch_size: config.batch_size,
          priority: config.priority,
          encryption_enabled: config.encryption_enabled,
          compression_enabled: config.compression_enabled,
        })
        .select('id')
        .single();

      if (error) {
        return { configId: '', error: error.message };
      }

      await hipaaAuth.logAuditEvent('sync_configs', data.id, 'create', null, config);
      return { configId: data.id, error: null };

    } catch (error) {
      console.error('Create sync config error:', error);
      return { configId: '', error: 'Failed to create sync configuration' };
    }
  }

  async getSyncConfigs(): Promise<SyncConfig[]> {
    try {
      const { data, error } = await this.supabase
        .from('sync_configs')
        .select('*')
        .order('priority', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get sync configs error:', error);
      return [];
    }
  }

  async updateSyncConfig(configId: string, updates: Partial<SyncConfig>): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('sync_configs')
        .update(updates)
        .eq('id', configId);

      if (error) {
        return { error: error.message };
      }

      await hipaaAuth.logAuditEvent('sync_configs', configId, 'update', null, updates);
      return { error: null };

    } catch (error) {
      console.error('Update sync config error:', error);
      return { error: 'Failed to update sync configuration' };
    }
  }

  // Enhanced Sync Job Management
  async createSyncJob(
    tableName: string,
    operation: EnhancedSyncJob['operation'],
    recordId: string | null,
    oldData: any,
    newData: any,
    priority: number = 5,
    batchId?: string
  ): Promise<{ jobId: string; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('enhanced_sync_jobs')
        .insert({
          table_name: tableName,
          operation: operation,
          record_id: recordId,
          sync_status: 'pending',
          old_data: oldData,
          new_data: newData,
          priority: priority,
          batch_id: batchId,
          max_retries: 3,
        })
        .select('id')
        .single();

      if (error) {
        return { jobId: '', error: error.message };
      }

      return { jobId: data.id, error: null };

    } catch (error) {
      console.error('Create sync job error:', error);
      return { jobId: '', error: 'Failed to create sync job' };
    }
  }

  async getPendingSyncJobs(tableName?: string, limit: number = 50): Promise<EnhancedSyncJob[]> {
    try {
      let query = this.supabase
        .from('enhanced_sync_jobs')
        .select('*')
        .eq('sync_status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(limit);

      if (tableName) {
        query = query.eq('table_name', tableName);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get pending sync jobs error:', error);
      return [];
    }
  }

  // Advanced Conflict Detection and Resolution
  private async detectConflict(job: EnhancedSyncJob): Promise<SyncConflict | null> {
    try {
      if (!job.record_id) {
        return null;
      }

      // Check if record exists in remote database
      const { data: remoteRecord } = await this.supabase
        .from(job.table_name)
        .select('*')
        .eq('id', job.record_id)
        .single();

      if (!remoteRecord) {
        if (job.operation === 'update') {
          return {
            id: '',
            table_name: job.table_name,
            record_id: job.record_id,
            local_data: job.new_data,
            remote_data: null,
            conflict_type: 'delete_conflict',
            conflict_reason: 'Record was deleted remotely',
            resolution_strategy: 'manual',
            created_at: new Date().toISOString(),
            resolved_at: null,
            resolved_by: null,
            resolution: null,
            merged_data: null
          };
        }
        return null;
      }

      // Check for update conflicts
      if (job.operation === 'update' && remoteRecord.updated_at !== job.old_data?.updated_at) {
        return {
          id: '',
          table_name: job.table_name,
          record_id: job.record_id,
          local_data: job.new_data,
          remote_data: remoteRecord,
          conflict_type: 'update_conflict',
          conflict_reason: 'Record was modified remotely',
          resolution_strategy: 'timestamp_based',
          created_at: new Date().toISOString(),
          resolved_at: null,
          resolved_by: null,
          resolution: null,
          merged_data: null
        };
      }

      return null;

    } catch (error) {
      console.error('Detect conflict error:', error);
      return null;
    }
  }

  async resolveConflict(
    conflictId: string,
    resolution: SyncConflict['resolution'],
    mergedData?: any,
    resolvedBy?: string
  ): Promise<{ error: string | null }> {
    try {
      const { data: conflict } = await this.supabase
        .from('sync_conflicts')
        .select('*')
        .eq('id', conflictId)
        .single();

      if (!conflict) {
        return { error: 'Conflict not found' };
      }

      // Update conflict record
      await this.supabase
        .from('sync_conflicts')
        .update({
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy,
          resolution: resolution,
          merged_data: mergedData
        })
        .eq('id', conflictId);

      // Update related sync job
      await this.supabase
        .from('enhanced_sync_jobs')
        .update({
          sync_status: 'synced',
          new_data: mergedData || (resolution === 'local_wins' ? conflict.local_data : conflict.remote_data)
        })
        .eq('conflict_id', conflictId);

      // Log conflict resolution
      await hipaaAuth.logAuditEvent('sync_conflicts', conflictId, 'update', null, {
        resolution: resolution,
        resolved_by: resolvedBy
      });

      return { error: null };

    } catch (error) {
      console.error('Resolve conflict error:', error);
      return { error: 'Failed to resolve conflict' };
    }
  }

  // Enhanced Sync Processing
  async processSyncBatch(tableName?: string): Promise<{ success: boolean; processedCount: number; error: string | null }> {
    try {
      const pendingJobs = await this.getPendingSyncJobs(tableName, this.maxBatchSize);
      
      if (pendingJobs.length === 0) {
        return { success: true, processedCount: 0, error: null };
      }

      let processedCount = 0;
      const errors: string[] = [];

      for (const job of pendingJobs) {
        try {
          const result = await this.processSyncJob(job);
          if (result.success) {
            processedCount++;
          } else {
            errors.push(result.error || 'Unknown error');
          }
        } catch (error) {
          errors.push(error instanceof Error ? error.message : 'Unknown error');
        }
      }

      const error = errors.length > 0 ? errors.join('; ') : null;
      return { success: errors.length === 0, processedCount, error };

    } catch (error) {
      console.error('Process sync batch error:', error);
      return { success: false, processedCount: 0, error: 'Failed to process sync batch' };
    }
  }

  private async processSyncJob(job: EnhancedSyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      // Update attempt count
      await this.updateSyncAttempt(job.id);

      // Check for conflicts
      const conflict = await this.detectConflict(job);
      if (conflict) {
        await this.handleConflict(job, conflict);
        return { success: false, error: 'Conflict detected' };
      }

      // Perform sync operation
      const result = await this.performSyncOperation(job);
      
      if (result.success) {
        await this.markJobAsSynced(job.id);
        await hipaaAuth.logAuditEvent('enhanced_sync_jobs', job.id, 'update', job.old_data, job.new_data);
      } else {
        await this.handleSyncFailure(job, result.error || 'Sync failed');
      }

      return result;

    } catch (error) {
      console.error('Process sync job error:', error);
      await this.handleSyncFailure(job, error instanceof Error ? error.message : 'Unknown error');
      return { success: false, error: 'Failed to process sync job' };
    }
  }

  private async performSyncOperation(job: EnhancedSyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      switch (job.operation) {
        case 'insert':
          return await this.performInsert(job);
        case 'update':
          return await this.performUpdate(job);
        case 'delete':
          return await this.performDelete(job);
        case 'bulk_update':
          return await this.performBulkUpdate(job);
        case 'schema_change':
          return await this.performSchemaChange(job);
        default:
          return { success: false, error: 'Unsupported operation' };
      }
    } catch (error) {
      console.error('Perform sync operation error:', error);
      return { success: false, error: 'Failed to perform sync operation' };
    }
  }

  private async performInsert(job: EnhancedSyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase
        .from(job.table_name)
        .insert(job.new_data);

      return { success: !error, error: error?.message || null };

    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Insert failed' };
    }
  }

  private async performUpdate(job: EnhancedSyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!job.record_id) {
        return { success: false, error: 'Record ID required for update' };
      }

      const { error } = await this.supabase
        .from(job.table_name)
        .update(job.new_data)
        .eq('id', job.record_id);

      return { success: !error, error: error?.message || null };

    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Update failed' };
    }
  }

  private async performDelete(job: EnhancedSyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!job.record_id) {
        return { success: false, error: 'Record ID required for delete' };
      }

      const { error } = await this.supabase
        .from(job.table_name)
        .delete()
        .eq('id', job.record_id);

      return { success: !error, error: error?.message || null };

    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Delete failed' };
    }
  }

  private async performBulkUpdate(job: EnhancedSyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      // Implement bulk update logic
      return { success: true, error: null };

    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Bulk update failed' };
    }
  }

  private async performSchemaChange(job: EnhancedSyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      // Implement schema change logic
      return { success: true, error: null };

    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Schema change failed' };
    }
  }

  // Conflict Handling
  private async handleConflict(job: EnhancedSyncJob, conflict: SyncConflict): Promise<void> {
    try {
      // Create conflict record
      const { data: conflictRecord } = await this.supabase
        .from('sync_conflicts')
        .insert({
          table_name: conflict.table_name,
          record_id: conflict.record_id,
          local_data: conflict.local_data,
          remote_data: conflict.remote_data,
          conflict_type: conflict.conflict_type,
          conflict_reason: conflict.conflict_reason,
          resolution_strategy: conflict.resolution_strategy,
          created_at: conflict.created_at
        })
        .select('id')
        .single();

      if (conflictRecord) {
        // Update job with conflict
        await this.supabase
          .from('enhanced_sync_jobs')
          .update({
            sync_status: 'conflict',
            conflict_id: conflictRecord.id
          })
          .eq('id', job.id);
      }

    } catch (error) {
      console.error('Handle conflict error:', error);
    }
  }

  // Failure Handling with Retry Logic
  private async handleSyncFailure(job: EnhancedSyncJob, errorMessage: string): Promise<void> {
    try {
      const newAttempts = job.sync_attempts + 1;
      const maxRetries = job.max_retries || 3;

      if (newAttempts >= maxRetries) {
        // Mark as failed
        await this.supabase
          .from('enhanced_sync_jobs')
          .update({
            sync_status: 'failed',
            error_message: errorMessage,
            sync_attempts: newAttempts
          })
          .eq('id', job.id);
      } else {
        // Schedule retry
        const nextRetryAt = this.calculateNextRetryTime(newAttempts);
        await this.supabase
          .from('enhanced_sync_jobs')
          .update({
            sync_status: 'retry',
            error_message: errorMessage,
            sync_attempts: newAttempts,
            next_retry_at: nextRetryAt
          })
          .eq('id', job.id);
      }

    } catch (error) {
      console.error('Handle sync failure error:', error);
    }
  }

  private calculateNextRetryTime(attempt: number): string {
    const baseDelay = 5000; // 5 seconds
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const maxDelay = 300000; // 5 minutes
    const delay = Math.min(exponentialDelay, maxDelay);
    
    return new Date(Date.now() + delay).toISOString();
  }

  // Utility Methods
  private async updateSyncAttempt(jobId: string): Promise<void> {
    // Get current attempts and increment
    const { data: job } = await this.supabase
      .from('enhanced_sync_jobs')
      .select('sync_attempts')
      .eq('id', jobId)
      .single();

    if (job) {
      await this.supabase
        .from('enhanced_sync_jobs')
        .update({
          sync_attempts: (job.sync_attempts || 0) + 1,
          last_sync_attempt: new Date().toISOString()
        })
        .eq('id', jobId);
    }
  }

  private async markJobAsSynced(jobId: string): Promise<void> {
    await this.supabase
      .from('enhanced_sync_jobs')
      .update({
        sync_status: 'synced',
        last_sync_attempt: new Date().toISOString()
      })
      .eq('id', jobId);
  }

  // Monitoring and Metrics
  async getSyncMetrics(): Promise<SyncMetrics> {
    try {
      const { data: jobs } = await this.supabase
        .from('enhanced_sync_jobs')
        .select('sync_status, table_name, created_at, updated_at');

      const totalJobs = jobs?.length || 0;
      const pendingJobs = jobs?.filter(j => j.sync_status === 'pending').length || 0;
      const syncedJobs = jobs?.filter(j => j.sync_status === 'synced').length || 0;
      const failedJobs = jobs?.filter(j => j.sync_status === 'failed').length || 0;
      const conflictJobs = jobs?.filter(j => j.sync_status === 'conflict').length || 0;

      // Calculate table breakdown
      const tableBreakdown: Record<string, any> = {};
      jobs?.forEach(job => {
        if (!tableBreakdown[job.table_name]) {
          tableBreakdown[job.table_name] = { total: 0, pending: 0, synced: 0, failed: 0 };
        }
        tableBreakdown[job.table_name].total++;
        tableBreakdown[job.table_name][job.sync_status]++;
      });

      // Calculate success rate
      const successRate = totalJobs > 0 ? (syncedJobs / totalJobs) * 100 : 0;

      return {
        total_jobs: totalJobs,
        pending_jobs: pendingJobs,
        synced_jobs: syncedJobs,
        failed_jobs: failedJobs,
        conflict_jobs: conflictJobs,
        average_sync_time_ms: 0, // Would need to track sync times
        sync_success_rate: successRate,
        last_sync_at: jobs?.[0]?.updated_at || null,
        table_breakdown: tableBreakdown
      };

    } catch (error) {
      console.error('Get sync metrics error:', error);
      return {
        total_jobs: 0,
        pending_jobs: 0,
        synced_jobs: 0,
        failed_jobs: 0,
        conflict_jobs: 0,
        average_sync_time_ms: 0,
        sync_success_rate: 0,
        last_sync_at: null,
        table_breakdown: {}
      };
    }
  }

  // Sync Scheduler
  async startSyncScheduler(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    console.log('Enhanced sync scheduler started');

    const runSync = async () => {
      try {
        const configs = await this.getSyncConfigs();
        
        for (const config of configs) {
          if (config.sync_enabled && this.shouldSync(config)) {
            await this.processSyncBatch(config.table_name);
            await this.updateLastSyncTime(config.id);
          }
        }
      } catch (error) {
        console.error('Sync scheduler error:', error);
      }

      if (this.isRunning) {
        setTimeout(runSync, this.syncInterval);
      }
    };

    runSync();
  }

  async stopSyncScheduler(): Promise<void> {
    this.isRunning = false;
    console.log('Enhanced sync scheduler stopped');
  }

  private shouldSync(config: SyncConfig): boolean {
    if (!config.next_sync_at) {
      return true;
    }
    return new Date(config.next_sync_at) <= new Date();
  }

  private async updateLastSyncTime(configId: string): Promise<void> {
    const nextSyncAt = new Date(Date.now() + 60000); // 1 minute from now
    await this.supabase
      .from('sync_configs')
      .update({
        last_sync_at: new Date().toISOString(),
        next_sync_at: nextSyncAt.toISOString()
      })
      .eq('id', configId);
  }

  // Cleanup and Maintenance
  async cleanupOldSyncJobs(daysToKeep: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
      
      const { data, error }: { data: any[] | null, error: any } = await this.supabase
        .from('enhanced_sync_jobs')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .in('sync_status', ['synced', 'failed']);

      if (error) {
        throw error;
      }

      return data ? (data as any[]).length : 0;

    } catch (error) {
      console.error('Cleanup old sync jobs error:', error);
      return 0;
    }
  }

  async getUnresolvedConflicts(): Promise<SyncConflict[]> {
    try {
      const { data, error } = await this.supabase
        .from('sync_conflicts')
        .select('*')
        .is('resolved_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get unresolved conflicts error:', error);
      return [];
    }
  }
}

export const enhancedSyncService = new EnhancedSyncService(); 