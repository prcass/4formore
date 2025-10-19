/**
 * Local Storage Management
 */

// Check if data is cached
function isDataCached() {
    return localStorage.getItem('tokensData') && localStorage.getItem('challengesData');
}

// Get cached version
function getCachedVersion() {
    const tokensData = localStorage.getItem('tokensData');
    if (tokensData) {
        const data = JSON.parse(tokensData);
        return data.version || '0.0.0';
    }
    return null;
}

// Clear all cached data
function clearCache() {
    localStorage.removeItem('tokensData');
    localStorage.removeItem('challengesData');
    console.log('🗑️ Cache cleared');
}

// Export functions for debugging
window.gameStorage = {
    isDataCached,
    getCachedVersion,
    clearCache
};
