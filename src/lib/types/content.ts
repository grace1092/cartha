// Content Management System Types

export interface ContentTheme {
  id: string;
  name: string;
  description?: string;
  color_scheme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  icon_url?: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentDeck {
  id: string;
  title: string;
  description?: string;
  theme_id?: string;
  theme?: ContentTheme;
  release_date: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  subscription_level: 'free' | 'core' | 'plus' | 'lifetime';
  card_count: number;
  estimated_duration?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  featured_image_url?: string;
  creator_id?: string;
  version: number;
  parent_deck_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  published_at?: string;
  cards?: ContentCard[];
  progress?: UserDeckProgress;
}

export interface ContentCard {
  id: string;
  deck_id: string;
  title: string;
  content: string;
  card_type: 'conversation' | 'activity' | 'reflection' | 'goal-setting';
  order_index: number;
  estimated_time?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  formatting?: any;
  media_urls?: string[];
  interaction_data?: any;
  unlock_criteria?: any;
  is_premium: boolean;
  variant_group?: string;
  version: number;
  created_at: string;
  updated_at: string;
  variants?: CardVariant[];
  is_unlocked?: boolean;
  is_completed?: boolean;
  is_favorite?: boolean;
}

export interface CardVariant {
  id: string;
  original_card_id: string;
  variant_name: string;
  title?: string;
  content?: string;
  formatting?: any;
  media_urls?: string[];
  traffic_percentage: number;
  performance_metrics?: any;
  is_active: boolean;
  created_at: string;
}

export interface UserDeckProgress {
  id: string;
  user_id: string;
  deck_id: string;
  cards_completed: number;
  total_cards: number;
  completion_percentage: number;
  started_at: string;
  completed_at?: string;
  last_accessed_at: string;
  time_spent: number;
  favorite_cards?: string[];
  notes?: any;
}

export interface UserCardInteraction {
  id: string;
  user_id: string;
  card_id: string;
  deck_id: string;
  interaction_type: 'viewed' | 'completed' | 'favorited' | 'shared' | 'noted';
  interaction_data?: any;
  variant_id?: string;
  session_id?: string;
  timestamp: string;
}

export interface ContentSchedule {
  id: string;
  deck_id: string;
  scheduled_action: 'publish' | 'unpublish' | 'archive' | 'notify';
  scheduled_time: string;
  action_data?: any;
  status: 'pending' | 'executed' | 'failed';
  executed_at?: string;
  error_message?: string;
  created_at: string;
}

export interface ContentNotification {
  id: string;
  type: 'new_deck_available' | 'deck_completed' | 'monthly_reminder';
  title: string;
  message: string;
  template_data?: any;
  target_audience?: any;
  delivery_channels: ('email' | 'push' | 'in_app' | 'sms')[];
  scheduled_time?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sent_count: number;
  open_count: number;
  click_count: number;
  created_at: string;
  sent_at?: string;
}

export interface UserContentPreferences {
  id: string;
  user_id: string;
  preferred_themes?: string[];
  preferred_difficulty: 'beginner' | 'intermediate' | 'advanced';
  preferred_duration: number;
  notification_preferences?: any;
  content_filters?: any;
  accessibility_settings?: any;
  created_at: string;
  updated_at: string;
}

export interface ContentAnalytics {
  id: string;
  deck_id?: string;
  card_id?: string;
  metric_name: 'views' | 'completions' | 'shares' | 'favorites' | 'time_spent';
  metric_value: number;
  period_start: string;
  period_end: string;
  aggregation_level: 'hourly' | 'daily' | 'weekly' | 'monthly';
  segment_data?: any;
  recorded_at: string;
}

export interface ContentExport {
  id: string;
  user_id: string;
  export_type: 'pdf' | 'epub' | 'json' | 'csv';
  content_selection?: any;
  export_settings?: any;
  file_url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_size?: number;
  download_count: number;
  expires_at?: string;
  created_at: string;
  completed_at?: string;
}

export interface UserCustomDeck {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_public: boolean;
  source_cards?: string[];
  custom_cards?: any[];
  theme_customization?: any;
  sharing_settings?: any;
  like_count: number;
  copy_count: number;
  created_at: string;
  updated_at: string;
}

// Component Props Types

export interface ContentCMSProps {
  mode: 'create' | 'edit';
  deckId?: string;
  onSave: (deck: Partial<ContentDeck>) => void;
  onCancel: () => void;
}

export interface DeckLibraryProps {
  subscriptionLevel: 'free' | 'core' | 'plus' | 'lifetime';
  showFavorites?: boolean;
  showCompleted?: boolean;
  selectedThemes?: string[];
  searchQuery?: string;
  onDeckSelect: (deck: ContentDeck) => void;
}

export interface CardRendererProps {
  card: ContentCard;
  deck: ContentDeck;
  isPreview?: boolean;
  showProgress?: boolean;
  onInteraction: (type: string, data?: any) => void;
  onComplete: () => void;
  onFavorite: () => void;
}

export interface ProgressiveUnlockProps {
  deck: ContentDeck;
  userProgress: UserDeckProgress;
  onCardUnlock: (cardId: string) => void;
}

export interface ThemeSelectorProps {
  themes: ContentTheme[];
  selectedThemes: string[];
  onThemeSelect: (themeIds: string[]) => void;
  seasonFilter?: string;
  showCounts?: boolean;
}

// Editor and Content Creation Types

export interface RichTextContent {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'image' | 'button';
  content?: string;
  level?: number; // for headings
  listType?: 'ordered' | 'unordered';
  items?: string[]; // for lists
  src?: string; // for images
  alt?: string; // for images
  buttonText?: string;
  buttonAction?: string;
  styling?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface CardTemplate {
  id: string;
  name: string;
  category: string;
  preview_image: string;
  template_data: {
    title: string;
    content: RichTextContent[];
    estimated_time: number;
    card_type: ContentCard['card_type'];
    interaction_data?: any;
  };
}

export interface DeckCreationData {
  title: string;
  description?: string;
  theme_id?: string;
  release_date: string;
  subscription_level: ContentDeck['subscription_level'];
  estimated_duration?: number;
  difficulty_level?: ContentDeck['difficulty_level'];
  tags?: string[];
  featured_image_url?: string;
  cards: Partial<ContentCard>[];
}

// Search and Filter Types

export interface ContentFilters {
  themes?: string[];
  subscription_levels?: string[];
  difficulty_levels?: string[];
  card_types?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  completion_status?: 'completed' | 'in_progress' | 'not_started';
  favorites_only?: boolean;
  search_query?: string;
}

export interface ContentSortOptions {
  field: 'release_date' | 'title' | 'completion_percentage' | 'last_accessed_at' | 'created_at';
  direction: 'asc' | 'desc';
}

// Analytics and Insights Types

export interface DeckAnalytics {
  deck_id: string;
  total_views: number;
  total_completions: number;
  average_completion_rate: number;
  average_time_spent: number;
  favorite_count: number;
  share_count: number;
  popular_cards: {
    card_id: string;
    title: string;
    engagement_score: number;
  }[];
  completion_trends: {
    date: string;
    completions: number;
  }[];
  user_feedback?: {
    rating: number;
    comment: string;
    user_id: string;
  }[];
}

// Notification and Communication Types

export interface NotificationTemplate {
  id: string;
  name: string;
  type: ContentNotification['type'];
  title_template: string;
  message_template: string;
  variables: string[];
  default_channels: ContentNotification['delivery_channels'];
}

// Export and Sharing Types

export interface ExportOptions {
  format: ContentExport['export_type'];
  include_images: boolean;
  include_progress: boolean;
  custom_styling?: any;
  page_layout?: 'single' | 'spread' | 'booklet';
  quality?: 'low' | 'medium' | 'high';
}

// Error and Loading States

export interface ContentError {
  code: string;
  message: string;
  details?: any;
}

export interface LoadingState {
  isLoading: boolean;
  operation?: 'fetching' | 'saving' | 'deleting' | 'exporting';
  progress?: number;
} 