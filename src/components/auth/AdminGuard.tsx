'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Shield, AlertCircle, LogIn } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminGuard = ({ children, fallback }: AdminGuardProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', session.user.id)
        .single();

      // For now, allow access to specific admin emails
      // In production, you might want a dedicated admin table or role-based system
      const adminEmails = [
        'admin@cartha.com',
        'gracetan@cartha.com',
        'grace@cartha.com'
      ];

      if (profile?.email && adminEmails.includes(profile.email)) {
        setIsAdmin(true);
      } else {
        setError('Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setError('Failed to verify admin access');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/waitlist`
        }
      });
      
      if (error) {
        setError('Failed to sign in');
      }
    } catch (error) {
      setError('Failed to sign in');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h1>
            <p className="text-gray-600 mb-4">
              {error || 'This page is restricted to administrators only.'}
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
              <button
                onClick={handleSignIn}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 