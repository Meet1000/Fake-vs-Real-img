// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const typeBtns = document.querySelectorAll('.type-btn');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const previewVideo = document.getElementById('previewVideo');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');
const loadingOverlay = document.getElementById('loadingOverlay');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const downloadReportBtn = document.getElementById('downloadReportBtn');

// State
let currentFile = null;
let currentFileType = 'image';
let analysisStartTime = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeSmoothScrolling();
    initializeAnimations();
});

// Event Listeners
function initializeEventListeners() {
    // File type selector
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFileType = btn.dataset.type;
            updateFileInputAccept();
        });
    });

    // Upload zone events
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeFile);

    // Action buttons
    newAnalysisBtn.addEventListener('click', resetAnalysis);
    downloadReportBtn.addEventListener('click', downloadReport);

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

// File Handling
function handleDragOver(e) {
    e.preventDefault();
    uploadZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    const isValidType = validateFileType(file);
    if (!isValidType) {
        showNotification('Please select a valid file type', 'error');
        return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showNotification('File size must be less than 10MB', 'error');
        return;
    }

    currentFile = file;
    showPreview(file);
}

function validateFileType(file) {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
    
    if (currentFileType === 'image') {
        return imageTypes.includes(file.type);
    } else {
        return videoTypes.includes(file.type);
    }
}

function showPreview(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        if (currentFileType === 'image') {
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            previewVideo.classList.add('hidden');
        } else {
            previewVideo.src = e.target.result;
            previewVideo.classList.remove('hidden');
            previewImage.classList.add('hidden');
        }
        
        previewSection.classList.remove('hidden');
        scrollToElement(previewSection);
    };
    
    reader.readAsDataURL(file);
}

// Analysis
async function analyzeFile() {
    if (!currentFile) {
        showNotification('Please select a file first', 'error');
        return;
    }

    analysisStartTime = Date.now();
    showLoading(true);
    showResultsSection();

    try {
        const formData = new FormData();
        formData.append('file', currentFile);

        const response = await fetch('/api/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }

        displayResults(result);
        
    } catch (error) {
        console.error('Analysis failed:', error);
        showNotification('Analysis failed: ' + error.message, 'error');
        hideResultsSection();
    } finally {
        showLoading(false);
    }
}

function displayResults(result) {
    const resultIcon = document.getElementById('resultIcon');
    const resultLabel = document.getElementById('resultLabel');
    const resultDescription = document.getElementById('resultDescription');
    const confidenceBar = document.getElementById('confidenceBar');
    const confidenceValue = document.getElementById('confidenceValue');
    const realProb = document.getElementById('realProb');
    const fakeProb = document.getElementById('fakeProb');
    const analysisTime = document.getElementById('analysisTime');
    const resultStatus = document.getElementById('resultStatus');

    // Calculate analysis time
    const analysisDuration = ((Date.now() - analysisStartTime) / 1000).toFixed(2);
    analysisTime.textContent = `${analysisDuration}s`;

    // Update result display
    const isReal = result.label === 'REAL';
    const confidence = (result.confidence * 100).toFixed(1);
    
    // Update icon and colors
    resultIcon.className = 'result-icon';
    if (isReal) {
        resultIcon.classList.add('success');
        resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        resultLabel.textContent = 'REAL - Authentic Content';
        resultDescription.textContent = 'This media appears to be genuine and unmanipulated.';
    } else {
        resultIcon.classList.add('danger');
        resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        resultLabel.textContent = 'FAKE - Manipulated Content';
        resultDescription.textContent = 'This media shows signs of manipulation or deepfake technology.';
    }

    // Update confidence meter
    confidenceBar.style.width = `${confidence}%`;
    confidenceValue.textContent = `${confidence}%`;

    // Update probabilities
    realProb.textContent = `${(result.probs.REAL * 100).toFixed(1)}%`;
    fakeProb.textContent = `${(result.probs.FAKE * 100).toFixed(1)}%`;

    // Update status
    resultStatus.innerHTML = `
        <i class="fas fa-check-circle" style="color: ${isReal ? '#10b981' : '#ef4444'}"></i>
        <span>Analysis Complete</span>
    `;

    // Animate confidence bar
    setTimeout(() => {
        confidenceBar.style.transition = 'width 1s ease-out';
    }, 100);

    scrollToElement(resultsSection);
}

// UI Functions
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function showResultsSection() {
    resultsSection.classList.remove('hidden');
}

function hideResultsSection() {
    resultsSection.classList.add('hidden');
}

function resetAnalysis() {
    currentFile = null;
    fileInput.value = '';
    previewSection.classList.add('hidden');
    hideResultsSection();
    
    // Reset preview
    previewImage.src = '';
    previewVideo.src = '';
    
    // Scroll to upload section
    const uploadSection = document.querySelector('.upload-section');
    scrollToElement(uploadSection);
}

function downloadReport() {
    // Create a simple text report
    const resultIcon = document.getElementById('resultIcon');
    const resultLabel = document.getElementById('resultLabel');
    const confidenceValue = document.getElementById('confidenceValue');
    const realProb = document.getElementById('realProb');
    const fakeProb = document.getElementById('fakeProb');
    const analysisTime = document.getElementById('analysisTime');

    const report = `
Reality Defender - Analysis Report
================================

Result: ${resultLabel.textContent}
Confidence: ${confidenceValue.textContent}
Real Probability: ${realProb.textContent}
Fake Probability: ${fakeProb.textContent}
Analysis Time: ${analysisTime.textContent}

File: ${currentFile ? currentFile.name : 'Unknown'}
Date: ${new Date().toLocaleString()}

---
Generated by Reality Defender AI
    `.trim();

    // Create and download file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reality-defender-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility Functions
function updateFileInputAccept() {
    if (currentFileType === 'image') {
        fileInput.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    } else {
        fileInput.accept = 'video/mp4,video/avi,video/mov,video/mkv,video/webm';
    }
}

function scrollToElement(element) {
    element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        scrollToElement(targetElement);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                scrollToElement(target);
            }
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.about-card, .feature-card, .upload-card, .results-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 400px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred', 'error');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
