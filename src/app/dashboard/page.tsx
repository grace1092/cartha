'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import UserDashboard from '@/components/auth/UserDashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Remove loading state to show content immediately

  if (!user) {
    return null; // Will redirect to home page
  }

  return <UserDashboard />;
} 