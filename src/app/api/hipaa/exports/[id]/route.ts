import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { exportService } from '@/lib/services/exportService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exportId = params.id;

    // Get export details
    const exportConfig = await exportService.getExport(exportId);
    if (!exportConfig) {
      return NextResponse.json({ error: 'Export not found' }, { status: 404 });
    }

    // Check if user owns this export
    if (exportConfig.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Download export
    const { data, error } = await exportService.downloadExport(exportId);
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Determine content type based on format
    let contentType = 'application/json';
    switch (exportConfig.format) {
      case 'csv':
        contentType = 'text/csv';
        break;
      case 'xml':
        contentType = 'application/xml';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'encrypted_zip':
        contentType = 'application/zip';
        break;
    }

    // Return file with appropriate headers
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="export-${exportId}.${exportConfig.format}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Download export error:', error);
    return NextResponse.json(
      { error: 'Failed to download export' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exportId = params.id;

    // Get export details
    const exportConfig = await exportService.getExport(exportId);
    if (!exportConfig) {
      return NextResponse.json({ error: 'Export not found' }, { status: 404 });
    }

    // Check if user owns this export
    if (exportConfig.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete export
    const { error } = await exportService.deleteExport(exportId);
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete export error:', error);
    return NextResponse.json(
      { error: 'Failed to delete export' },
      { status: 500 }
    );
  }
} 