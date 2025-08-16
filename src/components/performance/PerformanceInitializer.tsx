'use client';

import { useEffect } from 'react';
import { performanceMonitor } from '@/lib/performance/monitor';

export default function PerformanceInitializer() {
  useEffect(() => {
    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === 'true') {
      // Start monitoring user interactions
      const handleUserInteraction = () => {
        performanceMonitor.measureUserInteraction('page_interaction', 0);
      };

      // Monitor page visibility changes
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          performanceMonitor.measureCustomMetric('page_visible', Date.now(), 'user');
        }
      };

      // Monitor network status
      const handleOnline = () => {
        performanceMonitor.measureCustomMetric('network_online', 1, 'user');
      };

      const handleOffline = () => {
        performanceMonitor.measureCustomMetric('network_offline', 1, 'user');
      };

      // Monitor errors
      const handleError = (event: ErrorEvent) => {
        performanceMonitor.measureError(event.error?.name || 'unknown_error');
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        performanceMonitor.measureError('unhandled_promise_rejection');
      };

      // Add event listeners
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      // Monitor initial page load performance
      if (document.readyState === 'complete') {
        performanceMonitor.measureCustomMetric('page_fully_loaded', Date.now(), 'navigation');
      } else {
        window.addEventListener('load', () => {
          performanceMonitor.measureCustomMetric('page_fully_loaded', Date.now(), 'navigation');
        });
      }

      // Cleanup function
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        performanceMonitor.destroy();
      };
    }
  }, []);

  // This component doesn't render anything
  return null;
} 