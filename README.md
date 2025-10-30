# ClinReport

**AI-Powered Personal Health Monitoring & Management Platform**

A comprehensive React Native mobile application built with Expo that empowers users to track their health, receive AI-powered risk assessments, connect with healthcare providers in Phnom Penh, Cambodia, and manage their wellness journey - all in one powerful app.

[![Expo](https://img.shields.io/badge/Expo-54.0.20-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

## 🌟 Overview

ClinReport is designed to make healthcare accessible and manageable for everyone in Cambodia. It combines intelligent health tracking with AI-powered analysis to provide actionable insights and connect users with healthcare providers when needed.

## 🚀 Key Features

### 📊 AI-Powered Health Analysis

- **Smart Risk Assessment**: Advanced AI engine analyzes your health data and provides risk scores (LOW, MEDIUM, HIGH)
- **Multi-Factor Analysis**: Evaluates symptoms, vital signs, chronic conditions, and lifestyle habits
- **Personalized Recommendations**: Tailored health advice based on your unique profile
- **Doctor & Hospital Recommendations**: AI suggests the best healthcare providers for your needs
- **AI Medical Assistant Chat**: Premium feature for doctor-like consultations (conversational health guidance)

### 🏥 Comprehensive Health Tracking

- **Daily Health Logs**: Track 13+ health metrics including:
  - Vital signs (blood pressure, heart rate, temperature, weight)
  - Symptoms and severity
  - Mood and mental state
  - Exercise duration
  - Water intake
  - Smoking status
  - Medication adherence
- **Medical History**: Store and manage complete medical records:
  - Hospital visits
  - Diagnoses and treatments
  - Surgeries and procedures
  - Test results
  - Vaccinations
- **Disease History**: Track chronic conditions with status monitoring (ongoing, resolved, chronic)
- **Sleep Tracking**: Monitor sleep quality, duration, and patterns with 7-day trend charts
- **Exercise Logging**: Record workouts across 8 exercise types with intensity tracking
- **Medication Adherence**: Track medication compliance with visual calendar and statistics

### 🚨 Emergency Services

- **One-Tap Emergency Contacts**: Quick access to:
  - 🚑 Ambulance (119)
  - 👮 Police (117)
  - 🚒 Fire Department (118)
- **Critical Symptoms Checklist**: 8 emergency symptoms with immediate action guidance:
  - Chest pain
  - Difficulty breathing
  - Severe headache
  - Sudden numbness
  - Loss of consciousness
  - Seizure
  - Severe bleeding
  - Severe abdominal pain
- **AI Hospital Recommendations**: Automatic hospital suggestions based on your condition
- **Hospital Services Display**: View emergency, ICU, and ambulance availability

### 🏨 Hospital Integration & Booking (Phnom Penh)

- **Hospital Directory**: Browse 5 major hospitals:
  - Royal Phnom Penh Hospital (Private)
  - Calmette Hospital (Public)
  - Khmer Soviet Friendship Hospital (Public)
  - Sunrise Japan Hospital (Private)
  - Naga Clinic (Private)
- **Doctor Profiles**: View specialties, experience, languages, and contact information
- **MeetDoctors Partnership**: Priority booking with partner hospitals and doctors
- **Appointment Booking**: Book appointments with date/time selection directly in the app
- **Service Filters**: Find hospitals by emergency services, ICU, and ambulance availability
- **Interactive Map**: Location-based hospital search with Google Maps integration

### 🔔 Smart Notifications

- **Daily Health Reminders**: Customizable time for daily health logging
- **Medication Alerts**: Weekly schedule with per-day medication reminders
- **Health Tips**: Daily wellness tips delivered at your preferred time
- **High-Risk Alerts**: Immediate notifications when AI detects high health risks
- **Appointment Reminders**: 24-hour and 1-hour before appointment notifications

### 💎 Flexible Subscription Plans

- **Free Tier**:
  - Habit tracking
  - Notification alerts
  - 3 AI Summary analyses per month
- **Premium ($3.99/mo)**:
  - Everything in Free
  - AI Agent Chat (doctor-like consultation)
  - Unlimited AI Summary analyses
  - Doctor recommendations
  - Hospital recommendations
  - Priority support
- **Enterprise (Coming Soon)**:
  - Hospital integration
  - Priority booking
  - 24/7 support
  - Family accounts
  - Custom features

### 🎨 User Experience

- **Intuitive Interface**: Clean, modern design with color-coded health indicators
- **Visual Analytics**: Charts and graphs for sleep, exercise, and medication trends
- **Smooth Animations**: Polished UI with fade-in, scale-in, and slide-in effects
- **Responsive Design**: Optimized for both mobile and web platforms
- **Dark Mode Ready**: Professional gradient themes

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.5
- **Runtime**: Expo SDK 54.0.20
- **Navigation**: React Navigation 7.1.18
- **State Management**: React Context API
  - `PatientDataContext`: Patient data, medical history, AI assessments
  - `SubscriptionContext`: Subscription plans and feature access
- **Storage**: AsyncStorage for local data persistence
- **Notifications**: Expo Notifications
- **UI Components**:
  - Expo Linear Gradient
  - React Native Gesture Handler
  - React Native Reanimated
  - React Native Safe Area Context
- **Web Support**: React Native Web 0.21.0
- **AI Integration**: n8n Chat 0.63.0 (for AI agent)
- **HTTP Client**: Axios 1.13.1

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── AnimatedView.js     # Fade, scale, and slide animations
│   ├── EmojiIcon.js        # Emoji rendering component
│   ├── FloatingChatButton.js # Floating chat button
│   └── Icon.js             # Icon wrapper component
├── context/                 # Global state management
│   ├── PatientDataContext.js    # Patient data, logs, AI assessments
│   └── SubscriptionContext.js   # Subscription plans and features
├── screens/                 # App screens (19 total)
│   ├── HomeScreen.js       # Landing page with hero section
│   ├── ProductScreen.js    # Product features showcase
│   ├── DemoScreen.js       # Live demo showcase
│   ├── LoginScreen.js      # Authentication
│   ├── PatientDashboard.js # Main health tracking dashboard
│   ├── MedicalHistoryScreen.js      # Medical records management
│   ├── DiseaseHistoryScreen.js      # Disease tracking
│   ├── SleepTrackingScreen.js       # Sleep monitoring
│   ├── ExerciseLoggingScreen.js     # Exercise tracking
│   ├── MedicationTrackingScreen.js  # Medication adherence
│   ├── EmergencyScreen.js           # Emergency contacts and hospitals
│   ├── HospitalPartnersScreen.js    # Hospital directory
│   ├── HospitalDetailScreen.js      # Individual hospital details
│   ├── MapScreen.js                 # Interactive hospital map
│   ├── ChatScreen.js                # AI medical assistant chat
│   ├── SubscriptionScreen.js        # Subscription management
│   ├── PricingScreen.js             # Pricing plans
│   ├── NotificationSettingsScreen.js # Notification preferences
│   ├── ContactScreen.js             # Contact form
│   └── AboutScreen.js               # About the app
├── services/                # Business logic and AI services
│   ├── AIAnalysisService.js         # Health risk assessment engine
│   ├── AISummaryService.js          # AI summary generation
│   ├── AIAgentService.js            # AI chat agent logic
│   └── NotificationService.js       # Notification scheduling
└── styles/                  # Design system
    ├── colors.js            # Color palette
    └── globalStyles.js      # Shared styles
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v16 or higher
- **npm** or **yarn**: Package manager
- **Expo Go**: Mobile app for testing
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Expo Account**: Create a free account at [expo.dev](https://expo.dev/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/LaVireak/ClinReport.git
cd ClinReport
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm start
```

### Running the App

#### On Mobile Device (Recommended)

1. Open Expo Go app on your phone
2. Scan the QR code from the terminal with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

#### On Emulator/Simulator

```bash
# iOS (requires macOS and Xcode)
npm run ios

# Android (requires Android Studio)
npm run android
```

#### On Web Browser

```bash
npm run web
```

## 📱 Key Screens & Usage

### 1. Patient Dashboard

- Central hub for health tracking
- Quick stats: Latest AI assessment, medication compliance, sleep quality
- Action buttons: Log Health, Medical History, Emergency, Hospital Partners
- Visual risk indicators (green = LOW, red = HIGH)

### 2. Daily Health Logging

- Input vitals, symptoms, and lifestyle data
- Data source selection (hospital vs. self-reported)
- Automatic AI analysis after submission
- View AI recommendations and risk assessment

### 3. AI Medical Assistant Chat (Premium)

- Type "hi" for LOW RISK consultation demo
- Type "hello" for HIGH RISK consultation demo
- Conversational health guidance
- Personalized medical advice
- Doctor and hospital recommendations for high-risk cases

### 4. Emergency Screen

- One-tap emergency calling
- Critical symptoms checklist
- Nearby hospital finder with AI recommendations
- Emergency service availability display

### 5. Hospital Partners

- Browse 5 major Phnom Penh hospitals
- Filter by services (Emergency, ICU, Ambulance)
- View detailed hospital information
- Interactive map view
- Direct appointment booking

## 🔐 Data Privacy & Security

- **Local Storage**: All health data stored locally on device using AsyncStorage
- **No Cloud Sync**: Data never leaves your device (demo version)
- **User Control**: Complete control over data deletion and management
- **HIPAA Considerations**: Designed with privacy-first architecture (for production, implement encryption)

## 🎯 AI Services Architecture

### AIAnalysisService

- **Risk Calculation**: Analyzes 8+ health factors
- **Symptom Severity**: Critical vs. warning symptom detection
- **Hospital Matching**: Location-based recommendations
- **Doctor Matching**: Specialty-based doctor suggestions

### AISummaryService

- **Risk Level**: LOW or HIGH classification
- **Summary Generation**: Natural language health summaries
- **Recommendations**: Actionable health advice
- **Usage Tracking**: Respects subscription limits

### AIAgentService

- **Conversational AI**: Natural language health consultations
- **Context Awareness**: Maintains conversation history
- **Emergency Detection**: Identifies urgent situations
- **Follow-up Questions**: Intelligent probing for symptoms

## 🧪 Demo Scenarios

The app includes built-in demo scenarios for testing:

### LOW RISK Consultation

- Type "hi" in chat
- Auto-populates stable vitals
- Shows normal health status
- Provides preventive care advice

### HIGH RISK Consultation

- Type "hello" in chat
- Auto-populates concerning symptoms
- Shows elevated risk indicators
- Recommends immediate medical attention
- Suggests specialists and hospitals

## 🛣️ Roadmap

- [ ] **Backend Integration**: Connect to real healthcare APIs
- [ ] **Data Encryption**: End-to-end encryption for health data
- [ ] **Cloud Sync**: Secure cloud backup and sync
- [ ] **Telemedicine**: Video consultation integration
- [ ] **Lab Results**: Integration with lab result systems
- [ ] **Multi-language**: Khmer language support
- [ ] **Family Accounts**: Manage multiple family members
- [ ] **Apple Health & Google Fit**: Import data from wearables
- [ ] **Prescription Management**: Digital prescriptions
- [ ] **Insurance Integration**: Claims and coverage info

## 🤝 Contributing

This is a private project. For inquiries, please contact the repository owner.

## 📄 License

Private - All rights reserved.

## 📞 Contact & Support

- **Repository**: [github.com/LaVireak/ClinReport](https://github.com/LaVireak/ClinReport)
- **Issues**: Create an issue on GitHub
- **Email**: Contact through the app's Contact screen

## 🙏 Acknowledgments

- Built with ❤️ for the Cambodian healthcare community
- Powered by React Native and Expo
- AI analysis algorithms inspired by medical best practices
- Hospital data for Phnom Penh, Cambodia

---

**Note**: This is a demo version with simulated AI analysis. For production use, integrate with licensed medical AI APIs and consult healthcare professionals for medical advice validation.
