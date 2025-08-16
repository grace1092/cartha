'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Download, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail,
  Eye,
  Calendar,
  DollarSign,
  Building2,
  AlertCircle,
  BarChart3,
  FileText,
  Settings,
  X
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WaitlistStats {
  total_subscribers: number;
  confirmed_subscribers: number;
  pending_confirmation: number;
  unsubscribed: number;
  bounced: number;
  today_signups: number;
  this_week_signups: number;
  this_month_signups: number;
  avg_priority_score: number;
}

interface Subscriber {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  practice_name: string;
  practice_type: string;
  interest_level: string;
  timeline: string;
  budget_range: string;
  email_confirmed: boolean;
  status: string;
  priority_score: number;
  created_at: string;
  gdpr_consent: boolean;
  marketing_consent: boolean;
  phone?: string;
  state?: string;
  country?: string;
  license_type?: string;
  current_emr?: string;
  estimated_patients?: string;
  pain_points?: string[];
  updated_at?: string;
}

export const WaitlistDashboard = () => {
  const [stats, setStats] = useState<WaitlistStats | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    practice_type: '',
    interest_level: '',
    search: ''
  });
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadSubscribers();
  }, [currentPage, filters]);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/waitlist?action=stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        ...filters
      });

      const response = await fetch(`/api/admin/waitlist?action=subscribers&${params}`);

      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers);
        setTotalPages(data.pagination.total_pages);
      } else {
        setError('Failed to load subscribers');
      }
    } catch (error) {
      setError('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: 'csv' | 'json') => {
    try {
      setExportLoading(true);
      const params = new URLSearchParams({
        type,
        filters: JSON.stringify(filters)
      });

      const response = await fetch(`/api/admin/waitlist?action=export&${params}`);

      if (response.ok) {
        const data = await response.json();
        
        // Create and download file
        const blob = new Blob([data.data], { 
          type: type === 'csv' ? 'text/csv' : 'application/json' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleUpdateSubscriber = async (subscriberId: string, updates: any) => {
    try {
      const response = await fetch('/api/admin/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_subscriber',
          subscriber_id: subscriberId,
          ...updates
        })
      });

      if (response.ok) {
        loadSubscribers();
        setShowSubscriberModal(false);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const response = await fetch('/api/admin/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_subscriber',
          subscriber_id: subscriberId
        })
      });

      if (response.ok) {
        loadSubscribers();
        loadStats();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleResendConfirmation = async (subscriberId: string) => {
    try {
      const response = await fetch('/api/admin/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'resend_confirmation',
          subscriber_id: subscriberId
        })
      });

      if (response.ok) {
        alert('Confirmation email resent successfully');
      }
    } catch (error) {
      console.error('Resend error:', error);
    }
  };

  const openSubscriberModal = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setShowSubscriberModal(true);
  };

  const closeSubscriberModal = () => {
    setSelectedSubscriber(null);
    setShowSubscriberModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'unsubscribed': return 'text-red-600 bg-red-100';
      case 'bounced': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPracticeTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <Users className="w-4 h-4" />;
      case 'group': return <Building2 className="w-4 h-4" />;
      case 'clinic': return <Building2 className="w-4 h-4" />;
      case 'hospital': return <Building2 className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waitlist Management</h1>
          <p className="text-gray-600">Manage founding member program subscribers</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('csv')}
            disabled={exportLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            {exportLoading ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={exportLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            {exportLoading ? 'Exporting...' : 'Export JSON'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_subscribers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed_subscribers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending_confirmation}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">{stats.this_month_signups}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search by name, email, practice..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Practice Type</label>
            <select
              value={filters.practice_type}
              onChange={(e) => setFilters(prev => ({ ...prev, practice_type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="individual">Individual</option>
              <option value="group">Group</option>
              <option value="clinic">Clinic</option>
              <option value="hospital">Hospital</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Level</label>
            <select
              value={filters.interest_level}
              onChange={(e) => setFilters(prev => ({ ...prev, interest_level: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very_high">Very High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Practice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GDPR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {subscriber.first_name} {subscriber.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{subscriber.email}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getPracticeTypeIcon(subscriber.practice_type)}
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">
                            {subscriber.practice_name}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {subscriber.practice_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscriber.status)}`}>
                        {subscriber.status}
                      </span>
                      {!subscriber.email_confirmed && (
                        <div className="text-xs text-yellow-600 mt-1">Unconfirmed</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscriber.priority_score}
                      </div>
                      <div className="text-xs text-gray-500">
                        {subscriber.interest_level} interest
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {subscriber.timeline.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {subscriber.budget_range.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {subscriber.gdpr_consent && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Essential
                          </span>
                        )}
                        {subscriber.marketing_consent && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Marketing
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openSubscriberModal(subscriber)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResendConfirmation(subscriber.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubscriber(subscriber.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscriber Details Modal */}
      {showSubscriberModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Subscriber Details
                </h3>
                <button
                  onClick={closeSubscriberModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedSubscriber.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">
                      {selectedSubscriber.first_name} {selectedSubscriber.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Practice Name</label>
                    <p className="text-sm text-gray-900">{selectedSubscriber.practice_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Practice Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedSubscriber.practice_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedSubscriber.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-900">
                      {selectedSubscriber.state && selectedSubscriber.country 
                        ? `${selectedSubscriber.state}, ${selectedSubscriber.country}`
                        : 'Not provided'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Practice Details */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Practice Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">License Type</label>
                    <p className="text-sm text-gray-900">{selectedSubscriber.license_type || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current EMR</label>
                    <p className="text-sm text-gray-900">{selectedSubscriber.current_emr || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Patients</label>
                    <p className="text-sm text-gray-900">{selectedSubscriber.estimated_patients || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interest Level</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedSubscriber.interest_level}</p>
                  </div>
                </div>
              </div>

              {/* Timeline & Budget */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Timeline & Budget</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Implementation Timeline</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedSubscriber.timeline.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedSubscriber.budget_range.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              {/* Pain Points */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Pain Points</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedSubscriber.pain_points) && selectedSubscriber.pain_points.length > 0 ? (
                    selectedSubscriber.pain_points.map((point, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {point}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No pain points selected</p>
                  )}
                </div>
              </div>

              {/* Consent & Status */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Consent & Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">GDPR Consent</label>
                    <p className="text-sm text-gray-900">
                      {selectedSubscriber.gdpr_consent ? (
                        <span className="text-green-600">✓ Granted</span>
                      ) : (
                        <span className="text-red-600">✗ Not granted</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marketing Consent</label>
                    <p className="text-sm text-gray-900">
                      {selectedSubscriber.marketing_consent ? (
                        <span className="text-green-600">✓ Granted</span>
                      ) : (
                        <span className="text-red-600">✗ Not granted</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Confirmed</label>
                    <p className="text-sm text-gray-900">
                      {selectedSubscriber.email_confirmed ? (
                        <span className="text-green-600">✓ Confirmed</span>
                      ) : (
                        <span className="text-yellow-600">⏳ Pending</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSubscriber.status)}`}>
                      {selectedSubscriber.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Timestamps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Joined</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedSubscriber.created_at).toLocaleDateString()} at{' '}
                      {new Date(selectedSubscriber.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {selectedSubscriber.updated_at 
                        ? `${new Date(selectedSubscriber.updated_at).toLocaleDateString()} at ${new Date(selectedSubscriber.updated_at).toLocaleTimeString()}`
                        : 'Never updated'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={closeSubscriberModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleResendConfirmation(selectedSubscriber.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Resend Confirmation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 