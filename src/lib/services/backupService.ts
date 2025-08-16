import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';
import { hipaaAuth } from '../auth/hipaaAuth';

export interface BackupConfig {
  id: string;
  backupName: string;
  backupType: 'full' | 'incremental' | 'differential';
  schedule: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  encryptionEnabled: boolean;
  compressionEnabled: boolean;
  tables: string[];
  isActive: boolean;
}

export interface BackupJob {
  id: string;
  backupName: string;
  backupType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  filePath: string | null;
  fileSize: number | null;
  checksum: string | null;
  encryptionKeyId: string | null;
  backupStartedAt: string;
  backupCompletedAt: string | null;
  restoredAt: string | null;
  restoredBy: string | null;
  metadata: any;
}

export interface RestoreJob {
  id: string;
  backupId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  restoreStartedAt: string;
  restoreCompletedAt: string | null;
  restoredBy: string;
  targetDatabase: string;
  metadata: any;
}

export class BackupService {
  private supabase;
  private defaultRetentionDays = 30;
  private maxBackupSize = 1024 * 1024 * 1024; // 1GB

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Backup Configuration Management
  async createBackupConfig(config: Omit<BackupConfig, 'id'>): Promise<{ configId: string; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('backup_configs')
        .insert({
          backup_name: config.backupName,
          backup_type: config.backupType,
          schedule: config.schedule,
          retention_days: config.retentionDays,
          encryption_enabled: config.encryptionEnabled,
          compression_enabled: config.compressionEnabled,
          tables: config.tables,
          is_active: config.isActive,
        })
        .select('id')
        .single();

      if (error) {
        return { configId: '', error: error.message };
      }

      await hipaaAuth.logAuditEvent('backup_configs', data.id, 'create', null, config);
      return { configId: data.id, error: null };

    } catch (error) {
      console.error('Create backup config error:', error);
      return { configId: '', error: 'Failed to create backup configuration' };
    }
  }

  async getBackupConfigs(): Promise<BackupConfig[]> {
    try {
      const { data, error } = await this.supabase
        .from('backup_configs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get backup configs error:', error);
      return [];
    }
  }

  async updateBackupConfig(configId: string, updates: Partial<BackupConfig>): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('backup_configs')
        .update(updates)
        .eq('id', configId);

      if (error) {
        return { error: error.message };
      }

      await hipaaAuth.logAuditEvent('backup_configs', configId, 'update', null, updates);
      return { error: null };

    } catch (error) {
      console.error('Update backup config error:', error);
      return { error: 'Failed to update backup configuration' };
    }
  }

  // Backup Execution
  async createBackup(backupName: string, backupType: 'full' | 'incremental' | 'differential' = 'full'): Promise<{ backupId: string; error: string | null }> {
    try {
      // Create backup record
      const { data, error } = await this.supabase.rpc('create_data_backup', {
        p_backup_name: backupName,
        p_backup_type: backupType
      });

      if (error) {
        return { backupId: '', error: error.message };
      }

      // Start backup process
      this.executeBackup(data);

      return { backupId: data, error: null };

    } catch (error) {
      console.error('Create backup error:', error);
      return { backupId: '', error: 'Failed to create backup' };
    }
  }

  private async executeBackup(backupId: string): Promise<void> {
    try {
      // Update status to in progress
      await this.updateBackupStatus(backupId, 'in_progress');

      // Get backup configuration
      const { data: backup } = await this.supabase
        .from('data_backups')
        .select('*')
        .eq('id', backupId)
        .single();

      if (!backup) {
        throw new Error('Backup not found');
      }

      // Generate encryption key if needed
      let encryptionKeyId = null;
      if (backup.encryption_key_id) {
        encryptionKeyId = await this.generateEncryptionKey();
      }

      // Perform backup operations
      const backupData = await this.performBackupOperations(backup.backup_type);
      
      // Compress and encrypt if needed
      let processedData = backupData;
      if (backup.compression_enabled) {
        processedData = await this.compressData(processedData);
      }
      
      if (encryptionKeyId) {
        processedData = await this.encryptData(processedData, encryptionKeyId);
      }

      // Calculate checksum
      const checksum = await this.calculateChecksum(processedData);

      // Store backup file
      const filePath = await this.storeBackupFile(backupId, processedData);

      // Update backup record
      await this.supabase
        .from('data_backups')
        .update({
          status: 'completed',
          file_path: filePath,
          file_size: processedData.length,
          checksum: checksum,
          encryption_key_id: encryptionKeyId,
          backup_completed_at: new Date().toISOString(),
        })
        .eq('id', backupId);

      await hipaaAuth.logAuditEvent('data_backups', backupId, 'backup', null, { status: 'completed' });

    } catch (error) {
      console.error('Execute backup error:', error);
      
      // Update status to failed
      await this.updateBackupStatus(backupId, 'failed');
      
      await hipaaAuth.logAuditEvent('data_backups', backupId, 'backup', null, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  private async performBackupOperations(backupType: string): Promise<any> {
    // This is a simplified backup operation
    // In production, this would involve actual database backup procedures
    
    const backupData = {
      timestamp: new Date().toISOString(),
      backupType,
      tables: ['profiles', 'clients', 'therapy_sessions', 'client_files'],
      data: {}
    };

    // For demonstration, we'll just return a placeholder
    // In production, this would export actual data from each table
    return JSON.stringify(backupData);
  }

  private async compressData(data: string): Promise<string> {
    // In production, implement actual compression
    // For now, return as-is
    return data;
  }

  private async encryptData(data: string, keyId: string): Promise<string> {
    // In production, implement actual encryption
    // For now, return as-is
    return data;
  }

  private async calculateChecksum(data: string): Promise<string> {
    // In production, use a proper hashing algorithm
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async storeBackupFile(backupId: string, data: string): Promise<string> {
    // In production, store in secure cloud storage (S3, etc.)
    // For now, return a placeholder path
    return `/backups/${backupId}.json`;
  }

  private async generateEncryptionKey(): Promise<string> {
    // In production, generate and store actual encryption keys
    return `key_${Date.now()}`;
  }

  private async updateBackupStatus(backupId: string, status: string): Promise<void> {
    await this.supabase
      .from('data_backups')
      .update({ status })
      .eq('id', backupId);
  }

  // Backup Management
  async getBackups(limit: number = 50): Promise<BackupJob[]> {
    try {
      const { data, error } = await this.supabase
        .from('data_backups')
        .select('*')
        .order('backup_started_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get backups error:', error);
      return [];
    }
  }

  async getBackup(backupId: string): Promise<BackupJob | null> {
    try {
      const { data, error } = await this.supabase
        .from('data_backups')
        .select('*')
        .eq('id', backupId)
        .single();

      if (error || !data) {
        return null;
      }

      return data;

    } catch (error) {
      console.error('Get backup error:', error);
      return null;
    }
  }

  async deleteBackup(backupId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('data_backups')
        .delete()
        .eq('id', backupId);

      if (error) {
        return { error: error.message };
      }

      await hipaaAuth.logAuditEvent('data_backups', backupId, 'delete', null, null);
      return { error: null };

    } catch (error) {
      console.error('Delete backup error:', error);
      return { error: 'Failed to delete backup' };
    }
  }

  // Restore Operations
  async restoreBackup(backupId: string, targetDatabase: string): Promise<{ restoreId: string; error: string | null }> {
    try {
      // Verify backup exists and is valid
      const backup = await this.getBackup(backupId);
      if (!backup) {
        return { restoreId: '', error: 'Backup not found' };
      }

      if (backup.status !== 'completed') {
        return { restoreId: '', error: 'Backup is not ready for restoration' };
      }

      // Create restore job
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        return { restoreId: '', error: 'User not authenticated' };
      }

      const { data, error } = await this.supabase
        .from('restore_jobs')
        .insert({
          backup_id: backupId,
          status: 'pending',
          restore_started_at: new Date().toISOString(),
          restored_by: user.id,
          target_database: targetDatabase,
        })
        .select('id')
        .single();

      if (error) {
        return { restoreId: '', error: error.message };
      }

      // Start restore process
      this.executeRestore(data.id, backupId);

      return { restoreId: data.id, error: null };

    } catch (error) {
      console.error('Restore backup error:', error);
      return { restoreId: '', error: 'Failed to initiate restore' };
    }
  }

  private async executeRestore(restoreId: string, backupId: string): Promise<void> {
    try {
      // Update status to in progress
      await this.updateRestoreStatus(restoreId, 'in_progress');

      // Get backup data
      const backup = await this.getBackup(backupId);
      if (!backup) {
        throw new Error('Backup not found');
      }

      // Load backup file
      const backupData = await this.loadBackupFile(backup.filePath!);

      // Decrypt if needed
      let decryptedData = backupData;
      if (backup.encryptionKeyId) {
        decryptedData = await this.decryptData(backupData, backup.encryptionKeyId);
      }

      // Decompress if needed
      let decompressedData = decryptedData;
      // Note: Compression status would be stored in metadata or backup config
      // For now, assume data is already in the correct format

      // Verify checksum
      const calculatedChecksum = await this.calculateChecksum(decompressedData);
      if (calculatedChecksum !== backup.checksum) {
        throw new Error('Backup integrity check failed');
      }

      // Perform restore operations
      await this.performRestoreOperations(decompressedData);

      // Update restore job status
      await this.updateRestoreStatus(restoreId, 'completed');

      // Update backup record
      await this.supabase
        .from('data_backups')
        .update({
          restored_at: new Date().toISOString(),
          restored_by: (await this.supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', backupId);

      await hipaaAuth.logAuditEvent('restore_jobs', restoreId, 'restore', null, { status: 'completed' });

    } catch (error) {
      console.error('Execute restore error:', error);
      
      await this.updateRestoreStatus(restoreId, 'failed');
      
      await hipaaAuth.logAuditEvent('restore_jobs', restoreId, 'restore', null, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  private async loadBackupFile(filePath: string): Promise<string> {
    // In production, load from actual storage
    // For now, return placeholder data
    return '{"timestamp":"2024-01-01T00:00:00Z","backupType":"full","tables":[],"data":{}}';
  }

  private async decryptData(data: string, keyId: string): Promise<string> {
    // In production, implement actual decryption
    return data;
  }

  private async decompressData(data: string): Promise<string> {
    // In production, implement actual decompression
    return data;
  }

  private async performRestoreOperations(data: string): Promise<void> {
    // In production, implement actual restore operations
    // This would involve restoring data to the database
    console.log('Performing restore operations...');
  }

  private async updateRestoreStatus(restoreId: string, status: string): Promise<void> {
    await this.supabase
      .from('restore_jobs')
      .update({ 
        status,
        restore_completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', restoreId);
  }

  // Automated Backup Scheduling
  async scheduleBackups(): Promise<void> {
    try {
      const configs = await this.getBackupConfigs();
      
      for (const config of configs) {
        if (this.shouldRunBackup(config)) {
          await this.createBackup(config.backupName, config.backupType as any);
        }
      }
    } catch (error) {
      console.error('Schedule backups error:', error);
    }
  }

  private shouldRunBackup(config: BackupConfig): boolean {
    // In production, implement proper scheduling logic
    // For now, return false to prevent automatic backups
    return false;
  }

  // Backup Retention and Cleanup
  async cleanupExpiredBackups(): Promise<number> {
    try {
      const configs = await this.getBackupConfigs();
      let deletedCount = 0;

      for (const config of configs) {
        const expiredBackups = await this.getExpiredBackups(config.retentionDays);
        
        for (const backup of expiredBackups) {
          await this.deleteBackup(backup.id);
          deletedCount++;
        }
      }

      return deletedCount;

    } catch (error) {
      console.error('Cleanup expired backups error:', error);
      return 0;
    }
  }

  private async getExpiredBackups(retentionDays: number): Promise<BackupJob[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const { data, error } = await this.supabase
        .from('data_backups')
        .select('*')
        .lt('backup_started_at', cutoffDate.toISOString())
        .eq('status', 'completed');

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get expired backups error:', error);
      return [];
    }
  }

  // Backup Health Monitoring
  async getBackupHealth(): Promise<any> {
    try {
      const backups = await this.getBackups(100);
      const recentBackups = backups.filter(b => {
        const backupDate = new Date(b.backupStartedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return backupDate > weekAgo;
      });

      const successRate = recentBackups.length > 0 
        ? (recentBackups.filter(b => b.status === 'completed').length / recentBackups.length) * 100
        : 0;

      const totalSize = recentBackups
        .filter(b => b.fileSize)
        .reduce((sum, b) => sum + (b.fileSize || 0), 0);

      return {
        totalBackups: backups.length,
        recentBackups: recentBackups.length,
        successRate: Math.round(successRate * 100) / 100,
        totalSize,
        lastBackup: backups[0]?.backupStartedAt || null,
        health: successRate > 90 ? 'good' : successRate > 70 ? 'warning' : 'critical'
      };

    } catch (error) {
      console.error('Get backup health error:', error);
      return {
        totalBackups: 0,
        recentBackups: 0,
        successRate: 0,
        totalSize: 0,
        lastBackup: null,
        health: 'unknown'
      };
    }
  }
}

// Export singleton instance
export const backupService = new BackupService(); 