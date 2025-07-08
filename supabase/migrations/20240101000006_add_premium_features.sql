-- Premium Features Migration
-- Add tables for Money Date Calendar, Goal Tracking, and other premium features

-- Money Dates Table
CREATE TABLE IF NOT EXISTS money_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('budget_review', 'goal_check', 'spending_review', 'investment_discussion', 'custom')),
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'missed')) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Goals Table
CREATE TABLE IF NOT EXISTS financial_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) DEFAULT 0,
  target_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('emergency', 'house', 'car', 'vacation', 'education', 'retirement', 'wedding', 'other')),
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Score Data Table
CREATE TABLE IF NOT EXISTS financial_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  communication_score INTEGER NOT NULL CHECK (communication_score >= 0 AND communication_score <= 100),
  goal_alignment_score INTEGER NOT NULL CHECK (goal_alignment_score >= 0 AND goal_alignment_score <= 100),
  spending_compatibility_score INTEGER NOT NULL CHECK (spending_compatibility_score >= 0 AND spending_compatibility_score <= 100),
  planning_score INTEGER NOT NULL CHECK (planning_score >= 0 AND planning_score <= 100),
  conversation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation Templates Table
CREATE TABLE IF NOT EXISTS conversation_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  questions JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget Integration Table
CREATE TABLE IF NOT EXISTS budget_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('mint', 'ynab', 'personal_capital', 'manual')),
  account_data JSONB,
  last_sync TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievement/Milestone Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_money_dates_user_date ON money_dates(user_id, date);
CREATE INDEX IF NOT EXISTS idx_financial_goals_user_status ON financial_goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_financial_scores_user ON financial_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_templates_category ON conversation_templates(category, is_premium);
CREATE INDEX IF NOT EXISTS idx_budget_integrations_user ON budget_integrations(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);

-- Enable RLS on all tables
ALTER TABLE money_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for money_dates
CREATE POLICY "Users can view own money dates" ON money_dates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own money dates" ON money_dates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own money dates" ON money_dates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own money dates" ON money_dates
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for financial_goals
CREATE POLICY "Users can view own financial goals" ON financial_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial goals" ON financial_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial goals" ON financial_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial goals" ON financial_goals
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for financial_scores
CREATE POLICY "Users can view own financial scores" ON financial_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial scores" ON financial_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial scores" ON financial_scores
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for conversation_templates (public read, admin write)
CREATE POLICY "Anyone can view conversation templates" ON conversation_templates
  FOR SELECT TO authenticated USING (true);

-- RLS policies for budget_integrations
CREATE POLICY "Users can view own budget integrations" ON budget_integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget integrations" ON budget_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget integrations" ON budget_integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget integrations" ON budget_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for achievements
CREATE POLICY "Users can view own achievements" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to calculate financial compatibility score
CREATE OR REPLACE FUNCTION calculate_financial_score(p_user_id UUID)
RETURNS TABLE(
  overall_score INTEGER,
  communication_score INTEGER,
  goal_alignment_score INTEGER,
  spending_compatibility_score INTEGER,
  planning_score INTEGER,
  conversation_count INTEGER
) AS $$
DECLARE
  conv_count INTEGER;
  base_score INTEGER;
  days_active INTEGER;
BEGIN
  -- Get conversation count
  SELECT COUNT(*) INTO conv_count
  FROM conversations 
  WHERE user_id = p_user_id;
  
  -- Get days since first conversation
  SELECT COALESCE(EXTRACT(DAY FROM (NOW() - MIN(created_at))), 0) INTO days_active
  FROM conversations
  WHERE user_id = p_user_id;
  
  -- Calculate base score (simplified algorithm)
  base_score := LEAST(50 + (conv_count * 8), 95);
  
  -- Return calculated scores (with some variance for realism)
  RETURN QUERY SELECT
    base_score + (RANDOM() * 10 - 5)::INTEGER as overall_score,
    base_score + (RANDOM() * 10 - 5)::INTEGER as communication_score,
    base_score + (RANDOM() * 10 - 5)::INTEGER as goal_alignment_score,
    base_score + (RANDOM() * 10 - 5)::INTEGER as spending_compatibility_score,
    base_score + (RANDOM() * 10 - 5)::INTEGER as planning_score,
    conv_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award achievements
CREATE OR REPLACE FUNCTION award_achievement(p_user_id UUID, p_achievement_type TEXT, p_title TEXT, p_description TEXT, p_icon TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  -- Check if user already has this achievement
  IF NOT EXISTS (SELECT 1 FROM achievements WHERE user_id = p_user_id AND achievement_type = p_achievement_type) THEN
    INSERT INTO achievements (user_id, achievement_type, title, description, icon)
    VALUES (p_user_id, p_achievement_type, p_title, p_description, p_icon);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and award milestone achievements
CREATE OR REPLACE FUNCTION check_milestone_achievements(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  conv_count INTEGER;
  goal_count INTEGER;
  completed_goals INTEGER;
BEGIN
  -- Get conversation count
  SELECT COUNT(*) INTO conv_count FROM conversations WHERE user_id = p_user_id;
  
  -- Get goal statistics
  SELECT COUNT(*) INTO goal_count FROM financial_goals WHERE user_id = p_user_id;
  SELECT COUNT(*) INTO completed_goals FROM financial_goals WHERE user_id = p_user_id AND status = 'completed';
  
  -- Award conversation milestones
  IF conv_count >= 1 THEN
    PERFORM award_achievement(p_user_id, 'first_conversation', 'First Steps', 'Started your first financial conversation', '💬');
  END IF;
  
  IF conv_count >= 5 THEN
    PERFORM award_achievement(p_user_id, 'five_conversations', 'Getting Started', 'Completed 5 financial conversations', '🚀');
  END IF;
  
  IF conv_count >= 10 THEN
    PERFORM award_achievement(p_user_id, 'ten_conversations', 'Conversation Champion', 'Completed 10 financial conversations', '🏆');
  END IF;
  
  -- Award goal milestones
  IF goal_count >= 1 THEN
    PERFORM award_achievement(p_user_id, 'first_goal', 'Goal Setter', 'Created your first financial goal', '🎯');
  END IF;
  
  IF completed_goals >= 1 THEN
    PERFORM award_achievement(p_user_id, 'first_goal_completed', 'Goal Achiever', 'Completed your first financial goal', '⭐');
  END IF;
  
  IF completed_goals >= 3 THEN
    PERFORM award_achievement(p_user_id, 'three_goals_completed', 'Goal Master', 'Completed 3 financial goals', '👑');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION calculate_financial_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION award_achievement(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_milestone_achievements(UUID) TO authenticated;

-- Insert some default conversation templates
INSERT INTO conversation_templates (title, description, category, difficulty, questions, is_premium) VALUES
(
  'Emergency Fund Planning',
  'Discuss how much to save for emergencies',
  'savings',
  'beginner',
  '[
    "How much should we save for emergencies?",
    "What counts as a financial emergency?",
    "Where should we keep our emergency fund?",
    "How quickly should we build our emergency fund?"
  ]'::jsonb,
  false
),
(
  'Home Buying Discussion',
  'Plan for purchasing your first home together',
  'major_purchase',
  'intermediate',
  '[
    "What is our ideal home buying timeline?",
    "How much can we afford for a down payment?",
    "What are our must-haves vs nice-to-haves?",
    "Should we consider a fixer-upper or move-in ready?",
    "What neighborhoods are we considering?"
  ]'::jsonb,
  true
),
(
  'Retirement Planning Deep Dive',
  'Comprehensive retirement planning discussion',
  'retirement',
  'advanced',
  '[
    "What is our ideal retirement age?",
    "How much do we need to save for retirement?",
    "What kind of lifestyle do we want in retirement?",
    "Should we prioritize 401k or IRA contributions?",
    "How do we balance retirement savings with other goals?"
  ]'::jsonb,
  true
),
(
  'Monthly Budget Review',
  'Regular budget check-in and optimization',
  'budgeting',
  'intermediate',
  '[
    "How did we do against our budget last month?",
    "What categories did we overspend in?",
    "Are there any expenses we can cut?",
    "Do we need to adjust our budget categories?",
    "What worked well with our spending plan?"
  ]'::jsonb,
  true
),
(
  'Investment Philosophy',
  'Understand each others investment approach',
  'investing',
  'advanced',
  '[
    "What is our risk tolerance for investments?",
    "Do we prefer individual stocks or index funds?",
    "How much should we invest vs save in cash?",
    "Should we hire a financial advisor?",
    "What are our thoughts on cryptocurrency?"
  ]'::jsonb,
  true
);

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_money_dates_updated_at BEFORE UPDATE ON money_dates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_goals_updated_at BEFORE UPDATE ON financial_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_scores_updated_at BEFORE UPDATE ON financial_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversation_templates_updated_at BEFORE UPDATE ON conversation_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_integrations_updated_at BEFORE UPDATE ON budget_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 