'use client';

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ApplyForAccess from '../components/ApplyForAccess';
import { AccessRequest } from '../types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplyForAccessPage() {
  const { state, dispatch } = useApp();
  const { elderlyMode } = state;

  const handleRequestSubmitted = (request: AccessRequest) => {
    // Add the request to the global state
    dispatch({ type: 'ADD_ACCESS_REQUEST', payload: request });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Apply for Access Form */}
        <ApplyForAccess 
          elderlyMode={elderlyMode} 
          onRequestSubmitted={handleRequestSubmitted}
        />
      </div>
    </div>
  );
} 