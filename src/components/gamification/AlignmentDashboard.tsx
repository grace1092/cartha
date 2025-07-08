'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Award,
  ChevronUp,
  ChevronDown,
  Info
} from 'lucide-react';
import { AlignmentDashboardProps, ScoreFactors, AlignmentScore } from '@/lib/types/gamification';

// Mock data - replace with real data fetching
const MOCK_ALIGNMENT_DATA: AlignmentScore = {
  id: '1',
  couple_id: '1',
  current_score: 78,
  previous_score: 74,
  score_history: [
    { date: '2024-01-01', score: 65, change: 0, trigger: 'session_completion' },
    { date: '2024-01-08', score: 68, change: 3, trigger: 'session_completion' },
    { date: '2024-01-15', score: 72, change: 4, trigger: 'session_completion' },
    { date: '2024-01-22', score: 74, change: 2, trigger: 'session_completion' },
    { date: '2024-01-29', score: 78, change: 4, trigger: 'session_completion' }
  ],
  factors: {
    communication_alignment: 82,
    financial_values_match: 76,
    goal_compatibility: 85,
    spending_harmony: 68,
    future_planning_sync: 74,
    conflict_resolution: 71,
    transparency_level: 88,
    session_consistency: 79
  },
  trend: 'improving',
  next_milestone: {
    id: '1',
    type: 'score',
    target_value: 85,
    current_progress: 78,
    title: 'Highly Aligned',
    description: 'Reach 85+ alignment score',
    reward_description: 'Unlock premium insights',
    estimated_completion: '2024-02-15',
    celebration_message: 'Amazing! You\'re becoming financially synchronized!'
  },
  last_updated: '2024-01-29T10:00:00Z',
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-29T10:00:00Z'
};

const ScoreGauge: React.FC<{ 
  score: number; 
  previousScore?: number; 
  showAnimation?: boolean;
  size?: 'small' | 'medium' | 'large';
}> = ({ score, previousScore, showAnimation = true, size = 'large' }) => {
  const [animatedScore, setAnimatedScore] = useState(previousScore || score);
  
  useEffect(() => {
    if (showAnimation && previousScore) {
      const timer = setTimeout(() => {
        setAnimatedScore(score);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [score, previousScore, showAnimation]);
  
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-40 h-40'
  };
  
  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10B981'; // Green
    if (score >= 70) return '#F59E0B'; // Yellow
    if (score >= 50) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };
  
  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg
        className="absolute inset-0 transform -rotate-90"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke={getScoreColor(animatedScore)}
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-bold text-gray-900 ${textSizes[size]}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {Math.round(animatedScore)}
        </motion.span>
        <span className="text-xs text-gray-500 font-medium">ALIGNMENT</span>
      </div>
    </div>
  );
};

const ScoreFactorBar: React.FC<{
  label: string;
  score: number;
  description: string;
  delay?: number;
}> = ({ label, score, description, delay = 0 }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <div className="relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {description}
            </div>
          </div>
        </div>
        <span className="text-sm font-semibold text-gray-900">{score}/100</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <motion.div
          className={`h-3 rounded-full ${getScoreColor(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

const TrendIndicator: React.FC<{ 
  trend: 'improving' | 'stable' | 'declining';
  change: number;
}> = ({ trend, change }) => {
  const getTrendConfig = () => {
    switch (trend) {
      case 'improving':
        return {
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Improving'
        };
      case 'declining':
        return {
          icon: TrendingDown,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Needs Attention'
        };
      default:
        return {
          icon: TrendingUp,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Stable'
        };
    }
  };
  
  const config = getTrendConfig();
  const Icon = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.3 }}
      className={`inline-flex items-center px-3 py-2 rounded-full ${config.bgColor}`}
    >
      <Icon className={`w-4 h-4 mr-2 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
      {change !== 0 && (
        <span className={`ml-2 text-sm font-semibold ${config.color}`}>
          {change > 0 ? '+' : ''}{change}
        </span>
      )}
    </motion.div>
  );
};

const MilestoneCard: React.FC<{
  milestone: NonNullable<AlignmentScore['next_milestone']>;
}> = ({ milestone }) => {
  const progress = (milestone.current_progress / milestone.target_value) * 100;
  const remaining = milestone.target_value - milestone.current_progress;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
            <p className="text-sm text-gray-600">{milestone.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-purple-600">
            {milestone.current_progress}
          </span>
          <span className="text-lg text-gray-500">/{milestone.target_value}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-3 shadow-inner">
          <motion.div
            className="h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Only {remaining} points to go!
        </span>
        {milestone.estimated_completion && (
          <span className="text-sm font-medium text-purple-600">
            ETA: {new Date(milestone.estimated_completion).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const AlignmentDashboard: React.FC<AlignmentDashboardProps> = ({
  coupleId,
  showAnimation = true,
  compact = false
}) => {
  const [data, setData] = useState<AlignmentScore>(MOCK_ALIGNMENT_DATA);
  const [expandedFactors, setExpandedFactors] = useState(false);
  
  const factorLabels: Record<keyof ScoreFactors, { label: string; description: string }> = {
    communication_alignment: {
      label: 'Communication',
      description: 'How well you discuss money topics together'
    },
    financial_values_match: {
      label: 'Values Match',
      description: 'Alignment on core financial beliefs and priorities'
    },
    goal_compatibility: {
      label: 'Goal Alignment',
      description: 'How well your financial goals work together'
    },
    spending_harmony: {
      label: 'Spending Harmony',
      description: 'Agreement on spending decisions and habits'
    },
    future_planning_sync: {
      label: 'Future Planning',
      description: 'Coordination on long-term financial plans'
    },
    conflict_resolution: {
      label: 'Conflict Resolution',
      description: 'How effectively you resolve money disagreements'
    },
    transparency_level: {
      label: 'Transparency',
      description: 'Openness about financial situations and feelings'
    },
    session_consistency: {
      label: 'Consistency',
      description: 'Regular engagement with money conversations'
    }
  };
  
  const scoreChange = data.current_score - (data.previous_score || data.current_score);
  
  if (compact) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Alignment Score</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">{data.current_score}</span>
              <TrendIndicator trend={data.trend} change={scoreChange} />
            </div>
          </div>
          <ScoreGauge 
            score={data.current_score} 
            previousScore={data.previous_score}
            showAnimation={showAnimation}
            size="small"
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Main Score Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Financial Alignment Score
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Your compatibility score reflects how well-aligned you are on financial matters. 
            Keep building together! 💪
          </motion.p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
          <div className="flex flex-col items-center">
            <ScoreGauge 
              score={data.current_score} 
              previousScore={data.previous_score}
              showAnimation={showAnimation}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-4 text-center"
            >
              <TrendIndicator trend={data.trend} change={scoreChange} />
            </motion.div>
          </div>
          
          <div className="text-center lg:text-left space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                You're {data.current_score}% financially aligned! 🎉
              </h2>
              <p className="text-gray-600">
                {data.current_score >= 85 
                  ? "Amazing! You're highly synchronized on money matters."
                  : data.current_score >= 70
                  ? "Great progress! You're building strong financial harmony."
                  : data.current_score >= 50
                  ? "Good foundation! Keep working together to strengthen alignment."
                  : "Every couple starts somewhere! Your alignment will grow with practice."
                }
              </p>
            </motion.div>
            
            {data.next_milestone && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="flex items-center space-x-2 text-purple-600"
              >
                <Award className="w-5 h-5" />
                <span className="font-medium">
                  Next milestone: {data.next_milestone.title} 
                  ({data.next_milestone.target_value - data.current_score} points to go!)
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Milestone Progress */}
      {data.next_milestone && (
        <MilestoneCard milestone={data.next_milestone} />
      )}
      
      {/* Score Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Score Breakdown</h2>
          <button
            onClick={() => setExpandedFactors(!expandedFactors)}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <span className="font-medium">
              {expandedFactors ? 'Show Less' : 'Show All'}
            </span>
            {expandedFactors ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        
        <div className="space-y-6">
          {Object.entries(data.factors)
            .slice(0, expandedFactors ? undefined : 4)
            .map(([key, score], index) => {
              const factorKey = key as keyof ScoreFactors;
              const factor = factorLabels[factorKey];
              return (
                <ScoreFactorBar
                  key={key}
                  label={factor.label}
                  score={score}
                  description={factor.description}
                  delay={index * 0.1}
                />
              );
            })}
        </div>
        
        <AnimatePresence>
          {expandedFactors && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Strongest Areas</h3>
                  <div className="space-y-1">
                    {Object.entries(data.factors)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([key, score]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-blue-700">
                            {factorLabels[key as keyof ScoreFactors].label}
                          </span>
                          <span className="font-medium text-blue-900">{score}</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-medium text-orange-900 mb-2">Growth Opportunities</h3>
                  <div className="space-y-1">
                    {Object.entries(data.factors)
                      .sort(([, a], [, b]) => a - b)
                      .slice(0, 3)
                      .map(([key, score]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-orange-700">
                            {factorLabels[key as keyof ScoreFactors].label}
                          </span>
                          <span className="font-medium text-orange-900">{score}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AlignmentDashboard; 