import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { useSubscription } from '../context/SubscriptionContext';

export default function PricingScreen({ navigation }) {
  const { subscriptionPlan, upgradePlan, PLAN_FEATURES, SUBSCRIPTION_PLANS } = useSubscription();

  const handleSelectPlan = (plan) => {
    if (plan === SUBSCRIPTION_PLANS.FREE) {
      Alert.alert('Free Plan', 'You are already on the Free plan!');
    } else if (plan === SUBSCRIPTION_PLANS.PREMIUM) {
      Alert.alert(
        'Upgrade to Premium',
        'Upgrade to Premium for $3.99/month?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade',
            onPress: () => {
              upgradePlan(SUBSCRIPTION_PLANS.PREMIUM);
              Alert.alert('Success!', 'You are now on the Premium plan! 🎉');
            },
          },
        ]
      );
    } else if (plan === SUBSCRIPTION_PLANS.ENTERPRISE) {
      Alert.alert(
        'Upgrade to Enterprise',
        'Upgrade to Enterprise plan for $14.99/month?\n\nYou will get:\n• All Premium features\n• Hospital integration\n• Priority booking\n• 24/7 support\n• Family account (5 members)',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade Now',
            onPress: () => {
              upgradePlan(SUBSCRIPTION_PLANS.ENTERPRISE);
              Alert.alert('Success!', 'You are now on the Enterprise plan! 🎉\n\nEnjoy full hospital integration and premium support!');
            },
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Choose Your Plan</Text>
        <Text style={globalStyles.sectionSubtitle}>
          Simple, transparent pricing for better health management
        </Text>
        
        {subscriptionPlan && (
          <View style={styles.currentPlanBanner}>
            <Text style={styles.currentPlanText}>
              Current Plan: <Text style={styles.currentPlanName}>{subscriptionPlan}</Text>
            </Text>
          </View>
        )}

        {/* FREE PLAN */}
        <View style={[globalStyles.card, styles.pricingCard]}>
          <Text style={styles.planBadge}>FREE</Text>
          <Text style={styles.price}>$0<Text style={styles.period}>/forever</Text></Text>
          <Text style={styles.planDescription}>Get started with basic features</Text>
          
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Daily health logging</Text>
            <Text style={styles.feature}>✓ {PLAN_FEATURES[SUBSCRIPTION_PLANS.FREE].aiSummaryLimit} AI Summary analyses</Text>
            <Text style={styles.feature}>✓ Medication tracking</Text>
            <Text style={styles.feature}>✓ Basic health metrics</Text>
            <Text style={styles.feature}>✗ AI Agent chatbot</Text>
            <Text style={styles.feature}>✗ Doctor recommendations</Text>
            <Text style={styles.feature}>✗ Hospital suggestions</Text>
          </View>

          {subscriptionPlan === SUBSCRIPTION_PLANS.FREE ? (
            <View style={styles.currentPlanButton}>
              <Text style={styles.currentPlanButtonText}>Current Plan</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleSelectPlan(SUBSCRIPTION_PLANS.FREE)}
            >
              <Text style={styles.selectButtonText}>Select Free</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* PREMIUM PLAN */}
        <View style={[globalStyles.card, styles.pricingCard, styles.popularCard]}>
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
          <Text style={styles.planBadge}>PREMIUM</Text>
          <Text style={styles.price}>$3.99<Text style={styles.period}>/month</Text></Text>
          <Text style={styles.planDescription}>Full access to all AI-powered features</Text>
          
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Everything in Free</Text>
            <Text style={styles.feature}>✓ Unlimited AI Summary analyses</Text>
            <Text style={styles.feature}>✓ AI Agent chatbot access</Text>
            <Text style={styles.feature}>✓ Doctor recommendations</Text>
            <Text style={styles.feature}>✓ Hospital suggestions with ratings</Text>
            <Text style={styles.feature}>✓ Priority support</Text>
            <Text style={styles.feature}>✓ Advanced health insights</Text>
            <Text style={styles.feature}>✓ Export health reports</Text>
          </View>

          {subscriptionPlan === SUBSCRIPTION_PLANS.PREMIUM ? (
            <View style={styles.currentPlanButton}>
              <Text style={styles.currentPlanButtonText}>Current Plan</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.premiumButton}
              onPress={() => handleSelectPlan(SUBSCRIPTION_PLANS.PREMIUM)}
            >
              <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ENTERPRISE PLAN */}
        <View style={[globalStyles.card, styles.pricingCard, styles.enterpriseCard]}>
          <View style={styles.enterpriseHeader}>
            <Text style={styles.enterpriseIcon}>🏢</Text>
            <Text style={styles.enterpriseDescription}>
              Complete hospital integration & premium support
            </Text>
          </View>
          
          <Text style={styles.enterprisePrice}>
            $<Text style={styles.enterprisePriceAmount}>14.99</Text>
            <Text style={styles.enterprisePricePeriod}> /month</Text>
          </Text>
          
          <View style={styles.features}>
            <Text style={styles.featureTitle}>✓ All Premium features</Text>
            <Text style={styles.feature}>✓ Direct hospital integration</Text>
            <Text style={styles.feature}>✓ MeetDoctors priority booking</Text>
            <Text style={styles.feature}>✓ Seamless data sharing with hospitals</Text>
            <Text style={styles.feature}>✓ Emergency auto-notification</Text>
            <Text style={styles.feature}>✓ 24/7 phone support</Text>
            <Text style={styles.feature}>✓ Dedicated health advisor</Text>
            <Text style={styles.feature}>✓ Family account (up to 5 members)</Text>
            <Text style={styles.feature}>✓ Advanced analytics dashboard</Text>
          </View>

          <View style={styles.keyBenefitsSection}>
            <Text style={styles.keyBenefitsTitle}>✨ Key Benefits:</Text>
            <Text style={styles.keyBenefit}>• Fastest hospital response</Text>
            <Text style={styles.keyBenefit}>• Direct doctor communication</Text>
            <Text style={styles.keyBenefit}>• Family health management</Text>
            <Text style={styles.keyBenefit}>• Priority appointment booking</Text>
          </View>

          {subscriptionPlan === SUBSCRIPTION_PLANS.ENTERPRISE ? (
            <View style={styles.currentPlanButton}>
              <Text style={styles.currentPlanButtonText}>Current Plan</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.upgradeNowButton}
              onPress={() => handleSelectPlan(SUBSCRIPTION_PLANS.ENTERPRISE)}
            >
              <Text style={styles.upgradeNowButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>💡 Why Choose ClinReport?</Text>
          <Text style={styles.noteText}>• AI-powered health analysis</Text>
          <Text style={styles.noteText}>• 24/7 medical assistant chatbot</Text>
          <Text style={styles.noteText}>• Personalized doctor recommendations</Text>
          <Text style={styles.noteText}>• Secure & private health data</Text>
          <Text style={styles.noteText}>• Regular updates & improvements</Text>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>❓ Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I upgrade or downgrade anytime?</Text>
            <Text style={styles.faqAnswer}>Yes! You can change your plan at any time. Changes take effect immediately.</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What happens when I reach the free plan limit?</Text>
            <Text style={styles.faqAnswer}>You'll be prompted to upgrade to Premium for unlimited access. Your data is always saved.</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is my health data secure?</Text>
            <Text style={styles.faqAnswer}>Absolutely! We use enterprise-grade encryption and follow strict privacy standards.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  currentPlanBanner: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  currentPlanText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
  },
  currentPlanName: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pricingCard: {
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.gray200,
    marginBottom: 20,
  },
  popularCard: {
    borderColor: colors.primary,
    backgroundColor: '#f8f9ff',
    transform: [{ scale: 1.02 }],
  },
  enterpriseCard: {
    borderColor: '#6c757d',
    backgroundColor: '#f8f9fa',
    opacity: 0.95,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  comingSoonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  planBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  period: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.textLight,
  },
  planDescription: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  features: {
    marginTop: 8,
    marginBottom: 20,
  },
  feature: {
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 12,
    lineHeight: 22,
  },
  selectButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  selectButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  premiumButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  premiumButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  enterpriseButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  enterpriseButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  enterpriseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.bgLight,
    padding: 12,
    borderRadius: 8,
  },
  enterpriseIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  enterpriseDescription: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  enterprisePrice: {
    fontSize: 20,
    color: colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  enterprisePriceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#6366F1',
  },
  enterprisePricePeriod: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textLight,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
    lineHeight: 22,
  },
  keyBenefitsSection: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  keyBenefitsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  keyBenefit: {
    fontSize: 13,
    color: '#2E7D32',
    marginBottom: 4,
    lineHeight: 20,
  },
  upgradeNowButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upgradeNowButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  currentPlanButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  currentPlanButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  noteSection: {
    marginTop: 24,
    padding: 20,
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 8,
    lineHeight: 22,
  },
  faqSection: {
    marginTop: 8,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
  },
});
