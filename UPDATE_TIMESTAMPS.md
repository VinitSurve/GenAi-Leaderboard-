# ⚙️ How to Update Timestamps

## 🎯 Quick Instructions

**When you update data, edit this ONE file**: `js/config.js`

---

## 📝 Example Update

### Before:
```javascript
leaderboardLastUpdate: '2024-10-18T14:30:00',  // Oct 18, 2:30 PM
swagsLastUpdate: '2024-10-18T14:30:00',         // Oct 18, 2:30 PM
```

### After (updating on Oct 18 at 4:45 PM):
```javascript
leaderboardLastUpdate: '2024-10-18T16:45:00',  // Oct 18, 4:45 PM
swagsLastUpdate: '2024-10-18T16:45:00',         // Oct 18, 4:45 PM
```

---

## 🕐 Time Conversion

**AM Times** (morning):
- 9:00 AM = `09:00:00`
- 10:30 AM = `10:30:00`
- 11:45 AM = `11:45:00`

**PM Times** (afternoon/evening - add 12):
- 12:00 PM = `12:00:00` (noon)
- 1:00 PM = `13:00:00`
- 2:30 PM = `14:30:00`
- 4:45 PM = `16:45:00`
- 9:00 PM = `21:00:00`

---

## 📋 Full Format

`'YYYY-MM-DDTHH:MM:SS'`

Example: `'2024-10-18T14:30:00'`
- `2024` = Year
- `10` = October (month)
- `18` = Day
- `T` = Separator (don't change)
- `14:30:00` = 2:30 PM

---

## ✅ That's All!

Just edit `js/config.js` and update the timestamp. Save the file and you're done!

**See full guide**: `docs/QUICK_UPDATE_TIMESTAMPS.md`
