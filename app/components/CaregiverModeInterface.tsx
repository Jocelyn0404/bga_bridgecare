'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Car, 
  FileText, 
  Bell, 
  Shield, 
  ArrowLeft,
  Heart,
  Droplets,
  AlertTriangle,
  Phone,
  MapPin
} from 'lucide-react';
import { accessControlService, ParentProfile } from '../services/accessControl';

interface CaregiverModeInterfaceProps {
  parentId: string;
  parentName: string;
  childId: string;
  onExitCaregiverMode: () => void;
}

export default function CaregiverModeInterface({ 
  parentId, 
  parentName, 
  childId, 
  onExitCaregiverMode 
}: CaregiverModeInterfaceProps) {
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'basic' | 'appointments' | 'transport' | 'medical' | 'notifications'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParentProfile();
  }, [parentId, childId]);

  const loadParentProfile = async () => {
    try {
      setLoading(true);
      const profile = await accessControlService.getParentProfile(parentId, childId);
      setParentProfile(profile);
    } catch (error) {
      console.error('Error loading parent profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const actionButtons = [
    {
      id: 'basic',
      title: 'Basic Info',
      icon: User,
      description: 'Name, age, blood type, allergies',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'appointments',
      title: 'Appointments',
      icon: Calendar,
      description: 'View & manage upcoming bookings',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'transport',
      title: 'Transport',
      icon: Car,
      description: 'Approve/reject ride bookings',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 'medical',
      title: 'Medical Records',
      icon: FileText,
      description: 'View medical history (read-only)',
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'View important alerts',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading parent&apos;s information...</span>
        </div>
      </div>
    );
  }

  if (!parentProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-20">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don&apos;t have permission to view this parent&apos;s information.</p>
          <button
            onClick={onExitCaregiverMode}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Exit Caregiver Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onExitCaregiverMode}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Exit Caregiver Mode</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-900">Caregiver Mode</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Viewing as caregiver</p>
              <p className="font-medium text-gray-900">{parentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{parentProfile.name}</h1>
              <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{parentProfile.age} years old</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Droplets className="h-4 w-4" />
                  <span>Blood Type: {parentProfile.bloodType}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>IC: {parentProfile.icNumber}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{parentProfile.emergencyContact}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actionButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => setActiveSection(button.id as any)}
                  className={`${button.color} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                >
                  <div className="flex items-center space-x-4">
                    <button.icon className="h-8 w-8" />
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{button.title}</h3>
                      <p className="text-sm opacity-90">{button.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medical Conditions */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Medical Conditions</span>
                </h3>
                <div className="space-y-2">
                  {parentProfile.medicalConditions?.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Allergies</span>
                </h3>
                <div className="space-y-2">
                  {parentProfile.allergies?.map((allergy, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{allergy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Content */}
        {activeSection !== 'overview' && (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveSection('overview')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Overview</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {actionButtons.find(b => b.id === activeSection)?.title}
                </h2>
              </div>
            </div>

            {/* Section Content Placeholder */}
            <div className="bg-white border rounded-lg p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.createElement(actionButtons.find(b => b.id === activeSection)?.icon || User, { 
                    className: "h-8 w-8 text-gray-400" 
                  })}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {actionButtons.find(b => b.id === activeSection)?.title} Section
                </h3>
                <p className="text-gray-600 mb-4">
                  {actionButtons.find(b => b.id === activeSection)?.description}
                </p>
                <p className="text-sm text-gray-500">
                  This section will show detailed information and management options for the selected feature.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

