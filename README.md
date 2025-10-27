# ClinReport# ClinReport Mobile App



AI-powered health monitoring and management mobile app built with React Native and Expo.**AI-Powered Personal Health Monitoring & Management Platform**



## FeaturesA comprehensive React Native mobile application that empowers users to track their health, receive AI-powered risk assessments, connect with healthcare providers, and manage their wellness journey - all in one powerful app.



- 📊 **AI Health Analysis** - Risk assessment and personalized recommendations## 🚀 Key Features

- 🏥 **Health Tracking** - Monitor vitals, symptoms, sleep, exercise, and medications

- 🚨 **Emergency Services** - Quick access to emergency contacts and hospital finder### 📊 AI-Powered Health Analysis

- 🏨 **Hospital Integration** - Browse hospitals, book appointments with doctors- **Smart Risk Assessment**: Advanced AI engine analyzes your health data and provides risk scores (0-100)

- 🔔 **Smart Notifications** - Health reminders and medication alerts- **Multi-Factor Analysis**: Evaluates symptoms, vital signs, chronic conditions, and health habits

- 💎 **Subscription Plans** - Free, Premium ($4.99/mo), and Enterprise ($14.99/mo) tiers- **Personalized Recommendations**: Tailored health advice based on your unique profile

- **Doctor & Hospital Recommendations**: AI suggests the best healthcare providers for your needs

## Quick Start

### 🏥 Comprehensive Health Tracking

### Prerequisites- **Daily Health Logs**: Track 13+ health metrics including vitals, symptoms, mood, and activities

- **Medical History**: Store and manage medical records (visits, surgeries, tests, vaccinations)

- Node.js v16 or higher- **Disease History**: Track chronic conditions with status monitoring (active, chronic, monitoring, recovered)

- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))- **Sleep Tracking**: Monitor sleep quality, duration, and patterns with 7-day trend charts

- **Exercise Logging**: Record workouts across 8 exercise types with intensity tracking

### Installation- **Medication Adherence**: Track medication compliance with visual calendar and statistics



```bash### 🚨 Emergency Services

npm install- **One-Tap Emergency Contacts**: Quick access to ambulance, police, and fire services

```- **Critical Symptoms Checklist**: 8 emergency symptoms with immediate action guidance

- **AI Hospital Recommendations**: Automatic hospital suggestions based on your condition

### Run the App- **Hospital Services Display**: View emergency, ICU, and ambulance availability



```bash### 🏨 Hospital Integration & Booking

npm start- **MeetDoctors Partnership**: Priority booking with partner hospitals and doctors

```- **Hospital Directory**: Browse 5 major Phnom Penh hospitals with detailed information

- **Doctor Profiles**: View specialties, experience, languages, and contact information

Scan the QR code with your phone's camera (iOS) or Expo Go app (Android).- **Appointment Booking**: Book appointments with date/time selection directly in the app

- **Service Filters**: Find hospitals by emergency services, ICU, and ambulance availability

## Tech Stack

### 🔔 Smart Notifications

- React Native 0.76.5- **Daily Health Reminders**: Customizable time for daily health logging

- Expo SDK 54- **Medication Alerts**: Weekly schedule with per-day medication reminders

- React Navigation 7.1.18- **Health Tips**: Daily wellness tips delivered at your preferred time

- React Context API for state management- **High-Risk Alerts**: Immediate notifications when AI detects high health risks

- **Appointment Reminders**: 24-hour and 1-hour before appointment notifications

## Project Structure

### 💎 Flexible Subscription Plans

```- **Free Tier**: Basic health tracking with manual data entry

src/- **Premium ($4.99/mo)**: AI analysis, unlimited logs, priority support, advanced notifications

├── components/         # Reusable UI components- **Enterprise ($14.99/mo)**: Hospital integration, priority booking, 24/7 support, family accounts

├── context/           # Global state (PatientDataContext)

├── screens/           # App screens (19 total)### 🎨 User Experience

├── services/          # AI analysis & notifications- **Intuitive Interface**: Clean, modern design with color-coded health indicators

└── styles/            # Colors & global styles- **Visual Analytics**: Charts and graphs for sleep, exercise, and medication trends

```- **Modal-Based Forms**: Streamlined data entry with easy-to-use forms

- **Responsive Design**: Optimized for all mobile screen sizes

## Main Screens

## 📱 Running on Expo Go

- **PatientDashboard** - Health tracking hub with AI analysis

- **MedicalHistoryScreen** - Medical records management### Prerequisites

- **SleepTrackingScreen** - Sleep monitoring with charts

- **ExerciseLoggingScreen** - Workout tracking- Node.js (v16 or higher)

- **MedicationTrackingScreen** - Medication adherence- Expo Go app installed on your phone:

- **EmergencyScreen** - Emergency services & hospital finder  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

- **HospitalPartnersScreen** - Hospital directory & booking  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)



## License### Installation



© 2025 ClinReport AI. All rights reserved.1. Clone the repository and navigate to the directory:


```bash
cd "d:\Side Quest\ClinReport"
```

2. Install dependencies:

```bash
npm install
```

### Running the App

1. Start the Expo development server:
```bash
npm start
```

2. A QR code will appear in your terminal and browser

3. **On your phone:**
   - **iOS**: Open the Camera app and scan the QR code
   - **Android**: Open Expo Go app and scan the QR code

4. The app will load on your phone!

### Alternative Commands

- Start with Android emulator: `npm run android`
- Start with iOS simulator (Mac only): `npm run ios`
- Start web version: `npm run web`


## 📂 Project Structure

```
ClinReport/
├── src/
│   ├── components/           # Reusable UI components
│   ├── context/
│   │   └── PatientDataContext.js    # Global state management
│   ├── screens/              # App screens (19 total)
│   │   ├── HomeScreen.js            # Landing page
│   │   ├── ProductScreen.js         # Product features
│   │   ├── DemoScreen.js            # Interactive demo
│   │   ├── ContactScreen.js         # Contact form
│   │   ├── PricingScreen.js         # Pricing information
│   │   ├── AboutScreen.js           # About company
│   │   ├── LoginScreen.js           # User authentication
│   │   ├── DoctorDashboard.js       # Doctor interface
│   │   ├── PatientDashboard.js      # Patient main dashboard with AI
│   │   ├── MedicalHistoryScreen.js  # Medical records management
│   │   ├── DiseaseHistoryScreen.js  # Disease tracking
│   │   ├── SleepTrackingScreen.js   # Sleep monitoring
│   │   ├── ExerciseLoggingScreen.js # Exercise tracking
│   │   ├── MedicationTrackingScreen.js # Medication adherence
│   │   ├── EmergencyScreen.js       # Emergency services
│   │   ├── HospitalPartnersScreen.js # Hospital directory
│   │   ├── HospitalDetailScreen.js  # Hospital info & booking
│   │   ├── NotificationSettingsScreen.js # Notification preferences
│   │   └── SubscriptionScreen.js    # Subscription management
│   ├── services/
│   │   ├── AIAnalysisService.js     # AI health risk engine
│   │   └── NotificationService.js   # Notification management
│   └── styles/
│       ├── colors.js                # Color palette
│       └── globalStyles.js          # Shared styles
├── App.js                    # Main app & navigation
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── README.md                 # This file
├── FEATURES.md               # Detailed feature documentation
├── NEW_FEATURES_PLAN.md      # Feature planning document
├── QUICK_START_GUIDE.md      # Developer quick start
├── FEATURE_UPDATE_SUMMARY.md # Feature summary
├── DEVELOPMENT_ROADMAP.md    # Development roadmap
└── IMPLEMENTATION_SUMMARY.md # Implementation notes
```

## 🛠️ Tech Stack

- **React Native 0.76.5**: Cross-platform mobile framework
- **Expo SDK 54**: Development and build platform
- **React Navigation 7.1.18**: Native navigation library
- **React Context API**: Global state management
- **expo-notifications**: Push notification system
- **Expo Linear Gradient**: Gradient components
- **React Native Safe Area Context**: Safe area handling

## � Dependencies

```json
{
  "expo": "~54.0.20",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "@react-navigation/native": "^7.1.18",
  "@react-navigation/stack": "^7.1.15",
  "expo-notifications": "~0.30.5",
  "expo-linear-gradient": "~14.0.2"
}
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Expo Go app installed on your phone:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd ClinReport
```

2. Install dependencies:

```bash
npm install
```

### Running the App

1. Start the Expo development server:

```bash
npm start
```

2. A QR code will appear in your terminal and browser

3. **On your phone:**
   - **iOS**: Open the Camera app and scan the QR code
   - **Android**: Open Expo Go app and scan the QR code

4. The app will load on your phone!

### Alternative Commands

- Start with Android emulator: `npm run android`
- Start with iOS simulator (Mac only): `npm run ios`
- Start web version: `npm run web`

## 🏗️ Architecture

### State Management

- **PatientDataContext**: Centralized global state using React Context API
- **17 Context Functions**: Complete CRUD operations for all health data
- **Persistent Storage**: AsyncStorage integration for data persistence

### AI Analysis Engine

- **Risk Scoring Algorithm**: Multi-factor weighted scoring system (0-100 scale)
- **Risk Levels**: LOW (<40), MEDIUM (40-70), HIGH (>70)
- **Analysis Factors**:
  - Vital signs (heart rate, blood pressure, temperature, O2 saturation)
  - Symptoms severity and count
  - Chronic conditions
  - Health habits (sleep, exercise, medication adherence)
  - Data completeness

### Services Architecture

- **AIAnalysisService**: Health risk assessment, doctor/hospital recommendations
- **NotificationService**: Notification scheduling, permission management, Android channels

### Navigation Flow

```text
Home → Login → Patient Dashboard (Main Hub)
  ├── Medical History
  ├── Disease History
  ├── Sleep Tracking
  ├── Exercise Logging
  ├── Medication Tracking
  ├── Emergency Services
  ├── Hospital Partners → Hospital Detail → Appointment Booking
  ├── Notification Settings
  └── Subscription Management
```

## 🎯 Key Features Deep Dive

### AI Health Analysis

The AI engine evaluates multiple health factors:

- **Vital Signs Analysis**: Detects abnormal heart rate, blood pressure, temperature, O2 levels
- **Symptom Assessment**: Weights symptom severity and frequency
- **Chronic Condition Monitoring**: Tracks disease progression and status
- **Lifestyle Factors**: Incorporates sleep quality, exercise frequency, medication adherence
- **Personalized Recommendations**: Tailored health advice based on risk profile

### Hospital Integration

- **5 Partner Hospitals**: Major Phnom Penh hospitals with full service details
- **5 Doctor Profiles**: Specialists across multiple medical fields
- **MeetDoctors Partnership**: Priority booking and seamless communication
- **Service Filtering**: Find hospitals by Emergency, ICU, Ambulance availability
- **Appointment Booking**: In-app booking with date/time selection

### Notification System

- **Android Channels**: Separate channels for different notification types
- **Scheduled Notifications**: Daily health reminders, medication alerts, health tips
- **Immediate Alerts**: High-risk health warnings
- **Appointment Reminders**: 24-hour and 1-hour before notifications
- **Customizable Settings**: User control over all notification preferences

## 📱 Screens Overview

| Screen | Purpose | Key Features |
|--------|---------|--------------|
| **PatientDashboard** | Main health tracking hub | 13-field health input, AI analysis, risk display |
| **MedicalHistoryScreen** | Medical records | 6 record types, timeline view, CRUD operations |
| **DiseaseHistoryScreen** | Disease tracking | 4 status types, severity levels, color coding |
| **SleepTrackingScreen** | Sleep monitoring | Quality ratings, 7-day charts, sleep tips |
| **ExerciseLoggingScreen** | Workout logging | 8 exercise types, intensity tracking, weekly goals |
| **MedicationTrackingScreen** | Medication adherence | 30-day calendar, compliance %, streak tracking |
| **EmergencyScreen** | Emergency services | Critical symptoms, hospital finder, one-tap calling |
| **HospitalPartnersScreen** | Hospital directory | Search, filters, MeetDoctors partners |
| **HospitalDetailScreen** | Hospital details | Services, doctors, appointment booking |
| **NotificationSettingsScreen** | Notification preferences | Toggle notifications, view stats, test notifications |
| **SubscriptionScreen** | Subscription management | 3 tiers, billing cycles, payment integration |

## 🚀 Development & Deployment

### Building for Production

**Android:**

```bash
eas build --platform android
```

**iOS:**

```bash
eas build --platform ios
```

### App Store Submission

**Android (Google Play):**

```bash
eas submit --platform android
```

**iOS (App Store):**

```bash
eas submit --platform ios
```

### Environment Configuration

Create `.env` file for API keys and configurations:

```bash
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_STRIPE_KEY=your_stripe_key
```

## 🔧 Troubleshooting

### Common Issues

**QR Code won't scan**

- Ensure phone and computer are on the same Wi-Fi network
- Try "Tunnel" connection mode in Expo
- Use LAN connection for local network

**App won't load**

- Clear Expo Go app cache
- Restart development server
- Check terminal for error messages
- Verify all dependencies are installed

**Notification issues**

- Grant notification permissions in device settings
- Check Android notification channel settings
- Verify NotificationService is properly configured

**Build failures**

- Update Expo SDK: `npx expo install --fix`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check expo-cli version: `npm install -g expo-cli`

## 📚 Documentation

- **[FEATURES.md](./FEATURES.md)**: Comprehensive feature documentation
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)**: Developer quick start guide
- **[NEW_FEATURES_PLAN.md](./NEW_FEATURES_PLAN.md)**: Feature planning document
- **[DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md)**: Development roadmap

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

## 🔐 Security & Privacy

- **Data Encryption**: All sensitive data encrypted at rest
- **HIPAA Compliance**: Architecture follows HIPAA guidelines
- **Secure Storage**: AsyncStorage with encryption for local data
- **Privacy First**: No data shared without explicit user consent

## 📄 License

© 2025 ClinReport AI. All rights reserved.

## 📞 Support & Contact

- **Email**: <support@clinreport.com>
- **Website**: <https://www.clinreport.com>
- **Documentation**: <https://docs.clinreport.com>
- **Issues**: Report bugs via GitHub Issues

---

**Built with ❤️ using React Native & Expo**
