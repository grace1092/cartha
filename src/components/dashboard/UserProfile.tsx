'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Key,
  Bell,
  CreditCard,
  Settings,
  Save,
  Edit,
  Upload,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Info,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface UserProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  professionalInfo: {
    title: string;
    licenseNumber: string;
    licenseState: string;
    specializations: string[];
    yearsExperience: number;
    education: {
      degree: string;
      institution: string;
      year: number;
    }[];
    certifications: {
      name: string;
      issuer: string;
      year: number;
      expiryDate?: string;
    }[];
  };
  practiceInfo: {
    practiceName: string;
    practiceType: 'solo' | 'group' | 'clinic';
    npiNumber?: string;
    taxId?: string;
    officeAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    officePhone?: string;
    website?: string;
  };
  preferences: {
    timezone: string;
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
    defaultSessionDuration: number;
    defaultSessionRate: number;
    currency: string;
    language: string;
  };
  notifications: {
    email: {
      appointments: boolean;
      reminders: boolean;
      billing: boolean;
      marketing: boolean;
    };
    sms: {
      appointments: boolean;
      reminders: boolean;
      billing: boolean;
    };
    push: {
      appointments: boolean;
      reminders: boolean;
      billing: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginHistory: {
      date: string;
      ip: string;
      location: string;
      device: string;
    }[];
  };
  subscription: {
    plan: string;
    status: 'active' | 'cancelled' | 'expired';
    billingCycle: 'monthly' | 'yearly';
    nextBillingDate: string;
    paymentMethod?: {
      type: 'card' | 'bank';
      last4: string;
      expiryDate?: string;
    };
  };
}

interface UserProfileProps {
  onBack?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'professional' | 'practice' | 'preferences' | 'notifications' | 'security' | 'billing'>('profile');
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockProfile: UserProfileData = {
      id: user?.id || '1',
      email: user?.email || 'dr.sarah.chen@example.com',
      firstName: 'Dr. Sarah',
      lastName: 'Chen',
      profileImage: '/api/placeholder/128/128',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Main Street, Suite 101',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'United States'
      },
      professionalInfo: {
        title: 'Licensed Clinical Psychologist',
        licenseNumber: 'PSY12345',
        licenseState: 'CA',
        specializations: ['Cognitive Behavioral Therapy', 'Trauma Therapy', 'Anxiety Disorders', 'Depression'],
        yearsExperience: 8,
        education: [
          {
            degree: 'Ph.D. in Clinical Psychology',
            institution: 'Stanford University',
            year: 2016
          },
          {
            degree: 'M.A. in Psychology',
            institution: 'University of California, Berkeley',
            year: 2012
          }
        ],
        certifications: [
          {
            name: 'Certified CBT Therapist',
            issuer: 'Academy of Cognitive Therapy',
            year: 2017,
            expiryDate: '2025-12-31'
          },
          {
            name: 'EMDR Certified Therapist',
            issuer: 'EMDR International Association',
            year: 2019,
            expiryDate: '2026-06-30'
          }
        ]
      },
      practiceInfo: {
        practiceName: 'Chen Psychology Associates',
        practiceType: 'solo',
        npiNumber: '1234567890',
        taxId: '12-3456789',
        officeAddress: {
          street: '123 Main Street, Suite 101',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'United States'
        },
        officePhone: '+1 (555) 123-4567',
        website: 'www.chenpsychology.com'
      },
      preferences: {
        timezone: 'America/Los_Angeles',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        defaultSessionDuration: 50,
        defaultSessionRate: 150,
        currency: 'USD',
        language: 'en'
      },
      notifications: {
        email: {
          appointments: true,
          reminders: true,
          billing: true,
          marketing: false
        },
        sms: {
          appointments: true,
          reminders: true,
          billing: false
        },
        push: {
          appointments: true,
          reminders: true,
          billing: true
        }
      },
      security: {
        twoFactorEnabled: true,
        lastPasswordChange: '2024-01-01T00:00:00Z',
        loginHistory: [
          {
            date: '2024-01-15T10:00:00Z',
            ip: '192.168.1.1',
            location: 'San Francisco, CA',
            device: 'Chrome on macOS'
          },
          {
            date: '2024-01-14T14:30:00Z',
            ip: '192.168.1.1',
            location: 'San Francisco, CA',
            device: 'Safari on iPhone'
          }
        ]
      },
      subscription: {
        plan: 'Solo Practitioner',
        status: 'active',
        billingCycle: 'monthly',
        nextBillingDate: '2024-02-15',
        paymentMethod: {
          type: 'card',
          last4: '4242',
          expiryDate: '12/25'
        }
      }
    };
    setProfileData(mockProfile);
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordChange(false);
    alert('Password changed successfully');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'practice', label: 'Practice', icon: Settings },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg">Profile Settings</h1>
          <p className="subheading">Manage your account and practice information</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
          {onBack && (
            <button onClick={onBack} className="btn-ghost">
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h2 className="heading-md">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-slate-600 mb-2">{profileData.professionalInfo.title}</p>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {profileData.email}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {profileData.phone}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profileData.address?.city}, {profileData.address?.state}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-slate-900 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-900 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-slate-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-600"
                  />
                  <p className="text-sm text-slate-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block font-medium text-slate-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone || ''}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-900 mb-2">Address</label>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={profileData.address?.street || ''}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      address: { ...profileData.address!, street: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={profileData.address?.city || ''}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address!, city: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={profileData.address?.state || ''}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address!, state: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={profileData.address?.zipCode || ''}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address!, zipCode: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-slate-900 mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={profileData.professionalInfo.title}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      professionalInfo: { ...profileData.professionalInfo, title: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-900 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    value={profileData.professionalInfo.yearsExperience}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      professionalInfo: { ...profileData.professionalInfo, yearsExperience: parseInt(e.target.value) }
                    })}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-slate-900 mb-2">License Number</label>
                  <input
                    type="text"
                    value={profileData.professionalInfo.licenseNumber}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      professionalInfo: { ...profileData.professionalInfo, licenseNumber: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-900 mb-2">License State</label>
                  <input
                    type="text"
                    value={profileData.professionalInfo.licenseState}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      professionalInfo: { ...profileData.professionalInfo, licenseState: e.target.value }
                    })}
                    disabled={!isEditing}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-900 mb-2">Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {profileData.professionalInfo.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-4">Education</h3>
                <div className="space-y-3">
                  {profileData.professionalInfo.education.map((edu, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                      <GraduationCap className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-medium text-slate-900">{edu.degree}</div>
                        <div className="text-sm text-slate-600">{edu.institution} • {edu.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-4">Certifications</h3>
                <div className="space-y-3">
                  {profileData.professionalInfo.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                      <Award className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{cert.name}</div>
                        <div className="text-sm text-slate-600">{cert.issuer} • {cert.year}</div>
                      </div>
                      {cert.expiryDate && (
                        <div className="text-right">
                          <div className="text-sm text-slate-600">Expires</div>
                          <div className="text-sm font-medium">{new Date(cert.expiryDate).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Account Security</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Keep your account secure with strong passwords and two-factor authentication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-slate-600" />
                    <div>
                      <div className="font-medium text-slate-900">Password</div>
                      <div className="text-sm text-slate-600">
                        Last changed: {new Date(profileData.security.lastPasswordChange).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="btn-secondary"
                  >
                    Change Password
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-600" />
                    <div>
                      <div className="font-medium text-slate-900">Two-Factor Authentication</div>
                      <div className="text-sm text-slate-600">
                        {profileData.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    profileData.security.twoFactorEnabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profileData.security.twoFactorEnabled ? 'Enabled' : 'Enable'}
                  </button>
                </div>
              </div>

              {showPasswordChange && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                    <h3 className="heading-sm mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium text-slate-900 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={passwordData.current}
                          onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                          className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-900 mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordData.new}
                          onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                          className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-900 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                          className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setShowPasswordChange(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordChange}
                        className="btn-primary"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-slate-900 mb-4">Recent Login Activity</h3>
                <div className="space-y-3">
                  {profileData.security.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <div className="font-medium text-slate-900">{login.device}</div>
                        <div className="text-sm text-slate-600">{login.location} • {login.ip}</div>
                      </div>
                      <div className="text-sm text-slate-600">
                        {new Date(login.date).toLocaleDateString()} {new Date(login.date).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900">Active Subscription</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Your {profileData.subscription.plan} plan is active and in good standing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Subscription Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Plan</span>
                      <span className="font-medium">{profileData.subscription.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Billing Cycle</span>
                      <span className="font-medium capitalize">{profileData.subscription.billingCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profileData.subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {profileData.subscription.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Next Billing Date</span>
                      <span className="font-medium">
                        {new Date(profileData.subscription.nextBillingDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Payment Method</h3>
                  {profileData.subscription.paymentMethod && (
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-600" />
                        <div>
                          <div className="font-medium text-slate-900">
                            {profileData.subscription.paymentMethod.type === 'card' ? 'Credit Card' : 'Bank Account'}
                          </div>
                          <div className="text-sm text-slate-600">
                            ****{profileData.subscription.paymentMethod.last4}
                            {profileData.subscription.paymentMethod.expiryDate && 
                              ` • Expires ${profileData.subscription.paymentMethod.expiryDate}`
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button className="btn-secondary w-full">
                    Update Payment Method
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="btn-secondary">
                  Download Invoice
                </button>
                <button className="btn-secondary">
                  Billing History
                </button>
                <button className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
                  Cancel Subscription
                </button>
              </div>
            </div>
          )}

          {/* Add other tab content here */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
