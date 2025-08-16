'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle, Plus, Edit2, Trash2, DollarSign, Home, Car, GraduationCap, Heart } from 'lucide-react';
import { createClientSupabaseClient } from '@/lib/supabase/browserClient';

interface FinancialGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: 'emergency' | 'house' | 'car' | 'vacation' | 'education' | 'retirement' | 'wedding' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

interface GoalTrackingDashboardProps {
  className?: string;
}

const goalCategories = {
  emergency: {
    label: 'Emergency Fund',
    icon: Target,
    color: 'bg-red-100 text-red-700',
    description: 'Rainy day savings'
  },
  house: {
    label: 'Home Purchase',
    icon: Home,
    color: 'bg-blue-100 text-blue-700',
    description: 'Down payment and home costs'
  },
  car: {
    label: 'Vehicle',
    icon: Car,
    color: 'bg-green-100 text-green-700',
    description: 'Car purchase or upgrade'
  },
  vacation: {
    label: 'Vacation',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    description: 'Travel and experiences'
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    color: 'bg-purple-100 text-purple-700',
    description: 'Learning and development'
  },
  retirement: {
    label: 'Retirement',
    icon: TrendingUp,
    color: 'bg-yellow-100 text-yellow-700',
    description: 'Long-term retirement savings'
  },
  wedding: {
    label: 'Wedding',
    icon: Heart,
    color: 'bg-rose-100 text-rose-700',
    description: 'Wedding expenses'
  },
  other: {
    label: 'Other',
    icon: Target,
    color: 'bg-gray-100 text-gray-700',
    description: 'Custom financial goal'
  }
};

export default function GoalTrackingDashboard({ className = '' }: GoalTrackingDashboardProps) {
  const supabase = createClientSupabaseClient();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target_amount: '',
    current_amount: '',
    target_date: '',
    category: 'emergency' as keyof typeof goalCategories,
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        return;
      }

      setGoals(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGoal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const goalData = {
        user_id: user.id,
        title: newGoal.title,
        description: newGoal.description,
        target_amount: parseFloat(newGoal.target_amount),
        current_amount: parseFloat(newGoal.current_amount) || 0,
        target_date: newGoal.target_date,
        category: newGoal.category,
        priority: newGoal.priority,
        status: 'active' as const
      };

      let error;
      if (editingGoal) {
        ({ error } = await supabase
          .from('financial_goals')
          .update(goalData)
          .eq('id', editingGoal.id));
      } else {
        ({ error } = await supabase
          .from('financial_goals')
          .insert(goalData));
      }

      if (error) {
        console.error('Error saving goal:', error);
        return;
      }

      // Reset form
      setNewGoal({
        title: '',
        description: '',
        target_amount: '',
        current_amount: '',
        target_date: '',
        category: 'emergency',
        priority: 'medium'
      });
      setShowAddGoal(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateGoalProgress = async (goalId: string, newAmount: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      const { error } = await supabase
        .from('financial_goals')
        .update({ 
          current_amount: newAmount,
          status: goal && newAmount >= goal.target_amount ? 'completed' : 'active'
        })
        .eq('id', goalId);

      if (error) {
        console.error('Error updating goal progress:', error);
        return;
      }

      fetchGoals();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('Error deleting goal:', error);
        return;
      }

      fetchGoals();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTotalProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + getProgressPercentage(goal.current_amount, goal.target_amount), 0);
    return Math.round(totalProgress / goals.length);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.status === 'completed').length;
  };

  const getTotalTargetAmount = () => {
    return goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  };

  const getTotalCurrentAmount = () => {
    return goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  };

  // Remove loading state to show content immediately

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Goal Tracking Dashboard</h3>
              <p className="text-sm text-gray-600">Track your financial milestones</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{getTotalProgress()}%</div>
            <div className="text-sm text-green-700">Average Progress</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{getCompletedGoals()}</div>
            <div className="text-sm text-blue-700">Goals Completed</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">${getTotalCurrentAmount().toLocaleString()}</div>
            <div className="text-sm text-purple-700">Total Saved</div>
          </div>
        </div>

        {/* Add/Edit Goal Form */}
        {(showAddGoal || editingGoal) && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-4">{editingGoal ? 'Edit Goal' : 'Add New Goal'}</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value as keyof typeof goalCategories})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(goalCategories).map(([key, category]) => (
                      <option key={key} value={key}>{category.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Amount
                  </label>
                  <input
                    type="number"
                    value={newGoal.current_amount}
                    onChange={(e) => setNewGoal({...newGoal, current_amount: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as 'high' | 'medium' | 'low'})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveGoal}
                  disabled={!newGoal.title || !newGoal.target_amount}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {editingGoal ? 'Update Goal' : 'Add Goal'}
                </button>
                <button
                  onClick={() => {
                    setShowAddGoal(false);
                    setEditingGoal(null);
                    setNewGoal({
                      title: '',
                      description: '',
                      target_amount: '',
                      current_amount: '',
                      target_date: '',
                      category: 'emergency',
                      priority: 'medium'
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div>
          <h4 className="font-semibold mb-4">Your Goals</h4>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No goals set yet.</p>
              <p className="text-sm">Add your first financial goal to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const categoryInfo = goalCategories[goal.category];
                const Icon = categoryInfo.icon;
                const progress = getProgressPercentage(goal.current_amount, goal.target_amount);
                const isCompleted = goal.status === 'completed';
                
                return (
                  <div key={goal.id} className={`border rounded-lg p-4 ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'} transition-colors`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 flex items-center gap-2">
                            {goal.title}
                            {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </h5>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingGoal(goal);
                            setNewGoal({
                              title: goal.title,
                              description: goal.description,
                              target_amount: goal.target_amount.toString(),
                              current_amount: goal.current_amount.toString(),
                              target_date: goal.target_date,
                              category: goal.category,
                              priority: goal.priority
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                        <span>${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}</span>
                        <span>{Math.round(progress)}% complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {goal.priority} priority
                      </span>
                    </div>
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