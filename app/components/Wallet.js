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
     * @param {Function} onTransaction - Callback function to handle token transactions.
     */
    render(container, walletData = { balance: 0, transactions: [], withdrawEnabled: false }, onTransaction) {
        // Clear existing content
        container.innerHTML = '';

        // Create wallet container
        const walletContainer = document.createElement('div');
        walletContainer.className = 'wallet';

        // Balance display
        const balanceDisplay = document.createElement('h3');
        balanceDisplay.textContent = `Your Balance: ${walletData.balance.toFixed(2)} Tokens`;

        // Transfer button
        const transferButton = document.createElement('button');
        transferButton.textContent = 'Transfer Tokens';
        transferButton.onclick = () => {
            const amount = parseFloat(prompt('Enter the amount to transfer:'));
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid positive number.');
                return;
            }
            onTransaction('transfer', amount, 'Token transfer');
        };

        // Withdraw button
        const withdrawButton = document.createElement('button');
        withdrawButton.textContent = walletData.withdrawEnabled
            ? 'Withdraw Tokens'
            : 'Withdraw (Unavailable)';
        withdrawButton.disabled = !walletData.withdrawEnabled;
        withdrawButton.title = walletData.withdrawEnabled
            ? 'Withdraw your tokens to your wallet.'
            : 'Withdrawals will be available after listing.';
        withdrawButton.onclick = () => {
            const amount = parseFloat(prompt('Enter the amount to withdraw:'));
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid positive number.');
                return;
            }
            onTransaction('withdraw', amount, 'Token withdrawal');
        };

        // Transactions list
        const transactionsList = document.createElement('div');
        transactionsList.className = 'transactions';

        const transactionsTitle = document.createElement('h4');
        transactionsTitle.textContent = 'Transaction History';

        if (walletData.transactions.length === 0) {
            const noTransactionsMessage = document.createElement('p');
            noTransactionsMessage.textContent = 'No transactions yet.';
            transactionsList.appendChild(noTransactionsMessage);
        } else {
            walletData.transactions.forEach((transaction) => {
                const item = document.createElement('p');
                item.textContent = `${new Date(transaction.createdAt).toLocaleString()}: ${transaction.type} ${transaction.amount.toFixed(2)} Tokens (${transaction.description || 'No description'})`;
                transactionsList.appendChild(item);
            });
        }

        // Append elements to wallet container
        walletContainer.appendChild(balanceDisplay);
        walletContainer.appendChild(transferButton);
        walletContainer.appendChild(withdrawButton);
        walletContainer.appendChild(transactionsTitle);
        walletContainer.appendChild(transactionsList);

        // Append wallet container to the given container
        container.appendChild(walletContainer);
    },
};

export default Wallet;
