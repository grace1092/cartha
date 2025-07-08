'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Target, Crown, Archive, Heart, TrendingUp, Clock, Users, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  moneyDatesCompleted: number;
  milestonesAchieved: number;
  legacyScore: number;
  vaultEntries: number;
  relationshipStrength: number;
  financialAlignment: number;
}

interface RecentActivity {
  id: string;
  type: 'money-date' | 'milestone' | 'legacy' | 'vault';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ComponentType<{ className?: string }>;
}

export default function EstateDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    moneyDatesCompleted: 8,
    milestonesAchieved: 3,
    legacyScore: 87,
    vaultEntries: 12,
    relationshipStrength: 92,
    financialAlignment: 85
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'money-date',
      title: 'Monthly Budget Review',
      description: 'Completed your December alignment ritual',
      timestamp: new Date('2024-12-15'),
      icon: Calendar
    },
    {
      id: '2',
      type: 'milestone',
      title: 'Emergency Fund Goal',
      description: 'Reached $10,000 milestone together',
      timestamp: new Date('2024-12-10'),
      icon: Target
    },
    {
      id: '3',
      type: 'legacy',
      title: 'Legacy Index Update',
      description: 'Score increased to 87% compatibility',
      timestamp: new Date('2024-12-08'),
      icon: Crown
    }
  ]);

  const features = [
    {
      id: 'money-dates',
      title: 'Money Dates',
      subtitle: 'Weekly Alignment Rituals',
      description: 'Transform financial conversations into intimate connection moments',
      icon: Calendar,
      color: 'from-[var(--sage-green)] to-[var(--old-gold)]',
      href: '/money-dates',
      stats: `${stats.moneyDatesCompleted} completed`,
      nextAction: 'Schedule next ritual'
    },
    {
      id: 'milestone-planner',
      title: 'Milestone Planner',
      subtitle: 'Life + Wealth Goals',
      description: 'Design your shared future with precision and intention',
      icon: Target,
      color: 'from-[var(--old-gold)] to-[var(--estate-navy)]',
      href: '/milestones',
      stats: `${stats.milestonesAchieved} achieved`,
      nextAction: 'Set new milestone'
    },
    {
      id: 'legacy-index',
      title: 'Legacy Index',
      subtitle: 'Compatibility + Vision',
      description: 'Measure your alignment and build generational wealth mindset',
      icon: Crown,
      color: 'from-[var(--estate-navy)] to-[var(--old-gold)]',
      href: '/legacy',
      stats: `${stats.legacyScore}% compatibility`,
      nextAction: 'View insights'
    },
    {
      id: 'vault',
      title: 'The Vault',
      subtitle: 'Private Financial Archive',
      description: 'Secure repository for your most important financial conversations',
      icon: Archive,
      color: 'from-[var(--charcoal)] to-[var(--estate-navy)]',
      href: '/vault',
      stats: `${stats.vaultEntries} entries`,
      nextAction: 'Add new entry'
    }
  ];

  return (
    <div className="layout-estate min-h-screen">
      <div className="container-estate py-8">
        {/* Estate Header */}
        <div className="mb-8">
          <h1 className="text-estate mb-2">Your Estate Dashboard</h1>
          <p className="text-intimate max-w-2xl">
            A private space to cultivate financial intimacy and build lasting wealth together.
          </p>
        </div>

        {/* Relationship Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-vault">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-[var(--sage-green)]" />
              <span className="text-whisper">Relationship</span>
            </div>
            <div className="text-legacy text-[var(--estate-navy)]">{stats.relationshipStrength}%</div>
            <div className="text-whisper mt-1">Emotional Strength</div>
            <div className="progress-estate mt-3">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.relationshipStrength}%` }}
              />
            </div>
          </div>

          <div className="card-vault">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-[var(--old-gold)]" />
              <span className="text-whisper">Financial</span>
            </div>
            <div className="text-legacy text-[var(--estate-navy)]">{stats.financialAlignment}%</div>
            <div className="text-whisper mt-1">Wealth Alignment</div>
            <div className="progress-estate mt-3">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.financialAlignment}%` }}
              />
            </div>
          </div>

          <div className="card-vault">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-[var(--estate-navy)]" />
              <span className="text-whisper">Consistency</span>
            </div>
            <div className="text-legacy text-[var(--estate-navy)]">3.2x</div>
            <div className="text-whisper mt-1">Monthly Frequency</div>
            <div className="badge-milestone mt-3">Above Average</div>
          </div>

          <div className="card-vault">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-[var(--sage-green)]" />
              <span className="text-whisper">Together</span>
            </div>
            <div className="text-legacy text-[var(--estate-navy)]">8</div>
            <div className="text-whisper mt-1">Months Active</div>
            <div className="badge-legacy mt-3">Committed</div>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link 
                key={feature.id} 
                href={feature.href}
                className="card-estate hover-estate group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-[var(--warm-white)]" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--estate-navy)]/40 group-hover:text-[var(--estate-navy)] transition-colors duration-200" />
                </div>
                
                <h3 className="text-legacy mb-1">{feature.title}</h3>
                <p className="text-whisper mb-3">{feature.subtitle}</p>
                <p className="text-intimate mb-4">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="badge-legacy">{feature.stats}</div>
                  <div className="flex items-center space-x-2 text-[var(--estate-navy)] group-hover:text-[var(--old-gold)] transition-colors duration-200">
                    <span className="text-whisper">{feature.nextAction}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="card-estate">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-legacy">Recent Activity</h3>
            <Link href="/activity" className="text-whisper hover:text-[var(--estate-navy)] transition-colors duration-200">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-[var(--estate-cream)] transition-colors duration-200">
                  <div className="w-10 h-10 bg-[var(--estate-navy)]/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--estate-navy)]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-vault mb-1">{activity.title}</h4>
                    <p className="text-whisper mb-2">{activity.description}</p>
                    <span className="text-whisper text-sm">
                      {activity.timestamp.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estate Footer */}
        <div className="mt-12 text-center">
          <div className="divider-estate mb-6" />
          <div className="flex items-center justify-center space-x-2 text-whisper">
            <Sparkles className="w-4 h-4" />
            <span>Your estate grows stronger with each conversation</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
} 