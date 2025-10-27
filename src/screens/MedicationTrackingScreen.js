import React, { useState, useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { PatientDataContext } from '../context/PatientDataContext';
import { colors } from '../styles/colors';

const MedicationTrackingScreen = ({ navigation }) => {
  const { 
    patientProfile,
    dailyLogs,
    getMedicationCompliance,
  } = useContext(PatientDataContext);

  // Calculate medication compliance statistics
  const complianceStats = useMemo(() => getMedicationCompliance(), [dailyLogs]);

  // Get last 30 days of logs
  const last30Days = useMemo(() => {
    const logs = [...dailyLogs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);
    return logs;
  }, [dailyLogs]);

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const sorted = [...dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let log of sorted) {
      if (log.medicationTaken) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Group logs by week
  const getWeeklyData = () => {
    const weeks = [];
    let currentWeek = [];
    let weekTaken = 0;
    let weekTotal = 0;

    last30Days.forEach((log, index) => {
      currentWeek.push(log);
      weekTotal++;
      if (log.medicationTaken) weekTaken++;

      if (currentWeek.length === 7 || index === last30Days.length - 1) {
        weeks.push({
          logs: currentWeek,
          compliance: weekTotal > 0 ? Math.round((weekTaken / weekTotal) * 100) : 0,
          taken: weekTaken,
          total: weekTotal,
        });
        currentWeek = [];
        weekTaken = 0;
        weekTotal = 0;
      }
    });

    return weeks.reverse();
  };

  const weeklyData = getWeeklyData();

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
          <Text style={styles.headerTitle}>Medication Tracking</Text>
          <Text style={styles.headerSubtitle}>
            {patientProfile.medications?.length || 0} medications
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Compliance Overview */}
        <View style={styles.complianceCard}>
          <Text style={styles.cardTitle}>📊 Compliance Overview</Text>
          
          <View style={styles.complianceStats}>
            <View style={styles.statLarge}>
              <Text style={styles.statLargeNumber}>{complianceStats.complianceRate}%</Text>
              <Text style={styles.statLargeLabel}>Overall Compliance</Text>
              <View style={styles.progressRing}>
                <View 
                  style={[
                    styles.progressRingFill,
                    { 
                      width: `${complianceStats.complianceRate}%`,
                      backgroundColor: complianceStats.complianceRate >= 80 
                        ? colors.success 
                        : complianceStats.complianceRate >= 60 
                          ? '#FFA500' 
                          : colors.error,
                    }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statSmall}>
                <Text style={styles.statSmallIcon}>🔥</Text>
                <Text style={styles.statSmallNumber}>{currentStreak}</Text>
                <Text style={styles.statSmallLabel}>Day Streak</Text>
              </View>
              <View style={styles.statSmall}>
                <Text style={styles.statSmallIcon}>✅</Text>
                <Text style={styles.statSmallNumber}>{complianceStats.totalTaken}</Text>
                <Text style={styles.statSmallLabel}>Taken</Text>
              </View>
              <View style={styles.statSmall}>
                <Text style={styles.statSmallIcon}>❌</Text>
                <Text style={styles.statSmallNumber}>{complianceStats.totalMissed}</Text>
                <Text style={styles.statSmallLabel}>Missed</Text>
              </View>
            </View>
          </View>

          {/* Compliance Message */}
          <View style={[
            styles.complianceMessage,
            complianceStats.complianceRate >= 80 && styles.complianceMessageGood,
            complianceStats.complianceRate >= 60 && complianceStats.complianceRate < 80 && styles.complianceMessageWarning,
            complianceStats.complianceRate < 60 && styles.complianceMessageDanger,
          ]}>
            <Text style={styles.complianceMessageIcon}>
              {complianceStats.complianceRate >= 80 ? '🎉' : complianceStats.complianceRate >= 60 ? '⚠️' : '🚨'}
            </Text>
            <Text style={styles.complianceMessageText}>
              {complianceStats.complianceRate >= 80 
                ? 'Excellent! Keep up the great work!' 
                : complianceStats.complianceRate >= 60 
                  ? 'Good progress. Try to improve consistency.' 
                  : 'Needs improvement. Remember to take your medication daily.'}
            </Text>
          </View>
        </View>

        {/* Current Medications */}
        <View style={styles.medicationsCard}>
          <Text style={styles.cardTitle}>💊 Current Medications</Text>
          {patientProfile.medications && patientProfile.medications.length > 0 ? (
            patientProfile.medications.map((med, index) => (
              <View key={index} style={styles.medItem}>
                <View style={styles.medIcon}>
                  <Text style={styles.medIconText}>💊</Text>
                </View>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{med}</Text>
                  <Text style={styles.medInstruction}>
                    {patientProfile.notes || 'Follow prescription instructions'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyMeds}>
              <Text style={styles.emptyMedsText}>No medications listed</Text>
              <Text style={styles.emptyMedsSubtext}>
                Medications are configured in your patient profile
              </Text>
            </View>
          )}
        </View>

        {/* Weekly Breakdown */}
        <View style={styles.weeklyCard}>
          <Text style={styles.cardTitle}>📅 Weekly Breakdown</Text>
          {weeklyData.map((week, index) => (
            <View key={index} style={styles.weekItem}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekLabel}>Week {weeklyData.length - index}</Text>
                <Text style={[
                  styles.weekCompliance,
                  { color: week.compliance >= 80 ? colors.success : week.compliance >= 60 ? '#FFA500' : colors.error }
                ]}>
                  {week.compliance}%
                </Text>
              </View>
              <View style={styles.weekDots}>
                {week.logs.map((log, logIndex) => (
                  <View 
                    key={logIndex}
                    style={[
                      styles.dayDot,
                      { backgroundColor: log.medicationTaken ? colors.success : colors.error }
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.weekStats}>
                {week.taken} / {week.total} days
              </Text>
            </View>
          ))}
        </View>

        {/* 30-Day Calendar View */}
        <View style={styles.calendarCard}>
          <Text style={styles.cardTitle}>📆 Last 30 Days</Text>
          <View style={styles.calendarGrid}>
            {last30Days.reverse().map((log, index) => (
              <View key={index} style={styles.calendarDay}>
                <View style={[
                  styles.calendarDayCircle,
                  log.medicationTaken 
                    ? styles.calendarDayTaken 
                    : styles.calendarDayMissed
                ]}>
                  <Text style={[
                    styles.calendarDayNumber,
                    log.medicationTaken && styles.calendarDayNumberTaken
                  ]}>
                    {new Date(log.date).getDate()}
                  </Text>
                </View>
                {log.medicationTime && (
                  <Text style={styles.calendarDayTime}>
                    {log.medicationTime.substring(0, 5)}
                  </Text>
                )}
              </View>
            ))}
          </View>
          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Taken</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.error }]} />
              <Text style={styles.legendText}>Missed</Text>
            </View>
          </View>
        </View>

        {/* Medication Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Medication Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Take medication at the same time daily</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Set daily reminders on your phone</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Keep medications in a visible location</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Use a pill organizer for weekly planning</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>Never skip doses without consulting your doctor</Text>
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
  content: {
    flex: 1,
  },
  complianceCard: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  complianceStats: {
    marginBottom: 16,
  },
  statLarge: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statLargeNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  statLargeLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
    marginBottom: 12,
  },
  progressRing: {
    width: '100%',
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressRingFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statSmall: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  statSmallIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statSmallNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  statSmallLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  complianceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  complianceMessageGood: {
    backgroundColor: '#E8F5E9',
  },
  complianceMessageWarning: {
    backgroundColor: '#FFF3E0',
  },
  complianceMessageDanger: {
    backgroundColor: '#FFEBEE',
  },
  complianceMessageIcon: {
    fontSize: 24,
  },
  complianceMessageText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    lineHeight: 20,
  },
  medicationsCard: {
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
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  medIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medIconText: {
    fontSize: 20,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  medInstruction: {
    fontSize: 13,
    color: colors.textLight,
  },
  emptyMeds: {
    padding: 20,
    alignItems: 'center',
  },
  emptyMedsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  emptyMedsSubtext: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  weeklyCard: {
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
  weekItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  weekCompliance: {
    fontSize: 14,
    fontWeight: '700',
  },
  weekDots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  dayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  weekStats: {
    fontSize: 12,
    color: colors.textLight,
  },
  calendarCard: {
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
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  calendarDay: {
    width: '13%',
    alignItems: 'center',
  },
  calendarDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  calendarDayTaken: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  calendarDayMissed: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
  },
  calendarDayNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
  },
  calendarDayNumberTaken: {
    color: colors.success,
  },
  calendarDayTime: {
    fontSize: 9,
    color: colors.textLight,
    marginTop: 2,
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textLight,
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
});

export default MedicationTrackingScreen;
