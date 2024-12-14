import { performTrackPlay, addTrackToFavorites } from '../services/api.js';

const Player = {
    async render(container, playlist = [], currentTrackIndex = 0, userId) {
        if (!Array.isArray(playlist) || playlist.length === 0) {
            throw new Error('Playlist must be a non-empty array.');
        }

        container.innerHTML = '';
        currentTrackIndex = (currentTrackIndex + playlist.length) % playlist.length;
        const currentTrack = playlist[currentTrackIndex];

        if (!currentTrack || !currentTrack.url) {
            throw new Error('Invalid track data.');
        }

        const playerContainer = document.createElement('div');
        playerContainer.className = 'player';

        const trackInfo = document.createElement('div');
        trackInfo.className = 'track-info';
        trackInfo.innerHTML = `
            <h3>${currentTrack.title || 'Unknown Track'}</h3>
            <p>${currentTrack.artist || ''}</p>
        `;

        const audio = new Audio(currentTrack.url);
        audio.autoplay = true;

        const controls = document.createElement('div');
        controls.className = 'audio-controls';

        const playPauseButton = this.createButton('Pause', () => {
            if (audio.paused) {
                audio.play();
                playPauseButton.textContent = 'Pause';
            } else {
                audio.pause();
                playPauseButton.textContent = 'Play';
            }
        });

        controls.appendChild(this.createButton('Prev', async () => {
            await this.switchTrack(-1, playlist, userId, container, currentTrackIndex);
        }));

        controls.appendChild(playPauseButton);

        controls.appendChild(this.createButton('Next', async () => {
            await this.switchTrack(1, playlist, userId, container, currentTrackIndex);
        }));

        controls.appendChild(this.createButton('Лайк', async () => {
            try {
                await addTrackToFavorites(currentTrack.id, userId);
                alert(`Трек "${currentTrack.title}" добавлен в избранное.`);
            } catch (error) {
                console.error('Ошибка добавления в избранное:', error);
            }
        }));

        audio.onended = async () => {
            await this.switchTrack(1, playlist, userId, container, currentTrackIndex);
        };

        playerContainer.appendChild(trackInfo);
        playerContainer.appendChild(controls);

        container.appendChild(playerContainer);

        await this.playTrack(currentTrack, userId);
    },

    createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        return button;
    },

    async switchTrack(direction, playlist, userId, container, currentTrackIndex) {
        currentTrackIndex = (currentTrackIndex + direction + playlist.length) % playlist.length;
        await this.render(container, playlist, currentTrackIndex, userId);
    },

    async playTrack(track, userId) {
        try {
            await performTrackPlay(track.id, userId);
            console.log(`Track played: ${track.title}`);
        } catch (error) {
            console.error('Error playing track:', error);
        }
    },
};

export default Player;
