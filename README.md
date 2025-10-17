# GDG Gen AI Study Jams Leaderboard

> **Bharati Vidyapeeth's, Department of Management Off Campus**

A professional, feature-rich leaderboard tracking GDG Gen AI Study Jams participants' progress. Built with pure HTML, CSS, and Vanilla JavaScript with modern UI/UX design.

## 🚀 Features

### Core Functionality
- **Real-time Data Loading**: Fetches and displays participant data from CSV files
- **Auto-refresh**: Automatically updates every 60 seconds
- **Search & Filter**: Real-time search with debouncing, filter by completion status
- **Multi-column Sorting**: Sort by rank, name, completion percentage, or badges
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile devices
- **8 Statistics Cards**: Total participants, badges, completion, top performer, Tier 1 achievers, active participants, completion rate, avg time per badge

### Visual Features
- **Animated Particle Background**: Dynamic Google-colored particles using Canvas API
- **Glassmorphism Effects**: Modern glass-like UI with backdrop blur
- **Enhanced Shadows & Gradients**: Multi-layered shadows and smooth gradients
- **Micro-interactions**: Button hover effects, card transformations, icon rotations
- **Progress Animations**: Smooth animated progress bars with color coding
- **Counter Animations**: Count-up animations for all statistics
- **Rank Change Indicators**: Visual feedback for rank movements
- **Dark/Light Theme**: Toggle between themes with localStorage persistence
- **Custom Logo Integration**: Chapter logo with divider in header

### User Experience
- **Loading Skeletons**: Smooth loading states
- **Toast Notifications**: Non-intrusive success/error messages
- **Sticky Navigation**: Header sticks on scroll with blur effect
- **Smooth Transitions**: All interactions use cubic-bezier easing
- **Keyboard Navigation**: Full keyboard accessibility
- **Print-friendly Layout**: Optimized for PDF export
- **Offline Support**: Cached data for offline viewing

### Export Options
- **CSV Export**: Download filtered leaderboard data
- **PDF Export**: Print-friendly layout for PDFs
- **Share Progress**: Share individual participant achievements

## 📁 Project Structure

```
project/
├── index.html              # Main HTML file
├── logo.png               # Chapter logo (add your logo here!)
├── .gitignore             # Git ignore rules
├── package.json           # NPM configuration
├── README.md              # This file
├── css/
│   ├── style.css          # Main styles with enhanced UI/UX
│   └── responsive.css     # Responsive breakpoints and mobile styles
├── js/
│   ├── main.js            # Main application logic
│   ├── csvReader.js       # CSV parsing and data management
│   └── animations.js      # Animation systems (counters, particles, etc.)
├── data/
│   └── participants.csv   # Participant data
├── assets/
│   └── images/            # Image assets directory
└── docs/                  # Documentation folder (hidden in git)
    ├── COLUMN_UPDATES.md
    ├── PROJECT_SUMMARY.md
    ├── SETUP_GUIDE.md
    ├── TABLE_FIX.md
    ├── TIER1_CARD.md
    ├── TIER1_FILTER_REMOVED.md
    ├── TIER1_X_OUT_OF_100.md
    └── UPDATES_SUMMARY.md
```

## 🎨 Design System

### Color Palette (GDG Brand Colors)
- **Primary Blue**: `#4285f4` - Google Blue
- **Primary Red**: `#ea4335` - Google Red
- **Primary Yellow**: `#fbbc04` - Google Yellow
- **Primary Green**: `#34a853` - Google Green

### Typography
- **Headings**: Google Sans Bold
- **Body**: Roboto Regular
- **Loaded from**: Google Fonts CDN

### Enhanced UI Components
1. **Header**: Gradient hero with chapter logo, GDG logo, and divider
2. **Stats Dashboard**: 8 glassmorphism cards with animated counters
   - Total Participants
   - Total Badges Earned
   - Average Completion %
   - Top Performer
   - Tier 1 Achievers (circular progress)
   - Active Participants
   - Completion Rate
   - Avg Time Per Badge
3. **Filter Section**: Search, filter buttons (with hover effects), sort dropdown, export options
4. **Leaderboard**: Table view (desktop) / Card view (mobile)
5. **Theme Toggle**: Dark/Light mode switcher

### Modern UI Enhancements
- ✨ **Glassmorphism**: Backdrop blur with transparency
- 🎨 **Enhanced Gradients**: Multi-stop gradients on cards and icons
- 🌟 **Micro-interactions**: Hover effects with transforms and shadows
- 🔄 **Icon Rotations**: 360° rotation on stat icon hover
- 📊 **Circular Progress**: Gold-gradient Tier 1 achievers card
- 💫 **Smooth Transitions**: Cubic-bezier easing for all animations

## 📊 CSV Data Format

```csv
rank,name,email,profile_url,total_courses,completed_courses,completion_percentage,badges_earned,badge_types,last_updated
1,Name,email@example.com,https://link,15,15,100,15,"beginner,advanced",2024-10-16 20:00
```

### Fields Explanation
- `rank`: Participant's rank position
- `name`: Full name of participant
- `email`: Email address
- `profile_url`: Link to participant's profile
- `total_courses`: Total available courses (default: 15)
- `completed_courses`: Number of completed courses
- `completion_percentage`: Calculated completion rate
- `badges_earned`: Total badges earned
- `badge_types`: Comma-separated badge categories
- `last_updated`: Last activity timestamp

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for CSV loading)
- Your chapter logo image (optional)

### Installation

1. **Clone or download** this project to your local machine

2. **Add Your Logo** (Optional):
   - Place your chapter logo as `logo.png` in the root directory
   - Recommended size: 200x200px or larger (square format)
   - Supported formats: PNG, JPG, SVG
   - The logo will appear in the header with rounded corners and hover effect

3. **Update CSV Data**:
   - Copy data from your original CSV file
   - Paste into `data/participants.csv`
   - Keep the same column structure

4. **Start a local server using Node.js (Recommended)**:

   **Option 1: Using npx (no installation needed):**
   ```bash
   cd "e:\Vinitt\Genn AI"
   npx http-server -p 8000
   ```

   **Option 2: Install http-server globally (one time):**
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```

   **Alternative: Using Python 3:**
   ```bash
   python -m http.server 8000
   ```

5. **Open in browser**:
   Navigate to `http://localhost:8000`

### Updating Data

To update participant data:

1. Export participant data from Google Cloud Skills Boost admin dashboard
2. Copy all content from the exported CSV
3. Open `data/participants.csv` in a text editor
4. Replace all content with the new CSV data
5. Save the file
6. Refresh the browser (or wait for auto-refresh)

**Course Requirements (20 Total):**
- ✅ **19 Skill Badges** from Gen AI Study Jams
- ✅ **1 Arcade Game**

**Badge Tier System:**
- 🔰 Beginner: 1-6 badges
- 🥈 Intermediate: 7-12 badges
- 🥇 Advanced: 13-18 badges
- 🏆 Expert: 19+ badges (all skill badges completed!)
- 💎 Tier 1: 20/20 courses (100% completion)

## 🎯 Key Features Explained

### Auto-Refresh System
- Fetches new data every 60 seconds
- Compares with cached data to detect rank changes
- Shows visual indicators for rank movements (↑/↓)
- Displays toast notification on successful update

### Search & Filter
- **Search**: Real-time search across name and email (300ms debounce)
- **Filters**:
  - All: Show all participants
  - Beginner: <30% completion
  - Advanced: 30-99% completion
  - Complete: 100% completion

### Responsive Design
- **Desktop (>768px)**: Full table layout with all columns
- **Tablet (768-1024px)**: Adjusted table with reduced padding
- **Mobile (<768px)**: Card-based layout with stacked information

### Theme Toggle
- Light/Dark theme support
- Preference saved in localStorage
- Smooth transitions between themes
- Optimized colors for both modes

### Caching Strategy
- Data cached in localStorage for offline access
- Cache valid for 24 hours
- Fallback to cached data on network errors
- Automatic cache invalidation

## ⚡ Performance Optimizations

- **Debounced Events**: Search input debounced to 300ms
- **Lazy Animations**: Progress bars animate only when in viewport
- **Efficient DOM Updates**: Minimal reflows and repaints
- **CSS Transforms**: Hardware-accelerated animations
- **Request Optimization**: Cache-busting for fresh data

## 🎨 Customization

### Changing Colors
Edit `css/style.css` root variables:
```css
:root {
    --primary-blue: #4285f4;
    --primary-red: #ea4335;
    /* ... modify as needed */
}
```

### Adjusting Auto-Refresh Interval
Edit `js/main.js`:
```javascript
this.refreshIntervalMs = 60000; // Change to desired milliseconds
```

### Adding More Participants
Append rows to `data/participants.csv` maintaining the format.

## 🔧 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Small Mobile**: < 480px

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible indicators
- High contrast mode support
- Screen reader friendly
- Reduced motion preference respected

## 🐛 Troubleshooting

### CSV Not Loading
- Ensure you're running a local server (not file://)
- Check browser console for CORS errors
- Verify CSV file path is correct

### Auto-Refresh Not Working
- Check browser console for errors
- Verify network connectivity
- Ensure CSV file is accessible

### Theme Not Persisting
- Check if localStorage is enabled
- Clear browser cache and try again

## 📝 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Individual participant pages
- [ ] Achievement badges system
- [ ] Leaderboard history tracking
- [ ] Admin panel for data management
- [ ] API integration with Google Cloud Skills Boost
- [ ] Social media sharing with images
- [ ] Detailed analytics dashboard

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **GDG (Google Developer Groups)** for the inspiration
- **Google Cloud Skills Boost** for the learning platform
- **Papa Parse** for CSV parsing functionality
- **Google Fonts** for typography

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review browser console for errors
- Verify all files are properly loaded

## 🌟 Credits

Built with ❤️ for the GDG Community

**Inspired by**: [GDG BCET Leaderboard](https://gdg-bcet.netlify.app/)

---

**Version**: 1.0.0  
**Last Updated**: October 16, 2024  
**Maintained by**: GDG On Campus Team
# GenAi-Leaderboard-
