/**
 * Generate QR codes for all tokens and challenges
 * Run with: node generate_qr_codes.js
 */

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Load data
const tokensData = JSON.parse(fs.readFileSync('./data/tokens.json', 'utf8'));
const challengesData = JSON.parse(fs.readFileSync('./data/challenges.json', 'utf8'));

// Create output directories
const tokenQRDir = './qr-codes/tokens';
const challengeQRDir = './qr-codes/challenges';

if (!fs.existsSync('./qr-codes')) {
    fs.mkdirSync('./qr-codes');
}
if (!fs.existsSync(tokenQRDir)) {
    fs.mkdirSync(tokenQRDir);
}
if (!fs.existsSync(challengeQRDir)) {
    fs.mkdirSync(challengeQRDir);
}

// QR code generation options
const qrOptions = {
    width: 300,  // 300px for crisp printing at 25mm
    margin: 1,
    errorCorrectionLevel: 'M'
};

// Base URL for the app
const baseURL = 'https://prcass.github.io/4formore/play';

// Generate token QR codes
async function generateTokenQRCodes() {
    console.log('🎯 Generating token QR codes...');

    const tokens = Object.values(tokensData.tokens);
    let generated = 0;

    for (const token of tokens) {
        const qrData = `${baseURL}?type=token&id=${token.id}`;
        const filename = `${tokenQRDir}/${token.id}_${token.code}.png`;

        try {
            await QRCode.toFile(filename, qrData, qrOptions);
            generated++;

            if (generated % 10 === 0) {
                console.log(`  Generated ${generated}/${tokens.length} token QR codes...`);
            }
        } catch (error) {
            console.error(`❌ Error generating QR for ${token.id}:`, error);
        }
    }

    console.log(`✅ Generated ${generated} token QR codes`);
}

// Generate challenge QR codes
async function generateChallengeQRCodes() {
    console.log('🎯 Generating challenge QR codes...');

    const challenges = Object.values(challengesData.challenges);
    let generated = 0;

    for (const challenge of challenges) {
        const qrData = `${baseURL}?type=challenge&id=${challenge.id}`;
        const filename = `${challengeQRDir}/${challenge.id}.png`;

        try {
            await QRCode.toFile(filename, qrData, qrOptions);
            generated++;
            console.log(`  Generated: ${challenge.name} (${challenge.category})`);
        } catch (error) {
            console.error(`❌ Error generating QR for ${challenge.id}:`, error);
        }
    }

    console.log(`✅ Generated ${generated} challenge QR codes`);
}

// Generate reference sheet
function generateReferenceSheet() {
    console.log('📋 Generating reference sheet...');

    const tokens = Object.values(tokensData.tokens);
    const challenges = Object.values(challengesData.challenges);

    let markdown = '# 4forMore QR Code Reference\n\n';
    markdown += `Generated: ${new Date().toISOString()}\n\n`;

    // Token summary by category
    markdown += '## Tokens by Category\n\n';
    const categories = {
        countries: [],
        movies: [],
        companies: [],
        sports: []
    };

    tokens.forEach(token => {
        categories[token.category].push(token);
    });

    for (const [category, items] of Object.entries(categories)) {
        markdown += `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${items.length} tokens)\n\n`;
        markdown += '| Code | Name | ID | QR File |\n';
        markdown += '|------|------|----|---------|\n';

        items.sort((a, b) => a.code.localeCompare(b.code));

        items.forEach(token => {
            markdown += `| ${token.code} | ${token.name} | ${token.id} | \`${token.id}_${token.code}.png\` |\n`;
        });

        markdown += '\n';
    }

    // Challenge cards
    markdown += '## Challenge Cards\n\n';
    markdown += '| Category | Challenge Name | ID | QR File |\n';
    markdown += '|----------|----------------|----|---------|\n';

    challenges.forEach(challenge => {
        markdown += `| ${challenge.category} | ${challenge.name} | ${challenge.id} | \`${challenge.id}.png\` |\n`;
    });

    fs.writeFileSync('./qr-codes/REFERENCE.md', markdown);
    console.log('✅ Reference sheet created: qr-codes/REFERENCE.md');
}

// Main execution
async function main() {
    console.log('🚀 Starting QR code generation...\n');

    await generateTokenQRCodes();
    console.log('');

    await generateChallengeQRCodes();
    console.log('');

    generateReferenceSheet();

    console.log('\n✅ QR code generation complete!');
    console.log('📁 QR codes saved to: ./qr-codes/');
    console.log('   - Tokens: ./qr-codes/tokens/');
    console.log('   - Challenges: ./qr-codes/challenges/');
    console.log('   - Reference: ./qr-codes/REFERENCE.md');
}

main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
