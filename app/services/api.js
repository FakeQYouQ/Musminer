/**
 * Transfer tokens to another user.
 * @param {string} userId - The user ID to transfer tokens to.
 * @param {number} amount - The amount of tokens to transfer.
 * @returns {Promise<Object>} - The response data.
 */
export async function transferTokens(userId, amount) {
    const data = { amount };
    return await postRequest(`/users/${userId}/transfer`, data);
}

/**
 * Withdraw tokens to a different account.
 * @param {number} amount - The amount of tokens to withdraw.
 * @returns {Promise<Object>} - The response data.
 */
export async function withdrawTokens(amount) {
    const data = { amount };
    return await postRequest('/users/withdraw', data);
}

/**
 * Fetch user's wallet balance.
 * @param {string} userId - The user ID to fetch the balance for.
 * @returns {Promise<Object>} - Wallet balance data.
 */
export async function fetchWalletBalance(userId) {
    return await getRequest(`/users/${userId}/balance`);
}
