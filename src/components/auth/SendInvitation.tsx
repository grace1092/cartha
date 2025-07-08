'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { validateEmail, validatePhoneNumber, generateInvitationEmail, generateSMSInvitation } from '@/lib/utils';
import Button from '../ui/Button';

interface InvitationFormData {
  partnerEmail: string;
  partnerName: string;
  phoneNumber: string;
  message: string;
  contactMethod: 'email' | 'sms';
}

export default function SendInvitation() {
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvitationFormData>({
    defaultValues: {
      contactMethod: 'email',
    },
  });

  const contactMethod = watch('contactMethod');

  const onSubmit = async (data: InvitationFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate contact information
      if (data.contactMethod === 'email' && !validateEmail(data.partnerEmail)) {
        throw new Error('Please enter a valid email address');
      }
      if (data.contactMethod === 'sms' && !validatePhoneNumber(data.phoneNumber)) {
        throw new Error('Please enter a valid phone number');
      }

      // Generate invitation token
      const token = crypto.randomUUID();

      // Create invitation record
      const { error: inviteError } = await supabase
        .from('partner_invitations')
        .insert({
          inviter_id: user?.id,
          invitee_email: data.partnerEmail,
          invitee_name: data.partnerName,
          invitee_phone: data.phoneNumber,
          token,
          invitation_message: data.message,
          status: 'pending',
          contact_method: data.contactMethod,
        });

      if (inviteError) throw inviteError;

      // Generate invitation content
      const invitationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${token}`;
      
      if (data.contactMethod === 'email') {
        const emailContent = generateInvitationEmail(profile?.full_name || 'Your partner', data.message);
        // TODO: Implement email sending service integration
        console.log('Sending email invitation:', { to: data.partnerEmail, content: emailContent });
      } else {
        const smsContent = generateSMSInvitation(profile?.full_name || 'Your partner');
        // TODO: Implement SMS service integration
        console.log('Sending SMS invitation:', { to: data.phoneNumber, content: smsContent });
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6">
        <div className="mb-4 text-green-600">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Invitation Sent Successfully!
        </h3>
        <p className="text-gray-600 mb-6">
          We'll notify you when your partner accepts the invitation.
        </p>
        <Button
          variant="outline"
          onClick={() => setSuccess(false)}
        >
          Send Another Invitation
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Method
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="email"
              {...register('contactMethod')}
              className="h-4 w-4 text-primary-from"
            />
            <span className="ml-2">Email</span>
          </label>
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="sms"
              {...register('contactMethod')}
              className="h-4 w-4 text-primary-from"
            />
            <span className="ml-2">SMS</span>
          </label>
        </div>
      </div>

      {contactMethod === 'email' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Partner's Email
          </label>
          <input
            type="email"
            {...register('partnerEmail', { required: true })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-from focus:border-transparent"
            placeholder="partner@example.com"
          />
          {errors.partnerEmail && (
            <p className="mt-1 text-sm text-red-600">Please enter your partner's email</p>
          )}
        </div>
      )}

      {contactMethod === 'sms' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Partner's Phone Number
          </label>
          <input
            type="tel"
            {...register('phoneNumber', { required: true })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-from focus:border-transparent"
            placeholder="+1234567890"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">Please enter your partner's phone number</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Partner's Name
        </label>
        <input
          type="text"
          {...register('partnerName', { required: true })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-from focus:border-transparent"
          placeholder="Enter your partner's name"
        />
        {errors.partnerName && (
          <p className="mt-1 text-sm text-red-600">Please enter your partner's name</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Personal Message (Optional)
        </label>
        <textarea
          {...register('message')}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-from focus:border-transparent"
          placeholder="Add a personal message to your invitation..."
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending Invitation...' : 'Send Invitation'}
      </Button>
    </form>
  );
} 