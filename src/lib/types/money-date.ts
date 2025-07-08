export interface MoneyDateSession {
  id: string;
  couple_id: string;
  scheduled_date: string; // ISO 8601
  duration_minutes: number;
  status: 'scheduled' | 'active' | 'completed' | 'missed' | 'rescheduled';
  completion_rate?: number; // 0.00 to 1.00
  notes?: string;
  session_topics?: string[];
  actual_start_time?: string;
  actual_end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface ReminderPreferences {
  id: string;
  user_id: string;
  sms_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  reminder_intervals: number[]; // minutes before
  quiet_hours_start?: string; // HH:MM format
  quiet_hours_end?: string; // HH:MM format
  timezone: string;
  escalation_enabled: boolean;
  partner_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarIntegration {
  id: string;
  user_id: string;
  provider: 'google' | 'apple' | 'outlook';
  access_token: string;
  refresh_token?: string;
  calendar_id?: string;
  sync_enabled: boolean;
  last_sync?: string;
  sync_errors?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  session_id?: string;
  user_id: string;
  type: 'sms' | 'email' | 'push';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  message?: string;
  scheduled_for: string;
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  created_at: string;
}

export type NotificationStatus = 'pending' | 'delivered' | 'failed' | 'cancelled';

export interface NotificationMessage {
  id: string;
  user_id: string;
  type: 'reminder' | 'session_start' | 'missed_session' | 'partner_update' | 'system';
  channel: 'sms' | 'email' | 'push';
  title: string;
  body: string;
  status: NotificationStatus;
  scheduled_for?: string; // ISO 8601
  sent_at?: string; // ISO 8601
  read_at?: string | null; // ISO 8601
  metadata?: Record<string, any>;
  created_at: string;
}

export interface SessionAnalytics {
  id: string;
  couple_id: string;
  session_id?: string;
  completion_streak: number;
  total_sessions: number;
  successful_sessions: number;
  average_duration?: number;
  preferred_time_slot?: string; // HH:MM format
  preferred_day_of_week?: number; // 0-6 (Sunday-Saturday)
  last_session_date?: string;
  next_suggested_date?: string;
  engagement_score?: number; // 0.00 to 1.00
  created_at: string;
  updated_at: string;
}

export interface SchedulingSuggestion {
  id: string;
  couple_id: string;
  suggested_date: string;
  suggested_time: string; // HH:MM format
  duration_minutes: number;
  confidence_score: number; // 0.00 to 1.00
  suggestion_type: 'optimal' | 'good' | 'available' | 'weather' | 'routine' | 'partner_sync';
  reasons: SuggestionReason[];
  weather_factor?: WeatherFactor;
  reasoning?: string;
  factors?: {
    calendar_conflicts?: number;
    historical_success?: number;
    partner_availability?: number;
    optimal_timing?: number;
    weather_factor?: number;
    stress_indicators?: number;
  };
  accepted?: boolean;
  created_at: string;
}

export interface SuggestionReason {
  type: 'historical_success' | 'calendar_analysis' | 'spending_patterns' | 'routine_match' | 'partner_availability' | 'energy_levels' | 'weekend_preference' | 'mutual_availability' | 'stress_levels';
  description: string;
  weight: number; // 0.0 to 1.0
}

export interface WeatherFactor {
  condition: 'clear' | 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  impact: 'positive' | 'neutral' | 'negative';
  description: string;
}

// Frontend component interfaces
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isMoneyDate?: boolean;
  status?: MoneyDateSession['status'];
  allDay?: boolean;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  conflictReason?: string;
  confidence?: number;
}

export interface NotificationPreference {
  type: 'sms' | 'email' | 'push';
  enabled: boolean;
  timing: number[]; // minutes before
}

export interface SessionProgress {
  sessionId: string;
  startTime: Date;
  currentTime: Date;
  duration: number; // planned duration in minutes
  isActive: boolean;
  progress: number; // 0-100 percentage
  canPause: boolean;
  canComplete: boolean;
}

export interface PartnerAvailability {
  partnerId: string;
  timeSlots: TimeSlot[];
  timezone: string;
  lastUpdated: Date;
}

export interface CalendarConflict {
  start: Date;
  end: Date;
  title: string;
  source: 'google' | 'apple' | 'outlook';
  canReschedule?: boolean;
}

// API Response types
export interface CreateSessionRequest {
  couple_id: string;
  scheduled_date: string;
  duration_minutes?: number;
  session_topics?: string[];
  recurring?: {
    frequency: 'weekly' | 'bi-weekly' | 'monthly';
    end_date?: string;
    day_of_week?: number;
  };
}

export interface UpdateSessionRequest {
  scheduled_date?: string;
  duration_minutes?: number;
  status?: MoneyDateSession['status'];
  notes?: string;
  completion_rate?: number;
  session_topics?: string[];
}

export interface ReminderScheduleRequest {
  session_id: string;
  user_id: string;
  custom_intervals?: number[];
  custom_message?: string;
}

export interface CalendarSyncRequest {
  provider: CalendarIntegration['provider'];
  authorization_code?: string;
  access_token?: string;
  refresh_token?: string;
  calendar_id?: string;
}

// Utility types
export type SessionStatus = MoneyDateSession['status'];
export type NotificationType = NotificationLog['type'];
export type CalendarProvider = CalendarIntegration['provider'];
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Hook return types
export interface UseMoneyDateScheduler {
  sessions: MoneyDateSession[];
  loading: boolean;
  error: string | null;
  createSession: (data: CreateSessionRequest) => Promise<MoneyDateSession>;
  updateSession: (id: string, data: UpdateSessionRequest) => Promise<MoneyDateSession>;
  deleteSession: (id: string) => Promise<void>;
  getAvailableSlots: (date: Date) => Promise<TimeSlot[]>;
  getSuggestions: () => Promise<SchedulingSuggestion[]>;
}

export interface UseSessionTracker {
  currentSession: MoneyDateSession | null;
  progress: SessionProgress | null;
  startSession: (sessionId: string) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  completeSession: (notes?: string, topics?: string[]) => Promise<void>;
  updateProgress: (progress: number) => void;
}

export interface UseNotifications {
  notifications: NotificationLog[];
  unreadCount: number;
  preferences: ReminderPreferences | null;
  updatePreferences: (data: Partial<ReminderPreferences>) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  scheduleReminder: (data: ReminderScheduleRequest) => Promise<void>;
}

// Form validation schemas (for use with zod or similar)
export interface SessionFormData {
  date: Date;
  time: string;
  duration: number;
  topics: string[];
  recurring: boolean;
  frequency?: 'weekly' | 'bi-weekly' | 'monthly';
  endDate?: Date;
}

export interface ReminderFormData {
  sms_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  reminder_intervals: number[];
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone: string;
  escalation_enabled: boolean;
  partner_notifications: boolean;
}

// Re-export content management types
export * from './content'; 