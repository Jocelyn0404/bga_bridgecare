# Grab API Integration Setup Guide

This guide explains how to integrate Grab's transportation API with your DevMatch application.

## 🚀 Features

- **Real-time Transportation Booking**: Book Grab rides directly from the app
- **Service Selection**: Choose from GrabCar, GrabTaxi, or GrabBike
- **Fare Estimation**: Get real-time fare estimates
- **Driver Information**: Receive driver details and vehicle information
- **Booking Management**: Track and manage transportation bookings

## 📋 Prerequisites

1. **Grab Partner Account**: Sign up for Grab's Partner Program
2. **API Credentials**: Obtain your API key and Partner ID from Grab
3. **Environment Setup**: Configure your development environment

## 🔧 Setup Instructions

### 1. Grab Partner Registration

1. Visit [Grab Partner Portal](https://partner.grab.com)
2. Create a partner account
3. Apply for API access
4. Wait for approval and receive your credentials

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```bash
# Grab API Configuration
GRAB_API_KEY=your-grab-api-key-here
GRAB_PARTNER_ID=your-partner-id-here
GRAB_API_BASE_URL=https://partner-api.grab.com

# Optional: For development/testing
GRAB_SANDBOX_MODE=true
GRAB_MOCK_RESPONSES=true
```

### 3. API Endpoints Used

The integration uses the following Grab API endpoints:

- **GET /v2/transport/quote** - Get fare estimates and available services
- **POST /v2/transport/book** - Book transportation
- **GET /v2/transport/book/{id}** - Get booking status
- **POST /v2/transport/book/{id}/cancel** - Cancel booking

### 4. Service Types Available

- **GRAB_CAR**: Comfortable sedan with professional driver
- **GRAB_TAXI**: Traditional taxi service
- **GRAB_BIKE**: Fast motorcycle service

## 🛠️ Implementation Details

### Service Architecture

```
app/services/grabApi.ts          # Main API service
app/components/TransportCoordination.tsx  # UI component
```

### Key Features

1. **Multi-step Booking Process**:
   - Decision making (elderly + family)
   - Service selection
   - Booking details
   - Confirmation

2. **Error Handling**:
   - Fallback to mock data in development
   - Graceful error handling
   - User-friendly error messages

3. **Real-time Updates**:
   - Live fare estimates
   - Booking status tracking
   - Driver information updates

## 🧪 Testing

### Development Mode

In development, the service uses mock data:

```typescript
// Mock services for testing
const mockServices = [
  {
    id: 'GRAB_CAR',
    name: 'GrabCar',
    description: 'Comfortable sedan with professional driver',
    estimatedFare: 25000,
    estimatedTime: 15,
  },
  // ... more services
];
```

### Production Mode

In production, real API calls are made:

```typescript
const services = await grabApiService.getAvailableServices(
  pickupLat, pickupLng,
  dropoffLat, dropoffLng
);
```

## 🔒 Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Environment Variables**: Use `.env.local` for sensitive data
3. **Request Validation**: Validate all user inputs
4. **Rate Limiting**: Implement appropriate rate limiting

## 📱 Usage Example

```typescript
import { grabApiService } from '../services/grabApi';

// Get available services
const services = await grabApiService.getAvailableServices(
  -6.2088, 106.8456,  // Pickup coordinates (Jakarta)
  -6.1751, 106.8650   // Dropoff coordinates (Hospital)
);

// Book transportation
const booking = await grabApiService.bookTransportation({
  pickupLocation: {
    latitude: -6.2088,
    longitude: 106.8456,
    address: "Patient's home address"
  },
  dropoffLocation: {
    latitude: -6.1751,
    longitude: 106.8650,
    address: "General Hospital Jakarta"
  },
  passengerName: "John Doe",
  passengerPhone: "+62-812-3456-7890",
  appointmentTime: "2025-08-09T09:00:00Z",
  estimatedDuration: 30
});
```

## 🚨 Troubleshooting

### Common Issues

1. **API Key Invalid**: Check your API key and Partner ID
2. **CORS Errors**: Ensure proper headers are set
3. **Rate Limiting**: Implement exponential backoff
4. **Network Issues**: Add retry logic for failed requests

### Debug Mode

Enable debug logging:

```typescript
// In grabApi.ts
console.log('Grab API Request:', requestData);
console.log('Grab API Response:', responseData);
```

## 📞 Support

- **Grab Partner Support**: [partner.grab.com/support](https://partner.grab.com/support)
- **API Documentation**: [developer.grab.com](https://developer.grab.com)
- **Community Forum**: [community.grab.com](https://community.grab.com)

## 🔄 Updates

Keep your integration updated:

1. Monitor Grab's API changelog
2. Update dependencies regularly
3. Test thoroughly after updates
4. Maintain backward compatibility

## 📄 License

This integration follows Grab's Partner Terms of Service. Please review their terms before using in production.

