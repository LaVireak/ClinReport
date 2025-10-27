/**
 * AIAnalysisService - AI-Powered Health Risk Assessment
 * 
 * Provides intelligent health risk analysis based on patient data
 * including vital signs, symptoms, medical history, and lifestyle factors.
 * 
 * Features:
 * - Risk level calculation (LOW, MEDIUM, HIGH)
 * - Symptom severity analysis
 * - Doctor/Hospital recommendations
 * - Location-based hospital suggestions
 * - Personalized health insights
 * 
 * Version: 2.0
 */

// Critical symptoms that require immediate attention
const CRITICAL_SYMPTOMS = [
  'chest pain',
  'severe chest pain',
  'difficulty breathing',
  'shortness of breath',
  'severe headache',
  'sudden numbness',
  'paralysis',
  'loss of consciousness',
  'seizure',
  'severe bleeding',
  'severe abdominal pain',
  'stroke symptoms',
  'heart attack',
  'unable to breathe',
  'choking',
  'severe allergic reaction',
];

// Warning symptoms that need medical attention soon
const WARNING_SYMPTOMS = [
  'persistent fever',
  'high fever',
  'chest discomfort',
  'irregular heartbeat',
  'dizziness',
  'confusion',
  'persistent headache',
  'severe pain',
  'blood in urine',
  'blood in stool',
  'persistent vomiting',
  'severe diarrhea',
  'rapid weight loss',
  'fainting',
];

// Phnom Penh Hospitals Database
const HOSPITALS = [
  {
    id: 1,
    name: 'Royal Phnom Penh Hospital',
    type: 'private',
    location: { lat: 11.5728, lng: 104.9058 },
    address: 'Street 214, Phnom Penh',
    phone: '+855 23 991 000',
    hasEmergency: true,
    departments: ['Emergency', 'Cardiology', 'Neurology', 'Surgery', 'ICU', 'All Specialties'],
    rating: 4.7,
    specialties: ['cardiology', 'neurology', 'surgery', 'emergency', 'pediatrics'],
  },
  {
    id: 2,
    name: 'Calmette Hospital',
    type: 'public',
    location: { lat: 11.5564, lng: 104.9282 },
    address: '3 Monivong Blvd, Phnom Penh',
    phone: '+855 23 426 948',
    hasEmergency: true,
    departments: ['Emergency', 'Cardiology', 'Surgery', 'Pediatrics', 'Internal Medicine'],
    rating: 4.2,
    specialties: ['cardiology', 'emergency', 'internal medicine'],
  },
  {
    id: 3,
    name: 'Khmer Soviet Friendship Hospital',
    type: 'public',
    location: { lat: 11.5496, lng: 104.9163 },
    address: 'Russian Federation Blvd, Phnom Penh',
    phone: '+855 23 885 102',
    hasEmergency: true,
    departments: ['Emergency', 'Pediatrics', 'Maternity', 'Surgery'],
    rating: 4.0,
    specialties: ['emergency', 'pediatrics', 'maternity'],
  },
  {
    id: 4,
    name: 'Sunrise Japan Hospital',
    type: 'private',
    location: { lat: 11.5641, lng: 104.8922 },
    address: 'Mao Tse Toung Blvd, Phnom Penh',
    phone: '+855 23 991 111',
    hasEmergency: true,
    departments: ['Emergency', 'Surgery', 'ICU', 'Cardiology', 'Orthopedics'],
    rating: 4.6,
    specialties: ['cardiology', 'surgery', 'orthopedics', 'emergency'],
  },
  {
    id: 5,
    name: 'Raffles Medical Phnom Penh',
    type: 'private',
    location: { lat: 11.5612, lng: 104.9128 },
    address: '161 Street 51, Phnom Penh',
    phone: '+855 23 216 911',
    hasEmergency: true,
    departments: ['General Practice', 'Cardiology', 'Pediatrics', 'Diagnostics'],
    rating: 4.5,
    specialties: ['general practice', 'cardiology', 'pediatrics'],
  },
];

// Doctors Database (including MeetDoctors partners)
const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Sokha Chan',
    specialty: 'Cardiology',
    hospital: 'Royal Phnom Penh Hospital',
    experience: '15 years',
    rating: 4.8,
    consultationFee: '$20',
    availability: 'online',
    languages: ['Khmer', 'English'],
    partnerId: 'meetdoctors',
  },
  {
    id: 2,
    name: 'Dr. Vannara Prum',
    specialty: 'Endocrinology',
    hospital: 'Royal Phnom Penh Hospital',
    experience: '12 years',
    rating: 4.7,
    consultationFee: '$20',
    availability: 'online',
    languages: ['Khmer', 'English'],
    partnerId: 'meetdoctors',
  },
  {
    id: 3,
    name: 'Dr. Sopheap Lim',
    specialty: 'Internal Medicine',
    hospital: 'Calmette Hospital',
    experience: '20 years',
    rating: 4.6,
    consultationFee: '$15',
    availability: 'hospital',
    languages: ['Khmer', 'English', 'French'],
    partnerId: null,
  },
  {
    id: 4,
    name: 'Dr. Chanthy Nguon',
    specialty: 'Emergency Medicine',
    hospital: 'Sunrise Japan Hospital',
    experience: '10 years',
    rating: 4.7,
    consultationFee: '$25',
    availability: 'emergency',
    languages: ['Khmer', 'English'],
    partnerId: null,
  },
  {
    id: 5,
    name: 'Dr. Sothea Kim',
    specialty: 'Neurology',
    hospital: 'Royal Phnom Penh Hospital',
    experience: '18 years',
    rating: 4.9,
    consultationFee: '$30',
    availability: 'online',
    languages: ['Khmer', 'English'],
    partnerId: 'meetdoctors',
  },
];

/**
 * Calculate risk score based on patient data
 * @param {Object} patientData - Patient health data
 * @returns {Object} Risk assessment with score and factors
 */
export function calculateRiskScore(patientData) {
  let score = 0;
  const factors = [];

  // 1. VITAL SIGNS ASSESSMENT (0-40 points)
  
  // Blood Pressure
  if (patientData.bloodPressure) {
    const [systolic, diastolic] = patientData.bloodPressure.split('/').map(Number);
    if (systolic >= 180 || diastolic >= 120) {
      score += 40;
      factors.push({ 
        name: 'Blood Pressure', 
        value: patientData.bloodPressure, 
        severity: 'critical',
        description: 'Hypertensive crisis - immediate attention needed'
      });
    } else if (systolic >= 160 || diastolic >= 100) {
      score += 30;
      factors.push({ 
        name: 'Blood Pressure', 
        value: patientData.bloodPressure, 
        severity: 'high',
        description: 'Stage 2 hypertension detected'
      });
    } else if (systolic >= 140 || diastolic >= 90) {
      score += 15;
      factors.push({ 
        name: 'Blood Pressure', 
        value: patientData.bloodPressure, 
        severity: 'moderate',
        description: 'Stage 1 hypertension - monitor closely'
      });
    } else if (systolic < 90 || diastolic < 60) {
      score += 20;
      factors.push({ 
        name: 'Blood Pressure', 
        value: patientData.bloodPressure, 
        severity: 'low',
        description: 'Hypotension detected - may cause dizziness'
      });
    }
  }

  // Heart Rate
  if (patientData.heartRate) {
    const hr = Number(patientData.heartRate);
    if (hr > 120 || hr < 40) {
      score += 25;
      factors.push({ 
        name: 'Heart Rate', 
        value: `${hr} bpm`, 
        severity: 'high',
        description: 'Abnormal heart rate detected'
      });
    } else if (hr > 100 || hr < 50) {
      score += 10;
      factors.push({ 
        name: 'Heart Rate', 
        value: `${hr} bpm`, 
        severity: 'moderate',
        description: 'Heart rate outside normal range'
      });
    }
  }

  // Temperature
  if (patientData.temperature) {
    const temp = Number(patientData.temperature);
    if (temp >= 39.5) {
      score += 25;
      factors.push({ 
        name: 'Temperature', 
        value: `${temp}°C`, 
        severity: 'high',
        description: 'High fever - medical attention needed'
      });
    } else if (temp >= 38.5) {
      score += 15;
      factors.push({ 
        name: 'Temperature', 
        value: `${temp}°C`, 
        severity: 'moderate',
        description: 'Moderate fever detected'
      });
    } else if (temp < 35) {
      score += 20;
      factors.push({ 
        name: 'Temperature', 
        value: `${temp}°C`, 
        severity: 'low',
        description: 'Hypothermia - seek medical attention'
      });
    }
  }

  // 2. SYMPTOM ASSESSMENT (0-40 points)
  if (patientData.symptoms) {
    const symptomsLower = patientData.symptoms.toLowerCase();
    
    // Check for critical symptoms
    const hasCritical = CRITICAL_SYMPTOMS.some(symptom => 
      symptomsLower.includes(symptom)
    );
    if (hasCritical) {
      score += 40;
      factors.push({ 
        name: 'Critical Symptoms', 
        value: 'Detected',
        severity: 'critical',
        description: 'Life-threatening symptoms reported - IMMEDIATE medical attention required'
      });
    } else {
      // Check for warning symptoms
      const hasWarning = WARNING_SYMPTOMS.some(symptom => 
        symptomsLower.includes(symptom)
      );
      if (hasWarning) {
        score += 25;
        factors.push({ 
          name: 'Warning Symptoms', 
          value: 'Detected',
          severity: 'high',
          description: 'Concerning symptoms - medical evaluation recommended'
        });
      }
    }
  }

  // 3. MEDICATION COMPLIANCE (0-20 points)
  if (patientData.medicationCompliance !== undefined) {
    const compliance = Number(patientData.medicationCompliance);
    if (compliance < 0.5) {
      score += 20;
      factors.push({ 
        name: 'Medication Compliance', 
        value: `${Math.round(compliance * 100)}%`, 
        severity: 'high',
        description: 'Poor medication compliance increases health risks'
      });
    } else if (compliance < 0.7) {
      score += 10;
      factors.push({ 
        name: 'Medication Compliance', 
        value: `${Math.round(compliance * 100)}%`, 
        severity: 'moderate',
        description: 'Medication compliance needs improvement'
      });
    }
  }

  // 4. LIFESTYLE FACTORS (0-15 points)
  
  // Smoking
  if (patientData.smoked === true) {
    score += 10;
    factors.push({ 
      name: 'Smoking', 
      value: 'Yes',
      severity: 'moderate',
      description: 'Smoking significantly increases health risks'
    });
  }

  // Exercise
  if (patientData.exerciseDuration !== undefined) {
    const exercise = Number(patientData.exerciseDuration);
    if (exercise === 0) {
      score += 5;
      factors.push({ 
        name: 'Physical Activity', 
        value: 'None',
        severity: 'low',
        description: 'Regular exercise recommended for better health'
      });
    }
  }

  // 5. AGE FACTOR (0-10 points)
  if (patientData.age) {
    const age = Number(patientData.age);
    if (age >= 65) {
      score += 10;
      factors.push({ 
        name: 'Age Factor', 
        value: `${age} years`,
        severity: 'moderate',
        description: 'Age increases health monitoring importance'
      });
    } else if (age >= 50) {
      score += 5;
      factors.push({ 
        name: 'Age Factor', 
        value: `${age} years`,
        severity: 'low',
        description: 'Regular health checkups recommended'
      });
    }
  }

  // Determine risk level based on total score
  let riskLevel = 'LOW';
  let urgency = 'routine';
  
  if (score >= 70) {
    riskLevel = 'HIGH';
    urgency = 'immediate';
  } else if (score >= 40) {
    riskLevel = 'MEDIUM';
    urgency = 'soon';
  }

  return { 
    score: Math.min(score, 100), 
    riskLevel, 
    urgency,
    factors 
  };
}

/**
 * Generate health insights based on patient data
 * @param {Object} patientData - Patient health data
 * @param {Object} riskAssessment - Risk assessment results
 * @returns {Array} Array of insight strings
 */
export function generateInsights(patientData, riskAssessment) {
  const insights = [];

  // Analyze each risk factor
  riskAssessment.factors.forEach(factor => {
    if (factor.severity === 'critical' || factor.severity === 'high') {
      insights.push(factor.description);
    }
  });

  // Positive insights for low-risk patients
  if (riskAssessment.riskLevel === 'LOW') {
    if (patientData.medicationTaken) {
      insights.push('✓ Excellent medication adherence - keep up the good work!');
    }
    if (patientData.bloodPressure) {
      const [systolic] = patientData.bloodPressure.split('/').map(Number);
      if (systolic < 120) {
        insights.push('✓ Blood pressure is well-controlled');
      }
    }
    if (patientData.exerciseDuration > 0) {
      insights.push('✓ Regular physical activity helps maintain good health');
    }
    if (!patientData.smoked) {
      insights.push('✓ Non-smoking lifestyle supports better health outcomes');
    }
  }

  // Add general insights
  if (insights.length === 0) {
    insights.push('Health data within acceptable ranges');
    insights.push('Continue monitoring vital signs regularly');
  }

  return insights;
}

/**
 * Generate personalized recommendations
 * @param {Object} patientData - Patient health data
 * @param {Object} riskAssessment - Risk assessment results
 * @returns {Array} Array of recommendation strings
 */
export function generateRecommendations(patientData, riskAssessment) {
  const recommendations = [];

  if (riskAssessment.riskLevel === 'HIGH') {
    recommendations.push('⚠️ URGENT: Seek immediate medical attention');
    recommendations.push('Visit the nearest emergency room or call emergency services');
    recommendations.push('Do not drive yourself - have someone take you or call an ambulance');
    
    // Check for critical symptoms
    const hasCriticalSymptom = riskAssessment.factors.some(f => f.severity === 'critical');
    if (hasCriticalSymptom) {
      recommendations.push('Alert your emergency contacts immediately');
    }
  } else if (riskAssessment.riskLevel === 'MEDIUM') {
    recommendations.push('⚠️ Schedule a doctor appointment within the next few days');
    recommendations.push('Monitor your symptoms closely');
    recommendations.push('Keep a record of any changes in your condition');
    
    // Specific recommendations based on factors
    riskAssessment.factors.forEach(factor => {
      if (factor.name === 'Blood Pressure' && factor.severity === 'moderate') {
        recommendations.push('Check blood pressure daily and record readings');
        recommendations.push('Reduce salt intake and avoid processed foods');
      }
      if (factor.name === 'Medication Compliance') {
        recommendations.push('Set daily reminders to take medications on time');
        recommendations.push('Use a pill organizer to track your medications');
      }
    });
  } else {
    // LOW risk recommendations
    recommendations.push('✓ Continue your current health management plan');
    recommendations.push('Maintain regular medication schedule');
    
    if (patientData.exerciseDuration === 0 || !patientData.exerciseDuration) {
      recommendations.push('Aim for at least 30 minutes of exercise daily');
    }
    
    recommendations.push('Schedule routine checkup with your doctor');
    recommendations.push('Monitor blood pressure weekly');
    
    if (patientData.waterIntake < 8) {
      recommendations.push('Increase water intake to 8 glasses per day');
    }
  }

  return recommendations;
}

/**
 * Find nearby hospitals based on patient location (mock implementation)
 * @param {Object} patientLocation - Patient's location {lat, lng}
 * @param {boolean} emergencyOnly - Filter for emergency services
 * @returns {Array} Array of nearby hospitals with distance
 */
export function findNearbyHospitals(patientLocation = null, emergencyOnly = false) {
  // Mock: In production, calculate actual distance using coordinates
  // For now, return hospitals with mock distances
  let hospitals = emergencyOnly 
    ? HOSPITALS.filter(h => h.hasEmergency)
    : HOSPITALS;

  // Add mock distances (in km)
  return hospitals.map(hospital => ({
    ...hospital,
    distance: (Math.random() * 10 + 1).toFixed(1), // Random 1-11 km
  })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
}

/**
 * Recommend doctors based on patient condition and symptoms
 * @param {Object} patientData - Patient health data
 * @param {string} riskLevel - Risk level (LOW, MEDIUM, HIGH)
 * @returns {Array} Array of recommended doctors
 */
export function recommendDoctors(patientData, riskLevel) {
  let recommendedDoctors = [];

  // Determine required specialty based on symptoms and condition
  let requiredSpecialty = null;

  if (patientData.symptoms) {
    const symptomsLower = patientData.symptoms.toLowerCase();
    
    if (symptomsLower.includes('chest') || symptomsLower.includes('heart')) {
      requiredSpecialty = 'Cardiology';
    } else if (symptomsLower.includes('head') || symptomsLower.includes('neurological')) {
      requiredSpecialty = 'Neurology';
    } else if (symptomsLower.includes('diabetes') || symptomsLower.includes('glucose')) {
      requiredSpecialty = 'Endocrinology';
    }
  }

  // Check patient's existing condition
  if (patientData.condition) {
    if (patientData.condition.toLowerCase().includes('hypertension') || 
        patientData.condition.toLowerCase().includes('heart')) {
      requiredSpecialty = 'Cardiology';
    } else if (patientData.condition.toLowerCase().includes('diabetes')) {
      requiredSpecialty = 'Endocrinology';
    }
  }

  // For HIGH risk, prioritize emergency doctors
  if (riskLevel === 'HIGH') {
    recommendedDoctors = DOCTORS.filter(d => d.specialty === 'Emergency Medicine');
    if (recommendedDoctors.length === 0) {
      recommendedDoctors = DOCTORS.filter(d => d.availability === 'emergency');
    }
  }

  // Filter by specialty if identified
  if (requiredSpecialty && recommendedDoctors.length === 0) {
    recommendedDoctors = DOCTORS.filter(d => d.specialty === requiredSpecialty);
  }

  // If no specific match, return online/available doctors
  if (recommendedDoctors.length === 0) {
    recommendedDoctors = DOCTORS.filter(d => d.availability === 'online');
  }

  // Sort by rating
  return recommendedDoctors
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3); // Return top 3
}

/**
 * Main function: Analyze patient health data and generate comprehensive assessment
 * @param {Object} patientData - Complete patient data including vitals, symptoms, history
 * @param {Object} patientLocation - Patient location for hospital recommendations
 * @returns {Object} Complete AI assessment
 */
export function analyzePatientHealth(patientData, patientLocation = null) {
  // Calculate risk score
  const riskAssessment = calculateRiskScore(patientData);
  
  // Generate insights
  const insights = generateInsights(patientData, riskAssessment);
  
  // Generate recommendations
  const recommendations = generateRecommendations(patientData, riskAssessment);
  
  // Determine if doctor visit is needed
  const needsDoctor = riskAssessment.riskLevel === 'HIGH' || riskAssessment.riskLevel === 'MEDIUM';
  
  // Get hospital recommendations
  let suggestedHospitals = [];
  if (riskAssessment.riskLevel === 'HIGH') {
    suggestedHospitals = findNearbyHospitals(patientLocation, true).slice(0, 3);
  } else if (riskAssessment.riskLevel === 'MEDIUM') {
    suggestedHospitals = findNearbyHospitals(patientLocation, false).slice(0, 2);
  }
  
  // Get doctor recommendations
  let suggestedDoctors = [];
  if (needsDoctor) {
    suggestedDoctors = recommendDoctors(patientData, riskAssessment.riskLevel);
  }
  
  // Build complete assessment
  return {
    riskLevel: riskAssessment.riskLevel,
    riskScore: riskAssessment.score,
    urgency: riskAssessment.urgency,
    factors: riskAssessment.factors,
    insights,
    recommendations,
    needsDoctor,
    suggestedDoctors,
    suggestedHospitals,
    assessmentDate: new Date().toISOString(),
  };
}

/**
 * Get all available hospitals
 * @returns {Array} All hospitals in database
 */
export function getAllHospitals() {
  return HOSPITALS;
}

/**
 * Get all available doctors
 * @returns {Array} All doctors in database
 */
export function getAllDoctors() {
  return DOCTORS;
}

/**
 * Get MeetDoctors partner doctors
 * @returns {Array} Doctors from MeetDoctors platform
 */
export function getMeetDoctorsPartners() {
  return DOCTORS.filter(d => d.partnerId === 'meetdoctors');
}

/**
 * Search hospitals by department/specialty
 * @param {string} specialty - Department or specialty to search for
 * @returns {Array} Matching hospitals
 */
export function searchHospitalsBySpecialty(specialty) {
  const specialtyLower = specialty.toLowerCase();
  return HOSPITALS.filter(hospital => 
    hospital.specialties.some(s => s.includes(specialtyLower)) ||
    hospital.departments.some(d => d.toLowerCase().includes(specialtyLower))
  );
}

/**
 * Search doctors by specialty
 * @param {string} specialty - Specialty to search for
 * @returns {Array} Matching doctors
 */
export function searchDoctorsBySpecialty(specialty) {
  return DOCTORS.filter(doctor => 
    doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
  );
}

export default {
  analyzePatientHealth,
  calculateRiskScore,
  generateInsights,
  generateRecommendations,
  findNearbyHospitals,
  recommendDoctors,
  getAllHospitals,
  getAllDoctors,
  getMeetDoctorsPartners,
  searchHospitalsBySpecialty,
  searchDoctorsBySpecialty,
  HOSPITALS,
  DOCTORS,
};
