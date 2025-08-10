'use client';

import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ElderlyConfirmationPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  elderlyMode?: boolean;
}

export default function ElderlyConfirmationPopup({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No',
  elderlyMode = false
}: ElderlyConfirmationPopupProps) {
  if (!isOpen) return null;

  const textSize = elderlyMode ? 'text-xl' : 'text-base';
  const buttonSize = elderlyMode ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-8 h-8 text-blue-600" />
          <h2 className={`font-bold text-gray-900 ${textSize}`}>
            {title}
          </h2>
        </div>
        
        <p className={`text-gray-600 mb-6 ${textSize}`}>
          {message}
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className={`flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors ${buttonSize}`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>{confirmText}</span>
          </button>
          
          <button
            onClick={onCancel}
            className={`flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors ${buttonSize}`}
          >
            <XCircle className="w-5 h-5" />
            <span>{cancelText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
