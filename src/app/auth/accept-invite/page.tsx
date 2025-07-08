'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export default function AcceptInvite() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        const { data, error: inviteError } = await supabase
          .from('partner_invitations')
          .select('*, user_profiles!partner_invitations_inviter_id_fkey(*)')
          .eq('token', token)
          .single();

        if (inviteError || !data) {
          throw new Error('Invitation not found');
        }

        if (data.status !== 'pending') {
          throw new Error('This invitation has already been used or has expired');
        }

        if (new Date(data.expires_at) < new Date()) {
          throw new Error('This invitation has expired');
        }

        setInvitation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invitation');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [searchParams]);

  const handleAcceptInvitation = async () => {
    if (!user || !invitation) return;

    setLoading(true);
    setError(null);

    try {
      // Update invitation status
      const { error: updateInviteError } = await supabase
        .from('partner_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      if (updateInviteError) throw updateInviteError;

      // Update both user profiles
      const updates = [
        supabase
          .from('user_profiles')
          .update({
            partner_id: invitation.inviter_id,
            partner_email: invitation.user_profiles.email,
            partner_status: 'connected',
          })
          .eq('id', user.id),

        supabase
          .from('user_profiles')
          .update({
            partner_id: user.id,
            partner_email: user.email,
            partner_status: 'connected',
          })
          .eq('id', invitation.inviter_id),
      ];

      const results = await Promise.all(updates);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        throw new Error('Failed to update profiles');
      }

      // Create couple profile
      const { error: coupleError } = await supabase
        .from('couple_profiles')
        .insert({
          partner1_id: invitation.inviter_id,
          partner2_id: user.id,
          relationship_status: invitation.user_profiles.relationship_status,
          last_active: new Date().toISOString(),
        });

      if (coupleError) throw coupleError;

      await refreshProfile();
      router.push('/dashboard');
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError('Failed to accept invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading Invitation</h2>
          <div className="animate-pulse">Please wait...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Accept Partner Invitation</h2>
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              You've been invited by{' '}
              <span className="font-semibold">{invitation?.user_profiles?.full_name}</span>{' '}
              to connect on MoneyTalks.
            </p>
            <p className="text-gray-600">
              By accepting this invitation, you'll create a shared couple's profile
              and gain access to all MoneyTalks features together.
            </p>
          </div>
          <Button
            onClick={handleAcceptInvitation}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Accepting...' : 'Accept Invitation'}
          </Button>
        </div>
      </div>
    </div>
  );
} 