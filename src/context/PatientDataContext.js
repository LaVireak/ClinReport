import React, { createContext, useState, useContext } from 'react';

// Create the context
const PatientDataContext = createContext();

// Sample initial data
const initialPatients = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    condition: 'Hypertension',
    lastVisit: '2025-10-20',
    nextAppointment: '2025-11-05',
    medications: ['Lisinopril 10mg', 'Aspirin 81mg'],
    notes: 'Monitor blood pressure daily',
    dailyLogs: [
      {
        id: 1,
        date: '2025-10-24',
        medicationTaken: true,
        medicationTime: '08:00 AM',
        smoked: false,
        bloodPressure: '120/80',
        notes: 'Feeling good today',
      },
      {
        id: 2,
        date: '2025-10-23',
        medicationTaken: true,
        medicationTime: '08:15 AM',
        smoked: false,
        bloodPressure: '122/82',
        notes: 'Slight headache in evening',
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 32,
    condition: 'Diabetes Type 2',
    lastVisit: '2025-10-18',
    nextAppointment: '2025-10-30',
    medications: ['Metformin 500mg', 'Insulin'],
    notes: 'Check glucose levels before meals',
    dailyLogs: [],
  },
];

// Provider component
export const PatientDataProvider = ({ children }) => {
  const [patients, setPatients] = useState(initialPatients);
  const [currentPatientId, setCurrentPatientId] = useState(1); // For patient login

  // Add a new patient
  const addPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: patients.length + 1,
      dailyLogs: [],
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
        
        const newLog = {
          id: existingLogIndex >= 0 
            ? p.dailyLogs[existingLogIndex].id 
            : (p.dailyLogs?.length || 0) + 1,
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

  const value = {
    patients,
    currentPatientId,
    setCurrentPatientId,
    addPatient,
    updatePatient,
    getPatient,
    getCurrentPatient,
    addDailyLog,
    scheduleAppointment,
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
