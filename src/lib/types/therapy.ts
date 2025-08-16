export interface TherapyClient {
  id: string;
  therapist_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_id?: string;
  presenting_concerns?: string;
  treatment_goals?: string[];
  status: 'active' | 'inactive' | 'discharged' | 'on_hold';
  intake_date: string;
  last_session_date?: string;
  next_appointment?: string;
  session_rate?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TherapySession {
  id: string;
  therapist_id: string;
  client_id: string;
  session_date: string;
  duration_minutes: number;
  session_type: 'individual' | 'family' | 'group' | 'couples' | 'intake' | 'assessment';
  status: 'scheduled' | 'completed' | 'no_show' | 'canceled' | 'late_cancel';
  location: string;
  session_notes?: string;
  progress_notes?: string;
  interventions_used?: string[];
  homework_assigned?: string;
  next_session_goals?: string;
  risk_assessment?: string;
  session_rating?: number;
  client_mood_before?: string;
  client_mood_after?: string;
  billing_code?: string;
  billing_amount?: number;
  billing_status: 'pending' | 'billed' | 'paid' | 'insurance_pending';
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  therapist_id: string;
  client_id: string;
  appointment_date: string;
  duration_minutes: number;
  appointment_type: 'therapy' | 'intake' | 'assessment' | 'consultation';
  status: 'scheduled' | 'confirmed' | 'completed' | 'no_show' | 'canceled' | 'rescheduled';
  location: string;
  notes?: string;
  reminder_sent: boolean;
  confirmation_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface BillingRecord {
  id: string;
  therapist_id: string;
  client_id: string;
  session_id?: string;
  invoice_number: string;
  service_date: string;
  billing_code: string;
  description: string;
  amount: number;
  insurance_amount: number;
  client_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TreatmentPlan {
  id: string;
  therapist_id: string;
  client_id: string;
  diagnosis_primary?: string;
  diagnosis_secondary?: string[];
  treatment_goals: TreatmentGoal[];
  interventions?: string[];
  session_frequency?: string;
  estimated_duration?: string;
  review_date?: string;
  status: 'active' | 'completed' | 'discontinued' | 'on_hold';
  created_at: string;
  updated_at: string;
}

export interface TreatmentGoal {
  goal: string;
  target_date?: string;
  status: 'active' | 'completed' | 'discontinued';
}

export interface PracticeAnalytics {
  id: string;
  therapist_id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Dashboard summary types
export interface DashboardStats {
  total_clients: number;
  active_clients: number;
  weekly_sessions: number;
  monthly_sessions: number;
  outstanding_notes: number;
  pending_appointments: number;
  monthly_revenue: number;
  outstanding_bills: number;
}

export interface RecentActivity {
  id: string;
  type: 'session' | 'appointment' | 'client_added' | 'payment' | 'note';
  description: string;
  timestamp: string;
  client_name?: string;
  amount?: number;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface ClientFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_id?: string;
  presenting_concerns?: string;
  treatment_goals?: string[];
  session_rate?: number;
  notes?: string;
}

export interface SessionFormData {
  client_id: string;
  session_date: string;
  duration_minutes: number;
  session_type: 'individual' | 'family' | 'group' | 'couples' | 'intake' | 'assessment';
  location: string;
  session_notes?: string;
  progress_notes?: string;
  interventions_used?: string[];
  homework_assigned?: string;
  next_session_goals?: string;
  risk_assessment?: string;
  session_rating?: number;
  client_mood_before?: string;
  client_mood_after?: string;
  billing_code?: string;
  billing_amount?: number;
}

export interface AppointmentFormData {
  client_id: string;
  appointment_date: string;
  duration_minutes: number;
  appointment_type: 'therapy' | 'intake' | 'assessment' | 'consultation';
  location: string;
  notes?: string;
}
