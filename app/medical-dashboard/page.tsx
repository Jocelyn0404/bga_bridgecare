'use client';

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  Calendar, 
  Pill, 
  Users, 
  Bell, 
  FileText, 
  Car, 
  Building2, 
  Phone,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  LogOut
} from 'lucide-react';

export default function MedicalDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'medications' | 'records' | 'family' | 'transport'>('overview');
  const [isElderlyMode, setIsElderlyMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const mockUser: User = {
      id: '1',
      username: 'john.doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
      gender: 'male',
      age: 74,
      weight: 70,
      height: 170,
      bmi: 24.2,
      recordMenstruation: false,
      medicalConditions: {
        hypertension: false,
        diabetes: false,
        cholesterol: false
      },
      onboardingCompleted: true,
      role: 'patient',
      linkedPatientId: undefined,
      organization: undefined,
      staffId: undefined,
      isElderly: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUser(mockUser);
    setLoading(false);
  }, []);

  const handleTransportUpdate = (appointmentId: string, status: string) => {
    console.log(`Transport status updated for appointment ${appointmentId}: ${status}`);
    
    // Send notification to family members
    if (status === 'picked-up') {
      console.log('Notifying family: Elderly picked up by transport');
    } else if (status === 'at-hospital') {
      console.log('Notifying family: Elderly arrived at hospital');
    } else if (status === 'returning') {
      console.log('Notifying family: Elderly is returning home');
    }
  };

  const markMedicationTaken = (medicationId: string) => {
    console.log(`Medication ${medicationId} marked as taken`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
          <p className="text-gray-600">Please log in to access your medical records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isElderlyMode ? 'text-lg' : ''}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Record Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsElderlyMode(!isElderlyMode)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isElderlyMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Elderly Mode {isElderlyMode ? 'ON' : 'OFF'}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md border mb-6">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'medications', label: 'Medications', icon: Pill },
              { id: 'records', label: 'Medical Records', icon: FileText },
              { id: 'family', label: 'Family', icon: Users },
              { id: 'transport', label: 'Transport', icon: Car }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Upcoming Appointments</p>
                      <p className="text-2xl font-bold text-blue-600">3</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Medications</p>
                      <p className="text-2xl font-bold text-green-600">5</p>
                    </div>
                    <Pill className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Family Members</p>
                      <p className="text-2xl font-bold text-purple-600">4</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Recent Records</p>
                      <p className="text-2xl font-bold text-orange-600">8</p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Notifications</p>
                      <p className="text-2xl font-bold text-red-600">7</p>
                    </div>
                    <Bell className="h-8 w-8 text-red-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Transport Services</p>
                      <p className="text-2xl font-bold text-indigo-600">2</p>
                    </div>
                    <Car className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium">New Appointment</span>
                  </button>
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Pill className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Add Medication</span>
                  </button>
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Users className="h-6 w-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium">Invite Family</span>
                  </button>
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Car className="h-6 w-6 text-indigo-600 mb-2" />
                    <span className="text-sm font-medium">Book Transport</span>
                  </button>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border rounded-lg">
                    <Bell className="h-5 w-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">Upcoming Appointment</p>
                      <p className="text-sm text-gray-600">You have a checkup appointment tomorrow at 10:00 AM</p>
                    </div>
                    <span className="text-xs text-gray-500">Today</span>
                  </div>
                  <div className="flex items-center p-3 border rounded-lg">
                    <Pill className="h-5 w-5 text-green-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">Medication Reminder</p>
                      <p className="text-sm text-gray-600">Time to take your Metformin medication</p>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Appointments</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 inline mr-2" />
                  New Appointment
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">Annual Health Checkup</h4>
                      <p className="text-gray-600">Regular health assessment and blood work</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Scheduled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span>January 15, 2024 at 10:00 AM</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span>City General Hospital</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-2">Transport Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Provider</p>
                        <p className="font-medium">Grab</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Pickup Time</p>
                        <p className="font-medium">9:30 AM</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium">Scheduled</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button 
                        onClick={() => handleTransportUpdate('1', 'picked-up')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Picked Up
                      </button>
                      <button 
                        onClick={() => handleTransportUpdate('1', 'at-hospital')}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        At Hospital
                      </button>
                      <button 
                        onClick={() => handleTransportUpdate('1', 'returning')}
                        className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                      >
                        Returning
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Medications</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Add Medication
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">Metformin</h4>
                      <p className="text-gray-600">Metformin Hydrochloride</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Dosage</p>
                      <p className="font-medium">500mg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Frequency</p>
                      <p className="font-medium">Twice daily</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock</p>
                      <p className="font-medium">15 remaining</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Not taken today
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => markMedicationTaken('1')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Mark Taken
                      </button>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Family Members</h3>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Invite Family Member
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                      <p className="text-gray-600">Daughter</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Primary Contact
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span>+1-555-0123</span>
                    </div>
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 text-gray-500 mr-2" />
                      <span>sarah@email.com</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                        Can View Records
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        View Only
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
              </div>
            </div>
          )}

          {activeTab === 'transport' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Transport Services</h3>
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
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Health Checkup</p>
                        <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                          Scheduled
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">January 15, 2024</p>
                      <p className="text-sm text-gray-600">Grab</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Medical Records</h3>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Add Record
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <p className="text-gray-600">Medical records will be automatically synced from integrated hospitals.</p>
                <div className="mt-4 flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    <Building2 className="h-4 w-4 inline mr-2" />
                    Connect Hospital
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    <FileText className="h-4 w-4 inline mr-2" />
                    View All Records
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 