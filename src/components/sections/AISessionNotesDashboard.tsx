'use client'

import { useState, useEffect } from 'react'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Save, 
  Edit, 
  CheckCircle, 
  Clock, 
  User, 
  Target, 
  TrendingUp,
  FileText,
  Calendar,
  DollarSign,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

export default function AISessionNotesDashboard() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [transcription, setTranscription] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('CBT')
  const [showDashboard, setShowDashboard] = useState(false)

  const workflowSteps = [
    {
      title: 'Voice Recording',
      description: 'Start recording during your session',
      icon: Mic,
      status: 'active'
    },
    {
      title: 'Real-time Transcription',
      description: 'AI converts speech to text instantly',
      icon: FileText,
      status: 'pending'
    },
    {
      title: 'AI Analysis',
      description: 'Identify key themes and progress',
      icon: TrendingUp,
      status: 'pending'
    },
    {
      title: 'Template Selection',
      description: 'Choose therapy-specific templates',
      icon: Target,
      status: 'pending'
    },
    {
      title: 'Treatment Plan Integration',
      description: 'Auto-populate treatment plans',
      icon: Calendar,
      status: 'pending'
    }
  ]

  const templates = [
    { id: 'CBT', name: 'Cognitive Behavioral Therapy', color: 'blue' },
    { id: 'DBT', name: 'Dialectical Behavior Therapy', color: 'purple' },
    { id: 'EMDR', name: 'Eye Movement Desensitization', color: 'green' },
    { id: 'Psychodynamic', name: 'Psychodynamic Therapy', color: 'orange' }
  ]

  const mockTranscription = `Client reported feeling overwhelmed with work stress and relationship issues. 
  Discussed coping strategies including deep breathing exercises and setting boundaries. 
  Client expressed difficulty sleeping and increased anxiety symptoms. 
  Explored childhood patterns that may be contributing to current stress responses. 
  Agreed to practice mindfulness techniques daily and schedule follow-up in two weeks.`

  const mockAIAnalysis = {
    keyThemes: ['Work stress', 'Relationship issues', 'Sleep problems', 'Anxiety'],
    treatmentGoals: ['Improve coping skills', 'Reduce anxiety symptoms', 'Better sleep hygiene'],
    progressMarkers: ['Increased self-awareness', 'Willingness to try new techniques'],
    riskFactors: ['High stress levels', 'Sleep deprivation'],
    nextSteps: ['Daily mindfulness practice', 'Boundary setting exercises', 'Sleep hygiene routine']
  }

  useEffect(() => {
    if (isRecording) {
      // Simulate real-time transcription
      setTimeout(() => {
        setTranscription(mockTranscription)
        setCurrentStep(1)
      }, 2000)
    }
  }, [isRecording])

  useEffect(() => {
    if (currentStep >= 1) {
      // Simulate AI analysis
      setTimeout(() => {
        setAiAnalysis(mockAIAnalysis)
        setCurrentStep(2)
      }, 1500)
    }
  }, [currentStep])

  const startRecording = () => {
    setIsRecording(true)
    setCurrentStep(0)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
    setCurrentStep(3)
  }

  const completeWorkflow = () => {
    setCurrentStep(4)
    setTimeout(() => {
      setShowDashboard(true)
    }, 1000)
  }

  if (showDashboard) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Session Notes Complete!</h3>
                  <p className="text-green-100">AI-powered documentation saved you time</p>
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
              <h4 className="text-lg font-semibold mb-2">Time Saved = More Revenue</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">2.5 hrs</div>
                  <div className="text-sm text-blue-100">Saved per week</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">10</div>
                  <div className="text-sm text-blue-100">Extra client sessions per month</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">$2,000</div>
                  <div className="text-sm text-blue-100">Additional revenue potential</div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Notes Preview */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Generated Session Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Session Date: {new Date().toLocaleDateString()}</span>
                <span className="text-sm text-green-600 font-medium">✓ AI Generated</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{mockTranscription}</p>
            </div>

            {/* AI Analysis Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Key Themes Identified</h4>
                <div className="flex flex-wrap gap-2">
                  {mockAIAnalysis.keyThemes.map((theme, index) => (
                    <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Treatment Goals</h4>
                <ul className="space-y-1">
                  {mockAIAnalysis.treatmentGoals.map((goal, index) => (
                    <li key={index} className="text-sm text-purple-700 flex items-center">
                      <Target className="w-3 h-3 mr-2" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                Edit Notes
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save & Continue
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
              <h2 className="text-2xl font-bold text-gray-900">AI Session Notes Dashboard</h2>
              <p className="text-gray-600">Experience how AI transforms your documentation workflow</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Progress</h3>
              <div className="space-y-4">
                {workflowSteps.map((step, index) => {
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
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Record Session</h3>
                  <p className="text-gray-600 mb-6">Click the button below to start recording your therapy session</p>
                  <button
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Start Recording</span>
                  </button>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-blue-900">Recording in Progress</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-red-600 font-medium">LIVE</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={stopRecording}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Stop Recording
                      </button>
                      <span className="text-sm text-gray-600">00:15:32</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Real-time Transcription</h4>
                    <div className="bg-white rounded border p-4 min-h-[200px]">
                      <p className="text-gray-700 leading-relaxed">{transcription}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-4">AI Analysis Complete</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">Key Themes</h4>
                        <div className="flex flex-wrap gap-2">
                          {mockAIAnalysis.keyThemes.map((theme, index) => (
                            <span key={index} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">Progress Markers</h4>
                        <ul className="space-y-1">
                          {mockAIAnalysis.progressMarkers.map((marker, index) => (
                            <li key={index} className="text-sm text-green-700 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-2" />
                              {marker}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-3">Select Therapy Template</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template.id)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            selectedTemplate === template.id
                              ? 'border-purple-500 bg-purple-100'
                              : 'border-gray-200 bg-white hover:border-purple-300'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{template.name}</div>
                            <div className="text-sm text-gray-600">Specialized template</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-4">Template Applied: {selectedTemplate}</h3>
                    <div className="bg-white rounded border p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Generated Session Notes</h4>
                      <p className="text-gray-700 leading-relaxed mb-4">{mockTranscription}</p>
                      <div className="border-t pt-4">
                        <h5 className="font-medium text-gray-900 mb-2">Treatment Plan Integration</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="text-sm font-medium text-gray-600 mb-1">Updated Goals</h6>
                            <ul className="space-y-1">
                              {mockAIAnalysis.treatmentGoals.map((goal, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-center">
                                  <Target className="w-3 h-3 mr-2 text-blue-500" />
                                  {goal}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-600 mb-1">Next Steps</h6>
                            <ul className="space-y-1">
                              {mockAIAnalysis.nextSteps.map((step, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-center">
                                  <ChevronRight className="w-3 h-3 mr-2 text-green-500" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={completeWorkflow}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Complete Session Notes
                  </button>
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Processing Complete!</h3>
                  <p className="text-gray-600">Your AI-powered session notes are ready</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 