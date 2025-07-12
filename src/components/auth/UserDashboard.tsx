'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
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
  Mail
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
                  <User className="w-5 h-5" />
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

                {/* Quick Access Tools */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'AI Session Notes', icon: '📝', href: '#session-notes' },
                      { name: 'Follow-up Emails', icon: '📧', href: '#follow-up' },
                      { name: 'Client Management', icon: '👥', href: '#clients' },
                      { name: 'Security & Compliance', icon: '🔒', href: '#security' },
                      { name: 'Smart Scheduling', icon: '📅', href: '#scheduling' },
                      { name: 'Practice Analytics', icon: '📊', href: '#analytics' }
                    ].map((tool) => (
                      <a
                        key={tool.name}
                        href={tool.href}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                      >
                        <span className="text-2xl">{tool.icon}</span>
                        <span className="font-medium text-gray-900">{tool.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Welcome to TherapyNotes! Your account was created successfully.</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Your 30-day free trial has started.</span>
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: 'Basic', price: '$29', features: ['AI Session Notes', 'Basic Analytics'] },
                        { name: 'Professional', price: '$59', features: ['All Basic features', 'Follow-up Emails', 'Advanced Analytics'] },
                        { name: 'Enterprise', price: '$99', features: ['All Professional features', 'Priority Support', 'Custom Integrations'] }
                      ].map((plan) => (
                        <div key={plan.name} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{plan.name}</h4>
                          <p className="text-2xl font-bold text-gray-900 mb-3">{plan.price}<span className="text-sm font-normal text-gray-600">/month</span></p>
                          <ul className="space-y-1 text-sm text-gray-600 mb-4">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
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