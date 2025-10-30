import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { FadeInView, ScaleInView, SlideInView } from '../components/AnimatedView';
import { useSubscription } from '../context/SubscriptionContext';

const LoginScreen = ({ navigation }) => {
  const { upgradePlan, SUBSCRIPTION_PLANS, PLAN_FEATURES } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS?.FREE || 'FREE');

  // Safety check for PLAN_FEATURES
  if (!PLAN_FEATURES || !SUBSCRIPTION_PLANS) {
    return null; // or a loading screen
  }

  const handleContinueAsPatient = () => {
    // Set the selected plan before navigating
    if (selectedPlan === SUBSCRIPTION_PLANS.ENTERPRISE) {
      Alert.alert(
        'Enterprise Plan',
        'Enterprise plan is coming soon! Contact us for more information.',
        [
          { text: 'OK' },
          { text: 'Contact Us', onPress: () => navigation.navigate('Contact') }
        ]
      );
      return;
    }

    upgradePlan(selectedPlan);
    navigation.navigate('PatientDashboard');
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
            <Text style={styles.tagline}>Your AI-Powered Healthcare Companion</Text>
          </View>
        </FadeInView>

        {/* Welcome Text */}
        <SlideInView delay={300}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeSubtitle}>Choose your plan to get started</Text>
          </View>
        </SlideInView>

        {/* Plan Selection */}
        <SlideInView delay={400}>
          <View style={styles.planSelectionSection}>
            <Text style={styles.planSelectionTitle}>Select Your Plan</Text>
            
            {/* Free Plan */}
            <TouchableOpacity
              style={[
                styles.planOption,
                selectedPlan === SUBSCRIPTION_PLANS.FREE && styles.planOptionSelected
              ]}
              onPress={() => setSelectedPlan(SUBSCRIPTION_PLANS.FREE)}
              activeOpacity={0.7}
            >
              <View style={styles.planHeader}>
                <View style={styles.planTitleRow}>
                  <Text style={styles.planName}>FREE</Text>
                  <Text style={styles.planPrice}>$0</Text>
                </View>
                <View style={[
                  styles.radioCircle,
                  selectedPlan === SUBSCRIPTION_PLANS.FREE && styles.radioCircleSelected
                ]}>
                  {selectedPlan === SUBSCRIPTION_PLANS.FREE && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </View>
              <Text style={styles.planFeatureText}>• {PLAN_FEATURES[SUBSCRIPTION_PLANS.FREE].aiSummaryLimit} AI Summary analyses</Text>
              <Text style={styles.planFeatureText}>• Daily health logging</Text>
              <Text style={styles.planFeatureText}>• Medication tracking</Text>
            </TouchableOpacity>

            {/* Premium Plan */}
            <TouchableOpacity
              style={[
                styles.planOption,
                styles.planOptionPremium,
                selectedPlan === SUBSCRIPTION_PLANS.PREMIUM && styles.planOptionSelected
              ]}
              onPress={() => setSelectedPlan(SUBSCRIPTION_PLANS.PREMIUM)}
              activeOpacity={0.7}
            >
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>RECOMMENDED</Text>
              </View>
              <View style={styles.planHeader}>
                <View style={styles.planTitleRow}>
                  <Text style={styles.planName}>PREMIUM</Text>
                  <Text style={styles.planPrice}>$3.99<Text style={styles.planPeriod}>/mo</Text></Text>
                </View>
                <View style={[
                  styles.radioCircle,
                  selectedPlan === SUBSCRIPTION_PLANS.PREMIUM && styles.radioCircleSelected
                ]}>
                  {selectedPlan === SUBSCRIPTION_PLANS.PREMIUM && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </View>
              <Text style={styles.planFeatureText}>• Unlimited AI Summary analyses</Text>
              <Text style={styles.planFeatureText}>• AI Agent chatbot access</Text>
              <Text style={styles.planFeatureText}>• Doctor & hospital recommendations</Text>
              <Text style={styles.planFeatureText}>• Priority support</Text>
            </TouchableOpacity>

            {/* Enterprise Plan */}
            <TouchableOpacity
              style={[
                styles.planOption,
                styles.planOptionEnterprise,
                selectedPlan === SUBSCRIPTION_PLANS.ENTERPRISE && styles.planOptionSelected
              ]}
              onPress={() => setSelectedPlan(SUBSCRIPTION_PLANS.ENTERPRISE)}
              activeOpacity={0.7}
            >
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonBadgeText}>COMING SOON</Text>
              </View>
              <View style={styles.planHeader}>
                <View style={styles.planTitleRow}>
                  <Text style={styles.planName}>ENTERPRISE</Text>
                  <Text style={styles.planPriceCustom}>Custom</Text>
                </View>
                <View style={[
                  styles.radioCircle,
                  selectedPlan === SUBSCRIPTION_PLANS.ENTERPRISE && styles.radioCircleSelected
                ]}>
                  {selectedPlan === SUBSCRIPTION_PLANS.ENTERPRISE && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </View>
              <Text style={styles.planFeatureText}>• Everything in Premium</Text>
              <Text style={styles.planFeatureText}>• Doctor monitoring dashboard</Text>
              <Text style={styles.planFeatureText}>• Multi-user accounts</Text>
              <Text style={styles.planFeatureText}>• 24/7 support</Text>
            </TouchableOpacity>
          </View>
        </SlideInView>

        {/* Continue Button */}
        <View style={styles.roleContainer}>
          <ScaleInView delay={650}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinueAsPatient}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.continueGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.continueIcon}>🧑‍⚕️</Text>
                <Text style={styles.continueTitle}>Continue to Patient Dashboard</Text>
                <Text style={styles.continueSubtitle}>
                  Start tracking your health with {selectedPlan} plan
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScaleInView>
        </View>

        {/* AI Features Info */}
        <SlideInView delay={750}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>✨ Powered by AI Technology</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>AI Summary:</Text> Analyzes your health data to predict risk levels (Low/High) and provides personalized health summaries.
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>AI Agent:</Text> Chat with an AI doctor that can consult on low-risk conditions and recommend specialists for high-risk cases.
              </Text>
            </View>
          </View>
        </SlideInView>

        {/* Footer Note */}
        <SlideInView delay={850}>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Pricing')}>
              <Text style={styles.footerLink}>View detailed pricing →</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>🔒 Your data is secure and HIPAA compliant</Text>
            <Text style={styles.footerSubtext}>Demo Mode - No API required</Text>
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
  planSelectionSection: {
    marginBottom: 20,
  },
  planSelectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  planOption: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  planOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#f8f9ff',
  },
  planOptionPremium: {
    borderColor: colors.primary,
  },
  planOptionEnterprise: {
    borderColor: '#6c757d',
    opacity: 0.9,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitleRow: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textLight,
  },
  planPriceCustom: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
  },
  planFeatureText: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 6,
    lineHeight: 20,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  roleContainer: {
    gap: 20,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 4,
  },
  continueGradient: {
    padding: 24,
    alignItems: 'center',
  },
  continueIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  continueTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  continueSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  infoSection: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 22,
    marginBottom: 12,
  },
  infoBold: {
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerLink: {
    fontSize: 15,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 6,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default LoginScreen;
