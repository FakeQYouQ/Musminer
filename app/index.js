// app/index.js

// Import necessary modules
import { initTelegramApp } from './telegramBot';
import MainPage from './pages/MainPage';

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
        // Add further navigation or logic here
    });

    console.log('Telegram Mini App initialized successfully.');
});
