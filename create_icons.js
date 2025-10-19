/**
 * Generate PWA icons for 4forMore app
 * Creates simple gradient icons with "4+" branding
 * Run with: node create_icons.js
 */

const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Gradient background (purple to blue)
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#764ba2');  // Purple
    gradient.addColorStop(1, '#667eea');  // Blue

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // White text "4+"
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('4+', size / 2, size / 2);

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`✅ Created: ${filename} (${size}x${size})`);
}

console.log('🎨 Generating PWA icons...\n');

createIcon(192, './play/icon-192.png');
createIcon(512, './play/icon-512.png');

console.log('\n✅ Icon generation complete!');
