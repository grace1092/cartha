'use client';

import React, { useState } from 'react';
import { Crown, TrendingUp, Heart, Target, Shield, Sparkles, ChevronRight, BarChart3, PieChart } from 'lucide-react';

interface LegacyScore {
  overall: number;
  categories: {
    values: number;
    goals: number;
    communication: number;
    planning: number;
    risk: number;
    trust: number;
  };
  insights: {
    strengths: string[];
    opportunities: string[];
    recommendations: string[];
  };
  progression: {
    month: string;
    score: number;
  }[];
}

interface CompatibilityInsight {
  category: string;
  score: number;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action: string;
}

export default function LegacyIndex() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [showDetails, setShowDetails] = useState(false);

  const legacyScore: LegacyScore = {
    overall: 87,
    categories: {
      values: 92,
      goals: 85,
      communication: 88,
      planning: 84,
      risk: 79,
      trust: 95
    },
    insights: {
      strengths: [
        'Exceptional trust and transparency in financial conversations',
        'Strong alignment on long-term wealth building goals',
        'Excellent communication patterns around money decisions'
      ],
      opportunities: [
        'Risk tolerance alignment could be strengthened',
        'Short-term planning strategies need more coordination',
        'Investment philosophy differences to explore'
      ],
      recommendations: [
        'Schedule monthly risk tolerance alignment sessions',
        'Create shared investment learning experiences',
        'Develop coordinated short-term financial planning system'
      ]
    },
    progression: [
      { month: 'Aug', score: 78 },
      { month: 'Sep', score: 82 },
      { month: 'Oct', score: 85 },
      { month: 'Nov', score: 86 },
      { month: 'Dec', score: 87 }
    ]
  };

  const compatibilityInsights: CompatibilityInsight[] = [
    {
      category: 'Financial Values',
      score: 92,
      description: 'Exceptional alignment on core money beliefs and principles',
      impact: 'high',
      action: 'Continue reinforcing shared values through regular discussion'
    },
    {
      category: 'Wealth Goals',
      score: 85,
      description: 'Strong consensus on long-term financial objectives',
      impact: 'high',
      action: 'Define specific milestone timelines and accountability measures'
    },
    {
      category: 'Communication',
      score: 88,
      description: 'Healthy patterns for discussing money and making decisions',
      impact: 'medium',
      action: 'Practice difficult conversation scenarios proactively'
    },
    {
      category: 'Planning Style',
      score: 84,
      description: 'Generally compatible approaches to financial planning',
      impact: 'medium',
      action: 'Align on preferred planning tools and review frequency'
    },
    {
      category: 'Risk Tolerance',
      score: 79,
      description: 'Some differences in comfort with financial risk',
      impact: 'medium',
      action: 'Explore risk tolerance through guided assessment exercises'
    },
    {
      category: 'Trust & Transparency',
      score: 95,
      description: 'Outstanding foundation of financial trust and openness',
      impact: 'high',
      action: 'Maintain current practices and serve as model for other areas'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[var(--sage-green)]';
    if (score >= 80) return 'text-[var(--old-gold)]';
    if (score >= 70) return 'text-[var(--estate-navy)]';
    return 'text-[var(--charcoal)]';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-[var(--sage-green)]';
    if (score >= 80) return 'bg-[var(--old-gold)]';
    if (score >= 70) return 'bg-[var(--estate-navy)]';
    return 'bg-[var(--charcoal)]';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-[var(--estate-navy)]';
      case 'medium': return 'text-[var(--old-gold)]';
      case 'low': return 'text-[var(--sage-green)]';
      default: return 'text-[var(--charcoal)]';
    }
  };

  return (
    <div className="layout-estate min-h-screen">
      <div className="container-estate py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-8 h-8 text-[var(--old-gold)]" />
            <h1 className="text-estate">Legacy Index</h1>
          </div>
          <p className="text-intimate max-w-3xl mx-auto">
            A sophisticated measure of your financial compatibility and shared vision strength. 
            Built on principles of generational wealth building and relationship prosperity.
          </p>
        </div>

        {/* Overall Score */}
        <div className="card-vault text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--estate-cream)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--old-gold)"
                  strokeWidth="8"
                  strokeDasharray={`${(legacyScore.overall / 100) * 314.16} 314.16`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-estate">{legacyScore.overall}</span>
              </div>
            </div>
            <div className="text-left">
              <h2 className="text-legacy mb-2">Exceptional Compatibility</h2>
              <p className="text-whisper max-w-sm">
                Your financial partnership demonstrates rare alignment and deep trust. 
                This score places you in the top 5% of couples.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-vault text-[var(--sage-green)] mb-1">+2</div>
              <div className="text-whisper">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-vault text-[var(--old-gold)] mb-1">+9</div>
              <div className="text-whisper">This Quarter</div>
            </div>
            <div className="text-center">
              <div className="text-vault text-[var(--estate-navy)] mb-1">87%</div>
              <div className="text-whisper">Percentile</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Object.entries(legacyScore.categories).map(([category, score]) => (
            <div key={category} className="card-estate hover-estate cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-vault capitalize">{category}</h3>
                <span className={`text-legacy ${getScoreColor(score)}`}>{score}</span>
              </div>
              <div className="progress-estate">
                <div 
                  className={`h-full ${getScoreBackground(score)} transition-all duration-500 ease-out`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="mt-3 text-whisper text-sm">
                {score >= 90 ? 'Exceptional' : score >= 80 ? 'Strong' : score >= 70 ? 'Developing' : 'Needs Focus'}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Compatibility Insights */}
          <div className="card-estate">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-legacy">Compatibility Insights</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-whisper hover:text-[var(--estate-navy)] transition-colors duration-200"
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            <div className="space-y-4">
              {compatibilityInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg border border-[var(--estate-navy)]/10 hover:border-[var(--estate-navy)]/20 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-vault">{insight.category}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact.toUpperCase()}
                      </span>
                      <span className={`text-lg ${getScoreColor(insight.score)}`}>
                        {insight.score}
                      </span>
                    </div>
                  </div>
                  <p className="text-whisper text-sm mb-2">{insight.description}</p>
                  {showDetails && (
                    <div className="text-whisper text-sm bg-[var(--estate-cream)] px-3 py-2 rounded">
                      <strong>Action:</strong> {insight.action}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="card-estate">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-legacy">Progress Tracking</h3>
              <div className="flex items-center space-x-2">
                {(['1M', '3M', '6M', '1Y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                      selectedTimeframe === period
                        ? 'bg-[var(--estate-navy)] text-[var(--warm-white)]'
                        : 'text-[var(--estate-navy)] hover:bg-[var(--estate-cream)]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {legacyScore.progression.map((point, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[var(--estate-cream)]/50">
                  <span className="text-vault">{point.month}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-2 bg-[var(--estate-cream)] rounded-full">
                      <div 
                        className="h-full bg-[var(--old-gold)] rounded-full transition-all duration-500"
                        style={{ width: `${point.score}%` }}
                      />
                    </div>
                    <span className={`text-vault ${getScoreColor(point.score)}`}>
                      {point.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="card-vault">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="w-6 h-6 text-[var(--old-gold)]" />
            <h3 className="text-legacy">Strategic Recommendations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strengths */}
            <div>
              <h4 className="text-vault mb-3 text-[var(--sage-green)]">Strengths to Leverage</h4>
              <ul className="space-y-2">
                {legacyScore.insights.strengths.map((strength, index) => (
                  <li key={index} className="text-whisper text-sm flex items-start">
                    <div className="w-2 h-2 bg-[var(--sage-green)] rounded-full mt-2 mr-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div>
              <h4 className="text-vault mb-3 text-[var(--old-gold)]">Growth Opportunities</h4>
              <ul className="space-y-2">
                {legacyScore.insights.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-whisper text-sm flex items-start">
                    <div className="w-2 h-2 bg-[var(--old-gold)] rounded-full mt-2 mr-2 flex-shrink-0" />
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-vault mb-3 text-[var(--estate-navy)]">Next Actions</h4>
              <ul className="space-y-2">
                {legacyScore.insights.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-whisper text-sm flex items-start">
                    <div className="w-2 h-2 bg-[var(--estate-navy)] rounded-full mt-2 mr-2 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Estate Footer */}
        <div className="mt-12 text-center">
          <div className="divider-estate mb-6" />
          <div className="flex items-center justify-center space-x-2 text-whisper">
            <Sparkles className="w-4 h-4" />
            <span>Your legacy grows stronger with each alignment</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
} 