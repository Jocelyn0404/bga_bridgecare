// Global variables
let currentUser = null;
let voiceReaderActive = false;
let speechSynthesis = window.speechSynthesis;

// Calorie database
const calorieDatabase = {
    'apple': 52, 'banana': 89, 'orange': 47, 'chicken breast': 165, 'rice': 130,
    'salmon': 208, 'broccoli': 34, 'spinach': 23, 'eggs': 155, 'milk': 42,
    'bread': 79, 'pasta': 131, 'tomato': 18, 'carrot': 41, 'potato': 77,
    'beef': 250, 'pork': 242, 'fish': 100, 'shrimp': 99, 'tofu': 76,
    'cheese': 113, 'yogurt': 59, 'nuts': 607, 'avocado': 160, 'sweet potato': 86
};

// Chatbot responses
const chatbotResponses = {
    'fever': 'Fever can be caused by infections. Rest, stay hydrated, and monitor your temperature. If fever persists above 103°F (39.4°C) or lasts more than 3 days, consult a doctor.',
    'cough': 'Cough can be due to cold, flu, or allergies. Stay hydrated, use honey for soothing, and avoid irritants. If cough persists or is severe, see a doctor.',
    'headache': 'Headaches can be caused by stress, dehydration, or eye strain. Rest in a quiet, dark room, stay hydrated, and try over-the-counter pain relievers. Seek medical attention for severe or persistent headaches.',
    'fatigue': 'Fatigue can result from lack of sleep, stress, or underlying conditions. Ensure adequate sleep, maintain a balanced diet, and exercise regularly. Consult a doctor if fatigue is persistent.',
    'nausea': 'Nausea can be caused by various factors. Try eating small, bland meals, stay hydrated, and avoid strong odors. Seek medical attention if accompanied by severe symptoms.',
    'dizziness': 'Dizziness can be caused by dehydration, low blood pressure, or inner ear issues. Sit or lie down, stay hydrated, and avoid sudden movements. Consult a doctor if severe or persistent.',
    'back pain': 'Back pain is common and often improves with rest, gentle stretching, and proper posture. Use heat or ice therapy. Seek medical attention for severe or persistent pain.',
    'chest pain': 'Chest pain can be serious. If you experience chest pain, especially with shortness of breath, seek immediate medical attention.',
    'shortness of breath': 'Shortness of breath can be serious. If severe or accompanied by chest pain, seek immediate medical attention. For mild cases, rest and avoid exertion.'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupLoginForm();
    setupDashboardForms();
    setupAccessibilityControls();
    setupChatbot();
    
    // Check for stored user data
    checkStoredUser();
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function setupDashboardForms() {
    // Weight and height form
    const weightHeightForm = document.getElementById('weightHeightForm');
    if (weightHeightForm) {
        weightHeightForm.addEventListener('submit', handleWeightHeight);
    }

    // Check-up form
    const checkupForm = document.getElementById('checkupForm');
    if (checkupForm) {
        checkupForm.addEventListener('submit', handleCheckup);
    }

    // Personal information form
    const personalForm = document.getElementById('personalForm');
    if (personalForm) {
        personalForm.addEventListener('submit', handlePersonalInfo);
    }

    // Menstruation form
    const menstruationForm = document.getElementById('menstruationForm');
    if (menstruationForm) {
        menstruationForm.addEventListener('submit', handleMenstruation);
    }

    // Exercise form
    const exerciseForm = document.getElementById('exerciseForm');
    if (exerciseForm) {
        exerciseForm.addEventListener('submit', handleExercise);
    }

    // Calorie form
    const calorieForm = document.getElementById('calorieForm');
    if (calorieForm) {
        calorieForm.addEventListener('submit', handleCalorie);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Gender selection
    const genderSelect = document.getElementById('gender');
    if (genderSelect) {
        genderSelect.addEventListener('change', handleGenderChange);
    }
}

function setupAccessibilityControls() {
    // Voice reader
    const voiceReaderBtn = document.getElementById('voiceReader');
    if (voiceReaderBtn) {
        voiceReaderBtn.addEventListener('click', toggleVoiceReader);
    }

    // Font size toggle
    const fontSizeBtn = document.getElementById('fontSizeToggle');
    if (fontSizeBtn) {
        fontSizeBtn.addEventListener('click', toggleFontSize);
    }

    // Dyslexia font
    const dyslexiaBtn = document.getElementById('dyslexiaFont');
    if (dyslexiaBtn) {
        dyslexiaBtn.addEventListener('click', toggleDyslexiaFont);
    }
}

function setupChatbot() {
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatMessage);
    }
}

// Login functionality
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        currentUser = { username, password };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showDashboard();
        speakText(`Welcome ${username}! You are now logged in.`);
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
    speakText('You have been logged out.');
}

function checkStoredUser() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    }
}

function showDashboard() {
    document.getElementById('loginSection').classList.remove('active');
    document.getElementById('dashboardSection').classList.add('active');
    document.getElementById('userDisplayName').textContent = currentUser.username;
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = document.querySelector('#dashboardSection input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function showLogin() {
    document.getElementById('dashboardSection').classList.remove('active');
    document.getElementById('loginSection').classList.add('active');
    document.getElementById('username').focus();
}

// Health tracking functions
function handleWeightHeight(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    if (weight && height) {
        const bmi = calculateBMI(weight, height);
        const bmiCategory = getBMICategory(bmi);
        
        document.getElementById('bmiResult').innerHTML = `
            <strong>BMI: ${bmi.toFixed(1)}</strong><br>
            Category: ${bmiCategory}
        `;
        
        speakText(`Your BMI is ${bmi.toFixed(1)}, which is ${bmiCategory}`);
    }
}

function handleCheckup(e) {
    e.preventDefault();
    const lastCheckup = document.getElementById('lastCheckup').value;
    
    if (lastCheckup) {
        const checkupDate = new Date(lastCheckup);
        const nextCheckup = new Date(checkupDate);
        nextCheckup.setMonth(nextCheckup.getMonth() + 6);
        
        const today = new Date();
        const daysUntilCheckup = Math.ceil((nextCheckup - today) / (1000 * 60 * 60 * 24));
        
        let reminderText = `Next check-up due: ${nextCheckup.toLocaleDateString()}`;
        
        if (daysUntilCheckup <= 0) {
            reminderText = '⚠️ Your check-up is overdue! Please schedule an appointment.';
        } else if (daysUntilCheckup <= 30) {
            reminderText = `⚠️ Your check-up is due soon (${daysUntilCheckup} days). Please schedule an appointment.`;
        }
        
        document.getElementById('checkupReminder').innerHTML = reminderText;
        speakText(reminderText);
    }
}

function handlePersonalInfo(e) {
    e.preventDefault();
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    
    let reminderText = '';
    
    if (age > 30) {
        reminderText = '⚠️ Since you are over 30, please monitor your cholesterol and diabetes levels regularly. Consider annual health screenings.';
        document.getElementById('ageReminder').innerHTML = reminderText;
        speakText(reminderText);
    }
    
    // Store user data
    if (currentUser) {
        currentUser.age = age;
        currentUser.gender = gender;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function handleGenderChange() {
    const gender = document.getElementById('gender').value;
    const menstruationCard = document.getElementById('menstruationCard');
    
    if (gender === 'female') {
        menstruationCard.style.display = 'block';
        speakText('Menstruation tracking is now available.');
    } else {
        menstruationCard.style.display = 'none';
    }
}

function handleMenstruation(e) {
    e.preventDefault();
    const lastPeriod = document.getElementById('lastPeriod').value;
    const cycleLength = parseInt(document.getElementById('cycleLength').value);
    
    if (lastPeriod && cycleLength) {
        const lastPeriodDate = new Date(lastPeriod);
        const nextPeriod = new Date(lastPeriodDate);
        nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
        
        const today = new Date();
        const daysUntilPeriod = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
        
        let reminderText = `Next period expected: ${nextPeriod.toLocaleDateString()}`;
        
        if (daysUntilPeriod <= 3 && daysUntilPeriod >= 0) {
            reminderText = `⚠️ Your period is expected in ${daysUntilPeriod} days.`;
        }
        
        document.getElementById('periodReminder').innerHTML = reminderText;
        speakText(reminderText);
    }
}

function handleExercise(e) {
    e.preventDefault();
    const steps = parseInt(document.getElementById('steps').value);
    
    if (steps) {
        let notificationText = '';
        let notificationClass = 'success';
        
        if (steps < 5000) {
            notificationText = '⚠️ Your step count is low. Aim for at least 10,000 steps daily for better health.';
            notificationClass = '';
        } else if (steps < 10000) {
            notificationText = 'Good effort! Try to reach 10,000 steps for optimal health benefits.';
        } else {
            notificationText = 'Excellent! You\'ve met your daily step goal. Keep up the great work!';
        }
        
        document.getElementById('exerciseNotification').innerHTML = notificationText;
        document.getElementById('exerciseNotification').className = `notification ${notificationClass}`;
        speakText(notificationText);
    }
}

function handleCalorie(e) {
    e.preventDefault();
    const ingredients = document.getElementById('ingredients').value.toLowerCase();
    
    if (ingredients) {
        const ingredientList = ingredients.split(',').map(item => item.trim());
        let totalCalories = 0;
        let foundIngredients = [];
        
        ingredientList.forEach(ingredient => {
            if (calorieDatabase[ingredient]) {
                totalCalories += calorieDatabase[ingredient];
                foundIngredients.push(ingredient);
            }
        });
        
        let resultText = '';
        if (foundIngredients.length > 0) {
            resultText = `Estimated calories: ${totalCalories} kcal<br>Ingredients found: ${foundIngredients.join(', ')}`;
        } else {
            resultText = 'No ingredients found in database. Please try common food names.';
        }
        
        document.getElementById('calorieResult').innerHTML = resultText;
        speakText(`Estimated calories: ${totalCalories} kilocalories`);
    }
}

// Chatbot functionality
function handleChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById('symptomInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage('user', message);
        const response = getChatbotResponse(message);
        addChatMessage('bot', response);
        input.value = '';
        input.focus();
    }
}

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Medical Assistant'}:</strong> ${message}`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    if (sender === 'bot' && voiceReaderActive) {
        speakText(message);
    }
}

function getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [symptom, response] of Object.entries(chatbotResponses)) {
        if (lowerMessage.includes(symptom)) {
            return response;
        }
    }
    
    return 'I understand you\'re experiencing symptoms. Please describe them in more detail, or consider consulting a healthcare professional for personalized medical advice.';
}

// Accessibility functions
function toggleVoiceReader() {
    voiceReaderActive = !voiceReaderActive;
    const btn = document.getElementById('voiceReader');
    btn.classList.toggle('active');
    
    const status = voiceReaderActive ? 'enabled' : 'disabled';
    speakText(`Voice reader ${status}`);
}

function toggleFontSize() {
    const body = document.body;
    body.classList.toggle('large-font');
    
    const status = body.classList.contains('large-font') ? 'enlarged' : 'normal';
    speakText(`Font size set to ${status}`);
}

function toggleDyslexiaFont() {
    const body = document.body;
    body.classList.toggle('dyslexia-font');
    
    const status = body.classList.contains('dyslexia-font') ? 'enabled' : 'disabled';
    speakText(`Dyslexia-friendly font ${status}`);
}

function speakText(text) {
    if (speechSynthesis && voiceReaderActive) {
        speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

// Utility functions
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

// Auto-focus functionality
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' && e.target.type === 'submit') {
        const form = e.target.closest('form');
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            if (inputs.length > 0) {
                setTimeout(() => {
                    inputs[0].focus();
                }, 100);
            }
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals or return to previous state
        const activeSection = document.querySelector('.section.active');
        if (activeSection && activeSection.id === 'dashboardSection') {
            // Focus on main navigation or first input
            const firstInput = activeSection.querySelector('input, textarea, select');
            if (firstInput) firstInput.focus();
        }
    }
}); 