// Alignment Score Types
export interface AlignmentScore {
  id: string;
  couple_id: string;
  current_score: number; // 0-100
  previous_score?: number;
  score_history: ScoreHistoryEntry[];
  last_updated: string;
  factors: ScoreFactors;
  trend: 'improving' | 'stable' | 'declining';
  next_milestone?: Milestone;
  created_at: string;
  updated_at: string;
}

export interface ScoreHistoryEntry {
  date: string; // ISO 8601
  score: number; // 0-100
  change: number; // +/- change from previous
  session_id?: string; // If score change was from a session
  trigger: 'session_completion' | 'manual_update' | 'streak_bonus' | 'milestone_achievement';
  factors?: Partial<ScoreFactors>;
}

export interface ScoreFactors {
  communication_alignment: number; // 0-100
  financial_values_match: number; // 0-100
  goal_compatibility: number; // 0-100
  spending_harmony: number; // 0-100
  future_planning_sync: number; // 0-100
  conflict_resolution: number; // 0-100
  transparency_level: number; // 0-100
  session_consistency: number; // 0-100 (based on streaks)
}

export interface ScoreWeights {
  communication_alignment: number; // 0-1
  financial_values_match: number; // 0-1
  goal_compatibility: number; // 0-1
  spending_harmony: number; // 0-1
  future_planning_sync: number; // 0-1
  conflict_resolution: number; // 0-1
  transparency_level: number; // 0-1
  session_consistency: number; // 0-1
}

// Streak System Types
export interface StreakData {
  id: string;
  couple_id: string;
  current_streak: number; // consecutive days/sessions
  longest_streak: number;
  total_sessions: number;
  last_session_date?: string;
  streak_type: 'daily' | 'weekly' | 'session_based';
  grace_period_used: boolean;
  grace_period_expires?: string;
  streak_frozen_until?: string; // vacation mode
  milestone_progress: StreakMilestone[];
  created_at: string;
  updated_at: string;
}

export interface StreakMilestone {
  target: number; // 7, 30, 100 days
  achieved: boolean;
  achieved_date?: string;
  reward_claimed: boolean;
  badge_id?: string;
}

// Achievement & Badge System
export interface Achievement {
  id: string;
  type: 'alignment_score' | 'streak' | 'session_count' | 'improvement' | 'special';
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: AchievementCriteria;
  reward?: AchievementReward;
  created_at: string;
}

export interface AchievementCriteria {
  score_threshold?: number;
  streak_target?: number;
  session_count?: number;
  improvement_amount?: number;
  time_period?: number; // days
  special_condition?: string;
}

export interface AchievementReward {
  type: 'badge' | 'score_boost' | 'streak_protection' | 'premium_feature';
  value?: number;
  duration_days?: number;
  description: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_date: string;
  progress?: number; // 0-100 for partial progress
  claimed: boolean;
  claimed_date?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlock_criteria: {
    type: 'streak' | 'score' | 'session_count' | 'improvement';
    value: number;
  };
  unlocked: boolean;
  unlocked_date?: string;
  reward_type: 'badge' | 'score_bonus' | 'premium_feature';
  celebration_message?: string;
}

// Milestone System
export interface Milestone {
  id: string;
  type: 'score' | 'streak' | 'session' | 'improvement';
  target_value: number;
  current_progress: number;
  title: string;
  description: string;
  reward_description: string;
  estimated_completion?: string; // Based on current progress
  celebration_message: string;
}

// Animation & UI Types
export interface ScoreAnimation {
  type: 'score_increase' | 'score_decrease' | 'milestone_reached' | 'streak_achievement';
  from_value: number;
  to_value: number;
  duration: number; // milliseconds
  celebration?: CelebrationConfig;
}

export interface CelebrationConfig {
  type: 'confetti' | 'fireworks' | 'bounce' | 'glow';
  intensity: 'low' | 'medium' | 'high';
  duration: number;
  colors?: string[];
  message?: string;
}

export interface StreakFlameConfig {
  intensity: number; // Based on streak length
  color: string;
  animation_speed: number;
  particle_count: number;
  glow_radius: number;
}

// Scoring Algorithm Types
export interface ScoringSession {
  session_id: string;
  responses: SessionResponse[];
  completion_bonus: number;
  time_bonus: number;
  consistency_bonus: number;
  total_points: number;
  factor_impacts: Partial<ScoreFactors>;
}

export interface SessionResponse {
  question_id: string;
  user_answer: any;
  partner_answer: any;
  compatibility_score: number; // 0-100 for this response pair
  weight: number; // Question importance weight
  category: keyof ScoreFactors;
}

export interface CompatibilityMatrix {
  [questionType: string]: {
    [answerCombination: string]: number; // compatibility score 0-100
  };
}

// Progress Tracking
export interface ProgressMetrics {
  score_velocity: number; // Points per week
  streak_momentum: number; // Current vs historical streak performance
  engagement_level: 'low' | 'medium' | 'high';
  next_milestone_eta: number; // days
  improvement_suggestions: ImprovementSuggestion[];
  partner_comparison: PartnerComparison;
}

export interface ImprovementSuggestion {
  category: keyof ScoreFactors;
  current_score: number;
  potential_gain: number;
  difficulty: 'easy' | 'medium' | 'hard';
  suggestion: string;
  action_items: string[];
}

export interface PartnerComparison {
  score_difference: number; // -100 to 100
  stronger_areas: (keyof ScoreFactors)[];
  growth_areas: (keyof ScoreFactors)[];
  sync_level: 'very_aligned' | 'mostly_aligned' | 'somewhat_aligned' | 'needs_work';
  encouragement_message: string;
}

// Notification & Engagement Types
export interface GamificationNotification {
  id: string;
  user_id: string;
  type: 'score_update' | 'milestone_reached' | 'streak_reminder' | 'improvement_tip';
  title: string;
  message: string;
  action_text?: string;
  action_url?: string;
  scheduled_for: string;
  sent: boolean;
  urgency: 'low' | 'medium' | 'high';
  personalization_data?: Record<string, any>;
}

// Analytics Types
export interface GamificationAnalytics {
  user_id: string;
  couple_id: string;
  score_correlation_retention: number;
  streak_impact_subscription: number;
  optimal_notification_times: string[]; // HH:MM format
  engagement_patterns: EngagementPattern[];
  conversion_events: ConversionEvent[];
}

export interface EngagementPattern {
  date_range: string;
  session_frequency: number;
  avg_score_gain: number;
  streak_sustainability: number;
  feature_usage: FeatureUsage;
}

export interface FeatureUsage {
  score_dashboard_views: number;
  streak_tracker_interactions: number;
  achievement_page_visits: number;
  milestone_celebrations: number;
  improvement_tip_clicks: number;
}

export interface ConversionEvent {
  event_type: 'trial_to_paid' | 'churn_prevention' | 'upsell';
  trigger_score: number;
  trigger_streak: number;
  context: string;
  success: boolean;
  timestamp: string;
}

// React Hook Types
export interface UseAlignmentScore {
  score: AlignmentScore | null;
  loading: boolean;
  error: string | null;
  updateScore: (sessionData: ScoringSession) => Promise<void>;
  recalculateScore: () => Promise<void>;
  getScoreHistory: (days?: number) => Promise<ScoreHistoryEntry[]>;
  getImprovementSuggestions: () => Promise<ImprovementSuggestion[]>;
}

export interface UseStreakTracker {
  streak: StreakData | null;
  loading: boolean;
  error: string | null;
  updateStreak: (sessionCompleted: boolean) => Promise<void>;
  useGracePeriod: () => Promise<void>;
  freezeStreak: (days: number) => Promise<void>;
  getStreakStats: () => Promise<StreakData>;
}

export interface UseGamification {
  alignmentScore: UseAlignmentScore;
  streakTracker: UseStreakTracker;
  achievements: UserAchievement[];
  milestones: Milestone[];
  loadingAchievements: boolean;
  claimAchievement: (achievementId: string) => Promise<void>;
  checkMilestones: () => Promise<Milestone[]>;
}

// Component Props Types
export interface AlignmentDashboardProps {
  coupleId: string;
  showAnimation?: boolean;
  compact?: boolean;
}

export interface StreakTrackerProps {
  coupleId: string;
  showFlameAnimation?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface ProgressAnimationsProps {
  scoreChange: ScoreAnimation;
  onComplete?: () => void;
}



export interface ScoreHistoryProps {
  coupleId: string;
  timeRange?: TimeRange;
  showTrends?: boolean;
  compact?: boolean;
}

export interface MilestoneRewardsProps {
  coupleId: string;
  showUnlocked?: boolean;
  showLocked?: boolean;
  compact?: boolean;
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

export interface ScoreTrend {
  direction: 'improving' | 'stable' | 'declining';
  magnitude: number;
  consistency: number;
  prediction: number;
} 