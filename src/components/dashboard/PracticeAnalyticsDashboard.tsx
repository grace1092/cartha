'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Star,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Heart,
  Brain,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalClients: number;
    activeClients: number;
    totalSessions: number;
    averageSessionLength: number;
    totalRevenue: number;
    clientRetentionRate: number;
    sessionCompletionRate: number;
    clientSatisfactionScore: number;
  };
  trends: {
    clientGrowth: Array<{ month: string; clients: number; change: number }>;
    revenueGrowth: Array<{ month: string; revenue: number; change: number }>;
    sessionVolume: Array<{ month: string; sessions: number; change: number }>;
  };
  clientAnalytics: {
    ageDistribution: Array<{ range: string; count: number; percentage: number }>;
    sessionTypes: Array<{ type: string; count: number; percentage: number }>;
    referralSources: Array<{ source: string; count: number; percentage: number }>;
  };
  outcomeMetrics: {
    improvementRates: Array<{ condition: string; rate: number; change: number }>;
    sessionOutcomes: Array<{ outcome: string; percentage: number }>;
    treatmentGoals: Array<{ goal: string; achievementRate: number }>;
  };
  financialMetrics: {
    monthlyRevenue: Array<{ month: string; revenue: number; target: number }>;
    paymentMethods: Array<{ method: string; percentage: number; amount: number }>;
    collectionRates: Array<{ period: string; rate: number }>;
  };
}

interface PracticeAnalyticsDashboardProps {
  onBack?: () => void;
}

const PracticeAnalyticsDashboard: React.FC<PracticeAnalyticsDashboardProps> = ({ onBack }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockAnalytics: AnalyticsData = {
      overview: {
        totalClients: 45,
        activeClients: 38,
        totalSessions: 156,
        averageSessionLength: 52,
        totalRevenue: 23400,
        clientRetentionRate: 84.2,
        sessionCompletionRate: 96.8,
        clientSatisfactionScore: 4.7
      },
      trends: {
        clientGrowth: [
          { month: 'Jan', clients: 32, change: 8.3 },
          { month: 'Feb', clients: 35, change: 9.4 },
          { month: 'Mar', clients: 38, change: 8.6 },
          { month: 'Apr', clients: 42, change: 10.5 },
          { month: 'May', clients: 45, change: 7.1 }
        ],
        revenueGrowth: [
          { month: 'Jan', revenue: 18200, change: 12.5 },
          { month: 'Feb', revenue: 19800, change: 8.8 },
          { month: 'Mar', revenue: 21200, change: 7.1 },
          { month: 'Apr', revenue: 22600, change: 6.6 },
          { month: 'May', revenue: 23400, change: 3.5 }
        ],
        sessionVolume: [
          { month: 'Jan', sessions: 124, change: 15.2 },
          { month: 'Feb', sessions: 132, change: 6.5 },
          { month: 'Mar', sessions: 142, change: 7.6 },
          { month: 'Apr', sessions: 149, change: 4.9 },
          { month: 'May', sessions: 156, change: 4.7 }
        ]
      },
      clientAnalytics: {
        ageDistribution: [
          { range: '18-25', count: 8, percentage: 17.8 },
          { range: '26-35', count: 15, percentage: 33.3 },
          { range: '36-45', count: 12, percentage: 26.7 },
          { range: '46-55', count: 7, percentage: 15.6 },
          { range: '55+', count: 3, percentage: 6.7 }
        ],
        sessionTypes: [
          { type: 'Individual', count: 28, percentage: 62.2 },
          { type: 'Couple', count: 12, percentage: 26.7 },
          { type: 'Family', count: 4, percentage: 8.9 },
          { type: 'Group', count: 1, percentage: 2.2 }
        ],
        referralSources: [
          { source: 'Word of Mouth', count: 18, percentage: 40.0 },
          { source: 'Insurance Network', count: 12, percentage: 26.7 },
          { source: 'Online Search', count: 8, percentage: 17.8 },
          { source: 'Healthcare Provider', count: 5, percentage: 11.1 },
          { source: 'Social Media', count: 2, percentage: 4.4 }
        ]
      },
      outcomeMetrics: {
        improvementRates: [
          { condition: 'Anxiety Disorders', rate: 78.5, change: 5.2 },
          { condition: 'Depression', rate: 82.1, change: 3.8 },
          { condition: 'Relationship Issues', rate: 74.3, change: 8.1 },
          { condition: 'Trauma/PTSD', rate: 69.2, change: 12.5 },
          { condition: 'Substance Abuse', rate: 65.8, change: -2.1 }
        ],
        sessionOutcomes: [
          { outcome: 'Significant Improvement', percentage: 68.2 },
          { outcome: 'Moderate Improvement', percentage: 23.7 },
          { outcome: 'Slight Improvement', percentage: 6.4 },
          { outcome: 'No Change', percentage: 1.5 },
          { outcome: 'Deterioration', percentage: 0.2 }
        ],
        treatmentGoals: [
          { goal: 'Symptom Reduction', achievementRate: 84.2 },
          { goal: 'Improved Relationships', achievementRate: 76.8 },
          { goal: 'Better Coping Skills', achievementRate: 89.3 },
          { goal: 'Increased Self-Awareness', achievementRate: 91.5 },
          { goal: 'Behavioral Changes', achievementRate: 72.4 }
        ]
      },
      financialMetrics: {
        monthlyRevenue: [
          { month: 'Jan', revenue: 18200, target: 20000 },
          { month: 'Feb', revenue: 19800, target: 20000 },
          { month: 'Mar', revenue: 21200, target: 20000 },
          { month: 'Apr', revenue: 22600, target: 22000 },
          { month: 'May', revenue: 23400, target: 22000 }
        ],
        paymentMethods: [
          { method: 'Insurance', percentage: 65.2, amount: 15258 },
          { method: 'Credit Card', percentage: 22.4, amount: 5242 },
          { method: 'Cash/Check', percentage: 8.7, amount: 2035 },
          { method: 'HSA/FSA', percentage: 3.7, amount: 865 }
        ],
        collectionRates: [
          { period: 'Current Month', rate: 98.2 },
          { period: '30 Days', rate: 95.8 },
          { period: '60 Days', rate: 89.4 },
          { period: '90+ Days', rate: 76.3 }
        ]
      }
    };
    setAnalytics(mockAnalytics);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number, showSign: boolean = false) => {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4" />;
    if (change < 0) return <ArrowDown className="w-4 h-4" />;
    return null;
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg">Practice Analytics</h1>
          <p className="subheading">Comprehensive insights into your therapy practice performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          {onBack && (
            <button onClick={onBack} className="btn-ghost">
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{analytics.overview.totalClients}</div>
              <div className="text-sm text-slate-600">Total Clients</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-green-600 font-medium">{analytics.overview.activeClients} active</span>
            <span className="text-slate-600">this month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{analytics.overview.totalSessions}</div>
              <div className="text-sm text-slate-600">Total Sessions</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-slate-600">{analytics.overview.averageSessionLength} min avg</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(analytics.overview.totalRevenue)}</div>
              <div className="text-sm text-slate-600">Total Revenue</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-slate-600">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{analytics.overview.clientSatisfactionScore}/5</div>
              <div className="text-sm text-slate-600">Satisfaction Score</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-slate-600">{analytics.overview.clientRetentionRate}% retention</span>
          </div>
        </div>
      </div>

      {/* Growth Trends */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="heading-sm mb-4">Client Growth</h3>
          <div className="space-y-3">
            {analytics.trends.clientGrowth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{item.month}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.clients}</span>
                  <div className={`flex items-center gap-1 text-xs ${getChangeColor(item.change)}`}>
                    {getChangeIcon(item.change)}
                    {formatPercentage(item.change, true)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="heading-sm mb-4">Revenue Growth</h3>
          <div className="space-y-3">
            {analytics.trends.revenueGrowth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{item.month}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatCurrency(item.revenue)}</span>
                  <div className={`flex items-center gap-1 text-xs ${getChangeColor(item.change)}`}>
                    {getChangeIcon(item.change)}
                    {formatPercentage(item.change, true)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="heading-sm mb-4">Session Volume</h3>
          <div className="space-y-3">
            {analytics.trends.sessionVolume.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{item.month}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.sessions}</span>
                  <div className={`flex items-center gap-1 text-xs ${getChangeColor(item.change)}`}>
                    {getChangeIcon(item.change)}
                    {formatPercentage(item.change, true)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Analytics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="heading-sm mb-4">Age Distribution</h3>
          <div className="space-y-3">
            {analytics.clientAnalytics.ageDistribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">{item.range}</span>
                  <span className="font-medium">{item.count} ({formatPercentage(item.percentage)})</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="heading-sm mb-4">Session Types</h3>
          <div className="space-y-3">
            {analytics.clientAnalytics.sessionTypes.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">{item.type}</span>
                  <span className="font-medium">{item.count} ({formatPercentage(item.percentage)})</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="heading-sm mb-4">Referral Sources</h3>
          <div className="space-y-3">
            {analytics.clientAnalytics.referralSources.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">{item.source}</span>
                  <span className="font-medium">{item.count} ({formatPercentage(item.percentage)})</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outcome Metrics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="heading-sm mb-4">Treatment Improvement Rates</h3>
          <div className="space-y-4">
            {analytics.outcomeMetrics.improvementRates.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-700">{item.condition}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatPercentage(item.rate)}</span>
                    <div className={`flex items-center gap-1 text-xs ${getChangeColor(item.change)}`}>
                      {getChangeIcon(item.change)}
                      {formatPercentage(Math.abs(item.change), true)}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="heading-sm mb-4">Treatment Goal Achievement</h3>
          <div className="space-y-4">
            {analytics.outcomeMetrics.treatmentGoals.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-700">{item.goal}</span>
                  <span className="font-medium">{formatPercentage(item.achievementRate)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.achievementRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="heading-sm mb-6">Financial Performance</h3>
        <div className="grid lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-4">Revenue vs Target</h4>
            <div className="space-y-3">
              {analytics.financialMetrics.monthlyRevenue.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.month}</span>
                    <span className="font-medium">
                      {formatCurrency(item.revenue)} / {formatCurrency(item.target)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.revenue >= item.target ? 'bg-green-600' : 'bg-yellow-600'
                      }`}
                      style={{ width: `${Math.min((item.revenue / item.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-4">Payment Methods</h4>
            <div className="space-y-3">
              {analytics.financialMetrics.paymentMethods.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-slate-700">{item.method}</span>
                  <div className="text-right">
                    <div className="font-medium text-sm">{formatPercentage(item.percentage)}</div>
                    <div className="text-xs text-slate-600">{formatCurrency(item.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-4">Collection Rates</h4>
            <div className="space-y-3">
              {analytics.financialMetrics.collectionRates.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-slate-700">{item.period}</span>
                  <span className={`font-medium text-sm ${
                    item.rate >= 95 ? 'text-green-600' : 
                    item.rate >= 85 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(item.rate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="heading-sm text-blue-900 mb-3">AI-Powered Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Strong Client Retention</p>
                  <p className="text-sm text-blue-700">Your 84.2% retention rate is 12% above industry average. Consider implementing a referral program.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Session Capacity Opportunity</p>
                  <p className="text-sm text-blue-700">You're at 78% capacity. Consider extending hours or hiring an associate to capture demand.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Revenue Diversification</p>
                  <p className="text-sm text-blue-700">65% of revenue comes from insurance. Consider offering specialized services for private pay clients.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeAnalyticsDashboard;
