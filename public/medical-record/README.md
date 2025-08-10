# Medical Record Tracker

A comprehensive frontend application for personal health tracking with accessibility features and SDG 10 support.

## Features

### 🔐 User Authentication
- Simple login system with username and password
- Session persistence using localStorage
- Secure logout functionality

### 📊 Health Metrics Tracking
- **Weight & Height**: Calculate BMI and categorize health status
- **Medical Check-ups**: Track last check-up date with 6-month reminders
- **Personal Information**: Age and gender tracking
- **Age-based Reminders**: Special health monitoring alerts for users over 30

### 🩸 Women's Health
- **Menstruation Tracking**: Period prediction and cycle management
- **Conditional Display**: Only shows for female users

### 🏃‍♀️ Exercise & Nutrition
- **Step Counter**: Daily step tracking with health recommendations
- **Calorie Calculator**: Estimate calories from common ingredients
- **Smart Notifications**: Encouraging messages based on activity levels

### 🤖 Medical Assistant Chatbot
- **Symptom Analysis**: Basic health advice for common symptoms
- **Responsive Design**: Real-time chat interface
- **Voice Integration**: Text-to-speech for responses

### ♿ Accessibility Features (SDG 10 Support)
- **Voice Reader**: Text-to-speech functionality for all content
- **Elderly Mode**: Larger text and interface for elderly users
- **Dyslexia-Friendly Font**: OpenDyslexic font option
- **Dark Mode**: Toggle between light and dark themes
- **Font Size Control**: Multiple font size options
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Support**: Automatic high contrast mode detection
- **Reduced Motion**: Respects user's motion preferences
- **Screen Reader Support**: Proper ARIA labels and semantic HTML

### 🎯 Auto-Focus Features
- Automatic cursor focus on main input fields
- Smart focus management after form submissions
- Keyboard navigation support

## File Structure

```
medical-record/
├── index.html      # Login/Register page
├── profile.html    # Gender and age input page
├── health.html     # Health tracking page
├── tracking.html   # Exercise and calorie tracking page
├── settings.html   # Settings and accessibility page
├── style.css       # Styling and accessibility features
├── auth.js         # Authentication functionality
├── profile.js      # Profile management
├── health.js       # Health tracking logic
├── tracking.js     # Exercise and calorie tracking
├── settings.js     # Settings and accessibility controls
└── README.md       # This file
```

## How to Use

1. **Open the Application**: Open `index.html` in a modern web browser
2. **Register/Login**: New users can register, existing users can login
3. **Profile Setup**: Enter your gender and age on the profile page
4. **Health Tracking**: Use the health page to track BMI, menstruation (females), and age-based health monitoring (30+)
5. **Activity Tracking**: Use the tracking page for exercise and calorie tracking, plus medical chatbot
6. **Settings**: Customize accessibility features, dark mode, and provide feedback
7. **Navigation**: Use the bottom navigation icons to move between pages

## Technical Features

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface

### Browser Compatibility
- Modern browsers with ES6+ support
- Speech Synthesis API for voice features
- LocalStorage for data persistence

### Security Considerations
- Client-side only (no server required)
- Local data storage
- Input validation and sanitization

## Accessibility Compliance

- **WCAG 2.1 AA** standards
- **Section 508** compliance
- **SDG 10** support for reduced inequalities
- Minimum 44px touch targets
- Proper focus indicators
- Semantic HTML structure

## Supported Symptoms (Chatbot)

- Fever
- Cough
- Headache
- Fatigue
- Nausea
- Dizziness
- Back pain
- Chest pain
- Shortness of breath

## Calorie Database

Includes common foods like:
- Fruits (apple, banana, orange)
- Proteins (chicken, beef, fish, eggs)
- Grains (rice, bread, pasta)
- Vegetables (broccoli, spinach, carrots)
- Dairy (milk, cheese, yogurt)

## Browser Requirements

- Modern browser with ES6+ support
- Speech Synthesis API support (for voice features)
- LocalStorage support (for data persistence)

## Getting Started

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start tracking your health metrics!

## Future Enhancements

- Data export functionality
- More comprehensive symptom database
- Integration with health devices
- Offline support
- Multi-language support
- Advanced analytics and trends

---

**Note**: This is a frontend-only application for demonstration purposes. For production use, consider adding proper backend services, data encryption, and HIPAA compliance measures. 