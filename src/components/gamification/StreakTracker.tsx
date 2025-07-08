'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Zap, 
  Calendar, 
  Award, 
  Shield,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';
import { StreakTrackerProps, StreakData, StreakMilestone } from '@/lib/types/gamification';

// Mock data - replace with real data fetching
const MOCK_STREAK_DATA: StreakData = {
  id: '1',
  couple_id: '1',
  current_streak: 12,
  longest_streak: 18,
  total_sessions: 45,
  last_session_date: '2024-01-29T10:00:00Z',
  streak_type: 'session_based',
  grace_period_used: false,
  grace_period_expires: undefined,
  streak_frozen_until: undefined,
  milestone_progress: [
    { target: 7, achieved: true, achieved_date: '2024-01-15T10:00:00Z', reward_claimed: true, badge_id: 'week_warrior' },
    { target: 14, achieved: false, achieved_date: undefined, reward_claimed: false, badge_id: undefined },
    { target: 30, achieved: false, achieved_date: undefined, reward_claimed: false, badge_id: undefined },
    { target: 100, achieved: false, achieved_date: undefined, reward_claimed: false, badge_id: undefined }
  ],
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-29T10:00:00Z'
};

const FlameAnimation: React.FC<{
  intensity: number;
  size: 'small' | 'medium' | 'large';
  color?: string;
}> = ({ intensity, size, color = '#F59E0B' }) => {
  const sizeMap = {
    small: { width: 32, height: 40, particles: 8 },
    medium: { width: 48, height: 60, particles: 12 },
    large: { width: 64, height: 80, particles: 16 }
  };
  
  const config = sizeMap[size];
  const particles = Array.from({ length: config.particles }, (_, i) => i);
  
  const getFlameColor = (index: number) => {
    const colors = [
      '#FF6B35', // Orange-red
      '#F7931E', // Orange
      '#FFD23F', // Yellow
      '#FF6B35', // Orange-red
    ];
    return colors[index % colors.length];
  };
  
  return (
    <div 
      className="relative flex items-end justify-center"
      style={{ width: config.width, height: config.height }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 12 + 8,
            backgroundColor: getFlameColor(particle),
            bottom: 0,
            left: `${(particle / config.particles) * 100}%`,
          }}
          animate={{
            y: [0, -config.height * 0.8, -config.height * 0.3, 0],
            opacity: [0.8, 1, 0.6, 0],
            scale: [1, 1.2, 0.8, 0.4],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: particle * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Main flame body */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: config.width * 0.7,
          height: config.height * 0.8,
          background: `linear-gradient(to top, ${color}, #FF6B35, #FFD23F)`,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }}
        animate={{
          scale: [1, 1.05, 0.95, 1],
          rotate: [-2, 2, -1, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: config.width * 1.2,
          height: config.height * 1.2,
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

const StreakCounter: React.FC<{
  streak: number;
  type: 'days' | 'sessions';
  size: 'small' | 'medium' | 'large';
}> = ({ streak, type, size }) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };
  
  const labelSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  return (
    <div className="text-center">
      <motion.div
        className={`font-bold text-gray-900 ${sizeClasses[size]}`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {streak}
      </motion.div>
      <motion.div
        className={`text-gray-600 font-medium uppercase tracking-wide ${labelSizes[size]}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {type} streak
      </motion.div>
    </div>
  );
};

const MilestoneProgress: React.FC<{
  milestones: StreakMilestone[];
  currentStreak: number;
  onClaimReward?: (milestone: StreakMilestone) => void;
}> = ({ milestones, currentStreak, onClaimReward }) => {
  const nextMilestone = milestones.find(m => !m.achieved);
  const completedMilestones = milestones.filter(m => m.achieved);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Milestone Progress</h3>
      
      {/* Next milestone */}
      {nextMilestone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">
                {nextMilestone.target} {nextMilestone.target === 1 ? 'Day' : 'Days'} Streak
              </span>
            </div>
            <span className="text-blue-600 font-semibold">
              {currentStreak}/{nextMilestone.target}
            </span>
          </div>
          
          <div className="w-full bg-white rounded-full h-3 shadow-inner mb-3">
            <motion.div
              className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (currentStreak / nextMilestone.target) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="text-sm text-gray-600">
            {currentStreak >= nextMilestone.target ? (
              <span className="text-green-600 font-medium">🎉 Milestone achieved! Keep it up!</span>
            ) : (
              <span>
                Only {nextMilestone.target - currentStreak} more {nextMilestone.target - currentStreak === 1 ? 'day' : 'days'} to go!
              </span>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Completed milestones */}
      {completedMilestones.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Completed Milestones</h4>
          <div className="grid grid-cols-2 gap-2">
            {completedMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.target}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-green-50 rounded-lg p-3 border border-green-200 text-center"
              >
                <Award className="w-4 h-4 text-green-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-green-900">
                  {milestone.target} Days
                </div>
                {milestone.achieved_date && (
                  <div className="text-xs text-green-600">
                    {new Date(milestone.achieved_date).toLocaleDateString()}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GracePeriodIndicator: React.FC<{
  gracePeriodUsed: boolean;
  gracePeriodExpires?: string;
  onUseGracePeriod?: () => void;
}> = ({ gracePeriodUsed, gracePeriodExpires, onUseGracePeriod }) => {
  if (gracePeriodUsed && gracePeriodExpires) {
    const timeLeft = new Date(gracePeriodExpires).getTime() - new Date().getTime();
    const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
      >
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-yellow-600" />
          <div className="flex-1">
            <div className="text-sm font-medium text-yellow-900">
              Grace Period Active
            </div>
            <div className="text-xs text-yellow-700">
              {hoursLeft > 0 ? `${hoursLeft} hours left` : 'Expires soon'}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (!gracePeriodUsed && onUseGracePeriod) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-blue-900">
                Grace Period Available
              </div>
              <div className="text-xs text-blue-700">
                Miss a day? Use your 24-hour grace period
              </div>
            </div>
          </div>
          <button
            onClick={onUseGracePeriod}
            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Use Now
          </button>
        </div>
      </motion.div>
    );
  }
  
  return null;
};

const StreakStats: React.FC<{
  data: StreakData;
}> = ({ data }) => {
  const stats = [
    {
      label: 'Current Streak',
      value: data.current_streak,
      suffix: data.streak_type === 'daily' ? 'days' : 'sessions',
      icon: Flame,
      color: 'text-orange-600'
    },
    {
      label: 'Longest Streak',
      value: data.longest_streak,
      suffix: data.streak_type === 'daily' ? 'days' : 'sessions',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Total Sessions',
      value: data.total_sessions,
      suffix: 'completed',
      icon: Calendar,
      color: 'text-blue-600'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 text-center"
          >
            <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.suffix}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

const StreakTracker: React.FC<StreakTrackerProps> = ({
  coupleId,
  showFlameAnimation = true,
  size = 'medium'
}) => {
  const [data, setData] = useState<StreakData>(MOCK_STREAK_DATA);
  const [showMilestones, setShowMilestones] = useState(false);
  
  const getFlameIntensity = (streak: number) => {
    if (streak >= 30) return 1.0;
    if (streak >= 14) return 0.8;
    if (streak >= 7) return 0.6;
    if (streak >= 3) return 0.4;
    return 0.2;
  };
  
  const getEncouragementMessage = (streak: number) => {
    if (streak === 0) return "Ready to start your streak? 🚀";
    if (streak === 1) return "Great start! One day down! 💪";
    if (streak < 7) return "Keep it going! You're building momentum! 🔥";
    if (streak < 14) return "Amazing! You're on fire! 🔥🔥";
    if (streak < 30) return "Incredible consistency! You're unstoppable! 🔥🔥🔥";
    return "Legendary streak! You're a money date master! 🏆";
  };
  
  if (size === 'small') {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          {showFlameAnimation && (
            <FlameAnimation 
              intensity={getFlameIntensity(data.current_streak)}
              size="small"
            />
          )}
          <div className="flex-1">
            <StreakCounter 
              streak={data.current_streak} 
              type={data.streak_type === 'daily' ? 'days' : 'sessions'}
              size="small"
            />
            <div className="text-xs text-gray-500 mt-1">
              Best: {data.longest_streak}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Main Streak Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          Money Date Streak
        </motion.h2>
        
        <div className="flex flex-col items-center space-y-6">
          {showFlameAnimation && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <FlameAnimation 
                intensity={getFlameIntensity(data.current_streak)}
                size={size}
              />
            </motion.div>
          )}
          
          <StreakCounter 
            streak={data.current_streak} 
            type={data.streak_type === 'daily' ? 'days' : 'sessions'}
            size={size}
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-600 max-w-md"
          >
            {getEncouragementMessage(data.current_streak)}
          </motion.p>
        </div>
        
        <GracePeriodIndicator 
          gracePeriodUsed={data.grace_period_used}
          gracePeriodExpires={data.grace_period_expires}
        />
      </motion.div>
      
      {/* Milestone Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <MilestoneProgress 
          milestones={data.milestone_progress}
          currentStreak={data.current_streak}
        />
      </motion.div>
      
      {/* Streak Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StreakStats data={data} />
      </motion.div>
    </div>
  );
};

export default StreakTracker; 