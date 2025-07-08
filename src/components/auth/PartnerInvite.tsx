import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/supabase/database.types';
import Button from '../ui/Button';
import { HiOutlineInformationCircle, HiCheck, HiOutlineEnvelope, HiOutlineDevicePhoneMobile } from 'react-icons/hi2';
import { Tooltip } from '../ui/Tooltip';

type InviteFormData = {
  contactType: 'email' | 'phone';
  contact: string;
  message?: string;
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const successVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

export const PartnerInvite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');

  const supabase = createClientComponentClient<Database>();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<InviteFormData>({
    defaultValues: {
      contactType: 'email'
    }
  });

  const generateInviteToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const validateContact = (value: string, type: 'email' | 'phone') => {
    if (type === 'email') {
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) || 'Invalid email address';
    } else {
      return /^\+?[1-9]\d{1,14}$/.test(value) || 'Invalid phone number';
    }
  };

  const onSubmit = async (data: InviteFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      // Check if partner contact is already registered
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq(data.contactType === 'email' ? 'email' : 'phone_number', data.contact)
        .single();

      if (existingUser) {
        throw new Error(`This ${data.contactType} is already registered. Ask your partner to send you an invitation instead.`);
      }

      // Create invitation
      const token = generateInviteToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      const { error: inviteError } = await supabase
        .from('partner_invitations')
        .insert({
          inviter_id: user.id,
          invitee_email: data.contactType === 'email' ? data.contact : null,
          invitee_phone: data.contactType === 'phone' ? data.contact : null,
          status: 'pending',
          token,
          expires_at: expiresAt.toISOString(),
          invitation_message: data.message || null,
          notification_sent: false,
          reminder_count: 0,
        });

      if (inviteError) throw inviteError;

      // Update user profile with pending partner
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          partner_email: data.contactType === 'email' ? data.contact : null,
          partner_phone: data.contactType === 'phone' ? data.contact : null,
          partner_status: 'pending',
          invitation_token: token,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[500px] max-w-md mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
          Invite Your Partner
        </h2>
        <p className="text-gray-600 mt-2 relative inline-block">
          Start your journey to better money conversations together
          <Tooltip content="Your partner will receive a secure invitation link to join MoneyTalks and connect with your account. The link expires in 7 days.">
            <HiOutlineInformationCircle className="inline-block ml-1 w-5 h-5 text-gray-400 cursor-help" />
          </Tooltip>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm flex items-start"
          >
            <span className="leading-tight">{error}</span>
          </motion.div>
        )}

        {success ? (
          <motion.div
            variants={successVariants}
            initial="hidden"
            animate="visible"
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <HiCheck className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-2">Invitation Sent! 🎉</h3>
            <p className="text-gray-600 mb-8">
              We'll notify you when your partner accepts the invitation.
            </p>
            <Button
              onClick={() => setSuccess(false)}
              className="w-full max-w-xs mx-auto bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start text-white"
            >
              Send Another Invitation
            </Button>
          </motion.div>
        ) : (
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="flex gap-4 p-1 bg-gray-100 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setContactType('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-all ${
                  contactType === 'email'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HiOutlineEnvelope className="w-5 h-5" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setContactType('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-all ${
                  contactType === 'phone'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HiOutlineDevicePhoneMobile className="w-5 h-5" />
                <span>Phone</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner's {contactType === 'email' ? 'Email' : 'Phone Number'}
              </label>
              <input
                {...register('contact', {
                  required: `Partner's ${contactType} is required`,
                  validate: (value) => validateContact(value, contactType)
                })}
                type={contactType === 'email' ? 'email' : 'tel'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent transition-shadow text-base"
                placeholder={contactType === 'email' ? 'partner@example.com' : '+1234567890'}
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Message (Optional)
              </label>
              <textarea
                {...register('message')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent transition-shadow text-base"
                rows={3}
                placeholder="Add a personal message to your invitation..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start text-white py-3 rounded-lg text-base font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending Invitation...
                </div>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Trust indicators */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
          <div className="flex flex-col items-center">
            <span className="text-xl mb-1">✉️</span>
            <span>Instant delivery</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl mb-1">🔒</span>
            <span>Secure link</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl mb-1">⏰</span>
            <span>Valid for 7 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 