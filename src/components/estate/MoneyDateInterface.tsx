'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Heart, TrendingUp, Target, Shield, Sparkles, ChevronRight, Play, Pause } from 'lucide-react';

interface MoneyDateSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'alignment' | 'planning' | 'reflection' | 'celebration';
  difficulty: 'gentle' | 'intimate' | 'deep';
  prompts: string[];
  outcomes: string[];
}

interface DateProgress {
  currentPrompt: number;
  totalPrompts: number;
  timeElapsed: number;
  responses: Record<string, string>;
}

export default function MoneyDateInterface() {
  const [activeSession, setActiveSession] = useState<MoneyDateSession | null>(null);
  const [progress, setProgress] = useState<DateProgress>({
    currentPrompt: 0,
    totalPrompts: 0,
    timeElapsed: 0,
    responses: {}
  });
  const [isActive, setIsActive] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const sessions: MoneyDateSession[] = [
    {
      id: 'weekly-alignment',
      title: 'Weekly Alignment Ritual',
      description: 'A gentle check-in to synchronize your financial energy and intentions',
      duration: 20,
      category: 'alignment',
      difficulty: 'gentle',
      prompts: [
        'How are you feeling about our financial choices this week?',
        'What money decision are you most proud of recently?',
        'Is there any financial anxiety you\'d like to share?',
        'What would financial peace look like for us this month?'
      ],
      outcomes: [
        'Increased emotional intimacy around money',
        'Clearer understanding of current financial feelings',
        'Shared commitment to upcoming decisions'
      ]
    },
    {
      id: 'future-visioning',
      title: 'Legacy Visioning Session',
      description: 'Design your shared future with intention and precise planning',
      duration: 45,
      category: 'planning',
      difficulty: 'deep',
      prompts: [
        'Where do you see us financially in 5 years?',
        'What legacy do we want to create together?',
        'How will we know we\'ve succeeded in building wealth?',
        'What financial fears do we need to address together?',
        'How can we support each other\'s money goals?'
      ],
      outcomes: [
        'Shared vision for financial future',
        'Clarity on individual and couple goals',
        'Commitment to mutual support'
      ]
    },
    {
      id: 'monthly-reflection',
      title: 'Monthly Reflection Ritual',
      description: 'Celebrate progress and realign for the month ahead',
      duration: 30,
      category: 'reflection',
      difficulty: 'intimate',
      prompts: [
        'What financial wins should we celebrate from this month?',
        'Where did we struggle and how can we support each other?',
        'What money pattern are we ready to upgrade?',
        'How has our relationship with money evolved lately?'
      ],
      outcomes: [
        'Recognition of progress and growth',
        'Identification of improvement areas',
        'Renewed commitment to financial intimacy'
      ]
    }
  ];

  const startSession = (session: MoneyDateSession) => {
    setActiveSession(session);
    setProgress({
      currentPrompt: 0,
      totalPrompts: session.prompts.length,
      timeElapsed: 0,
      responses: {}
    });
    setIsActive(true);
    setCurrentResponse('');
  };

  const nextPrompt = () => {
    if (activeSession && progress.currentPrompt < activeSession.prompts.length - 1) {
      setProgress(prev => ({
        ...prev,
        currentPrompt: prev.currentPrompt + 1,
        responses: {
          ...prev.responses,
          [prev.currentPrompt]: currentResponse
        }
      }));
      setCurrentResponse('');
    }
  };

  const completeSession = () => {
    // Handle session completion
    setActiveSession(null);
    setIsActive(false);
    setProgress({
      currentPrompt: 0,
      totalPrompts: 0,
      timeElapsed: 0,
      responses: {}
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'gentle': return 'text-[var(--sage-green)]';
      case 'intimate': return 'text-[var(--old-gold)]';
      case 'deep': return 'text-[var(--estate-navy)]';
      default: return 'text-[var(--charcoal)]';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'alignment': return Heart;
      case 'planning': return Target;
      case 'reflection': return TrendingUp;
      case 'celebration': return Sparkles;
      default: return Heart;
    }
  };

  if (activeSession) {
    const currentPrompt = activeSession.prompts[progress.currentPrompt];
    const progressPercentage = ((progress.currentPrompt + 1) / activeSession.prompts.length) * 100;

    return (
      <div className="layout-estate min-h-screen flex items-center justify-center">
        <div className="container-estate max-w-4xl">
          <div className="card-vault">
            {/* Session Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-legacy mb-1">{activeSession.title}</h2>
                <p className="text-whisper">
                  Question {progress.currentPrompt + 1} of {activeSession.prompts.length}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-whisper">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(progress.timeElapsed / 60)}:{(progress.timeElapsed % 60).toString().padStart(2, '0')}</span>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="btn-ghost p-2"
                >
                  {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-estate mb-8">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Current Prompt */}
            <div className="mb-8">
              <h3 className="text-manor mb-4 text-center">{currentPrompt}</h3>
              <div className="text-center mb-6">
                <p className="text-whisper max-w-2xl mx-auto">
                  Take your time. This is a sacred space for honest, loving conversation about your shared financial future.
                </p>
              </div>
            </div>

            {/* Response Area */}
            <div className="mb-8">
              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                placeholder="Share your thoughts, feelings, and insights..."
                className="input-estate min-h-32 resize-none"
                rows={4}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSession(null)}
                className="btn-ghost"
              >
                Pause Session
              </button>
              
              <div className="flex items-center space-x-4">
                {progress.currentPrompt < activeSession.prompts.length - 1 ? (
                  <button
                    onClick={nextPrompt}
                    disabled={!currentResponse.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Question
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={completeSession}
                    className="btn-gold"
                  >
                    Complete Session
                    <Sparkles className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-estate min-h-screen">
      <div className="container-estate py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-estate mb-4">Money Date Rituals</h1>
          <p className="text-intimate max-w-3xl mx-auto">
            Transform financial conversations into moments of deep connection and shared vision. 
            Each ritual is designed to build intimacy, alignment, and trust around your financial future.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-estate text-center">
            <div className="w-12 h-12 bg-[var(--sage-green)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-[var(--sage-green)]" />
            </div>
            <div className="text-legacy text-[var(--estate-navy)] mb-1">8</div>
            <div className="text-whisper">Sessions Completed</div>
          </div>
          
          <div className="card-estate text-center">
            <div className="w-12 h-12 bg-[var(--old-gold)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-[var(--old-gold)]" />
            </div>
            <div className="text-legacy text-[var(--estate-navy)] mb-1">92%</div>
            <div className="text-whisper">Intimacy Score</div>
          </div>
          
          <div className="card-estate text-center">
            <div className="w-12 h-12 bg-[var(--estate-navy)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-[var(--estate-navy)]" />
            </div>
            <div className="text-legacy text-[var(--estate-navy)] mb-1">5.2h</div>
            <div className="text-whisper">Quality Time</div>
          </div>
        </div>

        {/* Session Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session) => {
            const CategoryIcon = getCategoryIcon(session.category);
            return (
              <div key={session.id} className="card-intimate hover-estate group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[var(--estate-navy)]/10 rounded-xl flex items-center justify-center">
                    <CategoryIcon className="w-6 h-6 text-[var(--estate-navy)]" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[var(--charcoal)]/60" />
                    <span className="text-whisper">{session.duration}min</span>
                  </div>
                </div>

                <h3 className="text-legacy mb-2">{session.title}</h3>
                <p className="text-intimate mb-4">{session.description}</p>

                <div className="flex items-center justify-between mb-6">
                  <div className={`text-sm font-medium ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                  </div>
                  <div className="badge-legacy">{session.prompts.length} questions</div>
                </div>

                <div className="mb-6">
                  <h4 className="text-vault mb-2">You'll explore:</h4>
                  <ul className="space-y-1">
                    {session.outcomes.map((outcome, index) => (
                      <li key={index} className="text-whisper text-sm flex items-center">
                        <div className="w-1 h-1 bg-[var(--estate-navy)] rounded-full mr-2" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => startSession(session)}
                  className="btn-primary w-full group-hover:bg-[var(--old-gold)] transition-colors duration-200"
                >
                  Begin Ritual
                  <Play className="w-4 h-4 ml-2" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 