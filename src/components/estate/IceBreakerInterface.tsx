'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Shield, Clock, ChevronRight, ThumbsUp, ThumbsDown, BarChart3, Sparkles, Coffee } from 'lucide-react';

interface ComfortLevel {
  level: number; // 1-10 scale
  feedback: string;
  timestamp: Date;
}

interface IceBreakerPrompt {
  id: string;
  text: string;
  category: 'values' | 'habits' | 'dreams' | 'concerns';
  difficulty: 1 | 2 | 3; // Progressive levels
  followUp?: string;
  context?: string;
}

interface UserResponse {
  promptId: string;
  response: string;
  comfortLevel: ComfortLevel;
  timeSpent: number;
}

export default function IceBreakerInterface() {
  const [currentPrompt, setCurrentPrompt] = useState<IceBreakerPrompt | null>(null);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [comfortLevel, setComfortLevel] = useState<number>(5);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const prompts: IceBreakerPrompt[] = [
    // Level 1: Gentle Values
    {
      id: 'values-1',
      text: 'What does financial security mean to you?',
      category: 'values',
      difficulty: 1,
      context: 'This is about your personal feelings, not right or wrong answers.',
      followUp: 'Take your time. There\'s no pressure to share more than feels comfortable.'
    },
    {
      id: 'habits-1',
      text: 'What\'s one money habit you\'re proud of?',
      category: 'habits',
      difficulty: 1,
      context: 'Everyone has different strengths with money. What\'s yours?'
    },
    
    // Level 2: Gentle Dreams
    {
      id: 'dreams-1',
      text: 'If money wasn\'t a concern, what would your ideal life look like?',
      category: 'dreams',
      difficulty: 2,
      context: 'Let yourself dream a little. This is about hopes, not specific plans.',
      followUp: 'Your partner will love hearing about your dreams.'
    },
    {
      id: 'values-2',
      text: 'What did your family teach you about money growing up?',
      category: 'values',
      difficulty: 2,
      context: 'Family influences are powerful. Understanding them helps us grow.'
    },
    
    // Level 3: Deeper Sharing
    {
      id: 'concerns-1',
      text: 'What\'s one financial worry that sometimes keeps you up at night?',
      category: 'concerns',
      difficulty: 3,
      context: 'Sharing worries with someone you trust can actually reduce their power over you.',
      followUp: 'You\'re being incredibly brave by sharing this.'
    }
  ];

  const [availablePrompts, setAvailablePrompts] = useState<IceBreakerPrompt[]>(
    prompts.filter(p => p.difficulty === 1)
  );
  const [completedPrompts, setCompletedPrompts] = useState<string[]>([]);

  useEffect(() => {
    // Start with first gentle prompt
    if (availablePrompts.length > 0 && !currentPrompt) {
      setCurrentPrompt(availablePrompts[0]);
    }
  }, [availablePrompts, currentPrompt]);

  const handleComfortChange = (level: number) => {
    setComfortLevel(level);
  };

  const getComfortColor = (level: number) => {
    if (level >= 8) return 'text-[var(--sage-green)]';
    if (level >= 6) return 'text-[var(--old-gold)]';
    if (level >= 4) return 'text-[var(--estate-navy)]';
    return 'text-[var(--charcoal)]';
  };

  const getComfortDescription = (level: number) => {
    if (level >= 8) return 'Very comfortable';
    if (level >= 6) return 'Comfortable';
    if (level >= 4) return 'Somewhat comfortable';
    return 'Taking it slow';
  };

  const submitResponse = async () => {
    if (!currentPrompt || !currentResponse.trim()) return;

    setIsProcessing(true);

    const response: UserResponse = {
      promptId: currentPrompt.id,
      response: currentResponse,
      comfortLevel: {
        level: comfortLevel,
        feedback: getComfortDescription(comfortLevel),
        timestamp: new Date()
      },
      timeSpent: 0 // Would track actual time in real implementation
    };

    setUserResponses(prev => [...prev, response]);
    setCompletedPrompts(prev => [...prev, currentPrompt.id]);

    // Adaptive progression based on comfort level
    setTimeout(() => {
      if (comfortLevel >= 7) {
        // User is comfortable, can progress to next difficulty level
        unlockNextLevel();
      } else if (comfortLevel >= 5) {
        // User is moderately comfortable, stay at current level
        showNextPromptSameLevel();
      } else {
        // User needs more support, offer encouragement and easier prompts
        showEncouragement();
      }
      
      setCurrentResponse('');
      setComfortLevel(5);
      setIsProcessing(false);
    }, 1000);
  };

  const unlockNextLevel = () => {
    const currentLevel = currentPrompt?.difficulty || 1;
    const nextLevel = Math.min(currentLevel + 1, 3);
    const nextPrompts = prompts.filter(
      p => p.difficulty === nextLevel && !completedPrompts.includes(p.id)
    );

    if (nextPrompts.length > 0) {
      setCurrentPrompt(nextPrompts[0]);
    } else {
      setSessionComplete(true);
    }
  };

  const showNextPromptSameLevel = () => {
    const currentLevel = currentPrompt?.difficulty || 1;
    const sameLevel = prompts.filter(
      p => p.difficulty === currentLevel && !completedPrompts.includes(p.id)
    );

    if (sameLevel.length > 0) {
      setCurrentPrompt(sameLevel[0]);
    } else {
      unlockNextLevel();
    }
  };

  const showEncouragement = () => {
    // In real implementation, would show supportive message and easier prompts
    showNextPromptSameLevel();
  };

  const skipPrompt = () => {
    setCompletedPrompts(prev => [...prev, currentPrompt!.id]);
    showNextPromptSameLevel();
  };

  if (sessionComplete) {
    return (
      <div className="layout-estate min-h-screen flex items-center justify-center">
        <div className="container-estate max-w-2xl">
          <div className="card-vault text-center">
            <div className="w-16 h-16 bg-[var(--sage-green)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-[var(--sage-green)]" />
            </div>
            <h2 className="text-legacy mb-4">Beautiful Progress</h2>
            <p className="text-intimate mb-6">
              You've taken meaningful steps toward financial intimacy. Your willingness to share and explore creates the foundation for deeper connection.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-vault text-[var(--sage-green)] mb-1">{userResponses.length}</div>
                <div className="text-whisper">Prompts Completed</div>
              </div>
              <div className="text-center">
                <div className="text-vault text-[var(--old-gold)] mb-1">
                  {Math.round(userResponses.reduce((acc, r) => acc + r.comfortLevel.level, 0) / userResponses.length)}
                </div>
                <div className="text-whisper">Average Comfort</div>
              </div>
              <div className="text-center">
                <div className="text-vault text-[var(--estate-navy)] mb-1">
                  {Math.max(...userResponses.map(r => r.comfortLevel.level))}
                </div>
                <div className="text-whisper">Peak Comfort</div>
              </div>
            </div>
            <button className="btn-primary">
              Share with Partner
              <Heart className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPrompt) {
    return (
      <div className="layout-estate min-h-screen flex items-center justify-center">
        <div className="container-estate max-w-2xl">
          <div className="card-estate text-center">
            <Coffee className="w-12 h-12 text-[var(--old-gold)] mx-auto mb-4" />
            <h2 className="text-legacy mb-4">Preparing Your Space</h2>
            <p className="text-intimate">Creating a comfortable environment for gentle financial conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-estate min-h-screen">
      <div className="container-estate py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-[var(--sage-green)]" />
            <h1 className="text-legacy">Gentle Financial Conversation</h1>
          </div>
          <p className="text-whisper max-w-2xl mx-auto">
            A safe space to explore your relationship with money at your own pace.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="card-estate mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-whisper">Your Progress</span>
            <span className="text-whisper">{completedPrompts.length} completed</span>
          </div>
          <div className="progress-estate">
            <div 
              className="progress-fill" 
              style={{ width: `${(completedPrompts.length / prompts.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Card */}
          <div className="lg:col-span-2">
            <div className="card-vault">
              {/* Prompt Header */}
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${
                  currentPrompt.difficulty === 1 ? 'bg-[var(--sage-green)]' :
                  currentPrompt.difficulty === 2 ? 'bg-[var(--old-gold)]' :
                  'bg-[var(--estate-navy)]'
                }`} />
                <span className="text-whisper capitalize">{currentPrompt.category}</span>
                <span className="text-whisper">•</span>
                <span className="text-whisper">
                  {currentPrompt.difficulty === 1 ? 'Gentle' :
                   currentPrompt.difficulty === 2 ? 'Deeper' : 'Personal'}
                </span>
              </div>

              {/* The Question */}
              <h2 className="text-manor mb-4">{currentPrompt.text}</h2>
              
              {/* Context */}
              {currentPrompt.context && (
                <p className="text-whisper italic mb-6 p-4 bg-[var(--estate-cream)] rounded-lg">
                  {currentPrompt.context}
                </p>
              )}

              {/* Response Area */}
              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                placeholder="Take your time... share whatever feels right for you."
                className="input-estate min-h-32 resize-none mb-6"
                rows={4}
              />

              {/* Comfort Level */}
              <div className="mb-6">
                <label className="text-vault mb-3 block">How comfortable do you feel with this question?</label>
                <div className="flex items-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleComfortChange(level)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        comfortLevel >= level
                          ? 'bg-[var(--old-gold)] border-[var(--old-gold)]'
                          : 'border-[var(--estate-navy)]/20 hover:border-[var(--estate-navy)]/40'
                      }`}
                    >
                      <span className="sr-only">{level}</span>
                    </button>
                  ))}
                </div>
                <div className={`text-sm ${getComfortColor(comfortLevel)}`}>
                  {getComfortDescription(comfortLevel)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={skipPrompt}
                  className="btn-ghost"
                >
                  Skip for now
                </button>
                
                <button
                  onClick={submitResponse}
                  disabled={!currentResponse.trim() || isProcessing}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Saving...' : 'Continue'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              {/* Follow-up encouragement */}
              {currentPrompt.followUp && currentResponse.trim() && (
                <div className="mt-6 p-4 bg-[var(--sage-green)]/10 rounded-lg border border-[var(--sage-green)]/20">
                  <p className="text-whisper text-sm">{currentPrompt.followUp}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Comfort Stats */}
            <div className="card-estate">
              <h3 className="text-vault mb-4">Your Comfort Journey</h3>
              {userResponses.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-whisper">Average Comfort</span>
                    <span className={`text-vault ${getComfortColor(
                      Math.round(userResponses.reduce((acc, r) => acc + r.comfortLevel.level, 0) / userResponses.length)
                    )}`}>
                      {Math.round(userResponses.reduce((acc, r) => acc + r.comfortLevel.level, 0) / userResponses.length)}/10
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-whisper">Growth</span>
                    <span className="text-vault text-[var(--sage-green)]">
                      +{Math.max(...userResponses.map(r => r.comfortLevel.level)) - Math.min(...userResponses.map(r => r.comfortLevel.level))}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-whisper">Your comfort levels will appear here as you progress.</p>
              )}
            </div>

            {/* Encouragement */}
            <div className="card-intimate">
              <h3 className="text-vault mb-3">Remember</h3>
              <ul className="space-y-2 text-whisper text-sm">
                <li className="flex items-start">
                  <Heart className="w-4 h-4 text-[var(--sage-green)] mt-0.5 mr-2 flex-shrink-0" />
                  You're in complete control of what you share
                </li>
                <li className="flex items-start">
                  <Shield className="w-4 h-4 text-[var(--old-gold)] mt-0.5 mr-2 flex-shrink-0" />
                  This is a judgment-free space
                </li>
                <li className="flex items-start">
                  <Clock className="w-4 h-4 text-[var(--estate-navy)] mt-0.5 mr-2 flex-shrink-0" />
                  Take all the time you need
                </li>
              </ul>
            </div>

            {/* Progress Celebration */}
            {completedPrompts.length > 0 && (
              <div className="card-estate border-[var(--sage-green)]/20">
                <h3 className="text-vault mb-3">Your Courage</h3>
                <p className="text-whisper text-sm mb-3">
                  You've completed {completedPrompts.length} conversation{completedPrompts.length !== 1 ? 's' : ''}. Each step builds trust and intimacy.
                </p>
                <div className="badge-milestone">Growing Stronger</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 