'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Phone,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  User,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  UserPlus
} from 'lucide-react';
import { TherapyClient, ClientFormData } from '@/lib/types/therapy';

interface ClientManagementProps {
  onBack?: () => void;
}

export default function ClientManagement({ onBack }: ClientManagementProps) {
  const { user } = useAuth();
  const [clients, setClients] = useState<TherapyClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<TherapyClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'discharged' | 'on_hold'>('all');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<TherapyClient | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    insurance_provider: '',
    insurance_id: '',
    presenting_concerns: '',
    treatment_goals: [],
    session_rate: 120,
    notes: ''
  });

  useEffect(() => {
    // Simulate loading client data
    setTimeout(() => {
      const mockClients: TherapyClient[] = [
        {
          id: '1',
          therapist_id: user?.id || '',
          first_name: 'Sarah',
          last_name: 'Martinez',
          email: 'sarah.martinez@email.com',
          phone: '(555) 123-4567',
          date_of_birth: '1985-03-15',
          emergency_contact_name: 'John Martinez',
          emergency_contact_phone: '(555) 123-4568',
          insurance_provider: 'Blue Cross Blue Shield',
          insurance_id: 'BC123456789',
          presenting_concerns: 'Anxiety and stress management, work-related stress',
          treatment_goals: ['Reduce anxiety symptoms', 'Improve coping strategies', 'Better work-life balance'],
          status: 'active',
          intake_date: '2024-01-15',
          last_session_date: '2024-02-12T14:00:00Z',
          next_appointment: '2024-02-19T14:00:00Z',
          session_rate: 120,
          notes: 'Responds well to CBT techniques. Homework compliance is excellent.',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-02-12T15:00:00Z'
        },
        {
          id: '2',
          therapist_id: user?.id || '',
          first_name: 'Michael',
          last_name: 'Johnson',
          email: 'michael.j@email.com',
          phone: '(555) 234-5678',
          date_of_birth: '1978-07-22',
          emergency_contact_name: 'Lisa Johnson',
          emergency_contact_phone: '(555) 234-5679',
          insurance_provider: 'Aetna',
          insurance_id: 'AET987654321',
          presenting_concerns: 'Depression and relationship issues, communication problems',
          treatment_goals: ['Improve mood and emotional regulation', 'Better communication skills', 'Strengthen relationship'],
          status: 'active',
          intake_date: '2024-01-22',
          last_session_date: '2024-02-10T10:00:00Z',
          next_appointment: '2024-02-17T10:00:00Z',
          session_rate: 130,
          notes: 'Making good progress with interpersonal therapy. Partner involved in treatment.',
          created_at: '2024-01-22T09:00:00Z',
          updated_at: '2024-02-10T11:00:00Z'
        },
        {
          id: '3',
          therapist_id: user?.id || '',
          first_name: 'Emma',
          last_name: 'Davis',
          email: 'emma.davis@email.com',
          phone: '(555) 345-6789',
          date_of_birth: '1992-11-08',
          emergency_contact_name: 'Robert Davis',
          emergency_contact_phone: '(555) 345-6790',
          insurance_provider: 'United Healthcare',
          insurance_id: 'UH555666777',
          presenting_concerns: 'Work-related stress and burnout, perfectionism',
          treatment_goals: ['Stress reduction techniques', 'Work-life balance', 'Address perfectionism'],
          status: 'active',
          intake_date: '2024-02-01',
          next_appointment: '2024-02-16T16:00:00Z',
          session_rate: 110,
          notes: 'New client. Initial assessment completed. High motivation for change.',
          created_at: '2024-02-01T14:00:00Z',
          updated_at: '2024-02-01T15:00:00Z'
        },
        {
          id: '4',
          therapist_id: user?.id || '',
          first_name: 'James',
          last_name: 'Wilson',
          email: 'james.wilson@email.com',
          phone: '(555) 456-7890',
          date_of_birth: '1965-05-30',
          emergency_contact_name: 'Mary Wilson',
          emergency_contact_phone: '(555) 456-7891',
          insurance_provider: 'Medicare',
          insurance_id: 'MED123789456',
          presenting_concerns: 'Grief and loss, adjustment to retirement',
          treatment_goals: ['Process grief', 'Adapt to life changes', 'Find new purpose'],
          status: 'on_hold',
          intake_date: '2023-11-10',
          last_session_date: '2024-01-20T15:00:00Z',
          session_rate: 100,
          notes: 'Taking a break from therapy. Plans to resume in March.',
          created_at: '2023-11-10T10:00:00Z',
          updated_at: '2024-01-20T16:00:00Z'
        },
        {
          id: '5',
          therapist_id: user?.id || '',
          first_name: 'Lisa',
          last_name: 'Thompson',
          email: 'lisa.t@email.com',
          phone: '(555) 567-8901',
          date_of_birth: '1980-09-12',
          emergency_contact_name: 'David Thompson',
          emergency_contact_phone: '(555) 567-8902',
          insurance_provider: 'Cigna',
          insurance_id: 'CIG789123456',
          presenting_concerns: 'ADHD management, time management issues',
          treatment_goals: ['Improve focus and organization', 'Better time management', 'Reduce overwhelm'],
          status: 'discharged',
          intake_date: '2023-08-15',
          last_session_date: '2024-01-15T11:00:00Z',
          session_rate: 125,
          notes: 'Successfully completed treatment. Goals achieved. Discharged with maintenance plan.',
          created_at: '2023-08-15T09:00:00Z',
          updated_at: '2024-01-15T12:00:00Z'
        }
      ];
      
      setClients(mockClients);
      setFilteredClients(mockClients);
      setLoading(false);
    }, 1000);
  }, [user?.id]);

  useEffect(() => {
    let filtered = clients;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(client =>
        `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm)
      );
    }
    
    setFilteredClients(filtered);
  }, [clients, statusFilter, searchTerm]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      discharged: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      on_hold: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || AlertCircle;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-800'}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      insurance_provider: '',
      insurance_id: '',
      presenting_concerns: '',
      treatment_goals: [],
      session_rate: 120,
      notes: ''
    });
    setEditingClient(null);
    setShowAddForm(false);
  };

  const handleEdit = (client: TherapyClient) => {
    setEditingClient(client);
    setFormData({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email || '',
      phone: client.phone || '',
      date_of_birth: client.date_of_birth || '',
      emergency_contact_name: client.emergency_contact_name || '',
      emergency_contact_phone: client.emergency_contact_phone || '',
      insurance_provider: client.insurance_provider || '',
      insurance_id: client.insurance_id || '',
      presenting_concerns: client.presenting_concerns || '',
      treatment_goals: client.treatment_goals || [],
      session_rate: client.session_rate || 120,
      notes: client.notes || ''
    });
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!formData.first_name || !formData.last_name) {
      alert('Please fill in required fields (First Name and Last Name)');
      return;
    }

    if (editingClient) {
      // Update existing client
      const updatedClients = clients.map(client =>
        client.id === editingClient.id
          ? {
              ...client,
              ...formData,
              updated_at: new Date().toISOString()
            }
          : client
      );
      setClients(updatedClients);
    } else {
      // Add new client
      const newClient: TherapyClient = {
        id: Math.random().toString(36).substr(2, 9),
        therapist_id: user?.id || '',
        ...formData,
        status: 'active',
        intake_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setClients([...clients, newClient]);
    }

    resetForm();
  };

  const handleDelete = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">Manage your therapy clients and their information</p>
        </div>
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Dashboard
            </button>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Client
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_hold">On Hold</option>
              <option value="discharged">Discharged</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredClients.length} of {clients.length} clients
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first client to your practice.'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Client
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Appointment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.first_name} {client.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Intake: {formatDate(client.intake_date)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(client.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.last_session_date ? formatDate(client.last_session_date) : 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.next_appointment ? formatDate(client.next_appointment) : 'Not scheduled'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${client.session_rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Client Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Rate ($)
                    </label>
                    <input
                      type="number"
                      value={formData.session_rate}
                      onChange={(e) => setFormData({...formData, session_rate: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      value={formData.insurance_provider}
                      onChange={(e) => setFormData({...formData, insurance_provider: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance ID
                    </label>
                    <input
                      type="text"
                      value={formData.insurance_id}
                      onChange={(e) => setFormData({...formData, insurance_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Clinical Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Presenting Concerns
                    </label>
                    <textarea
                      value={formData.presenting_concerns}
                      onChange={(e) => setFormData({...formData, presenting_concerns: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the client's presenting concerns..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional notes about the client..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingClient ? 'Update Client' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
