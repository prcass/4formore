/**
 * UI Helper Functions
 */

// Show a specific screen
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show requested screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        console.log(`📱 Showing: ${screenId}`);
    }
}

// Display challenge card
function displayChallenge(challenge) {
    const card = document.getElementById('selectedChallengeCard');
    if (!card) {
        console.error('❌ selectedChallengeCard element not found!');
        return;
    }

    const categoryEl = card.querySelector('.challenge-category');
    const nameEl = card.querySelector('.challenge-name');
    const descEl = card.querySelector('.challenge-description');

    if (categoryEl) {
        categoryEl.textContent = `🎯 ${challenge.category.toUpperCase()}`;
        categoryEl.className = `challenge-category cat-${challenge.category}`;
    }
    if (nameEl) nameEl.textContent = challenge.name;
    if (descEl) descEl.textContent = challenge.description;
}

// Display center token
function displayCenterToken(token) {
    const circle = document.getElementById('centerTokenCircle');
    if (circle) {
        circle.style.borderColor = token.categoryColor;
        circle.className = `token-circle cat-${token.category}`;
    }

    const nameEl = document.getElementById('centerTokenName');
    const codeEl = document.getElementById('centerTokenCode');

    if (nameEl) nameEl.textContent = token.name;
    if (codeEl) codeEl.textContent = `[${token.code}]`;
}

// Display guess screen
function displayGuessScreen() {
    // Show center token
    document.getElementById('guessTokenName').textContent = gameState.centerToken.name;

    // Show scanned token
    if (gameState.scannedToken) {
        document.getElementById('scannedTokenName').textContent = gameState.scannedToken.name;
    }

    // Show challenge
    document.getElementById('guessChallengeInfo').textContent = gameState.challenge.name;
}

// Display result with dramatic countdown
function displayResult(isCorrect) {
    showScreen('resultScreen');

    // Hide result header and buttons initially
    document.getElementById('resultHeader').style.display = 'none';
    document.getElementById('resultButtons').style.display = 'none';

    // Show countdown
    const countdown = document.getElementById('countdown');
    countdown.style.display = 'block';
    countdown.style.fontSize = '10em';
    countdown.style.fontWeight = 'bold';
    countdown.style.textAlign = 'center';
    countdown.style.marginTop = '100px';

    let count = 3;
    countdown.textContent = count;

    console.log('🔵 Starting countdown: 3...2...1 (500ms intervals)');
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdown.textContent = count;
            console.log(`   ${count}...`);
        } else {
            clearInterval(countdownInterval);
            countdown.style.display = 'none';
            console.log('   Revealing result!');
            revealResult(isCorrect);
        }
    }, 500); // 50% faster (was 1000ms, now 500ms)
}

// Reveal the result with animation
function revealResult(isCorrect) {
    const header = document.getElementById('resultHeader');
    const title = document.getElementById('resultTitle');

    // Set result text and style
    if (isCorrect) {
        header.className = 'result-header correct';
        title.textContent = '✅ CORRECT!';
        document.getElementById('continueBtn').style.display = 'block';
        document.getElementById('nextPlayerBtn').style.display = 'none';
    } else {
        header.className = 'result-header wrong';
        title.textContent = '❌ WRONG!';
        document.getElementById('continueBtn').style.display = 'none';
        document.getElementById('nextPlayerBtn').style.display = 'block';
    }

    // Animate reveal
    header.style.display = 'block';
    header.style.textAlign = 'center';
    header.style.animation = 'scaleIn 0.5s ease-out';

    // Flash background
    document.body.style.animation = isCorrect ? 'flashGreen 0.5s' : 'flashRed 0.5s';

    // Show buttons after animation
    setTimeout(() => {
        document.getElementById('resultButtons').style.display = 'block';
    }, 500);
}

// Format value based on display format
function formatValue(value, format) {
    if (!value && value !== 0) return 'N/A';

    switch (format) {
        case 'currency':
            return formatCurrency(value);
        case 'number':
            return formatNumber(value);
        case 'decimal':
            return value.toFixed(1);
        case 'percentage':
            return value.toFixed(1) + '%';
        case 'year':
            return value.toString();
        default:
            return value.toString();
    }
}

// Format currency (USD)
function formatCurrency(value) {
    if (value >= 1000000000) {
        return '$' + (value / 1000000000).toFixed(2) + ' Billion';
    } else if (value >= 1000000) {
        return '$' + (value / 1000000).toFixed(1) + ' Million';
    } else if (value >= 1000) {
        return '$' + (value / 1000).toFixed(1) + 'K';
    } else {
        return '$' + value.toFixed(0);
    }
}

// Format large numbers
function formatNumber(value) {
    if (value >= 1000000000) {
        return (value / 1000000000).toFixed(2) + ' Billion';
    } else if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + ' Million';
    } else if (value >= 1000) {
        return value.toLocaleString();
    } else {
        return value.toString();
    }
}

// Show error screen
function showError(title, message, returnScreen) {
    document.getElementById('errorTitle').textContent = title;
    document.getElementById('errorMessage').textContent = message;

    // Store which screen to return to
    if (!returnScreen) {
        // Determine return screen based on game state
        if (!gameState.challenge) {
            returnScreen = 'challengeScreen';
        } else if (!gameState.centerToken) {
            returnScreen = 'centerTokenScreen';
        } else {
            returnScreen = 'scanTokenScreen';
        }
    }

    // Store for error retry button
    window.errorReturnScreen = returnScreen;
    showScreen('errorScreen');
}
