'use client';

import React, { useState } from 'react';
import DataAccess from '../components/DataAccess';

export default function DataAccessDemo() {
  const [currentUser, setCurrentUser] = useState({
    id: 'elderly_1',
    name: 'Lim Ah Kow',
    role: 'elderly' as 'elderly' | 'familyMember',
  });

  const users = [
    {
      id: 'elderly_1',
      name: 'Lim Ah Kow',
      role: 'elderly' as const,
      description: 'Elderly family member - can approve/deny access requests',
    },
    {
      id: 'family_1',
      name: 'Ah Kow Son',
      role: 'familyMember' as const,
      description: 'Family member - can request access to elderly data',
    },
    {
      id: 'family_2',
      name: 'Ah Kow Daughter',
      role: 'familyMember' as const,
      description: 'Family member - can request access to elderly data',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Access Control Demo</h1>
              <p className="text-gray-600">Blockchain-based family data access management system</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current User</p>
              <p className="font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-sm text-blue-600 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Switcher */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Switch User:</span>
            <div className="flex space-x-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    currentUser.id === user.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {user.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="bg-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              i
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Demo Instructions:</p>
              <ul className="space-y-1">
                <li>• Switch between users to see different perspectives</li>
                <li>• As a family member, click &quot;Request Access from Elderly&quot; to create a new request</li>
                <li>• As an elderly user, view pending requests and approve/deny them</li>
                <li>• All actions are logged to the blockchain (mock implementation)</li>
                <li>• Check the &quot;Access Logs&quot; tab to see transaction history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DataAccess />
      </div>

      {/* Feature Overview */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Role-Based Access Control</h3>
              <p className="text-sm text-gray-600">
                Different interfaces for elderly users (approve/deny) and family members (request access).
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Blockchain Integration</h3>
              <p className="text-sm text-gray-600">
                All access requests, approvals, and denials are stored on the blockchain for transparency.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-sm text-gray-600">
                Status updates and notifications for all parties involved in the access control process.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Audit Trail</h3>
              <p className="text-sm text-gray-600">
                Complete history of all access requests and decisions with timestamps and blockchain transaction IDs.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Secure Communication</h3>
              <p className="text-sm text-gray-600">
                Encrypted data transmission and secure blockchain transactions for data privacy.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">User-Friendly Interface</h3>
              <p className="text-sm text-gray-600">
                Intuitive design with clear status indicators and easy-to-use forms for all user types.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

