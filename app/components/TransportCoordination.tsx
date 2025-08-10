'use client';

import React, { useState, useEffect } from 'react';
import { Car, MapPin, Clock, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { grabApiService, GrabServiceType, GrabBookingResponse } from '../services/grabApi';

interface TransportCoordinationProps {
  appointment: any;
  onTransportArranged: (bookingDetails: GrabBookingResponse) => void;
  onClose: () => void;
  userRole?: 'patient' | 'family_member' | 'elderly';
}

export default function TransportCoordination({ appointment, onTransportArranged, onClose, userRole = 'patient' }: TransportCoordinationProps) {
  const [step, setStep] = useState<'decision' | 'services' | 'booking' | 'confirmation'>('decision');
  const [elderlyDecision, setElderlyDecision] = useState<boolean | null>(null);
  const [familyDecision, setFamilyDecision] = useState<boolean | null>(null);
  const [availableServices, setAvailableServices] = useState<GrabServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<GrabServiceType | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<GrabBookingResponse | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  const pickupCoords = { lat: 3.1390, lng: 101.6869 }; // Kuala Lumpur
  const hospitalCoords = { lat: 3.0738, lng: 101.5183 }; // General Hospital KL

  useEffect(() => {
    if (step === 'services') {
      loadAvailableServices();
    }
  }, [step]);

  const loadAvailableServices = async () => {
    setLoading(true);
    try {
      const services = await grabApiService.getAvailableServices(
        pickupCoords.lat, pickupCoords.lng,
        hospitalCoords.lat, hospitalCoords.lng
      );
      setAvailableServices(services);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = (isElderly: boolean, decision: boolean) => {
    if (isElderly) {
      setElderlyDecision(decision);
    } else {
      setFamilyDecision(decision);
    }

    // For role-based interface, we only need one decision
    if (decision) {
      setStep('services');
    } else {
      alert('Transport declined. Please arrange your own transportation.');
      onClose();
    }
  };

  const handleServiceSelection = (service: GrabServiceType) => {
    setSelectedService(service);
    setStep('booking');
  };

  const handleBooking = async () => {
    if (!selectedService || !pickupAddress || !patientPhone) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const bookingRequest = {
        pickupLocation: {
          latitude: pickupCoords.lat,
          longitude: pickupCoords.lng,
          address: pickupAddress,
        },
                 dropoffLocation: {
           latitude: hospitalCoords.lat,
           longitude: hospitalCoords.lng,
           address: 'General Hospital Kuala Lumpur',
         },
        passengerName: appointment.patientName,
        passengerPhone: patientPhone,
        appointmentTime: new Date(appointment.appointmentDate).toISOString(),
        estimatedDuration: 30,
      };

      const booking = await grabApiService.bookTransportation(bookingRequest);
      setBookingDetails(booking);
      setStep('confirmation');
      onTransportArranged(booking);
    } catch (error) {
      console.error('Error booking transport:', error);
      alert('Failed to book transportation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  // Demo fill function for MVP demonstration
  const handleDemoFill = () => {
    setPickupAddress('123 Jalan Ampang, Kuala Lumpur, Malaysia');
    setPatientPhone('+60123456789');
  };

  // Quick demo decision for MVP demonstration
  const handleQuickDemo = () => {
    setElderlyDecision(true);
    setFamilyDecision(true);
    setStep('services');
  };

  // Quick service selection for MVP demonstration
  const handleQuickServiceSelection = () => {
    if (availableServices.length > 0) {
      handleServiceSelection(availableServices[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold">Transport Coordination</h3>
              <p className="text-sm text-gray-600">Grab Transportation Service</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>

        {step === 'decision' && (
          <div className="space-y-6">
            {/* Quick Demo Button */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-lg">⚡</span>
                  <span className="text-green-800 text-sm font-medium">Quick Demo</span>
                </div>
                <button
                  onClick={handleQuickDemo}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Auto Accept Transport
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-700 mb-4">Would you like Grab transportation for your appointment?</p>
            </div>
            
            {/* Show different interface based on user role */}
            {(userRole === 'patient' || userRole === 'elderly') && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Patient Decision:</h4>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDecision(true, true)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                      elderlyDecision === true ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Yes, I want transport
                  </button>
                  <button
                    onClick={() => handleDecision(true, false)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                      elderlyDecision === false ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    No, I&apos;ll arrange my own
                  </button>
                </div>
              </div>
            )}
            
            {userRole === 'family_member' && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Family Member Decision:</h4>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDecision(false, true)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                      familyDecision === true ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Yes, arrange transport
                  </button>
                  <button
                    onClick={() => handleDecision(false, false)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium ${
                      familyDecision === false ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    No, we&apos;ll handle it
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'services' && (
          <div className="space-y-6">
            {/* Quick Service Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">🚗</span>
                  <span className="text-blue-800 text-sm font-medium">Quick Selection</span>
                </div>
                <button
                  onClick={handleQuickServiceSelection}
                  disabled={availableServices.length === 0}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Select First Service
                </button>
              </div>
            </div>
            
            <h4 className="font-medium mb-4">Choose Transportation Service</h4>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading available services...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelection(service)}
                    className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{service.name}</h5>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.estimatedTime} min
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(service.estimatedFare)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'booking' && selectedService && (
          <div className="space-y-6">
            <h4 className="font-medium mb-4">Booking Details</h4>
            
            {/* Demo Fill Button */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600 text-lg">🚀</span>
                  <span className="text-yellow-800 text-sm font-medium">MVP Demo</span>
                </div>
                <button
                  onClick={handleDemoFill}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Demo Fill
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address *</label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Enter your pickup address"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">Service Summary</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fare:</span>
                    <span className="font-semibold">{formatCurrency(selectedService.estimatedFare)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStep('services')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                disabled={loading || !pickupAddress || !patientPhone}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}

        {step === 'confirmation' && bookingDetails && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-green-600 mb-2">Transportation Booked!</h4>
              <p className="text-gray-600">Your Grab ride has been confirmed</p>
            </div>
            
            {/* Payment Status */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium mb-3">Payment Status</h5>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bookingDetails.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {bookingDetails.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">Amount:</span>
                <span className="font-semibold">{formatCurrency(bookingDetails.estimatedFare)}</span>
              </div>
            </div>

            {/* Arrival Information */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium mb-3">Arrival Information</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Driver arrival in:</span>
                  <span className="font-semibold text-purple-800">{bookingDetails.arrivalTime} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pickup time:</span>
                  <span>{new Date(bookingDetails.estimatedPickupTime).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pickup address:</span>
                  <span className="text-right max-w-xs truncate">{bookingDetails.pickupAddress}</span>
                </div>
              </div>
            </div>

            {/* Driver Details */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium mb-3">Driver Details</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-mono">{bookingDetails.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Driver:</span>
                  <span>{bookingDetails.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span>{bookingDetails.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{bookingDetails.driverPhone}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
