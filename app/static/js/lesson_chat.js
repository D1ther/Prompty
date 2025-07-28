class LessonChat {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.lessonId = this.getLessonIdFromUrl();
    }

    initializeElements() {
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.resultContent = document.getElementById('resultContent');
        this.charCount = document.getElementById('charCount');
        
        // Modal elements
        this.hintBtn = document.getElementById('hintBtn');
        this.hintModal = document.getElementById('hintModal');
        this.closeHintModal = document.getElementById('closeHintModal');
    }

    bindEvents() {
        // Chat input events
        this.chatInput.addEventListener('input', () => this.updateCharCount());
        this.chatInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Modal events
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.closeHintModal.addEventListener('click', () => this.hideHint());
        this.hintModal.addEventListener('click', (e) => {
            if (e.target === this.hintModal) this.hideHint();
        });
        
        // Initialize char count
        this.updateCharCount();
    }

    getLessonIdFromUrl() {
        const urlParts = window.location.pathname.split('/');
        return urlParts[urlParts.length - 1];
    }

    updateCharCount() {
        const length = this.chatInput.value.length;
        this.charCount.textContent = `${length}/1000`;
        
        if (length > 800) {
            this.charCount.style.color = '#f87171';
        } else if (length > 600) {
            this.charCount.style.color = '#fbbf24';
        } else {
            this.charCount.style.color = 'rgba(255, 255, 255, 0.5)';
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    // Заготовка для відправки повідомлення
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Додати повідомлення користувача
        this.addMessage('user', message);
        
        // Очистити input
        this.chatInput.value = '';
        this.updateCharCount();
        
        // ТУТ БУДЕ ВАША ЛОГІКА ОБРОБКИ ПРОМПТУ
        console.log('Промпт для обробки:', message);
        console.log('ID уроку:', this.lessonId);
    }

    // Заготовка для додавання повідомлень
    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const currentTime = new Date().toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const avatarIcon = type === 'user' 
            ? '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>'
            : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    ${avatarIcon}
                </svg>
            </div>
            <div class="message-content">
                <p>${content}</p>
                <div class="message-time">${currentTime}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    // Заготовка для додавання повідомлення зворотного зв'язку
    addFeedbackMessage(feedback) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message feedback-message';
        
        const currentTime = new Date().toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            <div class="message-content feedback-content">
                <div class="feedback-header">
                    <strong>📊 Зворотний зв'язок</strong>
                </div>
                <p class="feedback-text">${feedback.message}</p>
                ${feedback.tips ? `
                    <div class="feedback-tips">
                        <strong>💡 Поради:</strong>
                        <ul>
                            ${feedback.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="feedback-score">
                    <span class="score-label">Оцінка промпту:</span>
                    <span class="score-value ${feedback.score_class}">${feedback.score}/10</span>
                </div>
                <div class="message-time">${currentTime}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    // Заготовка для показу результату
    showResult(result) {
        if (result.type === 'image') {
            this.resultContent.innerHTML = `
                <img src="${result.url}" alt="Згенероване зображення" class="result-image" />
            `;
        } else if (result.type === 'text') {
            this.resultContent.innerHTML = `
                <div class="result-text">
                    <h3>Згенерований текст</h3>
                    <div class="generated-content">
                        ${result.content}
                    </div>
                </div>
            `;
        }
    }

    showHint() {
        this.hintModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideHint() {
        this.hintModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lessonChat = new LessonChat();
});