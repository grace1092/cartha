"use client";

import React, { useState } from 'react';
import { ArrowRight, Heart, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const CompatibilityScoreSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');

  const questions = [
    {
      id: 'spending_style',
      question: "When you get unexpected money, you usually:",
      options: [
        { value: 'save', label: "Save most of it", personality: 'saver' },
        { value: 'spend', label: "Treat yourself to something nice", personality: 'spender' },
        { value: 'split', label: "Save some, spend some", personality: 'balanced' },
        { value: 'invest', label: "Invest it for the future", personality: 'investor' }
      ]
    },
    {
      id: 'debt_comfort',
      question: "Your comfort level with debt is:",
      options: [
        { value: 'avoid', label: "Avoid it at all costs", personality: 'conservative' },
        { value: 'strategic', label: "Strategic debt is fine (mortgage, etc.)", personality: 'strategic' },
        { value: 'comfortable', label: "Comfortable with reasonable debt", personality: 'flexible' },
        { value: 'very_comfortable', label: "Debt is a tool to be leveraged", personality: 'aggressive' }
      ]
    },
    {
      id: 'financial_planning',
      question: "When it comes to financial planning:",
      options: [
        { value: 'detailed', label: "I have detailed budgets and plans", personality: 'planner' },
        { value: 'rough', label: "I have a rough idea of my finances", personality: 'casual' },
        { value: 'partner_handles', label: "I prefer my partner handles the details", personality: 'delegator' },
        { value: 'wing_it', label: "I prefer to go with the flow", personality: 'spontaneous' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string, personality: string) => {
    const newAnswers = { ...answers, [questionId]: { value, personality } };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateResults(newAnswers);
    }
  };

  const generateResults = (finalAnswers: any) => {
    // Simple compatibility logic - in real app, this would be more sophisticated
    setShowResults(true);
  };

  const getCompatibilityScore = () => {
    // Mock score generation - would be more complex in real implementation
    return Math.floor(Math.random() * 30) + 70; // 70-100 range
  };

  const getTopMatches = () => {
    return [
      { area: "Long-term Planning", status: "strong", icon: CheckCircle },
      { area: "Spending Philosophy", status: "moderate", icon: TrendingUp },
      { area: "Risk Tolerance", status: "needs_work", icon: AlertTriangle }
    ];
  };

  if (showResults) {
    const score = getCompatibilityScore();
    const matches = getTopMatches();
    
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Compatibility Score</h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                {score}%
              </div>
              <p className="text-xl text-gray-600">
                {score >= 80 ? "Great alignment! You're on the same page financially." : 
                 score >= 60 ? "Good foundation with some areas to explore together." :
                 "Important differences to discuss - but that's why you're here!"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {matches.map((match, index) => {
                const IconComponent = match.icon;
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <IconComponent className={`w-8 h-8 mx-auto mb-2 ${
                      match.status === 'strong' ? 'text-green-500' :
                      match.status === 'moderate' ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                    <h3 className="font-semibold text-gray-900 mb-1">{match.area}</h3>
                    <p className="text-sm text-gray-600 capitalize">{match.status.replace('_', ' ')}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Free Sample Conversation Starter:</h3>
              <p className="text-gray-700 italic">
                "I noticed we both value long-term planning. What's one financial goal you're excited about that we haven't talked about yet?"
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email for full compatibility report"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center">
                Get Full Report + Start Your Money Talks Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500">
                Unlock the complete card deck, weekly conversation guides, and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What's Your <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Financial Compatibility Score?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-2">Take our 3-minute challenge and get relationship clarity</p>
          <p className="text-sm text-gray-500">Over 25,000 couples have discovered their money compatibility</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-purple-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {questions[currentQuestion].question}
            </h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(questions[currentQuestion].id, option.value, option.personality)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
                >
                  <span className="text-gray-900 group-hover:text-purple-700">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              <span className="inline-flex items-center">
                <Heart className="w-4 h-4 text-red-500 mr-1" />
                Free • No spam • Results in 60 seconds
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityScoreSection; 