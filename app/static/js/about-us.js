document.addEventListener('DOMContentLoaded', function() {
    // Evil cursor trail effect
    createEvilCursorTrail();
    
    // Animate stats on scroll
    animateStatsOnScroll();
    
    // Add evil hover effects to team members
    addTeamMemberEffects();
    
    // Create floating demons
    createFloatingDemons();
    
    // Add evil sounds to buttons (if user wants)
    addEvilSounds();
    
    // Animate chart bars
    animateChartBars();
});

function createEvilCursorTrail() {
    const trail = [];
    const trailLength = 10;
    
    document.addEventListener('mousemove', function(e) {
        trail.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });
        
        if (trail.length > trailLength) {
            trail.shift();
        }
        
        // Remove old trail elements
        document.querySelectorAll('.evil-trail').forEach(el => {
            if (Date.now() - parseInt(el.dataset.time) > 1000) {
                el.remove();
            }
        });
        
        // Create new trail element occasionally
        if (Math.random() < 0.1) {
            const trailElement = document.createElement('div');
            trailElement.className = 'evil-trail';
            trailElement.style.cssText = `
                position: fixed;
                pointer-events: none;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #FF4500, transparent);
                border-radius: 50%;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                z-index: 9999;
                animation: fadeOutTrail 1s ease-out forwards;
            `;
            trailElement.dataset.time = Date.now();
            document.body.appendChild(trailElement);
        }
    });
    
    // Add CSS for trail animation
    if (!document.querySelector('#evilTrailStyle')) {
        const style = document.createElement('style');
        style.id = 'evilTrailStyle';
        style.textContent = `
            @keyframes fadeOutTrail {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.5); }
            }
        `;
        document.head.appendChild(style);
    }
}

function animateStatsOnScroll() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                if (finalValue === '∞') return;
                
                animateNumber(target, 0, parseInt(finalValue) || 666, 2000);
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for evil effect
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * eased);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
            // Add evil glow effect when animation completes
            element.style.textShadow = '0 0 20px rgba(255, 69, 0, 0.8)';
            setTimeout(() => {
                element.style.textShadow = '0 0 10px rgba(255, 69, 0, 0.5)';
            }, 500);
        }
    }
    
    requestAnimationFrame(update);
}

function addTeamMemberEffects() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            const emoji = this.querySelector('.demon-emoji');
            const originalEmoji = emoji.textContent;
            
            // Change to evil version on hover
            const evilEmojis = ['👹', '💀', '👺', '😈', '🔥'];
            emoji.textContent = evilEmojis[Math.floor(Math.random() * evilEmojis.length)];
            
            // Add shake animation
            emoji.style.animation = 'evilShake 0.5s ease-in-out infinite';
            
            // Restore original on mouse leave
            this.addEventListener('mouseleave', function() {
                emoji.textContent = originalEmoji;
                emoji.style.animation = 'float 3s ease-in-out infinite';
            }, { once: true });
        });
    });
}

function createFloatingDemons() {
    const demonCount = 5;
    const demons = ['👹', '💀', '👻', '🔥', '⚡'];
    
    for (let i = 0; i < demonCount; i++) {
        const demon = document.createElement('div');
        demon.className = 'floating-demon';
        demon.textContent = demons[Math.floor(Math.random() * demons.length)];
        demon.style.cssText = `
            position: fixed;
            font-size: 2rem;
            opacity: 0.1;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: floatAround ${10 + Math.random() * 10}s linear infinite;
        `;
        document.body.appendChild(demon);
    }
    
    // Add floating animation
    if (!document.querySelector('#floatingStyle')) {
        const style = document.createElement('style');
        style.id = 'floatingStyle';
        style.textContent = `
            @keyframes floatAround {
                0% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(50px, -30px) rotate(90deg); }
                50% { transform: translate(-30px, 50px) rotate(180deg); }
                75% { transform: translate(-50px, -20px) rotate(270deg); }
                100% { transform: translate(0, 0) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function addEvilSounds() {
    const buttons = document.querySelectorAll('.btn-evil-primary, .btn-evil-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Create evil hover sound effect (web audio)
            playEvilSound('hover');
        });
        
        button.addEventListener('click', function() {
            playEvilSound('click');
            
            // Add visual effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

function playEvilSound(type) {
    // Simple web audio API sound generation
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'hover') {
        // Low frequency rumble
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'click') {
        // Evil click sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

function animateChartBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const height = bar.style.height;
                
                // Reset and animate
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.height = height;
                    bar.style.transition = 'height 2s ease-out';
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    });
    
    chartBars.forEach(bar => observer.observe(bar));
}

// Easter egg: Konami code for extra evil effects
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konami.length && 
        konamiCode.every((code, index) => code === konami[index])) {
        activateUltimateEvilMode();
        konamiCode = [];
    }
});

function activateUltimateEvilMode() {
    // Screen shake
    document.body.style.animation = 'evilShake 0.5s ease-in-out 5';
    
    // Change all text to red temporarily
    document.body.style.filter = 'hue-rotate(0deg) contrast(1.5)';
    
    // Add more floating demons
    for (let i = 0; i < 20; i++) {
        setTimeout(() => createFloatingDemons(), i * 100);
    }
    
    // Show evil message
    const evilMessage = document.createElement('div');
    evilMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(139, 0, 0, 0.9);
        border: 2px solid #FF4500;
        color: #ffffff;
        padding: 2rem;
        border-radius: 12px;
        font-size: 2rem;
        font-weight: bold;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 0 50px rgba(255, 69, 0, 0.8);
    `;
    evilMessage.innerHTML = '🔥 ULTIMATE EVIL MODE ACTIVATED! 🔥<br><small>Your soul is now 100% ours!</small>';
    document.body.appendChild(evilMessage);
    
    setTimeout(() => {
        evilMessage.remove();
        document.body.style.animation = '';
        document.body.style.filter = '';
    }, 3000);
}

// Add some fun interactions
document.addEventListener('click', function(e) {
    // Random evil effects on click
    if (Math.random() < 0.05) { // 5% chance
        const clickEffect = document.createElement('div');
        clickEffect.textContent = ['💀', '🔥', '⚡', '👹'][Math.floor(Math.random() * 4)];
        clickEffect.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: 2rem;
            pointer-events: none;
            z-index: 9999;
            animation: explode 1s ease-out forwards;
        `;
        document.body.appendChild(clickEffect);
        
        setTimeout(() => clickEffect.remove(), 1000);
    }
});

// Add explode animation
if (!document.querySelector('#explodeStyle')) {
    const style = document.createElement('style');
    style.id = 'explodeStyle';
    style.textContent = `
        @keyframes explode {
            0% { 
                transform: translate(-50%, -50%) scale(0) rotate(0deg); 
                opacity: 1; 
            }
            100% { 
                transform: translate(-50%, -50%) scale(2) rotate(360deg); 
                opacity: 0; 
            }
        }
    `;
    document.head.appendChild(style);
}