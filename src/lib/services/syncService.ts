import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';
import { hipaaAuth } from '../auth/hipaaAuth';

export interface SyncConfig {
  id: string;
  tableName: string;
  syncEnabled: boolean;
  syncInterval: number; // seconds
  conflictResolution: 'last_write_wins' | 'manual' | 'timestamp_based';
  encryptionEnabled: boolean;
  compressionEnabled: boolean;
  lastSyncAt: string | null;
  nextSyncAt: string | null;
}

export interface SyncJob {
  id: string;
  tableName: string;
  operation: 'insert' | 'update' | 'delete';
  recordId: string;
  syncStatus: 'pending' | 'synced' | 'failed' | 'conflict';
  lastSyncAttempt: string;
  syncAttempts: number;
  errorMessage: string | null;
  oldData: any;
  newData: any;
  metadata: any;
}

export interface SyncConflict {
  id: string;
  tableName: string;
  recordId: string;
  localData: any;
  remoteData: any;
  conflictType: 'update_conflict' | 'delete_conflict' | 'insert_conflict';
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  resolution: 'local_wins' | 'remote_wins' | 'manual_merge' | null;
}

export class SyncService {
  private supabase;
  private syncInterval: number = 5000; // 5 seconds
  private maxRetries: number = 3;
  private syncTimeout: number = 30000; // 30 seconds

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Sync Configuration Management
  async createSyncConfig(config: Omit<SyncConfig, 'id' | 'lastSyncAt' | 'nextSyncAt'>): Promise<{ configId: string; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('sync_configs')
        .insert({
          table_name: config.tableName,
          sync_enabled: config.syncEnabled,
          sync_interval: config.syncInterval,
          conflict_resolution: config.conflictResolution,
          encryption_enabled: config.encryptionEnabled,
          compression_enabled: config.compressionEnabled,
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
        .order('created_at', { ascending: false });

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

  // Real-time Sync Operations
  async syncTable(tableName: string): Promise<{ success: boolean; syncedCount: number; error: string | null }> {
    try {
      // Get pending sync jobs for this table
      const pendingJobs = await this.getPendingSyncJobs(tableName);
      
      if (pendingJobs.length === 0) {
        return { success: true, syncedCount: 0, error: null };
      }

      let syncedCount = 0;
      const errors: string[] = [];

      for (const job of pendingJobs) {
        try {
          const result = await this.processSyncJob(job);
          if (result.success) {
            syncedCount++;
          } else {
            errors.push(result.error || 'Unknown error');
          }
        } catch (error) {
          errors.push(error instanceof Error ? error.message : 'Unknown error');
        }
      }

      // Update sync config
      await this.updateLastSyncTime(tableName);

      const error = errors.length > 0 ? errors.join('; ') : null;
      return { success: errors.length === 0, syncedCount, error };

    } catch (error) {
      console.error('Sync table error:', error);
      return { success: false, syncedCount: 0, error: 'Failed to sync table' };
    }
  }

  private async processSyncJob(job: SyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      // Update attempt count
      await this.updateSyncAttempt(job.id);

      // Check for conflicts
      const conflict = await this.checkForConflicts(job);
      if (conflict) {
        await this.handleConflict(job, conflict);
        return { success: false, error: 'Conflict detected' };
      }

      // Perform sync operation
      const result = await this.performSyncOperation(job);
      
      if (result.success) {
        await this.markJobAsSynced(job.id);
        await hipaaAuth.logAuditEvent('sync_logs', job.id, 'update', job.oldData, job.newData);
      } else {
        await this.markJobAsFailed(job.id, result.error || 'Sync failed');
      }

      return result;

    } catch (error) {
      console.error('Process sync job error:', error);
      await this.markJobAsFailed(job.id, error instanceof Error ? error.message : 'Unknown error');
      return { success: false, error: 'Failed to process sync job' };
    }
  }

  private async performSyncOperation(job: SyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      switch (job.operation) {
        case 'insert':
          return await this.performInsert(job);
        case 'update':
          return await this.performUpdate(job);
        case 'delete':
          return await this.performDelete(job);
        default:
          return { success: false, error: 'Unknown operation' };
      }
    } catch (error) {
      console.error('Perform sync operation error:', error);
      return { success: false, error: 'Failed to perform sync operation' };
    }
  }

  private async performInsert(job: SyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase
        .from(job.tableName)
        .insert(job.newData);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };

    } catch (error) {
      return { success: false, error: 'Insert operation failed' };
    }
  }

  private async performUpdate(job: SyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase
        .from(job.tableName)
        .update(job.newData)
        .eq('id', job.recordId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };

    } catch (error) {
      return { success: false, error: 'Update operation failed' };
    }
  }

  private async performDelete(job: SyncJob): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.supabase
        .from(job.tableName)
        .delete()
        .eq('id', job.recordId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };

    } catch (error) {
      return { success: false, error: 'Delete operation failed' };
    }
  }

  // Conflict Detection and Resolution
  private async checkForConflicts(job: SyncJob): Promise<SyncConflict | null> {
    try {
      // Check if record exists and has been modified since last sync
      const { data: existingRecord } = await this.supabase
        .from(job.tableName)
        .select('*')
        .eq('id', job.recordId)
        .single();

      if (!existingRecord) {
        return null;
      }

      // Compare timestamps to detect conflicts
      const lastModified = existingRecord.updated_at || existingRecord.created_at;
      const jobTimestamp = job.metadata?.timestamp || job.lastSyncAttempt;

      if (new Date(lastModified) > new Date(jobTimestamp)) {
        return {
          id: '',
          tableName: job.tableName,
          recordId: job.recordId,
          localData: existingRecord,
          remoteData: job.newData,
          conflictType: 'update_conflict',
          createdAt: new Date().toISOString(),
          resolvedAt: null,
          resolvedBy: null,
          resolution: null
        };
      }

      return null;

    } catch (error) {
      console.error('Check for conflicts error:', error);
      return null;
    }
  }

  private async handleConflict(job: SyncJob, conflict: SyncConflict): Promise<void> {
    try {
      // Create conflict record
      const { data: conflictRecord } = await this.supabase
        .from('sync_conflicts')
        .insert({
          table_name: conflict.tableName,
          record_id: conflict.recordId,
          local_data: conflict.localData,
          remote_data: conflict.remoteData,
          conflict_type: conflict.conflictType,
        })
        .select('id')
        .single();

      if (conflictRecord) {
        // Mark job as conflict
        await this.markJobAsConflict(job.id, conflictRecord.id);
      }

      // Log conflict
      await hipaaAuth.logAuditEvent('sync_conflicts', conflictRecord?.id || '', 'create', null, conflict);

    } catch (error) {
      console.error('Handle conflict error:', error);
    }
  }

  async resolveConflict(conflictId: string, resolution: 'local_wins' | 'remote_wins' | 'manual_merge', mergedData?: any): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        return { error: 'User not authenticated' };
      }

      const { data: conflict } = await this.supabase
        .from('sync_conflicts')
        .select('*')
        .eq('id', conflictId)
        .single();

      if (!conflict) {
        return { error: 'Conflict not found' };
      }

      let resolvedData = conflict.local_data;

      switch (resolution) {
        case 'local_wins':
          resolvedData = conflict.local_data;
          break;
        case 'remote_wins':
          resolvedData = conflict.remote_data;
          break;
        case 'manual_merge':
          if (!mergedData) {
            return { error: 'Merged data required for manual merge' };
          }
          resolvedData = mergedData;
          break;
      }

      // Update the record
      const { error: updateError } = await this.supabase
        .from(conflict.table_name)
        .update(resolvedData)
        .eq('id', conflict.record_id);

      if (updateError) {
        return { error: updateError.message };
      }

      // Mark conflict as resolved
      await this.supabase
        .from('sync_conflicts')
        .update({
          resolved_at: new Date().toISOString(),
          resolved_by: user.id,
          resolution: resolution,
        })
        .eq('id', conflictId);

      // Retry associated sync job
      await this.retrySyncJob(conflict.record_id);

      await hipaaAuth.logAuditEvent('sync_conflicts', conflictId, 'update', null, { resolution });

      return { error: null };

    } catch (error) {
      console.error('Resolve conflict error:', error);
      return { error: 'Failed to resolve conflict' };
    }
  }

  // Sync Job Management
  private async getPendingSyncJobs(tableName: string): Promise<SyncJob[]> {
    try {
      const { data, error } = await this.supabase
        .from('sync_logs')
        .select('*')
        .eq('table_name', tableName)
        .eq('sync_status', 'pending')
        .order('last_sync_attempt', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get pending sync jobs error:', error);
      return [];
    }
  }

  private async updateSyncAttempt(jobId: string): Promise<void> {
    // Fetch current sync_attempts
    const { data, error } = await this.supabase
      .from('sync_logs')
      .select('sync_attempts')
      .eq('id', jobId)
      .single();

    if (error || !data) return;

    await this.supabase
      .from('sync_logs')
      .update({
        sync_attempts: data.sync_attempts + 1,
        last_sync_attempt: new Date().toISOString(),
      })
      .eq('id', jobId);
  }

  private async markJobAsSynced(jobId: string): Promise<void> {
    await this.supabase
      .from('sync_logs')
      .update({ sync_status: 'synced' })
      .eq('id', jobId);
  }

  private async markJobAsFailed(jobId: string, errorMessage: string): Promise<void> {
    await this.supabase
      .from('sync_logs')
      .update({
        sync_status: 'failed',
        error_message: errorMessage,
      })
      .eq('id', jobId);
  }

  private async markJobAsConflict(jobId: string, conflictId: string): Promise<void> {
    await this.supabase
      .from('sync_logs')
      .update({
        sync_status: 'conflict',
        error_message: `Conflict detected: ${conflictId}`,
      })
      .eq('id', jobId);
  }

  private async retrySyncJob(recordId: string): Promise<void> {
    await this.supabase
      .from('sync_logs')
      .update({
        sync_status: 'pending',
        sync_attempts: 0,
        error_message: null,
      })
      .eq('record_id', recordId)
      .eq('sync_status', 'conflict');
  }

  private async updateLastSyncTime(tableName: string): Promise<void> {
    const nextSyncAt = new Date(Date.now() + this.syncInterval);
    
    await this.supabase
      .from('sync_configs')
      .update({
        last_sync_at: new Date().toISOString(),
        next_sync_at: nextSyncAt.toISOString(),
      })
      .eq('table_name', tableName);
  }

  // Sync Monitoring and Health
  async getSyncHealth(): Promise<any> {
    try {
      const configs = await this.getSyncConfigs();
      const pendingJobs = await this.getPendingSyncJobs('all');
      const failedJobs = await this.getFailedSyncJobs();
      const conflicts = await this.getUnresolvedConflicts();

      const totalJobs = pendingJobs.length + failedJobs.length;
      const successRate = totalJobs > 0 
        ? ((totalJobs - failedJobs.length) / totalJobs) * 100
        : 100;

      return {
        totalConfigs: configs.length,
        activeConfigs: configs.filter(c => c.syncEnabled).length,
        pendingJobs: pendingJobs.length,
        failedJobs: failedJobs.length,
        unresolvedConflicts: conflicts.length,
        successRate: Math.round(successRate * 100) / 100,
        lastSync: configs.length > 0 ? Math.max(...configs.map(c => c.lastSyncAt ? new Date(c.lastSyncAt).getTime() : 0)) : null,
        health: successRate > 95 ? 'good' : successRate > 80 ? 'warning' : 'critical'
      };

    } catch (error) {
      console.error('Get sync health error:', error);
      return {
        totalConfigs: 0,
        activeConfigs: 0,
        pendingJobs: 0,
        failedJobs: 0,
        unresolvedConflicts: 0,
        successRate: 0,
        lastSync: null,
        health: 'unknown'
      };
    }
  }

  private async getFailedSyncJobs(): Promise<SyncJob[]> {
    try {
      const { data, error } = await this.supabase
        .from('sync_logs')
        .select('*')
        .eq('sync_status', 'failed')
        .order('last_sync_attempt', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get failed sync jobs error:', error);
      return [];
    }
  }

  private async getUnresolvedConflicts(): Promise<SyncConflict[]> {
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

  // Automated Sync Scheduling
  async startSyncScheduler(): Promise<void> {
    setInterval(async () => {
      try {
        const configs = await this.getSyncConfigs();
        
        for (const config of configs) {
          if (config.syncEnabled && this.shouldSync(config)) {
            await this.syncTable(config.tableName);
          }
        }
      } catch (error) {
        console.error('Sync scheduler error:', error);
      }
    }, this.syncInterval);
  }

  private shouldSync(config: SyncConfig): boolean {
    if (!config.nextSyncAt) {
      return true;
    }

    return new Date() >= new Date(config.nextSyncAt);
  }

  // Data Consistency Checks
  async checkDataConsistency(tableName: string): Promise<{ consistent: boolean; issues: string[] }> {
    try {
      const issues: string[] = [];

      // Check for orphaned records
      const orphanedRecords = await this.findOrphanedRecords(tableName);
      if (orphanedRecords.length > 0) {
        issues.push(`Found ${orphanedRecords.length} orphaned records`);
      }

      // Check for duplicate records
      const duplicateRecords = await this.findDuplicateRecords(tableName);
      if (duplicateRecords.length > 0) {
        issues.push(`Found ${duplicateRecords.length} duplicate records`);
      }

      // Check for data integrity issues
      const integrityIssues = await this.checkDataIntegrity(tableName);
      issues.push(...integrityIssues);

      return {
        consistent: issues.length === 0,
        issues
      };

    } catch (error) {
      console.error('Check data consistency error:', error);
      return {
        consistent: false,
        issues: ['Failed to check data consistency']
      };
    }
  }

  private async findOrphanedRecords(tableName: string): Promise<any[]> {
    // Implementation depends on table structure
    // This is a placeholder
    return [];
  }

  private async findDuplicateRecords(tableName: string): Promise<any[]> {
    // Implementation depends on table structure
    // This is a placeholder
    return [];
  }

  private async checkDataIntegrity(tableName: string): Promise<string[]> {
    // Implementation depends on table structure
    // This is a placeholder
    return [];
  }
}

// Export singleton instance
export const syncService = new SyncService(); 