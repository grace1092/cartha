export type RelationshipStatus = 'dating' | 'engaged' | 'married';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  relationship_status: RelationshipStatus | null;
  partner_id: string | null;
  partner_email: string | null;
  partner_status: 'pending' | 'connected' | null;
  invitation_token: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  last_active: string;
}

export interface CoupleProfile {
  id: string;
  created_at: string;
  relationship_status: RelationshipStatus;
  partner1_id: string;
  partner2_id: string | null;
  last_active: string;
  shared_cards_completed: number;
  connection_strength: number;
  next_session_scheduled: string | null;
  relationship_milestones: {
    started_dating?: string;
    got_engaged?: string;
    got_married?: string;
  };
}

export interface PartnerInvitation {
  id: string;
  created_at: string;
  inviter_id: string;
  invitee_email: string;
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  expires_at: string;
  invitation_message?: string;
  notification_sent: boolean;
  reminder_count: number;
} 