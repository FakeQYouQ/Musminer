// app/services/tokenService.js

const DAILY_EARNING_LIMIT = 21600; // 6 часов в секундах
const TRACK_LIMIT = 3; // Максимум 3 начисления токенов за трек в день

const tokenData = {
    totalEarned: 0,
    dailyTimeSpent: 0,
    trackPlays: {}, // Счётчик прослушиваний треков: { trackId: count }
};

/**
 * Earn tokens for a track and distribute between listener, artist, and platform.
 * @param {string} trackId - The ID of the track.
 * @param {number} trackDuration - Duration of the track in seconds.
 * @param {string} artistId - The ID of the artist.
 * @returns {string} - Message indicating success or failure.
 */
export function earnTokens(trackId, trackDuration, artistId) {
    if (trackDuration < 60) {
        return 'Track duration is too short to earn tokens.';
    }

    if (tokenData.dailyTimeSpent >= DAILY_EARNING_LIMIT) {
        return 'Daily earning limit reached. You can still listen to the track without earning tokens.';
    }

    if (!tokenData.trackPlays[trackId]) {
        tokenData.trackPlays[trackId] = 0;
    }

    if (tokenData.trackPlays[trackId] >= TRACK_LIMIT) {
        return `You have already earned tokens for ${TRACK_LIMIT} plays of this track today. Feel free to listen more!`;
    }

    // Распределение токенов
    const listenerReward = 0.01;
    const artistReward = 0.001;
    const platformReward = 0.0001;

    tokenData.totalEarned += listenerReward;
    tokenData.dailyTimeSpent += trackDuration;
    tokenData.trackPlays[trackId] += 1;

    console.log(`Listener earned ${listenerReward} tokens.`);
    console.log(`Artist ${artistId} earned ${artistReward} tokens.`);
    console.log(`Platform earned ${platformReward} tokens.`);

    return `Earned ${listenerReward} tokens for track ${trackId}.`;
}

/**
 * Reset daily limits (simulate daily reset).
 */
export function resetDailyLimits() {
    tokenData.dailyTimeSpent = 0;
    tokenData.trackPlays = {};
}
