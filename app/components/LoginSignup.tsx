'use client';

import { useState } from 'react';
import { useApp, resetDemoUsers } from '../context/AppContext';
import { User } from '../types';
import { Eye, EyeOff, User as UserIcon, Mail, Lock, Heart, Users, Stethoscope, Home, Zap, RefreshCw } from 'lucide-react';

export default function LoginSignup() {
  const { state, dispatch } = useApp();
  const { elderlyMode } = state;
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'medical_staff' | 'family_member'>('patient');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    staffId: '',
    linkedPatientId: '',
    isElderly: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!isLogin && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role-specific validation
    if (!isLogin) {
      if (selectedRole === 'medical_staff' && !formData.organization.trim()) {
        newErrors.organization = 'Organization is required for medical staff';
      }
      if (selectedRole === 'medical_staff' && !formData.staffId.trim()) {
        newErrors.staffId = 'Staff ID is required for medical staff';
      }
      if (selectedRole === 'family_member' && !formData.linkedPatientId.trim()) {
        newErrors.linkedPatientId = 'Linked patient ID is required for family members';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isLogin) {
      // Handle login
      console.log('Available users:', state.users); // Debug log
      console.log('Attempting login with:', formData.username, formData.password); // Debug log
      
      const user = state.users.find(u => 
        u.username === formData.username && u.password === formData.password
      );
      
      if (user) {
        console.log('Login successful for user:', user); // Debug log
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
        dispatch({ type: 'SET_LOGGED_IN', payload: true });
      } else {
        console.log('Login failed - user not found'); // Debug log
        setErrors({ general: 'Invalid username or password' });
      }
    } else {
      // Handle signup
      const existingUser = state.users.find(u => u.username === formData.username);
      if (existingUser) {
        setErrors({ username: 'Username already exists' });
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        linkedPatientId: selectedRole === 'family_member' ? formData.linkedPatientId : undefined,
        organization: selectedRole === 'medical_staff' ? formData.organization : undefined,
        staffId: selectedRole === 'medical_staff' ? formData.staffId : undefined,
        isElderly: selectedRole === 'patient' ? formData.isElderly : undefined,
        gender: undefined,
        age: undefined,
        weight: undefined,
        height: undefined,
        bmi: undefined,
        recordMenstruation: undefined,
        medicalConditions: {
          hypertension: false,
          diabetes: false,
          cholesterol: false
        },
        healthMetrics: {
          cholesterol: undefined,
          bloodPressure: undefined,
          bloodSugar: undefined
        },
        tracking: {
          exercise: [],
          calories: [],
          water: []
        },
        menstruationData: [],
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_USER', payload: newUser });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      organization: '',
      staffId: '',
      linkedPatientId: '',
      isElderly: false
    });
    setErrors({});
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'patient':
        return <Heart className="h-5 w-5" />;
      case 'medical_staff':
        return <Stethoscope className="h-5 w-5" />;
      case 'family_member':
        return <Users className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'patient':
        return 'Manage your own medical records and health tracking';
      case 'medical_staff':
        return 'Add and manage medical records for patients';
      case 'family_member':
        return 'Monitor and support elderly family members';
      default:
        return '';
    }
  };

  // Autofill function for MVP demonstration
  const autofillForm = (role: 'patient' | 'medical_staff' | 'family_member') => {
    setSelectedRole(role);
    
    const mockData = {
      patient: {
        username: 'lim_ah_kow',
        email: 'lim.ah.kow@email.com',
        password: 'password123',
        confirmPassword: 'password123',
        organization: '',
        staffId: '',
        linkedPatientId: '',
        isElderly: true
      },
      medical_staff: {
        username: 'dr_sarah_chen',
        email: 'dr.sarah.chen@hospital.com',
        password: 'password123',
        confirmPassword: 'password123',
        organization: 'General Hospital',
        staffId: 'MS001',
        linkedPatientId: '',
        isElderly: false
      },
      family_member: {
        username: 'ah_kow_son',
        email: 'ah.kow.son@email.com',
        password: 'password123',
        confirmPassword: 'password123',
        organization: '',
        staffId: '',
        linkedPatientId: '1754739951510',
        isElderly: false
      }
    };

    setFormData(mockData[role]);
    setErrors({});
  };

  // Autofill function for login form
  const autofillLogin = (role: 'patient' | 'medical_staff' | 'family_member') => {
    console.log('Autofill login called for role:', role); // Debug log
    
    const mockLoginData = {
      patient: {
        username: 'lim_ah_kow',
        password: 'password123'
      },
      medical_staff: {
        username: 'dr_sarah_chen',
        password: 'password123'
      },
      family_member: {
        username: 'ah_kow_son',
        password: 'password123'
      }
    };

    const newFormData = {
      ...formData,
      username: mockLoginData[role].username,
      password: mockLoginData[role].password
    };

    console.log('Setting form data to:', newFormData); // Debug log
    
    // Use the functional form of setState to ensure proper update
    setFormData(prevData => ({
      ...prevData,
      username: mockLoginData[role].username,
      password: mockLoginData[role].password
    }));
    
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className={`mt-6 font-bold text-gray-900 ${elderlyMode ? 'elderly-xl' : 'text-3xl'}`}>
            Medical Health Tracker
          </h2>
          <p className={`mt-2 text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
            {isLogin ? 'Welcome back! Please sign in to your account.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* MVP Demo Autofill Buttons */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <h3 className={`font-semibold text-yellow-800 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  🚀 MVP Demo - Quick Fill
                </h3>
              </div>
              <button
                onClick={resetDemoUsers}
                className="flex items-center space-x-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition-colors"
                title="Reset demo users if login fails"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
            <p className={`text-yellow-700 mb-4 ${elderlyMode ? 'elderly-sm' : 'text-xs'}`}>
              {isLogin 
                ? 'Click any button below to instantly fill login credentials:'
                : 'Click any button below to instantly fill the form with mock data for demonstration:'
              }
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  console.log('Elderly Patient button clicked'); // Debug log
                  isLogin ? autofillLogin('patient') : autofillForm('patient');
                }}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors text-xs font-medium"
              >
                <Heart className="h-3 w-3" />
                <span>Elderly Patient</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('Medical Staff button clicked'); // Debug log
                  isLogin ? autofillLogin('medical_staff') : autofillForm('medical_staff');
                }}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-md transition-colors text-xs font-medium"
              >
                <Stethoscope className="h-3 w-3" />
                <span>Medical Staff</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('Family Member button clicked'); // Debug log
                  isLogin ? autofillLogin('family_member') : autofillForm('family_member');
                }}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md transition-colors text-xs font-medium"
              >
                <Users className="h-3 w-3" />
                <span>Family Member</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {errors.general}
              </div>
            )}

            {/* Role Selection (only for signup) */}
            {!isLogin && (
              <div>
                <label className={`block font-medium text-gray-700 ${elderlyMode ? 'elderly' : 'text-sm'} mb-3`}>
                  Select User Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: 'patient', label: 'Patient', icon: Heart, description: 'Manage your own medical records' },
                    { value: 'medical_staff', label: 'Medical Staff', icon: Stethoscope, description: 'Add medical records for patients' },
                    { value: 'family_member', label: 'Family Member', icon: Users, description: 'Monitor elderly family members' }
                  ].map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.value as any);
                        resetForm();
                      }}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedRole === role.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          selectedRole === role.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <role.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className={`font-medium ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                            {role.label}
                          </div>
                          <div className={`text-gray-500 ${elderlyMode ? 'elderly-sm' : 'text-xs'}`}>
                            {role.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className={`block font-medium text-gray-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    elderlyMode ? 'elderly' : 'text-base'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email (only for signup) */}
            {!isLogin && (
              <div>
                <label htmlFor="email" className={`block font-medium text-gray-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      elderlyMode ? 'elderly' : 'text-base'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            )}

            {/* Medical Staff Fields */}
            {!isLogin && selectedRole === 'medical_staff' && (
              <>
                <div>
                  <label htmlFor="organization" className={`block font-medium text-gray-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                    Organization/Hospital
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.organization ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      elderlyMode ? 'elderly' : 'text-base'
                    }`}
                    placeholder="Enter hospital or clinic name"
                  />
                  {errors.organization && (
                    <p className="mt-1 text-sm text-red-600">{errors.organization}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="staffId" className={`block font-medium text-gray-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                    Staff ID
                  </label>
                  <input
                    id="staffId"
                    name="staffId"
                    type="text"
                    required
                    value={formData.staffId}
                    onChange={(e) => handleInputChange('staffId', e.target.value)}
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.staffId ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      elderlyMode ? 'elderly' : 'text-base'
                    }`}
                    placeholder="Enter your staff ID"
                  />
                  {errors.staffId && (
                    <p className="mt-1 text-sm text-red-600">{errors.staffId}</p>
                  )}
                </div>
              </>
            )}

            {/* Family Member Fields */}
            {!isLogin && selectedRole === 'family_member' && (
              <div>
                <label htmlFor="linkedPatientId" className={`block font-medium text-gray-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Elderly Patient ID
                </label>
                <input
                  id="linkedPatientId"
                  name="linkedPatientId"
                  type="text"
                  required
                  value={formData.linkedPatientId}
                  onChange={(e) => handleInputChange('linkedPatientId', e.target.value)}
                  className={`appearance-none block w-full px-3 py-3 border ${
                    errors.linkedPatientId ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    elderlyMode ? 'elderly' : 'text-base'
                  }`}
                  placeholder="Enter the elderly patient's ID"
                />
                {errors.linkedPatientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedPatientId}</p>
                )}
              </div>
            )}

            {/* Patient Elderly Status */}
            {!isLogin && selectedRole === 'patient' && (
              <div className="flex items-center space-x-3">
                <input
                  id="isElderly"
                  name="isElderly"
                  type="checkbox"
                  checked={formData.isElderly}
                  onChange={(e) => handleInputChange('isElderly', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isElderly" className={`text-gray-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  I am an elderly patient (65+ years old)
                </label>
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className={`block font-medium text-gray-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`appearance-none block w-full pl-10 pr-10 py-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    elderlyMode ? 'elderly' : 'text-base'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password (only for signup) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className={`block font-medium text-gray-700 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`appearance-none block w-full pl-10 pr-10 py-3 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      elderlyMode ? 'elderly' : 'text-base'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <p className={`text-gray-600 ${elderlyMode ? 'elderly' : 'text-sm'}`}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 