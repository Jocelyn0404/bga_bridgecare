// Settings JavaScript
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupSettingsControls();
    loadSettings();
    setupFeedbackForm();
});

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
}

function setupSettingsControls() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Accessibility toggles
    const elderlyMode = document.getElementById('elderlyMode');
    const dyslexiaMode = document.getElementById('dyslexiaMode');
    const darkMode = document.getElementById('darkMode');
    const voiceReader = document.getElementById('voiceReader');
    const fontSize = document.getElementById('fontSize');

    if (elderlyMode) {
        elderlyMode.addEventListener('change', handleElderlyMode);
    }
    if (dyslexiaMode) {
        dyslexiaMode.addEventListener('change', handleDyslexiaMode);
    }
    if (darkMode) {
        darkMode.addEventListener('change', handleDarkMode);
    }
    if (voiceReader) {
        voiceReader.addEventListener('change', handleVoiceReader);
    }
    if (fontSize) {
        fontSize.addEventListener('change', handleFontSize);
    }
}

function setupFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedback);
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

function handleElderlyMode(e) {
    const isEnabled = e.target.checked;
    const body = document.body;
    
    if (isEnabled) {
        body.classList.add('large-font');
        body.style.fontSize = '20px';
    } else {
        body.classList.remove('large-font');
        body.style.fontSize = '';
    }
    
    saveSettings('elderlyMode', isEnabled);
}

function handleDyslexiaMode(e) {
    const isEnabled = e.target.checked;
    const body = document.body;
    
    if (isEnabled) {
        body.classList.add('dyslexia-font');
    } else {
        body.classList.remove('dyslexia-font');
    }
    
    saveSettings('dyslexiaMode', isEnabled);
}

function handleDarkMode(e) {
    const isEnabled = e.target.checked;
    const body = document.body;
    
    if (isEnabled) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
    
    saveSettings('darkMode', isEnabled);
}

function handleVoiceReader(e) {
    const isEnabled = e.target.checked;
    saveSettings('voiceReader', isEnabled);
    
    if (isEnabled) {
        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Voice reader enabled');
            speechSynthesis.speak(utterance);
        }
    }
}

function handleFontSize(e) {
    const size = e.target.value;
    const body = document.body;
    
    // Remove existing font size classes
    body.classList.remove('small-font', 'medium-font', 'large-font', 'extra-large-font');
    
    // Add new font size class
    switch (size) {
        case 'small':
            body.style.fontSize = '14px';
            break;
        case 'medium':
            body.style.fontSize = '16px';
            break;
        case 'large':
            body.style.fontSize = '18px';
            break;
        case 'extra-large':
            body.style.fontSize = '20px';
            break;
    }
    
    saveSettings('fontSize', size);
}

function handleFeedback(e) {
    e.preventDefault();
    const feedbackType = document.getElementById('feedbackType').value;
    const feedbackMessage = document.getElementById('feedbackMessage').value;
    
    if (!feedbackType || !feedbackMessage) {
        alert('Please fill in all fields');
        return;
    }
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Create feedback object
    const feedback = {
        type: feedbackType,
        message: feedbackMessage,
        username: currentUser.username,
        timestamp: new Date().toISOString()
    };
    
    // Save feedback to localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    // Clear form
    document.getElementById('feedbackForm').reset();
    
    alert('Thank you for your feedback!');
}

function saveSettings(key, value) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser.settings) {
        currentUser.settings = {};
    }
    
    currentUser.settings[key] = value;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function loadSettings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.settings) {
        const settings = currentUser.settings;
        
        // Apply elderly mode
        if (settings.elderlyMode) {
            document.getElementById('elderlyMode').checked = true;
            handleElderlyMode({ target: { checked: true } });
        }
        
        // Apply dyslexia mode
        if (settings.dyslexiaMode) {
            document.getElementById('dyslexiaMode').checked = true;
            handleDyslexiaMode({ target: { checked: true } });
        }
        
        // Apply dark mode
        if (settings.darkMode) {
            document.getElementById('darkMode').checked = true;
            handleDarkMode({ target: { checked: true } });
        }
        
        // Apply voice reader
        if (settings.voiceReader) {
            document.getElementById('voiceReader').checked = true;
        }
        
        // Apply font size
        if (settings.fontSize) {
            document.getElementById('fontSize').value = settings.fontSize;
            handleFontSize({ target: { value: settings.fontSize } });
        }
    }
    
    // Set last updated date
    const lastUpdated = document.getElementById('lastUpdated');
    if (lastUpdated) {
        lastUpdated.textContent = new Date().getFullYear();
    }
} 