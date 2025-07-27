document.addEventListener('DOMContentLoaded', function() {
    // Matrix rain effect
    createMatrixRain();
    
    // Step cards animation
    animateStepCards();
    
    // Evil laugh audio (optional)
    addEvilInteractions();
    
    // Glitch text effects
    enhanceGlitchEffect();
});

function createMatrixRain() {
    const matrix = document.getElementById('matrix');
    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$@#%&*()+=<>?[]{}|';
    
    function createColumn() {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.top = '-100px';
        column.style.left = Math.random() * 100 + '%';
        column.style.color = '#00ff41';
        column.style.fontSize = '14px';
        column.style.fontFamily = 'monospace';
        column.style.opacity = '0.8';
        column.style.whiteSpace = 'nowrap';
        column.style.pointerEvents = 'none';
        
        let text = '';
        for (let i = 0; i < 20; i++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = text;
        
        matrix.appendChild(column);
        
        const duration = Math.random() * 3000 + 2000;
        column.animate([
            { transform: 'translateY(-100px)', opacity: 0 },
            { transform: 'translateY(0px)', opacity: 0.8 },
            { transform: 'translateY(100vh)', opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => {
            column.remove();
        };
    }
    
    // Create columns periodically
    setInterval(createColumn, 300);
}

function animateStepCards() {
    const cards = document.querySelectorAll('.step-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `slideInUp 0.8s ease forwards`;
                }, index * 200);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        observer.observe(card);
    });
}

function addEvilInteractions() {
    const stepCards = document.querySelectorAll('.step-card');
    const evilPhrases = [
        "Ваші дані вже в нашій базі...",
        "Ми знаємо, де ви живете 👁️",
        "Ваша банківська картка цікавить нас...",
        "Підписка автоматично продовжиться назавжди",
        "Ваша душа тепер належить нам",
        "Відписатися неможливо. Навіки."
    ];
    
    stepCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // Add evil glow
            card.style.boxShadow = '0 0 50px rgba(204, 0, 0, 0.8)';
            
            // Show evil message
            if (!card.querySelector('.evil-message')) {
                const message = document.createElement('div');
                message.className = 'evil-message';
                message.style.cssText = `
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
                    animation: fadeIn 0.3s ease;
                `;
                message.textContent = evilPhrases[index] || evilPhrases[0];
                card.appendChild(message);
                
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 3000);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
    
    // Evil click counter
    let clickCount = 0;
    document.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 10) {
            showEvilPopup();
        }
    });
}

function showEvilPopup() {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #cc0000, #800000);
        color: white;
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 0 100px rgba(204, 0, 0, 0.8);
        border: 2px solid #ff0000;
        max-width: 400px;
        animation: evilPopup 0.5s ease;
    `;
    
    popup.innerHTML = `
        <h3 style="margin: 0 0 15px 0; font-size: 24px;">👹 ПОПАВСЯ!</h3>
        <p style="margin: 0 0 20px 0;">
            Ми рахуємо ваші кліки! Це частина нашого плану зі збору даних.
        </p>
        <button onclick="this.parentNode.remove()" style="
            background: #000;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
        ">Закрити (якщо дозволимо)</button>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentNode) {
            popup.remove();
        }
    }, 5000);
}

function enhanceGlitchEffect() {
    const glitchElement = document.querySelector('.glitch');
    
    setInterval(() => {
        if (Math.random() < 0.1) {
            glitchElement.style.animation = 'none';
            setTimeout(() => {
                glitchElement.style.animation = 'glitch 2s infinite';
            }, 100);
        }
    }, 2000);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes evilPopup {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(180deg);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
        }
    }
    
    .evil-message {
        animation: fadeIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// Konami code for extra evil
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateUltimateEvil();
    }
});

function activateUltimateEvil() {
    document.body.style.filter = 'invert(1) hue-rotate(180deg)';
    document.body.style.animation = 'shake 0.5s infinite';
    
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBzuW3u/JeSkHImzB8diHNQgRYsTr5Z9NEAxVqOPwt2QdBy6Oy+DwxmwfCFOmudOjdhwLUp/a5LNgGwtWnSz/Q==');
    audio.play().catch(() => {});
    
    setTimeout(() => {
        document.body.style.filter = '';
        document.body.style.animation = '';
    }, 3000);
    
    alert('🎉 Вітаємо! Ви знайшли секретний код. Тепер ми точно заберемо всі ваші дані! 😈');
}