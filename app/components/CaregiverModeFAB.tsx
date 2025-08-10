'use client';

import React, { useState, useEffect } from 'react';
import { Users, ChevronUp, ChevronDown, User, Shield } from 'lucide-react';
import { accessControlService, CaregiverLink } from '../services/accessControl';

interface CaregiverModeFABProps {
  currentUserId: string;
  onParentSelect: (parentId: string, parentName: string) => void;
  currentCaregiverMode?: {
    parentId: string;
    parentName: string;
  } | null;
}

export default function CaregiverModeFAB({ 
  currentUserId, 
  onParentSelect, 
  currentCaregiverMode 
}: CaregiverModeFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [caregiverLinks, setCaregiverLinks] = useState<CaregiverLink[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCaregiverLinks();
  }, [currentUserId]);

  const loadCaregiverLinks = async () => {
    try {
      setLoading(true);
      const links = await accessControlService.getActiveCaregiverLinks(currentUserId);
      // Only show links that are active and approved
      const activeLinks = links.filter(link => link.isActive && link.permissions.some(perm => perm.isGranted));
      setCaregiverLinks(activeLinks);
    } catch (error) {
      console.error('Error loading caregiver links:', error);
      setCaregiverLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleParentSelect = (parentId: string, parentName: string) => {
    onParentSelect(parentId, parentName);
    setIsOpen(false);
  };

  const handleExitCaregiverMode = () => {
    onParentSelect('', '');
    setIsOpen(false);
  };

  // Don't show FAB if no caregiver links or if user is not a family member
  if (caregiverLinks.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-3 rounded-full shadow-lg transition-all duration-200 ${
          currentCaregiverMode
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {currentCaregiverMode ? (
          <>
            <Shield className="h-5 w-5" />
            <span className="font-medium">Caregiver Mode</span>
          </>
        ) : (
          <>
            <Users className="h-5 w-5" />
            <span className="font-medium">Caregiver</span>
          </>
        )}
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white border rounded-lg shadow-xl">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Caregiver Access</h3>
            </div>

            {currentCaregiverMode && (
              <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      Currently viewing: {currentCaregiverMode.parentName}
                    </span>
                  </div>
                  <button
                    onClick={handleExitCaregiverMode}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    Exit
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
              </div>
            ) : caregiverLinks.length === 0 ? (
              <div className="text-center py-4">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No caregiver access granted</p>
              </div>
            ) : (
              <div className="space-y-2">
                {caregiverLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleParentSelect(link.parentId, link.parentName)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentCaregiverMode?.parentId === link.parentId
                        ? 'bg-purple-50 border-purple-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">{link.parentName}</p>
                          <p className="text-sm text-gray-500">
                            {link.relationship} • IC: {link.parentIcNumber}
                          </p>
                        </div>
                      </div>
                      {currentCaregiverMode?.parentId === link.parentId && (
                        <Shield className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

