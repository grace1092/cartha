'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import Button from '@/components/ui/Button';

interface InvitationData {
  id: string;
  inviter_id: string;
  invitee_email: string;
  invitee_name: string;
  status: 'pending' | 'accepted' | 'expired';
  invitation_message: string | null;
  created_at: string;
  inviter_profile?: {
    full_name: string;
    relationship_status: string | null;
  };
}

export default function InvitationPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const supabase = createClientSupabaseClient();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    loadInvitation();
  }, [params.token]);

  const loadInvitation = async () => {
    try {
      const { data, error: inviteError } = await supabase
        .from('partner_invitations')
        .select(`
          *,
          inviter_profile:user_profiles!partner_invitations_inviter_id_fkey (
            full_name,
            relationship_status
          )
        `)
        .eq('token', params.token)
        .single();

      if (inviteError) throw inviteError;
      if (!data) throw new Error('Invitation not found');

      // Check if invitation is expired (7 days)
      const expirationDate = new Date(data.created_at);
      expirationDate.setDate(expirationDate.getDate() + 7);

      if (expirationDate < new Date()) {
        await supabase
          .from('partner_invitations')
          .update({ status: 'expired' })
          .eq('id', data.id);
        throw new Error('This invitation has expired');
      }

      setInvitation(data);
    } catch (err) {
      console.error('Error loading invitation:', err);
      setError(err instanceof Error ? err.message : 'Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation || !user) return;

    try {
      setAccepting(true);
      setError(null);

      // Update invitation status
      const { error: updateError } = await supabase
        .from('partner_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      // Update both user profiles
      const updates = [
        supabase
          .from('user_profiles')
          .update({
            partner_id: invitation.inviter_id,
            partner_status: 'connected',
            relationship_status: invitation.inviter_profile?.relationship_status || 'dating',
          })
          .eq('id', user.id),

        supabase
          .from('user_profiles')
          .update({
            partner_id: user.id,
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
          relationship_status: invitation.inviter_profile?.relationship_status || 'dating',
          connection_strength: 0,
          shared_cards_completed: 0,
        });

      if (coupleError) throw coupleError;

      router.push('/dashboard');
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading invitation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-4 text-red-600">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {error}
        </h3>
        <p className="text-gray-600 mb-6">
          Please ask your partner to send you a new invitation.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push('/')}
        >
          Return Home
        </Button>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="max-w-md mx-auto text-center p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Invitation Not Found
        </h3>
        <p className="text-gray-600 mb-6">
          This invitation may have been removed or is invalid.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push('/')}
        >
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Join {invitation.inviter_profile?.full_name} on MoneyTalks
        </h2>
        <p className="text-gray-600">
          Start your journey to financial compatibility together
        </p>
      </div>

      {invitation.invitation_message && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <p className="text-gray-600 italic">"{invitation.invitation_message}"</p>
        </div>
      )}

      <div className="space-y-6">
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              Please sign in or create an account to accept this invitation.
            </p>
          </div>
        )}

        {user && profile?.partner_id && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              You are already connected with a partner. You'll need to disconnect
              from your current partner before accepting this invitation.
            </p>
          </div>
        )}

        {user && !profile?.partner_id && (
          <Button
            className="w-full"
            onClick={handleAcceptInvitation}
            disabled={accepting}
          >
            {accepting ? 'Accepting Invitation...' : 'Accept Invitation'}
          </Button>
        )}

        {!user && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/auth/signin')}
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/auth/signup')}
            >
              Create Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 