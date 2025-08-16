'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Sun, 
  Cloud, 
  Heart,
  Star,
  Filter,
  RefreshCw,
  CheckCircle,
  Users
} from 'lucide-react';
import { format, addDays, isWeekend, startOfDay } from 'date-fns';
import { SchedulingSuggestion, SuggestionReason } from '@/lib/types/money-date';
import Button from '@/components/ui/Button';
import TimeSlot from '@/components/ui/TimeSlot';

interface DateSuggestionsProps {
  coupleId: string;
  onSelectSuggestion?: (suggestion: SchedulingSuggestion) => void;
  onRefresh?: () => void;
  preferences?: {
    preferredDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
    preferredTimes?: string[]; // HH:MM format
    duration?: number; // minutes
    avoidWeekends?: boolean;
  };
}

const SUGGESTION_TYPES = {
  optimal: { icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50', label: 'Optimal' },
  good: { icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-50', label: 'Good' },
  available: { icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-50', label: 'Available' },
  weather: { icon: Sun, color: 'text-orange-500', bgColor: 'bg-orange-50', label: 'Weather' },
  routine: { icon: Heart, color: 'text-pink-500', bgColor: 'bg-pink-50', label: 'Routine' },
  partner_sync: { icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-50', label: 'Partner Sync' }
};

const DateSuggestions: React.FC<DateSuggestionsProps> = ({
  coupleId,
  onSelectSuggestion,
  onRefresh,
  preferences
}) => {
  const [suggestions, setSuggestions] = useState<SchedulingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showAllReasons, setShowAllReasons] = useState<{[key: string]: boolean}>({});

  // Mock data for demo - in real app this would come from AI analysis
  useEffect(() => {
    generateSuggestions();
  }, [coupleId, preferences]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockSuggestions: SchedulingSuggestion[] = [
      {
        id: '1',
        suggested_date: addDays(new Date(), 2).toISOString(),
        suggested_time: '19:30',
        duration_minutes: preferences?.duration || 15,
        confidence_score: 0.95,
        suggestion_type: 'optimal',
        reasons: [
          {
            type: 'historical_success',
            description: 'You both completed 95% of sessions scheduled at this time',
            weight: 0.4
          },
          {
            type: 'calendar_analysis',
            description: 'Both calendars are free with 2-hour buffer',
            weight: 0.3
          },
          {
            type: 'spending_patterns',
            description: 'Optimal timing based on recent spending activity',
            weight: 0.25
          }
        ],
        weather_factor: {
          condition: 'clear',
          impact: 'positive',
          description: 'Clear evening, perfect for focused conversation'
        },
        couple_id: coupleId,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        suggested_date: addDays(new Date(), 1).toISOString(),
        suggested_time: '20:00',
        duration_minutes: preferences?.duration || 15,
        confidence_score: 0.87,
        suggestion_type: 'good',
        reasons: [
          {
            type: 'routine_match',
            description: 'Aligns with your typical evening routine',
            weight: 0.35
          },
          {
            type: 'partner_availability',
            description: 'Partner has consistently been available at this time',
            weight: 0.3
          },
          {
            type: 'energy_levels',
            description: 'Predicted high engagement based on daily patterns',
            weight: 0.22
          }
        ],
        couple_id: coupleId,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        suggested_date: addDays(new Date(), 5).toISOString(),
        suggested_time: '10:30',
        duration_minutes: preferences?.duration || 15,
        confidence_score: 0.82,
        suggestion_type: 'weather',
        reasons: [
          {
            type: 'weekend_preference',
            description: 'Weekend mornings show 85% completion rate',
            weight: 0.4
          },
          {
            type: 'calendar_analysis',
            description: 'Both have light weekend schedules',
            weight: 0.3
          }
        ],
        weather_factor: {
          condition: 'sunny',
          impact: 'positive',
          description: 'Beautiful Saturday morning, great mood enhancer'
        },
        couple_id: coupleId,
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        suggested_date: addDays(new Date(), 3).toISOString(),
        suggested_time: '18:45',
        duration_minutes: preferences?.duration || 15,
        confidence_score: 0.78,
        suggestion_type: 'partner_sync',
        reasons: [
          {
            type: 'mutual_availability',
            description: 'Both partners marked this time as preferred',
            weight: 0.5
          },
          {
            type: 'stress_levels',
            description: 'Lower predicted stress levels for both partners',
            weight: 0.28
          }
        ],
        couple_id: coupleId,
        created_at: new Date().toISOString()
      }
    ];

    setSuggestions(mockSuggestions);
    setIsLoading(false);
  };

  const handleSelectSuggestion = (suggestion: SchedulingSuggestion) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
  };

  const toggleFilter = (filterType: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterType)
        ? prev.filter(f => f !== filterType)
        : [...prev, filterType]
    );
  };

  const toggleShowReasons = (suggestionId: string) => {
    setShowAllReasons(prev => ({
      ...prev,
      [suggestionId]: !prev[suggestionId]
    }));
  };

  const filteredSuggestions = selectedFilters.length > 0 
    ? suggestions.filter(s => selectedFilters.includes(s.suggestion_type))
    : suggestions;

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const formatConfidence = (score: number) => {
    return `${Math.round(score * 100)}% match`;
  };

  const getSuggestionTypeInfo = (type: string) => {
    return SUGGESTION_TYPES[type as keyof typeof SUGGESTION_TYPES] || SUGGESTION_TYPES.available;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI Schedule Suggestions</h2>
          </div>
          <Button
            onClick={onRefresh || generateSuggestions}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SUGGESTION_TYPES).map(([type, info]) => {
              const Icon = info.icon;
              const isSelected = selectedFilters.includes(type);
              return (
                <motion.button
                  key={type}
                  onClick={() => toggleFilter(type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${isSelected 
                      ? `${info.color} ${info.bgColor} border-2 border-current` 
                      : 'text-gray-600 bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {info.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Remove loading state to show content immediately */}

        {/* Suggestions List */}
        <AnimatePresence>
          {!isLoading && (
            <div className="space-y-4">
              {filteredSuggestions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No suggestions match your current filters.
                </div>
              ) : (
                filteredSuggestions.map((suggestion, index) => {
                  const typeInfo = getSuggestionTypeInfo(suggestion.suggestion_type);
                  const Icon = typeInfo.icon;
                  const showReasons = showAllReasons[suggestion.id];

                  return (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                            <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {format(new Date(suggestion.suggested_date), 'EEEE, MMM d')}
                              </h3>
                              <span className="text-sm text-gray-600">at</span>
                              <span className="font-medium text-blue-600">
                                {suggestion.suggested_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                                {typeInfo.label}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(suggestion.confidence_score)}`}>
                                {formatConfidence(suggestion.confidence_score)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Select
                        </Button>
                      </div>

                      {/* Weather Factor */}
                      {suggestion.weather_factor && (
                        <div className="flex items-center gap-2 mb-3 p-3 bg-blue-50 rounded-lg">
                          {suggestion.weather_factor.condition === 'clear' || suggestion.weather_factor.condition === 'sunny' ? (
                            <Sun className="w-4 h-4 text-orange-500" />
                          ) : (
                            <Cloud className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-sm text-gray-700">
                            {suggestion.weather_factor.description}
                          </span>
                        </div>
                      )}

                      {/* Reasons Preview */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-700">
                            Why this time works:
                          </h4>
                          {suggestion.reasons.length > 2 && (
                            <button
                              onClick={() => toggleShowReasons(suggestion.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              {showReasons ? 'Show less' : `Show all ${suggestion.reasons.length} reasons`}
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {(showReasons ? suggestion.reasons : suggestion.reasons.slice(0, 2)).map((reason, reasonIndex) => (
                            <div key={reasonIndex} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                              <span>{reason.description}</span>
                              <span className="text-xs text-gray-500">
                                ({Math.round(reason.weight * 100)}% factor)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </AnimatePresence>

        {/* AI Insights */}
        {!isLoading && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-purple-900">AI Insights</h4>
            </div>
            <p className="text-sm text-purple-800">
              Based on your calendar patterns, spending habits, and past session success rates, 
              evening sessions between 7-8 PM show the highest completion rates. Weekend mornings 
              are also highly effective when both partners are well-rested.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DateSuggestions; 