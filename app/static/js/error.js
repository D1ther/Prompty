document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior for any anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add subtle animation on button hover
    const buttons = document.querySelectorAll('.btn-error-primary, .btn-error-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Function to create particles
    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const particles = 15;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / particles;
            const velocity = 100 + Math.random() * 50;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${x}px, ${y}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    // Add typing effect for the title
    const errorTitle = document.querySelector('.error-title');
    if (errorTitle) {
        const originalText = errorTitle.textContent;
        errorTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                errorTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing after initial animation
        setTimeout(typeWriter, 1000);
    }

    // Add dynamic background colors
    const errorBackground = document.querySelector('.error-background');
    let backgroundInterval;
    
    if (errorBackground) {
        let hue = 240;
        
        backgroundInterval = setInterval(() => {
            hue = (hue + 0.5) % 360;
            errorBackground.style.background = `
                radial-gradient(circle at 20% 50%, hsla(${hue}, 60%, 60%, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, hsla(${(hue + 30) % 360}, 60%, 60%, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, hsla(${(hue + 60) % 360}, 60%, 60%, 0.2) 0%, transparent 50%)
            `;
        }, 100);
    }

    // Handle error number interactions
    const errorNumber = document.querySelector('.error-number');
    if (errorNumber) {
        // Click effect for particles
        errorNumber.addEventListener('click', function() {
            createParticles(this);
        });

        // Hover effects for glitch
        errorNumber.addEventListener('mouseenter', function() {
            this.style.animation = 'gradientShift 3s ease-in-out infinite, bounce 2s ease-in-out infinite, glitch 0.3s ease-in-out';
        });
        
        errorNumber.addEventListener('mouseleave', function() {
            this.style.animation = 'gradientShift 3s ease-in-out infinite, bounce 2s ease-in-out infinite';
        });

        // Add cursor pointer
        errorNumber.style.cursor = 'pointer';
    }

    // Cleanup function for performance
    window.addEventListener('beforeunload', function() {
        if (backgroundInterval) {
            clearInterval(backgroundInterval);
        }
    });
});

// Add glitch keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0% { transform: translateY(0) translateX(0) skewX(0); }
        20% { transform: translateY(-2px) translateX(-2px) skewX(1deg); }
        40% { transform: translateY(2px) translateX(2px) skewX(-1deg); }
        60% { transform: translateY(-1px) translateX(-1px) skewX(0.5deg); }
        80% { transform: translateY(1px) translateX(1px) skewX(-0.5deg); }
        100% { transform: translateY(0) translateX(0) skewX(0); }
    }
`;
document.head.appendChild(style);