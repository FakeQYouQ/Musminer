// app/components/Wallet.js

/**
 * Wallet Component
 * Displays user token balance and transaction history.
 */
const Wallet = {
    /**
     * Render the wallet UI into the given container element.
     * @param {HTMLElement} container - The container to render the wallet into.
     * @param {Object} walletData - The wallet data containing balance and transactions.
     */
    render(container, walletData = { balance: 0, transactions: [] }) {
        // Clear existing content
        container.innerHTML = '';

        // Create wallet container
        const walletContainer = document.createElement('div');
        walletContainer.className = 'wallet';

        // Balance display
        const balanceDisplay = document.createElement('h3');
        balanceDisplay.textContent = `Your Balance: ${walletData.balance} Tokens`;

        // Transactions list
        const transactionsList = document.createElement('div');
        transactionsList.className = 'transactions';

        const transactionsTitle = document.createElement('h4');
        transactionsTitle.textContent = 'Transaction History';

        const transactionItems = walletData.transactions.map((transaction) => {
            const item = document.createElement('p');
            item.textContent = `${transaction.date}: ${transaction.amount} Tokens (${transaction.type})`;
            return item;
        });

        transactionsList.appendChild(transactionsTitle);
        transactionItems.forEach((item) => transactionsList.appendChild(item));

        // Append elements to wallet container
        walletContainer.appendChild(balanceDisplay);
        walletContainer.appendChild(transactionsList);

        // Append wallet container to the given container
        container.appendChild(walletContainer);
    },
};

export default Wallet;
