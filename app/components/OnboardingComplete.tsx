'use client';

import { useApp } from '../context/AppContext';
import { CheckCircle, User, Heart, Activity, Shield, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';

export default function OnboardingComplete() {
  const { state, dispatch } = useApp();
  const { elderlyMode, onboardingData } = state;

  const textSize = elderlyMode ? 'elderly-lg' : 'text-lg';

  const createUserProfile = () => {
    if (!onboardingData) return;
    
    const newUser: UserType = {
      id: Date.now().toString(),
      username: `User ${state.users.length + 1}`,
      email: '',
      password: '',
      role: 'patient',
      gender: onboardingData.gender,
      age: onboardingData.age,
      weight: onboardingData.weight,
      height: onboardingData.height,
      bmi: onboardingData.weight && onboardingData.height 
        ? (onboardingData.weight / Math.pow(onboardingData.height / 100, 2))
        : undefined,
      recordMenstruation: onboardingData.recordMenstruation ?? undefined,
      medicalConditions: onboardingData.medicalConditions,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_USER', payload: newUser });
    dispatch({ type: 'SET_CURRENT_USER', payload: newUser });
    dispatch({ type: 'SET_LOGGED_IN', payload: true });
  };

  const getBMI = () => {
    if (onboardingData?.weight && onboardingData?.height) {
      const heightInMeters = onboardingData.height / 100;
      return (onboardingData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const bmi = getBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className={`${elderlyMode ? 'w-20 h-20' : 'w-16 h-16'} text-green-500`} />
        </div>
        <h1 className={`${textSize} font-bold text-gray-900 mb-2`}>
          Profile Complete!
        </h1>
        <p className={`${elderlyMode ? 'elderly' : 'text-base'} text-gray-600`}>
          Your health profile has been created successfully
        </p>
      </div>

      <div className="card">
        <div className="mb-6">
          <h2 className={`${textSize} font-semibold text-gray-900 mb-4`}>
            Profile Summary
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-primary-600" />
              <div>
                <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700`}>
                  Gender:
                </span>
                <span className={`${elderlyMode ? 'elderly' : 'text-sm'} ml-2 text-gray-900 capitalize`}>
                  {onboardingData?.gender}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Activity className="w-5 h-5 text-primary-600" />
              <div>
                <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700`}>
                  Age:
                </span>
                <span className={`${elderlyMode ? 'elderly' : 'text-sm'} ml-2 text-gray-900`}>
                  {onboardingData?.age} years
                </span>
              </div>
            </div>

            {bmi && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Heart className="w-5 h-5 text-primary-600" />
                <div>
                  <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700`}>
                    BMI:
                  </span>
                  <span className={`${elderlyMode ? 'elderly' : 'text-sm'} ml-2 text-gray-900`}>
                    {bmi} ({bmiCategory?.category})
                  </span>
                </div>
              </div>
            )}

            {onboardingData?.gender === 'female' && onboardingData?.recordMenstruation !== null && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Heart className="w-5 h-5 text-pink-600" />
                <div>
                  <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700`}>
                    Menstruation Tracking:
                  </span>
                  <span className={`${elderlyMode ? 'elderly' : 'text-sm'} ml-2 text-gray-900`}>
                    {onboardingData?.recordMenstruation ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            )}

            {onboardingData?.age && onboardingData.age > 20 && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700`}>
                    Medical Conditions:
                  </span>
                  <div className={`${elderlyMode ? 'elderly' : 'text-sm'} ml-2 text-gray-900`}>
                    {Object.values(onboardingData?.medicalConditions || {}).some(Boolean) ? (
                      <ul className="mt-1 space-y-1">
                        {onboardingData?.medicalConditions?.hypertension && <li>• Hypertension</li>}
                        {onboardingData?.medicalConditions?.diabetes && <li>• Diabetes</li>}
                        {onboardingData?.medicalConditions?.cholesterol && <li>• High Cholesterol</li>}
                      </ul>
                    ) : (
                      <span>None reported</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-green-800`}>
            <strong>Great job!</strong> Your health profile is now ready. You can access your data, manage privacy settings, and use our health tracking features.
          </p>
        </div>

        <button
          onClick={createUserProfile}
          className="w-full btn-medical flex items-center justify-center gap-2"
        >
          <span>Complete Setup</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 