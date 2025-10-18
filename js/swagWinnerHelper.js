/**
 * Swag Winner Management Helper
 * This file helps you quickly add new swag winners with automatic timestamp updates
 */

/**
 * Get current timestamp in config format
 * @returns {string} Timestamp in 'YYYY-MM-DDTHH:MM:SS' format
 */
function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Generate swag winner card HTML
 * @param {number} rank - Winner's rank (1, 2, 3, etc.)
 * @param {string} name - Full name of the winner
 * @param {string} trophy - Trophy emoji (🥇, 🥈, 🥉, 🏅, etc.)
 * @param {string} avatarColor - Gradient color for avatar (optional)
 * @returns {string} HTML for swag winner card
 */
function generateSwagWinnerCard(rank, name, trophy = '🏅', avatarColor = null) {
    // Get initials from name
    const initials = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
    
    // Default avatar colors based on rank
    const defaultColors = {
        1: 'linear-gradient(135deg, #ffd700, #ffed4e)',
        2: 'linear-gradient(135deg, #c0c0c0, #e8e8e8)',
        3: 'linear-gradient(135deg, #cd7f32, #ffa07a)',
        default: 'linear-gradient(135deg, #4285f4, #34a853)'
    };
    
    const bgColor = avatarColor || defaultColors[rank] || defaultColors.default;
    
    return `
                <!-- Swag Winner Card ${rank} -->
                <div class="swag-card winner-${rank}" data-animate="fade-up">
                    <div class="winner-header">
                        <div class="rank-circle">${rank}</div>
                        <div class="trophy-large">${trophy}</div>
                    </div>
                    <div class="swag-avatar" style="background: ${bgColor};">
                        <span>${initials}</span>
                    </div>
                    <h3 class="swag-name">${name}</h3>
                    <div class="status-badges">
                        <span class="status-badge complete">✓ 20/20 Done</span>
                        <span class="status-badge proof">✓ Proof Sent</span>
                    </div>
                    <div class="winner-label">SWAG CONFIRMED ✓</div>
                </div>
`;
}

/**
 * Generate timestamp update instruction
 * @returns {string} Instructions for updating config.js
 */
function getTimestampUpdateInstructions() {
    const currentTimestamp = getCurrentTimestamp();
    const now = new Date();
    const displayTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    return `
📝 UPDATE CONFIG.JS:
Open js/config.js and update the swag winners timestamp to:

swagsLastUpdate: '${currentTimestamp}',

This will display as: ${displayTime}
`;
}

/**
 * Example usage instructions
 */
const USAGE_EXAMPLE = `
===========================================
HOW TO ADD NEW SWAG WINNER
===========================================

STEP 1: Generate the card HTML
--------------------------------
const newWinner = generateSwagWinnerCard(
    11,                    // Rank number
    'Student Name',        // Full name
    '🏅',                  // Trophy emoji
    'linear-gradient(135deg, #4285f4, #34a853)'  // Optional: custom color
);

STEP 2: Copy the output
--------------------------------
console.log(newWinner);

STEP 3: Paste into swags.html
--------------------------------
Add the HTML before the closing </div> of swags-grid

STEP 4: Update timestamp in config.js
--------------------------------
console.log(getTimestampUpdateInstructions());
Copy the timestamp and update js/config.js

STEP 5: Done!
--------------------------------
Refresh the page to see the new winner!

===========================================
QUICK EXAMPLE
===========================================

// Add winner #11
console.log(generateSwagWinnerCard(11, 'Rahul Sharma'));

// Get timestamp update instructions
console.log(getTimestampUpdateInstructions());

===========================================
`;

// Log usage instructions when this file is loaded in browser console
if (typeof window !== 'undefined') {
    console.log('%c💡 Swag Winner Helper Loaded!', 'color: #ffd700; font-size: 16px; font-weight: bold;');
    console.log('%cType USAGE_EXAMPLE to see how to use this helper', 'color: #4285f4; font-size: 12px;');
}

// Export functions for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentTimestamp,
        generateSwagWinnerCard,
        getTimestampUpdateInstructions,
        USAGE_EXAMPLE
    };
}
