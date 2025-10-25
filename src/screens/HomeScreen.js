import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      {/* Hero Section */}
      <View style={[globalStyles.section, styles.heroSection]}>
        <View style={globalStyles.badge}>
          <View style={styles.pulse} />
          <Text style={globalStyles.badgeText}>Trusted by 500+ healthcare providers</Text>
        </View>

        <Text style={styles.heroTitle}>
          Turn clinical notes into{'\n'}
          <Text style={globalStyles.gradientText}>actionable care</Text> — faster,{'\n'}
          safer, smarter.
        </Text>

        <Text style={styles.heroSubtitle}>
          ClinReport automates medical reporting with EHR-friendly NLP, predictive analytics, and secure
          cloud workflows—freeing clinicians from paperwork and turning records into outcomes.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.buttonPrimary, styles.button]}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={globalStyles.buttonTextPrimary}>📧 Request Demo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.buttonSecondary, styles.button]}
            onPress={() => navigation.navigate('Demo')}
          >
            <Text style={globalStyles.buttonTextSecondary}>▶️ Try Live Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Reduction in documentation time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>94%</Text>
            <Text style={styles.statLabel}>Coding accuracy improvement</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>60%</Text>
            <Text style={styles.statLabel}>Faster patient turnaround</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>99.9%</Text>
            <Text style={styles.statLabel}>Uptime guarantee</Text>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBadges}>
          <View style={styles.trustBadge}>
            <Text style={styles.badgeIcon}>🛡️</Text>
            <Text style={styles.trustBadgeText}>HIPAA Ready</Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.badgeIcon}>🏆</Text>
            <Text style={styles.trustBadgeText}>SOC 2 Type II</Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.badgeIcon}>📅</Text>
            <Text style={styles.trustBadgeText}>30-day free trial</Text>
          </View>
        </View>
      </View>

      {/* Problem Statement */}
      <View style={[globalStyles.section, globalStyles.sectionLight]}>
        <Text style={globalStyles.sectionTitle}>The Clinical Documentation Crisis</Text>
        <Text style={globalStyles.sectionSubtitle}>
          Clinicians spend hours on documentation, EHRs are clunky, and data remains locked in silos—reducing
          time for patient care and increasing risk.
        </Text>

        <View style={globalStyles.card}>
          <Text style={styles.problemIcon}>⏱️</Text>
          <Text style={styles.problemTitle}>Time Consuming</Text>
          <Text style={styles.problemText}>
            Clinicians spend up to 50% of their time on documentation instead of patient care.
          </Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.problemIcon}>⚠️</Text>
          <Text style={styles.problemTitle}>Error-Prone</Text>
          <Text style={styles.problemText}>
            Manual coding and data entry lead to mistakes that affect billing and patient outcomes.
          </Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.problemIcon}>💾</Text>
          <Text style={styles.problemTitle}>Data Silos</Text>
          <Text style={styles.problemText}>
            Critical patient information is trapped in unstructured notes, making it difficult to analyze at scale.
          </Text>
        </View>
      </View>

      {/* Features Overview */}
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>AI-Powered Clinical Intelligence</Text>
        <Text style={globalStyles.sectionSubtitle}>Transform your clinical workflow with intelligent automation</Text>

        <View style={globalStyles.card}>
          <Text style={styles.featureIcon}>🎤</Text>
          <Text style={styles.featureTitle}>Smart Transcription</Text>
          <Text style={styles.featureText}>
            Real-time voice-to-text with medical terminology understanding and SOAP formatting.
          </Text>
          <TouchableOpacity
            style={[globalStyles.buttonSecondary, styles.learnMoreButton]}
            onPress={() => navigation.navigate('Product')}
          >
            <Text style={globalStyles.buttonTextSecondary}>Learn More →</Text>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.featureIcon}>🧠</Text>
          <Text style={styles.featureTitle}>NLP & Auto-coding</Text>
          <Text style={styles.featureText}>
            Extract entities and suggest ICD/CPT codes with confidence scores automatically.
          </Text>
          <TouchableOpacity
            style={[globalStyles.buttonSecondary, styles.learnMoreButton]}
            onPress={() => navigation.navigate('Product')}
          >
            <Text style={globalStyles.buttonTextSecondary}>Learn More →</Text>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.featureIcon}>📈</Text>
          <Text style={styles.featureTitle}>Predictive Analytics</Text>
          <Text style={styles.featureText}>
            Risk stratification, readmission prediction, and actionable clinical insights.
          </Text>
          <TouchableOpacity
            style={[globalStyles.buttonSecondary, styles.learnMoreButton]}
            onPress={() => navigation.navigate('Product')}
          >
            <Text style={globalStyles.buttonTextSecondary}>Learn More →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Testimonials */}
      <View style={[globalStyles.section, globalStyles.sectionLight]}>
        <Text style={globalStyles.sectionTitle}>Trusted by Healthcare Professionals</Text>
        <Text style={globalStyles.sectionSubtitle}>See what clinicians and IT leaders are saying</Text>

        <View style={globalStyles.card}>
          <View style={styles.testimonialHeader}>
            <Text style={styles.avatar}>👩‍⚕️</Text>
            <View>
              <Text style={styles.testimonialName}>Dr. Sarah Chen</Text>
              <Text style={styles.testimonialRole}>Emergency Medicine</Text>
            </View>
          </View>
          <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.testimonialText}>
            "Documentation time reduced from 20 minutes to 5. More time for patients!"
          </Text>
        </View>

        <View style={globalStyles.card}>
          <View style={styles.testimonialHeader}>
            <Text style={styles.avatar}>👨‍💼</Text>
            <View>
              <Text style={styles.testimonialName}>Michael Rodriguez</Text>
              <Text style={styles.testimonialRole}>IT Director</Text>
            </View>
          </View>
          <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.testimonialText}>
            "Seamless integration. Implementation took days, not months."
          </Text>
        </View>

        <View style={globalStyles.card}>
          <View style={styles.testimonialHeader}>
            <Text style={styles.avatar}>👨‍⚕️</Text>
            <View>
              <Text style={styles.testimonialName}>Dr. Amara Okafor</Text>
              <Text style={styles.testimonialRole}>Family Medicine</Text>
            </View>
          </View>
          <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.testimonialText}>
            "Coding suggestions are incredibly accurate. Like having an expert beside me."
          </Text>
        </View>
      </View>

      {/* CTA Section */}
      <LinearGradient colors={[colors.primary, colors.secondary]} style={[globalStyles.section, styles.ctaSection]}>
        <Text style={styles.ctaTitle}>Ready to Transform Your Clinical Workflow?</Text>
        <Text style={styles.ctaSubtitle}>
          Join hundreds of healthcare providers already saving time and improving patient care.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.ctaButton, styles.button]} onPress={() => navigation.navigate('Contact')}>
            <Text style={styles.ctaButtonText}>🚀 Request Pilot</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaButtonSecondary, styles.button]}
            onPress={() => navigation.navigate('Demo')}
          >
            <Text style={styles.ctaButtonSecondaryText}>▶️ Try Interactive Demo</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  heroSection: {
    alignItems: 'center',
  },
  pulse: {
    width: 8,
    height: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
    marginRight: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.textDark,
    marginVertical: 24,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 6,
    marginVertical: 6,
  },
  statsGrid: {
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  trustBadges: {
    flexDirection: 'column',
    width: '100%',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  trustBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  problemIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  problemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  problemText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
  },
  learnMoreButton: {
    marginTop: 12,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 40,
    marginRight: 12,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  testimonialRole: {
    fontSize: 14,
    color: colors.textLight,
  },
  stars: {
    fontSize: 18,
    marginBottom: 12,
  },
  testimonialText: {
    fontSize: 15,
    color: colors.textLight,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  ctaSection: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#e0d9ff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  ctaButtonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.white,
  },
  ctaButtonSecondaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
