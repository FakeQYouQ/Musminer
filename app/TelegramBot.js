import fetch from 'node-fetch';

/**
 * Initialize the Telegram Web App instance
 */
export function initTelegramApp() {
    if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
        console.error('Telegram Web App API not available.');
        return null;
    }

    const tg = Telegram.WebApp;

    tg.expand(); // Expand the web app to fullscreen
    tg.MainButton.hide(); // Hide the main button initially
    tg.HapticFeedback.enabled = true; // Enable haptic feedback

    console.log('Telegram Web App initialized.');
    return tg;
}

/**
 * Send a Telegram notification
 * @param {string} chatId - Telegram chat ID
 * @param {string} message - Notification message
 * @returns {Promise<void>}
 */
export async function sendTelegramMessage(chatId, message) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Add your bot token here

    if (!TELEGRAM_BOT_TOKEN) {
        throw new Error('Telegram bot token is not defined in the environment.');
    }

    const telegramAPIUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(telegramAPIUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API Error:', errorData);
            throw new Error(errorData.description || 'Error sending Telegram message');
        }

        console.log(`Message sent to chat ID ${chatId}: "${message}"`);
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
    }
}
