import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { colors } from '../styles/colors';

const SubscriptionScreen = ({ navigation }) => {
  const [currentPlan, setCurrentPlan] = useState('free'); // free, premium, enterprise
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, annual
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartDate, setPauseStartDate] = useState(null);
  const [daysUntilCancellation, setDaysUntilCancellation] = useState(null)

  // Subscription plans
  const plans = {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      monthlyPrice: 0,
      annualPrice: 0,
      icon: '📱',
      color: colors.gray400,
      description: 'Basic health tracking for individuals',
      features: [
        { text: 'Basic health data logging', included: true },
        { text: 'Manual symptom tracking', included: true },
        { text: 'Health history records', included: true },
        { text: 'Sleep tracking', included: true },
        { text: 'Exercise logging', included: true },
        { text: 'AI health analysis', included: false },
        { text: 'Priority support', included: false },
        { text: 'Hospital integration', included: false },
        { text: 'Advanced notifications', included: false },
      ],
      limitations: [
        'Limited to 30 daily logs per month',
        'No AI risk assessment',
        'Standard support only',
      ],
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 4.99,
      monthlyPrice: 4.99,
      annualPrice: 49.99,
      savings: 17,
      icon: '⭐',
      color: '#FFD700',
      popular: true,
      description: 'Advanced AI-powered health monitoring',
      features: [
        { text: 'All Free features', included: true },
        { text: 'Unlimited daily logs', included: true },
        { text: 'AI health analysis & risk assessment', included: true },
        { text: 'Smart health recommendations', included: true },
        { text: 'Advanced notifications', included: true },
        { text: 'Doctor recommendations', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Hospital integration', included: false },
        { text: '24/7 phone support', included: false },
      ],
      benefits: [
        'AI-powered risk detection',
        'Personalized health insights',
        'Priority support response',
      ],
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      price: 14.99,
      monthlyPrice: 14.99,
      annualPrice: 149.99,
      savings: 17,
      icon: '🏢',
      color: colors.primary,
      description: 'Complete hospital integration & premium support',
      features: [
        { text: 'All Premium features', included: true },
        { text: 'Direct hospital integration', included: true },
        { text: 'MeetDoctors priority booking', included: true },
        { text: 'Seamless data sharing with hospitals', included: true },
        { text: 'Emergency auto-notification', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'Dedicated health advisor', included: true },
        { text: 'Family account (up to 5 members)', included: true },
        { text: 'Advanced analytics dashboard', included: true },
      ],
      benefits: [
        'Fastest hospital response',
        'Direct doctor communication',
        'Family health management',
        'Priority appointment booking',
      ],
    },
  };

  const handleSelectPlan = (planId) => {
    if (planId === currentPlan) {
      Alert.alert('Current Plan', 'You are already on this plan');
      return;
    }

    setSelectedPlan(planId);
    if (planId === 'free') {
      handleDowngrade();
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleDowngrade = () => {
    Alert.alert(
      'Downgrade to Free',
      'Are you sure you want to downgrade to the Free plan? You will lose access to premium features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Downgrade',
          style: 'destructive',
          onPress: () => {
            setCurrentPlan('free');
            Alert.alert('Success', 'You have been downgraded to the Free plan');
          },
        },
      ]
    );
  };

  const handleSubscribe = () => {
    if (!selectedPlan) return;

    const plan = plans[selectedPlan];
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;

    Alert.alert(
      'Confirm Subscription',
      `Subscribe to ${plan.name} plan for $${price}/${billingCycle === 'monthly' ? 'month' : 'year'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: () => {
            // In a real app, this would process payment
            setCurrentPlan(selectedPlan);
            setShowPaymentModal(false);
            Alert.alert(
              'Subscription Successful! 🎉',
              `You are now subscribed to the ${plan.name} plan. Enjoy your premium features!`
            );
          },
        },
      ]
    );
  };

  const getCurrentPlanPrice = () => {
    const plan = plans[currentPlan];
    if (plan.id === 'free') return 'Free';
    return `$${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}/${billingCycle === 'monthly' ? 'mo' : 'yr'}`;
  };

  const handlePauseSubscription = () => {
    if (currentPlan === 'free') {
      Alert.alert('No Active Subscription', 'You cannot pause a free plan.');
      return;
    }

    if (isPaused) {
      Alert.alert('Already Paused', 'Your subscription is already paused.');
      return;
    }

    Alert.alert(
      'Pause Subscription',
      'Pause your subscription temporarily?\n\n⚠️ Important:\n• Subscription will be paused immediately\n• You will retain access to premium features\n• After 7 days, subscription will be automatically canceled\n• You can resume anytime within 7 days',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pause Now',
          style: 'default',
          onPress: () => {
            const now = new Date();
            setIsPaused(true);
            setPauseStartDate(now);
            setDaysUntilCancellation(7);
            
            Alert.alert(
              'Subscription Paused ⏸️',
              `Your subscription has been paused.\n\nYou have 7 days to resume before it will be automatically canceled.\n\nResume anytime from the subscription page.`
            );
          },
        },
      ]
    );
  };

  const handleResumeSubscription = () => {
    Alert.alert(
      'Resume Subscription',
      'Resume your subscription and continue enjoying premium features?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resume',
          onPress: () => {
            setIsPaused(false);
            setPauseStartDate(null);
            setDaysUntilCancellation(null);
            Alert.alert(
              'Subscription Resumed! 🎉',
              'Your subscription is now active. Continue enjoying all premium features!'
            );
          },
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    if (currentPlan === 'free') {
      Alert.alert('No Active Subscription', 'You are on the free plan.');
      return;
    }

    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?\n\nYou will lose access to all premium features immediately.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: () => {
            setCurrentPlan('free');
            setIsPaused(false);
            setPauseStartDate(null);
            setDaysUntilCancellation(null);
            Alert.alert(
              'Subscription Canceled',
              'Your subscription has been canceled. You are now on the Free plan.'
            );
          },
        },
      ]
    );
  };

  // Check if subscription should be auto-canceled after 7 days
  React.useEffect(() => {
    if (isPaused && pauseStartDate) {
      const checkInterval = setInterval(() => {
        const now = new Date();
        const daysPassed = Math.floor((now - pauseStartDate) / (1000 * 60 * 60 * 24));
        const remaining = 7 - daysPassed;

        if (remaining <= 0) {
          // Auto-cancel after 7 days
          setCurrentPlan('free');
          setIsPaused(false);
          setPauseStartDate(null);
          setDaysUntilCancellation(null);
          Alert.alert(
            'Subscription Canceled',
            'Your subscription has been automatically canceled after 7 days of being paused. You are now on the Free plan.'
          );
          clearInterval(checkInterval);
        } else {
          setDaysUntilCancellation(remaining);
        }
      }, 1000 * 60 * 60); // Check every hour

      return () => clearInterval(checkInterval);
    }
  }, [isPaused, pauseStartDate]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💎 Subscription Plans</Text>
        <Text style={styles.headerSubtitle}>
          Current Plan: {plans[currentPlan].name} - {getCurrentPlanPrice()}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Pause Status Banner */}
        {isPaused && currentPlan !== 'free' && (
          <View style={styles.pauseBanner}>
            <Text style={styles.pauseIcon}>⏸️</Text>
            <View style={styles.pauseInfo}>
              <Text style={styles.pauseTitle}>Subscription Paused</Text>
              <Text style={styles.pauseText}>
                Your subscription is paused. {daysUntilCancellation} {daysUntilCancellation === 1 ? 'day' : 'days'} remaining before auto-cancellation.
              </Text>
              <TouchableOpacity
                style={styles.resumeButton}
                onPress={handleResumeSubscription}
              >
                <Text style={styles.resumeButtonText}>▶️ Resume Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Subscription Management Section */}
        {currentPlan !== 'free' && (
          <View style={styles.managementSection}>
            <Text style={styles.managementTitle}>⚙️ Manage Subscription</Text>
            <View style={styles.managementButtons}>
              {!isPaused ? (
                <TouchableOpacity
                  style={[styles.managementButton, styles.pauseSubscriptionButton]}
                  onPress={handlePauseSubscription}
                >
                  <Text style={styles.managementButtonText}>⏸️ Pause Subscription</Text>
                  <Text style={styles.managementButtonSubtext}>
                    Take a break (auto-cancel after 7 days)
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.managementButton, styles.resumeSubscriptionButton]}
                  onPress={handleResumeSubscription}
                >
                  <Text style={styles.managementButtonText}>▶️ Resume Subscription</Text>
                  <Text style={styles.managementButtonSubtext}>
                    Continue your subscription
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.managementButton, styles.cancelSubscriptionButton]}
                onPress={handleCancelSubscription}
              >
                <Text style={styles.managementButtonText}>❌ Cancel Subscription</Text>
                <Text style={styles.managementButtonSubtext}>
                  Switch to free plan immediately
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Billing Cycle Toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'monthly' && styles.billingOptionActive
            ]}
            onPress={() => setBillingCycle('monthly')}
          >
            <Text style={[
              styles.billingOptionText,
              billingCycle === 'monthly' && styles.billingOptionTextActive
            ]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'annual' && styles.billingOptionActive
            ]}
            onPress={() => setBillingCycle('annual')}
          >
            <Text style={[
              styles.billingOptionText,
              billingCycle === 'annual' && styles.billingOptionTextActive
            ]}>
              Annual
            </Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Save 17%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plan Cards */}
        {Object.values(plans).map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              currentPlan === plan.id && styles.planCardCurrent,
              plan.popular && styles.planCardPopular,
            ]}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>⭐ MOST POPULAR</Text>
              </View>
            )}

            {/* Current Plan Badge */}
            {currentPlan === plan.id && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>✓ CURRENT PLAN</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <Text style={styles.planIcon}>{plan.icon}</Text>
              <View style={styles.planTitleSection}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
              </View>
            </View>

            <View style={styles.planPricing}>
              <View style={styles.priceRow}>
                <Text style={styles.currency}>$</Text>
                <Text style={styles.price}>
                  {billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                </Text>
                <Text style={styles.period}>
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </Text>
              </View>
              {billingCycle === 'annual' && plan.savings && (
                <Text style={styles.savingsInfo}>
                  Save ${((plan.monthlyPrice * 12) - plan.annualPrice).toFixed(2)} per year
                </Text>
              )}
            </View>

            {/* Features List */}
            <View style={styles.featuresList}>
              {plan.features.map((feature, index) => (
                <View key={`${plan.id}-feature-${index}`} style={styles.featureItem}>
                  <Text style={[
                    styles.featureIcon,
                    !feature.included && styles.featureIconDisabled
                  ]}>
                    {feature.included ? '✓' : '✗'}
                  </Text>
                  <Text style={[
                    styles.featureText,
                    !feature.included && styles.featureTextDisabled
                  ]}>
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>

            {/* Benefits/Limitations */}
            {plan.benefits && (
              <View style={styles.benefitsSection}>
                <Text style={styles.benefitsTitle}>✨ Key Benefits:</Text>
                {plan.benefits.map((benefit, index) => (
                  <Text key={`${plan.id}-benefit-${index}`} style={styles.benefitText}>• {benefit}</Text>
                ))}
              </View>
            )}

            {plan.limitations && (
              <View style={styles.limitationsSection}>
                <Text style={styles.limitationsTitle}>⚠️ Limitations:</Text>
                {plan.limitations.map((limitation, index) => (
                  <Text key={`${plan.id}-limitation-${index}`} style={styles.limitationText}>• {limitation}</Text>
                ))}
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.planButton,
                currentPlan === plan.id && styles.planButtonCurrent,
                plan.popular && !currentPlan === plan.id && styles.planButtonPopular,
              ]}
              onPress={() => handleSelectPlan(plan.id)}
              disabled={currentPlan === plan.id}
            >
              <Text style={[
                styles.planButtonText,
                currentPlan === plan.id && styles.planButtonTextCurrent,
              ]}>
                {currentPlan === plan.id 
                  ? 'Current Plan' 
                  : plan.id === 'free' 
                    ? 'Downgrade' 
                    : 'Upgrade Now'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* FAQ Section */}
        <View style={styles.faqCard}>
          <Text style={styles.faqTitle}>❓ Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I switch plans anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What payment methods do you accept?</Text>
            <Text style={styles.faqAnswer}>
              We accept all major credit cards, debit cards, and mobile payment methods.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is there a free trial?</Text>
            <Text style={styles.faqAnswer}>
              Premium and Enterprise plans include a 7-day free trial. Cancel anytime during the trial period.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How does hospital integration work?</Text>
            <Text style={styles.faqAnswer}>
              Enterprise plan members can share their health data directly with partner hospitals and get priority appointment booking through MeetDoctors.
            </Text>
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need Help Choosing?</Text>
          <Text style={styles.supportText}>
            Our team is here to help you find the perfect plan for your needs.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>📧 Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💳 Subscribe to {selectedPlan && plans[selectedPlan].name}</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {selectedPlan && (
                <>
                  <View style={styles.orderSummary}>
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    <View style={styles.orderRow}>
                      <Text style={styles.orderLabel}>{plans[selectedPlan].name} Plan</Text>
                      <Text style={styles.orderValue}>
                        ${billingCycle === 'monthly' ? plans[selectedPlan].monthlyPrice : plans[selectedPlan].annualPrice}
                      </Text>
                    </View>
                    <View style={styles.orderRow}>
                      <Text style={styles.orderLabel}>Billing Cycle</Text>
                      <Text style={styles.orderValue}>{billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</Text>
                    </View>
                    {billingCycle === 'annual' && plans[selectedPlan].savings && (
                      <View style={styles.savingsRow}>
                        <Text style={styles.savingsLabel}>You Save</Text>
                        <Text style={styles.savingsValue}>
                          ${((plans[selectedPlan].monthlyPrice * 12) - plans[selectedPlan].annualPrice).toFixed(2)}
                        </Text>
                      </View>
                    )}
                    <View style={styles.orderDivider} />
                    <View style={styles.orderRow}>
                      <Text style={styles.orderTotalLabel}>Total Due Today</Text>
                      <Text style={styles.orderTotalValue}>
                        ${billingCycle === 'monthly' ? plans[selectedPlan].monthlyPrice : plans[selectedPlan].annualPrice}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentInfoTitle}>Payment Information</Text>
                    <Text style={styles.paymentInfoText}>
                      In a production app, this would include:
                    </Text>
                    <Text style={styles.paymentInfoBullet}>• Credit/Debit card input</Text>
                    <Text style={styles.paymentInfoBullet}>• Billing address</Text>
                    <Text style={styles.paymentInfoBullet}>• Secure payment processing</Text>
                    <Text style={styles.paymentInfoBullet}>• Payment confirmation</Text>
                  </View>

                  <View style={styles.trialNotice}>
                    <Text style={styles.trialNoticeIcon}>🎁</Text>
                    <Text style={styles.trialNoticeText}>
                      Start your 7-day free trial! You won't be charged until the trial ends.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={handleSubscribe}
                  >
                    <Text style={styles.subscribeButtonText}>
                      Start Free Trial
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.termsText}>
                    By subscribing, you agree to our Terms of Service and Privacy Policy. 
                    Cancel anytime during the trial period without charge.
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  billingToggle: {
    flexDirection: 'row',
    margin: 20,
    marginBottom: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
  },
  billingOptionActive: {
    backgroundColor: colors.primary,
  },
  billingOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
  },
  billingOptionTextActive: {
    color: colors.white,
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  planCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  planCardCurrent: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  planCardPopular: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    right: 20,
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  currentBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  planIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  planTitleSection: {
    flex: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  planPricing: {
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  currency: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 8,
  },
  price: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 56,
  },
  period: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 28,
    marginLeft: 4,
  },
  savingsInfo: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
    marginRight: 10,
    width: 20,
  },
  featureIconDisabled: {
    color: colors.gray400,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  featureTextDisabled: {
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  benefitsSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 13,
    color: colors.textDark,
    marginBottom: 4,
    lineHeight: 18,
  },
  limitationsSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  limitationsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F57C00',
    marginBottom: 8,
  },
  limitationText: {
    fontSize: 13,
    color: colors.textDark,
    marginBottom: 4,
    lineHeight: 18,
  },
  planButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  planButtonCurrent: {
    backgroundColor: colors.gray300,
  },
  planButtonPopular: {
    backgroundColor: '#FFD700',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  planButtonTextCurrent: {
    color: colors.textLight,
  },
  faqCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  supportCard: {
    backgroundColor: colors.primary + '10',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  supportButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  supportButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    flex: 1,
  },
  modalClose: {
    fontSize: 24,
    color: colors.textLight,
    padding: 4,
  },
  orderSummary: {
    backgroundColor: colors.gray50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  savingsLabel: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  orderDivider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 12,
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  orderTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentInfo: {
    marginBottom: 20,
  },
  paymentInfoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  paymentInfoText: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 8,
  },
  paymentInfoBullet: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 12,
    marginBottom: 4,
  },
  trialNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  trialNoticeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  trialNoticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.textDark,
    lineHeight: 18,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  termsText: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  // Pause Subscription Styles
  pauseBanner: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  pauseIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  pauseInfo: {
    flex: 1,
  },
  pauseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  pauseText: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 12,
    lineHeight: 20,
  },
  resumeButton: {
    backgroundColor: colors.success,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  resumeButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  managementSection: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  managementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  managementButtons: {
  },
  managementButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  pauseSubscriptionButton: {
    backgroundColor: colors.warning + '10',
    borderColor: colors.warning,
  },
  resumeSubscriptionButton: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success,
  },
  cancelSubscriptionButton: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error,
  },
  managementButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  managementButtonSubtext: {
    fontSize: 12,
    color: colors.textLight,
  },
});

export default SubscriptionScreen;
