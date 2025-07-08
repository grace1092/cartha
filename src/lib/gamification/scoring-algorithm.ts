import { 
  ScoreFactors, 
  ScoreWeights, 
  ScoringSession, 
  SessionResponse, 
  CompatibilityMatrix,
  AlignmentScore,
  ImprovementSuggestion 
} from '../types/gamification';

// Default weights for score factors
export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  communication_alignment: 0.20,
  financial_values_match: 0.18,
  goal_compatibility: 0.16,
  spending_harmony: 0.15,
  future_planning_sync: 0.12,
  conflict_resolution: 0.10,
  transparency_level: 0.05,
  session_consistency: 0.04
};

// Compatibility matrices for different question types
export const COMPATIBILITY_MATRICES: CompatibilityMatrix = {
  // Spending Style Questions
  'spending_style': {
    'saver-saver': 100,
    'saver-spender': 45,
    'saver-balanced': 75,
    'saver-investor': 85,
    'spender-spender': 80,
    'spender-balanced': 70,
    'spender-investor': 55,
    'balanced-balanced': 95,
    'balanced-investor': 80,
    'investor-investor': 90
  },
  
  // Risk Tolerance Questions
  'risk_tolerance': {
    'conservative-conservative': 100,
    'conservative-moderate': 65,
    'conservative-aggressive': 30,
    'moderate-moderate': 95,
    'moderate-aggressive': 70,
    'aggressive-aggressive': 85
  },
  
  // Financial Goals Questions
  'financial_goals': {
    'retirement-retirement': 100,
    'retirement-house': 75,
    'retirement-travel': 60,
    'retirement-business': 55,
    'house-house': 100,
    'house-travel': 50,
    'house-business': 45,
    'travel-travel': 100,
    'travel-business': 65,
    'business-business': 90
  },
  
  // Communication Preferences
  'communication_style': {
    'direct-direct': 100,
    'direct-diplomatic': 70,
    'direct-avoidant': 40,
    'diplomatic-diplomatic': 90,
    'diplomatic-avoidant': 50,
    'avoidant-avoidant': 60
  },
  
  // Decision Making Style
  'decision_making': {
    'collaborative-collaborative': 100,
    'collaborative-independent': 65,
    'collaborative-leader': 75,
    'independent-independent': 70,
    'independent-leader': 55,
    'leader-leader': 45
  }
};

/**
 * Calculate compatibility score for a pair of answers
 */
export function calculateResponseCompatibility(
  questionType: string,
  userAnswer: string,
  partnerAnswer: string
): number {
  const matrix = COMPATIBILITY_MATRICES[questionType];
  if (!matrix) return 50; // Default neutral score
  
  const key = `${userAnswer}-${partnerAnswer}`;
  const reverseKey = `${partnerAnswer}-${userAnswer}`;
  
  return matrix[key] || matrix[reverseKey] || 50;
}

/**
 * Calculate weighted score for a session
 */
export function calculateSessionScore(
  responses: SessionResponse[],
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): Partial<ScoreFactors> {
  const factorScores: Partial<ScoreFactors> = {};
  const factorCounts: Record<string, number> = {};
  
  // Group responses by category and calculate averages
  responses.forEach(response => {
    const category = response.category;
    if (!factorScores[category]) {
      factorScores[category] = 0;
      factorCounts[category] = 0;
    }
    
    factorScores[category]! += response.compatibility_score * response.weight;
    factorCounts[category]++;
  });
  
  // Calculate weighted averages
  Object.keys(factorScores).forEach(category => {
    if (factorCounts[category] > 0) {
      factorScores[category as keyof ScoreFactors] = 
        factorScores[category as keyof ScoreFactors]! / factorCounts[category];
    }
  });
  
  return factorScores;
}

/**
 * Calculate overall alignment score from factors
 */
export function calculateOverallScore(
  factors: ScoreFactors,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): number {
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.entries(weights).forEach(([factor, weight]) => {
    const factorScore = factors[factor as keyof ScoreFactors];
    if (factorScore !== undefined) {
      totalScore += factorScore * weight;
      totalWeight += weight;
    }
  });
  
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

/**
 * Apply bonuses to session score
 */
export function applySessionBonuses(
  baseScore: number,
  completionRate: number,
  sessionDuration: number,
  plannedDuration: number,
  currentStreak: number
): number {
  let bonusScore = baseScore;
  
  // Completion bonus (up to +5 points)
  const completionBonus = Math.min(5, completionRate * 5);
  bonusScore += completionBonus;
  
  // Time bonus for completing close to planned duration (up to +3 points)
  const timeRatio = sessionDuration / plannedDuration;
  const timeBonus = timeRatio >= 0.8 && timeRatio <= 1.2 ? 3 : 
                   timeRatio >= 0.6 && timeRatio <= 1.4 ? 1 : 0;
  bonusScore += timeBonus;
  
  // Streak consistency bonus (up to +7 points)
  const streakBonus = Math.min(7, Math.floor(currentStreak / 5));
  bonusScore += streakBonus;
  
  return Math.min(100, Math.round(bonusScore));
}

/**
 * Calculate trend from score history
 */
export function calculateScoreTrend(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 3) return 'stable';
  
  const recent = scores.slice(-5); // Last 5 scores
  let improvements = 0;
  let declines = 0;
  
  for (let i = 1; i < recent.length; i++) {
    const change = recent[i] - recent[i - 1];
    if (change > 2) improvements++;
    else if (change < -2) declines++;
  }
  
  if (improvements > declines && improvements >= 2) return 'improving';
  if (declines > improvements && declines >= 2) return 'declining';
  return 'stable';
}

/**
 * Generate improvement suggestions based on current scores
 */
export function generateImprovementSuggestions(
  factors: ScoreFactors,
  partnerFactors?: ScoreFactors
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];
  const factorNames: Record<keyof ScoreFactors, string> = {
    communication_alignment: 'Communication Alignment',
    financial_values_match: 'Financial Values Match',
    goal_compatibility: 'Goal Compatibility',
    spending_harmony: 'Spending Harmony',
    future_planning_sync: 'Future Planning Sync',
    conflict_resolution: 'Conflict Resolution',
    transparency_level: 'Transparency Level',
    session_consistency: 'Session Consistency'
  };
  
  // Find the top 3 areas for improvement
  const sortedFactors = Object.entries(factors)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3);
  
  sortedFactors.forEach(([factor, score]) => {
    const factorKey = factor as keyof ScoreFactors;
    const improvement = getSuggestionForFactor(factorKey, score, partnerFactors?.[factorKey]);
    if (improvement) {
      suggestions.push(improvement);
    }
  });
  
  return suggestions;
}

/**
 * Get specific improvement suggestion for a factor
 */
function getSuggestionForFactor(
  factor: keyof ScoreFactors,
  currentScore: number,
  partnerScore?: number
): ImprovementSuggestion | null {
  const potentialGain = Math.min(15, 85 - currentScore);
  if (potentialGain < 5) return null; // No significant improvement possible
  
  const suggestions: Record<keyof ScoreFactors, {
    suggestion: string;
    action_items: string[];
    difficulty: 'easy' | 'medium' | 'hard';
  }> = {
    communication_alignment: {
      suggestion: "Practice active listening and regular check-ins about money decisions",
      action_items: [
        "Schedule weekly 15-minute money conversations",
        "Use 'I feel' statements when discussing finances",
        "Ask clarifying questions before making assumptions"
      ],
      difficulty: 'easy'
    },
    financial_values_match: {
      suggestion: "Explore and discuss your core financial values and priorities",
      action_items: [
        "Complete our financial values assessment together",
        "Share stories about your money upbringing",
        "Identify 3 shared financial values to focus on"
      ],
      difficulty: 'medium'
    },
    goal_compatibility: {
      suggestion: "Align your short-term and long-term financial goals",
      action_items: [
        "Create a shared vision board for financial goals",
        "Prioritize goals together using our ranking tool",
        "Set up joint savings accounts for shared goals"
      ],
      difficulty: 'medium'
    },
    spending_harmony: {
      suggestion: "Develop spending boundaries and agreements that work for both",
      action_items: [
        "Set monthly 'fun money' budgets for individual spending",
        "Agree on a dollar threshold for joint purchase decisions",
        "Review and categorize recent spending together"
      ],
      difficulty: 'hard'
    },
    future_planning_sync: {
      suggestion: "Create detailed plans for major life and financial milestones",
      action_items: [
        "Use our retirement planning calculator together",
        "Discuss timeline preferences for major purchases",
        "Review and update financial plans quarterly"
      ],
      difficulty: 'hard'
    },
    conflict_resolution: {
      suggestion: "Develop healthy strategies for resolving money disagreements",
      action_items: [
        "Practice our 'time-out' technique during heated discussions",
        "Use our conflict resolution framework for money topics",
        "Agree on a cooling-off period for big financial decisions"
      ],
      difficulty: 'medium'
    },
    transparency_level: {
      suggestion: "Increase openness about individual financial situations and feelings",
      action_items: [
        "Share monthly account balances with each other",
        "Discuss any financial fears or anxieties openly",
        "Use our transparency checklist monthly"
      ],
      difficulty: 'easy'
    },
    session_consistency: {
      suggestion: "Build a sustainable routine for regular money conversations",
      action_items: [
        "Set up recurring calendar reminders for money dates",
        "Choose a consistent day/time that works for both",
        "Prepare conversation topics in advance"
      ],
      difficulty: 'easy'
    }
  };
  
  const suggestion = suggestions[factor];
  return {
    category: factor,
    current_score: currentScore,
    potential_gain: potentialGain,
    difficulty: suggestion.difficulty,
    suggestion: suggestion.suggestion,
    action_items: suggestion.action_items
  };
}

/**
 * Calculate session consistency score based on streak data
 */
export function calculateSessionConsistency(
  currentStreak: number,
  totalSessions: number,
  daysActive: number
): number {
  if (totalSessions === 0 || daysActive === 0) return 0;
  
  // Base score from completion rate
  const completionRate = Math.min(1, totalSessions / (daysActive / 7)); // Sessions per week
  const baseScore = completionRate * 60; // Up to 60 points for good completion rate
  
  // Streak bonus (up to 40 points)
  const streakBonus = Math.min(40, currentStreak * 2);
  
  return Math.round(baseScore + streakBonus);
}

/**
 * Predict next milestone achievement
 */
export function predictMilestoneAchievement(
  currentScore: number,
  scoreHistory: number[],
  targetScore: number
): { daysEstimated: number; confidence: number } {
  if (currentScore >= targetScore) {
    return { daysEstimated: 0, confidence: 1.0 };
  }
  
  if (scoreHistory.length < 3) {
    return { daysEstimated: -1, confidence: 0.0 }; // Insufficient data
  }
  
  // Calculate average weekly progress
  const recentScores = scoreHistory.slice(-8); // Last 8 entries (roughly 2 months)
  let totalProgress = 0;
  let periods = 0;
  
  for (let i = 1; i < recentScores.length; i++) {
    const change = recentScores[i] - recentScores[i - 1];
    if (change > 0) {
      totalProgress += change;
      periods++;
    }
  }
  
  if (periods === 0) {
    return { daysEstimated: -1, confidence: 0.0 }; // No positive progress
  }
  
  const avgProgressPerPeriod = totalProgress / periods;
  const remainingPoints = targetScore - currentScore;
  const periodsNeeded = remainingPoints / avgProgressPerPeriod;
  
  // Assume one period = 1 week (7 days)
  const daysEstimated = Math.round(periodsNeeded * 7);
  
  // Calculate confidence based on consistency of progress
  const progressVariance = recentScores.reduce((variance, score, index) => {
    if (index === 0) return 0;
    const expected = recentScores[index - 1] + avgProgressPerPeriod;
    return variance + Math.pow(score - expected, 2);
  }, 0) / (recentScores.length - 1);
  
  const confidence = Math.max(0.1, Math.min(0.95, 1 - (progressVariance / 100)));
  
  return { daysEstimated, confidence };
} 