const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

/**
 * Centralized error handler
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

/**
 * Fetch with timeout utility
 */
const fetchWithTimeout = async (resource, options = {}, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, { ...options, signal: controller.signal });
        return await handleResponse(response);
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }
        throw error;
    } finally {
        clearTimeout(id);
    }
};

/**
 * Generic API request
 */
const apiRequest = async (endpoint, method = 'GET', data = null) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : null,
    };
    return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, options);
};

/**
 * Generic GET request
 */
export const getRequest = (endpoint) => apiRequest(endpoint);

/**
 * Generic POST request
 */
export const postRequest = (endpoint, data) => apiRequest(endpoint, 'POST', data);

/**
 * Generic PUT request
 */
export const putRequest = (endpoint, data) => apiRequest(endpoint, 'PUT', data);

/**
 * Generic DELETE request
 */
export const deleteRequest = (endpoint) => apiRequest(endpoint, 'DELETE');

/**
 * Fetch wallet balance for a user
 */
export const fetchWalletBalance = (userId) => getRequest(`/users/${userId}/balance`);

/**
 * Fetch transaction history for a user
 */
export const fetchTransactionHistory = (userId) => getRequest(`/users/${userId}/transactions`);

/**
 * Transfer tokens to another user
 */
export const transferTokens = (userId, amount) => postRequest(`/users/${userId}/transfer`, { amount });

/**
 * Withdraw tokens to user's wallet
 */
export const withdrawTokens = (amount) => postRequest('/users/withdraw', { amount });

/**
 * Perform a generic transaction
 */
export const performTransaction = (userId, type, amount, description) =>
    postRequest('/tokens', { userId, type, amount, description });

/**
 * Fetch all tracks
 */
export const fetchTracks = () => getRequest('/tracks');

/**
 * Fetch tracks uploaded by a specific user
 */
export const fetchTracksByUser = (userId) => getRequest(`/tracks/user/${userId}`);

/**
 * Send playback data for a track
 */
export const performTrackPlay = (trackId, userId) =>
    getRequest(`/tracks/${trackId}/play?userId=${userId}`);

/**
 * Add track to user's favorites
 */
export const addTrackToFavorites = (trackId, userId) =>
    postRequest(`/tracks/${trackId}/favorite`, { userId });

/**
 * Fetch user's favorite tracks
 */
export const fetchFavorites = (userId) => getRequest(`/tracks/favorites/${userId}`);

/**
 * Update a track's details
 */
export const updateTrack = (trackId, data) => putRequest(`/tracks/${trackId}`, data);

/**
 * Delete a track
 */
export const deleteTrack = (trackId) => deleteRequest(`/tracks/${trackId}`);
