# Personalized Dashboard - Complete Testing Guide

## Pre-Requisites

Before testing, ensure:
- ✅ Backend is running on `http://localhost:5000`
- ✅ Frontend is running on `http://localhost:5173` (Vite dev server)
- ✅ Database is seeded with player data
- ✅ All code changes are saved (no unsaved files)

---

## Test Scenario 1: Login with Player Account

### Steps:
1. Navigate to `http://localhost:5173/auth`
2. Select "Player" role (if not already selected)
3. Enter valid player credentials:
   - **Username**: `blacko7G` (or any player from your database)
   - **Password**: (your test password)
4. Click "Login"

### Expected Results:
✅ User should be redirected to `/player/dashboard`  
✅ `localStorage` should contain:
   - `token`: JWT token string
   - `username`: "blacko7G"
   - `userRole`: "player"
✅ Dashboard should show loading skeleton briefly
✅ Dashboard should render with Blacko's data

### Verify in Browser Console:
```javascript
// Open DevTools Console and run:
console.log(localStorage.getItem('token'));    // Should show token
console.log(localStorage.getItem('username'));  // Should show "blacko7G"
console.log(localStorage.getItem('userRole'));  // Should show "player"
```

---

## Test Scenario 2: Verify Header Personalization

### Steps:
1. After logging in as player "blacko7G"
2. Look at the header section
3. Look at the hero section title

### Expected Results:
✅ Header greeting should say: **"Welcome back, Blacko"** (using firstName)  
✅ Sub-text should show: **"Lagos City FC • Striker"** (using club and position)
✅ Hero title should display: **"BLACKO EMMANUEL"** (firstName + lastName)
✅ All should be personalized to the logged-in player's real data

### Example Output:
```
═══════════════════════════════════════════
Welcome back, Blacko
Lagos City FC • Striker                    [Settings]
═══════════════════════════════════════════
```

---

## Test Scenario 3: Verify Profile Photo & Stats

### Steps:
1. Scroll to hero section
2. Look at profile photo
3. Check the quick stats row below photo

### Expected Results:
✅ Profile photo should display (not placeholder)  
✅ ⭐ Star badge visible on photo (indicating featured player)  
✅ Four stat cards below showing:
   - **Goals**: Number from DB (e.g., 12)
   - **Assists**: Number from DB (e.g., 5)
   - **Matches**: Number from DB (e.g., 20)
   - **Value**: Formatted market value (e.g., ₦500K)

### Example:
```
┌────────────────────────────────────────────┐
│ [PHOTO] ⭐                                 │
│         BLACKO EMMANUEL                    │
│         Striker • 23 years • 🇳🇬           │
│                                            │
│ ┌────┬────┬────┬──────────┐               │
│ │ 12 │ 5  │ 20 │ ₦500K    │               │
│ │GOALS│ASST│MATC│VALUE    │               │
│ └────┴────┴────┴──────────┘               │
└────────────────────────────────────────────┘
```

---

## Test Scenario 4: Verify Availability Status Badge

### Steps:
1. Look at top-right corner of hero section
2. Check the status badge color and text

### Expected Results:
✅ Badge should display player's availability status:
   - **Green badge**: "Open to move" (player available for transfer)
   - **Blue badge**: "Signed until 2027" (player under contract)
   - **Yellow badge**: "Not specified" (default/unknown status)

### Badge Colors:
- ✅ Green: `bg-green-500/20 text-green-300 border border-green-500/30`
- ✅ Blue: `bg-blue-500/20 text-blue-300 border border-blue-500/30`
- ✅ Yellow: `bg-yellow-500/20 text-yellow-300 border border-yellow-500/30`

---

## Test Scenario 5: Verify Performance Analytics

### Steps:
1. Scroll to "Your Performance" section
2. Check the four stat cards

### Expected Results:
✅ Should show 4 cards with icons and real player data:
   - ⭐ **Overall Rating**: e.g., 82
   - ⚡ **Potential**: e.g., 88
   - 🎯 **Pass Accuracy**: e.g., 78%
   - 🛡️ **Defensive**: e.g., 45

### Expected Layout:
```
Your Performance
┌──────────┬──────────┬──────────┬──────────┐
│ ⭐       │ ⚡       │ 🎯       │ 🛡️       │
│ Overall  │ Potential│ Pass     │ Defensive│
│ Rating   │          │ Accuracy │          │
│   82     │   88     │   78%    │   45     │
└──────────┴──────────┴──────────┴──────────┘
```

---

## Test Scenario 6: Verify Recent Matches Section

### Steps:
1. Scroll to "Recent Matches" section
2. Check if matches display

### Expected Results:
✅ If player has matches in DB:
   - Should show up to 5 most recent matches
   - Each match should display:
     - Opponent name
     - Date of match
     - Player's goals and assists (right side)
     - Match result (Won 3-1, Drew 1-1, Lost 0-2, etc.)

✅ If player has no matches:
   - Should show message: "No recent matches recorded."

### Example:
```
Recent Matches
┌─────────────────────────────────────┐
│ Lagos City vs Arsenal               │
│ Yesterday                    2G 1A  │
│                          Won 3-1    │
├─────────────────────────────────────┤
│ Lagos City vs United                │
│ 3 days ago                   1G 0A  │
│                          Drew 1-1   │
└─────────────────────────────────────┘
```

---

## Test Scenario 7: Verify Scouts Interested Section

### Steps:
1. Scroll to "❤️ Scouts Watching You" section
2. Check if scouts display

### Expected Results:
✅ If player has scouts who shortlisted them:
   - Should show count: "Scouts Watching You (3)" 
   - Display up to 6 scouts in grid
   - Each scout card shows:
     - Scout icon/avatar
     - Scout name
     - Organization (club/team)
     - [View Profile] button

✅ If player has no scouts:
   - Section should not appear or show "No scouts yet"

### Example:
```
❤️ Scouts Watching You (3)
┌──────────┬──────────┬──────────┐
│ 👥 Coach │ 👥 Scout │ 👥 Mgr  │
│ John     │ Ahmed    │ Chioma   │
│ Real     │ Juventus │ Arsenal  │
│ Madrid   │          │          │
│ [View]   │ [View]   │ [View]   │
└──────────┴──────────┴──────────┘
```

---

## Test Scenario 8: Verify Highlights Section

### Steps:
1. Scroll to "📹 Your Highlights" section
2. Check if highlights display

### Expected Results:
✅ If player has highlights:
   - Should show section with video count
   - Display up to 6 video thumbnails
   - Each thumbnail shows:
     - Video placeholder (play icon)
     - Video title
     - Video duration

✅ If player has no highlights:
   - Section should not appear or show "No highlights yet"

### Example:
```
📹 Your Highlights (6)
┌──────────┬──────────┬──────────┐
│ [VIDEO]  │ [VIDEO]  │ [VIDEO]  │
│ Assist   │ Goal     │ Dribble  │
│ 2:30     │ 1:45     │ 3:12     │
└──────────┴──────────┴──────────┘
```

---

## Test Scenario 9: Verify CTA Section

### Steps:
1. Scroll to bottom "Ready to Shine?" section
2. Check buttons

### Expected Results:
✅ "Ready to Shine?" section should display with:
   - Descriptive text about completing profile
   - ✅ **[Edit Profile]** button (navigates to `/player/settings` or profile edit page)
   - ✅ **[Find Sponsorships]** button (navigates to `/player/sponsorships`)

---

## Test Scenario 10: Test Loading State

### Steps:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Throttle network to "Slow 3G"
4. Login with player account
5. Watch dashboard load

### Expected Results:
✅ While API call is in progress:
   - Hero section shows skeleton loader (animated shimmer)
   - Stats cards show skeleton loaders
   - Other sections show skeleton loaders
✅ Skeletons use `animate-pulse` for smooth animation
✅ Loading state preserved until API returns
✅ Content appears smoothly once data loads

---

## Test Scenario 11: Test Error State

### Steps:
1. Create an invalid player record (empty username)
2. Or use a username that doesn't exist in DB
3. Try to login or manually navigate to dashboard

### Expected Results:
✅ Should see error state with:
   - ⚠️ Warning icon
   - Heading: "Unable to Load Profile"
   - Message: "Player profile not found. Complete your profile in settings."
   - **[Complete Your Profile]** button
✅ Button navigates to profile edit page
✅ Design doesn't look broken, looks intentional

---

## Test Scenario 12: Test with Multiple Players

### Steps:
1. Log in as Player A (e.g., "blacko7G")
2. Check dashboard shows Player A's data
3. Logout (or clear localStorage)
4. Log in as Player B (different username)
5. Check dashboard shows Player B's data

### Expected Results:
✅ Player A Dashboard:
   - Greeting: "Welcome back, {FirstNameA}"
   - Stats and data from Player A
✅ Player B Dashboard:
   - Greeting: "Welcome back, {FirstNameB}"
   - Stats and data from Player B
✅ Each player's data is completely personalized

### Test Data:
```
Player A: username=blacko7G, firstName=Blacko
Player B: username=odion_ighalo, firstName=Odion

After login:
PersonalizedDashboard for A: "Welcome back, Blacko" + Blacko's stats
PersonalizedDashboard for B: "Welcome back, Odion" + Odion's stats
```

---

## Test Scenario 13: Test Auth Header in API Call

### Steps:
1. Open DevTools Network tab
2. Login and navigate to dashboard
3. Find the API call to `/api/players/username/:username`
4. Click on it and check Headers

### Expected Results:
✅ Request should include:
   - **Authorization Header**: `Bearer {token}`
   - **Content-Type**: `application/json`

### Example:
```
GET /api/players/username/blacko7G HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## Test Scenario 14: Test Response Format

### Steps:
1. Open DevTools Network tab
2. Login and navigate to dashboard
3. Find the API response for `/api/players/username/:username`
4. Click on Response tab

### Expected Results:
✅ Response should match format:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "blacko7G",
    "firstName": "Blacko",
    "lastName": "Emmanuel",
    "position": "Striker",
    "age": 23,
    "club": "Lagos City FC",
    "nationality": "Nigeria",
    "profilePicture": "https://example.com/photo.jpg",
    "bio": "Professional footballer passionate...",
    "marketValue": 500000000,
    "availability": "Open to move",
    "stats": {
      "goals": 12,
      "assists": 5,
      "appearances": 20,
      "overallRating": 82,
      "potential": 88,
      "passAccuracy": 78,
      "defensive": 45
    },
    "matches": [...],
    "shortlistedBy": [...],
    "highlights": [...]
  }
}
```

---

## Test Scenario 15: Test Responsive Design

### Steps:
1. Open dashboard in browser
2. Resize browser window or use DevTools device emulation

### Expected Results:
✅ **Desktop (1920px+)**:
   - Hero: Photo left, info right (side-by-side)
   - Stats: 4 columns grid
   - Scouts: 3 columns
   - Highlights: 3 columns

✅ **Tablet (768px)**:
   - Hero: Photo top, info below (stacked)
   - Stats: 2 columns grid
   - Scouts: 2-3 columns
   - Highlights: 2 columns

✅ **Mobile (375px)**:
   - Hero: Full-width stacked
   - Stats: 1 column (stack)
   - Scouts: 1 column or 2
   - Highlights: 1 column
   - All text readable, buttons clickable

---

## Test Scenario 16: Test Browser Console for Errors

### Steps:
1. Open DevTools Console
2. Navigate through dashboard
3. Check for any errors

### Expected Results:
✅ No errors in console related to:
   - Authentication
   - API calls
   - Component rendering
   - CORS issues

✅ Normal logs are acceptable (debug logs, info messages)

---

## Test Scenario 17: Test Animations

### Steps:
1. Login to dashboard
2. Watch sections appear
3. Scroll down page
4. Observe video playback

### Expected Results:
✅ Entrance animations:
   - Hero section fades in with slight upward movement
   - Stats grid fades in with staggered timing
   - Each section card appears with fade + slide effect

✅ Scroll effects:
   - Page scrolling should affect video playback speed

---

## Debugging Checklist

If tests fail, check:

### Login Issues:
- [ ] Is localStorage being set correctly?
  ```javascript
  localStorage.getItem('token')
  localStorage.getItem('username')
  localStorage.getItem('userRole')
  ```
- [ ] Are all three values present and correct?
- [ ] Is userRole specifically "player"?

### Dashboard Not Loading Data:
- [ ] Is API call being made? (Check Network tab)
- [ ] Is Authorization header present?
- [ ] Is backend returning 200 status?
- [ ] Check browser console for error details
- [ ] Verify player exists in database with that username

### Data Display Issues:
- [ ] Check API response format matches expected structure
- [ ] Verify player has required fields (firstName, lastName, position, etc.)
- [ ] Check if stats object exists and has expected properties
- [ ] Look for undefined values or null checks needed

### Styling Issues:
- [ ] Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
- [ ] Check if Tailwind is loaded (inspect element styles)
- [ ] Verify glass/glass-strong utility classes are defined
- [ ] Check for CSS conflicts with other components

### Animation Issues:
- [ ] Verify GSAP library is loaded (check Network tab)
- [ ] Check browser DevTools Performance tab
- [ ] Disable animations temporarily to check if core works

---

## Quick Validation Script

Run this in browser console to validate everything:

```javascript
// Check localStorage
console.log("=== localStorage Check ===");
console.log("token:", localStorage.getItem('token') ? "✅" : "❌");
console.log("username:", localStorage.getItem('username') ? "✅" : "❌");
console.log("userRole:", localStorage.getItem('userRole') ? "✅" : "❌");

// Check if DOM elements exist
console.log("\n=== DOM Elements Check ===");
console.log("Header greeting:", document.querySelector('h1')?.textContent || "❌");
console.log("Profile photo:", document.querySelector('img[alt]') ? "✅" : "❌");
console.log("Stats cards:", document.querySelectorAll('[class*="glass"]').length + " found");

// Check Network
console.log("\n=== Network Check ===");
console.log("Last API call status visible in Network tab");
```

---

## Success Criteria

Dashboard is working correctly if:

✅ Player logs in and is redirected to `/player/dashboard`  
✅ Header greeting uses player's first name (personalized)  
✅ All player data displays correctly (name, photo, position, club)  
✅ Stats cards show real numbers from database  
✅ Recent matches list displays (if exists)  
✅ Scouts interested section works (if scouts exist)  
✅ Highlights section displays (if highlights exist)  
✅ Loading state shows briefly while fetching  
✅ Error state shows friendly message if data missing  
✅ Buttons navigate to correct pages  
✅ Responsive on mobile/tablet/desktop  
✅ No console errors  
✅ Animations play smoothly  

If ALL checkmarks are ✅, the personalized dashboard is working perfectly!

