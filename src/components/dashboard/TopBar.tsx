'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { useState } from 'react';

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // Demo notification count

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors mr-3">
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Logo */}
        <h1 className="lg:hidden font-[family-name:var(--font-playfair)] text-xl font-bold text-[#222] mr-auto">
          Cartha
        </h1>

        {/* Search */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search clients, notes, appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">DR</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-[#222]">Dr. Demo</p>
              <p className="text-xs text-neutral-600">Licensed Therapist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
