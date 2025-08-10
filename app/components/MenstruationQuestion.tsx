'use client';

import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Check, X, Heart, Calendar, AlertCircle, Bell, Plus, Edit, Trash2, Share, MapPin, Clock, TrendingUp, Settings, Eye, Lock, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CycleRecord {
  id: string;
  startDate: Date;
  endDate?: Date;
  symptoms: string[];
  unusualSigns: string[];
  notes?: string;
  isCompleted: boolean;
}

interface CycleData {
  averageCycleLength: number;
  lastPeriodStart: Date;
  nextExpectedPeriod: Date;
  ovulationDay: Date;
  isPregnant: boolean;
  planningConception: boolean;
  irregularCycles: boolean;
  records: CycleRecord[];
  setupCompleted: boolean;
  periodLength: number;
}

interface SetupData {
  lastPeriodDate: string;
  periodLength: string;
  cycleLength: string;
  pastHistory: string[];
}

export default function MenstruationQuestion() {
  const { state, dispatch } = useApp();
  const { elderlyMode, onboardingData } = state;

  const textSize = elderlyMode ? 'elderly-lg' : 'text-lg';
  const buttonSize = elderlyMode ? 'py-6 px-8' : 'py-4 px-6';

  const [cycleData, setCycleData] = useState<CycleData>({
    averageCycleLength: 28,
    lastPeriodStart: new Date(),
    nextExpectedPeriod: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    ovulationDay: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isPregnant: false,
    planningConception: false,
    irregularCycles: false,
    records: [],
    setupCompleted: false,
    periodLength: 5
  });

  const [currentView, setCurrentView] = useState<'main' | 'add-record' | 'settings' | 'sharing' | 'setup'>('main');
  const [setupStep, setSetupStep] = useState(1);
  const [setupData, setSetupData] = useState<SetupData>({
    lastPeriodDate: '',
    periodLength: '',
    cycleLength: '28',
    pastHistory: []
  });
  const [newRecord, setNewRecord] = useState<Partial<CycleRecord>>({
    startDate: new Date(),
    symptoms: [],
    unusualSigns: [],
    notes: ''
  });

  const symptoms = [
    'Heavy bleeding', 'Spotting', 'Severe cramps', 'Mood swings', 
    'Irregular timing', 'Fatigue', 'Cravings', 'Bloating', 'Headaches',
    'Breast tenderness', 'Acne', 'Back pain', 'Nausea'
  ];

  const unusualSigns = [
    'Very heavy bleeding', 'Severe pain', 'Unusual discharge', 
    'Missed period', 'Early period', 'Prolonged bleeding'
  ];

  // Check for first-time setup
  useEffect(() => {
    if (!cycleData.setupCompleted) {
      setCurrentView('setup');
    }
  }, [cycleData.setupCompleted]);

  const nextSetupStep = () => {
    if (validateSetupStep()) {
      if (setupStep < 6) {
        setSetupStep(setupStep + 1);
      } else {
        completeSetup();
      }
    }
  };

  const previousSetupStep = () => {
    if (setupStep > 1) {
      setSetupStep(setupStep - 1);
    }
  };

  const validateSetupStep = () => {
    switch (setupStep) {
      case 1:
        return setupData.lastPeriodDate !== '';
      case 2:
        return setupData.periodLength !== '';
      case 3:
        return true; // Cycle length has default value
      default:
        return true;
    }
  };

  const completeSetup = () => {
    setCycleData(prev => ({
      ...prev,
      setupCompleted: true,
      lastPeriodStart: new Date(setupData.lastPeriodDate),
      periodLength: parseInt(setupData.periodLength),
      averageCycleLength: parseInt(setupData.cycleLength)
    }));
    setCurrentView('main');
  };

  const skipSetup = () => {
    setCycleData(prev => ({
      ...prev,
      setupCompleted: true
    }));
    setCurrentView('main');
  };

  const handleSelection = (recordMenstruation: boolean) => {
    dispatch({
      type: 'SET_ONBOARDING_DATA',
      payload: {
        gender: onboardingData?.gender || 'female',
        age: onboardingData?.age || 0,
        weight: onboardingData?.weight || 0,
        height: onboardingData?.height || 0,
        recordMenstruation,
        medicalConditions: onboardingData?.medicalConditions || {
          hypertension: false,
          diabetes: false,
          cholesterol: false
        }
      },
    });

    if (onboardingData?.age && onboardingData.age > 20) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'conditions' });
    } else {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'complete' });
    }
  };

  const handleBack = () => {
    if (currentView === 'main') {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'basic-info' });
    } else {
      setCurrentView('main');
    }
  };

  const addNewRecord = () => {
    const record: CycleRecord = {
      id: Date.now().toString(),
      startDate: newRecord.startDate || new Date(),
      symptoms: newRecord.symptoms || [],
      unusualSigns: newRecord.unusualSigns || [],
      notes: newRecord.notes || '',
      isCompleted: false
    };
    
    setCycleData(prev => ({
      ...prev,
      records: [...prev.records, record]
    }));
    
    setNewRecord({
      startDate: new Date(),
      symptoms: [],
      unusualSigns: [],
      notes: ''
    });
    setCurrentView('main');
  };

  const completeRecord = (recordId: string) => {
    setCycleData(prev => ({
      ...prev,
      records: prev.records.map(record => 
        record.id === recordId 
          ? { ...record, isCompleted: true, endDate: new Date() }
          : record
      )
    }));
  };

  const toggleSymptom = (symptom: string, type: 'symptoms' | 'unusualSigns') => {
    setNewRecord(prev => ({
      ...prev,
      [type]: prev[type]?.includes(symptom)
        ? prev[type]?.filter(s => s !== symptom)
        : [...(prev[type] || []), symptom]
    }));
  };

  const renderMainView = () => (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${textSize} font-semibold text-gray-900`}>Cycle Status</h2>
          <Bell className="w-6 h-6 text-pink-500" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium`}>Next Period</span>
            </div>
            <p className={`${textSize} font-bold text-gray-900`}>
              {cycleData.nextExpectedPeriod.toLocaleDateString()}
            </p>
            <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>
              {Math.ceil((cycleData.nextExpectedPeriod.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days away
        </p>
      </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium`}>Ovulation</span>
          </div>
            <p className={`${textSize} font-bold text-gray-900`}>
              {cycleData.ovulationDay.toLocaleDateString()}
            </p>
            <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>
              Fertility window
            </p>
          </div>
        </div>
        </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
          <button
          onClick={() => setCurrentView('add-record')}
          className={`${buttonSize} bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2`}
        >
          <Plus className="w-5 h-5" />
          <span className={textSize}>Start Period</span>
          </button>

          <button
          onClick={() => setCurrentView('settings')}
          className={`${buttonSize} bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2`}
        >
          <Settings className="w-5 h-5" />
          <span className={textSize}>Settings</span>
        </button>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${textSize} font-semibold text-gray-900`}>Recent Cycles</h3>
          <button
            onClick={() => setCurrentView('sharing')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Share className="w-4 h-4" />
            <span className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>Share</span>
          </button>
        </div>
        
        {cycleData.records.length === 0 ? (
          <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-600 text-center py-4`}>
            No cycle records yet. Start tracking to see your patterns.
          </p>
        ) : (
          <div className="space-y-3">
            {cycleData.records.slice(-3).map(record => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-900`}>
                      {record.startDate.toLocaleDateString()}
                    </p>
                    <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>
                      {record.symptoms.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.isCompleted ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span>
                    ) : (
                      <button
                        onClick={() => completeRecord(record.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Health Alerts */}
      {cycleData.irregularCycles && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-yellow-800`}>
                Irregular Cycle Detected
              </h4>
              <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-yellow-700 mt-1`}>
                Consider visiting a gynecologist for a health checkup.
              </p>
              <button className="flex items-center gap-2 text-yellow-800 hover:text-yellow-900 mt-2">
                <MapPin className="w-4 h-4" />
                <span className={`${elderlyMode ? 'elderly' : 'text-xs'}`}>Find nearby clinics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pregnancy Mode */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-blue-800`}>
              Pregnancy Mode
            </h4>
            <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-blue-700`}>
              Adjust predictions and get tailored support
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={cycleData.isPregnant || cycleData.planningConception}
              onChange={() => setCycleData(prev => ({ ...prev, planningConception: !prev.planningConception }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAddRecordView = () => (
    <div className="space-y-6">
      <h2 className={`${textSize} font-semibold text-gray-900`}>Start New Cycle</h2>
      
      {/* Date Selection */}
      <div className="bg-white rounded-lg p-4">
        <label className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700 block mb-2`}>
          Start Date
        </label>
        <input
          type="date"
          value={newRecord.startDate?.toISOString().split('T')[0] || ''}
          onChange={(e) => setNewRecord(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Symptoms */}
      <div className="bg-white rounded-lg p-4">
        <label className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700 block mb-3`}>
          Symptoms (select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {symptoms.map(symptom => (
            <label key={symptom} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newRecord.symptoms?.includes(symptom)}
                onChange={() => toggleSymptom(symptom, 'symptoms')}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Unusual Signs */}
      <div className="bg-white rounded-lg p-4">
        <label className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700 block mb-3`}>
          Unusual Signs (if any)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {unusualSigns.map(sign => (
            <label key={sign} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newRecord.unusualSigns?.includes(sign)}
                onChange={() => toggleSymptom(sign, 'unusualSigns')}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>{sign}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg p-4">
        <label className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700 block mb-2`}>
          Additional Notes
        </label>
        <textarea
          value={newRecord.notes || ''}
          onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any additional observations..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentView('main')}
          className={`${buttonSize} bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors`}
        >
          Cancel
        </button>
        <button
          onClick={addNewRecord}
          className={`${buttonSize} bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex-1`}
        >
          Save Record
        </button>
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-6">
      <h2 className={`${textSize} font-semibold text-gray-900`}>Settings</h2>
      
      {/* Reminder Settings */}
      <div className="bg-white rounded-lg p-4">
        <h3 className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-900 mb-3`}>
          Reminder Settings
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>7 days before period</span>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-pink-600" />
          </label>
          <label className="flex items-center justify-between">
            <span className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>3 days before period</span>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-pink-600" />
          </label>
          <label className="flex items-center justify-between">
            <span className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>Ovulation reminder</span>
            <input type="checkbox" className="rounded border-gray-300 text-pink-600" />
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg p-4">
        <h3 className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-900 mb-3`}>
          Privacy & Sharing
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>Enable secure sharing</span>
            <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
          </label>
          <label className="flex items-center justify-between">
            <span className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>Share with family</span>
            <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
          </label>
        </div>
      </div>

      <button
        onClick={() => setCurrentView('main')}
        className={`${buttonSize} bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors w-full`}
      >
        Save Settings
      </button>
    </div>
  );

  const renderSetupView = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-600`}>Step {setupStep} of 6</span>
            <span className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-600`}>{Math.round((setupStep / 6) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(setupStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Setup Steps */}
        {setupStep === 1 && (
          <div className="text-center">
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <h2 className={`${textSize} font-bold text-gray-900 mb-4`}>Welcome to Cycle Tracking!</h2>
            <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-600 mb-6`}>
              Let&apos;s set up your cycle tracker to help you understand your patterns and health better.
            </p>
            <div className="bg-pink-50 rounded-lg p-4 mb-6">
              <h3 className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-pink-800 mb-2`}>
                What we&apos;ll track:
              </h3>
              <ul className={`${elderlyMode ? 'elderly' : 'text-xs'} text-pink-700 space-y-1`}>
                <li>• Your cycle dates and patterns</li>
                <li>• Symptoms and health indicators</li>
                <li>• Fertility and ovulation windows</li>
                <li>• Personalized predictions and reminders</li>
              </ul>
            </div>
          </div>
        )}

        {setupStep === 2 && (
          <div>
            <h2 className={`${textSize} font-bold text-gray-900 mb-4`}>When did your last period start?</h2>
            <div className="mb-6">
              <label className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700 block mb-2`}>
                Last Period Start Date
              </label>
              <input
                type="date"
                value={setupData.lastPeriodDate}
                onChange={(e) => setSetupData(prev => ({ ...prev, lastPeriodDate: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-blue-700`}>
                  This helps us calculate your cycle length and predict future periods accurately.
                </p>
              </div>
            </div>
          </div>
        )}

        {setupStep === 3 && (
          <div>
            <h2 className={`${textSize} font-bold text-gray-900 mb-4`}>How long does your period usually last?</h2>
            <div className="mb-6">
              <label className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700 block mb-2`}>
                Average Period Length
              </label>
              <select
                value={setupData.periodLength}
                onChange={(e) => setSetupData(prev => ({ ...prev, periodLength: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select period length</option>
                <option value="3">3 days</option>
                <option value="4">4 days</option>
                <option value="5">5 days</option>
                <option value="6">6 days</option>
                <option value="7">7 days</option>
                <option value="8">8 days</option>
                <option value="9">9 days</option>
                <option value="10">10 days</option>
              </select>
            </div>
          </div>
        )}

        {setupStep === 4 && (
          <div>
            <h2 className={`${textSize} font-bold text-gray-900 mb-4`}>What&apos;s your average cycle length?</h2>
            <div className="mb-6">
              <label className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-700 block mb-2`}>
                Cycle Length (days between periods)
              </label>
              <select
                value={setupData.cycleLength}
                onChange={(e) => setSetupData(prev => ({ ...prev, cycleLength: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="21">21 days (short cycle)</option>
                <option value="24">24 days</option>
                <option value="26">26 days</option>
                <option value="28">28 days (average)</option>
                <option value="30">30 days</option>
                <option value="32">32 days</option>
                <option value="35">35 days (long cycle)</option>
              </select>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-green-700`}>
                  Don&apos;t worry if you&apos;re not sure - we can adjust this later based on your tracking data.
                </p>
              </div>
            </div>
          </div>
        )}

        {setupStep === 5 && (
          <div>
            <h2 className={`${textSize} font-bold text-gray-900 mb-4`}>Pregnancy & Fertility</h2>
            <div className="mb-6">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-blue-800`}>
                      Pregnancy Mode
                    </h3>
                    <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-blue-700`}>
                      Enable for fertility tracking and pregnancy planning
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cycleData.planningConception}
                      onChange={() => setCycleData(prev => ({ ...prev, planningConception: !prev.planningConception }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {setupStep === 6 && (
            <div className="text-center">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className={`${textSize} font-bold text-gray-900 mb-4`}>You&apos;re all set!</h2>
            <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-gray-600 mb-6`}>
              Your cycle tracker is ready to help you understand your patterns and health better.
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-green-800 mb-2`}>
                What&apos;s next:
              </h3>
              <ul className={`${elderlyMode ? 'elderly' : 'text-xs'} text-green-700 space-y-1`}>
                <li>• Start tracking your current cycle</li>
                <li>• Log symptoms and observations</li>
                <li>• Get personalized predictions</li>
                <li>• Receive helpful reminders</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {setupStep > 1 && (
            <button
              onClick={previousSetupStep}
              className={`${buttonSize} bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          
          {setupStep < 6 ? (
            <button
              onClick={nextSetupStep}
              className={`${buttonSize} bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex-1 flex items-center justify-center gap-2`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={completeSetup}
              className={`${buttonSize} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex-1 flex items-center justify-center gap-2`}
            >
              Start Tracking
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>

        {setupStep === 1 && (
          <button
            onClick={skipSetup}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip setup for now
          </button>
        )}
      </div>
    </div>
  );

  const renderSharingView = () => (
    <div className="space-y-6">
      <h2 className={`${textSize} font-semibold text-gray-900`}>Share Cycle Data</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-blue-800`}>
              Secure Sharing
            </h4>
            <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-blue-700 mt-1`}>
              Share read-only access to your cycle calendar or reports with trusted people.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <h3 className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium text-gray-900 mb-3`}>
          Share Options
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium`}>Share with Doctor</p>
                <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>Send cycle history to healthcare provider</p>
              </div>
              <Eye className="w-4 h-4 text-gray-400" />
            </div>
          </button>
          
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium`}>Share with Family</p>
                <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>Give family members access to your calendar</p>
              </div>
              <Eye className="w-4 h-4 text-gray-400" />
            </div>
          </button>
          
          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${elderlyMode ? 'elderly' : 'text-sm'} font-medium`}>Export Report</p>
                <p className={`${elderlyMode ? 'elderly' : 'text-xs'} text-gray-600`}>Download cycle history as PDF</p>
              </div>
              <Eye className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      <button
        onClick={() => setCurrentView('main')}
        className={`${buttonSize} bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors w-full`}
      >
        Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className={`${textSize} font-bold text-gray-900 mb-2`}>
          Menstrual Cycle Tracking
        </h1>
        <p className={`${elderlyMode ? 'elderly' : 'text-base'} text-gray-600`}>
          Track your cycle, symptoms, and health patterns
          </p>
        </div>

      {currentView === 'setup' ? (
        renderSetupView()
      ) : (
        <div className="card">
          {currentView === 'main' && renderMainView()}
          {currentView === 'add-record' && renderAddRecordView()}
          {currentView === 'settings' && renderSettingsView()}
          {currentView === 'sharing' && renderSharingView()}

          <div className="flex justify-start mt-6">
          <button
            onClick={handleBack}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
      )}
    </div>
  );
} 