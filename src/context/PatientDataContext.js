import React, { createContext, useState, useContext } from 'react';

/**
 * PatientDataContext - Enhanced v2.0
 * 
 * Comprehensive patient data management with AI-powered health tracking
 * 
 * NEW FEATURES:
 * - Medical History: Track hospital visits, diagnoses, treatments
 * - Disease History: Monitor disease progression and status
 * - AI Risk Assessments: Store AI-generated health risk analyses
 * - Emergency Contacts: Manage emergency contact information
 * - Medication Schedule: Track medication timing and compliance
 * - Sleep Logs: Monitor sleep patterns and quality
 * - Exercise Logs: Track physical activity and fitness
 * - Enhanced Daily Logs: Hospital data vs self-reported symptoms
 * - Analytics: Medication compliance, health scores
 * 
 * USAGE:
 * Import { usePatientData } from './context/PatientDataContext'
 * const { patients, addMedicalHistory, addAIAssessment, ... } = usePatientData();
 */

// Create the context
export const PatientDataContext = createContext();

// Sample initial data
const initialPatients = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    bloodType: 'O+',
    condition: 'Hypertension',
    lastVisit: '2025-10-20',
    nextAppointment: '2025-11-05',
    medications: ['Lisinopril 10mg', 'Aspirin 81mg'],
    notes: 'Monitor blood pressure daily',
    assignedDoctor: 'Dr. Sokha Chan',
    
    // NEW: Medical History
    medicalHistory: [
      {
        id: 1,
        date: '2025-01-15',
        diagnosis: 'Hypertension',
        hospital: 'Calmette Hospital',
        doctor: 'Dr. Sokha Chan',
        treatment: 'Prescribed Lisinopril 10mg daily',
        notes: 'Blood pressure reading: 150/95. Patient advised to reduce salt intake.',
        dataSource: 'hospital', // 'hospital' or 'self-reported'
      },
      {
        id: 2,
        date: '2025-06-10',
        diagnosis: 'Routine Checkup',
        hospital: 'Royal Phnom Penh Hospital',
        doctor: 'Dr. Sokha Chan',
        treatment: 'Continue current medication, added Aspirin',
        notes: 'Blood pressure improved: 130/85. Good medication compliance.',
        dataSource: 'hospital',
      },
    ],
    
    // NEW: Disease History
    diseaseHistory: [
      {
        id: 1,
        disease: 'Hypertension',
        diagnosedDate: '2025-01-15',
        status: 'ongoing', // 'ongoing', 'resolved', 'chronic'
        severity: 'moderate', // 'mild', 'moderate', 'severe'
        notes: 'Under control with medication',
      },
    ],
    
    // NEW: AI Risk Assessments
    aiAssessments: [
      {
        id: 1,
        date: '2025-10-24',
        riskLevel: 'LOW', // 'LOW', 'MEDIUM', 'HIGH'
        riskScore: 35, // 0-100
        factors: [
          { name: 'Blood Pressure', value: '120/80', severity: 'normal' },
          { name: 'Medication Compliance', value: '95%', severity: 'good' },
        ],
        insights: [
          'Blood pressure within normal range',
          'Excellent medication compliance',
          'Regular exercise pattern detected',
        ],
        recommendations: [
          'Continue current medication regimen',
          'Maintain regular exercise routine',
          'Monitor blood pressure weekly',
        ],
        needsDoctor: false,
        urgency: 'routine', // 'routine', 'soon', 'immediate'
        suggestedDoctors: [],
        suggestedHospitals: [],
      },
    ],
    
    // NEW: Emergency Contacts
    emergencyContacts: [
      { 
        id: 1,
        name: 'Jane Doe', 
        relation: 'Spouse', 
        phone: '+855123456789',
        isPrimary: true,
      },
    ],
    
    // NEW: Medication Schedule
    medicationSchedule: [
      { 
        id: 1,
        medication: 'Lisinopril 10mg', 
        dosage: '10mg',
        frequency: 'daily', // 'daily', 'twice-daily', 'weekly', etc.
        time: '08:00 AM',
        withFood: false,
        notes: 'Take in the morning',
      },
      { 
        id: 2,
        medication: 'Aspirin 81mg', 
        dosage: '81mg',
        frequency: 'daily',
        time: '08:00 AM',
        withFood: true,
        notes: 'Take with breakfast',
      },
    ],
    
    // NEW: Sleep Logs
    sleepLogs: [
      { 
        id: 1,
        date: '2025-10-24', 
        duration: 7.5, // hours
        quality: 'good', // 'poor', 'fair', 'good', 'excellent'
        bedTime: '22:30',
        wakeTime: '06:00',
        notes: 'Slept well',
      },
      { 
        id: 2,
        date: '2025-10-23', 
        duration: 6.5,
        quality: 'fair',
        bedTime: '23:15',
        wakeTime: '05:45',
        notes: 'Woke up once during night',
      },
    ],
    
    // NEW: Exercise Logs
    exerciseLogs: [
      { 
        id: 1,
        date: '2025-10-24', 
        type: 'Walking', // 'Walking', 'Running', 'Cycling', 'Gym', etc.
        duration: 30, // minutes
        intensity: 'moderate', // 'light', 'moderate', 'vigorous'
        notes: 'Morning walk in park',
      },
      { 
        id: 2,
        date: '2025-10-23', 
        type: 'Cycling',
        duration: 45,
        intensity: 'moderate',
        notes: 'Evening ride',
      },
    ],
    
    // ENHANCED: Daily Logs with more fields
    dailyLogs: [
      {
        id: 1,
        date: '2025-10-24',
        dataSource: 'self-reported', // 'hospital' or 'self-reported'
        medicationTaken: true,
        medicationTime: '08:00 AM',
        smoked: false,
        bloodPressure: '120/80',
        heartRate: 72,
        weight: 75, // kg
        temperature: 36.5, // celsius
        symptoms: 'I have a mild headache and slight fatigue', // Free text for symptoms
        mood: 'good', // 'poor', 'fair', 'good', 'excellent'
        waterIntake: 8, // glasses
        exerciseDuration: 30, // minutes
        notes: 'Feeling good today',
      },
      {
        id: 2,
        date: '2025-10-23',
        dataSource: 'self-reported',
        medicationTaken: true,
        medicationTime: '08:15 AM',
        smoked: false,
        bloodPressure: '122/82',
        heartRate: 75,
        symptoms: 'Slight headache',
        mood: 'fair',
        waterIntake: 6,
        notes: 'Slight headache in evening',
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    bloodType: 'A+',
    condition: 'Diabetes Type 2',
    lastVisit: '2025-10-18',
    nextAppointment: '2025-10-30',
    medications: ['Metformin 500mg', 'Insulin'],
    notes: 'Check glucose levels before meals',
    assignedDoctor: 'Dr. Vannara Prum',
    
    // NEW: Medical History
    medicalHistory: [
      {
        id: 1,
        date: '2024-05-20',
        diagnosis: 'Diabetes Type 2',
        hospital: 'Royal Phnom Penh Hospital',
        doctor: 'Dr. Vannara Prum',
        treatment: 'Prescribed Metformin, insulin therapy',
        notes: 'Glucose level: 180 mg/dL. Started medication and diet plan.',
        dataSource: 'hospital',
      },
    ],
    
    // NEW: Disease History
    diseaseHistory: [
      {
        id: 1,
        disease: 'Diabetes Type 2',
        diagnosedDate: '2024-05-20',
        status: 'ongoing',
        severity: 'moderate',
        notes: 'Managing with medication and diet',
      },
    ],
    
    // NEW: AI Assessments
    aiAssessments: [],
    
    // NEW: Emergency Contacts
    emergencyContacts: [
      { 
        id: 1,
        name: 'Robert Smith', 
        relation: 'Brother', 
        phone: '+855987654321',
        isPrimary: true,
      },
    ],
    
    // NEW: Medication Schedule
    medicationSchedule: [
      { 
        id: 1,
        medication: 'Metformin 500mg', 
        dosage: '500mg',
        frequency: 'twice-daily',
        time: '08:00 AM, 08:00 PM',
        withFood: true,
        notes: 'Take with meals',
      },
    ],
    
    // NEW: Sleep Logs
    sleepLogs: [],
    
    // NEW: Exercise Logs
    exerciseLogs: [],
    
    // ENHANCED: Daily Logs
    dailyLogs: [],
  },
  {
    id: 3,
    name: 'Michael Chen',
    age: 58,
    gender: 'Male',
    bloodType: 'B+',
    condition: 'Hypertension and Heart Disease',
    lastVisit: '2025-10-25',
    nextAppointment: '2025-10-31',
    medications: ['Amlodipine 10mg', 'Atorvastatin 40mg', 'Aspirin 81mg'],
    notes: 'Monitor blood pressure closely. Report chest pain immediately.',
    assignedDoctor: 'Dr. Cardio Specialist',
    
    // NEW: Medical History
    medicalHistory: [
      {
        id: 1,
        date: '2024-03-10',
        diagnosis: 'Hypertension Stage 2',
        hospital: 'Cardiology Center',
        doctor: 'Dr. Cardio Specialist',
        treatment: 'Started on Amlodipine and lifestyle modifications',
        notes: 'Blood pressure: 165/98. High cardiovascular risk.',
        dataSource: 'hospital',
      },
    ],
    
    // NEW: Disease History
    diseaseHistory: [
      {
        id: 1,
        disease: 'Hypertension',
        diagnosedDate: '2024-03-10',
        status: 'ongoing',
        severity: 'severe',
        notes: 'Requires careful monitoring',
      },
    ],
    
    // NEW: AI Assessments
    aiAssessments: [],
    
    // NEW: Emergency Contacts
    emergencyContacts: [
      { 
        id: 1,
        name: 'Susan Chen', 
        relation: 'Wife', 
        phone: '+855555111222',
        isPrimary: true,
      },
    ],
    
    // NEW: Medication Schedule
    medicationSchedule: [
      { 
        id: 1,
        medication: 'Amlodipine 10mg', 
        dosage: '10mg',
        frequency: 'daily',
        time: '08:00 AM',
        withFood: false,
        notes: 'For blood pressure control',
      },
      { 
        id: 2,
        medication: 'Atorvastatin 40mg', 
        dosage: '40mg',
        frequency: 'daily',
        time: '20:00 PM',
        withFood: false,
        notes: 'For cholesterol management',
      },
    ],
    
    // NEW: Sleep Logs
    sleepLogs: [],
    
    // NEW: Exercise Logs
    exerciseLogs: [],
    
    // ENHANCED: Daily Logs with HIGH RISK vitals
    dailyLogs: [
      {
        id: 1,
        date: '2025-10-29',
        dataSource: 'self-reported',
        medicationTaken: true,
        medicationTime: '08:00 AM',
        smoked: false,
        bloodPressure: '165/98', // HIGH RISK
        heartRate: 110, // HIGH RISK
        weight: 92,
        temperature: 37.2,
        symptoms: 'severe chest pain, shortness of breath, and dizziness',
        mood: 'poor',
        waterIntake: 5,
        exerciseDuration: 0,
        notes: 'Experiencing chest discomfort and difficulty breathing',
      },
    ],
  },
];

// Provider component
export const PatientDataProvider = ({ children }) => {
  const [patients, setPatients] = useState(initialPatients);
  const [currentPatientId, setCurrentPatientId] = useState(1); // For patient login

  // Add a new patient
  const addPatient = (patientData) => {
    const maxId = patients.length > 0 
      ? Math.max(...patients.map(p => p.id || 0))
      : 0;
    const newPatient = {
      ...patientData,
      id: maxId + 1,
      // Initialize new arrays if not provided
      dailyLogs: patientData.dailyLogs || [],
      medicalHistory: patientData.medicalHistory || [],
      diseaseHistory: patientData.diseaseHistory || [],
      aiAssessments: patientData.aiAssessments || [],
      emergencyContacts: patientData.emergencyContacts || [],
      medicationSchedule: patientData.medicationSchedule || [],
      sleepLogs: patientData.sleepLogs || [],
      exerciseLogs: patientData.exerciseLogs || [],
    };
    setPatients([...patients, newPatient]);
    return newPatient;
  };

  // Update patient information
  const updatePatient = (patientId, updatedData) => {
    setPatients(patients.map(p => 
      p.id === patientId ? { ...p, ...updatedData } : p
    ));
  };

  // Get a specific patient
  const getPatient = (patientId) => {
    return patients.find(p => p.id === patientId);
  };

  // Get current logged-in patient
  const getCurrentPatient = () => {
    return getPatient(currentPatientId);
  };

  // Add daily log for a patient
  const addDailyLog = (patientId, logData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const today = new Date().toISOString().split('T')[0];
        const existingLogIndex = p.dailyLogs?.findIndex(log => log.date === today) ?? -1;
        
        // Generate unique ID based on max existing ID
        const maxId = p.dailyLogs?.length > 0 
          ? Math.max(...p.dailyLogs.map(log => log.id || 0))
          : 0;
        
        const newLog = {
          id: existingLogIndex >= 0 
            ? p.dailyLogs[existingLogIndex].id 
            : maxId + 1,
          date: today,
          ...logData,
        };

        let updatedLogs;
        if (existingLogIndex >= 0) {
          updatedLogs = [...(p.dailyLogs || [])];
          updatedLogs[existingLogIndex] = newLog;
        } else {
          updatedLogs = [newLog, ...(p.dailyLogs || [])];
        }

        return { ...p, dailyLogs: updatedLogs };
      }
      return p;
    }));
  };

  // Schedule appointment
  const scheduleAppointment = (patientId, appointmentDate) => {
    updatePatient(patientId, { nextAppointment: appointmentDate });
  };

  // NEW: Add medical history entry
  const addMedicalHistory = (patientId, historyData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const maxId = p.medicalHistory?.length > 0 
          ? Math.max(...p.medicalHistory.map(item => item.id || 0))
          : 0;
        const newEntry = {
          id: maxId + 1,
          date: new Date().toISOString().split('T')[0],
          ...historyData,
        };
        return { 
          ...p, 
          medicalHistory: [newEntry, ...(p.medicalHistory || [])] 
        };
      }
      return p;
    }));
  };

  // NEW: Add disease history entry
  const addDiseaseHistory = (patientId, diseaseData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const maxId = p.diseaseHistory?.length > 0 
          ? Math.max(...p.diseaseHistory.map(item => item.id || 0))
          : 0;
        const newEntry = {
          id: maxId + 1,
          diagnosedDate: new Date().toISOString().split('T')[0],
          ...diseaseData,
        };
        return { 
          ...p, 
          diseaseHistory: [newEntry, ...(p.diseaseHistory || [])] 
        };
      }
      return p;
    }));
  };

  // NEW: Update disease history status
  const updateDiseaseHistory = (patientId, diseaseId, updatedData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const updatedDiseases = (p.diseaseHistory || []).map(d =>
          d.id === diseaseId ? { ...d, ...updatedData } : d
        );
        return { ...p, diseaseHistory: updatedDiseases };
      }
      return p;
    }));
  };

  // NEW: Add AI assessment
  const addAIAssessment = (patientId, assessmentData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const maxId = p.aiAssessments?.length > 0 
          ? Math.max(...p.aiAssessments.map(item => item.id || 0))
          : 0;
        const newAssessment = {
          id: maxId + 1,
          date: new Date().toISOString().split('T')[0],
          ...assessmentData,
        };
        return { 
          ...p, 
          aiAssessments: [newAssessment, ...(p.aiAssessments || [])] 
        };
      }
      return p;
    }));
  };

  // NEW: Get latest AI assessment
  const getLatestAIAssessment = (patientId) => {
    const patient = getPatient(patientId);
    if (!patient || !patient.aiAssessments || patient.aiAssessments.length === 0) {
      return null;
    }
    return patient.aiAssessments[0]; // Most recent is first
  };

  // NEW: Add emergency contact
  const addEmergencyContact = (patientId, contactData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const maxId = p.emergencyContacts?.length > 0 
          ? Math.max(...p.emergencyContacts.map(item => item.id || 0))
          : 0;
        const newContact = {
          id: maxId + 1,
          ...contactData,
        };
        return { 
          ...p, 
          emergencyContacts: [...(p.emergencyContacts || []), newContact] 
        };
      }
      return p;
    }));
  };

  // NEW: Update emergency contact
  const updateEmergencyContact = (patientId, contactId, updatedData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const updatedContacts = (p.emergencyContacts || []).map(c =>
          c.id === contactId ? { ...c, ...updatedData } : c
        );
        return { ...p, emergencyContacts: updatedContacts };
      }
      return p;
    }));
  };

  // NEW: Delete emergency contact
  const deleteEmergencyContact = (patientId, contactId) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const updatedContacts = (p.emergencyContacts || []).filter(c => c.id !== contactId);
        return { ...p, emergencyContacts: updatedContacts };
      }
      return p;
    }));
  };

  // NEW: Add medication to schedule
  const addMedicationSchedule = (patientId, medicationData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const maxId = p.medicationSchedule?.length > 0 
          ? Math.max(...p.medicationSchedule.map(item => item.id || 0))
          : 0;
        const newMedication = {
          id: maxId + 1,
          ...medicationData,
        };
        return { 
          ...p, 
          medicationSchedule: [...(p.medicationSchedule || []), newMedication] 
        };
      }
      return p;
    }));
  };

  // NEW: Update medication schedule
  const updateMedicationSchedule = (patientId, medicationId, updatedData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const updatedSchedule = (p.medicationSchedule || []).map(m =>
          m.id === medicationId ? { ...m, ...updatedData } : m
        );
        return { ...p, medicationSchedule: updatedSchedule };
      }
      return p;
    }));
  };

  // NEW: Delete medication from schedule
  const deleteMedicationSchedule = (patientId, medicationId) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const updatedSchedule = (p.medicationSchedule || []).filter(m => m.id !== medicationId);
        return { ...p, medicationSchedule: updatedSchedule };
      }
      return p;
    }));
  };

  // NEW: Add sleep log
  const addSleepLog = (patientId, sleepData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const today = new Date().toISOString().split('T')[0];
        const existingLogIndex = (p.sleepLogs || []).findIndex(log => log.date === today);
        
        // Generate unique ID based on max existing ID
        const maxId = p.sleepLogs?.length > 0 
          ? Math.max(...p.sleepLogs.map(log => log.id || 0))
          : 0;
        
        const newLog = {
          id: existingLogIndex >= 0 
            ? p.sleepLogs[existingLogIndex].id 
            : maxId + 1,
          date: today,
          ...sleepData,
        };

        let updatedLogs;
        if (existingLogIndex >= 0) {
          updatedLogs = [...(p.sleepLogs || [])];
          updatedLogs[existingLogIndex] = newLog;
        } else {
          updatedLogs = [newLog, ...(p.sleepLogs || [])];
        }

        return { ...p, sleepLogs: updatedLogs };
      }
      return p;
    }));
  };

  // NEW: Add exercise log
  const addExerciseLog = (patientId, exerciseData) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const today = new Date().toISOString().split('T')[0];
        const maxId = p.exerciseLogs?.length > 0 
          ? Math.max(...p.exerciseLogs.map(item => item.id || 0))
          : 0;
        const newLog = {
          id: maxId + 1,
          date: today,
          ...exerciseData,
        };
        return { 
          ...p, 
          exerciseLogs: [newLog, ...(p.exerciseLogs || [])] 
        };
      }
      return p;
    }));
  };

  // NEW: Calculate medication compliance rate
  const getMedicationCompliance = (patientId, days = 30) => {
    const patient = getPatient(patientId);
    if (!patient || !patient.dailyLogs) return 0;
    
    const recentLogs = patient.dailyLogs.slice(0, Math.min(days, patient.dailyLogs.length));
    if (recentLogs.length === 0) return 0;
    
    const compliantDays = recentLogs.filter(log => log.medicationTaken).length;
    return (compliantDays / recentLogs.length) * 100;
  };

  // NEW: Calculate health score (0-100)
  const getHealthScore = (patientId) => {
    const patient = getPatient(patientId);
    if (!patient) return 0;
    
    let score = 50; // Base score
    
    // Medication compliance (up to +30 points)
    const compliance = getMedicationCompliance(patientId, 30);
    score += (compliance / 100) * 30;
    
    // Recent AI assessment (up to +20 points)
    const latestAssessment = getLatestAIAssessment(patientId);
    if (latestAssessment) {
      if (latestAssessment.riskLevel === 'LOW') score += 20;
      else if (latestAssessment.riskLevel === 'MEDIUM') score += 10;
      // HIGH risk adds 0
    }
    
    // Regular exercise (up to +10 points)
    const recentExercise = patient.exerciseLogs?.slice(0, 7) || [];
    score += Math.min(recentExercise.length, 7) * (10 / 7);
    
    // Good sleep (up to +10 points)
    const recentSleep = patient.sleepLogs?.slice(0, 7) || [];
    const goodSleep = recentSleep.filter(s => s.quality === 'good' || s.quality === 'excellent').length;
    score += (goodSleep / 7) * 10;
    
    return Math.round(Math.min(score, 100));
  };

  const value = {
    patients,
    currentPatientId,
    setCurrentPatientId,
    // Convenience: current patient profile and common derived fields
    patientProfile: getCurrentPatient(),
    dailyLogs: getCurrentPatient()?.dailyLogs || [],
    addPatient,
    updatePatient,
    getPatient,
    getCurrentPatient,
    addDailyLog,
    scheduleAppointment,
    // NEW: Medical History functions
    addMedicalHistory,
    // NEW: Disease History functions
    addDiseaseHistory,
    updateDiseaseHistory,
    // NEW: AI Assessment functions
    addAIAssessment,
    getLatestAIAssessment,
    // NEW: Emergency Contact functions
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    // NEW: Medication Schedule functions
    addMedicationSchedule,
    updateMedicationSchedule,
    deleteMedicationSchedule,
    // NEW: Sleep Log functions
    addSleepLog,
    // NEW: Exercise Log functions
    addExerciseLog,
    // NEW: Analytics functions
    getMedicationCompliance,
    getHealthScore,
  };

  return (
    <PatientDataContext.Provider value={value}>
      {children}
    </PatientDataContext.Provider>
  );
};

// Custom hook to use the context
export const usePatientData = () => {
  const context = useContext(PatientDataContext);
  if (!context) {
    throw new Error('usePatientData must be used within a PatientDataProvider');
  }
  return context;
};
