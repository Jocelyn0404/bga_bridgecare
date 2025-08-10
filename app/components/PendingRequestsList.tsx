'use client';

import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, User, FileText, Calendar } from 'lucide-react';

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
}

interface PendingRequestsListProps {
  requests: DataAccessRequest[];
  userRole: 'elderly' | 'familyMember';
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string, notes?: string) => void;
}

export default function PendingRequestsList({ 
  requests, 
  userRole, 
  onApprove, 
  onDeny 
}: PendingRequestsListProps) {
  const [denyNotes, setDenyNotes] = useState<{ [key: string]: string }>({});
  const [showDenyForm, setShowDenyForm] = useState<string | null>(null);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'medical_records': return <FileText className="h-4 w-4" />;
      case 'appointments': return <Calendar className="h-4 w-4" />;
      case 'medications': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleDenyWithNotes = (requestId: string) => {
    const notes = denyNotes[requestId] || '';
    onDeny(requestId, notes);
    setDenyNotes(prev => ({ ...prev, [requestId]: '' }));
    setShowDenyForm(null);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {userRole === 'elderly' ? 'No Pending Requests' : 'No Requests Found'}
        </h3>
        <p className="text-gray-600">
          {userRole === 'elderly' 
            ? 'You don\'t have any pending access requests at the moment.' 
            : 'You haven\'t made any access requests yet.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {userRole === 'elderly' ? 'Pending Access Requests' : 'My Access Requests'}
      </h2>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {userRole === 'elderly' ? request.requesterName : request.elderlyName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {userRole === 'elderly' ? 'Family Member' : 'Elderly Family Member'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{formatTimeAgo(request.requestedAt)}</span>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getDataTypeIcon(request.dataType)}
                  <span className="font-medium text-gray-900">Data Type</span>
                </div>
                <p className="text-sm text-gray-700 capitalize">
                  {request.dataType.replace('_', ' ')}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium text-gray-900">Reason</span>
                </div>
                <p className="text-sm text-gray-700">{request.reason}</p>
              </div>
            </div>

            {/* Request Info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Requested:</span>
                  <span className="ml-2 font-medium">
                    {new Date(request.requestedAt).toLocaleString()}
                  </span>
                </div>
                {request.respondedAt && (
                  <div>
                    <span className="text-gray-600">Responded:</span>
                    <span className="ml-2 font-medium">
                      {new Date(request.respondedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Elderly Actions */}
            {userRole === 'elderly' && request.status === 'pending' && (
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onApprove(request.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve Access</span>
                  </button>
                  <button
                    onClick={() => setShowDenyForm(request.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Deny Access</span>
                  </button>
                </div>

                {/* Deny Notes Form */}
                {showDenyForm === request.id && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-red-900 mb-2">
                      Optional Notes (Why are you denying this request?)
                    </label>
                    <textarea
                      value={denyNotes[request.id] || ''}
                      onChange={(e) => setDenyNotes(prev => ({ 
                        ...prev, 
                        [request.id]: e.target.value 
                      }))}
                      rows={3}
                      className="w-full border border-red-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Add notes about your decision (optional)"
                    />
                    <div className="flex space-x-3 mt-3">
                      <button
                        onClick={() => handleDenyWithNotes(request.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Confirm Denial
                      </button>
                      <button
                        onClick={() => {
                          setShowDenyForm(null);
                          setDenyNotes(prev => ({ ...prev, [request.id]: '' }));
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Family Member Status */}
            {userRole === 'familyMember' && request.status !== 'pending' && (
              <div className={`p-4 rounded-lg ${
                request.status === 'approved' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {request.status === 'approved' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    request.status === 'approved' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {request.status === 'approved' ? 'Access Granted' : 'Access Denied'}
                  </span>
                </div>
                {request.notes && (
                  <p className="text-sm mt-2 text-gray-700">{request.notes}</p>
                )}
              </div>
            )}

            {/* Response Time Info */}
            {request.respondedAt && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Response time: {formatTimeAgo(request.respondedAt)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

