import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import { RelationshipStatus } from '@/lib/types/auth';
import Button from '../ui/Button';

type CoupleProfileData = {
  relationshipStatus: RelationshipStatus;
  nextSessionDate?: string;
  milestones: {
    firstDate?: string;
    movedInTogether?: string;
    engagement?: string;
    marriage?: string;
  };
};

export const CoupleProfile = () => {
  const supabase = createClientSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CoupleProfileData>();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      // Get user profile with partner info
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*, partner:user_profiles!user_profiles_partner_id_fkey(*)')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(userProfile);
      setPartner(userProfile.partner);

      // Get couple profile
      const { data: coupleProfile, error: coupleError } = await supabase
        .from('couple_profiles')
        .select('*')
        .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
        .single();

      if (!coupleError && coupleProfile) {
        reset({
          relationshipStatus: coupleProfile.relationship_status,
          nextSessionDate: coupleProfile.next_session_scheduled,
          milestones: coupleProfile.relationship_milestones,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CoupleProfileData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      // Update couple profile
      const { error: updateError } = await supabase
        .from('couple_profiles')
        .upsert({
          partner1_id: user.id,
          partner2_id: partner?.id,
          relationship_status: data.relationshipStatus,
          next_session_scheduled: data.nextSessionDate,
          relationship_milestones: data.milestones,
          last_active: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      // Update user profiles
      await Promise.all([
        supabase
          .from('user_profiles')
          .update({ relationship_status: data.relationshipStatus })
          .eq('id', user.id),
        partner?.id &&
          supabase
            .from('user_profiles')
            .update({ relationship_status: data.relationshipStatus })
            .eq('id', partner.id),
      ]);

      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove loading state to show content immediately

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
          Our Journey Together
        </h2>
        {partner ? (
          <p className="text-gray-600 mt-2">
            With {partner.full_name}
          </p>
        ) : (
          <p className="text-gray-600 mt-2">
            Complete your profile while waiting for your partner
          </p>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship Status
            </label>
            <select
              {...register('relationshipStatus', {
                required: 'Please select your relationship status',
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-start"
            >
              <option value="">Select status...</option>
              <option value="dating">Dating</option>
              <option value="engaged">Engaged</option>
              <option value="married">Married</option>
            </select>
            {errors.relationshipStatus && (
              <p className="mt-1 text-sm text-red-600">
                {errors.relationshipStatus.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Money Talk Session
            </label>
            <input
              type="datetime-local"
              {...register('nextSessionDate')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-start"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Relationship Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Date
              </label>
              <input
                type="date"
                {...register('milestones.firstDate')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-start"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moved In Together
              </label>
              <input
                type="date"
                {...register('milestones.movedInTogether')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-start"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engagement Date
              </label>
              <input
                type="date"
                {...register('milestones.engagement')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-start"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marriage Date
              </label>
              <input
                type="date"
                {...register('milestones.marriage')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-start"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>

      {/* Connection strength indicator */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Connection Strength</span>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-start to-primary-end"
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-sm text-gray-600">70%</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 