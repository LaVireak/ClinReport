import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { PatientDataContext } from '../context/PatientDataContext';
import { colors } from '../styles/colors';

const MedicalHistoryScreen = ({ navigation }) => {
  const { 
    patientProfile, 
    medicalHistory, 
    addMedicalHistory, 
    updateMedicalHistory, 
    deleteMedicalHistory 
  } = useContext(PatientDataContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'visit',
    hospital: '',
    doctor: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: '',
  });

  const resetForm = () => {
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      type: 'visit',
      hospital: '',
      doctor: '',
      diagnosis: '',
      treatment: '',
      medications: '',
      notes: '',
    });
    setEditingId(null);
  };

  const openAddForm = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditForm = (entry) => {
    setCurrentEntry({
      date: entry.date,
      type: entry.type,
      hospital: entry.hospital || '',
      doctor: entry.doctor || '',
      diagnosis: entry.diagnosis || '',
      treatment: entry.treatment || '',
      medications: entry.medications || '',
      notes: entry.notes || '',
    });
    setEditingId(entry.id);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!currentEntry.date) {
      Alert.alert('Required Field', 'Please enter a date');
      return;
    }

    const entryData = {
      ...currentEntry,
      recordedAt: new Date().toISOString(),
    };

    if (editingId) {
      updateMedicalHistory(editingId, entryData);
      Alert.alert('Success', 'Medical history updated successfully');
    } else {
      addMedicalHistory(entryData);
      Alert.alert('Success', 'Medical history added successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this medical history entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMedicalHistory(id);
            Alert.alert('Success', 'Medical history deleted');
          },
        },
      ]
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'visit': return '🏥';
      case 'surgery': return '⚕️';
      case 'test': return '🔬';
      case 'vaccination': return '💉';
      case 'injury': return '🤕';
      default: return '📋';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'visit': return 'Hospital Visit';
      case 'surgery': return 'Surgery';
      case 'test': return 'Lab Test';
      case 'vaccination': return 'Vaccination';
      case 'injury': return 'Injury';
      default: return 'Other';
    }
  };

  // Sort medical history by date (most recent first)
  const sortedHistory = [...medicalHistory].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medical History</Text>
          <Text style={styles.headerSubtitle}>
            {sortedHistory.length} {sortedHistory.length === 1 ? 'record' : 'records'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={openAddForm}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {medicalHistory.filter(h => h.type === 'visit').length}
              </Text>
              <Text style={styles.summaryLabel}>Visits</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {medicalHistory.filter(h => h.type === 'surgery').length}
              </Text>
              <Text style={styles.summaryLabel}>Surgeries</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {medicalHistory.filter(h => h.type === 'test').length}
              </Text>
              <Text style={styles.summaryLabel}>Tests</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {medicalHistory.filter(h => h.type === 'vaccination').length}
              </Text>
              <Text style={styles.summaryLabel}>Vaccines</Text>
            </View>
          </View>
        </View>

        {/* Medical History Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Timeline</Text>
          {sortedHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No medical history yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + Add button to record your medical history
              </Text>
            </View>
          ) : (
            sortedHistory.map((entry) => (
              <View key={entry.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyTypeSection}>
                    <Text style={styles.historyIcon}>{getTypeIcon(entry.type)}</Text>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyType}>{getTypeLabel(entry.type)}</Text>
                      <Text style={styles.historyDate}>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openEditForm(entry)}
                    >
                      <Text style={styles.actionButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(entry.id)}
                    >
                      <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {entry.hospital && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>🏥 Hospital:</Text>
                    <Text style={styles.detailValue}>{entry.hospital}</Text>
                  </View>
                )}

                {entry.doctor && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>👨‍⚕️ Doctor:</Text>
                    <Text style={styles.detailValue}>{entry.doctor}</Text>
                  </View>
                )}

                {entry.diagnosis && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📋 Diagnosis:</Text>
                    <Text style={styles.detailValue}>{entry.diagnosis}</Text>
                  </View>
                )}

                {entry.treatment && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>💊 Treatment:</Text>
                    <Text style={styles.detailValue}>{entry.treatment}</Text>
                  </View>
                )}

                {entry.medications && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>💉 Medications:</Text>
                    <Text style={styles.detailValue}>{entry.medications}</Text>
                  </View>
                )}

                {entry.notes && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📝 Notes:</Text>
                    <Text style={styles.detailValue}>{entry.notes}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Edit Medical Record' : 'Add Medical Record'}
              </Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                resetForm();
              }}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Date */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.gray500}
                value={currentEntry.date}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, date: text })}
              />
            </View>

            {/* Type */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Type *</Text>
              <View style={styles.typeButtons}>
                {['visit', 'surgery', 'test', 'vaccination', 'injury', 'other'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      currentEntry.type === type && styles.typeButtonActive,
                    ]}
                    onPress={() => setCurrentEntry({ ...currentEntry, type })}
                  >
                    <Text style={styles.typeButtonIcon}>{getTypeIcon(type)}</Text>
                    <Text style={[
                      styles.typeButtonText,
                      currentEntry.type === type && styles.typeButtonTextActive,
                    ]}>
                      {getTypeLabel(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Hospital */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Hospital/Clinic</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter hospital or clinic name"
                placeholderTextColor={colors.gray500}
                value={currentEntry.hospital}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, hospital: text })}
              />
            </View>

            {/* Doctor */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Doctor</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter doctor's name"
                placeholderTextColor={colors.gray500}
                value={currentEntry.doctor}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, doctor: text })}
              />
            </View>

            {/* Diagnosis */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Diagnosis</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter diagnosis or condition"
                placeholderTextColor={colors.gray500}
                multiline
                numberOfLines={3}
                value={currentEntry.diagnosis}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, diagnosis: text })}
              />
            </View>

            {/* Treatment */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Treatment</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter treatment received"
                placeholderTextColor={colors.gray500}
                multiline
                numberOfLines={3}
                value={currentEntry.treatment}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, treatment: text })}
              />
            </View>

            {/* Medications */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Medications Prescribed</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="List medications prescribed"
                placeholderTextColor={colors.gray500}
                multiline
                numberOfLines={2}
                value={currentEntry.medications}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, medications: text })}
              />
            </View>

            {/* Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any additional notes or observations"
                placeholderTextColor={colors.gray500}
                multiline
                numberOfLines={3}
                value={currentEntry.notes}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, notes: text })}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
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
  emptyState: {
    backgroundColor: colors.white,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyTypeSection: {
    flexDirection: 'row',
    flex: 1,
  },
  historyIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.gray100,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  actionButtonText: {
    fontSize: 16,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  modalClose: {
    fontSize: 24,
    color: colors.textLight,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.textDark,
    backgroundColor: colors.white,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray200,
  },
  cancelButtonText: {
    color: colors.textDark,
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MedicalHistoryScreen;
