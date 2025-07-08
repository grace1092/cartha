'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Clock, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { format, differenceInSeconds, addMinutes } from 'date-fns';
import { MoneyDateSession, SessionProgress } from '@/lib/types/money-date';
import Button from '@/components/ui/Button';
import Timer from '@/components/ui/Timer';
import Confetti from '@/components/ui/Confetti';

interface SessionTrackerProps {
  session: MoneyDateSession;
  onSessionComplete?: (notes?: string, topics?: string[]) => void;
  onSessionUpdate?: (session: MoneyDateSession) => void;
  onEmergencyPause?: () => void;
}

const MINIMUM_SESSION_DURATION = 5; // minutes
const PROGRESS_MILESTONES = [25, 50, 75, 90]; // percentage milestones for celebrations

const SessionTracker: React.FC<SessionTrackerProps> = ({
  session,
  onSessionComplete,
  onSessionUpdate,
  onEmergencyPause
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState<number>(0); // accumulated paused time in seconds
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [notes, setNotes] = useState<string>('');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [showCompletionForm, setShowCompletionForm] = useState<boolean>(false);
  const [milestonesCelebrated, setMilestonesCelebrated] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseStartRef = useRef<Date | null>(null);

  // Calculate progress and time remaining
  const progress = useCallback((): SessionProgress | null => {
    if (!isActive || !startTime) return null;

    const now = new Date();
    const elapsed = differenceInSeconds(now, startTime) - pausedTime;
    const totalDuration = session.duration_minutes * 60;
    const progressPercentage = Math.min((elapsed / totalDuration) * 100, 100);
    const plannedEndTime = addMinutes(startTime, session.duration_minutes);

    return {
      sessionId: session.id,
      startTime,
      currentTime: now,
      duration: session.duration_minutes,
      isActive: isActive && !isPaused,
      progress: progressPercentage,
      canPause: elapsed >= 60, // Can pause after 1 minute
      canComplete: elapsed >= MINIMUM_SESSION_DURATION * 60 // Can complete after minimum duration
    };
  }, [isActive, startTime, pausedTime, session.duration_minutes, session.id, isPaused]);

  // Update timer every second
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  // Check for milestone celebrations
  useEffect(() => {
    const currentProgress = progress();
    if (currentProgress && isActive && !isPaused) {
      const progressPercent = Math.floor(currentProgress.progress);
      
      for (const milestone of PROGRESS_MILESTONES) {
        if (progressPercent >= milestone && !milestonesCelebrated.includes(milestone)) {
          setMilestonesCelebrated(prev => [...prev, milestone]);
          
          // Show brief confetti for milestones
          if (milestone !== 90) { // Save big confetti for completion
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
          }
        }
      }
    }
  }, [progress, isActive, isPaused, milestonesCelebrated]);

  // Auto-complete when time is up
  useEffect(() => {
    const currentProgress = progress();
    if (currentProgress && currentProgress.progress >= 100 && isActive) {
      handleAutoComplete();
    }
  }, [progress, isActive]);

  const startSession = () => {
    const now = new Date();
    setStartTime(now);
    setIsActive(true);
    setIsPaused(false);
    setPausedTime(0);
    setMilestonesCelebrated([]);
    
    // Update session status to active
    if (onSessionUpdate) {
      onSessionUpdate({
        ...session,
        status: 'active',
        actual_start_time: now.toISOString()
      });
    }
  };

  const pauseSession = () => {
    if (isActive && !isPaused) {
      setIsPaused(true);
      pauseStartRef.current = new Date();
      
      if (onEmergencyPause) {
        onEmergencyPause();
      }
    }
  };

  const resumeSession = () => {
    if (isPaused && pauseStartRef.current) {
      const pauseDuration = differenceInSeconds(new Date(), pauseStartRef.current);
      setPausedTime(prev => prev + pauseDuration);
      setIsPaused(false);
      pauseStartRef.current = null;
    }
  };

  const handleAutoComplete = () => {
    setShowCompletionForm(true);
  };

  const completeSession = () => {
    const endTime = new Date();
    const completionRate = Math.min(progress()?.progress || 0, 100) / 100;
    
    setIsActive(false);
    setIsPaused(false);
    
    // Show completion confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    
    if (onSessionComplete) {
      onSessionComplete(notes, completedTopics);
    }
    
    if (onSessionUpdate) {
      onSessionUpdate({
        ...session,
        status: 'completed',
        actual_end_time: endTime.toISOString(),
        completion_rate: completionRate,
        notes: notes || undefined,
        session_topics: completedTopics.length > 0 ? completedTopics : session.session_topics
      });
    }
    
    setShowCompletionForm(false);
  };

  const stopSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setStartTime(null);
    setPausedTime(0);
    
    if (onSessionUpdate) {
      onSessionUpdate({
        ...session,
        status: 'scheduled'
      });
    }
  };

  const toggleTopic = (topic: string) => {
    setCompletedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const currentProgress = progress();
  const sessionStatus = session.status;
  const isScheduledForNow = session.scheduled_date && 
    Math.abs(differenceInSeconds(new Date(), new Date(session.scheduled_date))) < 900; // Within 15 minutes

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {showConfetti && <Confetti active={true} />}
      
      {/* Session Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Money Date Session
            </h2>
            <p className="text-gray-600">
              Scheduled for {format(new Date(session.scheduled_date), 'EEEE, MMM d at h:mm a')}
            </p>
          </div>
          <div className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${sessionStatus === 'active' 
              ? 'bg-green-100 text-green-800'
              : sessionStatus === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }
          `}>
            {sessionStatus === 'active' ? (isPaused ? 'Paused' : 'Active') : sessionStatus}
          </div>
        </div>

        {/* Session Timer */}
        {(isActive || sessionStatus === 'active') && currentProgress && (
          <div className="mb-6">
            <Timer
              duration={session.duration_minutes}
              progress={currentProgress.progress}
              isActive={currentProgress.isActive}
              showMilliseconds={false}
            />
          </div>
        )}

        {/* Progress Bar */}
        {currentProgress && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round(currentProgress.progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Session Topics */}
        {session.session_topics && session.session_topics.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Discussion Topics</h3>
            <div className="space-y-2">
              {session.session_topics.map((topic, index) => (
                <motion.button
                  key={index}
                  onClick={() => toggleTopic(topic)}
                  disabled={!isActive}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-all duration-200
                    ${completedTopics.includes(topic)
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }
                    ${!isActive ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  `}
                  whileHover={isActive ? { scale: 1.01 } : {}}
                  whileTap={isActive ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center gap-3">
                    {completedTopics.includes(topic) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                    <span className="font-medium">{topic}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!isActive && sessionStatus !== 'completed' && (
            <Button
              onClick={startSession}
              disabled={!isScheduledForNow && sessionStatus !== 'scheduled'}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Session
            </Button>
          )}

          {isActive && !isPaused && (
            <>
              <Button
                variant="outline"
                onClick={pauseSession}
                disabled={!currentProgress?.canPause}
                className="flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              
              <Button
                variant="outline"
                onClick={handleAutoComplete}
                disabled={!currentProgress?.canComplete}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete
              </Button>
            </>
          )}

          {isActive && isPaused && (
            <>
              <Button
                onClick={resumeSession}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Resume
              </Button>
              
              <Button
                variant="outline"
                onClick={handleAutoComplete}
                disabled={!currentProgress?.canComplete}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete
              </Button>
            </>
          )}

          {isActive && (
            <Button
              variant="outline"
              onClick={stopSession}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>
          )}
        </div>

        {/* Warning for early start */}
        {!isScheduledForNow && sessionStatus === 'scheduled' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              This session is scheduled for later. You can start early, but consider waiting for the optimal time.
            </p>
          </motion.div>
        )}
      </div>

      {/* Completion Form Modal */}
      <AnimatePresence>
        {showCompletionForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Complete Your Money Date
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did the conversation go? Any key insights or decisions?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={completeSession}
                    className="flex-1"
                  >
                    Complete Session
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCompletionForm(false)}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Celebrations */}
      <AnimatePresence>
        {milestonesCelebrated.map((milestone) => (
          <motion.div
            key={milestone}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                {milestone}% Complete! Keep going! 🎉
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SessionTracker; 