// app/telegramBot.js

/**
 * Initialize the Telegram Web App instance
 */
export function initTelegramApp() {
    // Check if Telegram Web App is available
    if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
        console.error('Telegram Web App API not available.');
        return null;
    }

    const tg = Telegram.WebApp;

    // Basic Telegram App setup
    tg.expand(); // Expand the web app to fullscreen
    tg.MainButton.hide(); // Hide the main button initially
    tg.HapticFeedback.enabled = true; // Enable haptic feedback (if supported)

    console.log('Telegram Web App initialized.');
    return tg;
}
