import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { FadeInView, ScaleInView, SlideInView } from '../components/AnimatedView';

const LoginScreen = ({ navigation }) => {
  const handleContinueAs = (role) => {
    if (role === 'doctor') {
      navigation.navigate('DoctorDashboard');
    } else {
      navigation.navigate('PatientDashboard');
    }
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo Section */}
        <FadeInView duration={800}>
          <View style={styles.logoSection}>
            <ScaleInView delay={200}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>C</Text>
              </View>
            </ScaleInView>
            <Text style={styles.appName}>ClinReport</Text>
            <Text style={styles.tagline}>Your Healthcare Companion</Text>
          </View>
        </FadeInView>

        {/* Welcome Text */}
        <SlideInView delay={300}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeSubtitle}>Please select your role to continue</Text>
          </View>
        </SlideInView>

        {/* Role Selection Cards */}
        <View style={styles.roleContainer}>
          {/* Doctor Card */}
          <ScaleInView delay={500}>
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleContinueAs('doctor')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.roleGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.roleIcon}>👨‍⚕️</Text>
                <Text style={styles.roleTitle}>Continue as Doctor</Text>
                <Text style={styles.roleDescription}>
                  Manage patient records, schedules, and care plans
                </Text>
                <View style={styles.featureList}>
                  <Text style={styles.featureItem}>• Patient management</Text>
                  <Text style={styles.featureItem}>• Schedule appointments</Text>
                  <Text style={styles.featureItem}>• Track patient progress</Text>
                  <Text style={styles.featureItem}>• Send alerts & reminders</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </ScaleInView>

          {/* Patient Card */}
          <ScaleInView delay={650}>
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => handleContinueAs('patient')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.success, '#38a169']}
                style={styles.roleGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.roleIcon}>🧑‍⚕️</Text>
                <Text style={styles.roleTitle}>Continue as Patient</Text>
                <Text style={styles.roleDescription}>
                  Track your health and follow your care plan
                </Text>
                <View style={styles.featureList}>
                  <Text style={styles.featureItem}>• Daily health logging</Text>
                  <Text style={styles.featureItem}>• Medication tracking</Text>
                  <Text style={styles.featureItem}>• View your records</Text>
                  <Text style={styles.featureItem}>• Receive notifications</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </ScaleInView>
        </View>

        {/* Footer Note */}
        <SlideInView delay={800}>
          <View style={styles.footer}>
            <Text style={styles.footerText}>🔒 Your data is secure and HIPAA compliant</Text>
          </View>
        </SlideInView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.bgLight,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: colors.textLight,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  roleContainer: {
    gap: 20,
  },
  roleCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 4,
  },
  roleGradient: {
    padding: 28,
    minHeight: 220,
  },
  roleIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  roleDescription: {
    fontSize: 15,
    color: colors.white,
    opacity: 0.95,
    marginBottom: 18,
    lineHeight: 22,
  },
  featureList: {
    marginTop: 10,
  },
  featureItem: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default LoginScreen;
