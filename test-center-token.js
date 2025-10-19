/**
 * Test script to verify center token replacement logic
 * Run with: node test-center-token.js
 */

// Simulate game state
const gameState = {
    challenge: null,
    centerToken: null,
    playerGuess: null,
    scannedToken: null,
    history: [],
    tokensData: {
        tokens: {
            'COU005': { id: 'COU005', name: 'United States', category: 'countries', stats: { population_total: 331000000 } },
            'COU001': { id: 'COU001', name: 'Germany', category: 'countries', stats: { population_total: 84000000 } },
            'COU025': { id: 'COU025', name: 'Brazil', category: 'countries', stats: { population_total: 213000000 } }
        }
    },
    challengesData: {
        challenges: {
            'COU_POPULATION': { id: 'COU_POPULATION', name: 'Population', category: 'countries', statKey: 'population_total' }
        }
    }
};

function showGameState(step) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`STEP: ${step}`);
    console.log(`${'='.repeat(60)}`);
    console.log('Challenge:', gameState.challenge?.name || 'None');
    console.log('Center Token:', gameState.centerToken?.name || 'None');
    console.log('Scanned Token:', gameState.scannedToken?.name || 'None');
    console.log('Player Guess:', gameState.playerGuess || 'None');
    console.log(`${'='.repeat(60)}\n`);
}

// Simulate the exact code from app.js showResult()
function showResult() {
    const centerValue = gameState.centerToken.stats[gameState.challenge.statKey];
    const scannedValue = gameState.scannedToken.stats[gameState.challenge.statKey];
    const guess = gameState.playerGuess;

    console.log(`\n🔵 Comparing values:`);
    console.log(`   Center (${gameState.centerToken.name}): ${centerValue.toLocaleString()}`);
    console.log(`   Scanned (${gameState.scannedToken.name}): ${scannedValue.toLocaleString()}`);
    console.log(`   Guess: ${guess}`);

    // Determine if correct
    let isCorrect = false;
    if (guess === 'higher' && scannedValue > centerValue) {
        isCorrect = true;
    } else if (guess === 'lower' && scannedValue < centerValue) {
        isCorrect = true;
    }

    console.log(`   Result: ${isCorrect ? '✅ CORRECT' : '❌ WRONG'}`);

    // Add to history
    gameState.history.push({
        challenge: gameState.challenge.name,
        centerToken: gameState.centerToken.name,
        scannedToken: gameState.scannedToken.name,
        guess: guess,
        correct: isCorrect
    });

    // THIS IS THE KEY CODE - from app.js line 223-225
    console.log(`\n🔵 Updating center token...`);
    console.log(`   Before: centerToken = ${gameState.centerToken.name}`);
    if (isCorrect) {
        gameState.centerToken = gameState.scannedToken;
    }
    console.log(`   After: centerToken = ${gameState.centerToken.name}`);

    return isCorrect;
}

// Simulate the exact game flow
console.log('\n🎮 TESTING CENTER TOKEN REPLACEMENT\n');

// Step 1: Set challenge
gameState.challenge = gameState.challengesData.challenges['COU_POPULATION'];
showGameState('1. Challenge Selected');

// Step 2: Set center token (USA)
gameState.centerToken = gameState.tokensData.tokens['COU005'];
showGameState('2. Center Token Set (USA)');

// Step 3: Scan first comparison token (Germany)
gameState.scannedToken = gameState.tokensData.tokens['COU001'];
gameState.playerGuess = 'lower';
showGameState('3. First Token Scanned (Germany) - Guess LOWER');

// Step 4: Show result (should be correct and update center)
const round1Correct = showResult();
showGameState('4. After First Result');

if (!round1Correct) {
    console.log('❌ TEST FAILED: Round 1 should be correct');
    process.exit(1);
}

if (gameState.centerToken.name !== 'Germany') {
    console.log('❌ TEST FAILED: Center token should be Germany but is', gameState.centerToken.name);
    process.exit(1);
}

console.log('✅ Round 1 PASSED: Center token correctly updated to Germany\n');

// Step 5: Continue turn - reset for next scan
gameState.scannedToken = null;
gameState.playerGuess = null;
showGameState('5. Continue Turn - Ready for Next Scan');

// Step 6: Scan second comparison token (Brazil)
gameState.scannedToken = gameState.tokensData.tokens['COU025'];
gameState.playerGuess = 'higher';
showGameState('6. Second Token Scanned (Brazil) - Guess HIGHER');

// Step 7: Show result (should be correct and update center to Brazil)
const round2Correct = showResult();
showGameState('7. After Second Result');

if (!round2Correct) {
    console.log('❌ TEST FAILED: Round 2 should be correct');
    process.exit(1);
}

if (gameState.centerToken.name !== 'Brazil') {
    console.log('❌ TEST FAILED: Center token should be Brazil but is', gameState.centerToken.name);
    process.exit(1);
}

console.log('✅ Round 2 PASSED: Center token correctly updated to Brazil\n');

// Final verification
console.log('\n🎉 ALL TESTS PASSED!');
console.log('\nFinal game state:');
console.log('  Center Token:', gameState.centerToken.name);
console.log('  History:');
gameState.history.forEach((h, i) => {
    console.log(`    ${i + 1}. ${h.centerToken} vs ${h.scannedToken} - Guessed ${h.guess} - ${h.correct ? 'CORRECT' : 'WRONG'}`);
});
