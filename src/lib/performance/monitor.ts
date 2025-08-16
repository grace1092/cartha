'use client';

interface PerformanceMetrics {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
  TTI: number; // Time to Interactive
}

interface CustomMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'navigation' | 'resource' | 'user' | 'error';
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    FCP: 0,
    LCP: 0,
    FID: 0,
    CLS: 0,
    TTFB: 0,
    TTI: 0,
  };

  private customMetrics: CustomMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.initObservers();
      this.measureCoreWebVitals();
      this.isInitialized = true;
    }
  }

  private initObservers(): void {
    // Observe navigation timing
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.metrics.FCP = fcpEntry.startTime;
            this.logMetric('FCP', fcpEntry.startTime);
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (e) {
        console.warn('FCP observer not supported');
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.metrics.LCP = lastEntry.startTime;
            this.logMetric('LCP', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.FID = entry.processingStart - entry.startTime;
            this.logMetric('FID', this.metrics.FID);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.CLS = clsValue;
          this.logMetric('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  private measureCoreWebVitals(): void {
    // Measure Time to First Byte
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
        this.logMetric('TTFB', this.metrics.TTFB);
      }
    }

    // Measure Time to Interactive (approximation)
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        this.measureTTI();
      } else {
        window.addEventListener('load', () => {
          setTimeout(() => this.measureTTI(), 0);
        });
      }
    }
  }

  private measureTTI(): void {
    // Simple TTI measurement based on DOM content loaded
    if (typeof window !== 'undefined' && 'performance' in window) {
      const domContentLoaded = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (domContentLoaded) {
        this.metrics.TTI = domContentLoaded.domContentLoadedEventEnd - domContentLoaded.fetchStart;
        this.logMetric('TTI', this.metrics.TTI);
      }
    }
  }

  // Measure custom metrics
  measureCustomMetric(name: string, value: number, category: CustomMetric['category'] = 'user'): void {
    if (!this.isInitialized) return;
    
    const metric: CustomMetric = {
      name,
      value,
      timestamp: Date.now(),
      category,
    };
    this.customMetrics.push(metric);
    this.logMetric(name, value, category);
  }

  // Measure resource loading time
  measureResourceLoad(url: string): void {
    if (!this.isInitialized || typeof window === 'undefined') return;
    
    const resources = performance.getEntriesByType('resource');
    const resource = resources.find(r => r.name.includes(url));
    if (resource) {
      this.measureCustomMetric(`resource_${url}`, resource.duration, 'resource');
    }
  }

  // Measure API response time
  measureAPIResponse(endpoint: string, duration: number): void {
    this.measureCustomMetric(`api_${endpoint}`, duration, 'navigation');
  }

  // Measure user interaction time
  measureUserInteraction(action: string, duration: number): void {
    this.measureCustomMetric(`interaction_${action}`, duration, 'user');
  }

  // Measure error frequency
  measureError(errorType: string): void {
    this.measureCustomMetric(`error_${errorType}`, 1, 'error');
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get custom metrics
  getCustomMetrics(): CustomMetric[] {
    return [...this.customMetrics];
  }

  // Get performance score (0-100)
  getPerformanceScore(): number {
    let score = 100;

    // FCP scoring (0-25 points)
    if (this.metrics.FCP > 2500) score -= 25;
    else if (this.metrics.FCP > 1800) score -= 15;
    else if (this.metrics.FCP > 1000) score -= 5;

    // LCP scoring (0-25 points)
    if (this.metrics.LCP > 4000) score -= 25;
    else if (this.metrics.LCP > 2500) score -= 15;
    else if (this.metrics.LCP > 1700) score -= 5;

    // FID scoring (0-25 points)
    if (this.metrics.FID > 300) score -= 25;
    else if (this.metrics.FID > 100) score -= 15;
    else if (this.metrics.FID > 50) score -= 5;

    // CLS scoring (0-25 points)
    if (this.metrics.CLS > 0.25) score -= 25;
    else if (this.metrics.CLS > 0.1) score -= 15;
    else if (this.metrics.CLS > 0.05) score -= 5;

    return Math.max(0, score);
  }

  // Log metrics to console or analytics
  private logMetric(name: string, value: number, category?: string): void {
    if (typeof window === 'undefined') return;
    
    const logData = {
      name,
      value: Math.round(value * 100) / 100,
      category,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric:`, logData);
    }

    // Send to analytics (you can integrate with your analytics service)
    this.sendToAnalytics(logData);
  }

  // Send metrics to analytics service
  private sendToAnalytics(data: any): void {
    if (typeof window === 'undefined') return;
    
    // Example: Send to Google Analytics
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: data.name,
        metric_value: data.value,
        metric_category: data.category,
      });
    }

    // Example: Send to custom endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {
      // Silently fail if analytics endpoint is not available
    });
  }

  // Generate performance report
  generateReport(): any {
    if (typeof window === 'undefined') {
      return {
        coreWebVitals: this.metrics,
        customMetrics: [],
        performanceScore: 0,
        timestamp: new Date().toISOString(),
        url: '',
      };
    }

    return {
      coreWebVitals: this.getMetrics(),
      customMetrics: this.getCustomMetrics(),
      performanceScore: this.getPerformanceScore(),
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
  }

  // Clean up observers
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const performanceUtils = {
  // Measure function execution time
  measureExecutionTime<T>(fn: () => T, name: string): T {
    if (typeof window === 'undefined') return fn();
    
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    performanceMonitor.measureCustomMetric(`execution_${name}`, duration, 'user');
    return result;
  },

  // Measure async function execution time
  async measureAsyncExecutionTime<T>(fn: () => Promise<T>, name: string): Promise<T> {
    if (typeof window === 'undefined') return fn();
    
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    performanceMonitor.measureCustomMetric(`execution_${name}`, duration, 'user');
    return result;
  },

  // Measure DOM query performance
  measureDOMQuery(selector: string): Element | null {
    if (typeof window === 'undefined') return null;
    
    const start = performance.now();
    const element = document.querySelector(selector);
    const duration = performance.now() - start;
    performanceMonitor.measureCustomMetric(`dom_query_${selector}`, duration, 'user');
    return element;
  },

  // Measure image loading
  measureImageLoad(src: string): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const start = performance.now();
      const img = new Image();
      img.onload = () => {
        const duration = performance.now() - start;
        performanceMonitor.measureCustomMetric(`image_load_${src}`, duration, 'resource');
        resolve();
      };
      img.onerror = () => {
        const duration = performance.now() - start;
        performanceMonitor.measureCustomMetric(`image_error_${src}`, duration, 'error');
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  },
}; 