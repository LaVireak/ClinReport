import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { PatientDataContext } from '../context/PatientDataContext';
import NotificationService from '../services/NotificationService';
import { colors } from '../styles/colors';

const NotificationSettingsScreen = ({ navigation }) => {
  const { patientProfile } = useContext(PatientDataContext);

  // Notification settings state
  const [settings, setSettings] = useState({
    dailyHealthReminder: true,
    healthTips: true,
    medicationReminders: true,
    highRiskAlerts: true,
    appointmentReminders: true,
  });

  // Time settings
  const [healthReminderTime, setHealthReminderTime] = useState({ hour: 9, minute: 0 });
  const [healthTipsTime, setHealthTipsTime] = useState({ hour: 20, minute: 0 });

  // Medication reminder settings
  const [medications, setMedications] = useState([]);

  // Stats
  const [notificationStats, setNotificationStats] = useState({ total: 0, byType: {} });

  useEffect(() => {
    loadNotificationStats();
  }, []);

  const loadNotificationStats = async () => {
    const stats = await NotificationService.getNotificationStats();
    setNotificationStats(stats);
  };

  const handleToggleSetting = async (key) => {
    const newValue = !settings[key];
    setSettings({ ...settings, [key]: newValue });

    if (newValue) {
      // Enable notification
      switch (key) {
        case 'dailyHealthReminder':
          await NotificationService.scheduleDailyHealthReminder(healthReminderTime);
          Alert.alert('Enabled', 'Daily health reminder has been enabled');
          break;
        case 'healthTips':
          await NotificationService.scheduleDailyHealthTips(healthTipsTime);
          Alert.alert('Enabled', 'Daily health tips have been enabled');
          break;
        case 'medicationReminders':
          if (medications.length > 0) {
            await NotificationService.scheduleMedicationReminders(medications);
            Alert.alert('Enabled', 'Medication reminders have been enabled');
          }
          break;
      }
    } else {
      // Disable notification
      switch (key) {
        case 'dailyHealthReminder':
          await NotificationService.cancelNotificationsByType('daily-health-reminder');
          Alert.alert('Disabled', 'Daily health reminder has been disabled');
          break;
        case 'healthTips':
          await NotificationService.cancelNotificationsByType('daily-health-tip');
          Alert.alert('Disabled', 'Daily health tips have been disabled');
          break;
        case 'medicationReminders':
          await NotificationService.cancelNotificationsByType('medication-reminder');
          Alert.alert('Disabled', 'Medication reminders have been disabled');
          break;
      }
    }

    await loadNotificationStats();
  };

  const handleUpdateHealthReminderTime = async () => {
    await NotificationService.scheduleDailyHealthReminder(healthReminderTime);
    Alert.alert('Updated', 'Daily health reminder time has been updated');
    await loadNotificationStats();
  };

  const handleUpdateHealthTipsTime = async () => {
    await NotificationService.scheduleDailyHealthTips(healthTipsTime);
    Alert.alert('Updated', 'Daily health tips time has been updated');
    await loadNotificationStats();
  };

  const handleTestNotification = async () => {
    await NotificationService.sendHealthTip({
      title: '💡 Test Notification',
      message: 'This is a test notification. Your notifications are working correctly!',
    });
    Alert.alert('Test Sent', 'Check your notification tray');
  };

  const handleSetupDefaults = async () => {
    Alert.alert(
      'Setup Default Notifications',
      'This will configure daily health reminders and health tips. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Setup',
          onPress: async () => {
            const success = await NotificationService.setupDefaultNotifications(medications);
            if (success) {
              Alert.alert('Success', 'Default notifications have been configured');
              setSettings({
                ...settings,
                dailyHealthReminder: true,
                healthTips: true,
              });
              await loadNotificationStats();
            } else {
              Alert.alert('Error', 'Failed to setup notifications. Please enable notifications in your device settings.');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Clear All Notifications',
      'This will cancel all scheduled notifications. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await NotificationService.cancelAllNotifications();
            setSettings({
              dailyHealthReminder: false,
              healthTips: false,
              medicationReminders: false,
              highRiskAlerts: false,
              appointmentReminders: false,
            });
            Alert.alert('Cleared', 'All notifications have been cancelled');
            await loadNotificationStats();
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
        <Text style={styles.headerTitle}>🔔 Notifications</Text>
        <Text style={styles.headerSubtitle}>Manage your notification preferences</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>📊 Active Notifications</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{notificationStats.total}</Text>
              <Text style={styles.statLabel}>Total Scheduled</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {notificationStats.byType['medication-reminder'] || 0}
              </Text>
              <Text style={styles.statLabel}>Medication</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {notificationStats.byType['daily-health-tip'] || 0}
              </Text>
              <Text style={styles.statLabel}>Health Tips</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>⚡ Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSetupDefaults}
            >
              <Text style={styles.actionButtonIcon}>🔧</Text>
              <Text style={styles.actionButtonText}>Setup Defaults</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleTestNotification}
            >
              <Text style={styles.actionButtonIcon}>🧪</Text>
              <Text style={styles.actionButtonText}>Test</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger]}
              onPress={handleClearAll}
            >
              <Text style={styles.actionButtonIcon}>🗑️</Text>
              <Text style={styles.actionButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>⚙️ Notification Settings</Text>

          {/* Daily Health Reminder */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📊</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Daily Health Reminder</Text>
                <Text style={styles.settingDescription}>
                  Remind me to log my daily health data
                </Text>
                {settings.dailyHealthReminder && (
                  <Text style={styles.settingTime}>
                    ⏰ {String(healthReminderTime.hour).padStart(2, '0')}:{String(healthReminderTime.minute).padStart(2, '0')}
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={settings.dailyHealthReminder}
              onValueChange={() => handleToggleSetting('dailyHealthReminder')}
              trackColor={{ false: colors.gray300, true: colors.primary + '80' }}
              thumbColor={settings.dailyHealthReminder ? colors.primary : colors.gray400}
            />
          </View>

          {/* Health Tips */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💡</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Daily Health Tips</Text>
                <Text style={styles.settingDescription}>
                  Receive daily health and wellness tips
                </Text>
                {settings.healthTips && (
                  <Text style={styles.settingTime}>
                    ⏰ {String(healthTipsTime.hour).padStart(2, '0')}:{String(healthTipsTime.minute).padStart(2, '0')}
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={settings.healthTips}
              onValueChange={() => handleToggleSetting('healthTips')}
              trackColor={{ false: colors.gray300, true: colors.primary + '80' }}
              thumbColor={settings.healthTips ? colors.primary : colors.gray400}
            />
          </View>

          {/* Medication Reminders */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💊</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Medication Reminders</Text>
                <Text style={styles.settingDescription}>
                  Remind me to take my medications
                </Text>
                {settings.medicationReminders && (
                  <Text style={styles.settingTime}>
                    {patientProfile.medications?.length || 0} medications
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={settings.medicationReminders}
              onValueChange={() => handleToggleSetting('medicationReminders')}
              trackColor={{ false: colors.gray300, true: colors.primary + '80' }}
              thumbColor={settings.medicationReminders ? colors.primary : colors.gray400}
            />
          </View>

          {/* High Risk Alerts */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⚠️</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>High Risk Alerts</Text>
                <Text style={styles.settingDescription}>
                  Alert me when AI detects high health risk
                </Text>
              </View>
            </View>
            <Switch
              value={settings.highRiskAlerts}
              onValueChange={() => handleToggleSetting('highRiskAlerts')}
              trackColor={{ false: colors.gray300, true: colors.primary + '80' }}
              thumbColor={settings.highRiskAlerts ? colors.primary : colors.gray400}
            />
          </View>

          {/* Appointment Reminders */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📅</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Appointment Reminders</Text>
                <Text style={styles.settingDescription}>
                  Remind me about upcoming appointments
                </Text>
              </View>
            </View>
            <Switch
              value={settings.appointmentReminders}
              onValueChange={() => handleToggleSetting('appointmentReminders')}
              trackColor={{ false: colors.gray300, true: colors.primary + '80' }}
              thumbColor={settings.appointmentReminders ? colors.primary : colors.gray400}
            />
          </View>
        </View>

        {/* Notification Types Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ Notification Types</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📊</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Daily Health Reminder:</Text> Daily prompt to log your health metrics
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💊</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Medication Reminders:</Text> Scheduled reminders for each medication
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Health Tips:</Text> Daily wellness advice and best practices
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⚠️</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>High Risk Alerts:</Text> Immediate alerts when AI detects concerning health data
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Appointment Reminders:</Text> Notifications 24 hours and 1 hour before appointments
            </Text>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  actionsCard: {
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
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonDanger: {
    backgroundColor: colors.error,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  settingsCard: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  settingIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
  settingTime: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '600',
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: colors.textDark,
  },
});

export default NotificationSettingsScreen;
