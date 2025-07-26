/**
 * Choice Mode Page JavaScript
 * Handles mode selection, interactions, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initModeSelection();
    initTrialButtons();
    initHoverEffects();
    initAnimations();
});

/**
 * Handle mode selection buttons
 */
function initModeSelection() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const mode = this.dataset.mode;
            const buttonText = this.querySelector('span').textContent;
            
            // Add loading state
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';
            
            // Show confirmation or redirect
            if (confirm(`Ви обрали режим "${buttonText}". Продовжити?`)) {
                // Add transition effect
                document.body.style.opacity = '0.8';
                
                // Redirect after short delay for visual feedback
                setTimeout(() => {
                    window.location.href = `/modes/${mode}`;
                }, 300);
            } else {
                // Reset button state
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';
            }
        });

        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Handle trial and recommendation buttons
 */
function initTrialButtons() {
    // Try all modes button
    const tryAllButton = document.getElementById('try-all');
    if (tryAllButton) {
        tryAllButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading animation
            this.innerHTML = '<span>Завантаження...</span>';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                window.location.href = '/trial';
            }, 500);
        });
    }

    // Get recommendation button
    const recommendationButton = document.getElementById('get-recommendation');
    if (recommendationButton) {
        recommendationButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading animation
            this.innerHTML = '<span>Підготовка тесту...</span>';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                window.location.href = '/recommendation-quiz';
            }, 500);
        });
    }
}

/**
 * Add enhanced hover effects for mode cards
 */
function initHoverEffects() {
    const modeCards = document.querySelectorAll('.mode-card');
    
    modeCards.forEach(card => {
        // Mouse enter effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Add glow effect
            const cardType = this.classList.contains('learning') ? 'learning' : 
                           this.classList.contains('creative') ? 'creative' : 'coding';
            
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Enhance icon animation
            const icon = this.querySelector('.mode-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        // Mouse leave effect
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            // Reset icon
            const icon = this.querySelector('.mode-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });

        // Add focus support for accessibility
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '4px';
        });

        card.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

/**
 * Initialize page animations
 */
function initAnimations() {
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe mode cards
    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        cardObserver.observe(card);
    });

    // Animate comparison table
    const comparisonTable = document.querySelector('.comparison-table');
    if (comparisonTable) {
        const tableObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateTableRows();
                }
            });
        }, observerOptions);

        tableObserver.observe(comparisonTable);
    }
}

/**
 * Animate table rows
 */
function animateTableRows() {
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach((row, index) => {
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 100);
        
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
}

/**
 * Add smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Handle mobile responsiveness
 */
function initMobileOptimizations() {
    // Add touch support for cards
    const modeCards = document.querySelectorAll('.mode-card');
    
    modeCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-5px) scale(1.01)';
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 150);
        });
    });
}

/**
 * Add loading states and error handling
 */
function addLoadingStates() {
    const buttons = document.querySelectorAll('.mode-btn, .btn-primary-large, .btn-secondary-large');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add loading spinner
            const originalContent = this.innerHTML;
            this.dataset.originalContent = originalContent;
            
            this.innerHTML = `
                <div class="loading-spinner"></div>
                <span>Завантаження...</span>
            `;
            
            // Reset after timeout if navigation fails
            setTimeout(() => {
                if (this.dataset.originalContent) {
                    this.innerHTML = this.dataset.originalContent;
                    delete this.dataset.originalContent;
                }
            }, 5000);
        });
    });
}

/**
 * Initialize keyboard navigation
 */
function initKeyboardNavigation() {
    let currentCardIndex = 0;
    const modeCards = document.querySelectorAll('.mode-card');
    
    document.addEventListener('keydown', function(e) {
        // Arrow key navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            currentCardIndex = (currentCardIndex + 1) % modeCards.length;
            modeCards[currentCardIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            currentCardIndex = currentCardIndex > 0 ? currentCardIndex - 1 : modeCards.length - 1;
            modeCards[currentCardIndex].focus();
        }
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initMobileOptimizations();
    addLoadingStates();
    initKeyboardNavigation();
});

// Add CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #ffffff;
        animation: spin 1s ease-in-out infinite;
        display: inline-block;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);