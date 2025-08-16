'use client';

import { Suspense, lazy, ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
}

export default function LazyComponent({ 
  component, 
  fallback = <LoadingSpinner />, 
  props = {} 
}: LazyComponentProps) {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Pre-defined lazy components for common use cases
export const LazyDashboard = lazy(() => import('@/components/dashboard/PremiumDashboard'));
export const LazyOnboarding = lazy(() => import('@/components/onboarding/OnboardingFlow'));
export const LazyAuthModal = lazy(() => import('@/components/auth/AuthModal'));

// Lazy loading wrapper for heavy components
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function LazyWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Lazy loading for route-based components
export function createLazyRoute(importFn: () => Promise<{ default: ComponentType<any> }>) {
  return function LazyRoute(props: any) {
    return (
      <Suspense fallback={<LoadingSpinner size="lg" text="Loading page..." />}>
        <LazyComponent component={importFn} props={props} />
      </Suspense>
    );
  };
} 