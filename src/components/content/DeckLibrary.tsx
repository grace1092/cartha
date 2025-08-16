'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  LockClosedIcon,
  TagIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ContentDeck, ContentTheme, ContentFilters, ContentSortOptions } from '@/lib/types/content';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface DeckLibraryProps {
  subscriptionLevel: 'free' | 'core' | 'plus' | 'lifetime';
  onDeckSelect: (deck: ContentDeck) => void;
}

const DeckLibrary: React.FC<DeckLibraryProps> = ({
  subscriptionLevel,
  onDeckSelect
}) => {
  const [decks, setDecks] = useState<ContentDeck[]>([]);
  const [themes, setThemes] = useState<ContentTheme[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<ContentDeck[]>([]);
  const [filters, setFilters] = useState<ContentFilters>({});
  const [sortOptions, setSortOptions] = useState<ContentSortOptions>({
    field: 'release_date',
    direction: 'desc'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteDecks, setFavoriteDecks] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDecks();
    loadThemes();
    loadUserPreferences();
  }, [subscriptionLevel]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [decks, filters, sortOptions]);

  const loadDecks = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockDecks: ContentDeck[] = [
        {
          id: '1',
          title: 'Summer Travel Money Talks',
          description: 'Navigate vacation budgets and travel spending as a couple',
          theme_id: 'summer-theme',
          release_date: '2024-06-01',
          status: 'published',
          subscription_level: 'free',
          card_count: 10,
          estimated_duration: 25,
          difficulty_level: 'beginner',
          tags: ['travel', 'budgeting', 'vacation'],
          featured_image_url: '/images/summer-travel.jpg',
          version: 1,
          created_at: '2024-05-15T00:00:00Z',
          updated_at: '2024-05-15T00:00:00Z',
          progress: {
            id: '1',
            user_id: 'user1',
            deck_id: '1',
            cards_completed: 7,
            total_cards: 10,
            completion_percentage: 70,
            started_at: '2024-06-01T00:00:00Z',
            last_accessed_at: '2024-06-05T00:00:00Z',
            time_spent: 18
          }
        },
        {
          id: '2',
          title: 'Holiday Spending Strategies',
          description: 'Plan and manage holiday expenses together',
          theme_id: 'winter-theme',
          release_date: '2024-11-01',
          status: 'published',
          subscription_level: 'core',
          card_count: 12,
          estimated_duration: 30,
          difficulty_level: 'intermediate',
          tags: ['holidays', 'budgeting', 'gift-giving'],
          featured_image_url: '/images/holiday-spending.jpg',
          version: 1,
          created_at: '2024-10-15T00:00:00Z',
          updated_at: '2024-10-15T00:00:00Z'
        }
      ];
      setDecks(mockDecks);
    } catch (error) {
      console.error('Failed to load decks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadThemes = async () => {
    try {
      // Mock themes data
      const mockThemes: ContentTheme[] = [
        {
          id: 'summer-theme',
          name: 'Summer Adventures',
          description: 'Seasonal content for summer activities',
          season: 'summer',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];
      setThemes(mockThemes);
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  };

  const loadUserPreferences = async () => {
    try {
      // Load user's favorite decks
      setFavoriteDecks(new Set(['1'])); // Mock favorite
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...decks];

    // Apply search filter
    if (filters.search_query) {
      const query = filters.search_query.toLowerCase();
      filtered = filtered.filter(deck => 
        deck.title.toLowerCase().includes(query) ||
        deck.description?.toLowerCase().includes(query) ||
        deck.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply subscription level filter
    filtered = filtered.filter(deck => {
      switch (deck.subscription_level) {
        case 'free':
          return true;
        case 'core':
          return ['core', 'plus', 'lifetime'].includes(subscriptionLevel);
        case 'plus':
          return ['plus', 'lifetime'].includes(subscriptionLevel);
        case 'lifetime':
          return subscriptionLevel === 'lifetime';
        default:
          return false;
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortOptions.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'release_date':
          aValue = new Date(a.release_date);
          bValue = new Date(b.release_date);
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }

      if (sortOptions.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDecks(filtered);
  };

  const handleFilterChange = (newFilters: Partial<ContentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const toggleFavorite = async (deckId: string) => {
    try {
      const newFavorites = new Set(favoriteDecks);
      if (favoriteDecks.has(deckId)) {
        newFavorites.delete(deckId);
      } else {
        newFavorites.add(deckId);
      }
      setFavoriteDecks(newFavorites);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const canAccessDeck = (deck: ContentDeck) => {
    switch (deck.subscription_level) {
      case 'free':
        return true;
      case 'core':
        return ['core', 'plus', 'lifetime'].includes(subscriptionLevel);
      case 'plus':
        return ['plus', 'lifetime'].includes(subscriptionLevel);
      case 'lifetime':
        return subscriptionLevel === 'lifetime';
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Library</h2>
          <p className="text-gray-600 mt-1">
            {filteredDecks.length} of {decks.length} decks available
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search decks..."
              value={filters.search_query || ''}
              onChange={(e) => handleFilterChange({ search_query: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            isFavorite={favoriteDecks.has(deck.id)}
            canAccess={canAccessDeck(deck)}
            onSelect={onDeckSelect}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDecks.length === 0 && (
        <Card className="p-12 text-center">
          <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No decks found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms to find more content.
          </p>
        </Card>
      )}
    </div>
  );
};

// Deck Card Component
interface DeckCardProps {
  deck: ContentDeck;
  isFavorite: boolean;
  canAccess: boolean;
  onSelect: (deck: ContentDeck) => void;
  onToggleFavorite: (deckId: string) => void;
}

const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  isFavorite,
  canAccess,
  onSelect,
  onToggleFavorite
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const getStatusIcon = () => {
    if (!deck.progress) return null;
    
    if (deck.progress.completion_percentage === 100) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    
    if (deck.progress.completion_percentage > 0) {
      return <PlayIcon className="h-5 w-5 text-blue-500" />;
    }
    
    return null;
  };

  return (
    <Card className={`group cursor-pointer transition-all duration-200 ${
      canAccess 
        ? 'hover:shadow-lg hover:-translate-y-1' 
        : 'opacity-75 cursor-not-allowed'
    }`}>
      <div className="relative">
        {/* Featured Image */}
        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
          {deck.featured_image_url ? (
            <img 
              src={deck.featured_image_url} 
              alt={deck.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TagIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
          {!canAccess && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <LockClosedIcon className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(deck.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all"
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Status Badge */}
        {deck.progress && (
          <div className="absolute top-3 left-3">
            {getStatusIcon()}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
            {deck.title}
          </h3>
          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            deck.subscription_level === 'free' 
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {deck.subscription_level}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {deck.description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {deck.estimated_duration} min
          </span>
          <span>{deck.card_count} cards</span>
          <span className="capitalize">{deck.difficulty_level}</span>
        </div>

        {/* Progress Bar */}
        {deck.progress && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{deck.progress.completion_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  getProgressColor(deck.progress.completion_percentage)
                }`}
                style={{ width: `${deck.progress.completion_percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {deck.tags && deck.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {deck.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
            {deck.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                +{deck.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {canAccess ? (
            <Button
              onClick={() => onSelect(deck)}
              className="flex-1"
            >
              {deck.progress?.completion_percentage === 100 ? 'Review' : 'Continue'}
            </Button>
          ) : (
            <div className="flex-1">
              <Button variant="outline" className="w-full" disabled>
                <LockClosedIcon className="h-4 w-4 mr-2" />
                Upgrade Required
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DeckLibrary; 