# 📊 Google Sheets Template for Volunteer Tracking

## 🎯 Quick Setup

### Step 1: Create New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click "+ Blank" to create new sheet
3. Name it: **"Volunteer Impact Tracker"**

---

## 📋 Sheet Structure

### Row 1 (Headers) - MUST BE EXACT:

```
Volunteer Name | Email | Own Completion | Credentials Completed | Students Helped | Total Impact | Status | Join Date | Last Active | Streak Days
```

### Sample Data Rows:

Copy these rows to get started:

```csv
Volunteer Name,Email,Own Completion,Credentials Completed,Students Helped,Total Impact,Status,Join Date,Last Active,Streak Days
Rahul Sharma,rahul@example.com,Yes,5,8,21,Active,2024-10-15,2024-10-23,3
Priya Patel,priya@example.com,Yes,4,6,16,Active,2024-10-15,2024-10-23,2
Amit Kumar,amit@example.com,Yes,3,7,17,Core Team,2024-10-14,2024-10-23,5
Sneha Gupta,sneha@example.com,Yes,2,5,12,Active,2024-10-16,2024-10-22,1
Rohan Singh,rohan@example.com,Yes,1,3,7,Active,2024-10-17,2024-10-21,0
```

---

## 📝 Column Descriptions

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| **A: Volunteer Name** | Text | Full name of volunteer | Rahul Sharma |
| **B: Email** | Email | Contact email | rahul@example.com |
| **C: Own Completion** | Yes/No | Did they complete 20/20? | Yes |
| **D: Credentials Completed** | Number | How many IDs completed | 5 |
| **E: Students Helped** | Number | Students motivated | 8 |
| **F: Total Impact** | Number | Auto-calculated (can ignore) | 21 |
| **G: Status** | Text | Active/Core Team/Inactive | Active |
| **H: Join Date** | Date | When they joined | 2024-10-15 |
| **I: Last Active** | Date | Last activity date | 2024-10-23 |
| **J: Streak Days** | Number | Consecutive active days | 3 |

---

## 🎨 Formatting Tips (Optional)

### Make it look professional:

1. **Header Row (Row 1):**
   - Background: Blue (#4285f4)
   - Text: White, Bold
   - Freeze: View > Freeze > 1 row

2. **Status Column (G):**
   - Core Team: Gold background
   - Active: Green background
   - Inactive: Gray background

3. **Impact Score (F):**
   - Conditional formatting: Higher = Greener

4. **Sort:**
   - Data > Sort range
   - Sort by "Total Impact" (Column F)
   - Order: Z → A (highest first)

---

## 🔄 Auto-Calculate Impact Score (Optional)

If you want Google Sheets to auto-calculate Impact Score:

**Formula for cell F2:**
```
=D2+(E2*2)
```

Then drag down to apply to all rows!

**Formula Explanation:**
- `D2` = Credentials Completed
- `E2` = Students Helped
- `*2` = Multiply by 2
- Result: Credentials + (Students × 2)

---

## 📤 Publishing the Sheet

### Step-by-Step:

1. Click **File** in menu
2. Select **Share** → **Publish to web**
3. In the dialog:
   - **Link** tab (should be selected)
   - First dropdown: Choose your sheet (e.g., "Sheet1")
   - Second dropdown: **"Comma-separated values (.csv)"** ⚠️ Important!
4. Click **"Publish"** button
5. Confirm by clicking **"OK"**
6. **Copy the URL** that appears

### ✅ Your URL should look like:
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vXXXXXXXXX.../pub?output=csv
```

### ❌ NOT like this (this is HTML, not CSV):
```
https://docs.google.com/spreadsheets/d/1XXXXXXX/edit
```

---

## 🔗 Connect to Leaderboard

1. Copy your CSV URL
2. Open: `volunteers/js/config.js`
3. Find this line:
   ```javascript
   csvSource: 'data/volunteers.csv',
   ```
4. Replace with:
   ```javascript
   csvSource: 'YOUR-COPIED-URL-HERE',
   ```
5. Save file
6. Refresh leaderboard page

---

## 🎯 How to Update Weekly

### Method 1: Direct Edit
1. Open your Google Sheet
2. Update numbers in columns D, E, I, J
3. Save (auto-saves)
4. Leaderboard updates in 60 seconds!

### Method 2: Form Collection (Recommended!)

Create a Google Form to collect updates:

**Form Questions:**
1. Your Name (dropdown with all volunteer names)
2. Credentials Completed This Week (number)
3. Students Helped This Week (number)

**Link form responses to your sheet:**
- Form → Responses → Link to Sheets
- Use formulas to add weekly numbers to totals

---

## 📊 Advanced: Data Validation

Prevent errors with data validation:

### Status Column (G):
1. Select column G
2. Data > Data validation
3. Criteria: List of items
4. Items: `Active,Core Team,Inactive`
5. Check "Reject input"

### Own Completion (C):
1. Select column C
2. Data > Data validation
3. Criteria: List of items
4. Items: `Yes,No`

### Dates (H, I):
1. Select columns H and I
2. Data > Data validation
3. Criteria: Date
4. Format: YYYY-MM-DD

---

## 🔒 Privacy Settings

### Option 1: Public (Anyone with link)
Current setup - anyone with CSV URL can view

### Option 2: Restricted
- Share with specific emails only
- Still publish to web for CSV
- Only you can edit

**Recommended:** Keep sheet edit-only for you, but published CSV is okay (it's just volunteer names/scores, no sensitive data)

---

## 📱 Mobile Editing

Google Sheets app:
1. Download Google Sheets app
2. Open your tracker
3. Edit on the go!
4. Updates sync automatically

---

## 🎨 Sample Sheet Layout

```
┌──────────────────┬───────────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐
│ Volunteer Name   │ Email             │ Own Comp   │ Credentials│ Students   │ Total Impact│ Status     │ Join Date  │ Last Active│ Streak Days│
├──────────────────┼───────────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ Rahul Sharma     │ rahul@example.com │ Yes        │ 5          │ 8          │ 21         │ Active     │ 2024-10-15 │ 2024-10-23 │ 3          │
│ Priya Patel      │ priya@example.com │ Yes        │ 4          │ 6          │ 16         │ Active     │ 2024-10-15 │ 2024-10-23 │ 2          │
│ Amit Kumar       │ amit@example.com  │ Yes        │ 3          │ 7          │ 17         │ Core Team  │ 2024-10-14 │ 2024-10-23 │ 5          │
└──────────────────┴───────────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘
```

---

## ✅ Quick Checklist

- [ ] Created Google Sheet
- [ ] Added headers (exact names)
- [ ] Added sample/real data
- [ ] Applied formatting (optional)
- [ ] Set up auto-calculate formula (optional)
- [ ] Published sheet as CSV
- [ ] Copied CSV URL
- [ ] Updated config.js with URL
- [ ] Tested leaderboard
- [ ] Shared URL with volunteers

---

## 🎉 You're Done!

Your Google Sheets is now:
- ✅ Live data source for leaderboard
- ✅ Auto-syncing (updates in 60s)
- ✅ Easy to edit (just change numbers)
- ✅ Accessible from anywhere
- ✅ Mobile-friendly

---

## 💡 Pro Tips

1. **Weekly Updates:** Set calendar reminder every Monday
2. **Backup:** File > Download > CSV (backup your data)
3. **Version History:** File > Version history (see all changes)
4. **Comments:** Right-click cell > Insert comment (notes for yourself)
5. **Color Code:** Use colors to highlight top performers

---

## 📞 Troubleshooting

### Leaderboard not showing data?
- Check CSV URL in config.js
- Verify sheet is published (not just shared)
- Make sure output format is CSV (not HTML)

### Data not updating?
- Wait 60 seconds (cache refresh)
- Check you saved the sheet
- Try incognito mode in browser

### Wrong data showing?
- Check column order matches exactly
- Headers must be exact (case-sensitive)
- No extra spaces in data

---

**🎊 Your Google Sheets template is ready to use!**

Now just add your real volunteer data and watch the leaderboard come alive! 🚀
