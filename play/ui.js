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
    document.getElementById('guessTokenName').textContent = gameState.centerToken.name;
    document.getElementById('guessChallengeInfo').textContent =
        `${gameState.challenge.name}: ???`;
}

// Display result
function displayResult(isCorrect, centerValue, scannedValue) {
    showScreen('resultScreen');

    // Header
    const header = document.getElementById('resultHeader');
    const title = document.getElementById('resultTitle');

    if (isCorrect) {
        header.className = 'result-header correct';
        title.textContent = '✅ CORRECT!';
    } else {
        header.className = 'result-header wrong';
        title.textContent = '❌ WRONG!';
    }

    // Scanned token
    const scannedCircle = document.getElementById('scannedTokenCircle');
    scannedCircle.style.borderColor = gameState.scannedToken.categoryColor;
    scannedCircle.className = `token-circle cat-${gameState.scannedToken.category}`;

    document.getElementById('scannedTokenName').textContent = gameState.scannedToken.name;
    document.getElementById('scannedValue').textContent = formatValue(scannedValue, gameState.challenge.displayFormat);

    // Center token
    const centerCircle = document.getElementById('resultCenterCircle');
    centerCircle.style.borderColor = gameState.centerToken.categoryColor;
    centerCircle.className = `token-circle cat-${gameState.centerToken.category}`;

    document.getElementById('resultCenterName').textContent = gameState.centerToken.name;
    document.getElementById('centerValue').textContent = formatValue(centerValue, gameState.challenge.displayFormat);

    // Comparison operator
    const operator = document.getElementById('comparisonOperator');
    if (scannedValue > centerValue) {
        operator.textContent = 'is HIGHER than';
    } else if (scannedValue < centerValue) {
        operator.textContent = 'is LOWER than';
    } else {
        operator.textContent = 'equals';
    }

    // Feedback
    const feedback = document.getElementById('guessFeedback');
    if (isCorrect) {
        feedback.textContent = `You guessed ${gameState.playerGuess.toUpperCase()} and you were right!`;
        document.getElementById('continueBtn').style.display = 'block';
        document.getElementById('nextPlayerBtn').style.display = 'none';
    } else {
        feedback.textContent = `You guessed ${gameState.playerGuess.toUpperCase()} but it was ${scannedValue > centerValue ? 'HIGHER' : 'LOWER'}.`;
        document.getElementById('continueBtn').style.display = 'none';
        document.getElementById('nextPlayerBtn').style.display = 'block';
    }
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
function showError(title, message) {
    document.getElementById('errorTitle').textContent = title;
    document.getElementById('errorMessage').textContent = message;
    showScreen('errorScreen');
}
