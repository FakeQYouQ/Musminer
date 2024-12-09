// app/services/api.js

const API_BASE_URL = 'https://api.musicplatform.example'; // Замените на ваш URL API

/**
 * Perform a GET request to the API.
 * @param {string} endpoint - The API endpoint.
 * @returns {Promise<any>} - The response data.
 */
export async function getRequest(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`API GET request failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('GET request error:', error);
        throw error;
    }
}

/**
 * Perform a POST request to the API.
 * @param {string} endpoint - The API endpoint.
 * @param {Object} data - The payload to send.
 * @returns {Promise<any>} - The response data.
 */
export async function postRequest(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API POST request failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('POST request error:', error);
        throw error;
    }
}

/**
 * Fetch tracks from the API.
 * @returns {Promise<Array>} - A list of tracks.
 */
export async function fetchTracks() {
    return await getRequest('/tracks');
}

/**
 * Fetch user details from the API.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object>} - User details.
 */
export async function fetchUserDetails(userId) {
    return await getRequest(`/users/${userId}`);
}

/**
 * Update user data.
 * @param {string} userId - The user ID.
 * @param {Object} userData - The data to update.
 * @returns {Promise<Object>} - Updated user data.
 */
export async function updateUserDetails(userId, userData) {
    return await postRequest(`/users/${userId}`, userData);
}
