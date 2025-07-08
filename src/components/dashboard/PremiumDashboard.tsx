'use client';

import { useState } from 'react';
import { Crown, Calendar, Target, TrendingUp, MessageCircle, Heart, ChevronRight, Settings, Award, BookOpen } from 'lucide-react';
import MoneyDateCalendar from '../money-date/MoneyDateCalendar';
import GoalTrackingDashboard from './GoalTrackingDashboard';
import RelationshipFinancialScore from '../gamification/RelationshipFinancialScore';

interface PremiumDashboardProps {
  className?: string;
}

const premiumFeatures = [
  {
    id: 'conversations',
    title: 'Unlimited Conversations',
    description: '25 conversations/month with 20 messages each',
    icon: MessageCircle,
    color: 'bg-blue-100 text-blue-700',
    status: 'active'
  },
  {
    id: 'money-dates',
    title: 'Money Date Calendar',
    description: 'Schedule regular financial check-ins',
    icon: Calendar,
    color: 'bg-pink-100 text-pink-700',
    status: 'active'
  },
  {
    id: 'goal-tracking',
    title: 'Goal Tracking Dashboard',
    description: 'Track your financial milestones',
    icon: Target,
    color: 'bg-green-100 text-green-700',
    status: 'active'
  },
  {
    id: 'financial-score',
    title: 'Relationship Financial Score',
    description: 'AI-powered compatibility scoring',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-700',
    status: 'active'
  },
  {
    id: 'templates',
    title: 'Premium Templates Library',
    description: 'Advanced conversation starters',
    icon: BookOpen,
    color: 'bg-yellow-100 text-yellow-700',
    status: 'coming-soon'
  },
  {
    id: 'budget-integration',
    title: 'Budget App Integration',
    description: 'Connect with Mint, YNAB, and more',
    icon: Settings,
    color: 'bg-indigo-100 text-indigo-700',
    status: 'coming-soon'
  }
];

export default function PremiumDashboard({ className = '' }: PremiumDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const TabButton = ({ id, label, icon: Icon, active }: { id: string; label: string; icon: any; active: boolean }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  const FeatureCard = ({ feature }: { feature: typeof premiumFeatures[0] }) => {
    const Icon = feature.icon;
    return (
      <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${feature.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
          {feature.status === 'coming-soon' && (
            <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
              Coming Soon
            </div>
          )}
        </div>
        
        {feature.status === 'active' && (
          <div className="flex items-center text-blue-600 text-sm font-medium cursor-pointer hover:text-blue-800">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        )}
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="h-8 w-8 text-yellow-300" />
          <div>
            <h2 className="text-2xl font-bold">Welcome to Premium!</h2>
            <p className="text-blue-100">You're unlocking the full potential of your financial partnership</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">25</div>
            <div className="text-sm text-blue-100">Conversations/Month</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">20</div>
            <div className="text-sm text-blue-100">Messages/Conversation</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">GPT-4</div>
            <div className="text-sm text-blue-100">AI Assistant</div>
          </div>
        </div>
      </div>

             {/* Premium Features Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Premium Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveTab('money-dates')}
            className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="h-5 w-5 text-pink-600" />
            <span className="text-sm font-medium">Schedule Money Date</span>
          </button>
          <button 
            onClick={() => setActiveTab('goals')}
            className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Target className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">Add Financial Goal</span>
          </button>
          <button className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Start Conversation</span>
          </button>
          <button 
            onClick={() => setActiveTab('score')}
            className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium">View Score</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Premium Dashboard</h1>
        <p className="text-gray-600">Manage your premium features and track your financial journey together</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-50 rounded-lg">
        <TabButton id="overview" label="Overview" icon={Crown} active={activeTab === 'overview'} />
        <TabButton id="money-dates" label="Money Dates" icon={Calendar} active={activeTab === 'money-dates'} />
        <TabButton id="goals" label="Goals" icon={Target} active={activeTab === 'goals'} />
        <TabButton id="score" label="Compatibility" icon={TrendingUp} active={activeTab === 'score'} />
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && <OverviewTab />}
        
        {activeTab === 'money-dates' && (
          <div>
            <MoneyDateCalendar />
          </div>
        )}
        
        {activeTab === 'goals' && (
          <div>
            <GoalTrackingDashboard />
          </div>
        )}
        
        {activeTab === 'score' && (
          <div>
            <RelationshipFinancialScore />
          </div>
        )}
      </div>

      {/* Premium Value Reminder */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <Award className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">You're Saving Money & Strengthening Your Relationship</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Your $20/month investment is helping you avoid costly financial mistakes and relationship conflicts. 
          Financial advisors cost $150-300/hour - you're getting ongoing guidance for a fraction of the cost!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$1,200+</div>
            <div className="text-sm text-gray-600">Average saved per year</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-sm text-gray-600">Couples report better communication</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">10x</div>
            <div className="text-sm text-gray-600">ROI on relationship investment</div>
          </div>
        </div>
      </div>
    </div>
  );
} 