'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, CheckCircle, XCircle, AlertCircle, Car, Navigation, Shield, Users } from 'lucide-react';
import { User as UserType } from '../types';
import TransportCoordination from './TransportCoordination';
import TransportationTracking from './TransportationTracking';
import CaregiverAccessRequest from './CaregiverAccessRequest';
import AccessRequestApproval from './AccessRequestApproval';
import CaregiverModeFAB from './CaregiverModeFAB';
import CaregiverModeInterface from './CaregiverModeInterface';
import { GrabBookingResponse } from '../services/grabApi';
import DataAccess from './DataAccess';

interface PatientAppointmentsProps {
  currentUser: UserType | null;
  elderlyMode?: boolean;
}

export default function PatientAppointments({ currentUser, elderlyMode = false }: PatientAppointmentsProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [selectedAppointmentForTransport, setSelectedAppointmentForTransport] = useState<any>(null);
  const [transportBookings, setTransportBookings] = useState<{
    appointmentId: string;
    bookingDetails: GrabBookingResponse;
  }[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'transportation' | 'data-access'>('appointments');
  
  // Caregiver mode state
  const [caregiverMode, setCaregiverMode] = useState<{
    parentId: string;
    parentName: string;
  } | null>(null);
  
  const [newAppointmentRequest, setNewAppointmentRequest] = useState({
    appointmentType: 'checkup',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '09:00',
    requiresTransport: false
  });

  // Mock data for patient appointments
  useEffect(() => {
    const mockAppointments = [
      {
        id: 'app-1',
        patientId: currentUser?.id || 'p1',
        patientName: currentUser?.username || 'Patient Name',
        patientAge: 72,
        hospitalId: 'h1',
        doctorId: 'd1',
        appointmentDate: new Date('2025-08-09'),
        appointmentTime: '09:00',
        appointmentType: 'checkup',
        status: 'pending',
        notes: 'checkup appointment',
        estimatedDuration: 30,
        requiresTransport: true,
        createdAt: new Date('2025-08-08'),
        updatedAt: new Date('2025-08-08')
      },
      {
        id: 'app-2',
        patientId: currentUser?.id || 'p1',
        patientName: currentUser?.username || 'Patient Name',
        patientAge: 72,
        hospitalId: 'h1',
        doctorId: 'd2',
        appointmentDate: new Date('2025-08-10'),
        appointmentTime: '09:00',
        appointmentType: 'checkup',
        status: 'pending',
        notes: 'Annual health checkup - diabetes monitoring',
        estimatedDuration: 45,
        requiresTransport: true,
        createdAt: new Date('2025-08-07'),
        updatedAt: new Date('2025-08-08')
      }
    ];
    setAppointments(mockAppointments);
  }, [currentUser]);

       // Check for appointments 1 hour before and show transport modal
    useEffect(() => {
      const checkUpcomingAppointments = () => {
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        
        const upcomingAppointments = appointments.filter(appointment => {
          const appointmentDateTime = new Date(appointment.appointmentDate);
          appointmentDateTime.setHours(
            parseInt(appointment.appointmentTime.split(':')[0]),
            parseInt(appointment.appointmentTime.split(':')[1])
          );
          
          return appointmentDateTime <= oneHourFromNow && 
                 appointmentDateTime > now && 
                 appointment.requiresTransport &&
                 appointment.status === 'approved';
        });

        if (upcomingAppointments.length > 0 && !selectedAppointmentForTransport) {
          setSelectedAppointmentForTransport(upcomingAppointments[0]);
          setShowTransportModal(true);
        }
      };

      // Check every 5 minutes
      const interval = setInterval(checkUpcomingAppointments, 5 * 60 * 1000);
      checkUpcomingAppointments(); // Check immediately

      return () => clearInterval(interval);
    }, [appointments, selectedAppointmentForTransport]);

      const handleRequestAppointment = () => {
    const newAppointment = {
      id: `app-${Date.now()}`,
      patientId: currentUser?.id || 'p1',
      patientName: currentUser?.username || 'Patient Name',
      patientAge: currentUser?.age || 70,
      hospitalId: 'h1',
      doctorId: 'd1',
      appointmentDate: new Date(newAppointmentRequest.preferredDate),
      appointmentTime: newAppointmentRequest.preferredTime,
      appointmentType: newAppointmentRequest.appointmentType,
      status: 'pending',
      notes: `${newAppointmentRequest.appointmentType} appointment`,
      estimatedDuration: 30,
      requiresTransport: newAppointmentRequest.requiresTransport,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setAppointments(prev => [newAppointment, ...prev]);
    setShowRequestForm(false);
    setNewAppointmentRequest({
      appointmentType: 'checkup',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '09:00',
      requiresTransport: false
    });
         alert('✅ Appointment request submitted! Waiting for doctor approval.');
   };

       const handleTransportArranged = (bookingDetails: GrabBookingResponse) => {
      if (selectedAppointmentForTransport) {
        setTransportBookings(prev => [...prev, {
          appointmentId: selectedAppointmentForTransport.id,
          bookingDetails
        }]);
        alert('🚗 Transport arranged! Grab will pick you up 30 minutes before your appointment.');
      }
    };

    const handleTransportModalClose = () => {
      setShowTransportModal(false);
      setSelectedAppointmentForTransport(null);
    };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // If in caregiver mode, show caregiver interface
  if (caregiverMode) {
    return (
      <CaregiverModeInterface
        parentId={caregiverMode.parentId}
        parentName={caregiverMode.parentName}
        childId={currentUser?.id || ''}
        onExitCaregiverMode={() => setCaregiverMode(null)}
      />
    );
  }

  return (
    <div className={`space-y-6 ${elderlyMode ? 'elderly-mode' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className={`font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : 'text-xl'}`}>
          Patient Dashboard
        </h2>
        <button
          onClick={() => setShowRequestForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'appointments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('transportation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transportation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>Transportation</span>
              {transportBookings.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {transportBookings.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('data-access')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'data-access'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Data Access</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'appointments' && (
        <>
          {/* Appointment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{appointments.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {appointments.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {appointments.filter(a => a.status === 'approved').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Transport</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {appointments.filter(a => a.requiresTransport).length}
          </p>
          {transportBookings.length > 0 && (
            <p className="text-xs text-purple-700 mt-1">
              {transportBookings.length} booked
            </p>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No appointments yet</p>
            <button
              onClick={() => setShowRequestForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Request Your First Appointment
            </button>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {appointment.appointmentType.charAt(0).toUpperCase() + appointment.appointmentType.slice(1)}
                  </h3>
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(appointment.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{formatTime(appointment.appointmentTime)} ({appointment.estimatedDuration} min)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>Room 302</span>
                </div>
              </div>

              {appointment.requiresTransport && (
                <div className="mt-3 p-2 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-purple-800">Transport requested</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAppointmentForTransport(appointment);
                        setShowTransportModal(true);
                      }}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Arrange Transport
                    </button>
                  </div>
                  
                  {/* Show transport booking details if available */}
                  {transportBookings.find(booking => booking.appointmentId === appointment.id) && (
                    <div className="mt-3 p-3 bg-white rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Transport Details</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          ✅ Booked
                        </span>
                      </div>
                      {(() => {
                        const booking = transportBookings.find(b => b.appointmentId === appointment.id);
                        if (!booking) return null;
                        
                        return (
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span>Driver:</span>
                              <span className="font-medium">{booking.bookingDetails.driverName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vehicle:</span>
                              <span>{booking.bookingDetails.vehicleNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Payment:</span>
                              <span className={`${
                                booking.bookingDetails.paymentStatus === 'paid' 
                                  ? 'text-green-600 font-medium' 
                                  : 'text-yellow-600'
                              }`}>
                                {booking.bookingDetails.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Arrival:</span>
                              <span className="font-medium text-purple-600">
                                {booking.bookingDetails.arrivalTime} min
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
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {appointment.status === 'pending' && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Waiting for doctor approval</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Transport Bookings Summary */}
      {transportBookings.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transport Bookings</h3>
          <div className="space-y-3">
            {transportBookings.map((booking) => {
              const appointment = appointments.find(a => a.id === booking.appointmentId);
              return (
                <div key={booking.bookingDetails.bookingId} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {appointment?.appointmentType} Appointment
                      </h4>
                      <p className="text-sm text-gray-600">
                        {appointment && formatDate(appointment.appointmentDate)} at {appointment && formatTime(appointment.appointmentTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        ✅ Booked
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Driver:</span>
                      <span className="ml-2 font-medium">{booking.bookingDetails.driverName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="ml-2">{booking.bookingDetails.vehicleNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment:</span>
                      <span className={`ml-2 ${
                        booking.bookingDetails.paymentStatus === 'paid' 
                          ? 'text-green-600 font-medium' 
                          : 'text-yellow-600'
                      }`}>
                        {booking.bookingDetails.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Arrival:</span>
                      <span className="ml-2 font-medium text-purple-600">
                        {booking.bookingDetails.arrivalTime} minutes
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fare:</span>
                                             <span className="ml-2 font-semibold">
                         {new Intl.NumberFormat('ms-MY', {
                           style: 'currency',
                           currency: 'MYR',
                         }).format(booking.bookingDetails.estimatedFare)}
                       </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Pickup:</span>
                      <span className="ml-2 text-xs truncate max-w-32">
                        {booking.bookingDetails.pickupAddress}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Booking ID: {booking.bookingDetails.bookingId}</span>
                      <span>Booked: {new Date(booking.bookingDetails.bookingTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Request Appointment Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                          <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Book Appointment</h3>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            
            <div className="space-y-4">
              {/* Patient Information Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{currentUser?.username || 'Patient Name'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <span className="ml-2 font-medium">{currentUser?.age || 70} years</span>
                  </div>
                </div>
              </div>



                              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Type
                  </label>
                  <select
                    value={newAppointmentRequest.appointmentType}
                    onChange={(e) => setNewAppointmentRequest(prev => ({ ...prev, appointmentType: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="checkup">Regular Checkup</option>
                    <option value="consultation">Medical Consultation</option>
                    <option value="follow-up">Follow-up Visit</option>
                    <option value="emergency">Emergency Care</option>
                  </select>
                </div>
              
                              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newAppointmentRequest.preferredDate}
                      onChange={(e) => setNewAppointmentRequest(prev => ({ ...prev, preferredDate: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={newAppointmentRequest.preferredTime}
                      onChange={(e) => setNewAppointmentRequest(prev => ({ ...prev, preferredTime: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requiresTransport"
                  checked={newAppointmentRequest.requiresTransport}
                  onChange={(e) => setNewAppointmentRequest(prev => ({ ...prev, requiresTransport: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="requiresTransport" className="text-sm text-gray-700">
                  I need transportation assistance
                </label>
              </div>
            </div>
            
                          <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleRequestAppointment}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
          </div>
                 </div>
       )}

        {/* Enhanced Transport Coordination Modal */}
        {showTransportModal && selectedAppointmentForTransport && (
          <TransportCoordination
            appointment={selectedAppointmentForTransport}
            onTransportArranged={handleTransportArranged}
            onClose={handleTransportModalClose}
            userRole={currentUser?.role === 'family_member' ? 'family_member' : (elderlyMode ? 'elderly' : 'patient')}
          />
        )}
        </>
      )}

      {/* Transportation Tab */}
      {activeTab === 'transportation' && (
        <TransportationTracking transportBookings={transportBookings} />
      )}

      {/* Data Access Tab */}
      {activeTab === 'data-access' && (
        <div className="space-y-6">
          <DataAccess elderlyMode={elderlyMode} />
        </div>
      )}

      {/* Caregiver Mode FAB - Only show if user has been granted caregiver access */}
      {!elderlyMode && currentUser?.role === 'family_member' && (
        <CaregiverModeFAB
          currentUserId={currentUser?.id || ''}
          onParentSelect={(parentId, parentName) => {
            setCaregiverMode({ parentId, parentName });
          }}
          currentCaregiverMode={caregiverMode}
        />
      )}
    </div>
  );
}
