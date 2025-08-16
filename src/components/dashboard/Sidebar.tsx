'use client';

import { FileText, Mail, Users, Shield, Calendar, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
  { name: 'Notes', icon: FileText, href: '#notes', id: 'notes' },
  { name: 'Follow-ups', icon: Mail, href: '#followups', id: 'followups' },
  { name: 'Clients', icon: Users, href: '#clients', id: 'clients' },
  { name: 'Security', icon: Shield, href: '#security', id: 'security' },
  { name: 'Scheduling', icon: Calendar, href: '#scheduling', id: 'scheduling' },
  { name: 'Analytics', icon: BarChart3, href: '#analytics', id: 'analytics' },
  { name: 'Settings', icon: Settings, href: '#settings', id: 'settings' },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('notes');

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 overflow-y-auto">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-neutral-100">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#222]">
          Cartha
        </h1>
        <p className="text-sm text-neutral-600 mt-1">Practice Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-100 bg-white">
        <div className="text-xs text-neutral-500 text-center">
          <p>HIPAA-ready architecture</p>
          <p className="mt-1">Demo environment</p>
        </div>
      </div>
    </div>
  );
}
