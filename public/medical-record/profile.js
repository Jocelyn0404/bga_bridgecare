// Profile JavaScript
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupProfileForm();
    loadExistingProfile();
});

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
}

function setupProfileForm() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);

    if (!gender || !age) {
        alert('Please fill in all fields');
        return;
    }

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update user profile
    currentUser.gender = gender;
    currentUser.age = age;
    currentUser.profileCompleted = true;
    
    // Save updated user
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Show age-based reminder
    if (age > 30) {
        const reminder = document.getElementById('ageReminder');
        reminder.innerHTML = '⚠️ Since you are over 30, please monitor your cholesterol and diabetes levels regularly. Consider annual health screenings.';
        reminder.style.display = 'block';
    }

    alert('Profile saved successfully!');
}

function loadExistingProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.profileCompleted) {
        // Pre-fill form with existing data
        if (currentUser.gender) {
            document.getElementById('gender').value = currentUser.gender;
        }
        if (currentUser.age) {
            document.getElementById('age').value = currentUser.age;
        }
        
        // Show age-based reminder if applicable
        if (currentUser.age > 30) {
            const reminder = document.getElementById('ageReminder');
            reminder.innerHTML = '⚠️ Since you are over 30, please monitor your cholesterol and diabetes levels regularly. Consider annual health screenings.';
            reminder.style.display = 'block';
        }
    }
} 