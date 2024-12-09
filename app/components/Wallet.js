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
     * @param {Function} onTransfer - Callback function to handle token transfers.
     * @param {Function} onWithdraw - Callback function to handle withdrawal.
     */
    render(container, walletData = { balance: 0, transactions: [] }, onTransfer, onWithdraw) {
        // Clear existing content
        container.innerHTML = '';

        // Create wallet container
        const walletContainer = document.createElement('div');
        walletContainer.className = 'wallet';

        // Balance display
        const balanceDisplay = document.createElement('h3');
        balanceDisplay.textContent = `Your Balance: ${walletData.balance} Tokens`;

        // Transaction actions
        const transferButton = document.createElement('button');
        transferButton.textContent = 'Transfer Tokens';
        transferButton.onclick = () => {
            const amount = prompt("Enter the amount to transfer:");
            onTransfer(amount);
        };

        const withdrawButton = document.createElement('button');
        withdrawButton.textContent = 'Withdraw';
        withdrawButton.onclick = () => {
            const amount = prompt("Enter the amount to withdraw:");
            onWithdraw(amount);
        };

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
        walletContainer.appendChild(transferButton);
        walletContainer.appendChild(withdrawButton);
        walletContainer.appendChild(transactionsList);

        // Append wallet container to the given container
        container.appendChild(walletContainer);
    },
};

export default Wallet;
