import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { AIAnalysisService } from '../services/AIAnalysisService';
import { colors } from '../styles/colors';

const HospitalDetailScreen = ({ route, navigation }) => {
  const { hospital } = route.params;
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Get doctors at this hospital
  const hospitalDoctors = AIAnalysisService.DOCTORS.filter(
    doc => doc.hospital === hospital.name
  );

  // Available time slots
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  // Next 7 days
  const getNextWeekDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const nextWeekDates = getNextWeekDates();

  const handleCall = (number) => {
    Alert.alert(
      'Call Hospital',
      `Call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${number}`),
        },
      ]
    );
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setSelectedTime(null);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select both date and time');
      return;
    }

    const dateStr = selectedDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });

    Alert.alert(
      'Appointment Requested',
      `Your appointment with Dr. ${selectedDoctor.name} on ${dateStr} at ${selectedTime} has been requested.\n\nThe hospital will contact you to confirm.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowBookingModal(false);
            // In a real app, this would send the booking request to the backend
          },
        },
      ]
    );
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
        <Text style={styles.hospitalName}>{hospital.name}</Text>
        {hospital.meetDoctorsPartner && (
          <View style={styles.partnerBadge}>
            <Text style={styles.partnerBadgeText}>🤝 MeetDoctors Partner</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(hospital.emergencyContact)}
          >
            <Text style={styles.actionButtonIcon}>📞</Text>
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Directions', 'Opening maps...')}
          >
            <Text style={styles.actionButtonIcon}>🗺️</Text>
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Share', 'Sharing hospital info...')}
          >
            <Text style={styles.actionButtonIcon}>📤</Text>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Hospital Information */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>ℹ️ Hospital Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{hospital.address}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📞</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Emergency Contact</Text>
              <Text style={styles.infoValue}>{hospital.emergencyContact}</Text>
            </View>
          </View>

          {hospital.generalContact && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>☎️</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>General Contact</Text>
                <Text style={styles.infoValue}>{hospital.generalContact}</Text>
              </View>
            </View>
          )}

          {hospital.distance && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🚗</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Distance</Text>
                <Text style={styles.infoValue}>{hospital.distance}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Services */}
        <View style={styles.servicesCard}>
          <Text style={styles.cardTitle}>🏥 Available Services</Text>
          <View style={styles.servicesGrid}>
            <View style={[styles.serviceItem, hospital.hasEmergency && styles.serviceItemActive]}>
              <Text style={styles.serviceIcon}>🚨</Text>
              <Text style={styles.serviceText}>24/7 Emergency</Text>
              <Text style={styles.serviceStatus}>
                {hospital.hasEmergency ? '✓' : '✗'}
              </Text>
            </View>
            <View style={[styles.serviceItem, hospital.hasICU && styles.serviceItemActive]}>
              <Text style={styles.serviceIcon}>🏥</Text>
              <Text style={styles.serviceText}>ICU</Text>
              <Text style={styles.serviceStatus}>
                {hospital.hasICU ? '✓' : '✗'}
              </Text>
            </View>
            <View style={[styles.serviceItem, hospital.hasAmbulance && styles.serviceItemActive]}>
              <Text style={styles.serviceIcon}>🚑</Text>
              <Text style={styles.serviceText}>Ambulance</Text>
              <Text style={styles.serviceStatus}>
                {hospital.hasAmbulance ? '✓' : '✗'}
              </Text>
            </View>
            <View style={[styles.serviceItem, hospital.hasSurgery !== false && styles.serviceItemActive]}>
              <Text style={styles.serviceIcon}>🔬</Text>
              <Text style={styles.serviceText}>Surgery</Text>
              <Text style={styles.serviceStatus}>
                {hospital.hasSurgery !== false ? '✓' : '✗'}
              </Text>
            </View>
          </View>
        </View>

        {/* Specialties */}
        {hospital.specialties && hospital.specialties.length > 0 && (
          <View style={styles.specialtiesCard}>
            <Text style={styles.cardTitle}>⭐ Medical Specialties</Text>
            <View style={styles.specialtiesGrid}>
              {hospital.specialties.map((specialty, index) => (
                <View key={`specialty-${hospital.name}-${specialty}-${index}`} style={styles.specialtyTag}>
                  <Text style={styles.specialtyTagText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Doctors */}
        <View style={styles.doctorsCard}>
          <Text style={styles.cardTitle}>👨‍⚕️ Our Doctors</Text>
          {hospitalDoctors.length > 0 ? (
            hospitalDoctors.map((doctor, index) => (
              <View key={`hospital-doctor-${doctor.name || index}-${index}`} style={styles.doctorCard}>
                <View style={styles.doctorHeader}>
                  <View style={styles.doctorAvatar}>
                    <Text style={styles.doctorAvatarText}>
                      {doctor.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                    {doctor.meetDoctorsPartner && (
                      <View style={styles.doctorPartnerBadge}>
                        <Text style={styles.doctorPartnerText}>
                          🤝 MeetDoctors Partner
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.doctorDetails}>
                  <View style={styles.doctorDetailRow}>
                    <Text style={styles.doctorDetailIcon}>📞</Text>
                    <Text style={styles.doctorDetailText}>{doctor.contact}</Text>
                  </View>
                  {doctor.experience && (
                    <View style={styles.doctorDetailRow}>
                      <Text style={styles.doctorDetailIcon}>⏱️</Text>
                      <Text style={styles.doctorDetailText}>
                        {doctor.experience} years experience
                      </Text>
                    </View>
                  )}
                  {doctor.languages && (
                    <View style={styles.doctorDetailRow}>
                      <Text style={styles.doctorDetailIcon}>🗣️</Text>
                      <Text style={styles.doctorDetailText}>
                        {doctor.languages.join(', ')}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.doctorActions}>
                  <TouchableOpacity
                    style={styles.doctorActionButton}
                    onPress={() => handleCall(doctor.contact)}
                  >
                    <Text style={styles.doctorActionText}>📞 Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.doctorActionButton, styles.doctorActionButtonPrimary]}
                    onPress={() => handleBookAppointment(doctor)}
                  >
                    <Text style={styles.doctorActionTextPrimary}>
                      📅 Book Appointment
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyDoctors}>
              <Text style={styles.emptyDoctorsText}>
                No doctors listed for this hospital
              </Text>
            </View>
          )}
        </View>

        {/* About */}
        <View style={styles.aboutCard}>
          <Text style={styles.cardTitle}>📋 About {hospital.name}</Text>
          <Text style={styles.aboutText}>
            {hospital.about || 
              `${hospital.name} is a leading healthcare provider in Phnom Penh, offering comprehensive medical services with state-of-the-art facilities and experienced medical professionals.`}
          </Text>
        </View>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📅 Book Appointment</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {selectedDoctor && (
                <View style={styles.modalDoctorInfo}>
                  <Text style={styles.modalDoctorName}>Dr. {selectedDoctor.name}</Text>
                  <Text style={styles.modalDoctorSpecialty}>{selectedDoctor.specialty}</Text>
                </View>
              )}

              {/* Date Selection */}
              <Text style={styles.modalSectionTitle}>Select Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.dateSelector}>
                  {nextWeekDates.map((date, index) => (
                    <TouchableOpacity
                      key={`booking-date-${date.toDateString()}-${index}`}
                      style={[
                        styles.dateOption,
                        selectedDate?.toDateString() === date.toDateString() && styles.dateOptionSelected
                      ]}
                      onPress={() => setSelectedDate(date)}
                    >
                      <Text style={[
                        styles.dateDayName,
                        selectedDate?.toDateString() === date.toDateString() && styles.dateTextSelected
                      ]}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      <Text style={[
                        styles.dateDay,
                        selectedDate?.toDateString() === date.toDateString() && styles.dateTextSelected
                      ]}>
                        {date.getDate()}
                      </Text>
                      <Text style={[
                        styles.dateMonth,
                        selectedDate?.toDateString() === date.toDateString() && styles.dateTextSelected
                      ]}>
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Time Selection */}
              <Text style={styles.modalSectionTitle}>Select Time</Text>
              <View style={styles.timeSelector}>
                {timeSlots.map((time, index) => (
                  <TouchableOpacity
                    key={`booking-time-${time}-${index}`}
                    style={[
                      styles.timeOption,
                      selectedTime === time && styles.timeOptionSelected
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[
                      styles.timeText,
                      selectedTime === time && styles.timeTextSelected
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (!selectedDate || !selectedTime) && styles.confirmButtonDisabled
                ]}
                onPress={handleConfirmBooking}
                disabled={!selectedDate || !selectedTime}
              >
                <Text style={styles.confirmButtonText}>
                  Confirm Appointment
                </Text>
              </TouchableOpacity>
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
  hospitalName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  partnerBadge: {
    backgroundColor: colors.primary + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  partnerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: colors.textDark,
    fontWeight: '600',
  },
  servicesCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.gray50,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceItemActive: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  serviceIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  serviceText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  serviceStatus: {
    fontSize: 18,
    fontWeight: '700',
  },
  specialtiesCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyTagText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  doctorsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorCard: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 6,
  },
  doctorPartnerBadge: {
    backgroundColor: colors.primary + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  doctorPartnerText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  doctorDetails: {
    marginBottom: 12,
  },
  doctorDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  doctorDetailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  doctorDetailText: {
    fontSize: 13,
    color: colors.textLight,
  },
  doctorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  doctorActionButton: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  doctorActionButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  doctorActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  doctorActionTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  emptyDoctors: {
    padding: 20,
    alignItems: 'center',
  },
  emptyDoctorsText: {
    fontSize: 14,
    color: colors.textLight,
  },
  aboutCard: {
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
  aboutText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  modalClose: {
    fontSize: 24,
    color: colors.textLight,
    padding: 4,
  },
  modalDoctorInfo: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  modalDoctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  modalDoctorSpecialty: {
    fontSize: 14,
    color: colors.primary,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
    marginTop: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  dateOption: {
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateDayName: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: colors.textLight,
  },
  dateTextSelected: {
    color: colors.white,
  },
  timeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  timeTextSelected: {
    color: colors.white,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});

export default HospitalDetailScreen;
