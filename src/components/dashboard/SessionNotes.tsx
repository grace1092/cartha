'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Save, 
  FileText, 
  Clock, 
  User, 
  Calendar,
  Sparkles,
  Download,
  Edit3,
  Check,
  X,
  RefreshCw,
  Volume2,
  VolumeX
} from 'lucide-react';

interface SessionNote {
  id: string;
  clientId: string;
  clientName: string;
  sessionDate: string;
  duration: number;
  sessionType: 'individual' | 'couple' | 'family' | 'group';
  status: 'draft' | 'completed' | 'reviewed';
  transcript?: string;
  notes: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  goals: string[];
  interventions: string[];
  homework: string[];
  nextSession: string;
  createdAt: string;
  updatedAt: string;
}

interface SessionNotesProps {
  clientId?: string;
  onBack?: () => void;
}

const SessionNotes: React.FC<SessionNotesProps> = ({ clientId, onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<SessionNote>>({
    sessionType: 'individual',
    status: 'draft',
    notes: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: ''
    },
    goals: [],
    interventions: [],
    homework: [],
    nextSession: ''
  });
  const [recentNotes, setRecentNotes] = useState<SessionNote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [view, setView] = useState<'create' | 'list' | 'edit'>('create');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockNotes: SessionNote[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Sarah Johnson',
        sessionDate: '2024-01-15',
        duration: 50,
        sessionType: 'individual',
        status: 'completed',
        transcript: 'Client discussed recent anxiety about work deadlines...',
        notes: {
          subjective: 'Client reports increased anxiety levels over the past week, particularly related to work deadlines and family responsibilities.',
          objective: 'Client appeared tense, spoke rapidly, fidgeted with hands. Maintained good eye contact throughout session.',
          assessment: 'Client showing signs of moderate anxiety disorder. Cognitive distortions noted around catastrophic thinking patterns.',
          plan: 'Continue CBT techniques, introduce mindfulness practices, schedule follow-up in one week.'
        },
        goals: ['Reduce anxiety symptoms', 'Improve work-life balance', 'Develop coping strategies'],
        interventions: ['Cognitive restructuring', 'Deep breathing exercises', 'Progressive muscle relaxation'],
        homework: ['Practice daily mindfulness for 10 minutes', 'Complete thought record worksheet', 'Exercise 3x this week'],
        nextSession: '2024-01-22',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'Michael Chen',
        sessionDate: '2024-01-12',
        duration: 45,
        sessionType: 'individual',
        status: 'reviewed',
        notes: {
          subjective: 'Client reports feeling more confident after last session. Still experiencing some social anxiety in group settings.',
          objective: 'Client smiled more frequently, posture more relaxed. Initiated conversation about weekend plans.',
          assessment: 'Positive progress noted in self-confidence. Social anxiety remains moderate but improving.',
          plan: 'Continue exposure therapy gradually. Introduce social skills practice.'
        },
        goals: ['Increase social confidence', 'Reduce avoidance behaviors', 'Build support network'],
        interventions: ['Exposure therapy', 'Social skills training', 'Behavioral activation'],
        homework: ['Attend one social event this week', 'Practice conversation starters', 'Complete mood tracking'],
        nextSession: '2024-01-19',
        createdAt: '2024-01-12T14:00:00Z',
        updatedAt: '2024-01-12T15:00:00Z'
      }
    ];
    setRecentNotes(mockNotes);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Handle data available (in a real app, you'd send this to your AI service)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Here you would send the audio blob to your AI transcription service
          console.log('Audio data available:', event.data);
        }
      };
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const generateAINotes = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI-generated notes
    setCurrentNote(prev => ({
      ...prev,
      notes: {
        subjective: 'Client reports feeling overwhelmed with recent life changes. Expressed concerns about work performance and relationship stress. Sleep patterns have been irregular.',
        objective: 'Client appeared anxious, spoke at a rapid pace. Maintained appropriate eye contact. Some fidgeting noted. Mood appeared depressed but engaged throughout session.',
        assessment: 'Client demonstrates symptoms consistent with adjustment disorder with mixed anxiety and depressed mood. Coping skills appear limited. Insight is good.',
        plan: 'Initiate cognitive behavioral therapy focused on stress management and coping skills. Discuss sleep hygiene. Schedule weekly sessions initially.'
      },
      goals: ['Improve stress management', 'Establish healthy sleep routine', 'Develop coping strategies'],
      interventions: ['Cognitive restructuring', 'Stress management techniques', 'Sleep hygiene education'],
      homework: ['Complete mood and sleep diary', 'Practice relaxation techniques daily', 'Identify three positive coping strategies']
    }));
    
    setIsGenerating(false);
  };

  const saveNote = async () => {
    // In a real app, this would save to your backend
    const noteToSave: SessionNote = {
      ...currentNote as SessionNote,
      id: Date.now().toString(),
      sessionDate: new Date().toISOString().split('T')[0],
      duration: Math.floor(recordingTime / 60),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'completed'
    };
    
    setRecentNotes(prev => [noteToSave, ...prev]);
    
    // Reset form
    setCurrentNote({
      sessionType: 'individual',
      status: 'draft',
      notes: {
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
      },
      goals: [],
      interventions: [],
      homework: [],
      nextSession: ''
    });
    setRecordingTime(0);
    setView('list');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-lg">Session Notes</h1>
            <p className="subheading">Manage your therapy session documentation</p>
          </div>
          <button
            onClick={() => setView('create')}
            className="btn-primary flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            New Session Note
          </button>
        </div>

        {/* Recent Notes */}
        <div className="grid gap-4">
          {recentNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="heading-sm mb-2">{note.clientName}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(note.sessionDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {note.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {note.sessionType}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    note.status === 'completed' ? 'bg-green-100 text-green-700' :
                    note.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {note.status}
                  </span>
                  <button className="btn-ghost p-2">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Assessment</h4>
                  <p className="text-sm text-slate-600 line-clamp-2">{note.notes.assessment}</p>
                </div>
                
                {note.goals.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Goals</h4>
                    <div className="flex flex-wrap gap-1">
                      {note.goals.slice(0, 3).map((goal, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                          {goal}
                        </span>
                      ))}
                      {note.goals.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs">
                          +{note.goals.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg">Create Session Note</h1>
          <p className="subheading">Record and generate AI-powered session documentation</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('list')}
            className="btn-secondary"
          >
            View All Notes
          </button>
          {onBack && (
            <button onClick={onBack} className="btn-ghost">
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Recording Section */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="heading-md mb-4">Session Recording</h2>
          <p className="subheading">Start recording your therapy session or upload an existing audio file</p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {/* Recording Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          {/* Recording Time */}
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-slate-900 mb-2">
              {formatTime(recordingTime)}
            </div>
            <p className="text-sm text-slate-600">
              {isRecording ? 'Recording in progress...' : 'Ready to record'}
            </p>
          </div>

          {/* Controls */}
          {recordingTime > 0 && (
            <div className="flex items-center gap-4">
              <button className="btn-ghost p-3">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button 
                onClick={generateAINotes}
                disabled={isGenerating}
                className="btn-primary flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Notes...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI Notes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SOAP Notes Form */}
      {(currentNote.notes?.subjective || isGenerating) && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="heading-md">SOAP Notes</h2>
          </div>

          <div className="grid gap-6">
            {/* Subjective */}
            <div>
              <label className="block font-medium text-slate-900 mb-2">
                Subjective (What the client says)
              </label>
              <textarea
                value={currentNote.notes?.subjective || ''}
                onChange={(e) => setCurrentNote(prev => ({
                  ...prev,
                  notes: { ...prev.notes!, subjective: e.target.value }
                }))}
                className="w-full p-4 border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Client's subjective report of symptoms, feelings, and experiences..."
              />
            </div>

            {/* Objective */}
            <div>
              <label className="block font-medium text-slate-900 mb-2">
                Objective (What you observe)
              </label>
              <textarea
                value={currentNote.notes?.objective || ''}
                onChange={(e) => setCurrentNote(prev => ({
                  ...prev,
                  notes: { ...prev.notes!, objective: e.target.value }
                }))}
                className="w-full p-4 border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Observable behaviors, appearance, mood, and clinical observations..."
              />
            </div>

            {/* Assessment */}
            <div>
              <label className="block font-medium text-slate-900 mb-2">
                Assessment (Your clinical judgment)
              </label>
              <textarea
                value={currentNote.notes?.assessment || ''}
                onChange={(e) => setCurrentNote(prev => ({
                  ...prev,
                  notes: { ...prev.notes!, assessment: e.target.value }
                }))}
                className="w-full p-4 border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Clinical assessment, diagnosis, progress toward goals..."
              />
            </div>

            {/* Plan */}
            <div>
              <label className="block font-medium text-slate-900 mb-2">
                Plan (Next steps and interventions)
              </label>
              <textarea
                value={currentNote.notes?.plan || ''}
                onChange={(e) => setCurrentNote(prev => ({
                  ...prev,
                  notes: { ...prev.notes!, plan: e.target.value }
                }))}
                className="w-full p-4 border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Treatment plan, interventions, homework, next session goals..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      {currentNote.notes?.subjective && (
        <div className="flex justify-end">
          <button
            onClick={saveNote}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Session Note
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionNotes;
