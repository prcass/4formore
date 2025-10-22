/**
 * 4forMore Physical Game - Main App Logic
 */

// Game State
const gameState = {
    challenge: null,        // Current challenge card
    centerToken: null,      // Current center token
    playerGuess: null,      // "higher" or "lower"
    scannedToken: null,     // Token being compared
    history: [],            // Array of previous comparisons
    tokensData: null,       // All tokens from JSON
    challengesData: null    // All challenges from JSON
};

// Initialize app
async function initApp() {
    console.log('🎮 Initializing 4forMore Scanner...');

    try {
        // Load data
        await loadGameData();

        // Hide loading, show welcome
        showScreen('welcomeScreen');

        console.log('✅ App ready!');
    } catch (error) {
        console.error('❌ Init error:', error);
        showError('Initialization Failed', error.message);
    }
}

// Load game data
async function loadGameData() {
    try {
        // Load from data files
        const tokensResponse = await fetch('../data/tokens.json');
        const challengesResponse = await fetch('../data/challenges.json');

        gameState.tokensData = await tokensResponse.json();
        gameState.challengesData = await challengesResponse.json();

        console.log(`📊 Loaded ${Object.keys(gameState.tokensData.tokens).length} tokens`);
        console.log(`🎯 Loaded ${Object.keys(gameState.challengesData.challenges).length} challenges`);

        // Store in localStorage for offline use
        localStorage.setItem('tokensData', JSON.stringify(gameState.tokensData));
        localStorage.setItem('challengesData', JSON.stringify(gameState.challengesData));

    } catch (error) {
        console.log('📡 Network failed, trying localStorage...');

        // Try to load from localStorage
        const cachedTokens = localStorage.getItem('tokensData');
        const cachedChallenges = localStorage.getItem('challengesData');

        if (cachedTokens && cachedChallenges) {
            gameState.tokensData = JSON.parse(cachedTokens);
            gameState.challengesData = JSON.parse(cachedChallenges);
            console.log('✅ Loaded from cache (offline mode)');
            document.getElementById('statusText').textContent = 'Ready (Offline)';
        } else {
            throw new Error('No internet connection and no cached data. Please connect to the internet for first-time setup.');
        }
    }
}

// Start game flow
function startGame() {
    // Reset game state
    gameState.challenge = null;
    gameState.centerToken = null;
    gameState.playerGuess = null;
    gameState.scannedToken = null;

    // Show challenge selection
    showScreen('challengeScreen');
    startScanner('challengeScanner', handleChallengeScanned);
}

// Handle challenge card scanned
function handleChallengeScanned(qrData) {
    console.log('📷 Challenge scanned:', qrData);
    console.log('🔵 Stopping challenge scanner...');

    // Stop scanner immediately to prevent multiple scans
    stopScanner('challengeScanner');

    console.log('🔵 Processing challenge QR data...');

    try {
        // Parse QR code (format: ?type=challenge&id=MOV_BOXOFFICE)
        const params = new URLSearchParams(qrData.split('?')[1]);
        const type = params.get('type');
        const id = params.get('id');

        if (type !== 'challenge') {
            throw new Error('Please scan a CHALLENGE card, not a token.');
        }

        // Get challenge data
        const challenge = gameState.challengesData.challenges[id];
        if (!challenge) {
            throw new Error(`Challenge not found: ${id}`);
        }

        // Store challenge
        gameState.challenge = challenge;
        console.log('✅ Challenge stored:', challenge.name);

        // Show challenge selected screen
        console.log('🔵 Displaying challenge card...');
        displayChallenge(challenge);

        console.log('🔵 Switching to challengeSelectedScreen...');
        showScreen('challengeSelectedScreen');
        console.log('✅ Now on challengeSelectedScreen');

    } catch (error) {
        console.error('❌ Challenge scan error:', error);
        showError('Invalid Challenge', error.message);
    }
}

// Handle center token scanned
function handleCenterScanned(qrData) {
    console.log('📷 Center token scanned:', qrData);

    // Stop scanner immediately to prevent multiple scans
    stopScanner('centerScanner');

    try {
        const params = new URLSearchParams(qrData.split('?')[1]);
        const type = params.get('type');
        const id = params.get('id');

        if (type !== 'token') {
            throw new Error('Please scan a TOKEN card, not a challenge.');
        }

        const token = gameState.tokensData.tokens[id];
        if (!token) {
            throw new Error(`Token not found: ${id}`);
        }

        // Validate category matches challenge
        if (token.category !== gameState.challenge.category) {
            throw new Error(`Wrong category! Challenge is ${gameState.challenge.category.toUpperCase()}, but you scanned a ${token.category.toUpperCase()} token.`);
        }

        // Store center token
        gameState.centerToken = token;

        // Show center token set screen
        displayCenterToken(token);
        showScreen('centerSetScreen');

    } catch (error) {
        console.error('❌ Center scan error:', error);
        showError('Invalid Token', error.message);
    }
}

// Handle draft token scanned
function handleDraftScanned(qrData) {
    console.log('📷 Draft token scanned:', qrData);

    // Stop scanner immediately to prevent multiple scans
    stopScanner('tokenScanner');

    try {
        const params = new URLSearchParams(qrData.split('?')[1]);
        const type = params.get('type');
        const id = params.get('id');

        if (type !== 'token') {
            throw new Error('Please scan a TOKEN card.');
        }

        const token = gameState.tokensData.tokens[id];
        if (!token) {
            throw new Error(`Token not found: ${id}`);
        }

        // Validate category
        if (token.category !== gameState.challenge.category) {
            throw new Error(`Wrong category! This is a ${token.category.toUpperCase()} token but the challenge is ${gameState.challenge.category.toUpperCase()}.`);
        }

        // Store scanned token
        gameState.scannedToken = token;

        // Show guess screen with both tokens
        displayGuessScreen();
        showScreen('guessScreen');

    } catch (error) {
        console.error('❌ Draft scan error:', error);
        showError('Invalid Token', error.message);
    }
}

// Calculate and show result
function showResult() {
    const centerValue = gameState.centerToken.stats[gameState.challenge.statKey];
    const scannedValue = gameState.scannedToken.stats[gameState.challenge.statKey];
    const guess = gameState.playerGuess;

    // Determine if correct
    let isCorrect = false;
    if (guess === 'higher' && scannedValue > centerValue) {
        isCorrect = true;
    } else if (guess === 'lower' && scannedValue < centerValue) {
        isCorrect = true;
    }

    // Display result (no stats shown)
    displayResult(isCorrect);

    // Add to history
    gameState.history.push({
        challenge: gameState.challenge.name,
        centerToken: gameState.centerToken.name,
        scannedToken: gameState.scannedToken.name,
        guess: guess,
        correct: isCorrect
    });

    // If correct, update center token for next round
    console.log('🔵 Updating center token after result...');
    console.log(`   Was: ${gameState.centerToken.name}`);
    if (isCorrect) {
        gameState.centerToken = gameState.scannedToken;
        console.log(`   Now: ${gameState.centerToken.name} ✅`);
    } else {
        console.log(`   Stays: ${gameState.centerToken.name} (incorrect guess)`);
    }
}

// Setup event listeners (called after DOM is ready)
function setupEventListeners() {
    // Helper to safely add event listener
    const addListener = (id, event, handler) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener(event, handler);
        }
    };

    addListener('startBtn', 'click', startGame);

    addListener('cancelChallengeBtn', 'click', () => {
        stopScanner('challengeScanner');
        showScreen('welcomeScreen');
    });

    addListener('continueFromChallengeBtn', 'click', () => {
        showScreen('centerTokenScreen');
        document.getElementById('challengeInfo').textContent = `Challenge: ${gameState.challenge.name}`;
        startScanner('centerScanner', handleCenterScanned);
    });

    addListener('cancelCenterBtn', 'click', () => {
        stopScanner('centerScanner');
        showScreen('challengeSelectedScreen');
    });

    addListener('continueFromCenterBtn', 'click', () => {
        console.log('🔵 Continue from center clicked - going to scan token screen');

        // Stop any active scanners first
        stopAllScanners();

        // Show center token on scan screen
        const centerTokenEl = document.getElementById('scanScreenCenterToken');
        if (centerTokenEl) {
            centerTokenEl.textContent = gameState.centerToken.name;
        }

        // Update breadcrumb trail (will be empty on first scan)
        updateBreadcrumb();

        // Go to scanning next token
        showScreen('scanTokenScreen');

        // Small delay to ensure screen is visible and scanners are fully stopped
        setTimeout(() => {
            console.log('🔵 Starting token scanner...');
            startScanner('tokenScanner', handleDraftScanned);
        }, 500);
    });

    addListener('guessLowerBtn', 'click', () => {
        gameState.playerGuess = 'lower';
        showResult();
    });

    addListener('guessHigherBtn', 'click', () => {
        gameState.playerGuess = 'higher';
        showResult();
    });

    addListener('cancelScanBtn', 'click', () => {
        stopScanner('tokenScanner');
        showScreen('centerSetScreen');
    });

    addListener('continueBtn', 'click', () => {
        console.log('🔵 Continue button clicked');
        console.log(`   Current center token: ${gameState.centerToken.name}`);

        // Continue turn - scan next token
        gameState.scannedToken = null;
        gameState.playerGuess = null;

        // Show updated center token
        const centerTokenEl = document.getElementById('scanScreenCenterToken');
        if (centerTokenEl) {
            centerTokenEl.textContent = gameState.centerToken.name;
            console.log(`   ✅ Updated scan screen to show: ${gameState.centerToken.name}`);
        } else {
            console.log('   ❌ scanScreenCenterToken element not found!');
        }

        // Update breadcrumb trail
        updateBreadcrumb();

        showScreen('scanTokenScreen');

        // Small delay to ensure screen is visible and scanners are fully stopped
        setTimeout(() => {
            startScanner('tokenScanner', handleDraftScanned);
        }, 500);
    });

    addListener('errorRetryBtn', 'click', () => {
        const returnScreen = window.errorReturnScreen || 'welcomeScreen';

        showScreen(returnScreen);

        // Restart appropriate scanner based on return screen
        if (returnScreen === 'challengeScreen') {
            startScanner('challengeScanner', handleChallengeScanned);
        } else if (returnScreen === 'centerTokenScreen') {
            document.getElementById('challengeInfo').textContent = `Challenge: ${gameState.challenge.name}`;
            startScanner('centerScanner', handleCenterScanned);
        } else if (returnScreen === 'scanTokenScreen') {
            startScanner('tokenScanner', handleDraftScanned);
        }
    });

    addListener('restartTurnBtn', 'click', () => {
        // Restart the turn - go back to scan center token
        gameState.scannedToken = null;
        gameState.playerGuess = null;
        gameState.centerToken = null;
        showScreen('centerTokenScreen');
        document.getElementById('challengeInfo').textContent = `Challenge: ${gameState.challenge.name}`;
        startScanner('centerScanner', handleCenterScanned);
    });

    addListener('newChallengeBtn', 'click', () => {
        // Start completely over with new challenge
        startGame();
    });
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initApp();
});
