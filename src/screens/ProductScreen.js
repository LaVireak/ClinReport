import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

export default function ProductScreen() {
  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Product Features</Text>
        <Text style={globalStyles.sectionSubtitle}>
          Comprehensive clinical documentation solutions powered by AI
        </Text>

        <View style={globalStyles.card}>
          <Text style={styles.icon}>🎤</Text>
          <Text style={styles.title}>Smart Transcription</Text>
          <Text style={styles.description}>
            Real-time voice-to-text with medical terminology understanding and automatic SOAP note formatting.
          </Text>
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Medical vocabulary recognition</Text>
            <Text style={styles.feature}>✓ SOAP note auto-formatting</Text>
            <Text style={styles.feature}>✓ Multi-language support</Text>
            <Text style={styles.feature}>✓ Offline capability</Text>
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.icon}>🧠</Text>
          <Text style={styles.title}>NLP & Auto-coding</Text>
          <Text style={styles.description}>
            Advanced natural language processing to extract medical entities and suggest accurate billing codes.
          </Text>
          <View style={styles.features}>
            <Text style={styles.feature}>✓ ICD-10/11 code suggestions</Text>
            <Text style={styles.feature}>✓ CPT code recommendations</Text>
            <Text style={styles.feature}>✓ Confidence scoring</Text>
            <Text style={styles.feature}>✓ Entity extraction</Text>
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.icon}>📈</Text>
          <Text style={styles.title}>Predictive Analytics</Text>
          <Text style={styles.description}>
            Leverage AI to predict patient outcomes and identify at-risk populations.
          </Text>
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Risk stratification</Text>
            <Text style={styles.feature}>✓ Readmission prediction</Text>
            <Text style={styles.feature}>✓ Clinical decision support</Text>
            <Text style={styles.feature}>✓ Population health insights</Text>
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.icon}>🔗</Text>
          <Text style={styles.title}>EHR Integration</Text>
          <Text style={styles.description}>
            Seamless integration with major EHR systems for streamlined workflows.
          </Text>
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Epic integration</Text>
            <Text style={styles.feature}>✓ Cerner compatibility</Text>
            <Text style={styles.feature}>✓ HL7 FHIR support</Text>
            <Text style={styles.feature}>✓ Custom API access</Text>
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.title}>Security & Compliance</Text>
          <Text style={styles.description}>
            Enterprise-grade security with full HIPAA compliance and data encryption.
          </Text>
          <View style={styles.features}>
            <Text style={styles.feature}>✓ HIPAA compliant</Text>
            <Text style={styles.feature}>✓ SOC 2 Type II certified</Text>
            <Text style={styles.feature}>✓ End-to-end encryption</Text>
            <Text style={styles.feature}>✓ Audit logging</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 24,
    marginBottom: 16,
  },
  features: {
    marginTop: 8,
  },
  feature: {
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 8,
    lineHeight: 22,
  },
});
