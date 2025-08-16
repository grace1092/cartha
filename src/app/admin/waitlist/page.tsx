'use client';

import { WaitlistDashboard } from '@/components/admin/WaitlistDashboard';
import { AdminGuard } from '@/components/auth/AdminGuard';

export default function AdminWaitlistPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <WaitlistDashboard />
      </div>
    </AdminGuard>
  );
} 