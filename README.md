# 4forMore - Multiplayer Guessing Game

**Version:** 5.1.19
**Type:** Web-based multiplayer game (Local + Online)
**Players:** 2-6 players

## What is 4forMore?

4forMore is a strategic higher/lower guessing game where players compete to collect tokens by making accurate guesses about statistical data. Features include:

- **4 Token Categories:** Movies, Countries, Companies, Sports
- **160 Unique Tokens:** Each with 30+ statistical properties
- **Bonus Card System:** 20 unique cards with special effects
- **Dual Game Modes:** Local pass-and-play or online multiplayer via Firebase
- **Strategic Depth:** Cash-out timing, bonus cards, and token manipulation

## Quick Start

### Local Multiplayer (Pass-and-Play)

1. **Start a local server:**
   ```bash
   python3 -m http.server 8000
   ```

2. **Open the game:**
   Navigate to `http://localhost:8000/multiplayer.html`

3. **Select "Local Mode"** and start playing!

### Online Multiplayer (Firebase)

1. Open `multiplayer.html` in your browser
2. Select "Online Multiplayer"
3. Create or join a room with a 4-digit code
4. Share the code with friends to play together

## Game Files

- **multiplayer.html** - Main game interface (270KB)
- **v4_token_datasets.js** - All 160 tokens with stats (223KB)
- **firebase-config.js** - Firebase configuration for online play
- **game-mode-manager.js** - Local/online mode management
- **room-manager.js** - Online room state synchronization
- **qa-tests.js** - Automated integration test suite
- **full-game-test.js** - Full 3-player, 5-round simulation

## Documentation

- **RULES.md** - Complete game rules and mechanics
- **VERSION.md** - Version history and changelog
- **TESTING.md** - Testing guide and automated test instructions

## Development

### Running Tests

**Automated Full Game Test (3 players, 5 rounds):**
```javascript
// In browser console (F12)
await runFullGameTest()
```

**QA Integration Test Suite:**
```javascript
await runQATests()
```

### Tech Stack

- Pure vanilla JavaScript (no frameworks)
- Firebase Realtime Database (online mode)
- Mobile-first responsive design
- No build process required

## Version History Highlights

- **v5.1.19** (Oct 11, 2025) - Challenge card persistence
- **v5.1.0** (Oct 7, 2025) - Player choice UI for token selection
- **v5.0.0** (Oct 7, 2025) - Bonus card system (20 cards)
- **v4.97.24** (Oct 6, 2025) - Final v4 before bonus cards

See [VERSION.md](VERSION.md) for complete history.

## Firebase Configuration

This game uses Firebase project `fourfor4-5530a` for online multiplayer. The configuration is in `firebase-config.js` and should not be modified unless creating a new Firebase project.

## License

© 2025 Randy Cass. All rights reserved.

---

**Repository:** https://github.com/prcass/4formore
**Created:** October 2025
