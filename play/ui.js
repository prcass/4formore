/**
 * UI Helper Functions
 */

// Show a specific screen
function showScreen(screenId) {
    // Stop all scanners before switching screens
    if (typeof stopAllScanners === 'function') {
        stopAllScanners();
    }

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
    card.querySelector('.challenge-category').textContent = `🎯 ${challenge.category.toUpperCase()}`;
    card.querySelector('.challenge-category').className = `challenge-category cat-${challenge.category}`;
    card.querySelector('.challenge-name').textContent = challenge.name;
    card.querySelector('.challenge-description').textContent = challenge.description;
}

// Display center token
function displayCenterToken(token) {
    const circle = document.getElementById('centerTokenCircle');
    circle.style.borderColor = token.categoryColor;
    circle.className = `token-circle cat-${token.category}`;

    document.getElementById('centerTokenName').textContent = token.name;
    document.getElementById('centerTokenCode').textContent = `[${token.code}]`;
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

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdown.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdown.style.display = 'none';
            revealResult(isCorrect);
        }
    }, 1000);
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
    header.style.fontSize = '3em';
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
