# Blockchain-Based Data Access Control System

## Overview

This system implements a comprehensive role-based data access control mechanism for family healthcare data management. It allows family members to request access to elderly family members' healthcare data while ensuring transparency and security through blockchain integration.

## Features

### 🔐 Role-Based Access Control
- **Elderly Users**: Can approve/deny access requests from family members
- **Family Members**: Can request access to elderly family members' data
- **Different UI**: Tailored interfaces for each user role

### ⛓️ Blockchain Integration
- All access requests, approvals, and denials are stored on blockchain
- Immutable audit trail with transaction IDs
- Mock blockchain implementation for development
- Real blockchain support (MetaMask integration ready)

### 📊 Real-time Status Tracking
- Pending requests management
- Access logs with timestamps
- Response time tracking
- Status notifications

### 🛡️ Security & Transparency
- Encrypted data transmission
- Blockchain transaction verification
- Complete audit trail
- User consent management

## System Architecture

### Components

1. **DataAccess.tsx** - Main component with role-based logic
2. **PendingRequestsList.tsx** - Displays and manages pending requests
3. **RequestAccessForm.tsx** - Form for family members to request access
4. **blockchainService.ts** - Handles all blockchain interactions
5. **data-access-demo.tsx** - Demo page with user switching

### Data Structures

#### DataAccessRequest
```typescript
interface DataAccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  elderlyId: string;
  elderlyName: string;
  dataType: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  respondedAt?: string;
  respondedBy?: string;
  notes?: string;
  blockchainTxId?: string;
}
```

#### AccessLog
```typescript
interface AccessLog {
  id: string;
  requesterId: string;
  requesterName: string;
  elderlyId: string;
  elderlyName: string;
  dataType: string;
  action: 'granted' | 'revoked';
  timestamp: string;
  blockchainTxId?: string;
  transactionHash?: string;
}
```

## Usage Guide

### For Family Members

1. **Request Access**
   - Click "Request Access from Elderly" button
   - Fill in elderly family member's information
   - Select data type (medical records, appointments, etc.)
   - Provide reason for access request
   - Submit request (stored on blockchain)

2. **Track Requests**
   - View "My Requests" tab
   - See status of pending requests
   - Check response times
   - View approval/denial reasons

### For Elderly Users

1. **Review Requests**
   - View "Pending Requests" tab
   - See all incoming access requests
   - Review requester details and reasons

2. **Approve/Deny**
   - Click "Approve Access" to grant permission
   - Click "Deny Access" to reject (with optional notes)
   - All decisions stored on blockchain

3. **Monitor Access**
   - Check "Access Logs" tab
   - View complete audit trail
   - See blockchain transaction IDs

## Blockchain Integration

### Mock Blockchain (Development)
- Simulates blockchain transactions
- Generates mock transaction IDs
- Provides realistic response times
- Logs all operations to console

### Real Blockchain (Production)
- MetaMask integration ready
- Ethereum/Polygon compatible
- Smart contract integration
- Real transaction hashes

### Blockchain Operations

1. **createAccessRequest()** - Creates new access request
2. **approveAccessRequest()** - Approves request and creates access log
3. **denyAccessRequest()** - Denies request with optional notes
4. **revokeAccess()** - Revokes previously granted access
5. **getAccessLogs()** - Retrieves access history
6. **getPendingRequests()** - Gets pending requests

## Installation & Setup

### Prerequisites
- Node.js 18+
- Next.js 13+
- Tailwind CSS
- Lucide React (for icons)

### Installation
```bash
npm install
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_BLOCKCHAIN_NETWORK=ethereum
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## API Endpoints (Future Implementation)

### Access Control API
```typescript
// Create access request
POST /api/access-control/request
{
  elderlyId: string;
  elderlyName: string;
  dataType: string;
  reason: string;
}

// Get pending requests
GET /api/access-control/pending/:userId

// Approve/deny request
POST /api/access-control/respond
{
  requestId: string;
  status: 'approved' | 'denied';
  notes?: string;
}

// Get access logs
GET /api/access-control/logs/:userId
```

## Security Considerations

### Data Privacy
- All personal data encrypted in transit
- Blockchain transactions contain only metadata
- Sensitive data stored separately from blockchain
- User consent required for all operations

### Access Control
- Role-based permissions
- Elderly user must approve all requests
- Access can be revoked at any time
- Complete audit trail maintained

### Blockchain Security
- Transaction verification
- Immutable audit logs
- Smart contract security
- Gas optimization

## Demo Usage

1. **Start the demo**
   ```bash
   npm run dev
   # Navigate to /demo/data-access-demo
   ```

2. **Switch between users**
   - Use the user switcher at the top
   - Test both elderly and family member perspectives

3. **Test the workflow**
   - Create access requests as family member
   - Approve/deny requests as elderly user
   - Check access logs and blockchain transactions

## Future Enhancements

### Planned Features
- [ ] Real blockchain integration (Ethereum/Polygon)
- [ ] Smart contract deployment
- [ ] Mobile app support
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with healthcare systems

### Technical Improvements
- [ ] Web3.js integration
- [ ] MetaMask wallet connection
- [ ] Gas fee optimization
- [ ] Batch transaction support
- [ ] Off-chain data storage
- [ ] IPFS integration for large files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact the development team or create an issue in the repository.

