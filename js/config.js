/**
 * Configuration file for timestamps and other settings
 * Update these values when you make changes to data
 */

const CONFIG = {
    // Leaderboard last update timestamp
    // Format: 'YYYY-MM-DDTHH:MM:SS' (24-hour format)
    // Update this when you modify the CSV file
    // Current: Oct 18, 2025, 02:30 PM
    leaderboardLastUpdate: '2025-10-18T14:30:00',
    
    // Swag winners last update timestamp
    // Format: 'YYYY-MM-DDTHH:MM:SS' (24-hour format)
    // Update this when you add a new swag winner
    // Current: Oct 18, 2025, 02:30 PM
    swagsLastUpdate: '2025-10-18T14:30:00',
    
    // WhatsApp group link
    whatsappGroupLink: 'https://chat.whatsapp.com/your-group-link',
    
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
