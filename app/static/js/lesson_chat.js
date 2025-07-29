class LessonChat {
    constructor() {
        this.websocket = null;
        this.lessonData = null;
        this.lessonId = this.getLessonIdFromUrl();
        this.initializeElements();
        this.bindEvents();
        this.connectWebSocket();
        this.addInitialMessage();
    }

    initializeElements() {
        // Chat elements
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.resultContent = document.getElementById('resultContent');
        this.charCount = document.getElementById('charCount');
        
        // Modal elements
        this.hintBtn = document.getElementById('hintBtn');
        this.hintModal = document.getElementById('hintModal');
        this.closeHintModal = document.getElementById('closeHintModal');
        
        // Create elements if they don't exist
        this.ensureElementsExist();
    }

    ensureElementsExist() {
        // Create chat messages container if it doesn't exist
        if (!this.chatMessages) {
            this.chatMessages = document.createElement('div');
            this.chatMessages.id = 'chatMessages';
            this.chatMessages.className = 'chat-messages';
            const chatPanel = document.querySelector('.chat-panel');
            if (chatPanel) {
                chatPanel.insertBefore(this.chatMessages, chatPanel.querySelector('.chat-input-container'));
            }
        }
        
        // Create result content if it doesn't exist
        if (!this.resultContent) {
            this.resultContent = document.createElement('div');
            this.resultContent.id = 'resultContent';
            this.resultContent.className = 'result-content';
            const resultPanel = document.querySelector('.result-panel');
            if (resultPanel) {
                resultPanel.appendChild(this.resultContent);
            }
        }
        
        // Create char count if it doesn't exist
        if (!this.charCount) {
            this.charCount = document.createElement('span');
            this.charCount.id = 'charCount';
            this.charCount.textContent = '0/1000';
            const inputStats = document.querySelector('.input-stats');
            if (inputStats) {
                inputStats.appendChild(this.charCount);
            }
        }
    }

    bindEvents() {
        // Chat input events
        if (this.chatInput) {
            this.chatInput.addEventListener('input', () => this.updateCharCount());
            this.chatInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }
        
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        // Modal events
        if (this.hintBtn) {
            this.hintBtn.addEventListener('click', () => this.showHint());
        }
        
        if (this.closeHintModal) {
            this.closeHintModal.addEventListener('click', () => this.hideHint());
        }
        
        if (this.hintModal) {
            this.hintModal.addEventListener('click', (e) => {
                if (e.target === this.hintModal) this.hideHint();
            });
        }

        // Initialize char count
        this.updateCharCount();
    }

    getLessonIdFromUrl() {
        const urlParts = window.location.pathname.split('/');
        return urlParts[urlParts.length - 1] || '1'; // Default to 1 if not found
    }

    addInitialMessage() {
        // Add initial system message
        this.addSystemMessage(
            "🤖 AI Асистент",
            "Вітаю! Я ваш AI асистент для вивчення промпт-інженерії. Напишіть ваш промпт і я допоможу вам його покращити!",
            "Промпт-інженерія"
        );
        
        // Show initial placeholder in result panel
        this.showResultPlaceholder();
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/chat/chat?lesson_id=${this.lessonId}`;
        
        console.log('Підключення до WebSocket:', wsUrl);
        
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
            console.log('WebSocket підключено успішно');
            this.updateConnectionStatus(true);
        };
        
        this.websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Отримано повідомлення:', data);
                
                // Перевірити чи це дані про урок
                if (data.id && data.title && data.description && !data.type) {
                    this.handleLessonData(data);
                } else {
                    this.handleWebSocketMessage(data);
                }
            } catch (error) {
                console.error('Помилка парсингу JSON:', error);
            }
        };
        
        this.websocket.onclose = (event) => {
            console.log('WebSocket з\'єднання закрито:', event.code, event.reason);
            this.updateConnectionStatus(false);
            
            // Try to reconnect after 3 seconds
            setTimeout(() => {
                if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
                    console.log('Спроба перепідключення...');
                    this.connectWebSocket();
                }
            }, 3000);
        };
        
        this.websocket.onerror = (error) => {
            console.error('WebSocket помилка:', error);
            this.updateConnectionStatus(false);
            this.updateResultStatus('error', 'Помилка підключення');
        };
    }

    handleLessonData(lessonData) {
        this.lessonData = lessonData;
        console.log('Дані про урок отримано:', lessonData);
        
        // Оновити заголовок уроку
        const titleElement = document.querySelector('.lesson-info h1');
        if (titleElement) {
            titleElement.textContent = lessonData.title;
        }
        
        // Оновити системне повідомлення
        const systemMessage = document.querySelector('.system-message');
        if (systemMessage) {
            const directlyTitle = lessonData.directly ? lessonData.directly.title : 'Невідомий напрямок';
            
            // Replace the initial message with lesson-specific data
            systemMessage.remove();
            this.addSystemMessage(
                "🤖 AI Асистент",
                `Вітаю! Я ваш AI асистент для уроку "${lessonData.title}". ${lessonData.description}`,
                directlyTitle
            );
        }
    }

    handleWebSocketMessage(data) {
        console.log('Обробка повідомлення типу:', data.type, data);
        
        switch (data.type) {
            case 'evaluation':
                console.log('Отримано evaluation:', data.evaluation);
                this.addFeedbackMessage(data.evaluation);
                break;
            case 'result':
                console.log('Отримано result:', data.content || data.result);
                this.showResult(data.content || data.result || data);
                break;
            case 'error':
                console.error('Отримано помилку від сервера:', data.message);
                this.updateResultStatus('error', data.message || 'Помилка сервера');
                this.showErrorMessage(data.message);
                break;
            default:
                console.log('Невідомий тип повідомлення:', data);
                // Якщо немає типу, але є результат - показати його
                if (data.result || data.content) {
                    console.log('Показуємо результат без типу:', data);
                    this.showResult(data);
                } else {
                    console.warn('Невідоме повідомлення без результату:', data);
                }
        }
    }

    updateConnectionStatus(connected) {
        // Додати індикатор стану підключення
        let statusIndicator = document.querySelector('.connection-status');
        if (!statusIndicator) {
            statusIndicator = document.createElement('div');
            statusIndicator.className = 'connection-status';
            
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.insertBefore(statusIndicator, headerRight.firstChild);
            } else {
                // Create header-right if it doesn't exist
                const header = document.querySelector('.chat-header');
                if (header) {
                    const headerRightDiv = document.createElement('div');
                    headerRightDiv.className = 'header-right';
                    headerRightDiv.appendChild(statusIndicator);
                    header.appendChild(headerRightDiv);
                }
            }
        }
        
        statusIndicator.style.backgroundColor = connected ? '#22c55e' : '#ef4444';
        statusIndicator.style.width = '12px';
        statusIndicator.style.height = '12px';
        statusIndicator.style.borderRadius = '50%';
        statusIndicator.style.marginRight = '0.5rem';
        statusIndicator.style.transition = 'background-color 0.3s ease';
        statusIndicator.title = connected ? 'Підключено до сервера' : 'Відключено від сервера';
    }

    updateCharCount() {
        if (!this.chatInput || !this.charCount) return;
        
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

    async sendMessage() {
        if (!this.chatInput) return;
        
        const message = this.chatInput.value.trim();
        if (!message) {
            console.log('Порожнє повідомлення');
            return;
        }

        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            console.log('Немає підключення до WebSocket');
            this.updateResultStatus('error', 'Немає підключення до сервера');
            this.showErrorMessage('Немає підключення до сервера. Спробуйте оновити сторінку.');
            return;
        }

        // Оновити статус
        this.updateResultStatus('processing', 'Обробка промпту...');

        // Додати повідомлення користувача
        this.addMessage('user', message);
        
        // Очистити input
        this.chatInput.value = '';
        this.updateCharCount();
        
        try {
            // Відправити через WebSocket
            const messageData = {
                prompt: message
            };
            
            console.log('Відправляємо повідомлення:', messageData);
            this.websocket.send(JSON.stringify(messageData));
            
        } catch (error) {
            console.error('Помилка відправки повідомлення:', error);
            this.updateResultStatus('error', 'Помилка відправки');
            this.showErrorMessage('Помилка відправки повідомлення. Спробуйте ще раз.');
        }
    }

    addSystemMessage(title, content, category) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        
        const currentTime = new Date().toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <strong>${title}</strong>
                    <span class="lesson-category">${category}</span>
                </div>
                <p>${content}</p>
                <div class="message-time">${currentTime}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

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

    addFeedbackMessage(evaluation) {
        console.log('Додавання feedback повідомлення:', evaluation);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message feedback-message';
        
        const currentTime = new Date().toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Визначити клас оцінки
        let scoreClass = 'low';
        const score = evaluation.score || 0;
        if (score >= 7) scoreClass = 'high';
        else if (score >= 4) scoreClass = 'medium';
        
        // Обробити різні формати evaluation
        let feedbackText = evaluation.feedback || evaluation.message || evaluation.text || 'Ваш промпт проаналізовано';
        let tips = evaluation.tips || evaluation.suggestions || [];
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            <div class="message-content feedback-content">
                <div class="feedback-header">
                    📊 Аналіз промпту
                </div>
                <p class="feedback-text">${feedbackText}</p>
                ${tips && tips.length > 0 ? `
                    <div class="feedback-tips">
                        <strong>💡 Рекомендації для покращення:</strong>
                        <ul>
                            ${tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="feedback-score">
                    <span class="score-label">Якість промпту:</span>
                    <span class="score-value ${scoreClass}">${score}/10</span>
                </div>
                <div class="message-time">${currentTime}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        console.log('Feedback повідомлення додано до чату');
    }

    showResult(result) {
        console.log('Показуємо результат:', result);
        
        // Оновити статус
        this.updateResultStatus('completed', 'Результат готовий');
        
        // Додати клас has-result
        this.resultContent.classList.add('has-result');
        
        // Очистити попередній результат
        this.resultContent.innerHTML = '';
        
        // Обробка різних форматів результату
        let displayText = '';
        let resultType = 'Згенерований результат';
        
        if (typeof result === 'string') {
            // Простий рядок
            displayText = result;
            resultType = 'Згенерований результат';
        } else if (result && typeof result === 'object') {
            if (result.result) {
                // Формат {"result": "content"} - найчастіший випадок для коду
                displayText = result.result;
                resultType = 'Згенерований код';
            } else if (result.content) {
                // Формат {"content": "content"}
                displayText = result.content;
                resultType = 'Згенерований текст';
            } else if (result.type === 'image') {
                // Обробка зображень
                this.showImageResult(result);
                return;
            } else if (result.type === 'text') {
                // Явно зазначений текстовий тип
                displayText = result.text || result.value || '';
                resultType = 'Згенерований текст';
            } else {
                // Невідомий формат об'єкта - показати як JSON
                displayText = JSON.stringify(result, null, 2);
                resultType = 'Результат (JSON)';
            }
        } else {
            // Якщо результат null, undefined або інший тип
            this.showResultPlaceholder();
            return;
        }
        
        // Відобразити текстовий результат
        this.showTextResult(displayText, resultType);
    }

    showTextResult(text, title) {
        // Визначити чи це код
        const isCode = this.detectCode(text);
        const language = isCode ? this.detectLanguage(text) : '';
        
        this.resultContent.innerHTML = `
            <div class="result-text">
                <div class="result-header">
                    <h3>${title}${language ? ` (${language})` : ''}</h3>
                    <div class="result-actions">
                        <button class="copy-btn" onclick="window.lessonChat.copyToClipboard(\`${this.escapeForTemplate(text)}\`)">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                            Копіювати
                        </button>
                        ${isCode ? `
                            <button class="run-btn" onclick="window.lessonChat.runCode(\`${this.escapeForTemplate(text)}\`, '${language}')">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                Запустити
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="generated-content ${isCode ? 'code-content' : 'text-content'}">
                    <pre><code class="language-${language.toLowerCase()}">${this.escapeHtml(text)}</code></pre>
                </div>
            </div>
        `;
    }

    showImageResult(result) {
        this.resultContent.innerHTML = `
            <div class="result-image-container">
                <div class="result-header">
                    <h3>Згенероване зображення</h3>
                    <div class="result-actions">
                        <a href="${result.url}" download class="download-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                            Завантажити
                        </a>
                    </div>
                </div>
                <img src="${result.url}" alt="Згенероване зображення" class="result-image" />
                ${result.description ? `<p class="image-description">${this.escapeHtml(result.description)}</p>` : ''}
            </div>
        `;
    }

    showErrorMessage(message) {
        this.resultContent.classList.add('has-result');
        this.resultContent.innerHTML = `
            <div class="result-error">
                <div class="error-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <h3>Помилка генерації</h3>
                <p>${message}</p>
                <button class="retry-btn" onclick="window.lessonChat.retryLastPrompt()">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                    </svg>
                    Спробувати знову
                </button>
            </div>
        `;
    }

    retryLastPrompt() {
        // Якщо є останній промпт - відправити його знову
        const lastUserMessage = [...this.chatMessages.querySelectorAll('.user-message')].pop();
        if (lastUserMessage) {
            const lastPrompt = lastUserMessage.querySelector('p').textContent;
            this.chatInput.value = lastPrompt;
            this.updateCharCount();
            this.sendMessage();
        }
    }

    detectCode(text) {
        // Перевірка на наявність ключових слів програмування
        const codePatterns = [
            /def\s+\w+\s*\(/,           // Python functions
            /class\s+\w+/,              // Classes
            /import\s+\w+/,             // Imports
            /from\s+\w+\s+import/,      // From imports
            /if\s+__name__\s*==\s*['"]/,// Python main
            /function\s+\w+\s*\(/,      // JavaScript functions
            /const\s+\w+\s*=/,          // JavaScript const
            /let\s+\w+\s*=/,            // JavaScript let
            /var\s+\w+\s*=/,            // JavaScript var
            /#include\s*</,             // C/C++ includes
            /public\s+class\s+\w+/,     // Java classes
            /^\s*<\?php/,               // PHP
            /^\s*<!DOCTYPE/,            // HTML
            /\{\s*".*":\s*".*"\s*\}/,   // JSON
        ];
        
        return codePatterns.some(pattern => pattern.test(text));
    }

    detectLanguage(text) {
        if (/def\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import/.test(text)) return 'Python';
        if (/function\s+\w+\s*\(|const\s+\w+\s*=|let\s+\w+\s*=/.test(text)) return 'JavaScript';
        if (/#include\s*<|int\s+main\s*\(/.test(text)) return 'C++';
        if (/public\s+class\s+\w+|System\.out\.println/.test(text)) return 'Java';
        if (/^\s*<\?php/.test(text)) return 'PHP';
        if (/^\s*<!DOCTYPE|<html/.test(text)) return 'HTML';
        if (/\{\s*".*":\s*".*"\s*\}/.test(text)) return 'JSON';
        if (/SELECT\s+.*\s+FROM|UPDATE\s+.*\s+SET/.test(text.toUpperCase())) return 'SQL';
        return '';
    }

    showResultPlaceholder() {
        this.resultContent.classList.remove('has-result');
        this.updateResultStatus('waiting', 'Очікування промпту');
        
        this.resultContent.innerHTML = `
            <div class="result-placeholder">
                <div class="placeholder-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                </div>
                <h3>Результат AI генерації</h3>
                <p>Напишіть промпт і натисніть "Відправити", щоб отримати результат від AI</p>
            </div>
        `;
    }

    updateResultStatus(status, text) {
        const indicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (indicator) {
            indicator.className = `status-indicator ${status}`;
        }
        
        if (statusText) {
            statusText.textContent = text;
        }
    }

    copyToClipboard(text) {
        // Очистити text від екранувань
        const cleanText = this.unescapeFromTemplate(text);
        
        navigator.clipboard.writeText(cleanText).then(() => {
            this.showCopySuccess();
        }).catch(err => {
            console.error('Помилка копіювання:', err);
            this.fallbackCopy(cleanText);
        });
    }

    showCopySuccess() {
        const copyBtn = event.target.closest('.copy-btn');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Скопійовано!
            `;
            copyBtn.classList.add('success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (fallbackErr) {
            console.error('Fallback копіювання також не вдалося:', fallbackErr);
        }
        
        document.body.removeChild(textArea);
    }

    runCode(code, language) {
        // Заглушка для майбутньої функціональності запуску коду
        console.log('Запуск коду:', language, code);
        
        const runBtn = event.target.closest('.run-btn');
        if (runBtn) {
            const originalText = runBtn.innerHTML;
            runBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Функція в розробці
            `;
            
            setTimeout(() => {
                runBtn.innerHTML = originalText;
            }, 2000);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeForTemplate(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$/g, '\\$');
    }

    unescapeFromTemplate(text) {
        return text
            .replace(/\\`/g, '`')
            .replace(/\\\$/g, '$')
            .replace(/\\\\/g, '\\');
    }

    showHint() {
        if (this.hintModal) {
            this.hintModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideHint() {
        if (this.hintModal) {
            this.hintModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Методи для керування WebSocket
    reconnectWebSocket() {
        if (this.websocket) {
            this.websocket.close();
        }
        setTimeout(() => {
            this.connectWebSocket();
        }, 2000);
    }

    closeWebSocket() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lessonChat = new LessonChat();
    
    // Очистити WebSocket при закритті сторінки
    window.addEventListener('beforeunload', () => {
        if (window.lessonChat) {
            window.lessonChat.closeWebSocket();
        }
    });
});