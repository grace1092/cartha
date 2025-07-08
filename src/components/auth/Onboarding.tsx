'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { RelationshipStatus } from '@/lib/types/auth';
import Button from '../ui/Button';

interface OnboardingFormData {
  fullName: string;
  relationshipStatus: RelationshipStatus;
  partnerEmail: string;
  partnerName: string;
  phoneNumber: string;
  relationshipStartDate: string;
  invitationMessage: string;
  preferredContactMethod: 'email' | 'sms';
}

interface QuizAnswers {
  [key: string]: string;
}

interface PersonalityResult {
  type: string;
  description: string;
  color: string;
  icon: string;
}

// Quiz questions (matching the API structure)
const quizQuestions = [
  {
    id: 1,
    question: "When you think about money, what's your first feeling?",
    options: [
      { value: 'security', label: 'Security - I want to feel safe and prepared' },
      { value: 'freedom', label: 'Freedom - Money buys me choices and experiences' },
      { value: 'status', label: 'Status - Money reflects success and achievement' },
      { value: 'stress', label: 'Stress - Money feels overwhelming and complicated' }
    ]
  },
  {
    id: 2,
    question: "Your ideal Saturday involves:",
    options: [
      { value: 'planning', label: 'Planning our financial future together' },
      { value: 'spending', label: 'Enjoying life - we can figure out money later' },
      { value: 'saving', label: 'Finding ways to save and optimize our budget' },
      { value: 'avoiding', label: 'Anything but talking about money!' }
    ]
  },
  {
    id: 3,
    question: "When your partner makes a big purchase without discussing it:",
    options: [
      { value: 'concerned', label: 'I feel concerned about our financial security' },
      { value: 'curious', label: 'I want to understand their reasoning' },
      { value: 'frustrated', label: 'I feel frustrated about the lack of communication' },
      { value: 'trusting', label: 'I trust their judgment completely' }
    ]
  }
];

export default function Onboarding() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null);
  const [isQuizSubmitting, setIsQuizSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<OnboardingFormData>();
  const relationshipStatus = watch('relationshipStatus');

  // Step 1: Basic Info
  const Step1Component = useMemo(() => (
    <div key="step1">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Full Name
        </label>
        <input
          key="fullName"
          type="text"
          {...register('fullName', { required: 'Full name is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-from"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          key="phoneNumber"
          type="tel"
          {...register('phoneNumber', {
            pattern: {
              value: /^\+?[1-9]\d{1,14}$/,
              message: 'Please enter a valid phone number',
            },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-from"
          placeholder="+1234567890"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Contact Method
        </label>
        <select
          key="preferredContactMethod"
          {...register('preferredContactMethod')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-from"
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </div>

      <Button
        type="button"
        onClick={() => setStep(2)}
        className="w-full"
      >
        Next: Take Quiz
      </Button>
    </div>
  ), [register, errors.fullName, errors.phoneNumber]);

  // Step 2: Quiz
  const handleQuizAnswer = (questionId: number, answerValue: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  const handleQuizNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Submit quiz
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsQuizSubmitting(true);
    try {
      const response = await fetch('/api/onboarding/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: quizAnswers }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      setPersonalityResult(result.personalityResult);
      
      // Move to next step after showing results
      setTimeout(() => {
        setStep(3);
      }, 3000);
    } catch (err) {
      console.error('Quiz submission error:', err);
      setError('There was an error submitting your quiz. Please try again.');
    } finally {
      setIsQuizSubmitting(false);
    }
  };

  const Step2Component = useMemo(() => {
    if (personalityResult) {
      return (
        <div key="step2-results" className="text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">{personalityResult.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{personalityResult.type}</h3>
            <p className="text-gray-600">{personalityResult.description}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              Understanding your financial personality helps us personalize your experience and improve your conversations with your partner.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setStep(3)}
            className="w-full"
          >
            Continue to Relationship Info
          </Button>
        </div>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const selectedAnswer = quizAnswers[currentQuestion.id];

    return (
      <div key="step2-quiz">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Quick Financial Personality Quiz</h3>
            <span className="text-sm text-gray-500">
              {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-primary-from h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">{currentQuestion.question}</h4>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleQuizAnswer(currentQuestion.id, option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === option.value
                    ? 'border-primary-from bg-primary-from/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(prev => prev - 1);
              } else {
                setStep(1);
              }
            }}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleQuizNext}
            disabled={!selectedAnswer || isQuizSubmitting}
            className="flex-1"
          >
            {isQuizSubmitting ? 'Submitting...' : 
             currentQuestionIndex < quizQuestions.length - 1 ? 'Next' : 'Submit Quiz'}
          </Button>
        </div>
      </div>
    );
  }, [currentQuestionIndex, quizAnswers, personalityResult, isQuizSubmitting]);

  // Step 3: Relationship Info (formerly Step 2)
  const Step3Component = useMemo(() => (
    <div key="step3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Relationship Status
        </label>
        <select
          key="relationshipStatus"
          {...register('relationshipStatus', { required: 'Please select your relationship status' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-from"
        >
          <option value="">Select status...</option>
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
          When did your relationship start?
        </label>
        <input
          key="relationshipStartDate"
          type="date"
          {...register('relationshipStartDate')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-from"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Partner's Name
        </label>
        <input
          key="partnerName"
          type="text"
          {...register('partnerName')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-from"
          placeholder="Enter your partner's name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Partner's Email
        </label>
        <input
          key="partnerEmail"
          type="email"
          {...register('partnerEmail', {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-from"
          placeholder="Enter your partner's email to invite them"
        />
        {errors.partnerEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.partnerEmail.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Personal Message (Optional)
        </label>
        <textarea
          key="invitationMessage"
          {...register('invitationMessage')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-from"
          rows={3}
          placeholder="Add a personal message to your partner's invitation..."
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(2)}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
        </Button>
      </div>
    </div>
  ), [register, errors.relationshipStatus, errors.partnerEmail, isSubmitting]);

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // Get user's email verification status
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const isEmailVerified = authUser?.confirmed_at != null;

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: data.fullName,
          relationship_status: data.relationshipStatus,
          phone_number: data.phoneNumber,
          email_verified: isEmailVerified,
          phone_verified: false,
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Create partner invitation if email provided
      if (data.partnerEmail) {
        const token = crypto.randomUUID();
        const { error: inviteError } = await supabase
          .from('partner_invitations')
          .insert({
            inviter_id: user.id,
            invitee_email: data.partnerEmail,
            token,
            status: 'pending',
            invitation_message: data.invitationMessage || null,
            notification_sent: false,
            reminder_count: 0,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          });

        if (inviteError) throw inviteError;

        // Create initial couple profile
        const { error: coupleError } = await supabase
          .from('couple_profiles')
          .insert({
            partner1_id: user.id,
            relationship_status: data.relationshipStatus,
            shared_cards_completed: 0,
            connection_strength: 0,
            last_active: new Date().toISOString(),
            relationship_milestones: {
              started_dating: data.relationshipStartDate || null,
            },
          });

        if (coupleError) throw coupleError;
      }

      await refreshProfile();
      router.push('/conversations');
    } catch (err) {
      console.error('Onboarding error:', err);
      setError('There was an error creating your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {step === 1 ? 'Complete Your Profile' : 
         step === 2 ? 'Discover Your Financial Personality' : 
         'Tell Us About Your Relationship'}
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && Step1Component}
        {step === 2 && Step2Component}
        {step === 3 && Step3Component}
      </form>
    </div>
  );
} 