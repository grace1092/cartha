-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'canceled', 'past_due');
CREATE TYPE subscription_plan AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE session_status AS ENUM ('draft', 'completed', 'billed');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  practice_name TEXT,
  phone TEXT,
  license_number TEXT,
  subscription_status subscription_status DEFAULT 'trial',
  subscription_plan subscription_plan DEFAULT 'starter',
  stripe_customer_id TEXT,
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  intake_date DATE DEFAULT CURRENT_DATE,
  treatment_goals TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Therapy sessions table
CREATE TABLE therapy_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 50,
  session_type TEXT DEFAULT 'individual',
  bullet_notes TEXT,
  soap_summary TEXT,
  follow_up_email TEXT,
  status session_status DEFAULT 'draft',
  session_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client files table (for document storage)
CREATE TABLE client_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription history table
CREATE TABLE subscription_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT,
  plan subscription_plan NOT NULL,
  status subscription_status NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table (for rate limiting and analytics)
CREATE TABLE usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  feature_type TEXT NOT NULL, -- 'soap_generation', 'follow_up_email', 'pdf_export'
  usage_date DATE DEFAULT CURRENT_DATE,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, feature_type, usage_date)
);

-- Indexes for better performance
CREATE INDEX idx_clients_therapist_id ON clients(therapist_id);
CREATE INDEX idx_clients_active ON clients(therapist_id, is_active);
CREATE INDEX idx_sessions_client_id ON therapy_sessions(client_id);
CREATE INDEX idx_sessions_therapist_id ON therapy_sessions(therapist_id);
CREATE INDEX idx_sessions_date ON therapy_sessions(session_date);
CREATE INDEX idx_files_client_id ON client_files(client_id);
CREATE INDEX idx_usage_tracking_user_feature ON usage_tracking(user_id, feature_type, usage_date);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Clients policies
CREATE POLICY "Therapists can view own clients" ON clients FOR SELECT USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = therapist_id);
CREATE POLICY "Therapists can update own clients" ON clients FOR UPDATE USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can delete own clients" ON clients FOR DELETE USING (auth.uid() = therapist_id);

-- Sessions policies
CREATE POLICY "Therapists can view own sessions" ON therapy_sessions FOR SELECT USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can insert own sessions" ON therapy_sessions FOR INSERT WITH CHECK (auth.uid() = therapist_id);
CREATE POLICY "Therapists can update own sessions" ON therapy_sessions FOR UPDATE USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can delete own sessions" ON therapy_sessions FOR DELETE USING (auth.uid() = therapist_id);

-- Files policies
CREATE POLICY "Therapists can view own client files" ON client_files FOR SELECT USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can insert own client files" ON client_files FOR INSERT WITH CHECK (auth.uid() = therapist_id);
CREATE POLICY "Therapists can delete own client files" ON client_files FOR DELETE USING (auth.uid() = therapist_id);

-- Subscription history policies
CREATE POLICY "Users can view own subscription history" ON subscription_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription history" ON subscription_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON therapy_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment usage tracking
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_feature_type TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_tracking (user_id, feature_type, usage_count)
  VALUES (p_user_id, p_feature_type, 1)
  ON CONFLICT (user_id, feature_type, usage_date)
  DO UPDATE SET usage_count = usage_tracking.usage_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limits(
  p_user_id UUID,
  p_feature_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan subscription_plan;
  user_status subscription_status;
  trial_end TIMESTAMP WITH TIME ZONE;
  current_usage INTEGER;
BEGIN
  -- Get user subscription info
  SELECT subscription_plan, subscription_status, trial_ends_at
  INTO user_plan, user_status, trial_end
  FROM profiles WHERE id = p_user_id;
  
  -- Check if trial has expired
  IF user_status = 'trial' AND trial_end < NOW() THEN
    RETURN FALSE;
  END IF;
  
  -- Check if subscription is active
  IF user_status NOT IN ('trial', 'active') THEN
    RETURN FALSE;
  END IF;
  
  -- Get current usage
  SELECT COALESCE(usage_count, 0)
  INTO current_usage
  FROM usage_tracking
  WHERE user_id = p_user_id 
    AND feature_type = p_feature_type 
    AND usage_date = CURRENT_DATE;
  
  -- Check limits based on plan
  CASE user_plan
    WHEN 'starter' THEN
      CASE p_feature_type
        WHEN 'soap_generation' THEN RETURN current_usage < 50;
        WHEN 'follow_up_email' THEN RETURN current_usage < 25;
        WHEN 'pdf_export' THEN RETURN current_usage < 10;
        ELSE RETURN TRUE;
      END CASE;
    WHEN 'professional' THEN
      CASE p_feature_type
        WHEN 'soap_generation' THEN RETURN current_usage < 500;
        WHEN 'follow_up_email' THEN RETURN current_usage < 200;
        WHEN 'pdf_export' THEN RETURN current_usage < 100;
        ELSE RETURN TRUE;
      END CASE;
    WHEN 'enterprise' THEN
      RETURN TRUE; -- Unlimited
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 