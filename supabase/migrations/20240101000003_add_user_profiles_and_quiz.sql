-- User profiles table for onboarding data
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    partner_name TEXT,
    relationship_status TEXT NOT NULL CHECK (relationship_status IN ('dating', 'engaged', 'married', 'cohabiting')),
    primary_goal TEXT NOT NULL CHECK (primary_goal IN ('communication', 'planning', 'debt', 'saving', 'investing', 'future')),
    personality_type TEXT CHECK (personality_type IN ('security', 'freedom', 'status', 'stress')),
    personality_result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    answer_value TEXT NOT NULL,
    answer_label TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_text TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    conversation_type TEXT DEFAULT 'general' CHECK (conversation_type IN ('general', 'personality', 'compatibility', 'goal_setting')),
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation usage tracking
CREATE TABLE IF NOT EXISTS conversation_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
    conversations_used INTEGER DEFAULT 0,
    conversations_limit INTEGER DEFAULT 5, -- Based on subscription tier
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month_year)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_usage_user_id ON conversation_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_usage_month ON conversation_usage(month_year);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_usage_updated_at 
    BEFORE UPDATE ON conversation_usage 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get or create conversation usage for current month
CREATE OR REPLACE FUNCTION get_or_create_conversation_usage(user_uuid UUID)
RETURNS conversation_usage AS $$
DECLARE
    current_month TEXT;
    usage_record conversation_usage;
    user_tier TEXT;
    tier_limit INTEGER;
BEGIN
    current_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    -- Get user's subscription tier
    SELECT tier INTO user_tier 
    FROM user_subscriptions 
    WHERE user_id = user_uuid AND status = 'active'
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Default to free tier if no subscription found
    IF user_tier IS NULL THEN
        user_tier := 'free';
    END IF;
    
    -- Set conversation limit based on tier
    CASE user_tier
        WHEN 'free' THEN tier_limit := 5;
        WHEN 'building_together' THEN tier_limit := 25;
        WHEN 'financial_partners' THEN tier_limit := 999999; -- Unlimited
        WHEN 'wealth_builders' THEN tier_limit := 999999; -- Unlimited
        ELSE tier_limit := 5; -- Default to free
    END CASE;
    
    -- Try to get existing record
    SELECT * INTO usage_record
    FROM conversation_usage
    WHERE user_id = user_uuid AND month_year = current_month;
    
    -- Create new record if doesn't exist
    IF NOT FOUND THEN
        INSERT INTO conversation_usage (user_id, month_year, conversations_used, conversations_limit)
        VALUES (user_uuid, current_month, 0, tier_limit)
        RETURNING * INTO usage_record;
    ELSE
        -- Update limit in case tier changed
        UPDATE conversation_usage 
        SET conversations_limit = tier_limit,
            updated_at = NOW()
        WHERE user_id = user_uuid AND month_year = current_month
        RETURNING * INTO usage_record;
    END IF;
    
    RETURN usage_record;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can start new conversation
CREATE OR REPLACE FUNCTION can_start_conversation(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    usage_record conversation_usage;
BEGIN
    SELECT * INTO usage_record FROM get_or_create_conversation_usage(user_uuid);
    RETURN usage_record.conversations_used < usage_record.conversations_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to track conversation usage
CREATE OR REPLACE FUNCTION track_conversation_usage(user_uuid UUID)
RETURNS conversation_usage AS $$
DECLARE
    usage_record conversation_usage;
BEGIN
    -- Get or create current month's usage
    SELECT * INTO usage_record FROM get_or_create_conversation_usage(user_uuid);
    
    -- Check if user can start conversation
    IF usage_record.conversations_used >= usage_record.conversations_limit THEN
        RAISE EXCEPTION 'Monthly conversation limit reached';
    END IF;
    
    -- Increment usage
    UPDATE conversation_usage 
    SET conversations_used = conversations_used + 1,
        updated_at = NOW()
    WHERE user_id = user_uuid AND month_year = TO_CHAR(NOW(), 'YYYY-MM')
    RETURNING * INTO usage_record;
    
    RETURN usage_record;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quiz results" ON quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results" ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON conversation_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON conversation_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON conversation_usage FOR UPDATE USING (auth.uid() = user_id); 