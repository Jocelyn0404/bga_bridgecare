export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  elderlyId?: string;
  childId?: string;
  isPrimaryContact: boolean;
  canViewRecords: boolean;
  canEditRecords: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string; // For doctor's view
  patientAge?: number; // For doctor's view
  hospitalId: string;
  doctorId: string;
  appointmentDate: Date;
  appointmentTime: string;
  appointmentType: 'checkup' | 'consultation' | 'surgery' | 'followup' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'urgent';
  notes: string;
  estimatedDuration: number; // in minutes
  requiresTransport: boolean;
  transportDetails?: TransportDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  hospitalId: string;
  doctorId: string;
  visitDate: Date;
  visitType: 'checkup' | 'consultation' | 'surgery' | 'emergency' | 'followup';
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  prescriptions: Prescription[];
  labResults: LabResult[];
  notes: string;
  nextAppointment?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prescription {
  id: string;
  medicalRecordId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: Date;
  isActive: boolean;
  refillsRemaining: number;
  totalRefills: number;
  createdAt: Date;
}

export interface LabResult {
  id: string;
  medicalRecordId: string;
  testName: string;
  testDate: Date;
  results: LabTestResult[];
  labName: string;
  isNormal: boolean;
  createdAt: Date;
}

export interface LabTestResult {
  testType: string;
  value: string;
  unit: string;
  normalRange: string;
  isNormal: boolean;
  flag: 'low' | 'normal' | 'high';
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: Date;
  startDate: Date;
  isActive: boolean;
  refillsRemaining: number;
  totalRefills: number;
  prescriptionId?: string;
  takenToday?: boolean;
  currentStock?: number;
  refillReminder?: boolean;
  refillThreshold?: number;
  notes?: string;
  lastTaken?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'medication' | 'transport' | 'health' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  activeMedications: number;
  recentRecords: number;
  notifications: number;
}

export interface TransportDetails {
  id: string;
  appointmentId: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: Date;
  estimatedReturnTime: Date;
  actualReturnTime?: Date;
  transportProvider: 'grab' | 'uber' | 'taxi' | 'family' | 'ambulance';
  transportStatus: 'scheduled' | 'en-route' | 'picked-up' | 'at-hospital' | 'returning' | 'completed';
  driverName?: string;
  vehicleNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  isConnected: boolean;
  isIntegrated: boolean;
  apiEndpoint: string;
  apiKey?: string;
  specialties: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  isConnected: boolean;
  apiEndpoint: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncLog {
  id: string;
  entityType: 'hospital' | 'pharmacy';
  entityId: string;
  syncType: 'connect' | 'disconnect' | 'sync';
  status: 'success' | 'failed' | 'pending';
  message: string;
  createdAt: Date;
}

 