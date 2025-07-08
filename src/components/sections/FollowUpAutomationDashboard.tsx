'use client'

import { useState, useEffect } from 'react'
import { 
  Mail, 
  Calendar, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Target, 
  TrendingUp,
  BarChart3,
  Send,
  Edit,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
  Bell,
  MessageSquare,
  FileText,
  Shield
} from 'lucide-react'

export default function FollowUpAutomationDashboard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedClient, setSelectedClient] = useState('Sarah Johnson')
  const [selectedTemplate, setSelectedTemplate] = useState('check-in')
  const [showDashboard, setShowDashboard] = useState(false)
  const [automationStats, setAutomationStats] = useState({
    emailsSent: 0,
    responses: 0,
    appointmentsConfirmed: 0,
    noShowsReduced: 0
  })

  const automationSteps = [
    {
      title: 'Client Selection',
      description: 'Choose client and automation type',
      icon: User,
      status: 'active'
    },
    {
      title: 'Template Selection',
      description: 'Personalized message templates',
      icon: FileText,
      status: 'pending'
    },
    {
      title: 'Automation Rules',
      description: 'Set triggers and conditions',
      icon: Bell,
      status: 'pending'
    },
    {
      title: 'Engagement Tracking',
      description: 'Monitor client responses',
      icon: BarChart3,
      status: 'pending'
    },
    {
      title: 'Results & Analytics',
      description: 'View automation impact',
      icon: TrendingUp,
      status: 'pending'
    }
  ]

  const clientTypes = [
    { id: 'Sarah Johnson', name: 'Sarah Johnson', type: 'Anxiety', lastSession: '2 days ago', status: 'active' },
    { id: 'Mike Chen', name: 'Mike Chen', type: 'Depression', lastSession: '1 week ago', status: 'needs-followup' },
    { id: 'Emma Davis', name: 'Emma Davis', type: 'PTSD', lastSession: '3 days ago', status: 'crisis-watch' },
    { id: 'Alex Rodriguez', name: 'Alex Rodriguez', type: 'Couples Therapy', lastSession: '5 days ago', status: 'active' }
  ]

  const automationTemplates = [
    {
      id: 'check-in',
      name: 'Wellness Check-in',
      description: 'Gentle follow-up after session',
      icon: MessageSquare,
      color: 'blue',
      content: `Hi {{client_name}},

I hope you're doing well since our last session. I wanted to check in and see how you're feeling with the coping strategies we discussed.

How are the breathing exercises working for you? Have you had a chance to practice the mindfulness techniques we talked about?

Remember, I'm here if you need anything before our next session.

Take care,
Dr. Smith`
    },
    {
      id: 'appointment-reminder',
      name: 'Appointment Reminder',
      description: 'Confirm upcoming sessions',
      icon: Calendar,
      color: 'green',
      content: `Hi {{client_name}},

This is a friendly reminder that you have an appointment scheduled for {{appointment_date}} at {{appointment_time}}.

Please let me know if you need to reschedule or if you have any questions before our session.

Looking forward to seeing you!

Best regards,
Dr. Smith`
    },
    {
      id: 'homework-assignment',
      name: 'Homework Assignment',
      description: 'Send practice exercises',
      icon: BookOpen,
      color: 'purple',
      content: `Hi {{client_name}},

I hope you're having a good week! Here's your homework assignment for this week:

**Mindfulness Practice:**
- Practice the 5-4-3-2-1 grounding technique daily
- Spend 10 minutes each morning doing the breathing exercise we learned
- Journal about your thoughts and feelings

**Progress Tracking:**
- Rate your anxiety level (1-10) each day
- Note any triggers and how you responded to them

Please bring your journal to our next session so we can review your progress together.

You're doing great work!
Dr. Smith`
    },
    {
      id: 'crisis-intervention',
      name: 'Crisis Intervention',
      description: 'Immediate support protocol',
      icon: AlertTriangle,
      color: 'red',
      content: `Hi {{client_name}},

I received your message and I'm concerned about how you're feeling right now. Your safety is my top priority.

**Immediate Steps:**
1. If you're having thoughts of self-harm, please call 988 (Suicide & Crisis Lifeline) immediately
2. Go to your nearest emergency room if you're in immediate danger
3. Call me at {{emergency_phone}} if you need to talk

**Remember:**
- You're not alone
- This feeling will pass
- Help is available 24/7

I'm here for you,
Dr. Smith

**Emergency Resources:**
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency: 911`
    }
  ]

  const engagementMetrics = {
    emailOpenRate: 87,
    responseRate: 64,
    appointmentConfirmation: 92,
    noShowReduction: 40,
    clientSatisfaction: 94
  }

  useEffect(() => {
    if (currentStep >= 1) {
      // Simulate template selection
      setTimeout(() => {
        setCurrentStep(2)
      }, 1000)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep >= 2) {
      // Simulate automation rules
      setTimeout(() => {
        setCurrentStep(3)
      }, 1500)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep >= 3) {
      // Simulate engagement tracking
      setTimeout(() => {
        setCurrentStep(4)
      }, 2000)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep >= 4) {
      // Simulate results
      setTimeout(() => {
        setShowDashboard(true)
      }, 1000)
    }
  }, [currentStep])

  const startAutomation = () => {
    setCurrentStep(1)
  }

  const selectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    setCurrentStep(2)
  }

  if (showDashboard) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Follow-up Automation Active!</h3>
                  <p className="text-green-100">Personalized client engagement system running</p>
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

          {/* Revenue Impact Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-2">Automation Impact = Increased Revenue</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">5 hrs</div>
                  <div className="text-sm text-blue-100">Admin work eliminated per week</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">40%</div>
                  <div className="text-sm text-blue-100">Reduction in no-shows</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">$1,500</div>
                  <div className="text-sm text-blue-100">Monthly revenue saved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Dashboard */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Automation Performance Dashboard</h3>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{engagementMetrics.emailOpenRate}%</div>
                <div className="text-sm text-blue-700">Email Open Rate</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{engagementMetrics.responseRate}%</div>
                <div className="text-sm text-green-700">Response Rate</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{engagementMetrics.appointmentConfirmation}%</div>
                <div className="text-sm text-purple-700">Appointments Confirmed</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{engagementMetrics.noShowReduction}%</div>
                <div className="text-sm text-orange-700">No-Show Reduction</div>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-teal-600">{engagementMetrics.clientSatisfaction}%</div>
                <div className="text-sm text-teal-700">Client Satisfaction</div>
              </div>
            </div>

            {/* Recent Automations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Recent Automations</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded border">
                    <div>
                      <div className="font-medium text-gray-900">Sarah Johnson</div>
                      <div className="text-sm text-gray-600">Wellness Check-in • 2 hours ago</div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">✓ Sent</div>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded border">
                    <div>
                      <div className="font-medium text-gray-900">Mike Chen</div>
                      <div className="text-sm text-gray-600">Appointment Reminder • 1 day ago</div>
                    </div>
                    <div className="text-blue-600 text-sm font-medium">✓ Confirmed</div>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded border">
                    <div>
                      <div className="font-medium text-gray-900">Emma Davis</div>
                      <div className="text-sm text-gray-600">Homework Assignment • 3 days ago</div>
                    </div>
                    <div className="text-purple-600 text-sm font-medium">✓ Completed</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Crisis Interventions</h4>
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-red-900">Emma Davis</div>
                        <div className="text-sm text-red-700">Crisis alert triggered • 1 hour ago</div>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="mt-2 text-sm text-red-700">
                      Immediate support protocol activated. Client contacted and safe.
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-yellow-900">Mike Chen</div>
                        <div className="text-sm text-yellow-700">Missed appointment • 2 days ago</div>
                      </div>
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="mt-2 text-sm text-yellow-700">
                      Follow-up scheduled. Client responded positively.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                View All Automations
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Settings
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
              <h2 className="text-2xl font-bold text-gray-900">Follow-up Automation System</h2>
              <p className="text-gray-600">Personalized client engagement that saves time and improves outcomes</p>
            </div>
            <button 
              onClick={() => setShowDashboard(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workflow Steps */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Workflow</h3>
              <div className="space-y-4">
                {automationSteps.map((step, index) => {
                  const IconComponent = step.icon
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep
                  
                  return (
                    <div 
                      key={step.title}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        isActive ? 'bg-blue-50 border border-blue-200' : 
                        isCompleted ? 'bg-green-50 border border-green-200' : 
                        'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-blue-500 text-white' :
                        isCompleted ? 'bg-green-500 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <IconComponent className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          isActive ? 'text-blue-900' :
                          isCompleted ? 'text-green-900' :
                          'text-gray-600'
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-sm ${
                          isActive ? 'text-blue-700' :
                          isCompleted ? 'text-green-700' :
                          'text-gray-500'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Main Interface */}
            <div className="lg:col-span-2">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-4">Select Client for Automation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {clientTypes.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => setSelectedClient(client.id)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                            selectedClient === client.id
                              ? 'border-blue-500 bg-blue-100'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{client.name}</div>
                              <div className="text-sm text-gray-600">{client.type}</div>
                              <div className="text-xs text-gray-500">Last session: {client.lastSession}</div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              client.status === 'active' ? 'bg-green-100 text-green-800' :
                              client.status === 'needs-followup' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {client.status}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={startAutomation}
                      className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Continue with {selectedClient}
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-4">Choose Automation Template</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {automationTemplates.map((template) => {
                        const IconComponent = template.icon
                        return (
                          <button
                            key={template.id}
                            onClick={() => selectTemplate(template.id)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                              selectedTemplate === template.id
                                ? 'border-green-500 bg-green-100'
                                : 'border-gray-200 bg-white hover:border-green-300'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-10 h-10 rounded-lg bg-${template.color}-500 flex items-center justify-center flex-shrink-0`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{template.name}</div>
                                <div className="text-sm text-gray-600">{template.description}</div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-4">Automation Rules & Triggers</h3>
                    <div className="bg-white rounded border p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">Selected Template Preview</h4>
                      <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 whitespace-pre-line">
                        {automationTemplates.find(t => t.id === selectedTemplate)?.content}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded border p-3">
                        <h5 className="font-medium text-gray-900 mb-2">Trigger Conditions</h5>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• 2 days after session</li>
                          <li>• No response within 24 hours</li>
                          <li>• Missed appointment</li>
                          <li>• Crisis keywords detected</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded border p-3">
                        <h5 className="font-medium text-gray-900 mb-2">Personalization</h5>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Client name auto-inserted</li>
                          <li>• Session-specific content</li>
                          <li>• Preferred contact method</li>
                          <li>• Cultural considerations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-4">Real-time Engagement Tracking</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded border p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Email Analytics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Open Rate:</span>
                            <span className="text-sm font-medium text-green-600">87%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Response Rate:</span>
                            <span className="text-sm font-medium text-blue-600">64%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Click Rate:</span>
                            <span className="text-sm font-medium text-purple-600">23%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded border p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Appointment Impact</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Confirmations:</span>
                            <span className="text-sm font-medium text-green-600">92%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">No-Show Reduction:</span>
                            <span className="text-sm font-medium text-orange-600">40%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Reschedules:</span>
                            <span className="text-sm font-medium text-blue-600">15%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded border p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Sarah Johnson opened check-in email</span>
                          <span className="text-green-600">2 min ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Mike Chen confirmed appointment</span>
                          <span className="text-green-600">15 min ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Emma Davis completed homework</span>
                          <span className="text-green-600">1 hour ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Automation System Active!</h3>
                  <p className="text-gray-600">Your personalized follow-up system is now running</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 