'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import type { AuthError } from '@supabase/supabase-js';

export default function SignIn() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-[600px] max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MoneyTalks</h2>
        <p className="text-gray-600">
          Start your journey to financial compatibility with your partner
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <Auth
        supabaseClient={supabase}
        view="sign_in"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#667eea',
                brandAccent: '#764ba2',
                brandButtonText: 'white',
                defaultButtonBackground: '#f7fafc',
                defaultButtonBackgroundHover: '#edf2f7',
                defaultButtonBorder: '#e2e8f0',
                defaultButtonText: '#4a5568',
              },
              space: {
                buttonPadding: '12px 16px',
                inputPadding: '12px 16px',
              },
              borderWidths: {
                buttonBorderWidth: '1px',
                inputBorderWidth: '1px',
              },
              radii: {
                borderRadiusButton: '8px',
                buttonBorderRadius: '8px',
                inputBorderRadius: '8px',
              },
              fontSizes: {
                baseButtonSize: '16px',
                baseInputSize: '16px',
              },
            },
          },
          style: {
            button: {
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              margin: '8px 0',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            },
            container: {
              gap: '16px',
            },
            input: {
              borderRadius: '8px',
              padding: '12px 16px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
            },
            label: {
              fontSize: '14px',
              color: '#4a5568',
              marginBottom: '4px',
            },
            message: {
              fontSize: '14px',
              margin: '4px 0',
            },
            anchor: {
              color: '#667eea',
              fontSize: '14px',
              textDecoration: 'none',
            },
          },
        }}
        providers={['google', 'apple']}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email address',
              password_label: 'Password',
              email_input_placeholder: 'you@example.com',
              password_input_placeholder: 'Your secure password',
              button_label: 'Sign in to your account',
              loading_button_label: 'Signing in...',
              social_provider_text: 'Continue with {{provider}}',
              link_text: 'Already have an account? Sign in',
            },
            sign_up: {
              email_label: 'Email address',
              password_label: 'Create a password',
              email_input_placeholder: 'you@example.com',
              password_input_placeholder: 'Create a secure password',
              button_label: 'Create your account',
              loading_button_label: 'Creating your account...',
              social_provider_text: 'Sign up with {{provider}}',
              link_text: "Don't have an account? Sign up",
            },
            magic_link: {
              email_input_label: 'Email address',
              email_input_placeholder: 'you@example.com',
              button_label: 'Send magic link',
              loading_button_label: 'Sending magic link...',
              link_text: 'Send a magic link email',
            },
          },
        }}
      />

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          By signing in or creating an account, you agree to our{' '}
          <a href="/terms" className="text-primary-from hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary-from hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
} 