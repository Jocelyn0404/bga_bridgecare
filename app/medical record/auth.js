// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupAuthForms();
    checkStoredUser();
});

function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Form switching
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    // Get stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'profile.html';
    } else {
        alert('Invalid username or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
        alert('Username already exists');
        return;
    }

    // Add new user
    const newUser = {
        username,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('Registration successful!');
    window.location.href = 'profile.html';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('regUsername').focus();
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('username').focus();
}

function checkStoredUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // User is already logged in, redirect to profile
        window.location.href = 'profile.html';
    }
} 