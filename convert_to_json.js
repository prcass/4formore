#!/usr/bin/env node
/**
 * Convert v4_token_datasets.js to tokens.json for QR scan app
 */

const fs = require('fs');

// Load the token dataset by reading and parsing
const dataContent = fs.readFileSync('v4_token_datasets.js', 'utf8');

// Use Function constructor to execute in isolated scope
const extractData = new Function(dataContent + `
  return {
    COUNTRIES_TOKENS,
    MOVIES_TOKENS,
    COMPANIES_TOKENS,
    SPORTS_TOKENS
  };
`);

const data = extractData();

console.log(`Found ${data.COUNTRIES_TOKENS.length} countries`);
console.log(`Found ${data.MOVIES_TOKENS.length} movies`);
console.log(`Found ${data.COMPANIES_TOKENS.length} companies`);
console.log(`Found ${data.SPORTS_TOKENS.length} sports`);

// Helper to generate 3-letter code
function generateCode(name, category) {
  // Remove common words and special characters
  const clean = name
    .replace(/^The /i, '')
    .replace(/[^A-Za-z0-9\s]/g, '')
    .toUpperCase();

  // For multi-word names, use first letter of each word
  const words = clean.split(/\s+/).filter(w => w.length > 0);

  if (words.length >= 3) {
    // Take first letter of first 3 words
    return words.slice(0, 3).map(w => w[0]).join('');
  } else if (words.length === 2) {
    // First letter of first word + first 2 letters of second
    return words[0][0] + words[1].substring(0, 2);
  } else {
    // Take first 3 letters
    return clean.substring(0, 3).padEnd(3, 'X');
  }
}

// Category colors
const categoryColors = {
  'movies': '#E74C3C',
  'countries': '#3498DB',
  'companies': '#27AE60',
  'sports': '#FF9800'
};

// Convert tokens to standardized format
function convertTokens(tokenArray, category) {
  return tokenArray.map((token, index) => {
    const id = `${category.substring(0, 3).toUpperCase()}${String(index + 1).padStart(3, '0')}`;
    const code = generateCode(token.name, category);

    return {
      id: id,
      name: token.name,
      code: code,
      category: category,
      categoryColor: categoryColors[category],
      tags: token.tags || [],
      stats: token.stats || {}
    };
  });
}

// Build the complete tokens object
const tokensData = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  tokens: {}
};

// Add all tokens
const allTokens = [
  ...convertTokens(data.COUNTRIES_TOKENS, 'countries'),
  ...convertTokens(data.MOVIES_TOKENS, 'movies'),
  ...convertTokens(data.COMPANIES_TOKENS, 'companies'),
  ...convertTokens(data.SPORTS_TOKENS, 'sports')
];

// Index by ID
allTokens.forEach(token => {
  tokensData.tokens[token.id] = token;
});

// Write to file
fs.writeFileSync('data/tokens.json', JSON.stringify(tokensData, null, 2));

console.log(`\n✅ Created data/tokens.json`);
console.log(`📊 Total tokens: ${allTokens.length}`);
console.log(`💾 File size: ${(fs.statSync('data/tokens.json').size / 1024).toFixed(1)}KB`);

// Show sample codes
console.log(`\n📝 Sample 3-letter codes:`);
allTokens.slice(0, 10).forEach(t => {
  console.log(`  ${t.code} - ${t.name} (${t.category})`);
});
