'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Heart, MessageCircle, Target, TrendingUp, Users, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';

const StartFreePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [userInfo, setUserInfo] = useState({
    name: '',
    partnerName: '',
    relationship: '',
    primaryGoal: ''
  });
  const [quizAnswers, setQuizAnswers] = useState({});
  const [personalityResult, setPersonalityResult] = useState<any>(null);

  // Optimized onChange handlers using useCallback to prevent re-renders
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handlePartnerNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo(prev => ({ ...prev, partnerName: e.target.value }));
  }, []);

  const handleRelationshipChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserInfo(prev => ({ ...prev, relationship: e.target.value }));
  }, []);

  const handlePrimaryGoalChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserInfo(prev => ({ ...prev, primaryGoal: e.target.value }));
  }, []);

  const handleQuizAnswerChange = useCallback((questionId: number, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

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

  const personalityTypes = {
    security: {
      type: 'The Protector',
      description: 'You prioritize financial security and stability above all else.',
      color: 'bg-green-500',
      icon: '🛡️'
    },
    freedom: {
      type: 'The Adventurer',
      description: 'You see money as a tool for experiences and personal freedom.',
      color: 'bg-blue-500',
      icon: '🗺️'
    },
    status: {
      type: 'The Achiever',
      description: 'You view money as a reflection of success and accomplishment.',
      color: 'bg-purple-500',
      icon: '🏆'
    },
    stress: {
      type: 'The Avoider',
      description: 'You find money conversations stressful and prefer to avoid them.',
      color: 'bg-yellow-500',
      icon: '😰'
    }
  };

  const handleQuizComplete = () => {
    // Simple personality calculation based on most common answer
    const answers = Object.values(quizAnswers);
    const frequency: Record<string, number> = answers.reduce((acc: Record<string, number>, answer: any) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {});
    
    const dominantTrait = Object.keys(frequency).reduce((a, b) => 
      frequency[a] > frequency[b] ? a : b
    );
    
    setPersonalityResult(personalityTypes[dominantTrait as keyof typeof personalityTypes]);
    setCurrentStep(4);
  };

  // Memoize all step components to prevent re-rendering and focus loss
  const Step1Setup = useMemo(() => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to MoneyTalks Before Marriage™</h2>
        <p className="text-lg text-gray-600">Let's get you started with your personalized financial relationship insights</p>
      </div>
      
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (userInfo.name && userInfo.relationship && userInfo.primaryGoal) {
            setCurrentStep(2);
          }
        }}
        className="space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <label 
            htmlFor="userName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Name
          </label>
          <input
            key="userName"
            id="userName"
            type="text"
            value={userInfo.name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter your name"
            autoComplete="given-name"
            onFocus={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div>
          <label 
            htmlFor="partnerName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Partner's Name (Optional)
          </label>
          <input
            key="partnerName"
            id="partnerName"
            type="text"
            value={userInfo.partnerName}
            onChange={handlePartnerNameChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter your partner's name"
            autoComplete="name"
            onFocus={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div>
          <label 
            htmlFor="relationshipStatus"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Relationship Status
          </label>
          <select
            key="relationshipStatus"
            id="relationshipStatus"
            value={userInfo.relationship}
            onChange={handleRelationshipChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            onFocus={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="">Select your relationship status</option>
            <option value="dating">Dating</option>
            <option value="engaged">Engaged</option>
            <option value="married">Married</option>
            <option value="cohabiting">Living Together</option>
          </select>
        </div>
        
        <div>
          <label 
            htmlFor="primaryGoal"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Primary Financial Goal
          </label>
          <select
            key="primaryGoal"
            id="primaryGoal"
            value={userInfo.primaryGoal}
            onChange={handlePrimaryGoalChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            onFocus={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="">What's your biggest financial priority?</option>
            <option value="communication">Better money communication</option>
            <option value="planning">Joint financial planning</option>
            <option value="debt">Managing debt together</option>
            <option value="saving">Building savings goals</option>
            <option value="investing">Investment alignment</option>
            <option value="future">Planning for major life events</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={!userInfo.name || !userInfo.relationship || !userInfo.primaryGoal}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Money Personality Quiz
        </button>
      </form>
    </div>
  ), [userInfo, handleNameChange, handlePartnerNameChange, handleRelationshipChange, handlePrimaryGoalChange]);

  const Step2Quiz = useMemo(() => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Money Personality Quiz</h2>
        <p className="text-lg text-gray-600">Discover your unique money mindset in just 3 questions</p>
      </div>
      
      {quizQuestions.map((question) => (
        <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  onChange={(e) => handleQuizAnswerChange(question.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      
      <button
        onClick={handleQuizComplete}
        disabled={Object.keys(quizAnswers).length < 3}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Get My Money Personality
      </button>
    </div>
  ), [quizAnswers, handleQuizAnswerChange, handleQuizComplete]);

  const Step3Results = useMemo(() => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Money Personality</h2>
        <p className="text-lg text-gray-600">Here's what we discovered about your financial mindset</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center">
        <div className="text-6xl mb-4">{personalityResult?.icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{personalityResult?.type}</h3>
        <p className="text-gray-600 mb-6">{personalityResult?.description}</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Your Free Insights:</strong> Based on your personality, you'll benefit most from our guided conversation starters and financial alignment tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-green-800">Personalized conversation starters</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-green-800">5 AI conversations this month</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <Star className="w-6 h-6 text-yellow-600 mb-2 mx-auto" />
          <p className="text-sm text-yellow-800">
            <strong>Upgrade to see:</strong> Your complete compatibility score, detailed analysis, and conflict-resolution scripts
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setCurrentStep(4)}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Your First AI Conversation
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
          View Upgrade Options
        </button>
      </div>
    </div>
  ), [personalityResult]);

  const Step4Dashboard = useMemo(() => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard, {userInfo.name}!</h2>
        <p className="text-lg text-gray-600">You're ready to start improving your financial relationship</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Conversations</h3>
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-2">5</p>
          <p className="text-sm text-gray-600">remaining this month</p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Start Conversation
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Money Personality</h3>
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-lg font-bold text-green-600 mb-2">{personalityResult?.type}</p>
          <p className="text-sm text-gray-600 mb-4">Your financial mindset</p>
          <button 
            onClick={() => router.push('/pricing')}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            View Full Report ⭐
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Relationship Score</h3>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600 mb-2">67%</p>
          <p className="text-sm text-gray-600 mb-4">Financial compatibility</p>
          <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            Improve to 90%+ ⭐
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Next Steps</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
            <div>
              <p className="font-semibold text-gray-900">Start your first AI conversation</p>
              <p className="text-sm text-gray-600">Share your biggest money concern as a couple</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
            <div>
              <p className="font-semibold text-gray-900">Invite your partner</p>
              <p className="text-sm text-gray-600">Get their money personality and see your compatibility</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
            <div>
              <p className="font-semibold text-gray-900">Explore conversation starters</p>
              <p className="text-sm text-gray-600">Use our guided templates for your money talks</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to unlock your full potential?</h3>
            <p className="text-sm text-gray-600">Get unlimited AI conversations, complete personality analysis, and personalized financial planning tools</p>
          </div>
          <button 
            onClick={() => router.push('/pricing')}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  ), [userInfo.name, personalityResult]);

  const ProgressBar = () => (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        <span>Setup</span>
        <span>Quiz</span>
        <span>Results</span>
        <span>Dashboard</span>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="container mx-auto px-4">
          <ProgressBar />
          
          {currentStep === 1 && Step1Setup}
          {currentStep === 2 && Step2Quiz}
          {currentStep === 3 && Step3Results}
          {currentStep === 4 && Step4Dashboard}
        </div>
      </div>
    </>
  );
};

export default StartFreePage; 