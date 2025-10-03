// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    const navMenuId = navMenu && (navMenu.id || 'primary-navigation');
    if (navMenu) {
        navMenu.id = navMenuId;
        navMenu.setAttribute('aria-hidden', 'true');
        mobileMenuToggle.setAttribute('aria-controls', navMenuId);
    }
    mobileMenuToggle.setAttribute('aria-expanded', 'false');

    mobileMenuToggle.addEventListener('click', () => {
        if (!navMenu) {
            return;
        }
        const isOpen = navMenu.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        navMenu.setAttribute('aria-hidden', String(!isOpen));
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const rawHref = this.getAttribute('href') || '';
        if (!rawHref || rawHref === '#') {
            e.preventDefault();
            if (navMenu) {
                navMenu.classList.remove('active');
                mobileMenuToggle?.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            }
            return;
        }

        const target = document.querySelector(rawHref);
        if (!target) {
            return;
        }

        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Close mobile menu if open
        if (navMenu) {
            navMenu.classList.remove('active');
            mobileMenuToggle?.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, .stat-card, .pricing-card').forEach((el) => {
    observer.observe(el);
});

// Tab Functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Modal Functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#f56565';
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });
    
    return isValid;
}

// Form Submission Handler
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    if (!form.id) {
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(form.id)) {
            // Show success message
            showNotification('Thank you! We will contact you shortly.', 'success');
            form.reset();
        } else {
            showNotification('Please fill in all required fields.', 'error');
        }
    });
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach((counter) => {
    counterObserver.observe(counter);
});

// Demo Note Selection
const demoNotes = {
    'er-chest-pain': 'Patient: Mr. Chan, 57 y/o male with HTN and Type 2 diabetes presents with chest tightness starting 2 hours ago, radiating to left arm. BP 150/90. Troponin pending. ECG shows ST elevation in leads II, III, aVF. Started on aspirin, heparin. Cardiology consulted for possible STEMI.',
    'diabetes-followup': 'Patient: Ms. Srey, 45 y/o female. Type 2 diabetes, A1c 8.2% last week, up from 7.1% three months ago. Reports poor dietary compliance and missed metformin doses. No current symptoms. BP 128/82, weight up 5 lbs. Discussed importance of medication adherence and diet.',
    'pediatric-uri': 'Patient: 6 y/o child with 2-day cough and low-grade fever (100.4°F). No difficulty breathing, eating well. Lungs clear bilaterally. Throat mildly erythematous. Dx: Viral URI. Advised supportive care, fluids, acetaminophen for fever. Return if worsening or fever >3 days.'
};

const demoButtons = document.querySelectorAll('.demo-note-btn');
const demoTextarea = document.getElementById('demoInput');

if (demoButtons && demoTextarea) {
    demoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const noteType = btn.getAttribute('data-note');
            demoTextarea.value = demoNotes[noteType] || '';
        });
    });
}

// Process Demo Note
const processBtn = document.getElementById('processBtn');
const demoResults = document.getElementById('demoResults');

if (processBtn && demoResults) {
    processBtn.addEventListener('click', () => {
        const inputText = document.getElementById('demoInput').value;
        const specialty = document.getElementById('specialtySelect')?.value || 'General';
        
        if (!inputText.trim()) {
            showNotification('Please enter or select a clinical note first.', 'error');
            return;
        }
        
        // Show loading state
        processBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>Processing...';
        processBtn.disabled = true;
        
        // Simulate processing with dynamic results
        setTimeout(() => {
            generateDemoResults(inputText, specialty);
            
            // Show results
            const resultsPlaceholder = document.getElementById('resultsPlaceholder');
            const resultsBadge = document.getElementById('resultsBadge');
            
            if (resultsPlaceholder) resultsPlaceholder.classList.add('hidden');
            if (resultsBadge) resultsBadge.classList.remove('hidden');
            demoResults.classList.remove('hidden');
            demoResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            processBtn.innerHTML = '<i class="fas fa-check" style="margin-right: 0.5rem;"></i>Processed Successfully';
            processBtn.classList.remove('btn-primary');
            processBtn.classList.add('btn-success');
            
            // Reset after 3 seconds
            setTimeout(() => {
                processBtn.innerHTML = '<i class="fas fa-magic" style="margin-right: 0.5rem;"></i>Process Note';
                processBtn.disabled = false;
                processBtn.classList.remove('btn-success');
                processBtn.classList.add('btn-primary');
            }, 3000);
        }, 2300);
    });
}

// Generate dynamic demo results based on input
function generateDemoResults(noteText, specialty) {
    const entitiesContainer = document.getElementById('entitiesContainer');
    const codesContainer = document.getElementById('codesContainer');
    const risksContainer = document.getElementById('risksContainer');
    
    if (!entitiesContainer || !codesContainer || !risksContainer) return;
    
    // Extract entities based on keywords
    const entities = extractEntities(noteText);
    const codes = suggestCodes(noteText, specialty);
    const risks = assessRisks(noteText);
    
    // Render entities
    entitiesContainer.innerHTML = entities.map(entity => `
        <span class="badge" style="background: ${entity.color}20; color: ${entity.color}; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600;">
            ${entity.icon} ${entity.text}
        </span>
    `).join('');
    
    // Render codes
    codesContainer.innerHTML = codes.map(code => `
        <div style="padding: 1rem; background: #f7fafc; border-radius: 8px; border-left: 4px solid ${code.type === 'ICD-10' ? '#667eea' : '#48bb78'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span class="badge badge-${code.type === 'ICD-10' ? 'primary' : 'success'}" style="font-family: monospace;">${code.code}</span>
                    <span style="font-weight: 600; color: var(--text-dark);">${code.description}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 60px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                        <div style="width: ${code.confidence}%; height: 100%; background: ${code.confidence >= 90 ? '#48bb78' : code.confidence >= 75 ? '#ed8936' : '#f56565'}; transition: width 0.3s;"></div>
                    </div>
                    <span style="font-size: 0.875rem; color: var(--text-light); font-weight: 600;">${code.confidence}%</span>
                </div>
            </div>
            <p style="font-size: 0.875rem; color: var(--text-light); margin: 0;">${code.rationale}</p>
        </div>
    `).join('');
    
    // Render risks
    risksContainer.innerHTML = risks.map(risk => `
        <div style="padding: 1rem; background: ${risk.level === 'High' ? '#fff5f5' : risk.level === 'Medium' ? '#fffaf0' : '#f0fff4'}; border-radius: 8px; border: 2px solid ${risk.level === 'High' ? '#fc8181' : risk.level === 'Medium' ? '#f6ad55' : '#9ae6b4'};">
            <div style="display: flex; justify-content: between; align-items: center;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-dark); margin-bottom: 0.25rem;">${risk.category}</div>
                    <div style="font-size: 0.875rem; color: var(--text-light);">${risk.detail}</div>
                </div>
                <span class="badge" style="background: ${risk.level === 'High' ? '#f56565' : risk.level === 'Medium' ? '#ed8936' : '#48bb78'}; color: white; margin-left: 1rem; white-space: nowrap;">
                    ${risk.level} Risk
                </span>
            </div>
        </div>
    `).join('');
}

// Extract medical entities from text
function extractEntities(text) {
    const entities = [];
    const lowerText = text.toLowerCase();
    
    // Diagnoses
    if (lowerText.includes('diabetes') || lowerText.includes('dm')) {
        entities.push({ text: 'Type 2 Diabetes', icon: '🩺', color: '#667eea' });
    }
    if (lowerText.includes('htn') || lowerText.includes('hypertension')) {
        entities.push({ text: 'Hypertension', icon: '💉', color: '#ed8936' });
    }
    if (lowerText.includes('chest pain') || lowerText.includes('chest tightness')) {
        entities.push({ text: 'Chest Pain', icon: '❤️', color: '#f56565' });
    }
    if (lowerText.includes('uri') || lowerText.includes('upper respiratory')) {
        entities.push({ text: 'URI', icon: '🫁', color: '#48bb78' });
    }
    if (lowerText.includes('stemi') || lowerText.includes('st elevation')) {
        entities.push({ text: 'STEMI', icon: '⚠️', color: '#c53030' });
    }
    
    // Medications
    if (lowerText.includes('aspirin')) entities.push({ text: 'Aspirin', icon: '💊', color: '#805ad5' });
    if (lowerText.includes('metformin')) entities.push({ text: 'Metformin', icon: '💊', color: '#805ad5' });
    if (lowerText.includes('heparin')) entities.push({ text: 'Heparin', icon: '💊', color: '#805ad5' });
    if (lowerText.includes('acetaminophen')) entities.push({ text: 'Acetaminophen', icon: '💊', color: '#805ad5' });
    
    // Procedures
    if (lowerText.includes('ecg') || lowerText.includes('ekg')) {
        entities.push({ text: 'ECG', icon: '📊', color: '#3182ce' });
    }
    if (lowerText.includes('troponin')) {
        entities.push({ text: 'Troponin Test', icon: '🔬', color: '#3182ce' });
    }
    if (lowerText.includes('a1c')) {
        entities.push({ text: 'HbA1c Test', icon: '🔬', color: '#3182ce' });
    }
    
    // Vitals
    if (lowerText.match(/bp\s*\d+\/\d+/) || lowerText.match(/blood pressure/)) {
        entities.push({ text: 'Blood Pressure', icon: '🩸', color: '#38a169' });
    }
    if (lowerText.includes('fever') || lowerText.match(/\d+\.\d+°f/)) {
        entities.push({ text: 'Fever', icon: '🌡️', color: '#dd6b20' });
    }
    
    return entities.slice(0, 10); // Limit to 10 entities
}

// Suggest ICD-10 and CPT codes
function suggestCodes(text, specialty) {
    const codes = [];
    const lowerText = text.toLowerCase();
    
    // STEMI / Chest Pain
    if (lowerText.includes('stemi') || lowerText.includes('st elevation')) {
        codes.push({
            type: 'ICD-10',
            code: 'I21.09',
            description: 'ST elevation myocardial infarction',
            confidence: 94,
            rationale: 'ST elevation noted in ECG leads II, III, aVF with chest pain presentation'
        });
        codes.push({
            type: 'CPT',
            code: '99285',
            description: 'Emergency department visit - high complexity',
            confidence: 96,
            rationale: 'High complexity ED visit for acute cardiac emergency'
        });
    } else if (lowerText.includes('chest pain') || lowerText.includes('chest tightness')) {
        codes.push({
            type: 'ICD-10',
            code: 'R07.9',
            description: 'Chest pain, unspecified',
            confidence: 88,
            rationale: 'Patient presenting with chest tightness'
        });
    }
    
    // Diabetes
    if (lowerText.includes('diabetes') || lowerText.includes('a1c')) {
        codes.push({
            type: 'ICD-10',
            code: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            confidence: 92,
            rationale: 'Established Type 2 diabetes with A1c monitoring'
        });
        if (lowerText.includes('follow') || lowerText.includes('followup')) {
            codes.push({
                type: 'CPT',
                code: '99214',
                description: 'Office visit - moderate complexity',
                confidence: 90,
                rationale: 'Follow-up visit for chronic condition management'
            });
        }
    }
    
    // Hypertension
    if (lowerText.includes('htn') || lowerText.includes('hypertension') || lowerText.match(/bp\s*1[45]\d/)) {
        codes.push({
            type: 'ICD-10',
            code: 'I10',
            description: 'Essential (primary) hypertension',
            confidence: 90,
            rationale: 'Documented history of hypertension with elevated BP'
        });
    }
    
    // URI / Pediatric
    if (lowerText.includes('uri') || (lowerText.includes('cough') && lowerText.includes('fever'))) {
        codes.push({
            type: 'ICD-10',
            code: 'J06.9',
            description: 'Acute upper respiratory infection, unspecified',
            confidence: 91,
            rationale: 'Symptoms consistent with viral URI'
        });
        codes.push({
            type: 'CPT',
            code: '99213',
            description: 'Office visit - low to moderate complexity',
            confidence: 89,
            rationale: 'Straightforward acute illness visit'
        });
    }
    
    // Lab tests
    if (lowerText.includes('a1c')) {
        codes.push({
            type: 'CPT',
            code: '83036',
            description: 'Hemoglobin A1c test',
            confidence: 95,
            rationale: 'A1c test documented in note'
        });
    }
    
    return codes;
}

// Assess clinical risks
function assessRisks(text) {
    const risks = [];
    const lowerText = text.toLowerCase();
    
    // Cardiac risk
    if (lowerText.includes('stemi') || lowerText.includes('st elevation')) {
        risks.push({
            category: 'Acute Cardiac Event',
            detail: 'STEMI identified - immediate intervention required',
            level: 'High'
        });
    } else if (lowerText.includes('chest pain')) {
        risks.push({
            category: 'Cardiac Risk',
            detail: 'Chest pain with cardiac history - monitor closely',
            level: 'Medium'
        });
    }
    
    // Diabetes control
    if (lowerText.match(/a1c\s*8\.\d/) || lowerText.includes('poor') && lowerText.includes('compliance')) {
        risks.push({
            category: 'Diabetes Control',
            detail: 'Poor glycemic control (A1c >8%) - medication adherence needed',
            level: 'Medium'
        });
    }
    
    // Readmission risk
    if (lowerText.includes('missed') && lowerText.includes('medication')) {
        risks.push({
            category: 'Readmission Risk',
            detail: 'Medication non-adherence increases readmission probability',
            level: 'Medium'
        });
    }
    
    // Pediatric monitoring
    if (lowerText.includes('child') || lowerText.includes('y/o') && lowerText.match(/[1-9]\s*y\/o/)) {
        if (lowerText.includes('fever') && lowerText.match(/10[0-2]/)) {
            risks.push({
                category: 'Pediatric Monitoring',
                detail: 'Low-grade fever - supportive care, monitor for worsening',
                level: 'Low'
            });
        }
    }
    
    // General monitoring
    if (risks.length === 0) {
        risks.push({
            category: 'General Monitoring',
            detail: 'Standard follow-up care recommended',
            level: 'Low'
        });
    }
    
    return risks;
}

// Add success button style
if (!document.querySelector('style[data-button-success]')) {
    const btnStyle = document.createElement('style');
    btnStyle.setAttribute('data-button-success', '');
    btnStyle.textContent = `
        .btn-success {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%) !important;
        }
    `;
    document.head.appendChild(btnStyle);
}

// Pricing Calculator
function calculateROI(providers, avgDocTime, avgNotesPerDay) {
    const currentTimeSpent = providers * avgDocTime * avgNotesPerDay * 250; // 250 working days
    const newTimeSpent = currentTimeSpent * 0.15; // 85% reduction
    const timeSaved = currentTimeSpent - newTimeSpent;
    const costPerHour = 75; // average clinician cost per hour
    const annualSavings = (timeSaved / 60) * costPerHour;
    
    return {
        timeSaved: Math.round(timeSaved),
        annualSavings: Math.round(annualSavings)
    };
}

// Initialize tooltips
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            background: #1a202c;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            z-index: 4000;
            pointer-events: none;
            white-space: nowrap;
        `;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        
        e.target.addEventListener('mouseleave', () => {
            document.body.removeChild(tooltip);
        }, { once: true });
    });
});

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Print functionality for reports
function printReport() {
    window.print();
}

// Export data as JSON
function exportData(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard.', 'error');
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('ClinReport AI Platform Loaded');
    
    // Add active state to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.color = 'var(--primary-color)';
        }
    });
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or reduce activity
        console.log('Page hidden - reducing activity');
    } else {
        // Resume animations
        console.log('Page visible - resuming activity');
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Service Worker Registration (for PWA capability)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}
