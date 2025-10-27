import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Switch } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { usePatientData } from '../context/PatientDataContext';
import AIAnalysisService from '../services/AIAnalysisService';
import { FadeInView, ScaleInView, SlideInView } from '../components/AnimatedView';

const PatientDashboard = ({ navigation }) => {
  const { getCurrentPatient, addDailyLog, addAIAssessment, getLatestAIAssessment, getMedicationCompliance } = usePatientData();
  const patientProfile = getCurrentPatient();

  // Use patient's daily logs from context
  const dailyLogs = patientProfile?.dailyLogs || [];
  const latestAIAssessment = getLatestAIAssessment(patientProfile?.id);

  const [modalVisible, setModalVisible] = useState(false);
  const [aiResultsVisible, setAiResultsVisible] = useState(false);
  const [currentAIAssessment, setCurrentAIAssessment] = useState(null);
  
  const [currentLog, setCurrentLog] = useState({
    dataSource: 'self-reported', // 'hospital' or 'self-reported'
    medicationTaken: false,
    medicationTime: '',
    smoked: false,
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    symptoms: '',
    mood: 'good',
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

    // Save daily log
    addDailyLog(patientProfile.id, currentLog);
    
    // Run AI analysis
    const medicationCompliance = getMedicationCompliance(patientProfile.id) / 100;
    const analysisData = {
      age: patientProfile.age,
      bloodPressure: currentLog.bloodPressure,
      heartRate: currentLog.heartRate ? Number(currentLog.heartRate) : undefined,
      temperature: currentLog.temperature ? Number(currentLog.temperature) : undefined,
      symptoms: currentLog.symptoms || '',
      medicationTaken: currentLog.medicationTaken,
      medicationCompliance: medicationCompliance,
      smoked: currentLog.smoked,
      exerciseDuration: currentLog.exerciseDuration ? Number(currentLog.exerciseDuration) : 0,
      waterIntake: currentLog.waterIntake ? Number(currentLog.waterIntake) : 0,
      condition: patientProfile.condition,
    };
    
    const aiAssessment = AIAnalysisService.analyzePatientHealth(analysisData);
    
    // Save AI assessment
    addAIAssessment(patientProfile.id, aiAssessment);
    setCurrentAIAssessment(aiAssessment);
    
    setModalVisible(false);
    
    // Reset form
    setCurrentLog({
      dataSource: 'self-reported',
      medicationTaken: false,
      medicationTime: '',
      smoked: false,
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      symptoms: '',
      mood: 'good',
      exerciseDuration: '',
      waterIntake: '',
      notes: '',
    });
    
    // Show AI results
    setAiResultsVisible(true);
  };

  const openLogForm = () => {
    const todayLog = getTodayLog();
    if (todayLog) {
      setCurrentLog({
        dataSource: todayLog.dataSource || 'self-reported',
        medicationTaken: todayLog.medicationTaken,
        medicationTime: todayLog.medicationTime,
        smoked: todayLog.smoked,
        bloodPressure: todayLog.bloodPressure || '',
        heartRate: todayLog.heartRate?.toString() || '',
        temperature: todayLog.temperature?.toString() || '',
        weight: todayLog.weight?.toString() || '',
        symptoms: todayLog.symptoms || '',
        mood: todayLog.mood || 'good',
        exerciseDuration: todayLog.exerciseDuration?.toString() || '',
        waterIntake: todayLog.waterIntake?.toString() || '',
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
      <FadeInView duration={600}>
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
      </FadeInView>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <ScaleInView delay={200}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statNumber}>{calculateStreak()}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </ScaleInView>
        <ScaleInView delay={300}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💊</Text>
            <Text style={styles.statNumber}>{dailyLogs.filter(l => l.medicationTaken).length}</Text>
            <Text style={styles.statLabel}>Medications</Text>
          </View>
        </ScaleInView>
        <ScaleInView delay={400}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statNumber}>{dailyLogs.length}</Text>
            <Text style={styles.statLabel}>Total Logs</Text>
          </View>
        </ScaleInView>
      </View>

      {/* AI Risk Assessment */}
      {latestAIAssessment && (
        <SlideInView delay={500}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Health Assessment</Text>
            <View style={[
              styles.aiCard,
              latestAIAssessment.riskLevel === 'HIGH' && styles.aiCardHigh,
              latestAIAssessment.riskLevel === 'MEDIUM' && styles.aiCardMedium,
              latestAIAssessment.riskLevel === 'LOW' && styles.aiCardLow,
            ]}>
              <View style={styles.aiHeader}>
                <View style={styles.aiRiskBadge}>
                  <Text style={styles.aiRiskLevel}>
                    {latestAIAssessment.riskLevel === 'HIGH' && '⚠️ HIGH RISK'}
                    {latestAIAssessment.riskLevel === 'MEDIUM' && '⚡ MEDIUM RISK'}
                    {latestAIAssessment.riskLevel === 'LOW' && '✅ LOW RISK'}
                  </Text>
                  <Text style={styles.aiRiskScore}>Score: {latestAIAssessment.riskScore}/100</Text>
              </View>
            </View>

            {/* Risk Factors */}
            {latestAIAssessment.factors && latestAIAssessment.factors.length > 0 && (
              <View style={styles.aiSection}>
                <Text style={styles.aiSubtitle}>📊 Risk Factors:</Text>
                {latestAIAssessment.factors.slice(0, 3).map((factor, index) => (
                  <View key={index} style={styles.aiFactorItem}>
                    <Text style={styles.aiFactorName}>• {factor.name}: </Text>
                    <Text style={styles.aiFactorValue}>{factor.value || factor.description}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Insights */}
            {latestAIAssessment.insights && latestAIAssessment.insights.length > 0 && (
              <View style={styles.aiSection}>
                <Text style={styles.aiSubtitle}>💡 Insights:</Text>
                {latestAIAssessment.insights.slice(0, 2).map((insight, index) => (
                  <Text key={index} style={styles.aiInsight}>• {insight}</Text>
                ))}
              </View>
            )}

            {/* Recommendations */}
            {latestAIAssessment.recommendations && latestAIAssessment.recommendations.length > 0 && (
              <View style={styles.aiSection}>
                <Text style={styles.aiSubtitle}>📝 Recommendations:</Text>
                {latestAIAssessment.recommendations.slice(0, 2).map((rec, index) => (
                  <Text key={index} style={styles.aiRecommendation}>• {rec}</Text>
                ))}
              </View>
            )}

            {/* Doctor Recommendations for High/Medium Risk */}
            {latestAIAssessment.needsDoctor && latestAIAssessment.suggestedDoctors && latestAIAssessment.suggestedDoctors.length > 0 && (
              <View style={styles.aiSection}>
                <Text style={styles.aiSubtitle}>👨‍⚕️ Recommended Doctors:</Text>
                {latestAIAssessment.suggestedDoctors.slice(0, 2).map((doctor, index) => (
                  <View key={index} style={styles.doctorCard}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.doctorInfo}>{doctor.specialty} - {doctor.hospital}</Text>
                    <Text style={styles.doctorRating}>⭐ {doctor.rating} | {doctor.consultationFee}</Text>
                    {doctor.availability === 'online' && (
                      <Text style={styles.doctorAvailable}>🟢 Available Online</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Hospital Recommendations for High Risk */}
            {latestAIAssessment.riskLevel === 'HIGH' && latestAIAssessment.suggestedHospitals && latestAIAssessment.suggestedHospitals.length > 0 && (
              <View style={styles.aiSection}>
                <Text style={styles.aiSubtitle}>🏥 Nearby Hospitals:</Text>
                {latestAIAssessment.suggestedHospitals.slice(0, 2).map((hospital, index) => (
                  <View key={index} style={styles.hospitalCard}>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <Text style={styles.hospitalInfo}>📍 {hospital.distance} km away</Text>
                    {hospital.hasEmergency && (
                      <Text style={styles.hospitalEmergency}>🚨 Emergency Services Available</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity 
              style={styles.aiViewMore}
              onPress={() => setAiResultsVisible(true)}
            >
              <Text style={styles.aiViewMoreText}>View Full Assessment →</Text>
            </TouchableOpacity>
          </View>
        </View>
        </SlideInView>
      )}

      {/* Today's Status */}
      <SlideInView delay={600}>
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
      </SlideInView>

      {/* Quick Access Features */}
      <SlideInView delay={700}>
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Quick Access</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('MapScreen')}
          >
            <Text style={styles.quickActionIcon}>🗺️</Text>
            <Text style={styles.quickActionTitle}>Find Nearby</Text>
            <Text style={styles.quickActionSubtitle}>Hospitals & Doctors</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('DoctorRecommendation')}
          >
            <Text style={styles.quickActionIcon}>👨‍⚕️</Text>
            <Text style={styles.quickActionTitle}>Find Doctor</Text>
            <Text style={styles.quickActionSubtitle}>AI Recommendations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Subscription')}
          >
            <Text style={styles.quickActionIcon}>💎</Text>
            <Text style={styles.quickActionTitle}>Subscription</Text>
            <Text style={styles.quickActionSubtitle}>Manage Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Emergency')}
          >
            <Text style={styles.quickActionIcon}>🚨</Text>
            <Text style={styles.quickActionTitle}>Emergency</Text>
            <Text style={styles.quickActionSubtitle}>Call 911</Text>
          </TouchableOpacity>
        </View>
      </View>
      </SlideInView>

      {/* Patient Info Card */}
      <SlideInView delay={800}>
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
      </SlideInView>

      {/* Activity History */}
      <SlideInView delay={900}>
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
      </SlideInView>

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

            {/* Data Source Toggle */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Data Source</Text>
              <View style={styles.dataSourceToggle}>
                <TouchableOpacity
                  style={[
                    styles.dataSourceButton,
                    currentLog.dataSource === 'hospital' && styles.dataSourceActive,
                  ]}
                  onPress={() => setCurrentLog({ ...currentLog, dataSource: 'hospital' })}
                >
                  <Text style={[
                    styles.dataSourceText,
                    currentLog.dataSource === 'hospital' && styles.dataSourceTextActive,
                  ]}>🏥 Hospital Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.dataSourceButton,
                    currentLog.dataSource === 'self' && styles.dataSourceActive,
                  ]}
                  onPress={() => setCurrentLog({ ...currentLog, dataSource: 'self' })}
                >
                  <Text style={[
                    styles.dataSourceText,
                    currentLog.dataSource === 'self' && styles.dataSourceTextActive,
                  ]}>📝 Self-Reported</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Vital Signs Section */}
            <Text style={styles.sectionHeader}>📊 Vital Signs</Text>

            {/* Heart Rate */}
            <TextInput
              style={styles.input}
              placeholder="Heart Rate (bpm, e.g., 72)"
              placeholderTextColor={colors.gray500}
              keyboardType="numeric"
              value={currentLog.heartRate}
              onChangeText={(text) => setCurrentLog({ ...currentLog, heartRate: text })}
            />

            {/* Blood Pressure */}
            <TextInput
              style={styles.input}
              placeholder="Blood Pressure (e.g., 120/80)"
              placeholderTextColor={colors.gray500}
              value={currentLog.bloodPressure}
              onChangeText={(text) => setCurrentLog({ ...currentLog, bloodPressure: text })}
            />

            {/* Temperature */}
            <TextInput
              style={styles.input}
              placeholder="Temperature (°C, e.g., 36.5)"
              placeholderTextColor={colors.gray500}
              keyboardType="numeric"
              value={currentLog.temperature}
              onChangeText={(text) => setCurrentLog({ ...currentLog, temperature: text })}
            />

            {/* Weight */}
            <TextInput
              style={styles.input}
              placeholder="Weight (kg, e.g., 65)"
              placeholderTextColor={colors.gray500}
              keyboardType="numeric"
              value={currentLog.weight}
              onChangeText={(text) => setCurrentLog({ ...currentLog, weight: text })}
            />

            {/* Symptoms */}
            <Text style={styles.sectionHeader}>🤒 Symptoms</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="List any symptoms (e.g., headache, fever, cough)"
              placeholderTextColor={colors.gray500}
              multiline
              numberOfLines={2}
              value={currentLog.symptoms}
              onChangeText={(text) => setCurrentLog({ ...currentLog, symptoms: text })}
            />

            {/* Mood */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>😊 How are you feeling?</Text>
              <View style={styles.moodButtons}>
                {['😄 Great', '😊 Good', '😐 Okay', '😔 Not Good', '😞 Poor'].map((mood) => (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.moodButton,
                      currentLog.mood === mood && styles.moodButtonActive,
                    ]}
                    onPress={() => setCurrentLog({ ...currentLog, mood })}
                  >
                    <Text style={[
                      styles.moodButtonText,
                      currentLog.mood === mood && styles.moodButtonTextActive,
                    ]}>{mood}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Medication Section */}
            <Text style={styles.sectionHeader}>💊 Medication</Text>
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

            {/* Lifestyle Section */}
            <Text style={styles.sectionHeader}>🏃 Lifestyle</Text>

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
            <Text style={styles.sectionHeader}>📝 Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any other notes or observations..."
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
                    dataSource: 'self',
                    heartRate: '',
                    temperature: '',
                    weight: '',
                    symptoms: '',
                    mood: '',
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

      {/* AI Results Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aiResultsVisible}
        onRequestClose={() => setAiResultsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.aiModalContent}>
            <View style={styles.aiModalHeader}>
              <Text style={styles.aiModalTitle}>🤖 AI Health Analysis</Text>
              <TouchableOpacity onPress={() => setAiResultsVisible(false)}>
                <Text style={styles.aiModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {latestAIAssessment && (
              <>
                {/* Risk Score */}
                <View style={[
                  styles.aiFullCard,
                  latestAIAssessment.riskLevel === 'HIGH' && styles.aiCardHigh,
                  latestAIAssessment.riskLevel === 'MEDIUM' && styles.aiCardMedium,
                  latestAIAssessment.riskLevel === 'LOW' && styles.aiCardLow,
                ]}>
                  <Text style={styles.aiFullRiskLevel}>
                    {latestAIAssessment.riskLevel === 'HIGH' && '⚠️ HIGH RISK'}
                    {latestAIAssessment.riskLevel === 'MEDIUM' && '⚡ MEDIUM RISK'}
                    {latestAIAssessment.riskLevel === 'LOW' && '✅ LOW RISK'}
                  </Text>
                  <Text style={styles.aiFullRiskScore}>
                    Risk Score: {latestAIAssessment.riskScore}/100
                  </Text>
                  <Text style={styles.aiAssessmentDate}>
                    Assessed: {new Date(latestAIAssessment.timestamp).toLocaleString()}
                  </Text>
                </View>

                {/* All Risk Factors */}
                {latestAIAssessment.factors && latestAIAssessment.factors.length > 0 && (
                  <View style={styles.aiFullSection}>
                    <Text style={styles.aiFullSectionTitle}>📊 Risk Factors</Text>
                    {latestAIAssessment.factors.map((factor, index) => (
                      <View key={index} style={styles.aiFullFactorItem}>
                        <Text style={styles.aiFullFactorName}>{factor.name}</Text>
                        <Text style={styles.aiFullFactorValue}>
                          {factor.value || factor.description}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* All Insights */}
                {latestAIAssessment.insights && latestAIAssessment.insights.length > 0 && (
                  <View style={styles.aiFullSection}>
                    <Text style={styles.aiFullSectionTitle}>💡 Health Insights</Text>
                    {latestAIAssessment.insights.map((insight, index) => (
                      <View key={index} style={styles.aiFullInsightItem}>
                        <Text style={styles.aiFullInsightText}>• {insight}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* All Recommendations */}
                {latestAIAssessment.recommendations && latestAIAssessment.recommendations.length > 0 && (
                  <View style={styles.aiFullSection}>
                    <Text style={styles.aiFullSectionTitle}>📝 Recommendations</Text>
                    {latestAIAssessment.recommendations.map((rec, index) => (
                      <View key={index} style={styles.aiFullRecItem}>
                        <Text style={styles.aiFullRecText}>• {rec}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Doctor Recommendations */}
                {latestAIAssessment.needsDoctor && latestAIAssessment.suggestedDoctors && latestAIAssessment.suggestedDoctors.length > 0 && (
                  <View style={styles.aiFullSection}>
                    <Text style={styles.aiFullSectionTitle}>👨‍⚕️ Recommended Doctors</Text>
                    {latestAIAssessment.suggestedDoctors.map((doctor, index) => (
                      <View key={index} style={styles.aiFullDoctorCard}>
                        <Text style={styles.aiFullDoctorName}>{doctor.name}</Text>
                        <Text style={styles.aiFullDoctorSpecialty}>{doctor.specialty}</Text>
                        <Text style={styles.aiFullDoctorHospital}>🏥 {doctor.hospital}</Text>
                        <Text style={styles.aiFullDoctorRating}>⭐ {doctor.rating}</Text>
                        <Text style={styles.aiFullDoctorFee}>{doctor.consultationFee}</Text>
                        {doctor.availability === 'online' && (
                          <Text style={styles.aiFullDoctorOnline}>🟢 Available Online Now</Text>
                        )}
                        {doctor.isMeetDoctorsPartner && (
                          <Text style={styles.aiFullDoctorPartner}>✨ MeetDoctors Partner</Text>
                        )}
                        <TouchableOpacity style={styles.aiContactButton}>
                          <Text style={styles.aiContactButtonText}>Contact Doctor</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* Hospital Recommendations */}
                {latestAIAssessment.suggestedHospitals && latestAIAssessment.suggestedHospitals.length > 0 && (
                  <View style={styles.aiFullSection}>
                    <Text style={styles.aiFullSectionTitle}>🏥 Nearby Hospitals</Text>
                    {latestAIAssessment.suggestedHospitals.map((hospital, index) => (
                      <View key={index} style={styles.aiFullHospitalCard}>
                        <Text style={styles.aiFullHospitalName}>{hospital.name}</Text>
                        <Text style={styles.aiFullHospitalAddress}>📍 {hospital.address}</Text>
                        <Text style={styles.aiFullHospitalDistance}>
                          {hospital.distance} km away
                        </Text>
                        {hospital.hasEmergency && (
                          <Text style={styles.aiFullHospitalEmergency}>
                            🚨 Emergency Services Available 24/7
                          </Text>
                        )}
                        <TouchableOpacity style={styles.aiContactButton}>
                          <Text style={styles.aiContactButtonText}>Get Directions</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* Warning for High Risk */}
                {latestAIAssessment.riskLevel === 'HIGH' && (
                  <View style={styles.aiWarningBox}>
                    <Text style={styles.aiWarningIcon}>⚠️</Text>
                    <Text style={styles.aiWarningText}>
                      Your health assessment indicates high risk. Please consult a healthcare professional as soon as possible.
                    </Text>
                  </View>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.aiModalCloseButton}
              onPress={() => setAiResultsVisible(false)}
            >
              <Text style={styles.aiModalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
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
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
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
  },
  todayStat: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
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
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  logDate: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textDark,
  },
  logBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  logBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
  },
  logDetails: {
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 24,
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
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gray300,
    marginHorizontal: 6,
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
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
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
  // AI Assessment Styles
  aiCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 18,
  },
  aiCardLow: {
    borderLeftColor: colors.success,
  },
  aiCardMedium: {
    borderLeftColor: '#FFA500',
  },
  aiCardHigh: {
    borderLeftColor: colors.error,
  },
  aiHeader: {
    marginBottom: 16,
  },
  aiRiskBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiRiskLevel: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    letterSpacing: 0.3,
  },
  aiRiskScore: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  aiSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  aiSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 10,
  },
  aiFactorItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  aiFactorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  aiFactorValue: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
  },
  aiInsight: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 6,
    lineHeight: 20,
  },
  aiRecommendation: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 6,
    lineHeight: 20,
  },
  doctorCard: {
    backgroundColor: colors.gray50,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
  },
  doctorInfo: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 3,
  },
  doctorRating: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 6,
  },
  doctorAvailable: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    marginTop: 6,
  },
  hospitalCard: {
    backgroundColor: colors.gray50,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  hospitalInfo: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  hospitalEmergency: {
    fontSize: 11,
    color: colors.error,
    fontWeight: '600',
    marginTop: 4,
  },
  aiViewMore: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    alignItems: 'center',
  },
  aiViewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  // Data Source Toggle
  dataSourceToggle: {
    flexDirection: 'row',
    marginTop: 8,
  },
  dataSourceButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  dataSourceActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dataSourceText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  dataSourceTextActive: {
    color: colors.white,
  },
  // Section Headers in Form
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  // Mood Buttons
  moodButtons: {
    flexDirection: 'column',
    marginTop: 8,
  },
  moodButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  moodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  moodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
  },
  moodButtonTextActive: {
    color: colors.white,
  },
  // AI Results Modal
  aiModalContent: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: 20,
    marginTop: 60,
    padding: 20,
  },
  aiModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  aiModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  aiModalClose: {
    fontSize: 24,
    color: colors.textLight,
    fontWeight: '600',
  },
  aiFullCard: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 16,
    backgroundColor: colors.gray50,
  },
  aiFullRiskLevel: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  aiFullRiskScore: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  aiAssessmentDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  aiFullSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  aiFullSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  aiFullFactorItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  aiFullFactorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  aiFullFactorValue: {
    fontSize: 13,
    color: colors.textLight,
  },
  aiFullInsightItem: {
    marginBottom: 8,
  },
  aiFullInsightText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  aiFullRecItem: {
    marginBottom: 8,
  },
  aiFullRecText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  aiFullDoctorCard: {
    backgroundColor: colors.gray50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  aiFullDoctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  aiFullDoctorSpecialty: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  aiFullDoctorHospital: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 2,
  },
  aiFullDoctorRating: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 2,
  },
  aiFullDoctorFee: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 8,
  },
  aiFullDoctorOnline: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    marginTop: 4,
  },
  aiFullDoctorPartner: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  aiContactButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  aiContactButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  aiFullHospitalCard: {
    backgroundColor: colors.gray50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  aiFullHospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  aiFullHospitalAddress: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 2,
  },
  aiFullHospitalDistance: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  aiFullHospitalEmergency: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  aiWarningBox: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  aiWarningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  aiWarningText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    fontWeight: '600',
    lineHeight: 20,
  },
  aiModalCloseButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  aiModalCloseButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  // Quick Actions Styles
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default PatientDashboard;
