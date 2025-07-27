document.addEventListener('DOMContentLoaded', function() {
    // Evil particles animation
    createEvilParticles();
    
    // Animate statistics counters
    animateCounters();
    
    // Add evil interactions
    addEvilInteractions();
    
    // Power meter animation
    animatePowerMeter();
    
    // Secret evil mode
    addSecretEvilMode();
    
    // Tab switching
    setupTabs();
});

function createEvilParticles() {
    const container = document.getElementById('evilParticles');
    if (!container) return;
    
    const particles = ['👹', '💀', '🔥', '⚡', '💸', '👁️', '🕷️', '🦇'];
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 10}px;
            left: ${Math.random() * 100}%;
            top: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.7;
        `;
        
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        container.appendChild(particle);
        
        const duration = Math.random() * 3000 + 2000;
        const drift = (Math.random() - 0.5) * 200;
        
        particle.animate([
            { 
                transform: `translateY(0px) translateX(0px) rotate(0deg)`, 
                opacity: 0 
            },
            { 
                transform: `translateY(-50vh) translateX(${drift}px) rotate(180deg)`, 
                opacity: 0.7 
            },
            { 
                transform: `translateY(-100vh) translateX(${drift * 2}px) rotate(360deg)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'ease-out'
        }).onfinish = () => {
            particle.remove();
        };
    }
    
    // Create particles continuously
    setInterval(createParticle, 500);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let current = 0;
                const increment = target / 100;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString();
                        clearInterval(timer);
                        
                        // Add evil effect when counter finishes
                        counter.style.animation = 'evil-pulse 0.5s ease';
                        setTimeout(() => {
                            counter.style.animation = '';
                        }, 500);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                }, 50);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function addEvilInteractions() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        // Add evil hover effects
        card.addEventListener('mouseenter', () => {
            // Create evil whispers
            if (Math.random() < 0.3) {
                showEvilWhisper(card);
            }
            
            // Add screen shake effect
            if (card.getAttribute('data-evil') === 'ultimate') {
                document.body.style.animation = 'shake 0.3s ease';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 300);
            }
        });
        
        // Click effects
        card.addEventListener('click', () => {
            showEvilEffect(card);
        });
    });
}

function showEvilWhisper(card) {
    const whispers = [
        "Твоя душа наша...",
        "Опір безглуздий...",
        "Ми бачимо все...",
        "Приєднайся до темряви...",
        "Твої гроші вже наші...",
        "Не можна втекти..."
    ];
    
    const whisper = document.createElement('div');
    whisper.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(204, 0, 0, 0.9);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: bold;
        z-index: 10;
        animation: fadeInOut 3s ease;
        pointer-events: none;
    `;
    
    whisper.textContent = whispers[Math.floor(Math.random() * whispers.length)];
    card.appendChild(whisper);
    
    setTimeout(() => {
        if (whisper.parentNode) {
            whisper.remove();
        }
    }, 3000);
}

function showEvilEffect(card) {
    // Create red glow effect
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(204, 0, 0, 0.3), transparent);
        pointer-events: none;
        z-index: 5;
        animation: evilGlow 0.5s ease;
    `;
    
    card.appendChild(glow);
    
    setTimeout(() => {
        glow.remove();
    }, 500);
}

function animatePowerMeter() {
    const meter = document.getElementById('powerMeter');
    if (!meter) return;
    
    let power = 0;
    const maxPower = 99.9;
    
    const interval = setInterval(() => {
        power += 0.1;
        if (power >= maxPower) {
            power = maxPower;
            clearInterval(interval);
            
            // Evil completion effect
            meter.style.animation = 'evil-pulse 2s infinite';
        }
        meter.textContent = power.toFixed(1) + '%';
    }, 20);
}

function addSecretEvilMode() {
    let clickCount = 0;
    const evilTexts = document.querySelectorAll('.evil-text');
    
    evilTexts.forEach(text => {
        text.addEventListener('click', () => {
            clickCount++;
            
            if (clickCount === 3) {
                activateEvilMode();
            }
        });
    });
}

function activateEvilMode() {
    // Change page theme to ultra evil
    document.body.style.filter = 'hue-rotate(180deg) saturate(2)';
    document.body.style.animation = 'shake 0.5s infinite';
    
    // Show evil message
    const evilOverlay = document.createElement('div');
    evilOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(204, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: evilReveal 2s ease;
    `;
    
    evilOverlay.innerHTML = `
        <div style="text-align: center; color: white;">
            <h1 style="font-size: 4rem; margin-bottom: 1rem;">👹 EVIL MODE ACTIVATED 👹</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">Тепер ви бачите нашу справжню природу!</p>
            <button onclick="deactivateEvilMode()" style="
                background: #000;
                color: #fff;
                border: 2px solid #fff;
                padding: 15px 30px;
                font-size: 1.2rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
            ">Повернутися (якщо дозволимо)</button>
        </div>
    `;
    
    document.body.appendChild(evilOverlay);
    
    // Play evil laugh (if audio is enabled)
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBzuW3u/JeSkHImzB8diHNQgRYsTr5Z9NEAxVqOPwt2QdBy6Oy+DwxmwfCFOmudOjdhwLUp/a5LNgGwtWn');
        audio.play().catch(() => {});
    } catch (e) {}
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Global function for deactivating evil mode
window.deactivateEvilMode = function() {
    document.body.style.filter = '';
    document.body.style.animation = '';
    
    const overlay = document.querySelector('[style*="z-index: 9999"]');
    if (overlay) {
        overlay.remove();
    }
};

// Premium package functions
window.sellSoul = function() {
    alert('🎉 Чудово! Ваша душа продана, але ви отримали доступ до преміум навчання!\n\n📚 Тепер ви можете вивчити:\n• Професійний промптінг\n• AI-автоматизацію\n• Творчі техніки\n\n👹 Бонус: Повний контроль над вашим життям!\n\nДякуємо за вибір! 😈');
    
    // Add visual effect
    document.body.style.background = 'linear-gradient(45deg, #cc0000, #000000)';
    setTimeout(() => {
        document.body.style.background = '';
    }, 3000);
};

window.runAway = function() {
    const messages = [
        'Ви не можете втекти! 👹',
        'Ми вже знаємо де ви! 👁️',
        'Ваші дані вже наші! 💾',
        'Втеча неможлива! ⛓️',
        'Приєднайтеся до темряви! 🌑'
    ];
    
    let messageIndex = 0;
    const showMessage = () => {
        if (messageIndex < messages.length) {
            alert(messages[messageIndex]);
            messageIndex++;
            setTimeout(showMessage, 1000);
        } else {
            alert('😅 Окей, окей... Ви можете йти. Але ми будемо чекати на ваше повернення! 😈');
        }
    };
    
    showMessage();
};

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(10px); }
        50% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes evilGlow {
        0% { opacity: 0; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.1); }
        100% { opacity: 0; transform: scale(1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes evilReveal {
        0% { 
            opacity: 0; 
            transform: scale(0) rotate(180deg); 
        }
        50% { 
            opacity: 1; 
            transform: scale(1.1) rotate(0deg); 
        }
        100% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
        }
    }
`;
document.head.appendChild(style);