export type UserRole = 'admin' | 'patient';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'na';

export interface UserProfile {
  id: string; // UUID de Supabase
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId?: string; // Opcional si es "guest" (agendamiento sin registro)
  
  // Datos del paciente si no está registrado
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;

  scheduledAt: string; // ISO Date
  durationMinutes: number; // Por defecto 60, pero configurable
  status: AppointmentStatus;
  type: string; // Ej: "Terapia Individual", "Pareja"
  notes?: string; // Notas internas de la psicóloga
  
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

export interface WorkSchedule {
  dayOfWeek: number; // 0-6 (Domingo-Sábado)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isActive: boolean;
  breakStart?: string; // "12:00"
  breakEnd?: string; // "13:00"
}
