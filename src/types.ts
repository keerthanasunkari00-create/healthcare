export enum UserRole {
  PATIENT = 'patient',
  ADMIN = 'admin',
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  experience: number; // in years
  education: string;
  bio: string;
  avatar: string; // avatar string or placeholder name
  availability: string[]; // e.g. ["Monday", "Wednesday", "Friday"]
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  date: string; // YYYY-MM-DD
  fileUrl: string; // Base64 content or mock link
  fileType: string; // e.g., "PDF", "X-Ray Image"
  fileSize: string; // e.g., "1.2 MB"
  notes: string;
  uploadedAt: string;
}

export interface Department {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  detailedInfo: string;
}
