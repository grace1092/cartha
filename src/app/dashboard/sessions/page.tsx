'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientSupabaseClient } from '@/lib/supabase/browserClient'
import { TherapySession, Client } from '@/lib/types/database'
import { formatDate, formatTime } from '@/lib/utils'

interface SessionWithClient extends TherapySession {
  clients: Client
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionWithClient[]>([])
  const [filteredSessions, setFilteredSessions] = useState<SessionWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'completed'>('all')

  const supabase = createClientSupabaseClient()

  useEffect(() => {
    fetchSessions()
  }, [])

  useEffect(() => {
    filterSessions()
  }, [sessions, filter])

  const fetchSessions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('therapist_id', session.user.id)
        .order('session_date', { ascending: false })

      if (error) {
        console.error('Error fetching sessions:', error)
        return
      }

      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSessions = () => {
    let filtered = sessions

    if (filter !== 'all') {
      filtered = filtered.filter(session => session.status === filter)
    }

    setFilteredSessions(filtered)
  }

  // Remove loading state to show content immediately

  return (
    <div className="px-4 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="heading-xl text-gray-900 mb-2">Sessions</h1>
          <p className="body-lg text-gray-600">
            View and manage your therapy sessions
          </p>
        </div>
        <Link
          href="/dashboard/sessions/new"
          className="btn-primary mt-4 sm:mt-0"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Session
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-8">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            All Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'draft'
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Drafts ({sessions.filter(s => s.status === 'draft').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Completed ({sessions.filter(s => s.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="glass-card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {session.clients.first_name.charAt(0)}{session.clients.last_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {session.clients.first_name} {session.clients.last_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{formatDate(session.session_date)}</span>
                        <span>{formatTime(session.session_date)}</span>
                        <span>{session.duration_minutes} minutes</span>
                        <span className="capitalize">{session.session_type}</span>
                      </div>
                    </div>
                  </div>

                  {session.bullet_notes && (
                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {session.bullet_notes}
                    </p>
                  )}

                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      session.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : session.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status === 'draft' ? 'Draft' : session.status === 'completed' ? 'Completed' : session.status}
                    </span>

                    {session.soap_summary && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        SOAP Note
                      </span>
                    )}

                    {session.follow_up_email && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Follow-up Email
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  <Link
                    href={`/dashboard/sessions/${session.id}`}
                    className="btn-ghost"
                  >
                    View Details
                  </Link>
                  {session.status === 'draft' && (
                    <Link
                      href={`/dashboard/sessions/${session.id}/edit`}
                      className="btn-secondary"
                    >
                      Continue Editing
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter !== 'all' ? `No ${filter} sessions` : 'No sessions yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter !== 'all' 
              ? `Try adjusting your filter to see other sessions.`
              : 'Start by creating your first therapy session.'
            }
          </p>
          {filter === 'all' && (
            <Link href="/dashboard/sessions/new" className="btn-primary">
              Create Your First Session
            </Link>
          )}
        </div>
      )}
    </div>
  )
} 