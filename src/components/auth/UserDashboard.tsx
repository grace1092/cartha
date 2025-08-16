'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { 
  User, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut, 
  Crown, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Building,
  Mail,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  Bell,
  Phone,
  MessageSquare,
  BookOpen,
  Target,
  BarChart3,
  Plus
} from 'lucide-react';

export default function UserDashboard() {
  const { user, signOut, isTrialExpired, daysLeftInTrial } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'billing'>('overview');

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
  };

  const getTrialStatusColor = () => {
    if (isTrialExpired) return 'text-red-600';
    if (daysLeftInTrial <= 7) return 'text-orange-600';
    return 'text-green-600';
  };

  const getTrialStatusIcon = () => {
    if (isTrialExpired) return <AlertTriangle className="w-5 h-5" />;
    if (daysLeftInTrial <= 7) return <Clock className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              {user.isTrial && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getTrialStatusColor()} bg-gray-100`}>
                  {getTrialStatusIcon()}
                  <span>
                    {isTrialExpired ? 'Trial Expired' : `${daysLeftInTrial} days left`}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-semibold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <div className="flex items-center justify-center mt-2">
                  <Building className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-gray-600 text-sm">{user.practiceName}</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'overview' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'profile' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'billing' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Billing</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Trial Status Card */}
                {user.isTrial && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Trial Status</h2>
                      <Crown className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className={`flex items-center space-x-3 p-4 rounded-lg ${getTrialStatusColor()} bg-gray-50`}>
                      {getTrialStatusIcon()}
                      <div>
                        <p className="font-medium">
                          {isTrialExpired ? 'Your trial has expired' : `${daysLeftInTrial} days remaining in your trial`}
                        </p>
                        <p className="text-sm opacity-75">
                          {isTrialExpired 
                            ? 'Upgrade to continue using all features' 
                            : 'Upgrade anytime to unlock premium features'
                          }
                        </p>
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                      {isTrialExpired ? 'Upgrade Now' : 'Upgrade to Premium'}
                    </button>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Clients</p>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                        <p className="text-xs text-green-600 mt-1">+3 this month</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">This Week's Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">18</p>
                        <p className="text-xs text-blue-600 mt-1">2 scheduled today</p>
                      </div>
                      <Calendar className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Outstanding Notes</p>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                        <p className="text-xs text-orange-600 mt-1">Due within 24hrs</p>
                      </div>
                      <FileText className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$8,400</p>
                        <p className="text-xs text-green-600 mt-1">+12% vs last month</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Core Features */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Core Features</h2>
                    <span className="text-sm text-gray-500">Lightweight client management that works</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { 
                        name: 'AI Session Notes', 
                        icon: FileText, 
                        href: '/dashboard/sessions', 
                        description: 'Generate comprehensive notes with AI assistance',
                        status: 'active',
                        color: 'text-blue-500'
                      },
                      { 
                        name: 'Client Management', 
                        icon: Users, 
                        href: '/dashboard/clients', 
                        description: 'Organize and track all your client information',
                        status: 'active',
                        color: 'text-green-500'
                      },
                      { 
                        name: 'Smart Scheduling', 
                        icon: Calendar, 
                        href: '/dashboard/calendar', 
                        description: 'Intelligent appointment scheduling',
                        status: 'active',
                        color: 'text-purple-500'
                      },
                      { 
                        name: 'Billing & Invoicing', 
                        icon: CreditCard, 
                        href: '/dashboard/billing', 
                        description: 'Automated billing and payment tracking',
                        status: 'active',
                        color: 'text-orange-500'
                      },
                      { 
                        name: 'Follow-up Automation', 
                        icon: Mail, 
                        href: '/dashboard/communications', 
                        description: 'Automated follow-up emails and reminders',
                        status: 'active',
                        color: 'text-pink-500'
                      },
                      { 
                        name: 'Practice Analytics', 
                        icon: TrendingUp, 
                        href: '/dashboard/analytics', 
                        description: 'Insights into your practice performance',
                        status: 'active',
                        color: 'text-indigo-500'
                      }
                    ].map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className="flex flex-col space-y-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-6 h-6 ${tool.color}`} />
                            <span className="font-medium text-gray-900 group-hover:text-blue-700">{tool.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                            <span className="text-xs text-blue-600 group-hover:text-blue-700">Open →</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Session completed with Maria Rodriguez</p>
                        <p className="text-xs text-gray-500">2 hours ago • Notes auto-generated and saved</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New appointment scheduled</p>
                        <p className="text-xs text-gray-500">4 hours ago • John Smith, Thursday 2:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <FileText className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Session note reminder</p>
                        <p className="text-xs text-gray-500">6 hours ago • Please complete notes for yesterday's session with Alex Chen</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Activity className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Welcome to Cartha!</p>
                        <p className="text-xs text-gray-500">Your account was created successfully. Start by adding your first client.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex items-center space-x-2 p-3 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Add New Client</span>
                    </button>
                    <button className="flex items-center space-x-2 p-3 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Schedule Session</span>
                    </button>
                    <button className="flex items-center space-x-2 p-3 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">Create Note</span>
                    </button>
                    <button className="flex items-center space-x-2 p-3 border border-orange-200 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-700">Send Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={user.firstName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={user.lastName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Practice Name</label>
                    <input
                      type="text"
                      value={user.practiceName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Practice Type</label>
                    <input
                      type="text"
                      value={user.practiceType.charAt(0).toUpperCase() + user.practiceType.slice(1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Account Type</span>
                        <span className="text-sm font-medium text-gray-900">{user.isTrial ? 'Free Trial' : 'Paid Account'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Account Created</span>
                        <span className="text-sm font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Plan</span>
                        <span className="text-sm font-medium text-gray-900">{user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isTrial ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.isTrial ? 'Free Trial' : user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Plan: {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}</p>
                      <p>Status: {user.isSubscribed ? 'Active' : 'Trial'}</p>
                      {user.isTrial && user.trialEndDate && (
                        <p>Trial ends: {new Date(user.trialEndDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>

                  {/* Upgrade Options */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Upgrade Options</h3>
                    <p className="text-gray-600 mb-6">Choose the plan that fits your practice size and needs.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { 
                          name: 'Solo Practitioner', 
                          price: '$50', 
                          features: [
                            'AI-powered session notes',
                            'Client progress tracking',
                            'Automated follow-ups',
                            'HIPAA-compliant security',
                            'Mobile app access',
                            'Billing & invoicing',
                            'Email support'
                          ] 
                        },
                        { 
                          name: 'Small Group Practice', 
                          price: '$150', 
                          subtitle: '2-10 practitioners',
                          features: [
                            'Everything in Solo, plus:',
                            'Multi-user collaboration',
                            'Advanced analytics',
                            'Custom client forms',
                            'Team scheduling',
                            'Priority phone support'
                          ] 
                        },
                        { 
                          name: 'Large Organization', 
                          price: '$500', 
                          subtitle: '10+ practitioners',
                          features: [
                            'Everything in Small Group, plus:',
                            'Unlimited users & locations',
                            'Dedicated account manager',
                            'Custom API access',
                            'Advanced security',
                            '24/7 priority support'
                          ] 
                        }
                      ].map((plan) => (
                        <div key={plan.name} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                          <h4 className="font-medium text-gray-900 mb-2">{plan.name}</h4>
                          <p className="text-2xl font-bold text-gray-900 mb-1">{plan.price}<span className="text-sm font-normal text-gray-600">/month</span></p>
                          {plan.subtitle && <p className="text-sm text-gray-600 mb-3">{plan.subtitle}</p>}
                          <ul className="space-y-1 text-sm text-gray-600 mb-4">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                            Choose {plan.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}