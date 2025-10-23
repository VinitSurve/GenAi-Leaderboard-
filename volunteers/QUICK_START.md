# 🎯 VOLUNTEER LEADERBOARD - QUICK REFERENCE

## 📍 Access URL
```
http://yoursite.com/volunteers/
```
Local test: `http://127.0.0.1:8000/volunteers/`

---

## 🚀 SUPER QUICK SETUP (Google Sheets)

### 1️⃣ Create Sheet
- Go to Google Sheets
- Copy this template:

```
Volunteer Name | Email | Own Completion | Credentials Completed | Students Helped | Total Impact | Status | Join Date | Last Active | Streak Days
Rahul Sharma | rahul@example.com | Yes | 5 | 8 | 21 | Active | 2024-10-15 | 2024-10-23 | 3
```

### 2️⃣ Publish Sheet
1. File → Share → Publish to web
2. Choose: "Comma-separated values (.csv)"
3. Click "Publish"
4. Copy URL

### 3️⃣ Update Config
Open: `volunteers/js/config.js`
```javascript
csvSource: 'YOUR-GOOGLE-SHEETS-CSV-URL-HERE',
```

### 4️⃣ Done! 🎉
Refresh page → Data shows up!

---

## 📝 How to Add New Volunteer

### Google Sheets (Easy):
1. Open your Google Sheet
2. Add new row:
   ```
   Name | Email | Yes | 0 | 0 | 0 | Active | Today's Date | Today's Date | 0
   ```
3. Save → Auto-updates in 60 seconds!

### CSV File:
1. Open `volunteers/data/volunteers.csv`
2. Add new line:
   ```csv
   New Volunteer,email@example.com,Yes,0,0,0,Active,2024-10-23,2024-10-23,0
   ```
3. Save → Refresh page

---

## 🎯 Impact Score Formula

```
Total Impact = Credentials + (Students × 2)
```

**Examples:**
- 5 credentials + 8 students = 5 + (8×2) = **21 points**
- 3 credentials + 10 students = 3 + (10×2) = **23 points**
- 10 credentials + 5 students = 10 + (5×2) = **20 points**

**Why × 2?** Because motivating students is harder than completing credentials!

---

## 👑 Core Team Promotion

**Auto-Eligible:** Top 3 by Impact Score

**Manual Promotion:**
1. Change Status in CSV/Sheet: `Active` → `Core Team`
2. Save
3. Refresh (or wait 60s)

---

## 🔄 Update Schedule

**Recommended:**
- Update every Monday
- Review progress weekly
- Promote deserving volunteers monthly

**What to Update:**
- Credentials Completed (add to existing count)
- Students Helped (add to existing count)
- Last Active (today's date)
- Streak Days (consecutive active days)

---

## 📊 Column Meanings

| Column | What It Is | Example |
|--------|------------|---------|
| **Volunteer Name** | Full name | Rahul Sharma |
| **Email** | Contact email | rahul@example.com |
| **Own Completion** | Did they complete 20/20? | Yes/No |
| **Credentials Completed** | IDs they completed | 5 |
| **Students Helped** | Students they motivated | 8 |
| **Total Impact** | Auto-calculated score | 21 |
| **Status** | Current status | Active/Core Team |
| **Join Date** | When they started | 2024-10-15 |
| **Last Active** | Last time they worked | 2024-10-23 |
| **Streak Days** | Consecutive days active | 3 |

---

## 🎨 Customization

### Change Student Multiplier
File: `volunteers/js/config.js`
```javascript
studentMultiplier: 2,  // Change to 3 for ×3
```

### Change Auto-Refresh Time
```javascript
autoRefreshInterval: 60000,  // 60 seconds (30000 = 30s)
```

### Change Top N for Core Team
```javascript
coreTeamThreshold: 3,  // Top 3 (change to 5 for Top 5)
```

---

## 💬 Share with Volunteers

**WhatsApp Message Template:**
```
🎯 Volunteer Leaderboard is LIVE!

📊 Check your rank: [URL]
🏆 Top 3 get Core Team position!
⭐ Impact = Credentials + (Students × 2)

Let's crush it! 💪
```

---

## 🐛 Troubleshooting

### Not loading?
1. Check CSV path in `config.js`
2. For Google Sheets: Is it published?
3. Hard refresh: Ctrl + Shift + R

### Data not updating?
1. Wait 60 seconds (auto-refresh)
2. Or click "Refresh Data" button
3. Check Google Sheet is saved

### Looks broken?
1. Clear browser cache
2. Check all files uploaded
3. Open browser console (F12) for errors

---

## 📱 Test Locally

```bash
cd "e:/Vinitt/Genn AI"
npx http-server -p 8000
```
Visit: `http://localhost:8000/volunteers/`

---

## 📁 Important Files

```
volunteers/
├── index.html           # Main page
├── js/
│   ├── config.js       # ⚠️ EDIT THIS for settings
│   ├── csvReader.js    # Data parser
│   └── main.js         # Logic
├── css/
│   └── style.css       # Colors/design
└── data/
    └── volunteers.csv  # Local data
```

---

## ✅ Deployment Checklist

- [ ] Create Google Sheet with volunteer data
- [ ] Publish sheet as CSV
- [ ] Update `config.js` with CSV URL
- [ ] Test locally
- [ ] Deploy to Vercel/server
- [ ] Share URL with volunteers
- [ ] Set up weekly update schedule

---

## 🎉 Features Summary

✅ Real-time leaderboard  
✅ Impact scoring system  
✅ Auto-promotion (Top 3)  
✅ Google Sheets sync  
✅ Particle animations  
✅ Mobile responsive  
✅ Auto-refresh (60s)  
✅ Beautiful UI  
✅ Private (not linked)  

---

## 📞 Need Help?

Check full documentation: `volunteers/README.md`

All files have detailed comments!

---

**🚀 Ready to Track Your Volunteers!**

Remember: This tool helps you identify your best volunteers and build a stronger core team! 💪
