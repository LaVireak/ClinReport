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
        
        if (!inputText.trim()) {
            showNotification('Please enter or select a clinical note first.', 'error');
            return;
        }
        
        // Show loading state
        processBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
        processBtn.disabled = true;
        
        // Simulate processing
        setTimeout(() => {
            demoResults.classList.remove('hidden');
            demoResults.scrollIntoView({ behavior: 'smooth' });
            processBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Processed Successfully';
            processBtn.classList.remove('btn-primary');
            processBtn.classList.add('btn-success');
            
            // Reset after 3 seconds
            setTimeout(() => {
                processBtn.innerHTML = '<i class="fas fa-magic mr-2"></i>Process with AI';
                processBtn.disabled = false;
                processBtn.classList.remove('btn-success');
                processBtn.classList.add('btn-primary');
            }, 3000);
        }, 2300);
    });
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
