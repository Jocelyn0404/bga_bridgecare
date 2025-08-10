'use client';

import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';
import { accessControlService, AccessRequest } from '../services/accessControl';

interface AccessRequestApprovalProps {
  currentUserId: string;
  currentUserName: string;
}

export default function AccessRequestApproval({ currentUserId, currentUserName }: AccessRequestApprovalProps) {
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      const requests = await accessControlService.getPendingAccessRequests(currentUserId);
      setPendingRequests(requests);
    } catch (error) {
      setError('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      setRespondingTo(requestId);
      setError(null);

      await accessControlService.respondToAccessRequest(
        requestId,
        status,
        currentUserId,
        responseNotes.trim() || undefined
      );

      // Remove the request from the list
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      
      // Show success message
      alert(`Access request ${status} successfully!`);
    } catch (error) {
      setError(`Failed to ${status} request. Please try again.`);
    } finally {
      setRespondingTo(null);
      setResponseNotes('');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const requestTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - requestTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading pending requests...</span>
        </div>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center py-8">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-gray-600">You don&apos;t have any pending caregiver access requests at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Caregiver Access Requests</p>
            <p className="mt-1">
              Your children have requested access to help manage your healthcare account. 
              Review each request carefully before approving.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {pendingRequests.map((request) => (
        <div key={request.id} className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{request.childName}</h3>
              <p className="text-sm text-gray-600">
                {request.relationship} • IC: {request.parentIcNumber}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">{formatTimeAgo(request.requestedAt)}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Child Name:</span>
                <span className="ml-2 font-medium">{request.childName}</span>
              </div>
              <div>
                <span className="text-gray-600">Relationship:</span>
                <span className="ml-2 font-medium">{request.relationship}</span>
              </div>
              <div>
                <span className="text-gray-600">Requested:</span>
                <span className="ml-2">{new Date(request.requestedAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Pending
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">What access will they receive?</p>
                <ul className="mt-1 space-y-1">
                  <li>• View your basic information (name, age, blood type, allergies)</li>
                  <li>• Manage your upcoming appointments</li>
                  <li>• Approve or reject transport bookings</li>
                  <li>• View your medical records (read-only)</li>
                  <li>• View your important notifications</li>
                </ul>
              </div>
            </div>
          </div>

          {respondingTo === request.id ? (
            <div className="space-y-4">
              <div>
                <label htmlFor={`notes-${request.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Optional Notes
                </label>
                <textarea
                  id={`notes-${request.id}`}
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about your decision (optional)"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleResponse(request.id, 'approved')}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve Access</span>
                </button>
                <button
                  onClick={() => handleResponse(request.id, 'rejected')}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject Access</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={() => setRespondingTo(request.id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Respond to Request
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

