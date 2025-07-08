'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon,
  ShareIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  FlagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ContentCard, ContentDeck } from '@/lib/types/content';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface CardRendererProps {
  card: ContentCard;
  deck: ContentDeck;
  isPreview?: boolean;
  showProgress?: boolean;
  currentCardIndex?: number;
  totalCards?: number;
  onInteraction: (type: string, data?: any) => void;
  onComplete: () => void;
  onFavorite: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onShare?: () => void;
}

const CardRenderer: React.FC<CardRendererProps> = ({
  card,
  deck,
  isPreview = false,
  showProgress = true,
  currentCardIndex = 0,
  totalCards = 1,
  onInteraction,
  onComplete,
  onFavorite,
  onNext,
  onPrevious,
  onShare
}) => {
  const [isCompleted, setIsCompleted] = useState(card.is_completed || false);
  const [isFavorite, setIsFavorite] = useState(card.is_favorite || false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    // Estimate reading time based on content length
    const words = card.content.split(' ').length;
    const avgWordsPerMinute = 200;
    setReadingTime(Math.ceil(words / avgWordsPerMinute));
  }, [card.content]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPreview) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPreview]);

  useEffect(() => {
    // Track card view
    if (!isPreview) {
      onInteraction('viewed');
      setIsActive(true);
    }

    return () => setIsActive(false);
  }, [card.id, isPreview, onInteraction]);

  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      onInteraction('completed', { timeSpent, readingTime });
      onComplete();
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onInteraction(isFavorite ? 'unfavorited' : 'favorited');
    onFavorite();
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
      onInteraction('shared');
    }
  };

  const handleTextToSpeech = () => {
    if (!speechSynthesis) return;

    if (isTextToSpeechEnabled) {
      speechSynthesis.cancel();
      setIsTextToSpeechEnabled(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(card.content);
      utterance.rate = 0.8;
      utterance.onend = () => setIsTextToSpeechEnabled(false);
      speechSynthesis.speak(utterance);
      setIsTextToSpeechEnabled(true);
    }
  };

  const handleAddNote = () => {
    if (notes.trim()) {
      onInteraction('noted', { note: notes.trim() });
      setNotes('');
      setShowNotes(false);
    }
  };

  const getCardTypeIcon = () => {
    switch (card.card_type) {
      case 'conversation':
        return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
      case 'activity':
        return <PuzzlePieceIcon className="h-5 w-5" />;
      case 'reflection':
        return <LightBulbIcon className="h-5 w-5" />;
      case 'goal-setting':
        return <FlagIcon className="h-5 w-5" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
    }
  };

  const getCardTypeColor = () => {
    switch (card.card_type) {
      case 'conversation':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'activity':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'reflection':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'goal-setting':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      {showProgress && totalCards > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Card {currentCardIndex + 1} of {totalCards}</span>
            <span>{Math.round(((currentCardIndex + 1) / totalCards) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          {/* Card Header */}
          <div className={`px-6 py-4 border-b ${getCardTypeColor()}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getCardTypeIcon()}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {card.title}
                  </h2>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                    <span className="capitalize">{card.card_type.replace('-', ' ')}</span>
                    {card.estimated_time && (
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {card.estimated_time} min
                      </span>
                    )}
                    {card.difficulty_level && (
                      <span className="capitalize">{card.difficulty_level}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Text to Speech */}
                {speechSynthesis && (
                  <button
                    onClick={handleTextToSpeech}
                    className={`p-2 rounded-full transition-colors ${
                      isTextToSpeechEnabled 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isTextToSpeechEnabled ? (
                      <SpeakerXMarkIcon className="h-5 w-5" />
                    ) : (
                      <SpeakerWaveIcon className="h-5 w-5" />
                    )}
                  </button>
                )}

                {/* Favorite */}
                <button
                  onClick={handleFavorite}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </button>

                {/* Share */}
                {onShare && (
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-6 py-8">
            {/* Media */}
            {card.media_urls && card.media_urls.length > 0 && (
              <div className="mb-6">
                <img 
                  src={card.media_urls[0]} 
                  alt="Card illustration"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(card.content) }}
            />

            {/* Interactive Elements */}
            {card.interaction_data && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Discussion Prompts</h4>
                <div className="space-y-2">
                  {card.interaction_data.prompts?.map((prompt: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <p className="text-blue-800">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 py-4 bg-gray-50 border-t"
              >
                <h4 className="font-medium text-gray-900 mb-3">Add a Note</h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What insights or thoughts came up during this discussion?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-3">
                  <Button variant="outline" onClick={() => setShowNotes(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNote} disabled={!notes.trim()}>
                    Save Note
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Navigation */}
                <div className="flex items-center space-x-2">
                  {onPrevious && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPrevious}
                      className="flex items-center"
                    >
                      <ChevronLeftIcon className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  )}
                  
                  {onNext && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onNext}
                      className="flex items-center"
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Add Note Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  Add Note
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {/* Time Tracking */}
                {!isPreview && (
                  <div className="text-sm text-gray-500">
                    Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                  </div>
                )}

                {/* Completion Button */}
                <Button
                  onClick={handleComplete}
                  disabled={isCompleted}
                  className={`flex items-center ${
                    isCompleted 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : ''
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Deck Context */}
      {deck && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            From <span className="font-medium">{deck.title}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CardRenderer; 