'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LockClosedIcon,
  LockOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
  KeyIcon,
  ChevronRightIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { ContentDeck, ContentCard, UserDeckProgress } from '@/lib/types/content';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ProgressiveUnlockProps {
  deck: ContentDeck;
  userProgress: UserDeckProgress;
  onCardUnlock: (cardId: string) => void;
  onCardSelect?: (card: ContentCard) => void;
}

interface UnlockCriteria {
  type: 'completion' | 'time' | 'sequence' | 'milestone' | 'premium';
  value?: number;
  description: string;
  metCondition?: boolean;
}

const ProgressiveUnlock: React.FC<ProgressiveUnlockProps> = ({
  deck,
  userProgress,
  onCardUnlock,
  onCardSelect
}) => {
  const [unlockedCards, setUnlockedCards] = useState<Set<string>>(new Set());
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null);

  useEffect(() => {
    evaluateUnlockCriteria();
  }, [deck, userProgress]);

  const evaluateUnlockCriteria = () => {
    if (!deck.cards) return;

    const newUnlockedCards = new Set<string>();
    const newPendingUnlocks: string[] = [];

    deck.cards.forEach((card, index) => {
      const isUnlocked = evaluateCardUnlock(card, index, userProgress);
      
      if (isUnlocked) {
        newUnlockedCards.add(card.id);
        
        if (!unlockedCards.has(card.id)) {
          newPendingUnlocks.push(card.id);
        }
      }
    });

    setUnlockedCards(newUnlockedCards);
    
    if (newPendingUnlocks.length > 0) {
      processPendingUnlocks(newPendingUnlocks);
    }
  };

  const processPendingUnlocks = async (pendingIds: string[]) => {
    for (const cardId of pendingIds) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowUnlockAnimation(cardId);
      onCardUnlock(cardId);
      
      setTimeout(() => {
        setShowUnlockAnimation(null);
      }, 2000);
    }
  };

  const evaluateCardUnlock = (card: ContentCard, index: number, progress: UserDeckProgress): boolean => {
    if (index === 0) return true;

    if (card.is_premium) {
      return false; // Implement subscription check
    }

    const criteria = parseUnlockCriteria(card.unlock_criteria);

    return criteria.every(criterion => {
      switch (criterion.type) {
        case 'completion':
          const requiredCompletions = criterion.value || 1;
          return progress.cards_completed >= index;

        case 'sequence':
          if (!deck.cards) return false;
          return progress.cards_completed > index - 1;

        case 'time':
          const requiredTime = criterion.value || 0;
          return progress.time_spent >= requiredTime;

        case 'milestone':
          const requiredPercentage = criterion.value || 0;
          return progress.completion_percentage >= requiredPercentage;

        default:
          return true;
      }
    });
  };

  const parseUnlockCriteria = (criteria: any): UnlockCriteria[] => {
    if (!criteria) {
      return [{ type: 'sequence', description: 'Complete the previous card' }];
    }

    if (Array.isArray(criteria)) {
      return criteria;
    }

    return [criteria];
  };

  const getUnlockProgress = (card: ContentCard, index: number): { met: number; total: number; criteria: UnlockCriteria[] } => {
    const criteria = parseUnlockCriteria(card.unlock_criteria);
    
    const evaluatedCriteria = criteria.map(criterion => ({
      ...criterion,
      metCondition: evaluateCardUnlock(card, index, userProgress)
    }));

    const metCount = evaluatedCriteria.filter(c => c.metCondition).length;

    return {
      met: metCount,
      total: criteria.length,
      criteria: evaluatedCriteria
    };
  };

  const getCardStatus = (card: ContentCard, index: number): 'locked' | 'unlocked' | 'completed' | 'current' => {
    if (!unlockedCards.has(card.id)) return 'locked';
    if (card.is_completed) return 'completed';
    if (index === userProgress.cards_completed) return 'current';
    return 'unlocked';
  };

  const getStatusIcon = (status: string, isAnimating: boolean) => {
    switch (status) {
      case 'locked':
        return <LockClosedIcon className="h-5 w-5 text-gray-400" />;
      case 'unlocked':
        return isAnimating ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <LockOpenIcon className="h-5 w-5 text-blue-500" />
          </motion.div>
        ) : (
          <PlayCircleIcon className="h-5 w-5 text-blue-500" />
        );
      case 'completed':
        return <CheckCircleSolidIcon className="h-5 w-5 text-green-500" />;
      case 'current':
        return <PlayCircleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'locked':
        return 'border-gray-200 bg-gray-50 opacity-60';
      case 'unlocked':
        return 'border-blue-200 bg-blue-50 hover:border-blue-300 cursor-pointer';
      case 'completed':
        return 'border-green-200 bg-green-50 hover:border-green-300 cursor-pointer';
      case 'current':
        return 'border-orange-200 bg-orange-50 hover:border-orange-300 cursor-pointer ring-2 ring-orange-200';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleCardClick = (card: ContentCard, status: string) => {
    if (status === 'locked' || !onCardSelect) return;
    onCardSelect(card);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Deck Progress</h3>
          <div className="flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              {userProgress.cards_completed} of {deck.card_count} completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${userProgress.completion_percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{userProgress.completion_percentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{Math.floor(userProgress.time_spent / 60)}</div>
            <div className="text-sm text-gray-600">Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{unlockedCards.size}</div>
            <div className="text-sm text-gray-600">Unlocked</div>
          </div>
        </div>
      </Card>

      {/* Card List */}
      <div className="space-y-3">
        {deck.cards?.map((card, index) => {
          const status = getCardStatus(card, index);
          const isAnimating = showUnlockAnimation === card.id;
          const unlockProgress = getUnlockProgress(card, index);

          return (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div 
                className={`p-4 transition-all duration-200 relative ${getStatusColor(status)} ${
                  isAnimating ? 'ring-4 ring-blue-300 ring-opacity-50' : ''
                } rounded-lg border cursor-pointer`}
                onClick={() => handleCardClick(card, status)}
              >
                <div className="flex items-center space-x-4">
                  {/* Card Number & Status */}
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        status === 'locked' 
                          ? 'bg-gray-200 text-gray-500'
                          : status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : status === 'current'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {status === 'completed' ? '✓' : index + 1}
                      </div>
                      
                      <div className="absolute -top-1 -right-1">
                        {getStatusIcon(status, isAnimating)}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        status === 'locked' ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {status === 'locked' ? 'Locked Card' : card.title}
                      </h4>
                      
                      <div className="flex items-center space-x-2">
                        {card.estimated_time && (
                          <span className={`text-sm flex items-center ${
                            status === 'locked' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {card.estimated_time}m
                          </span>
                        )}
                        
                        {card.is_premium && (
                          <StarSolidIcon className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>

                    {/* Card Type & Description */}
                    <div className="mt-1">
                      <span className={`text-sm capitalize ${
                        status === 'locked' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {card.card_type.replace('-', ' ')}
                      </span>
                      
                      {status !== 'locked' && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {card.content.substring(0, 100)}...
                        </p>
                      )}
                    </div>

                    {/* Unlock Criteria (for locked cards) */}
                    {status === 'locked' && (
                      <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <KeyIcon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Unlock Requirements
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          {unlockProgress.criteria.map((criterion, i) => (
                            <div key={i} className="flex items-center space-x-2 text-sm">
                              {criterion.metCondition ? (
                                <CheckCircleSolidIcon className="h-4 w-4 text-green-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                              )}
                              <span className={criterion.metCondition ? 'text-green-700' : 'text-gray-600'}>
                                {criterion.description}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          {unlockProgress.met} of {unlockProgress.total} requirements met
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Arrow */}
                  {status !== 'locked' && (
                    <div className="flex-shrink-0">
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Unlock Animation */}
                <AnimatePresence>
                  {isAnimating && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-12 h-12 mx-auto mb-2"
                        >
                          <LockOpenIcon className="h-12 w-12 text-blue-500" />
                        </motion.div>
                        <p className="text-sm font-medium text-blue-600">Card Unlocked!</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Milestone Celebrations */}
      {userProgress.completion_percentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Deck Completed! 🎉
          </h3>
          <p className="text-gray-600">
            Congratulations on completing {deck.title}!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressiveUnlock; 