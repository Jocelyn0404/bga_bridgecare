'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Bot, User, Phone, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../types';

export default function HealthChatbot() {
  const { state, dispatch } = useApp();
  const { currentUser, chatMessages, elderlyMode } = state;
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formattedTimes, setFormattedTimes] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Format all message timestamps on client side
    const times: {[key: string]: string} = {};
    chatMessages.forEach((message: ChatMessage) => {
      times[message.id] = new Date(message.timestamp).toLocaleTimeString();
    });
    setFormattedTimes(times);
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const detectEmergency = (message: string): boolean => {
    const emergencyKeywords = [
      'emergency', 'urgent', 'pain', 'chest pain', 'heart attack', 'stroke',
      'can\'t breathe', 'difficulty breathing', 'unconscious', 'bleeding',
      'severe', 'critical', '911', 'ambulance', 'hospital'
    ];
    return emergencyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const handleEmergency = () => {
    // Use a more React-friendly approach for alerts
    alert('EMERGENCY: Call 911 immediately!');
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return 'Hello! I\'m your health assistant. How can I help you today?';
    }
    
    if (message.includes('bmi') || message.includes('weight')) {
      return 'BMI is calculated using your weight and height. You can update your measurements in the Health tab.';
    }
    
    if (message.includes('exercise') || message.includes('workout')) {
      return 'Regular exercise is important for health. You can track your exercise in the Tracking tab.';
    }
    
    if (message.includes('diet') || message.includes('nutrition')) {
      return 'A balanced diet is crucial for good health. Consider tracking your calories and water intake.';
    }
    
    if (message.includes('sleep')) {
      return 'Getting 7-9 hours of quality sleep is essential for your health and well-being.';
    }
    
    if (message.includes('stress') || message.includes('anxiety')) {
      return 'Managing stress is important. Consider meditation, exercise, or talking to a healthcare professional.';
    }
    
    return 'I\'m here to help with your health questions. Feel free to ask about BMI, exercise, nutrition, or any other health topics.';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentUser) return;

    const isEmergency = detectEmergency(inputMessage);
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      message: inputMessage,
      response: '',
      timestamp: new Date().toISOString(),
      isEmergency: false
    };

    dispatch({
      type: 'ADD_CHAT_MESSAGE',
      payload: userMessage
    });

    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate and add bot response
    const botResponse = generateBotResponse(inputMessage);
    const botMessage = {
      id: (Date.now() + 1).toString(),
      userId: currentUser.id,
      message: '',
      response: botResponse,
      timestamp: new Date().toISOString(),
      isEmergency: isEmergency
    };

    dispatch({
      type: 'ADD_CHAT_MESSAGE',
      payload: botMessage
    });

    setIsTyping(false);

    // Handle emergency
    if (isEmergency) {
      handleEmergency();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-6 h-6 text-primary-600" />
        <h2 className={`${elderlyMode ? 'elderly-xl' : 'text-xl'} font-semibold text-gray-900`}>
          Health Assistant
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className={`${elderlyMode ? 'elderly' : 'text-base'} text-gray-500`}>
              Start a conversation with your health assistant
            </p>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div key={message.id}>
              {/* User Message */}
              {message.message && (
                <div className="flex justify-end mb-2">
                  <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-primary-600 text-white">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>
                          {message.message}
                        </p>
                        <p className={`${elderlyMode ? 'elderly' : 'text-xs'} opacity-70 mt-1`}>
                          {formattedTimes[message.id] || 'Loading...'}
                        </p>
                      </div>
                      <User className="w-4 h-4 mt-0.5" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Bot Response */}
              {message.response && (
                <div className="flex justify-start mb-2">
                  <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                    message.isEmergency
                      ? 'bg-red-100 border border-red-300'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-start gap-2">
                      <Bot className={`w-4 h-4 mt-0.5 ${message.isEmergency ? 'text-red-600' : 'text-primary-600'}`} />
                      <div className="flex-1">
                        <p className={`${elderlyMode ? 'elderly' : 'text-sm'}`}>
                          {message.response}
                        </p>
                        <p className={`${elderlyMode ? 'elderly' : 'text-xs'} opacity-70 mt-1`}>
                          {formattedTimes[message.id] || 'Loading...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Emergency Button */}
      <div className="mb-4">
        <button
          onClick={handleEmergency}
          className="w-full btn-emergency flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Emergency Call
        </button>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 input-field"
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Emergency Warning */}
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className={`${elderlyMode ? 'elderly' : 'text-sm'} text-red-800`}>
              <strong>Emergency Notice:</strong> If you&apos;re experiencing a medical emergency, call 911 immediately. This chatbot is for informational purposes only and cannot provide emergency medical care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 