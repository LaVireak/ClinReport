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

const DiseaseHistoryScreen = ({ navigation }) => {
  const { 
    patientProfile, 
    diseaseHistory, 
    addDiseaseHistory, 
    updateDiseaseHistory, 
    deleteDiseaseHistory 
  } = useContext(PatientDataContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentEntry, setCurrentEntry] = useState({
    diseaseName: '',
    diagnosedDate: '',
    status: 'active',
    severity: 'moderate',
    treatment: '',
    medications: '',
    notes: '',
  });

  const resetForm = () => {
    setCurrentEntry({
      diseaseName: '',
      diagnosedDate: '',
      status: 'active',
      severity: 'moderate',
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
      diseaseName: entry.diseaseName,
      diagnosedDate: entry.diagnosedDate,
      status: entry.status,
      severity: entry.severity,
      treatment: entry.treatment || '',
      medications: entry.medications || '',
      notes: entry.notes || '',
    });
    setEditingId(entry.id);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!currentEntry.diseaseName) {
      Alert.alert('Required Field', 'Please enter a disease name');
      return;
    }

    if (!currentEntry.diagnosedDate) {
      Alert.alert('Required Field', 'Please enter a diagnosis date');
      return;
    }

    const entryData = {
      ...currentEntry,
      recordedAt: new Date().toISOString(),
    };

    if (editingId) {
      updateDiseaseHistory(editingId, entryData);
      Alert.alert('Success', 'Disease history updated successfully');
    } else {
      addDiseaseHistory(entryData);
      Alert.alert('Success', 'Disease history added successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this disease history entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDiseaseHistory(id);
            Alert.alert('Success', 'Disease history deleted');
          },
        },
      ]
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { color: colors.error, text: '🔴 Active', bg: '#FFEBEE' };
      case 'recovered':
        return { color: colors.success, text: '🟢 Recovered', bg: '#E8F5E9' };
      case 'monitoring':
        return { color: '#FFA500', text: '🟡 Monitoring', bg: '#FFF3E0' };
      case 'chronic':
        return { color: '#9C27B0', text: '🟣 Chronic', bg: '#F3E5F5' };
      default:
        return { color: colors.gray500, text: '⚪ Unknown', bg: colors.gray100 };
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'mild':
        return { color: colors.success, text: 'Mild' };
      case 'moderate':
        return { color: '#FFA500', text: 'Moderate' };
      case 'severe':
        return { color: colors.error, text: 'Severe' };
      default:
        return { color: colors.gray500, text: 'Unknown' };
    }
  };

  // Sort disease history by date (most recent first)
  const sortedHistory = [...diseaseHistory].sort((a, b) => 
    new Date(b.diagnosedDate) - new Date(a.diagnosedDate)
  );

  // Calculate statistics
  const activeDiseases = diseaseHistory.filter(d => d.status === 'active').length;
  const chronicDiseases = diseaseHistory.filter(d => d.status === 'chronic').length;
  const recoveredDiseases = diseaseHistory.filter(d => d.status === 'recovered').length;

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
          <Text style={styles.headerTitle}>Disease History</Text>
          <Text style={styles.headerSubtitle}>
            {sortedHistory.length} {sortedHistory.length === 1 ? 'condition' : 'conditions'} tracked
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
          <Text style={styles.summaryTitle}>📊 Status Overview</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.error }]}>
                {activeDiseases}
              </Text>
              <Text style={styles.summaryLabel}>Active</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#9C27B0' }]}>
                {chronicDiseases}
              </Text>
              <Text style={styles.summaryLabel}>Chronic</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.success }]}>
                {recoveredDiseases}
              </Text>
              <Text style={styles.summaryLabel}>Recovered</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                {diseaseHistory.length}
              </Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Disease History List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions Timeline</Text>
          {sortedHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏥</Text>
              <Text style={styles.emptyText}>No disease history yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + Add button to record your disease history
              </Text>
            </View>
          ) : (
            sortedHistory.map((entry) => {
              const statusBadge = getStatusBadge(entry.status);
              const severityBadge = getSeverityBadge(entry.severity);

              return (
                <View key={entry.id} style={styles.diseaseCard}>
                  <View style={styles.diseaseHeader}>
                    <View style={styles.diseaseInfo}>
                      <Text style={styles.diseaseName}>{entry.diseaseName}</Text>
                      <Text style={styles.diseaseDate}>
                        Diagnosed: {new Date(entry.diagnosedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                    <View style={styles.diseaseActions}>
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

                  <View style={styles.badgeRow}>
                    <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: statusBadge.color }]}>
                        {statusBadge.text}
                      </Text>
                    </View>
                    <View style={styles.severityBadge}>
                      <Text style={[styles.severityText, { color: severityBadge.color }]}>
                        Severity: {severityBadge.text}
                      </Text>
                    </View>
                  </View>

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
              );
            })
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
                {editingId ? 'Edit Disease Record' : 'Add Disease Record'}
              </Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                resetForm();
              }}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Disease Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Disease/Condition Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Hypertension, Diabetes, etc."
                placeholderTextColor={colors.gray500}
                value={currentEntry.diseaseName}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, diseaseName: text })}
              />
            </View>

            {/* Diagnosed Date */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date Diagnosed *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.gray500}
                value={currentEntry.diagnosedDate}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, diagnosedDate: text })}
              />
            </View>

            {/* Status */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Current Status *</Text>
              <View style={styles.statusButtons}>
                {[
                  { value: 'active', label: '🔴 Active', color: colors.error },
                  { value: 'chronic', label: '🟣 Chronic', color: '#9C27B0' },
                  { value: 'monitoring', label: '🟡 Monitoring', color: '#FFA500' },
                  { value: 'recovered', label: '🟢 Recovered', color: colors.success },
                ].map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.statusButton,
                      currentEntry.status === status.value && { 
                        backgroundColor: status.color,
                        borderColor: status.color,
                      },
                    ]}
                    onPress={() => setCurrentEntry({ ...currentEntry, status: status.value })}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      currentEntry.status === status.value && styles.statusButtonTextActive,
                    ]}>
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Severity */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Severity Level *</Text>
              <View style={styles.severityButtons}>
                {['mild', 'moderate', 'severe'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.severityButton,
                      currentEntry.severity === level && styles.severityButtonActive,
                    ]}
                    onPress={() => setCurrentEntry({ ...currentEntry, severity: level })}
                  >
                    <Text style={[
                      styles.severityButtonText,
                      currentEntry.severity === level && styles.severityButtonTextActive,
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Treatment */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Current Treatment</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe current treatment plan"
                placeholderTextColor={colors.gray500}
                multiline
                numberOfLines={3}
                value={currentEntry.treatment}
                onChangeText={(text) => setCurrentEntry({ ...currentEntry, treatment: text })}
              />
            </View>

            {/* Medications */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Medications</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="List medications for this condition"
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
                placeholder="Any additional information or observations"
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
  diseaseCard: {
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
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  diseaseDate: {
    fontSize: 13,
    color: colors.textLight,
  },
  diseaseActions: {
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
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
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
  statusButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
  },
  statusButtonTextActive: {
    color: colors.white,
  },
  severityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  severityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
  },
  severityButtonTextActive: {
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

export default DiseaseHistoryScreen;
