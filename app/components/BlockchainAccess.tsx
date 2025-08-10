'use client';

import { useState, useEffect, useContext } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Unlock, Lock, Clock, Check, X, User, Activity, Heart, Brain, AlertCircle, FileText } from 'lucide-react';
import { AccessLog, AccessRequest } from '../types';

export default function BlockchainAccess() {
  const { state, dispatch } = useApp();
  const { currentUser, accessLogs, accessRequests, elderlyMode } = state;
  const [showAccessLogs, setShowAccessLogs] = useState(false);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [formattedDates, setFormattedDates] = useState<{[key: string]: string}>({});
  const [newAccessRequest, setNewAccessRequest] = useState({
    requester: '',
    dataType: 'medical_records',
  });

  useEffect(() => {
    // Format all log timestamps on client side
    const dates: {[key: string]: string} = {};
    accessLogs.forEach(log => {
      dates[log.id] = new Date(log.timestamp).toLocaleDateString();
    });
    setFormattedDates(dates);
  }, [accessLogs]);

  const textSize = elderlyMode ? 'elderly-lg' : 'text-lg';

  const handleGrantAccess = (requester: string, dataType: string) => {
    const newLog: AccessLog = {
      id: Date.now().toString(),
      accessedBy: requester,
      dataType: dataType,
      granted: true,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    
    dispatch({ type: 'ADD_ACCESS_LOG', payload: newLog });
    setNewAccessRequest({ requester: '', dataType: 'medical_records' });
  };

  const handleDenyAccess = (requester: string, dataType: string) => {
    const newLog: AccessLog = {
      id: Date.now().toString(),
      accessedBy: requester,
      dataType: dataType,
      granted: false,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    
    dispatch({ type: 'ADD_ACCESS_LOG', payload: newLog });
    setNewAccessRequest({ requester: '', dataType: 'medical_records' });
  };

  const handleGrantPendingRequest = (request: AccessRequest) => {
    // Update the request status
    const updatedRequest: AccessRequest = {
      ...request,
      status: 'granted',
      reviewedAt: new Date().toISOString()
    };
    
    dispatch({ type: 'UPDATE_ACCESS_REQUEST', payload: updatedRequest });
    
    // Create access log entry
    const newLog: AccessLog = {
      id: Date.now().toString(),
      accessedBy: request.requesterName,
      dataType: request.dataType,
      granted: true,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    
    dispatch({ type: 'ADD_ACCESS_LOG', payload: newLog });
  };

  const handleDenyPendingRequest = (request: AccessRequest) => {
    // Update the request status
    const updatedRequest: AccessRequest = {
      ...request,
      status: 'denied',
      reviewedAt: new Date().toISOString()
    };
    
    dispatch({ type: 'UPDATE_ACCESS_REQUEST', payload: updatedRequest });
    
    // Create access log entry
    const newLog: AccessLog = {
      id: Date.now().toString(),
      accessedBy: request.requesterName,
      dataType: request.dataType,
      granted: false,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    
    dispatch({ type: 'ADD_ACCESS_LOG', payload: newLog });
  };

  const dataTypes = [
    { value: 'medical_records', label: 'Medical Records', icon: Shield },
    { value: 'personal_info', label: 'Personal Information', icon: User },
    { value: 'health_metrics', label: 'Health Metrics', icon: Activity },
  ];

  const getPurposeLabel = (purpose: string) => {
    const purposes: { [key: string]: string } = {
      treatment: 'Treatment',
      research: 'Research',
      family_support: 'Family Support',
      insurance: 'Insurance',
      emergency: 'Emergency'
    };
    return purposes[purpose] || purpose;
  };

  const getDataTypeLabel = (dataType: string) => {
    const types: { [key: string]: string } = {
      medical_records: 'Medical Records',
      personal_info: 'Personal Information',
      health_metrics: 'Health Metrics'
    };
    return types[dataType] || dataType;
  };

  // Filter pending requests for current user
  const pendingRequests = accessRequests.filter(request => 
    request.userId === currentUser?.id && request.status === 'pending'
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className={`${textSize} font-bold text-gray-900 mb-2`}>
          Data Access Control
        </h1>
        <p className={`${elderlyMode ? 'elderly' : 'text-base'} text-gray-600`}>
          Manage who can access your health data using blockchain technology
        </p>
        <div className="mt-4">
          <a
            href="/apply-for-access"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Shield className="w-4 h-4" />
                         Request Access from Parent
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Access Control Panel */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-6 h-6 text-primary-600" />
            <h2 className={`${textSize} font-semibold text-gray-900`}>
              Grant Access
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-gray-700 mb-2 block`}>
                Requester Name
              </label>
              <input
                type="text"
                value={newAccessRequest.requester}
                onChange={(e) => setNewAccessRequest(prev => ({ ...prev, requester: e.target.value }))}
                className="input-field"
                placeholder="Enter requester name"
              />
            </div>

            <div>
              <label className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-gray-700 mb-2 block`}>
                Data Type
              </label>
              <select
                value={newAccessRequest.dataType}
                onChange={(e) => setNewAccessRequest(prev => ({ ...prev, dataType: e.target.value }))}
                className="input-field"
              >
                {dataTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleGrantAccess(newAccessRequest.requester, newAccessRequest.dataType)}
                disabled={!newAccessRequest.requester}
                className="flex-1 btn-medical flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                Grant Access
              </button>
              <button
                onClick={() => handleDenyAccess(newAccessRequest.requester, newAccessRequest.dataType)}
                disabled={!newAccessRequest.requester}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                Deny Access
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-blue-800`}>
              <strong>Blockchain Security:</strong> All access requests are recorded on the blockchain for transparency and audit purposes.
            </p>
          </div>
        </div>

        {/* Access Logs */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-600" />
              <h2 className={`${textSize} font-semibold text-gray-900`}>
                Access Logs
              </h2>
            </div>
            <button
              onClick={() => setShowAccessLogs(!showAccessLogs)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {showAccessLogs ? 'Hide' : 'Show'} Logs
            </button>
          </div>

          {showAccessLogs && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {accessLogs.length === 0 ? (
                <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-500 text-center py-4`}>
                  No access logs yet
                </p>
              ) : (
                accessLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg border ${
                      log.granted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-900`}>
                        {log.accessedBy}
                      </span>
                      <div className="flex items-center gap-1">
                        {log.granted ? (
                          <Unlock className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-500`}>
                          {log.granted ? 'Granted' : 'Denied'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>
                        {log.dataType.replace('_', ' ')}
                      </span>
                      <span className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-500`}>
                        {formattedDates[log.id]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700`}>
              <strong>Transparency:</strong> All access attempts are logged with timestamps and stored on the blockchain for your review.
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h2 className={`${textSize} font-semibold text-gray-900`}>
                Pending Requests
              </h2>
              {pendingRequests.length > 0 && (
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowPendingRequests(!showPendingRequests)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {showPendingRequests ? 'Hide' : 'Show'} Requests
            </button>
          </div>

          {showPendingRequests && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingRequests.length === 0 ? (
                <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-500 text-center py-4`}>
                  No pending requests
                </p>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-orange-200 bg-orange-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-900`}>
                          {request.requesterName}
                        </span>
                        {request.organizationName && (
                          <span className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600 ml-2`}>
                            ({request.organizationName})
                          </span>
                        )}
                      </div>
                      <span className={`${elderlyMode ? 'elderly' : 'text-xs'} text-orange-600 font-medium`}>
                        Pending
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-gray-500" />
                        <span className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>
                          Purpose: {getPurposeLabel(request.purpose)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-gray-500" />
                        <span className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>
                          Data: {getDataTypeLabel(request.dataType)}
                        </span>
                      </div>
                      {request.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>
                            Duration: {request.duration} days
                          </span>
                        </div>
                      )}
                    </div>

                    {request.message && (
                      <div className="mb-3 p-2 bg-white rounded border">
                                                 <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-700`}>
                           &quot;{request.message}&quot;
                         </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGrantPendingRequest(request)}
                        className="flex-1 btn-medical flex items-center justify-center gap-1 py-2 text-xs"
                      >
                        <Check className="w-3 h-3" />
                        Grant
                      </button>
                      <button
                        onClick={() => handleDenyPendingRequest(request)}
                        className="flex-1 btn-secondary flex items-center justify-center gap-1 py-2 text-xs"
                      >
                        <X className="w-3 h-3" />
                        Deny
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-orange-800`}>
              <strong>Review Required:</strong> These requests are waiting for your approval. Review each request carefully before granting access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 