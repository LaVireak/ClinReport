import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { usePatientData } from '../context/PatientDataContext';

const PatientDashboard = ({ navigation }) => {
  const { getCurrentPatient, addDailyLog } = usePatientData();
  const patientProfile = getCurrentPatient();

  // Use patient's daily logs from context
  const dailyLogs = patientProfile?.dailyLogs || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState({
    medicationTaken: false,
    medicationTime: '',
    smoked: false,
    bloodPressure: '',
    exerciseDuration: '',
    waterIntake: '',
    notes: '',
  });

  const getTodayLog = () => {
    const today = new Date().toISOString().split('T')[0];
    return dailyLogs.find(log => log.date === today);
  };

  const handleSaveLog = () => {
    if (!currentLog.medicationTaken && !currentLog.medicationTime) {
      Alert.alert('Notice', 'Please indicate if you took your medication');
      return;
    }

    addDailyLog(patientProfile.id, currentLog);
    setModalVisible(false);
    setCurrentLog({
      medicationTaken: false,
      medicationTime: '',
      smoked: false,
      bloodPressure: '',
      exerciseDuration: '',
      waterIntake: '',
      notes: '',
    });
    Alert.alert('Success', 'Daily log saved successfully');
  };

  const openLogForm = () => {
    const todayLog = getTodayLog();
    if (todayLog) {
      setCurrentLog({
        medicationTaken: todayLog.medicationTaken,
        medicationTime: todayLog.medicationTime,
        smoked: todayLog.smoked,
        bloodPressure: todayLog.bloodPressure || '',
        exerciseDuration: todayLog.exerciseDuration || '',
        waterIntake: todayLog.waterIntake || '',
        notes: todayLog.notes || '',
      });
    }
    setModalVisible(true);
  };

  const calculateStreak = () => {
    let streak = 0;
    const sortedLogs = [...dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let log of sortedLogs) {
      if (log.medicationTaken && !log.smoked) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // If no patient profile, show error
  if (!patientProfile) {
    return (
      <View style={[globalStyles.container, { padding: 20, justifyContent: 'center' }]}>
        <Text style={{ fontSize: 18, textAlign: 'center', color: colors.textDark }}>
          Patient profile not found. Please contact your administrator.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Patient Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back, {patientProfile.name}!</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileBadge}>
          <Text style={styles.profileInitial}>{patientProfile.name[0]}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statNumber}>{calculateStreak()}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💊</Text>
          <Text style={styles.statNumber}>{dailyLogs.filter(l => l.medicationTaken).length}</Text>
          <Text style={styles.statLabel}>Medications</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statNumber}>{dailyLogs.length}</Text>
          <Text style={styles.statLabel}>Total Logs</Text>
        </View>
      </View>

      {/* Today's Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Health Tracking</Text>
        {getTodayLog() ? (
          <View style={styles.todayCard}>
            <View style={styles.todayHeader}>
              <Text style={styles.todayTitle}>✅ Logged for today</Text>
              <TouchableOpacity onPress={openLogForm}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.todayStats}>
              <Text style={styles.todayStat}>
                💊 Medication: {getTodayLog().medicationTaken ? '✓ Taken' : '✗ Not taken'}
              </Text>
              <Text style={styles.todayStat}>
                🚭 Smoking: {getTodayLog().smoked ? '✗ Yes' : '✓ No'}
              </Text>
              {getTodayLog().bloodPressure && (
                <Text style={styles.todayStat}>
                  ❤️ Blood Pressure: {getTodayLog().bloodPressure}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.logButton} onPress={openLogForm}>
            <Text style={styles.logButtonText}>+ Log Today's Activity</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Patient Info Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Care Plan</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Condition:</Text>
            <Text style={styles.infoValue}>{patientProfile.condition}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Doctor:</Text>
            <Text style={styles.infoValue}>{patientProfile.doctor || 'Not assigned'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Medications:</Text>
            <View style={styles.medicationList}>
              {patientProfile.medications.map((med, index) => (
                <Text key={index} style={styles.medicationItem}>• {med}</Text>
              ))}
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Instructions:</Text>
            <Text style={styles.instructionText}>
              {patientProfile.notes || 'No special instructions'}
            </Text>
          </View>
        </View>
      </View>

      {/* Activity History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity History</Text>
        {dailyLogs.map(log => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logHeader}>
              <Text style={styles.logDate}>{log.date}</Text>
              <View style={styles.logBadge}>
                <Text style={styles.logBadgeText}>
                  {log.medicationTaken && !log.smoked ? '✓ Good' : '⚠ Review'}
                </Text>
              </View>
            </View>
            <View style={styles.logDetails}>
              <View style={styles.logRow}>
                <Text style={styles.logLabel}>Medication:</Text>
                <Text style={[styles.logValue, log.medicationTaken ? styles.success : styles.warning]}>
                  {log.medicationTaken ? `✓ ${log.medicationTime}` : '✗ Not taken'}
                </Text>
              </View>
              <View style={styles.logRow}>
                <Text style={styles.logLabel}>Smoking:</Text>
                <Text style={[styles.logValue, !log.smoked ? styles.success : styles.warning]}>
                  {log.smoked ? '✗ Yes' : '✓ No'}
                </Text>
              </View>
              {log.bloodPressure && (
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Blood Pressure:</Text>
                  <Text style={styles.logValue}>{log.bloodPressure}</Text>
                </View>
              )}
              {log.exerciseDuration && (
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Exercise:</Text>
                  <Text style={styles.logValue}>{log.exerciseDuration} min</Text>
                </View>
              )}
              {log.notes && (
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Notes:</Text>
                  <Text style={styles.logValue}>{log.notes}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Daily Log Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Daily Health Log</Text>
            <Text style={styles.modalSubtitle}>Track your daily activities</Text>

            {/* Medication */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Did you take your medication today?</Text>
              <View style={styles.toggleButtons}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    currentLog.medicationTaken && styles.toggleButtonActive,
                  ]}
                  onPress={() => setCurrentLog({ ...currentLog, medicationTaken: true })}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    currentLog.medicationTaken && styles.toggleButtonTextActive,
                  ]}>✓ Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !currentLog.medicationTaken && styles.toggleButtonActive,
                  ]}
                  onPress={() => setCurrentLog({ ...currentLog, medicationTaken: false })}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    !currentLog.medicationTaken && styles.toggleButtonTextActive,
                  ]}>✗ No</Text>
                </TouchableOpacity>
              </View>
            </View>

            {currentLog.medicationTaken && (
              <TextInput
                style={styles.input}
                placeholder="What time? (e.g., 08:00 AM)"
                placeholderTextColor={colors.gray500}
                value={currentLog.medicationTime}
                onChangeText={(text) => setCurrentLog({ ...currentLog, medicationTime: text })}
              />
            )}

            {/* Smoking */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Did you smoke today?</Text>
              <View style={styles.toggleButtons}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    currentLog.smoked && styles.toggleButtonActive,
                  ]}
                  onPress={() => setCurrentLog({ ...currentLog, smoked: true })}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    currentLog.smoked && styles.toggleButtonTextActive,
                  ]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !currentLog.smoked && styles.toggleButtonActive,
                  ]}
                  onPress={() => setCurrentLog({ ...currentLog, smoked: false })}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    !currentLog.smoked && styles.toggleButtonTextActive,
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Blood Pressure */}
            <TextInput
              style={styles.input}
              placeholder="Blood Pressure (e.g., 120/80)"
              placeholderTextColor={colors.gray500}
              value={currentLog.bloodPressure}
              onChangeText={(text) => setCurrentLog({ ...currentLog, bloodPressure: text })}
            />

            {/* Exercise */}
            <TextInput
              style={styles.input}
              placeholder="Exercise duration (minutes)"
              placeholderTextColor={colors.gray500}
              keyboardType="numeric"
              value={currentLog.exerciseDuration}
              onChangeText={(text) => setCurrentLog({ ...currentLog, exerciseDuration: text })}
            />

            {/* Water Intake */}
            <TextInput
              style={styles.input}
              placeholder="Water intake (glasses)"
              placeholderTextColor={colors.gray500}
              keyboardType="numeric"
              value={currentLog.waterIntake}
              onChangeText={(text) => setCurrentLog({ ...currentLog, waterIntake: text })}
            />

            {/* Notes */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional notes"
              placeholderTextColor={colors.gray500}
              multiline
              numberOfLines={3}
              value={currentLog.notes}
              onChangeText={(text) => setCurrentLog({ ...currentLog, notes: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setCurrentLog({
                    medicationTaken: false,
                    medicationTime: '',
                    smoked: false,
                    bloodPressure: '',
                    exerciseDuration: '',
                    waterIntake: '',
                    notes: '',
                  });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveLog}
              >
                <Text style={styles.saveButtonText}>Save Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
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
  profileBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
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
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  todayCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  editLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  todayStats: {
    gap: 8,
  },
  todayStat: {
    fontSize: 14,
    color: colors.textDark,
  },
  logButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: colors.textDark,
  },
  medicationList: {
    marginTop: 4,
  },
  medicationItem: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  logCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  logBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
  },
  logDetails: {
    gap: 8,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logLabel: {
    fontSize: 13,
    color: colors.textLight,
  },
  logValue: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '500',
  },
  success: {
    color: colors.success,
  },
  warning: {
    color: colors.warning,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
    fontWeight: '600',
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  toggleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: colors.textDark,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray200,
  },
  cancelButtonText: {
    color: colors.textDark,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default PatientDashboard;
