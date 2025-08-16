'use client'

import { useState } from 'react'
import { 
  FileText, 
  User, 
  Clock, 
  Calendar, 
  Target, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  ChevronRight,
  X,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { useSessionNotes, SessionNote } from '@/lib/context/SessionNotesContext'

interface MySessionsProps {
  onClose?: () => void;
}

export default function MySessions({ onClose }: MySessionsProps) {
  const { state, deleteSession, setCurrentSession } = useSessionNotes()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'draft'>('all')
  const [selectedSession, setSelectedSession] = useState<SessionNote | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')

  const filteredSessions = state.sessions.filter(session => {
    const matchesSearch = 
      session.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.transcription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.aiAnalysis.keyThemes.some(theme => 
        theme.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const handleViewSession = (session: SessionNote) => {
    setSelectedSession(session)
    setViewMode('detail')
    setCurrentSession(session)
  }

  const handleDeleteSession = (id: string) => {
    if (confirm('Are you sure you want to delete this session note? This action cannot be undone.')) {
      deleteSession(id)
      if (selectedSession?.id === id) {
        setSelectedSession(null)
        setViewMode('list')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (viewMode === 'detail' && selectedSession) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Session Details</h2>
                <p className="text-gray-600">Client: {selectedSession.clientName}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Session Content */}
          <div className="p-6 space-y-6">
            {/* Session Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Session Date</span>
                </div>
                <p className="text-blue-700">{formatDate(selectedSession.date)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">Duration</span>
                </div>
                <p className="text-green-700">{selectedSession.sessionDuration}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-900">Template</span>
                </div>
                <p className="text-purple-700">{selectedSession.templateName}</p>
              </div>
            </div>

            {/* Transcription */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Session Transcription
              </h3>
              <div className="bg-white rounded border p-4">
                <p className="text-gray-700 leading-relaxed">{selectedSession.transcription}</p>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Key Themes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.aiAnalysis.keyThemes.map((theme, index) => (
                    <span key={index} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Treatment Goals
                </h3>
                <ul className="space-y-2">
                  {selectedSession.aiAnalysis.treatmentGoals.map((goal, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-2" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Client Assessment
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emotional State:</span>
                    <span className="font-medium text-purple-700">{selectedSession.aiAnalysis.emotionalState}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Focus:</span>
                    <span className="font-medium text-purple-700">{selectedSession.aiAnalysis.sessionFocus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engagement:</span>
                    <span className="font-medium text-purple-700">{selectedSession.aiAnalysis.clientEngagement}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Risk Assessment
                </h3>
                <ul className="space-y-2">
                  {selectedSession.aiAnalysis.riskFactors.map((risk, index) => (
                    <li key={index} className="text-sm text-orange-700 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-2" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-900 mb-3 flex items-center">
                <ChevronRight className="w-4 h-4 mr-2" />
                Next Steps
              </h3>
              <ul className="space-y-2">
                {selectedSession.aiAnalysis.nextSteps.map((step, index) => (
                  <li key={index} className="text-sm text-indigo-700 flex items-center">
                    <ChevronRight className="w-3 h-3 mr-2" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => handleDeleteSession(selectedSession.id)}
                className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Sessions</h2>
              <p className="text-gray-600">Access and manage your saved session notes</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by client name, themes, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'draft')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sessions</option>
                <option value="completed">Completed</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="p-6">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-600">
                {state.sessions.length === 0 
                  ? "You haven't created any session notes yet. Complete a session workflow to see them here."
                  : "No sessions match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleViewSession(session)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{session.clientName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{session.sessionDuration}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target className="w-4 h-4" />
                          <span>{session.templateName}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {session.aiAnalysis.keyThemes.slice(0, 3).map((theme, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {theme}
                          </span>
                        ))}
                        {session.aiAnalysis.keyThemes.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            +{session.aiAnalysis.keyThemes.length - 3} more
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {session.transcription.substring(0, 150)}...
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewSession(session)
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSession(session.id)
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 