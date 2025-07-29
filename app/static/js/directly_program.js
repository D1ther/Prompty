class LessonManager {
    constructor() {
        this.lessons = [];
        this.completedLessons = new Set(window.completedLessonsData || []);
        this.init();
    }

    init() {
        this.setupDOM();
        this.updateUI();
        this.setupEventListeners();
        this.animateCards();
    }

    setupDOM() {
        this.progressFill = document.getElementById('progress-fill');
        this.completedLessonsSpan = document.getElementById('completed-lessons');
        this.totalLessonsSpan = document.getElementById('total-lessons');
        this.progressPercentSpan = document.getElementById('progress-percent');
        this.lessons = Array.from(document.querySelectorAll('.lesson-card'));
    }

    setupEventListeners() {
        document.querySelectorAll('.btn-lesson').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                if (btn.disabled) {
                    e.preventDefault();
                    return false;
                }
                const lessonId = btn.getAttribute('data-lesson-id');
                window.location.href = `/lesson/chat/${lessonId}`;
            });
        });
    }

    animateCards() {
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
            const lessonId = parseInt(card.getAttribute('data-lesson-id'));
            const statusIcon = document.getElementById(`status-${index}`);
            const btn = card.querySelector('.btn-lesson');
            const btnText = btn?.querySelector('.btn-text');
            const progressBar = document.getElementById(`lesson-progress-${index}`);

            card.classList.remove('available', 'completed');
            btn.classList.remove('completed');
            btn.disabled = false;

            if (this.completedLessons.has(lessonId)) {
                card.classList.add('completed');
                btn.classList.add('completed');
                btn.disabled = true;
                if (btnText) btnText.textContent = 'Завершено';
                this.setStatusIcon(statusIcon, 'check');
                if (progressBar) progressBar.style.width = '100%';
            } else {
                card.classList.add('available');
                btn.disabled = false;
                if (btnText) btnText.textContent = 'Почати урок';
                this.setStatusIcon(statusIcon, 'play');
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
        Object.values(icons).forEach(icon => {
            if (icon) icon.style.display = 'none';
        });
        if (icons[type]) {
            icons[type].style.display = 'block';
        }
    }

    updateProgressStats() {
        const completed = this.lessons.filter(card => card.classList.contains('completed')).length;
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
}

document.addEventListener('DOMContentLoaded', () => {
    window.lessonManager = new LessonManager();
});