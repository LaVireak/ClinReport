/**
 * AI Summary Service - Demo Version
 * 
 * This service analyzes patient data and medical records to provide:
 * - Risk assessment (LOW or HIGH)
 * - Summary of patient condition
 * - Recommendations based on risk level
 * 
 * Demo Mode: Simulates AI analysis without actual API calls
 */

/**
 * Analyze patient data and generate risk assessment summary
 * @param {Object} patientData - Patient information and medical data
 * @returns {Object} Risk assessment with summary and recommendations
 */
export const generateAISummary = (patientData) => {
  // Simulate AI analysis based on patient data
  const riskLevel = calculateRiskLevel(patientData);
  const summary = generateSummary(patientData, riskLevel);
  const recommendations = generateRecommendations(riskLevel);

  return {
    riskLevel,
    summary,
    recommendations,
    timestamp: new Date().toISOString(),
    patientId: patientData.id,
  };
};

/**
 * Calculate risk level based on patient data
 * @param {Object} patientData - Patient information
 * @returns {String} 'LOW' or 'HIGH'
 */
const calculateRiskLevel = (patientData) => {
  // Demo logic: Check various factors to determine risk
  let riskScore = 0;

  // Check vital signs
  if (patientData.bloodPressure) {
    const [systolic, diastolic] = patientData.bloodPressure.split('/').map(Number);
    if (systolic > 140 || diastolic > 90) riskScore += 2;
    else if (systolic > 130 || diastolic > 85) riskScore += 1;
  }

  if (patientData.heartRate) {
    const hr = parseInt(patientData.heartRate);
    if (hr > 100 || hr < 60) riskScore += 2;
    else if (hr > 90 || hr < 65) riskScore += 1;
  }

  if (patientData.temperature) {
    const temp = parseFloat(patientData.temperature);
    if (temp > 38.5 || temp < 36) riskScore += 2;
    else if (temp > 37.5) riskScore += 1;
  }

  // Check symptoms
  if (patientData.symptoms) {
    const symptoms = patientData.symptoms.toLowerCase();
    const highRiskSymptoms = ['chest pain', 'severe', 'difficulty breathing', 'bleeding', 'unconscious'];
    const hasHighRiskSymptom = highRiskSymptoms.some(s => symptoms.includes(s));
    if (hasHighRiskSymptom) riskScore += 3;
  }

  // Check medical history
  if (patientData.medicalHistory) {
    const history = patientData.medicalHistory.toLowerCase();
    const chronicConditions = ['diabetes', 'hypertension', 'heart disease', 'cancer'];
    const hasChronicCondition = chronicConditions.some(c => history.includes(c));
    if (hasChronicCondition) riskScore += 1;
  }

  // Determine risk level
  return riskScore >= 3 ? 'HIGH' : 'LOW';
};

/**
 * Generate summary based on patient data and risk level
 * @param {Object} patientData - Patient information
 * @param {String} riskLevel - 'LOW' or 'HIGH'
 * @returns {String} Summary text
 */
const generateSummary = (patientData, riskLevel) => {
  if (riskLevel === 'HIGH') {
    return `⚠️ HIGH RISK DETECTED

Patient: ${patientData.name || 'Unknown'}
Age: ${patientData.age || 'N/A'}

CRITICAL FINDINGS:
${generateCriticalFindings(patientData)}

VITAL SIGNS:
${generateVitalsSummary(patientData)}

RECOMMENDATION:
This patient requires immediate medical attention. The AI analysis has detected concerning patterns that need professional evaluation.

Please consult with a specialized doctor or visit the nearest hospital as soon as possible.`;
  } else {
    return `✅ LOW RISK ASSESSMENT

Patient: ${patientData.name || 'Unknown'}
Age: ${patientData.age || 'N/A'}

SUMMARY:
${generateLowRiskSummary(patientData)}

VITAL SIGNS:
${generateVitalsSummary(patientData)}

ASSESSMENT:
Based on the current data, the patient's condition appears stable. Continue monitoring and maintain healthy lifestyle practices.`;
  }
};

/**
 * Generate critical findings for high-risk patients
 */
const generateCriticalFindings = (patientData) => {
  const findings = [];

  if (patientData.bloodPressure) {
    const [systolic, diastolic] = patientData.bloodPressure.split('/').map(Number);
    if (systolic > 140 || diastolic > 90) {
      findings.push(`• Elevated blood pressure: ${patientData.bloodPressure} mmHg`);
    }
  }

  if (patientData.heartRate) {
    const hr = parseInt(patientData.heartRate);
    if (hr > 100 || hr < 60) {
      findings.push(`• Abnormal heart rate: ${patientData.heartRate} bpm`);
    }
  }

  if (patientData.symptoms) {
    findings.push(`• Reported symptoms: ${patientData.symptoms}`);
  }

  return findings.length > 0 ? findings.join('\n') : '• Multiple risk factors detected';
};

/**
 * Generate low-risk summary
 */
const generateLowRiskSummary = (patientData) => {
  const points = [];

  if (patientData.symptoms) {
    points.push(`Current symptoms: ${patientData.symptoms} (mild, manageable)`);
  } else {
    points.push('No concerning symptoms reported');
  }

  if (patientData.medicalHistory) {
    points.push(`Medical history noted: ${patientData.medicalHistory}`);
  }

  points.push('Overall health indicators within normal range');

  return points.join('\n');
};

/**
 * Generate vitals summary
 */
const generateVitalsSummary = (patientData) => {
  const vitals = [];

  if (patientData.bloodPressure) {
    vitals.push(`• Blood Pressure: ${patientData.bloodPressure} mmHg`);
  }

  if (patientData.heartRate) {
    vitals.push(`• Heart Rate: ${patientData.heartRate} bpm`);
  }

  if (patientData.temperature) {
    vitals.push(`• Temperature: ${patientData.temperature}°C`);
  }

  if (patientData.weight) {
    vitals.push(`• Weight: ${patientData.weight} kg`);
  }

  return vitals.length > 0 ? vitals.join('\n') : '• No vital signs recorded';
};

/**
 * Generate recommendations based on risk level
 */
const generateRecommendations = (riskLevel) => {
  if (riskLevel === 'HIGH') {
    return [
      '🏥 Seek immediate medical consultation',
      '📞 Contact specialized doctor or hospital',
      '🚨 Do not delay - this requires professional attention',
      '📋 Bring all medical records and test results',
      '💊 Continue current medications as prescribed',
    ];
  } else {
    return [
      '✅ Continue regular health monitoring',
      '💊 Take medications as prescribed',
      '🏃 Maintain regular exercise routine',
      '🥗 Follow healthy diet recommendations',
      '📅 Schedule routine check-up in 3-6 months',
      '😴 Ensure adequate sleep (7-8 hours)',
    ];
  }
};

/**
 * Get specialized doctor recommendation based on symptoms/condition
 */
export const getSpecializedDoctorRecommendation = (patientData) => {
  const symptoms = (patientData.symptoms || '').toLowerCase();
  const history = (patientData.medicalHistory || '').toLowerCase();

  // Demo doctor recommendations
  if (symptoms.includes('chest') || symptoms.includes('heart') || history.includes('heart')) {
    return {
      specialty: 'Cardiologist',
      reason: 'Heart and cardiovascular concerns',
      urgency: 'High',
    };
  }

  if (symptoms.includes('breathing') || symptoms.includes('lung') || history.includes('asthma')) {
    return {
      specialty: 'Pulmonologist',
      reason: 'Respiratory system concerns',
      urgency: 'High',
    };
  }

  if (symptoms.includes('diabetes') || history.includes('diabetes')) {
    return {
      specialty: 'Endocrinologist',
      reason: 'Diabetes and metabolic concerns',
      urgency: 'Medium',
    };
  }

  // Default recommendation
  return {
    specialty: 'General Practitioner',
    reason: 'General health assessment',
    urgency: 'Medium',
  };
};

/**
 * Get hospital recommendations for high-risk patients
 */
export const getHospitalRecommendations = () => {
  // Demo hospital data
  return [
    {
      name: 'Central Medical Center',
      distance: '2.3 km',
      rating: 4.5,
      specialties: ['Emergency Care', 'Cardiology', 'General Medicine'],
      emergency: true,
    },
    {
      name: 'City General Hospital',
      distance: '3.7 km',
      rating: 4.3,
      specialties: ['Emergency Care', 'Surgery', 'ICU'],
      emergency: true,
    },
    {
      name: 'Advanced Care Clinic',
      distance: '1.5 km',
      rating: 4.7,
      specialties: ['Specialist Consultation', 'Diagnostics'],
      emergency: false,
    },
  ];
};

export default {
  generateAISummary,
  getSpecializedDoctorRecommendation,
  getHospitalRecommendations,
};
