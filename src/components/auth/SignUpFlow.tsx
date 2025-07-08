'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/supabase/database.types';
import { RelationshipStatus } from '@/lib/types/auth';
import Button from '../ui/Button';
import { HiCheck, HiLockClosed, HiShieldCheck } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { BsApple } from 'react-icons/bs';

type SignUpFormData = {
  email: string;
  password: string;
  fullName: string;
  partnerEmail: string;
  relationshipStatus: RelationshipStatus;
  anniversaryDate?: string;
};

const TOTAL_STEPS = 3;

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0
  })
};

export const SignUpFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const supabase = createClientComponentClient<Database>();
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<SignUpFormData>();

  const navigateStep = async (nextStep: number) => {
    // Validate current step before proceeding
    const isValid = await trigger(getFieldsForStep(currentStep));
    if (!isValid) return;

    setDirection(nextStep > currentStep ? 1 : -1);
    setCurrentStep(nextStep);
  };

  const getFieldsForStep = (step: number): Array<keyof SignUpFormData> => {
    switch (step) {
      case 1:
        return ['email', 'password'];
      case 2:
        return ['partnerEmail'];
      case 3:
        return ['fullName', 'relationshipStatus', 'anniversaryDate'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Step 2: Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user!.id,
          email: data.email,
          full_name: data.fullName,
          relationship_status: data.relationshipStatus,
          email_verified: false,
          anniversary_date: data.anniversaryDate,
        });

      if (profileError) throw profileError;

      // Step 3: Send partner invitation
      if (data.partnerEmail) {
        const { error: inviteError } = await supabase
          .from('partner_invitations')
          .insert({
            inviter_id: authData.user!.id,
            invitee_email: data.partnerEmail,
            status: 'pending',
          });

        if (inviteError) throw inviteError;
      }

      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => {
        // Redirect or handle success
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      setIsLoading(false);
    }
  };

  // Memoize step components to prevent unnecessary re-renders
  const Step1Component = useMemo(() => (
    <div key="step1">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-600">
          Start your financial relationship journey
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          key="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent transition-shadow text-base"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          key="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent transition-shadow text-base"
          placeholder="Create a secure password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="button"
        onClick={() => navigateStep(2)}
        className="w-full bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start text-white py-3 rounded-lg text-base font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        disabled={isLoading}
      >
        Continue
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="font-medium">Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('apple')}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <BsApple className="w-5 h-5" />
          <span className="font-medium">Apple</span>
        </button>
      </div>
    </div>
  ), [register, errors.email, errors.password, isLoading]);

  const Step2Component = useMemo(() => (
    <div key="step2">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invite Your Partner
        </h2>
        <p className="text-gray-600">
          Start your financial journey together
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Partner's Email
        </label>
        <input
          key="partnerEmail"
          {...register('partnerEmail', {
            required: 'Partner email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent transition-shadow text-base"
          placeholder="partner@example.com"
        />
        {errors.partnerEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.partnerEmail.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={() => navigateStep(1)}
          className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 rounded-lg text-base font-medium transition-all duration-200"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => navigateStep(3)}
          className="flex-1 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start text-white py-3 rounded-lg text-base font-medium transition-all duration-200"
          disabled={isLoading}
        >
          Continue
        </Button>
      </div>
    </div>
  ), [register, errors.partnerEmail, isLoading]);

  const Step3Component = useMemo(() => (
    <div key="step3">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Profile
        </h2>
        <p className="text-gray-600">
          Tell us about your relationship
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          key="fullName"
          {...register('fullName', { required: 'Name is required' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent transition-shadow text-base"
          placeholder="Your full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Relationship Status
        </label>
        <select
          key="relationshipStatus"
          {...register('relationshipStatus', { required: 'Please select a status' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent transition-shadow text-base"
        >
          <option value="">Select status</option>
          <option value="dating">Dating</option>
          <option value="engaged">Engaged</option>
          <option value="married">Married</option>
        </select>
        {errors.relationshipStatus && (
          <p className="mt-1 text-sm text-red-600">{errors.relationshipStatus.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Anniversary Date (Optional)
        </label>
        <input
          key="anniversaryDate"
          type="date"
          {...register('anniversaryDate')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent transition-shadow text-base"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={() => navigateStep(2)}
          className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 rounded-lg text-base font-medium transition-all duration-200"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start text-white py-3 rounded-lg text-base font-medium transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </div>
  ), [register, errors.fullName, errors.relationshipStatus, isLoading]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-start via-primary-end to-secondary-start">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
              <div key={idx} className="flex items-center w-full">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                    idx + 1 < currentStep
                      ? 'bg-green-500 text-white'
                      : idx + 1 === currentStep
                      ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx + 1 < currentStep ? <HiCheck className="w-5 h-5" /> : idx + 1}
                </div>
                {idx < TOTAL_STEPS - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded ${
                      idx + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-600">
          <HiLockClosed className="w-4 h-4 text-green-500" />
          <span>Secure</span>
          <span>•</span>
          <HiShieldCheck className="w-4 h-4 text-green-500" />
          <span>Used by 25,000+ couples</span>
        </div>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm flex items-start"
            >
              <span className="leading-tight">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success animation */}
        <AnimatePresence>
          {showSuccessAnimation && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-2xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <HiCheck className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Account Created!
                </h3>
                <p className="text-gray-600">
                  Welcome to MoneyTalks
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form steps */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && Step1Component}
              {currentStep === 2 && Step2Component}
              {currentStep === 3 && Step3Component}
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignUpFlow; 