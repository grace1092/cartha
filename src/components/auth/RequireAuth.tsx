'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import { User } from '@supabase/supabase-js';

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RequireAuth({ children, fallback }: RequireAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        // For demo purposes, if no session but we're on dashboard, create a demo user
        if (!session && typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
          const demoUser: User = {
            id: 'demo-user',
            email: 'demo@cartha.com',
            aud: 'authenticated',
            app_metadata: {},
            user_metadata: { name: 'Dr. Demo' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            role: 'authenticated',
            confirmation_sent_at: new Date().toISOString()
          };
          setUser(demoUser);
        } else {
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        router.replace('/auth/signin?error=session_error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user || null);
          router.replace('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.replace('/auth/signin');
        } else if (event === 'TOKEN_REFRESHED') {
          setUser(session?.user || null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Create demo user if we're on dashboard
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@cartha.com',
        aud: 'authenticated',
        app_metadata: {},
        user_metadata: { name: 'Dr. Demo' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated',
        confirmation_sent_at: new Date().toISOString()
      };
      setUser(demoUser);
      return (
        <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading demo dashboard...</p>
          </div>
        </div>
      );
    }
    
    // Redirect to login if not on dashboard
    router.push('/auth/signin');
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
