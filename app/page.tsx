'use client';

import { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import ElderlyModeToggle from './components/ElderlyModeToggle';
import LoginSignup from './components/LoginSignup';
import OnboardingFlow from './components/OnboardingFlow';
import UnifiedDashboard from './components/UnifiedDashboard';
import Link from 'next/link';

export default function Home() {
  const { state } = useApp();
  const { isLoggedIn, currentStep, elderlyMode, currentUser } = state;
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user needs onboarding after login
  useEffect(() => {
    if (isLoggedIn && currentUser && !currentUser.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [isLoggedIn, currentUser]);

  // Show login/signup if not logged in
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen bg-gray-50 ${elderlyMode ? 'elderly-mode' : ''}`}>
        <ElderlyModeToggle />
        <LoginSignup />
      </div>
    );
  }

  // Show onboarding flow if user needs to complete it
  if (showOnboarding) {
    return (
      <div className={`min-h-screen bg-gray-50 ${elderlyMode ? 'elderly-mode' : ''}`}>
        <ElderlyModeToggle />
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      </div>
    );
  }

  // Show main dashboard
  return (
    <div className={`min-h-screen bg-gray-50 ${elderlyMode ? 'elderly-mode' : ''}`}>
      <ElderlyModeToggle />
      <UnifiedDashboard />
    </div>
  );
} 