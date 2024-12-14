import Wallet from '../components/Wallet.js';
import Player from '../components/Player.js';
import {
    fetchTracks,
    fetchWalletBalance,
    fetchTransactionHistory,
    performTransaction,
    fetchTracksByUser,
    fetchFavorites,
    fetchRatings,
    updateTrack,
    deleteTrack,
} from '../services/api.js';

const MainPage = {
    async updateWalletContent(walletContainer, userId) {
        walletContainer.innerHTML = '<p>Загрузка данных...</p>';
        try {
            const balanceData = await fetchWalletBalance(userId);
            const transactionsData = await fetchTransactionHistory(userId);

            Wallet.render(walletContainer, {
                balance: balanceData.balance,
                transactions: transactionsData,
                withdrawEnabled: false,
            }, async (type, amount, description) => {
                try {
                    await performTransaction(userId, type, amount, description);
                    alert('Транзакция успешно выполнена!');
                    await this.updateWalletContent(walletContainer, userId);
                } catch (error) {
                    alert('Ошибка выполнения транзакции.');
                    console.error(error);
                }
            });
        } catch (error) {
            walletContainer.innerHTML = '<p>Ошибка загрузки данных кошелька. Повторите позже.</p>';
            console.error(error);
        }
    },

    async renderWalletTab(content, userId) {
        content.innerHTML = '';
        const walletTitle = document.createElement('h2');
        walletTitle.textContent = 'Кошелек';

        const walletContainer = document.createElement('div');
        walletContainer.className = 'wallet-container';

        content.appendChild(walletTitle);
        content.appendChild(walletContainer);

        await this.updateWalletContent(walletContainer, userId);
    },

    async renderMainTab(content, userId) {
        content.innerHTML = '';

        const welcomeMessage = document.createElement('h2');
        welcomeMessage.textContent = 'Начните слушать музыку и зарабатывать!';

        const playerContainer = document.createElement('div');
        playerContainer.id = 'player-container';

        const startButton = document.createElement('button');
        startButton.textContent = 'Запустить плеер';
        startButton.onclick = async () => {
            playerContainer.innerHTML = '<p>Загрузка треков...</p>';
            try {
                const tracks = await fetchTracks();
                if (tracks.length === 0) {
                    playerContainer.innerHTML = '<p>Треки не найдены.</p>';
                    return;
                }
                playerContainer.innerHTML = '';
                Player.render(playerContainer, tracks, 0, userId);
            } catch (error) {
                playerContainer.innerHTML = '<p>Ошибка загрузки треков. Повторите позже.</p>';
                console.error(error);
            }
        };

        content.appendChild(welcomeMessage);
        content.appendChild(startButton);
        content.appendChild(playerContainer);
    },

    async renderLibraryTab(content, userId) {
        content.innerHTML = '';

        const libraryTitle = document.createElement('h2');
        libraryTitle.textContent = 'Моя библиотека';

        const libraryContainer = document.createElement('div');
        libraryContainer.className = 'library-container';
        libraryContainer.innerHTML = '<p>Загрузка библиотеки...</p>';

        content.appendChild(libraryTitle);
        content.appendChild(libraryContainer);

        try {
            const tracks = await fetchTracksByUser(userId);
            libraryContainer.innerHTML = '';

            if (tracks.length === 0) {
                libraryContainer.innerHTML = '<p>У вас пока нет загруженных треков.</p>';
            } else {
                tracks.forEach((track) => {
                    const trackItem = document.createElement('div');
                    trackItem.className = 'track-item';

                    const trackInfo = document.createElement('p');
                    trackInfo.textContent = `${track.title} - ${track.artist}`;

                    const playButton = document.createElement('button');
                    playButton.textContent = 'Играть';
                    playButton.onclick = () => {
                        const playerContainer = document.getElementById('player-container');
                        Player.render(playerContainer, tracks, tracks.indexOf(track), userId);
                    };

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Редактировать';
                    editButton.onclick = async () => {
                        const newTitle = prompt('Введите новое название трека:', track.title);
                        const newArtist = prompt('Введите новое имя исполнителя:', track.artist);
                        if (newTitle && newArtist) {
                            try {
                                await updateTrack(track.id, { title: newTitle, artist: newArtist });
                                alert('Трек успешно обновлен!');
                                await this.renderLibraryTab(content, userId);
                            } catch (error) {
                                alert('Ошибка обновления трека.');
                                console.error(error);
                            }
                        }
                    };

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Удалить';
                    deleteButton.onclick = async () => {
                        if (confirm('Вы уверены, что хотите удалить этот трек?')) {
                            try {
                                await deleteTrack(track.id);
                                alert('Трек успешно удален!');
                                await this.renderLibraryTab(content, userId);
                            } catch (error) {
                                alert('Ошибка удаления трека.');
                                console.error(error);
                            }
                        }
                    };

                    trackItem.appendChild(trackInfo);
                    trackItem.appendChild(playButton);
                    trackItem.appendChild(editButton);
                    trackItem.appendChild(deleteButton);

                    libraryContainer.appendChild(trackItem);
                });
            }
        } catch (error) {
            libraryContainer.innerHTML = '<p>Ошибка загрузки библиотеки. Повторите позже.</p>';
            console.error(error);
        }
    },

    async renderRatingsTab(content) {
        content.innerHTML = '<p>Загрузка рейтингов...</p>';

        try {
            const [tracks, artists, labels] = await fetchRatings();
            content.innerHTML = `
                <h2>Рейтинги</h2>
                <h3>Топ треков</h3>
                <ul>${tracks.map((t) => `<li>${t.title} — ${t.playCount} воспроизведений</li>`).join('')}</ul>
                <h3>Топ артистов</h3>
                <ul>${artists.map((a) => `<li>${a.username} — ${a.balance} токенов</li>`).join('')}</ul>
                <h3>Топ лейблов</h3>
                <ul>${labels.map((l) => `<li>${l.username} — ${l.balance} токенов</li>`).join('')}</ul>
            `;
        } catch (error) {
            content.innerHTML = '<p>Ошибка загрузки рейтингов. Повторите позже.</p>';
            console.error(error);
        }
    },

    renderTabs(nav, content, tabsHandlers) {
        nav.innerHTML = '';
        Object.keys(tabsHandlers).forEach((tab) => {
            const button = document.createElement('button');
            button.textContent = tab;
            button.onclick = () => {
                Array.from(nav.children).forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                tabsHandlers[tab]();
            };
            nav.appendChild(button);
        });
    },

    render(container, userId) {
        container.innerHTML = '';

        const header = document.createElement('header');
        header.textContent = 'Музыкальная платформа';

        const description = document.createElement('p');
        description.textContent = 'Слушайте музыку, зарабатывайте токены и управляйте своим кошельком.';

        const nav = document.createElement('nav');
        const content = document.createElement('div');
        content.className = 'tab-content';

        const tabsHandlers = {
            'Главная': () => this.renderMainTab(content, userId),
            'Кошелек': () => this.renderWalletTab(content, userId),
            'Библиотека': () => this.renderLibraryTab(content, userId),
            'Избранное': () => this.renderFavoritesTab(content, userId),
            'Рейтинги': () => this.renderRatingsTab(content),
        };

        this.renderTabs(nav, content, tabsHandlers);
        this.renderMainTab(content, userId);

        container.appendChild(header);
        container.appendChild(description);
        container.appendChild(nav);
        container.appendChild(content);
    },
};

export default MainPage;
