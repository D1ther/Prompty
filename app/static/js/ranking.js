document.addEventListener('DOMContentLoaded', function() {
    // Highlight current user and scroll to them
    const currentUserRow = document.querySelector('.ranking-table .current-user');
    if (currentUserRow) {
        currentUserRow.classList.add('highlight-animate');
        setTimeout(() => {
            currentUserRow.classList.remove('highlight-animate');
        }, 2000);
        
        // Smooth scroll to current user
        setTimeout(() => {
            currentUserRow.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        }, 300);
    }

    // Initialize search functionality
    const searchInput = document.getElementById('ranking-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.ranking-table tbody tr');
            
            rows.forEach(row => {
                const username = row.querySelector('.user-name').textContent.toLowerCase();
                if (username.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Initialize pagination
    const rowsPerPage = 10;
    const table = document.getElementById('ranking-table');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const currentPageEl = document.getElementById('current-page');
    
    if (table && prevBtn && nextBtn && currentPageEl) {
        const rows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
        let currentPage = 1;
        const totalPages = Math.ceil(rows.length / rowsPerPage);
        
        function updatePagination() {
            // Update page info
            currentPageEl.textContent = currentPage;
            
            // Disable/enable buttons
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
            
            // Show/hide rows
            const startIdx = (currentPage - 1) * rowsPerPage;
            const endIdx = startIdx + rowsPerPage;
            
            rows.forEach((row, index) => {
                if (index >= startIdx && index < endIdx) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        });
        
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
            }
        });
        
        // Initial pagination setup
        updatePagination();
    }

    // Add hover effects to table rows
    document.querySelectorAll('.ranking-table tbody tr').forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.classList.add('row-hover');
        });
        
        row.addEventListener('mouseleave', () => {
            row.classList.remove('row-hover');
        });
    });

    // Generate random gradients for avatars
    function getRandomGradient(id) {
        const colors = [
            ['#667eea', '#764ba2'],
            ['#ff758c', '#ff7eb3'],
            ['#4facfe', '#00f2fe'],
            ['#43e97b', '#38f9d7'],
            ['#fa709a', '#fee140'],
            ['#a18cd1', '#fbc2eb'],
            ['#ffc3a0', '#ffafbd'],
            ['#6a11cb', '#2575fc'],
            ['#f83600', '#f9d423'],
            ['#3f51b5', '#5c6bc0']
        ];
        
        // Use user ID to get consistent color for each user
        const colorIndex = id % colors.length;
        return `linear-gradient(135deg, ${colors[colorIndex][0]} 0%, ${colors[colorIndex][1]} 100%)`;
    }
});

// Add animation to progress bars when they come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.progress-bar');
            if (progressBar) {
                const width = progressBar.style.width;
                progressBar.style.width = '0';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.level-progress, .progress-bar-container').forEach(el => {
    observer.observe(el);
});