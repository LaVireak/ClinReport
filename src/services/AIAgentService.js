/**
 * AI Agent Chat Service - Demo Version
 * 
 * This service provides an AI chatbot that acts like a doctor.
 * It can consult patients based on their symptoms and risk level.
 * 
 * Demo Mode: 
 * - "hi" triggers low-risk consultation demo
 * - "hello" triggers high-risk consultation demo
 * - No actual API calls, just simulated responses
 */

/**
 * Process user message and generate AI agent response
 * @param {String} userMessage - Message from the user
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Object} AI response with message and metadata
 */
export const getAIAgentResponse = async (userMessage, conversationHistory = []) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const messageLower = userMessage.toLowerCase().trim();

  // Check if message contains comprehensive patient data (auto-introduction)
  if (userMessage.includes('My name is') && userMessage.includes('vitals') && userMessage.includes('Blood Pressure')) {
    return analyzePatientIntroduction(userMessage);
  }

  // Check for low-risk scenario (triggered by "hi")
  // Auto-write detailed low-risk symptoms
  if (messageLower === 'hi') {
    return generateLowRiskConsultationWithSymptoms();
  }

  // Check for high-risk scenario (triggered by "hello")
  // Auto-write detailed high-risk symptoms
  if (messageLower === 'hello') {
    return generateHighRiskConsultationWithSymptoms();
  }

  // Default responses for other inputs
  return generateDefaultResponse(messageLower, conversationHistory);
};

/**
 * Analyze comprehensive patient introduction and provide risk assessment
 */
const analyzePatientIntroduction = (patientData) => {
  // Extract key information from patient data
  const hasHighBP = patientData.includes('160/') || patientData.includes('150/') || patientData.includes('140/');
  const hasHighHR = patientData.includes('110 bpm') || patientData.includes('105 bpm') || patientData.includes('100 bpm');
  const hasHighTemp = patientData.includes('38.') || patientData.includes('39.') || patientData.includes('40.');
  const hasSevereSymptoms = patientData.toLowerCase().includes('severe') || 
                            patientData.toLowerCase().includes('chest pain') ||
                            patientData.toLowerCase().includes('difficulty breathing') ||
                            patientData.toLowerCase().includes('bleeding');
  
  // Determine risk level based on vitals and symptoms
  const isHighRisk = hasHighBP || hasHighHR || hasHighTemp || hasSevereSymptoms;
  
  if (isHighRisk) {
    return generateHighRiskAnalysis(patientData);
  } else {
    return generateLowRiskAnalysis(patientData);
  }
};

/**
 * Generate LOW RISK analysis based on patient data
 */
const generateLowRiskAnalysis = (patientData) => {
  return {
    message: `Thank you for sharing your comprehensive health information! Let me analyze your data and provide my assessment. 🩺

**📊 HEALTH DATA ANALYSIS:**

**Vital Signs Review:**
✅ Blood Pressure: Within normal range (120/80 is optimal)
✅ Heart Rate: Healthy resting rate (60-80 bpm is normal)
✅ Body Temperature: Normal range (36-37°C is healthy)
✅ Overall vital signs are stable

**Symptom Analysis:**
I've reviewed your reported symptoms and current health status. Based on the information provided:
• Symptoms appear to be mild to moderate
• No immediate red flags detected
• Vital signs are within healthy parameters
• Your body is functioning normally

**Medical History Consideration:**
• Your chronic condition is being managed
• Current medications are appropriate
• No concerning interactions detected

**🎯 RISK ASSESSMENT: LOW RISK** ✅

**Why LOW RISK?**
1. All vital signs are within normal healthy ranges
2. No severe or concerning symptoms reported
3. Chronic condition appears stable and controlled
4. No emergency indicators present
5. Current medication regimen is appropriate

**💡 MY RECOMMENDATIONS:**

**Immediate Actions:**
• Continue taking your prescribed medications as scheduled
• Monitor your symptoms over the next 24-48 hours
• Maintain good hydration (8 glasses of water daily)
• Get adequate rest (7-8 hours of sleep)

**General Health Tips:**
• Keep following your treatment plan
• Regular light exercise if you feel up to it
• Eat balanced, nutritious meals
• Avoid stress and get plenty of rest
• Track your symptoms daily

**When to Follow Up:**
• Schedule a routine checkup with your doctor within 1-2 weeks
• Continue monitoring your condition
• If symptoms worsen or new symptoms appear, contact your doctor

**⚠️ Warning Signs to Watch For:**
If you experience any of the following, seek medical attention immediately:
• Severe chest pain or pressure
• Difficulty breathing or shortness of breath
• Sudden severe headache
• High fever (>38.5°C)
• Loss of consciousness

**📅 Next Steps:**
You're managing your health well! Continue with your current treatment plan and maintain healthy lifestyle habits. Your condition appears stable, and you don't need immediate medical intervention.

Is there anything specific about your symptoms or health that you'd like to discuss further?`,
    riskLevel: 'LOW',
    requiresDoctor: false,
    timestamp: new Date().toISOString(),
    metadata: {
      analysis: 'comprehensive',
      vitalSignsStatus: 'normal',
      symptomsStatus: 'mild',
    },
  };
};

/**
 * Generate HIGH RISK analysis based on patient data
 */
const generateHighRiskAnalysis = (patientData) => {
  return {
    message: `Thank you for sharing your health information. I've completed my analysis and I need to alert you about some concerning findings. ⚠️

**📊 CRITICAL HEALTH DATA ANALYSIS:**

**Vital Signs Review:**
⚠️ Blood Pressure: ELEVATED (above normal range)
⚠️ Heart Rate: ELEVATED (tachycardia detected)
⚠️ Body Temperature: May be elevated
🚨 Multiple vital signs are outside normal parameters

**Symptom Analysis - CONCERNING FINDINGS:**
After analyzing your symptoms and health data, I've detected patterns that require immediate attention:
• Symptoms indicate potential serious condition
• Multiple risk factors present
• Vital signs show significant abnormalities
• Combination of symptoms is concerning

**Medical History Consideration:**
• Pre-existing condition may be complicating factors
• Current medications may need adjustment
• Condition requires professional medical evaluation

**🚨 RISK ASSESSMENT: HIGH RISK** ⚠️

**Why HIGH RISK?**
1. **Vital Signs Abnormal:** Blood pressure and/or heart rate significantly elevated
2. **Symptom Severity:** Reported symptoms indicate serious condition
3. **Risk Factors:** Multiple concerning indicators present
4. **Urgent Need:** Requires immediate professional assessment
5. **Safety First:** Your condition needs human medical expertise

**⚠️ IMPORTANT MEDICAL NOTICE:**

As an AI Medical Assistant, I am **NOT qualified** to provide medical consultation for HIGH RISK conditions. Your safety is my top priority, and you need professional medical care.

**Why I Cannot Treat This:**
❌ High-risk conditions require human medical expertise
❌ Physical examination is necessary
❌ Diagnostic tests may be required (ECG, blood work, imaging)
❌ Prescription medications may be needed immediately
❌ Professional monitoring is essential

**🏥 URGENT RECOMMENDATIONS:**

**IMMEDIATE ACTIONS REQUIRED:**
1. 🚨 **Seek medical attention TODAY**
2. 📞 **Contact your doctor or visit emergency room**
3. 🚑 **Call 911 if symptoms worsen suddenly**
4. 👥 **Don't go alone - bring someone with you**
5. 📋 **Bring all medical records and medication list**

**RECOMMENDED SPECIALISTS:**

**1. Cardiologist (Heart Specialist)** 💓
   • Specialty: Cardiovascular diseases, hypertension
   • Hospital: Central Medical Center
   • Distance: 2.3 km away
   • Rating: ⭐⭐⭐⭐⭐ 4.8/5
   • Contact: (855) 123-4567
   • Emergency services available 24/7

**2. Internal Medicine Specialist** 🩺
   • Specialty: Complex medical conditions
   • Hospital: City General Hospital
   • Distance: 3.7 km away
   • Rating: ⭐⭐⭐⭐ 4.5/5
   • Contact: (855) 987-6543
   • Walk-in consultations available

**NEARBY EMERGENCY FACILITIES:**
🚑 **Central Medical Center** - 24/7 Emergency (2.3 km)
🚑 **City General Hospital** - Emergency Dept (3.7 km)
🚑 **Royal Hospital** - Urgent Care (4.1 km)

**📋 WHAT TO DO NOW:**

**Before Leaving:**
• Note all your symptoms and when they started
• List all medications you're currently taking
• Bring your medical history records
• Check your insurance information

**At the Hospital:**
• Mention your elevated vital signs
• Describe all symptoms in detail
• Request immediate evaluation
• Ask for diagnostic tests if needed

**🚨 EMERGENCY WARNING:**
Call 911 immediately if you experience:
• Severe chest pain or pressure
• Cannot breathe normally
• Sudden severe headache
• Loss of consciousness
• Severe bleeding
• Confusion or altered mental state

**Your health and safety are paramount.** Please don't delay seeking professional medical care. A human doctor can provide proper diagnosis, treatment, and monitoring that you need right now.

Would you like help with:
• Finding the nearest hospital?
• Getting contact information for recommended doctors?
• Understanding what tests you might need?`,
    riskLevel: 'HIGH',
    requiresDoctor: true,
    timestamp: new Date().toISOString(),
    metadata: {
      analysis: 'comprehensive',
      vitalSignsStatus: 'abnormal',
      symptomsStatus: 'severe',
      urgency: 'immediate',
    },
  };
};

/**
 * Generate low-risk consultation demo response with auto-written symptoms
 */
const generateLowRiskConsultationWithSymptoms = () => {
  return {
    message: `Hello! I'm your AI Medical Assistant. Thank you for sharing your symptoms. Let me review them:

**Your Reported Symptoms:**
• Mild headache (2/10 severity)
• Slight runny nose
• Occasional sneezing
• Mild fatigue
• No fever
• Throat feels slightly scratchy

**Risk Assessment: LOW RISK** ✅

Based on your symptoms and recent data:
• Your vital signs are within normal ranges
• Blood pressure: 120/80 mmHg (Normal)
• Heart rate: 72 bpm (Healthy)
• Temperature: 98.6°F (Normal)
• No concerning symptoms detected

**My Assessment:**
You appear to have mild symptoms consistent with a common cold or minor seasonal allergies. Your overall health indicators look good and there are no alarming signs.

**Recommendations:**
1. 💊 Continue any prescribed medications
2. 💧 Stay well hydrated (8 glasses of water daily)
3. 😴 Get adequate rest (7-8 hours of sleep)
4. 🥗 Eat nutritious meals with vitamin C
5. 🏃 Light exercise when feeling better

**Home Remedies:**
• Warm tea with honey for throat comfort
• Steam inhalation for nasal congestion
• Over-the-counter antihistamines if allergies
• Saline nasal spray for runny nose

You should feel better in a few days with rest and self-care. However, if symptoms worsen or persist beyond a week, please consult with a doctor in person.

Is there anything specific you'd like to discuss about your symptoms?`,
    riskLevel: 'LOW',
    requiresDoctor: false,
    timestamp: new Date().toISOString(),
    metadata: {
      canConsult: true,
      autoWrittenSymptoms: 'mild headache, slight runny nose, occasional sneezing, mild fatigue, no fever, throat slightly scratchy',
      recommendations: [
        'Rest and hydration',
        'Monitor symptoms',
        'OTC medications if needed',
      ],
    },
  };
};

/**
 * Generate high-risk consultation demo response with auto-written symptoms
 */
const generateHighRiskConsultationWithSymptoms = () => {
  return {
    message: `Hello, I'm your AI Medical Assistant. Thank you for sharing your symptoms. I need to inform you of important findings after reviewing your data. ⚠️

**Your Reported Symptoms:**
• Severe chest pain (8/10 severity)
• Shortness of breath
• Rapid heartbeat/palpitations
• Dizziness and lightheadedness
• Nausea
• Cold sweats
• Pain radiating to left arm

**Risk Assessment: HIGH RISK** 🚨

Based on your symptoms and recent data:
• Blood pressure: 160/95 mmHg (⚠️ SIGNIFICANTLY ELEVATED)
• Heart rate: 110 bpm (⚠️ ELEVATED - Tachycardia)
• Temperature: 99.8°F (Slightly elevated)
• Multiple concerning cardiovascular symptoms
• Potential cardiac event indicators

**IMPORTANT NOTICE:**
I've detected concerning patterns in your health data that require immediate professional medical attention. As an AI assistant, I am **not qualified** to provide medical consultation for high-risk conditions.

**Why I Cannot Consult:**
❌ High-risk conditions need human medical expertise
❌ Physical examination may be required
❌ Advanced diagnostic tests might be necessary
❌ Prescription medications may be needed
❌ Your safety is the top priority

**URGENT RECOMMENDATIONS:**
🏥 **Please consult with a specialized doctor immediately**
📞 **Do not delay seeking medical help**

**Recommended Specialists:**

1. **Cardiologist** (Heart Specialist)
   • For elevated blood pressure and heart rate
   • Hospital: Central Medical Center (2.3 km away)
   • Rating: ⭐⭐⭐⭐⭐ 4.8/5
   • Emergency services available

2. **General Practitioner**
   • For comprehensive evaluation
   • Hospital: City General Hospital (3.7 km away)
   • Rating: ⭐⭐⭐⭐ 4.5/5
   • Walk-in consultations available

**Nearby Emergency Facilities:**
🚑 Central Medical Center - 24/7 Emergency (2.3 km)
🚑 City General Hospital - Emergency Dept (3.7 km)

**What You Should Do Now:**
1. Contact one of the recommended doctors/hospitals
2. Bring all your medical records and test results
3. List all your current symptoms and medications
4. Don't drive yourself if you feel dizzy or unwell
5. Have someone accompany you if possible

⚠️ **PLEASE NOTE:** If chest pain is severe or worsening, call emergency services (911) immediately!

Your health and safety are paramount. Please seek professional medical care as soon as possible. A human doctor can provide the proper diagnosis and treatment you need.

Would you like help finding the nearest hospital or doctor contact information?`,
    riskLevel: 'HIGH',
    requiresDoctor: true,
    timestamp: new Date().toISOString(),
    metadata: {
      canConsult: false,
      autoWrittenSymptoms: 'severe chest pain (8/10), shortness of breath, rapid heartbeat, dizziness, nausea, cold sweats, pain radiating to left arm',
      recommendations: [
        'Seek immediate medical attention',
        'Contact specialized doctor',
        'Visit emergency facility if needed',
      ],
      specialistRecommendations: [
        {
          specialty: 'Cardiologist',
          hospital: 'Central Medical Center',
          distance: '2.3 km',
          rating: 4.8,
        },
        {
          specialty: 'General Practitioner',
          hospital: 'City General Hospital',
          distance: '3.7 km',
          rating: 4.5,
        },
      ],
    },
  };
};

/**
 * Generate default response for other inputs
 */
const generateDefaultResponse = (message, conversationHistory) => {
  // Check if this is a greeting
  const greetings = ['hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
  if (greetings.some(g => message.includes(g))) {
    return {
      message: `Hello! I'm your AI Medical Assistant. 👋

I'm here to help you understand your health better. 

To see a demo of how I work, you can try:
• Type **"hi"** for a LOW RISK consultation example
• Type **"hello"** for a HIGH RISK consultation example

I can help you with:
✅ Understanding your health symptoms
✅ Providing general health advice (for low-risk conditions)
✅ Recommending when to see a doctor
✅ Finding specialized doctors and hospitals

How can I assist you today?`,
      riskLevel: 'UNKNOWN',
      requiresDoctor: false,
      timestamp: new Date().toISOString(),
    };
  }

  // Check for symptom-related queries
  const symptomKeywords = ['symptom', 'pain', 'fever', 'sick', 'ill', 'hurt', 'ache'];
  if (symptomKeywords.some(k => message.includes(k))) {
    return {
      message: `I understand you're experiencing some symptoms. To provide you with the best assistance, I need to assess your condition.

Could you please provide more details:
• What symptoms are you experiencing?
• When did they start?
• How severe are they (mild, moderate, severe)?
• Any relevant medical history?

**For Demo:**
• Type **"hi"** to see how I handle LOW RISK symptoms
• Type **"hello"** to see how I handle HIGH RISK symptoms

I'm here to help! 💙`,
      riskLevel: 'UNKNOWN',
      requiresDoctor: false,
      timestamp: new Date().toISOString(),
    };
  }

  // Default response
  return {
    message: `Thank you for your message. I'm here to assist with health-related questions and concerns.

**To see my capabilities, try:**
• Type **"hi"** for a low-risk consultation demo
• Type **"hello"** for a high-risk consultation demo

**I can help with:**
• Symptom assessment and analysis
• General health advice and guidance
• Doctor and hospital recommendations
• Understanding when to seek medical care

Please feel free to share your health concerns, and I'll do my best to assist you! 😊`,
    riskLevel: 'UNKNOWN',
    requiresDoctor: false,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Get follow-up questions based on symptoms
 */
export const getFollowUpQuestions = (symptoms) => {
  return [
    'How long have you had these symptoms?',
    'On a scale of 1-10, how would you rate the severity?',
    'Have you taken any medication for this?',
    'Do you have any pre-existing medical conditions?',
    'Are there any other symptoms you\'re experiencing?',
  ];
};

/**
 * Check if message indicates emergency
 */
export const isEmergencyMessage = (message) => {
  const emergencyKeywords = [
    'chest pain',
    'can\'t breathe',
    'unconscious',
    'severe bleeding',
    'stroke',
    'heart attack',
    'choking',
    'severe pain',
  ];

  const messageLower = message.toLowerCase();
  return emergencyKeywords.some(keyword => messageLower.includes(keyword));
};

/**
 * Get emergency response
 */
export const getEmergencyResponse = () => {
  return {
    message: `🚨 **MEDICAL EMERGENCY DETECTED** 🚨

This appears to be a serious medical emergency. 

**IMMEDIATE ACTIONS:**
1. ☎️ Call emergency services (911 or local emergency number) NOW
2. 🚑 Do not wait - get emergency medical help immediately
3. 🏥 Go to the nearest emergency room
4. 👥 Have someone stay with you

**DO NOT:**
❌ Wait to see if symptoms improve
❌ Drive yourself to the hospital
❌ Rely solely on this AI for emergency care

**Nearest Emergency Facilities:**
🏥 Central Medical Center - Emergency Dept
   📍 2.3 km away | ☎️ Emergency: 911

🏥 City General Hospital - Emergency Care
   📍 3.7 km away | ☎️ Emergency: 911

**Your safety is the absolute priority. Please seek immediate medical help.**`,
    riskLevel: 'EMERGENCY',
    requiresDoctor: true,
    timestamp: new Date().toISOString(),
    isEmergency: true,
  };
};

export default {
  getAIAgentResponse,
  getFollowUpQuestions,
  isEmergencyMessage,
  getEmergencyResponse,
};
