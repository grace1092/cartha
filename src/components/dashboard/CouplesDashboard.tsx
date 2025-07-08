'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import { getRelationshipStatusColor, getConnectionStrengthLabel, getConnectionStrengthColor } from '@/lib/utils';
import Button from '../ui/Button';
import { UserProfile } from '@/lib/types/auth';

interface DashboardStats {
  cardsCompleted: number;
  connectionStrength: number;
  nextSessionDate: string | null;
  lastActive: string;
}

export default function CouplesDashboard() {
  const { user, profile } = useAuth();
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !profile?.partner_id) return;
    loadDashboardData();
  }, [user, profile]);

  const loadDashboardData = async () => {
    try {
      // Load partner profile
      const { data: partner, error: partnerError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', profile?.partner_id)
        .single();

      if (partnerError) throw partnerError;
      setPartnerProfile(partner);

      // Load couple stats
      const { data: coupleData, error: statsError } = await supabase
        .from('couple_profiles')
        .select('*')
        .or(`partner1_id.eq.${user?.id},partner2_id.eq.${user?.id}`)
        .single();

      if (statsError) throw statsError;
      
      setStats({
        cardsCompleted: coupleData.shared_cards_completed,
        connectionStrength: coupleData.connection_strength,
        nextSessionDate: coupleData.next_session_scheduled,
        lastActive: coupleData.last_active,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading your dashboard...</div>
      </div>
    );
  }

  if (!profile?.partner_id) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Connect with Your Partner
        </h3>
        <p className="text-gray-600 mb-6">
          Invite your partner to join you on MoneyTalks and start your journey together.
        </p>
        <Button>Send Partner Invitation</Button>
      </div>
    );
  }

  const relationshipStatus = profile?.relationship_status || 'dating';
  const formattedStatus = relationshipStatus.charAt(0).toUpperCase() + relationshipStatus.slice(1);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Couple Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile?.full_name || 'You'} & {partnerProfile?.full_name || 'Partner'}
            </h2>
            <p className={`mt-1 ${getRelationshipStatusColor(relationshipStatus)}`}>
              {formattedStatus}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Active</p>
            <p className="font-medium">
              {stats?.lastActive ? new Date(stats.lastActive).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>

        {/* Connection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Cards Completed</h4>
            <p className="text-2xl font-bold text-gray-900">{stats?.cardsCompleted || 0}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Connection Level</h4>
            <p className={`text-2xl font-bold ${getConnectionStrengthColor(stats?.connectionStrength || 0)}`}>
              {getConnectionStrengthLabel(stats?.connectionStrength || 0)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Next Session</h4>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.nextSessionDate
                ? new Date(stats.nextSessionDate).toLocaleDateString()
                : 'Not Scheduled'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={() => {/* TODO: Implement schedule session */}}
        >
          Schedule Next Session
        </Button>
        <Button
          className="w-full justify-center"
          onClick={() => {/* TODO: Implement start session */}}
        >
          Start New Session
        </Button>
      </div>
    </div>
  );
} 