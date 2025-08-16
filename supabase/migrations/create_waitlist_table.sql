-- Create waitlist_subscribers table
CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  practice_name VARCHAR(255),
  practice_type VARCHAR(50) DEFAULT 'individual',
  license_type VARCHAR(100),
  state VARCHAR(50),
  country VARCHAR(50) DEFAULT 'US',
  phone VARCHAR(50),
  source VARCHAR(100) DEFAULT 'website',
  referral_code VARCHAR(100),
  interest_level VARCHAR(50) DEFAULT 'medium',
  estimated_patients INTEGER DEFAULT 0,
  current_emr VARCHAR(255),
  pain_points TEXT[] DEFAULT '{}',
  timeline VARCHAR(50) DEFAULT '3-6_months',
  budget_range VARCHAR(50) DEFAULT '300_500',
  gdpr_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  consent_given_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  email_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_subscribers_email ON waitlist_subscribers(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_waitlist_subscribers_status ON waitlist_subscribers(status);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE waitlist_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on waitlist_subscribers" ON waitlist_subscribers
  FOR ALL USING (true); 