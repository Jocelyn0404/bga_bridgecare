'use client';

import React from 'react';
import DataAccess from '../components/DataAccess';

export default function DataAccessDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Access Control Demo</h1>
              <p className="text-gray-600 mt-1">
                Test the blockchain-based data access control system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Test:</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. <strong>Change Role:</strong> Edit the <code>role</code> constant in <code>DataAccess.tsx</code> to switch between &quot;elderly&quot; and &quot;familyMember&quot;</p>
            <p>2. <strong>Family Member Flow:</strong> Request access to elderly data, fill out the form</p>
            <p>3. <strong>Elderly Flow:</strong> View pending requests and approve/deny them</p>
            <p>4. <strong>Access Logs:</strong> See all granted/revoked access in the logs section</p>
            <p>5. <strong>Blockchain:</strong> Check browser console for blockchain transaction logs</p>
          </div>
        </div>

        {/* Main Content */}
        <DataAccess />
      </div>

      {/* Feature Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Role-Based Access</h4>
              <p className="text-sm text-gray-600">Different interfaces for elderly and family member roles</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Request/Approval Flow</h4>
              <p className="text-sm text-gray-600">Family members request access, elderly approve/deny</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Blockchain Logging</h4>
              <p className="text-sm text-gray-600">All actions logged with transaction IDs</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Access Logs</h4>
              <p className="text-sm text-gray-600">Transparent history of all access actions</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Real-time Updates</h4>
              <p className="text-sm text-gray-600">UI updates immediately when actions are taken</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Responsive Design</h4>
              <p className="text-sm text-gray-600">Works on desktop and mobile devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

