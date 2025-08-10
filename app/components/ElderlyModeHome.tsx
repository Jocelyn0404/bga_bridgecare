'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  Clock, 
  Car, 
  AlertTriangle, 
  Phone, 
  User, 
  Heart,
  Pill,
  Bell,
  MapPin,
  Plus,
  Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types/medical';
import TransportCoordination from './TransportCoordination';
import TransportationTracking from './TransportationTracking';
import { GrabBookingResponse } from '../services/grabApi';

interface ElderlyModeHomeProps {
  onTabChange: (tab: string) => void;
}

export default function ElderlyModeHome({ onTabChange }: ElderlyModeHomeProps) {
  const { state } = useApp();
  const { currentUser, settings } = state;
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [medicationReminders, setMedicationReminders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'transportation'>('home');
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [selectedAppointmentForTransport, setSelectedAppointmentForTransport] = useState<Appointment | null>(null);
  const [transportBookings, setTransportBookings] = useState<{
    appointmentId: string;
    bookingDetails: GrabBookingResponse;
  }[]>([]);

  // Voice reader function
  const speakText = (text: string) => {
    if (settings.voiceReader && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower speech for elderly
      speechSynthesis.speak(utterance);
    }
  };

  // Load next appointment
  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockNextAppointment: Appointment = {
      id: '1',
      patientId: currentUser?.id || '',
      patientName: currentUser?.username || '',
      patientAge: currentUser?.age || 0,
      hospitalId: 'h1',
      doctorId: 'd1',
      appointmentDate: new Date('2025-08-15'),
      appointmentTime: '10:00',
      appointmentType: 'consultation',
      status: 'confirmed',
      notes: 'Regular checkup',
      estimatedDuration: 30,
      requiresTransport: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNextAppointment(mockNextAppointment);

    // Mock medication reminders
    setMedicationReminders([
      {
        id: '1',
        medicationName: 'Blood Pressure Medicine',
        time: '08:00',
        taken: false,
        dosage: '1 tablet'
      },
      {
        id: '2',
        medicationName: 'Diabetes Medicine',
        time: '12:00',
        taken: false,
        dosage: '1 tablet'
      }
    ]);
  }, [currentUser]);

  // Emergency SOS function
  const handleEmergencySOS = () => {
    speakText('Emergency SOS activated. Calling emergency services.');
    
    // In real app, this would:
    // 1. Call emergency services
    // 2. Notify caregivers
    // 3. Send location
    alert('EMERGENCY SOS: Calling emergency services and notifying caregivers...');
  };

  // Call next appointment
  const handleCallAppointment = () => {
    if (nextAppointment) {
      speakText(`Calling General Hospital for your appointment`);
      // In real app, this would initiate a call
      alert(`Calling General Hospital...`);
    }
  };

  // Mark medication as taken
  const handleMedicationTaken = (medicationId: string) => {
    setMedicationReminders(prev => 
      prev.map(med => 
        med.id === medicationId ? { ...med, taken: true } : med
      )
    );
    speakText('Medication marked as taken');
  };

  // Handle transport arrangement
  const handleTransportArranged = (bookingDetails: GrabBookingResponse) => {
    if (nextAppointment) {
      setTransportBookings(prev => [
        ...prev,
        {
          appointmentId: nextAppointment.id,
          bookingDetails
        }
      ]);
      speakText('Transport has been arranged successfully');
    }
    setShowTransportModal(false);
  };

  const handleTransportModalClose = () => {
    setShowTransportModal(false);
  };

  // Quick action buttons
  const quickActions = [
    {
      id: 'appointments',
      icon: Calendar,
      label: 'Appointments',
      description: 'View or book clinic visits',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => onTabChange('appointments')
    },
    {
      id: 'medical-records',
      icon: FileText,
      label: 'Medical Records',
      description: 'View prescriptions and history',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => onTabChange('medical-records')
    },
    {
      id: 'reminders',
      icon: Clock,
      label: 'Reminders',
      description: 'Medication and health alerts',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => onTabChange('health')
    },
    {
      id: 'transport',
      icon: Car,
      label: 'Transport',
      description: 'Book shuttle or Grab Health',
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => setActiveTab('transportation')
    }
  ];

  // Transportation tab content
  if (activeTab === 'transportation') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Transportation</h1>
            <button
              onClick={() => setActiveTab('home')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Transport Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Transport</h2>
            <p className="text-lg text-gray-600 mb-6">
              Arrange transportation for your upcoming appointments
            </p>
            {nextAppointment && (
              <button
                onClick={() => {
                  setSelectedAppointmentForTransport(nextAppointment);
                  setShowTransportModal(true);
                }}
                className="w-full bg-orange-500 text-white px-6 py-4 rounded-xl text-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Arrange Transport for Next Appointment
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Transport Status</h2>
            {transportBookings.length > 0 ? (
              <div className="space-y-4">
                {transportBookings.map((booking) => (
                  <div key={booking.appointmentId} className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Car className="w-6 h-6 text-green-600" />
                      <span className="text-xl font-semibold text-green-800">Transport Booked</span>
                    </div>
                    <div className="space-y-2 text-lg">
                      <div className="flex justify-between">
                        <span>Driver:</span>
                        <span className="font-medium">{booking.bookingDetails.driverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehicle:</span>
                        <span>{booking.bookingDetails.vehicleNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arrival:</span>
                        <span className="font-medium text-purple-600">
                          {booking.bookingDetails.arrivalTime} minutes
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fare:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('ms-MY', {
                            style: 'currency',
                            currency: 'MYR',
                          }).format(booking.bookingDetails.estimatedFare)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-500">No transport bookings yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Tracking */}
        {transportBookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Tracking</h2>
            <TransportationTracking transportBookings={transportBookings} />
          </div>
        )}

        {/* Transport Coordination Modal */}
        {showTransportModal && selectedAppointmentForTransport && (
          <TransportCoordination
            appointment={selectedAppointmentForTransport}
            onTransportArranged={handleTransportArranged}
            onClose={handleTransportModalClose}
            userRole="elderly"
          />
        )}
      </div>
    );
  }

  // Home tab content
  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header with User Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {currentUser?.username || 'User'}
            </h1>
            <p className="text-xl text-gray-600">
              IC: {currentUser?.id || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Next Important Item */}
      {nextAppointment && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Next Appointment
          </h2>
          <div className="space-y-3">
            <p className="text-xl text-blue-800">
              <strong>Date:</strong> {nextAppointment.appointmentDate.toLocaleDateString()}
            </p>
            <p className="text-xl text-blue-800">
              <strong>Time:</strong> {nextAppointment.appointmentTime}
            </p>
            <p className="text-xl text-blue-800">
              <strong>Doctor:</strong> Dr. Sarah Chen
            </p>
            <p className="text-xl text-blue-800">
              <strong>Hospital:</strong> General Hospital
            </p>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleCallAppointment}
              className="flex-1 flex items-center justify-center space-x-3 bg-blue-600 text-white px-6 py-4 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-6 h-6" />
              <span>Call Hospital</span>
            </button>
            {nextAppointment && (
              <button
                onClick={() => {
                  setSelectedAppointmentForTransport(nextAppointment);
                  setShowTransportModal(true);
                }}
                className="flex-1 flex items-center justify-center space-x-3 bg-orange-500 text-white px-6 py-4 rounded-xl text-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                <Car className="w-6 h-6" />
                <span>Arrange Transport</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Medication Reminders */}
      {medicationReminders.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4 flex items-center space-x-3">
            <Pill className="w-6 h-6" />
            <span>Medication Reminders</span>
          </h2>
          <div className="space-y-4">
            {medicationReminders.map((medication) => (
              <div key={medication.id} className="bg-white rounded-lg p-4 border border-yellow-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-semibold text-gray-900">
                      {medication.medicationName}
                    </p>
                    <p className="text-lg text-gray-600">
                      Time: {medication.time} | Dosage: {medication.dosage}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMedicationTaken(medication.id)}
                    disabled={medication.taken}
                    className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
                      medication.taken
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {medication.taken ? 'Taken' : 'Mark Taken'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`${action.color} text-white rounded-xl p-6 text-center transition-colors min-h-[120px] flex flex-col items-center justify-center space-y-3`}
          >
            <action.icon className="w-12 h-12" />
            <div>
              <p className="text-2xl font-bold">{action.label}</p>
              <p className="text-lg opacity-90">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Emergency SOS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleEmergencySOS}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 shadow-lg transition-colors animate-pulse"
          style={{ minWidth: '80px', minHeight: '80px' }}
        >
          <AlertTriangle className="w-8 h-8" />
        </button>
        <p className="text-center text-sm font-semibold text-red-600 mt-2">
          SOS
        </p>
      </div>

      {/* Transport Coordination Modal */}
      {showTransportModal && selectedAppointmentForTransport && (
        <TransportCoordination
          appointment={selectedAppointmentForTransport}
          onTransportArranged={handleTransportArranged}
          onClose={handleTransportModalClose}
        />
      )}
    </div>
  );
}
