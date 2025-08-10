'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { User, AccessLog, AccessRequest, ChatMessage, OnboardingData, OnboardingStep, AppSettings } from '../types';

interface AppState {
  isLoggedIn: boolean;
  currentUser: User | null;
  users: User[];
  elderlyMode: boolean;
  accessLogs: AccessLog[];
  accessRequests: AccessRequest[];
  chatMessages: ChatMessage[];
  onboardingData: OnboardingData | null;
  currentStep: string;
  settings: AppSettings;
}

type AppAction =
  | { type: 'SET_LOGGED_IN'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_ELDERLY_MODE'; payload: boolean }
  | { type: 'ADD_ACCESS_LOG'; payload: AccessLog }
  | { type: 'ADD_ACCESS_REQUEST'; payload: AccessRequest }
  | { type: 'UPDATE_ACCESS_REQUEST'; payload: AccessRequest }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_ONBOARDING_DATA'; payload: OnboardingData }
  | { type: 'SET_CURRENT_STEP'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  isLoggedIn: false,
  currentUser: null,
  users: [
    // Demo users for MVP demonstration
    {
      id: '1754739951510',
      username: 'lim_ah_kow',
      email: 'lim.ah.kow@email.com',
      password: 'password123',
      role: 'patient',
      isElderly: true,
      gender: 'male',
      age: 75,
      weight: 70,
      height: 170,
      bmi: 24.2,
      recordMenstruation: false,
      medicalConditions: {
        hypertension: true,
        diabetes: false,
        cholesterol: true
      },
      healthMetrics: {
        cholesterol: 220,
        bloodPressure: {
          systolic: 140,
          diastolic: 90
        },
        bloodSugar: 95
      },
      tracking: {
        exercise: [],
        calories: [],
        water: []
      },
      menstruationData: [],
      onboardingCompleted: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '1754739951511',
      username: 'dr_sarah_chen',
      email: 'dr.sarah.chen@hospital.com',
      password: 'password123',
      role: 'medical_staff',
      organization: 'General Hospital',
      staffId: 'MS001',
      isElderly: false,
      gender: 'female',
      age: 35,
      weight: 60,
      height: 165,
      bmi: 22.0,
      recordMenstruation: false,
      medicalConditions: {
        hypertension: false,
        diabetes: false,
        cholesterol: false
      },
      healthMetrics: {
        cholesterol: 180,
        bloodPressure: {
          systolic: 120,
          diastolic: 80
        },
        bloodSugar: 85
      },
      tracking: {
        exercise: [],
        calories: [],
        water: []
      },
      menstruationData: [],
      onboardingCompleted: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '1754739951512',
      username: 'ah_kow_son',
      email: 'ah.kow.son@email.com',
      password: 'password123',
      role: 'family_member',
      linkedPatientId: '1754739951510',
      isElderly: false,
      gender: 'male',
      age: 45,
      weight: 75,
      height: 175,
      bmi: 24.5,
      recordMenstruation: false,
      medicalConditions: {
        hypertension: false,
        diabetes: false,
        cholesterol: false
      },
      healthMetrics: {
        cholesterol: 190,
        bloodPressure: {
          systolic: 125,
          diastolic: 85
        },
        bloodSugar: 90
      },
      tracking: {
        exercise: [],
        calories: [],
        water: []
      },
      menstruationData: [],
      onboardingCompleted: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  elderlyMode: false,
  accessLogs: [],
  accessRequests: [],
  chatMessages: [],
  onboardingData: null,
  currentStep: 'welcome',
  settings: {
    elderlyMode: false,
    dyslexiaFriendly: false,
    darkMode: false,
    voiceReader: false,
    fontSize: 'medium',
    extraLargeTextMode: false,
    menstruationTracking: false
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_USER':
      // Auto-enable Elderly Mode for users aged 60+
      const shouldEnableElderlyMode = Boolean(action.payload.age && action.payload.age >= 60);
      return { 
        ...state, 
        users: [...state.users, action.payload],
        currentUser: action.payload,
        isLoggedIn: true,
        elderlyMode: shouldEnableElderlyMode,
        settings: {
          ...state.settings,
          elderlyMode: shouldEnableElderlyMode
        }
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'SET_ELDERLY_MODE':
      return { ...state, elderlyMode: action.payload };
    
    case 'ADD_ACCESS_LOG':
      return { ...state, accessLogs: [...state.accessLogs, action.payload] };
    
    case 'ADD_ACCESS_REQUEST':
      return { ...state, accessRequests: [...state.accessRequests, action.payload] };
    
    case 'UPDATE_ACCESS_REQUEST':
      return {
        ...state,
        accessRequests: state.accessRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        )
      };
    
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    
    case 'SET_ONBOARDING_DATA':
      return { ...state, onboardingData: action.payload };
    
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        users: state.users,
        settings: state.settings
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load data from localStorage on mount (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const savedUsers = localStorage.getItem('medicalApp_users');
      const savedSettings = localStorage.getItem('medicalApp_settings');
      const savedLoginState = localStorage.getItem('medicalApp_loginState');
      const savedAccessLogs = localStorage.getItem('medicalApp_accessLogs');
      const savedAccessRequests = localStorage.getItem('medicalApp_accessRequests');

      // Only load users from localStorage if it contains valid demo users
      if (savedUsers) {
        try {
          const users = JSON.parse(savedUsers);
          // Only override if there are valid demo users in localStorage
          if (users && users.length > 0 && users.some((user: any) => 
            user.username === 'lim_ah_kow' || 
            user.username === 'dr_sarah_chen' || 
            user.username === 'ah_kow_son'
          )) {
            dispatch({ type: 'SET_USERS', payload: users });
          } else {
            // Ensure demo users are always available
            dispatch({ type: 'SET_USERS', payload: initialState.users });
          }
        } catch (parseError) {
          console.error('Error parsing saved users:', parseError);
          // If parsing fails, keep demo users
          dispatch({ type: 'SET_USERS', payload: initialState.users });
        }
      } else {
        // Ensure demo users are always available
        dispatch({ type: 'SET_USERS', payload: initialState.users });
      }

      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      }

      if (savedLoginState) {
        const loginState = JSON.parse(savedLoginState);
        dispatch({ type: 'SET_LOGGED_IN', payload: loginState.isLoggedIn });
        if (loginState.currentUser) {
          dispatch({ type: 'SET_CURRENT_USER', payload: loginState.currentUser });
        }
      }

      if (savedAccessLogs) {
        const accessLogs = JSON.parse(savedAccessLogs);
        accessLogs.forEach((log: AccessLog) => {
          dispatch({ type: 'ADD_ACCESS_LOG', payload: log });
        });
      }

      if (savedAccessRequests) {
        const accessRequests = JSON.parse(savedAccessRequests);
        accessRequests.forEach((request: AccessRequest) => {
          dispatch({ type: 'ADD_ACCESS_REQUEST', payload: request });
        });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Ensure demo users are always available even if there's an error
      dispatch({ type: 'SET_USERS', payload: initialState.users });
    }
  }, [isClient]);

  // Save data to localStorage when state changes (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    try {
      localStorage.setItem('medicalApp_users', JSON.stringify(state.users));
      localStorage.setItem('medicalApp_settings', JSON.stringify(state.settings));
      localStorage.setItem('medicalApp_loginState', JSON.stringify({
        isLoggedIn: state.isLoggedIn,
        currentUser: state.currentUser
      }));
      localStorage.setItem('medicalApp_accessLogs', JSON.stringify(state.accessLogs));
      localStorage.setItem('medicalApp_accessRequests', JSON.stringify(state.accessRequests));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state.users, state.settings, state.isLoggedIn, state.currentUser, state.accessLogs, state.accessRequests, isClient]);

  // Apply accessibility settings to DOM
  useEffect(() => {
    if (!isClient) return;
    
    const { settings } = state;
    
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply dyslexia-friendly font
    if (settings.dyslexiaFriendly) {
      document.documentElement.classList.add('dyslexia-friendly');
    } else {
      document.documentElement.classList.remove('dyslexia-friendly');
    }
    
    // Apply font size
    document.documentElement.classList.remove('font-small', 'font-medium', 'font-large');
    document.documentElement.classList.add(`font-${settings.fontSize}`);
    
    // Apply elderly mode
    if (settings.elderlyMode) {
      document.documentElement.classList.add('elderly-mode');
    } else {
      document.documentElement.classList.remove('elderly-mode');
    }
  }, [state.settings, isClient]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Function to reset demo users (for development/testing)
export function resetDemoUsers() {
  if (typeof window !== 'undefined') {
    console.log('Resetting demo users...'); // Debug log
    
    // Clear all localStorage data
    localStorage.removeItem('medicalApp_users');
    localStorage.removeItem('medicalApp_loginState');
    localStorage.removeItem('medicalApp_settings');
    localStorage.removeItem('medicalApp_accessLogs');
    localStorage.removeItem('medicalApp_accessRequests');
    
    console.log('localStorage cleared, reloading page...'); // Debug log
    
    // Reload the page to reset to initial state
    window.location.reload();
  }
} 