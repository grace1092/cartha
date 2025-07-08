'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  TrendingUp, 
  Calendar, 
  Target, 
  AlertTriangle, 
  Pill, 
  Users, 
  Phone,
  CheckCircle, 
  Clock, 
  BarChart3,
  Activity,
  Heart,
  Brain,
  Shield,
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  Edit,
  Eye,
  Download
} from 'lucide-react'

export default function ClientManagementDashboard() {
  const [selectedClient, setSelectedClient] = useState('Sarah Johnson')
  const [currentView, setCurrentView] = useState('overview')
  const [showDashboard, setShowDashboard] = useState(false)
  const [timeRange, setTimeRange] = useState('3months')

  const clients = [
    { 
      id: 'Sarah Johnson', 
      name: 'Sarah Johnson', 
      age: 34, 
      diagnosis: 'Generalized Anxiety Disorder',
      status: 'active',
      lastSession: '2 days ago',
      nextSession: 'Tomorrow',
      riskLevel: 'low',
      progress: 75
    },
    { 
      id: 'Mike Chen', 
      name: 'Mike Chen', 
      age: 28, 
      diagnosis: 'Major Depressive Disorder',
      status: 'active',
      lastSession: '1 week ago',
      nextSession: 'Next week',
      riskLevel: 'medium',
      progress: 60
    },
    { 
      id: 'Emma Davis', 
      name: 'Emma Davis', 
      age: 42, 
      diagnosis: 'PTSD',
      status: 'crisis-watch',
      lastSession: '3 days ago',
      nextSession: 'Today',
      riskLevel: 'high',
      progress: 45
    },
    { 
      id: 'Alex Rodriguez', 
      name: 'Alex Rodriguez', 
      age: 31, 
      diagnosis: 'Couples Therapy',
      status: 'active',
      lastSession: '5 days ago',
      nextSession: 'This week',
      riskLevel: 'low',
      progress: 80
    }
  ]

  const selectedClientData = clients.find(c => c.id === selectedClient)

  const moodData = [
    { date: '2024-01-01', mood: 3, anxiety: 7, depression: 5 },
    { date: '2024-01-08', mood: 4, anxiety: 6, depression: 4 },
    { date: '2024-01-15', mood: 5, anxiety: 5, depression: 3 },
    { date: '2024-01-22', mood: 6, anxiety: 4, depression: 3 },
    { date: '2024-01-29', mood: 7, anxiety: 3, depression: 2 },
    { date: '2024-02-05', mood: 6, anxiety: 4, depression: 2 },
    { date: '2024-02-12', mood: 7, anxiety: 3, depression: 2 },
    { date: '2024-02-19', mood: 8, anxiety: 2, depression: 1 }
  ]

  const treatmentGoals = [
    { id: 1, goal: 'Reduce anxiety symptoms by 50%', status: 'in-progress', progress: 75, targetDate: '2024-03-15' },
    { id: 2, goal: 'Improve sleep quality', status: 'completed', progress: 100, targetDate: '2024-02-01' },
    { id: 3, goal: 'Develop coping strategies', status: 'in-progress', progress: 60, targetDate: '2024-04-01' },
    { id: 4, goal: 'Reduce panic attacks', status: 'in-progress', progress: 80, targetDate: '2024-03-30' }
  ]

  const sessionHistory = [
    { date: '2024-02-19', type: 'Individual', duration: '50 min', notes: 'Discussed anxiety triggers, practiced breathing exercises' },
    { date: '2024-02-12', type: 'Individual', duration: '50 min', notes: 'Explored childhood patterns, identified coping mechanisms' },
    { date: '2024-02-05', type: 'Individual', duration: '50 min', notes: 'Work stress management, boundary setting' },
    { date: '2024-01-29', type: 'Individual', duration: '50 min', notes: 'Relationship issues, communication skills' },
    { date: '2024-01-22', type: 'Individual', duration: '50 min', notes: 'Sleep hygiene, relaxation techniques' }
  ]

  const medications = [
    { name: 'Sertraline', dosage: '50mg', frequency: 'Daily', startDate: '2024-01-01', status: 'active' },
    { name: 'Propranolol', dosage: '10mg', frequency: 'As needed', startDate: '2024-01-15', status: 'active' }
  ]

  const riskAssessments = [
    { date: '2024-02-19', riskLevel: 'low', factors: ['Stable mood', 'Good support system'], score: 2 },
    { date: '2024-02-12', riskLevel: 'low', factors: ['Engaged in treatment', 'No SI'], score: 3 },
    { date: '2024-02-05', riskLevel: 'medium', factors: ['Work stress', 'Sleep issues'], score: 5 },
    { date: '2024-01-29', riskLevel: 'medium', factors: ['Relationship conflict', 'Anxiety spikes'], score: 6 }
  ]

  const familyConnections = [
    { name: 'John Johnson', relationship: 'Spouse', phone: '(555) 123-4567', email: 'john.johnson@email.com', status: 'active' },
    { name: 'Lisa Johnson', relationship: 'Sister', phone: '(555) 234-5678', email: 'lisa.johnson@email.com', status: 'active' }
  ]

  const referrals = [
    { name: 'Dr. Maria Garcia', specialty: 'Psychiatrist', phone: '(555) 345-6789', email: 'dr.garcia@clinic.com', status: 'active' },
    { name: 'Dr. James Wilson', specialty: 'Sleep Specialist', phone: '(555) 456-7890', email: 'dr.wilson@sleep.com', status: 'pending' }
  ]

  const outcomeMeasures = {
    phq9: { current: 8, baseline: 15, improvement: 47 },
    gad7: { current: 6, baseline: 12, improvement: 50 },
    sleepQuality: { current: 7, baseline: 3, improvement: 133 },
    socialFunctioning: { current: 6, baseline: 4, improvement: 50 }
  }

  useEffect(() => {
    // Simulate dashboard loading
    setTimeout(() => {
      setShowDashboard(true)
    }, 1000)
  }, [])

  if (showDashboard) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Client Management System Active!</h3>
                  <p className="text-green-100">Comprehensive tracking and outcome monitoring</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDashboard(false)}
                className="text-white hover:text-green-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Impact Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-2">Intelligent Client Management = Better Outcomes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">35%</div>
                  <div className="text-sm text-blue-100">Improved treatment outcomes</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">50%</div>
                  <div className="text-sm text-blue-100">Reduced client dropout</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="p-6">
            {/* Client Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Client Management Dashboard</h3>
                <div className="flex items-center space-x-2">
                  <select 
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Client Overview Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedClientData?.name}</h4>
                    <p className="text-sm text-gray-600">{selectedClientData?.age} years old</p>
                    <p className="text-sm text-gray-600">{selectedClientData?.diagnosis}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedClientData?.riskLevel === 'low' ? 'bg-green-500' :
                        selectedClientData?.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium capitalize">{selectedClientData?.riskLevel} risk</span>
                    </div>
                    <p className="text-sm text-gray-600">Last: {selectedClientData?.lastSession}</p>
                    <p className="text-sm text-gray-600">Next: {selectedClientData?.nextSession}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">{selectedClientData?.progress}% progress</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                        style={{ width: `${selectedClientData?.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              {['overview', 'progress', 'sessions', 'medications', 'risk', 'connections'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentView(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === tab
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content Views */}
            {currentView === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Outcome Measures */}
                <div className="bg-white rounded-lg border p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Outcome Measures</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">PHQ-9 (Depression)</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{outcomeMeasures.phq9.current}</span>
                        <span className="text-xs text-green-600">↓{outcomeMeasures.phq9.improvement}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">GAD-7 (Anxiety)</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{outcomeMeasures.gad7.current}</span>
                        <span className="text-xs text-green-600">↓{outcomeMeasures.gad7.improvement}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sleep Quality</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{outcomeMeasures.sleepQuality.current}/10</span>
                        <span className="text-xs text-green-600">↑{outcomeMeasures.sleepQuality.improvement}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Social Functioning</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{outcomeMeasures.socialFunctioning.current}/10</span>
                        <span className="text-xs text-green-600">↑{outcomeMeasures.socialFunctioning.improvement}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treatment Goals */}
                <div className="bg-white rounded-lg border p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Treatment Goals</h4>
                  <div className="space-y-3">
                    {treatmentGoals.map((goal) => (
                      <div key={goal.id} className="border-l-4 border-blue-500 pl-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{goal.goal}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            goal.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {goal.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{goal.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'progress' && (
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Progress Tracking</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mood Chart */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Mood & Symptom Trends</h5>
                    <div className="space-y-2">
                      {moodData.slice(-6).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{new Date(entry.date).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-blue-600">Mood: {entry.mood}/10</span>
                            <span className="text-orange-600">Anxiety: {entry.anxiety}/10</span>
                            <span className="text-purple-600">Depression: {entry.depression}/10</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Summary */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Progress Summary</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Overall Improvement</span>
                        </div>
                        <span className="text-sm font-bold text-green-600">+47%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Session Attendance</span>
                        </div>
                        <span className="text-sm font-bold text-blue-600">95%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Goal Achievement</span>
                        </div>
                        <span className="text-sm font-bold text-purple-600">75%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'sessions' && (
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Session History</h4>
                <div className="space-y-3">
                  {sessionHistory.map((session, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{new Date(session.date).toLocaleDateString()}</span>
                          <span className="text-sm text-gray-600">{session.type}</span>
                          <span className="text-sm text-gray-600">{session.duration}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700">{session.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'medications' && (
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Medication Tracking</h4>
                <div className="space-y-4">
                  {medications.map((med, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Pill className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{med.name}</span>
                          <span className="text-sm text-gray-600">{med.dosage}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          med.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {med.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Frequency: {med.frequency}</p>
                        <p>Started: {new Date(med.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'risk' && (
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Risk Assessment</h4>
                <div className="space-y-4">
                  {riskAssessments.map((assessment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className={`w-4 h-4 ${
                            assessment.riskLevel === 'low' ? 'text-green-600' :
                            assessment.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                          <span className="font-medium text-gray-900">
                            {new Date(assessment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          assessment.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                          assessment.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {assessment.riskLevel} risk (Score: {assessment.score})
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-1">Risk Factors:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {assessment.factors.map((factor, factorIndex) => (
                            <li key={factorIndex}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'connections' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Family Connections */}
                <div className="bg-white rounded-lg border p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Family Connections</h4>
                  <div className="space-y-3">
                    {familyConnections.map((connection, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-gray-900">{connection.name}</span>
                            <span className="text-sm text-gray-600">({connection.relationship})</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            connection.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {connection.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center space-x-2">
                            <Phone className="w-3 h-3" />
                            <span>{connection.phone}</span>
                          </p>
                          <p>{connection.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referrals */}
                <div className="bg-white rounded-lg border p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Referrals</h4>
                  <div className="space-y-3">
                    {referrals.map((referral, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-gray-900">{referral.name}</span>
                            <span className="text-sm text-gray-600">({referral.specialty})</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            referral.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {referral.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center space-x-2">
                            <Phone className="w-3 h-3" />
                            <span>{referral.phone}</span>
                          </p>
                          <p>{referral.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-blue-500 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Loading Client Management System</h3>
        <p className="text-gray-600">Preparing comprehensive client overview...</p>
      </div>
    </div>
  )
} 