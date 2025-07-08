-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Couples table (already exists, just adding reference)
-- CREATE TABLE couples (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Money Date Sessions
CREATE TABLE money_date_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL,
    scheduled_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 15,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, active, completed, missed, rescheduled
    completion_rate DECIMAL(3,2), -- 0.00 to 1.00
    notes TEXT,
    session_topics TEXT[],
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_status CHECK (status IN ('scheduled', 'active', 'completed', 'missed', 'rescheduled')),
    CONSTRAINT valid_completion_rate CHECK (completion_rate >= 0 AND completion_rate <= 1)
);

-- Reminder Preferences
CREATE TABLE reminder_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    sms_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    reminder_intervals INTEGER[] DEFAULT '{1440, 120, 15}', -- minutes before
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    timezone VARCHAR(50) DEFAULT 'UTC',
    escalation_enabled BOOLEAN DEFAULT true,
    partner_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Integrations
CREATE TABLE calendar_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    provider VARCHAR(20) NOT NULL, -- 'google', 'apple', 'outlook'
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    calendar_id VARCHAR(255),
    sync_enabled BOOLEAN DEFAULT true,
    last_sync TIMESTAMPTZ,
    sync_errors TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_provider CHECK (provider IN ('google', 'apple', 'outlook'))
);

-- Notification Logs
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES money_date_sessions(id),
    user_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'sms', 'email', 'push'
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed
    message TEXT,
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_notification_type CHECK (type IN ('sms', 'email', 'push')),
    CONSTRAINT valid_notification_status CHECK (status IN ('pending', 'sent', 'delivered', 'failed'))
);

-- Session Analytics
CREATE TABLE session_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL,
    session_id UUID REFERENCES money_date_sessions(id),
    completion_streak INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    successful_sessions INTEGER DEFAULT 0,
    average_duration DECIMAL(5,2),
    preferred_time_slot TIME,
    preferred_day_of_week INTEGER, -- 0-6 (Sunday-Saturday)
    last_session_date TIMESTAMPTZ,
    next_suggested_date TIMESTAMPTZ,
    engagement_score DECIMAL(3,2), -- 0.00 to 1.00
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduling Suggestions
CREATE TABLE scheduling_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL,
    suggested_date TIMESTAMPTZ NOT NULL,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    reasoning TEXT,
    factors JSONB, -- Store various factors like weather, calendar conflicts, etc.
    accepted BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_money_date_sessions_couple_id ON money_date_sessions(couple_id);
CREATE INDEX idx_money_date_sessions_scheduled_date ON money_date_sessions(scheduled_date);
CREATE INDEX idx_money_date_sessions_status ON money_date_sessions(status);
CREATE INDEX idx_reminder_preferences_user_id ON reminder_preferences(user_id);
CREATE INDEX idx_calendar_integrations_user_id ON calendar_integrations(user_id);
CREATE INDEX idx_notification_logs_session_id ON notification_logs(session_id);
CREATE INDEX idx_notification_logs_scheduled_for ON notification_logs(scheduled_for);
CREATE INDEX idx_session_analytics_couple_id ON session_analytics(couple_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_money_date_sessions_updated_at BEFORE UPDATE ON money_date_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminder_preferences_updated_at BEFORE UPDATE ON reminder_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_integrations_updated_at BEFORE UPDATE ON calendar_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_analytics_updated_at BEFORE UPDATE ON session_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(couple_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    completion_rate DECIMAL(3,2);
    consistency_score DECIMAL(3,2);
    engagement DECIMAL(3,2);
BEGIN
    -- Calculate completion rate
    SELECT 
        COALESCE(
            CAST(COUNT(*) FILTER (WHERE status = 'completed') AS DECIMAL) / 
            NULLIF(COUNT(*), 0), 
            0
        )
    INTO completion_rate
    FROM money_date_sessions 
    WHERE couple_id = couple_uuid 
    AND scheduled_date >= NOW() - INTERVAL '30 days';
    
    -- Calculate consistency (sessions in last 4 weeks)
    SELECT 
        LEAST(CAST(COUNT(*) AS DECIMAL) / 4.0, 1.0)
    INTO consistency_score
    FROM money_date_sessions 
    WHERE couple_id = couple_uuid 
    AND scheduled_date >= NOW() - INTERVAL '28 days'
    AND status IN ('completed', 'scheduled');
    
    -- Combined engagement score
    engagement = (completion_rate * 0.7) + (consistency_score * 0.3);
    
    RETURN engagement;
END;
$$ LANGUAGE plpgsql;

-- Function to check for missed sessions and update status
CREATE OR REPLACE FUNCTION check_missed_sessions()
RETURNS void AS $$
BEGIN
    UPDATE money_date_sessions 
    SET status = 'missed', updated_at = NOW()
    WHERE status = 'scheduled' 
    AND scheduled_date < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- Setup cron job to check for missed sessions (if pg_cron is available)
-- SELECT cron.schedule('check-missed-sessions', '*/30 * * * *', 'SELECT check_missed_sessions();'); 

-- Content Management System Tables

-- Content themes and categories
CREATE TABLE content_themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color_scheme JSONB, -- { primary: "#color", secondary: "#color", accent: "#color" }
  icon_url TEXT,
  season VARCHAR(50), -- 'spring', 'summer', 'fall', 'winter', 'year-round'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Mini-deck collections
CREATE TABLE content_decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  theme_id UUID REFERENCES content_themes(id),
  release_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'archived'
  subscription_level VARCHAR(50) DEFAULT 'free', -- 'free', 'core', 'plus', 'lifetime'
  card_count INTEGER DEFAULT 10,
  estimated_duration INTEGER, -- in minutes
  difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  tags TEXT[], -- searchable tags
  featured_image_url TEXT,
  creator_id UUID REFERENCES profiles(id),
  version INTEGER DEFAULT 1,
  parent_deck_id UUID REFERENCES content_decks(id), -- for deck variations
  metadata JSONB, -- flexible metadata storage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Individual cards within decks
CREATE TABLE content_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES content_decks(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL, -- rich text content
  card_type VARCHAR(50) DEFAULT 'conversation', -- 'conversation', 'activity', 'reflection', 'goal-setting'
  order_index INTEGER NOT NULL,
  estimated_time INTEGER, -- in minutes
  difficulty_level VARCHAR(50),
  formatting JSONB, -- rich text formatting data
  media_urls TEXT[], -- images, icons, etc.
  interaction_data JSONB, -- for interactive elements
  unlock_criteria JSONB, -- progressive unlock conditions
  is_premium BOOLEAN DEFAULT false,
  variant_group VARCHAR(100), -- for A/B testing
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Card variations for A/B testing
CREATE TABLE card_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_card_id UUID REFERENCES content_cards(id) ON DELETE CASCADE,
  variant_name VARCHAR(100) NOT NULL,
  title VARCHAR(300),
  content TEXT,
  formatting JSONB,
  media_urls TEXT[],
  traffic_percentage INTEGER DEFAULT 50, -- percentage of users who see this variant
  performance_metrics JSONB, -- engagement, completion rates, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User progress and engagement tracking
CREATE TABLE user_deck_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES content_decks(id) ON DELETE CASCADE,
  cards_completed INTEGER DEFAULT 0,
  total_cards INTEGER NOT NULL,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  time_spent INTEGER DEFAULT 0, -- total time in minutes
  favorite_cards UUID[], -- array of card IDs
  notes JSONB, -- user notes and insights
  UNIQUE(user_id, deck_id)
);

-- Individual card interactions
CREATE TABLE user_card_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES content_cards(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES content_decks(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- 'viewed', 'completed', 'favorited', 'shared', 'noted'
  interaction_data JSONB, -- additional data based on interaction type
  variant_id UUID REFERENCES card_variants(id), -- track which variant was shown
  session_id UUID, -- for grouping interactions by session
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Content scheduling and automation
CREATE TABLE content_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES content_decks(id) ON DELETE CASCADE,
  scheduled_action VARCHAR(50) NOT NULL, -- 'publish', 'unpublish', 'archive', 'notify'
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  action_data JSONB, -- additional parameters for the action
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'executed', 'failed'
  executed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notification templates and delivery
CREATE TABLE content_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(100) NOT NULL, -- 'new_deck_available', 'deck_completed', 'monthly_reminder'
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  template_data JSONB, -- template variables
  target_audience JSONB, -- subscription levels, user segments, etc.
  delivery_channels VARCHAR(50)[] DEFAULT ARRAY['in_app'], -- 'email', 'push', 'in_app', 'sms'
  scheduled_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'failed'
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE
);

-- User content preferences and customization
CREATE TABLE user_content_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  preferred_themes UUID[], -- array of theme IDs
  preferred_difficulty VARCHAR(50) DEFAULT 'intermediate',
  preferred_duration INTEGER DEFAULT 20, -- preferred session length in minutes
  notification_preferences JSONB, -- when and how to be notified
  content_filters JSONB, -- what types of content to show/hide
  accessibility_settings JSONB, -- font size, contrast, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Content analytics and insights
CREATE TABLE content_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES content_decks(id),
  card_id UUID REFERENCES content_cards(id),
  metric_name VARCHAR(100) NOT NULL, -- 'views', 'completions', 'shares', 'favorites', 'time_spent'
  metric_value DECIMAL(10,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  aggregation_level VARCHAR(50) DEFAULT 'daily', -- 'hourly', 'daily', 'weekly', 'monthly'
  segment_data JSONB, -- breakdown by subscription level, theme, etc.
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Content export and sharing
CREATE TABLE content_exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  export_type VARCHAR(50) NOT NULL, -- 'pdf', 'epub', 'json', 'csv'
  content_selection JSONB, -- what content to include
  export_settings JSONB, -- formatting, layout options
  file_url TEXT, -- URL to generated file
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  file_size INTEGER, -- in bytes
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Custom deck creation by users
CREATE TABLE user_custom_decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  source_cards UUID[], -- array of card IDs used as templates
  custom_cards JSONB[], -- user-created card content
  theme_customization JSONB, -- colors, fonts, styling
  sharing_settings JSONB, -- who can view/copy this deck
  like_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_content_decks_release_date ON content_decks(release_date);
CREATE INDEX idx_content_decks_status ON content_decks(status);
CREATE INDEX idx_content_decks_subscription_level ON content_decks(subscription_level);
CREATE INDEX idx_content_decks_theme_id ON content_decks(theme_id);
CREATE INDEX idx_content_cards_deck_id ON content_cards(deck_id);
CREATE INDEX idx_content_cards_order ON content_cards(deck_id, order_index);
CREATE INDEX idx_user_deck_progress_user_id ON user_deck_progress(user_id);
CREATE INDEX idx_user_deck_progress_completion ON user_deck_progress(completion_percentage);
CREATE INDEX idx_user_card_interactions_user_id ON user_card_interactions(user_id);
CREATE INDEX idx_user_card_interactions_timestamp ON user_card_interactions(timestamp);
CREATE INDEX idx_content_analytics_period ON content_analytics(period_start, period_end);
CREATE INDEX idx_content_themes_season ON content_themes(season);

-- Row Level Security (RLS)
ALTER TABLE content_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deck_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_decks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Content themes - public read access
CREATE POLICY "Public content themes are viewable by everyone" ON content_themes
  FOR SELECT USING (is_active = true);

-- Content decks - based on subscription level and publication status
CREATE POLICY "Published decks are viewable based on subscription" ON content_decks
  FOR SELECT USING (
    status = 'published' AND
    (
      subscription_level = 'free' OR
      (subscription_level = 'core' AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status IN ('core', 'plus', 'lifetime')
      )) OR
      (subscription_level = 'plus' AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status IN ('plus', 'lifetime')
      )) OR
      (subscription_level = 'lifetime' AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'lifetime'
      ))
    )
  );

-- Content cards - inherit deck permissions
CREATE POLICY "Cards are viewable if deck is accessible" ON content_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM content_decks d 
      WHERE d.id = deck_id AND
      d.status = 'published' AND
      (
        d.subscription_level = 'free' OR
        (d.subscription_level = 'core' AND EXISTS (
          SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status IN ('core', 'plus', 'lifetime')
        )) OR
        (d.subscription_level = 'plus' AND EXISTS (
          SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status IN ('plus', 'lifetime')
        )) OR
        (d.subscription_level = 'lifetime' AND EXISTS (
          SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'lifetime'
        ))
      )
    )
  );

-- User progress - users can only see their own progress
CREATE POLICY "Users can view and modify their own progress" ON user_deck_progress
  FOR ALL USING (auth.uid() = user_id);

-- User interactions - users can only see their own interactions
CREATE POLICY "Users can view and create their own interactions" ON user_card_interactions
  FOR ALL USING (auth.uid() = user_id);

-- User preferences - users can only see their own preferences
CREATE POLICY "Users can view and modify their own preferences" ON user_content_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Custom decks - users can see their own + public decks
CREATE POLICY "Users can view their own and public custom decks" ON user_custom_decks
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can modify their own custom decks" ON user_custom_decks
  FOR ALL USING (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_deck_completion()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_deck_progress 
  SET 
    completion_percentage = (NEW.cards_completed::DECIMAL / total_cards * 100),
    completed_at = CASE 
      WHEN NEW.cards_completed = total_cards AND OLD.cards_completed < total_cards 
      THEN NOW() 
      ELSE completed_at 
    END,
    last_accessed_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_deck_completion
  AFTER UPDATE OF cards_completed ON user_deck_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_deck_completion();

-- Function to track content analytics
CREATE OR REPLACE FUNCTION track_content_interaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Update daily analytics
  INSERT INTO content_analytics (deck_id, card_id, metric_name, metric_value, period_start, period_end)
  VALUES (
    NEW.deck_id,
    NEW.card_id,
    NEW.interaction_type,
    1,
    CURRENT_DATE,
    CURRENT_DATE
  )
  ON CONFLICT (deck_id, card_id, metric_name, period_start, period_end) 
  DO UPDATE SET 
    metric_value = content_analytics.metric_value + 1,
    recorded_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_content_interaction
  AFTER INSERT ON user_card_interactions
  FOR EACH ROW
  EXECUTE FUNCTION track_content_interaction();

-- Enable RLS
alter database postgres set "app.jwt_secret" to 'your-jwt-secret-here';

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  partner_id uuid references public.profiles(id),
  relationship_status text check (relationship_status in ('single', 'dating', 'engaged', 'married')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscription_tiers table
create table public.subscription_tiers (
  id serial primary key,
  name text not null unique,
  slug text not null unique,
  price_monthly decimal(10,2),
  price_yearly decimal(10,2),
  conversation_limit integer, -- null means unlimited
  features jsonb not null default '[]'::jsonb,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_subscriptions table
create table public.user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tier_id integer references public.subscription_tiers(id) not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  billing_interval text check (billing_interval in ('monthly', 'yearly')),
  status text check (status in ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')) default 'active',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create conversation_usage table
create table public.conversation_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  month_year date not null, -- first day of the month
  conversations_used integer default 0,
  conversations_limit integer, -- snapshot of limit at time of creation
  reset_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, month_year)
);

-- Create feature_access table
create table public.feature_access (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  feature_name text not null,
  access_level text check (access_level in ('none', 'basic', 'full')) default 'none',
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, feature_name)
);

-- Create conversations table
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  partner_id uuid references public.profiles(id) on delete cascade,
  template_id text,
  title text not null,
  category text,
  ai_model text default 'basic',
  conversation_data jsonb not null default '{}'::jsonb,
  status text check (status in ('draft', 'active', 'completed', 'archived')) default 'draft',
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create conversation_messages table
create table public.conversation_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  message_type text check (message_type in ('user', 'ai', 'system')) not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create progress_tracking table
create table public.progress_tracking (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  partner_id uuid references public.profiles(id) on delete cascade,
  metric_name text not null,
  metric_value numeric,
  period_start date not null,
  period_end date not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, partner_id, metric_name, period_start)
);

-- Create support_tickets table
create table public.support_tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  description text not null,
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  status text check (status in ('open', 'in_progress', 'resolved', 'closed')) default 'open',
  assigned_to text,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create coaching_sessions table
create table public.coaching_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  partner_id uuid references public.profiles(id) on delete cascade,
  session_type text check (session_type in ('video_call', 'group_session', 'one_on_one')) not null,
  status text check (status in ('scheduled', 'completed', 'canceled', 'no_show')) default 'scheduled',
  scheduled_at timestamp with time zone not null,
  duration_minutes integer default 30,
  coach_name text,
  session_notes text,
  recording_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default subscription tiers
insert into public.subscription_tiers (name, slug, price_monthly, price_yearly, conversation_limit, features, sort_order) values
('First Steps', 'first-steps', 0.00, 0.00, 5, 
 '["basic_templates", "compatibility_assessment", "community_readonly", "foundational_articles"]'::jsonb, 1),
('Building Together', 'building-together', 14.99, 149.00, 25, 
 '["advanced_templates", "goal_tracking", "progress_reports", "community_participation", "email_support"]'::jsonb, 2),
('Financial Partners', 'financial-partners', 29.99, 299.00, null, 
 '["unlimited_conversations", "custom_templates", "analytics_dashboard", "financial_worksheets", "video_support", "early_access"]'::jsonb, 3),
('Wealth Builders', 'wealth-builders', 59.99, 599.00, null, 
 '["personal_ai_advisor", "financial_modeling", "account_integration", "expert_sessions", "coaching_calls", "priority_support"]'::jsonb, 4);

-- Create function to get user's current subscription
create or replace function get_user_subscription(user_uuid uuid)
returns table (
  tier_name text,
  tier_slug text,
  conversation_limit integer,
  features jsonb,
  status text,
  period_end timestamp with time zone
) as $$
begin
  return query
  select 
    st.name as tier_name,
    st.slug as tier_slug,
    st.conversation_limit,
    st.features,
    coalesce(us.status, 'active') as status,
    us.current_period_end as period_end
  from public.profiles p
  left join public.user_subscriptions us on p.id = us.user_id and us.status = 'active'
  left join public.subscription_tiers st on coalesce(us.tier_id, 1) = st.id
  where p.id = user_uuid;
end;
$$ language plpgsql security definer;

-- Create function to track conversation usage
create or replace function track_conversation_usage(user_uuid uuid)
returns boolean as $$
declare
  current_month date;
  usage_record record;
  user_tier record;
begin
  -- Get first day of current month
  current_month := date_trunc('month', current_date);
  
  -- Get user's current subscription
  select * into user_tier from get_user_subscription(user_uuid) limit 1;
  
  -- Get or create usage record for current month
  select * into usage_record 
  from public.conversation_usage 
  where user_id = user_uuid and month_year = current_month;
  
  if not found then
    -- Create new usage record
    insert into public.conversation_usage (
      user_id, 
      month_year, 
      conversations_used, 
      conversations_limit,
      reset_date
    ) values (
      user_uuid,
      current_month,
      1,
      user_tier.conversation_limit,
      (current_month + interval '1 month')::timestamp with time zone
    );
  else
    -- Update existing record
    update public.conversation_usage
    set conversations_used = conversations_used + 1,
        updated_at = now()
    where user_id = user_uuid and month_year = current_month;
  end if;
  
  return true;
end;
$$ language plpgsql security definer;

-- Create function to check if user can start conversation
create or replace function can_start_conversation(user_uuid uuid)
returns boolean as $$
declare
  current_month date;
  usage_record record;
  user_tier record;
begin
  -- Get first day of current month
  current_month := date_trunc('month', current_date);
  
  -- Get user's current subscription
  select * into user_tier from get_user_subscription(user_uuid) limit 1;
  
  -- If unlimited conversations (null limit), always allow
  if user_tier.conversation_limit is null then
    return true;
  end if;
  
  -- Get usage record for current month
  select * into usage_record 
  from public.conversation_usage 
  where user_id = user_uuid and month_year = current_month;
  
  -- If no usage record exists, they can start
  if not found then
    return true;
  end if;
  
  -- Check if under limit
  return usage_record.conversations_used < user_tier.conversation_limit;
end;
$$ language plpgsql security definer;

-- Create function to update user subscription
create or replace function update_user_subscription(
  user_uuid uuid,
  new_tier_id integer,
  stripe_sub_id text default null,
  billing_period text default 'monthly'
)
returns uuid as $$
declare
  subscription_id uuid;
begin
  -- Deactivate existing subscription
  update public.user_subscriptions
  set status = 'canceled',
      canceled_at = now(),
      updated_at = now()
  where user_id = user_uuid and status = 'active';
  
  -- Create new subscription
  insert into public.user_subscriptions (
    user_id,
    tier_id,
    stripe_subscription_id,
    billing_interval,
    status,
    current_period_start,
    current_period_end
  ) values (
    user_uuid,
    new_tier_id,
    stripe_sub_id,
    billing_period,
    'active',
    now(),
    case 
      when billing_period = 'yearly' then now() + interval '1 year'
      else now() + interval '1 month'
    end
  ) returning id into subscription_id;
  
  return subscription_id;
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.conversation_usage enable row level security;
alter table public.feature_access enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.progress_tracking enable row level security;
alter table public.support_tickets enable row level security;
alter table public.coaching_sessions enable row level security;

-- Create RLS policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can view own subscriptions" on public.user_subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can view own usage" on public.conversation_usage
  for select using (auth.uid() = user_id);

create policy "Users can view own conversations" on public.conversations
  for all using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Users can view conversation messages" on public.conversation_messages
  for select using (
    exists (
      select 1 from public.conversations c 
      where c.id = conversation_id 
      and (c.user_id = auth.uid() or c.partner_id = auth.uid())
    )
  );

-- Create indexes for performance
create index idx_user_subscriptions_user_id on public.user_subscriptions(user_id);
create index idx_user_subscriptions_status on public.user_subscriptions(status);
create index idx_conversation_usage_user_month on public.conversation_usage(user_id, month_year);
create index idx_conversations_user_id on public.conversations(user_id);
create index idx_conversations_partner_id on public.conversations(partner_id);
create index idx_conversation_messages_conversation_id on public.conversation_messages(conversation_id);
create index idx_profiles_partner_id on public.profiles(partner_id);

-- Create triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute procedure update_updated_at_column();

create trigger update_user_subscriptions_updated_at before update on public.user_subscriptions
  for each row execute procedure update_updated_at_column();

create trigger update_conversation_usage_updated_at before update on public.conversation_usage
  for each row execute procedure update_updated_at_column();

create trigger update_feature_access_updated_at before update on public.feature_access
  for each row execute procedure update_updated_at_column();

create trigger update_conversations_updated_at before update on public.conversations
  for each row execute procedure update_updated_at_column();

create trigger update_progress_tracking_updated_at before update on public.progress_tracking
  for each row execute procedure update_updated_at_column();

create trigger update_support_tickets_updated_at before update on public.support_tickets
  for each row execute procedure update_updated_at_column();

create trigger update_coaching_sessions_updated_at before update on public.coaching_sessions
  for each row execute procedure update_updated_at_column(); 