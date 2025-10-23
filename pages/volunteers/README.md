# 🎯 Volunteer Leaderboard - Setup Guide

## 📋 What You Got

A complete volunteer tracking system with:
- ✅ Real-time leaderboard
- ✅ Impact scoring (Credentials + Students × 2)
- ✅ Auto-promotion to Core Team (Top 3)
- ✅ Google Sheets sync support
- ✅ Beautiful UI matching main site
- ✅ Mobile responsive design
- ✅ Private (not linked from main site)

---

## 🚀 Quick Start (Local CSV)

The system is ready to use with local CSV file:

1. **Access the leaderboard:**
   ```
   http://yoursite.com/volunteers/
   ```
   OR locally:
   ```
   file:///e:/Vinitt/Genn AI/volunteers/index.html
   ```

2. **Update volunteer data:**
   - Edit: `volunteers/data/volunteers.csv`
   - Add new volunteers or update existing ones
   - Save file
   - Refresh page (auto-updates every 60 seconds)

---

## 📊 Google Sheets Setup (Recommended!)

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new sheet named "Volunteer Tracker"
3. Add these exact column headers in Row 1:
   ```
   Volunteer Name | Email | Own Completion | Credentials Completed | Students Helped | Total Impact | Status | Join Date | Last Active | Streak Days
   ```

### Step 2: Add Sample Data

Example row:
```
Rahul Sharma | rahul@example.com | Yes | 5 | 8 | 21 | Active | 2024-10-15 | 2024-10-23 | 3
```

**Note:** Total Impact will be auto-calculated by the leaderboard!

### Step 3: Publish as CSV

1. Click **File** → **Share** → **Publish to web**
2. In "Link" tab:
   - Choose the sheet tab (e.g., "Sheet1")
   - Select **"Comma-separated values (.csv)"**
   - Click **"Publish"**
3. Copy the URL (looks like):
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vQ.../pub?output=csv
   ```

### Step 4: Update Config

1. Open `volunteers/js/config.js`
2. Find this line:
   ```javascript
   csvSource: '../data/volunteers.csv',
   ```
3. Replace with your Google Sheets URL:
   ```javascript
   csvSource: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ.../pub?output=csv',
   ```
4. Save file

### Step 5: Test

1. Refresh the leaderboard page
2. Should see your Google Sheets data
3. Update sheet → Wait 1 minute → Auto-refreshes!

---

## 📝 CSV Format

### Required Columns:

| Column | Description | Example |
|--------|-------------|---------|
| **Volunteer Name** | Full name | Rahul Sharma |
| **Email** | Email address | rahul@example.com |
| **Own Completion** | Did they complete 20/20? | Yes / No |
| **Credentials Completed** | How many IDs completed | 5 |
| **Students Helped** | Students motivated | 8 |
| **Total Impact** | Auto-calculated (ignore) | 21 |
| **Status** | Active/Core Team/Inactive | Active |
| **Join Date** | When they joined | 2024-10-15 |
| **Last Active** | Last activity date | 2024-10-23 |
| **Streak Days** | Consecutive active days | 3 |

### Impact Score Formula:
```
Total Impact = Credentials Completed + (Students Helped × 2)
```

Example:
- Credentials: 5
- Students: 8
- Impact: 5 + (8 × 2) = **21 points**

---

## 👑 Core Team Auto-Promotion

**How it works:**
- Top 3 by Impact Score = Auto-eligible
- Status changes to "Core Team Eligible"
- You can manually change to "Core Team" in CSV

**Manual Promotion:**
1. Open CSV or Google Sheet
2. Find volunteer
3. Change Status from "Active" to "Core Team"
4. Save
5. Leaderboard updates in 60 seconds

---

## 🔄 How to Update Data

### Method 1: Google Sheets (Easy!)
1. Open your Google Sheet
2. Update any field
3. Save (auto-saves)
4. Wait 60 seconds
5. Leaderboard auto-refreshes ✅

### Method 2: CSV File
1. Open `volunteers/data/volunteers.csv`
2. Edit data
3. Save file
4. Refresh browser

### Method 3: Google Form (Best!)

**Create a form to collect volunteer updates:**

1. Create Google Form with fields:
   - Volunteer Name (dropdown)
   - Credentials Completed This Week
   - Students Helped This Week
   
2. Link form responses to your Google Sheet

3. Sheet auto-updates when volunteers submit!

---

## 📱 Sharing with Volunteers

### How to Share:

**Option 1: Direct URL**
```
Hey team! 👋

Check the volunteer leaderboard:
https://yoursite.com/volunteers/

Top 3 get promoted to Core Team! 🚀
```

**Option 2: QR Code**
- Generate QR code for the URL
- Share in WhatsApp group
- Print on flyers

**Option 3: WhatsApp Message**
```
🎯 Volunteer Impact Leaderboard is LIVE!

📊 Track your rank: [URL]
🏆 Top 3 → Core Team
⭐ Impact Score = Credentials + (Students × 2)

Keep crushing it! 💪
```

---

## 🎨 Customization

### Change Colors

Edit `volunteers/css/style.css`:
```css
:root {
    --primary-blue: #4285f4;   /* Change these */
    --primary-red: #ea4335;
    --primary-yellow: #fbbc04;
    --primary-green: #34a853;
}
```

### Change Scoring Formula

Edit `volunteers/js/config.js`:
```javascript
studentMultiplier: 2,  // Change to 3 for Students × 3
```

### Change Core Team Threshold

```javascript
coreTeamThreshold: 3,  // Change to 5 for Top 5
```

### Change Auto-Refresh Time

```javascript
autoRefreshInterval: 60000,  // 60 seconds (change to 30000 for 30s)
```

---

## 🔒 Privacy & Security

**This leaderboard is:**
- ❌ NOT linked from main website
- ❌ NOT in navigation menu
- ❌ NOT in sitemap
- ✅ Only accessible via direct URL
- ✅ Can add `robots.txt` to block crawlers (already has noindex meta tag)

**To make it more secure:**

Add password protection in `index.html` (before `</body>`):
```html
<script>
    const password = prompt('Enter password:');
    if (password !== 'your-secret-password') {
        document.body.innerHTML = '<h1>Access Denied</h1>';
    }
</script>
```

---

## 📊 Sample Data Included

The CSV includes 5 sample volunteers:
- Rahul Sharma (Rank 1)
- Priya Patel (Rank 2)
- Amit Kumar (Rank 3 - Core Team)
- Sneha Gupta (Rank 4)
- Rohan Singh (Rank 5)

**Delete or modify this data before going live!**

---

## 🎯 Best Practices

### For You (Admin):

1. **Update weekly**: Set a schedule (e.g., every Monday)
2. **Track consistently**: Keep "Last Active" updated
3. **Celebrate wins**: Share top performers in WhatsApp
4. **Promote deserving**: Don't auto-promote blindly, verify quality

### For Volunteers:

1. **Report progress**: Use Google Form to report weekly
2. **Quality over quantity**: Focus on actual completions
3. **Help others**: Students helped worth 2x!
4. **Stay consistent**: Build streak days

---

## 🐛 Troubleshooting

### Data not loading?
1. Check browser console (F12)
2. Verify CSV path in `config.js`
3. Check Google Sheets is published (not private)
4. Try hard refresh (Ctrl + Shift + R)

### Google Sheets not updating?
1. Check sheet is published to web
2. Verify you copied the CSV URL (not HTML URL)
3. Wait 60 seconds for cache to clear
4. Try incognito mode

### Leaderboard looks broken?
1. Clear browser cache
2. Check CSS files loaded (Network tab in DevTools)
3. Verify all files uploaded to server

---

## 📈 Future Enhancements

Want to add more features? Ideas:

1. **Weekly Reports**: Email summary to team
2. **Badges System**: Achievements for milestones
3. **Charts**: Visual graphs of progress
4. **Export**: Download leaderboard as PDF
5. **Individual Dashboards**: Each volunteer sees their stats

---

## 🎉 You're All Set!

**What to do now:**

1. ✅ Set up Google Sheets (or use CSV)
2. ✅ Add real volunteer data
3. ✅ Share URL with volunteers
4. ✅ Update weekly
5. ✅ Promote top performers to Core Team!

**Questions?**
- Check code comments
- All files are well-documented
- Feel free to modify anything!

---

## 📁 File Structure

```
volunteers/
├── index.html              # Main page
├── css/
│   ├── style.css          # Main styles
│   └── responsive.css     # Mobile styles
├── js/
│   ├── config.js          # Settings (EDIT THIS!)
│   ├── csvReader.js       # Data parser
│   ├── main.js            # Main logic
│   └── animations.js      # Particle effects
└── data/
    └── volunteers.csv     # Local data (optional)
```

---

## 🚀 Next Steps

1. **Deploy to Vercel** (if main site is on Vercel):
   - Already configured in main site
   - Just push to GitHub
   - Accessible at: `yoursite.com/volunteers/`

2. **Test locally first**:
   ```bash
   # From main folder
   npx http-server -p 8000
   # Visit: http://localhost:8000/volunteers/
   ```

3. **Go live**:
   - Update with real data
   - Share URL with volunteers
   - Monitor weekly

---

**🎊 Congratulations! Your volunteer tracking system is ready!**

Remember: This is YOUR tool. Modify, enhance, and adapt it to your needs! 💪
