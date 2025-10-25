import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

export default function AboutScreen() {
  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>About ClinReport</Text>
        <Text style={globalStyles.sectionSubtitle}>
          Transforming clinical documentation with AI-powered intelligence
        </Text>

        <View style={globalStyles.card}>
          <Text style={styles.heading}>Our Mission</Text>
          <Text style={styles.text}>
            At ClinReport, we believe that clinicians should spend their time caring for patients, 
            not buried in paperwork. Our mission is to leverage cutting-edge AI technology to 
            automate clinical documentation, reduce administrative burden, and improve healthcare outcomes.
          </Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.heading}>Our Story</Text>
          <Text style={styles.text}>
            Founded by a team in AUPP, ClinReport was born from firsthand experience with the documentation crisis in healthcare. We've combined
            deep medical knowledge with advanced natural language processing to create a solution that 
            truly understands the clinical workflow.
          </Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.heading}>Our Values</Text>
          <View style={styles.valueItem}>
            <Text style={styles.valueIcon}>🎯</Text>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Patient-Centered</Text>
              <Text style={styles.valueText}>
                Everything we do is designed to give clinicians more time with patients.
              </Text>
            </View>
          </View>
          
          <View style={styles.valueItem}>
            <Text style={styles.valueIcon}>🔒</Text>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Security First</Text>
              <Text style={styles.valueText}>
                HIPAA compliance and data security are at the core of our platform.
              </Text>
            </View>
          </View>
          
          <View style={styles.valueItem}>
            <Text style={styles.valueIcon}>🚀</Text>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Innovation</Text>
              <Text style={styles.valueText}>
                We're constantly pushing the boundaries of what AI can do for healthcare.
              </Text>
            </View>
          </View>
          
          <View style={styles.valueItem}>
            <Text style={styles.valueIcon}>🤝</Text>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Partnership</Text>
              <Text style={styles.valueText}>
                We work closely with our customers to continuously improve our product.
              </Text>
            </View>
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={styles.heading}>Our Team</Text>
          <Text style={styles.text}>
            Our diverse team brings together expertise in medicine, artificial intelligence, 
            software engineering, and healthcare IT. We're united by a passion for improving 
            healthcare through technology.
          </Text>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.heading}>By the Numbers</Text>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Healthcare Providers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Daily Transcriptions</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>99.9%</Text>
              <Text style={styles.statLabel}>Uptime</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>85%</Text>
              <Text style={styles.statLabel}>Time Saved</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 26,
  },
  valueItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  valueIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  valueText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
  },
  statsSection: {
    backgroundColor: colors.bgLight,
    padding: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  stat: {
    alignItems: 'center',
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
});
