export { default as AlignmentDashboard } from './AlignmentDashboard';
export { default as StreakTracker } from './StreakTracker';
export { default as ProgressAnimations } from './ProgressAnimations';
export { default as MilestoneRewards } from './MilestoneRewards';
export { default as ScoreHistory } from './ScoreHistory';

// Re-export types for convenience
export type {
  AlignmentScore,
  StreakData,
  ScoreHistoryEntry,
  Milestone,
  Achievement,
  Badge,
  ScoreFactors,
  ScoreWeights,
  ProgressMetrics,
  ImprovementSuggestion,
  ScoreTrend,
  TimeRange,
  AlignmentDashboardProps,
  StreakTrackerProps,
  ProgressAnimationsProps,
  MilestoneRewardsProps,
  ScoreHistoryProps
} from '@/lib/types/gamification'; 