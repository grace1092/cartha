'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientSupabaseClient();

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

  const handleDemoLogin = () => {
    // For demo purposes, simulate a login
    setLoading(true);
    setTimeout(() => {
      // Since we don't have real auth setup, just redirect to dashboard
      router.push('/dashboard');
    }, 1000);
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

          {/* Demo Login */}
          <div className="mb-6">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-black text-white rounded-xl px-4 py-3 font-medium hover:bg-neutral-900 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Try Demo Dashboard'}
            </button>
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
