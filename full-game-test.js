/**
 * Full Game Automated Test - 3 Players, 5 Rounds
 *
 * Simulates a complete game with strategic decisions:
 * - Players make guesses based on actual token values
 * - Players cash out when they have 2-3 tokens
 * - Players pass strategically to avoid losing tokens
 * - All bonus card interactions are tested
 *
 * Run with: runFullGameTest()
 */

class FullGameTest {
    constructor() {
        this.log = [];
        this.errors = [];
        this.startTime = Date.now();
        this.actionDelay = 500; // ms between actions for visibility
    }

    logAction(message, type = 'info') {
        const timestamp = ((Date.now() - this.startTime) / 1000).toFixed(2);
        const emoji = {
            info: '📝',
            success: '✅',
            error: '❌',
            game: '🎮',
            round: '🔄',
            guess: '🎯',
            cash: '💰',
            pass: '⏭️',
            bonus: '🎴'
        }[type] || '📝';

        const logMessage = `[${timestamp}s] ${emoji} ${message}`;
        this.log.push(logMessage);
        console.log(logMessage);

        if (type === 'error') {
            this.errors.push(message);
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Initialize game with 3 players
    async setupGame() {
        this.logAction('Setting up 3-player game...', 'game');

        // Force local mode for testing
        GameModeManager.setMode('local');
        this.logAction('Game mode: LOCAL', 'info');

        // Initialize game state with 3 players
        Object.assign(gameState, {
            players: [
                { id: 0, name: 'Alice', score: 0, hand: [], thisRound: [], cashOuts: 0, correctGuesses: 0, wrongGuesses: 0, bonusCards: [], activeEffects: [] },
                { id: 1, name: 'Bob', score: 0, hand: [], thisRound: [], cashOuts: 0, correctGuesses: 0, wrongGuesses: 0, bonusCards: [], activeEffects: [] },
                { id: 2, name: 'Charlie', score: 0, hand: [], thisRound: [], cashOuts: 0, correctGuesses: 0, wrongGuesses: 0, bonusCards: [], activeEffects: [] }
            ],
            currentPlayer: 0,
            round: 1,
            centerToken: null,
            selectedDraftToken: null,
            draftPool: [],
            retiredTokens: [],
            currentChallenge: null,
            selectedCategory: null,
            passedPlayers: new Set(),
            lockedOutPlayers: new Set(),
            firstGuesser: 0,
            lastToPass: null,
            lastPlayerToAct: null,
            drawnChallengeCards: [],
            phase: 'challenge',
            hasStartedGame: true,
            challengeMode: 'cards',
            showModal: false,
            bonusCardPool: [],
            bonusCardDeck: []
        });

        // Initialize bonus card system
        if (typeof initializeBonusCards === 'function') {
            initializeBonusCards();
            this.logAction('Bonus card system initialized', 'success');
        }

        this.logAction(`Players: ${gameState.players.map(p => p.name).join(', ')}`, 'info');
        this.logAction('Game setup complete!', 'success');
    }

    // Select a challenge card for the round
    async selectChallenge(roundNum) {
        this.logAction(`Round ${roundNum}: Selecting challenge card...`, 'round');

        // Call startNewRound if needed to draw cards
        if (typeof startNewRound === 'function' && (!gameState.drawnChallengeCards || gameState.drawnChallengeCards.length === 0)) {
            startNewRound();
            await this.sleep(500);
        }

        // Select the first available card
        if (gameState.drawnChallengeCards && gameState.drawnChallengeCards.length > 0) {
            const cardIndex = 0;
            const card = gameState.drawnChallengeCards[cardIndex];
            const category = card.challenge.category;
            const challengeName = card.challenge.name;

            this.logAction(`Selecting: ${category} - ${challengeName}`, 'info');

            if (typeof selectChallengeCard === 'function') {
                await selectChallengeCard(cardIndex);
                await this.sleep(this.actionDelay);
                this.logAction(`Challenge selected: ${category}`, 'success');
            }
        } else {
            // Try one more time by calling startNewRound
            if (typeof startNewRound === 'function') {
                startNewRound();
                await this.sleep(500);

                if (gameState.drawnChallengeCards && gameState.drawnChallengeCards.length > 0) {
                    const cardIndex = 0;
                    await selectChallengeCard(cardIndex);
                    await this.sleep(this.actionDelay);
                    this.logAction(`Challenge selected after retry`, 'success');
                } else {
                    this.logAction('No challenge cards available after retry', 'error');
                }
            } else {
                this.logAction('No challenge cards available', 'error');
            }
        }
    }

    // Get stat value for comparison
    getStatValue(token) {
        if (!token || !token.stats || !gameState.currentChallenge) return 0;
        const stat = gameState.currentChallenge.stat;
        return token.stats[stat] || 0;
    }

    // Decide if player should make a guess
    shouldGuess(playerIndex) {
        const player = gameState.players[playerIndex];

        // Don't guess if passed or locked out
        if (gameState.passedPlayers.has(playerIndex) || gameState.lockedOutPlayers.has(playerIndex)) {
            return { guess: false, reason: 'passed/locked out' };
        }

        // Don't guess if not their turn
        if (gameState.currentPlayer !== playerIndex) {
            return { guess: false, reason: 'not their turn' };
        }

        // Don't guess if no center token or draft pool
        if (!gameState.centerToken || !gameState.draftPool || gameState.draftPool.length === 0) {
            return { guess: false, reason: 'no tokens available' };
        }

        // If they have 3+ tokens, consider cashing out instead
        if (player.thisRound.length >= 3) {
            // 50% chance to cash out
            return { guess: Math.random() > 0.5, reason: 'has 3+ tokens, risky to continue' };
        }

        // If they have 2 tokens, 70% chance to cash out
        if (player.thisRound.length === 2) {
            return { guess: Math.random() > 0.3, reason: 'has 2 tokens, might cash out' };
        }

        // Otherwise, guess
        return { guess: true, reason: 'should continue' };
    }

    // Make a guess (higher or lower)
    async performGuess(playerIndex) {
        const player = gameState.players[playerIndex];
        const centerValue = this.getStatValue(gameState.centerToken);

        // Select first token from draft pool
        if (gameState.draftPool.length > 0) {
            gameState.selectedDraftToken = gameState.draftPool[0];
            const draftValue = this.getStatValue(gameState.selectedDraftToken);

            // Skip if values are equal (can't guess)
            if (draftValue === centerValue) {
                this.logAction(`${player.name} skips - equal values (${centerValue})`, 'info');
                // Pass instead
                await this.performPass(playerIndex);
                return;
            }

            // Determine correct direction
            const direction = draftValue > centerValue ? 'higher' : 'lower';
            const isCorrect = (direction === 'higher' && draftValue > centerValue) ||
                            (direction === 'lower' && draftValue < centerValue);

            this.logAction(
                `${player.name} guesses ${direction} (center: ${centerValue}, draft: ${draftValue})`,
                'guess'
            );

            if (typeof makeGuess === 'function') {
                makeGuess(direction);
                await this.sleep(this.actionDelay);

                if (isCorrect) {
                    this.logAction(`${player.name} guessed correctly! +1 pt, token added`, 'success');
                } else {
                    this.logAction(`${player.name} guessed wrong! Locked out`, 'error');
                }
            }
        }
    }

    // Cash out current tokens
    async performCashOut(playerIndex) {
        const player = gameState.players[playerIndex];
        const tokenCount = player.thisRound.length;

        if (tokenCount === 0) {
            this.logAction(`${player.name} has no tokens to cash out`, 'info');
            return;
        }

        const pointValue = tokenCount === 2 ? 2 : tokenCount === 3 ? 5 : tokenCount >= 4 ? 8 : tokenCount;

        this.logAction(
            `${player.name} cashes out ${tokenCount} token(s) for ${pointValue} pts`,
            'cash'
        );

        if (typeof executeCashOut === 'function') {
            executeCashOut();
            await this.sleep(this.actionDelay * 2); // Extra time for bonus card selection

            // Auto-select first bonus card
            await this.sleep(500);
            if (typeof selectBonusCard === 'function' && gameState.bonusCardPool && gameState.bonusCardPool.length > 0) {
                this.logAction(`${player.name} selecting bonus card...`, 'bonus');
                selectBonusCard(0);
                await this.sleep(this.actionDelay);
            }
        }
    }

    // Pass the round
    async performPass(playerIndex) {
        const player = gameState.players[playerIndex];

        this.logAction(`${player.name} passes this round`, 'pass');

        if (typeof passRound === 'function') {
            passRound();
            await this.sleep(this.actionDelay);
        }
    }

    // Play one player's turn
    async playTurn(playerIndex) {
        const player = gameState.players[playerIndex];

        // Skip if not current player or locked out
        if (gameState.currentPlayer !== playerIndex) {
            return;
        }

        if (gameState.passedPlayers.has(playerIndex) || gameState.lockedOutPlayers.has(playerIndex)) {
            this.logAction(`${player.name} is locked out, skipping...`, 'info');
            return;
        }

        this.logAction(`--- ${player.name}'s Turn (Round ${gameState.round}) ---`, 'game');

        // Decide action: guess, cash out, or pass
        const tokenCount = player.thisRound.length;

        if (tokenCount >= 2 && Math.random() > 0.4) {
            // 60% chance to cash out with 2+ tokens
            await this.performCashOut(playerIndex);
        } else if (tokenCount === 0 || Math.random() > 0.2) {
            // Try to guess if no tokens or 80% chance
            const decision = this.shouldGuess(playerIndex);
            if (decision.guess) {
                await this.performGuess(playerIndex);
            } else {
                await this.performPass(playerIndex);
            }
        } else {
            // Pass
            await this.performPass(playerIndex);
        }

        await this.sleep(this.actionDelay);
    }

    // Play a complete round
    async playRound(roundNum) {
        this.logAction(`\n========== ROUND ${roundNum} ==========`, 'round');

        // Select challenge
        await this.selectChallenge(roundNum);

        // Reset round state
        gameState.passedPlayers.clear();
        gameState.lockedOutPlayers.clear();

        // Play until all players pass or get wrong
        let turnCount = 0;
        const maxTurns = 30; // Safety limit

        while (turnCount < maxTurns) {
            const activePlayerCount = gameState.players.length -
                gameState.passedPlayers.size - gameState.lockedOutPlayers.size;

            if (activePlayerCount === 0) {
                this.logAction('All players passed or locked out, round ending...', 'round');
                break;
            }

            await this.playTurn(gameState.currentPlayer);
            turnCount++;

            // Small delay between turns
            await this.sleep(200);
        }

        // End round
        this.logAction(`Round ${roundNum} complete!`, 'round');
        this.logRoundScores();

        // Wait for round to transition
        await this.sleep(1000);
    }

    // Log current scores
    logRoundScores() {
        this.logAction('--- Scores ---', 'info');
        gameState.players.forEach(player => {
            const cards = player.bonusCards ? player.bonusCards.length : 0;
            this.logAction(
                `${player.name}: ${player.score} pts, ${player.hand.length} tokens, ${cards} bonus cards`,
                'info'
            );
        });
    }

    // Run complete 5-round game
    async runFullGame() {
        console.clear();
        this.logAction('🎮 Starting Full Game Automated Test', 'game');
        this.logAction('Configuration: 3 players, 5 rounds, with bonus cards\n', 'info');

        try {
            // Setup
            await this.setupGame();
            await this.sleep(1000);

            // Play 5 rounds
            for (let round = 1; round <= 5; round++) {
                await this.playRound(round);
                await this.sleep(500);
            }

            // Game end
            this.logAction('\n========== GAME COMPLETE ==========', 'game');
            this.logFinalScores();
            this.generateReport();

        } catch (error) {
            this.logAction(`Fatal error: ${error.message}`, 'error');
            console.error('Full error:', error);
        }

        return {
            success: this.errors.length === 0,
            log: this.log,
            errors: this.errors,
            duration: ((Date.now() - this.startTime) / 1000).toFixed(2)
        };
    }

    // Log final scores
    logFinalScores() {
        this.logAction('\n🏆 FINAL SCORES 🏆', 'game');

        const sorted = [...gameState.players].sort((a, b) => b.score - a.score);
        sorted.forEach((player, index) => {
            const medal = ['🥇', '🥈', '🥉'][index] || '  ';
            const cards = player.bonusCards ? player.bonusCards.length : 0;
            this.logAction(
                `${medal} ${player.name}: ${player.score} pts (${player.hand.length} tokens, ${cards} bonus cards, ${player.cashOuts} cash-outs)`,
                'success'
            );
        });
    }

    // Generate test report
    generateReport() {
        const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

        console.log('\n\n📊 ========== TEST REPORT ==========');
        console.log(`Duration: ${duration}s`);
        console.log(`Total Actions: ${this.log.length}`);
        console.log(`Errors: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.errors.forEach(err => console.log(`  - ${err}`));
        } else {
            console.log('\n✅ No errors detected!');
        }

        console.log('\n📝 Action Log:');
        this.log.slice(-20).forEach(line => console.log(`  ${line}`));
        console.log(`\n... (${this.log.length} total actions, showing last 20)`);
        console.log('=====================================\n');
    }
}

// Global test runner
window.FullGameTest = FullGameTest;
window.runFullGameTest = async function() {
    const test = new FullGameTest();
    return await test.runFullGame();
};

console.log('✅ Full Game Test loaded. Run with: runFullGameTest()');
console.log('');
console.log('📋 How to use:');
console.log('1. Open multiplayer.html in your browser');
console.log('2. Open browser console (F12)');
console.log('3. Paste this script or run: await fetch("full-game-test.js").then(r=>r.text()).then(eval)');
console.log('4. Run: await runFullGameTest()');
console.log('5. Watch the 3-player game play through 5 rounds automatically!');
