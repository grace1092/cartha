'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SunIcon,
  BeakerIcon,
  FireIcon,
  SparklesIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  TagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { ContentTheme } from '@/lib/types/content';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ThemeSelectorProps {
  themes: ContentTheme[];
  selectedThemes: string[];
  onThemeSelect: (themeIds: string[]) => void;
  seasonFilter?: string;
  showCounts?: boolean;
  allowMultiple?: boolean;
  showSeasonFilter?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedThemes,
  onThemeSelect,
  seasonFilter,
  showCounts = false,
  allowMultiple = true,
  showSeasonFilter = true
}) => {
  const [activeSeasonFilter, setActiveSeasonFilter] = useState<string>(seasonFilter || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'spring':
        return SparklesIcon;
      case 'summer':
        return SunIcon;
      case 'fall':
        return FireIcon;
      case 'winter':
        return BeakerIcon;
      case 'year-round':
        return ClockIcon;
      default:
        return TagIcon;
    }
  };

  const seasons = [
    { id: 'all', label: 'All Seasons', icon: CalendarIcon },
    { id: 'spring', label: 'Spring', icon: SparklesIcon },
    { id: 'summer', label: 'Summer', icon: SunIcon },
    { id: 'fall', label: 'Fall', icon: FireIcon },
    { id: 'winter', label: 'Winter', icon: BeakerIcon },
    { id: 'year-round', label: 'Year Round', icon: ClockIcon }
  ];

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'spring':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'summer':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'fall':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'winter':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'year-round':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getThemeGradient = (season: string) => {
    switch (season) {
      case 'spring':
        return 'from-green-400 to-emerald-600';
      case 'summer':
        return 'from-yellow-400 to-orange-600';
      case 'fall':
        return 'from-orange-400 to-red-600';
      case 'winter':
        return 'from-blue-400 to-cyan-600';
      case 'year-round':
        return 'from-purple-400 to-pink-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const filteredThemes = themes.filter(theme => {
    if (activeSeasonFilter === 'all') return true;
    return theme.season === activeSeasonFilter;
  });

  const handleThemeToggle = (themeId: string) => {
    if (allowMultiple) {
      const newSelected = selectedThemes.includes(themeId)
        ? selectedThemes.filter(id => id !== themeId)
        : [...selectedThemes, themeId];
      onThemeSelect(newSelected);
    } else {
      onThemeSelect(selectedThemes.includes(themeId) ? [] : [themeId]);
    }
  };

  const clearSelection = () => {
    onThemeSelect([]);
  };

  const selectAll = () => {
    onThemeSelect(filteredThemes.map(theme => theme.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Choose Themes</h3>
          <p className="text-sm text-gray-600 mt-1">
            {selectedThemes.length > 0 
              ? `${selectedThemes.length} theme${selectedThemes.length > 1 ? 's' : ''} selected`
              : 'Select themes to filter content'
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {selectedThemes.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearSelection}>
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
          
          {allowMultiple && filteredThemes.length > 0 && (
            <Button variant="outline" size="sm" onClick={selectAll}>
              <CheckIcon className="h-4 w-4 mr-1" />
              Select All
            </Button>
          )}

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Season Filter */}
      {showSeasonFilter && (
        <div className="flex flex-wrap gap-2">
          {seasons.map((season) => {
            const Icon = season.icon;
            const isActive = activeSeasonFilter === season.id;
            
            return (
              <button
                key={season.id}
                onClick={() => setActiveSeasonFilter(season.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{season.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Theme Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${activeSeasonFilter}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
          }
        >
          {filteredThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={selectedThemes.includes(theme.id)}
              onToggle={() => handleThemeToggle(theme.id)}
              viewMode={viewMode}
              showCounts={showCounts}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredThemes.length === 0 && (
        <Card className="p-8 text-center">
          <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No themes found</h4>
          <p className="text-gray-600">
            No themes available for the selected season filter.
          </p>
        </Card>
      )}

      {/* Selected Summary */}
      {selectedThemes.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-900">Selected Themes</h4>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedThemes.map((themeId) => {
                  const theme = themes.find(t => t.id === themeId);
                  if (!theme) return null;
                  
                  return (
                    <span
                      key={themeId}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800"
                    >
                      {theme.name}
                      <button
                        onClick={() => handleThemeToggle(themeId)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Theme Card Component
interface ThemeCardProps {
  theme: ContentTheme;
  isSelected: boolean;
  onToggle: () => void;
  viewMode: 'grid' | 'list';
  showCounts: boolean;
}

// Helper functions for ThemeCard
const getSeasonIconForCard = (season: string) => {
  switch (season) {
    case 'spring':
      return SparklesIcon;
    case 'summer':
      return SunIcon;
    case 'fall':
      return FireIcon;
    case 'winter':
      return BeakerIcon;
    case 'year-round':
      return ClockIcon;
    default:
      return TagIcon;
  }
};

const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  isSelected,
  onToggle,
  viewMode,
  showCounts
}) => {
  const Icon = getSeasonIconForCard(theme.season);

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'spring':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'summer':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'fall':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'winter':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'year-round':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getThemeGradient = (season: string) => {
    switch (season) {
      case 'spring':
        return 'from-green-400 to-emerald-600';
      case 'summer':
        return 'from-yellow-400 to-orange-600';
      case 'fall':
        return 'from-orange-400 to-red-600';
      case 'winter':
        return 'from-blue-400 to-cyan-600';
      case 'year-round':
        return 'from-purple-400 to-pink-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Theme Icon */}
            <div className={`p-2 rounded-lg ${getSeasonColor(theme.season)}`}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Theme Info */}
            <div>
              <h4 className="font-medium text-gray-900">{theme.name}</h4>
              <p className="text-sm text-gray-600">{theme.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Season Badge */}
            <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getSeasonColor(theme.season)}`}>
              {theme.season.replace('-', ' ')}
            </span>

            {/* Selection Indicator */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isSelected
                ? 'bg-blue-600 border-blue-600'
                : 'border-gray-300'
            }`}>
              {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'ring-4 ring-blue-300 ring-opacity-50'
          : ''
      }`}
      onClick={onToggle}
    >
      <Card className="h-full">
        {/* Gradient Header */}
        <div className={`h-24 bg-gradient-to-br ${getThemeGradient(theme.season)} relative`}>
          {/* Theme Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-8 w-8 text-white opacity-80" />
          </div>

          {/* Selection Indicator */}
          <div className="absolute top-3 right-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isSelected
                ? 'bg-white border-white'
                : 'border-white border-opacity-50'
            }`}>
              {isSelected && <CheckIcon className="h-4 w-4 text-blue-600" />}
            </div>
          </div>

          {/* Season Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-white bg-opacity-90 text-gray-800 rounded-md text-xs font-medium capitalize">
              {theme.season.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2">{theme.name}</h4>
          
          {theme.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {theme.description}
            </p>
          )}

          {showCounts && (
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <TagIcon className="h-3 w-3 mr-1" />
              <span>5 decks</span> {/* This would be dynamic based on actual deck counts */}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ThemeSelector; 