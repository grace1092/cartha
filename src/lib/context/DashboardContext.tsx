'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for dashboard data
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  lastSession?: string;
  status: 'Active' | 'Inactive' | 'New';
  nextAppt?: string;
  notes?: string;
  createdAt: string;
}

export interface SessionNote {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  format: 'SOAP' | 'DAP' | 'Freeform';
  template: 'CBT' | 'Psychodynamic' | 'Couples';
  content: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    data?: string;
    analysis?: string;
    freeform?: string;
  };
  status: 'draft' | 'completed';
  duration: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  day: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface FollowUpEmail {
  id: string;
  clientId: string;
  clientName: string;
  template: string;
  subject: string;
  content: string;
  scheduleDate: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentAt?: string;
}

interface DashboardContextType {
  // State
  clients: Client[];
  sessionNotes: SessionNote[];
  appointments: Appointment[];
  followUpEmails: FollowUpEmail[];
  
  // Client operations
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
  
  // Session notes operations
  addSessionNote: (note: Omit<SessionNote, 'id'>) => void;
  updateSessionNote: (id: string, updates: Partial<SessionNote>) => void;
  deleteSessionNote: (id: string) => void;
  getSessionNote: (id: string) => SessionNote | undefined;
  
  // Appointment operations
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  
  // Follow-up email operations
  addFollowUpEmail: (email: Omit<FollowUpEmail, 'id'>) => void;
  updateFollowUpEmail: (id: string, updates: Partial<FollowUpEmail>) => void;
  deleteFollowUpEmail: (id: string) => void;
  getFollowUpEmail: (id: string) => FollowUpEmail | undefined;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Initial demo data
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Sarah J.',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    lastSession: '2 days ago',
    status: 'Active',
    nextAppt: 'Today 3:00 PM',
    notes: 'Working on anxiety management techniques',
    createdAt: '2024-01-15'
  },
  {
    id: '2', 
    name: 'Michael R.',
    email: 'michael.r@example.com',
    phone: '(555) 234-5678',
    lastSession: '1 week ago',
    status: 'Active',
    nextAppt: 'Tomorrow 10:00 AM',
    notes: 'CBT for depression, good progress',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Emma K.',
    email: 'emma.k@example.com',
    lastSession: '3 days ago', 
    status: 'Active',
    nextAppt: 'Friday 2:00 PM',
    notes: 'Couples therapy session',
    createdAt: '2024-02-01'
  }
];

const initialSessionNotes: SessionNote[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Sarah J.',
    date: '2024-03-15T14:30:00Z',
    format: 'SOAP',
    template: 'CBT',
    content: {
      subjective: "Client reports feeling 'much better' this week. Sleep has improved from 4-5 hours to 6-7 hours nightly.",
      objective: "Client appeared relaxed, maintained good eye contact throughout session. No signs of psychomotor agitation.",
      assessment: "Continued progress in managing work-related anxiety. Sleep hygiene improvements have positively impacted mood.",
      plan: "Continue current CBT approach. Assign homework: practice presentation techniques. Schedule follow-up in 1 week."
    },
    status: 'completed',
    duration: 50
  }
];

const initialAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Sarah J.',
    day: 'Mon',
    time: '10:00',
    duration: 60,
    status: 'scheduled'
  },
  {
    id: '2',
    clientId: '2', 
    clientName: 'Michael R.',
    day: 'Tue',
    time: '2:00',
    duration: 50,
    status: 'scheduled'
  }
];

const initialFollowUpEmails: FollowUpEmail[] = [];

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>(initialSessionNotes);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [followUpEmails, setFollowUpEmails] = useState<FollowUpEmail[]>(initialFollowUpEmails);

  // Client operations
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'New',
      lastSession: 'Never'
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updates } : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    // Also clean up related data
    setSessionNotes(prev => prev.filter(note => note.clientId !== id));
    setAppointments(prev => prev.filter(apt => apt.clientId !== id));
    setFollowUpEmails(prev => prev.filter(email => email.clientId !== id));
  };

  const getClient = (id: string) => {
    return clients.find(client => client.id === id);
  };

  // Session notes operations
  const addSessionNote = (noteData: Omit<SessionNote, 'id'>) => {
    const newNote: SessionNote = {
      ...noteData,
      id: Date.now().toString()
    };
    setSessionNotes(prev => [...prev, newNote]);
  };

  const updateSessionNote = (id: string, updates: Partial<SessionNote>) => {
    setSessionNotes(prev => prev.map(note =>
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const deleteSessionNote = (id: string) => {
    setSessionNotes(prev => prev.filter(note => note.id !== id));
  };

  const getSessionNote = (id: string) => {
    return sessionNotes.find(note => note.id === id);
  };

  // Appointment operations
  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === id ? { ...apt, ...updates } : apt
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const getAppointment = (id: string) => {
    return appointments.find(apt => apt.id === id);
  };

  // Follow-up email operations
  const addFollowUpEmail = (emailData: Omit<FollowUpEmail, 'id'>) => {
    const newEmail: FollowUpEmail = {
      ...emailData,
      id: Date.now().toString()
    };
    setFollowUpEmails(prev => [...prev, newEmail]);
  };

  const updateFollowUpEmail = (id: string, updates: Partial<FollowUpEmail>) => {
    setFollowUpEmails(prev => prev.map(email =>
      email.id === id ? { ...email, ...updates } : email
    ));
  };

  const deleteFollowUpEmail = (id: string) => {
    setFollowUpEmails(prev => prev.filter(email => email.id !== id));
  };

  const getFollowUpEmail = (id: string) => {
    return followUpEmails.find(email => email.id === id);
  };

  const value: DashboardContextType = {
    clients,
    sessionNotes,
    appointments,
    followUpEmails,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    addSessionNote,
    updateSessionNote,
    deleteSessionNote,
    getSessionNote,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment,
    addFollowUpEmail,
    updateFollowUpEmail,
    deleteFollowUpEmail,
    getFollowUpEmail
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
