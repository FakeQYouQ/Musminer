// app/components/Player.js

/**
 * Music Player Component
 * Handles rendering and interactions with the music player.
 */
const Player = {
    /**
     * Render the player UI into the given container element.
     * @param {HTMLElement} container - The container to render the player into.
     * @param {Object} track - The track information to display.
     */
    render(container, track = null) {
        // Clear existing content
        container.innerHTML = '';

        // Create player container
        const playerContainer = document.createElement('div');
        playerContainer.className = 'player';

        // Track information
        const trackInfo = document.createElement('div');
        trackInfo.className = 'track-info';

        const trackName = document.createElement('h3');
        trackName.textContent = track ? track.title : 'No track playing';

        const artistName = document.createElement('p');
        artistName.textContent = track ? `by ${track.artist}` : '';

        trackInfo.appendChild(trackName);
        trackInfo.appendChild(artistName);

        // Audio controls
        const audioControls = document.createElement('div');
        audioControls.className = 'audio-controls';

        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.onclick = () => {
            if (audio.src && !audio.paused) {
                audio.pause();
                playButton.textContent = 'Play';
            } else {
                audio.play();
                playButton.textContent = 'Pause';
            }
        };

        const audio = new Audio(track ? track.url : '');
        audio.onended = () => {
            playButton.textContent = 'Play';
        };

        audioControls.appendChild(playButton);

        // Append elements
        playerContainer.appendChild(trackInfo);
        playerContainer.appendChild(audioControls);
        container.appendChild(playerContainer);
    },
};

export default Player;
