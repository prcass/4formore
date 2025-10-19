/**
 * QR Code Scanner Functions
 */

// Active scanners
const activeScanners = {};

// Start a QR code scanner
function startScanner(containerId, onSuccess) {
    console.log(`📷 Starting scanner: ${containerId}`);

    // Stop existing scanner if any
    stopScanner(containerId);

    // Create new scanner
    const scanner = new Html5Qrcode(containerId);

    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    scanner.start(
        { facingMode: "environment" }, // Use back camera
        config,
        (decodedText, decodedResult) => {
            console.log(`✅ QR Decoded: ${decodedText}`);

            // Call success handler
            if (onSuccess) {
                onSuccess(decodedText);
            }
        },
        (errorMessage) => {
            // Scanning errors (no QR code found) - ignore these
            // Only log if it's not the standard "No MultiFormat Readers were able to detect the code"
            if (!errorMessage.includes('No MultiFormat')) {
                console.log(`⚠️ Scan error: ${errorMessage}`);
            }
        }
    ).then(() => {
        console.log(`✅ Scanner started: ${containerId}`);
        activeScanners[containerId] = scanner;
    }).catch(err => {
        console.error(`❌ Scanner start failed: ${err}`);

        // Check if camera permission denied
        if (err.name === 'NotAllowedError') {
            showError(
                'Camera Access Denied',
                'Camera permission is required to scan QR codes. Please enable camera access in your browser settings and try again.'
            );
        } else {
            showError(
                'Camera Error',
                `Unable to start camera: ${err.message || err}. Please check your camera permissions and try again.`
            );
        }
    });
}

// Stop a QR code scanner
function stopScanner(containerId) {
    const scanner = activeScanners[containerId];

    if (scanner) {
        scanner.stop().then(() => {
            console.log(`🛑 Scanner stopped: ${containerId}`);
            delete activeScanners[containerId];
        }).catch(err => {
            console.error(`❌ Scanner stop error: ${err}`);
            delete activeScanners[containerId];
        });
    }
}

// Stop all scanners
function stopAllScanners() {
    Object.keys(activeScanners).forEach(containerId => {
        stopScanner(containerId);
    });
}
