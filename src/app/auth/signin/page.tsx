'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import { ArrowRight } from 'lucide-react';

function SignInContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    // Check for OAuth errors
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('description');
    if (error) {
      setError(errorDescription || 'Authentication failed');
    }

    // Check if already authenticated
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/dashboard');
      }
    };
    checkSession();
  }, [router, searchParams, supabase.auth]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google sign in error:', err);
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    // For demo purposes, simulate a login
    setLoading(true);
    // Use absolute URL to ensure correct routing
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#222] mb-2">
              Welcome to Cartha
            </h1>
            <p className="text-neutral-600">
              Sign in to access your practice dashboard
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-neutral-200 text-[#222] rounded-xl px-4 py-3 font-medium hover:bg-neutral-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  className="text-[#4285F4]"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  className="text-[#34A853]"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  className="text-[#FBBC05]"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  className="text-[#EA4335]"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </div>

          {/* Demo Login */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="block w-full bg-black text-white rounded-xl px-4 py-3 font-medium hover:bg-neutral-900 disabled:opacity-50 transition-colors text-center"
            >
              Try Demo Dashboard
            </Link>
            <p className="text-xs text-neutral-500 text-center mt-2">
              No account needed • Demo data only
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-neutral-500">Or sign in with email</span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#222] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-100 text-neutral-700 rounded-xl px-4 py-3 font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{' '}
              <a href="/auth/signup" className="text-black hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-neutral-500 hover:text-neutral-700">
              ← Back to homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );

  useEffect(() => {
    // Check for OAuth errors
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('description');
    if (error) {
      setError(errorDescription || 'Authentication failed');
    }

    // Check if already authenticated
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/dashboard');
      }
    };
    checkSession();
  }, [router, searchParams, supabase.auth]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google sign in error:', err);
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    // For demo purposes, simulate a login
    setLoading(true);
    // Use absolute URL to ensure correct routing
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#222] mb-2">
              Welcome to Cartha
            </h1>
            <p className="text-neutral-600">
              Sign in to access your practice dashboard
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-neutral-200 text-[#222] rounded-xl px-4 py-3 font-medium hover:bg-neutral-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  className="text-[#4285F4]"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  className="text-[#34A853]"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  className="text-[#FBBC05]"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  className="text-[#EA4335]"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </div>

          {/* Demo Login */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="block w-full bg-black text-white rounded-xl px-4 py-3 font-medium hover:bg-neutral-900 disabled:opacity-50 transition-colors text-center"
            >
              Try Demo Dashboard
            </Link>
            <p className="text-xs text-neutral-500 text-center mt-2">
              No account needed • Demo data only
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-neutral-500">Or sign in with email</span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#222] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-100 text-neutral-700 rounded-xl px-4 py-3 font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{' '}
              <a href="/auth/signup" className="text-black hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-neutral-500 hover:text-neutral-700">
              ← Back to homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
