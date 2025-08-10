// Blockchain Service for Data Access Control
// This service handles all blockchain interactions for the data access control system

export interface BlockchainTransaction {
  id: string;
  action: string;
  data: any;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: number;
  transactionHash?: string;
}

export interface DataAccessRequest {
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

export interface AccessLog {
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

class BlockchainService {
  private isConnected: boolean = false;
  private contractAddress: string = '';
  private web3Provider: any = null;

  constructor() {
    this.initializeBlockchain();
  }

  // Initialize blockchain connection
  private async initializeBlockchain() {
    try {
      // Check if Web3 is available (MetaMask or other provider)
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        this.web3Provider = (window as any).ethereum;
        this.isConnected = true;
        console.log('Blockchain connected via MetaMask');
      } else {
        // Fallback to mock blockchain for development
        this.isConnected = false;
        console.log('Using mock blockchain for development');
      }
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
      this.isConnected = false;
    }
  }

  // Create a new access request on blockchain
  async createAccessRequest(request: DataAccessRequest): Promise<string> {
    try {
      if (this.isConnected) {
        // Real blockchain transaction
        return await this.createRealTransaction('createAccessRequest', request);
      } else {
        // Mock blockchain transaction
        return this.createMockTransaction('createAccessRequest', request);
      }
    } catch (error) {
      console.error('Error creating access request on blockchain:', error);
      throw new Error('Failed to create access request on blockchain');
    }
  }

  // Approve an access request on blockchain
  async approveAccessRequest(request: DataAccessRequest, accessLog: AccessLog): Promise<string> {
    try {
      if (this.isConnected) {
        // Real blockchain transaction
        return await this.createRealTransaction('approveAccessRequest', { request, accessLog });
      } else {
        // Mock blockchain transaction
        return this.createMockTransaction('approveAccessRequest', { request, accessLog });
      }
    } catch (error) {
      console.error('Error approving access request on blockchain:', error);
      throw new Error('Failed to approve access request on blockchain');
    }
  }

  // Deny an access request on blockchain
  async denyAccessRequest(request: DataAccessRequest): Promise<string> {
    try {
      if (this.isConnected) {
        // Real blockchain transaction
        return await this.createRealTransaction('denyAccessRequest', request);
      } else {
        // Mock blockchain transaction
        return this.createMockTransaction('denyAccessRequest', request);
      }
    } catch (error) {
      console.error('Error denying access request on blockchain:', error);
      throw new Error('Failed to deny access request on blockchain');
    }
  }

  // Revoke access on blockchain
  async revokeAccess(accessLog: AccessLog): Promise<string> {
    try {
      if (this.isConnected) {
        // Real blockchain transaction
        return await this.createRealTransaction('revokeAccess', accessLog);
      } else {
        // Mock blockchain transaction
        return this.createMockTransaction('revokeAccess', accessLog);
      }
    } catch (error) {
      console.error('Error revoking access on blockchain:', error);
      throw new Error('Failed to revoke access on blockchain');
    }
  }

  // Get access logs from blockchain
  async getAccessLogs(userId: string): Promise<AccessLog[]> {
    try {
      if (this.isConnected) {
        // Real blockchain query
        return await this.queryBlockchain('getAccessLogs', { userId });
      } else {
        // Mock blockchain query
        return this.getMockAccessLogs(userId);
      }
    } catch (error) {
      console.error('Error getting access logs from blockchain:', error);
      return [];
    }
  }

  // Get pending requests from blockchain
  async getPendingRequests(userId: string, role: 'elderly' | 'familyMember'): Promise<DataAccessRequest[]> {
    try {
      if (this.isConnected) {
        // Real blockchain query
        return await this.queryBlockchain('getPendingRequests', { userId, role });
      } else {
        // Mock blockchain query
        return this.getMockPendingRequests(userId, role);
      }
    } catch (error) {
      console.error('Error getting pending requests from blockchain:', error);
      return [];
    }
  }

  // Create a real blockchain transaction
  private async createRealTransaction(action: string, data: any): Promise<string> {
    // This would integrate with a real blockchain (Ethereum, Polygon, etc.)
    // For now, we'll simulate the transaction
    
    const transaction: BlockchainTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      data,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    // Simulate blockchain confirmation
    setTimeout(() => {
      transaction.status = 'confirmed';
      transaction.blockNumber = Math.floor(Math.random() * 1000000);
      transaction.gasUsed = Math.floor(Math.random() * 100000);
      transaction.transactionHash = `0x${Math.random().toString(36).substr(2, 64)}`;
    }, 2000);

    console.log('Real blockchain transaction created:', transaction);
    return transaction.id;
  }

  // Create a mock blockchain transaction
  private createMockTransaction(action: string, data: any): string {
    const transactionId = `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Mock blockchain transaction:', {
      id: transactionId,
      action,
      data,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      blockNumber: Math.floor(Math.random() * 1000000),
      gasUsed: Math.floor(Math.random() * 100000),
      transactionHash: `0x${Math.random().toString(36).substr(2, 64)}`,
    });

    return transactionId;
  }

  // Query blockchain for data
  private async queryBlockchain(method: string, params: any): Promise<any> {
    // This would query the actual blockchain
    // For now, return mock data
    console.log('Querying blockchain:', method, params);
    return [];
  }

  // Mock data functions
  private getMockAccessLogs(userId: string): AccessLog[] {
    return [
      {
        id: 'log_1',
        requesterId: 'family_1',
        requesterName: 'Ahmad Rahman',
        elderlyId: userId,
        elderlyName: 'Siti Aminah',
        dataType: 'appointments',
        action: 'granted',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        blockchainTxId: 'mock_tx_1234567890_abc123',
        transactionHash: '0x1234567890abcdef',
      },
    ];
  }

  private getMockPendingRequests(userId: string, role: 'elderly' | 'familyMember'): DataAccessRequest[] {
    if (role === 'elderly') {
      return [
        {
          id: 'req_1',
          requesterId: 'family_1',
          requesterName: 'Ahmad Rahman',
          elderlyId: userId,
          elderlyName: 'Siti Aminah',
          dataType: 'medical_records',
          reason: 'Need to monitor medication schedule',
          status: 'pending',
          requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ];
    } else {
      return [
        {
          id: 'req_2',
          requesterId: userId,
          requesterName: 'Ahmad Rahman',
          elderlyId: 'elderly_1',
          elderlyName: 'Siti Aminah',
          dataType: 'medical_records',
          reason: 'Monitor health conditions',
          status: 'pending',
          requestedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
  }

  // Get blockchain status
  getBlockchainStatus(): { isConnected: boolean; provider: string } {
    return {
      isConnected: this.isConnected,
      provider: this.isConnected ? 'MetaMask' : 'Mock Blockchain',
    };
  }

  // Connect to blockchain (for MetaMask integration)
  async connectWallet(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          this.isConnected = true;
          this.web3Provider = (window as any).ethereum;
          console.log('Wallet connected:', accounts[0]);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }

  // Get current account
  async getCurrentAccount(): Promise<string | null> {
    try {
      if (this.isConnected && this.web3Provider) {
        const accounts = await this.web3Provider.request({
          method: 'eth_accounts',
        });
        return accounts[0] || null;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current account:', error);
      return null;
    }
  }
}

export const blockchainService = new BlockchainService();

