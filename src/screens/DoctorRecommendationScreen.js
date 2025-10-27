import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { colors } from '../styles/colors';
import AIAnalysisService from '../services/AIAnalysisService';
import { usePatientData } from '../context/PatientDataContext';

const DoctorRecommendationScreen = ({ navigation }) => {
  const { getCurrentPatient, getLatestAIAssessment } = usePatientData();
  const patientProfile = getCurrentPatient();
  const latestAssessment = getLatestAIAssessment(patientProfile?.id);

  const [symptomInput, setSymptomInput] = useState('');
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  useEffect(() => {
    loadRecommendations();
  }, [selectedSpecialty]);

  const loadRecommendations = () => {
    let doctors = AIAnalysisService.DOCTORS;

    // Filter by specialty if selected
    if (selectedSpecialty !== 'all') {
      doctors = doctors.filter(d => 
        d.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    // Sort by rating
    doctors.sort((a, b) => b.rating - a.rating);

    setRecommendedDoctors(doctors);
  };

  const getSpecialtyRecommendation = () => {
    if (!latestAssessment || !patientProfile) {
      return 'general practice';
    }

    const { riskLevel, symptoms } = latestAssessment;
    const condition = patientProfile.condition?.toLowerCase();

    // Recommend specialty based on condition and risk
    if (condition?.includes('diabetes')) return 'Endocrinology';
    if (condition?.includes('heart') || condition?.includes('cardiac')) return 'Cardiology';
    if (symptoms?.toLowerCase().includes('head') || symptoms?.toLowerCase().includes('neuro')) return 'Neurology';
    if (riskLevel === 'HIGH') return 'Emergency Medicine';

    return 'Internal Medicine';
  };

  const getAIRecommendedDoctor = () => {
    const recommendedSpecialty = getSpecialtyRecommendation();
    const doctor = recommendedDoctors.find(d => 
      d.specialty === recommendedSpecialty && d.partnerId === 'meetdoctors'
    );
    return doctor || recommendedDoctors[0];
  };

  const specialties = [
    { id: 'all', name: 'All', icon: '👨‍⚕️' },
    { id: 'Cardiology', name: 'Cardiology', icon: '❤️' },
    { id: 'Endocrinology', name: 'Endocrinology', icon: '🔬' },
    { id: 'Internal Medicine', name: 'Internal Medicine', icon: '🩺' },
    { id: 'Neurology', name: 'Neurology', icon: '🧠' },
    { id: 'Emergency Medicine', name: 'Emergency', icon: '🚨' },
  ];

  const handleCallDoctor = (doctor) => {
    Alert.alert(
      'Call Doctor',
      `Call ${doctor.name} for immediate consultation?\n\n${doctor.specialty}\nFee: ${doctor.consultationFee}\nAvailability: ${doctor.availability}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            // In real app, route to doctor's direct line
            const phoneNumber = '+855 23 991 000'; // Default hospital line
            Linking.openURL(`tel:${phoneNumber}`).catch(() =>
              Alert.alert('Error', 'Unable to make call')
            );
            Alert.alert(
              'Connecting...',
              'Connecting you to the doctor\'s consultation line. Please wait.'
            );
          },
        },
      ]
    );
  };

  const handleBookConsultation = (doctor) => {
    Alert.alert(
      'Book Consultation',
      `Book a consultation with ${doctor.name}?\n\n${doctor.specialty}\nFee: ${doctor.consultationFee}\nType: ${doctor.availability === 'online' ? 'Online Video Call' : 'In-Person at Hospital'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book Now',
          onPress: () => {
            Alert.alert(
              'Booking Confirmed! 🎉',
              `Your consultation with ${doctor.name} has been scheduled.\n\nYou will receive:\n• Confirmation email\n• SMS reminder\n• Video call link (if online)\n\nThank you for choosing MeetDoctors!`
            );
          },
        },
      ]
    );
  };

  const renderDoctorCard = (doctor, isRecommended = false) => (
    <View
      key={doctor.id}
      style={[
        styles.doctorCard,
        isRecommended && styles.doctorCardRecommended,
      ]}
    >
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>✨ AI Recommended for You</Text>
        </View>
      )}

      <View style={styles.doctorHeader}>
        <View style={styles.doctorAvatar}>
          <Text style={styles.doctorAvatarText}>👨‍⚕️</Text>
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
            <Text style={styles.experienceText}>• {doctor.experience}</Text>
          </View>
        </View>
      </View>

      <View style={styles.doctorDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🏥</Text>
          <Text style={styles.detailText}>{doctor.hospital}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.detailText}>Consultation: {doctor.consultationFee}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🗣️</Text>
          <Text style={styles.detailText}>{doctor.languages.join(', ')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>
            {doctor.availability === 'online' ? '💻' : '🏥'}
          </Text>
          <Text style={styles.detailText}>
            {doctor.availability === 'online' ? 'Online Consultation Available' : 'Hospital Visit Only'}
          </Text>
        </View>
        {doctor.partnerId === 'meetdoctors' && (
          <View style={styles.partnerBadge}>
            <Text style={styles.partnerText}>🤝 MeetDoctors Partner</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={() => handleCallDoctor(doctor)}
        >
          <Text style={styles.actionButtonText}>📞 Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.bookButton]}
          onPress={() => handleBookConsultation(doctor)}
        >
          <Text style={styles.actionButtonText}>📅 Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const aiRecommendedDoctor = getAIRecommendedDoctor();

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
        <Text style={styles.headerTitle}>👨‍⚕️ Doctor Recommendations</Text>
        <Text style={styles.headerSubtitle}>
          Find the right specialist for your health needs
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* AI Recommendation Section */}
        {latestAssessment && aiRecommendedDoctor && (
          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiTitle}>🤖 AI Health Analysis</Text>
              <View style={[
                styles.riskBadge,
                { backgroundColor: 
                  latestAssessment.riskLevel === 'HIGH' ? colors.error + '20' :
                  latestAssessment.riskLevel === 'MEDIUM' ? colors.warning + '20' :
                  colors.success + '20'
                }
              ]}>
                <Text style={[
                  styles.riskText,
                  { color:
                    latestAssessment.riskLevel === 'HIGH' ? colors.error :
                    latestAssessment.riskLevel === 'MEDIUM' ? colors.warning :
                    colors.success
                  }
                ]}>
                  {latestAssessment.riskLevel} RISK
                </Text>
              </View>
            </View>
            <Text style={styles.aiDescription}>
              Based on your health profile and recent assessment, we recommend consulting with a {getSpecialtyRecommendation()} specialist.
            </Text>
            {renderDoctorCard(aiRecommendedDoctor, true)}
          </View>
        )}

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>🔍 Find by Symptoms or Specialty</Text>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter symptoms or specialty..."
              value={symptomInput}
              onChangeText={setSymptomInput}
              placeholderTextColor={colors.textLight}
            />
          </View>
        </View>

        {/* Specialty Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.specialtyScroll}
          contentContainerStyle={styles.specialtyScrollContent}
        >
          {specialties.map((specialty) => (
            <TouchableOpacity
              key={specialty.id}
              style={[
                styles.specialtyChip,
                selectedSpecialty === specialty.id && styles.specialtyChipActive,
              ]}
              onPress={() => setSelectedSpecialty(specialty.id)}
            >
              <Text style={styles.specialtyIcon}>{specialty.icon}</Text>
              <Text
                style={[
                  styles.specialtyText,
                  selectedSpecialty === specialty.id && styles.specialtyTextActive,
                ]}
              >
                {specialty.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All Doctors List */}
        <View style={styles.doctorsSection}>
          <Text style={styles.sectionTitle}>
            {selectedSpecialty === 'all' ? 'All Available Doctors' : `${selectedSpecialty} Specialists`}
          </Text>
          {recommendedDoctors.map((doctor) => renderDoctorCard(doctor))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  content: {
    flex: 1,
  },
  aiSection: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '700',
  },
  aiDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  searchSection: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
  },
  specialtyScroll: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    marginBottom: 8,
  },
  specialtyScrollContent: {
    paddingHorizontal: 16,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  specialtyChipActive: {
    backgroundColor: colors.primary,
  },
  specialtyIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  specialtyTextActive: {
    color: colors.white,
  },
  doctorsSection: {
    padding: 16,
  },
  doctorCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorCardRecommended: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  recommendedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  recommendedText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorAvatarText: {
    fontSize: 36,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
  },
  experienceText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  doctorDetails: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 24,
  },
  detailText: {
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
  },
  partnerBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  partnerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  callButton: {
    backgroundColor: colors.success,
  },
  bookButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DoctorRecommendationScreen;
