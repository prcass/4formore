# 4forMore Physical Board Game - Prototype Plan

## Overview

Converting 4forMore from a digital game to a physical board game prototype with QR code integration for stat lookup.

**Goal:** Create a playable physical prototype that maintains the digital game's core mechanics while being practical to manufacture and play.

---

## Physical Components Needed

### 1. Token Cards (160 total)
**Specifications:**
- **Size:** 2.5" x 3.5" (poker card size) OR 1.5" circular stickers (Avery 8293)
- **Quantity:** 160 tokens (40 per category)
- **Front Face:**
  - Token name (large, readable)
  - Category icon/color coding
  - 4 tag indicators (A1-D5 positions around border)
  - QR code (links to stats lookup page)
  - Small 3-letter code for quick reference
- **Back Face:**
  - 4forMore logo
  - Category identifier
  - Card back pattern

**Categories:**
- 40 Movies (🎬 Red)
- 40 Countries (🌍 Blue)
- 40 Companies (🏢 Green)
- 40 Sports (⚽ Orange)

### 2. Challenge Cards (60-80 total)
**Specifications:**
- **Size:** 2.5" x 3.5" (poker card size)
- **Quantity:** 15-20 per category
- **Content:**
  - Category name + icon
  - Challenge name (e.g., "Box Office Gross")
  - Visual indicator for stat being compared
  - Instructions for setup

**Examples:**
- Movies: "Box Office", "Budget", "Runtime", "IMDb Rating"
- Countries: "Population", "GDP", "Land Area", "Coffee Consumption"
- Companies: "Revenue", "Employees", "Market Cap", "Founded Year"
- Sports: "Championships", "Revenue", "Stadium Capacity", "Founded Year"

### 3. Bonus Cards (33 total)
**Specifications:**
- **Size:** 2.5" x 3.5" (poker card size)
- **Content:**
  - Card name + emoji
  - Effect description
  - Usage timing indicator
  - Point value (if applicable)

**Card Types:**
- 3 Immediate Points (🪙💰💎)
- 2 Multipliers (✨🌟)
- 4 Token Manipulation (🎯🎴♻️🔄)
- 2 Passive Effects (🧠🛡️)
- 4 Defensive (🔒🛡️🔐🚫)
- 6 Set Collection Bonuses (🔴🟢🔵🟠🔢🍀)
- 5 End-Game Bonuses (💎🎴🏆📊🎯)
- 7 Insurance/Protection cards

### 4. Game Board/Play Mat
**Specifications:**
- **Size:** 24" x 36" neoprene playmat OR foldable board
- **Zones:**
  - Center Token Display (large, visible to all)
  - Draft Pool Area (12 token slots)
  - Challenge Card Selection Area (4 slots)
  - Bonus Card Pool (3 slots)
  - Player Hand Areas (4-6 players)
  - Round Tracker
  - Score Track

### 5. Player Components
**Per Player:**
- Score marker/tracker
- "This Round" token holder
- "Hand" token holder
- Bonus card holder
- Player aid card (quick reference)
- "Passed" marker
- "Locked Out" marker

### 6. Accessories
- **Dice/Spinner:** For first player selection
- **Turn Order Tracker**
- **Score Pad:** Paper sheets for tracking scores
- **QR Code Scanner:** Smartphone (player-provided)
- **Rule Book:** Comprehensive physical rulebook
- **Quick Reference Cards:** One per player

---

## QR Code Integration System

### Purpose
QR codes solve the problem of displaying complex statistics on physical cards without cluttering the design.

### Implementation

**1. QR Code on Each Token Card**
- Links to: `https://4formore.com/stats?token=[ID]`
- Opens a mobile-optimized page showing all stats for that token
- Works offline if data is cached

**2. Stats Lookup Page**
Mobile web page that displays:
- Token name + category
- **Current challenge stat** (large, highlighted)
- All other stats (collapsed/expandable)
- Related tokens suggestion
- Return to game button

**3. Data Structure**
```javascript
// URL: https://4formore.com/stats?token=MOV001
{
  id: "MOV001",
  name: "Avatar",
  category: "movies",
  tags: ["A1", "B2", "C3", "D4"],
  stats: {
    boxOffice: 2923706026,
    budget: 237000000,
    runtime: 162,
    imdbRating: 7.9,
    // ... 30+ stats
  }
}
```

**4. Challenge-Specific Display**
When a challenge is selected, players scan tokens to see:
- **Box Office Challenge:** Shows box office prominently
- **Budget Challenge:** Shows budget prominently
- Other stats hidden by default (expandable)

---

## Manufacturing Options

### Option 1: Print-and-Play (Prototype)
**Cost:** ~$50-100
- Print at home on cardstock
- Use Avery 8293 stickers for tokens
- Laminate cards with pouches
- Use existing card sleeves
- DIY playmat (printed poster board)

**Timeline:** 1-2 weeks
**Best for:** Initial testing and iteration

### Option 2: Print-on-Demand (The Game Crafter)
**Cost:** ~$300-500
- Professional card printing
- Custom playmat
- Tokens as poker-sized cards
- Packaged in box
- 1-2 copies for testing

**Timeline:** 3-4 weeks
**Best for:** Playtesting with groups

### Option 3: Small Run Manufacturing (MakePlayingCards.com)
**Cost:** ~$1000-2000 for 50-100 copies
- High quality cards
- Professional packaging
- Bulk pricing
- Custom box design

**Timeline:** 6-8 weeks
**Best for:** Crowdfunding backers, conventions

---

## Prototype Build Steps

### Phase 1: Digital Assets (Week 1)
- [ ] Create token card templates (Figma/Illustrator)
- [ ] Design challenge card templates
- [ ] Design bonus card templates
- [ ] Generate QR codes for all 160 tokens
- [ ] Create stats lookup webpage
- [ ] Design playmat layout

### Phase 2: Print-and-Play Version (Week 2)
- [ ] Generate printable PDFs for all cards
- [ ] Print on cardstock (8.5x11 sheets)
- [ ] Cut and laminate cards
- [ ] Apply Avery 8293 stickers with QR codes to token cards
- [ ] Create DIY playmat
- [ ] Print player aid cards
- [ ] Print rulebook

### Phase 3: Testing & Iteration (Weeks 3-4)
- [ ] Playtest with 2 players
- [ ] Playtest with 4 players
- [ ] Playtest with 6 players
- [ ] Gather feedback on card sizes, readability
- [ ] Test QR code scanning speed
- [ ] Iterate on card designs
- [ ] Refine rulebook based on confusion points

### Phase 4: Professional Prototype (Week 5-6)
- [ ] Upload to The Game Crafter
- [ ] Order 2-3 professional prototypes
- [ ] Test with new players
- [ ] Document gameplay videos
- [ ] Prepare for crowdfunding/pitching

---

## Technical Requirements

### Stats Lookup Website
**Tech Stack:**
- Static HTML/CSS/JavaScript (no backend needed)
- Hosted on GitHub Pages: https://prcass.github.io/4formore/stats/
- Cached data for offline play
- Mobile-first responsive design

**Features:**
- QR code scanning redirects to token page
- Clean, readable stat display
- Challenge-aware highlighting
- Quick navigation between tokens
- Print-friendly stat sheets

### QR Code Generation
```javascript
// Generate QR codes for all 160 tokens
const QRCode = require('qrcode');
const tokens = [...]; // Load from v4_token_datasets.js

tokens.forEach(token => {
  const url = `https://prcass.github.io/4formore/stats?token=${token.id}`;
  QRCode.toFile(`qr/${token.id}.png`, url, {
    width: 150,
    margin: 1
  });
});
```

---

## Card Design Specifications

### Token Card Layout (2.5" x 3.5")
```
┌─────────────────────┐
│  [QR]    AVATAR     │ ← Name (large, bold)
│                     │
│    🎬 MOVIES       │ ← Category
│                     │
│  A1  B2  C3  D4    │ ← Tags (colored blobs)
│                     │
│       [MOV001]     │ ← 3-letter code
└─────────────────────┘
```

### Challenge Card Layout (2.5" x 3.5")
```
┌─────────────────────┐
│   🎬 MOVIES         │
│                     │
│  BOX OFFICE GROSS   │ ← Challenge name
│                     │
│  Compare which      │
│  movie earned more  │
│  at the box office  │
│                     │
│  $$$  💰  $$$      │
└─────────────────────┘
```

### Bonus Card Layout (2.5" x 3.5")
```
┌─────────────────────┐
│  ✨ DOUBLE DOWN     │
│                     │
│  MULTIPLIER         │ ← Card type
│                     │
│  Play before        │
│  cashing in:        │
│  Next cash-in       │
│  worth 2x points    │
│                     │
│  (1 use)            │
└─────────────────────┘
```

---

## Cost Breakdown

### Print-and-Play Prototype
| Item | Quantity | Cost |
|------|----------|------|
| Cardstock (110 lb) | 10 sheets | $5 |
| Laminating pouches | 250 pack | $20 |
| Avery 8293 stickers | 250 labels | $25 |
| Ink/toner | - | $30 |
| Card sleeves | 200 pack | $15 |
| Playmat (DIY) | 1 | $10 |
| **Total** | | **~$105** |

### The Game Crafter Prototype
| Item | Quantity | Cost |
|------|----------|------|
| Poker cards | 253 cards | $90 |
| Custom playmat | 1 | $60 |
| Box | 1 | $8 |
| Rulebook | 1 | $15 |
| Shipping | - | $20 |
| **Total** | | **~$193** |

---

## Next Steps

1. **Immediate:** Create token card template in design software
2. **This Week:** Generate QR codes for all 160 tokens
3. **This Week:** Build stats lookup webpage
4. **Next Week:** Print first 40 token cards (one category)
5. **Next Week:** Playtest with one category to validate mechanics

---

## Questions to Resolve

1. **Card Size:** 2.5x3.5" poker cards vs 1.5" circular stickers?
   - Poker cards: More room for info, easier to shuffle
   - Circular: Matches digital design, unique aesthetic

2. **QR Code Position:** Where on card for best scanning?
   - Top corner: Easy to scan without revealing other info
   - Center: Large and prominent but takes design space

3. **Stat Display:** Show stats on cards or QR-only?
   - QR-only: Cleaner design, mystery preserved
   - Partial stats: Some stats visible, full stats via QR

4. **Draft Pool Display:** How to physically show 12 tokens?
   - Card holder/rack
   - Laid out on playmat
   - Vertical stands

---

**Created:** October 18, 2025
**Status:** Planning Phase
**Next Milestone:** Token card template + QR code generation
