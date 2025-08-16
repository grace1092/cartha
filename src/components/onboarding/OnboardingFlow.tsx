'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, User, Settings, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{ onNext: () => void; onBack: () => void }>;
}

interface OnboardingFlowProps {
  onComplete: () => void;
  steps?: OnboardingStep[];
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CARTHA',
    description: 'Let\'s get your practice set up in just a few minutes',
    icon: User,
    component: WelcomeStep
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Tell us about yourself and your practice',
    icon: Settings,
    component: ProfileStep
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Set up your security preferences',
    icon: Shield,
    component: SecurityStep
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Customize your experience',
    icon: Zap,
    component: PreferencesStep
  }
];

export default function OnboardingFlow({ onComplete, steps = defaultSteps }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleNext = () => {
    const currentStepData = steps[currentStep];
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 mb-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold gradient-text">CARTHA</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentStepData.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentStepData.description}
              </p>
            </motion.div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = index === currentStep;
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isCurrent
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : isCompleted
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <StepComponent onNext={handleNext} onBack={handleBack} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSkip}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Skip
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep({ onNext }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <User className="w-12 h-12 text-white" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to CARTHA!
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        We're excited to help you streamline your therapy practice. Let's get started by setting up your profile and preferences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: User, title: 'Profile Setup', description: 'Tell us about your practice' },
          { icon: Shield, title: 'Security', description: 'HIPAA-compliant data protection' },
          { icon: Zap, title: 'Customization', description: 'Tailor to your workflow' }
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <item.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProfileStep({ onNext }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Your Practice Information
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Practice Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your practice name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            License Type
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Licensed Clinical Social Worker (LCSW)</option>
            <option>Licensed Professional Counselor (LPC)</option>
            <option>Licensed Marriage and Family Therapist (LMFT)</option>
            <option>Psychologist (PhD/PsyD)</option>
            <option>Psychiatrist (MD)</option>
            <option>Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            License Number
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your license number"
          />
        </div>
      </div>
    </div>
  );
}

function SecurityStep({ onNext }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Security & Privacy Settings
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-200">HIPAA Compliant</h3>
            <p className="text-sm text-green-700 dark:text-green-300">All data is encrypted and secure</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
            <span className="text-sm text-gray-700 dark:text-gray-300">Enable two-factor authentication</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
            <span className="text-sm text-gray-700 dark:text-gray-300">Receive security notifications</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Allow session timeout after 30 minutes</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function PreferencesStep({ onNext }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Customize Your Experience
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Session Duration
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>30 minutes</option>
            <option>45 minutes</option>
            <option>50 minutes</option>
            <option>60 minutes</option>
            <option>90 minutes</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme Preference
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Light', 'Dark', 'System'].map((theme) => (
              <button
                key={theme}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notification Preferences
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              <span className="text-sm text-gray-700 dark:text-gray-300">SMS reminders</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Push notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 