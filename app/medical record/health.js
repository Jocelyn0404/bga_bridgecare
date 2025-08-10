// Health JavaScript
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupHealthForms();
    loadUserProfile();
    loadHealthData();
});

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
}

function setupHealthForms() {
    // Weight and height form
    const weightHeightForm = document.getElementById('weightHeightForm');
    if (weightHeightForm) {
        weightHeightForm.addEventListener('submit', handleWeightHeight);
    }

    // Menstruation form
    const menstruationForm = document.getElementById('menstruationForm');
    if (menstruationForm) {
        menstruationForm.addEventListener('submit', handleMenstruation);
    }

    // Age-based health form
    const ageHealthForm = document.getElementById('ageHealthForm');
    if (ageHealthForm) {
        ageHealthForm.addEventListener('submit', handleAgeHealth);
    }

    // Check-up form
    const checkupForm = document.getElementById('checkupForm');
    if (checkupForm) {
        checkupForm.addEventListener('submit', handleCheckup);
    }
}

function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Show menstruation section for females
        if (currentUser.gender === 'female') {
            const menstruationSection = document.getElementById('menstruationSection');
            if (menstruationSection) {
                menstruationSection.style.display = 'block';
            }
        }

        // Show age-based health monitoring for users over 30
        if (currentUser.age > 30) {
            const ageHealthSection = document.getElementById('ageHealthSection');
            if (ageHealthSection) {
                ageHealthSection.style.display = 'block';
            }
        }
    }
}

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
        
        // Save health data
        saveHealthData('bmi', { weight, height, bmi, category: bmiCategory });
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
        
        // Save health data
        saveHealthData('menstruation', { lastPeriod, cycleLength, nextPeriod: nextPeriod.toISOString() });
    }
}

function handleAgeHealth(e) {
    e.preventDefault();
    const cholesterol = document.getElementById('cholesterol').value;
    const bloodPressure = document.getElementById('bloodPressure').value;
    const diabetes = document.getElementById('diabetes').value;
    
    let reminderText = '';
    
    if (cholesterol) {
        const cholesterolLevel = parseInt(cholesterol);
        if (cholesterolLevel > 200) {
            reminderText += '⚠️ Your cholesterol level is high. Please consult a doctor. ';
        }
    }
    
    if (diabetes) {
        const bloodSugar = parseInt(diabetes);
        if (bloodSugar > 126) {
            reminderText += '⚠️ Your blood sugar level is high. Please consult a doctor. ';
        }
    }
    
    if (reminderText) {
        document.getElementById('healthReminder').innerHTML = reminderText;
    } else {
        document.getElementById('healthReminder').innerHTML = 'Health data saved successfully.';
    }
    
    // Save health data
    saveHealthData('ageHealth', { cholesterol, bloodPressure, diabetes });
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
        
        // Save health data
        saveHealthData('checkup', { lastCheckup, nextCheckup: nextCheckup.toISOString() });
    }
}

function saveHealthData(type, data) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser.healthData) {
        currentUser.healthData = {};
    }
    
    currentUser.healthData[type] = {
        ...data,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function loadHealthData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.healthData) {
        // Load BMI data
        if (currentUser.healthData.bmi) {
            document.getElementById('weight').value = currentUser.healthData.bmi.weight || '';
            document.getElementById('height').value = currentUser.healthData.bmi.height || '';
            if (currentUser.healthData.bmi.bmi) {
                document.getElementById('bmiResult').innerHTML = `
                    <strong>BMI: ${currentUser.healthData.bmi.bmi.toFixed(1)}</strong><br>
                    Category: ${currentUser.healthData.bmi.category}
                `;
            }
        }
        
        // Load menstruation data
        if (currentUser.healthData.menstruation) {
            document.getElementById('lastPeriod').value = currentUser.healthData.menstruation.lastPeriod || '';
            document.getElementById('cycleLength').value = currentUser.healthData.menstruation.cycleLength || 28;
        }
        
        // Load age health data
        if (currentUser.healthData.ageHealth) {
            document.getElementById('cholesterol').value = currentUser.healthData.ageHealth.cholesterol || '';
            document.getElementById('bloodPressure').value = currentUser.healthData.ageHealth.bloodPressure || '';
            document.getElementById('diabetes').value = currentUser.healthData.ageHealth.diabetes || '';
        }
        
        // Load checkup data
        if (currentUser.healthData.checkup) {
            document.getElementById('lastCheckup').value = currentUser.healthData.checkup.lastCheckup || '';
        }
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