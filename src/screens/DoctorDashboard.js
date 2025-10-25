import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { usePatientData } from '../context/PatientDataContext';

const DoctorDashboard = ({ navigation, route }) => {
  const { patients, addPatient, updatePatient, scheduleAppointment } = usePatientData();

  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // New patient form state
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    condition: '',
    medications: '',
    notes: '',
  });

  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    patientId: null,
    date: '',
    time: '',
    reason: '',
  });

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.condition) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const patientData = {
      name: newPatient.name,
      age: parseInt(newPatient.age),
      condition: newPatient.condition,
      lastVisit: new Date().toISOString().split('T')[0],
      nextAppointment: '',
      medications: newPatient.medications.split(',').map(m => m.trim()).filter(m => m),
      notes: newPatient.notes,
    };

    addPatient(patientData);
    setModalVisible(false);
    setNewPatient({ name: '', age: '', condition: '', medications: '', notes: '' });
    Alert.alert('Success', 'Patient added successfully');
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setNewPatient({
      name: patient.name,
      age: patient.age.toString(),
      condition: patient.condition,
      medications: patient.medications.join(', '),
      notes: patient.notes,
    });
    setModalVisible(true);
  };

  const handleUpdatePatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.condition) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedData = {
      name: newPatient.name,
      age: parseInt(newPatient.age),
      condition: newPatient.condition,
      medications: newPatient.medications.split(',').map(m => m.trim()).filter(m => m),
      notes: newPatient.notes,
    };

    updatePatient(selectedPatient.id, updatedData);
    setModalVisible(false);
    setSelectedPatient(null);
    setNewPatient({ name: '', age: '', condition: '', medications: '', notes: '' });
    Alert.alert('Success', 'Patient updated successfully');
  };

  const handleScheduleAppointment = (patient) => {
    setScheduleForm({ ...scheduleForm, patientId: patient.id });
    setScheduleModalVisible(true);
  };

  const handleSaveSchedule = () => {
    if (!scheduleForm.date || !scheduleForm.time || !scheduleForm.reason) {
      Alert.alert('Error', 'Please fill in all schedule fields');
      return;
    }

    scheduleAppointment(scheduleForm.patientId, scheduleForm.date);
    setScheduleModalVisible(false);
    setScheduleForm({ patientId: null, date: '', time: '', reason: '' });
    Alert.alert('Success', 'Appointment scheduled successfully');
  };

  const handleSendAlert = (patient) => {
    Alert.alert(
      'Send Alert',
      `Send reminder to ${patient.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => Alert.alert('Success', `Alert sent to ${patient.name}`),
        },
      ]
    );
  };

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
            <Text style={styles.headerTitle}>Doctor Dashboard</Text>
            <Text style={styles.headerSubtitle}>Manage your patients</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedPatient(null);
            setNewPatient({ name: '', age: '', condition: '', medications: '', notes: '' });
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add Patient</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{patients.length}</Text>
          <Text style={styles.statLabel}>Total Patients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {patients.filter(p => p.nextAppointment).length}
          </Text>
          <Text style={styles.statLabel}>Scheduled</Text>
        </View>
      </View>

      {/* Patient List */}
      <Text style={styles.sectionTitle}>Patient Records</Text>
      {patients.map(patient => (
        <View key={patient.id} style={styles.patientCard}>
          <View style={styles.patientHeader}>
            <View>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientInfo}>Age: {patient.age} • {patient.condition}</Text>
            </View>
            <View style={styles.patientBadge}>
              <Text style={styles.badgeText}>ID: {patient.id}</Text>
            </View>
          </View>

          <View style={styles.patientDetails}>
            <Text style={styles.detailLabel}>Last Visit:</Text>
            <Text style={styles.detailValue}>{patient.lastVisit}</Text>
          </View>

          {patient.nextAppointment && (
            <View style={styles.patientDetails}>
              <Text style={styles.detailLabel}>Next Appointment:</Text>
              <Text style={styles.detailValue}>{patient.nextAppointment}</Text>
            </View>
          )}

          <View style={styles.patientDetails}>
            <Text style={styles.detailLabel}>Medications:</Text>
            <Text style={styles.detailValue}>{patient.medications.join(', ')}</Text>
          </View>

          <View style={styles.patientDetails}>
            <Text style={styles.detailLabel}>Notes:</Text>
            <Text style={styles.detailValue}>{patient.notes}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEditPatient(patient)}
            >
              <Text style={styles.actionButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.scheduleButton]}
              onPress={() => handleScheduleAppointment(patient)}
            >
              <Text style={styles.actionButtonText}>📅 Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.alertButton]}
              onPress={() => handleSendAlert(patient)}
            >
              <Text style={styles.actionButtonText}>🔔 Alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Add/Edit Patient Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Patient Name *"
              placeholderTextColor={colors.gray500}
              value={newPatient.name}
              onChangeText={(text) => setNewPatient({ ...newPatient, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Age *"
              placeholderTextColor={colors.gray500}
              keyboardType="numeric"
              value={newPatient.age}
              onChangeText={(text) => setNewPatient({ ...newPatient, age: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Condition *"
              placeholderTextColor={colors.gray500}
              value={newPatient.condition}
              onChangeText={(text) => setNewPatient({ ...newPatient, condition: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Medications (comma separated)"
              placeholderTextColor={colors.gray500}
              value={newPatient.medications}
              onChangeText={(text) => setNewPatient({ ...newPatient, medications: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes"
              placeholderTextColor={colors.gray500}
              multiline
              numberOfLines={4}
              value={newPatient.notes}
              onChangeText={(text) => setNewPatient({ ...newPatient, notes: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedPatient(null);
                  setNewPatient({ name: '', age: '', condition: '', medications: '', notes: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={selectedPatient ? handleUpdatePatient : handleAddPatient}
              >
                <Text style={styles.saveButtonText}>
                  {selectedPatient ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Schedule Appointment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={scheduleModalVisible}
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule Appointment</Text>

            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD) *"
              placeholderTextColor={colors.gray500}
              value={scheduleForm.date}
              onChangeText={(text) => setScheduleForm({ ...scheduleForm, date: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Time (HH:MM) *"
              placeholderTextColor={colors.gray500}
              value={scheduleForm.time}
              onChangeText={(text) => setScheduleForm({ ...scheduleForm, time: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Reason for visit *"
              placeholderTextColor={colors.gray500}
              multiline
              numberOfLines={3}
              value={scheduleForm.reason}
              onChangeText={(text) => setScheduleForm({ ...scheduleForm, reason: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setScheduleModalVisible(false);
                  setScheduleForm({ patientId: null, date: '', time: '', reason: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveSchedule}
              >
                <Text style={styles.saveButtonText}>Schedule</Text>
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
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
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
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  patientCard: {
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
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  patientInfo: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  patientBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  patientDetails: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textDark,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.warning,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
  },
  alertButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 20,
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

export default DoctorDashboard;
