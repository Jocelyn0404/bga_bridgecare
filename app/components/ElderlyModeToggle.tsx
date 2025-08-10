'use client';

import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

export default function ElderlyModeToggle() {
  const { state, dispatch } = useApp();
  const { elderlyMode } = state;

  const toggleElderlyMode = () => {
    dispatch({ type: 'SET_ELDERLY_MODE', payload: !elderlyMode });
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleElderlyMode}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 ${
          elderlyMode
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        title={elderlyMode ? 'Disable Elderly Mode' : 'Enable Elderly Mode'}
      >
        {elderlyMode ? (
          <>
            <Eye className="w-5 h-5" />
            <span className="font-medium">Large Text</span>
          </>
        ) : (
          <>
            <EyeOff className="w-5 h-5" />
            <span className="font-medium">Normal</span>
          </>
        )}
      </button>
      
      {elderlyMode && (
        <div className="mt-2 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium">Voice Commands</span>
          </div>
          <button
            className="w-full bg-primary-100 text-primary-700 py-2 px-3 rounded text-sm font-medium hover:bg-primary-200 transition-colors"
            onClick={() => {
              // Placeholder for voice command functionality
              alert('Voice command feature coming soon!');
            }}
          >
            Activate Voice
          </button>
        </div>
      )}
    </div>
  );
} 