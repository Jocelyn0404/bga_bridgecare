'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Users, Clock, CheckCircle, XCircle, AlertCircle, FileText, User, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { accessControlService, AccessRequest, CaregiverLink } from '../services/accessControl';
import CaregiverAccessRequest from './CaregiverAccessRequest';

export default function DataAccess({ elderlyMode }: { elderlyMode?: boolean }) {
  const { state } = useApp();
  const currentUser = state.currentUser;
  
  // State for pending requests (elderly sees these)
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [caregiverLinks, setCaregiverLinks] = useState<CaregiverLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine user role for access control - use the same logic as PatientAppointments
  const isElderly = currentUser?.role === 'patient' && (currentUser?.isElderly || elderlyMode);
  const isFamilyMember = currentUser?.role === 'family_member';

  useEffect(() => {
    loadData();
  }, [currentUser, elderlyMode]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      if (isElderly) {
        // Load pending requests for elderly user
        console.log('Loading pending requests for elderly user:', currentUser.id);
        const requests = await accessControlService.getPendingAccessRequests(currentUser.id);
        console.log('Pending requests loaded:', requests);
        setPendingRequests(requests);
      } else if (isFamilyMember) {
        // Load active caregiver links for family member
        const links = await accessControlService.getActiveCaregiverLinks(currentUser.id);
        setCaregiverLinks(links);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!currentUser) return;

    try {
      await accessControlService.respondToAccessRequest(requestId, 'approved', currentUser.id);
      
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      
      // Refresh caregiver links if current user is a family member
      if (isFamilyMember) {
        const links = await accessControlService.getActiveCaregiverLinks(currentUser.id);
        setCaregiverLinks(links);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Failed to approve request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!currentUser) return;

    try {
      await accessControlService.respondToAccessRequest(requestId, 'rejected', currentUser.id);
      
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Failed to reject request. Please try again.');
    }
  };

  const handleRevokeAccess = async (linkId: string) => {
    if (!currentUser) return;

    try {
      await accessControlService.revokeCaregiverAccess(linkId, currentUser.id);
      
      // Remove from caregiver links
      setCaregiverLinks(prev => prev.filter(link => link.id !== linkId));
    } catch (error) {
      console.error('Error revoking access:', error);
      setError('Failed to revoke access. Please try again.');
    }
  };

  const handleRequestSubmitted = async (request: AccessRequest) => {
    // Refresh caregiver links after a new request is submitted
    if (isFamilyMember && currentUser) {
      const links = await accessControlService.getActiveCaregiverLinks(currentUser.id);
      setCaregiverLinks(links);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Data Access Control</h2>
            <p className="text-gray-600">
              {isElderly 
                ? 'Manage caregiver access requests from your family members'
                : 'Request and manage access to family member accounts'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Elderly User View - Pending Requests */}
      {isElderly && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Pending Caregiver Access Requests</p>
                <p className="mt-1">
                  Review and approve or reject requests from family members who want to help manage your healthcare account.
                </p>
              </div>
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white border rounded-lg p-6">
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                <p className="text-gray-600">You don&apos;t have any pending caregiver access requests at the moment.</p>
              </div>
            </div>
          ) : (
            pendingRequests.map((request) => (
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
                    <span className="text-sm text-gray-500">
                      {new Date(request.requestedAt).toLocaleString()}
                    </span>
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

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApproveRequest(request.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve Access</span>
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject Access</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Family Member View - Active Links */}
      {isFamilyMember && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Your Caregiver Access</p>
                <p className="mt-1">
                  View and manage your access to family member accounts.
                </p>
              </div>
            </div>
          </div>

          {/* Request Access Section - Always visible for family members */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  <span>Request Access from Elderly Patient</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Request caregiver access to manage a family member&apos;s healthcare account.
                </p>
              </div>
            </div>
            <CaregiverAccessRequest 
              currentUserId={currentUser?.id || ''} 
              currentUserName={currentUser?.username || ''} 
              onRequestSubmitted={handleRequestSubmitted}
            />
          </div>

          {/* Active Access Links */}
          {caregiverLinks.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Granted Access</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Family member accounts you have caregiver access to.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {caregiverLinks.map((link) => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{link.parentName}</h4>
                        <p className="text-sm text-gray-600">
                          {link.relationship} • IC: {link.parentIcNumber}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Active</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Access Permissions</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {link.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">{permission.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Linked since: {new Date(link.linkedAt).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => handleRevokeAccess(link.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Revoke Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Active Access Message - Only show when no caregiver links */}
          {caregiverLinks.length === 0 && (
            <div className="bg-white border rounded-lg p-6">
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Access</h3>
                <p className="text-gray-600">
                  You don&apos;t have caregiver access to any family member accounts yet.
                  Use the form above to request caregiver access.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
