'use client';

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Activity, Droplets, Heart, Shield } from 'lucide-react';

export default function ConditionsForm() {
  const { state, dispatch } = useApp();
  const { elderlyMode, onboardingData } = state;

  const [conditions, setConditions] = useState({
    hypertension: onboardingData?.medicalConditions?.hypertension || false,
    diabetes: onboardingData?.medicalConditions?.diabetes || false,
    cholesterol: onboardingData?.medicalConditions?.cholesterol || false,
  });

  const textSize = elderlyMode ? 'elderly-lg' : 'text-lg';
  const checkboxSize = elderlyMode ? 'w-6 h-6' : 'w-5 h-5';

  const handleConditionChange = (condition: keyof typeof conditions) => {
    setConditions(prev => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  const handleNext = () => {
    dispatch({
      type: 'SET_ONBOARDING_DATA',
      payload: {
        gender: onboardingData?.gender || 'male',
        age: onboardingData?.age || 0,
        weight: onboardingData?.weight || 0,
        height: onboardingData?.height || 0,
        recordMenstruation: onboardingData?.recordMenstruation || null,
        medicalConditions: conditions
      },
    });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'complete' });
  };

  const handleBack = () => {
    if (onboardingData?.gender === 'female') {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'menstruation' });
    } else {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'basic-info' });
    }
  };

  const conditionOptions = [
    {
      key: 'hypertension' as const,
      label: 'Hypertension (High Blood Pressure)',
      icon: Activity,
      description: 'Elevated blood pressure levels',
      color: 'text-red-600',
    },
    {
      key: 'diabetes' as const,
      label: 'Diabetes',
      icon: Droplets,
      description: 'Blood sugar management condition',
      color: 'text-blue-600',
    },
    {
      key: 'cholesterol' as const,
      label: 'High Cholesterol',
      icon: Heart,
      description: 'Elevated cholesterol levels',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className={`${textSize} font-bold text-gray-900 mb-2`}>
          Medical Conditions
        </h1>
        <p className={`${elderlyMode ? 'elderly' : 'text-base'} text-gray-600`}>
          Optional: Help us provide better care recommendations
        </p>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary-600" />
            <span className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-gray-700`}>
              Do you have any of these conditions?
            </span>
          </div>
          <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-600 mb-4`}>
            This information helps us provide more personalized health recommendations. You can skip this step if you prefer.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {conditionOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <label
                key={option.key}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  conditions[option.key]
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={conditions[option.key]}
                  onChange={() => handleConditionChange(option.key)}
                  className={`${checkboxSize} text-primary-600 border-gray-300 rounded focus:ring-primary-500`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className={`w-5 h-5 ${option.color}`} />
                    <span className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-gray-900`}>
                      {option.label}
                    </span>
                  </div>
                  <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-600`}>
                    {option.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-blue-800`}>
            <strong>Note:</strong> This information is kept confidential and helps us provide better health insights. You can update this anytime in your settings.
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleNext}
            className="btn-primary flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 