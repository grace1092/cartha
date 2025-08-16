'use client';

import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Users, Calendar, DollarSign, Building2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

interface WaitlistFormData {
  email: string;
  first_name: string;
  last_name: string;
  practice_name: string;
  practice_type: string;
  license_type: string;
  state: string;
  country: string;
  phone: string;
  interest_level: string;
  estimated_patients: number;
  current_emr: string;
  pain_points: string[];
  timeline: string;
  budget_range: string;
  gdpr_consent: boolean;
  marketing_consent: boolean;
}

export const WaitlistModal = ({ isOpen, onClose, source = 'website' }: WaitlistModalProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: '',
    first_name: '',
    last_name: '',
    practice_name: '',
    practice_type: 'individual',
    license_type: '',
    state: '',
    country: 'US',
    phone: '',
    interest_level: 'medium',
    estimated_patients: 0,
    current_emr: '',
    pain_points: [],
    timeline: '3-6_months',
    budget_range: '300_500',
    gdpr_consent: false,
    marketing_consent: false
  });

  const practiceTypes = [
    { value: 'individual', label: 'Individual Practice', icon: Users },
    { value: 'group', label: 'Group Practice', icon: Building2 },
    { value: 'clinic', label: 'Clinic', icon: Building2 },
    { value: 'hospital', label: 'Hospital', icon: Building2 },
    { value: 'other', label: 'Other', icon: Building2 }
  ];

  const interestLevels = [
    { value: 'low', label: 'Just exploring' },
    { value: 'medium', label: 'Interested' },
    { value: 'high', label: 'Very interested' },
    { value: 'very_high', label: 'Ready to implement' }
  ];

  const timelines = [
    { value: 'immediate', label: 'Immediate (within 1 month)' },
    { value: '1-3_months', label: '1-3 months' },
    { value: '3-6_months', label: '3-6 months' },
    { value: '6+_months', label: '6+ months' }
  ];

  const budgetRanges = [
    { value: 'under_100', label: 'Under $100/month' },
    { value: '100_300', label: '$100-300/month' },
    { value: '300_500', label: '$300-500/month' },
    { value: '500_1000', label: '$500-1000/month' },
    { value: '1000+', label: '$1000+/month' }
  ];

  const painPoints = [
    'Manual documentation',
    'Scheduling complexity',
    'Billing inefficiencies',
    'Patient communication',
    'Compliance management',
    'Data analytics',
    'Integration issues',
    'Staff training'
  ];

  const handleInputChange = (field: keyof WaitlistFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePainPointToggle = (point: string) => {
    setFormData(prev => ({
      ...prev,
      pain_points: prev.pain_points.includes(point)
        ? prev.pain_points.filter(p => p !== point)
        : [...prev.pain_points, point]
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.email && !!formData.first_name && !!formData.last_name;
      case 2:
        return !!formData.practice_name && !!formData.practice_type;
      case 3:
        return formData.gdpr_consent;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError(null);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to join waitlist');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setFormData({
          email: '',
          first_name: '',
          last_name: '',
          practice_name: '',
          practice_type: 'individual',
          license_type: '',
          state: '',
          country: 'US',
          phone: '',
          interest_level: 'medium',
          estimated_patients: 0,
          current_emr: '',
          pain_points: [],
          timeline: '3-6_months',
          budget_range: '300_500',
          gdpr_consent: false,
          marketing_consent: false
        });
        onClose();
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Join the Founding Member Program</h2>
            <p className="text-gray-600 mt-1">Get exclusive early access and 50% off for the first 12 months</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to CARTHA!</h3>
              <p className="text-gray-600 mb-4">
                You've successfully joined our Founding Member Program. Please check your email to confirm your subscription.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Your Founding Member Benefits:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 50% off for the first 12 months</li>
                  <li>• Early access to new features</li>
                  <li>• Priority customer support</li>
                  <li>• Custom feature requests</li>
                  <li>• Free onboarding and training</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Practice Information */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Practice Name *
                        </label>
                        <input
                          type="text"
                          value={formData.practice_name}
                          onChange={(e) => handleInputChange('practice_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your practice name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Practice Type *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {practiceTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => handleInputChange('practice_type', type.value)}
                                className={`p-3 border rounded-lg text-left transition-all ${
                                  formData.practice_type === type.value
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                <Icon className="w-5 h-5 mb-2" />
                                <div className="text-sm font-medium">{type.label}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            License Type
                          </label>
                          <input
                            type="text"
                            value={formData.license_type}
                            onChange={(e) => handleInputChange('license_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., LMFT, LCSW, PsyD"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., CA, NY, TX"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated Number of Patients
                        </label>
                        <input
                          type="number"
                          value={formData.estimated_patients}
                          onChange={(e) => handleInputChange('estimated_patients', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., 50, 100, 200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current EMR System
                        </label>
                        <input
                          type="text"
                          value={formData.current_emr}
                          onChange={(e) => handleInputChange('current_emr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., SimplePractice, TherapyNotes, None"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences & Consent */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences & Timeline</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interest Level
                        </label>
                        <select
                          value={formData.interest_level}
                          onChange={(e) => handleInputChange('interest_level', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {interestLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Implementation Timeline
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => handleInputChange('timeline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {timelines.map((timeline) => (
                            <option key={timeline.value} value={timeline.value}>
                              {timeline.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Range
                        </label>
                        <select
                          value={formData.budget_range}
                          onChange={(e) => handleInputChange('budget_range', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {budgetRanges.map((budget) => (
                            <option key={budget.value} value={budget.value}>
                              {budget.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pain Points (Select all that apply)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {painPoints.map((point) => (
                            <label key={point} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.pain_points.includes(point)}
                                onChange={() => handlePainPointToggle(point)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">{point}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GDPR Consent */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Consent & Privacy</h3>
                    <div className="space-y-4">
                      <div className="mb-4">
                        <label className="flex items-start space-x-2 font-semibold text-gray-900">
                          <input
                            type="checkbox"
                            checked={formData.gdpr_consent}
                            onChange={(e) => handleInputChange('gdpr_consent', e.target.checked)}
                            required
                            className="mt-1 accent-blue-600"
                          />
                          <span>
                            Essential Consent <span className="text-red-500">*</span>
                            <div className="text-xs font-normal text-gray-600 mt-1">
                              I consent to CARTHA processing my personal data to provide waitlist services and send confirmation emails. <b>This consent is required to join the waitlist.</b>
                            </div>
                          </span>
                        </label>
                      </div>
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.marketing_consent}
                          onChange={(e) => handleInputChange('marketing_consent', e.target.checked)}
                          className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Marketing Communications (Optional)</span>
                          <p className="mt-1 text-gray-600">
                            I would like to receive updates about CARTHA's progress, new features, and exclusive founding member offers. 
                            You can unsubscribe at any time.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Back
                </button>
                <div className="flex space-x-3">
                  {step < 3 ? (
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        'Join Founding Member Program'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 