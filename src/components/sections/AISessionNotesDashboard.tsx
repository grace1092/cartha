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
  ChevronLeft,
  Eye,
  Settings,
  Zap,
  Brain,
  MessageSquare,
  AlertCircle
} from 'lucide-react'

export default function AISessionNotesDashboard() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [transcription, setTranscription] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('CBT')
  const [showDashboard, setShowDashboard] = useState(false)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const workflowSteps = [
    {
      id: 'voice-recording',
      title: 'Voice Recording',
      description: 'Start recording during your session',
      icon: Mic,
      status: 'active',
      demo: 'voice-recording-demo'
    },
    {
      id: 'real-time-transcription',
      title: 'Real-time Transcription',
      description: 'AI converts speech to text instantly',
      icon: FileText,
      status: 'pending',
      demo: 'transcription-demo'
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'Identify key themes and progress',
      icon: TrendingUp,
      status: 'pending',
      demo: 'analysis-demo'
    },
    {
      id: 'template-selection',
      title: 'Template Selection',
      description: 'Choose therapy-specific templates',
      icon: Target,
      status: 'pending',
      demo: 'template-demo'
    },
    {
      id: 'treatment-plan-integration',
      title: 'Treatment Plan Integration',
      description: 'Auto-populate treatment plans',
      icon: Calendar,
      status: 'pending',
      demo: 'integration-demo'
    }
  ]

  const templates = [
    { 
      id: 'CBT', 
      name: 'Cognitive Behavioral Therapy', 
      color: 'blue',
      description: 'Focus on thoughts, feelings, and behaviors',
      sections: ['Thoughts', 'Feelings', 'Behaviors', 'Coping Strategies', 'Homework']
    },
    { 
      id: 'DBT', 
      name: 'Dialectical Behavior Therapy', 
      color: 'purple',
      description: 'Emphasis on mindfulness and emotional regulation',
      sections: ['Mindfulness', 'Distress Tolerance', 'Emotion Regulation', 'Interpersonal Effectiveness']
    },
    { 
      id: 'EMDR', 
      name: 'Eye Movement Desensitization', 
      color: 'green',
      description: 'Trauma-focused therapy with bilateral stimulation',
      sections: ['Target Memory', 'Bilateral Stimulation', 'Processing', 'Installation', 'Body Scan']
    },
    { 
      id: 'Psychodynamic', 
      name: 'Psychodynamic Therapy', 
      color: 'orange',
      description: 'Explore unconscious patterns and early experiences',
      sections: ['Free Association', 'Dream Analysis', 'Transference', 'Insight Development']
    }
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
    nextSteps: ['Daily mindfulness practice', 'Boundary setting exercises', 'Sleep hygiene routine'],
    emotionalState: 'Anxious but hopeful',
    sessionFocus: 'Stress management and coping strategies',
    clientEngagement: 'High - actively participating and asking questions'
  }

  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleWorkflowStepClick = (stepId: string) => {
    setActiveWorkflowStep(activeWorkflowStep === stepId ? null : stepId)
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    setCurrentStep(0)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsTranscribing(true)
    // Simulate transcription process
    setTimeout(() => {
      setTranscription(mockTranscription)
      setIsTranscribing(false)
      setCurrentStep(1)
    }, 2000)
  }

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setAiAnalysis(mockAIAnalysis)
      setIsAnalyzing(false)
      setCurrentStep(2)
    }, 1500)
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

  const renderWorkflowStepDemo = (stepId: string) => {
    switch (stepId) {
      case 'voice-recording':
        return (
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-4">Voice Recording Demo</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
                }`}>
                  <Mic className={`w-8 h-8 ${isRecording ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {isRecording ? 'Recording in Progress' : 'Ready to Record'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isRecording ? `Duration: ${formatTime(recordingTime)}` : 'Click to start recording'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>Stop Recording</span>
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Recording Features:</h5>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>High-quality audio capture</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Background noise reduction</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Automatic session detection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>HIPAA-compliant storage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 'real-time-transcription':
        return (
          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-4">Real-time Transcription Demo</h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Live Transcription</h5>
                  <div className="flex items-center space-x-2">
                    {isTranscribing ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-600">Processing...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Live</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-3 min-h-[120px]">
                  {isTranscribing ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {transcription || "Transcription will appear here as you speak..."}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h5 className="font-medium text-gray-900 mb-2">Accuracy Features:</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>99.5% accuracy rate</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span>Medical terminology recognition</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <span>Speaker identification</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-orange-500" />
                      <span>Custom vocabulary training</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border">
                  <h5 className="font-medium text-gray-900 mb-2">Processing Stats:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Words per minute:</span>
                      <span className="font-medium">150</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing delay:</span>
                      <span className="font-medium">&lt; 500ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Language support:</span>
                      <span className="font-medium">English, Spanish</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence score:</span>
                      <span className="font-medium">98.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'ai-analysis':
        return (
          <div className="bg-purple-50 rounded-lg p-6">
            <h4 className="font-semibold text-purple-900 mb-4">AI Analysis Demo</h4>
            <div className="space-y-4">
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-purple-700 font-medium">AI is analyzing your session...</p>
                  <p className="text-sm text-purple-600">Identifying themes, progress markers, and insights</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                        Key Themes Identified
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {mockAIAnalysis.keyThemes.map((theme, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                      <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-blue-500" />
                        Treatment Goals
                      </h5>
                      <ul className="space-y-2">
                        {mockAIAnalysis.treatmentGoals.map((goal, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-2 text-blue-500" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2 text-purple-500" />
                        Client Assessment
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emotional State:</span>
                          <span className="font-medium text-purple-700">{mockAIAnalysis.emotionalState}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Session Focus:</span>
                          <span className="font-medium text-purple-700">{mockAIAnalysis.sessionFocus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Engagement Level:</span>
                          <span className="font-medium text-purple-700">{mockAIAnalysis.clientEngagement}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                      <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                        Risk Assessment
                      </h5>
                      <ul className="space-y-2">
                        {mockAIAnalysis.riskFactors.map((risk, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-2 text-orange-500" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={startAnalysis}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Run AI Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      case 'template-selection':
        return (
          <div className="bg-orange-50 rounded-lg p-6">
            <h4 className="font-semibold text-orange-900 mb-4">Template Selection Demo</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedTemplate === template.id
                        ? 'border-orange-500 bg-orange-100'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedTemplate === template.id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <Target className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 mb-1">{template.name}</h5>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.sections.slice(0, 3).map((section, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {section}
                            </span>
                          ))}
                          {template.sections.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              +{template.sections.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <div className="bg-white rounded-lg p-4 border">
                  <h5 className="font-medium text-gray-900 mb-3">Selected Template: {templates.find(t => t.id === selectedTemplate)?.name}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {templates.find(t => t.id === selectedTemplate)?.sections.map((section, index) => (
                      <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded text-sm font-medium">
                        {section}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'treatment-plan-integration':
        return (
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-4">Treatment Plan Integration Demo</h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <h5 className="font-medium text-gray-900 mb-3">Auto-Generated Session Notes</h5>
                <div className="bg-gray-50 rounded p-3 mb-4">
                  <p className="text-gray-700 leading-relaxed text-sm">{mockTranscription}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-gray-900 mb-2">Updated Treatment Goals</h6>
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
                    <h6 className="font-medium text-gray-900 mb-2">Next Session Plan</h6>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h6 className="font-medium text-green-900 mb-2">Progress Tracking</h6>
                  <ul className="space-y-1 text-sm text-green-700">
                    {mockAIAnalysis.progressMarkers.map((marker, index) => (
                      <li key={index} className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-2" />
                        {marker}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h6 className="font-medium text-purple-900 mb-2">Client Homework</h6>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      Daily mindfulness practice
                    </li>
                    <li className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      Sleep hygiene routine
                    </li>
                    <li className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      Boundary setting exercises
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h6 className="font-medium text-orange-900 mb-2">Follow-up Schedule</h6>
                  <div className="text-sm text-orange-700">
                    <p className="font-medium">Next Session: 2 weeks</p>
                    <p className="text-xs mt-1">Automatically scheduled based on treatment plan</p>
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
          </div>
        )

      default:
        return null
    }
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Workflow Steps</h3>
              <p className="text-sm text-gray-600 mb-4">Click any step to explore its functionality</p>
              <div className="space-y-3">
                {workflowSteps.map((step, index) => {
                  const IconComponent = step.icon
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep
                  const isExpanded = activeWorkflowStep === step.id
                  
                  return (
                    <div key={step.title}>
                      <button
                        onClick={() => handleWorkflowStepClick(step.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:shadow-md ${
                          isActive ? 'bg-blue-50 border border-blue-200' : 
                          isCompleted ? 'bg-green-50 border border-green-200' : 
                          'bg-gray-50 border border-gray-200 hover:bg-gray-100'
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
                        <div className="flex-1 text-left">
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
                        <div className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </button>
                      
                      {/* Expanded Demo Section */}
                      {isExpanded && (
                        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                          {renderWorkflowStepDemo(step.id)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Main Interface */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Session Notes Workflow</h3>
                  <p className="text-gray-600">Click on any workflow step to explore its interactive demo</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {workflowSteps.map((step, index) => {
                    const IconComponent = step.icon
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep
                    
                    return (
                      <div
                        key={step.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
                          isActive ? 'border-blue-500 bg-blue-100' : 
                          isCompleted ? 'border-green-500 bg-green-100' : 
                          'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                        onClick={() => handleWorkflowStepClick(step.id)}
                      >
                        <div className="flex items-center space-x-3">
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
                          <div>
                            <h4 className={`font-medium text-sm ${
                              isActive ? 'text-blue-900' :
                              isCompleted ? 'text-green-900' :
                              'text-gray-600'
                            }`}>
                              {step.title}
                            </h4>
                            <p className={`text-xs ${
                              isActive ? 'text-blue-700' :
                              isCompleted ? 'text-green-700' :
                              'text-gray-500'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Experience the complete AI-powered workflow that saves therapists 2.5 hours per week
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">99.5%</div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">&lt;500ms</div>
                      <div className="text-xs text-gray-600">Processing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">2.5hrs</div>
                      <div className="text-xs text-gray-600">Time Saved</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Step Demo */}
              {activeWorkflowStep && (
                <div className="mt-6">
                  {renderWorkflowStepDemo(activeWorkflowStep)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 