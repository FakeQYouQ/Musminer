/**
 * Earn tokens for a track and distribute between listener, artist, and platform.
 * @param {string} trackId - The ID of the track.
 * @param {number} trackDuration - Duration of the track in seconds.
 * @param {string} artistId - The ID of the artist.
 * @param {string} userId - The ID of the listener.
 * @returns {string} - Message indicating success or failure.
 */
export async function earnTokens(trackId, trackDuration, artistId, userId) {
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

    // Add token transaction to user's wallet
    await addTransaction(userId, listenerReward);

    console.log(`Listener earned ${listenerReward} tokens.`);
    console.log(`Artist ${artistId} earned ${artistReward} tokens.`);
    console.log(`Platform earned ${platformReward} tokens.`);

    return `Earned ${listenerReward} tokens for track ${trackId}.`;
}

/**
 * Add token transaction to user's wallet
 * @param {string} userId - The user ID.
 * @param {number} amount - The amount of tokens earned.
 */
async function addTransaction(userId, amount) {
    const data = {
        userId,
        amount,
        type: 'earned',
        date: new Date().toISOString(),
    };
    await postRequest(`/users/${userId}/transactions`, data);
}

/**
 * Reset daily limits (simulate daily reset).
 */
export function resetDailyLimits() {
    tokenData.dailyTimeSpent = 0;
    tokenData.trackPlays = {};
}
