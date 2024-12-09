// app/components/TrackCard.js

/**
 * Track Card Component
 * Displays information about a track and provides interaction options.
 */
const TrackCard = {
    /**
     * Render the track card into the given container element.
     * @param {HTMLElement} container - The container to render the track card into.
     * @param {Object} track - The track data to display.
     * @param {Function} onPlay - Callback function for playing the track.
     * @param {Function} onFavorite - Callback function for adding the track to favorites.
     */
    render(container, track, onPlay, onFavorite) {
        // Create card container
        const card = document.createElement('div');
        card.className = 'track-card';

        // Track image
        const trackImage = document.createElement('img');
        trackImage.src = track.image || 'placeholder.jpg';
        trackImage.alt = `${track.title} cover`;
        trackImage.className = 'track-image';

        // Track info
        const trackInfo = document.createElement('div');
        trackInfo.className = 'track-info';

        const trackTitle = document.createElement('h3');
        trackTitle.textContent = track.title;

        const trackArtist = document.createElement('p');
        trackArtist.textContent = `by ${track.artist}`;

        trackInfo.appendChild(trackTitle);
        trackInfo.appendChild(trackArtist);

        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'actions';

        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.onclick = () => onPlay(track);

        const favoriteButton = document.createElement('button');
        favoriteButton.textContent = 'Favorite';
        favoriteButton.onclick = () => onFavorite(track);

        actions.appendChild(playButton);
        actions.appendChild(favoriteButton);

        // Assemble card
        card.appendChild(trackImage);
        card.appendChild(trackInfo);
        card.appendChild(actions);

        // Append to container
        container.appendChild(card);
    },
};

export default TrackCard;
