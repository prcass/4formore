# 4forMore Physical Game - QR Scan App Specification

## Overview

Progressive Web App (PWA) that enables physical board game play through QR code scanning with offline capability and automatic updates.

---

## System Architecture

### Progressive Web App (PWA)
- **Hosted:** https://prcass.github.io/4formore/play/
- **Offline-First:** Full functionality without internet
- **Auto-Updates:** Checks for new data when online
- **Mobile-Optimized:** Designed for smartphone scanning

### Data Storage

**Remote Data Files (GitHub Pages):**
```
https://prcass.github.io/4formore/data/
├── tokens.json          // All 160 tokens with stats
├── challenges.json      // All challenge cards
├── manifest.json        // Version tracking
└── version.txt          // Simple version check
```

**Local Caching (Browser):**
- IndexedDB for token/challenge data
- Service Worker for offline capability
- Version checking on app launch
- Automatic background updates

---

## QR Code System

### QR Code Formats

**Challenge Cards:**
```
https://prcass.github.io/4formore/play?type=challenge&id=MOV_BOXOFFICE
```

**Token Cards:**
```
https://prcass.github.io/4formore/play?type=token&id=MOV001
```

### QR Code Properties
- **Size:** 20-25mm square
- **Error Correction:** High (30% redundancy for damaged stickers)
- **URL Length:** <50 characters for optimal scanning
- **Unique IDs:** Each token/challenge has unique identifier

---

## Game Flow

### 1. App Launch
```
┌─────────────────────────┐
│   4forMore Physical     │
│                         │
│  [Tap to Start Game]    │
│                         │
│  ⚡ Ready (Offline)     │ ← Shows if cached data available
│  🔄 Checking Updates... │ ← If online
└─────────────────────────┘
```

### 2. Challenge Selection
```
┌─────────────────────────┐
│   Select Challenge      │
│                         │
│  📷 Scan Challenge      │
│      Card               │
│                         │
│  [Camera viewfinder]    │
│                         │
└─────────────────────────┘
```

**After Scan:**
```
┌─────────────────────────┐
│   Challenge Selected    │
│                         │
│   🎬 MOVIES             │
│   Box Office Gross      │
│                         │
│  [Continue]             │
└─────────────────────────┘
```

### 3. Scan Center Token
```
┌─────────────────────────┐
│   Scan Center Token     │
│                         │
│   Challenge: Box Office │
│                         │
│  📷 Scan the center     │
│      token              │
│                         │
│  [Camera viewfinder]    │
└─────────────────────────┘
```

**After Scan:**
```
┌─────────────────────────┐
│   Center Token Set      │
│                         │
│      AVATAR             │
│   [AVA] - Movies        │
│                         │
│   Ready to compare!     │
│                         │
│  [Continue]             │
└─────────────────────────┘
```

### 4. Make Your Guess
```
┌─────────────────────────┐
│   Make Your Guess       │
│                         │
│   Center: AVATAR        │
│   Box Office: ???       │ ← Value hidden
│                         │
│  ┌───────────────────┐  │
│  │   📉 LOWER        │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │   📈 HIGHER       │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### 5. Scan Your Token
```
┌─────────────────────────┐
│   Scan Your Token       │
│                         │
│   Your Guess: HIGHER    │
│   Center: AVATAR        │
│                         │
│  📷 Scan your selected  │
│      token              │
│                         │
│  [Camera viewfinder]    │
└─────────────────────────┘
```

### 6. Result Screen

**CORRECT:**
```
┌─────────────────────────┐
│   ✅ CORRECT!           │
│                         │
│   TITANIC               │
│   $2.26 Billion         │
│                         │
│   is HIGHER than        │
│                         │
│   AVATAR                │
│   $2.92 Billion         │
│                         │
│  [Continue Turn]        │
└─────────────────────────┘
```

**WRONG:**
```
┌─────────────────────────┐
│   ❌ WRONG!             │
│                         │
│   TITANIC               │
│   $2.26 Billion         │
│                         │
│   is LOWER than         │
│                         │
│   AVATAR                │
│   $2.92 Billion         │
│                         │
│  You guessed: HIGHER    │
│                         │
│  [Next Player]          │
└─────────────────────────┘
```

### 7. Continue (If Correct)
```
┌─────────────────────────┐
│   New Center Token      │
│                         │
│      TITANIC            │
│   [TIT] - Movies        │
│   $2.26 Billion         │
│                         │
│  Ready for next guess!  │
│                         │
│  [Make Guess]           │
└─────────────────────────┘
```
→ Returns to step 4 (Make Your Guess)

---

## Data Structure

### tokens.json
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-10-18T20:00:00Z",
  "tokens": {
    "MOV001": {
      "id": "MOV001",
      "name": "Avatar",
      "code": "AVA",
      "category": "movies",
      "categoryColor": "#E74C3C",
      "tags": ["A1", "B2", "C3", "D4"],
      "stats": {
        "boxOffice": 2923706026,
        "budget": 237000000,
        "runtime": 162,
        "imdbRating": 7.9,
        "releaseYear": 2009,
        "oscarsWon": 3,
        "oscarNoms": 9,
        "metascore": 83,
        "rottenTomatoes": 82
      }
    },
    "COU001": {
      "id": "COU001",
      "name": "United States",
      "code": "USA",
      "category": "countries",
      "categoryColor": "#3498DB",
      "tags": ["A2", "B1", "C4", "D3"],
      "stats": {
        "population": 331893745,
        "gdpTotal": 21433226000000,
        "landArea": 9833517,
        "lifeExpectancy": 78.9,
        "coffeeConsumption": 4.43,
        "internetUsers": 87.27
      }
    }
  }
}
```

### challenges.json
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-10-18T20:00:00Z",
  "challenges": {
    "MOV_BOXOFFICE": {
      "id": "MOV_BOXOFFICE",
      "name": "Box Office Gross",
      "category": "movies",
      "categoryColor": "#E74C3C",
      "statKey": "boxOffice",
      "displayFormat": "currency",
      "description": "Compare total worldwide box office earnings"
    },
    "COU_POPULATION": {
      "id": "COU_POPULATION",
      "name": "Population",
      "category": "countries",
      "categoryColor": "#3498DB",
      "statKey": "population",
      "displayFormat": "number",
      "description": "Compare total population"
    }
  }
}
```

### manifest.json (PWA Metadata)
```json
{
  "name": "4forMore Physical Game",
  "short_name": "4forMore Play",
  "description": "QR scan app for 4forMore physical board game",
  "start_url": "/4formore/play/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#764ba2",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## Technical Implementation

### File Structure
```
/4formore/play/
├── index.html           // Main app page
├── app.js               // Core game logic
├── scanner.js           // QR scanning (using html5-qrcode library)
├── storage.js           // IndexedDB + caching
├── sync.js              // Update checking and downloading
├── ui.js                // Screen rendering
├── styles.css           // Mobile-first styling
├── manifest.json        // PWA manifest
├── sw.js                // Service worker (offline support)
└── /data/
    ├── tokens.json      // Token database
    ├── challenges.json  // Challenge database
    └── version.txt      // Simple version number
```

### Key Technologies

**QR Scanning:**
- Library: html5-qrcode (https://github.com/mebjas/html5-qrcode)
- Camera access via getUserMedia API
- Automatic QR detection and parsing

**Offline Storage:**
- IndexedDB for token/challenge data (~500KB)
- Service Worker for app caching
- Cache-first strategy with update checks

**Update System:**
```javascript
// On app launch (when online)
async function checkForUpdates() {
  const localVersion = await getLocalVersion();
  const remoteVersion = await fetch('/data/version.txt').then(r => r.text());

  if (remoteVersion > localVersion) {
    // Download new data in background
    await downloadUpdates();
    showUpdateNotification("New tokens and challenges available!");
  }
}
```

**State Management:**
```javascript
const gameState = {
  challenge: null,        // Current challenge card
  centerToken: null,      // Current center token
  playerGuess: null,      // "higher" or "lower"
  scannedToken: null,     // Token being compared
  history: []             // Array of previous comparisons
};
```

---

## Update Workflow

### For You (Data Updates)

**Step 1: Edit Data**
```bash
# Edit the JSON files locally
cd /home/randycass/projects/4formore/data/
# Update tokens.json with new population data
# Or add new token to the list
```

**Step 2: Update Version**
```bash
# Increment version number
echo "1.0.1" > version.txt

# Update version in tokens.json
{
  "version": "1.0.1",
  "lastUpdated": "2025-10-19T12:00:00Z",
  ...
}
```

**Step 3: Deploy**
```bash
git add data/
git commit -m "Update population data for 2025"
git push origin main
# GitHub Pages auto-deploys in 1-2 minutes
```

**Step 4: Users Auto-Update**
- Next time users open app with internet
- App detects new version
- Downloads new data in background
- Shows "Data updated!" notification
- No action needed from users

### For Users (Automatic)

**With Internet:**
1. Open app
2. App checks version (1-2 seconds)
3. If new data: "Updating..." → "Ready!"
4. If no update: Immediate "Ready!"
5. Can start playing

**Without Internet:**
1. Open app
2. Uses cached data
3. Shows "Offline Mode" indicator
4. Fully functional
5. Will update next time online

---

## Display Formats

### Currency (Box Office, Revenue, Budget)
```javascript
formatValue(2923706026, "currency")
// → "$2.92 Billion"

formatValue(237000000, "currency")
// → "$237 Million"
```

### Numbers (Population, Employees)
```javascript
formatValue(331893745, "number")
// → "331.9 Million"

formatValue(1412000000, "number")
// → "1.41 Billion"
```

### Decimals (Ratings, Percentages)
```javascript
formatValue(7.9, "decimal")
// → "7.9"

formatValue(87.27, "percentage")
// → "87.3%"
```

### Years
```javascript
formatValue(2009, "year")
// → "2009"
```

---

## Error Handling

### Invalid QR Code
```
┌─────────────────────────┐
│   ⚠️ Invalid Code       │
│                         │
│   This QR code is not   │
│   recognized.           │
│                         │
│   Please scan a valid   │
│   4forMore card.        │
│                         │
│  [Try Again]            │
└─────────────────────────┘
```

### Wrong Category
```
┌─────────────────────────┐
│   ⚠️ Wrong Category     │
│                         │
│   Challenge: Movies     │
│   Scanned: USA (Country)│
│                         │
│   Please scan a MOVIE   │
│   token.                │
│                         │
│  [Try Again]            │
└─────────────────────────┘
```

### Camera Permission Denied
```
┌─────────────────────────┐
│   📷 Camera Access      │
│                         │
│   Camera permission is  │
│   required to scan QR   │
│   codes.                │
│                         │
│   Please enable camera  │
│   access in settings.   │
│                         │
│  [Settings]             │
└─────────────────────────┘
```

### No Internet (First Load)
```
┌─────────────────────────┐
│   📡 No Connection      │
│                         │
│   First time setup      │
│   requires internet to  │
│   download game data.   │
│                         │
│   Please connect and    │
│   try again.            │
│                         │
│  [Retry]                │
└─────────────────────────┘
```

---

## Features

### Core Features (Phase 1)
- ✅ QR code scanning (challenge + token cards)
- ✅ Higher/Lower guessing
- ✅ Result validation with comparison
- ✅ Offline functionality
- ✅ Auto-updates when online
- ✅ Mobile-optimized UI
- ✅ Category color coding
- ✅ Error handling

### Enhanced Features (Phase 2)
- 🔄 Game history (view last 10 comparisons)
- 🔄 Challenge info popup (explain what stat means)
- 🔄 "Skip" button (pass on a guess)
- 🔄 Sound effects (correct/wrong)
- 🔄 Vibration feedback
- 🔄 Dark mode
- 🔄 Multiple language support

### Advanced Features (Phase 3)
- 🔄 Multi-player mode (pass device, track turns)
- 🔄 Score tracking per session
- 🔄 Statistics (accuracy, favorite category)
- 🔄 Admin panel (view all tokens, test mode)

---

## Security & Privacy

### Data Privacy
- ✅ No personal data collected
- ✅ No analytics or tracking
- ✅ No user accounts required
- ✅ All data stored locally
- ✅ No server-side processing

### QR Code Security
- ✅ All QR codes point to our domain only
- ✅ URL validation before processing
- ✅ No external redirects
- ✅ Safe for public use

---

## Performance Targets

### Load Time
- First load (with download): <5 seconds
- Subsequent loads (cached): <1 second
- QR scan recognition: <500ms
- Result calculation: <100ms

### Data Size
- tokens.json: ~400KB
- challenges.json: ~20KB
- App code: ~100KB
- Total initial download: ~520KB
- Cached size: ~600KB (with images)

### Battery Usage
- Camera active: ~10% per hour
- Idle mode: <1% per hour
- Background updates: <1% per day

---

## Testing Checklist

### Functionality
- [ ] Scan challenge card sets challenge
- [ ] Scan center token sets baseline
- [ ] Higher/Lower buttons work
- [ ] Scan draft token triggers comparison
- [ ] Correct guess shows green screen
- [ ] Wrong guess shows red screen
- [ ] Center token updates on correct guess
- [ ] Category validation works
- [ ] Wrong category shows error

### Offline Mode
- [ ] Works without internet after first load
- [ ] Cached data persists between sessions
- [ ] Update check happens when online
- [ ] Graceful handling of offline state

### Edge Cases
- [ ] Scanning same token twice
- [ ] Scanning challenge during token scan
- [ ] Rapid scanning (debounce)
- [ ] Low light QR scanning
- [ ] Damaged/partial QR codes
- [ ] Browser back button handling

### Cross-Browser
- [ ] Chrome (Android)
- [ ] Safari (iOS)
- [ ] Firefox (Android)
- [ ] Samsung Internet
- [ ] Edge

### Devices
- [ ] iPhone 12+
- [ ] Android 10+
- [ ] Tablet (iPad)
- [ ] Small screens (iPhone SE)
- [ ] Large screens (iPad Pro)

---

## Development Roadmap

### Week 1: Core App
- [x] Design specifications ← YOU ARE HERE
- [ ] Set up project structure
- [ ] Implement QR scanning
- [ ] Build basic UI screens
- [ ] Connect data flow

### Week 2: Data & Logic
- [ ] Generate tokens.json from v4_token_datasets.js
- [ ] Create challenges.json
- [ ] Implement comparison logic
- [ ] Add offline caching
- [ ] Test with sample QR codes

### Week 3: Polish & Testing
- [ ] Add animations and feedback
- [ ] Implement update system
- [ ] Cross-browser testing
- [ ] Error handling refinement
- [ ] Performance optimization

### Week 4: Deployment
- [ ] Generate all 160 QR codes
- [ ] Print test sticker sheet
- [ ] Physical playtest
- [ ] Deploy to GitHub Pages
- [ ] Documentation

---

## Next Steps

1. **Generate QR Codes** - Create URLs for all tokens/challenges
2. **Build Data Files** - Convert v4_token_datasets.js → tokens.json
3. **Create App Prototype** - Build basic scanning interface
4. **Test QR Scanning** - Print test stickers, verify scan speed
5. **Physical Playtest** - Play a round with prototype stickers

---

**Created:** October 18, 2025
**Status:** Specification Complete
**Next Milestone:** Build core scanning app
