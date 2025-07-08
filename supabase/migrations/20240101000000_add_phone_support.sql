-- Add phone number columns to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS partner_phone text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;

-- Add phone number column to partner_invitations
ALTER TABLE partner_invitations
ADD COLUMN IF NOT EXISTS invitee_phone text;

-- Make invitee_email nullable since we now support phone numbers
ALTER TABLE partner_invitations
ALTER COLUMN invitee_email DROP NOT NULL;

-- Add constraint to ensure either email or phone is provided
ALTER TABLE partner_invitations
ADD CONSTRAINT partner_invitations_contact_check 
CHECK (
  (invitee_email IS NOT NULL AND invitee_phone IS NULL) OR 
  (invitee_email IS NULL AND invitee_phone IS NOT NULL)
); 