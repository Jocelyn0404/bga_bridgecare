'use client';

import { useState } from 'react';
import { Shield, User, Activity, Calendar, MessageSquare, Building, FileText } from 'lucide-react';
import { AccessRequest } from '../types';

interface ApplyForAccessProps {
  elderlyMode?: boolean;
  onRequestSubmitted?: (request: AccessRequest) => void;
}

export default function ApplyForAccess({ elderlyMode = false, onRequestSubmitted }: ApplyForAccessProps) {
  const [formData, setFormData] = useState({
    requesterName: '',
    parentAccount: '',
    dataType: 'medical_records' as const,
    reason: '',
    duration: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const textSize = elderlyMode ? 'elderly-lg' : 'text-lg';

  const purposes = [
    { value: 'treatment', label: 'Treatment', icon: Shield },
    { value: 'research', label: 'Research', icon: FileText },
    { value: 'family_support', label: 'Family Support', icon: User },
    { value: 'insurance', label: 'Insurance', icon: Building },
    { value: 'emergency', label: 'Emergency', icon: Shield }
  ];

  const dataTypes = [
    { value: 'medical_records', label: 'Medical Records', icon: Shield },
    { value: 'personal_info', label: 'Personal Information', icon: User },
    { value: 'health_metrics', label: 'Health Metrics', icon: Activity }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create the access request
    const newRequest: AccessRequest = {
      id: Date.now().toString(),
      userId: formData.parentAccount, // This is the parent's account ID
      requesterName: formData.requesterName,
      organizationName: undefined, // Not needed for child-parent requests
      purpose: 'family_support', // Default purpose for child-parent requests
      dataType: formData.dataType,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      message: formData.reason || undefined,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
    
    if (onRequestSubmitted) {
      onRequestSubmitted(newRequest);
    }

    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        requesterName: '',
        parentAccount: '',
        dataType: 'medical_records',
        reason: '',
        duration: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className={`${textSize} font-bold text-gray-900 mb-2`}>
            Request Submitted Successfully!
          </h2>
          <p className={`${elderlyMode ? 'elderly' : 'text-base'} text-gray-600 mb-4`}>
            Your access request has been sent to your parent for review. You will be notified once they make a decision.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-blue-800`}>
              <strong>Next Steps:</strong> Your parent will review your request and either grant or deny access. 
              All decisions are recorded on the blockchain for transparency.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className={`${textSize} font-bold text-gray-900 mb-2`}>
          Request Access from Parent
        </h1>
        <p className={`${elderlyMode ? 'elderly' : 'text-base'} text-gray-600`}>
          Request permission to access your parent&apos;s health data through our secure blockchain system
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Child Information */}
          <div className="space-y-4">
            <h3 className={`${elderlyMode ? 'elderly-lg' : 'text-lg'} font-semibold text-gray-900 flex items-center gap-2`}>
              <User className="w-5 h-5" />
              Your Information
            </h3>
            
            <div>
              <label className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-gray-700 mb-2 block`}>
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.requesterName}
                onChange={(e) => setFormData(prev => ({ ...prev, requesterName: e.target.value }))}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-gray-700 mb-2 block`}>
                Parent&apos;s Account *
              </label>
              <input
                type="text"
                required
                value={formData.parentAccount}
                onChange={(e) => setFormData(prev => ({ ...prev, parentAccount: e.target.value }))}
                className="input-field"
                placeholder="Enter parent&apos;s username or email"
              />
            </div>
          </div>

          {/* Reason for Access */}
          <div className="space-y-4">
            <h3 className={`${elderlyMode ? 'elderly-lg' : 'text-lg'} font-semibold text-gray-900 flex items-center gap-2`}>
              <Shield className="w-5 h-5" />
              Why do you need access?
            </h3>
            
            <div>
              <label className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-gray-700 mb-2 block`}>
                Reason (Optional)
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                className="input-field"
                rows={3}
                placeholder="Explain why you need access to your parent&apos;s data..."
              />
            </div>
          </div>

          {/* Data Type Requested */}
          <div className="space-y-4">
            <h3 className={`${elderlyMode ? 'elderly-lg' : 'text-lg'} font-semibold text-gray-900 flex items-center gap-2`}>
              <Activity className="w-5 h-5" />
              Data Type Requested *
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dataTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.dataType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dataType"
                      value={type.value}
                      checked={formData.dataType === type.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataType: e.target.value as any }))}
                      className="sr-only"
                    />
                    <IconComponent className="w-5 h-5 text-gray-600 mr-3" />
                    <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium`}>
                      {type.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Duration and Message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-gray-700 mb-2 block flex items-center gap-2`}>
                <Calendar className="w-4 h-4" />
                Duration (Optional)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="input-field"
              >
                <option value="">Select duration</option>
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>

            <div>
              <label className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-gray-700 mb-2 block flex items-center gap-2`}>
                <MessageSquare className="w-4 h-4" />
                Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="input-field"
                rows={3}
                placeholder="Brief explanation of why you need access..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.requesterName || !formData.parentAccount}
              className="w-full btn-medical flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Request...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Request Access from Parent
                </>
              )}
            </button>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-blue-800`}>
              <strong>Privacy Notice:</strong> All access requests are recorded on the blockchain for transparency. 
              Your parent has complete control over their data and can grant or deny access at any time.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 