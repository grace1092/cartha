import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';
import { comprehensiveAuth } from '@/lib/auth/comprehensiveAuth';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/data-storage/export - List exports
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_exports', null, 'read');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const exportType = searchParams.get('type');

    let query = supabase
      .from('enhanced_exports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (exportType) {
      query = query.eq('export_type', exportType);
    }

    const { data: exports, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ exports: exports || [] });

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/data-storage/export - Create export request
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_exports', null, 'write');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      exportName, 
      exportType, 
      format, 
      filters = {}, 
      customFields = [],
      expiresInDays = 7 
    } = body;

    if (!exportName || !exportType || !format) {
      return NextResponse.json({ 
        error: 'Export name, type, and format are required' 
      }, { status: 400 });
    }

    // Validate export type
    const validTypes = ['client_data', 'session_data', 'billing_data', 'full_export', 'audit_logs', 'custom'];
    if (!validTypes.includes(exportType)) {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    // Validate format
    const validFormats = ['json', 'csv', 'xml', 'pdf', 'encrypted_zip'];
    if (!validFormats.includes(format)) {
      return NextResponse.json({ error: 'Invalid export format' }, { status: 400 });
    }

    // Check export limits
    const today = new Date().toISOString().split('T')[0];
    const { data: todayExports } = await supabase
      .from('enhanced_exports')
      .select('*')
      .eq('user_id', user.id)
      .gte('requested_at', today);

    const dailyLimit = 10;
    if (todayExports && todayExports.length >= dailyLimit) {
      return NextResponse.json({ 
        error: 'Daily export limit exceeded' 
      }, { status: 429 });
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create export record
    const { data: exportRecord, error } = await supabase
      .from('enhanced_exports')
      .insert({
        user_id: user.id,
        export_name: exportName,
        export_type: exportType,
        format: format,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        filters: filters,
        custom_fields: customFields,
        metadata: {
          requested_by: user.id,
          request_timestamp: new Date().toISOString()
        }
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the export request
    await comprehensiveAuth.logSecurityEvent(user.id, 'export_request', 'medium', {
      export_id: exportRecord.id,
      export_name: exportName,
      export_type: exportType,
      format: format
    });

    // Start export processing (this would be handled by a background job)
    // For now, we'll simulate the process
    setTimeout(async () => {
      await processExport(exportRecord.id, user.id, exportType, format, filters, customFields);
    }, 1000);

    return NextResponse.json({ 
      export: exportRecord,
      message: 'Export request created successfully' 
    });

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/data-storage/export - Update export (e.g., mark as downloaded)
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_exports', null, 'write');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { exportId, action } = body;

    if (action === 'mark_downloaded') {
      // Get current download count and increment
      const { data: currentExport } = await supabase
        .from('enhanced_exports')
        .select('download_count')
        .eq('id', exportId)
        .eq('user_id', user.id)
        .single();

      const { data: exportRecord, error } = await supabase
        .from('enhanced_exports')
        .update({
          download_count: (currentExport?.download_count || 0) + 1
        })
        .eq('id', exportId)
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ export: exportRecord });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/data-storage/export - Delete export
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
    const hasPermission = await comprehensiveAuth.checkDataAccess(user.id, 'enhanced_exports', null, 'delete');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const exportId = searchParams.get('id');

    if (!exportId) {
      return NextResponse.json({ error: 'Export ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('enhanced_exports')
      .delete()
      .eq('id', exportId)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the deletion
    await comprehensiveAuth.logSecurityEvent(user.id, 'export_request', 'medium', {
      deleted_export_id: exportId
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to process export (simplified)
async function processExport(
  exportId: string,
  userId: string,
  exportType: string,
  format: string,
  filters: any,
  customFields: string[]
): Promise<void> {
  try {
    // Update status to processing
    await supabase
      .from('enhanced_exports')
      .update({ status: 'processing' })
      .eq('id', exportId);

    // Simulate export processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock export data based on type
    let exportData: any = {};
    
    switch (exportType) {
      case 'client_data':
        exportData = {
          clients: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
          ]
        };
        break;
      case 'session_data':
        exportData = {
          sessions: [
            { id: 1, client_id: 1, date: '2024-01-15', duration: 60 },
            { id: 2, client_id: 2, date: '2024-01-16', duration: 45 }
          ]
        };
        break;
      case 'billing_data':
        exportData = {
          invoices: [
            { id: 1, client_id: 1, amount: 150.00, status: 'paid' },
            { id: 2, client_id: 2, amount: 200.00, status: 'pending' }
          ]
        };
        break;
      case 'full_export':
        exportData = {
          clients: [],
          sessions: [],
          invoices: [],
          notes: []
        };
        break;
      case 'audit_logs':
        exportData = {
          logs: [
            { id: 1, action: 'login', user_id: userId, timestamp: new Date().toISOString() },
            { id: 2, action: 'data_access', user_id: userId, timestamp: new Date().toISOString() }
          ]
        };
        break;
      default:
        exportData = { custom_data: 'Custom export content' };
    }

    // Format data based on requested format
    let formattedData = '';
    let fileExtension = '';

    switch (format) {
      case 'json':
        formattedData = JSON.stringify(exportData, null, 2);
        fileExtension = 'json';
        break;
      case 'csv':
        formattedData = convertToCSV(exportData);
        fileExtension = 'csv';
        break;
      case 'xml':
        formattedData = convertToXML(exportData);
        fileExtension = 'xml';
        break;
      case 'pdf':
        formattedData = 'PDF content would be generated here';
        fileExtension = 'pdf';
        break;
      case 'encrypted_zip':
        formattedData = 'Encrypted ZIP content would be generated here';
        fileExtension = 'zip';
        break;
    }

    // Calculate file size
    const fileSize = new Blob([formattedData]).size;

    // Update export record with completed status
    await supabase
      .from('enhanced_exports')
      .update({
        status: 'completed',
        file_path: `/exports/${exportId}.${fileExtension}`,
        file_size: fileSize,
        completed_at: new Date().toISOString()
      })
      .eq('id', exportId);

  } catch (error) {
    console.error('Process export error:', error);
    
    // Mark as failed
    await supabase
      .from('enhanced_exports')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Export failed'
      })
      .eq('id', exportId);
  }
}

// Helper functions for data formatting
function convertToCSV(data: any): string {
  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  }
  
  return JSON.stringify(data);
}

function convertToXML(data: any): string {
  const convertObject = (obj: any, rootName: string = 'root'): string => {
    let xml = `<${rootName}>`;
    
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        xml += `<${key}>`;
        for (const item of value) {
          xml += convertObject(item, 'item');
        }
        xml += `</${key}>`;
      } else if (typeof value === 'object' && value !== null) {
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