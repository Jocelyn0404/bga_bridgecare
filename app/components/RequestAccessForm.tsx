'use client';

import React, { useState } from 'react';
import { User, FileText, Send, X, AlertCircle } from 'lucide-react';

interface RequestAccessFormProps {
  onSubmit: (data: {
    elderlyName: string;
    elderlyId: string;
    dataType: string;
    reason: string;
  }) => void;
  onCancel: () => void;
}

export default function RequestAccessForm({ onSubmit, onCancel }: RequestAccessFormProps) {
  const [formData, setFormData] = useState({
    elderlyName: '',
    elderlyId: '',
    dataType: 'medical_records',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.elderlyName.trim()) {
      setError('Please enter the elderly family member\'s name');
      return;
    }
    if (!formData.elderlyId.trim()) {
      setError('Please enter the elderly family member\'s ID');
      return;
    }
    if (!formData.reason.trim()) {
      setError('Please provide a reason for the access request');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dataTypeOptions = [
    { value: 'medical_records', label: 'Medical Records', description: 'View medical history and test results' },
    { value: 'appointments', label: 'Appointments', description: 'Manage upcoming doctor appointments' },
    { value: 'medications', label: 'Medications', description: 'View and manage medication schedule' },
    { value: 'vital_signs', label: 'Vital Signs', description: 'Monitor blood pressure, heart rate, etc.' },
    { value: 'emergency_contacts', label: 'Emergency Contacts', description: 'Access emergency contact information' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Request Access from Elderly</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Elderly Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Elderly Family Member Information</h3>
            
            <div>
              <label htmlFor="elderlyName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="elderlyName"
                name="elderlyName"
                value={formData.elderlyName}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter elderly family member's full name"
              />
            </div>

            <div>
              <label htmlFor="elderlyId" className="block text-sm font-medium text-gray-700 mb-1">
                IC Number / ID *
              </label>
              <input
                type="text"
                id="elderlyId"
                name="elderlyId"
                value={formData.elderlyId}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 850101-01-1234"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the IC number or unique identifier of the elderly family member
              </p>
            </div>
          </div>

          {/* Access Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Access Details</h3>
            
            <div>
              <label htmlFor="dataType" className="block text-sm font-medium text-gray-700 mb-1">
                Type of Data Access *
              </label>
              <select
                id="dataType"
                name="dataType"
                value={formData.dataType}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dataTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Type Description */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">
                    {dataTypeOptions.find(opt => opt.value === formData.dataType)?.label}
                  </p>
                  <p className="mt-1">
                    {dataTypeOptions.find(opt => opt.value === formData.dataType)?.description}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Access Request *
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please explain why you need access to this data..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about why you need access and how you plan to use this information
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important Notice</p>
                <ul className="mt-1 space-y-1">
                  <li>• The elderly family member must approve this request</li>
                  <li>• Access will be granted only after approval</li>
                  <li>• All access activities are logged for transparency</li>
                  <li>• Access can be revoked at any time by the elderly family member</li>
                  <li>• This request will be stored on the blockchain for audit purposes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

