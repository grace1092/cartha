-- Update subscription plan enum to match new pricing tiers
ALTER TYPE subscription_plan RENAME TO subscription_plan_old;

CREATE TYPE subscription_plan AS ENUM ('solo_practice', 'group_practice', 'enterprise');

-- Create subscription_tiers table for the new pricing structure
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER NOT NULL,
  conversation_limit INTEGER, -- null means unlimited
  features TEXT[] NOT NULL,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_subscriptions table for the new structure
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier_id INTEGER REFERENCES subscription_tiers(id) NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_usage table for tracking conversation limits
CREATE TABLE IF NOT EXISTS conversation_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL, -- YYYY-MM format
  conversations_used INTEGER DEFAULT 0,
  conversations_limit INTEGER,
  reset_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Insert the new pricing tiers
INSERT INTO subscription_tiers (name, slug, price_monthly, price_yearly, conversation_limit, features, sort_order) VALUES
(
  'Solo Practice',
  'solo_practice',
  4900, -- $49.00 in cents
  49000, -- $490.00 in cents (10 months for yearly)
  50,
  ARRAY[
    'basic_templates',
    'advanced_templates', 
    'compatibility_assessment',
    'goal_tracking',
    'progress_reports',
    'foundational_articles',
    'financial_worksheets',
    'email_support'
  ],
  1
),
(
  'Group Practice',
  'group_practice', 
  14900, -- $149.00 in cents
  149000, -- $1,490.00 in cents (10 months for yearly)
  200,
  ARRAY[
    'basic_templates',
    'advanced_templates',
    'custom_templates',
    'compatibility_assessment', 
    'goal_tracking',
    'progress_reports',
    'analytics_dashboard',
    'foundational_articles',
    'financial_worksheets',
    'early_access',
    'community_readonly',
    'email_support',
    'video_support'
  ],
  2
),
(
  'Enterprise',
  'enterprise',
  49900, -- $499.00 in cents
  499000, -- $4,990.00 in cents (10 months for yearly)
  NULL, -- unlimited
  ARRAY[
    'basic_templates',
    'advanced_templates', 
    'custom_templates',
    'unlimited_conversations',
    'compatibility_assessment',
    'goal_tracking',
    'progress_reports',
    'analytics_dashboard',
    'foundational_articles',
    'financial_worksheets',
    'early_access',
    'community_readonly',
    'community_participation',
    'email_support',
    'video_support',
    'priority_support',
    'personal_ai_advisor',
    'financial_modeling',
    'account_integration',
    'expert_sessions',
    'coaching_calls'
  ],
  3
);

-- Create indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_conversation_usage_user_month ON conversation_usage(user_id, month_year);

-- Enable RLS
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view active subscription tiers" ON subscription_tiers FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view their own conversation usage" ON conversation_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage conversation usage" ON conversation_usage FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Update trigger for updated_at
CREATE TRIGGER update_subscription_tiers_updated_at BEFORE UPDATE ON subscription_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_usage_updated_at BEFORE UPDATE ON conversation_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 