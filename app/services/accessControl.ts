// Access Control Service for Parent-Child Account Linking
// This service handles caregiver access requests, approvals, and role-based permissions

export interface AccessRequest {
  id: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  parentIcNumber: string;
  relationship: string;
  status: 'pending' | 'approved' | 'rejected' | 'revoked';
  requestedAt: string;
  respondedAt?: string;
  respondedBy?: string;
  notes?: string;
}

export interface CaregiverLink {
  id: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  parentIcNumber: string;
  relationship: string;
  permissions: CaregiverPermission[];
  linkedAt: string;
  lastAccessedAt?: string;
  isActive: boolean;
}

export interface CaregiverPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'read' | 'write' | 'approve' | 'manage';
  isGranted: boolean;
}

export interface ParentProfile {
  id: string;
  name: string;
  age: number;
  icNumber: string;
  profilePicture?: string;
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: string;
  medicalConditions?: string[];
}

class AccessControlService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  // Request caregiver access (Child's side)
  async requestCaregiverAccess(
    parentIcNumber: string,
    parentName: string,
    relationship: string,
    childId: string,
    childName: string
  ): Promise<AccessRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/access-control/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentIcNumber,
          parentName,
          relationship,
          childId,
          childName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Access request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error requesting caregiver access:', error);
      // Return mock data for development
      return this.getMockAccessRequest(parentIcNumber, parentName, relationship, childId, childName);
    }
  }

  // Get pending access requests (Parent's side)
  async getPendingAccessRequests(parentId: string): Promise<AccessRequest[]> {
    try {
      const response = await fetch(`${this.baseUrl}/access-control/pending/${parentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pending requests: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      // Return mock data for development
      const mockRequests = this.getMockPendingRequests();
      const filteredRequests = mockRequests.filter(req => req.parentId === parentId && req.status === 'pending');
      console.log('Mock requests for parentId:', parentId, 'Filtered requests:', filteredRequests);
      return filteredRequests;
    }
  }

  // Respond to access request (Parent's side)
  async respondToAccessRequest(
    requestId: string,
    status: 'approved' | 'rejected',
    parentId: string,
    notes?: string
  ): Promise<AccessRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/access-control/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          status,
          parentId,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to respond to request: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error responding to access request:', error);
      // Return mock data for development
      return this.getMockAccessResponse(requestId, status, parentId, notes);
    }
  }

  // Get active caregiver links (Child's side)
  async getActiveCaregiverLinks(childId: string): Promise<CaregiverLink[]> {
    try {
      const response = await fetch(`${this.baseUrl}/access-control/links/${childId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch caregiver links: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching caregiver links:', error);
      // Return mock data for development
      return this.getMockCaregiverLinks().filter(link => link.childId === childId && link.isActive);
    }
  }

  // Revoke caregiver access (Parent's side)
  async revokeCaregiverAccess(linkId: string, parentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/access-control/revoke`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkId,
          parentId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error revoking caregiver access:', error);
      // Return mock success for development
      return true;
    }
  }

  // Get parent profile (Child's side - when in caregiver mode)
  async getParentProfile(parentId: string, childId: string): Promise<ParentProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/access-control/parent/${parentId}?childId=${childId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch parent profile: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching parent profile:', error);
      // Return mock data for development
      return this.getMockParentProfile();
    }
  }

  // Check permission for specific resource
  async checkPermission(
    childId: string,
    parentId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/access-control/permission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId,
          parentId,
          resource,
          action,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.hasPermission;
    } catch (error) {
      console.error('Error checking permission:', error);
      // Return mock permission for development
      return true;
    }
  }

  private getMockAccessRequest(
    parentIcNumber: string,
    parentName: string,
    relationship: string,
    childId: string,
    childName: string
  ): AccessRequest {
    return {
      id: `req-${Date.now()}`,
      childId,
      childName,
      parentId: '1754739951510', // Lim Ah Kow's ID
      parentName,
      parentIcNumber,
      relationship,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
  }

  private getMockPendingRequests(): AccessRequest[] {
    return [
      {
        id: 'req-1',
        childId: '1754739951512', // Ah Kow Son's ID
        childName: 'Ah Kow Son',
        parentId: '1754739951510', // Lim Ah Kow's ID
        parentName: 'Lim Ah Kow',
        parentIcNumber: '850101-01-1234',
        relationship: 'Son',
        status: 'pending',
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        id: 'req-2',
        childId: 'child-789',
        childName: 'Ah Kow Daughter',
        parentId: '1754739951510', // Lim Ah Kow's ID
        parentName: 'Lim Ah Kow',
        parentIcNumber: '850101-01-1234',
        relationship: 'Daughter',
        status: 'pending',
        requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      },
    ];
  }

  private getMockAccessResponse(
    requestId: string,
    status: 'approved' | 'rejected',
    parentId: string,
    notes?: string
  ): AccessRequest {
    return {
      id: requestId,
      childId: '1754739951512', // Ah Kow Son's ID
      childName: 'Ah Kow Son',
      parentId,
      parentName: 'Lim Ah Kow',
      parentIcNumber: '850101-01-1234',
      relationship: 'Son',
      status,
      requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date().toISOString(),
      respondedBy: parentId,
      notes,
    };
  }

  private getMockCaregiverLinks(): CaregiverLink[] {
    return [
      {
        id: 'link-1',
        childId: '1754739951512', // Ah Kow Son's ID
        childName: 'Ah Kow Son',
        parentId: '1754739951510', // Lim Ah Kow's ID
        parentName: 'Lim Ah Kow',
        parentIcNumber: '850101-01-1234',
        relationship: 'Son',
        permissions: [
          {
            id: 'perm-1',
            name: 'View Basic Info',
            description: 'View parent\'s basic information',
            resource: 'basic_info',
            action: 'read',
            isGranted: true,
          },
          {
            id: 'perm-2',
            name: 'Manage Appointments',
            description: 'View and manage upcoming appointments',
            resource: 'appointments',
            action: 'manage',
            isGranted: true,
          },
          {
            id: 'perm-3',
            name: 'Approve Transport',
            description: 'Approve or reject transport bookings',
            resource: 'transport',
            action: 'approve',
            isGranted: true,
          },
          {
            id: 'perm-4',
            name: 'View Medical Records',
            description: 'Read-only access to medical history',
            resource: 'medical_records',
            action: 'read',
            isGranted: true,
          },
          {
            id: 'perm-5',
            name: 'View Notifications',
            description: 'View important alerts and reminders',
            resource: 'notifications',
            action: 'read',
            isGranted: true,
          },
        ],
        linkedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        lastAccessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isActive: true,
      },
    ];
  }

  private getMockParentProfile(): ParentProfile {
    return {
      id: '1754739951510', // Lim Ah Kow's ID
      name: 'Lim Ah Kow',
      age: 75,
      icNumber: '850101-01-1234',
      profilePicture: '/api/placeholder/150/150',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish', 'Dust'],
      emergencyContact: '+60-12-3456-7890',
      medicalConditions: ['Diabetes Type 2', 'Hypertension', 'Arthritis'],
    };
  }
}

export const accessControlService = new AccessControlService();

