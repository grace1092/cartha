'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import CardContent from '@/components/ui/Card';
import CardHeader from '@/components/ui/Card';
import CardTitle from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { performanceMonitor } from '@/lib/performance/monitor';
import { TrendingUp, TrendingDown, Activity, Zap, Clock, Target } from 'lucide-react';

interface PerformanceData {
  coreWebVitals: {
    FCP: number;
    LCP: number;
    FID: number;
    CLS: number;
    TTFB: number;
    TTI: number;
  };
  customMetrics: Array<{
    name: string;
    value: number;
    category: string;
  }>;
  performanceScore: number;
}

export default function PerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updatePerformanceData = () => {
      const data = performanceMonitor.generateReport();
      setPerformanceData(data);
      setIsLoading(false);
    };

    // Update immediately
    updatePerformanceData();

    // Update every 5 seconds
    const interval = setInterval(updatePerformanceData, 5000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const formatMetric = (value: number, unit: string = 'ms') => {
    if (value < 1000) return `${Math.round(value)}${unit}`;
    return `${(value / 1000).toFixed(1)}s`;
  };

  const getMetricStatus = (metric: string, value: number) => {
    const thresholds = {
      FCP: { good: 1000, poor: 2500 },
      LCP: { good: 1700, poor: 4000 },
      FID: { good: 50, poor: 300 },
      CLS: { good: 0.05, poor: 0.25 },
      TTFB: { good: 600, poor: 1800 },
      TTI: { good: 2000, poor: 5000 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'neutral';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="text-center py-8">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No performance data available</h3>
        <p className="mt-1 text-sm text-gray-500">Performance metrics will appear here once collected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time Core Web Vitals and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span className={`text-lg font-semibold ${getScoreColor(performanceData.performanceScore)}`}>
            {performanceData.performanceScore}/100
          </span>
          {getScoreBadge(performanceData.performanceScore)}
        </div>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Overall Performance Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Performance Score</span>
              <span className="text-sm text-gray-500">
                {performanceData.performanceScore}/100
              </span>
            </div>
            <Progress value={performanceData.performanceScore} className="h-2" />
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>0-69</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>70-89</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>90-100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(performanceData.coreWebVitals).map(([metric, value]) => {
          const status = getMetricStatus(metric, value);
          const isGood = status === 'good';
          const isPoor = status === 'poor';

          return (
            <Card key={metric}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>{metric}</span>
                  {isGood ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : isPoor ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <Activity className="h-4 w-4 text-yellow-600" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatMetric(value, metric === 'CLS' ? '' : 'ms')}
                  </div>
                  <div className="flex items-center space-x-2">
                    {status === 'good' && (
                      <Badge className="bg-green-100 text-green-800 text-xs">Good</Badge>
                    )}
                    {status === 'needs-improvement' && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Needs Improvement</Badge>
                    )}
                    {status === 'poor' && (
                      <Badge className="bg-red-100 text-red-800 text-xs">Poor</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Metrics */}
      {performanceData.customMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Custom Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceData.customMetrics.slice(0, 9).map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {metric.name.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{metric.category}</div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatMetric(metric.value)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData.performanceScore < 90 && (
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Performance Optimization Needed
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Consider implementing lazy loading, optimizing images, and reducing bundle size.
                  </p>
                </div>
              </div>
            )}
            
            {performanceData.coreWebVitals.LCP > 2500 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">
                    Slow Largest Contentful Paint
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Optimize hero images and critical resources to improve LCP.
                  </p>
                </div>
              </div>
            )}

            {performanceData.coreWebVitals.CLS > 0.1 && (
              <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">
                    Layout Shift Issues
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Reserve space for images and avoid inserting content above existing content.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 