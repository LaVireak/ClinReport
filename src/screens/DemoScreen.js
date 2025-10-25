import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const sampleNotes = {
  emergency: '57 y/o male with HTN and Type 2 diabetes presents with chest tightness radiating to left arm. ECG shows ST elevation in II, III, aVF. Troponin pending. Given aspirin, heparin. Cardiology paged for possible STEMI.',
  primaryCare: '45 y/o female with Type 2 diabetes. A1c 8.2%, up from 7.1%. Reports missed metformin doses and limited exercise. BP 128/82. Discussed medication adherence and diet adjustments. Plan: reinforce lifestyle changes, schedule diabetes educator visit.',
  pediatrics: '6 y/o child with 2-day cough and fever 100.4°F. Eating well, lungs clear. Mild throat erythema. Dx viral URI. Supportive care, fluids, acetaminophen PRN. Return precautions provided.',
};

const specialtyOptions = ['General', 'Emergency', 'Primary Care', 'Pediatrics'];

export default function DemoScreen() {
  const [selectedSample, setSelectedSample] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [specialty, setSpecialty] = useState('General');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const resultsOpacity = useRef(new Animated.Value(0)).current;
  const resultsShift = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (results) {
      resultsOpacity.setValue(0);
      resultsShift.setValue(12);
      Animated.parallel([
        Animated.timing(resultsOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(resultsShift, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [results, resultsOpacity, resultsShift]);

  const handleSamplePress = (key) => {
    setSelectedSample(key);
    setNoteText(sampleNotes[key]);
  };

  const handleProcessNote = () => {
    if (!noteText.trim()) {
      setError('Please enter or select a clinical note first.');
      return;
    }

    setError('');
    setIsProcessing(true);

    setTimeout(() => {
      const processed = analyzeClinicalNote(noteText, specialty);
      setResults(processed);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Interactive Clinical Note AI</Text>
        <Text style={globalStyles.sectionSubtitle}>
          Paste a clinical note, choose a specialty, and preview how ClinReport extracts insights
        </Text>

        <View style={globalStyles.card}>
          <Text style={styles.sectionHeading}>1. Pick a Starting Point</Text>
          <View style={styles.sampleButtonRow}>
            {Object.keys(sampleNotes).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.sampleButton,
                  selectedSample === key && styles.sampleButtonActive,
                ]}
                onPress={() => handleSamplePress(key)}
              >
                <Text style={styles.sampleButtonText}>
                  {key === 'emergency' ? '🚑 Emergency' : key === 'primaryCare' ? '🩺 Primary Care' : '👶 Pediatrics'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionHeading}>2. Add or Edit the Clinical Note</Text>
          <TextInput
            multiline
            placeholder="Paste or type a clinical note here..."
            placeholderTextColor={colors.gray400}
            value={noteText}
            onChangeText={setNoteText}
            style={styles.noteInput}
            textAlignVertical="top"
          />

          <Text style={styles.sectionHeading}>3. Select Specialty Focus</Text>
          <View style={styles.specialtyRow}>
            {specialtyOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.specialtyChip, specialty === option && styles.specialtyChipActive]}
                onPress={() => setSpecialty(option)}
              >
                <Text style={specialty === option ? styles.specialtyChipTextActive : styles.specialtyChipText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[globalStyles.buttonPrimary, styles.processButton]}
            onPress={handleProcessNote}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={globalStyles.buttonTextPrimary}>Process Note</Text>
            )}
          </TouchableOpacity>
        </View>

        {results && (
          <Animated.View
            style={[
              styles.resultsContainer,
              { opacity: resultsOpacity, transform: [{ translateY: resultsShift }] },
            ]}
          >
            <Text style={styles.resultsTitle}>AI Insight Preview</Text>

            <View style={globalStyles.card}>
              <Text style={styles.resultsSectionLabel}>Key Clinical Entities</Text>
              <View style={styles.entityGrid}>
                {results.entities.map((entity, index) => (
                  <View
                    key={`${entity.text}-${index}`}
                    style={[styles.entityBadge, { backgroundColor: `${entity.color}20`, borderColor: entity.color }]}
                  >
                    <Text style={[styles.entityText, { color: entity.color }]}>
                      {entity.icon} {entity.text}
                    </Text>
                  </View>
                ))}
                {results.entities.length === 0 && (
                  <Text style={styles.placeholder}>No obvious entities detected — try adding more detail.</Text>
                )}
              </View>
            </View>

            <View style={globalStyles.card}>
              <Text style={styles.resultsSectionLabel}>Suggested Codes</Text>
              {results.codes.map((code, index) => (
                <View key={`${code.code}-${index}`} style={styles.codeCard}>
                  <View style={styles.codeHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.codeLabel}>{code.type}: {code.code}</Text>
                      <Text style={styles.codeDescription}>{code.description}</Text>
                    </View>
                    <View style={styles.confidenceGroup}>
                      <Text style={styles.confidenceLabel}>{code.confidence}%</Text>
                      <View style={styles.confidenceBarTrack}>
                        <View
                          style={[
                            styles.confidenceBarFill,
                            {
                              width: `${code.confidence}%`,
                              backgroundColor:
                                code.confidence >= 90
                                  ? colors.success
                                  : code.confidence >= 75
                                  ? colors.warning
                                  : colors.danger,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.codeRationale}>{code.rationale}</Text>
                </View>
              ))}
              {results.codes.length === 0 && (
                <Text style={styles.placeholder}>No billing suggestions yet — add diagnoses, meds, or procedures.</Text>
              )}
            </View>

            <View style={globalStyles.card}>
              <Text style={styles.resultsSectionLabel}>Risk & Follow-up Alerts</Text>
              {results.risks.map((risk, index) => {
                const badgeAccent =
                  risk.level === 'High'
                    ? { backgroundColor: colors.danger, color: colors.white }
                    : risk.level === 'Medium'
                    ? { backgroundColor: colors.warning, color: colors.textDark }
                    : { backgroundColor: colors.success, color: colors.white };

                return (
                <View
                    key={`${risk.category}-${index}`}
                    style={[
                      styles.riskCard,
                      risk.level === 'High'
                        ? styles.riskCardHigh
                        : risk.level === 'Medium'
                        ? styles.riskCardMedium
                        : styles.riskCardLow,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.riskCategory}>{risk.category}</Text>
                      <Text style={styles.riskDetail}>{risk.detail}</Text>
                    </View>
                    <View style={[styles.riskBadge, { backgroundColor: badgeAccent.backgroundColor }]}>
                      <Text style={[styles.riskBadgeText, { color: badgeAccent.color }]}>{risk.level} Risk</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}

function analyzeClinicalNote(text, specialty) {
  const entities = extractEntities(text);
  const codes = suggestCodes(text, specialty);
  const risks = assessRisks(text);
  return { entities, codes, risks };
}

function extractEntities(text) {
  const entities = [];
  const lower = text.toLowerCase();

  if (lower.includes('diabetes') || lower.includes('dm')) {
    entities.push({ text: 'Type 2 Diabetes', icon: '🩺', color: colors.primary });
  }
  if (lower.includes('htn') || lower.includes('hypertension')) {
    entities.push({ text: 'Hypertension', icon: '💉', color: colors.warning });
  }
  if (lower.includes('chest pain') || lower.includes('stemi') || lower.includes('st elevation')) {
    entities.push({ text: 'Cardiac Event', icon: '❤️', color: colors.danger });
  }
  if (lower.includes('uri') || lower.includes('upper respiratory')) {
    entities.push({ text: 'URI', icon: '🫁', color: colors.success });
  }
  if (lower.includes('metformin')) {
    entities.push({ text: 'Metformin', icon: '💊', color: '#805ad5' });
  }
  if (lower.includes('aspirin')) {
    entities.push({ text: 'Aspirin', icon: '💊', color: '#805ad5' });
  }
  if (lower.includes('a1c')) {
    entities.push({ text: 'HbA1c Test', icon: '🔬', color: '#3182ce' });
  }
  if (lower.match(/bp\s*\d+\/\d+/) || lower.includes('blood pressure')) {
    entities.push({ text: 'Blood Pressure', icon: '🩸', color: '#38a169' });
  }
  if (lower.includes('fever')) {
    entities.push({ text: 'Fever', icon: '🌡️', color: '#dd6b20' });
  }

  return entities.slice(0, 10);
}

function suggestCodes(text, specialty) {
  const codes = [];
  const lower = text.toLowerCase();

  if (lower.includes('stemi') || lower.includes('st elevation')) {
    codes.push({
      type: 'ICD-10',
      code: 'I21.09',
      description: 'ST elevation myocardial infarction',
      confidence: 95,
      rationale: 'ST elevation noted with cardiac symptoms.',
    });
    codes.push({
      type: 'CPT',
      code: '99285',
      description: 'ED visit - high complexity',
      confidence: 92,
      rationale: 'Emergency visit for acute cardiac event.',
    });
  } else if (lower.includes('chest pain')) {
    codes.push({
      type: 'ICD-10',
      code: 'R07.9',
      description: 'Chest pain, unspecified',
      confidence: 88,
      rationale: 'Chest pain documented without confirmed diagnosis.',
    });
  }

  if (lower.includes('diabetes')) {
    codes.push({
      type: 'ICD-10',
      code: 'E11.9',
      description: 'Type 2 diabetes mellitus',
      confidence: 90,
      rationale: 'Chronic diabetes management referenced.',
    });
    if (specialty === 'Primary Care' || lower.includes('follow')) {
      codes.push({
        type: 'CPT',
        code: '99214',
        description: 'Office visit - moderate complexity',
        confidence: 87,
        rationale: 'Chronic condition follow-up with medication review.',
      });
    }
  }

  if (lower.includes('uri') || (specialty === 'Pediatrics' && lower.includes('cough'))) {
    codes.push({
      type: 'ICD-10',
      code: 'J06.9',
      description: 'Acute upper respiratory infection',
      confidence: 91,
      rationale: 'URI symptoms documented for pediatric case.',
    });
    codes.push({
      type: 'CPT',
      code: '99213',
      description: 'Office visit - low to moderate severity',
      confidence: 86,
      rationale: 'Outpatient visit for acute uncomplicated illness.',
    });
  }

  if (lower.includes('a1c')) {
    codes.push({
      type: 'CPT',
      code: '83036',
      description: 'Hemoglobin A1c test',
      confidence: 94,
      rationale: 'A1c monitoring documented in the note.',
    });
  }

  return codes;
}

function assessRisks(text) {
  const risks = [];
  const lower = text.toLowerCase();

  if (lower.includes('stemi') || lower.includes('st elevation')) {
    risks.push({
      category: 'Acute Cardiac Event',
      detail: 'Immediate cardiology intervention recommended.',
      level: 'High',
    });
  } else if (lower.includes('chest pain')) {
    risks.push({
      category: 'Cardiac Monitoring',
      detail: 'Close monitoring for potential cardiac ischemia.',
      level: 'Medium',
    });
  }

  if (lower.includes('a1c 8') || lower.includes('poor') && lower.includes('compliance')) {
    risks.push({
      category: 'Glycemic Control',
      detail: 'Elevated A1c and adherence gaps noted.',
      level: 'Medium',
    });
  }

  if (lower.includes('missed') && lower.includes('med')) {
    risks.push({
      category: 'Readmission Risk',
      detail: 'Medication non-adherence increases readmission probability.',
      level: 'Medium',
    });
  }

  if (lower.includes('child') || lower.includes('y/o')) {
    risks.push({
      category: 'Pediatric Follow-up',
      detail: 'Monitor for persistent fever or worsening respiratory status.',
      level: 'Low',
    });
  }

  if (risks.length === 0) {
    risks.push({
      category: 'General Monitoring',
      detail: 'Continue routine follow-up and documentation.',
      level: 'Low',
    });
  }

  return risks;
}

const styles = StyleSheet.create({
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  sampleButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  sampleButton: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    marginRight: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sampleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: '#eef2ff',
  },
  sampleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  noteInput: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.textDark,
    backgroundColor: colors.white,
    marginBottom: 20,
  },
  specialtyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  specialtyChip: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    marginRight: 12,
    marginBottom: 12,
  },
  specialtyChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  specialtyChipText: {
    color: colors.textDark,
    fontWeight: '600',
  },
  specialtyChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  errorText: {
    color: colors.danger,
    marginBottom: 12,
    fontWeight: '600',
  },
  processButton: {
    marginTop: 8,
  },
  resultsContainer: {
    marginTop: 32,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultsSectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  entityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  entityBadge: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  entityText: {
    fontWeight: '600',
  },
  placeholder: {
    color: colors.textLight,
    fontStyle: 'italic',
  },
  codeCard: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeLabel: {
    fontWeight: '700',
    fontSize: 15,
    color: colors.textDark,
  },
  codeDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  codeRationale: {
    fontSize: 13,
    color: colors.textLight,
  },
  confidenceGroup: {
    alignItems: 'flex-end',
  },
  confidenceBarTrack: {
    width: 100,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginTop: 4,
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceLabel: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '700',
  },
  riskCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  riskCardHigh: {
    backgroundColor: '#fff5f5',
    borderColor: colors.danger,
  },
  riskCardMedium: {
    backgroundColor: '#fffaf0',
    borderColor: colors.warning,
  },
  riskCardLow: {
    backgroundColor: '#f0fff4',
    borderColor: colors.success,
  },
  riskCategory: {
    fontWeight: '700',
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 4,
  },
  riskDetail: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.textDark,
  },
  riskBadgeText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
});
