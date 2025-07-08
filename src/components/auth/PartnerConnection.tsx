'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import Button from '../ui/Button';

interface PartnerInvite {
  id: string;
  inviter_id: string;
  invitee_email: string;
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  invitation_message: string | null;
  created_at: string;
  reminder_count: number;
  notification_sent: boolean;
}

interface PartnerConnectionProps {
  onInviteSent?: () => void;
}

export default function PartnerConnection({ onInviteSent }: PartnerConnectionProps) {
  const { user, profile, refreshProfile } = useAuth();
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sentInvites, setSentInvites] = useState<PartnerInvite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<PartnerInvite[]>([]);

  useEffect(() => {
    if (!user) return;
    loadInvitations();
  }, [user]);

  const loadInvitations = async () => {
    try {
      // Fetch sent invitations
      const { data: sent, error: sentError } = await supabase
        .from('partner_invitations')
        .select('*')
        .eq('inviter_id', user?.id)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;
      setSentInvites(sent || []);

      // Fetch received invitations
      const { data: received, error: receivedError } = await supabase
        .from('partner_invitations')
        .select('*, user_profiles!partner_invitations_inviter_id_fkey(*)')
        .eq('invitee_email', user?.email)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;
      setReceivedInvites(received || []);
    } catch (err) {
      console.error('Error loading invitations:', err);
      setError('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      const invite = sentInvites.find(i => i.id === inviteId);
      if (!invite) return;

      // Update invitation
      const { error: updateError } = await supabase
        .from('partner_invitations')
        .update({
          reminder_count: invite.reminder_count + 1,
          notification_sent: false,
        })
        .eq('id', inviteId);

      if (updateError) throw updateError;

      // TODO: Trigger email/SMS notification resend

      await loadInvitations();
    } catch (err) {
      console.error('Error resending invitation:', err);
      setError('Failed to resend invitation');
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('partner_invitations')
        .update({ status: 'expired' })
        .eq('id', inviteId);

      if (error) throw error;
      await loadInvitations();
    } catch (err) {
      console.error('Error canceling invitation:', err);
      setError('Failed to cancel invitation');
    }
  };

  const handleAcceptInvite = async (invite: PartnerInvite) => {
    try {
      // Update invitation status
      const { error: updateError } = await supabase
        .from('partner_invitations')
        .update({ status: 'accepted' })
        .eq('id', invite.id);

      if (updateError) throw updateError;

      // Update both user profiles
      const updates = [
        supabase
          .from('user_profiles')
          .update({
            partner_id: invite.inviter_id,
            partner_status: 'connected',
          })
          .eq('id', user?.id),

        supabase
          .from('user_profiles')
          .update({
            partner_id: user?.id,
            partner_status: 'connected',
          })
          .eq('id', invite.inviter_id),
      ];

      const results = await Promise.all(updates);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        throw new Error('Failed to update profiles');
      }

      await refreshProfile();
      await loadInvitations();
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError('Failed to accept invitation');
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('partner_invitations')
        .update({ status: 'expired' })
        .eq('id', inviteId);

      if (error) throw error;
      await loadInvitations();
    } catch (err) {
      console.error('Error declining invitation:', err);
      setError('Failed to decline invitation');
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading partner connection status...</div>;
  }

  if (profile?.partner_status === 'connected') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800">Connected with Partner</h3>
        <p className="text-green-600 mt-1">
          You're connected with your partner and ready to start your journey together!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Sent Invitations */}
      {sentInvites.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Sent Invitations</h3>
          <div className="space-y-4">
            {sentInvites.map(invite => (
              <div
                key={invite.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{invite.invitee_email}</p>
                  <p className="text-sm text-gray-500">
                    Sent {new Date(invite.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm capitalize text-gray-600">
                    Status: {invite.status}
                  </p>
                </div>
                {invite.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendInvite(invite.id)}
                    >
                      Resend
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelInvite(invite.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Received Invitations */}
      {receivedInvites.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Received Invitations</h3>
          <div className="space-y-4">
            {receivedInvites.map(invite => (
              <div
                key={invite.id}
                className="border-b pb-4 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">
                      {(invite as any).user_profiles?.full_name || 'Someone'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Received {new Date(invite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvite(invite)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeclineInvite(invite.id)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
                {invite.invitation_message && (
                  <div className="bg-gray-50 rounded p-3 text-sm text-gray-600">
                    {invite.invitation_message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {sentInvites.length === 0 && receivedInvites.length === 0 && (
        <div className="text-center text-gray-500">
          No pending partner invitations
        </div>
      )}
    </div>
  );
} 