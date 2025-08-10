'use client';

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  User as UserIcon, 
  Heart, 
  BarChart3, 
  Settings, 
  Shield, 
  MessageCircle,
  LogOut,
  Activity,
  Droplets,
  Calendar,
  TrendingUp,
  Pill,
  Users,
  Car,
  FileText,
  Bell,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Building2,
  Phone,
  Filter,
  Flame
} from 'lucide-react';
import BlockchainAccess from './BlockchainAccess';
import HealthChatbot from './HealthChatbot';
import PatientAppointments from './PatientAppointments';
import MedicalStaffAppointments from './MedicalStaffAppointments';
import ElderlyModeHome from './ElderlyModeHome';
import ElderlyModeAppointments from './ElderlyModeAppointments';
import { 
  FamilyMember, 
  Appointment, 
  MedicalRecord, 
  Medication,
  Notification,
  DashboardStats,
  TransportDetails,
  Hospital as HospitalType,
  Pharmacy as PharmacyType,
  SyncLog
} from '../types/medical';
import { User } from '../types';
import DataAccess from './DataAccess';

export default function UnifiedDashboard() {
  const { state, dispatch } = useApp();
  const { currentUser, elderlyMode, settings } = state;
  const [activeTab, setActiveTab] = useState('home');

  // Voice reader function
  const speakText = (text: string) => {
    if (settings.voiceReader && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const tabs = currentUser?.role === 'medical_staff' ? [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'medical-records', name: 'Medical Records', icon: FileText },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'settings', name: 'Settings', icon: Settings }
  ] : currentUser?.role === 'family_member' ? [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'tracking', name: 'Tracking', icon: BarChart3 },
    { id: 'medical-records', name: 'Medical Records', icon: FileText },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'data-access', name: 'Data Access', icon: Shield },
    { id: 'assistant', name: 'Health Assistant', icon: MessageCircle },
    { id: 'settings', name: 'Settings', icon: Settings }
  ] : [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'tracking', name: 'Tracking', icon: BarChart3 },
    { id: 'medical-records', name: 'Medical Records', icon: FileText },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'assistant', name: 'Health Assistant', icon: MessageCircle },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        // Use Elderly Mode Home for elderly patients
        if (elderlyMode && currentUser?.role === 'patient' && currentUser?.isElderly) {
          return <ElderlyModeHome onTabChange={setActiveTab} />;
        }
        return <HomeTab onTabChange={setActiveTab} />;
      case 'profile':
        return <ProfileTab />;
      case 'health':
        return <CombinedHealthTab elderlyMode={elderlyMode} />;
      case 'tracking':
        return <CombinedTrackingTab elderlyMode={elderlyMode} />;
      case 'medical-records':
        return <MedicalRecordsTab />;
      case 'appointments':
        // Render different appointment interfaces based on user role
        if (currentUser?.role === 'medical_staff') {
          return <MedicalStaffAppointments currentUser={currentUser} elderlyMode={elderlyMode} />;
        } else if (elderlyMode && currentUser?.role === 'patient' && currentUser?.isElderly) {
          return <ElderlyModeAppointments />;
        } else {
          return <PatientAppointments currentUser={currentUser} />;
        }
      case 'data-access':
        return <DataAccessTab currentUser={currentUser} elderlyMode={elderlyMode} />;
      case 'assistant':
        return <HealthChatbot />;
      case 'settings':
        return <SettingsTab onLogout={handleLogout} />;
      default:
        return <HomeTab onTabChange={setActiveTab} />;
    }
  };

  // Main dashboard layout
  return (
    <div className={`min-h-screen bg-gray-50 ${elderlyMode ? 'elderly-mode' : ''}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className={`font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                BridgeCare
              </h1>
              {currentUser && (
                <span className={`ml-4 text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Welcome, {currentUser.username}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors ${elderlyMode ? 'elderly' : 'text-sm'}`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  speakText(`Navigated to ${tab.name}`);
                }}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${elderlyMode ? 'elderly' : 'text-sm'}`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

// Home Tab Component
function HomeTab({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const { state } = useApp();
  const { currentUser, elderlyMode, users } = state;

  // Function to get linked patient data for family members
  const getLinkedPatientData = () => {
    if (currentUser?.role === 'family_member' && currentUser.linkedPatientId) {
      return users.find(user => user.id === currentUser.linkedPatientId);
    }
    return currentUser;
  };

  const displayUser = getLinkedPatientData();

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  // Calculate BMI for display user
  const calculateDisplayUserBMI = () => {
    if (displayUser?.weight && displayUser?.height) {
      const heightInMeters = displayUser.height / 100;
      return displayUser.weight / (heightInMeters * heightInMeters);
    }
    return null;
  };

  const displayUserBMI = calculateDisplayUserBMI();
  const bmiInfo = displayUserBMI ? getBMICategory(displayUserBMI) : null;

  // Role-based content rendering
  const renderRoleSpecificContent = () => {
    switch (currentUser?.role) {
      case 'medical_staff':
        return (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h3 className={`font-semibold text-blue-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
              Medical Staff Dashboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Total Patients</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-2">156</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Today&apos;s Appointments</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-2">23</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Pending</span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-2">8</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium">Urgent</span>
                </div>
                <p className="text-2xl font-bold text-red-600 mt-2">3</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => onTabChange('medical-records')}
                className="flex items-center justify-center space-x-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Search Patient Records</span>
              </button>
              <button 
                onClick={() => onTabChange('appointments')}
                className="flex items-center justify-center space-x-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Manage Appointments</span>
              </button>
            </div>
          </div>
        );

      case 'family_member':
        return (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 mb-6">
            <h3 className={`font-semibold text-green-900 mb-3 ${elderlyMode ? 'elderly-xl' : 'text-lg'}`}>
              Family Member Dashboard - Monitoring {displayUser?.username || 'Linked Patient'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Linked Patient</span>
                </div>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  {displayUser?.username || 'Not linked'}
                </p>
                <p className="text-sm text-gray-600">
                  {displayUser?.age ? `${displayUser.age} years old` : 'Age not set'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Recent Updates</span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-2">3</p>
              </div>
            </div>
            <div className="mt-4">
              <button 
                onClick={() => onTabChange('medical-records')}
                className="flex items-center space-x-3 p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Eye className="w-5 h-5 text-blue-600" />
                <span>View Patient Records</span>
              </button>
            </div>
          </div>
        );

      default: // patient
        return null; // Use existing medical overview for patients
    }
  };

  return (
    <div className="space-y-6">
      {/* Role-specific content */}
      {renderRoleSpecificContent()}
      
      {/* Show additional sections only for non-medical staff */}
      {currentUser?.role !== 'medical_staff' && (
        <>
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-4 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Basic Information
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">👤</div>
            <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Gender</div>
            <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
              {displayUser?.gender || 'Not set'}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">🎂</div>
            <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Age</div>
            <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
              {displayUser?.age || 'Not set'} years
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-2">⚖️</div>
            <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Weight</div>
            <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
              {displayUser?.weight || 'Not set'} kg
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">📏</div>
            <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Height</div>
            <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
              {displayUser?.height || 'Not set'} cm
            </div>
          </div>
        </div>
      </div>

          {/* Medical Overview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className={`font-bold text-gray-900 mb-4 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
              Medical Overview
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">📅</div>
                <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Upcoming Appointments</div>
                <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                  3 scheduled
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">💊</div>
                <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Active Medications</div>
                <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                  5 medications
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
                <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Family Members</div>
                <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                  4 connected
                </div>
              </div>
              {/* Transport Services card - only show for non-medical staff */}
              {currentUser?.role && (currentUser.role === 'patient' || currentUser.role === 'family_member') && (
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl mb-2">🚗</div>
                  <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Transport Services</div>
                  <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                    2 available
                  </div>
                </div>
              )}
            </div>
          </div>

      {/* Health Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-4 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Health Metrics
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayUserBMI && (
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>BMI</div>
              <div className={`text-2xl font-bold ${bmiInfo?.color} ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                {displayUserBMI.toFixed(1)}
              </div>
              <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                {bmiInfo?.category}
              </div>
            </div>
          )}
          {displayUser?.healthMetrics?.cholesterol && (
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl mb-2">🩸</div>
              <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Cholesterol</div>
              <div className={`text-2xl font-bold ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                {displayUser.healthMetrics.cholesterol}
              </div>
              <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>mg/dL</div>
            </div>
          )}
          {displayUser?.healthMetrics?.bloodPressure && (
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">💓</div>
              <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Blood Pressure</div>
              <div className={`text-2xl font-bold ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                {displayUser.healthMetrics.bloodPressure.systolic}/{displayUser.healthMetrics.bloodPressure.diastolic}
              </div>
              <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>mmHg</div>
            </div>
          )}
        </div>
      </div>

      {/* Medical Conditions */}
      {displayUser?.medicalConditions && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className={`font-bold text-gray-900 mb-4 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
            Medical Conditions
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(displayUser.medicalConditions).map(([condition, hasCondition]) => (
              <div key={condition} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${hasCondition ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className={`capitalize ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  {condition.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className={`text-xs ${hasCondition ? 'text-red-600' : 'text-green-600'}`}>
                  {hasCondition ? 'Yes' : 'No'}
                </span>
              </div>
            ))}
          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
}

// Health Tab Component
function HealthTab() {
  const { state, dispatch } = useApp();
  const { currentUser, elderlyMode } = state;
  const [healthData, setHealthData] = useState({
    weight: currentUser?.weight || 0,
    height: currentUser?.height || 0,
    cholesterol: currentUser?.healthMetrics?.cholesterol || 0,
    systolic: currentUser?.healthMetrics?.bloodPressure?.systolic || 0,
    diastolic: currentUser?.healthMetrics?.bloodPressure?.diastolic || 0,
    bloodSugar: currentUser?.healthMetrics?.bloodSugar || 0
  });

  // Calculate BMI
  const calculateBMI = () => {
    if (healthData.weight && healthData.height) {
      return (healthData.weight / Math.pow(healthData.height / 100, 2)).toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { category: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
  };

  // Get normal ranges based on age
  const getNormalRanges = () => {
    const age = currentUser?.age || 0;
    if (age < 20) return null;
    
    return {
      cholesterol: age < 40 ? '125-200' : age < 60 ? '130-220' : '130-230',
      bloodPressure: '90-120/60-80',
      bloodSugar: '70-100 (fasting)'
    };
  };

  const normalRanges = getNormalRanges();

  const handleSave = () => {
    if (!currentUser) return;

    const bmiValue = healthData.weight && healthData.height 
      ? (healthData.weight / Math.pow(healthData.height / 100, 2))
      : undefined;

    // Create new health metrics entry
    const newHealthEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: healthData.weight || undefined,
      height: healthData.height || undefined,
      bmi: bmiValue,
      cholesterol: healthData.cholesterol || undefined,
      bloodPressure: healthData.systolic && healthData.diastolic ? {
        systolic: healthData.systolic,
        diastolic: healthData.diastolic
      } : undefined,
      bloodSugar: healthData.bloodSugar || undefined
    };

    const updatedUser = {
      ...currentUser,
      weight: healthData.weight,
      height: healthData.height,
      bmi: bmiValue,
      healthMetrics: {
        cholesterol: healthData.cholesterol || undefined,
        bloodPressure: healthData.systolic && healthData.diastolic ? {
          systolic: healthData.systolic,
          diastolic: healthData.diastolic
        } : undefined,
        bloodSugar: healthData.bloodSugar || undefined
      },
      healthMetricsHistory: [...(currentUser.healthMetricsHistory || []), newHealthEntry],
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
  };

  const exportHealthData = () => {
    const healthHistory = currentUser?.healthMetricsHistory || [];
    if (healthHistory.length === 0) {
      alert('No health data to export');
      return;
    }

    const csvData = [
      ['Date', 'Weight (kg)', 'Height (cm)', 'BMI', 'Cholesterol (mg/dL)', 'Blood Pressure (Systolic)', 'Blood Pressure (Diastolic)', 'Blood Sugar (mg/dL)'],
      ...healthHistory.map(entry => [
        entry.date,
        entry.weight || '',
        entry.height || '',
        entry.bmi || '',
        entry.cholesterol || '',
        entry.bloodPressure?.systolic || '',
        entry.bloodPressure?.diastolic || '',
        entry.bloodSugar || ''
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health_metrics_${currentUser?.username}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // For medical staff, show a simplified view
  if (currentUser?.role === 'medical_staff') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
            Medical Staff Health Overview
          </h2>
          
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Health Management</h3>
            <p className="text-gray-600">
              As medical staff, you can access patient health information through the Medical Records tab.
            </p>
            <p className="text-gray-600 mt-2">
              Use the IC search feature to view patient health metrics and medical history.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Update Health Information
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Measurements */}
          <div className="space-y-4">
            <h3 className={`font-semibold text-gray-800 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
              Basic Measurements
            </h3>
            
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Weight (kg)
              </label>
              <input
                type="number"
                min="20"
                max="300"
                step="0.1"
                value={healthData.weight || ''}
                onChange={(e) => setHealthData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
              />
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Height (cm)
              </label>
              <input
                type="number"
                min="100"
                max="250"
                value={healthData.height || ''}
                onChange={(e) => setHealthData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
              />
            </div>

            {/* BMI Display */}
            {bmi && (
              <div className={`p-4 rounded-lg ${getBMICategory(parseFloat(bmi)).bg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${elderlyMode ? 'elderly' : 'text-base'}`}>BMI Calculation</h4>
                    <p className={`text-2xl font-bold ${getBMICategory(parseFloat(bmi)).color} ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                      {bmi}
                    </p>
                    <p className={`${getBMICategory(parseFloat(bmi)).color} ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                      {getBMICategory(parseFloat(bmi)).category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                      Normal: 18.5-24.9
                    </p>
                    <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                      Overweight: 25-29.9
                    </p>
                    <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                      Obese: ≥30
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Health Metrics (for users over 20) */}
          {currentUser?.age && currentUser.age > 20 && (
            <div className="space-y-4">
              <h3 className={`font-semibold text-gray-800 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
                Health Metrics
              </h3>
              
              <div>
                <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Cholesterol Level (mg/dL)
                </label>
                <input
                  type="number"
                  min="100"
                  max="400"
                  value={healthData.cholesterol || ''}
                  onChange={(e) => setHealthData(prev => ({ ...prev, cholesterol: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    elderlyMode ? 'elderly' : 'text-base'
                  }`}
                />
                {normalRanges && (
                  <p className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'} mt-1`}>
                    Normal range for your age: {normalRanges.cholesterol} mg/dL
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                    Systolic BP
                  </label>
                  <input
                    type="number"
                    min="70"
                    max="200"
                    value={healthData.systolic || ''}
                    onChange={(e) => setHealthData(prev => ({ ...prev, systolic: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      elderlyMode ? 'elderly' : 'text-base'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                    Diastolic BP
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="130"
                    value={healthData.diastolic || ''}
                    onChange={(e) => setHealthData(prev => ({ ...prev, diastolic: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      elderlyMode ? 'elderly' : 'text-base'
                    }`}
                  />
                </div>
              </div>
              {normalRanges && (
                <p className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                  Normal range: {normalRanges.bloodPressure} mmHg
                </p>
              )}

              <div>
                <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Blood Sugar (mg/dL)
                </label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={healthData.bloodSugar || ''}
                  onChange={(e) => setHealthData(prev => ({ ...prev, bloodSugar: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    elderlyMode ? 'elderly' : 'text-base'
                  }`}
                />
                {normalRanges && (
                  <p className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'} mt-1`}>
                    Normal range: {normalRanges.bloodSugar} mg/dL
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={exportHealthData}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Export Health Data
          </button>
        </div>
      </div>

      {/* Health Metrics History */}
      {currentUser?.healthMetricsHistory && currentUser.healthMetricsHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
            Health Metrics History
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                    Date
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                    Weight (kg)
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                    Height (cm)
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                    BMI
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                    Cholesterol
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                    Blood Pressure
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                    Blood Sugar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUser.healthMetricsHistory.slice(-10).reverse().map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                      {entry.weight || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                      {entry.height || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                      {entry.bmi ? entry.bmi.toFixed(1) : '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                      {entry.cholesterol || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                      {entry.bloodPressure ? `${entry.bloodPressure.systolic}/${entry.bloodPressure.diastolic}` : '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                      {entry.bloodSugar || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Showing last 10 entries. Use &quot;Export Health Data&quot; to download complete history.
            </p>
          </div>
        </div>
      )}

      {/* Menstruation Tracking (for females) */}
      {currentUser?.gender === 'female' && state.settings.menstruationTracking && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className={`font-bold text-gray-900 mb-4 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
            Menstruation Tracking
          </h2>
          
          <MenstruationTracker elderlyMode={elderlyMode} />
        </div>
      )}
    </div>
  );
}

// Enhanced Menstruation Tracker Component
function MenstruationTracker({ elderlyMode }: { elderlyMode: boolean }) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [activeTab, setActiveTab] = useState<'log' | 'calendar' | 'insights' | 'settings'>('log');
  const [notifications, setNotifications] = useState({
    periodReminder: true,
    fertilityReminder: true,
    symptomCheckin: true
  });

  const availableSymptoms = [
    'Cramps', 'Bloating', 'Fatigue', 'Mood swings', 
    'Headache', 'Back pain', 'Breast tenderness', 'Acne',
    'Food cravings', 'Insomnia', 'Anxiety', 'Depression',
    'Hot flashes', 'Night sweats', 'Breast swelling'
  ];

  // Calculate cycle statistics
  const calculateCycleStats = () => {
    const periods = currentUser?.menstruationData || [];
    if (periods.length < 2) return { avgCycle: 28, avgDuration: 5, lastPeriod: null };

    const sortedPeriods = periods.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const cycles: number[] = [];
    const durations: number[] = [];

    for (let i = 1; i < sortedPeriods.length; i++) {
      const cycleLength = Math.round((new Date(sortedPeriods[i].date).getTime() - new Date(sortedPeriods[i-1].date).getTime()) / (1000 * 60 * 60 * 24));
      cycles.push(cycleLength);
    }

    // Calculate average duration (assuming 5 days if not specified)
    periods.forEach((period: any) => {
      if (period.endDate) {
        const duration = Math.round((new Date(period.endDate).getTime() - new Date(period.date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        durations.push(duration);
      } else {
        durations.push(5); // Default duration
      }
    });

    const avgCycle = Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length);
    const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);

    return {
      avgCycle,
      avgDuration,
      lastPeriod: sortedPeriods[sortedPeriods.length - 1]
    };
  };

  const { avgCycle, avgDuration, lastPeriod } = calculateCycleStats();

  // Predict next period and ovulation
  const predictNextPeriod = () => {
    if (!lastPeriod) return null;
    const lastPeriodDate = new Date(lastPeriod.date);
    const nextPeriodDate = new Date(lastPeriodDate.getTime() + (avgCycle * 24 * 60 * 60 * 1000));
    return nextPeriodDate;
  };

  const predictOvulation = () => {
    const nextPeriod = predictNextPeriod();
    if (!nextPeriod) return null;
    // Ovulation typically occurs 14 days before next period
    const ovulationDate = new Date(nextPeriod.getTime() - (14 * 24 * 60 * 60 * 1000));
    return ovulationDate;
  };

  const nextPeriod = predictNextPeriod();
  const ovulationDate = predictOvulation();

  // Calculate fertility window (5 days before ovulation + ovulation day + 1 day after)
  const getFertilityWindow = () => {
    if (!ovulationDate) return null;
    const start = new Date(ovulationDate.getTime() - (5 * 24 * 60 * 60 * 1000));
    const end = new Date(ovulationDate.getTime() + (24 * 60 * 60 * 1000));
    return { start, end };
  };

  const fertilityWindow = getFertilityWindow();

  const handleLogPeriod = () => {
    if (!currentUser) return;

    const periodEntry = {
      date: selectedDate,
      endDate: endDate || undefined,
      flow,
      symptoms,
      createdAt: new Date().toISOString()
    };

    const updatedUser = {
      ...currentUser,
      menstruationData: [...(currentUser.menstruationData || []), periodEntry],
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    
    // Reset form
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setSymptoms([]);
    setFlow('medium');
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const recentPeriods = currentUser?.menstruationData?.slice(-5).reverse() || [];

  // Generate calendar data for current month
  const generateCalendarData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const calendar = [];
    const periods = currentUser?.menstruationData || [];

    for (let i = 0; i < startDay; i++) {
      calendar.push({ day: '', type: 'empty' });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const period = periods.find((p: any) => p.date === dateStr);
      
      let type = 'normal';
      if (period) {
        type = 'period';
      } else if (ovulationDate && date.toDateString() === ovulationDate.toDateString()) {
        type = 'ovulation';
      } else if (fertilityWindow && date >= fertilityWindow.start && date <= fertilityWindow.end) {
        type = 'fertile';
      } else if (nextPeriod && date.toDateString() === nextPeriod.toDateString()) {
        type = 'predicted';
      }

      calendar.push({ day, type, date: dateStr });
    }

    return calendar;
  };

  const calendarData = generateCalendarData();

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'log', label: 'Log Period', icon: '📝' },
            { id: 'calendar', label: 'Calendar', icon: '📅' },
            { id: 'insights', label: 'Insights', icon: '📊' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log Period Tab */}
      {activeTab === 'log' && (
        <div className="bg-pink-50 rounded-lg p-6">
          <h3 className={`font-semibold text-gray-800 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
            Log Period
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Start Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
              />
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Flow Intensity
              </label>
              <select
                value={flow}
                onChange={(e) => setFlow(e.target.value as 'light' | 'medium' | 'heavy')}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Symptoms
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableSymptoms.map(symptom => (
                <label key={symptom} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <span className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogPeriod}
            className="mt-4 bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
          >
            Log Period
          </button>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className={`font-semibold text-gray-800 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
            Cycle Calendar
          </h3>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-pink-400 rounded"></div>
                <span>Period</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-400 rounded"></div>
                <span>Ovulation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>Fertile Window</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                <span>Predicted Period</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={`p-2 text-center font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                {day}
              </div>
            ))}
            
            {calendarData.map((item, index) => (
              <div
                key={index}
                className={`p-2 text-center border rounded ${
                  item.type === 'empty' ? 'bg-gray-50' :
                  item.type === 'period' ? 'bg-pink-400 text-white' :
                  item.type === 'ovulation' ? 'bg-purple-400 text-white' :
                  item.type === 'fertile' ? 'bg-green-400 text-white' :
                  item.type === 'predicted' ? 'bg-orange-400 text-white' :
                  'bg-white'
                } ${elderlyMode ? 'elderly' : 'text-sm'}`}
              >
                {item.day}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Cycle Statistics */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className={`font-semibold text-gray-800 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
              Cycle Statistics
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className={`text-2xl font-bold text-blue-600 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                  {recentPeriods.length}
                </p>
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Periods Logged
                </p>
              </div>
              <div>
                <p className={`text-2xl font-bold text-blue-600 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                  {avgCycle}
                </p>
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Average Cycle (days)
                </p>
              </div>
              <div>
                <p className={`text-2xl font-bold text-blue-600 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                  {avgDuration}
                </p>
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Average Duration (days)
                </p>
              </div>
            </div>
          </div>

          {/* Predictions */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className={`font-semibold text-gray-800 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
              Predictions & Fertility
            </h3>
            <div className="space-y-4">
              {nextPeriod && (
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Next Period</p>
                    <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                      {nextPeriod.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-green-600 font-medium">
                    {Math.ceil((nextPeriod.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              )}
              
              {ovulationDate && (
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Ovulation</p>
                    <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                      {ovulationDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-purple-600 font-medium">
                    {Math.ceil((ovulationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              )}

              {fertilityWindow && (
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>Fertile Window</p>
                    <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                      {fertilityWindow.start.toLocaleDateString()} - {fertilityWindow.end.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-green-600 font-medium">
                    {Math.ceil((fertilityWindow.start.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Periods */}
          {recentPeriods.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className={`font-semibold text-gray-800 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
                Recent Periods
              </h3>
              
              <div className="space-y-3">
                {recentPeriods.map((period: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                        {new Date(period.date).toLocaleDateString()}
                        {period.endDate && ` - ${new Date(period.endDate).toLocaleDateString()}`}
                      </p>
                      <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                        Flow: {period.flow.charAt(0).toUpperCase() + period.flow.slice(1)}
                      </p>
                      {period.symptoms.length > 0 && (
                        <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                          Symptoms: {period.symptoms.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className={`font-semibold text-gray-800 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
            Notification Settings
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.periodReminder}
                onChange={(e) => setNotifications(prev => ({ ...prev, periodReminder: e.target.checked }))}
                className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <span className={`${elderlyMode ? 'elderly' : 'text-base'}`}>Period Reminders</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.fertilityReminder}
                onChange={(e) => setNotifications(prev => ({ ...prev, fertilityReminder: e.target.checked }))}
                className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <span className={`${elderlyMode ? 'elderly' : 'text-base'}`}>Fertility Window Reminders</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.symptomCheckin}
                onChange={(e) => setNotifications(prev => ({ ...prev, symptomCheckin: e.target.checked }))}
                className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <span className={`${elderlyMode ? 'elderly' : 'text-base'}`}>Daily Symptom Check-in</span>
            </label>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className={`font-medium text-gray-800 mb-3 ${elderlyMode ? 'elderly' : 'text-base'}`}>
              Data Export
            </h4>
            <button
                             onClick={() => {
                 const data = {
                   user: currentUser?.username,
                   periods: currentUser?.menstruationData,
                   statistics: { avgCycle, avgDuration },
                   exportDate: new Date().toISOString()
                 };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `menstruation-data-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Export Data (JSON)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Tracking Tab Component
function TrackingTab() {
  const { state } = useApp();
  const { elderlyMode, currentUser } = state;

  // Get age-appropriate consumption guidelines
  const getAgeGuidelines = () => {
    const age = currentUser?.age || 25;
    const weight = currentUser?.weight || 70;
    const gender = currentUser?.gender || 'female';

    // Calculate BMR using Mifflin-St Jeor Equation
    const bmr = gender === 'male' 
      ? (10 * weight) + (6.25 * (currentUser?.height || 170)) - (5 * age) + 5
      : (10 * weight) + (6.25 * (currentUser?.height || 170)) - (5 * age) - 161;

    // Daily calorie needs (BMR * activity factor 1.2 for sedentary)
    const dailyCalories = Math.round(bmr * 1.2);
    
    // Water intake based on age and weight
    let waterIntake = 0;
    if (age < 30) {
      waterIntake = Math.round(weight * 35); // 35ml per kg for young adults
    } else if (age < 55) {
      waterIntake = Math.round(weight * 30); // 30ml per kg for middle-aged
    } else {
      waterIntake = Math.round(weight * 25); // 25ml per kg for elderly
    }

    // Activity recommendations
    let activityMinutes = 0;
    if (age < 18) {
      activityMinutes = 60; // 60 minutes for children/teens
    } else if (age < 65) {
      activityMinutes = 150; // 150 minutes moderate or 75 minutes vigorous
    } else {
      activityMinutes = 150; // Same for elderly but with modifications
    }

    return {
      dailyCalories,
      waterIntake,
      activityMinutes,
      bmr: Math.round(bmr)
    };
  };

  const guidelines = getAgeGuidelines();

  // Calculate today's totals - sum all entries for today
  const today = new Date().toISOString().split('T')[0];
  const todayCalories = currentUser?.tracking?.calories?.filter(entry => entry.date === today)
    .reduce((total, entry) => total + entry.consumed, 0) || 0;
  const todayWater = currentUser?.tracking?.water?.filter(entry => entry.date === today)
    .reduce((total, entry) => total + entry.amount, 0) || 0;
  const todayBurned = currentUser?.tracking?.exercise?.filter(entry => entry.date === today)
    .reduce((total, entry) => total + entry.calories, 0) || 0;

  // Calculate water progress percentage
  const waterProgress = Math.min((todayWater / guidelines.waterIntake) * 100, 100);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Health Tracking Overview
        </h2>
        
        {/* Age Guidelines */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
          <h3 className={`font-semibold text-gray-800 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
            Daily Recommendations for Your Age ({currentUser?.age || 25} years)
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{guidelines.dailyCalories}</div>
              <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Daily Calories</div>
              <div className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                Based on your BMR: {guidelines.bmr}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{guidelines.waterIntake}ml</div>
              <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Water Intake</div>
              <div className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                {Math.round(guidelines.waterIntake / 1000 * 10) / 10}L per day
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{guidelines.activityMinutes}min</div>
              <div className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Activity Goal</div>
              <div className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                Moderate exercise
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Activity Tracking */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className={`font-bold text-gray-900 mb-2 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
              Activity Tracking
            </h3>
            <p className={`text-gray-600 mb-4 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Track your exercise and physical activities
            </p>
            <div className="text-2xl font-bold text-blue-600">
              {currentUser?.tracking?.exercise?.length || 0}
            </div>
            <p className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
              Activities logged
            </p>
            <div className="mt-2">
              <div className={`text-lg font-semibold text-blue-700 ${elderlyMode ? 'elderly' : 'text-base'}`}>
                Today: {todayBurned} cal
              </div>
            </div>
          </div>

          {/* Nutrition Tracking */}
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className={`font-bold text-gray-900 mb-2 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
              Nutrition Tracking
            </h3>
            <p className={`text-gray-600 mb-4 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Monitor your calorie intake
            </p>
            <div className="text-2xl font-bold text-green-600">
              {currentUser?.tracking?.calories?.length || 0}
            </div>
            <p className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
              Nutrition entries
            </p>
            <div className="mt-2">
              <div className={`text-lg font-semibold text-green-700 ${elderlyMode ? 'elderly' : 'text-base'}`}>
                Today: {todayCalories} cal
              </div>
              <div className={`text-sm text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                Goal: {guidelines.dailyCalories} cal
              </div>
            </div>
          </div>

          {/* Water Tracking */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className={`font-bold text-gray-900 mb-2 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
              Water Tracking
            </h3>
            <p className={`text-gray-600 mb-4 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Track your daily water consumption
            </p>
            <div className="text-2xl font-bold text-blue-600">
              {currentUser?.tracking?.water?.length || 0}
            </div>
            <p className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
              Water entries
            </p>
            
            {/* Visual Hydration Tracker */}
            <div className="mt-4">
              <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${waterProgress}%` }}
                ></div>
              </div>
              <div className="mt-2">
                <div className={`text-lg font-semibold text-blue-700 ${elderlyMode ? 'elderly' : 'text-base'}`}>
                  {todayWater}ml / {guidelines.waterIntake}ml
                </div>
                <div className={`text-sm text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                  {Math.round(waterProgress)}% of daily goal
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-base'}`}>
            Use the dedicated tabs above to add new entries and view detailed tracking data.
          </p>
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab({ onLogout }: { onLogout: () => void }) {
  const { state, dispatch } = useApp();
  const { settings, elderlyMode } = state;
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
    
    // Apply real accessibility changes
    if (key === 'elderlyMode') {
      dispatch({ type: 'SET_ELDERLY_MODE', payload: value });
    }
    
    if (key === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    if (key === 'dyslexiaFriendly') {
      if (value) {
        document.documentElement.classList.add('dyslexia-friendly');
      } else {
        document.documentElement.classList.remove('dyslexia-friendly');
      }
    }
    
    if (key === 'fontSize') {
      document.documentElement.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
      document.documentElement.classList.add(`font-${value}`);
    }
    
    if (key === 'extraLargeTextMode') {
      if (value) {
        document.documentElement.classList.add('extra-large-text');
      } else {
        document.documentElement.classList.remove('extra-large-text');
      }
    }
    
    if (key === 'voiceReader') {
      if (value) {
        // Initialize voice reader
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('Voice reader activated');
          speechSynthesis.speak(utterance);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Accessibility Settings
        </h2>
        
        <div className="space-y-6">
          {/* Elderly Mode */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.elderlyMode}
                onChange={(e) => handleSettingChange('elderlyMode', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className={`font-semibold ${elderlyMode ? 'elderly' : 'text-base'}`}>
                  Elderly Mode (Larger Text)
                </span>
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'} mt-1`}>
                  Increases font size and spacing for better readability
                </p>
              </div>
            </label>
          </div>

          {/* Dyslexia-Friendly Font */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dyslexiaFriendly}
                onChange={(e) => handleSettingChange('dyslexiaFriendly', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className={`font-semibold ${elderlyMode ? 'elderly' : 'text-base'}`}>
                  Dyslexia-Friendly Font
                </span>
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'} mt-1`}>
                  Uses specialized fonts and spacing to improve reading for users with dyslexia
                </p>
              </div>
            </label>
          </div>

          {/* Dark Mode */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className={`font-semibold ${elderlyMode ? 'elderly' : 'text-base'}`}>
                  Dark Mode
                </span>
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'} mt-1`}>
                  Reduces eye strain with dark background and light text
                </p>
              </div>
            </label>
          </div>

          {/* Voice Reader */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.voiceReader}
                onChange={(e) => handleSettingChange('voiceReader', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className={`font-semibold ${elderlyMode ? 'elderly' : 'text-base'}`}>
                  Voice Reader
                </span>
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'} mt-1`}>
                  Enables text-to-speech functionality for screen content
                </p>
              </div>
            </label>
          </div>

          {/* Extra Large Text Mode */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.extraLargeTextMode}
                onChange={(e) => handleSettingChange('extraLargeTextMode', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <span className={`font-semibold ${elderlyMode ? 'elderly' : 'text-base'}`}>
                  Extra Large Text Mode
                </span>
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'} mt-1`}>
                  Maximum font size for enhanced readability
                </p>
              </div>
            </label>
          </div>

          {/* Menstruation Tracking - Only show for female users */}
          {state.currentUser?.gender === 'female' && (
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.menstruationTracking}
                  onChange={(e) => handleSettingChange('menstruationTracking', e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <span className={`font-semibold ${elderlyMode ? 'elderly' : 'text-base'}`}>
                    Menstruation Tracking
                  </span>
                  <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'} mt-1`}>
                    Enable period tracking, cycle predictions, and fertility insights
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Font Size
        </h2>
        
        <div className="space-y-4">
          {['small', 'medium', 'large', 'extra-large'].map((size) => (
            <label key={size} className="flex items-center space-x-3 cursor-pointer border border-gray-200 rounded-lg p-4">
              <input
                type="radio"
                name="fontSize"
                value={size}
                checked={settings.fontSize === size}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div>
                <span className={`capitalize font-semibold ${elderlyMode ? 'elderly' : 'text-base'}`}>
                  {size}
                </span>
                <p 
                  className={`text-gray-600 mt-1 ${
                    size === 'small' ? 'text-sm' : 
                    size === 'medium' ? 'text-base' : 
                    size === 'large' ? 'text-lg' : 'text-xl'
                  }`}
                >
                  This is how {size} text will look in the application.
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Account
        </h2>
        
        <div className="space-y-4">
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className={elderlyMode ? 'elderly' : 'text-base'}>Logout</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          App Information
        </h2>
        
        <div className="space-y-2">
          <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
            <strong>Version:</strong> 1.0.0
          </p>
          <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
            <strong>Last Updated:</strong> {currentDate || 'Loading...'}
          </p>
          <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
            <strong>Support:</strong> support@medicaltracker.com
          </p>
        </div>
      </div>
    </div>
  );
}

// Profile Tab Component
function ProfileTab() {
  const { state, dispatch } = useApp();
  const { currentUser, elderlyMode } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    gender: currentUser?.gender || '',
    age: currentUser?.age || '',
    weight: currentUser?.weight || '',
    height: currentUser?.height || ''
  });

  const handleSave = () => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      username: profileData.username,
      email: profileData.email,
      gender: profileData.gender as 'male' | 'female',
      age: Number(profileData.age),
      weight: Number(profileData.weight),
      height: Number(profileData.height),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    setIsEditing(false);
  };


  if (currentUser?.role === 'medical_staff') {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
              Staff Profile Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Username
              </label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className="input-field"
              />
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Organization
              </label>
              <input
                type="text"
                value={currentUser?.organization || ''}
                disabled
                className="input-field bg-gray-100"
              />
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Staff ID
              </label>
              <input
                type="text"
                value={currentUser?.staffId || ''}
                disabled
                className="input-field bg-gray-100"
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
            Profile Information
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Username
            </label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              disabled={!isEditing}
              className="input-field"
            />
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled={!isEditing}
              className="input-field"
            />
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Gender
            </label>
            <select
              value={profileData.gender}
              onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
              disabled={!isEditing}
              className="input-field"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Age
            </label>
            <input
              type="number"
              value={profileData.age}
              onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
              disabled={!isEditing}
              className="input-field"
            />
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Weight (kg)
            </label>
            <input
              type="number"
              value={profileData.weight}
              onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
              disabled={!isEditing}
              className="input-field"
            />
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Height (cm)
            </label>
            <input
              type="number"
              value={profileData.height}
              onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
              disabled={!isEditing}
              className="input-field"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Nutrition Tab Component
function NutritionTab() {
  const { state, dispatch } = useApp();
  const { currentUser, elderlyMode } = state;
  const [nutritionData, setNutritionData] = useState({
    foodItems: '',
    date: new Date().toISOString().split('T')[0],
    mealType: 'snack' as 'breakfast' | 'lunch' | 'dinner' | 'snack'
  });
  const [nutritionResult, setNutritionResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Import the calorie API service
  const { CalorieApiService } = require('../services/calorieApi');

  // Calculate detailed nutrition information
  const calculateNutrition = async (foodText: string) => {
    if (!foodText.trim()) return;
    
    setIsCalculating(true);
    try {
      const foodItems = foodText.toLowerCase().split(',').map(food => food.trim());
      const result = await CalorieApiService.calculateNutrition({
        foodItems,
        mealType: nutritionData.mealType
      });
      setNutritionResult(result);
    } catch (error) {
      console.error('Error calculating nutrition:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAddNutrition = async () => {
    if (!currentUser || !nutritionData.foodItems) return;

    const foodItems = nutritionData.foodItems.toLowerCase().split(',').map(food => food.trim());
    const result = await CalorieApiService.calculateNutrition({
      foodItems,
      mealType: nutritionData.mealType
    });

    const newNutritionEntry = {
      date: nutritionData.date,
      consumed: result.totalCalories,
      burned: 0,
      foodItems: nutritionData.foodItems,
      mealType: nutritionData.mealType,
      nutritionDetails: result
    };

    const updatedUser = {
      ...currentUser,
      tracking: {
        calories: [...(currentUser.tracking?.calories || []), newNutritionEntry],
        water: currentUser.tracking?.water || [],
        exercise: currentUser.tracking?.exercise || []
      },
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    setNutritionData({ foodItems: '', date: new Date().toISOString().split('T')[0], mealType: 'snack' });
    setNutritionResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Nutrition Tracking
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Date
            </label>
            <input
              type="date"
              value={nutritionData.date}
              onChange={(e) => setNutritionData({ ...nutritionData, date: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Meal Type
            </label>
            <select
              value={nutritionData.mealType}
              onChange={(e) => setNutritionData({ ...nutritionData, mealType: e.target.value as any })}
              className="input-field"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Food Items (comma-separated)
            </label>
            <input
              type="text"
              value={nutritionData.foodItems}
              onChange={(e) => {
                setNutritionData({ ...nutritionData, foodItems: e.target.value });
                if (e.target.value.trim()) {
                  calculateNutrition(e.target.value);
                }
              }}
              placeholder="e.g., apple, chicken breast, rice"
              className="input-field"
            />
            <p className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'} mt-1`}>
              Available: apple, banana, chicken breast, salmon, rice, broccoli, milk, eggs, bread, cheese
            </p>
          </div>
        </div>

        {/* Nutrition Results Display */}
        {isCalculating && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600">Calculating nutrition information...</p>
          </div>
        )}

        {nutritionResult && (
          <div className="mt-6 bg-green-50 rounded-lg p-6">
            <h3 className={`font-bold text-green-800 mb-4 ${elderlyMode ? 'elderly-xl' : 'text-lg'}`}>
              Nutrition Analysis for {nutritionData.mealType}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className={`font-bold text-green-600 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                  {nutritionResult.totalCalories}
                </div>
                <div className={`text-green-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Calories</div>
              </div>
              <div className="text-center">
                <div className={`font-bold text-blue-600 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                  {nutritionResult.totalProtein}g
                </div>
                <div className={`text-blue-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Protein</div>
              </div>
              <div className="text-center">
                <div className={`font-bold text-orange-600 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                  {nutritionResult.totalCarbs}g
                </div>
                <div className={`text-orange-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Carbs</div>
              </div>
              <div className="text-center">
                <div className={`font-bold text-red-600 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
                  {nutritionResult.totalFat}g
                </div>
                <div className={`text-red-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Fat</div>
              </div>
            </div>

            {nutritionResult.recommendations && nutritionResult.recommendations.length > 0 && (
              <div className="mt-4">
                <h4 className={`font-semibold text-green-800 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Recommendations:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {nutritionResult.recommendations.map((rec: string, index: number) => (
                    <li key={index} className={`text-green-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleAddNutrition}
            disabled={!nutritionData.foodItems.trim() || isCalculating}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculating ? 'Calculating...' : 'Add Nutrition Entry'}
          </button>
        </div>
      </div>

      {/* Nutrition History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className={`font-bold text-gray-900 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
          Recent Nutrition History
        </h3>
        
        <div className="space-y-4">
          {currentUser?.tracking?.calories?.slice(-5).reverse().map((entry, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  {(entry as any).mealType && (
                    <p className={`text-blue-600 ${elderlyMode ? 'elderly' : 'text-xs'} capitalize`}>
                      {(entry as any).mealType}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`font-bold text-green-600 ${elderlyMode ? 'elderly' : 'text-lg'}`}>
                    {entry.consumed} cal
                  </p>
                </div>
              </div>
              
              {(entry as any).foodItems && (
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'} mb-2`}>
                  <span className="font-medium">Food:</span> {(entry as any).foodItems}
                </p>
              )}
              
              {(entry as any).nutritionDetails && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <span className="text-blue-600 font-medium">{(entry as any).nutritionDetails.totalProtein}g</span>
                    <div className="text-gray-500">Protein</div>
                  </div>
                  <div className="text-center">
                    <span className="text-orange-600 font-medium">{(entry as any).nutritionDetails.totalCarbs}g</span>
                    <div className="text-gray-500">Carbs</div>
                  </div>
                  <div className="text-center">
                    <span className="text-red-600 font-medium">{(entry as any).nutritionDetails.totalFat}g</span>
                    <div className="text-gray-500">Fat</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Water Tab Component
function WaterTab() {
  const { state, dispatch } = useApp();
  const { currentUser, elderlyMode } = state;
  const [waterData, setWaterData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const getAgeGuidelines = () => {
    const age = currentUser?.age || 25;
    const weight = currentUser?.weight || 70;
    
    let waterIntake = 0;
    if (age < 30) {
      waterIntake = Math.round(weight * 35);
    } else if (age < 55) {
      waterIntake = Math.round(weight * 30);
    } else {
      waterIntake = Math.round(weight * 25);
    }
    
    return { waterIntake };
  };

  const handleAddWater = () => {
    if (!currentUser || !waterData.amount) return;

    const newWaterEntry = {
      date: waterData.date,
      amount: Number(waterData.amount)
    };

    const updatedUser = {
      ...currentUser,
      tracking: {
        calories: currentUser.tracking?.calories || [],
        water: [...(currentUser.tracking?.water || []), newWaterEntry],
        exercise: currentUser.tracking?.exercise || []
      },
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    setWaterData({ amount: '', date: new Date().toISOString().split('T')[0] });
  };

  const guidelines = getAgeGuidelines();
  const today = new Date().toISOString().split('T')[0];
  const todayWater = currentUser?.tracking?.water?.find(entry => entry.date === today)?.amount || 0;
  const waterProgress = Math.min((todayWater / guidelines.waterIntake) * 100, 100);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Water Tracking
        </h2>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Date
            </label>
            <input
              type="date"
              value={waterData.date}
              onChange={(e) => setWaterData({ ...waterData, date: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Water Intake (ml)
            </label>
            <input
              type="number"
              value={waterData.amount}
              onChange={(e) => setWaterData({ ...waterData, amount: e.target.value })}
              placeholder="Enter water intake"
              className="input-field"
            />
            <p className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'} mt-1`}>
              Daily goal: {guidelines.waterIntake}ml
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleAddWater}
            disabled={!waterData.amount}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Water Entry
          </button>
        </div>
      </div>

      {/* Water History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className={`font-bold text-gray-900 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
          Recent Water History
        </h3>
        
        <div className="space-y-4">
          {currentUser?.tracking?.water?.slice(-5).reverse().map((entry, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  {new Date(entry.date).toLocaleDateString()}
                </p>
                <p className={`text-blue-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                  Water: {entry.amount}ml
                </p>
              </div>
              <div className="text-right">
                <div className={`text-gray-500 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                  {Math.round((entry.amount / guidelines.waterIntake) * 100)}% of daily goal
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Activity Tab Component
function ActivityTab() {
  const { state, dispatch } = useApp();
  const { currentUser, elderlyMode } = state;
  const [activityData, setActivityData] = useState({
    type: '',
    duration: '',
    date: new Date().toISOString().split('T')[0]
  });

  const activityTypes = [
    'Walking', 'Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Dancing', 'Other'
  ];

  // Activity MET values (Metabolic Equivalent of Task)
  const activityMETs = {
    'Walking': 3.5,
    'Running': 8.0,
    'Cycling': 6.0,
    'Swimming': 5.5,
    'Gym': 4.5,
    'Yoga': 2.5,
    'Dancing': 4.0,
    'Other': 3.0
  };

  // Calculate calories burned based on activity type, duration, age, and weight
  const calculateCaloriesBurned = (activityType: string, durationMinutes: number) => {
    const age = currentUser?.age || 25;
    const weight = currentUser?.weight || 70;
    const met = activityMETs[activityType as keyof typeof activityMETs] || 3.0;
    
    // Calorie calculation: (MET × weight in kg × duration in hours)
    const durationHours = durationMinutes / 60;
    const caloriesBurned = Math.round(met * weight * durationHours);
    
    return caloriesBurned;
  };

  const handleAddActivity = () => {
    if (!currentUser || !activityData.type || !activityData.duration) return;

    const calculatedCalories = calculateCaloriesBurned(activityData.type, Number(activityData.duration));

    const newActivityEntry = {
      date: activityData.date,
      type: activityData.type,
      duration: Number(activityData.duration),
      calories: calculatedCalories
    };

    const updatedUser = {
      ...currentUser,
      tracking: {
        exercise: [...(currentUser.tracking?.exercise || []), newActivityEntry],
        calories: currentUser.tracking?.calories || [],
        water: currentUser.tracking?.water || []
      },
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    setActivityData({ type: '', duration: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className={`font-bold text-gray-900 mb-6 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Activity Tracking
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Date
            </label>
            <input
              type="date"
              value={activityData.date}
              onChange={(e) => setActivityData({ ...activityData, date: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Activity Type
            </label>
            <select
              value={activityData.type}
              onChange={(e) => setActivityData({ ...activityData, type: e.target.value })}
              className="input-field"
            >
              <option value="">Select Activity</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              Duration (minutes)
            </label>
            <input
              type="number"
              value={activityData.duration}
              onChange={(e) => setActivityData({ ...activityData, duration: e.target.value })}
              placeholder="Enter duration"
              className="input-field"
            />
            {activityData.type && activityData.duration && (
              <p className={`text-blue-600 ${elderlyMode ? 'elderly' : 'text-sm'} mt-1`}>
                Estimated calories burned: {calculateCaloriesBurned(activityData.type, Number(activityData.duration))}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleAddActivity}
            disabled={!activityData.type || !activityData.duration}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Activity Entry
          </button>
        </div>
      </div>

      {/* Activity History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className={`font-bold text-gray-900 mb-4 ${elderlyMode ? 'elderly-lg' : 'text-lg'}`}>
          Recent Activity History
        </h3>
        
        <div className="space-y-4">
          {currentUser?.tracking?.exercise?.slice(-5).reverse().map((entry, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  {entry.type} - {new Date(entry.date).toLocaleDateString()}
                </p>
                <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>
                  Duration: {entry.duration} min | Calories: {entry.calories}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Medical Records Tab Component
function MedicalRecordsTab() {
  const { state } = useApp();
  const { elderlyMode, currentUser } = state;
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showConnectHospitalModal, setShowConnectHospitalModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [icNumber, setIcNumber] = useState('');
  const [searchedPatient, setSearchedPatient] = useState<any>(null);
  const [newRecord, setNewRecord] = useState({
    visitType: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: ''
  });

  useEffect(() => {
    loadMedicalData();
  }, []);

  const loadMedicalData = async () => {
    setLoading(true);
    try {
      // Mock data - for medical staff, this will be populated after IC search
      const mockMedicalRecords: MedicalRecord[] = currentUser?.role === 'medical_staff' ? [] : [
        {
          id: 'mr1',
          patientId: currentUser?.id || '1',
          hospitalId: 'h1',
          doctorId: 'd1',
          visitDate: new Date('2024-01-10'),
          visitType: 'checkup',
          diagnosis: 'Type 2 Diabetes - Well controlled',
          symptoms: ['None reported'],
          treatment: 'Continue current medication regimen',
          prescriptions: [],
          labResults: [],
          notes: 'Patient is doing well. Blood sugar levels are stable.',
          nextAppointment: new Date('2024-04-10'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockHospitals: HospitalType[] = [
        {
          id: 'h1',
          name: 'City General Hospital',
          address: '123 Medical Center Dr, City, State 12345',
          phone: '+1-555-0100',
          email: 'info@citygeneral.com',
          website: 'https://www.citygeneral.com',
          isConnected: true,
          isIntegrated: true,
          apiEndpoint: 'https://api.citygeneral.com/v1',
          apiKey: '***',
          specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'General Medicine'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'h2',
          name: 'Regional Medical Center',
          address: '456 Health Ave, City, State 12345',
          phone: '+1-555-0200',
          email: 'info@regionalmed.com',
          website: 'https://www.regionalmed.com',
          isConnected: false,
          isIntegrated: false,
          apiEndpoint: '',
          apiKey: '',
          specialties: ['Emergency Medicine', 'Surgery', 'Pediatrics'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      setMedicalRecords(mockMedicalRecords);
      setHospitals(mockHospitals);
    } catch (error) {
      console.error('Error loading medical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPatientByIC = async () => {
    if (!icNumber.trim()) {
      alert('Please enter an IC number');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call to search patient by IC
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock patient data
      const mockPatient = {
        id: 'patient_123',
        name: 'Ahmad bin Abdullah',
        icNumber: icNumber,
        age: 65,
        gender: 'Male',
        phone: '+60-12-345-6789',
        address: '123 Jalan Merdeka, Kuala Lumpur'
      };
      
      // Mock medical records for this patient
      const patientRecords: MedicalRecord[] = [
        {
          id: 'mr1',
          patientId: mockPatient.id,
          hospitalId: 'h1',
          doctorId: currentUser?.id || 'd1',
          visitDate: new Date('2024-01-15'),
          visitType: 'consultation',
          diagnosis: 'Hypertension - Stage 2',
          symptoms: ['Headache', 'Dizziness', 'High blood pressure'],
          treatment: 'Amlodipine 5mg daily, lifestyle modifications',
          prescriptions: [
            { 
              id: 'p1', 
              medicalRecordId: 'mr1',
              medicationName: 'Amlodipine', 
              dosage: '5mg', 
              frequency: 'Once daily', 
              duration: '30 days',
              instructions: 'Take with food',
              prescribedBy: 'Dr. Smith',
              prescribedDate: new Date('2024-01-15'),
              isActive: true,
              refillsRemaining: 2,
              totalRefills: 3,
              createdAt: new Date()
            }
          ],
          labResults: [
            { 
              id: 'l1', 
              medicalRecordId: 'mr1',
              testName: 'Blood Pressure', 
              testDate: new Date('2024-01-15'),
              results: [
                {
                  testType: 'Systolic',
                  value: '160',
                  unit: 'mmHg',
                  normalRange: '90-140',
                  isNormal: false,
                  flag: 'high'
                },
                {
                  testType: 'Diastolic',
                  value: '95',
                  unit: 'mmHg',
                  normalRange: '60-90',
                  isNormal: false,
                  flag: 'high'
                }
              ],
              labName: 'City General Hospital Lab',
              isNormal: false,
              createdAt: new Date()
            }
          ],
          notes: 'Patient advised to reduce salt intake and exercise regularly.',
          nextAppointment: new Date('2024-02-15'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'mr2',
          patientId: mockPatient.id,
          hospitalId: 'h1',
          doctorId: currentUser?.id || 'd1',
          visitDate: new Date('2023-12-10'),
          visitType: 'checkup',
          diagnosis: 'Type 2 Diabetes - Well controlled',
          symptoms: ['None reported'],
          treatment: 'Metformin 500mg twice daily',
          prescriptions: [
            { 
              id: 'p2', 
              medicalRecordId: 'mr2',
              medicationName: 'Metformin', 
              dosage: '500mg', 
              frequency: 'Twice daily', 
              duration: '30 days',
              instructions: 'Take with meals',
              prescribedBy: 'Dr. Johnson',
              prescribedDate: new Date('2023-12-10'),
              isActive: true,
              refillsRemaining: 1,
              totalRefills: 2,
              createdAt: new Date()
            }
          ],
          labResults: [
            { 
              id: 'l2', 
              medicalRecordId: 'mr2',
              testName: 'HbA1c', 
              testDate: new Date('2023-12-10'),
              results: [
                {
                  testType: 'HbA1c',
                  value: '6.2',
                  unit: '%',
                  normalRange: '<5.7',
                  isNormal: false,
                  flag: 'high'
                }
              ],
              labName: 'City General Hospital Lab',
              isNormal: false,
              createdAt: new Date()
            }
          ],
          notes: 'Blood sugar levels are stable. Continue current medication.',
          nextAppointment: new Date('2024-01-10'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      setSearchedPatient(mockPatient);
      setMedicalRecords(patientRecords);
    } catch (error) {
      console.error('Error searching patient:', error);
      alert('Patient not found. Please check the IC number.');
    } finally {
      setLoading(false);
    }
  };

  const syncMedicalRecords = async (hospitalId: string) => {
    setLoading(true);
    try {
      // Simulate API call to sync medical records
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRecord: MedicalRecord = {
        id: `mr_${Date.now()}`,
        patientId: currentUser?.id || '1',
        hospitalId,
        doctorId: 'd1',
        visitDate: new Date(),
        visitType: 'consultation',
        diagnosis: 'Routine checkup - No issues found',
        symptoms: ['None'],
        treatment: 'Continue healthy lifestyle',
        prescriptions: [],
        labResults: [],
        notes: 'Patient is in good health. No medication changes needed.',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setMedicalRecords(prev => [newRecord, ...prev]);
      setShowConnectHospitalModal(false);
    } catch (error) {
      console.error('Error syncing medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = () => {
    const record: MedicalRecord = {
      id: `mr_${Date.now()}`,
      patientId: currentUser?.id || '1',
      hospitalId: 'h1',
      doctorId: 'd1',
      visitDate: new Date(),
      visitType: newRecord.visitType as any,
      diagnosis: newRecord.diagnosis,
      symptoms: newRecord.symptoms.split(',').map(s => s.trim()),
      treatment: newRecord.treatment,
      prescriptions: [],
      labResults: [],
      notes: newRecord.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMedicalRecords(prev => [record, ...prev]);
    setNewRecord({ visitType: '', diagnosis: '', symptoms: '', treatment: '', notes: '' });
    setShowAddRecordModal(false);
  };

  const exportToPDF = () => {
    // Create PDF content
    const pdfContent = `
      Medical Records Report
      Generated on: ${new Date().toLocaleDateString()}
      Patient: ${currentUser?.username || 'Unknown'}
      
      ${medicalRecords.map(record => `
        Visit Date: ${new Date(record.visitDate).toLocaleDateString()}
        Type: ${record.visitType}
        Diagnosis: ${record.diagnosis}
        Symptoms: ${record.symptoms.join(', ')}
        Treatment: ${record.treatment}
        Notes: ${record.notes}
        Hospital: ${hospitals.find(h => h.id === record.hospitalId)?.name || 'Unknown'}
        ---
      `).join('\n')}
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-records-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const viewRecordDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
            {currentUser?.role === 'medical_staff' ? 'Patient Medical Records' : 'Medical Records'}
          </h2>
          {currentUser?.role !== 'medical_staff' && (
            <button 
              onClick={() => setShowAddRecordModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Add Record
            </button>
          )}
        </div>

        {/* IC Search for Medical Staff */}
        {currentUser?.role === 'medical_staff' && (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-4">Search Patient by IC Number</h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Enter IC Number (e.g., 850101-01-1234)"
                value={icNumber}
                onChange={(e) => setIcNumber(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={searchPatientByIC}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        )}

        {/* Patient Info for Medical Staff */}
        {currentUser?.role === 'medical_staff' && searchedPatient && (
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-green-900 mb-4">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{searchedPatient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IC Number</p>
                <p className="font-medium">{searchedPatient.icNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">{searchedPatient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{searchedPatient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{searchedPatient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{searchedPatient.address}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={exportToPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Export All Records
              </button>
            </div>
          </div>
        )}

        {/* Hospital Integration for Patients */}
        {currentUser?.role !== 'medical_staff' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">
              Medical records will be automatically synced from integrated hospitals.
            </p>
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => setShowConnectHospitalModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Building2 className="h-4 w-4 inline mr-2" />
                Connect Hospital
              </button>
              <button 
                onClick={exportToPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Export Records
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {medicalRecords.map((record) => (
            <div key={record.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold capitalize">{record.visitType}</h4>
                  <p className="text-gray-600">
                    {new Date(record.visitDate).toLocaleDateString()} - {record.diagnosis}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {hospitals.find(h => h.id === record.hospitalId)?.name || 'Unknown Hospital'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="font-medium mb-2">Symptoms</h5>
                  <p className="text-gray-600">{record.symptoms.join(', ')}</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Treatment</h5>
                  <p className="text-gray-600">{record.treatment}</p>
                </div>
              </div>

              {record.notes && (
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Notes</h5>
                  <p className="text-gray-600">{record.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {record.prescriptions.length} prescriptions
                </div>
                <button 
                  onClick={() => viewRecordDetails(record)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Medical Record</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Visit Type</label>
                <select 
                  value={newRecord.visitType}
                  onChange={(e) => setNewRecord({...newRecord, visitType: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select type</option>
                  <option value="checkup">Checkup</option>
                  <option value="consultation">Consultation</option>
                  <option value="emergency">Emergency</option>
                  <option value="surgery">Surgery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis</label>
                <input 
                  type="text"
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Enter diagnosis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Symptoms</label>
                <input 
                  type="text"
                  value={newRecord.symptoms}
                  onChange={(e) => setNewRecord({...newRecord, symptoms: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Enter symptoms (comma-separated)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Treatment</label>
                <input 
                  type="text"
                  value={newRecord.treatment}
                  onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Enter treatment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea 
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <button 
                onClick={() => {
                  setNewRecord({
                    visitType: 'consultation',
                    diagnosis: 'Hypertension - Stage 1',
                    symptoms: 'Headache, Dizziness, High blood pressure',
                    treatment: 'Amlodipine 5mg daily, lifestyle modifications',
                    notes: 'Patient advised to reduce salt intake and exercise regularly. Follow up in 2 weeks.'
                  });
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Demo Fill
              </button>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowAddRecordModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddRecord}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Hospital Modal */}
      {showConnectHospitalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Connect Hospital</h3>
            <div className="space-y-4">
              {hospitals.map(hospital => (
                <div key={hospital.id} className="border rounded p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{hospital.name}</h4>
                      <p className="text-sm text-gray-600">{hospital.address}</p>
                      <p className="text-sm text-gray-600">{hospital.phone}</p>
                    </div>
                    <div className="text-right">
                      {hospital.isIntegrated ? (
                        <span className="text-green-600 text-sm">Connected</span>
                      ) : (
                        <button 
                          onClick={() => syncMedicalRecords(hospital.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button 
                onClick={() => setShowConnectHospitalModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Medical Record Details</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Visit Date:</label>
                  <p>{new Date(selectedRecord.visitDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="font-medium">Visit Type:</label>
                  <p className="capitalize">{selectedRecord.visitType}</p>
                </div>
              </div>
              
              <div>
                <label className="font-medium">Diagnosis:</label>
                <p>{selectedRecord.diagnosis}</p>
              </div>
              
              <div>
                <label className="font-medium">Symptoms:</label>
                <p>{selectedRecord.symptoms.join(', ')}</p>
              </div>
              
              <div>
                <label className="font-medium">Treatment:</label>
                <p>{selectedRecord.treatment}</p>
              </div>
              
              {selectedRecord.notes && (
                <div>
                  <label className="font-medium">Notes:</label>
                  <p>{selectedRecord.notes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Hospital:</label>
                  <p>{hospitals.find(h => h.id === selectedRecord.hospitalId)?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label className="font-medium">Prescriptions:</label>
                  <p>{selectedRecord.prescriptions.length} prescriptions</p>
                </div>
              </div>
              
              {selectedRecord.nextAppointment && (
                <div>
                  <label className="font-medium">Next Appointment:</label>
                  <p>{new Date(selectedRecord.nextAppointment).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Appointments Tab Component
function AppointmentsTab() {
  const { state } = useApp();
  const { elderlyMode, currentUser } = state;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPatient, setCurrentPatient] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientAge: '',
    appointmentType: 'checkup',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '09:00'
  });



  // If user is not medical staff, show patient appointments
  if (currentUser?.role !== 'medical_staff') {
    return <PatientAppointments currentUser={currentUser} elderlyMode={elderlyMode} />;
  }

  // If user is medical staff, show medical staff appointments
  return <MedicalStaffAppointments currentUser={currentUser} elderlyMode={elderlyMode} />;
}

// Medications Tab Component
function MedicationsTab() {
  const { state } = useApp();
  const { elderlyMode, currentUser } = state;
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    setLoading(true);
    try {
      const mockMedications: Medication[] = [
        {
          id: 'm1',
          prescriptionId: 'p1',
          name: 'Metformin',
          genericName: 'Metformin Hydrochloride',
          dosage: '500mg',
          frequency: 'Twice daily',
          instructions: 'Take with meals',
          prescribedBy: 'Dr. Smith',
          prescribedDate: new Date('2024-01-01'),
          startDate: new Date('2024-01-01'),
          isActive: true,
          refillsRemaining: 3,
          totalRefills: 5,
          currentStock: 15,
          refillReminder: true,
          refillThreshold: 5,
          takenToday: false,
          notes: 'Take with meals',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setMedications(mockMedications);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMedicationTaken = async (medicationId: string) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId 
        ? { ...med, takenToday: true, lastTaken: new Date() }
        : med
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
            Medications
          </h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4 inline mr-2" />
            Add Medication
          </button>
        </div>

        <div className="space-y-4">
          {medications.map((medication) => (
            <div key={medication.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold">{medication.name}</h4>
                  <p className="text-gray-600">{medication.genericName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {medication.takenToday ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Dosage</p>
                  <p className="font-medium">{medication.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Frequency</p>
                  <p className="font-medium">{medication.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Instructions</p>
                  <p className="font-medium">{medication.instructions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prescribed By</p>
                  <p className="font-medium">{medication.prescribedBy}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>Refills: {medication.refillsRemaining}/{medication.totalRefills}</p>
                  <p>Stock: {medication.currentStock} remaining</p>
                </div>
                <button
                  onClick={() => markMedicationTaken(medication.id)}
                  disabled={medication.takenToday}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    medication.takenToday
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {medication.takenToday ? 'Taken Today' : 'Mark as Taken'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Family Tab Component
function FamilyTab() {
  const { state } = useApp();
  const { elderlyMode, currentUser } = state;
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    setLoading(true);
    try {
      const mockFamilyMembers: FamilyMember[] = [
        {
          id: 'f1',
          elderlyId: currentUser?.id || '1',
          childId: 'c1',
          relationship: 'daughter',
          name: 'Sarah Johnson',
          email: 'sarah@email.com',
          phone: '+1-555-0123',
          isPrimaryContact: true,
          canViewRecords: true,
          canEditRecords: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setFamilyMembers(mockFamilyMembers);
    } catch (error) {
      console.error('Error loading family members:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
            Family Members
          </h2>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="h-4 w-4 inline mr-2" />
            Invite Family Member
          </button>
        </div>

        <div className="space-y-4">
          {familyMembers.map((member) => (
            <div key={member.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold">{member.name}</h4>
                  <p className="text-gray-600 capitalize">{member.relationship}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {member.isPrimaryContact && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      Primary Contact
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{member.email}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    member.canViewRecords ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.canViewRecords ? 'Can View Records' : 'No Access'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    member.canEditRecords ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.canEditRecords ? 'Can Edit Records' : 'View Only'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Transport Tab Component
function TransportTab() {
  const { state } = useApp();
  const { elderlyMode, currentUser } = state;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTransportData();
  }, []);

  const loadTransportData = async () => {
    setLoading(true);
    try {
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientId: currentUser?.id || '1',
          hospitalId: 'h1',
          doctorId: 'd1',
          appointmentDate: new Date('2024-01-15'),
          appointmentTime: '10:00 AM',
          appointmentType: 'checkup',
          status: 'scheduled',
          notes: 'Annual health checkup',
          estimatedDuration: 60,
          requiresTransport: true,
          transportDetails: {
            id: 't1',
            appointmentId: '1',
            pickupAddress: '123 Home Street',
            dropoffAddress: '456 Hospital Avenue',
            pickupTime: new Date('2024-01-15T09:30:00'),
            estimatedReturnTime: new Date('2024-01-15T12:00:00'),
            transportProvider: 'grab',
            transportStatus: 'scheduled',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading transport data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
            Transport Services
          </h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="h-4 w-4 inline mr-2" />
            Book Transport
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transport Providers */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h4 className="text-lg font-semibold mb-4">Available Providers</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Grab</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                  Book
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">Uber</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Book
                </button>
              </div>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h4 className="text-lg font-semibold mb-4">Recent Trips</h4>
            <div className="space-y-3">
              {appointments.filter(a => a.transportDetails).map((appointment) => (
                <div key={appointment.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{appointment.appointmentType}</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      appointment.transportDetails?.transportStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.transportDetails?.transportStatus === 'en-route' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.transportDetails?.transportStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {appointment.transportDetails?.transportProvider}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

// Data Access Tab Component - Caregiver-Patient Linking System
function DataAccessTab({ currentUser, elderlyMode }: { currentUser: any; elderlyMode: boolean }) {
  return (
    <div className="space-y-6">
      {/* Pass elderlyMode prop to DataAccess component */}
      <DataAccess elderlyMode={elderlyMode} />
    </div>
  );
}

// Combined Health Tab - Overview + Health Profile
function CombinedHealthTab({ elderlyMode }: { elderlyMode: boolean }) {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="p-6">
      {/* Section Navigation */}
      <div className="flex space-x-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveSection('overview')}
          className={`py-2 px-4 border-b-2 font-medium transition-colors ${
            activeSection === 'overview'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } ${elderlyMode ? 'elderly' : 'text-sm'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSection('profile')}
          className={`py-2 px-4 border-b-2 font-medium transition-colors ${
            activeSection === 'profile'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } ${elderlyMode ? 'elderly' : 'text-sm'}`}
        >
          Health Profile
        </button>
      </div>

      {/* Content */}
      {activeSection === 'overview' ? (
        <div className="space-y-6">
          {/* Health Overview Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium text-gray-600 ${elderlyMode ? 'elderly' : ''}`}>Heart Rate</p>
                  <p className={`text-2xl font-semibold text-gray-900 ${elderlyMode ? 'elderly-xl' : ''}`}>72 BPM</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium text-gray-600 ${elderlyMode ? 'elderly' : ''}`}>Steps Today</p>
                  <p className={`text-2xl font-semibold text-gray-900 ${elderlyMode ? 'elderly-xl' : ''}`}>8,432</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Droplets className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium text-gray-600 ${elderlyMode ? 'elderly' : ''}`}>Water Intake</p>
                  <p className={`text-2xl font-semibold text-gray-900 ${elderlyMode ? 'elderly-xl' : ''}`}>1.8L</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium text-gray-600 ${elderlyMode ? 'elderly' : ''}`}>Calories Burned</p>
                  <p className={`text-2xl font-semibold text-gray-900 ${elderlyMode ? 'elderly-xl' : ''}`}>420</p>
                </div>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className={`text-lg font-semibold text-gray-900 mb-4 ${elderlyMode ? 'elderly-lg' : ''}`}>
              Health Metrics
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className={`font-medium text-gray-900 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>BMI</h3>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className={`text-2xl font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : ''}`}>22.5</p>
                  <p className={`text-sm text-green-600 ${elderlyMode ? 'elderly' : ''}`}>Normal Weight</p>
                </div>
              </div>
              <div>
                <h3 className={`font-medium text-gray-900 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Blood Pressure</h3>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className={`text-2xl font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : ''}`}>120/80</p>
                  <p className={`text-sm text-green-600 ${elderlyMode ? 'elderly' : ''}`}>Normal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className={`text-lg font-semibold text-gray-900 mb-4 ${elderlyMode ? 'elderly-lg' : ''}`}>
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className={`font-medium text-gray-900 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Morning Walk</p>
                    <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>30 minutes • 2 hours ago</p>
                  </div>
                </div>
                <span className={`text-sm text-green-600 ${elderlyMode ? 'elderly' : ''}`}>+150 cal</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Droplets className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className={`font-medium text-gray-900 ${elderlyMode ? 'elderly' : 'text-sm'}`}>Water Intake</p>
                    <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-xs'}`}>500ml • 1 hour ago</p>
                  </div>
                </div>
                <span className={`text-sm text-blue-600 ${elderlyMode ? 'elderly' : ''}`}>+500ml</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <HealthTab />
      )}
    </div>
  );
}

// Combined Tracking Tab - Nutrition + Water + Activity
function CombinedTrackingTab({ elderlyMode }: { elderlyMode: boolean }) {
  const [activeSection, setActiveSection] = useState('nutrition');

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveSection('nutrition')}
          className={`py-2 px-4 border-b-2 font-medium transition-colors ${
            activeSection === 'nutrition'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } ${elderlyMode ? 'elderly' : 'text-sm'}`}
        >
          Nutrition
        </button>
        <button
          onClick={() => setActiveSection('water')}
          className={`py-2 px-4 border-b-2 font-medium transition-colors ${
            activeSection === 'water'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } ${elderlyMode ? 'elderly' : 'text-sm'}`}
        >
          Water Tracking
        </button>
        <button
          onClick={() => setActiveSection('activity')}
          className={`py-2 px-4 border-b-2 font-medium transition-colors ${
            activeSection === 'activity'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } ${elderlyMode ? 'elderly' : 'text-sm'}`}
        >
          Activity
        </button>
      </div>

      {/* Content */}
      {activeSection === 'nutrition' && <NutritionTab />}
      {activeSection === 'water' && <WaterTab />}
      {activeSection === 'activity' && <ActivityTab />}
    </div>
  );
}