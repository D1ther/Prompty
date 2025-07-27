/**
 * Choice Mode Page - Enhanced interactions with site consistency
 */

document.addEventListener('DOMContentLoaded', function() {
    initModeSelection();
    initAnimations();
    initAccessibility();
});

/**
 * Initialize mode selection interactions
 */
function initModeSelection() {
    const modeOptions = document.querySelectorAll('.mode-option');
    
    modeOptions.forEach((option, index) => {
        // Enhanced hover effects
        option.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px)';
            
            // Animate icon
            const icon = this.querySelector('.option-icon');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(8deg)';
            }
        });
        
        option.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-8px)';
            
            // Reset icon
            const icon = this.querySelector('.option-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

/**
 * Initialize scroll animations
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(card);
    });
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    const modeOptions = document.querySelectorAll('.mode-option');
    
    // Add keyboard navigation
    modeOptions.forEach((option, index) => {
        option.setAttribute('tabindex', '0');
        option.setAttribute('role', 'button');
        
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = this.querySelector('.select-btn');
                if (button) {
                    window.location.href = button.href;
                }
            }
        });
        
        // Focus styles
        option.addEventListener('focus', function() {
            this.style.outline = '2px solid rgba(102, 126, 234, 0.8)';
            this.style.outlineOffset = '4px';
        });
        
        option.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Button focus improvements
    const selectButtons = document.querySelectorAll('.select-btn');
    selectButtons.forEach(button => {
        button.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.2)';
        });
        
        button.addEventListener('blur', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}