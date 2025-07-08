import { RelationshipStatus } from '../types/auth';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionTier = 'free' | 'core' | 'premium';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired';
export type BillingInterval = 'month' | 'year';
export type BillingEventType = 'subscription_created' | 'subscription_updated' | 'subscription_canceled' | 'payment_succeeded' | 'payment_failed' | 'refund_issued';

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
          relationship_status: RelationshipStatus | null
          partner_id: string | null
          partner_email: string | null
          partner_phone: string | null
          partner_status: 'pending' | 'connected' | null
          invitation_token: string | null
          avatar_url: string | null
          phone_number: string | null
          email_verified: boolean
          phone_verified: boolean
          last_active: string
          stripe_customer_id: string | null
          current_subscription_id: string | null
        }
        Insert: {
          id: string
          email: string
          full_name: string
          created_at?: string
          relationship_status?: RelationshipStatus | null
          partner_id?: string | null
          partner_email?: string | null
          partner_phone?: string | null
          partner_status?: 'pending' | 'connected' | null
          invitation_token?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          email_verified?: boolean
          phone_verified?: boolean
          last_active?: string
          stripe_customer_id?: string | null
          current_subscription_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          created_at?: string
          relationship_status?: RelationshipStatus | null
          partner_id?: string | null
          partner_email?: string | null
          partner_phone?: string | null
          partner_status?: 'pending' | 'connected' | null
          invitation_token?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          email_verified?: boolean
          phone_verified?: boolean
          last_active?: string
          stripe_customer_id?: string | null
          current_subscription_id?: string | null
        }
      }
      couple_profiles: {
        Row: {
          id: string
          created_at: string
          relationship_status: RelationshipStatus
          partner1_id: string
          partner2_id: string | null
          last_active: string
          shared_cards_completed: number
          connection_strength: number
          next_session_scheduled: string | null
          relationship_milestones: Json
        }
        Insert: {
          id?: string
          created_at?: string
          relationship_status: RelationshipStatus
          partner1_id: string
          partner2_id?: string | null
          last_active?: string
          shared_cards_completed?: number
          connection_strength?: number
          next_session_scheduled?: string | null
          relationship_milestones?: Json
        }
        Update: {
          id?: string
          created_at?: string
          relationship_status?: RelationshipStatus
          partner1_id?: string
          partner2_id?: string | null
          last_active?: string
          shared_cards_completed?: number
          connection_strength?: number
          next_session_scheduled?: string | null
          relationship_milestones?: Json
        }
      }
      partner_invitations: {
        Row: {
          id: string
          created_at: string
          inviter_id: string
          invitee_email: string | null
          invitee_phone: string | null
          status: 'pending' | 'accepted' | 'expired'
          token: string
          expires_at: string
          invitation_message: string | null
          notification_sent: boolean
          reminder_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          inviter_id: string
          invitee_email?: string | null
          invitee_phone?: string | null
          status?: 'pending' | 'accepted' | 'expired'
          token: string
          expires_at: string
          invitation_message?: string | null
          notification_sent?: boolean
          reminder_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          inviter_id?: string
          invitee_email?: string | null
          invitee_phone?: string | null
          status?: 'pending' | 'accepted' | 'expired'
          token?: string
          expires_at?: string
          invitation_message?: string | null
          notification_sent?: boolean
          reminder_count?: number
        }
      }
      subscriptions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          stripe_subscription_id: string
          stripe_price_id: string
          tier: SubscriptionTier
          status: SubscriptionStatus
          interval: BillingInterval
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          stripe_subscription_id: string
          stripe_price_id: string
          tier: SubscriptionTier
          status: SubscriptionStatus
          interval: BillingInterval
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          stripe_subscription_id?: string
          stripe_price_id?: string
          tier?: SubscriptionTier
          status?: SubscriptionStatus
          interval?: BillingInterval
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          metadata?: Json
        }
      }
      usage_tracking: {
        Row: {
          id: string
          created_at: string
          user_id: string
          feature_key: string
          usage_count: number
          last_used_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          feature_key: string
          usage_count?: number
          last_used_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          feature_key?: string
          usage_count?: number
          last_used_at?: string
          metadata?: Json
        }
      }
      billing_events: {
        Row: {
          id: string
          created_at: string
          user_id: string
          subscription_id: string | null
          event_type: BillingEventType
          amount: number
          currency: string
          stripe_event_id: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          subscription_id?: string | null
          event_type: BillingEventType
          amount: number
          currency: string
          stripe_event_id: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          subscription_id?: string | null
          event_type?: BillingEventType
          amount?: number
          currency?: string
          stripe_event_id?: string
          metadata?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 