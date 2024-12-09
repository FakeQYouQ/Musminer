// app/components/Player.js

const Player = {
    render(container, playlist = [], currentTrackIndex = 0) {
        if (!Array.isArray(playlist) || playlist.length === 0) {
            throw new Error('Playlist must be a non-empty array.');
        }

        // Set current track
        let currentTrack = playlist[currentTrackIndex];

        container.innerHTML = ''; // Очистка контейнера

        const playerContainer = document.createElement('div');
        playerContainer.className = 'player';

        // Track info
        const trackInfo = document.createElement('div');
        trackInfo.className = 'track-info';

        const trackName = document.createElement('h3');
        trackName.textContent = currentTrack ? currentTrack.title : 'No track playing';
        const artistName = document.createElement('p');
        artistName.textContent = currentTrack ? `by ${currentTrack.artist}` : '';

        trackInfo.appendChild(trackName);
        trackInfo.appendChild(artistName);

        // Audio
        const audio = new Audio(currentTrack.url);
        audio.autoplay = true;

        audio.onended = () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            Player.render(container, playlist, currentTrackIndex);
        };

        // Controls
        const controls = document.createElement('div');
        controls.className = 'audio-controls';

        const playButton = document.createElement('button');
        playButton.textContent = 'Pause';
        playButton.onclick = () => {
            if (audio.paused) {
                audio.play();
                playButton.textContent = 'Pause';
            } else {
                audio.pause();
                playButton.textContent = 'Play';
            }
        };

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            Player.render(container, playlist, currentTrackIndex);
        };

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Prev';
        prevButton.onclick = () => {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            Player.render(container, playlist, currentTrackIndex);
        };

        controls.appendChild(prevButton);
        controls.appendChild(playButton);
        controls.appendChild(nextButton);

        playerContainer.appendChild(trackInfo);
        playerContainer.appendChild(controls);
        container.appendChild(playerContainer);
    },
};

export default Player;
