/**
 * Configuration file for timestamps and other settings
 * Update these values when you make changes to data
 */

const CONFIG = {
    // Main Leaderboard Data Source
    // Local CSV file - manually updated
    // To update: Edit the CSV file in data folder
    leaderboardDataSource: "data/Bharati Vidyapeeth's Department of Management Studies - Navi Mumbai, India [16 Oct].csv",
    
    // Leaderboard last update timestamp
    // Format: 'YYYY-MM-DDTHH:MM:SS' (24-hour format)
    // Update this when you modify the CSV file
    // Current: Oct 25, 2025, 12:30 AM
    leaderboardLastUpdate: '2025-10-25T00:30:00',
    
    // Swag winners last update timestamp
    // Format: 'YYYY-MM-DDTHH:MM:SS' (24-hour format)
    // Update this when you add a new swag winner
    // Current: Oct 25, 2025, 12:30 AM
    swagsLastUpdate: '2025-10-25T00:30:00',
    
    // WhatsApp group link (Gen AI Study Jams Group)
    whatsappGroupLink: 'https://chat.whatsapp.com/JhtrD6e673hKMqlxaWs1CR',
    
    // Total courses required
    totalCourses: 20,
    
    // Tier limits
    tier1Limit: 100,
    tier2Limit: 70,
    tier3Limit: 50
};

// Format timestamp for display
function formatTimestamp(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    };
    return date.toLocaleString('en-US', options);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
