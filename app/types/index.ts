export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'patient' | 'medical_staff' | 'family_member';
  // For family members - link to elderly patient
  linkedPatientId?: string;
  // For medical staff - organization info
  organization?: string;
  staffId?: string;
  // For patients - elderly status
  isElderly?: boolean;
  gender?: 'male' | 'female';
  age?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recordMenstruation?: boolean | null;
  medicalConditions?: {
    hypertension: boolean;
    diabetes: boolean;
    cholesterol: boolean;
  };
  healthMetrics?: {
    cholesterol?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    } | null;
    bloodSugar?: number;
  };
  healthMetricsHistory?: Array<{
    date: string;
    weight?: number;
    height?: number;
    bmi?: number;
    cholesterol?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    } | null;
    bloodSugar?: number;
  }>;
  tracking?: {
    exercise: Array<{
      date: string;
      type: string;
      duration: number;
      calories: number;
    }>;
    calories: Array<{
      date: string;
      consumed: number;
      burned: number;
    }>;
    water: Array<{
      date: string;
      amount: number;
    }>;
  };
  menstruationData?: Array<{
    date: string;
    flow: 'light' | 'medium' | 'heavy';
    symptoms: string[];
  }>;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccessLog {
  id: string;
  userId: string;
  accessedBy: string;
  dataType: string;
  timestamp: string;
  granted: boolean;
}

export interface AccessRequest {
  id: string;
  userId: string;
  requesterName: string;
  organizationName?: string;
  purpose: 'treatment' | 'research' | 'family_support' | 'insurance' | 'emergency';
  dataType: 'medical_records' | 'personal_info' | 'health_metrics';
  duration?: number; // in days
  message?: string;
  status: 'pending' | 'granted' | 'denied';
  timestamp: string;
  reviewedAt?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: string;
  isEmergency: boolean;
}

export interface OnboardingData {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  recordMenstruation: boolean | null;
  medicalConditions: {
    hypertension: boolean;
    diabetes: boolean;
    cholesterol: boolean;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface AppSettings {
  elderlyMode: boolean;
  dyslexiaFriendly: boolean;
  darkMode: boolean;
  voiceReader: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  extraLargeTextMode: boolean;
  menstruationTracking: boolean;
} 