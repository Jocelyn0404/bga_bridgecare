'use client';

import { useApp } from '../context/AppContext';
import { User, UserCheck, ArrowRight, HelpCircle } from 'lucide-react';

export default function GenderSelection() {
  const { state, dispatch } = useApp();
  const { elderlyMode, onboardingData } = state;

  const selectGender = (gender: 'male' | 'female') => {
    dispatch({
      type: 'SET_ONBOARDING_DATA',
      payload: {
        gender,
        age: 0,
        weight: 0,
        height: 0,
        recordMenstruation: null,
        medicalConditions: {
          hypertension: false,
          diabetes: false,
          cholesterol: false
        }
      },
    });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'basic-info' });
  };

  const textSize = elderlyMode ? 'elderly-lg' : 'text-lg';
  const iconSize = elderlyMode ? 'w-16 h-16' : 'w-12 h-12';

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className={`${textSize} font-bold text-gray-900 mb-2`}>
          Welcome to Your Health Profile
        </h1>
        <p className={`${elderlyMode ? 'elderly' : 'text-base'} text-gray-600`}>
          Let&apos;s start by getting to know you better
        </p>
      </div>

      <div className="card">
        <div className="text-center mb-6">
          <h2 className={`${textSize} font-semibold text-gray-900 mb-2`}>
            What is your gender?
          </h2>
          <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-500`}>
            This helps us provide personalized health recommendations
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => selectGender('male')}
            className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="text-center">
              <User className={`${iconSize} mx-auto mb-3 text-blue-600 group-hover:text-blue-700`} />
              <span className={`${textSize} font-medium text-gray-900`}>Male</span>
            </div>
            <ArrowRight className="absolute top-2 right-2 w-5 h-5 text-gray-400 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => selectGender('female')}
            className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="text-center">
              <UserCheck className={`${iconSize} mx-auto mb-3 text-pink-600 group-hover:text-pink-700`} />
              <span className={`${textSize} font-medium text-gray-900`}>Female</span>
            </div>
            <ArrowRight className="absolute top-2 right-2 w-5 h-5 text-gray-400 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-blue-800`}>
                <strong>Why do we ask?</strong> Your gender helps us provide more accurate health insights and recommendations tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 