'use client';

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function BasicInfoForm() {
  const { state, dispatch } = useApp();
  const { elderlyMode, onboardingData } = state;

  const [formData, setFormData] = useState({
    age: onboardingData?.age?.toString() || '',
    weight: onboardingData?.weight?.toString() || '',
    height: onboardingData?.height?.toString() || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.age || parseInt(formData.age) <= 0) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    if (!formData.height || parseInt(formData.height) <= 0) {
      newErrors.height = 'Please enter a valid height';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseInt(formData.height);

    dispatch({
      type: 'SET_ONBOARDING_DATA',
      payload: {
        gender: state.onboardingData?.gender || 'male',
        age,
        weight,
        height,
        recordMenstruation: state.onboardingData?.recordMenstruation || null,
        medicalConditions: state.onboardingData?.medicalConditions || {
          hypertension: false,
          diabetes: false,
          cholesterol: false
        }
      },
    });

    // Determine next step based on gender and age
    if (state.onboardingData?.gender === 'female') {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'menstruation' });
    } else if (age > 20) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'conditions' });
    } else {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'complete' });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'gender' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className={`font-bold text-gray-900 mb-2 ${elderlyMode ? 'elderly-xl' : 'text-2xl'}`}>
              Basic Information
            </h2>
            <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-base'}`}>
              Let&apos;s get to know you better
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Age (years)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className={`w-full px-4 py-3 border ${
                  errors.age ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Weight (kg)
              </label>
              <input
                type="number"
                min="20"
                max="300"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className={`w-full px-4 py-3 border ${
                  errors.weight ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
                placeholder="Enter your weight"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
              )}
            </div>

            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Height (cm)
              </label>
              <input
                type="number"
                min="100"
                max="250"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                className={`w-full px-4 py-3 border ${
                  errors.height ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
                placeholder="Enter your height"
              />
              {errors.height && (
                <p className="mt-1 text-sm text-red-600">{errors.height}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className={elderlyMode ? 'elderly' : 'text-base'}>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <span className={elderlyMode ? 'elderly' : 'text-base'}>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 