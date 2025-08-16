import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';
import { comprehensiveAuth } from '@/lib/auth/comprehensiveAuth';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/data-storage/metrics - Get various metrics
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'data_performance_metrics', null, 'read');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'storage', 'performance', 'health', 'all'
    const timeRange = searchParams.get('timeRange') || '24h'; // 1h, 24h, 7d, 30d
    const tableName = searchParams.get('table') || undefined;

    if (type === 'storage') {
      const storage = await getStorageMetrics(user.id, tableName);
      return NextResponse.json(storage);
    } else if (type === 'performance') {
      const performance = await getPerformanceMetrics(timeRange, tableName);
      return NextResponse.json(performance);
    } else if (type === 'health') {
      const health = await getSystemHealth();
      return NextResponse.json(health);
    } else {
      // Return all metrics
      const [storageMetrics, performanceMetrics, systemHealth] = await Promise.all([
        getStorageMetrics(user.id, tableName),
        getPerformanceMetrics(timeRange, tableName),
        getSystemHealth()
      ]);

      return NextResponse.json({
        storage: storageMetrics,
        performance: performanceMetrics,
        health: systemHealth
      });
    }

  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get storage metrics
async function getStorageMetrics(userId: string, tableName?: string) {
  try {
    // Get storage usage statistics
    const { data: storageStats, error: statsError } = await supabase.rpc(
      'get_storage_usage_stats',
      { p_user_id: userId }
    );

    if (statsError) {
      throw statsError;
    }

    // Get user quotas
    const { data: quotas, error: quotaError } = await supabase
      .from('data_storage_quotas')
      .select('*')
      .eq('user_id', userId);

    if (quotaError) {
      throw quotaError;
    }

    // Calculate total usage
    const totalUsage = storageStats?.reduce((sum: number, stat: any) => sum + (stat.estimated_size_bytes || 0), 0) || 0;
    const totalQuota = quotas?.reduce((sum: number, quota: any) => sum + quota.limit_bytes, 0) || 0;
    const usagePercentage = totalQuota > 0 ? (totalUsage / totalQuota) * 100 : 0;

    // Filter by table if specified
    const filteredStats = tableName 
      ? storageStats?.filter((stat: any) => stat.table_name.includes(tableName))
      : storageStats;

    return {
      totalUsage,
      totalQuota,
      usagePercentage,
      tableStats: filteredStats || [],
      quotas: quotas || []
    };

  } catch (error) {
    console.error('Get storage metrics error:', error);
    return {
      totalUsage: 0,
      totalQuota: 0,
      usagePercentage: 0,
      tableStats: [],
      quotas: []
    };
  }
}

// Helper function to get performance metrics
async function getPerformanceMetrics(timeRange: string, tableName?: string) {
  try {
    // Calculate time range
    const now = new Date();
    let startTime: Date;
    
    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get performance metrics
    let query = supabase
      .from('data_performance_metrics')
      .select('*')
      .gte('timestamp', startTime.toISOString())
      .order('timestamp', { ascending: false });

    if (tableName) {
      query = query.eq('table_name', tableName);
    }

    const { data: metrics, error } = await query;

    if (error) {
      throw error;
    }

    // Calculate averages by metric type
    const averages: Record<string, number> = {};
    const metricTypes = ['query_time', 'sync_time', 'backup_time', 'export_time'];

    metricTypes.forEach(type => {
      const typeMetrics = metrics?.filter(m => m.metric_type === type) || [];
      if (typeMetrics.length > 0) {
        const sum = typeMetrics.reduce((acc, m) => acc + parseFloat(m.value.toString()), 0);
        averages[type] = sum / typeMetrics.length;
      } else {
        averages[type] = 0;
      }
    });

    // Get recent metrics for trending
    const recentMetrics = metrics?.slice(0, 50) || [];

    return {
      averages,
      recentMetrics,
      timeRange,
      totalMetrics: metrics?.length || 0
    };

  } catch (error) {
    console.error('Get performance metrics error:', error);
    return {
      averages: {},
      recentMetrics: [],
      timeRange,
      totalMetrics: 0
    };
  }
}

// Helper function to get system health
async function getSystemHealth() {
  try {
    // Check backup health
    const { data: backupHealth, error: backupError } = await supabase
      .from('enhanced_backups')
      .select('status, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (backupError) {
      throw backupError;
    }

    const recentBackups = backupHealth || [];
    const successfulBackups = recentBackups.filter(b => b.status === 'completed').length;
    const failedBackups = recentBackups.filter(b => b.status === 'failed').length;
    const backupSuccessRate = recentBackups.length > 0 ? (successfulBackups / recentBackups.length) * 100 : 100;

    // Check sync health
    const { data: syncHealth, error: syncError } = await supabase
      .from('enhanced_sync_jobs')
      .select('sync_status, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (syncError) {
      throw syncError;
    }

    const recentSyncJobs = syncHealth || [];
    const successfulSyncs = recentSyncJobs.filter(s => s.sync_status === 'synced').length;
    const failedSyncs = recentSyncJobs.filter(s => s.sync_status === 'failed').length;
    const syncSuccessRate = recentSyncJobs.length > 0 ? (successfulSyncs / recentSyncJobs.length) * 100 : 100;

    // Check for unresolved conflicts
    const { data: conflicts, error: conflictError } = await supabase
      .from('sync_conflicts')
      .select('id')
      .is('resolved_at', null);

    if (conflictError) {
      throw conflictError;
    }

    const unresolvedConflicts = conflicts?.length || 0;

    // Check data integrity
    const { data: integrityChecks, error: integrityError } = await supabase
      .from('data_integrity_checks')
      .select('status, issues_found')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (integrityError) {
      throw integrityError;
    }

    const recentChecks = integrityChecks || [];
    const failedChecks = recentChecks.filter(c => c.status === 'failed').length;
    const totalIssues = recentChecks.reduce((sum, c) => sum + (c.issues_found || 0), 0);

    // Calculate overall health score
    const healthScore = Math.max(0, Math.min(100, 
      (backupSuccessRate * 0.3) + 
      (syncSuccessRate * 0.3) + 
      (unresolvedConflicts === 0 ? 100 : Math.max(0, 100 - unresolvedConflicts * 10)) * 0.2 +
      (failedChecks === 0 ? 100 : Math.max(0, 100 - failedChecks * 20)) * 0.2
    ));

    // Determine health status
    let healthStatus: 'healthy' | 'degraded' | 'critical';
    if (healthScore >= 90) {
      healthStatus = 'healthy';
    } else if (healthScore >= 70) {
      healthStatus = 'degraded';
    } else {
      healthStatus = 'critical';
    }

    return {
      healthScore,
      healthStatus,
      backup: {
        successRate: backupSuccessRate,
        totalBackups: recentBackups.length,
        successfulBackups,
        failedBackups
      },
      sync: {
        successRate: syncSuccessRate,
        totalJobs: recentSyncJobs.length,
        successfulJobs: successfulSyncs,
        failedJobs: failedSyncs,
        unresolvedConflicts
      },
      integrity: {
        totalChecks: recentChecks.length,
        failedChecks,
        totalIssues
      },
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Get system health error:', error);
    return {
      healthScore: 0,
      healthStatus: 'critical' as const,
      backup: { successRate: 0, totalBackups: 0, successfulBackups: 0, failedBackups: 0 },
      sync: { successRate: 0, totalJobs: 0, successfulJobs: 0, failedJobs: 0, unresolvedConflicts: 0 },
      integrity: { totalChecks: 0, failedChecks: 0, totalIssues: 0 },
      lastUpdated: new Date().toISOString()
    };
  }
}

// POST /api/data-storage/metrics - Record performance metric
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'data_performance_metrics', null, 'write');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      metricName, 
      metricType, 
      tableName, 
      operation, 
      value, 
      unit = 'ms',
      metadata = {} 
    } = body;

    if (!metricName || !metricType || value === undefined) {
      return NextResponse.json({ 
        error: 'Metric name, type, and value are required' 
      }, { status: 400 });
    }

    // Validate metric type
    const validTypes = ['query_time', 'sync_time', 'backup_time', 'export_time'];
    if (!validTypes.includes(metricType)) {
      return NextResponse.json({ error: 'Invalid metric type' }, { status: 400 });
    }

    // Record the metric
    const { data: metric, error } = await supabase
      .from('data_performance_metrics')
      .insert({
        metric_name: metricName,
        metric_type: metricType,
        table_name: tableName,
        operation: operation,
        value: value,
        unit: unit,
        metadata: {
          ...metadata,
          recorded_by: user.id,
          recorded_at: new Date().toISOString()
        }
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ metric });

  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 