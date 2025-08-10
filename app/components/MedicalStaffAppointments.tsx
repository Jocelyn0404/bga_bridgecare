'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, CheckCircle, XCircle, AlertCircle, Phone } from 'lucide-react';
import { User as UserType } from '../types';
import { Appointment } from '../types/medical';

interface MedicalStaffAppointmentsProps {
  currentUser: UserType | null;
  elderlyMode?: boolean;
}

export default function MedicalStaffAppointments({ currentUser, elderlyMode = false }: MedicalStaffAppointmentsProps) {
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

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(appointment => appointment.status === statusFilter));
    }
  }, [appointments, statusFilter]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      // Mock data for doctor's view of patient appointments including pending ones
      const mockAppointments: Appointment[] = [
        {
          id: 'app-1',
          patientId: 'patient1',
          patientName: 'Lim Ah Kow',
          patientAge: 72,
          hospitalId: 'h1',
          doctorId: currentUser?.id || 'd1',
          appointmentDate: new Date('2025-08-09'),
          appointmentTime: '09:00',
          appointmentType: 'checkup',
          status: 'scheduled',
          notes: 'checkup appointment',
          estimatedDuration: 30,
          requiresTransport: true,
          createdAt: new Date('2025-08-08'),
          updatedAt: new Date('2025-08-08')
        },
        {
          id: 'app-2',
          patientId: 'patient2',
          patientName: 'lalabu',
          patientAge: 72,
          hospitalId: 'h1',
          doctorId: currentUser?.id || 'd1',
          appointmentDate: new Date('2025-08-10'),
          appointmentTime: '09:00',
          appointmentType: 'checkup',
          status: 'scheduled',
          notes: 'Annual health checkup - diabetes monitoring',
          estimatedDuration: 45,
          requiresTransport: true,
          createdAt: new Date('2025-08-07'),
          updatedAt: new Date('2025-08-08')
        },
        {
          id: 'app-3',
          patientId: 'patient3',
          patientName: 'Sarah Johnson',
          patientAge: 68,
          hospitalId: 'h1',
          doctorId: currentUser?.id || 'd1',
          appointmentDate: new Date('2025-08-12'),
          appointmentTime: '10:30',
          appointmentType: 'consultation',
          status: 'confirmed',
          notes: 'Follow-up consultation - blood pressure review',
          estimatedDuration: 30,
          requiresTransport: false,
          createdAt: new Date('2025-08-07'),
          updatedAt: new Date('2025-08-08')
        }
      ];

      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    console.log(`Appointment ${appointmentId} status updated to: ${newStatus}`);
    
    if (newStatus === 'approved') {
      alert('✅ Appointment approved! Patient will be notified.');
    } else if (newStatus === 'rejected') {
      alert('❌ Appointment rejected. Patient will be notified.');
    } else if (newStatus === 'completed') {
      alert('✅ Appointment marked as completed!');
    } else if (newStatus === 'cancelled') {
      alert('❌ Appointment cancelled!');
    }
    
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus as any, updatedAt: new Date() }
          : appointment
      )
    );
    setFilteredAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus as any, updatedAt: new Date() }
          : appointment
      )
    );
  };

  const callNextPatient = async (appointmentId: string, patientName: string) => {
    setCurrentPatient(appointmentId);
    alert(`📞 Calling ${patientName} to Room 302`);
    // In a real app, this would trigger a notification system
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.patientAge) {
      alert('Please fill in patient name and age');
      return;
    }

    const appointment: Appointment = {
      id: `app-${Date.now()}`,
      patientId: `patient-${Date.now()}`,
      patientName: newAppointment.patientName,
      patientAge: parseInt(newAppointment.patientAge),
      hospitalId: 'h1',
      doctorId: currentUser?.id || 'd1',
      appointmentDate: new Date(newAppointment.appointmentDate),
      appointmentTime: newAppointment.appointmentTime,
      appointmentType: newAppointment.appointmentType as any,
      status: 'scheduled',
      notes: `${newAppointment.appointmentType} appointment`,
      estimatedDuration: 30,
      requiresTransport: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setAppointments(prev => [appointment, ...prev]);
    setFilteredAppointments(prev => [appointment, ...prev]);
    
    // Reset form
    setNewAppointment({
      patientName: '',
      patientAge: '',
      appointmentType: 'checkup',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '09:00'
    });
    setShowNewAppointmentForm(false);
    alert('✅ New appointment created successfully!');
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
            Patient Appointments
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowNewAppointmentForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 bg-white"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filter
              </button>
            )}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium">Total Today</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-1">{filteredAppointments.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="font-medium">Pending Approval</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {filteredAppointments.filter(a => a.status === 'scheduled').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium">Approved</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {filteredAppointments.filter(a => a.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-600 mt-1">
              {filteredAppointments.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* New Appointment Form Modal */}
        {showNewAppointmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Appointment</h3>
                <button
                  onClick={() => setShowNewAppointmentForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter patient name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Age *
                  </label>
                  <input
                    type="number"
                    value={newAppointment.patientAge}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, patientAge: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="h1">General Hospital</option>
                    <option value="h2">Specialty Medical Center</option>
                    <option value="h3">Community Health Clinic</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Type
                  </label>
                  <select
                    value={newAppointment.appointmentType}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, appointmentType: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="checkup">Regular Checkup</option>
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newAppointment.appointmentDate}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, appointmentDate: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={newAppointment.appointmentTime}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, appointmentTime: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreateAppointment}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Appointment
                </button>
                <button
                  onClick={() => setShowNewAppointmentForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
              currentPatient === appointment.id ? 'border-blue-500 bg-blue-50' : ''
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold">{appointment.patientName}</h4>
                    <span className="text-gray-500">({appointment.patientAge} years)</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{appointment.appointmentType} - {appointment.notes}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {appointment.appointmentTime} ({appointment.estimatedDuration} min)
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Room 302
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {/* Approval buttons for pending appointments */}
                  {appointment.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="h-3 w-3 inline mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {/* Call Patient button - only show if confirmed */}
                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => callNextPatient(appointment.id, appointment.patientName || 'Patient')}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Phone className="h-3 w-3 inline mr-1" />
                      Call Patient
                    </button>
                  )}
                  
                  {/* Complete button - only show if confirmed */}
                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
