'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  Star, 
  Crown, 
  Shield, 
  Zap,
  Heart,
  Target,
  Flame,
  TrendingUp,
  Calendar,
  Users,
  Lock,
  CheckCircle
} from 'lucide-react';
import { 
  MilestoneRewardsProps, 
  Badge, 
  Milestone
} from '@/lib/types/gamification';

// Badge icon mapping
const BADGE_ICONS = {
  week_warrior: Flame,
  month_master: Calendar,
  streak_superstar: TrendingUp,
  communication_champion: Users,
  financial_harmony: Heart,
  goal_getter: Target,
  transparency_titan: Shield,
  consistency_crown: Crown,
  alignment_ace: Star,
  milestone_master: Trophy,
  perfect_score: Award,
  improvement_icon: Zap
};

// Mock data - replace with real data fetching
const MOCK_BADGES: Badge[] = [
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Complete 7 consecutive money dates',
    icon: 'week_warrior',
    rarity: 'common',
    unlock_criteria: { type: 'streak', value: 7 },
    unlocked: true,
    unlocked_date: '2024-01-15T10:00:00Z',
    reward_type: 'badge',
    celebration_message: 'You\'re building great habits!'
  },
  {
    id: 'month_master',
    name: 'Month Master',
    description: 'Complete 30 consecutive money dates',
    icon: 'month_master',
    rarity: 'rare',
    unlock_criteria: { type: 'streak', value: 30 },
    unlocked: false,
    unlocked_date: undefined,
    reward_type: 'badge',
    celebration_message: 'Incredible dedication to your relationship!'
  },
  {
    id: 'alignment_ace',
    name: 'Alignment Ace',
    description: 'Reach 90+ alignment score',
    icon: 'alignment_ace',
    rarity: 'epic',
    unlock_criteria: { type: 'score', value: 90 },
    unlocked: false,
    unlocked_date: undefined,
    reward_type: 'badge',
    celebration_message: 'You\'re financially synchronized!'
  },
  {
    id: 'perfect_score',
    name: 'Perfect Harmony',
    description: 'Achieve 100% alignment score',
    icon: 'perfect_score',
    rarity: 'legendary',
    unlock_criteria: { type: 'score', value: 100 },
    unlocked: false,
    unlocked_date: undefined,
    reward_type: 'badge',
    celebration_message: 'Financial soulmates! 💑'
  }
];

// Use UserAchievement interface for progress tracking
interface AchievementProgress {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completed_date?: string;
  reward: {
    type: 'score_boost' | 'badge' | 'premium_feature';
    value: number | string;
  };
  category: string;
}

const MOCK_ACHIEVEMENTS: AchievementProgress[] = [
  {
    id: 'first_session',
    name: 'First Steps',
    description: 'Complete your first money date',
    progress: 1,
    target: 1,
    completed: true,
    completed_date: '2024-01-01T10:00:00Z',
    reward: { type: 'score_boost', value: 5 },
    category: 'getting_started'
  },
  {
    id: 'score_improver',
    name: 'Score Improver',
    description: 'Improve your alignment score by 10 points',
    progress: 8,
    target: 10,
    completed: false,
    completed_date: undefined,
    reward: { type: 'premium_feature', value: 'advanced_insights' },
    category: 'improvement'
  },
  {
    id: 'weekly_champion',
    name: 'Weekly Champion',
    description: 'Complete all scheduled sessions this week',
    progress: 3,
    target: 5,
    completed: false,
    completed_date: undefined,
    reward: { type: 'badge', value: 'week_warrior' },
    category: 'consistency'
  }
];

const BadgeCard: React.FC<{
  badge: Badge;
  onClaim?: (badge: Badge) => void;
  size?: 'small' | 'medium' | 'large';
}> = ({ badge, onClaim, size = 'medium' }) => {
  const Icon = BADGE_ICONS[badge.icon as keyof typeof BADGE_ICONS] || Award;
  
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20',
    large: 'w-24 h-24'
  };
  
  const rarityConfig = {
    common: { 
      gradient: 'from-gray-400 to-gray-600',
      glow: 'shadow-gray-300',
      border: 'border-gray-300'
    },
    rare: { 
      gradient: 'from-blue-400 to-blue-600',
      glow: 'shadow-blue-300',
      border: 'border-blue-300'
    },
    epic: { 
      gradient: 'from-purple-400 to-purple-600',
      glow: 'shadow-purple-300',
      border: 'border-purple-300'
    },
    legendary: { 
      gradient: 'from-yellow-400 to-orange-500',
      glow: 'shadow-yellow-300',
      border: 'border-yellow-300'
    }
  };
  
  const config = rarityConfig[badge.rarity];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative bg-white rounded-xl p-4 border-2 ${config.border} ${
        badge.unlocked ? config.glow + ' shadow-lg' : 'border-gray-200'
      } transition-all duration-300`}
    >
      {!badge.unlocked && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-80 rounded-xl flex items-center justify-center">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      {/* Badge Icon */}
      <div className={`mx-auto mb-3 ${sizeClasses[size]} relative flex items-center justify-center`}>
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient} ${
            badge.unlocked ? 'opacity-100' : 'opacity-30'
          }`}
        />
        <Icon className={`relative z-10 ${
          size === 'small' ? 'w-8 h-8' : size === 'medium' ? 'w-10 h-10' : 'w-12 h-12'
        } text-white`} />
        
        {badge.unlocked && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>
      
      {/* Badge Info */}
      <div className="text-center">
        <h3 className={`font-semibold text-gray-900 ${
          size === 'small' ? 'text-sm' : 'text-base'
        }`}>
          {badge.name}
        </h3>
        <p className={`text-gray-600 mt-1 ${
          size === 'small' ? 'text-xs' : 'text-sm'
        }`}>
          {badge.description}
        </p>
        
        {badge.unlocked && badge.unlocked_date && (
          <p className="text-xs text-gray-500 mt-2">
            Earned {new Date(badge.unlocked_date).toLocaleDateString()}
          </p>
        )}
        
        {!badge.unlocked && (
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              config.gradient.includes('gray') ? 'bg-gray-100 text-gray-800' :
              config.gradient.includes('blue') ? 'bg-blue-100 text-blue-800' :
              config.gradient.includes('purple') ? 'bg-purple-100 text-purple-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {badge.rarity}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AchievementCard: React.FC<{
  achievement: AchievementProgress;
  onClaim?: (achievement: AchievementProgress) => void;
}> = ({ achievement, onClaim }) => {
  const progressPercentage = (achievement.progress / achievement.target) * 100;
  
  const categoryIcons = {
    getting_started: Star,
    improvement: TrendingUp,
    consistency: Calendar,
    milestone: Trophy,
    special: Crown
  };
  
  const Icon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Award;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-lg p-4 border-2 ${
        achievement.completed 
          ? 'border-green-300 bg-green-50' 
          : 'border-gray-200'
      } transition-all duration-300`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${
          achievement.completed 
            ? 'bg-green-100' 
            : 'bg-gray-100'
        }`}>
          <Icon className={`w-5 h-5 ${
            achievement.completed 
              ? 'text-green-600' 
              : 'text-gray-600'
          }`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
            {achievement.completed && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {achievement.description}
          </p>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{achievement.progress}/{achievement.target}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  achievement.completed ? 'bg-green-500' : 'bg-blue-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          
          {/* Reward */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Reward: {achievement.reward.type === 'score_boost' ? `+${achievement.reward.value} points` :
                       achievement.reward.type === 'badge' ? 'Badge unlock' :
                       achievement.reward.type === 'premium_feature' ? 'Premium feature' :
                       'Special reward'}
            </div>
            
            {achievement.completed && onClaim && (
              <button
                onClick={() => onClaim(achievement)}
                className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
              >
                Claim
              </button>
            )}
          </div>
          
          {achievement.completed_date && (
            <p className="text-xs text-gray-500 mt-2">
              Completed {new Date(achievement.completed_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MilestoneRewards: React.FC<MilestoneRewardsProps> = ({
  coupleId,
  showUnlocked = true,
  showLocked = true,
  compact = false
}) => {
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [achievements, setAchievements] = useState<AchievementProgress[]>(MOCK_ACHIEVEMENTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'unlocked' | 'progress'>('all');
  
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);
  const completedAchievements = achievements.filter(achievement => achievement.completed);
  const progressAchievements = achievements.filter(achievement => !achievement.completed);
  
  const handleClaimBadge = (badge: Badge) => {
    // Handle badge claiming logic
    console.log('Claiming badge:', badge);
  };
  
  const handleClaimAchievement = (achievement: AchievementProgress) => {
    // Handle achievement claiming logic
    console.log('Claiming achievement:', achievement);
  };
  
  if (compact) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
          <span className="text-sm text-gray-600">
            {unlockedBadges.length} badges earned
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {unlockedBadges.slice(0, 3).map((badge) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              size="small"
            />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Achievements & Badges
        </h1>
        <p className="text-gray-600">
          Celebrate your milestones and track your progress
        </p>
      </motion.div>
      
      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unlocked', label: 'Earned' },
            { key: 'progress', label: 'In Progress' }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Badges</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(selectedCategory === 'all' ? badges :
            selectedCategory === 'unlocked' ? unlockedBadges :
            lockedBadges
          ).map((badge) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              onClaim={handleClaimBadge}
            />
          ))}
        </div>
        
        {unlockedBadges.length === 0 && selectedCategory === 'unlocked' && (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No badges yet</h3>
            <p className="text-gray-600">Complete money dates to start earning badges!</p>
          </div>
        )}
      </motion.div>
      
      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
        
        <div className="space-y-4">
          {(selectedCategory === 'all' ? achievements :
            selectedCategory === 'unlocked' ? completedAchievements :
            progressAchievements
          ).map((achievement) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement} 
              onClaim={handleClaimAchievement}
            />
          ))}
        </div>
        
        {completedAchievements.length === 0 && selectedCategory === 'unlocked' && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
            <p className="text-gray-600">Keep participating to unlock achievements!</p>
          </div>
        )}
      </motion.div>
      
      {/* Statistics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {unlockedBadges.length}
            </div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">
              {completedAchievements.length}
            </div>
            <div className="text-sm text-gray-600">Achievements Unlocked</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {Math.round((unlockedBadges.length / badges.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Collection Complete</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MilestoneRewards; 