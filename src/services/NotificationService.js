import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * NotificationService - Manages all app notifications
 * 
 * Features:
 * - Daily health data reminders
 * - Medication reminders
 * - Health tips notifications
 * - High risk health alerts
 * - Appointment reminders
 */

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  /**
   * Request notification permissions
   */
  static async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        await Notifications.setNotificationChannelAsync('medication', {
          name: 'Medication Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('health', {
          name: 'Health Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 500, 250, 500],
          sound: 'default',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedule daily health data reminder
   * @param {Object} config - { hour: 9, minute: 0 }
   */
  static async scheduleDailyHealthReminder(config = { hour: 9, minute: 0 }) {
    try {
      // Cancel existing reminder
      await this.cancelNotificationsByIdentifier('daily-health-reminder');

      // Schedule new notification
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📊 Daily Health Check',
          body: 'Time to log your daily health data. It only takes a minute!',
          data: { type: 'daily-health-reminder' },
          sound: 'default',
        },
        trigger: {
          hour: config.hour,
          minute: config.minute,
          repeats: true,
        },
      });

      console.log('Daily health reminder scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error scheduling daily health reminder:', error);
      return null;
    }
  }

  /**
   * Schedule medication reminder
   * @param {Object} medication - { name, time (HH:MM), days (array) }
   */
  static async scheduleMedicationReminder(medication) {
    try {
      const { name, time, days = [1, 2, 3, 4, 5, 6, 7] } = medication;
      const [hour, minute] = time.split(':').map(Number);

      // Create notification for each selected day
      const identifiers = [];
      
      for (const weekday of days) {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: '💊 Medication Reminder',
            body: `Time to take your ${name}`,
            data: { 
              type: 'medication-reminder',
              medicationName: name,
            },
            sound: 'default',
            channelId: 'medication',
          },
          trigger: {
            hour,
            minute,
            weekday,
            repeats: true,
          },
        });
        identifiers.push(identifier);
      }

      console.log(`Medication reminders scheduled for ${name}:`, identifiers);
      return identifiers;
    } catch (error) {
      console.error('Error scheduling medication reminder:', error);
      return [];
    }
  }

  /**
   * Schedule multiple medication reminders
   * @param {Array} medications - Array of medication objects
   */
  static async scheduleMedicationReminders(medications) {
    try {
      // Cancel all existing medication reminders
      await this.cancelNotificationsByType('medication-reminder');

      const allIdentifiers = [];
      for (const med of medications) {
        const identifiers = await this.scheduleMedicationReminder(med);
        allIdentifiers.push(...identifiers);
      }

      return allIdentifiers;
    } catch (error) {
      console.error('Error scheduling medication reminders:', error);
      return [];
    }
  }

  /**
   * Send immediate health tip notification
   * @param {Object} tip - { title, message }
   */
  static async sendHealthTip(tip) {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: tip.title || '💡 Health Tip',
          body: tip.message,
          data: { type: 'health-tip' },
          sound: 'default',
        },
        trigger: null, // Send immediately
      });

      return identifier;
    } catch (error) {
      console.error('Error sending health tip:', error);
      return null;
    }
  }

  /**
   * Schedule daily health tips
   * @param {Object} config - { hour: 20, minute: 0 }
   */
  static async scheduleDailyHealthTips(config = { hour: 20, minute: 0 }) {
    try {
      // Cancel existing health tips
      await this.cancelNotificationsByIdentifier('daily-health-tip');

      const healthTips = [
        'Drink at least 8 glasses of water daily for optimal health.',
        'Aim for 7-9 hours of sleep each night for better recovery.',
        'Take a 5-minute walk every hour if you work at a desk.',
        'Include fruits and vegetables in every meal.',
        'Practice deep breathing for 5 minutes to reduce stress.',
        'Wash your hands regularly to prevent infections.',
        'Limit screen time before bed for better sleep quality.',
      ];

      // Schedule a rotating health tip for each day
      const identifiers = [];
      for (let i = 0; i < 7; i++) {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: '💡 Daily Health Tip',
            body: healthTips[i % healthTips.length],
            data: { type: 'daily-health-tip' },
            sound: 'default',
          },
          trigger: {
            hour: config.hour,
            minute: config.minute,
            weekday: i + 1,
            repeats: true,
          },
        });
        identifiers.push(identifier);
      }

      console.log('Daily health tips scheduled:', identifiers);
      return identifiers;
    } catch (error) {
      console.error('Error scheduling daily health tips:', error);
      return [];
    }
  }

  /**
   * Send high risk alert notification
   * @param {Object} riskData - { level, score, message }
   */
  static async sendHighRiskAlert(riskData) {
    try {
      const { level, score, message } = riskData;

      if (level !== 'HIGH') {
        return null; // Only send for high risk
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ High Risk Alert',
          body: message || `Your health risk score is ${score}. Please consult a doctor soon.`,
          data: { 
            type: 'high-risk-alert',
            riskLevel: level,
            riskScore: score,
          },
          sound: 'default',
          channelId: 'health',
        },
        trigger: null, // Send immediately
      });

      return identifier;
    } catch (error) {
      console.error('Error sending high risk alert:', error);
      return null;
    }
  }

  /**
   * Schedule appointment reminder
   * @param {Object} appointment - { title, datetime, hospitalName }
   */
  static async scheduleAppointmentReminder(appointment) {
    try {
      const { title, datetime, hospitalName } = appointment;
      const appointmentDate = new Date(datetime);

      // Schedule reminder 24 hours before
      const reminder24h = new Date(appointmentDate);
      reminder24h.setHours(reminder24h.getHours() - 24);

      const identifier24h = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📅 Appointment Tomorrow',
          body: `${title} at ${hospitalName}`,
          data: { 
            type: 'appointment-reminder',
            appointmentId: appointment.id,
          },
          sound: 'default',
        },
        trigger: reminder24h,
      });

      // Schedule reminder 1 hour before
      const reminder1h = new Date(appointmentDate);
      reminder1h.setHours(reminder1h.getHours() - 1);

      const identifier1h = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📅 Appointment in 1 Hour',
          body: `${title} at ${hospitalName}`,
          data: { 
            type: 'appointment-reminder',
            appointmentId: appointment.id,
          },
          sound: 'default',
        },
        trigger: reminder1h,
      });

      console.log('Appointment reminders scheduled:', [identifier24h, identifier1h]);
      return [identifier24h, identifier1h];
    } catch (error) {
      console.error('Error scheduling appointment reminder:', error);
      return [];
    }
  }

  /**
   * Send missed medication notification
   * @param {string} medicationName
   */
  static async sendMissedMedicationAlert(medicationName) {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ Missed Medication',
          body: `You haven't logged ${medicationName} today. Don't forget to take it!`,
          data: { 
            type: 'missed-medication',
            medicationName,
          },
          sound: 'default',
          channelId: 'medication',
        },
        trigger: null, // Send immediately
      });

      return identifier;
    } catch (error) {
      console.error('Error sending missed medication alert:', error);
      return null;
    }
  }

  /**
   * Send wellness check notification
   */
  static async sendWellnessCheck() {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌟 Wellness Check',
          body: 'How are you feeling today? Update your health status.',
          data: { type: 'wellness-check' },
          sound: 'default',
        },
        trigger: null,
      });

      return identifier;
    } catch (error) {
      console.error('Error sending wellness check:', error);
      return null;
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
      return true;
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      return false;
    }
  }

  /**
   * Cancel notifications by identifier
   * @param {string} identifier
   */
  static async cancelNotificationsByIdentifier(identifier) {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const toCancel = scheduled
        .filter(n => n.identifier === identifier)
        .map(n => n.identifier);

      for (const id of toCancel) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }

      console.log(`Cancelled ${toCancel.length} notifications with identifier: ${identifier}`);
      return true;
    } catch (error) {
      console.error('Error cancelling notifications by identifier:', error);
      return false;
    }
  }

  /**
   * Cancel notifications by type
   * @param {string} type
   */
  static async cancelNotificationsByType(type) {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const toCancel = scheduled
        .filter(n => n.content?.data?.type === type)
        .map(n => n.identifier);

      for (const id of toCancel) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }

      console.log(`Cancelled ${toCancel.length} notifications of type: ${type}`);
      return true;
    } catch (error) {
      console.error('Error cancelling notifications by type:', error);
      return false;
    }
  }

  /**
   * Get all scheduled notifications
   */
  static async getAllScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Add notification listener
   * @param {Function} callback
   */
  static addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Add notification response listener (when user taps notification)
   * @param {Function} callback
   */
  static addNotificationResponseReceivedListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Remove notification listener
   * @param {Object} subscription
   */
  static removeNotificationSubscription(subscription) {
    Notifications.removeNotificationSubscription(subscription);
  }

  /**
   * Setup default notification schedule
   * Includes daily health reminder, health tips, and medication reminders
   */
  static async setupDefaultNotifications(medications = []) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Notification permissions not granted');
        return false;
      }

      // Schedule daily health data reminder (9:00 AM)
      await this.scheduleDailyHealthReminder({ hour: 9, minute: 0 });

      // Schedule daily health tips (8:00 PM)
      await this.scheduleDailyHealthTips({ hour: 20, minute: 0 });

      // Schedule medication reminders if provided
      if (medications.length > 0) {
        await this.scheduleMedicationReminders(medications);
      }

      console.log('Default notifications setup complete');
      return true;
    } catch (error) {
      console.error('Error setting up default notifications:', error);
      return false;
    }
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats() {
    try {
      const scheduled = await this.getAllScheduledNotifications();
      
      const stats = {
        total: scheduled.length,
        byType: {},
      };

      scheduled.forEach(notification => {
        const type = notification.content?.data?.type || 'unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return { total: 0, byType: {} };
    }
  }
}

export default NotificationService;
