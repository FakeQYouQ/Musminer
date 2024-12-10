// app/services/telegramWallet.js

/**
 * Telegram Wallet Integration
 * Handles interaction with Telegram Wallet for TON payments and balances.
 */

/**
 * Check if Telegram Wallet is available.
 * @returns {boolean} - True if available, false otherwise.
 */
export function isTelegramWalletAvailable() {
    return typeof Telegram !== 'undefined' &&
           Telegram.WebApp?.initDataUnsafe?.user;
}

/**
 * Get user wallet details from Telegram.
 * @returns {Object|null} - Wallet details or null if unavailable.
 */
export function getTelegramWalletDetails() {
    if (!isTelegramWalletAvailable()) {
        console.error('Telegram Wallet is not available.');
        return null;
    }

    const user = Telegram.WebApp.initDataUnsafe.user;
    return {
        id: user.id,
        username: user.username || 'Unknown',
        walletAddress: `ton://transfer/${user.id}?amount=0&text=YourMessageHere`, // Example link
    };
}

/**
 * Validate a TON wallet address.
 * @param {string} address - TON wallet address to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidTonAddress(address) {
    const tonAddressRegex = /^([A-Za-z0-9_]{48}|[A-Za-z0-9_]{66})$/; // Example regex for TON addresses
    return tonAddressRegex.test(address);
}

/**
 * Send TON tokens using Telegram Wallet.
 * @param {string} recipientAddress - TON wallet address of the recipient.
 * @param {number} amount - Amount of tokens to send.
 * @returns {Promise<string>} - Result message.
 */
export async function sendTokens(recipientAddress, amount) {
    if (!isTelegramWalletAvailable()) {
        return 'Telegram Wallet is not available.';
    }

    if (!isValidTonAddress(recipientAddress)) {
        return 'Invalid TON wallet address.';
    }

    if (amount <= 0) {
        return 'Invalid amount. Please enter a positive value.';
    }

    const transferUrl = `ton://transfer/${recipientAddress}?amount=${amount}`;

    try {
        window.open(transferUrl, '_blank'); // Open Telegram Wallet for transfer
        console.log(`Initiated transfer of ${amount} TON to ${recipientAddress}`);
        return `Transfer initiated: ${amount} TON to ${recipientAddress}`;
    } catch (error) {
        console.error('Error sending tokens:', error);
        return 'Failed to initiate transfer.';
    }
}
