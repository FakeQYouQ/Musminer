// app/index.js

// Import necessary modules
import { initTelegramApp } from './telegramBot';
import MainPage from './pages/MainPage';
import WalletPage from './pages/WalletPage'; // New WalletPage
import { getRequest } from './services/api'; // For fetching data like balance

// Initialize Telegram Web App
const tg = initTelegramApp();

document.addEventListener('DOMContentLoaded', () => {
    // Set up basic app structure
    const appContainer = document.getElementById('app');

    if (!appContainer) {
        console.error('App container not found! Make sure to include an element with id "app" in your HTML.');
        return;
    }

    // Render Main Page
    MainPage.render(appContainer);

    // Example interaction: Update Telegram Web App title
    tg.MainButton.text = 'Start Listening';
    tg.MainButton.show();

    tg.MainButton.onClick(() => {
        alert('Main Button clicked!');
        // Navigation to Wallet page
        renderWalletPage(appContainer);
    });

    console.log('Telegram Mini App initialized successfully.');
});

// New function to render Wallet Page
async function renderWalletPage(container) {
    const userId = 'user123'; // Replace with actual user ID

    try {
        const walletData = await getRequest(`/users/${userId}/wallet`);
        container.innerHTML = ''; // Clear current content
        WalletPage.render(container, walletData); // Render Wallet Page with data
    } catch (error) {
        console.error('Error fetching wallet data:', error);
    }
}
