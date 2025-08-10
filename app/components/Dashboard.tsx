'use client';

import { useState, useEffect, useContext } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, Users, Shield, MessageCircle, Settings, LogOut, Plus,
  Activity, Heart, Brain, Calendar, Weight, Ruler
} from 'lucide-react';
import BlockchainAccess from './BlockchainAccess';
import HealthChatbot from './HealthChatbot';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const { currentUser, users, elderlyMode } = state;
  const [activeTab, setActiveTab] = useState('profile');
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    if (currentUser?.createdAt) {
      setFormattedDate(new Date(currentUser.createdAt).toLocaleDateString());
    }
  }, [currentUser?.createdAt]);

  const textSize = elderlyMode ? 'elderly-lg' : 'text-lg';

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleAddUser = () => {
    // Reset to onboarding for new user
    dispatch({ type: 'SET_LOGGED_IN', payload: false });
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
  };

  const getBMI = () => {
    if (currentUser?.weight && currentUser?.height) {
      const heightInMeters = currentUser.height / 100;
      return (currentUser.weight / (heightInMeters * heightInMeters)).toFixed(1);
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

  const navigationTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'access', label: 'Data Access', icon: Shield },
    { id: 'chat', label: 'Health Chat', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="card">
                <h3 className={`${textSize} font-semibold text-gray-900 mb-4`}>
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary-600" />
                    <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700`}>
                      Gender: <span className="font-medium capitalize">{currentUser?.gender}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700`}>
                      Age: <span className="font-medium">{currentUser?.age} years</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Weight className="w-5 h-5 text-primary-600" />
                    <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700`}>
                      Weight: <span className="font-medium">{currentUser?.weight} kg</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-primary-600" />
                    <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700`}>
                      Height: <span className="font-medium">{currentUser?.height} cm</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Metrics */}
              <div className="card">
                <h3 className={`${textSize} font-semibold text-gray-900 mb-4`}>
                  Health Metrics
                </h3>
                <div className="space-y-3">
                  {bmi && (
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-primary-600" />
                      <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700`}>
                        BMI: <span className={`font-medium ${bmiCategory?.color}`}>
                          {bmi} ({bmiCategory?.category})
                        </span>
                      </span>
                    </div>
                  )}
                  {currentUser?.gender === 'female' && currentUser?.recordMenstruation !== null && (
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-pink-600" />
                      <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700`}>
                        Menstruation Tracking: <span className="font-medium">
                          {currentUser.recordMenstruation ? 'Enabled' : 'Disabled'}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Conditions */}
            {currentUser?.age && currentUser.age > 20 && (
              <div className="card">
                <h3 className={`${textSize} font-semibold text-gray-900 mb-4`}>
                  Medical Conditions
                </h3>
                <div className="space-y-2">
                  {Object.values(currentUser.medicalConditions || {}).some(Boolean) ? (
                    Object.entries(currentUser.medicalConditions || {}).map(([condition, hasCondition]) => (
                      hasCondition && (
                        <div key={condition} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <Shield className="w-5 h-5 text-primary-600" />
                          <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700 capitalize`}>
                            {condition.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      )
                    ))
                  ) : (
                    <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-500`}>
                      No medical conditions reported
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 'access':
        return <BlockchainAccess />;
      case 'chat':
        return <HealthChatbot />;
      case 'settings':
        return (
          <div className="card">
            <h3 className={`${textSize} font-semibold text-gray-900 mb-4`}>
              Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700`}>
                  Elderly Mode
                </span>
                <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-900`}>
                  {elderlyMode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-700`}>
                  Profile Created
                </span>
                <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-500`}>
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`${textSize} font-bold text-gray-900 mb-2`}>
            Welcome back, {currentUser?.username}!
          </h1>
          <p className={`${elderlyMode ? 'elderly' : 'text-base'} text-gray-600`}>
            Manage your health profile and data access
          </p>
        </div>
        <div className="flex items-center gap-3">
          {users.length < 2 && (
            <button
              onClick={handleAddUser}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          )}
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Multi-user Info */}
      {users.length > 1 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className={`${elderlyMode ? 'elderly' : 'text-base'} font-medium text-blue-900`}>
              Multi-User Device
            </span>
          </div>
          <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-blue-800`}>
            {users.length} users registered on this device. Switch between users using the &ldquo;Add User&rdquo; button.
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {navigationTabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  );
} 