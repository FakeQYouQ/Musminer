import { initTelegramApp } from './telegramBot';
import MainPage from './pages/MainPage';
import WalletPage from './pages/WalletPage';
import { getRequest } from './services/api';

// Инициализация Telegram WebApp
const tg = initTelegramApp();

document.addEventListener('DOMContentLoaded', async () => {
    const appContainer = document.getElementById('app');
    if (!appContainer) {
        console.error('App container not found! Ensure you have an element with id "app" in your HTML.');
        return;
    }

    // Получение данных пользователя из Telegram WebApp
    const telegramUser = tg.initDataUnsafe.user || null;
    if (!telegramUser) {
        alert('User data not available. Please open the app through Telegram.');
        return;
    }

    const userId = telegramUser.id;
    const username = telegramUser.username || 'Guest';

    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = `Welcome, ${username}!`;
    } else {
        console.warn('Username element not found.');
    }

    // Рендер главной страницы
    MainPage.render(appContainer, userId);

    // Настройка главной кнопки Telegram
    tg.MainButton.text = 'Open Wallet';
    tg.MainButton.show();

    tg.MainButton.onClick(() => {
        tg.MainButton.hide();
        renderWalletPage(appContainer, userId);
    });
});

// Функция для рендера страницы кошелька
async function renderWalletPage(container, userId) {
    try {
        const walletData = await getRequest(`/users/${userId}/wallet`);
        container.innerHTML = ''; // Очистка текущего контента
        WalletPage.render(container, walletData);
    } catch (error) {
        console.error('Error fetching wallet data:', error);
        container.innerHTML = '<p>Error loading wallet data. Please try again later.</p>';
    }
}
