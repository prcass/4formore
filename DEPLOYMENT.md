# 4forMore Deployment Guide

## Repository Information

**GitHub Repository:** https://github.com/prcass/4formore
**Live Site:** https://prcass.github.io/4formore/
**Current Version:** v5.1.19

## Quick Access

### Play the Game
- **Local:** `http://localhost:8000/multiplayer.html` (after starting local server)
- **Online:** https://prcass.github.io/4formore/multiplayer.html

### Repository Structure
```
/home/randycass/projects/4formore/
├── multiplayer.html              # Main game file
├── v4_token_datasets.js          # 160 tokens with stats
├── firebase-config.js            # Firebase configuration
├── game-mode-manager.js          # Local/online mode switching
├── room-manager.js               # Online room management
├── qa-tests.js                   # Integration test suite
├── full-game-test.js             # Full game simulation
├── run-full-game-test.html       # Test runner page
├── README.md                     # Project overview
├── RULES.md                      # Game rules
├── VERSION.md                    # Version history
├── TESTING.md                    # Testing guide
└── TEST_BUTTON_INSTRUCTIONS.md   # Test setup instructions

Total Size: ~640KB
```

## Local Development

### Start Local Server
```bash
cd /home/randycass/projects/4formore
python3 -m http.server 8000
```

Then open: http://localhost:8000/multiplayer.html

### Run Tests
Open browser console (F12) and run:
```javascript
// Full 3-player, 5-round simulation
await runFullGameTest()

// Integration test suite
await runQATests()
```

## Git Workflow

### Make Changes
```bash
cd /home/randycass/projects/4formore

# Edit files...

git add -A
git commit -m "Description of changes"
git push origin main
```

### Create New Version
```bash
# Update version in VERSION.md and multiplayer.html
# Then commit and tag:

git add -A
git commit -m "v5.1.20: Description"
git tag -a v5.1.20 -m "Version 5.1.20 description"
git push origin main --tags
```

### GitHub Pages Auto-Deploy
GitHub Pages automatically deploys the `main` branch to:
https://prcass.github.io/4formore/

Changes go live within 1-2 minutes after pushing to `main`.

## Firebase Configuration

**Project:** fourfor4-5530a
**Database:** https://fourfor4-5530a-default-rtdb.firebaseio.com

Firebase configuration is in `firebase-config.js`. Do not modify unless creating a new Firebase project.

## Backup Information

**Pre-reorganization backup:**
- Location: `/home/randycass/projects/know-it-all/backup-pre-4formore-reorganization-20251018-203530.tar.gz`
- Size: 9.7MB
- Git tag: `v5.1.19-pre-reorganization` (in old outrank-deploy repo)

## Separation from Outrank

As of October 18, 2025:
- **4forMore:** Separate repository at `/home/randycass/projects/4formore/`
- **Outrank:** Remains at `/home/randycass/projects/know-it-all/outrank-deploy/`

These are now completely independent projects with separate Git histories.

---

**Created:** October 18, 2025
**Last Updated:** October 18, 2025
