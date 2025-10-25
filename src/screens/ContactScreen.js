import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    message: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.organization) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Thank you for your interest! We will contact you soon.');
    setFormData({ name: '', email: '', organization: '', phone: '', message: '' });
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Get Started with ClinReport</Text>
        <Text style={globalStyles.sectionSubtitle}>
          Request a demo and see how we can transform your clinical workflow
        </Text>

        <View style={globalStyles.card}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Dr. John Smith"
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="john.smith@hospital.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>Organization *</Text>
          <TextInput
            style={styles.input}
            value={formData.organization}
            onChangeText={(text) => setFormData({ ...formData, organization: text })}
            placeholder="General Hospital"
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="+1 (555) 123-4567"
            keyboardType="phone-pad"
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.message}
            onChangeText={(text) => setFormData({ ...formData, message: text })}
            placeholder="Tell us about your needs..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.gray400}
          />

          <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleSubmit}>
            <Text style={globalStyles.buttonTextPrimary}>Submit Request</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Contact Information</Text>
          <Text style={styles.infoText}>📧 Email: lavireak9@gmail.com</Text>
          <Text style={styles.infoText}>📞 Phone: +855 972225190</Text>
          <Text style={styles.infoText}>📍 Address: AUPP</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textDark,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  infoSection: {
    marginTop: 24,
    padding: 20,
    backgroundColor: colors.bgLight,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 12,
    lineHeight: 24,
  },
});
