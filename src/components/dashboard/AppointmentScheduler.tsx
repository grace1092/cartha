'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Video,
  Phone,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Bell,
  Mail,
  MessageSquare,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';

interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: 'individual' | 'couple' | 'family' | 'group';
  format: 'in-person' | 'video' | 'phone';
  location?: string;
  videoLink?: string;
  phoneNumber?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminderSent: boolean;
  recurring?: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: Appointment;
}

interface AppointmentSchedulerProps {
  onBack?: () => void;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ onBack }) => {
  const [view, setView] = useState<'calendar' | 'list' | 'create' | 'edit'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Sarah Johnson',
        title: 'Individual Therapy Session',
        date: '2024-01-15',
        startTime: '10:00',
        endTime: '10:50',
        duration: 50,
        type: 'individual',
        format: 'in-person',
        location: 'Office Room 1',
        status: 'confirmed',
        notes: 'Follow-up on anxiety management techniques',
        reminderSent: true,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z'
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'Michael Chen',
        title: 'Individual Therapy Session',
        date: '2024-01-15',
        startTime: '14:00',
        endTime: '14:45',
        duration: 45,
        type: 'individual',
        format: 'video',
        videoLink: 'https://meet.cartha.app/session-2',
        status: 'scheduled',
        notes: 'Initial assessment session',
        reminderSent: false,
        createdAt: '2024-01-12T14:00:00Z',
        updatedAt: '2024-01-12T14:00:00Z'
      },
      {
        id: '3',
        clientId: '3',
        clientName: 'Emily & David Wilson',
        title: 'Couple Therapy Session',
        date: '2024-01-16',
        startTime: '16:00',
        endTime: '17:00',
        duration: 60,
        type: 'couple',
        format: 'in-person',
        location: 'Office Room 2',
        status: 'confirmed',
        notes: 'Communication skills workshop',
        reminderSent: true,
        recurring: {
          frequency: 'weekly',
          endDate: '2024-03-16'
        },
        createdAt: '2024-01-08T16:00:00Z',
        updatedAt: '2024-01-08T16:00:00Z'
      }
    ];
    setAppointments(mockAppointments);
  }, []);

  // Generate time slots for the selected date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayAppointments = appointments.filter(apt => apt.date === date.toISOString().split('T')[0]);
    
    // Generate slots from 8 AM to 6 PM
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const appointment = dayAppointments.find(apt => apt.startTime === time);
        
        slots.push({
          time,
          available: !appointment,
          appointment
        });
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots(selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (view === 'create') {
    return <AppointmentForm onCancel={() => setView('calendar')} onSave={() => setView('calendar')} />;
  }

  if (view === 'list') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-lg">All Appointments</h1>
            <p className="subheading">Manage your scheduled appointments</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('calendar')}
              className="btn-secondary"
            >
              Calendar View
            </button>
            <button
              onClick={() => setView('create')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Appointment
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Appointments</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="heading-sm">{appointment.clientName}</h3>
                      <p className="body-sm text-slate-600">{appointment.title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {getFormatIcon(appointment.format)}
                      {appointment.format}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4" />
                      {appointment.type}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {appointment.recurring && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        Recurring {appointment.recurring.frequency}
                      </span>
                    )}
                    {!appointment.reminderSent && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Reminder pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="btn-ghost p-2">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn-ghost p-2">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
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
          <h1 className="heading-lg">Calendar</h1>
          <p className="subheading">Schedule and manage appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('list')}
            className="btn-secondary"
          >
            List View
          </button>
          <button
            onClick={() => setView('create')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </button>
          {onBack && (
            <button onClick={onBack} className="btn-ghost">
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateDate('prev')}
            className="btn-ghost p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="heading-md">{formatDate(selectedDate)}</h2>
            <p className="text-sm text-slate-600 mt-1">
              {timeSlots.filter(slot => !slot.available).length} appointments scheduled
            </p>
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            className="btn-ghost p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Time Slots Grid */}
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {timeSlots.map((slot) => (
            <div
              key={slot.time}
              className={`p-3 rounded-lg border transition-colors ${
                slot.available
                  ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                  : 'border-slate-300 bg-slate-50'
              }`}
              onClick={() => slot.available && setView('create')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900 w-16">
                    {slot.time}
                  </span>
                  {slot.appointment ? (
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {slot.appointment.clientName}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(slot.appointment.status)}`}>
                          {slot.appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                        <span>{slot.appointment.title}</span>
                        <div className="flex items-center gap-1">
                          {getFormatIcon(slot.appointment.format)}
                          {slot.appointment.format}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">Available</span>
                  )}
                </div>
                
                {slot.appointment && (
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn-ghost p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Appointment Form Component
const AppointmentForm: React.FC<{
  onCancel: () => void;
  onSave: () => void;
  appointment?: Appointment;
}> = ({ onCancel, onSave, appointment }) => {
  const [formData, setFormData] = useState({
    clientName: appointment?.clientName || '',
    title: appointment?.title || 'Individual Therapy Session',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    startTime: appointment?.startTime || '10:00',
    duration: appointment?.duration || 50,
    type: appointment?.type || 'individual',
    format: appointment?.format || 'in-person',
    location: appointment?.location || '',
    videoLink: appointment?.videoLink || '',
    phoneNumber: appointment?.phoneNumber || '',
    notes: appointment?.notes || '',
    recurring: appointment?.recurring || null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the appointment
    console.log('Saving appointment:', formData);
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg">
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </h1>
          <p className="subheading">Schedule a new therapy session</p>
        </div>
        <button onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
        {/* Client and Title */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Client name or couple names"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Session Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Session description"
              required
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Duration (minutes)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={50}>50 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>
        </div>

        {/* Session Type and Format */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Session Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="individual">Individual</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="group">Group</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Format
            </label>
            <select
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="in-person">In-Person</option>
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
            </select>
          </div>
        </div>

        {/* Location/Contact Details */}
        {formData.format === 'in-person' && (
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Office room or address"
            />
          </div>
        )}

        {formData.format === 'video' && (
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Video Call Link
            </label>
            <input
              type="url"
              value={formData.videoLink}
              onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://meet.cartha.app/session-id"
            />
          </div>
        )}

        {formData.format === 'phone' && (
          <div>
            <label className="block font-medium text-slate-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Phone number to call"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block font-medium text-slate-900 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Session preparation notes or special instructions"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {appointment ? 'Update Appointment' : 'Schedule Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentScheduler;
