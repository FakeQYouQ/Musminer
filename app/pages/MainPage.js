// app/pages/MainPage.js

import Player from '../components/Player';

const MainPage = {
    render(container, user) {
        container.innerHTML = ''; // Очистка контейнера

        // Создание заголовка
        const header = document.createElement('h1');
        header.textContent = `Добро пожаловать, ${user.name || 'Пользователь'}!`;

        const description = document.createElement('p');
        description.textContent = 'Слушайте музыку и зарабатывайте токены!';

        // Навигационные вкладки
        const nav = document.createElement('nav');
        const tabs = [
            { name: 'Главная', action: () => this.renderMainTab(content) },
            { name: 'Моя библиотека', action: () => this.renderLibraryTab(content) },
            { name: 'Плейлисты', action: () => this.renderPlaylistsTab(content) },
            { name: 'Кошелек', action: () => this.renderWalletTab(content, user) },
        ];

        tabs.forEach(tab => {
            const button = document.createElement('button');
            button.textContent = tab.name;
            button.onclick = tab.action;
            nav.appendChild(button);
        });

        // Контентная область
        const content = document.createElement('div');
        content.className = 'content';

        // Рендер начальной вкладки
        this.renderMainTab(content);

        // Добавление элементов на страницу
        container.appendChild(header);
        container.appendChild(description);
        container.appendChild(nav);
        container.appendChild(content);
    },

    renderMainTab(content) {
        content.innerHTML = '';
        const welcomeMessage = document.createElement('h2');
        welcomeMessage.textContent = 'Начните слушать музыку и зарабатывать!';

        const startButton = document.createElement('button');
        startButton.textContent = 'Запустить плеер';
        startButton.onclick = () => {
            alert('Плеер запущен!');
            // Логика запуска плеера
        };

        content.appendChild(welcomeMessage);
        content.appendChild(startButton);
    },

    renderLibraryTab(content) {
        content.innerHTML = '';
        const libraryTitle = document.createElement('h2');
        libraryTitle.textContent = 'Моя библиотека';

        // Заглушка для отображения библиотеки
        const placeholder = document.createElement('p');
        placeholder.textContent = 'Ваша библиотека пуста. Добавьте треки, чтобы начать!';

        content.appendChild(libraryTitle);
        content.appendChild(placeholder);
    },

    renderPlaylistsTab(content) {
        content.innerHTML = '';
        const playlistsTitle = document.createElement('h2');
        playlistsTitle.textContent = 'Мои плейлисты';

        // Заглушка для отображения плейлистов
        const placeholder = document.createElement('p');
        placeholder.textContent = 'Плейлисты пока не созданы. Создайте свой первый плейлист!';

        content.appendChild(playlistsTitle);
        content.appendChild(placeholder);
    },

    renderWalletTab(content, user) {
        content.innerHTML = '';
        const walletTitle = document.createElement('h2');
        walletTitle.textContent = 'Кошелек';

        const balance = document.createElement('p');
        balance.textContent = `Ваш баланс токенов: ${user.tokens || 0}`;

        const transactionHistory = document.createElement('div');
        transactionHistory.className = 'transaction-history';
        transactionHistory.innerHTML = '<h3>История начислений:</h3>';

        const transactions = user.transactions || [];
        transactions.forEach(tx => {
            const txItem = document.createElement('p');
            txItem.textContent = `${tx.date}: ${tx.amount} токенов за "${tx.track}"`;
            transactionHistory.appendChild(txItem);
        });

        content.appendChild(walletTitle);
        content.appendChild(balance);
        content.appendChild(transactionHistory);
    },
};

export default MainPage;
