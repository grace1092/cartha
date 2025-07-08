'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Pause, Play } from 'lucide-react';

interface TimerProps {
  duration: number; // in minutes
  progress: number; // 0-100 percentage
  isActive: boolean;
  showMilliseconds?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circular' | 'linear';
}

const Timer: React.FC<TimerProps> = ({
  duration,
  progress,
  isActive,
  showMilliseconds = false,
  size = 'md',
  variant = 'circular'
}) => {
  const [displayTime, setDisplayTime] = useState<string>('');

  // Calculate remaining time based on progress
  useEffect(() => {
    const totalSeconds = duration * 60;
    const elapsedSeconds = (progress / 100) * totalSeconds;
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
    
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60);
    const milliseconds = Math.floor((remainingSeconds % 1) * 100);
    
    if (showMilliseconds) {
      setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`);
    } else {
      setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  }, [duration, progress, showMilliseconds]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16 text-sm';
      case 'lg':
        return 'w-32 h-32 text-xl';
      default:
        return 'w-24 h-24 text-base';
    }
  };

  const getProgressColor = () => {
    if (progress >= 90) return 'text-red-500 stroke-red-500';
    if (progress >= 75) return 'text-yellow-500 stroke-yellow-500';
    if (progress >= 50) return 'text-blue-500 stroke-blue-500';
    return 'text-green-500 stroke-green-500';
  };

  if (variant === 'linear') {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isActive ? (
              <Play className="w-4 h-4 text-green-500" />
            ) : (
              <Pause className="w-4 h-4 text-gray-500" />
            )}
            <span className="font-mono text-lg font-medium">{displayTime}</span>
          </div>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className={`h-3 rounded-full ${getProgressColor().replace('text-', 'bg-').replace('stroke-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    );
  }

  // Circular variant
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`relative ${getSizeClasses()}`}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            className="text-gray-200"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            className={getProgressColor()}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isActive ? (
            <Play className="w-4 h-4 text-green-500 mb-1" />
          ) : (
            <Pause className="w-4 h-4 text-gray-500 mb-1" />
          )}
          <span className="font-mono font-medium text-center leading-tight">
            {displayTime}
          </span>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-sm text-gray-600">
          {Math.round(progress)}% Complete
        </div>
        {duration && (
          <div className="text-xs text-gray-500">
            {duration} minute session
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer; 