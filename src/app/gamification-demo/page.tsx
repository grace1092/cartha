'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlignmentDashboard,
  StreakTracker,
  ProgressAnimations,
  MilestoneRewards,
  ScoreHistory
} from '@/components/gamification';
import type { ScoreAnimation } from '@/lib/types/gamification';
import { Play, RefreshCw, Trophy, TrendingUp, Flame } from 'lucide-react';

const GamificationDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('dashboard');
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const mockScoreAnimation: ScoreAnimation = {
    type: 'score_increase',
    from_value: 74,
    to_value: 78,
    duration: 2000,
    celebration: {
      type: 'confetti',
      intensity: 'medium',
      duration: 3000,
      message: 'Great improvement! You gained 4 points!'
    }
  };

  const demoSections = [
    {
      id: 'dashboard',
      title: 'Alignment Dashboard',
      icon: TrendingUp,
      description: 'Main score display with animated gauge and factor breakdown'
    },
    {
      id: 'streak',
      title: 'Streak Tracker',
      icon: Flame,
      description: 'Fire animation and milestone tracking for consistency'
    },
    {
      id: 'rewards',
      title: 'Badges & Achievements',
      icon: Trophy,
      description: 'Achievement system with unlockable badges and rewards'
    },
    {
      id: 'history',
      title: 'Score History',
      icon: TrendingUp,
      description: 'Historical data visualization with trend analysis'
    },
    {
      id: 'animations',
      title: 'Progress Animations',
      icon: RefreshCw,
      description: 'Score change animations and celebration effects'
    }
  ];

  const triggerAnimation = () => {
    setShowAnimation(true);
    setAnimationKey(prev => prev + 1);
    
    // Reset animation after completion
    setTimeout(() => {
      setShowAnimation(false);
    }, 5000);
  };

  const renderActiveDemo = () => {
    switch (activeDemo) {
      case 'dashboard':
        return (
          <AlignmentDashboard 
            coupleId="demo-couple" 
            showAnimation={true}
            compact={false}
          />
        );
        
      case 'streak':
        return (
          <StreakTracker 
            coupleId="demo-couple"
            showFlameAnimation={true}
            size="large"
          />
        );
        
      case 'rewards':
        return (
          <MilestoneRewards 
            coupleId="demo-couple"
            showUnlocked={true}
            showLocked={true}
            compact={false}
          />
        );
        
      case 'history':
        return (
          <ScoreHistory 
            coupleId="demo-couple"
            timeRange="month"
            showTrends={true}
            compact={false}
          />
        );
        
      case 'animations':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Score Animation Demo
              </h3>
              <p className="text-gray-600 mb-6">
                Click the button below to see a score improvement animation with celebration effects.
              </p>
              
              <div className="mb-6">
                {showAnimation ? (
                  <ProgressAnimations
                    key={animationKey}
                    scoreChange={mockScoreAnimation}
                    onComplete={() => setShowAnimation(false)}
                  />
                ) : (
                  <div className="text-4xl font-bold text-gray-900">
                    74
                  </div>
                )}
              </div>
              
              <button
                onClick={triggerAnimation}
                disabled={showAnimation}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                <span>{showAnimation ? 'Playing...' : 'Trigger Animation'}</span>
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gamification System Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the comprehensive gamification features designed to increase engagement 
            and motivation in your relationship journey. Complete with alignment scoring, 
            streak tracking, achievements, and beautiful animations.
          </p>
        </motion.div>

        {/* Demo Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Sections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {demoSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeDemo === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveDemo(section.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      isActive ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <h3 className={`font-semibold text-sm mb-1 ${
                      isActive ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {section.title}
                    </h3>
                    <p className={`text-xs ${
                      isActive ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {section.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🎮 Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">0-100</div>
                <div className="text-sm text-gray-600">Dynamic Scoring</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">🔥</div>
                <div className="text-sm text-gray-600">Streak Tracking</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">🏆</div>
                <div className="text-sm text-gray-600">Achievement System</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">📈</div>
                <div className="text-sm text-gray-600">Progress Analytics</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Demo Content */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {renderActiveDemo()}
        </motion.div>

        {/* Implementation Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Implementation Notes</h2>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  <strong>Scoring Algorithm:</strong> Weighted compatibility matrix based on answer combinations, 
                  with bonuses for completion rate, session duration, and streak consistency.
                </span>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span>
                  <strong>Streak System:</strong> Visual fire animation intensity scales with streak length. 
                  Includes grace periods and milestone celebrations for sustained engagement.
                </span>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>
                  <strong>Achievements:</strong> Multi-tier badge system (Common → Legendary) with unlock animations 
                  and meaningful rewards like premium features and score bonuses.
                </span>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>
                  <strong>Analytics:</strong> Real-time trend analysis with predictive scoring and personalized 
                  improvement suggestions based on couple-specific patterns.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GamificationDemo; 