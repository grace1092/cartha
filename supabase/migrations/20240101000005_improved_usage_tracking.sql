-- Enhanced Usage Tracking Migration
-- Add message_count to conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create monthly_usage table for better tracking
CREATE TABLE IF NOT EXISTS monthly_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  conversation_count INTEGER DEFAULT 0,
  total_messages_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_monthly_usage_user_month ON monthly_usage(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_conversations_user_active ON conversations(user_id, is_active);

-- Function to get current month usage
CREATE OR REPLACE FUNCTION get_current_month_usage(p_user_id UUID)
RETURNS TABLE(
  conversation_count INTEGER,
  total_messages_used INTEGER,
  conversations_remaining INTEGER,
  is_premium BOOLEAN
) AS $$
DECLARE
  current_month TEXT := TO_CHAR(NOW(), 'YYYY-MM');
  usage_record RECORD;
  user_subscription RECORD;
  free_limit INTEGER := 3;
BEGIN
  -- Get user subscription status
  SELECT COALESCE(us.status = 'active', false) AS is_premium_user
  INTO user_subscription
  FROM profiles p
  LEFT JOIN user_subscriptions us ON p.id = us.user_id AND us.status = 'active'
  WHERE p.id = p_user_id;
  
  -- Get or create monthly usage record
  INSERT INTO monthly_usage (user_id, month_year, conversation_count, total_messages_used)
  VALUES (p_user_id, current_month, 0, 0)
  ON CONFLICT (user_id, month_year) DO NOTHING;
  
  -- Get current usage
  SELECT 
    COALESCE(conversation_count, 0) as conv_count,
    COALESCE(total_messages_used, 0) as msg_count
  INTO usage_record
  FROM monthly_usage
  WHERE user_id = p_user_id AND month_year = current_month;
  
  -- Return usage data
  RETURN QUERY SELECT
    usage_record.conv_count,
    usage_record.msg_count,
    CASE 
      WHEN user_subscription.is_premium_user THEN 999999 -- Unlimited for premium
      ELSE GREATEST(0, free_limit - usage_record.conv_count)
    END as conversations_remaining,
    COALESCE(user_subscription.is_premium_user, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can start new conversation
CREATE OR REPLACE FUNCTION can_start_conversation(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  usage RECORD;
BEGIN
  SELECT * INTO usage FROM get_current_month_usage(p_user_id);
  
  -- Premium users can always start conversations
  IF usage.is_premium THEN
    RETURN true;
  END IF;
  
  -- Free users check limit
  RETURN usage.conversations_remaining > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can send message in conversation
CREATE OR REPLACE FUNCTION can_send_message(p_user_id UUID, p_conversation_id UUID)
RETURNS TABLE(
  can_send BOOLEAN,
  messages_remaining INTEGER,
  is_premium BOOLEAN,
  current_message_count INTEGER
) AS $$
DECLARE
  usage RECORD;
  conv_record RECORD;
  free_msg_limit INTEGER := 10;
  premium_msg_limit INTEGER := 20;
BEGIN
  SELECT * INTO usage FROM get_current_month_usage(p_user_id);
  
  -- Get conversation message count
  SELECT 
    COALESCE(message_count, 0) as msg_count,
    is_active
  INTO conv_record
  FROM conversations
  WHERE id = p_conversation_id AND user_id = p_user_id;
  
  -- If conversation doesn't exist or is inactive
  IF NOT FOUND OR NOT conv_record.is_active THEN
    RETURN QUERY SELECT false, 0, usage.is_premium, 0;
    RETURN;
  END IF;
  
  -- Return based on subscription status
  IF usage.is_premium THEN
    RETURN QUERY SELECT
      conv_record.msg_count < premium_msg_limit,
      GREATEST(0, premium_msg_limit - conv_record.msg_count),
      true,
      conv_record.msg_count;
  ELSE
    RETURN QUERY SELECT
      conv_record.msg_count < free_msg_limit,
      GREATEST(0, free_msg_limit - conv_record.msg_count),
      false,
      conv_record.msg_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage after successful message
CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID, p_conversation_id UUID)
RETURNS VOID AS $$
DECLARE
  current_month TEXT := TO_CHAR(NOW(), 'YYYY-MM');
BEGIN
  -- Increment conversation message count
  UPDATE conversations 
  SET 
    message_count = COALESCE(message_count, 0) + 1,
    updated_at = NOW()
  WHERE id = p_conversation_id AND user_id = p_user_id;
  
  -- Increment monthly usage
  UPDATE monthly_usage
  SET 
    total_messages_used = total_messages_used + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id AND month_year = current_month;
  
  -- If this is a new conversation (first message), increment conversation count
  UPDATE monthly_usage
  SET 
    conversation_count = conversation_count + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id 
    AND month_year = current_month
    AND NOT EXISTS (
      SELECT 1 FROM conversations 
      WHERE user_id = p_user_id 
        AND id = p_conversation_id 
        AND message_count > 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_current_month_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_start_conversation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_send_message(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_usage(UUID, UUID) TO authenticated;

-- Enable RLS on monthly_usage
ALTER TABLE monthly_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for monthly_usage
CREATE POLICY "Users can view own usage" ON monthly_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON monthly_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON monthly_usage
  FOR UPDATE USING (auth.uid() = user_id); 