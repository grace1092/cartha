'use client';

import { useState } from 'react';
import { FileText, Mic, Play, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

const noteTemplates = ['CBT', 'Psychodynamic', 'Couples'];
const noteFormats = ['SOAP', 'DAP', 'Freeform'];

const demoSOAPNote = {
  date: 'Today, 2:30 PM',
  client: 'Client A.',
  subjective: "Client reports feeling 'much better' this week. Sleep has improved from 4-5 hours to 6-7 hours nightly. Describes mood as 'stable' and notes decreased anxiety when thinking about work presentations.",
  objective: "Client appeared relaxed, maintained good eye contact throughout session. Speech was clear and paced normally. No signs of psychomotor agitation observed in previous sessions.",
  assessment: "Continued progress in managing work-related anxiety. Sleep hygiene improvements have positively impacted overall mood regulation. Client is actively utilizing CBT techniques learned in previous sessions.",
  plan: "Continue current CBT approach. Assign homework: practice presentation in front of mirror daily. Schedule follow-up in 1 week. Consider introducing mindfulness techniques if anxiety spikes before next session."
};

const lastSessions = [
  { client: 'Client A.', date: 'Today', type: 'Individual' },
  { client: 'Client B.', date: 'Yesterday', type: 'Couples' },
  { client: 'Client C.', date: '2 days ago', type: 'Individual' }
];

export default function NotesCard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFormat, setActiveFormat] = useState('SOAP');
  const [activeTemplate, setActiveTemplate] = useState('CBT');
  const [generatedNote, setGeneratedNote] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleGenerateNotes = async () => {
    setIsGenerating(true);
    
    // Simulate API call with 1.5s delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setGeneratedNote(demoSOAPNote);
    setIsGenerating(false);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Card>
      <CardHeader 
        title="AI Session Notes" 
        subtitle="Generate professional documentation in seconds"
        icon={FileText}
      >
        <div className="flex space-x-2">
          <button
            onClick={handleRecord}
            className={`p-2 rounded-xl transition-colors ${
              isRecording 
                ? 'bg-red-100 text-red-600' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Format Tabs */}
        <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1 mb-6">
          {noteFormats.map((format) => (
            <button
              key={format}
              onClick={() => setActiveFormat(format)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFormat === format
                  ? 'bg-white text-[#222] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {format}
            </button>
          ))}
        </div>

        {/* Template Suggestions */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-[#222] mb-3">Template suggestions</h4>
          <div className="flex space-x-2">
            {noteTemplates.map((template) => (
              <button
                key={template}
                onClick={() => setActiveTemplate(template)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeTemplate === template
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateNotes}
          disabled={isGenerating}
          className="w-full bg-black text-white rounded-xl px-4 py-3 font-medium hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Notes...
            </div>
          ) : (
            'Generate Notes'
          )}
        </button>

        {/* Generated Note */}
        {isGenerating && (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
        )}

        {generatedNote && !isGenerating && (
          <div className="bg-neutral-50 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-[#222]">{activeFormat} Note</h4>
              <span className="text-sm text-neutral-600">{generatedNote.date}</span>
            </div>
            
            {activeFormat === 'SOAP' && (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-[#222]">Subjective: </span>
                  <span className="text-neutral-700">{generatedNote.subjective}</span>
                </div>
                <div>
                  <span className="font-medium text-[#222]">Objective: </span>
                  <span className="text-neutral-700">{generatedNote.objective}</span>
                </div>
                <div>
                  <span className="font-medium text-[#222]">Assessment: </span>
                  <span className="text-neutral-700">{generatedNote.assessment}</span>
                </div>
                <div>
                  <span className="font-medium text-[#222]">Plan: </span>
                  <span className="text-neutral-700">{generatedNote.plan}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Last Sessions */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-[#222] mb-3">Last 3 sessions</h4>
          <div className="space-y-2">
            {lastSessions.map((session, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-neutral-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-[#222]">{session.client}</span>
                  <span className="text-xs text-neutral-600 ml-2">({session.type})</span>
                </div>
                <span className="text-xs text-neutral-600">{session.date}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
