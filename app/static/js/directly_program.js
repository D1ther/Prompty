class LessonManager {
    constructor() {
        this.lessons = [];
        this.currentLesson = 0;
        this.completedLessons = new Set();
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
            btn.addEventListener('click', () => this.handleLessonClick(btn));
        });

        // Auto-save progress periodically
        setInterval(() => this.saveProgress(), 30000); // Every 30 seconds
    }

    handleLessonClick(btn) {
        const lessonId = btn.getAttribute('data-lesson-id');
        const lessonIndex = parseInt(btn.getAttribute('data-lesson-index'));
        
        if (!this.isLessonAvailable(lessonIndex) && !this.completedLessons.has(lessonIndex)) {
            this.showToast('Цей урок ще недоступний. Завершіть попередні уроки.', 'warning');
            return;
        }

        // Redirect to lesson chat page
        window.location.href = `/lesson/chat/${lessonId}`;
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

    isLessonAvailable(index) {
        if (index === 0) return true; // First lesson always available
        return this.completedLessons.has(index - 1); // Previous lesson must be completed
    }

    makeAvailable(index) {
        return this.isLessonAvailable(index);
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

    // Method to mark lesson as completed (can be called from lesson chat page)
    markLessonCompleted(lessonIndex) {
        this.completedLessons.add(lessonIndex);
        this.saveProgress();
        this.updateUI();
        this.showToast('Урок завершено! 🎉', 'success');
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
});