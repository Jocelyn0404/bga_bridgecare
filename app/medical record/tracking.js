// Tracking JavaScript
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupTrackingForms();
    setupChatbot();
    loadTrackingData();
});

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

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
}

function setupTrackingForms() {
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
}

function setupChatbot() {
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatMessage);
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
        
        // Save tracking data
        saveTrackingData('exercise', { steps, date: new Date().toISOString() });
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
        
        // Save tracking data
        saveTrackingData('calorie', { 
            ingredients: ingredientList, 
            totalCalories, 
            foundIngredients,
            date: new Date().toISOString() 
        });
    }
}

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

function saveTrackingData(type, data) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser.trackingData) {
        currentUser.trackingData = {};
    }
    
    if (!currentUser.trackingData[type]) {
        currentUser.trackingData[type] = [];
    }
    
    currentUser.trackingData[type].push(data);
    
    // Keep only last 30 entries
    if (currentUser.trackingData[type].length > 30) {
        currentUser.trackingData[type] = currentUser.trackingData[type].slice(-30);
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function loadTrackingData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.trackingData) {
        // Load latest exercise data
        if (currentUser.trackingData.exercise && currentUser.trackingData.exercise.length > 0) {
            const latestExercise = currentUser.trackingData.exercise[currentUser.trackingData.exercise.length - 1];
            document.getElementById('steps').value = latestExercise.steps || '';
        }
        
        // Load latest calorie data
        if (currentUser.trackingData.calorie && currentUser.trackingData.calorie.length > 0) {
            const latestCalorie = currentUser.trackingData.calorie[currentUser.trackingData.calorie.length - 1];
            document.getElementById('ingredients').value = latestCalorie.ingredients.join(', ') || '';
        }
    }
} 