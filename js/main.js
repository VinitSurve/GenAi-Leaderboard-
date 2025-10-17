/* ===================================
   Main JavaScript Logic
   Handles search, filter, sort, auto-refresh,
   theme toggle, and export functionality
   =================================== */

// Main Application Class
class LeaderboardApp {
    constructor() {
        this.csvReader = new CSVReader("Bharati Vidyapeeth's Department of Management Studies - Navi Mumbai, India [16 Oct].csv");
        this.allData = [];
        this.filteredData = [];
        this.currentFilter = 'all';
        this.currentSort = 'rank';
        this.searchQuery = '';
        this.autoRefreshInterval = null;
        this.refreshIntervalMs = 60000; // 60 seconds
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Handle logo display
            this.handleLogoDisplay();
            
            // Load initial data
            await this.loadData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize theme (force dark)
            this.initTheme();
            
            // Start auto-refresh
            this.startAutoRefresh();
            
            // Update last refresh time
            this.updateLastRefreshTime();
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showToast('❌ Failed to load leaderboard data', 'error');
        }
    }

    /**
     * Handle logo display - hide divider if chapter logo fails
     */
    handleLogoDisplay() {
        const chapterLogo = document.querySelector('.chapter-logo');
        const logoDivider = document.getElementById('logoDivider');
        
        if (chapterLogo && logoDivider) {
            chapterLogo.addEventListener('error', () => {
                logoDivider.style.display = 'none';
            });
            
            chapterLogo.addEventListener('load', () => {
                logoDivider.style.display = 'block';
            });
        }
    }

    /**
     * Load and display data
     */
    async loadData(isRefresh = false) {
        try {
            const data = await this.csvReader.fetchData();
            
            if (isRefresh) {
                // Detect rank changes
                this.allData = this.csvReader.detectRankChanges(data);
                this.showToast('✅ Leaderboard updated!', 'success');
            } else {
                this.allData = data;
            }
            
            // Calculate and update statistics
            const stats = this.csvReader.calculateStats(this.allData);
            CounterAnimation.updateStats(stats);
            
            // Apply current filters
            this.applyFilters();
            
            // Update last refresh time
            this.updateLastRefreshTime();
            
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    /**
     * Apply filters and sorting to data
     */
    applyFilters() {
        let filtered = [...this.allData];
        
        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.email.toLowerCase().includes(query)
            );
        }
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            if (this.currentFilter === 'beginner') {
                filtered = filtered.filter(p => p.completionPercentage < 30);
            } else if (this.currentFilter === 'advanced') {
                filtered = filtered.filter(p => p.completionPercentage >= 30 && p.completionPercentage < 100);
            } else if (this.currentFilter === 'complete') {
                filtered = filtered.filter(p => p.completionPercentage === 100);
            }
        }
        
        // Apply sorting
        this.sortData(filtered, this.currentSort);
        
        // Update filtered data
        this.filteredData = filtered;
        
        // Update results count
        this.updateResultsCount();
        
        // Render leaderboard
        this.renderLeaderboard();
    }

    /**
     * Sort data by specified column
     * @param {Array} data - Data to sort
     * @param {string} sortBy - Sort column
     */
    sortData(data, sortBy) {
        switch (sortBy) {
            case 'rank':
                data.sort((a, b) => a.rank - b.rank);
                break;
            case 'name':
                data.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'completion':
                data.sort((a, b) => b.completionPercentage - a.completionPercentage);
                break;
            case 'badges':
                data.sort((a, b) => b.badgesEarned - a.badgesEarned);
                break;
        }
    }

    /**
     * Render leaderboard table and cards
     */
    renderLeaderboard() {
        // Check screen size
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.renderMobileCards();
            document.getElementById('leaderboardTable').style.display = 'none';
            document.getElementById('leaderboardCards').style.display = 'flex';
        } else {
            this.renderDesktopTable();
            document.getElementById('leaderboardTable').style.display = 'block';
            document.getElementById('leaderboardCards').style.display = 'none';
        }
    }

    /**
     * Render desktop table view
     */
    renderDesktopTable() {
        const tbody = document.getElementById('leaderboardBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.filteredData.forEach(participant => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="rank-cell">
                        ${this.getRankDisplay(participant.rank)}
                        ${participant.rank}
                    </div>
                </td>
                <td>
                    <div class="participant-cell">
                        <div class="participant-avatar" style="background: ${participant.avatarColor}">
                            ${participant.initials}
                        </div>
                        <div class="participant-info">
                            <h4>${this.escapeHtml(participant.name)}</h4>
                            <p>${this.escapeHtml(participant.email)}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="progress-cell">
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" data-percentage="${participant.completionPercentage}">
                                ${participant.completionPercentage}%
                            </div>
                        </div>
                    </div>
                </td>
                <td class="badges-cell">
                    <span class="badge-count">${participant.badgesEarned}</span>
                </td>
                <td class="arcade-cell">
                    <span class="arcade-count">${participant.arcadeGames}</span>
                </td>
                <td class="courses-cell">
                    ${participant.completedCourses}/${participant.totalCourses}
                </td>
                <td class="updated-cell">
                    ${this.formatDate(participant.lastUpdated)}
                </td>
            `;
            
            tbody.appendChild(row);
            
            // Add rank change indicator if exists
            if (participant.rankChange) {
                const rankCell = row.querySelector('.rank-cell');
                RankChangeAnimation.addIndicator(
                    rankCell, 
                    participant.rankChange, 
                    participant.rankDiff
                );
            }
        });
        
        // Animate progress bars
        setTimeout(() => {
            ProgressBarAnimation.initAll();
        }, 100);
    }

    /**
     * Render mobile card view
     */
    renderMobileCards() {
        const container = document.getElementById('leaderboardCards');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.filteredData.forEach(participant => {
            const card = document.createElement('div');
            card.className = 'leaderboard-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-rank">
                        <span class="card-rank-medal">${this.getRankDisplay(participant.rank)}</span>
                        <span class="card-rank-number">#${participant.rank}</span>
                    </div>
                    <div class="card-badges">
                        ${this.renderBadges(participant.badgeTypes)}
                        <span class="badge-count">${participant.badgesEarned}</span>
                    </div>
                </div>
                
                <div class="card-participant">
                    <div class="card-avatar" style="background: ${participant.avatarColor}">
                        ${participant.initials}
                    </div>
                    <div class="card-participant-info">
                        <h3 class="card-participant-name">${this.escapeHtml(participant.name)}</h3>
                        <p class="card-participant-email">${this.escapeHtml(participant.email)}</p>
                    </div>
                </div>
                
                <div class="card-progress">
                    <div class="card-progress-label">
                        <span>Progress</span>
                        <span>${participant.completionPercentage}%</span>
                    </div>
                    <div class="card-progress-bar">
                        <div class="card-progress-fill" data-percentage="${participant.completionPercentage}">
                        </div>
                    </div>
                </div>
                
                <div class="card-stats">
                    <div class="card-stat">
                        <div class="card-stat-value">${participant.badgesEarned}</div>
                        <div class="card-stat-label">Skill Badges</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-value">${participant.arcadeGames}</div>
                        <div class="card-stat-label">Arcade</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-value">${participant.completedCourses}/${participant.totalCourses}</div>
                        <div class="card-stat-label">Total</div>
                    </div>
                </div>
                
                <div class="card-footer">
                    <span class="card-updated">${this.formatDate(participant.lastUpdated)}</span>
                    <button class="card-share-btn" data-email="${participant.email}">Share</button>
                </div>
            `;
            
            container.appendChild(card);
        });
        
        // Animate progress bars
        setTimeout(() => {
            ProgressBarAnimation.initAll();
        }, 100);
        
        // Add share button listeners
        document.querySelectorAll('.card-share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const email = e.target.getAttribute('data-email');
                this.shareParticipant(email);
            });
        });
    }

    /**
     * Get rank display (medal for top 3)
     * @param {number} rank - Participant rank
     * @returns {string} Medal emoji or empty string
     */
    getRankDisplay(rank) {
        const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
        return medals[rank] || '';
    }

    /**
     * Render badge icons
     * @param {Array} badgeTypes - Array of badge types
     * @returns {string} HTML string of badge icons
     */
    renderBadges(badgeTypes) {
        const badgeMap = {
            'beginner': { emoji: '🔵', name: 'Beginner' },
            'intermediate': { emoji: '🟡', name: 'Intermediate' },
            'advanced': { emoji: '🔴', name: 'Advanced' },
            'expert': { emoji: '🟢', name: 'Expert' }
        };
        
        return badgeTypes.slice(0, 4).map(type => {
            const badge = badgeMap[type] || { emoji: '⭐', name: type };
            return `<span class="badge-icon ${type}" data-tooltip="${badge.name}">${badge.emoji}</span>`;
        }).join('');
    }

    /**
     * Format date string
     * @param {string} dateStr - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now - date;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            
            if (diffHours < 1) {
                return 'Just now';
            } else if (diffHours < 24) {
                return `${diffHours}h ago`;
            } else {
                const diffDays = Math.floor(diffHours / 24);
                return `${diffDays}d ago`;
            }
        } catch {
            return 'Recently';
        }
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Update results count display
     */
    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            const count = this.filteredData.length;
            resultsCount.textContent = `Showing ${count} participant${count !== 1 ? 's' : ''}`;
        }
    }

    /**
     * Update last refresh time display
     */
    updateLastRefreshTime() {
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated) {
            const now = new Date();
            lastUpdated.textContent = now.toLocaleTimeString();
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.searchQuery = e.target.value;
                    this.applyFilters();
                }, 300);
            });
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add to clicked
                e.target.classList.add('active');
                // Update filter
                this.currentFilter = e.target.getAttribute('data-filter');
                this.applyFilters();
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }

        // Export CSV button
        const exportCSV = document.getElementById('exportCSV');
        if (exportCSV) {
            exportCSV.addEventListener('click', () => this.exportCSV());
        }

        // Export PDF button
        const exportPDF = document.getElementById('exportPDF');
        if (exportPDF) {
            exportPDF.addEventListener('click', () => this.exportPDF());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Manual refresh button
        const manualRefresh = document.getElementById('manualRefresh');
        if (manualRefresh) {
            manualRefresh.addEventListener('click', () => this.manualRefresh());
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            this.renderLeaderboard();
        });
    }

    /**
     * Initialize theme from localStorage
     */
    initTheme() {
        // Force dark theme always
        document.body.classList.add('dark-theme');
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }

    /**
     * Toggle dark/light theme (DISABLED - ALWAYS DARK)
     */
    toggleTheme() {
        // Theme toggle disabled - always stay dark
        return;
    }

    /**
     * Start auto-refresh interval
     */
    startAutoRefresh() {
        this.autoRefreshInterval = setInterval(() => {
            this.loadData(true);
        }, this.refreshIntervalMs);
    }

    /**
     * Manual refresh trigger
     */
    async manualRefresh() {
        const btn = document.getElementById('manualRefresh');
        if (btn) {
            btn.style.animation = 'spin 0.5s ease-in-out';
            setTimeout(() => {
                btn.style.animation = '';
            }, 500);
        }
        
        await this.loadData(true);
    }

    /**
     * Export leaderboard to CSV
     */
    exportCSV() {
        const csvContent = this.csvReader.exportToCSV(this.filteredData);
        this.csvReader.downloadCSV(csvContent, `leaderboard_${Date.now()}.csv`);
        this.showToast('📊 CSV exported successfully!', 'success');
    }

    /**
     * Export leaderboard to PDF (simple implementation)
     */
    exportPDF() {
        window.print();
        this.showToast('📄 Opening print dialog...', 'success');
    }

    /**
     * Share participant progress
     * @param {string} email - Participant email
     */
    shareParticipant(email) {
        const participant = this.allData.find(p => p.email === email);
        if (!participant) return;
        
        const shareText = `${participant.name} - ${participant.completionPercentage}% Complete - GDG Gen AI Study Jams`;
        const shareUrl = `${window.location.href}?participant=${encodeURIComponent(email)}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'GDG Gen AI Study Jams',
                text: shareText,
                url: shareUrl
            }).catch(() => {
                this.copyToClipboard(shareUrl);
            });
        } else {
            this.copyToClipboard(shareUrl);
        }
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('🔗 Link copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('❌ Failed to copy link', 'error');
        });
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Message type
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.leaderboardApp = new LeaderboardApp();
});

// Handle visibility change to pause/resume auto-refresh
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, could pause auto-refresh
        console.log('Page hidden');
    } else {
        // Page is visible, ensure auto-refresh is running
        console.log('Page visible');
    }
});
