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

const SleepTrackingScreen = ({ navigation }) => {
  const { sleepLogs, addSleepLog, getSleepStats } = useContext(PatientDataContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState({
    date: new Date().toISOString().split('T')[0],
    bedTime: '',
    wakeTime: '',
    quality: 'good',
    notes: '',
  });

  const resetForm = () => {
    setCurrentLog({
      date: new Date().toISOString().split('T')[0],
      bedTime: '',
      wakeTime: '',
      quality: 'good',
      notes: '',
    });
  };

  const calculateDuration = (bedTime, wakeTime) => {
    if (!bedTime || !wakeTime) return 0;
    
    const [bedHour, bedMin] = bedTime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    
    let bedMinutes = bedHour * 60 + bedMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;
    
    // If wake time is earlier than bed time, it means next day
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    const durationMinutes = wakeMinutes - bedMinutes;
    return (durationMinutes / 60).toFixed(1);
  };

  const handleSave = () => {
    if (!currentLog.bedTime || !currentLog.wakeTime) {
      Alert.alert('Required Fields', 'Please enter both bed time and wake time');
      return;
    }

    const duration = calculateDuration(currentLog.bedTime, currentLog.wakeTime);

    addSleepLog({
      ...currentLog,
      duration: parseFloat(duration),
    });

    Alert.alert('Success', 'Sleep log added successfully');
    setModalVisible(false);
    resetForm();
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return colors.success;
      case 'good': return '#4CAF50';
      case 'fair': return '#FFA500';
      case 'poor': return colors.error;
      default: return colors.gray500;
    }
  };

  const getQualityEmoji = (quality) => {
    switch (quality) {
      case 'excellent': return '😴';
      case 'good': return '😊';
      case 'fair': return '😐';
      case 'poor': return '😞';
      default: return '💤';
    }
  };

  // Calculate statistics
  const sleepStats = useMemo(() => getSleepStats(), [sleepLogs]);
  
  // Sort logs by date (most recent first)
  const sortedLogs = [...sleepLogs].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Last 7 days for mini chart
  const last7Days = sortedLogs.slice(0, 7).reverse();
  const maxDuration = Math.max(...last7Days.map(l => l.duration), 8);

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
          <Text style={styles.headerTitle}>Sleep Tracking</Text>
          <Text style={styles.headerSubtitle}>
            {sleepLogs.length} {sleepLogs.length === 1 ? 'record' : 'records'}
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
          <Text style={styles.statsTitle}>📊 Sleep Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average</Text>
              <Text style={styles.statValue}>{sleepStats.averageDuration}h</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Best</Text>
              <Text style={styles.statValue}>{sleepStats.bestDuration}h</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>7-Day Avg</Text>
              <Text style={styles.statValue}>{sleepStats.last7DaysAvg}h</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Quality</Text>
              <Text style={styles.statValue}>{sleepStats.averageQuality}</Text>
            </View>
          </View>

          {/* Sleep Goal Progress */}
          <View style={styles.goalSection}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>Sleep Goal: 8 hours</Text>
              <Text style={styles.goalValue}>
                {sleepStats.averageDuration} / 8h
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min((parseFloat(sleepStats.averageDuration) / 8) * 100, 100)}%`,
                    backgroundColor: parseFloat(sleepStats.averageDuration) >= 7 ? colors.success : '#FFA500',
                  }
                ]} 
              />
            </View>
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
                          backgroundColor: getQualityColor(log.quality),
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>
                    {new Date(log.date).getDate()}
                  </Text>
                  <Text style={styles.barValue}>{log.duration}h</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                <Text style={styles.legendText}>Excellent/Good</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFA500' }]} />
                <Text style={styles.legendText}>Fair</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
                <Text style={styles.legendText}>Poor</Text>
              </View>
            </View>
          </View>
        )}

        {/* Sleep Log History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep History</Text>
          {sortedLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💤</Text>
              <Text style={styles.emptyText}>No sleep records yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + Log button to start tracking your sleep
              </Text>
            </View>
          ) : (
            sortedLogs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <View style={styles.logDateSection}>
                    <Text style={styles.logEmoji}>{getQualityEmoji(log.quality)}</Text>
                    <View>
                      <Text style={styles.logDate}>
                        {new Date(log.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                      <Text style={styles.logQuality}>
                        Quality: {log.quality.charAt(0).toUpperCase() + log.quality.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.logDuration}>
                    <Text style={styles.durationNumber}>{log.duration}</Text>
                    <Text style={styles.durationLabel}>hours</Text>
                  </View>
                </View>

                <View style={styles.logDetails}>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>🌙 Bed Time:</Text>
                    <Text style={styles.timeValue}>{log.bedTime}</Text>
                  </View>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>☀️ Wake Time:</Text>
                    <Text style={styles.timeValue}>{log.wakeTime}</Text>
                  </View>
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

        {/* Sleep Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Sleep Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Aim for 7-9 hours of sleep per night</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Keep a consistent sleep schedule</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Avoid screens 1 hour before bed</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Create a relaxing bedtime routine</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Sleep Log Modal */}
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
              <Text style={styles.modalTitle}>Log Sleep</Text>
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

              {/* Bed Time */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bed Time *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM (e.g., 22:30)"
                  placeholderTextColor={colors.gray500}
                  value={currentLog.bedTime}
                  onChangeText={(text) => setCurrentLog({ ...currentLog, bedTime: text })}
                />
              </View>

              {/* Wake Time */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Wake Time *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM (e.g., 06:30)"
                  placeholderTextColor={colors.gray500}
                  value={currentLog.wakeTime}
                  onChangeText={(text) => setCurrentLog({ ...currentLog, wakeTime: text })}
                />
              </View>

              {/* Duration Preview */}
              {currentLog.bedTime && currentLog.wakeTime && (
                <View style={styles.durationPreview}>
                  <Text style={styles.durationPreviewText}>
                    Duration: {calculateDuration(currentLog.bedTime, currentLog.wakeTime)} hours
                  </Text>
                </View>
              )}

              {/* Quality */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Sleep Quality</Text>
                <View style={styles.qualityButtons}>
                  {['excellent', 'good', 'fair', 'poor'].map((quality) => (
                    <TouchableOpacity
                      key={quality}
                      style={[
                        styles.qualityButton,
                        currentLog.quality === quality && styles.qualityButtonActive,
                        currentLog.quality === quality && { 
                          backgroundColor: getQualityColor(quality),
                          borderColor: getQualityColor(quality),
                        },
                      ]}
                      onPress={() => setCurrentLog({ ...currentLog, quality })}
                    >
                      <Text style={styles.qualityEmoji}>{getQualityEmoji(quality)}</Text>
                      <Text style={[
                        styles.qualityButtonText,
                        currentLog.quality === quality && styles.qualityButtonTextActive,
                      ]}>
                        {quality.charAt(0).toUpperCase() + quality.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="How did you sleep? Any issues?"
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
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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
  logDateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logEmoji: {
    fontSize: 32,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  logQuality: {
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
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: colors.textDark,
  },
  timeValue: {
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
  durationPreview: {
    backgroundColor: colors.gray50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  durationPreviewText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  qualityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  qualityButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
    gap: 6,
  },
  qualityButtonActive: {
    borderWidth: 2,
  },
  qualityEmoji: {
    fontSize: 18,
  },
  qualityButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  qualityButtonTextActive: {
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

export default SleepTrackingScreen;
