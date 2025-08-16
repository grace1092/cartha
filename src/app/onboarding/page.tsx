'use client';

import { useRouter } from 'next/navigation';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function OnboardingPage() {
  const router = useRouter();

  const handleOnboardingComplete = () => {
    // Redirect to dashboard after onboarding
    router.push('/dashboard');
  };

  return (
    <OnboardingFlow onComplete={handleOnboardingComplete} />
  );
} 