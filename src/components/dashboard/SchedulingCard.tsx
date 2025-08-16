'use client';

import { useState } from 'react';
import { Calendar, Plus, X, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const timeSlots = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00'];

const demoAppointments = [
  { id: 1, client: 'Sarah J.', day: 'Mon', time: '10:00', duration: 60 },
  { id: 2, client: 'Michael R.', day: 'Tue', time: '2:00', duration: 50 },
  { id: 3, client: 'Emma K.', day: 'Wed', time: '11:00', duration: 60 },
  { id: 4, client: 'David L.', day: 'Thu', time: '3:00', duration: 50 },
  { id: 5, client: 'Lisa M.', day: 'Fri', time: '9:00', duration: 60 },
];

export default function SchedulingCard() {
  const [appointments, setAppointments] = useState(demoAppointments);
  const [showModal, setShowModal] = useState(false);
  const [newAppt, setNewAppt] = useState({
    client: '',
    day: 'Mon',
    startTime: '9:00',
    endTime: '10:00',
    duration: 60
  });
  const [conflictMessage, setConflictMessage] = useState('');

  const clients = ['Sarah J.', 'Michael R.', 'Emma K.', 'David L.', 'Lisa M.', 'New Client'];

  const checkConflict = (day: string, startTime: string, endTime: string) => {
    const start = convertTimeToMinutes(startTime);
    const end = convertTimeToMinutes(endTime);
    
    return appointments.some(appt => {
      if (appt.day !== day) return false;
      
      const apptStart = convertTimeToMinutes(appt.time);
      const apptEnd = apptStart + appt.duration;
      
      return (start < apptEnd && end > apptStart);
    });
  };

  const convertTimeToMinutes = (time: string) => {
    const [hours, minutes = 0] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const convertMinutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (duration: number) => {
    const startMinutes = convertTimeToMinutes(newAppt.startTime);
    const endMinutes = startMinutes + duration;
    const endTime = convertMinutesToTime(endMinutes);
    
    setNewAppt({
      ...newAppt,
      duration,
      endTime
    });
  };

  const handleAddAppointment = () => {
    setConflictMessage('');
    
    if (!newAppt.client.trim()) {
      setConflictMessage('Please select a client.');
      return;
    }

    if (checkConflict(newAppt.day, newAppt.startTime, newAppt.endTime)) {
      setConflictMessage('Time conflict detected! Please choose a different time slot.');
      return;
    }

    const appointment = {
      id: appointments.length + 1,
      client: newAppt.client,
      day: newAppt.day,
      time: newAppt.startTime,
      duration: newAppt.duration
    };

    setAppointments([...appointments, appointment]);
    setNewAppt({
      client: '',
      day: 'Mon',
      startTime: '9:00',
      endTime: '10:00',
      duration: 60
    });
    setShowModal(false);
  };

  const getAppointmentForSlot = (day: string, time: string) => {
    return appointments.find(appt => appt.day === day && appt.time === time);
  };

  return (
    <Card>
      <CardHeader 
        title="Smart Scheduling" 
        subtitle="Manage appointments with conflict detection"
        icon={Calendar}
      >
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white rounded-xl px-4 py-2 font-medium hover:bg-neutral-900 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2 inline" />
          Add Appointment
        </button>
      </CardHeader>

      <CardContent>
        {/* Week View */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-2 min-w-[600px]">
            {/* Header Row */}
            <div className="font-medium text-sm text-neutral-600 p-2"></div>
            {weekDays.map(day => (
              <div key={day} className="font-medium text-sm text-center text-neutral-600 p-2">
                {day}
              </div>
            ))}

            {/* Time Slots */}
            {timeSlots.map(time => (
              <div key={time} className="contents">
                <div className="text-sm text-neutral-600 p-2 flex items-center">
                  {time}
                </div>
                {weekDays.map(day => {
                  const appointment = getAppointmentForSlot(day, time);
                  return (
                    <div key={`${day}-${time}`} className="p-1">
                      {appointment ? (
                        <div className="bg-blue-100 text-blue-800 rounded-lg p-2 text-xs">
                          <div className="font-medium">{appointment.client}</div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.duration}min
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Add Appointment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#222]">
                  Add Appointment
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {conflictMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl mb-4">
                  {conflictMessage}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#222] mb-1">
                    Client
                  </label>
                  <select
                    value={newAppt.client}
                    onChange={(e) => setNewAppt({ ...newAppt, client: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#222] mb-1">
                      Day
                    </label>
                    <select
                      value={newAppt.day}
                      onChange={(e) => setNewAppt({ ...newAppt, day: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                    >
                      {weekDays.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#222] mb-1">
                      Start Time
                    </label>
                    <select
                      value={newAppt.startTime}
                      onChange={(e) => setNewAppt({ ...newAppt, startTime: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                    >
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#222] mb-1">
                    Duration
                  </label>
                  <div className="flex space-x-2">
                    {[50, 60, 90].map(duration => (
                      <button
                        key={duration}
                        onClick={() => handleDurationChange(duration)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          newAppt.duration === duration
                            ? 'bg-black text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {duration}min
                      </button>
                    ))}
                  </div>
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
                  onClick={handleAddAppointment}
                  className="flex-1 bg-black text-white rounded-xl px-4 py-2 font-medium hover:bg-neutral-900 transition-colors"
                >
                  Add Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
