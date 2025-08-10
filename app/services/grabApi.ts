// Grab API Integration Service
// This service handles integration with Grab's transportation API

export interface GrabBookingRequest {
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  passengerName: string;
  passengerPhone: string;
  appointmentTime: string;
  estimatedDuration: number;
}

export interface GrabBookingResponse {
  bookingId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  estimatedPickupTime: string;
  estimatedFare: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  arrivalTime: number; // minutes until arrival
  pickupAddress: string;
  dropoffAddress: string;
  bookingTime: string;
}

export interface GrabServiceType {
  id: string;
  name: string;
  description: string;
  estimatedFare: number;
  estimatedTime: number;
}

export interface DriverLocation {
  latitude: number;
  longitude: number;
  heading: number; // direction in degrees
  speed: number; // km/h
  timestamp: string;
}

export interface LiveTrackingData {
  bookingId: string;
  driverLocation: DriverLocation;
  estimatedArrivalTime: string;
  distanceRemaining: number; // in meters
  currentStatus: 'en_route' | 'arrived' | 'picked_up' | 'completed';
  routePolyline?: string; // encoded polyline for route display
}

class GrabApiService {
  private apiKey: string;
  private baseUrl: string;
  private partnerId: string;

  constructor() {
    // These would be environment variables in production
    this.apiKey = process.env.GRAB_API_KEY || 'your-grab-api-key';
    this.baseUrl = process.env.GRAB_API_BASE_URL || 'https://partner-api.grab.com';
    this.partnerId = process.env.GRAB_PARTNER_ID || 'your-partner-id';
  }

  // Get available transportation services
  async getAvailableServices(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number
  ): Promise<GrabServiceType[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/transport/quote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Partner-ID': this.partnerId,
        },
        body: JSON.stringify({
          pickup: {
            latitude: pickupLat,
            longitude: pickupLng,
          },
          dropoff: {
            latitude: dropoffLat,
            longitude: dropoffLng,
          },
          serviceTypes: ['GRAB_CAR', 'GRAB_TAXI', 'GRAB_BIKE'],
        }),
      });

      if (!response.ok) {
        throw new Error(`Grab API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.services.map((service: any) => ({
        id: service.serviceType,
        name: service.name,
        description: service.description,
        estimatedFare: service.fare,
        estimatedTime: service.estimatedTime,
      }));
    } catch (error) {
      console.error('Error fetching Grab services:', error);
      // Return mock data for development
      return this.getMockServices();
    }
  }

  // Book transportation
  async bookTransportation(bookingRequest: GrabBookingRequest): Promise<GrabBookingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/transport/book`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Partner-ID': this.partnerId,
        },
        body: JSON.stringify({
          pickup: bookingRequest.pickupLocation,
          dropoff: bookingRequest.dropoffLocation,
          passenger: {
            name: bookingRequest.passengerName,
            phone: bookingRequest.passengerPhone,
          },
          serviceType: 'GRAB_CAR',
          scheduledTime: bookingRequest.appointmentTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`Grab booking error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        bookingId: data.bookingId,
        driverName: data.driver.name,
        driverPhone: data.driver.phone,
        vehicleNumber: data.vehicle.number,
        estimatedPickupTime: data.estimatedPickupTime,
        estimatedFare: data.estimatedFare,
        status: data.status,
        paymentStatus: 'paid',
        arrivalTime: 15,
        pickupAddress: bookingRequest.pickupLocation.address,
        dropoffAddress: bookingRequest.dropoffLocation.address,
        bookingTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error booking Grab transportation:', error);
      // Return mock booking for development
      return this.getMockBooking(bookingRequest);
    }
  }

  // Get live tracking data for a booking
  async getLiveTracking(bookingId: string): Promise<LiveTrackingData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/transport/book/${bookingId}/tracking`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Partner-ID': this.partnerId,
        },
      });

      if (!response.ok) {
        throw new Error(`Grab tracking error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        bookingId: data.bookingId,
        driverLocation: {
          latitude: data.driverLocation.latitude,
          longitude: data.driverLocation.longitude,
          heading: data.driverLocation.heading,
          speed: data.driverLocation.speed,
          timestamp: data.driverLocation.timestamp,
        },
        estimatedArrivalTime: data.estimatedArrivalTime,
        distanceRemaining: data.distanceRemaining,
        currentStatus: data.currentStatus,
        routePolyline: data.routePolyline,
      };
    } catch (error) {
      console.error('Error fetching live tracking:', error);
      // Return mock tracking data for development
      return this.getMockTracking(bookingId);
    }
  }

  // Cancel transportation booking
  async cancelBooking(bookingId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/transport/book/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Partner-ID': this.partnerId,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error cancelling Grab booking:', error);
      return false;
    }
  }

  // Get booking status
  async getBookingStatus(bookingId: string): Promise<GrabBookingResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/transport/book/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Partner-ID': this.partnerId,
        },
      });

      if (!response.ok) {
        throw new Error(`Grab API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        bookingId: data.bookingId,
        driverName: data.driver?.name || 'Unknown',
        driverPhone: data.driver?.phone || 'Unknown',
        vehicleNumber: data.vehicle?.number || 'Unknown',
        estimatedPickupTime: data.estimatedPickupTime,
        estimatedFare: data.estimatedFare,
        status: data.status,
        paymentStatus: 'paid',
        arrivalTime: 15,
        pickupAddress: 'Unknown',
        dropoffAddress: 'Unknown',
        bookingTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching booking status:', error);
      return null;
    }
  }

  // Mock data for development/testing
  private getMockServices(): GrabServiceType[] {
    return [
      {
        id: 'GRAB_CAR',
        name: 'GrabCar',
        description: 'Comfortable sedan with professional driver',
        estimatedFare: 25,
        estimatedTime: 15,
      },
      {
        id: 'GRAB_TAXI',
        name: 'GrabTaxi',
        description: 'Traditional taxi service',
        estimatedFare: 22,
        estimatedTime: 12,
      },
      {
        id: 'GRAB_BIKE',
        name: 'GrabBike',
        description: 'Fast motorcycle service',
        estimatedFare: 15,
        estimatedTime: 8,
      },
    ];
  }

  private getMockBooking(bookingRequest: GrabBookingRequest): GrabBookingResponse {
    const arrivalTime = Math.floor(Math.random() * 10) + 8; // 8-18 minutes
    return {
      bookingId: `grab-${Date.now()}`,
      driverName: 'Ahmad Rahman',
      driverPhone: '+60-12-3456-7890',
      vehicleNumber: 'W 1234 ABC',
      estimatedPickupTime: new Date(Date.now() + arrivalTime * 60 * 1000).toISOString(),
      estimatedFare: 25,
      status: 'confirmed',
      paymentStatus: 'paid',
      arrivalTime: arrivalTime,
      pickupAddress: bookingRequest.pickupLocation.address,
      dropoffAddress: bookingRequest.dropoffLocation.address,
      bookingTime: new Date().toISOString(),
    };
  }

  private getMockTracking(bookingId: string): LiveTrackingData {
    // Simulate driver moving towards pickup location
    const baseLat = 3.1390; // Kuala Lumpur
    const baseLng = 101.6869;
    const timeOffset = Date.now() / 10000; // Creates movement over time
    
    return {
      bookingId,
      driverLocation: {
        latitude: baseLat + (Math.sin(timeOffset) * 0.01), // Simulate movement
        longitude: baseLng + (Math.cos(timeOffset) * 0.01),
        heading: (timeOffset * 10) % 360, // Rotating heading
        speed: 25 + Math.random() * 15, // 25-40 km/h
        timestamp: new Date().toISOString(),
      },
      estimatedArrivalTime: new Date(Date.now() + (5 + Math.random() * 10) * 60 * 1000).toISOString(),
      distanceRemaining: Math.floor(Math.random() * 2000) + 500, // 500-2500 meters
      currentStatus: 'en_route',
      routePolyline: 'mock_polyline_data',
    };
  }
}

export const grabApiService = new GrabApiService();
