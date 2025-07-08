'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabaseClient } from '@/lib/supabase/browserClient'
import { DashboardStats, Profile, Client, TherapySession } from '@/lib/types/database'

export default function Dashboard() {
  const searchParams = useSearchParams()
  const isWelcome = searchParams?.get('welcome') === 'true'
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentClients, setRecentClients] = useState<Client[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<TherapySession[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClientSupabaseClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }

        // Fetch stats
        const [clientsData, sessionsThisWeek, sessionsThisMonth] = await Promise.all([
          supabase
            .from('clients')
            .select('id, is_active')
            .eq('therapist_id', session.user.id),
          supabase
            .from('therapy_sessions')
            .select('id')
            .eq('therapist_id', session.user.id)
            .gte('session_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          supabase
            .from('therapy_sessions')
            .select('id')
            .eq('therapist_id', session.user.id)
            .gte('session_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        ])

        const statsData: DashboardStats = {
          total_clients: clientsData.data?.length || 0,
          active_clients: clientsData.data?.filter(c => c.is_active).length || 0,
          sessions_this_week: sessionsThisWeek.data?.length || 0,
          sessions_this_month: sessionsThisMonth.data?.length || 0,
          upcoming_sessions: 0, // Would calculate from scheduled sessions
        }

        setStats(statsData)

        // Fetch recent clients
        const { data: clientsRecent } = await supabase
          .from('clients')
          .select('*')
          .eq('therapist_id', session.user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5)

        if (clientsRecent) {
          setRecentClients(clientsRecent)
        }

        // Fetch upcoming sessions (mock data for now)
        const { data: sessionsData } = await supabase
          .from('therapy_sessions')
          .select('*, clients(*)')
          .eq('therapist_id', session.user.id)
          .gte('session_date', new Date().toISOString())
          .order('session_date', { ascending: true })
          .limit(5)

        if (sessionsData) {
          setUpcomingSessions(sessionsData)
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-8">
      {/* Welcome Message */}
      {isWelcome && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 0v1m-2-1a2 2 0 00-2 2v1m2-2H9m3 0h3m-3 18.5l4-4L12 21l-4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome to Cartha, {profile?.full_name}! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                Your therapy practice management account is ready. You're on a 7-day free trial with full access to all features.
              </p>
              <div className="flex space-x-4">
                <Link href="/dashboard/clients" className="btn-primary text-sm">
                  Add Your First Client
                </Link>
                <Link href="/dashboard/settings" className="btn-secondary text-sm">
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-xl text-gray-900 mb-2">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {profile?.full_name}
        </h1>
        <p className="body-lg text-gray-600">
          Here's what's happening with your practice today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_clients || 0}</p>
              <p className="text-sm text-gray-600">Total Clients</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.active_clients || 0}</p>
              <p className="text-sm text-gray-600">Active Clients</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.sessions_this_week || 0}</p>
              <p className="text-sm text-gray-600">Sessions This Week</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.sessions_this_month || 0}</p>
              <p className="text-sm text-gray-600">Sessions This Month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Clients */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading-md text-gray-900">Recent Clients</h3>
            <Link href="/dashboard/clients" className="btn-ghost text-sm">
              View All
            </Link>
          </div>
          
          {recentClients.length > 0 ? (
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-medium">
                        {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.first_name} {client.last_name}</p>
                      <p className="text-sm text-gray-600">Added {new Date(client.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/clients/${client.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="text-gray-600 mb-4">No clients yet</p>
              <Link href="/dashboard/clients" className="btn-primary">
                Add Your First Client
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="heading-md text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="space-y-4">
            <Link 
              href="/dashboard/clients/new"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Client</p>
                <p className="text-sm text-gray-600">Create a new client profile</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/sessions/new"
              className="flex items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200 hover:from-green-100 hover:to-teal-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">New Session</p>
                <p className="text-sm text-gray-600">Start a therapy session</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/billing"
              className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Billing</p>
                <p className="text-sm text-gray-600">View plans and usage</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 