import React, { useState, useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { PatientDataContext } from '../context/PatientDataContext';
import AIAnalysisService from '../services/AIAnalysisService';
import { colors } from '../styles/colors';

const EmergencyScreen = ({ navigation }) => {
  const { patientProfile, dailyLogs } = useContext(PatientDataContext);
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  // Emergency contacts
  const emergencyContacts = [
    { name: 'Emergency Hotline', number: '119', icon: '🚨', priority: 'critical' },
    { name: 'Ambulance', number: '117', icon: '🚑', priority: 'critical' },
    { name: 'Police', number: '117', icon: '👮', priority: 'high' },
    { name: 'Fire Department', number: '118', icon: '🚒', priority: 'high' },
  ];

  // Emergency symptoms checklist
  const emergencySymptoms = [
    { 
      id: 'chest-pain', 
      title: 'Chest Pain or Pressure', 
      icon: '💔', 
      severity: 'critical',
      description: 'Severe chest pain, tightness, or pressure',
      action: 'Call ambulance immediately'
    },
    { 
      id: 'breathing', 
      title: 'Difficulty Breathing', 
      icon: '😷', 
      severity: 'critical',
      description: 'Severe shortness of breath or inability to breathe',
      action: 'Call ambulance immediately'
    },
    { 
      id: 'unconscious', 
      title: 'Unconsciousness', 
      icon: '😵', 
      severity: 'critical',
      description: 'Person is unresponsive or passed out',
      action: 'Call ambulance immediately'
    },
    { 
      id: 'bleeding', 
      title: 'Severe Bleeding', 
      icon: '🩸', 
      severity: 'critical',
      description: 'Heavy bleeding that won\'t stop',
      action: 'Apply pressure and call ambulance'
    },
    { 
      id: 'stroke', 
      title: 'Stroke Symptoms', 
      icon: '🧠', 
      severity: 'critical',
      description: 'Face drooping, arm weakness, speech difficulty',
      action: 'Call ambulance immediately'
    },
    { 
      id: 'allergic', 
      title: 'Severe Allergic Reaction', 
      icon: '😖', 
      severity: 'critical',
      description: 'Swelling, hives, difficulty breathing',
      action: 'Use EpiPen if available, call ambulance'
    },
    { 
      id: 'seizure', 
      title: 'Seizure', 
      icon: '⚡', 
      severity: 'high',
      description: 'Uncontrolled shaking or convulsions',
      action: 'Protect from injury, call ambulance'
    },
    { 
      id: 'burn', 
      title: 'Severe Burn', 
      icon: '🔥', 
      severity: 'high',
      description: 'Large or deep burn injury',
      action: 'Cool with water, call ambulance'
    },
  ];

  // Get AI-recommended hospitals based on recent health data
  const recommendedHospitals = useMemo(() => {
    if (dailyLogs.length === 0) {
      return AIAnalysisService.HOSPITALS.slice(0, 3);
    }

    const latestLog = dailyLogs[dailyLogs.length - 1];
    const aiAnalysis = AIAnalysisService.analyzePatientHealth(latestLog, patientProfile);
    
    return aiAnalysis.recommendedHospitals || AIAnalysisService.HOSPITALS.slice(0, 3);
  }, [dailyLogs, patientProfile]);

  // Get recommended doctors based on symptoms
  const recommendedDoctors = useMemo(() => {
    if (!selectedSymptom) {
      return [];
    }

    // Map symptoms to specialties
    const specialtyMap = {
      'chest-pain': 'Cardiologist',
      'breathing': 'Pulmonologist',
      'stroke': 'Neurologist',
      'allergic': 'Allergist',
      'seizure': 'Neurologist',
    };

    const specialty = specialtyMap[selectedSymptom];
    if (specialty) {
      return AIAnalysisService.DOCTORS.filter(doc => doc.specialty === specialty);
    }

    return AIAnalysisService.DOCTORS.slice(0, 2);
  }, [selectedSymptom]);

  const handleCall = (number) => {
    Alert.alert(
      'Emergency Call',
      `Call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          },
        },
      ]
    );
  };

  const handleSymptomPress = (symptom) => {
    setSelectedSymptom(selectedSymptom === symptom.id ? null : symptom.id);
  };

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
        <Text style={styles.headerTitle}>🚨 Emergency</Text>
        <Text style={styles.headerSubtitle}>Quick access to emergency services</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Emergency Alert Banner */}
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Life-Threatening Emergency?</Text>
            <Text style={styles.alertText}>
              Call 119 immediately for ambulance service
            </Text>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.contactsCard}>
          <Text style={styles.cardTitle}>📞 Emergency Contacts</Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={`contact-${contact.name}-${index}`}
              style={[
                styles.contactItem,
                contact.priority === 'critical' && styles.contactItemCritical
              ]}
              onPress={() => handleCall(contact.number)}
            >
              <View style={styles.contactLeft}>
                <Text style={styles.contactIcon}>{contact.icon}</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
              </View>
              <View style={styles.callButton}>
                <Text style={styles.callButtonText}>📞 Call</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Symptoms Checklist */}
        <View style={styles.symptomsCard}>
          <Text style={styles.cardTitle}>⚕️ Emergency Symptoms</Text>
          <Text style={styles.cardSubtitle}>
            Tap a symptom to see recommended actions and doctors
          </Text>
          {emergencySymptoms.map((symptom, index) => (
            <View key={symptom.id}>
              <TouchableOpacity
                style={[
                  styles.symptomItem,
                  selectedSymptom === symptom.id && styles.symptomItemSelected,
                  symptom.severity === 'critical' && styles.symptomItemCritical,
                ]}
                onPress={() => handleSymptomPress(symptom)}
              >
                <Text style={styles.symptomIcon}>{symptom.icon}</Text>
                <View style={styles.symptomInfo}>
                  <Text style={styles.symptomTitle}>{symptom.title}</Text>
                  <Text style={styles.symptomDescription}>{symptom.description}</Text>
                </View>
                <View style={[
                  styles.severityBadge,
                  symptom.severity === 'critical' && styles.severityBadgeCritical,
                  symptom.severity === 'high' && styles.severityBadgeHigh,
                ]}>
                  <Text style={styles.severityText}>
                    {symptom.severity.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Expanded details */}
              {selectedSymptom === symptom.id && (
                <View style={styles.symptomDetails}>
                  <View style={styles.actionBox}>
                    <Text style={styles.actionTitle}>⚡ Immediate Action:</Text>
                    <Text style={styles.actionText}>{symptom.action}</Text>
                  </View>

                  {recommendedDoctors.length > 0 && (
                    <View style={styles.doctorsSection}>
                      <Text style={styles.doctorsSectionTitle}>👨‍⚕️ Recommended Doctors:</Text>
                      {recommendedDoctors.map((doctor, idx) => (
                        <View key={`recommended-doctor-${doctor.name || idx}-${idx}`} style={styles.doctorItem}>
                          <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
                            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                            <Text style={styles.doctorHospital}>{doctor.hospital}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.doctorCallButton}
                            onPress={() => handleCall(doctor.contact)}
                          >
                            <Text style={styles.doctorCallText}>📞</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Recommended Hospitals */}
        <View style={styles.hospitalsCard}>
          <Text style={styles.cardTitle}>🏥 Nearest Emergency Hospitals</Text>
          <Text style={styles.cardSubtitle}>
            Based on your location and AI health assessment
          </Text>
          {recommendedHospitals.map((hospital, index) => (
            <View key={`recommended-hospital-${hospital.name || index}-${index}`} style={styles.hospitalItem}>
              <View style={styles.hospitalHeader}>
                <View style={styles.hospitalLeft}>
                  <Text style={styles.hospitalIcon}>🏥</Text>
                  <View style={styles.hospitalInfo}>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <Text style={styles.hospitalAddress}>{hospital.address}</Text>
                    {hospital.distance && (
                      <Text style={styles.hospitalDistance}>
                        📍 {hospital.distance}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.hospitalServices}>
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>24/7 Emergency</Text>
                </View>
                {hospital.hasAmbulance && (
                  <View style={styles.serviceTag}>
                    <Text style={styles.serviceTagText}>🚑 Ambulance</Text>
                  </View>
                )}
                {hospital.hasICU && (
                  <View style={styles.serviceTag}>
                    <Text style={styles.serviceTagText}>🏥 ICU</Text>
                  </View>
                )}
              </View>

              <View style={styles.hospitalActions}>
                <TouchableOpacity
                  style={styles.hospitalActionButton}
                  onPress={() => handleCall(hospital.emergencyContact)}
                >
                  <Text style={styles.hospitalActionText}>📞 Call Emergency</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.hospitalActionButton, styles.hospitalActionButtonSecondary]}
                  onPress={() => {
                    // In a real app, this would open maps
                    Alert.alert('Directions', `Opening directions to ${hospital.name}`);
                  }}
                >
                  <Text style={styles.hospitalActionTextSecondary}>🗺️ Directions</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Emergency Preparedness Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Emergency Preparedness</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>
              Keep emergency contact numbers easily accessible
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>
              Know the location of the nearest emergency room
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>
              Keep a list of your medications and allergies
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>
              Have your medical insurance information ready
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>
              Stay calm and provide clear information to emergency services
            </Text>
          </View>
        </View>

        {/* What to tell emergency services */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 What to Tell Emergency Services</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Your exact location and address</Text>
            <Text style={styles.infoItem}>• Nature of the emergency</Text>
            <Text style={styles.infoItem}>• Number of people needing help</Text>
            <Text style={styles.infoItem}>• Current condition of the patient</Text>
            <Text style={styles.infoItem}>• Any immediate dangers present</Text>
            <Text style={styles.infoItem}>• Your contact number</Text>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.error,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    gap: 12,
  },
  alertIcon: {
    fontSize: 32,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  contactsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    marginTop: 8,
  },
  contactItemCritical: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: colors.error,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.error,
  },
  callButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  symptomsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  symptomItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  symptomItemCritical: {
    backgroundColor: '#FFF3E0',
  },
  symptomIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  symptomInfo: {
    flex: 1,
    marginRight: 8,
  },
  symptomTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  symptomDescription: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityBadgeCritical: {
    backgroundColor: colors.error,
  },
  severityBadgeHigh: {
    backgroundColor: '#FFA500',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  symptomDetails: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  actionBox: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  doctorsSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  doctorsSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.gray50,
    borderRadius: 6,
    marginTop: 6,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  doctorHospital: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  doctorCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorCallText: {
    fontSize: 20,
  },
  hospitalsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hospitalItem: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  hospitalHeader: {
    marginBottom: 12,
  },
  hospitalLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hospitalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
    marginBottom: 4,
  },
  hospitalDistance: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  hospitalServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  serviceTagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  hospitalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  hospitalActionButton: {
    flex: 1,
    backgroundColor: colors.error,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  hospitalActionButtonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  hospitalActionText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  hospitalActionTextSecondary: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  tipsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipIcon: {
    fontSize: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});

export default EmergencyScreen;
