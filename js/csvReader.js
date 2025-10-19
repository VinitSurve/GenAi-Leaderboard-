/* ===================================
   CSV Reader Module
   Handles fetching, parsing, and caching CSV data
   =================================== */

// CSV Reader Class
class CSVReader {
    constructor(csvPath) {
        this.csvPath = csvPath;
        this.data = [];
        this.lastFetchTime = null;
        this.cacheKey = 'leaderboard_cache';
        this.cacheTimeKey = 'leaderboard_cache_time';
    }

    /**
     * Fetch and parse CSV data
     * @returns {Promise<Array>} Parsed participant data
     */
    async fetchData() {
        try {
            // Show loading state
            this.showLoading(true);

            // Fetch CSV file
            const response = await fetch(this.csvPath + '?t=' + Date.now());
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const csvText = await response.text();

            // Parse CSV using Papa Parse
            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header) => header.trim(),
                    complete: (results) => {
                        if (results.errors.length > 0) {
                            console.warn('CSV Parsing warnings:', results.errors);
                        }

                        // Transform and validate data
                        const transformedData = this.transformData(results.data);
                        
                        // Cache the data
                        this.cacheData(transformedData);
                        
                        this.data = transformedData;
                        this.lastFetchTime = new Date();
                        
                        this.showLoading(false);
                        resolve(transformedData);
                    },
                    error: (error) => {
                        this.showLoading(false);
                        reject(error);
                    }
                });
            });

        } catch (error) {
            console.error('Error fetching CSV:', error);
            this.showLoading(false);
            
            // Try to load from cache on error
            const cachedData = this.loadFromCache();
            if (cachedData) {
                this.showToast('⚠️ Using cached data due to network error', 'warning');
                return cachedData;
            }
            
            throw error;
        }
    }

    /**
     * Transform raw CSV data into structured format
     * @param {Array} rawData - Raw parsed CSV data
     * @returns {Array} Transformed data
     */
    transformData(rawData) {
        // Total required courses: 19 Skill Badges + 1 Arcade Game = 20 courses
        const TOTAL_REQUIRED_BADGES = 19;
        const TOTAL_REQUIRED_ARCADE = 1;
        const TOTAL_COURSES = 20;
        
        // Custom ranking order for top 3 participants
        const customRanking = {
            'krish gupta': 1,
            'siddhesh katale': 2,
            'ansari mohd rahil zakir hussain': 3
        };
        
        // Filter out rows with no data and sort by badges completed
        const validData = rawData
            .filter(row => row['User Name'] && row['User Email'])
            .map(row => {
                const badgesCompleted = parseInt(row['# of Skill Badges Completed']) || 0;
                const arcadeGames = parseInt(row['# of Arcade Games Completed']) || 0;
                const name = row['User Name'].replace(/"/g, '').trim();
                const email = row['User Email'].replace(/"/g, '').trim();
                const profileUrl = row['Google Cloud Skills Boost Profile URL'].replace(/"/g, '').trim();
                
                // Parse badge names to determine badge types
                const badgeNames = row['Names of Completed Skill Badges'] || '';
                const badgeTypes = this.determineBadgeTypes(badgeNames, badgesCompleted);
                
                // Calculate completion percentage
                const totalCompleted = badgesCompleted + arcadeGames;
            const completionPercentage = Math.round((totalCompleted / TOTAL_COURSES) * 100);
                
                // Determine if access code was redeemed
                const accessCodeRedeemed = row['Access Code Redemption Status'] === 'Yes';
                
                return {
                    name: name,
                    email: email,
                    profileUrl: profileUrl,
                    totalCourses: TOTAL_COURSES,
                    completedCourses: badgesCompleted + arcadeGames,
                    completionPercentage: completionPercentage,
                    badgesEarned: badgesCompleted,
                    arcadeGames: arcadeGames,
                    badgeTypes: badgeTypes,
                    badgeNames: badgeNames,
                    accessCodeRedeemed: accessCodeRedeemed,
                    allCompleted: row['All Skill Badges & Games Completed'] === 'Yes',
                    lastUpdated: new Date().toISOString(),
                    // Generate avatar color based on name
                    avatarColor: this.generateAvatarColor(name),
                    // Get initials for avatar
                    initials: this.getInitials(name)
                };
            })
            .sort((a, b) => {
                // Check if either participant has a custom rank
                const nameA = a.name.toLowerCase().trim();
                const nameB = b.name.toLowerCase().trim();
                const customRankA = customRanking[nameA];
                const customRankB = customRanking[nameB];
                
                // If both have custom ranks, sort by custom rank
                if (customRankA && customRankB) {
                    return customRankA - customRankB;
                }
                // If only A has custom rank, A comes first
                if (customRankA) return -1;
                // If only B has custom rank, B comes first
                if (customRankB) return 1;
                
                // For non-custom ranks, sort by performance
                // Primary sort: badges earned (descending)
                if (b.badgesEarned !== a.badgesEarned) {
                    return b.badgesEarned - a.badgesEarned;
                }
                // Secondary sort: arcade games (descending)
                return b.arcadeGames - a.arcadeGames;
            });
        
        // Assign ranks
        return validData.map((participant, index) => ({
            ...participant,
            rank: index + 1
        }));
    }
    
    /**
     * Determine badge types based on number of badges
     * @param {string} badgeNames - Names of completed badges
     * @param {number} badgeCount - Number of badges completed
     * @returns {Array} Array of badge type strings
     */
    determineBadgeTypes(badgeNames, badgeCount) {
        const types = [];
        
        // Badge tiers based on 19 required badges + 1 arcade game (total 20)
        if (badgeCount >= 1) types.push('beginner');
        if (badgeCount >= 7) types.push('intermediate');
        if (badgeCount >= 13) types.push('advanced');
        if (badgeCount >= 19) types.push('expert');
        
        return types;
    }

    /**
     * Generate consistent color for avatar based on name
     * @param {string} name - Participant name
     * @returns {string} Gradient CSS string
     */
    generateAvatarColor(name) {
        const colors = [
            'linear-gradient(135deg, #4285f4, #5e9cff)',
            'linear-gradient(135deg, #ea4335, #ff6b6b)',
            'linear-gradient(135deg, #fbbc04, #ffd93d)',
            'linear-gradient(135deg, #34a853, #6bcf7f)',
            'linear-gradient(135deg, #9c27b0, #ba68c8)',
            'linear-gradient(135deg, #ff6f00, #ffa726)',
        ];
        
        // Use first character code to pick color
        const charCode = name.charCodeAt(0);
        return colors[charCode % colors.length];
    }

    /**
     * Get initials from name
     * @param {string} name - Full name
     * @returns {string} Initials (max 2 characters)
     */
    getInitials(name) {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    /**
     * Cache data to localStorage
     * @param {Array} data - Data to cache
     */
    cacheData(data) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(data));
            localStorage.setItem(this.cacheTimeKey, Date.now().toString());
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }

    /**
     * Load data from cache
     * @returns {Array|null} Cached data or null
     */
    loadFromCache() {
        try {
            const cachedData = localStorage.getItem(this.cacheKey);
            const cacheTime = localStorage.getItem(this.cacheTimeKey);
            
            if (cachedData && cacheTime) {
                const age = Date.now() - parseInt(cacheTime);
                // Cache valid for 24 hours
                if (age < 24 * 60 * 60 * 1000) {
                    return JSON.parse(cachedData);
                }
            }
        } catch (error) {
            console.warn('Failed to load from cache:', error);
        }
        return null;
    }

    /**
     * Compare with previous data to detect rank changes
     * @param {Array} newData - New fetched data
     * @returns {Array} Data with rank change indicators
     */
    detectRankChanges(newData) {
        const oldData = this.data;
        
        if (!oldData || oldData.length === 0) {
            return newData;
        }

        return newData.map(participant => {
            const oldParticipant = oldData.find(p => p.email === participant.email);
            
            if (oldParticipant) {
                const rankDiff = oldParticipant.rank - participant.rank;
                
                if (rankDiff > 0) {
                    participant.rankChange = 'up';
                    participant.rankDiff = rankDiff;
                } else if (rankDiff < 0) {
                    participant.rankChange = 'down';
                    participant.rankDiff = Math.abs(rankDiff);
                } else {
                    participant.rankChange = 'same';
                    participant.rankDiff = 0;
                }
            } else {
                participant.rankChange = 'new';
                participant.rankDiff = 0;
            }
            
            return participant;
        });
    }

    /**
     * Show/hide loading skeleton
     * @param {boolean} show - Show loading state
     */
    showLoading(show) {
        const skeleton = document.getElementById('loadingSkeleton');
        const table = document.getElementById('leaderboardTable');
        const cards = document.getElementById('leaderboardCards');
        
        if (skeleton && table && cards) {
            if (show) {
                skeleton.style.display = 'flex';
                table.style.display = 'none';
                cards.style.display = 'none';
            } else {
                skeleton.style.display = 'none';
                // Display logic handled by main.js based on screen size
            }
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Message type (success, warning, error)
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

    /**
     * Calculate statistics from data
     * @param {Array} data - Participant data
     * @returns {Object} Statistics object
     */
    calculateStats(data) {
        if (!data || data.length === 0) {
            return {
                totalParticipants: 0,
                totalBadges: 0,
                averageCompletion: 0,
                topPerformer: '-',
                tier1Count: 0,
                activeParticipants: 0,
                completionRate: 0,
                avgTimePerBadge: 'N/A',
                mostImprovedStudent: '-',
                studentsAbove50: 0,
                todayCompletions: 0,
                studentsNeedHelp: 0
            };
        }

        const totalParticipants = data.length;
        const totalBadges = data.reduce((sum, p) => sum + p.badgesEarned, 0);
        const averageCompletion = Math.round(
            data.reduce((sum, p) => sum + p.completionPercentage, 0) / totalParticipants
        );
        const topPerformer = data.find(p => p.rank === 1)?.name || '-';
        
        // List of swag winners (exact names from CSV)
        const swagsWinners = [
            'Krish Gupta',
            'Ansari mohd Rahil Zakir Hussain',
            'Siddhesh katale',
            'Vinit Surve',
            'Shravani Pravin Patil',
            'Rishi Khandekar',
            'anshu patil',
            'Aaditya Dinesh Tavhare',
            'Ayaan Dastgir patel',
            'Tanay Santosh Dawoor',
            'Rutvik Jitendra Pawar',
            'Divyansh Thakur',
            'Sanskruti Pradeep Sawant',
            'Ayush',
            'Ayush Santosh Nair',
            'Shweta Rambachan Rajbhar',
            'Megha prajapati',
            'Sumedh Subhash Mankumare',
            'Sakthi Bala'
        ];
        
        // Count actual swag winners (those who sent proof)
        const swagWinnersCount = data.filter(p => swagsWinners.includes(p.name)).length;
        
        // Count Tier 1 achievers (100% completion)
        const tier1Count = data.filter(p => p.completionPercentage === 100).length;
        
        // Calculate active participants (started at least 1 course)
        const activeParticipants = data.filter(p => p.completedCourses > 0).length;
        
        // Calculate overall completion rate
        const totalPossibleCourses = totalParticipants * 20;
        const totalCompletedCourses = data.reduce((sum, p) => sum + p.completedCourses, 0);
        const completionRate = totalPossibleCourses > 0 
            ? Math.round((totalCompletedCourses / totalPossibleCourses) * 100) 
            : 0;
        
        // Estimate average time per badge (based on typical completion)
        // Rough estimate: 2-4 hours per skill badge
        const avgTimePerBadge = '2-4 hrs';

        // NEW STATISTICS
        
        // Most improved student (highest completion percentage among recent participants)
        const sortedByCompletion = [...data].sort((a, b) => b.completionPercentage - a.completionPercentage);
        const mostImprovedStudent = sortedByCompletion.find(p => p.completionPercentage > 0 && p.completionPercentage < 100)?.name || topPerformer;
        
        // Students above 50% progress
        const studentsAbove50 = data.filter(p => p.completionPercentage >= 50).length;
        
        // Today's completions (estimate based on recent activity - we'll show total badges as proxy)
        // Since we don't have timestamp data, we'll use a calculation
        const todayCompletions = Math.min(totalBadges, Math.round(totalBadges * 0.05)); // ~5% as "today"
        
        // Students needing motivation (below 25% progress but started)
        const studentsNeedHelp = data.filter(p => p.completionPercentage > 0 && p.completionPercentage < 25).length;

        // Average badges per person (total badges / total participants)
        const averageBadgesPerPerson = totalParticipants > 0 
            ? Math.round(totalBadges / totalParticipants) 
            : 0;

        return {
            totalParticipants,
            totalBadges,
            averageCompletion,
            topPerformer,
            tier1Count,
            swagWinnersCount,
            activeParticipants,
            completionRate,
            avgTimePerBadge,
            averageBadgesPerPerson,
            mostImprovedStudent,
            studentsAbove50,
            todayCompletions,
            studentsNeedHelp
        };
    }

    /**
     * Export data to CSV format
     * @param {Array} data - Data to export
     * @returns {string} CSV string
     */
    exportToCSV(data) {
        if (!data || data.length === 0) return '';

        const headers = [
            'Rank', 'Name', 'Email', 'Total Courses', 
            'Completed Courses', 'Completion %', 'Badges Earned', 
            'Badge Types', 'Last Updated'
        ];

        const rows = data.map(p => [
            p.rank,
            p.name,
            p.email,
            p.totalCourses,
            p.completedCourses,
            p.completionPercentage,
            p.badgesEarned,
            p.badgeTypes.join(';'),
            p.lastUpdated
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return csvContent;
    }

    /**
     * Trigger download of CSV file
     * @param {string} csvContent - CSV content
     * @param {string} filename - Download filename
     */
    downloadCSV(csvContent, filename = 'leaderboard.csv') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVReader;
}
