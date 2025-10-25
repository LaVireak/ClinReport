import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

export default function PricingScreen() {
  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Simple, Transparent Pricing</Text>
        <Text style={globalStyles.sectionSubtitle}>
          Choose the plan that fits your practice
        </Text>

        <View style={[globalStyles.card, styles.pricingCard]}>
          <Text style={styles.planBadge}>STARTER</Text>
          <Text style={styles.price}>$299<Text style={styles.period}>/month</Text></Text>
          <Text style={styles.planDescription}>Perfect for small practices</Text>
          
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Up to 5 users</Text>
            <Text style={styles.feature}>✓ Smart transcription</Text>
            <Text style={styles.feature}>✓ Basic NLP & coding</Text>
            <Text style={styles.feature}>✓ Email support</Text>
            <Text style={styles.feature}>✓ 10GB storage</Text>
          </View>
        </View>

        <View style={[globalStyles.card, styles.pricingCard, styles.popularCard]}>
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
          <Text style={styles.planBadge}>PROFESSIONAL</Text>
          <Text style={styles.price}>$799<Text style={styles.period}>/month</Text></Text>
          <Text style={styles.planDescription}>For growing healthcare organizations</Text>
          
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Up to 25 users</Text>
            <Text style={styles.feature}>✓ Advanced AI features</Text>
            <Text style={styles.feature}>✓ Predictive analytics</Text>
            <Text style={styles.feature}>✓ EHR integration</Text>
            <Text style={styles.feature}>✓ Priority support</Text>
            <Text style={styles.feature}>✓ 100GB storage</Text>
            <Text style={styles.feature}>✓ Custom reporting</Text>
          </View>
        </View>

        <View style={[globalStyles.card, styles.pricingCard]}>
          <Text style={styles.planBadge}>ENTERPRISE</Text>
          <Text style={styles.price}>Custom</Text>
          <Text style={styles.planDescription}>For large healthcare systems</Text>
          
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Unlimited users</Text>
            <Text style={styles.feature}>✓ All features included</Text>
            <Text style={styles.feature}>✓ Dedicated account manager</Text>
            <Text style={styles.feature}>✓ 24/7 phone support</Text>
            <Text style={styles.feature}>✓ Unlimited storage</Text>
            <Text style={styles.feature}>✓ Custom integrations</Text>
            <Text style={styles.feature}>✓ On-premise deployment option</Text>
            <Text style={styles.feature}>✓ SLA guarantee</Text>
          </View>
        </View>

        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>💡 All plans include:</Text>
          <Text style={styles.noteText}>• 30-day free trial</Text>
          <Text style={styles.noteText}>• HIPAA compliance</Text>
          <Text style={styles.noteText}>• SOC 2 Type II certification</Text>
          <Text style={styles.noteText}>• Regular updates & improvements</Text>
          <Text style={styles.noteText}>• Mobile app access</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pricingCard: {
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  popularCard: {
    borderColor: colors.primary,
    backgroundColor: '#f8f9ff',
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
  planBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
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
  },
  feature: {
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 12,
    lineHeight: 22,
  },
  noteSection: {
    marginTop: 24,
    padding: 20,
    backgroundColor: colors.bgLight,
    borderRadius: 12,
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
});
