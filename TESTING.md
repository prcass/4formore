# 4forMore Automated Testing Guide

## Full Game Test (3 Players, 5 Rounds)

### Quick Start

1. **Start the local server:**
   ```bash
   cd /home/randycass/projects/know-it-all/outrank-deploy
   python3 -m http.server 8000
   ```

2. **Open the game:**
   Navigate to `http://localhost:8000/multiplayer.html`

3. **Open browser console:**
   Press `F12` (or `Cmd+Option+J` on Mac)

4. **Run the test:**
   ```javascript
   await runFullGameTest()
   ```

### What It Does

The automated test simulates a complete 3-player game:

- **Players:** Alice, Bob, and Charlie
- **Duration:** 5 rounds
- **Time:** ~30-60 seconds
- **Actions:**
  - Automatically selects challenge cards
  - Makes strategic guesses (higher/lower)
  - Cashes out when holding 2-3 tokens
  - Passes when risky to continue
  - Selects bonus cards after cash-outs
  - Tracks scores and game state

### What You'll See

```
🎮 Starting Full Game Automated Test
Configuration: 3 players, 5 rounds, with bonus cards

[0.05s] 📝 Setting up 3-player game...
[0.12s] 📝 Players: Alice, Bob, Charlie
[0.18s] ✅ Game setup complete!

========== ROUND 1 ==========
[0.52s] 🔄 Round 1: Selecting challenge card...
[0.68s] ✅ Challenge selected: movies

[0.95s] 🎮 --- Alice's Turn (Round 1) ---
[1.12s] 🎯 Alice guesses higher (center: 450, draft: 680)
[1.34s] ✅ Alice guessed correctly! +1 pt, token added

[1.56s] 🎮 --- Bob's Turn (Round 1) ---
[1.72s] 💰 Bob cashes out 2 token(s) for 2 pts
[2.15s] 🎴 Bob selecting bonus card...

... (continues through 5 rounds) ...

========== GAME COMPLETE ==========

🏆 FINAL SCORES 🏆
[28.45s] ✅ 🥇 Alice: 18 pts (5 tokens, 3 bonus cards, 3 cash-outs)
[28.45s] ✅ 🥈 Bob: 15 pts (4 tokens, 2 bonus cards, 4 cash-outs)
[28.45s] ✅ 🥉 Charlie: 12 pts (3 tokens, 1 bonus cards, 2 cash-outs)
```

### Test Features

✅ **Comprehensive Coverage:**
- Challenge card selection (all 4 categories)
- Token guessing mechanics (higher/lower)
- Cash-out system with point calculation
- Bonus card selection and effects
- Pass mechanics and round transitions
- Multi-player turn management
- Score tracking and final results

✅ **Smart AI Decisions:**
- Analyzes token values before guessing
- Strategically cashes out with 2-3 tokens
- Passes when it's too risky
- Randomly varies strategy for realistic gameplay

✅ **Detailed Logging:**
- Timestamp for every action
- Color-coded emoji indicators
- Score summaries after each round
- Final leaderboard with medals
- Error tracking and reporting

### Test Configuration

You can customize the test by modifying `full-game-test.js`:

```javascript
// Change action delay (ms between actions)
this.actionDelay = 500; // Default: 500ms

// Change number of players (in setupGame())
players: [
    { id: 0, name: 'Alice', ... },
    { id: 1, name: 'Bob', ... },
    { id: 2, name: 'Charlie', ... },
    { id: 3, name: 'Diana', ... } // Add more players
]

// Change number of rounds (in runFullGame())
for (let round = 1; round <= 5; round++) // Change 5 to any number
```

### Troubleshooting

**Test doesn't start:**
- Make sure you're on `multiplayer.html`
- Check console for errors (F12)
- Verify server is running on port 8000

**Test runs too fast:**
- Increase `this.actionDelay` in the constructor
- Add more `await this.sleep(ms)` calls

**Test gets stuck:**
- Check `maxTurns` limit in `playRound()`
- Look for infinite loops in decision logic
- Verify game state is being updated correctly

**Errors during gameplay:**
- Check browser console for specific errors
- Review the `this.errors` array after test completes
- Ensure all game functions are available

### Other Tests

**QA Test Suite (Unit Tests):**
```javascript
await runQATests()
```

**Manual Testing:**
Just play the game normally in local or online multiplayer mode.

---

## Advanced Usage

### Running Tests Programmatically

```javascript
// Create test instance
const test = new FullGameTest();

// Customize settings
test.actionDelay = 1000; // Slower for visibility

// Run test
const result = await test.runFullGame();

// Check results
console.log(`Success: ${result.success}`);
console.log(`Duration: ${result.duration}s`);
console.log(`Errors: ${result.errors.length}`);
```

### Debugging Failed Tests

```javascript
// Access test logs
const test = new FullGameTest();
const result = await test.runFullGame();

// View all actions
console.log(result.log);

// View just errors
console.log(result.errors);

// Inspect final game state
console.log(gameState);
```

---

## Test Coverage

| Feature | Tested | Notes |
|---------|--------|-------|
| Challenge selection | ✅ | All 4 categories |
| Token guessing | ✅ | Higher/lower logic |
| Correct guess handling | ✅ | Score +1, token added |
| Wrong guess handling | ✅ | Player locked out |
| Cash out (2 tokens) | ✅ | 2 points awarded |
| Cash out (3 tokens) | ✅ | 5 points awarded |
| Cash out (4+ tokens) | ✅ | 8 points awarded |
| Bonus card selection | ✅ | Auto-selects first card |
| Pass mechanics | ✅ | Player marked as passed |
| Round transitions | ✅ | State resets correctly |
| Multi-player turns | ✅ | Turn advances correctly |
| Final scoring | ✅ | Winner determined |
| Draft pool persistence | ⏳ | Partially tested |
| Challenge card persistence | ⏳ | Partially tested |
| Online multiplayer | ❌ | Local mode only |

---

Created: 2025-10-15
Version: 1.0
For: 4forMore V5.1.19
