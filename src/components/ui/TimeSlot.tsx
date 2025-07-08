'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { TimeSlot as TimeSlotType } from '@/lib/types/money-date';
import { Clock, AlertCircle } from 'lucide-react';

interface TimeSlotProps {
  timeSlot: TimeSlotType;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  timeSlot,
  isSelected = false,
  onClick,
  disabled = false
}) => {
  const { start, end, available, conflictReason, confidence } = timeSlot;

  const handleClick = () => {
    if (!disabled && available && onClick) {
      onClick();
    }
  };

  const getSlotStyle = () => {
    if (disabled || !available) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200';
    }
    
    if (isSelected) {
      return 'bg-blue-600 text-white border-blue-600 shadow-lg';
    }

    const confidenceLevel = confidence || 1;
    if (confidenceLevel >= 0.8) {
      return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
    } else if (confidenceLevel >= 0.6) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
    } else {
      return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
    }
  };

  const getConfidenceIndicator = () => {
    if (!confidence) return null;
    
    const level = Math.round(confidence * 100);
    return (
      <div className="text-xs opacity-75">
        {level}%
      </div>
    );
  };

  return (
    <motion.button
      whileHover={available && !disabled ? { scale: 1.02 } : {}}
      whileTap={available && !disabled ? { scale: 0.98 } : {}}
      onClick={handleClick}
      disabled={disabled || !available}
      className={`
        relative p-3 rounded-lg border-2 transition-all duration-200 text-center
        min-h-[60px] flex flex-col justify-center items-center
        ${getSlotStyle()}
      `}
      title={conflictReason || `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`}
    >
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span className="font-medium text-sm">
          {format(start, 'h:mm a')}
        </span>
      </div>
      
      {getConfidenceIndicator()}
      
      {!available && conflictReason && (
        <div className="absolute -top-1 -right-1">
          <AlertCircle className="w-4 h-4 text-red-500" />
        </div>
      )}
      
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full"
        />
      )}
    </motion.button>
  );
};

export default TimeSlot; 