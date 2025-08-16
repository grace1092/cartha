'use client';

import { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const demoClients = [
  { id: 1, name: 'Sarah J.', lastSession: '2 days ago', status: 'Active', nextAppt: 'Today 3:00 PM' },
  { id: 2, name: 'Michael R.', lastSession: '1 week ago', status: 'Active', nextAppt: 'Tomorrow 10:00 AM' },
  { id: 3, name: 'Emma K.', lastSession: '3 days ago', status: 'Active', nextAppt: 'Friday 2:00 PM' },
  { id: 4, name: 'David L.', lastSession: '2 weeks ago', status: 'Inactive', nextAppt: 'Not scheduled' },
];

const progressData = [
  { week: 'W1', score: 3.2 },
  { week: 'W2', score: 4.1 },
  { week: 'W3', score: 3.8 },
  { week: 'W4', score: 5.2 },
  { week: 'W5', score: 6.1 },
  { week: 'W6', score: 7.3 },
  { week: 'W7', score: 7.8 },
  { week: 'W8', score: 8.2 },
];

export default function ClientsCard() {
  const [clients, setClients] = useState(demoClients);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', notes: '' });

  const handleAddClient = () => {
    if (newClient.name.trim()) {
      const client = {
        id: clients.length + 1,
        name: newClient.name,
        lastSession: 'Never',
        status: 'New',
        nextAppt: 'Not scheduled'
      };
      setClients([...clients, client]);
      setNewClient({ name: '', email: '', notes: '' });
      setShowModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'New': return 'bg-blue-100 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <Card>
      <CardHeader 
        title="Client Management" 
        subtitle="Track progress and manage your client relationships"
        icon={Users}
      >
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white rounded-xl px-4 py-2 font-medium hover:bg-neutral-900 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2 inline" />
          Add Client
        </button>
      </CardHeader>

      <CardContent>
        {/* Client Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 px-2 text-sm font-medium text-neutral-600">Name</th>
                <th className="text-left py-2 px-2 text-sm font-medium text-neutral-600">Last Session</th>
                <th className="text-left py-2 px-2 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left py-2 px-2 text-sm font-medium text-neutral-600">Next Appointment</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-neutral-100">
                  <td className="py-3 px-2">
                    <span className="text-sm font-medium text-[#222]">{client.name}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-neutral-600">{client.lastSession}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-neutral-600">{client.nextAppt}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Progress Overview */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <h4 className="font-medium text-[#222] mb-4">Progress Overview</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            Average client progress scores over the last 8 weeks
          </p>
        </div>

        {/* Add Client Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#222]">
                  Add New Client
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#222] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                    placeholder="Enter client's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#222] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                    placeholder="client@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#222] mb-1">
                    Initial Notes
                  </label>
                  <textarea
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    rows={3}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                    placeholder="Any initial notes or observations..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-neutral-100 text-neutral-700 rounded-xl px-4 py-2 font-medium hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClient}
                  className="flex-1 bg-black text-white rounded-xl px-4 py-2 font-medium hover:bg-neutral-900 transition-colors"
                >
                  Add Client
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
