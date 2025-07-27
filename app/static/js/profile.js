document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо дані з глобальних змінних
    const userData = window.userData;
    const totalLessons = window.totalLessons;
    
    // Розраховуємо статистику
    const completedLessons = userData.completed_lessons || [];
    const completedCount = completedLessons.length;
    const totalLessonsCount = totalLessons.length || 40;
    
    const stats = calculateUserStats(completedCount, totalLessonsCount, userData);
    
    // Оновлюємо інтерфейс
    updateProfileHeader(userData, stats);
    updateProgressCard(stats, completedCount, totalLessonsCount);
    updateStatsCard(stats);
    updateRecentLessons(completedLessons);
    updateLessonsTab(completedLessons, totalLessons);
    updateAchievements(completedCount);
    
    // Функція розрахунку статистики
    function calculateUserStats(completedCount, totalCount, userData) {
        const progressPercentage = Math.round((completedCount / totalCount) * 100) || 0;
        const totalPoints = completedCount * 25;
        
        // Використовуємо реальний рівень з бази даних або fallback
        let userLevel = "Початківець"; // За замовчуванням
        
        if (userData.level && userData.level.title) {
            userLevel = userData.level.title;
        } else {
            // Fallback: розраховуємо рівень, якщо його немає в базі
            if (completedCount >= 35) userLevel = "Майстер промптів";
            else if (completedCount >= 25) userLevel = "Експерт";
            else if (completedCount >= 15) userLevel = "Просунутий";
            else if (completedCount >= 5) userLevel = "Середній";
            else userLevel = "Початківець";
        }
        
        // Визначаємо поточний розділ
        let currentSection;
        if (completedCount < 5) currentSection = "Основи промптів";
        else if (completedCount < 15) currentSection = "Текстові промпти";
        else if (completedCount < 25) currentSection = "Промпти для зображень";
        else if (completedCount < 35) currentSection = "Просунуті техніки";
        else currentSection = "Майстер-клас";
        
        return {
            progressPercentage,
            totalPoints,
            userLevel,
            currentSection
        };
    }
    
    // Оновлення заголовка профілю
    function updateProfileHeader(userData, stats) {
        document.getElementById('user-level').textContent = stats.userLevel;
        document.getElementById('total-points').textContent = stats.totalPoints;
        document.getElementById('completed-lessons-count').textContent = completedLessons.length;
    }
    
    // Оновлення карти прогресу
    function updateProgressCard(stats, completedCount, totalCount) {
        document.getElementById('progress-percentage').textContent = `${stats.progressPercentage}%`;
        document.getElementById('progress-fill').style.width = `${stats.progressPercentage}%`;
        document.getElementById('lessons-progress').textContent = `${completedCount} з ${totalCount}`;
        document.getElementById('current-section').textContent = stats.currentSection;
    }
    
    // Оновлення статистики
    function updateStatsCard(stats) {
        document.getElementById('stat-total-points').textContent = stats.totalPoints;
    }
    
    // Оновлення останніх уроків
    function updateRecentLessons(lessons) {
        const container = document.getElementById('recent-lessons');
        const recentLessons = lessons.slice(-5); // Останні 5
        
        if (recentLessons.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <div class="activity-info">
                        <div class="activity-title">Ще немає завершених уроків</div>
                        <div class="activity-time">Розпочніть своє навчання прямо зараз!</div>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentLessons.map(lesson => `
            <div class="activity-item">
                <div class="activity-icon completed">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="activity-info">
                    <div class="activity-title">${lesson.title}</div>
                    <div class="activity-time">${lesson.description}</div>
                </div>
                <div class="activity-score">+25 балів</div>
            </div>
        `).join('');
    }
    
    // Оновлення вкладки уроків
    function updateLessonsTab(completedLessons, allLessons) {
        const container = document.getElementById('lessons-grid');
        document.getElementById('completed-count').textContent = completedLessons.length;
        
        let currentFilter = 'all';
        let lessonsToShow = allLessons;
        
        // Функція відображення уроків
        function displayLessons(lessons, filter) {
            if (lessons.length === 0) {
                container.innerHTML = `
                    <div class="lesson-card">
                        <div class="lesson-info">
                            <h4>Немає уроків для відображення</h4>
                            <p>Розпочніть своє навчання!</p>
                            <div class="lesson-meta">
                                <a href="/menu/choise-learning-program" class="btn-primary">Розпочати</a>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = lessons.map(lesson => {
                const isCompleted = completedLessons.some(cl => cl.id === lesson.id);
                const cardClass = isCompleted ? 'lesson-card completed' : 'lesson-card';
                
                return `
                    <div class="${cardClass}" data-lesson-id="${lesson.id}">
                        ${isCompleted ? `
                            <div class="lesson-status">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        ` : ''}
                        <div class="lesson-info">
                            <h4>${lesson.title}</h4>
                            <p>${lesson.description}</p>
                            <div class="lesson-meta">
                                ${isCompleted ? 
                                    '<span class="lesson-score">Завершено</span>' : 
                                    '<span class="lesson-duration">Доступний</span>'
                                }
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Обробка фільтрів
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                currentFilter = filter;
                
                // Оновлюємо активну кнопку
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Фільтруємо уроки
                let filteredLessons;
                switch(filter) {
                    case 'completed':
                        filteredLessons = completedLessons;
                        break;
                    case 'available':
                        filteredLessons = allLessons.filter(lesson => 
                            !completedLessons.some(cl => cl.id === lesson.id)
                        );
                        break;
                    default: // 'all'
                        filteredLessons = allLessons;
                }
                
                displayLessons(filteredLessons, filter);
            });
        });
        
        // Початкове відображення всіх уроків
        displayLessons(allLessons, 'all');
    }
    
    // Оновлення досягнень
    function updateAchievements(completedCount) {
        const container = document.getElementById('achievements-grid');
        const achievements = [
            {
                title: "Перші кроки",
                description: "Завершіть свій перший урок",
                threshold: 1,
                icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            },
            {
                title: "Наполегливість",
                description: "Завершіть 10 уроків",
                threshold: 10,
                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            },
            {
                title: "Експерт",
                description: "Завершіть 25 уроків",
                threshold: 25,
                icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            },
            {
                title: "Майстер",
                description: "Завершіть 35 уроків",
                threshold: 35,
                icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            }
        ];
        
        // Показуємо тільки ті досягнення, які заслужені
        const earnedAchievements = achievements.filter(achievement => 
            completedCount >= achievement.threshold
        );
        
        if (earnedAchievements.length === 0) {
            container.innerHTML = `
                <div class="no-achievements">
                    <p>Ще немає досягнень. Завершіть перший урок, щоб отримати своє перше досягнення!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = earnedAchievements.map(achievement => `
            <div class="achievement-card earned">
                <div class="achievement-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="${achievement.icon}"/>
                    </svg>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Додаємо функціональність перемикання вкладок
    const tabButtons = document.querySelectorAll('.nav-tab[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Анімація прогрес-барів
    setTimeout(() => {
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.transition = 'width 1s ease';
    }, 500);
    
    // Анімація лічильників
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .stat-value');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            if (isNaN(target)) return;
            
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = counter.textContent.replace(/\d+/, target);
                    clearInterval(timer);
                } else {
                    counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
                }
            }, 20);
        });
    }
    
    setTimeout(animateCounters, 1000);
});