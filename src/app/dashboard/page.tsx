'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import NotesCard from '@/components/dashboard/NotesCard';
import FollowupsCard from '@/components/dashboard/FollowupsCard';
import ClientsCard from '@/components/dashboard/ClientsCard';
import SchedulingCard from '@/components/dashboard/SchedulingCard';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import SecurityCard from '@/components/dashboard/SecurityCard';
import { DashboardProvider } from '@/lib/context/DashboardContext';

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#FAFAF7]">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="lg:ml-64">
          {/* Top Bar */}
          <TopBar />

          {/* Dashboard Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#222] mb-2">
              Dashboard
            </h1>
            <p className="text-neutral-600">
              Welcome back! Here's what's happening with your practice today.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Notes Card */}
            <div id="notes">
              <NotesCard />
            </div>

            {/* Follow-ups Card */}
            <div id="followups">
              <FollowupsCard />
            </div>

            {/* Clients Card */}
            <div id="clients">
              <ClientsCard />
            </div>

            {/* Scheduling Card */}
            <div id="scheduling">
              <SchedulingCard />
            </div>

            {/* Analytics Card - Full Width */}
            <div id="analytics" className="lg:col-span-2">
              <AnalyticsCard />
            </div>

            {/* Security Card - Half Width */}
            <div id="security" className="lg:col-span-1">
              <SecurityCard />
            </div>
          </div>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}