'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ProgressAnimationsProps, 
  ScoreAnimation, 
  CelebrationConfig 
} from '@/lib/types/gamification';
import Confetti from '../ui/Confetti';

const NumberCountUp: React.FC<{
  from: number;
  to: number;
  duration: number;
  onComplete?: () => void;
}> = ({ from, to, duration, onComplete }) => {
  const [current, setCurrent] = useState(from);
  
  useEffect(() => {
    const startTime = Date.now();
    const difference = to - from;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newValue = from + (difference * easeOutQuart);
      
      setCurrent(Math.round(newValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    
    animate();
  }, [from, to, duration, onComplete]);
  
  return <span>{current}</span>;
};

const ScoreChangeIndicator: React.FC<{
  change: number;
  type: 'increase' | 'decrease';
}> = ({ change, type }) => {
  const isPositive = type === 'increase';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`absolute top-0 right-0 px-3 py-1 rounded-full text-sm font-bold ${
        isPositive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}
    >
      {isPositive ? '+' : ''}{change}
    </motion.div>
  );
};

const MilestoneAchievedAnimation: React.FC<{
  milestone: string;
  onComplete?: () => void;
}> = ({ milestone, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={onComplete}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Milestone Achieved!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-gray-600 mb-6"
        >
          {milestone}
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          onClick={onComplete}
          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const StreakAchievementAnimation: React.FC<{
  streakCount: number;
  onComplete?: () => void;
}> = ({ streakCount, onComplete }) => {
  const flames = Array.from({ length: 5 }, (_, i) => i);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={onComplete}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl"
      >
        <div className="flex justify-center mb-4 space-x-1">
          {flames.map((flame, index) => (
            <motion.div
              key={flame}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.5 + (index * 0.1), 
                duration: 0.6, 
                type: "spring", 
                stiffness: 200 
              }}
              className="text-4xl"
            >
              🔥
            </motion.div>
          ))}
        </div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Streak Milestone!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-gray-600 mb-6"
        >
          {streakCount} consecutive sessions! You're on fire! 🔥
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          onClick={onComplete}
          className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Keep Going!
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const PulseAnimation: React.FC<{
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
}> = ({ children, intensity = 'medium', color = '#10B981' }) => {
  const scales = {
    low: [1, 1.02, 1],
    medium: [1, 1.05, 1],
    high: [1, 1.1, 1]
  };
  
  const durations = {
    low: 2,
    medium: 1.5,
    high: 1
  };
  
  return (
    <motion.div
      animate={{
        scale: scales[intensity],
        boxShadow: [
          `0 0 0 0 ${color}00`,
          `0 0 0 10px ${color}20`,
          `0 0 0 0 ${color}00`
        ]
      }}
      transition={{
        duration: durations[intensity],
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="rounded-lg"
    >
      {children}
    </motion.div>
  );
};

const BounceAnimation: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        delay,
        duration: 0.6,
        type: "spring",
        stiffness: 300,
        damping: 10
      }}
    >
      {children}
    </motion.div>
  );
};

const GlowAnimation: React.FC<{
  children: React.ReactNode;
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ children, glowColor = '#10B981', intensity = 'medium' }) => {
  const glowSizes = {
    low: '5px',
    medium: '10px',
    high: '20px'
  };
  
  return (
    <motion.div
      animate={{
        filter: [
          `drop-shadow(0 0 0 ${glowColor}00)`,
          `drop-shadow(0 0 ${glowSizes[intensity]} ${glowColor}80)`,
          `drop-shadow(0 0 0 ${glowColor}00)`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

const ProgressAnimations: React.FC<ProgressAnimationsProps> = ({
  scoreChange,
  onComplete
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'counting' | 'celebration' | 'complete'>('counting');
  
  useEffect(() => {
    // Start celebration after score animation
    const timer = setTimeout(() => {
      if (scoreChange.celebration) {
        setShowCelebration(true);
        setAnimationPhase('celebration');
      } else {
        setAnimationPhase('complete');
        onComplete?.();
      }
    }, scoreChange.duration);
    
    return () => clearTimeout(timer);
  }, [scoreChange, onComplete]);
  
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setAnimationPhase('complete');
    onComplete?.();
  };
  
  const renderCelebration = () => {
    if (!scoreChange.celebration) return null;
    
    const { type, message } = scoreChange.celebration;
    
    switch (type) {
      case 'confetti':
        return (
          <AnimatePresence>
            {showCelebration && (
              <>
                <Confetti 
                  active={true}
                  config={{
                    spread: 360,
                    ticks: 100,
                    gravity: 0.3,
                    decay: 0.94,
                    startVelocity: 30,
                    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                  onClick={handleCelebrationComplete}
                >
                  <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    exit={{ y: -50 }}
                    className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl"
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Score Improved!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {message || "Your alignment score increased!"}
                    </p>
                    <button
                      onClick={handleCelebrationComplete}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Awesome!
                    </button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        );
        
      case 'fireworks':
        return (
          <AnimatePresence>
            {showCelebration && (
              <MilestoneAchievedAnimation
                milestone={message || "Milestone reached!"}
                onComplete={handleCelebrationComplete}
              />
            )}
          </AnimatePresence>
        );
        
      case 'bounce':
        return (
          <AnimatePresence>
            {showCelebration && (
              <StreakAchievementAnimation
                streakCount={scoreChange.to_value}
                onComplete={handleCelebrationComplete}
              />
            )}
          </AnimatePresence>
        );
        
      default:
        return null;
    }
  };
  
  const renderScoreAnimation = () => {
    const change = scoreChange.to_value - scoreChange.from_value;
    const isIncrease = change > 0;
    
    return (
      <div className="relative">
        {/* Score counter */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="text-4xl font-bold text-gray-900"
        >
          <NumberCountUp
            from={scoreChange.from_value}
            to={scoreChange.to_value}
            duration={scoreChange.duration}
            onComplete={() => {
              if (!scoreChange.celebration) {
                onComplete?.();
              }
            }}
          />
        </motion.div>
        
        {/* Change indicator */}
        <AnimatePresence>
          {Math.abs(change) > 0 && (
            <ScoreChangeIndicator
              change={change}
              type={isIncrease ? 'increase' : 'decrease'}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  // Wrap the score animation with appropriate effects
  const wrapWithEffects = (content: React.ReactNode) => {
    const change = scoreChange.to_value - scoreChange.from_value;
    const isIncrease = change > 0;
    
    if (scoreChange.type === 'milestone_reached') {
      return (
        <GlowAnimation glowColor="#10B981" intensity="high">
          <PulseAnimation intensity="high" color="#10B981">
            {content}
          </PulseAnimation>
        </GlowAnimation>
      );
    }
    
    if (isIncrease && Math.abs(change) >= 5) {
      return (
        <BounceAnimation>
          <PulseAnimation intensity="medium" color="#10B981">
            {content}
          </PulseAnimation>
        </BounceAnimation>
      );
    }
    
    if (isIncrease) {
      return (
        <PulseAnimation intensity="low" color="#10B981">
          {content}
        </PulseAnimation>
      );
    }
    
    return content;
  };
  
  return (
    <>
      {wrapWithEffects(renderScoreAnimation())}
      {renderCelebration()}
    </>
  );
};

export default ProgressAnimations; 