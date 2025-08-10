'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Plus, Building2, CheckCircle, XCircle, Car, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment, Hospital } from '../types/medical';
import TransportCoordination from './TransportCoordination';
import TransportationTracking from './TransportationTracking';
import { GrabBookingResponse } from '../services/grabApi';

export default function ElderlyModeAppointments() {
  const { state } = useApp();
  const { currentUser, settings } = state;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'appointments' | 'transportation'>('appointments');
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
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Load appointments
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
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
      }
    ];
    setAppointments(mockAppointments);
  }, [currentUser]);

  // Handle transport arrangement
  const handleTransportArranged = (bookingDetails: GrabBookingResponse) => {
    if (selectedAppointmentForTransport) {
      setTransportBookings(prev => [
        ...prev,
        {
          appointmentId: selectedAppointmentForTransport.id,
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

  // Handle booking new appointment
  const handleBookAppointment = () => {
    speakText('Opening appointment booking form');
    setShowBookingForm(true);
  };

  // Transportation tab content
  if (activeTab === 'transportation') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Transportation</h1>
            <button
              onClick={() => setActiveTab('appointments')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Appointments
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
            {appointments.length > 0 && (
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <button
                    key={appointment.id}
                    onClick={() => {
                      setSelectedAppointmentForTransport(appointment);
                      setShowTransportModal(true);
                    }}
                    className="w-full bg-orange-500 text-white px-6 py-4 rounded-xl text-xl font-semibold hover:bg-orange-600 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span>Arrange Transport for {appointment.appointmentType}</span>
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="text-sm opacity-90 mt-1">
                      {appointment.appointmentDate.toLocaleDateString()} at {appointment.appointmentTime}
                    </div>
                  </button>
                ))}
              </div>
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('transportation')}
              className="flex items-center justify-center space-x-3 bg-orange-500 text-white px-6 py-3 rounded-xl text-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              <Car className="w-6 h-6" />
              <span>Transportation</span>
            </button>
            <button
              onClick={handleBookAppointment}
              className="flex items-center justify-center space-x-3 bg-blue-600 text-white px-8 py-3 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span>Book New Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Appointments</h2>
        <div className="space-y-6">
          {appointments.map(appointment => (
            <div key={appointment.id} className="border-2 border-gray-200 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-lg font-semibold">
                      {appointment.appointmentDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-lg font-semibold">{appointment.appointmentTime}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <span className="text-lg font-semibold">General Hospital</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-lg font-semibold">Dr. Sarah Chen</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <span className="px-4 py-2 rounded-lg text-lg font-semibold bg-green-100 text-green-800">
                    Confirmed
                  </span>
                  <div className="flex space-x-3">
                    <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    {appointment.requiresTransport && (
                      <button
                        onClick={() => {
                          setSelectedAppointmentForTransport(appointment);
                          setShowTransportModal(true);
                        }}
                        className="flex items-center justify-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
                      >
                        <Car className="w-4 h-4" />
                        <span>Transport</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
