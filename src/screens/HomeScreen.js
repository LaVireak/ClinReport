import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { FadeInView, ScaleInView, SlideInView } from '../components/AnimatedView';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      {/* Hero Section */}
      <View style={[globalStyles.section, styles.heroSection]}>
        <FadeInView duration={800}>
          <View style={globalStyles.badge}>
            <View style={styles.pulse} />
            <Text style={globalStyles.badgeText}>Trusted by 500+ healthcare providers</Text>
          </View>
        </FadeInView>

        <SlideInView delay={300}>
          <Text style={styles.heroTitle}>
            Your Personal{'\n'}
            <Text style={globalStyles.gradientText}>AI Health Assistant</Text>{'\n'}
            Always Ready to Help
          </Text>
        </SlideInView>

        <FadeInView delay={500}>
          <Text style={styles.heroSubtitle}>
            Track your health daily, get AI-powered insights, and create professional medical reports
            ready to share with doctors—making healthcare accessible for everyone in Cambodia.
          </Text>
        </FadeInView>

        <View style={styles.buttonContainer}>
          <ScaleInView delay={700}>
            <TouchableOpacity
              style={[globalStyles.buttonPrimary, styles.button]}
              onPress={() => navigation.navigate('Contact')}
            >
              <Text style={globalStyles.buttonTextPrimary}>Request Demo</Text>
            </TouchableOpacity>
          </ScaleInView>

          <ScaleInView delay={800}>
            <TouchableOpacity
              style={[globalStyles.buttonSecondary, styles.button]}
              onPress={() => navigation.navigate('Demo')}
            >
              <Text style={globalStyles.buttonTextSecondary}>Try Live Demo</Text>
            </TouchableOpacity>
          </ScaleInView>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <ScaleInView delay={900}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>AI Health Assistant Available</Text>
            </View>
          </ScaleInView>
          <ScaleInView delay={1000}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1-Tap</Text>
              <Text style={styles.statLabel}>Generate Doctor Reports</Text>
            </View>
          </ScaleInView>
          <ScaleInView delay={1100}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>Free</Text>
              <Text style={styles.statLabel}>Basic Health Tracking</Text>
            </View>
          </ScaleInView>
          <ScaleInView delay={1200}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>Smart</Text>
              <Text style={styles.statLabel}>AI-Powered Insights</Text>
            </View>
          </ScaleInView>
        </View>

        {/* Key Features Badges */}
        <FadeInView delay={1300}>
          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Text style={styles.badgeIcon}>🤖</Text>
              <Text style={styles.trustBadgeText}>AI Health Agent</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.badgeIcon}>📝</Text>
              <Text style={styles.trustBadgeText}>Smart Notes</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.badgeIcon}>🏥</Text>
              <Text style={styles.trustBadgeText}>Doctor Ready</Text>
            </View>
          </View>
        </FadeInView>
      </View>

      {/* AI Doctor Agent Section */}
      <View style={[globalStyles.section, styles.aiAgentSection]}>
        <FadeInView>
          <View style={styles.aiAgentBadge}>
            <View style={styles.aiPulse} />
            <Text style={styles.aiAgentBadgeText}>AI-POWERED INTELLIGENCE</Text>
          </View>
          <Text style={[globalStyles.sectionTitle, styles.aiTitle]}>
            Meet Your AI Medical Assistant
          </Text>
          <Text style={[globalStyles.sectionSubtitle, styles.aiSubtitle]}>
            Like having an expert doctor available 24/7 in every patient dashboard
          </Text>
        </FadeInView>

        <ScaleInView delay={300}>
          <View style={[globalStyles.card, styles.aiFeatureCard]}>
            <View style={styles.iconBox}>
              <Text style={styles.iconBoxText}>🩺</Text>
            </View>
            <Text style={styles.aiFeatureTitle}>Clinical Intelligence</Text>
            <Text style={styles.aiFeatureText}>
              Analyzes patient data instantly, suggests diagnoses, and provides evidence-based recommendations—just like consulting with a senior physician.
            </Text>
          </View>
        </ScaleInView>

        <ScaleInView delay={400}>
          <View style={[globalStyles.card, styles.aiFeatureCard]}>
            <View style={styles.iconBox}>
              <Text style={styles.iconBoxText}>💬</Text>
            </View>
            <Text style={styles.aiFeatureTitle}>Natural Conversations</Text>
            <Text style={styles.aiFeatureText}>
              Ask questions in plain language about symptoms, medications, lab results, or treatment plans—get instant, accurate medical insights.
            </Text>
          </View>
        </ScaleInView>

        <ScaleInView delay={500}>
          <View style={[globalStyles.card, styles.aiFeatureCard]}>
            <View style={styles.iconBox}>
              <Text style={styles.iconBoxText}>⚡</Text>
            </View>
            <Text style={styles.aiFeatureTitle}>Real-Time Decision Support</Text>
            <Text style={styles.aiFeatureText}>
              Integrated into every patient dashboard, providing contextual assistance exactly when you need it—reducing errors and improving outcomes.
            </Text>
          </View>
        </ScaleInView>

        <FadeInView delay={600}>
          <View style={styles.aiPowerHighlight}>
            <Text style={styles.aiPowerIcon}>🚀</Text>
            <Text style={styles.aiPowerText}>
              Powered by advanced medical AI trained on millions of clinical cases
            </Text>
          </View>
        </FadeInView>
      </View>

      {/* Problem Statement - Cambodia Healthcare Challenges */}
      <View style={[globalStyles.section, globalStyles.sectionLight]}>
        <Text style={globalStyles.sectionTitle}>Healthcare Challenges in Cambodia</Text>
        <Text style={globalStyles.sectionSubtitle}>
          Limited access to quality healthcare, expensive hospital visits, and difficulty communicating 
          with doctors—we're here to help bridge that gap.
        </Text>

        <View style={globalStyles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
            <Text style={[styles.iconBoxText, { fontSize: 36 }]}>🏥</Text>
          </View>
          <Text style={styles.problemTitle}>Limited Hospital Access</Text>
          <Text style={styles.problemText}>
            Many people in Cambodia struggle to access hospitals regularly. Long distances, high costs, 
            and limited facilities make it difficult to get proper medical care when needed.
          </Text>
        </View>

        <View style={globalStyles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.iconBoxText, { fontSize: 36 }]}>💰</Text>
          </View>
          <Text style={styles.problemTitle}>Expensive Medical Visits</Text>
          <Text style={styles.problemText}>
            Hospital visits and consultations can be costly. People often delay seeking help until 
            conditions worsen, leading to more serious health issues.
          </Text>
        </View>

        <View style={globalStyles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#dbeafe' }]}>
            <Text style={[styles.iconBoxText, { fontSize: 36 }]}>📋</Text>
          </View>
          <Text style={styles.problemTitle}>Poor Health Record Keeping</Text>
          <Text style={styles.problemText}>
            Without organized health records, patients forget symptoms, medication history, and important 
            details—making it harder for doctors to provide accurate diagnoses and treatment.
          </Text>
        </View>
      </View>

      {/* How ClinReport Helps */}
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>How ClinReport Can Help You</Text>
        <Text style={globalStyles.sectionSubtitle}>Simple tools to take control of your health journey</Text>

        <View style={globalStyles.card}>
          <View style={styles.iconBox}>
            <Text style={[styles.iconBoxText, { fontSize: 36 }]}>📝</Text>
          </View>
          <Text style={styles.featureTitle}>Track Your Health Daily</Text>
          <Text style={styles.featureText}>
            Log your symptoms, medications, sleep, exercise, and vital signs every day. Keep everything 
            organized in one place, so you never forget important health information.
          </Text>
          <TouchableOpacity
            style={[globalStyles.buttonSecondary, styles.learnMoreButton]}
            onPress={() => navigation.navigate('Demo')}
          >
            <Text style={globalStyles.buttonTextSecondary}>Try Demo →</Text>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.card}>
          <View style={styles.iconBox}>
            <Text style={[styles.iconBoxText, { fontSize: 36 }]}>🤖</Text>
          </View>
          <Text style={styles.featureTitle}>AI Health Assistant 24/7</Text>
          <Text style={styles.featureText}>
            Ask health questions anytime and get instant AI-powered answers. Understand your symptoms, 
            learn about medications, and get health advice—like having a doctor's assistant in your pocket.
          </Text>
          <TouchableOpacity
            style={[globalStyles.buttonSecondary, styles.learnMoreButton]}
            onPress={() => navigation.navigate('Demo')}
          >
            <Text style={globalStyles.buttonTextSecondary}>Try Demo →</Text>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.card}>
          <View style={styles.iconBox}>
            <Text style={[styles.iconBoxText, { fontSize: 36 }]}>📄</Text>
          </View>
          <Text style={styles.featureTitle}>Generate Doctor-Ready Reports</Text>
          <Text style={styles.featureText}>
            Create professional medical summaries from your daily health logs with one tap. 
            Share clear, organized reports with doctors to get better diagnoses and treatment—no more 
            forgetting important details during appointments.
          </Text>
          <TouchableOpacity
            style={[globalStyles.buttonSecondary, styles.learnMoreButton]}
            onPress={() => navigation.navigate('Demo')}
          >
            <Text style={globalStyles.buttonTextSecondary}>Try Demo →</Text>
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

      {/* Pricing Section */}
      <View style={[globalStyles.section, styles.pricingSection]}>
        <FadeInView>
          <Text style={globalStyles.sectionTitle}>Choose Your Plan</Text>
          <Text style={globalStyles.sectionSubtitle}>
            Simple, transparent pricing for better health management
          </Text>
        </FadeInView>

        <View style={styles.pricingGrid}>
          {/* FREE Plan */}
          <ScaleInView delay={200}>
            <View style={[globalStyles.card, styles.pricingCard]}>
              <Text style={styles.planBadge}>FREE</Text>
              <Text style={styles.planPrice}>$0<Text style={styles.planPeriod}>/forever</Text></Text>
              <Text style={styles.planDescription}>Get started with basics</Text>
              
              <View style={styles.planFeatures}>
                <Text style={styles.planFeature}>✓ Daily health logging</Text>
                <Text style={styles.planFeature}>✓ 3 AI Summary analyses</Text>
                <Text style={styles.planFeature}>✓ Medication tracking</Text>
                <Text style={styles.planFeature}>✓ Basic health metrics</Text>
              </View>

              <TouchableOpacity
                style={[globalStyles.buttonSecondary, styles.planButton]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={globalStyles.buttonTextSecondary}>Get Started Free</Text>
              </TouchableOpacity>
            </View>
          </ScaleInView>

          {/* PREMIUM Plan */}
          <ScaleInView delay={400}>
            <View style={[globalStyles.card, styles.pricingCard, styles.premiumCard]}>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>MOST POPULAR</Text>
              </View>
              <Text style={styles.planBadge}>PREMIUM</Text>
              <Text style={[styles.planPrice, styles.premiumPrice]}>$3.99<Text style={styles.planPeriod}>/month</Text></Text>
              <Text style={styles.planDescription}>Full AI-powered features</Text>
              
              <View style={styles.planFeatures}>
                <Text style={styles.planFeature}>✓ Everything in Free</Text>
                <Text style={styles.planFeature}>✓ Unlimited AI Summary</Text>
                <Text style={styles.planFeature}>✓ AI Agent chatbot</Text>
                <Text style={styles.planFeature}>✓ Doctor recommendations</Text>
                <Text style={styles.planFeature}>✓ Hospital suggestions</Text>
                <Text style={styles.planFeature}>✓ Priority support</Text>
              </View>

              <TouchableOpacity
                style={[globalStyles.buttonPrimary, styles.planButton]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={globalStyles.buttonTextPrimary}>Start Premium Trial</Text>
              </TouchableOpacity>
            </View>
          </ScaleInView>

          {/* ENTERPRISE Plan */}
          <ScaleInView delay={600}>
            <View style={[globalStyles.card, styles.pricingCard, styles.enterpriseCard]}>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>COMING SOON</Text>
              </View>
              <Text style={styles.planBadge}>ENTERPRISE</Text>
              <Text style={styles.planPrice}>Custom</Text>
              <Text style={styles.planDescription}>For healthcare organizations</Text>
              
              <View style={styles.planFeatures}>
                <Text style={styles.planFeature}>✓ Everything in Premium</Text>
                <Text style={styles.planFeature}>✓ Doctor monitoring</Text>
                <Text style={styles.planFeature}>✓ Multi-user accounts</Text>
                <Text style={styles.planFeature}>✓ Patient management</Text>
                <Text style={styles.planFeature}>✓ Dedicated support</Text>
                <Text style={styles.planFeature}>✓ Custom integrations</Text>
              </View>

              <TouchableOpacity
                style={[globalStyles.buttonSecondary, styles.planButton]}
                onPress={() => navigation.navigate('Contact')}
              >
                <Text style={globalStyles.buttonTextSecondary}>Contact for Demo</Text>
              </TouchableOpacity>
            </View>
          </ScaleInView>
        </View>

        <FadeInView delay={800}>
          <TouchableOpacity
            style={styles.viewAllPricingButton}
            onPress={() => navigation.navigate('Pricing')}
          >
            <Text style={styles.viewAllPricingText}>View detailed pricing comparison →</Text>
          </TouchableOpacity>
        </FadeInView>
      </View>

      {/* CTA Section */}
      <LinearGradient colors={[colors.primary, colors.secondary]} style={[globalStyles.section, styles.ctaSection]}>
        <Text style={styles.ctaTitle}>Ready to Transform Your Health Journey?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of users already managing their health with AI-powered insights.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.ctaButton, styles.button]} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaButtonText}>🚀 Get Started Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaButtonSecondary, styles.button]}
            onPress={() => navigation.navigate('Demo')}
          >
            <Text style={styles.ctaButtonSecondaryText}>▶️ Try Demo</Text>
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
    fontFamily: Platform.OS === 'web' ? 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' : undefined,
  },
  trustBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBoxText: {
    fontSize: 32,
  },
  problemIcon: {
    fontSize: 40,
    marginBottom: 12,
    fontFamily: Platform.OS === 'web' ? 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' : undefined,
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
    fontFamily: Platform.OS === 'web' ? 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' : undefined,
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
    fontFamily: Platform.OS === 'web' ? 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' : undefined,
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
    fontFamily: Platform.OS === 'web' ? 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' : undefined,
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
  // Pricing Section Styles
  pricingSection: {
    paddingVertical: 40,
  },
  pricingGrid: {
    marginTop: 20,
  },
  pricingCard: {
    position: 'relative',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  premiumCard: {
    borderColor: colors.primary,
    backgroundColor: '#f8f9ff',
    transform: [{ scale: 1.02 }],
  },
  enterpriseCard: {
    borderColor: '#6c757d',
    opacity: 0.95,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 1,
  },
  recommendedText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 1,
  },
  comingSoonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  planBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  premiumPrice: {
    color: colors.primary,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textLight,
  },
  planDescription: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 20,
  },
  planFeatures: {
    marginBottom: 20,
  },
  planFeature: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 10,
    lineHeight: 20,
  },
  planButton: {
    marginTop: 8,
  },
  viewAllPricingButton: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewAllPricingText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  // AI Agent Section Styles
  aiAgentSection: {
    backgroundColor: '#f0f4ff',
    paddingVertical: 50,
  },
  aiAgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  aiPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 8,
  },
  aiAgentBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  aiTitle: {
    fontSize: 32,
    textAlign: 'center',
    color: colors.textDark,
    marginBottom: 16,
  },
  aiSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.textLight,
    paddingHorizontal: 20,
  },
  aiFeatureCard: {
    backgroundColor: colors.white,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: 16,
  },
  aiIcon: {
    fontSize: 48,
    marginBottom: 12,
    fontFamily: Platform.OS === 'web' ? 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' : undefined,
  },
  aiFeatureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 10,
  },
  aiFeatureText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textLight,
  },
  aiPowerHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aiPowerIcon: {
    fontSize: 24,
    marginRight: 12,
    fontFamily: Platform.OS === 'web' ? 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' : undefined,
  },
  aiPowerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
});
