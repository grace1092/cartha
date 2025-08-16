import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';
import { hipaaAuth } from '../auth/hipaaAuth';

export interface ExportConfig {
  id: string;
  userId: string;
  exportType: 'client_data' | 'session_data' | 'billing_data' | 'full_export' | 'audit_logs' | 'custom';
  format: 'json' | 'csv' | 'xml' | 'pdf' | 'encrypted_zip';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filePath: string | null;
  fileSize: number | null;
  encryptionKeyId: string | null;
  requestedAt: string;
  completedAt: string | null;
  expiresAt: string;
  downloadCount: number;
  filters: any;
  metadata: any;
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  exportType: string;
  format: string;
  tables: string[];
  fields: string[];
  filters: any;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}

export class ExportService {
  private supabase;
  private maxExportSize = 100 * 1024 * 1024; // 100MB
  private exportRetentionDays = 7;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Export Request Management
  async requestExport(
    userId: string,
    exportType: ExportConfig['exportType'],
    format: ExportConfig['format'],
    filters: any = {},
    customFields?: string[]
  ): Promise<{ exportId: string; error: string | null }> {
    try {
      // Validate export request
      const validation = await this.validateExportRequest(userId, exportType, format);
      if (!validation.valid) {
        return { exportId: '', error: validation.error };
      }

      // Check export limits
      const limitCheck = await this.checkExportLimits(userId);
      if (!limitCheck.allowed) {
        return { exportId: '', error: limitCheck.error };
      }

      // Create export record
      const { data, error } = await this.supabase.rpc('initiate_data_export', {
        p_export_type: exportType,
        p_format: format,
        p_filters: filters
      });

      if (error) {
        return { exportId: '', error: error.message };
      }

      // Start export process
      this.processExport(data, userId, exportType, format, filters, customFields);

      return { exportId: data, error: null };

    } catch (error) {
      console.error('Request export error:', error);
      return { exportId: '', error: 'Failed to request export' };
    }
  }

  private async validateExportRequest(
    userId: string,
    exportType: string,
    format: string
  ): Promise<{ valid: boolean; error: string | null }> {
    try {
      // Check if user has permission to export this type of data
      const hasPermission = await hipaaAuth.checkDataAccess(userId, 'data_exports', null, 'export');
      if (!hasPermission) {
        return { valid: false, error: 'Insufficient permissions for data export' };
      }

      // Validate export type
      const validTypes = ['client_data', 'session_data', 'billing_data', 'full_export', 'audit_logs', 'custom'];
      if (!validTypes.includes(exportType)) {
        return { valid: false, error: 'Invalid export type' };
      }

      // Validate format
      const validFormats = ['json', 'csv', 'xml', 'pdf', 'encrypted_zip'];
      if (!validFormats.includes(format)) {
        return { valid: false, error: 'Invalid export format' };
      }

      return { valid: true, error: null };

    } catch (error) {
      console.error('Validate export request error:', error);
      return { valid: false, error: 'Failed to validate export request' };
    }
  }

  private async checkExportLimits(userId: string): Promise<{ allowed: boolean; error: string | null }> {
    try {
      // Check daily export limit
      const today = new Date().toISOString().split('T')[0];
      const { data: todayExports } = await this.supabase
        .from('data_exports')
        .select('*')
        .eq('user_id', userId)
        .gte('requested_at', today);

      const dailyLimit = 10; // Configurable limit
      if (todayExports && todayExports.length >= dailyLimit) {
        return { allowed: false, error: 'Daily export limit exceeded' };
      }

      // Check file size limits
      const totalSizeToday = todayExports?.reduce((sum, exp) => sum + (exp.file_size || 0), 0) || 0;
      if (totalSizeToday >= this.maxExportSize) {
        return { allowed: false, error: 'Daily export size limit exceeded' };
      }

      return { allowed: true, error: null };

    } catch (error) {
      console.error('Check export limits error:', error);
      return { allowed: false, error: 'Failed to check export limits' };
    }
  }

  // Export Processing
  private async processExport(
    exportId: string,
    userId: string,
    exportType: string,
    format: string,
    filters: any,
    customFields?: string[]
  ): Promise<void> {
    try {
      // Update status to processing
      await this.updateExportStatus(exportId, 'processing');

      // Collect data based on export type
      const exportData = await this.collectExportData(userId, exportType, filters, customFields);

      // Format data according to requested format
      const formattedData = await this.formatExportData(exportData, format);

      // Encrypt if needed
      let finalData = formattedData;
      let encryptionKeyId = null;
      if (format === 'encrypted_zip' || this.shouldEncrypt(exportType)) {
        encryptionKeyId = await this.generateEncryptionKey();
        finalData = await this.encryptData(formattedData, encryptionKeyId);
      }

      // Store export file
      const filePath = await this.storeExportFile(exportId, finalData, format);
      const fileSize = finalData.length;

      // Update export record
      await this.supabase
        .from('data_exports')
        .update({
          status: 'completed',
          file_path: filePath,
          file_size: fileSize,
          encryption_key_id: encryptionKeyId,
          completed_at: new Date().toISOString(),
        })
        .eq('id', exportId);

      // Log successful export
      await hipaaAuth.logAuditEvent('data_exports', exportId, 'export', null, {
        export_type: exportType,
        format: format,
        file_size: fileSize
      });

    } catch (error) {
      console.error('Process export error:', error);
      
      // Update status to failed
      await this.updateExportStatus(exportId, 'failed');
      
      await hipaaAuth.logAuditEvent('data_exports', exportId, 'export', null, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async collectExportData(
    userId: string,
    exportType: string,
    filters: any,
    customFields?: string[]
  ): Promise<any> {
    try {
      const data: any = {
        export_metadata: {
          export_type: exportType,
          user_id: userId,
          timestamp: new Date().toISOString(),
          filters: filters,
          custom_fields: customFields
        },
        data: {}
      };

      switch (exportType) {
        case 'client_data':
          data.data.clients = await this.exportClientData(userId, filters);
          break;
        case 'session_data':
          data.data.sessions = await this.exportSessionData(userId, filters);
          break;
        case 'billing_data':
          data.data.billing = await this.exportBillingData(userId, filters);
          break;
        case 'full_export':
          data.data = await this.exportAllData(userId, filters);
          break;
        case 'audit_logs':
          data.data.audit_logs = await this.exportAuditLogs(userId, filters);
          break;
        case 'custom':
          data.data = await this.exportCustomData(userId, filters, customFields);
          break;
      }

      return data;

    } catch (error) {
      console.error('Collect export data error:', error);
      throw new Error('Failed to collect export data');
    }
  }

  private async exportClientData(userId: string, filters: any): Promise<any[]> {
    try {
      let query = this.supabase
        .from('clients')
        .select('*')
        .eq('therapist_id', userId);

      // Apply filters
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters.intake_date_from) {
        query = query.gte('intake_date', filters.intake_date_from);
      }

      if (filters.intake_date_to) {
        query = query.lte('intake_date', filters.intake_date_to);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Export client data error:', error);
      return [];
    }
  }

  private async exportSessionData(userId: string, filters: any): Promise<any[]> {
    try {
      let query = this.supabase
        .from('therapy_sessions')
        .select('*')
        .eq('therapist_id', userId);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.session_date_from) {
        query = query.gte('session_date', filters.session_date_from);
      }

      if (filters.session_date_to) {
        query = query.lte('session_date', filters.session_date_to);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Export session data error:', error);
      return [];
    }
  }

  private async exportBillingData(userId: string, filters: any): Promise<any> {
    try {
      // Export subscription and billing information
      const { data: subscriptions, error: subError } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);

      if (subError) {
        throw subError;
      }

      const { data: billingEvents, error: billError } = await this.supabase
        .from('billing_events')
        .select('*')
        .eq('user_id', userId);

      if (billError) {
        throw billError;
      }

      return {
        subscriptions: subscriptions || [],
        billing_events: billingEvents || []
      };

    } catch (error) {
      console.error('Export billing data error:', error);
      return [];
    }
  }

  private async exportAllData(userId: string, filters: any): Promise<any> {
    try {
      const [clients, sessions, billing, files] = await Promise.all([
        this.exportClientData(userId, filters),
        this.exportSessionData(userId, filters),
        this.exportBillingData(userId, filters),
        this.exportFileData(userId, filters)
      ]);

      return {
        clients,
        sessions,
        billing,
        files
      };

    } catch (error) {
      console.error('Export all data error:', error);
      return {};
    }
  }

  private async exportAuditLogs(userId: string, filters: any): Promise<any[]> {
    try {
      let query = this.supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId);

      // Apply filters
      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      if (filters.timestamp_from) {
        query = query.gte('timestamp', filters.timestamp_from);
      }

      if (filters.timestamp_to) {
        query = query.lte('timestamp', filters.timestamp_to);
      }

      const { data, error } = await query
        .order('timestamp', { ascending: false })
        .limit(1000); // Limit for performance

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Export audit logs error:', error);
      return [];
    }
  }

  private async exportCustomData(userId: string, filters: any, customFields?: string[]): Promise<any> {
    try {
      const data: any = {};

      if (customFields) {
        for (const field of customFields) {
          const [table, column] = field.split('.');
          if (table && column) {
            const { data: fieldData, error } = await this.supabase
              .from(table)
              .select(column)
              .eq('therapist_id', userId);

            if (!error && fieldData) {
              data[field] = fieldData;
            }
          }
        }
      }

      return data;

    } catch (error) {
      console.error('Export custom data error:', error);
      return {};
    }
  }

  private async exportFileData(userId: string, filters: any): Promise<any[]> {
    try {
      let query = this.supabase
        .from('client_files')
        .select('*')
        .eq('therapist_id', userId);

      // Apply filters
      if (filters.file_type) {
        query = query.eq('file_type', filters.file_type);
      }

      if (filters.uploaded_at_from) {
        query = query.gte('uploaded_at', filters.uploaded_at_from);
      }

      if (filters.uploaded_at_to) {
        query = query.lte('uploaded_at', filters.uploaded_at_to);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Export file data error:', error);
      return [];
    }
  }

  // Data Formatting
  private async formatExportData(data: any, format: string): Promise<string> {
    try {
      switch (format) {
        case 'json':
          return JSON.stringify(data, null, 2);
        case 'csv':
          return this.convertToCSV(data);
        case 'xml':
          return this.convertToXML(data);
        case 'pdf':
          return await this.convertToPDF(data);
        case 'encrypted_zip':
          return await this.createEncryptedZip(data);
        default:
          return JSON.stringify(data);
      }
    } catch (error) {
      console.error('Format export data error:', error);
      throw new Error('Failed to format export data');
    }
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion - in production, use a proper CSV library
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];
      
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(','));
      }
      
      return csvRows.join('\n');
    }
    
    return JSON.stringify(data);
  }

  private convertToXML(data: any): string {
    // Simple XML conversion - in production, use a proper XML library
    const convertObject = (obj: any, rootName: string = 'root'): string => {
      let xml = `<${rootName}>`;
      
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          xml += convertObject(value, key);
        } else {
          xml += `<${key}>${value}</${key}>`;
        }
      }
      
      xml += `</${rootName}>`;
      return xml;
    };
    
    return `<?xml version="1.0" encoding="UTF-8"?>\n${convertObject(data)}`;
  }

  private async convertToPDF(data: any): Promise<string> {
    // In production, use a proper PDF library like jsPDF or Puppeteer
    // For now, return a placeholder
    return JSON.stringify(data);
  }

  private async createEncryptedZip(data: any): Promise<string> {
    // In production, use a proper ZIP library with encryption
    // For now, return JSON data
    return JSON.stringify(data);
  }

  // Security and Encryption
  private shouldEncrypt(exportType: string): boolean {
    const sensitiveTypes = ['client_data', 'session_data', 'full_export'];
    return sensitiveTypes.includes(exportType);
  }

  private async generateEncryptionKey(): Promise<string> {
    // In production, generate and store actual encryption keys
    return `export_key_${Date.now()}`;
  }

  private async encryptData(data: string, keyId: string): Promise<string> {
    // In production, implement actual encryption
    // For now, return as-is
    return data;
  }

  private async storeExportFile(exportId: string, data: string, format: string): Promise<string> {
    // In production, store in secure cloud storage (S3, etc.)
    // For now, return a placeholder path
    const extension = format === 'encrypted_zip' ? 'zip' : format;
    return `/exports/${exportId}.${extension}`;
  }

  private async updateExportStatus(exportId: string, status: string): Promise<void> {
    await this.supabase
      .from('data_exports')
      .update({ status })
      .eq('id', exportId);
  }

  // Export Management
  async getExports(userId: string, limit: number = 50): Promise<ExportConfig[]> {
    try {
      const { data, error } = await this.supabase
        .from('data_exports')
        .select('*')
        .eq('user_id', userId)
        .order('requested_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get exports error:', error);
      return [];
    }
  }

  async getExport(exportId: string): Promise<ExportConfig | null> {
    try {
      const { data, error } = await this.supabase
        .from('data_exports')
        .select('*')
        .eq('id', exportId)
        .single();

      if (error || !data) {
        return null;
      }

      return data;

    } catch (error) {
      console.error('Get export error:', error);
      return null;
    }
  }

  async downloadExport(exportId: string): Promise<{ data: string | null; error: string | null }> {
    try {
      const exportConfig = await this.getExport(exportId);
      if (!exportConfig) {
        return { data: null, error: 'Export not found' };
      }

      if (exportConfig.status !== 'completed') {
        return { data: null, error: 'Export not ready for download' };
      }

      if (!exportConfig.filePath) {
        return { data: null, error: 'Export file not found' };
      }

      // Check if export has expired
      if (new Date(exportConfig.expiresAt) < new Date()) {
        return { data: null, error: 'Export has expired' };
      }

      // Load export file
      const data = await this.loadExportFile(exportConfig.filePath);

      // Decrypt if needed
      let decryptedData = data;
      if (exportConfig.encryptionKeyId) {
        decryptedData = await this.decryptData(data, exportConfig.encryptionKeyId);
      }

      // Update download count
      await this.supabase
        .from('data_exports')
        .update({ download_count: exportConfig.downloadCount + 1 })
        .eq('id', exportId);

      // Log download
      await hipaaAuth.logAuditEvent('data_exports', exportId, 'data_access', null, {
        action: 'download',
        download_count: exportConfig.downloadCount + 1
      });

      return { data: decryptedData, error: null };

    } catch (error) {
      console.error('Download export error:', error);
      return { data: null, error: 'Failed to download export' };
    }
  }

  private async loadExportFile(filePath: string): Promise<string> {
    // In production, load from actual storage
    // For now, return placeholder data
    return '{"export_data": "placeholder"}';
  }

  private async decryptData(data: string, keyId: string): Promise<string> {
    // In production, implement actual decryption
    return data;
  }

  async deleteExport(exportId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('data_exports')
        .delete()
        .eq('id', exportId);

      if (error) {
        return { error: error.message };
      }

      await hipaaAuth.logAuditEvent('data_exports', exportId, 'delete', null, null);
      return { error: null };

    } catch (error) {
      console.error('Delete export error:', error);
      return { error: 'Failed to delete export' };
    }
  }

  // Export Templates
  async createExportTemplate(template: Omit<ExportTemplate, 'id' | 'createdAt'>): Promise<{ templateId: string; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('export_templates')
        .insert({
          name: template.name,
          description: template.description,
          export_type: template.exportType,
          format: template.format,
          tables: template.tables,
          fields: template.fields,
          filters: template.filters,
          is_default: template.isDefault,
          created_by: template.createdBy,
        })
        .select('id')
        .single();

      if (error) {
        return { templateId: '', error: error.message };
      }

      return { templateId: data.id, error: null };

    } catch (error) {
      console.error('Create export template error:', error);
      return { templateId: '', error: 'Failed to create export template' };
    }
  }

  async getExportTemplates(userId: string): Promise<ExportTemplate[]> {
    try {
      const { data, error } = await this.supabase
        .from('export_templates')
        .select('*')
        .or(`created_by.eq.${userId},is_default.eq.true`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get export templates error:', error);
      return [];
    }
  }

  // Cleanup and Maintenance
  async cleanupExpiredExports(): Promise<number> {
    try {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - this.exportRetentionDays);

      const { data: expiredExports, error } = await this.supabase
        .from('data_exports')
        .select('id')
        .lt('expires_at', expiredDate.toISOString());

      if (error) {
        throw error;
      }

      let deletedCount = 0;
      for (const export_ of expiredExports || []) {
        await this.deleteExport(export_.id);
        deletedCount++;
      }

      return deletedCount;

    } catch (error) {
      console.error('Cleanup expired exports error:', error);
      return 0;
    }
  }

  // Export Analytics
  async getExportAnalytics(userId: string): Promise<any> {
    try {
      const exports = await this.getExports(userId, 1000);
      
      const totalExports = exports.length;
      const successfulExports = exports.filter(e => e.status === 'completed').length;
      const failedExports = exports.filter(e => e.status === 'failed').length;
      const totalDownloads = exports.reduce((sum, e) => sum + e.downloadCount, 0);
      
      const formatBreakdown = exports.reduce((acc, e) => {
        acc[e.format] = (acc[e.format] || 0) + 1;
        return acc;
      }, {} as any);

      const typeBreakdown = exports.reduce((acc, e) => {
        acc[e.exportType] = (acc[e.exportType] || 0) + 1;
        return acc;
      }, {} as any);

      return {
        totalExports,
        successfulExports,
        failedExports,
        successRate: totalExports > 0 ? (successfulExports / totalExports) * 100 : 0,
        totalDownloads,
        formatBreakdown,
        typeBreakdown,
        averageFileSize: exports.length > 0 
          ? exports.reduce((sum, e) => sum + (e.fileSize || 0), 0) / exports.length 
          : 0
      };

    } catch (error) {
      console.error('Get export analytics error:', error);
      return {
        totalExports: 0,
        successfulExports: 0,
        failedExports: 0,
        successRate: 0,
        totalDownloads: 0,
        formatBreakdown: {},
        typeBreakdown: {},
        averageFileSize: 0
      };
    }
  }
}

// Export singleton instance
export const exportService = new ExportService(); 