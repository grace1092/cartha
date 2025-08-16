"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import Button from '../ui/Button';

interface AuthGuardProps {
  children: React.ReactNode;
  requirePartner?: boolean;
  requireSubscription?: boolean;
}

export const AuthGuard = ({
  children,
  requirePartner = false,
  requireSubscription = false,
}: AuthGuardProps) => {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPartner, setHasPartner] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN') {
          checkAuth();
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setHasPartner(false);
          setHasSubscription(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      // Check partner status if required
      if (requirePartner) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('partner_status, partner_id')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setHasPartner(profile.partner_status === 'connected' && profile.partner_id !== null);
      }

      // Check subscription status if required
      if (requireSubscription) {
        // TODO: Implement subscription check with your payment provider
        // For now, we'll assume no subscription
        setHasSubscription(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication check failed');
      setIsAuthenticated(false);
      setHasPartner(false);
      setHasSubscription(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove loading state to show content immediately

  if (!isAuthenticated) {
    return (
      <div className="text-center p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Sign In Required</h3>
        <p className="text-gray-600 mb-6">
          Please sign in to access this feature.
        </p>
        <Button
          onClick={() => router.push('/auth/signin')}
          className="w-full md:w-auto"
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (requirePartner && !hasPartner) {
    return (
      <div className="text-center p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Partner Connection Required</h3>
        <p className="text-gray-600 mb-6">
          This feature requires both partners to be connected. Invite your partner to join you on MoneyTalks.
        </p>
        <Button
          onClick={() => router.push('/invite')}
          className="w-full md:w-auto"
        >
          Invite Partner
        </Button>
      </div>
    );
  }

  if (requireSubscription && !hasSubscription) {
    return (
      <div className="text-center p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Premium Feature</h3>
        <p className="text-gray-600 mb-6">
          This feature is available with our premium subscription. Upgrade now to unlock all features.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>✓ Unlimited money talks</span>
            <span>✓ Advanced analytics</span>
            <span>✓ Priority support</span>
          </div>
          <Button
            onClick={() => router.push('/pricing')}
            className="w-full md:w-auto"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p className="text-sm">{error}</p>
        <Button
          onClick={checkAuth}
          variant="outline"
          className="mt-4"
          size="sm"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}; 