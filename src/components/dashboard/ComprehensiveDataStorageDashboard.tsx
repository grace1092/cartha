'use client';

import React, { useState, useEffect } from 'react';
import { 
  CloudArrowUpIcon, 
  CloudArrowDownIcon, 
  ArrowPathIcon, 
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

interface StorageMetrics {
  totalUsage: number;
  totalQuota: number;
  usagePercentage: number;
  tableStats: any[];
  quotas: any[];
}

interface PerformanceMetrics {
  averages: Record<string, number>;
  recentMetrics: any[];
  timeRange: string;
  totalMetrics: number;
}

interface SystemHealth {
  healthScore: number;
  healthStatus: 'healthy' | 'degraded' | 'critical';
  backup: {
    successRate: number;
    totalBackups: number;
    successfulBackups: number;
    failedBackups: number;
  };
  sync: {
    successRate: number;
    totalJobs: number;
    successfulJobs: number;
    failedJobs: number;
    unresolvedConflicts: number;
  };
  integrity: {
    totalChecks: number;
    failedChecks: number;
    totalIssues: number;
  };
  lastUpdated: string;
}

interface BackupJob {
  id: string;
  backup_name: string;
  backup_type: string;
  status: string;
  file_size: number;
  created_at: string;
  completed_at?: string;
}

interface ExportJob {
  id: string;
  export_name: string;
  export_type: string;
  format: string;
  status: string;
  file_size: number;
  created_at: string;
  completed_at?: string;
}

interface SyncJob {
  id: string;
  table_name: string;
  operation: string;
  sync_status: string;
  priority: number;
  created_at: string;
}

export default function ComprehensiveDataStorageDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<{
    storage: StorageMetrics;
    performance: PerformanceMetrics;
    health: SystemHealth;
  } | null>(null);
  const [backups, setBackups] = useState<BackupJob[]>([]);
  const [exports, setExports] = useState<ExportJob[]>([]);
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load metrics
      const metricsResponse = await fetch('/api/data-storage/metrics?type=all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
        }
      });

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      }

      // Load backups
      const backupsResponse = await fetch('/api/data-storage/backup?type=backups&limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
        }
      });

      if (backupsResponse.ok) {
        const backupsData = await backupsResponse.json();
        setBackups(backupsData.backups || []);
      }

      // Load exports
      const exportsResponse = await fetch('/api/data-storage/export?limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
        }
      });

      if (exportsResponse.ok) {
        const exportsData = await exportsResponse.json();
        setExports(exportsData.exports || []);
      }

      // Load sync jobs
      const syncResponse = await fetch('/api/data-storage/sync?type=jobs&limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
        }
      });

      if (syncResponse.ok) {
        const syncData = await syncResponse.json();
        setSyncJobs(syncData.jobs || []);
      }

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'synced':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Storage Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive data storage, backup, export, and synchronization system
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-green-600">HIPAA Compliant</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'backup', name: 'Backup', icon: CloudArrowUpIcon },
            { id: 'export', name: 'Export', icon: DocumentArrowDownIcon },
            { id: 'sync', name: 'Sync', icon: ArrowPathIcon },
            { id: 'metrics', name: 'Metrics', icon: ServerIcon },
            { id: 'settings', name: 'Settings', icon: CogIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <OverviewTab 
            metrics={metrics} 
            backups={backups} 
            exports={exports} 
            syncJobs={syncJobs}
            formatBytes={formatBytes}
            formatDate={formatDate}
            getStatusIcon={getStatusIcon}
            getHealthStatusColor={getHealthStatusColor}
          />
        )}
        {activeTab === 'backup' && (
          <BackupTab 
            backups={backups}
            formatBytes={formatBytes}
            formatDate={formatDate}
            getStatusIcon={getStatusIcon}
          />
        )}
        {activeTab === 'export' && (
          <ExportTab 
            exports={exports}
            formatBytes={formatBytes}
            formatDate={formatDate}
            getStatusIcon={getStatusIcon}
          />
        )}
        {activeTab === 'sync' && (
          <SyncTab 
            syncJobs={syncJobs}
            formatDate={formatDate}
            getStatusIcon={getStatusIcon}
          />
        )}
        {activeTab === 'metrics' && (
          <MetricsTab 
            metrics={metrics}
            formatBytes={formatBytes}
            getHealthStatusColor={getHealthStatusColor}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ 
  metrics, 
  backups, 
  exports, 
  syncJobs,
  formatBytes,
  formatDate,
  getStatusIcon,
  getHealthStatusColor
}: any) {
  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div className="space-y-6">
      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">System Health</p>
              <p className={`text-2xl font-bold ${getHealthStatusColor(metrics.health.healthStatus)}`}>
                {metrics.health.healthScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CloudArrowUpIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatBytes(metrics.storage.totalUsage)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowPathIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sync Success</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.health.sync.successRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentArrowDownIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {syncJobs.filter((job: any) => job.sync_status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Backups */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Backups</h3>
          <div className="space-y-3">
            {backups.slice(0, 5).map((backup: any) => (
              <div key={backup.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(backup.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{backup.backup_name}</p>
                    <p className="text-xs text-gray-500">{formatDate(backup.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{backup.backup_type}</p>
                  {backup.file_size && (
                    <p className="text-xs text-gray-500">{formatBytes(backup.file_size)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Exports */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Exports</h3>
          <div className="space-y-3">
            {exports.slice(0, 5).map((exportJob: any) => (
              <div key={exportJob.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(exportJob.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{exportJob.export_name}</p>
                    <p className="text-xs text-gray-500">{formatDate(exportJob.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{exportJob.format.toUpperCase()}</p>
                  {exportJob.file_size && (
                    <p className="text-xs text-gray-500">{formatBytes(exportJob.file_size)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Backup Tab Component
function BackupTab({ backups, formatBytes, formatDate, getStatusIcon }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Backup Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Backup
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Backup History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map((backup: any) => (
                <tr key={backup.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(backup.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{backup.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.backup_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {backup.backup_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {backup.file_size ? formatBytes(backup.file_size) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(backup.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Restore</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Export Tab Component
function ExportTab({ exports, formatBytes, formatDate, getStatusIcon }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Export Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          New Export
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Export History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exports.map((exportJob: any) => (
                <tr key={exportJob.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(exportJob.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{exportJob.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exportJob.export_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exportJob.export_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exportJob.format.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exportJob.file_size ? formatBytes(exportJob.file_size) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(exportJob.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {exportJob.status === 'completed' && (
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Download</button>
                    )}
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sync Tab Component
function SyncTab({ syncJobs, formatDate, getStatusIcon }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Sync Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Sync Now
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Sync Jobs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {syncJobs.map((job: any) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(job.sync_status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{job.sync_status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.table_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.operation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(job.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {job.sync_status === 'failed' && (
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Retry</button>
                    )}
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Metrics Tab Component
function MetricsTab({ metrics, formatBytes, getHealthStatusColor }: any) {
  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">System Metrics</h2>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Averages</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {Object.entries(metrics.performance.averages).map(([type, value]) => (
             <div key={type} className="text-center">
               <p className="text-sm text-gray-500 capitalize">{type.replace('_', ' ')}</p>
               <p className="text-2xl font-bold text-gray-900">{(value as number).toFixed(2)}ms</p>
             </div>
           ))}
        </div>
      </div>

      {/* Storage Metrics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Usage</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Used: {formatBytes(metrics.storage.totalUsage)}</span>
              <span>Total: {formatBytes(metrics.storage.totalQuota)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(metrics.storage.usagePercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {metrics.storage.usagePercentage.toFixed(1)}% used
            </p>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Backup Health</h4>
            <p className="text-2xl font-bold text-gray-900">{metrics.health.backup.successRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">
              {metrics.health.backup.successfulBackups} of {metrics.health.backup.totalBackups} successful
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sync Health</h4>
            <p className="text-2xl font-bold text-gray-900">{metrics.health.sync.successRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">
              {metrics.health.sync.successfulJobs} of {metrics.health.sync.totalJobs} successful
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Data Integrity</h4>
            <p className="text-2xl font-bold text-gray-900">{metrics.health.integrity.totalIssues}</p>
            <p className="text-sm text-gray-500">
              {metrics.health.integrity.failedChecks} of {metrics.health.integrity.totalChecks} failed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Auto Backup Frequency</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Retention Period</label>
            <input 
              type="number" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="30"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sync Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sync Interval</label>
            <input 
              type="number" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Conflict Resolution</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>Last Write Wins</option>
              <option>Manual Resolution</option>
              <option>Timestamp Based</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Enable Encryption</label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Enable Compression</label>
          </div>
        </div>
      </div>
    </div>
  );
} 