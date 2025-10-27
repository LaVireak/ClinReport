import React, { useState, useContext, useMemo } from 'react';
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

const ExerciseLoggingScreen = ({ navigation }) => {
  const { exerciseLogs, addExerciseLog, getExerciseStats } = useContext(PatientDataContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'walking',
    duration: '',
    intensity: 'moderate',
    caloriesBurned: '',
    notes: '',
  });

  const resetForm = () => {
    setCurrentLog({
      date: new Date().toISOString().split('T')[0],
      type: 'walking',
      duration: '',
      intensity: 'moderate',
      caloriesBurned: '',
      notes: '',
    });
  };

  const handleSave = () => {
    if (!currentLog.duration) {
      Alert.alert('Required Field', 'Please enter exercise duration');
      return;
    }

    addExerciseLog({
      ...currentLog,
      duration: parseInt(currentLog.duration),
      caloriesBurned: currentLog.caloriesBurned ? parseInt(currentLog.caloriesBurned) : 0,
    });

    Alert.alert('Success', 'Exercise log added successfully');
    setModalVisible(false);
    resetForm();
  };

  const getExerciseIcon = (type) => {
    switch (type) {
      case 'walking': return '🚶';
      case 'running': return '🏃';
      case 'cycling': return '🚴';
      case 'swimming': return '🏊';
      case 'yoga': return '🧘';
      case 'gym': return '🏋️';
      case 'sports': return '⚽';
      default: return '💪';
    }
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'light': return '#4CAF50';
      case 'moderate': return '#FFA500';
      case 'vigorous': return colors.error;
      default: return colors.gray500;
    }
  };

  // Calculate statistics
  const exerciseStats = useMemo(() => getExerciseStats(), [exerciseLogs]);
  
  // Sort logs by date (most recent first)
  const sortedLogs = [...exerciseLogs].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Last 7 days for chart
  const last7Days = sortedLogs.slice(0, 7).reverse();
  const maxDuration = Math.max(...last7Days.map(l => l.duration), 60);

  // Weekly goal (150 minutes recommended)
  const weeklyGoal = 150;
  const weeklyProgress = (exerciseStats.weeklyMinutes / weeklyGoal) * 100;

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
          <Text style={styles.headerTitle}>Exercise Tracking</Text>
          <Text style={styles.headerSubtitle}>
            {exerciseLogs.length} {exerciseLogs.length === 1 ? 'workout' : 'workouts'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Log</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Statistics Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Exercise Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>This Week</Text>
              <Text style={styles.statValue}>{exerciseStats.weeklyMinutes}min</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Sessions</Text>
              <Text style={styles.statValue}>{exerciseStats.totalSessions}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Avg Duration</Text>
              <Text style={styles.statValue}>{exerciseStats.avgDuration}min</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statValue}>{exerciseStats.totalCalories}</Text>
            </View>
          </View>

          {/* Weekly Goal Progress */}
          <View style={styles.goalSection}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>Weekly Goal: {weeklyGoal} minutes</Text>
              <Text style={styles.goalValue}>
                {exerciseStats.weeklyMinutes} / {weeklyGoal}min
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(weeklyProgress, 100)}%`,
                    backgroundColor: weeklyProgress >= 100 ? colors.success : '#FFA500',
                  }
                ]} 
              />
            </View>
            <Text style={styles.goalNote}>
              {weeklyProgress >= 100 
                ? '🎉 Goal achieved! Great work!' 
                : `${Math.round(weeklyGoal - exerciseStats.weeklyMinutes)} more minutes to reach your goal`}
            </Text>
          </View>
        </View>

        {/* 7-Day Chart */}
        {last7Days.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>📈 Last 7 Days</Text>
            <View style={styles.chart}>
              {last7Days.map((log, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: `${(log.duration / maxDuration) * 100}%`,
                          backgroundColor: getIntensityColor(log.intensity),
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>
                    {new Date(log.date).getDate()}
                  </Text>
                  <Text style={styles.barValue}>{log.duration}m</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>Light</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFA500' }]} />
                <Text style={styles.legendText}>Moderate</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
                <Text style={styles.legendText}>Vigorous</Text>
              </View>
            </View>
          </View>
        )}

        {/* Exercise Type Breakdown */}
        {exerciseStats.typeBreakdown && Object.keys(exerciseStats.typeBreakdown).length > 0 && (
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Activity Breakdown</Text>
            {Object.entries(exerciseStats.typeBreakdown).map(([type, count]) => (
              <View key={type} style={styles.breakdownItem}>
                <Text style={styles.breakdownIcon}>{getExerciseIcon(type)}</Text>
                <Text style={styles.breakdownType}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
                <Text style={styles.breakdownCount}>{count} sessions</Text>
              </View>
            ))}
          </View>
        )}

        {/* Exercise History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercise History</Text>
          {sortedLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💪</Text>
              <Text style={styles.emptyText}>No exercise records yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + Log button to start tracking your workouts
              </Text>
            </View>
          ) : (
            sortedLogs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <View style={styles.logTypeSection}>
                    <Text style={styles.logIcon}>{getExerciseIcon(log.type)}</Text>
                    <View>
                      <Text style={styles.logType}>
                        {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                      </Text>
                      <Text style={styles.logDate}>
                        {new Date(log.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.logDuration}>
                    <Text style={styles.durationNumber}>{log.duration}</Text>
                    <Text style={styles.durationLabel}>minutes</Text>
                  </View>
                </View>

                <View style={styles.logDetails}>
                  <View style={[
                    styles.intensityBadge,
                    { backgroundColor: `${getIntensityColor(log.intensity)}20` }
                  ]}>
                    <Text style={[
                      styles.intensityText,
                      { color: getIntensityColor(log.intensity) }
                    ]}>
                      {log.intensity.charAt(0).toUpperCase() + log.intensity.slice(1)} Intensity
                    </Text>
                  </View>

                  {log.caloriesBurned > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🔥 Calories Burned:</Text>
                      <Text style={styles.detailValue}>{log.caloriesBurned} kcal</Text>
                    </View>
                  )}
                </View>

                {log.notes && (
                  <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>📝 Notes:</Text>
                    <Text style={styles.notesText}>{log.notes}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Exercise Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Exercise Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Aim for 150 minutes of moderate activity per week</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Include both cardio and strength training</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Stay hydrated before, during, and after exercise</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Listen to your body and rest when needed</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Exercise Modal */}
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Exercise</Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                resetForm();
              }}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Date */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.gray500}
                  value={currentLog.date}
                  onChangeText={(text) => setCurrentLog({ ...currentLog, date: text })}
                />
              </View>

              {/* Exercise Type */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Exercise Type *</Text>
                <View style={styles.typeButtons}>
                  {['walking', 'running', 'cycling', 'swimming', 'yoga', 'gym', 'sports', 'other'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        currentLog.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setCurrentLog({ ...currentLog, type })}
                    >
                      <Text style={styles.typeButtonIcon}>{getExerciseIcon(type)}</Text>
                      <Text style={[
                        styles.typeButtonText,
                        currentLog.type === type && styles.typeButtonTextActive,
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Duration */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Duration (minutes) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 30"
                  placeholderTextColor={colors.gray500}
                  keyboardType="numeric"
                  value={currentLog.duration}
                  onChangeText={(text) => setCurrentLog({ ...currentLog, duration: text })}
                />
              </View>

              {/* Intensity */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Intensity Level *</Text>
                <View style={styles.intensityButtons}>
                  {['light', 'moderate', 'vigorous'].map((intensity) => (
                    <TouchableOpacity
                      key={intensity}
                      style={[
                        styles.intensityButton,
                        currentLog.intensity === intensity && {
                          backgroundColor: getIntensityColor(intensity),
                          borderColor: getIntensityColor(intensity),
                        },
                      ]}
                      onPress={() => setCurrentLog({ ...currentLog, intensity })}
                    >
                      <Text style={[
                        styles.intensityButtonText,
                        currentLog.intensity === intensity && styles.intensityButtonTextActive,
                      ]}>
                        {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Calories */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Calories Burned (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 200"
                  placeholderTextColor={colors.gray500}
                  keyboardType="numeric"
                  value={currentLog.caloriesBurned}
                  onChangeText={(text) => setCurrentLog({ ...currentLog, caloriesBurned: text })}
                />
              </View>

              {/* Notes */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="How did you feel? Any achievements?"
                  placeholderTextColor={colors.gray500}
                  multiline
                  numberOfLines={3}
                  value={currentLog.notes}
                  onChangeText={(text) => setCurrentLog({ ...currentLog, notes: text })}
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
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
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
  statsCard: {
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
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  goalSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalNote: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  chartCard: {
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
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 12,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barContainer: {
    width: '80%',
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
  },
  barValue: {
    fontSize: 10,
    color: colors.textDark,
    fontWeight: '600',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: colors.textLight,
  },
  breakdownCard: {
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
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  breakdownIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  breakdownType: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  breakdownCount: {
    fontSize: 14,
    color: colors.textLight,
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
  logCard: {
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logTypeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logIcon: {
    fontSize: 32,
  },
  logType: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  logDate: {
    fontSize: 13,
    color: colors.textLight,
  },
  logDuration: {
    alignItems: 'center',
  },
  durationNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  durationLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  logDetails: {
    gap: 8,
  },
  intensityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  intensityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textDark,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
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
    maxHeight: '85%',
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
  intensityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  intensityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  intensityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
  },
  intensityButtonTextActive: {
    color: colors.white,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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

export default ExerciseLoggingScreen;
