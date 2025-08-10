'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Car, MapPin, Clock, Navigation, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { grabApiService, LiveTrackingData, GrabBookingResponse } from '../services/grabApi';

interface TransportationTrackingProps {
  transportBookings: {
    appointmentId: string;
    bookingDetails: GrabBookingResponse;
  }[];
}

export default function TransportationTracking({ transportBookings }: TransportationTrackingProps) {
  const [activeTracking, setActiveTracking] = useState<LiveTrackingData | null>(null);
  const [trackingInterval, setTrackingInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Start tracking for a specific booking
  const startTracking = async (bookingId: string) => {
    setSelectedBooking(bookingId);
    
    // Clear existing interval
    if (trackingInterval) {
      clearInterval(trackingInterval);
    }

    // Get initial tracking data
    const trackingData = await grabApiService.getLiveTracking(bookingId);
    setActiveTracking(trackingData);

    // Set up real-time updates every 10 seconds
    const interval = setInterval(async () => {
      const updatedTracking = await grabApiService.getLiveTracking(bookingId);
      setActiveTracking(updatedTracking);
    }, 10000);

    setTrackingInterval(interval);
  };

  // Stop tracking
  const stopTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
    setActiveTracking(null);
    setSelectedBooking(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [trackingInterval]);

  // Initialize map (mock implementation)
  useEffect(() => {
    if (mapRef.current && activeTracking) {
      // In a real implementation, you would initialize Google Maps or another mapping service here
      // For now, we'll create a simple visual representation
      mapRef.current.innerHTML = `
        <div style="
          width: 100%; 
          height: 300px; 
          background: linear-gradient(45deg, #e3f2fd, #bbdefb);
          border-radius: 8px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1976d2;
          font-weight: bold;
        ">
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
            <div>Live Driver Location</div>
            <div style="font-size: 12px; margin-top: 4px; opacity: 0.7;">
              Lat: ${activeTracking.driverLocation.latitude.toFixed(4)}<br/>
              Lng: ${activeTracking.driverLocation.longitude.toFixed(4)}
            </div>
          </div>
        </div>
      `;
    }
  }, [activeTracking]);

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_route': return 'text-blue-600';
      case 'arrived': return 'text-green-600';
      case 'picked_up': return 'text-purple-600';
      case 'completed': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_route': return <Navigation className="h-4 w-4" />;
      case 'arrived': return <MapPin className="h-4 w-4" />;
      case 'picked_up': return <Car className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transportation Tracking</h2>
          <p className="text-sm text-gray-600">Live tracking of your Grab rides</p>
        </div>
        {activeTracking && (
          <button
            onClick={stopTracking}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Stop Tracking
          </button>
        )}
      </div>

      {/* Active Bookings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transportBookings.map((booking) => (
          <div
            key={booking.bookingDetails.bookingId}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedBooking === booking.bookingDetails.bookingId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => startTracking(booking.bookingDetails.bookingId)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">Booking #{booking.bookingDetails.bookingId.slice(-6)}</h3>
                <p className="text-sm text-gray-600">{booking.bookingDetails.driverName}</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Active
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span>{booking.bookingDetails.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{booking.bookingDetails.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fare:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('ms-MY', {
                    style: 'currency',
                    currency: 'MYR',
                  }).format(booking.bookingDetails.estimatedFare)}
                </span>
              </div>
            </div>

            <button
              className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              onClick={(e) => {
                e.stopPropagation();
                startTracking(booking.bookingDetails.bookingId);
              }}
            >
              Track Driver
            </button>
          </div>
        ))}
      </div>

      {/* Live Tracking Section */}
      {activeTracking && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Driver Tracking</h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(activeTracking.currentStatus)}
              <span className={`font-medium ${getStatusColor(activeTracking.currentStatus)}`}>
                {activeTracking.currentStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Map Container */}
          <div ref={mapRef} className="mb-6"></div>

          {/* Tracking Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Driver Location</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Latitude:</span>
                  <span className="font-mono">{activeTracking.driverLocation.latitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Longitude:</span>
                  <span className="font-mono">{activeTracking.driverLocation.longitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span>{activeTracking.driverLocation.speed.toFixed(1)} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Heading:</span>
                  <span>{activeTracking.driverLocation.heading.toFixed(0)}°</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Arrival Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="font-semibold">{formatDistance(activeTracking.distanceRemaining)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ETA:</span>
                  <span>{formatTime(activeTracking.estimatedArrivalTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated:</span>
                  <span>{formatTime(activeTracking.driverLocation.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  <Phone className="h-4 w-4" />
                  <span>Call Driver</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Updates Indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates every 10 seconds</span>
          </div>
        </div>
      )}

      {/* No Active Tracking */}
      {!activeTracking && transportBookings.length > 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tracking</h3>
          <p className="text-gray-600 mb-4">Select a booking above to start live tracking</p>
        </div>
      )}

      {/* No Bookings */}
      {transportBookings.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Transportation Bookings</h3>
          <p className="text-gray-600">You don&apos;t have any active transportation bookings to track</p>
        </div>
      )}
    </div>
  );
}

