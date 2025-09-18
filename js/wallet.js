// Wallet Page JavaScript
class WalletManager {
    constructor() {
        this.balances = {
            spot: [
                { symbol: 'BTC', name: 'Bitcoin', amount: 0.5234, usdValue: 22634.56, icon: '₿', color: '#F7931A' },
                { symbol: 'ETH', name: 'Ethereum', amount: 2.3456, usdValue: 5240.89, icon: 'Ξ', color: '#627EEA' },
                { symbol: 'USDT', name: 'Tether', amount: 10000.00, usdValue: 10000.00, icon: '₮', color: '#26A17B' },
                { symbol: 'BNB', name: 'Binance Coin', amount: 25.678, usdValue: 8021.34, icon: 'BNB', color: '#F0B90B' },
                { symbol: 'ADA', name: 'Cardano', amount: 5000.00, usdValue: 2283.50, icon: 'ADA', color: '#0033AD' }
            ],
            margin: [
                { symbol: 'USDT', name: 'Tether', amount: 2000.00, usdValue: 2000.00, icon: '₮', color: '#26A17B' },
                { symbol: 'BTC', name: 'Bitcoin', amount: 0.1, usdValue: 4325.68, icon: '₿', color: '#F7931A' }
            ],
            futures: [
                { symbol: 'USDT', name: 'Tether', amount: 5000.00, usdValue: 5000.00, icon: '₮', color: '#26A17B' }
            ]
        };

        this.transactions = [
            { type: 'deposit', asset: 'BTC', amount: 0.1, usdValue: 4325.68, time: '2024-01-15 10:30', status: 'completed' },
            { type: 'withdrawal', asset: 'ETH', amount: 0.5, usdValue: 1117.28, time: '2024-01-14 15:45', status: 'completed' },
            { type: 'transfer', asset: 'USDT', amount: 1000.00, usdValue: 1000.00, time: '2024-01-13 09:20', status: 'completed' },
            { type: 'deposit', asset: 'USDT', amount: 5000.00, usdValue: 5000.00, time: '2024-01-12 14:15', status: 'completed' },
            { type: 'transfer', asset: 'BTC', amount: 0.0234, usdValue: 1012.05, time: '2024-01-11 16:30', status: 'completed' }
        ];

        this.currentTab = 'overview';
        this.currentView = 'list';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderOverview();
        this.renderTransactions();
        this.renderPortfolioChart();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Wallet tabs
        document.querySelectorAll('.wallet-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Form submissions
        document.getElementById('withdrawForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleWithdrawal();
        });

        document.getElementById('transferForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTransfer();
        });

        document.getElementById('buyCryptoForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBuyCrypto();
        });

        // Buy amount change
        document.getElementById('buyAmount')?.addEventListener('input', (e) => {
            this.updateBuySummary(e.target.value);
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.wallet-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Render specific tab content
        switch (tabName) {
            case 'overview':
                this.renderOverview();
                break;
            case 'spot':
                this.renderSpotBalances();
                break;
            case 'margin':
                this.renderMarginBalances();
                break;
            case 'futures':
                this.renderFuturesBalances();
                break;
        }
    }

    renderOverview() {
        this.renderAssets();
        this.updateTotalBalance();
    }

    renderAssets() {
        const assetsList = document.getElementById('assetsList');
        if (!assetsList) return;

        const allAssets = [...this.balances.spot, ...this.balances.margin, ...this.balances.futures];

        // Group by symbol and sum amounts
        const groupedAssets = {};
        allAssets.forEach(asset => {
            if (groupedAssets[asset.symbol]) {
                groupedAssets[asset.symbol].amount += asset.amount;
                groupedAssets[asset.symbol].usdValue += asset.usdValue;
            } else {
                groupedAssets[asset.symbol] = { ...asset };
            }
        });

        const assetsArray = Object.values(groupedAssets).sort((a, b) => b.usdValue - a.usdValue);

        assetsList.innerHTML = assetsArray.map(asset => `
            <div class="asset-item" onclick="walletManager.showAssetDetail('${asset.symbol}')">
                <div class="asset-info">
                    <div class="asset-icon" style="background: ${asset.color}; color: white;">
                        ${asset.icon}
                    </div>
                    <div class="asset-details">
                        <h4>${asset.name}</h4>
                        <div class="asset-symbol">${asset.symbol}</div>
                    </div>
                </div>
                <div class="asset-balance">
                    <div class="asset-amount">${asset.amount.toFixed(4)} ${asset.symbol}</div>
                    <div class="asset-value">$${asset.usdValue.toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }

    renderTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        if (!transactionsList) return;

        transactionsList.innerHTML = this.transactions.slice(0, 5).map(transaction => {
            const iconClass = this.getTransactionIcon(transaction.type);
            const sign = transaction.type === 'deposit' ? '+' : '-';

            return `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-icon ${transaction.type}">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div class="transaction-details">
                            <h4>${this.formatTransactionType(transaction.type)}</h4>
                            <div class="transaction-time">${transaction.time}</div>
                        </div>
                    </div>
                    <div class="transaction-amount">
                        <div class="transaction-value ${transaction.type === 'deposit' ? 'positive' : 'negative'}">
                            ${sign}${transaction.amount} ${transaction.asset}
                        </div>
                        <div class="transaction-status">${transaction.status}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPortfolioChart() {
        const canvas = document.getElementById('portfolioChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const assets = this.calculatePortfolioDistribution();

        this.drawPieChart(ctx, assets);
    }

    renderSpotBalances() {
        this.renderBalances('spotBalances', this.balances.spot);
    }

    renderMarginBalances() {
        this.renderBalances('marginBalances', this.balances.margin);
    }

    renderFuturesBalances() {
        this.renderBalances('futuresBalances', this.balances.futures);
    }

    renderBalances(containerId, balances) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = balances.map(balance => `
            <div class="balance-item">
                <div class="balance-item-info">
                    <div class="balance-item-icon" style="background: ${balance.color}; color: white;">
                        ${balance.icon}
                    </div>
                    <div class="balance-item-details">
                        <h4>${balance.name}</h4>
                        <div class="balance-item-symbol">${balance.symbol}</div>
                    </div>
                </div>
                <div class="balance-item-amount">
                    <div class="balance-item-value">${balance.amount.toFixed(4)} ${balance.symbol}</div>
                    <div class="balance-item-usd">$${balance.usdValue.toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }

    calculatePortfolioDistribution() {
        const allAssets = [...this.balances.spot, ...this.balances.margin, ...this.balances.futures];
        const totalValue = allAssets.reduce((sum, asset) => sum + asset.usdValue, 0);

        return allAssets.map(asset => ({
            label: asset.symbol,
            value: asset.usdValue,
            percentage: (asset.usdValue / totalValue * 100),
            color: asset.color
        }));
    }

    drawPieChart(ctx, data) {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        let currentAngle = -Math.PI / 2;
        const total = data.reduce((sum, item) => sum + item.value, 0);

        // Clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw pie slices
        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 30);

            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary');
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${item.symbol}`, labelX, labelY);
            ctx.fillText(`${item.percentage.toFixed(1)}%`, labelX, labelY + 15);

            currentAngle += sliceAngle;
        });
    }

    updateTotalBalance() {
        const allAssets = [...this.balances.spot, ...this.balances.margin, ...this.balances.futures];
        const totalBalance = allAssets.reduce((sum, asset) => sum + asset.usdValue, 0);

        const totalBalanceElement = document.getElementById('totalBalance');
        if (totalBalanceElement) {
            totalBalanceElement.textContent = `$${totalBalance.toLocaleString()}`;
        }

        // Update balance change (simulate)
        const balanceChange = (Math.random() - 0.5) * 10; // -5% to +5%
        const balanceChangeElement = document.getElementById('balanceChange');
        if (balanceChangeElement) {
            balanceChangeElement.textContent = `${balanceChange >= 0 ? '+' : ''}${balanceChange.toFixed(2)}%`;
            balanceChangeElement.className = `balance-change ${balanceChange >= 0 ? 'positive' : 'negative'}`;
        }
    }

    handleWithdrawal() {
        const asset = document.getElementById('withdrawAsset').value;
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const address = document.getElementById('withdrawAddress').value;
        const network = document.getElementById('withdrawNetwork').value;

        // Simulate withdrawal process
        alert(`Withdrawal initiated: ${amount} ${asset} to ${address} on ${network}`);
        closeModal('withdrawModal');

        // Add to transaction history
        this.addTransaction('withdrawal', asset, amount, amount * this.getAssetPrice(asset));
    }

    handleTransfer() {
        const from = document.getElementById('transferFrom').value;
        const to = document.getElementById('transferTo').value;
        const asset = document.getElementById('transferAsset').value;
        const amount = parseFloat(document.getElementById('transferAmount').value);

        if (from === to) {
            alert('Cannot transfer to the same wallet');
            return;
        }

        // Simulate transfer process
        alert(`Transfer initiated: ${amount} ${asset} from ${from} to ${to}`);
        closeModal('transferModal');

        // Add to transaction history
        this.addTransaction('transfer', asset, amount, amount * this.getAssetPrice(asset));
    }

    handleBuyCrypto() {
        const crypto = document.getElementById('buyCrypto').value;
        const amount = parseFloat(document.getElementById('buyAmount').value);
        const paymentMethod = document.getElementById('paymentMethod').value;

        // Simulate purchase process
        alert(`Purchase initiated: ${crypto} for $${amount} via ${paymentMethod}`);
        closeModal('buyCryptoModal');

        // Add to spot balance
        const purchasedAmount = amount / this.getAssetPrice(crypto);
        this.addToBalance('spot', crypto, purchasedAmount);

        // Add to transaction history
        this.addTransaction('deposit', crypto, purchasedAmount, amount);
    }

    updateBuySummary(amount) {
        const rate = this.getAssetPrice(document.getElementById('buyCrypto').value);
        const fee = 5.00; // Fixed fee
        const total = amount + fee;

        document.getElementById('buyRate').textContent = `$${rate.toLocaleString()}`;
        document.getElementById('buyFee').textContent = `$${fee.toFixed(2)}`;
        document.getElementById('buyTotal').textContent = `$${total.toFixed(2)}`;
    }

    getAssetPrice(symbol) {
        const prices = {
            'BTC': 43256.78,
            'ETH': 2234.56,
            'BNB': 312.45,
            'USDT': 1.00,
            'ADA': 0.4567
        };
        return prices[symbol] || 1.00;
    }

    addToBalance(walletType, symbol, amount) {
        const balance = this.balances[walletType].find(b => b.symbol === symbol);
        if (balance) {
            balance.amount += amount;
            balance.usdValue += amount * this.getAssetPrice(symbol);
        } else {
            // Add new balance entry
            const assetInfo = {
                'BTC': { name: 'Bitcoin', icon: '₿', color: '#F7931A' },
                'ETH': { name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
                'BNB': { name: 'Binance Coin', icon: 'BNB', color: '#F0B90B' },
                'USDT': { name: 'Tether', icon: '₮', color: '#26A17B' },
                'ADA': { name: 'Cardano', icon: 'ADA', color: '#0033AD' }
            };

            this.balances[walletType].push({
                symbol,
                name: assetInfo[symbol]?.name || symbol,
                amount,
                usdValue: amount * this.getAssetPrice(symbol),
                icon: assetInfo[symbol]?.icon || symbol,
                color: assetInfo[symbol]?.color || '#627EEA'
            });
        }

        this.renderOverview();
    }

    addTransaction(type, asset, amount, usdValue) {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        this.transactions.unshift({
            type,
            asset,
            amount,
            usdValue,
            time: timeString,
            status: 'completed'
        });

        // Keep only last 50 transactions
        if (this.transactions.length > 50) {
            this.transactions = this.transactions.slice(0, 50);
        }

        this.renderTransactions();
    }

    showAssetDetail(symbol) {
        const allAssets = [...this.balances.spot, ...this.balances.margin, ...this.balances.futures];
        const asset = allAssets.find(a => a.symbol === symbol);

        if (asset) {
            alert(`${asset.name} (${asset.symbol})\nBalance: ${asset.amount.toFixed(4)}\nValue: $${asset.usdValue.toLocaleString()}`);
        }
    }

    getTransactionIcon(type) {
        const icons = {
            'deposit': 'fa-arrow-down',
            'withdrawal': 'fa-arrow-up',
            'transfer': 'fa-exchange-alt'
        };
        return icons[type] || 'fa-circle';
    }

    formatTransactionType(type) {
        const types = {
            'deposit': 'Deposit',
            'withdrawal': 'Withdrawal',
            'transfer': 'Transfer'
        };
        return types[type] || type;
    }

    startRealTimeUpdates() {
        // Update balances every 10 seconds
        setInterval(() => {
            this.updateBalances();
            this.updateTotalBalance();
        }, 10000);
    }

    updateBalances() {
        // Simulate small price changes
        Object.values(this.balances).forEach(walletType => {
            walletType.forEach(asset => {
                if (asset.symbol !== 'USDT') {
                    const changePercent = (Math.random() - 0.5) * 0.1; // -0.05% to +0.05%
                    asset.usdValue *= (1 + changePercent / 100);
                }
            });
        });

        // Re-render current tab
        this.switchTab(this.currentTab);
    }
}

// Initialize wallet manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.walletManager = new WalletManager();
});