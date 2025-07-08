'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Heart, TrendingUp, DollarSign, Target, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface MoneyDate {
  id: string;
  user_id: string;
  title: string;
  date: string;
  time: string;
  type: 'budget_review' | 'goal_check' | 'spending_review' | 'investment_discussion' | 'custom';
  status: 'scheduled' | 'completed' | 'missed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface MoneyDateCalendarProps {
  className?: string;
}

const dateTypes = {
  budget_review: {
    label: 'Budget Review',
    icon: DollarSign,
    color: 'bg-green-100 text-green-800',
    description: 'Monthly budget check-in and adjustments'
  },
  goal_check: {
    label: 'Goal Check-in',
    icon: Target,
    color: 'bg-blue-100 text-blue-800',
    description: 'Progress review on financial goals'
  },
  spending_review: {
    label: 'Spending Review',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-800',
    description: 'Analyze spending patterns and habits'
  },
  investment_discussion: {
    label: 'Investment Planning',
    icon: Heart,
    color: 'bg-pink-100 text-pink-800',
    description: 'Discuss investment strategies and portfolio'
  },
  custom: {
    label: 'Custom Discussion',
    icon: Calendar,
    color: 'bg-gray-100 text-gray-800',
    description: 'Custom financial conversation topic'
  }
};

export default function MoneyDateCalendar({ className = '' }: MoneyDateCalendarProps) {
  const [moneyDates, setMoneyDates] = useState<MoneyDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [newDate, setNewDate] = useState({
    title: '',
    date: '',
    time: '',
    type: 'budget_review' as keyof typeof dateTypes,
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoneyDates();
  }, []);

  const fetchMoneyDates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('money_dates')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching money dates:', error);
        return;
      }

      setMoneyDates(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleMoneyDate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('money_dates')
        .insert({
          user_id: user.id,
          title: newDate.title,
          date: newDate.date,
          time: newDate.time,
          type: newDate.type,
          notes: newDate.notes,
          status: 'scheduled'
        });

      if (error) {
        console.error('Error scheduling money date:', error);
        return;
      }

      // Reset form
      setNewDate({
        title: '',
        date: '',
        time: '',
        type: 'budget_review',
        notes: ''
      });
      setShowScheduler(false);
      fetchMoneyDates();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAsCompleted = async (dateId: string) => {
    try {
      const { error } = await supabase
        .from('money_dates')
        .update({ status: 'completed' })
        .eq('id', dateId);

      if (error) {
        console.error('Error updating money date:', error);
        return;
      }

      fetchMoneyDates();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getUpcomingDates = () => {
    const today = new Date();
    return moneyDates.filter(date => {
      const dateObj = new Date(date.date);
      return dateObj >= today;
    }).slice(0, 3);
  };

  const getCompletedThisMonth = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    return moneyDates.filter(date => {
      const dateObj = new Date(date.date);
      return dateObj.getMonth() === thisMonth && 
             dateObj.getFullYear() === thisYear && 
             date.status === 'completed';
    }).length;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-2 rounded-lg">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Money Date Calendar</h3>
              <p className="text-sm text-gray-600">Schedule regular financial check-ins</p>
            </div>
          </div>
          <button
            onClick={() => setShowScheduler(!showScheduler)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Schedule Date
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{getCompletedThisMonth()}</div>
            <div className="text-sm text-green-700">Completed This Month</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{getUpcomingDates().length}</div>
            <div className="text-sm text-blue-700">Upcoming Dates</div>
          </div>
        </div>

        {/* Scheduler */}
        {showScheduler && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-4">Schedule Money Date</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newDate.title}
                  onChange={(e) => setNewDate({...newDate, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Monthly Budget Review"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate.date}
                    onChange={(e) => setNewDate({...newDate, date: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newDate.time}
                    onChange={(e) => setNewDate({...newDate, time: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newDate.type}
                  onChange={(e) => setNewDate({...newDate, type: e.target.value as keyof typeof dateTypes})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {Object.entries(dateTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={newDate.notes}
                  onChange={(e) => setNewDate({...newDate, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                  placeholder="Any specific topics or goals to discuss..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={scheduleMoneyDate}
                  disabled={!newDate.title || !newDate.date || !newDate.time}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
                >
                  Schedule Date
                </button>
                <button
                  onClick={() => setShowScheduler(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Dates */}
        <div>
          <h4 className="font-semibold mb-4">Upcoming Money Dates</h4>
          {getUpcomingDates().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No upcoming money dates scheduled.</p>
              <p className="text-sm">Schedule your first financial check-in!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getUpcomingDates().map((date) => {
                const typeInfo = dateTypes[date.type];
                const Icon = typeInfo.icon;
                
                return (
                  <div key={date.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{date.title}</h5>
                          <p className="text-sm text-gray-600">
                            {new Date(date.date).toLocaleDateString()} at {date.time}
                          </p>
                          <p className="text-xs text-gray-500">{typeInfo.description}</p>
                        </div>
                      </div>
                      
                      {date.status === 'scheduled' && (
                        <button
                          onClick={() => markAsCompleted(date.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    {date.notes && (
                      <p className="text-sm text-gray-600 mt-2 pl-11">{date.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 