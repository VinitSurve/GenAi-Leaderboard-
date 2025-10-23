/* ===================================
   Volunteer Leaderboard Main Logic
   Handles display, updates, and interactions
   =================================== */

class VolunteerLeaderboard {
    constructor() {
        this.csvReader = new VolunteerCSVReader(VOLUNTEER_CONFIG.csvSource);
        this.volunteers = [];
        this.stats = {};
        this.autoRefreshInterval = null;
        
        this.init();
    }

    /**
     * Initialize the leaderboard
     */
    async init() {
        try {
            // Load initial data
            await this.loadData();
            
            // Start auto-refresh
            this.startAutoRefresh();
            
            // Update last refresh time
            this.updateLastRefreshTime();
            
            // Initialize animations
            if (typeof ParticleSystem !== 'undefined') {
                new ParticleSystem();
            }
            
        } catch (error) {
            console.error('Failed to initialize leaderboard:', error);
            this.showError('Failed to load volunteer data. Please refresh the page.');
        }
    }

    /**
     * Load and display data
     */
    async loadData(isRefresh = false) {
        try {
            const rawData = await this.csvReader.fetchData();
            this.volunteers = this.csvReader.processVolunteerData(rawData);
            this.stats = this.csvReader.calculateStats(this.volunteers);
            
            // Update displays
            this.updateStatsDisplay();
            this.updateLeaderboard();
            
            if (isRefresh) {
                this.showToast('✅ Data refreshed successfully!');
            }
            
            // Update last refresh time
            this.updateLastRefreshTime();
            
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    /**
     * Update statistics display
     */
    updateStatsDisplay() {
        // Total Volunteers
        const totalVolunteersEl = document.getElementById('totalVolunteers');
        if (totalVolunteersEl) {
            this.animateCounter(totalVolunteersEl, this.stats.totalVolunteers);
        }

        // Active Volunteers
        const activeVolunteersEl = document.getElementById('activeVolunteers');
        if (activeVolunteersEl) {
            this.animateCounter(activeVolunteersEl, this.stats.activeVolunteers);
        }

        // Total Courses
        const totalCoursesEl = document.getElementById('totalCourses');
        if (totalCoursesEl) {
            this.animateCounter(totalCoursesEl, this.stats.totalCourses);
        }

        // Total Credentials
        const totalCredentialsEl = document.getElementById('totalCredentials');
        if (totalCredentialsEl) {
            this.animateCounter(totalCredentialsEl, this.stats.totalCredentials);
        }

        // Total Students Helped
        const totalStudentsEl = document.getElementById('totalStudents');
        if (totalStudentsEl) {
            this.animateCounter(totalStudentsEl, this.stats.totalStudentsHelped);
        }

        // Total Impact
        const totalImpactEl = document.getElementById('totalImpact');
        if (totalImpactEl) {
            this.animateCounter(totalImpactEl, this.stats.totalImpact);
        }
    }

    /**
     * Update leaderboard table
     */
    updateLeaderboard() {
        const tbody = document.getElementById('leaderboardBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.volunteers.forEach(volunteer => {
            const row = document.createElement('tr');
            row.className = 'volunteer-row';
            
            // Add special styling for top 3
            if (volunteer.rank <= 3) {
                row.classList.add(`top-${volunteer.rank}`);
            }

            row.innerHTML = `
                <td class="rank-cell">
                    ${this.getRankBadge(volunteer.rank)}
                </td>
                <td class="name-cell">
                    <div class="volunteer-info">
                        <div class="volunteer-avatar">${this.getInitials(volunteer.name)}</div>
                        <div class="volunteer-details">
                            <div class="volunteer-name">${volunteer.name}</div>
                        </div>
                    </div>
                </td>
                <td class="courses-cell">
                    <span class="stat-number">${volunteer.coursesCompleted}</span>
                </td>
                <td class="credentials-cell">
                    <span class="stat-number">${volunteer.credentialsUsed}</span>
                </td>
                <td class="owners-cell">
                    <span class="owner-text">${volunteer.accountOwners}</span>
                </td>
                <td class="students-cell">
                    <span class="stat-number">${volunteer.studentsHelped}</span>
                </td>
                <td class="impact-cell">
                    <span class="impact-score">${volunteer.totalImpact}</span>
                    <span class="impact-label">points</span>
                </td>
                <td class="status-cell">
                    ${this.getStatusBadge(volunteer.status)}
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    /**
     * Get rank badge with trophy
     */
    getRankBadge(rank) {
        const trophies = {
            1: '🥇',
            2: '🥈',
            3: '🥉'
        };

        const trophy = trophies[rank] || '';
        return `<span class="rank-badge">${trophy} ${rank}</span>`;
    }

    /**
     * Get initials from name
     */
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }

    /**
     * Get status badge
     */
    getStatusBadge(status) {
        const badges = {
            'Core Team': '<span class="badge badge-core-team">👑 Core Team</span>',
            'Core Team Eligible': '<span class="badge badge-eligible">⭐ Eligible</span>',
            'Active': '<span class="badge badge-active">✓ Active</span>',
            'Inactive': '<span class="badge badge-inactive">○ Inactive</span>'
        };

        return badges[status] || badges['Active'];
    }

    /**
     * Get streak badge
     */
    getStreakBadge(days) {
        if (days === 0) {
            return '<span class="streak-badge">—</span>';
        }
        
        let icon = '🔥';
        if (days >= 7) icon = '🔥🔥';
        if (days >= 14) icon = '🔥🔥🔥';

        return `<span class="streak-badge">${icon} ${days}d</span>`;
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '<span class="date-today">Today</span>';
        if (diffDays === 1) return '<span class="date-yesterday">Yesterday</span>';
        if (diffDays < 7) return `<span class="date-recent">${diffDays}d ago</span>`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    /**
     * Animate counter
     */
    animateCounter(element, target) {
        const duration = 1000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * (target - start) + start);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Show toast notification
     */
    showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${message}</span>
            </div>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }
    }

    /**
     * Start auto-refresh
     */
    startAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }

        this.autoRefreshInterval = setInterval(() => {
            this.loadData(true);
        }, VOLUNTEER_CONFIG.autoRefreshInterval);
    }

    /**
     * Update last refresh time
     */
    updateLastRefreshTime() {
        const lastRefreshEl = document.getElementById('lastRefreshTime');
        if (lastRefreshEl) {
            const now = new Date();
            lastRefreshEl.textContent = now.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    }

    /**
     * Manual refresh
     */
    async refresh() {
        await this.loadData(true);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.leaderboard = new VolunteerLeaderboard();
});
