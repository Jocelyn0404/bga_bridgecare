'use client';

import React, { useState } from 'react';
import { User, FileText, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { accessControlService, AccessRequest } from '../services/accessControl';

interface CaregiverAccessRequestProps {
  currentUserId: string;
  currentUserName: string;
  onRequestSubmitted?: (request: AccessRequest) => void;
}

export default function CaregiverAccessRequest({ 
  currentUserId, 
  currentUserName, 
  onRequestSubmitted 
}: CaregiverAccessRequestProps) {
  const [formData, setFormData] = useState({
    parentName: '',
    parentIcNumber: '',
    relationship: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<AccessRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const request = await accessControlService.requestCaregiverAccess(
        formData.parentIcNumber,
        formData.parentName,
        formData.relationship,
        currentUserId,
        currentUserName
      );

      setSubmittedRequest(request);
      onRequestSubmitted?.(request);
      
      // Reset form
      setFormData({
        parentName: '',
        parentIcNumber: '',
        relationship: '',
      });
    } catch (error) {
      setError('Failed to submit access request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRequest = () => {
    setSubmittedRequest(null);
    setError(null);
  };

  if (submittedRequest) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Request Submitted!</h3>
          <p className="text-gray-600 mb-4">
            Your request for caregiver access to <strong>{submittedRequest.parentName}</strong>&apos;s account has been sent.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Request Details</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Parent Name:</span>
                <span>{submittedRequest.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span>IC Number:</span>
                <span>{submittedRequest.parentIcNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Relationship:</span>
                <span>{submittedRequest.relationship}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="capitalize">{submittedRequest.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Submitted:</span>
                <span>{new Date(submittedRequest.requestedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">What happens next?</p>
                <ul className="mt-1 space-y-1">
                  <li>• Your parent will receive a notification about your request</li>
                  <li>• They can approve or reject the request from their account</li>
                  <li>• You&apos;ll be notified once they respond</li>
                  <li>• If approved, you&apos;ll gain caregiver access to their account</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleNewRequest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="h-8 w-8 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Request Caregiver Access</h3>
          <p className="text-sm text-gray-600">Request access to manage your parent&apos;s healthcare account</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">
            Parent&apos;s Full Name *
          </label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={formData.parentName}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter parent&apos;s full name as per IC"
          />
        </div>

        <div>
          <label htmlFor="parentIcNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Parent&apos;s IC Number *
          </label>
          <input
            type="text"
            id="parentIcNumber"
            name="parentIcNumber"
            value={formData.parentIcNumber}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 850101-01-1234"
            pattern="[0-9]{6}-[0-9]{2}-[0-9]{4}"
            title="Please enter IC number in format: YYMMDD-XX-XXXX"
          />
          <p className="text-xs text-gray-500 mt-1">Format: YYMMDD-XX-XXXX (e.g., 850101-01-1234)</p>
        </div>

        <div>
          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
            Your Relationship to Parent *
          </label>
          <select
            id="relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select relationship</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
            <option value="Grandson">Grandson</option>
            <option value="Granddaughter">Granddaughter</option>
            <option value="Nephew">Nephew</option>
            <option value="Niece">Niece</option>
            <option value="Legal Guardian">Legal Guardian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">What access will you receive?</p>
              <ul className="mt-1 space-y-1">
                <li>• View basic information (name, age, blood type, allergies)</li>
                <li>• Manage upcoming appointments</li>
                <li>• Approve or reject transport bookings</li>
                <li>• View medical records (read-only)</li>
                <li>• View important notifications</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Important:</p>
              <ul className="mt-1 space-y-1">
                <li>• Your parent must approve this request</li>
                <li>• They can revoke access at any time</li>
                <li>• All actions are logged for security</li>
                <li>• You can only access allowed features</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Access Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

