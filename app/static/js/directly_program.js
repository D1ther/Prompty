class LessonManager {
    constructor() {
        this.lessons = [];
        this.currentLesson = 0;
        this.completedLessons = new Set();
        this.modal = null;
        this.init();
    }

    init() {
        this.setupDOM();
        this.loadProgress();
        this.setupEventListeners();
        this.updateUI();
        this.animateCards();
    }

    setupDOM() {
        this.modal = document.getElementById('lesson-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.getElementById('modal-body');
        this.modalClose = document.getElementById('modal-close');
        this.modalBackdrop = document.getElementById('modal-backdrop');
        this.btnPrevious = document.getElementById('btn-previous');
        this.btnNext = document.getElementById('btn-next');
        this.btnComplete = document.getElementById('btn-complete');
        this.progressFill = document.getElementById('progress-fill');
        this.completedLessonsSpan = document.getElementById('completed-lessons');
        this.totalLessonsSpan = document.getElementById('total-lessons');
        this.progressPercentSpan = document.getElementById('progress-percent');

        // Collect all lessons
        this.lessons = Array.from(document.querySelectorAll('.lesson-card'));
    }

    loadProgress() {
        // Load from localStorage or initialize
        const saved = localStorage.getItem('prompty-lesson-progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.completedLessons = new Set(data.completed || []);
            this.currentLesson = data.current || 0;
        }
        
        // Ensure first lesson is always available
        if (this.completedLessons.size === 0) {
            this.makeAvailable(0);
        }
    }

    saveProgress() {
        const data = {
            completed: Array.from(this.completedLessons),
            current: this.currentLesson
        };
        localStorage.setItem('prompty-lesson-progress', JSON.stringify(data));
    }

    setupEventListeners() {
        // Lesson card buttons
        document.querySelectorAll('.btn-lesson').forEach((btn, index) => {
            btn.addEventListener('click', () => this.openLesson(index));
        });

        // Modal controls
        this.modalClose?.addEventListener('click', () => this.closeModal());
        this.modalBackdrop?.addEventListener('click', () => this.closeModal());
        this.btnPrevious?.addEventListener('click', () => this.previousLesson());
        this.btnNext?.addEventListener('click', () => this.nextLesson());
        this.btnComplete?.addEventListener('click', () => this.completeLesson());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal?.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        if (!this.btnPrevious?.disabled) this.previousLesson();
                        break;
                    case 'ArrowRight':
                        if (!this.btnNext?.disabled) this.nextLesson();
                        break;
                    case 'Enter':
                        if (e.ctrlKey && !this.btnComplete?.disabled) {
                            this.completeLesson();
                        }
                        break;
                }
            }
        });

        // Auto-save progress periodically
        setInterval(() => this.saveProgress(), 30000); // Every 30 seconds
    }

    animateCards() {
        // Animate cards on load
        this.lessons.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    updateUI() {
        this.lessons.forEach((card, index) => {
            const statusIcon = document.getElementById(`status-${index}`);
            const btn = card.querySelector('.btn-lesson');
            const btnText = btn?.querySelector('.btn-text');
            const progressBar = document.getElementById(`lesson-progress-${index}`);

            // Reset classes
            card.classList.remove('available', 'completed');
            
            if (this.completedLessons.has(index)) {
                // Completed lesson
                card.classList.add('completed');
                this.setStatusIcon(statusIcon, 'check');
                if (btn) {
                    btn.disabled = false;
                    btn.classList.add('completed');
                    if (btnText) btnText.textContent = 'Переглянути';
                }
                if (progressBar) progressBar.style.width = '100%';
                
            } else if (this.isLessonAvailable(index)) {
                // Available lesson
                card.classList.add('available');
                this.setStatusIcon(statusIcon, 'play');
                if (btn) {
                    btn.disabled = false;
                    btn.classList.remove('completed');
                    if (btnText) btnText.textContent = 'Почати урок';
                }
                if (progressBar) progressBar.style.width = '0%';
                
            } else {
                // Locked lesson
                this.setStatusIcon(statusIcon, 'lock');
                if (btn) {
                    btn.disabled = true;
                    btn.classList.remove('completed');
                    if (btnText) btnText.textContent = 'Заблоковано';
                }
                if (progressBar) progressBar.style.width = '0%';
            }
        });

        this.updateProgressStats();
    }

    setStatusIcon(iconElement, type) {
        if (!iconElement) return;
        
        const icons = {
            lock: iconElement.querySelector('.icon-lock'),
            play: iconElement.querySelector('.icon-play'),
            check: iconElement.querySelector('.icon-check')
        };

        // Hide all icons
        Object.values(icons).forEach(icon => {
            if (icon) icon.style.display = 'none';
        });

        // Show target icon
        if (icons[type]) {
            icons[type].style.display = 'block';
        }
    }

    updateProgressStats() {
        const completed = this.completedLessons.size;
        const total = this.lessons.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Прості оновлення без анімації (убрано animateNumber)
        if (this.completedLessonsSpan) {
            this.completedLessonsSpan.textContent = completed;
        }
        
        if (this.progressPercentSpan) {
            this.progressPercentSpan.textContent = `${percentage}%`;
        }

        if (this.progressFill) {
            setTimeout(() => {
                this.progressFill.style.width = `${percentage}%`;
            }, 300);
        }
    }

    animateNumber(element, targetNumber) {
        const currentNumber = parseInt(element.textContent) || 0;
        const increment = targetNumber > currentNumber ? 1 : -1;
        const duration = 1000;
        const steps = Math.abs(targetNumber - currentNumber);
        const stepDuration = steps > 0 ? duration / steps : 0;

        let current = currentNumber;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === targetNumber) {
                clearInterval(timer);
            }
        }, stepDuration);
    }

    isLessonAvailable(index) {
        if (index === 0) return true; // First lesson always available
        return this.completedLessons.has(index - 1); // Previous lesson must be completed
    }

    makeAvailable(index) {
        // This could be expanded to handle different unlock logic
        return this.isLessonAvailable(index);
    }

    openLesson(index) {
        if (!this.isLessonAvailable(index) && !this.completedLessons.has(index)) {
            this.showToast('Цей урок ще недоступний. Завершіть попередні уроки.', 'warning');
            return;
        }

        this.currentLesson = index;
        const lesson = this.lessons[index];
        const title = lesson.querySelector('.lesson-title')?.textContent || `Урок ${index + 1}`;
        
        this.modalTitle.textContent = title;
        this.loadLessonContent(index);
        this.updateModalButtons();
        this.showModal();
    }

    loadLessonContent(index) {
        // Simulate lesson content loading
        const lessonContents = this.generateLessonContent(index);
        this.modalBody.innerHTML = lessonContents;
        
        // Add interactive elements
        this.setupLessonInteractivity();
    }

    generateLessonContent(index) {
        const lessons = [
            {
                content: `
                    <h3>Основи створення промптів</h3>
                    <p>Промпт - це інструкція або запит, який ви даєте AI для отримання бажаного результату. Якість промпта напряму впливає на якість відповіді.</p>
                    
                    <h4>Ключові принципи:</h4>
                    <ul>
                        <li><strong>Чіткість:</strong> Формулюйте запит зрозуміло та конкретно</li>
                        <li><strong>Контекст:</strong> Надавайте необхідну інформацію</li>
                        <li><strong>Структура:</strong> Організовуйте промпт логічно</li>
                    </ul>

                    <div class="practice-section">
                        <h4>Практичне завдання:</h4>
                        <p>Спробуйте переписати цей промпт, щоб він був більш ефективним:</p>
                        <div class="code-block">
                            <code>"Напиши текст про котів"</code>
                        </div>
                        <textarea placeholder="Ваш покращений промпт..." rows="4"></textarea>
                    </div>
                `
            },
            {
                content: `
                    <h3>Структура ефективного промпта</h3>
                    <p>Кожен ефективний промпт складається з кількох ключових елементів:</p>
                    
                    <div class="structure-diagram">
                        <div class="structure-item">
                            <h4>1. Роль (Role)</h4>
                            <p>Визначте, яку роль має грати AI</p>
                            <div class="example">"Ти експерт з маркетингу..."</div>
                        </div>
                        
                        <div class="structure-item">
                            <h4>2. Завдання (Task)</h4>
                            <p>Чітко сформулюйте, що потрібно зробити</p>
                            <div class="example">"Створи план контент-маркетингу..."</div>
                        </div>
                        
                        <div class="structure-item">
                            <h4>3. Контекст (Context)</h4>
                            <p>Надайте необхідну фонову інформацію</p>
                            <div class="example">"Для стартапу в сфері технологій..."</div>
                        </div>
                        
                        <div class="structure-item">
                            <h4>4. Формат (Format)</h4>
                            <p>Вкажіть бажаний формат результату</p>
                            <div class="example">"У вигляді таблиці з 10 пунктів..."</div>
                        </div>
                    </div>

                    <div class="practice-section">
                        <h4>Практика:</h4>
                        <p>Створіть промпт за структурою RTCF для написання опису продукту:</p>
                        <textarea placeholder="Роль: Ти..." rows="6"></textarea>
                    </div>
                `
            },
            {
                content: `
                    <h3>Техніки покращення промптів</h3>
                    <p>Існує багато технік, які допомагають створювати більш ефективні промпти:</p>
                    
                    <div class="techniques-grid">
                        <div class="technique">
                            <h4>Chain of Thought</h4>
                            <p>Просіть AI показати логіку мислення</p>
                            <div class="example">"Поясни свій хід думок крок за кроком"</div>
                        </div>
                        
                        <div class="technique">
                            <h4>Few-shot Learning</h4>
                            <p>Надайте приклади бажаного результату</p>
                            <div class="example">"Ось кілька прикладів: 1)... 2)... Тепер створи схожий"</div>
                        </div>
                        
                        <div class="technique">
                            <h4>Iterative Refinement</h4>
                            <p>Поступово уточнюйте та покращуйте</p>
                            <div class="example">"Тепер зроби це більш формальним"</div>
                        </div>
                        
                        <div class="technique">
                            <h4>Temperature Control</h4>
                            <p>Контролюйте креативність відповіді</p>
                            <div class="example">"Дай точну та фактичну відповідь" або "Будь креативним"</div>
                        </div>
                    </div>

                    <div class="quiz-section">
                        <h4>Міні-квіз:</h4>
                        <div class="question">
                            <p>Яка техніка найкраще підходить для навчання AI новому завданню?</p>
                            <label><input type="radio" name="q1" value="a"> Chain of Thought</label>
                            <label><input type="radio" name="q1" value="b"> Few-shot Learning</label>
                            <label><input type="radio" name="q1" value="c"> Temperature Control</label>
                        </div>
                    </div>
                `
            }
        ];

        return lessons[index]?.content || `
            <h3>Урок ${index + 1}</h3>
            <p>Зміст уроку буде додано незабаром...</p>
            <div class="coming-soon">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 48px; height: 48px; color: #667eea;">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                </svg>
                <p>Урок у розробці</p>
            </div>
        `;
    }

    setupLessonInteractivity() {
        // Setup interactive elements in the lesson
        const textareas = this.modalBody.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', () => {
                // Auto-resize textarea
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        });

        // Setup quiz functionality
        const radioButtons = this.modalBody.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                // Provide feedback for quiz answers
                this.handleQuizAnswer(radio);
            });
        });
    }

    handleQuizAnswer(radio) {
        const question = radio.closest('.question');
        if (!question) return;

        // Remove previous feedback
        const existingFeedback = question.querySelector('.feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Add feedback based on answer
        const feedback = document.createElement('div');
        feedback.className = 'feedback';
        
        if (radio.value === 'b') { // Correct answer for the example
            feedback.innerHTML = '<span style="color: #22c55e;">✓ Правильно! Few-shot Learning чудово підходить для навчання новим завданням.</span>';
        } else {
            feedback.innerHTML = '<span style="color: #ef4444;">✗ Спробуйте ще раз. Подумайте про техніку з прикладами.</span>';
        }
        
        question.appendChild(feedback);
    }

    updateModalButtons() {
        const hasPrevious = this.currentLesson > 0;
        const hasNext = this.currentLesson < this.lessons.length - 1;
        const isCompleted = this.completedLessons.has(this.currentLesson);

        if (this.btnPrevious) {
            this.btnPrevious.disabled = !hasPrevious;
            this.btnPrevious.style.visibility = hasPrevious ? 'visible' : 'hidden';
        }

        if (this.btnNext) {
            this.btnNext.disabled = !hasNext || !isCompleted;
            this.btnNext.style.visibility = hasNext ? 'visible' : 'hidden';
        }

        if (this.btnComplete) {
            this.btnComplete.textContent = isCompleted ? 'Пройти знову' : 'Завершити урок';
        }
    }

    showModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            const firstFocusable = this.modal.querySelector('button, input, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    previousLesson() {
        if (this.currentLesson > 0) {
            this.openLesson(this.currentLesson - 1);
        }
    }

    nextLesson() {
        const nextIndex = this.currentLesson + 1;
        if (nextIndex < this.lessons.length && this.completedLessons.has(this.currentLesson)) {
            this.openLesson(nextIndex);
        }
    }

    completeLesson() {
        const wasCompleted = this.completedLessons.has(this.currentLesson);
        
        if (!wasCompleted) {
            this.completedLessons.add(this.currentLesson);
            this.showToast('Урок завершено! 🎉', 'success');
            
            // Celebrate completion
            this.celebrateCompletion();
        }
        
        this.updateUI();
        this.updateModalButtons();
        this.saveProgress();
    }

    celebrateCompletion() {
        // Add celebration animation
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.innerHTML = '🎉';
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            z-index: 10000;
            pointer-events: none;
            animation: celebrate 1s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes celebrate {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1) translateY(-100px); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            document.body.removeChild(celebration);
            document.head.removeChild(style);
        }, 1000);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const colors = {
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#667eea'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
                if (document.head.contains(style)) {
                    document.head.removeChild(style);
                }
            }, 300);
        }, 3000);
    }

    // Public method to reset progress (for testing)
    resetProgress() {
        this.completedLessons.clear();
        this.currentLesson = 0;
        localStorage.removeItem('prompty-lesson-progress');
        this.updateUI();
        this.showToast('Прогрес скинуто', 'info');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lessonManager = new LessonManager();
    
    // Add some additional CSS for lesson content
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .practice-section {
            background: rgba(102, 126, 234, 0.1);
            border: 1px solid rgba(102, 126, 234, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .practice-section h4 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        .code-block {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            font-family: 'Courier New', monospace;
        }
        
        .practice-section textarea {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 1rem;
            color: white;
            font-size: 1rem;
            resize: vertical;
            min-height: 100px;
        }
        
        .structure-diagram {
            display: grid;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .structure-item {
            background: rgba(255, 255, 255, 0.05);
            border-left: 4px solid #667eea;
            padding: 1rem;
            border-radius: 8px;
        }
        
        .structure-item h4 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        
        .example {
            background: rgba(102, 126, 234, 0.2);
            padding: 0.5rem;
            border-radius: 6px;
            margin-top: 0.5rem;
            font-style: italic;
        }
        
        .techniques-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .technique {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1rem;
        }
        
        .technique h4 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        
        .quiz-section {
            background: rgba(118, 75, 162, 0.1);
            border: 1px solid rgba(118, 75, 162, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .quiz-section h4 {
            color: #764ba2;
            margin-bottom: 1rem;
        }
        
        .question {
            margin: 1rem 0;
        }
        
        .question label {
            display: block;
            margin: 0.5rem 0;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 6px;
            transition: background 0.3s ease;
        }
        
        .question label:hover {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .question input[type="radio"] {
            margin-right: 0.5rem;
        }
        
        .feedback {
            margin-top: 1rem;
            padding: 0.75rem;
            border-radius: 6px;
            font-weight: 500;
        }
        
        .coming-soon {
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .coming-soon p {
            margin-top: 1rem;
            font-size: 1.1rem;
        }
    `;
    document.head.appendChild(additionalStyles);
});