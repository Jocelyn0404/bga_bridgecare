'use client';

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OnboardingData, User } from '../types';
import { ArrowLeft, ArrowRight, Check, User as UserIcon, Heart, Activity, Calendar } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { state, dispatch } = useApp();
  const { elderlyMode, currentUser } = state;
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    gender: 'male',
    age: 0,
    weight: 0,
    height: 0,
    recordMenstruation: null,
    medicalConditions: {
      hypertension: false,
      diabetes: false,
      cholesterol: false
    }
  });

  const steps = [
    {
      id: 'gender',
      title: 'Gender Selection',
      description: 'Please select your gender',
      icon: UserIcon
    },
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Tell us about your age, weight, and height',
      icon: Heart
    },
    {
      id: 'menstruation',
      title: 'Menstruation Tracking',
      description: 'Would you like to track your menstruation period?',
      icon: Calendar,
      condition: () => onboardingData.gender === 'female'
    },
    {
      id: 'conditions',
      title: 'Medical Conditions',
      description: 'Do you have any of these medical conditions?',
      icon: Activity,
      condition: () => onboardingData.age > 20
    }
  ];

  const visibleSteps = steps.filter(step => !step.condition || step.condition());

  const handleNext = () => {
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    if (!currentUser) return;

    // Calculate BMI
    const bmi = onboardingData.weight && onboardingData.height 
      ? (onboardingData.weight / Math.pow(onboardingData.height / 100, 2))
      : undefined;

    const updatedUser: User = {
      ...currentUser,
      gender: onboardingData.gender,
      age: onboardingData.age,
      weight: onboardingData.weight,
      height: onboardingData.height,
      bmi: bmi,
      recordMenstruation: onboardingData.recordMenstruation ?? undefined,
      medicalConditions: onboardingData.medicalConditions,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    onComplete();
  };

  const renderStepContent = () => {
    const step = visibleSteps[currentStep];
    
    switch (step.id) {
      case 'gender':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOnboardingData(prev => ({ ...prev, gender: 'male' }))}
                className={`p-6 border-2 rounded-lg text-center transition-all ${
                  onboardingData.gender === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">👨</div>
                <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-lg'}`}>Male</div>
              </button>
              <button
                onClick={() => setOnboardingData(prev => ({ ...prev, gender: 'female' }))}
                className={`p-6 border-2 rounded-lg text-center transition-all ${
                  onboardingData.gender === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">👩</div>
                <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-lg'}`}>Female</div>
              </button>
            </div>
          </div>
        );

      case 'basic-info':
        return (
          <div className="space-y-6">
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Age (years)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={onboardingData.age || ''}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
                placeholder="Enter your age"
              />
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
                value={onboardingData.weight || ''}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
                placeholder="Enter your weight"
              />
            </div>
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Height (cm)
              </label>
              <input
                type="number"
                min="100"
                max="250"
                value={onboardingData.height || ''}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  elderlyMode ? 'elderly' : 'text-base'
                }`}
                placeholder="Enter your height"
              />
            </div>
          </div>
        );

      case 'menstruation':
        return (
          <div className="space-y-6">
            <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-base'}`}>
              Would you like to track your menstruation period? This helps monitor your reproductive health.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOnboardingData(prev => ({ ...prev, recordMenstruation: true }))}
                className={`p-6 border-2 rounded-lg text-center transition-all ${
                  onboardingData.recordMenstruation === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">✅</div>
                <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-lg'}`}>Yes, track it</div>
              </button>
              <button
                onClick={() => setOnboardingData(prev => ({ ...prev, recordMenstruation: false }))}
                className={`p-6 border-2 rounded-lg text-center transition-all ${
                  onboardingData.recordMenstruation === false
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">❌</div>
                <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-lg'}`}>No, skip</div>
              </button>
            </div>
          </div>
        );

      case 'conditions':
        return (
          <div className="space-y-6">
            <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-base'}`}>
              Do you have any of these medical conditions? (Optional)
            </p>
            <div className="space-y-4">
              {[
                { key: 'hypertension', label: 'Hypertension (High Blood Pressure)', icon: '🩺' },
                { key: 'diabetes', label: 'Diabetes', icon: '🩸' },
                { key: 'cholesterol', label: 'High Cholesterol', icon: '💊' }
              ].map((condition) => (
                <label key={condition.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onboardingData.medicalConditions[condition.key as keyof typeof onboardingData.medicalConditions]}
                    onChange={(e) => setOnboardingData(prev => ({
                      ...prev,
                      medicalConditions: {
                        ...prev.medicalConditions,
                        [condition.key]: e.target.checked
                      }
                    }))}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className={`${elderlyMode ? 'elderly' : 'text-base'}`}>
                    <span className="mr-2">{condition.icon}</span>
                    {condition.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    const step = visibleSteps[currentStep];
    
    switch (step.id) {
      case 'gender':
        return onboardingData.gender;
      case 'basic-info':
        return onboardingData.age > 0 && onboardingData.weight > 0 && onboardingData.height > 0;
      case 'menstruation':
        return onboardingData.recordMenstruation !== null;
      case 'conditions':
        return true; // Optional step
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {visibleSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < visibleSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className={`font-bold text-gray-900 mb-2 ${elderlyMode ? 'elderly-xl' : 'text-2xl'}`}>
              {visibleSteps[currentStep].title}
            </h2>
            <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-base'}`}>
              {visibleSteps[currentStep].description}
            </p>
          </div>

          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-md ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className={elderlyMode ? 'elderly' : 'text-base'}>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              <span className={elderlyMode ? 'elderly' : 'text-base'}>
                {currentStep === visibleSteps.length - 1 ? 'Complete' : 'Next'}
              </span>
              {currentStep < visibleSteps.length - 1 && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 