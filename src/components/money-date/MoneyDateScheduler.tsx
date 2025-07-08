'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Plus, Settings } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isAfter, isBefore } from 'date-fns';
import { 
  MoneyDateSession, 
  TimeSlot, 
  CalendarEvent, 
  CreateSessionRequest,
  SchedulingSuggestion,
  CalendarIntegration 
} from '@/lib/types/money-date';
import Button from '@/components/ui/Button';
import TimeSlotComponent from '@/components/ui/TimeSlot';

interface MoneyDateSchedulerProps {
  coupleId: string;
  onSessionCreated?: (session: MoneyDateSession) => void;
  onSessionUpdated?: (session: MoneyDateSession) => void;
}

// Mock hooks for now - these will be implemented later
const useMoneyDateScheduler = (coupleId: string) => ({
  sessions: [] as MoneyDateSession[],
  loading: false,
  error: null as string | null,
  createSession: async (data: CreateSessionRequest): Promise<MoneyDateSession> => {
    // Mock implementation
    console.log('Creating session:', data);
    return {
      id: '1',
      couple_id: coupleId,
      scheduled_date: data.scheduled_date,
      duration_minutes: data.duration_minutes || 15,
      status: 'scheduled' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },
  updateSession: async (id: string, data: any): Promise<MoneyDateSession> => {
    console.log('Updating session:', id, data);
    return {} as MoneyDateSession;
  },
  deleteSession: async (id: string): Promise<void> => {
    console.log('Deleting session:', id);
  },
  getAvailableSlots: async (date: Date): Promise<TimeSlot[]> => {
    console.log('Getting available slots for:', date);
    return [];
  },
  getSuggestions: async (): Promise<SchedulingSuggestion[]> => {
    console.log('Getting suggestions');
    return [];
  }
});

const useCalendarIntegration = () => ({
  integrations: [] as CalendarIntegration[],
  isConnected: false,
  syncCalendar: async (): Promise<void> => {
    console.log('Syncing calendar');
  },
  connectCalendar: async (provider: string): Promise<void> => {
    console.log('Connecting to calendar:', provider);
  },
  getCalendarEvents: async (start: Date, end: Date): Promise<CalendarEvent[]> => {
    console.log('Getting calendar events:', start, end);
    return [];
  }
});

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

const MoneyDateScheduler: React.FC<MoneyDateSchedulerProps> = ({
  coupleId,
  onSessionCreated,
  onSessionUpdated
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('19:00');
  const [duration, setDuration] = useState<number>(15);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly'>('weekly');
  const [sessionTopics, setSessionTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState<string>('');
  const [viewMode, setViewMode] = useState<'calendar' | 'suggestions'>('calendar');
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);

  const {
    sessions,
    loading,
    error,
    createSession,
    updateSession,
    getAvailableSlots,
    getSuggestions
  } = useMoneyDateScheduler(coupleId);

  const {
    integrations,
    isConnected,
    syncCalendar,
    connectCalendar,
    getCalendarEvents
  } = useCalendarIntegration();

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [suggestions, setSuggestions] = useState<SchedulingSuggestion[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Get current week dates
  const weekStart = startOfWeek(selectedDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Load available slots for selected date
  const loadAvailableSlots = useCallback(async () => {
    if (selectedDate) {
      try {
        const slots = await getAvailableSlots(selectedDate);
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Failed to load available slots:', err);
      }
    }
  }, [selectedDate, getAvailableSlots]);

  // Load scheduling suggestions
  const loadSuggestions = useCallback(async () => {
    try {
      const suggestions = await getSuggestions();
      setSuggestions(suggestions);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  }, [getSuggestions]);

  // Load calendar events
  const loadCalendarEvents = useCallback(async () => {
    if (isConnected) {
      try {
        const events = await getCalendarEvents(weekStart, endOfWeek(selectedDate));
        setCalendarEvents(events);
      } catch (err) {
        console.error('Failed to load calendar events:', err);
      }
    }
  }, [isConnected, weekStart, selectedDate, getCalendarEvents]);

  useEffect(() => {
    loadAvailableSlots();
  }, [loadAvailableSlots]);

  useEffect(() => {
    if (viewMode === 'suggestions') {
      loadSuggestions();
    }
  }, [viewMode, loadSuggestions]);

  useEffect(() => {
    loadCalendarEvents();
  }, [loadCalendarEvents]);

  // Add topic to session
  const addTopic = () => {
    if (newTopic.trim() && !sessionTopics.includes(newTopic.trim())) {
      setSessionTopics([...sessionTopics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  // Remove topic from session
  const removeTopic = (topic: string) => {
    setSessionTopics(sessionTopics.filter(t => t !== topic));
  };

  // Create new session
  const handleCreateSession = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsCreating(true);
    try {
      const [hours, minutes] = selectedTime.split(':');
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const sessionData: CreateSessionRequest = {
        couple_id: coupleId,
        scheduled_date: scheduledDate.toISOString(),
        duration_minutes: duration,
        session_topics: sessionTopics.length > 0 ? sessionTopics : undefined,
        recurring: isRecurring ? {
          frequency,
          day_of_week: scheduledDate.getDay()
        } : undefined
      };

      const newSession = await createSession(sessionData);
      
      if (onSessionCreated) {
        onSessionCreated(newSession);
      }

      // Reset form
      setSessionTopics([]);
      setIsRecurring(false);
      setShowTimeSlots(false);
      
      // Reload data
      await loadAvailableSlots();
      await loadCalendarEvents();

    } catch (err) {
      console.error('Failed to create session:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Accept scheduling suggestion
  const acceptSuggestion = async (suggestion: SchedulingSuggestion) => {
    try {
      const sessionData: CreateSessionRequest = {
        couple_id: coupleId,
        scheduled_date: suggestion.suggested_date,
        duration_minutes: duration
      };

      const newSession = await createSession(sessionData);
      
      if (onSessionCreated) {
        onSessionCreated(newSession);
      }

      await loadSuggestions();
      await loadAvailableSlots();
    } catch (err) {
      console.error('Failed to accept suggestion:', err);
    }
  };

  // Sync with calendar provider
  const handleSyncCalendar = async () => {
    try {
      await syncCalendar();
      await loadCalendarEvents();
    } catch (err) {
      console.error('Failed to sync calendar:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Money Date Scheduler</h1>
          <p className="text-gray-600 mt-1">Schedule regular financial conversations with your partner</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'outline'}
            onClick={() => setViewMode('calendar')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </Button>
          <Button
            variant={viewMode === 'suggestions' ? 'primary' : 'outline'}
            onClick={() => setViewMode('suggestions')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Suggestions
          </Button>
          {isConnected && (
            <Button
              variant="outline"
              onClick={handleSyncCalendar}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Sync
            </Button>
          )}
        </div>
      </div>

      {/* Calendar Integration Status */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Connect Your Calendar</h3>
              <p className="text-blue-700 text-sm">
                Sync with Google Calendar or Apple Calendar to avoid scheduling conflicts
              </p>
            </div>
            <Button onClick={() => connectCalendar('google')}>
              Connect Calendar
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar/Suggestions View */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {viewMode === 'calendar' ? (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Week of {format(weekStart, 'MMM d, yyyy')}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {DAYS_OF_WEEK.map((day, index) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                      {day}
                    </div>
                  ))}
                  {weekDates.map((date, index) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    const isPast = isBefore(date, new Date()) && !isToday;
                    const hasSession = sessions.some(session => 
                      isSameDay(new Date(session.scheduled_date), date)
                    );

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        disabled={isPast}
                        className={`
                          p-3 rounded-lg text-center transition-all duration-200
                          ${isSelected 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : isToday
                              ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                              : isPast
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-100 text-gray-700'
                          }
                          ${hasSession && !isSelected ? 'ring-2 ring-green-400' : ''}
                        `}
                      >
                        <div className="font-medium">{format(date, 'd')}</div>
                        {hasSession && (
                          <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots for Selected Date */}
                {showTimeSlots && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t pt-4"
                  >
                    <h3 className="font-medium mb-3">
                      Available times for {format(selectedDate, 'EEEE, MMM d')}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {availableSlots.map((slot, index) => (
                        <TimeSlotComponent
                          key={index}
                          timeSlot={slot}
                          isSelected={selectedTime === format(slot.start, 'HH:mm')}
                          onClick={() => setSelectedTime(format(slot.start, 'HH:mm'))}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Calendar Events */}
                {calendarEvents.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3">Existing Events</h3>
                    <div className="space-y-2">
                      {calendarEvents
                        .filter(event => isSameDay(event.start, selectedDate))
                        .map((event, index) => (
                          <div
                            key={index}
                            className={`
                              flex items-center justify-between p-2 rounded border
                              ${event.isMoneyDate 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-gray-50 border-gray-200'
                              }
                            `}
                          >
                            <div>
                              <div className="font-medium text-sm">{event.title}</div>
                              <div className="text-xs text-gray-600">
                                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                              </div>
                            </div>
                            {event.isMoneyDate && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Money Date
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-6">AI-Powered Suggestions</h2>
                
                {suggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No suggestions available at the moment.</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Schedule a few sessions to help our AI learn your preferences.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium">
                              {format(new Date(suggestion.suggested_date), 'EEEE, MMM d')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {format(new Date(suggestion.suggested_date), 'h:mm a')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600">
                              {Math.round(suggestion.confidence_score * 100)}% confidence
                            </div>
                            <Button
                              size="sm"
                              onClick={() => acceptSuggestion(suggestion)}
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                        
                        {suggestion.reasoning && (
                          <p className="text-sm text-gray-600 mb-3">{suggestion.reasoning}</p>
                        )}
                        
                        {suggestion.factors && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(suggestion.factors).map(([key, value]) => (
                              <span
                                key={key}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                              >
                                {key.replace('_', ' ')}: {Math.round((value as number) * 100)}%
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Session Creation Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Schedule New Session</h3>
            
            <div className="space-y-4">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Date
                </label>
                <div className="text-sm text-gray-600">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TIME_SLOTS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTimeSlots(!showTimeSlots)}
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              {/* Session Topics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discussion Topics (Optional)
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                      placeholder="Add a topic..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addTopic}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {sessionTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sessionTopics.map((topic, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                        >
                          {topic}
                          <button
                            onClick={() => removeTopic(topic)}
                            className="hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recurring Options */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Make this recurring
                  </span>
                </label>
                
                {isRecurring && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </motion.div>
                )}
              </div>

              {/* Create Button */}
              <Button
                onClick={handleCreateSession}
                disabled={isCreating || loading}
                className="w-full"
              >
                {isCreating ? 'Creating...' : 'Schedule Money Date'}
              </Button>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
            
            {sessions.length === 0 ? (
              <p className="text-gray-600 text-sm">No upcoming sessions scheduled.</p>
            ) : (
              <div className="space-y-3">
                {sessions
                  .filter(session => 
                    isAfter(new Date(session.scheduled_date), new Date()) ||
                    isSameDay(new Date(session.scheduled_date), new Date())
                  )
                  .slice(0, 5)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {format(new Date(session.scheduled_date), 'MMM d')}
                        </div>
                        <div className="text-xs text-gray-600">
                          {format(new Date(session.scheduled_date), 'h:mm a')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600">
                          {session.duration_minutes}m
                        </div>
                        <div className={`
                          text-xs px-2 py-1 rounded
                          ${session.status === 'scheduled' 
                            ? 'bg-blue-100 text-blue-800'
                            : session.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        `}>
                          {session.status}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p className="text-red-700">{error}</p>
        </motion.div>
      )}
    </div>
  );
};

export default MoneyDateScheduler; 