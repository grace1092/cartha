'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  PhotoIcon,
  ClockIcon,
  TagIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  EyeIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { ContentDeck, ContentCard, ContentTheme, DeckCreationData } from '@/lib/types/content';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ContentCMSProps {
  mode: 'create' | 'edit';
  deckId?: string;
  onSave: (deck: Partial<ContentDeck>) => void;
  onCancel: () => void;
}

interface CMSTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: CMSTab[] = [
  { id: 'details', label: 'Deck Details', icon: DocumentTextIcon },
  { id: 'cards', label: 'Cards', icon: TagIcon },
  { id: 'schedule', label: 'Schedule & Publish', icon: CalendarIcon },
  { id: 'preview', label: 'Preview', icon: EyeIcon }
];

const ContentCMS: React.FC<ContentCMSProps> = ({ mode, deckId, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [deckData, setDeckData] = useState<DeckCreationData>({
    title: '',
    description: '',
    theme_id: '',
    release_date: new Date().toISOString().split('T')[0],
    subscription_level: 'free',
    estimated_duration: 20,
    difficulty_level: 'intermediate',
    tags: [],
    featured_image_url: '',
    cards: []
  });
  const [themes, setThemes] = useState<ContentTheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize deck data for edit mode
  useEffect(() => {
    if (mode === 'edit' && deckId) {
      loadDeckData(deckId);
    }
    loadThemes();
  }, [mode, deckId]);

  const loadDeckData = async (id: string) => {
    setIsLoading(true);
    try {
      // API call to load deck data
      // const deck = await fetchDeck(id);
      // setDeckData(deck);
    } catch (error) {
      console.error('Failed to load deck:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadThemes = async () => {
    try {
      // API call to load themes
      // const themesData = await fetchThemes();
      // setThemes(themesData);
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  };

  const handleSave = () => {
    const validationErrors = validateDeck();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(deckData as Partial<ContentDeck>);
  };

  const validateDeck = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!deckData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!deckData.release_date) {
      errors.release_date = 'Release date is required';
    }

    if (deckData.cards.length === 0) {
      errors.cards = 'At least one card is required';
    }

    return errors;
  };

  const addCard = () => {
    const newCard: Partial<ContentCard> = {
      title: '',
      content: '',
      card_type: 'conversation',
      order_index: deckData.cards.length,
      estimated_time: 5,
      is_premium: false,
      version: 1
    };

    setDeckData(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  };

  const updateCard = (index: number, updates: Partial<ContentCard>) => {
    setDeckData(prev => ({
      ...prev,
      cards: prev.cards.map((card, i) => 
        i === index ? { ...card, ...updates } : card
      )
    }));
  };

  const removeCard = (index: number) => {
    setDeckData(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
        .map((card, i) => ({ ...card, order_index: i }))
    }));
  };

  const moveCard = (fromIndex: number, toIndex: number) => {
    const cards = [...deckData.cards];
    const [moved] = cards.splice(fromIndex, 1);
    cards.splice(toIndex, 0, moved);
    
    setDeckData(prev => ({
      ...prev,
      cards: cards.map((card, i) => ({ ...card, order_index: i }))
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Create New Deck' : 'Edit Deck'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center"
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Create Deck' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'details' && (
              <DeckDetailsTab
                deckData={deckData}
                themes={themes}
                errors={errors}
                onChange={(updates) => setDeckData(prev => ({ ...prev, ...updates }))}
              />
            )}

            {activeTab === 'cards' && (
              <CardsTab
                cards={deckData.cards}
                onAddCard={addCard}
                onUpdateCard={updateCard}
                onRemoveCard={removeCard}
                onMoveCard={moveCard}
                errors={errors}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleTab
                deckData={deckData}
                onChange={(updates) => setDeckData(prev => ({ ...prev, ...updates }))}
              />
            )}

            {activeTab === 'preview' && (
              <PreviewTab deckData={deckData} themes={themes} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Deck Details Tab Component
interface DeckDetailsTabProps {
  deckData: DeckCreationData;
  themes: ContentTheme[];
  errors: Record<string, string>;
  onChange: (updates: Partial<DeckCreationData>) => void;
}

const DeckDetailsTab: React.FC<DeckDetailsTabProps> = ({ deckData, themes, errors, onChange }) => {
  const handleTagAdd = (tag: string) => {
    if (tag && !deckData.tags?.includes(tag)) {
      onChange({ tags: [...(deckData.tags || []), tag] });
    }
  };

  const handleTagRemove = (tag: string) => {
    onChange({ tags: deckData.tags?.filter(t => t !== tag) || [] });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deck Title *
            </label>
            <input
              type="text"
              value={deckData.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter deck title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={deckData.description || ''}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what this deck covers..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={deckData.theme_id || ''}
              onChange={(e) => onChange({ theme_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a theme...</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name} ({theme.season})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Settings & Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subscription Level
            </label>
            <select
              value={deckData.subscription_level}
              onChange={(e) => onChange({ subscription_level: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="free">Free</option>
              <option value="core">Core</option>
              <option value="plus">Plus</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={deckData.difficulty_level || 'intermediate'}
              onChange={(e) => onChange({ difficulty_level: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              value={deckData.estimated_duration || 20}
              onChange={(e) => onChange({ estimated_duration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="5"
              max="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <TagInput
              tags={deckData.tags || []}
              onAdd={handleTagAdd}
              onRemove={handleTagRemove}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

// Tag Input Component
interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a tag..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
        >
          Add
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {tag}
            <button
              onClick={() => onRemove(tag)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// Cards Tab Component
interface CardsTabProps {
  cards: Partial<ContentCard>[];
  onAddCard: () => void;
  onUpdateCard: (index: number, updates: Partial<ContentCard>) => void;
  onRemoveCard: (index: number) => void;
  onMoveCard: (fromIndex: number, toIndex: number) => void;
  errors: Record<string, string>;
}

const CardsTab: React.FC<CardsTabProps> = ({ 
  cards, 
  onAddCard, 
  onUpdateCard, 
  onRemoveCard, 
  onMoveCard,
  errors 
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Cards ({cards.length})
        </h3>
        <Button onClick={onAddCard} className="flex items-center">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </div>

      {errors.cards && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.cards}</p>
        </div>
      )}

      <div className="space-y-4">
        {cards.map((card, index) => (
          <CardEditor
            key={index}
            card={card}
            index={index}
            onUpdate={(updates) => onUpdateCard(index, updates)}
            onRemove={() => onRemoveCard(index)}
            onMoveUp={index > 0 ? () => onMoveCard(index, index - 1) : undefined}
            onMoveDown={index < cards.length - 1 ? () => onMoveCard(index, index + 1) : undefined}
          />
        ))}

        {cards.length === 0 && (
          <Card className="p-8 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h4>
            <p className="text-gray-600 mb-4">
              Add your first card to get started building your deck.
            </p>
            <Button onClick={onAddCard}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Card
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

// Card Editor Component
interface CardEditorProps {
  card: Partial<ContentCard>;
  index: number;
  onUpdate: (updates: Partial<ContentCard>) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ 
  card, 
  index, 
  onUpdate, 
  onRemove, 
  onMoveUp, 
  onMoveDown 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {index + 1}
          </span>
          <input
            type="text"
            value={card.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
            placeholder="Card title..."
          />
        </div>
        <div className="flex items-center space-x-2">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronLeftIcon className="h-4 w-4 rotate-90" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronRightIcon className="h-4 w-4 rotate-90" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronRightIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-red-400 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Type
              </label>
              <select
                value={card.card_type || 'conversation'}
                onChange={(e) => onUpdate({ card_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="conversation">Conversation</option>
                <option value="activity">Activity</option>
                <option value="reflection">Reflection</option>
                <option value="goal-setting">Goal Setting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time (min)
              </label>
              <input
                type="number"
                value={card.estimated_time || 5}
                onChange={(e) => onUpdate({ estimated_time: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Premium Content
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={card.is_premium || false}
                  onChange={(e) => onUpdate({ is_premium: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Premium only</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Content
            </label>
            <textarea
              value={card.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the card content... You can use markdown formatting."
            />
          </div>
        </motion.div>
      )}
    </Card>
  );
};

// Schedule Tab Component
interface ScheduleTabProps {
  deckData: DeckCreationData;
  onChange: (updates: Partial<DeckCreationData>) => void;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ deckData, onChange }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing Schedule</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Release Date
          </label>
          <input
            type="date"
            value={deckData.release_date}
            onChange={(e) => onChange({ release_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <ClockIcon className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Publishing Notes</h4>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Decks will be automatically published on the release date</li>
                  <li>Users will receive notifications based on their preferences</li>
                  <li>Premium content requires appropriate subscription levels</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Preview Tab Component
interface PreviewTabProps {
  deckData: DeckCreationData;
  themes: ContentTheme[];
}

const PreviewTab: React.FC<PreviewTabProps> = ({ deckData, themes }) => {
  const selectedTheme = themes.find(t => t.id === deckData.theme_id);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Deck Preview</h3>
        
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-start space-x-4">
            {deckData.featured_image_url ? (
              <img 
                src={deckData.featured_image_url} 
                alt={deckData.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <PhotoIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900">{deckData.title || 'Untitled Deck'}</h4>
              <p className="text-gray-600 mt-1">{deckData.description || 'No description provided'}</p>
              
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {deckData.estimated_duration} min
                </span>
                <span>{deckData.cards.length} cards</span>
                {selectedTheme && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedTheme.name}
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  deckData.subscription_level === 'free' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {deckData.subscription_level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cards Preview</h3>
        
        <div className="space-y-3">
          {deckData.cards.map((card, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {index + 1}
                </span>
                <h5 className="font-medium text-gray-900">{card.title || `Card ${index + 1}`}</h5>
                <span className="text-xs text-gray-500 capitalize">{card.card_type}</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {card.content || 'No content provided'}
              </p>
            </div>
          ))}
          
          {deckData.cards.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No cards created yet
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ContentCMS; 