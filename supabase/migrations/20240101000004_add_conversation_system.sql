-- Create conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    conversation_type TEXT DEFAULT 'general' CHECK (conversation_type IN ('general', 'conflict', 'planning', 'debt', 'goals', 'styles', 'personality', 'compatibility')),
    quality_tier TEXT DEFAULT 'free' CHECK (quality_tier IN ('free', 'premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai')),
    content TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monthly_usage table
CREATE TABLE monthly_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: YYYY-MM
    conversation_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month_year)
);

-- Create indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_monthly_usage_user_month ON monthly_usage(user_id, month_year);

-- Create RLS policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_usage ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages from their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
    );

-- Monthly usage policies
CREATE POLICY "Users can view their own usage" ON monthly_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own usage records" ON monthly_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage records" ON monthly_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to check if user can start a new conversation
CREATE OR REPLACE FUNCTION can_start_conversation(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_month TEXT;
    usage_count INTEGER;
    user_tier TEXT;
BEGIN
    -- Get current month in YYYY-MM format
    current_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    -- Get user's subscription tier
    SELECT subscription_tier INTO user_tier 
    FROM user_profiles 
    WHERE user_id = user_uuid;
    
    -- Premium users have unlimited conversations
    IF user_tier = 'premium' THEN
        RETURN TRUE;
    END IF;
    
    -- Check current month usage
    SELECT COALESCE(conversation_count, 0) INTO usage_count
    FROM monthly_usage
    WHERE user_id = user_uuid AND month_year = current_month;
    
          -- Free users are limited to 3 conversations per month
      RETURN COALESCE(usage_count, 0) < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track conversation usage
CREATE OR REPLACE FUNCTION track_conversation_usage(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    current_month TEXT;
BEGIN
    -- Get current month in YYYY-MM format
    current_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    -- Insert or update usage record
    INSERT INTO monthly_usage (user_id, month_year, conversation_count)
    VALUES (user_uuid, current_month, 1)
    ON CONFLICT (user_id, month_year)
    DO UPDATE SET 
        conversation_count = monthly_usage.conversation_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET updated_at = NOW() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp when messages are added
CREATE TRIGGER update_conversation_on_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- Add subscription_tier column to user_profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' 
                   AND column_name = 'subscription_tier') THEN
        ALTER TABLE user_profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium'));
    END IF;
END $$; 