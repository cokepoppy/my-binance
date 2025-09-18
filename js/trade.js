// Trading Interface for Binance Clone

class TradingEngine {
    constructor() {
        this.currentPair = 'BTC/USDT';
        this.currentPrice = 43256.78;
        this.timeframe = '1m';
        this.orderType = 'limit';
        this.openOrders = [];
        this.tradeHistory = [];
        this.orderBook = {
            bids: [],
            asks: []
        };
        this.orderBookDepth = 10;
        this.userBalance = {
            USDT: 1234.56,
            BTC: 0.0234
        };
        this.feeRate = 0.001; // 0.1% fee

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeChart();
        this.initializeOrderBook();
        this.initializeTradeHistory();
        this.startRealTimeUpdates();
        this.loadAuthModals();
        // Restore last timeframe preference if available
        try {
            const savedTf = localStorage.getItem('trade_timeframe');
            if (savedTf && document.querySelector(`.timeframe-btn[data-timeframe="${savedTf}"]`)) {
                this.switchTimeframe(savedTf);
            }
        } catch (e) {}
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Timeframe switching
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTimeframe(e.target.dataset.timeframe);
            });
        });

        // Order book depth
        document.querySelectorAll('.depth-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeOrderBookDepth(parseInt(e.target.dataset.depth));
            });
        });

        // Percentage buttons
        document.querySelectorAll('.percent-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyPercentage(parseInt(e.target.dataset.percent));
            });
        });

        // Trading forms
        this.setupTradingForms();

        // History filters
        document.querySelectorAll('.history-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterTradeHistory(e.target.textContent);
            });
        });

        // Cancel all orders
        const cancelAllBtn = document.querySelector('.cancel-all-btn');
        if (cancelAllBtn) {
            cancelAllBtn.addEventListener('click', () => {
                this.cancelAllOrders();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Order book click-to-fill price (limit order)
        const asksList = document.getElementById('asksList');
        const bidsList = document.getElementById('bidsList');
        const onRowClick = (ev) => {
            const row = ev.target.closest('.order-row');
            const priceEl = row?.querySelector('.price');
            if (!priceEl) return;
            const price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
            const priceInput = document.getElementById('limitPrice');
            if (priceInput && !Number.isNaN(price)) {
                priceInput.value = price.toFixed(2);
                this.calculateTotal('limit');
            }
        };
        if (asksList) asksList.addEventListener('click', onRowClick);
        if (bidsList) bidsList.addEventListener('click', onRowClick);
    }

    setupTradingForms() {
        // Limit order form
        const limitForm = document.getElementById('limitOrderForm');
        if (limitForm) {
            limitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitOrder('limit', 'buy');
            });

            // Real-time calculation
            const priceInput = document.getElementById('limitPrice');
            const amountInput = document.getElementById('limitAmount');
            const totalInput = document.getElementById('limitTotal');

            if (priceInput && amountInput && totalInput) {
                priceInput.addEventListener('input', () => this.calculateTotal('limit'));
                amountInput.addEventListener('input', () => this.calculateTotal('limit'));
            }
        }

        // Market order form
        const marketForm = document.getElementById('marketOrderForm');
        if (marketForm) {
            marketForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitOrder('market', 'buy');
            });

            const amountInput = document.getElementById('marketAmount');
            const totalInput = document.getElementById('marketTotal');

            if (amountInput && totalInput) {
                amountInput.addEventListener('input', () => this.calculateMarketTotal());
                totalInput.addEventListener('input', () => this.calculateMarketAmount());
            }
        }

        // Stop-limit order form
        const stopLimitForm = document.getElementById('stopLimitOrderForm');
        if (stopLimitForm) {
            stopLimitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitOrder('stop-limit', 'buy');
            });
        }

        // Buy/Sell buttons (differentiate within form)
        document.querySelectorAll('.order-buttons button[type="submit"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const form = btn.closest('form');
                const formType = form.id.replace('OrderForm', '').replace('Form', '');
                const orderSide = btn.classList.contains('btn-buy') ? 'buy' : 'sell';
                this.submitOrder(formType, orderSide);
            });
        });
    }

    // Tab Management
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });

        this.orderType = tabName;
        this.updateFees();
    }

    // Timeframe Management
    switchTimeframe(timeframe) {
        this.timeframe = timeframe;

        // Update timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.timeframe === timeframe) {
                btn.classList.add('active');
            }
        });

        // Save preference
        try { localStorage.setItem('trade_timeframe', timeframe); } catch (e) {}

        // Update timeframe label
        const tfLabel = document.querySelector('.chart-timeframe');
        if (tfLabel) tfLabel.textContent = timeframe.toUpperCase();

        // Update fallback canvas chart
        this.updateChart();

        // Update TradingView resolution if available
        const tv = window.tvWidget;
        if (tv && window.tvWidgetReady && typeof tv.activeChart === 'function') {
            const map = {
                '1m': '1', '5m': '5', '15m': '15', '1h': '60', '4h': '240', '1d': 'D'
            };
            const res = map[timeframe] || '15';
            try { tv.activeChart().setResolution(res); } catch (e) {}
        }

        this.showNotification(`Switched to ${timeframe} timeframe`, 'info');
    }

    // Chart Management
    initializeChart() {
        const canvas = document.getElementById('priceChart');
        const loading = document.getElementById('chartLoading');

        if (canvas) {
            // Hide loading after delay
            setTimeout(() => {
                if (loading) loading.style.display = 'none';
                this.drawChart(canvas);
            }, 1000);
        }
    }

    drawChart(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Generate sample price data
        const dataPoints = 50;
        const priceData = [];
        let basePrice = this.currentPrice;

        for (let i = 0; i < dataPoints; i++) {
            basePrice += (Math.random() - 0.5) * 100;
            priceData.push({
                x: (i / (dataPoints - 1)) * width,
                y: height - ((basePrice - (this.currentPrice - 500)) / 1000) * height
            });
        }

        // Draw price line
        ctx.strokeStyle = '#0ECB81';
        ctx.lineWidth = 2;
        ctx.beginPath();

        priceData.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });

        ctx.stroke();

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = (i / 5) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Store price data for real-time updates
        this.priceData = priceData;
    }

    updateChart() {
        const canvas = document.getElementById('priceChart');
        if (canvas) {
            this.drawChart(canvas);
        }
    }

    // Order Book Management
    initializeOrderBook() {
        this.generateOrderBook();
        this.renderOrderBook();
    }

    generateOrderBook() {
        const spread = 1.5;
        const basePrice = this.currentPrice;

        // Generate asks (sell orders)
        this.orderBook.asks = [];
        for (let i = 1; i <= 15; i++) {
            const price = basePrice + (spread * i) + (Math.random() - 0.5) * 0.5;
            const amount = Math.random() * 0.5 + 0.1;
            this.orderBook.asks.push({
                price: price,
                amount: amount,
                total: price * amount
            });
        }

        // Generate bids (buy orders)
        this.orderBook.bids = [];
        for (let i = 1; i <= 15; i++) {
            const price = basePrice - (spread * i) + (Math.random() - 0.5) * 0.5;
            const amount = Math.random() * 0.5 + 0.1;
            this.orderBook.bids.push({
                price: price,
                amount: amount,
                total: price * amount
            });
        }

        // Sort orders
        this.orderBook.asks.sort((a, b) => a.price - b.price);
        this.orderBook.bids.sort((a, b) => b.price - a.price);
    }

    renderOrderBook() {
        const asksList = document.getElementById('asksList');
        const bidsList = document.getElementById('bidsList');

        if (asksList) {
            asksList.innerHTML = this.orderBook.asks.slice(0, this.orderBookDepth).map(order => `
                <div class="order-row">
                    <span class="price sell">${order.price.toFixed(2)}</span>
                    <span class="amount">${order.amount.toFixed(4)}</span>
                    <span class="total">${order.total.toFixed(2)}</span>
                </div>
            `).join('');
        }

        if (bidsList) {
            bidsList.innerHTML = this.orderBook.bids.slice(0, this.orderBookDepth).map(order => `
                <div class="order-row">
                    <span class="price buy">${order.price.toFixed(2)}</span>
                    <span class="amount">${order.amount.toFixed(4)}</span>
                    <span class="total">${order.total.toFixed(2)}</span>
                </div>
            `).join('');
        }
    }

    changeOrderBookDepth(depth) {
        // Update depth buttons
        document.querySelectorAll('.depth-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.depth) === depth) {
                btn.classList.add('active');
            }
        });

        // Apply new depth and re-render
        this.orderBookDepth = depth;
        this.renderOrderBook();
        this.showNotification(`Order book depth: ${depth} rows`, 'info');
    }

    // Trading Form Logic
    calculateTotal(orderType) {
        const priceInput = document.getElementById(`${orderType}Price`);
        const amountInput = document.getElementById(`${orderType}Amount`);
        const totalInput = document.getElementById(`${orderType}Total`);

        if (priceInput && amountInput && totalInput) {
            const price = parseFloat(priceInput.value) || 0;
            const amount = parseFloat(amountInput.value) || 0;
            const total = price * amount;

            totalInput.value = total.toFixed(2);
            this.updateFees();
        }
    }

    calculateMarketTotal() {
        const amountInput = document.getElementById('marketAmount');
        const totalInput = document.getElementById('marketTotal');

        if (amountInput && totalInput) {
            const amount = parseFloat(amountInput.value) || 0;
            const total = amount * this.currentPrice;

            totalInput.value = total.toFixed(2);
            this.updateFees();
        }
    }

    calculateMarketAmount() {
        const amountInput = document.getElementById('marketAmount');
        const totalInput = document.getElementById('marketTotal');

        if (amountInput && totalInput) {
            const total = parseFloat(totalInput.value) || 0;
            const amount = total / this.currentPrice;

            amountInput.value = amount.toFixed(8);
            this.updateFees();
        }
    }

    applyPercentage(percentage) {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return;

        const tabId = activeTab.id;
        let amountInput, totalInput;

        if (tabId === 'limit-tab') {
            amountInput = document.getElementById('limitAmount');
            totalInput = document.getElementById('limitTotal');
        } else if (tabId === 'market-tab') {
            if (document.getElementById('marketAmount').value) {
                amountInput = document.getElementById('marketAmount');
                totalInput = document.getElementById('marketTotal');
            } else {
                totalInput = document.getElementById('marketTotal');
                amountInput = document.getElementById('marketAmount');
            }
        } else if (tabId === 'stop-limit-tab') {
            amountInput = document.getElementById('stopLimitAmount');
            // Stop-limit doesn't have auto-calculation
            return;
        }

        if (amountInput && totalInput) {
            const maxUSDT = this.userBalance.USDT;
            const amountPercentage = maxUSDT * (percentage / 100);

            if (tabId === 'limit-tab') {
                const price = parseFloat(document.getElementById('limitPrice').value) || this.currentPrice;
                const amount = amountPercentage / price;
                amountInput.value = amount.toFixed(8);
                totalInput.value = amountPercentage.toFixed(2);
            } else if (tabId === 'market-tab') {
                totalInput.value = amountPercentage.toFixed(2);
                this.calculateMarketAmount();
            }

            this.updateFees();
        }
    }

    updateFees() {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return;

        const tabId = activeTab.id;
        let feeElement;

        if (tabId === 'limit-tab') {
            feeElement = document.getElementById('limitFee');
        } else if (tabId === 'market-tab') {
            feeElement = document.getElementById('marketFee');
        } else if (tabId === 'stop-limit-tab') {
            feeElement = document.getElementById('stopLimitFee');
        }

        if (feeElement) {
            // Calculate fee based on order total
            let total = 0;

            if (tabId === 'limit-tab') {
                total = parseFloat(document.getElementById('limitTotal').value) || 0;
            } else if (tabId === 'market-tab') {
                total = parseFloat(document.getElementById('marketTotal').value) || 0;
            } else if (tabId === 'stop-limit-tab') {
                const price = parseFloat(document.getElementById('stopLimitPrice').value) || 0;
                const amount = parseFloat(document.getElementById('stopLimitAmount').value) || 0;
                total = price * amount;
            }

            const fee = total * this.feeRate;
            feeElement.textContent = `$${fee.toFixed(2)}`;
        }
    }

    // Order Management
    submitOrder(orderType, orderSide) {
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            this.showNotification('Please log in to place orders', 'error');
            window.authManager.showLoginModal();
            return;
        }

        let orderData = {
            type: orderType,
            side: orderSide,
            symbol: this.currentPair,
            timestamp: Date.now()
        };

        // Get order data based on type
        if (orderType === 'limit') {
            orderData.price = parseFloat(document.getElementById('limitPrice').value);
            orderData.amount = parseFloat(document.getElementById('limitAmount').value);
        } else if (orderType === 'market') {
            orderData.amount = parseFloat(document.getElementById('marketAmount').value);
            orderData.total = parseFloat(document.getElementById('marketTotal').value);
        } else if (orderType === 'stop-limit') {
            orderData.stopPrice = parseFloat(document.getElementById('stopPrice').value);
            orderData.price = parseFloat(document.getElementById('stopLimitPrice').value);
            orderData.amount = parseFloat(document.getElementById('stopLimitAmount').value);
        }

        // Validate order
        if (!this.validateOrder(orderData)) {
            return;
        }

        // Check balance
        if (!this.checkBalance(orderData)) {
            return;
        }

        // Place order
        this.placeOrder(orderData);
    }

    validateOrder(orderData) {
        if (orderData.type === 'limit' && (!orderData.price || orderData.price <= 0)) {
            this.showNotification('Please enter a valid price', 'error');
            return false;
        }

        if (!orderData.amount || orderData.amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return false;
        }

        if (orderData.type === 'stop-limit' && (!orderData.stopPrice || orderData.stopPrice <= 0)) {
            this.showNotification('Please enter a valid stop price', 'error');
            return false;
        }

        return true;
    }

    checkBalance(orderData) {
        const requiredBalance = orderData.type === 'market' ?
            orderData.total :
            orderData.price * orderData.amount;

        const currency = orderData.side === 'buy' ? 'USDT' : 'BTC';
        const availableBalance = this.userBalance[currency];

        if (availableBalance < requiredBalance) {
            this.showNotification(`Insufficient ${currency} balance`, 'error');
            return false;
        }

        return true;
    }

    placeOrder(orderData) {
        // Generate order ID
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const order = {
            ...orderData,
            id: orderId,
            status: 'open',
            filled: 0,
            remaining: orderData.amount,
            createdAt: new Date().toISOString()
        };

        // Add to open orders
        this.openOrders.push(order);

        // Update UI
        this.updateOpenOrders();
        this.showNotification(`${orderData.side === 'buy' ? 'Buy' : 'Sell'} order placed successfully`, 'success');

        // Clear form
        this.clearActiveForm();

        // For market orders, execute immediately
        if (orderData.type === 'market') {
            setTimeout(() => {
                this.executeOrder(order);
            }, 1000);
        }
    }

    executeOrder(order) {
        // Simulate order execution
        order.status = 'filled';
        order.filled = order.amount;
        order.remaining = 0;
        order.executedAt = new Date().toISOString();

        // Remove from open orders
        this.openOrders = this.openOrders.filter(o => o.id !== order.id);

        // Add to trade history
        this.tradeHistory.unshift({
            price: order.type === 'market' ? this.currentPrice : order.price,
            amount: order.amount,
            total: order.type === 'market' ? order.total : (order.price * order.amount),
            side: order.side,
            timestamp: order.executedAt
        });

        // Update user balance
        this.updateUserBalance(order);

        // Update UI
        this.updateOpenOrders();
        this.updateTradeHistory();
        this.showNotification('Order executed successfully', 'success');
    }

    updateUserBalance(order) {
        const totalValue = order.type === 'market' ? order.total : (order.price * order.amount);
        const fee = totalValue * this.feeRate;

        if (order.side === 'buy') {
            this.userBalance.USDT -= (totalValue + fee);
            this.userBalance.BTC += order.amount;
        } else {
            this.userBalance.USDT += (totalValue - fee);
            this.userBalance.BTC -= order.amount;
        }

        this.updateBalanceDisplay();
    }

    updateBalanceDisplay() {
        // Update balance displays
        const balanceElements = [
            'availableUSDT',
            'availableUSDT2',
            'availableUSDT3'
        ];

        balanceElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `${this.userBalance.USDT.toFixed(2)} USDT`;
            }
        });
    }

    clearActiveForm() {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return;

        const form = activeTab.querySelector('form');
        if (form) {
            form.reset();
            this.updateFees();
        }
    }

    updateOpenOrders() {
        const ordersList = document.getElementById('openOrdersList');
        if (!ordersList) return;

        if (this.openOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No open orders</p>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = this.openOrders.map(order => `
            <div class="order-item">
                <div class="order-details">
                    <div class="order-type ${order.side}">${order.side.toUpperCase()} ${order.type.toUpperCase()}</div>
                    <div class="order-info">
                        <span>${order.amount.toFixed(8)} ${order.symbol.split('/')[0]}</span>
                        <span>@ ${order.type === 'market' ? 'Market' : order.price.toFixed(2) + ' USDT'}</span>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="cancel-btn" onclick="tradingEngine.cancelOrder('${order.id}')">Cancel</button>
                </div>
            </div>
        `).join('');
    }

    cancelOrder(orderId) {
        const orderIndex = this.openOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            const order = this.openOrders[orderIndex];
            this.openOrders.splice(orderIndex, 1);
            this.updateOpenOrders();
            this.showNotification('Order cancelled', 'info');
        }
    }

    cancelAllOrders() {
        if (this.openOrders.length === 0) {
            this.showNotification('No orders to cancel', 'info');
            return;
        }

        if (confirm(`Are you sure you want to cancel all ${this.openOrders.length} orders?`)) {
            this.openOrders = [];
            this.updateOpenOrders();
            this.showNotification('All orders cancelled', 'info');
        }
    }

    // Trade History
    initializeTradeHistory() {
        this.updateTradeHistory();
    }

    updateTradeHistory() {
        const tbody = document.getElementById('tradeHistoryBody');
        if (!tbody) return;

        const recentTrades = this.tradeHistory.slice(0, 10);

        tbody.innerHTML = recentTrades.map(trade => `
            <tr class="${trade.side}">
                <td class="price">${trade.price.toFixed(2)}</td>
                <td class="amount">${trade.amount.toFixed(4)}</td>
                <td class="total">${trade.total.toFixed(2)}</td>
                <td class="time">${new Date(trade.timestamp).toLocaleTimeString()}</td>
            </tr>
        `).join('');
    }

    filterTradeHistory(filter) {
        // Update filter buttons
        document.querySelectorAll('.history-filters .filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === filter) {
                btn.classList.add('active');
            }
        });

        // Filter trade history
        const tbody = document.getElementById('tradeHistoryBody');
        if (!tbody) return;

        let filteredTrades = this.tradeHistory;

        if (filter !== 'All') {
            const side = filter.toLowerCase();
            filteredTrades = this.tradeHistory.filter(trade => trade.side === side);
        }

        const recentTrades = filteredTrades.slice(0, 10);

        tbody.innerHTML = recentTrades.map(trade => `
            <tr class="${trade.side}">
                <td class="price">${trade.price.toFixed(2)}</td>
                <td class="amount">${trade.amount.toFixed(4)}</td>
                <td class="total">${trade.total.toFixed(2)}</td>
                <td class="time">${new Date(trade.timestamp).toLocaleTimeString()}</td>
            </tr>
        `).join('');
    }

    // Real-time Updates
    startRealTimeUpdates() {
        // Update price every 2 seconds
        setInterval(() => {
            this.updatePrice();
        }, 2000);

        // Update order book every 3 seconds
        setInterval(() => {
            this.updateOrderBook();
        }, 3000);

        // Update trade history every 5 seconds
        setInterval(() => {
            this.addRandomTrade();
        }, 5000);
    }

    updatePrice() {
        // Simulate price fluctuation
        const change = (Math.random() - 0.5) * 50;
        this.currentPrice += change;

        // Update price display
        const currentPriceElement = document.querySelector('.current-price');
        const priceChangeElement = document.querySelector('.price-change');

        if (currentPriceElement) {
            currentPriceElement.textContent = `$${this.currentPrice.toFixed(2)}`;
        }

        if (priceChangeElement) {
            const changePercent = (change / (this.currentPrice - change)) * 100;
            priceChangeElement.textContent = `${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
            priceChangeElement.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
        }

        // Update chart occasionally
        if (Math.random() > 0.7) {
            this.updateChart();
        }
    }

    updateOrderBook() {
        // Simulate order book updates
        this.generateOrderBook();
        this.renderOrderBook();
    }

    addRandomTrade() {
        // Simulate random trades
        const trade = {
            price: this.currentPrice + (Math.random() - 0.5) * 10,
            amount: Math.random() * 0.1 + 0.01,
            total: 0,
            side: Math.random() > 0.5 ? 'buy' : 'sell',
            timestamp: new Date().toISOString()
        };

        trade.total = trade.price * trade.amount;
        this.tradeHistory.unshift(trade);

        // Keep only last 100 trades
        if (this.tradeHistory.length > 100) {
            this.tradeHistory = this.tradeHistory.slice(0, 100);
        }

        this.updateTradeHistory();
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(e) {
        // Only process shortcuts when not typing in inputs
        if (e.target.tagName === 'INPUT') return;

        switch(e.key) {
            case 'b':
            case 'B':
                e.preventDefault();
                this.switchTab('limit');
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                this.switchTab('market');
                break;
            case 's':
            case 'S':
                e.preventDefault();
                this.switchTab('stop-limit');
                break;
            case 'Escape':
                this.clearActiveForm();
                break;
        }
    }

    // Load Auth Modals
    loadAuthModals() {
        // Load auth modals from main page
        fetch('index.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const modals = doc.querySelectorAll('.modal, .user-menu');
                const authModalsContainer = document.getElementById('authModals');

                if (authModalsContainer) {
                    modals.forEach(modal => {
                        authModalsContainer.appendChild(modal.cloneNode(true));
                    });
                }

                // Re-initialize auth after modals are loaded
                setTimeout(() => {
                    if (window.authManager) {
                        window.authManager.checkAuthState();
                    }
                }, 100);
            })
            .catch(error => {
                console.warn('Could not load auth modals:', error);
            });
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        if (window.binanceApp && window.binanceApp.showNotification) {
            window.binanceApp.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;

            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                background: var(--color-bg-card);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-md);
                color: var(--color-text-primary);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    // Public API
    getCurrentPrice() {
        return this.currentPrice;
    }

    getOrderBook() {
        return this.orderBook;
    }

    getOpenOrders() {
        return this.openOrders;
    }

    getTradeHistory() {
        return this.tradeHistory;
    }

    getUserBalance() {
        return this.userBalance;
    }
}

// Initialize trading engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tradingEngine = new TradingEngine();
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TradingEngine };
}
