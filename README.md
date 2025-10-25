# ClinReport Mobile App

A React Native mobile application for clinical documentation intelligence, built with Expo.

## 🚀 Features

- **Smart Transcription**: Real-time voice-to-text with medical terminology
- **NLP & Auto-coding**: Automatic ICD/CPT code suggestions with confidence scores
- **Predictive Analytics**: Risk stratification and clinical insights
- **Interactive Demo**: Try the AI-powered clinical note analyzer
- **Mobile-First Design**: Native iOS and Android experience
- **Secure & Compliant**: HIPAA-ready architecture

## 📱 Running on Expo Go

### Prerequisites

- Node.js (v16 or higher)
- Expo Go app installed on your phone:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation

1. Clone the repository and navigate to the directory:

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
ClinReportApp/
├── src/
│   ├── screens/          # App screens
│   │   ├── HomeScreen.js
│   │   ├── ProductScreen.js
│   │   ├── DemoScreen.js
│   │   ├── ContactScreen.js
│   │   ├── PricingScreen.js
│   │   └── AboutScreen.js
│   ├── styles/           # Global styles
│   │   ├── colors.js
│   │   └── globalStyles.js
├── App.js               # Main app & navigation
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## 🛠️ Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform
- **React Navigation**: Navigation library
- **Expo Linear Gradient**: Gradient components

## 🎨 Screens

1. **Home**: Hero section with features overview
2. **Product**: Detailed feature descriptions
3. **Demo**: Interactive demonstrations
4. **Contact**: Contact form for inquiries
5. **Pricing**: Pricing tiers and plans
6. **About**: Company information

## 📝 Development Notes

### Converting from Web to Mobile

This app was converted from a web-based HTML/CSS/JS application to React Native:

- HTML elements → React Native components (View, Text, ScrollView, etc.)
- CSS styles → StyleSheet API
- Web navigation → React Navigation
- Icons (Font Awesome) → Emoji/Unicode characters
- Forms → React Native TextInput components

### Key Differences from Web Version

- No direct HTML/CSS - uses React Native components
- Touch-optimized UI elements
- Native mobile navigation patterns
- Optimized for smaller screens
- Native performance

## 🔧 Troubleshooting

### QR Code won't scan
- Make sure your phone and computer are on the same Wi-Fi network
- Try the "Tunnel" connection mode in Expo

### App won't load
- Clear the Expo Go app cache
- Restart the development server
- Check for error messages in the terminal

### Styling issues
- React Native uses flexbox by default
- Some CSS properties work differently (e.g., no `display: grid`)

## 🚀 Next Steps

To publish your app:

1. Build for production:
```bash
expo build:android
expo build:ios
```

2. Submit to app stores:
```bash
expo submit:android
expo submit:ios
```

## 📄 License

© 2025 ClinReport AI. All rights reserved.

## 🤝 Support

For support, email contact@clinreport.com or visit our website.
