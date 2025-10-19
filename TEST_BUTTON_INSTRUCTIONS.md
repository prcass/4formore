# Full Game Test Button - Quick Start

## ✅ What Was Added

A **"Run Full Game Test"** button has been added to the main menu of multiplayer.html.

## 🎯 How to Use

1. **Open the game:**
   ```
   http://localhost:8000/multiplayer.html
   ```

2. **On the main menu screen**, you'll see two new test buttons:
   - **🧪 Run QA Tests** - Unit tests (existing)
   - **🎮 Run Full Game Test** - NEW! Full game simulation

3. **Click "Run Full Game Test"**

4. **Watch the console** (press F12 to open) - You'll see:
   ```
   ════════════════════════════════════════
   🎮 FULL GAME TEST - 3 Players, 5 Rounds
   ════════════════════════════════════════

   [0.05s] 📝 Setting up 3-player game...
   [0.12s] 📝 Players: Alice, Bob, Charlie
   ...
   ```

5. **After ~60 seconds**, you'll get a popup showing:
   ```
   ✅ Full Game Test Complete!

   Status: Success!
   Duration: 58.32s
   Actions: 147
   Errors: 0
   ```

## 📊 What It Tests

The automated test plays a complete 3-player game:
- ✅ Challenge card selection (all categories)
- ✅ Token guessing (higher/lower)
- ✅ Cash-out mechanics
- ✅ Bonus card selection
- ✅ Pass mechanics
- ✅ Round transitions
- ✅ Final scoring with winner

## 🎨 Button Design

The button uses a pink/red gradient to distinguish it from the QA tests button:
- QA Tests: Blue/purple gradient
- **Full Game Test: Pink/red gradient** ⬅️ NEW

## 🔧 Technical Details

**Location:** Mode Selection Screen (first screen you see)
**Function:** `runFullGameTestUI()` in multiplayer.html:5564
**Test Script:** `full-game-test.js`
**Documentation:** `TESTING.md`

## 🐛 Troubleshooting

**Button doesn't appear:**
- Refresh the page (Ctrl+R or Cmd+R)
- Clear browser cache

**Test doesn't run:**
- Open console (F12) and check for errors
- Make sure `full-game-test.js` loaded correctly
- Try running manually: `await runFullGameTest()`

**Test runs too fast:**
- Edit `full-game-test.js`
- Change `this.actionDelay = 500` to higher value (e.g., 1000)

---

Created: 2025-10-15
Location: /home/randycass/projects/know-it-all/outrank-deploy/
