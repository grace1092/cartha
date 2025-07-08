import { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Onboarding from '@/components/auth/Onboarding';

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading onboarding...</p>
            </div>
          </div>
        }>
          <Onboarding />
        </Suspense>
      </div>
    </AuthGuard>
  );
} 