'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

const emailTemplates = [
  {
    name: 'After first session',
    subject: 'Thank you for our session today',
    content: 'Hi {{client_name}},\n\nThank you for taking the time to meet with me today. I appreciated learning more about your goals and how I can best support you on your journey.\n\nAs discussed, our next appointment is scheduled for {{next_appointment}}. In the meantime, please feel free to reach out if you have any questions.\n\nBest regards,\nDr. Demo'
  },
  {
    name: 'No-show',
    subject: 'We missed you today',
    content: 'Hi {{client_name}},\n\nI noticed you weren\'t able to make our appointment today at {{appointment_time}}. I hope everything is okay.\n\nPlease let me know if you\'d like to reschedule. I have availability {{available_times}}.\n\nTake care,\nDr. Demo'
  },
  {
    name: 'Treatment milestone',
    subject: 'Celebrating your progress',
    content: 'Hi {{client_name}},\n\nI wanted to take a moment to acknowledge the significant progress you\'ve made over the past {{weeks}} weeks. Your commitment to the work we\'re doing together is truly inspiring.\n\n{{specific_achievements}}\n\nI look forward to continuing this journey with you.\n\nWarm regards,\nDr. Demo'
  }
];

export default function FollowupsCard() {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [emailContent, setEmailContent] = useState(emailTemplates[0].content);
  const [scheduleDate, setScheduleDate] = useState('');
  const [engagementPercent, setEngagementPercent] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setEmailContent(emailTemplates[selectedTemplate].content);
  }, [selectedTemplate]);

  useEffect(() => {
    // Animate engagement meter to 62% on mount
    const timer = setTimeout(() => {
      setEngagementPercent(62);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Set default schedule date to 7 days from today
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setScheduleDate(defaultDate.toISOString().split('T')[0]);
  }, []);

  const handleSendTest = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <Card>
      <CardHeader 
        title="Automated Follow-ups" 
        subtitle="Stay connected with personalized client communication"
        icon={Mail}
      />

      <CardContent>
        {/* Template Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#222] mb-2">
            Email Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(Number(e.target.value))}
            className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          >
            {emailTemplates.map((template, index) => (
              <option key={index} value={index}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* Email Compose Area */}
        <div className="mb-6">
          <div className="mb-3">
            <label className="block text-sm font-medium text-[#222] mb-1">
              Subject
            </label>
            <input
              type="text"
              value={emailTemplates[selectedTemplate].subject}
              readOnly
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 bg-neutral-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#222] mb-1">
              Content
            </label>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={8}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300 resize-none"
            />
          </div>
        </div>

        {/* Schedule Send */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#222] mb-2">
            Schedule Send
          </label>
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-neutral-500" />
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={handleSendTest}
            className="flex-1 bg-neutral-100 text-neutral-700 rounded-xl px-4 py-2 font-medium hover:bg-neutral-200 transition-colors"
          >
            Send Test Email
          </button>
          <button className="flex-1 bg-black text-white rounded-xl px-4 py-2 font-medium hover:bg-neutral-900 transition-colors">
            <Send className="h-4 w-4 mr-2 inline" />
            Schedule Send
          </button>
        </div>

        {/* Engagement Meter */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#222]">Engagement meter</span>
            <span className="text-sm font-bold text-[#222]">{engagementPercent}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${engagementPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            Client response rate to follow-up emails this month
          </p>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-50">
            Test email sent successfully!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
