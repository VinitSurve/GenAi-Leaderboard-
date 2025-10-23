/* ===================================
   Volunteer CSV Reader Module
   Handles fetching, parsing, and processing volunteer data
   =================================== */

class VolunteerCSVReader {
    constructor(csvPath) {
        this.csvPath = csvPath;
        this.cache = null;
        this.cacheTime = null;
        this.cacheDuration = 60000; // 1 minute
    }

    /**
     * Fetch and parse CSV data
     */
    async fetchData() {
        try {
            // Check cache first
            if (this.cache && this.cacheTime && (Date.now() - this.cacheTime < this.cacheDuration)) {
                return this.cache;
            }

            // Add cache busting parameter (use & since URL already has query params)
            const separator = this.csvPath.includes('?') ? '&' : '?';
            const response = await fetch(this.csvPath + separator + 't=' + Date.now());
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            const data = this.parseCSV(csvText);
            
            // Update cache
            this.cache = data;
            this.cacheTime = Date.now();
            
            return data;
        } catch (error) {
            console.error('Error fetching CSV:', error);
            throw error;
        }
    }

    /**
     * Parse CSV text into array of objects
     */
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index].trim();
                });
                data.push(row);
            }
        }
        
        return data;
    }

    /**
     * Parse a single CSV line (handles commas in quotes)
     */
    parseCSVLine(line) {
        const values = [];
        let currentValue = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue);
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        
        values.push(currentValue);
        return values;
    }

    /**
     * Process volunteer data and calculate rankings
     */
    processVolunteerData(rawData) {
        const processed = rawData.map(volunteer => {
            const coursesCompleted = parseInt(volunteer['Number of Courses Completed']) || 0;
            const credentialsUsed = parseInt(volunteer['Number of Credentials Used']) || 0;
            const studentsHelped = parseInt(volunteer['Number of Students Helped']) || 0;
            const totalImpact = coursesCompleted + (studentsHelped * VOLUNTEER_CONFIG.studentMultiplier);
            
            // Determine status based on activity
            let status = 'Inactive';
            if (totalImpact > 0) {
                // If volunteer has any activity at all, they're Active
                status = 'Active';
            }
            
            return {
                name: volunteer['Name'],
                coursesCompleted: coursesCompleted,
                credentialsUsed: credentialsUsed,
                accountOwners: volunteer['Account Owner\'s Name'] || '-',
                studentsHelped: studentsHelped,
                studentsUrls: volunteer['Students Helped Skill Boost Url'] || '-',
                totalImpact: totalImpact,
                status: status
            };
        });

        // Sort by total impact (descending)
        processed.sort((a, b) => b.totalImpact - a.totalImpact);

        // Add rank and determine final status
        processed.forEach((volunteer, index) => {
            volunteer.rank = index + 1;
            
            // Top 3 with activity become Core Team Eligible
            if (volunteer.rank <= VOLUNTEER_CONFIG.coreTeamThreshold && volunteer.totalImpact > 0) {
                volunteer.status = 'Core Team Eligible';
            }
        });

        return processed;
    }

    /**
     * Calculate statistics
     */
    calculateStats(data) {
        const totalVolunteers = data.length;
        const activeVolunteers = data.filter(v => v.totalImpact > 0).length;
        
        const totalCourses = data.reduce((sum, v) => sum + v.coursesCompleted, 0);
        const totalCredentials = data.reduce((sum, v) => sum + v.credentialsUsed, 0);
        const totalStudentsHelped = data.reduce((sum, v) => sum + v.studentsHelped, 0);
        const totalImpact = data.reduce((sum, v) => sum + v.totalImpact, 0);

        return {
            totalVolunteers,
            activeVolunteers,
            totalCourses,
            totalCredentials,
            totalStudentsHelped,
            totalImpact
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VolunteerCSVReader;
}
