'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { 
  Calendar,
  Users,
  FileText,
  DollarSign,
  Clock,
  Plus,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Activity,
  Target,
  BarChart3,
  CreditCard,
  CalendarClock,
  UserCheck,
  PieChart,
  TrendingDown,
  Edit,
  Eye,
  Trash2,
  Star,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { DashboardStats, RecentActivity, TherapyClient, TherapySession, Appointment } from '@/lib/types/therapy';

interface ComprehensiveDashboardProps {
  currentView?: 'dashboard' | 'clients' | 'sessions' | 'calendar' | 'billing' | 'analytics';
}

export default function ComprehensiveDashboard({ currentView = 'dashboard' }: ComprehensiveDashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState(currentView);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentClients, setRecentClients] = useState<TherapyClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading comprehensive dashboard data
    setTimeout(() => {
      setStats({
        total_clients: 47,
        active_clients: 42,
        weekly_sessions: 28,
        monthly_sessions: 118,
        outstanding_notes: 3,
        pending_appointments: 12,
        monthly_revenue: 8340,
        outstanding_bills: 1420
      });

      setRecentActivity([
        {
          id: '1',
          type: 'session',
          description: 'Completed session with Sarah Martinez',
          timestamp: '2 hours ago',
          client_name: 'Sarah Martinez'
        },
        {
          id: '2',
          type: 'payment',
          description: 'Payment received from James Wilson',
          timestamp: '4 hours ago',
          client_name: 'James Wilson',
          amount: 120
        },
        {
          id: '3',
          type: 'client_added',
          description: 'New client Emma Davis added to practice',
          timestamp: '1 day ago',
          client_name: 'Emma Davis'
        },
        {
          id: '4',
          type: 'appointment',
          description: 'Appointment confirmed with Michael Johnson',
          timestamp: '1 day ago',
          client_name: 'Michael Johnson'
        },
        {
          id: '5',
          type: 'note',
          description: 'Session notes completed for Lisa Thompson',
          timestamp: '2 days ago',
          client_name: 'Lisa Thompson'
        }
      ]);

      setRecentClients([
        {
          id: '1',
          therapist_id: user?.id || '',
          first_name: 'Sarah',
          last_name: 'Martinez',
          email: 'sarah.martinez@email.com',
          phone: '(555) 123-4567',
          status: 'active',
          intake_date: '2024-01-15',
          last_session_date: '2024-02-12T14:00:00Z',
          next_appointment: '2024-02-19T14:00:00Z',
          session_rate: 120,
          presenting_concerns: 'Anxiety and stress management',
          treatment_goals: ['Reduce anxiety symptoms', 'Improve coping strategies'],
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-02-12T15:00:00Z'
        },
        {
          id: '2',
          therapist_id: user?.id || '',
          first_name: 'Michael',
          last_name: 'Johnson',
          email: 'michael.j@email.com',
          phone: '(555) 234-5678',
          status: 'active',
          intake_date: '2024-01-22',
          last_session_date: '2024-02-10T10:00:00Z',
          next_appointment: '2024-02-17T10:00:00Z',
          session_rate: 130,
          presenting_concerns: 'Depression and relationship issues',
          treatment_goals: ['Improve mood', 'Better communication skills'],
          created_at: '2024-01-22T09:00:00Z',
          updated_at: '2024-02-10T11:00:00Z'
        },
        {
          id: '3',
          therapist_id: user?.id || '',
          first_name: 'Emma',
          last_name: 'Davis',
          email: 'emma.davis@email.com',
          phone: '(555) 345-6789',
          status: 'active',
          intake_date: '2024-02-01',
          next_appointment: '2024-02-16T16:00:00Z',
          session_rate: 110,
          presenting_concerns: 'Work-related stress and burnout',
          treatment_goals: ['Stress reduction', 'Work-life balance'],
          created_at: '2024-02-01T14:00:00Z',
          updated_at: '2024-02-01T15:00:00Z'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [user?.id]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'client_added':
        return <UserCheck className="w-4 h-4 text-purple-500" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'note':
        return <CheckCircle className="w-4 h-4 text-teal-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-5 h-5" />, href: '/dashboard' },
    { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" />, href: '/dashboard/clients' },
    { id: 'sessions', label: 'Sessions', icon: <FileText className="w-5 h-5" />, href: '/dashboard/sessions' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" />, href: '/dashboard/calendar' },
    { id: 'billing', label: 'Billing', icon: <DollarSign className="w-5 h-5" />, href: '/dashboard/billing' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/dashboard/analytics' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-gray-900">Cartha</span>
              </Link>
              <nav className="hidden md:flex space-x-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveView(item.id as any)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, Dr. {user?.email?.split('@')[0] || 'Therapist'}
              </h1>
              <p className="text-blue-100">Here's what's happening in your practice today</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Clients</p>
                    <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats?.total_clients}</p>
                    <p className="text-xs text-gray-500 mt-1">{loading ? '...' : stats?.active_clients} active</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+8% this month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Weekly Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats?.weekly_sessions}</p>
                    <p className="text-xs text-gray-500 mt-1">This week</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12% from last week</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Outstanding Notes</p>
                    <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats?.outstanding_notes}</p>
                    <p className="text-xs text-gray-500 mt-1">Need completion</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-yellow-600">Due today</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${loading ? '...' : stats?.monthly_revenue?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">This month</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+15% vs last month</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link 
                  href="/dashboard/clients/new" 
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left group"
                >
                  <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">Add New Client</div>
                    <div className="text-sm text-blue-700">Create client profile</div>
                  </div>
                </Link>
                
                <Link 
                  href="/dashboard/sessions/new" 
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left group"
                >
                  <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-green-900">Schedule Session</div>
                    <div className="text-sm text-green-700">Book appointment</div>
                  </div>
                </Link>
                
                <Link 
                  href="/dashboard/sessions" 
                  className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left group"
                >
                  <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-purple-900">Session Notes</div>
                    <div className="text-sm text-purple-700">Document session</div>
                  </div>
                </Link>

                <Link 
                  href="/dashboard/billing" 
                  className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left group"
                >
                  <div className="p-2 bg-orange-600 rounded-lg group-hover:bg-orange-700 transition-colors">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-orange-900">Create Invoice</div>
                    <div className="text-sm text-orange-700">Bill for services</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Clients and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Clients */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
                  <Link href="/dashboard/clients" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentClients.map((client) => (
                    <div key={client.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {client.first_name} {client.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last: {client.last_session_date ? formatDate(client.last_session_date) : 'No sessions yet'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Next: {client.next_appointment ? formatDate(client.next_appointment) : 'Not scheduled'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <Link href="/dashboard/activity" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        {activity.amount && (
                          <p className="text-xs text-green-600 font-medium">${activity.amount}</p>
                        )}
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                  <p className="text-sm text-gray-600">Session Attendance Rate</p>
                  <p className="text-xs text-green-600 mt-1">+3% from last month</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <PieChart className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-sm text-gray-600">Client Retention Rate</p>
                  <p className="text-xs text-green-600 mt-1">+5% from last month</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">2.3h</p>
                  <p className="text-sm text-gray-600">Avg. Weekly Admin Time</p>
                  <p className="text-xs text-red-600 mt-1">-1.2h from last month</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other views */}
        {activeView !== 'dashboard' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {menuItems.find(item => item.id === activeView)?.label}
            </h2>
            <p className="text-gray-600 mb-6">
              This section is under development. Full functionality coming soon.
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setActiveView('dashboard')}
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
