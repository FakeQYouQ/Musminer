import fetch from 'node-fetch';

/**
 * Отправить сообщение через Telegram Bot API
 * @param {string} chatId - ID чата Telegram
 * @param {string} message - Текст сообщения
 * @returns {Promise<void>}
 */
export async function sendTelegramMessage(chatId, message) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

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
