// Futures Trading JavaScript
class FuturesTradingEngine {
    constructor() {
        this.currentPrice = 43256.78;
        this.currentPair = 'BTCUSDT';
        this.positions = [];
        this.orders = [];
        this.currentLeverage = 10;
        this.balance = 5000.00;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.renderPositions();
        this.renderOrderBook();
    }

    setupEventListeners() {
        // Pair selection
        document.getElementById('futuresPair')?.addEventListener('change', (e) => {
            this.currentPair = e.target.value;
            this.updatePrice();
        });

        // Order direction buttons
        document.querySelectorAll('.direction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const direction = e.currentTarget.dataset.direction;
                this.setOrderDirection(direction);
            });
        });

        // Leverage sliders
        document.getElementById('leverage')?.addEventListener('input', (e) => {
            this.currentLeverage = parseInt(e.target.value);
            document.getElementById('leverageValue').textContent = `${this.currentLeverage}x`;
            this.updateOrderSummary();
        });

        document.getElementById('marketLeverage')?.addEventListener('input', (e) => {
            const leverage = parseInt(e.target.value);
            document.getElementById('marketLeverageValue').textContent = `${leverage}x`;
            this.updateMarketOrderSummary();
        });

        // Form inputs
        document.getElementById('limitPrice')?.addEventListener('input', () => {
            this.updateOrderSummary();
        });

        document.getElementById('limitQuantity')?.addEventListener('input', () => {
            this.updateOrderSummary();
        });

        document.getElementById('marketQuantity')?.addEventListener('input', () => {
            this.updateMarketOrderSummary();
        });

        // Form submissions
        document.getElementById('limitOrderForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.placeLimitOrder();
        });

        document.getElementById('marketOrderForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.placeMarketOrder();
        });

        // Percentage buttons
        document.querySelectorAll('.percent-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const percent = parseInt(e.target.dataset.percent);
                this.applyPercentage(percent);
            });
        });

        // Timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChart(e.target.dataset.timeframe);
            });
        });
    }

    setOrderDirection(direction) {
        document.querySelectorAll('.direction-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.direction-btn[data-direction="${direction}"]`).classList.add('active');
        
        // Update button colors
        const submitBtn = document.querySelector('.btn-full');
        if (submitBtn) {
            submitBtn.className = `btn-primary btn-full ${direction}-btn`;
            submitBtn.textContent = direction === 'long' ? 'Buy/Long' : 'Sell/Short';
        }
    }

    updateOrderSummary() {
        const price = parseFloat(document.getElementById('limitPrice')?.value || 0);
        const quantity = parseFloat(document.getElementById('limitQuantity')?.value || 0);
        
        if (price > 0 && quantity > 0) {
            const notionalValue = price * quantity;
            const initialMargin = notionalValue / this.currentLeverage;
            const fees = notionalValue * 0.0002; // 0.02%
            
            // Update liquidation price (simplified calculation)
            const liquidationPrice = price * (1 - (1 / this.currentLeverage));
            
            document.getElementById('initialMargin').textContent = `$${initialMargin.toFixed(2)}`;
            document.getElementById('estimatedFees').textContent = `$${fees.toFixed(2)}`;
            document.getElementById('liquidationPrice').textContent = `$${liquidationPrice.toFixed(2)}`;
        }
    }

    updateMarketOrderSummary() {
        const quantity = parseFloat(document.getElementById('marketQuantity')?.value || 0);
        
        if (quantity > 0) {
            const estimatedCost = quantity * this.currentPrice;
            const fees = estimatedCost * 0.0002;
            
            document.getElementById('estimatedCost').textContent = `$${estimatedCost.toFixed(2)}`;
            document.getElementById('marketEstimatedFees').textContent = `$${fees.toFixed(2)}`;
        }
    }

    applyPercentage(percent) {
        const maxQuantity = (this.balance * this.currentLeverage) / this.currentPrice;
        const quantity = (maxQuantity * percent) / 100;
        
        const quantityInput = document.getElementById('limitQuantity');
        if (quantityInput) {
            quantityInput.value = quantity.toFixed(4);
            this.updateOrderSummary();
        }
    }

    placeLimitOrder() {
        const price = parseFloat(document.getElementById('limitPrice')?.value || 0);
        const quantity = parseFloat(document.getElementById('limitQuantity')?.value || 0);
        const direction = document.querySelector('.direction-btn.active')?.dataset.direction || 'long';
        
        if (price <= 0 || quantity <= 0) {
            alert('Please enter valid price and quantity');
            return;
        }
        
        const notionalValue = price * quantity;
        const requiredMargin = notionalValue / this.currentLeverage;
        
        if (requiredMargin > this.balance) {
            alert('Insufficient margin balance');
            return;
        }
        
        // Create position
        const position = {
            id: Date.now(),
            pair: this.currentPair,
            direction,
            entryPrice: price,
            quantity,
            leverage: this.currentLeverage,
            margin: requiredMargin,
            pnl: 0,
            timestamp: new Date().toISOString()
        };
        
        this.positions.push(position);
        this.balance -= requiredMargin;
        
        this.renderPositions();
        this.updateBalance();
        
        // Reset form
        document.getElementById('limitOrderForm')?.reset();
        
        alert(`${direction === 'long' ? 'Long' : 'Short'} position opened successfully!`);
    }

    placeMarketOrder() {
        const quantity = parseFloat(document.getElementById('marketQuantity')?.value || 0);
        const direction = document.querySelector('.direction-btn.active')?.dataset.direction || 'long';
        
        if (quantity <= 0) {
            alert('Please enter valid quantity');
            return;
        }
        
        const notionalValue = quantity * this.currentPrice;
        const requiredMargin = notionalValue / this.currentLeverage;
        
        if (requiredMargin > this.balance) {
            alert('Insufficient margin balance');
            return;
        }
        
        // Create position at market price
        const position = {
            id: Date.now(),
            pair: this.currentPair,
            direction,
            entryPrice: this.currentPrice,
            quantity,
            leverage: this.currentLeverage,
            margin: requiredMargin,
            pnl: 0,
            timestamp: new Date().toISOString()
        };
        
        this.positions.push(position);
        this.balance -= requiredMargin;
        
        this.renderPositions();
        this.updateBalance();
        
        // Reset form
        document.getElementById('marketOrderForm')?.reset();
        
        alert(`Market ${direction === 'long' ? 'Long' : 'Short'} position opened successfully!`);
    }

    renderPositions() {
        const container = document.getElementById('positionsList');
        if (!container) return;
        
        if (this.positions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No open positions</p>';
            return;
        }
        
        container.innerHTML = this.positions.map(position => {
            const currentPnL = position.direction === 'long' 
                ? (this.currentPrice - position.entryPrice) * position.quantity
                : (position.entryPrice - this.currentPrice) * position.quantity;
            
            const pnlPercentage = (currentPnL / position.margin) * 100;
            
            return `
                <div class="position-item">
                    <div class="position-header">
                        <div class="position-info">
                            <div class="position-pair">${position.pair}</div>
                            <div class="position-type ${position.direction}">${position.direction.toUpperCase()}</div>
                        </div>
                        <div class="position-pnl ${currentPnL >= 0 ? 'positive' : 'negative'}">
                            $${currentPnL.toFixed(2)} (${pnlPercentage.toFixed(2)}%)
                        </div>
                    </div>
                    <div class="position-stats">
                        <div class="position-stat">
                            <span class="position-stat-label">Size</span>
                            <span class="position-stat-value">${position.quantity} BTC</span>
                        </div>
                        <div class="position-stat">
                            <span class="position-stat-label">Entry</span>
                            <span class="position-stat-value">$${position.entryPrice.toFixed(2)}</span>
                        </div>
                        <div class="position-stat">
                            <span class="position-stat-label">Leverage</span>
                            <span class="position-stat-value">${position.leverage}x</span>
                        </div>
                        <div class="position-stat">
                            <span class="position-stat-label">Margin</span>
                            <span class="position-stat-value">$${position.margin.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderOrderBook() {
        this.generateOrderBook();
    }

    generateOrderBook() {
        const asksContainer = document.getElementById('futuresAsks');
        const bidsContainer = document.getElementById('futuresBids');
        
        if (!asksContainer || !bidsContainer) return;
        
        // Generate sample order book data
        const asks = [];
        const bids = [];
        
        for (let i = 0; i < 10; i++) {
            const askPrice = this.currentPrice + (i + 1) * 0.5;
            const askAmount = Math.random() * 2;
            asks.push({
                price: askPrice,
                amount: askAmount,
                total: askPrice * askAmount
            });
            
            const bidPrice = this.currentPrice - (i + 1) * 0.5;
            const bidAmount = Math.random() * 2;
            bids.push({
                price: bidPrice,
                amount: bidAmount,
                total: bidPrice * bidAmount
            });
        }
        
        // Render asks
        asksContainer.innerHTML = asks.map(ask => `
            <div class="order-book-row asks">
                <span class="price">$${ask.price.toFixed(2)}</span>
                <span class="amount">${ask.amount.toFixed(4)}</span>
                <span class="total">$${ask.total.toFixed(2)}</span>
            </div>
        `).join('');
        
        // Render bids
        bidsContainer.innerHTML = bids.map(bid => `
            <div class="order-book-row bids">
                <span class="price">$${bid.price.toFixed(2)}</span>
                <span class="amount">${bid.amount.toFixed(4)}</span>
                <span class="total">$${bid.total.toFixed(2)}</span>
            </div>
        `).join('');
        
        // Update spread
        const spread = asks[0].price - bids[0].price;
        document.getElementById('futuresSpread').textContent = `$${spread.toFixed(2)}`;
    }

    updateBalance() {
        document.getElementById('futuresBalance').textContent = `$${this.balance.toFixed(2)}`;
        document.getElementById('marginBalance').textContent = `$${(this.balance + this.positions.reduce((sum, p) => sum + p.margin, 0)).toFixed(2)}`;
        document.getElementById('availableMargin').textContent = `$${(this.balance * 0.8).toFixed(2)}`; // 80% available
    }

    updatePrice() {
        // Simulate price changes
        const change = (Math.random() - 0.5) * 0.002; // -0.1% to +0.1%
        this.currentPrice *= (1 + change);
        
        // Update UI
        document.getElementById('futuresPrice').textContent = `$${this.currentPrice.toFixed(2)}`;
        
        // Update price change
        const priceChangeElement = document.getElementById('futuresChange');
        if (priceChangeElement) {
            const changePercent = change * 100;
            priceChangeElement.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
            priceChangeElement.className = `price-change ${changePercent >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Update high/low
        const highElement = document.getElementById('futuresHigh');
        const lowElement = document.getElementById('futuresLow');
        
        if (highElement && lowElement) {
            const currentHigh = parseFloat(highElement.textContent.replace('$', ''));
            const currentLow = parseFloat(lowElement.textContent.replace('$', ''));
            
            if (this.currentPrice > currentHigh) {
                highElement.textContent = `$${this.currentPrice.toFixed(2)}`;
            }
            if (this.currentPrice < currentLow) {
                lowElement.textContent = `$${this.currentPrice.toFixed(2)}`;
            }
        }
    }

    updateChart(timeframe) {
        // Chart update logic would go here
        console.log(`Updating chart for timeframe: ${timeframe}`);
    }

    startRealTimeUpdates() {
        // Update price every 2 seconds
        setInterval(() => {
            this.updatePrice();
            this.renderOrderBook();
            this.renderPositions();
            this.updateMarketStats();
        }, 2000);
    }

    updateMarketStats() {
        // Update funding rate
        const fundingRate = (Math.random() - 0.5) * 0.0002;
        const fundingElement = document.getElementById('fundingRate');
        if (fundingElement) {
            fundingElement.textContent = `${(fundingRate * 100).toFixed(4)}%`;
        }
        
        // Update open interest
        const openInterestElement = document.getElementById('openInterest');
        if (openInterestElement) {
            const currentOI = parseFloat(openInterestElement.textContent.replace('$', '').replace('B', ''));
            const newOI = currentOI + (Math.random() - 0.5) * 0.1;
            openInterestElement.textContent = `$${newOI.toFixed(2)}B`;
        }
        
        // Update mark price
        const markPrice = this.currentPrice + (Math.random() - 0.5) * 2;
        document.getElementById('markPrice').textContent = `$${markPrice.toFixed(2)}`;
    }
}

// Initialize futures trading engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.futuresTradingEngine = new FuturesTradingEngine();
});

// Global functions
function closeAllPositions() {
    if (window.futuresTradingEngine) {
        if (window.futuresTradingEngine.positions.length === 0) {
            alert('No positions to close');
            return;
        }
        
        const totalPnL = window.futuresTradingEngine.positions.reduce((sum, pos) => {
            const pnl = pos.direction === 'long' 
                ? (window.futuresTradingEngine.currentPrice - pos.entryPrice) * pos.quantity
                : (pos.entryPrice - window.futuresTradingEngine.currentPrice) * pos.quantity;
            return sum + pnl;
        }, 0);
        
        const totalMargin = window.futuresTradingEngine.positions.reduce((sum, pos) => sum + pos.margin, 0);
        
        window.futuresTradingEngine.balance += totalMargin + totalPnL;
        window.futuresTradingEngine.positions = [];
        
        window.futuresTradingEngine.renderPositions();
        window.futuresTradingEngine.updateBalance();
        
        alert(`All positions closed. Total P&L: $${totalPnL.toFixed(2)}`);
    }
}