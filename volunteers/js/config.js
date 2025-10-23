/**
 * Volunteer Tracking System Configuration
 * Update these values when needed
 */

const VOLUNTEER_CONFIG = {
    // Google Sheets CSV Export URL
    // INSTRUCTIONS TO SET UP:
    // 1. Create a Google Sheet with volunteer data
    // 2. Go to File > Share > Publish to web
    // 3. Choose "Comma-separated values (.csv)" and publish
    // 4. Copy the URL and paste it here
    // 5. Or keep using local CSV: 'data/volunteers.csv'
    
    csvSource: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcghZkhSMr96o9CWO42WjXHqEGtEuxqti8Ewy251yJI_PUGeIZVu72NZl8S6oIQZPwvUGprvXKSAua/pub?gid=508401230&single=true&output=csv',  // Change this to Google Sheets URL when ready
    
    // Scoring formula: Total Impact = Credentials + (Students × multiplier)
    studentMultiplier: 2,  // Students helped are worth 2x
    
    // Core Team auto-promotion
    coreTeamThreshold: 3,  // Top 3 automatically get Core Team status
    
    // Refresh interval (milliseconds)
    autoRefreshInterval: 60000,  // 60 seconds
    
    // Last update timestamp (auto-generated)
    lastUpdate: '2024-10-23T19:30:00',
    
    // Contact info
    adminWhatsApp: 'https://chat.whatsapp.com/JhtrD6e673hKMqlxaWs1CR',
    volunteerFormLink: 'https://forms.gle/your-form-link-here'
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
    module.exports = VOLUNTEER_CONFIG;
}
