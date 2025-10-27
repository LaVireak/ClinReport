/**
 * AIAnalysisService - Usage Examples
 * 
 * This file demonstrates how to use the AI Analysis Service
 * in your React Native components.
 */

import AIAnalysisService from '../services/AIAnalysisService';
import { usePatientData } from '../context/PatientDataContext';

/**
 * Example 1: Analyze patient health data and get AI assessment
 */
export function exampleBasicAnalysis() {
  // Sample patient data
  const patientData = {
    age: 45,
    bloodPressure: '165/105',
    heartRate: 95,
    temperature: 37.2,
    symptoms: 'severe chest pain, difficulty breathing',
    medicationTaken: false,
    medicationCompliance: 0.6,
    smoked: false,
    exerciseDuration: 0,
    waterIntake: 4,
  };

  // Get AI assessment
  const assessment = AIAnalysisService.analyzePatientHealth(patientData);

  console.log('Risk Level:', assessment.riskLevel); // HIGH
  console.log('Risk Score:', assessment.riskScore); // 90+
  console.log('Urgency:', assessment.urgency); // immediate
  console.log('Insights:', assessment.insights);
  console.log('Recommendations:', assessment.recommendations);
  console.log('Suggested Hospitals:', assessment.suggestedHospitals);
  console.log('Suggested Doctors:', assessment.suggestedDoctors);

  return assessment;
}

/**
 * Example 2: Use in React component with PatientDataContext
 */
export function ExampleComponent() {
  const { getCurrentPatient, addAIAssessment } = usePatientData();
  
  const analyzeCurrentPatient = () => {
    const patient = getCurrentPatient();
    
    // Get latest daily log
    const latestLog = patient.dailyLogs?.[0];
    
    if (!latestLog) {
      console.log('No daily log data available');
      return;
    }
    
    // Prepare data for analysis
    const analysisData = {
      age: patient.age,
      bloodPressure: latestLog.bloodPressure,
      heartRate: latestLog.heartRate,
      temperature: latestLog.temperature,
      symptoms: latestLog.symptoms || '',
      medicationTaken: latestLog.medicationTaken,
      medicationCompliance: 0.85, // Calculate from history
      smoked: latestLog.smoked,
      exerciseDuration: latestLog.exerciseDuration || 0,
      waterIntake: latestLog.waterIntake || 0,
      condition: patient.condition,
    };
    
    // Get AI assessment
    const assessment = AIAnalysisService.analyzePatientHealth(analysisData);
    
    // Save assessment to context
    addAIAssessment(patient.id, assessment);
    
    // Return for UI display
    return assessment;
  };
  
  return { analyzeCurrentPatient };
}

/**
 * Example 3: Low Risk Scenario
 */
export function exampleLowRiskAnalysis() {
  const patientData = {
    age: 32,
    bloodPressure: '118/78',
    heartRate: 72,
    temperature: 36.8,
    symptoms: '',
    medicationTaken: true,
    medicationCompliance: 0.95,
    smoked: false,
    exerciseDuration: 45,
    waterIntake: 8,
  };

  const assessment = AIAnalysisService.analyzePatientHealth(patientData);

  console.log('Risk Level:', assessment.riskLevel); // LOW
  console.log('Risk Score:', assessment.riskScore); // ~20
  console.log('Insights:', assessment.insights);
  // Expected insights: positive feedback on good health habits
  
  return assessment;
}

/**
 * Example 4: Medium Risk Scenario
 */
export function exampleMediumRiskAnalysis() {
  const patientData = {
    age: 55,
    bloodPressure: '145/92',
    heartRate: 88,
    temperature: 37.8,
    symptoms: 'persistent headache',
    medicationTaken: false,
    medicationCompliance: 0.65,
    smoked: true,
    exerciseDuration: 0,
    waterIntake: 3,
  };

  const assessment = AIAnalysisService.analyzePatientHealth(patientData);

  console.log('Risk Level:', assessment.riskLevel); // MEDIUM
  console.log('Risk Score:', assessment.riskScore); // ~50
  console.log('Recommendations:', assessment.recommendations);
  // Expected: Schedule doctor appointment, improve compliance
  
  return assessment;
}

/**
 * Example 5: Search for hospitals by specialty
 */
export function exampleHospitalSearch() {
  // Search for cardiology departments
  const cardiologyHospitals = AIAnalysisService.searchHospitalsBySpecialty('cardiology');
  console.log('Cardiology Hospitals:', cardiologyHospitals);
  
  // Get all MeetDoctors partners
  const onlineDoctors = AIAnalysisService.getMeetDoctorsPartners();
  console.log('MeetDoctors Partners:', onlineDoctors);
  
  // Find nearby emergency hospitals
  const emergencyHospitals = AIAnalysisService.findNearbyHospitals(null, true);
  console.log('Emergency Hospitals:', emergencyHospitals);
  
  return { cardiologyHospitals, onlineDoctors, emergencyHospitals };
}

/**
 * Example 6: Get doctor recommendations based on condition
 */
export function exampleDoctorRecommendations() {
  const patientData = {
    condition: 'Hypertension',
    symptoms: 'chest discomfort',
    age: 45,
  };
  
  const doctors = AIAnalysisService.recommendDoctors(patientData, 'MEDIUM');
  console.log('Recommended Doctors:', doctors);
  // Expected: Cardiologists sorted by rating
  
  return doctors;
}

/**
 * Example 7: Complete flow - Daily health check with AI analysis
 */
export function exampleDailyHealthCheck() {
  const dailyLogData = {
    date: '2025-10-27',
    dataSource: 'self-reported',
    medicationTaken: true,
    medicationTime: '08:00 AM',
    smoked: false,
    bloodPressure: '128/84',
    heartRate: 78,
    weight: 75,
    temperature: 36.9,
    symptoms: 'feeling good',
    mood: 'good',
    waterIntake: 7,
    exerciseDuration: 30,
    notes: 'Morning walk completed',
  };
  
  // Analyze the daily data
  const assessment = AIAnalysisService.analyzePatientHealth({
    ...dailyLogData,
    age: 45,
    condition: 'Hypertension',
    medicationCompliance: 0.9,
  });
  
  console.log('=== Daily Health Check Results ===');
  console.log('Risk Level:', assessment.riskLevel);
  console.log('Health Score:', assessment.riskScore);
  console.log('\nInsights:');
  assessment.insights.forEach((insight, i) => {
    console.log(`${i + 1}. ${insight}`);
  });
  console.log('\nRecommendations:');
  assessment.recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });
  
  if (assessment.needsDoctor) {
    console.log('\n⚠️ Medical Consultation Recommended');
    console.log('Suggested Doctors:');
    assessment.suggestedDoctors.forEach(doctor => {
      console.log(`- ${doctor.name} (${doctor.specialty}) - ${doctor.hospital}`);
    });
  }
  
  return assessment;
}

// Export all examples
export default {
  exampleBasicAnalysis,
  exampleLowRiskAnalysis,
  exampleMediumRiskAnalysis,
  exampleHospitalSearch,
  exampleDoctorRecommendations,
  exampleDailyHealthCheck,
};
