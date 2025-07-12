'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  practiceName: string;
  practiceType: string;
  isTrial: boolean;
  trialEndDate: string | null;
  isSubscribed: boolean;
  subscriptionTier: 'trial' | 'basic' | 'professional' | 'enterprise';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  isTrialExpired: boolean;
  daysLeftInTrial: number;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  practiceName: string;
  practiceType: string;
  agreeToTerms: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: { [email: string]: { password: string; user: User } } = {
  'demo@therapy.com': {
    password: 'demo123',
    user: {
      id: '1',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'demo@therapy.com',
      practiceName: 'Johnson Therapy Practice',
      practiceType: 'individual',
      isTrial: true,
      trialEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days left
      isSubscribed: false,
      subscriptionTier: 'trial',
      createdAt: new Date().toISOString()
    }
  },
  'premium@therapy.com': {
    password: 'premium123',
    user: {
      id: '2',
      firstName: 'Dr. Michael',
      lastName: 'Chen',
      email: 'premium@therapy.com',
      practiceName: 'Chen & Associates',
      practiceType: 'group',
      isTrial: false,
      trialEndDate: null,
      isSubscribed: true,
      subscriptionTier: 'professional',
      createdAt: new Date().toISOString()
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('therapyNotes_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('therapyNotes_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('therapyNotes_user');
    }
  }, [user]);

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const demoUser = DEMO_USERS[email];
    
    if (!demoUser || demoUser.password !== password) {
      throw new Error('Invalid credentials');
    }

    const userData = { ...demoUser.user };
    
    // If remember me is not checked, don't persist to localStorage
    if (!rememberMe) {
      // For demo purposes, we'll still store it but you could implement session storage
      console.log('Remember me not checked - would use session storage in production');
    }

    setUser(userData);
  };

  const signUp = async (userData: SignUpData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create new user with trial status
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      practiceName: userData.practiceName,
      practiceType: userData.practiceType,
      isTrial: true,
      trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
      isSubscribed: false,
      subscriptionTier: 'trial',
      createdAt: new Date().toISOString()
    };

    // Add to demo users for future sign-ins
    DEMO_USERS[userData.email] = {
      password: userData.password,
      user: newUser
    };

    setUser(newUser);
  };

  const signOut = () => {
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send an email
    console.log(`Password reset email would be sent to ${email}`);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  // Calculate trial status
  const isTrialExpired = user?.isTrial && user?.trialEndDate 
    ? new Date(user.trialEndDate) < new Date()
    : false;

  const daysLeftInTrial = user?.isTrial && user?.trialEndDate
    ? Math.max(0, Math.ceil((new Date(user.trialEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUser,
    isTrialExpired,
    daysLeftInTrial
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 