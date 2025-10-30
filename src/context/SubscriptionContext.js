import React, { createContext, useState, useContext } from 'react';

const SubscriptionContext = createContext();

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

export const PLAN_FEATURES = {
  [SUBSCRIPTION_PLANS.FREE]: {
    name: 'Free Plan',
    price: '$0',
    priceDetail: 'Free forever',
    features: [
      '✅ Habit Tracker',
      '✅ Notification Alerts',
      '✅ 3 AI Summary Analyses',
      '❌ AI Agent Chat',
      '❌ Unlimited AI Summary',
      '❌ Doctor Recommendations',
      '❌ Hospital Recommendations',
    ],
    aiSummaryLimit: 3,
    hasAIAgent: false,
    hasDoctorRecommendations: false,
    hasHospitalRecommendations: false,
  },
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    name: 'Premium Plan',
    price: '$3.99',
    priceDetail: 'per month',
    features: [
      '✅ Everything in Free',
      '✅ AI Agent Chat (Doctor-like Consultation)',
      '✅ Unlimited AI Summary',
      '✅ Doctor Recommendations',
      '✅ Hospital Recommendations',
      '✅ Priority Support',
    ],
    aiSummaryLimit: Infinity,
    hasAIAgent: true,
    hasDoctorRecommendations: true,
    hasHospitalRecommendations: true,
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    name: 'Enterprise Plan',
    price: 'Coming Soon',
    priceDetail: 'Contact us for pricing',
    features: [
      '✅ Everything in Premium',
      '✅ One-on-one Doctor Monitoring',
      '✅ Daily Doctor Check-ins',
      '✅ Personalized Care Plans',
      '✅ 24/7 Medical Support',
      '✅ Custom Integration',
    ],
    aiSummaryLimit: Infinity,
    hasAIAgent: true,
    hasDoctorRecommendations: true,
    hasHospitalRecommendations: true,
    hasPersonalDoctor: true,
    comingSoon: true,
  },
};

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(SUBSCRIPTION_PLANS.FREE);
  const [aiSummaryUsageCount, setAiSummaryUsageCount] = useState(0);

  const canUseAISummary = () => {
    const plan = PLAN_FEATURES[subscriptionPlan];
    return aiSummaryUsageCount < plan.aiSummaryLimit;
  };

  const incrementAISummaryUsage = () => {
    setAiSummaryUsageCount(prev => prev + 1);
  };

  const resetAISummaryUsage = () => {
    setAiSummaryUsageCount(0);
  };

  const canUseAIAgent = () => {
    return PLAN_FEATURES[subscriptionPlan].hasAIAgent;
  };

  const canSeeDoctorRecommendations = () => {
    return PLAN_FEATURES[subscriptionPlan].hasDoctorRecommendations;
  };

  const canSeeHospitalRecommendations = () => {
    return PLAN_FEATURES[subscriptionPlan].hasHospitalRecommendations;
  };

  const getRemainingAISummaries = () => {
    const plan = PLAN_FEATURES[subscriptionPlan];
    if (plan.aiSummaryLimit === Infinity) return 'Unlimited';
    return Math.max(0, plan.aiSummaryLimit - aiSummaryUsageCount);
  };

  const upgradePlan = (newPlan) => {
    setSubscriptionPlan(newPlan);
    // Reset usage count on plan change
    setAiSummaryUsageCount(0);
  };

  const upgradeToPremium = () => {
    setSubscriptionPlan(SUBSCRIPTION_PLANS.PREMIUM);
    // Reset usage count on upgrade
    setAiSummaryUsageCount(0);
  };

  const downgradeToFree = () => {
    setSubscriptionPlan(SUBSCRIPTION_PLANS.FREE);
    setAiSummaryUsageCount(0);
  };

  const getPlanDetails = () => {
    return PLAN_FEATURES[subscriptionPlan];
  };

  const value = {
    subscriptionPlan,
    setSubscriptionPlan,
    aiSummaryUsageCount,
    canUseAISummary,
    incrementAISummaryUsage,
    resetAISummaryUsage,
    canUseAIAgent,
    canSeeDoctorRecommendations,
    canSeeHospitalRecommendations,
    getRemainingAISummaries,
    upgradePlan,
    upgradeToPremium,
    downgradeToFree,
    getPlanDetails,
    SUBSCRIPTION_PLANS,
    PLAN_FEATURES,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;
