'use client';

import { useState, useEffect } from 'react';
import { Heart, TrendingUp, Target, CheckCircle, AlertCircle, Trophy, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface ScoreData {
  overall_score: number;
  communication_score: number;
  goal_alignment_score: number;
  spending_compatibility_score: number;
  planning_score: number;
  conversation_count: number;
  last_updated: string;
}

interface RelationshipFinancialScoreProps {
  className?: string;
}

const scoreCategories = {
  communication: {
    label: 'Communication',
    icon: Heart,
    color: 'text-pink-600',
    description: 'How well you discuss money topics'
  },
  goal_alignment: {
    label: 'Goal Alignment',
    icon: Target,
    color: 'text-blue-600',
    description: 'Alignment on financial goals'
  },
  spending_compatibility: {
    label: 'Spending Compatibility',
    icon: TrendingUp,
    color: 'text-green-600',
    description: 'Similar spending philosophies'
  },
  planning: {
    label: 'Planning & Future',
    icon: CheckCircle,
    color: 'text-purple-600',
    description: 'Shared financial planning approach'
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreGradient = (score: number) => {
  if (score >= 80) return 'from-green-500 to-green-600';
  if (score >= 60) return 'from-yellow-500 to-yellow-600';
  return 'from-red-500 to-red-600';
};

const getScoreMessage = (score: number) => {
  if (score >= 90) return { 
    message: 'Excellent financial compatibility! You\'re a money power couple.', 
    emoji: '🌟' 
  };
  if (score >= 80) return { 
    message: 'Great financial alignment! You work well together on money matters.', 
    emoji: '💪' 
  };
  if (score >= 70) return { 
    message: 'Good financial compatibility with room for growth.', 
    emoji: '👍' 
  };
  if (score >= 60) return { 
    message: 'Moderate alignment. Some areas need attention.', 
    emoji: '📈' 
  };
  if (score >= 40) return { 
    message: 'Significant differences. More communication needed.', 
    emoji: '🔄' 
  };
  return { 
    message: 'Major differences. Focus on understanding each other.', 
    emoji: '💬' 
  };
};

export default function RelationshipFinancialScore({ className = '' }: RelationshipFinancialScoreProps) {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchScoreData();
  }, []);

  const fetchScoreData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In a real implementation, this would come from analyzing conversation patterns
      // For now, we'll generate a mock score based on user activity
      const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id);

      const conversationCount = conversations?.length || 0;
      
      // Mock score calculation based on activity
      const baseScore = Math.min(50 + (conversationCount * 8), 95);
      const variance = Math.random() * 10 - 5; // +/- 5 points variance
      
      const mockScore: ScoreData = {
        overall_score: Math.round(Math.max(0, Math.min(100, baseScore + variance))),
        communication_score: Math.round(Math.max(0, Math.min(100, baseScore + variance - 5))),
        goal_alignment_score: Math.round(Math.max(0, Math.min(100, baseScore + variance + 3))),
        spending_compatibility_score: Math.round(Math.max(0, Math.min(100, baseScore + variance - 2))),
        planning_score: Math.round(Math.max(0, Math.min(100, baseScore + variance + 1))),
        conversation_count: conversationCount,
        last_updated: new Date().toISOString()
      };

      setScoreData(mockScore);
    } catch (error) {
      console.error('Error fetching score data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>Unable to calculate your financial compatibility score.</p>
          <p className="text-sm">Have more conversations to generate insights!</p>
        </div>
      </div>
    );
  }

  const { message, emoji } = getScoreMessage(scoreData.overall_score);

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-2 rounded-lg">
              <Trophy className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Financial Compatibility Score</h3>
              <p className="text-sm text-gray-600">Based on {scoreData.conversation_count} conversations</p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        {/* Main Score Display */}
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            {/* Background Circle */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
            
            {/* Score Circle */}
            <div 
              className={`absolute inset-0 rounded-full border-8 border-transparent bg-gradient-to-r ${getScoreGradient(scoreData.overall_score)} rounded-full`}
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * scoreData.overall_score / 100 - Math.PI / 2)}% ${50 + 50 * Math.sin(2 * Math.PI * scoreData.overall_score / 100 - Math.PI / 2)}%, 50% 50%)`
              }}
            ></div>
            
            {/* Score Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(scoreData.overall_score)}`}>
                  {scoreData.overall_score}
                </div>
                <div className="text-xs text-gray-600">out of 100</div>
              </div>
            </div>
          </div>
          
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {message} {emoji}
          </div>
          
          <div className="text-sm text-gray-600">
            Last updated: {new Date(scoreData.last_updated).toLocaleDateString()}
          </div>
        </div>

        {/* Category Scores */}
        {showDetails && (
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-900">Detailed Breakdown</h4>
            
            {Object.entries(scoreCategories).map(([key, category]) => {
              const score = scoreData[`${key}_score` as keyof ScoreData] as number;
              const Icon = category.icon;
              
              return (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${category.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{category.label}</h5>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${getScoreGradient(score)} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Recommendations</h4>
          <div className="space-y-2 text-sm text-blue-800">
            {scoreData.overall_score < 70 && (
              <p>• Focus on having more open conversations about money goals and values</p>
            )}
            {scoreData.conversation_count < 5 && (
              <p>• Complete more conversations to get a more accurate compatibility score</p>
            )}
            {scoreData.overall_score >= 80 && (
              <p>• Great work! Consider setting up regular money dates to maintain your alignment</p>
            )}
            <p>• Use the conversation templates to explore new financial topics together</p>
          </div>
        </div>

        {/* Achievement Badges */}
        {scoreData.overall_score >= 80 && (
          <div className="mt-4 flex justify-center">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Star className="h-4 w-4" />
              Financial Compatibility Champion
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 