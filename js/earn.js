// Earn Page JavaScript
class EarnEngine {
    constructor() {
        this.userBalance = 10000;
        this.currentPortfolio = [];
        this.earnProducts = [
            {
                id: 1,
                name: "BTC Staking",
                type: "staking",
                apy: 4.5,
                duration: "Flexible",
                minimum: 0.001,
                risk: "Low",
                description: "Earn passive income by staking Bitcoin",
                totalValue: "$2.5B",
                participants: 156000
            },
            {
                id: 2,
                name: "ETH Flexible Savings",
                type: "savings",
                apy: 3.2,
                duration: "Flexible",
                minimum: 0.01,
                risk: "Low",
                description: "Flexible savings for Ethereum",
                totalValue: "$1.8B",
                participants: 234000
            },
            {
                id: 3,
                name: "USDT Staking",
                type: "staking",
                apy: 8.5,
                duration: "30 Days",
                minimum: 10,
                risk: "Low",
                description: "High-yield staking for stablecoins",
                totalValue: "$3.2B",
                participants: 456000
            },
            {
                id: 4,
                name: "DeFi Yield Farming",
                type: "defi",
                apy: 15.8,
                duration: "Flexible",
                minimum: 100,
                risk: "High",
                description: "Advanced DeFi strategies with high returns",
                totalValue: "$890M",
                participants: 45000
            },
            {
                id: 5,
                name: "BNB Locked Staking",
                type: "staking",
                apy: 12.5,
                duration: "90 Days",
                minimum: 1,
                risk: "Medium",
                description: "Locked BNB staking with premium rates",
                totalValue: "$567M",
                participants: 123000
            },
            {
                id: 6,
                name: "SOL Staking",
                type: "staking",
                apy: 6.8,
                duration: "Flexible",
                minimum: 0.1,
                risk: "Medium",
                description: "Solana network staking rewards",
                totalValue: "$445M",
                participants: 89000
            },
            {
                id: 7,
                name: "High-Yield Savings",
                type: "savings",
                apy: 2.1,
                duration: "Flexible",
                minimum: 50,
                risk: "Low",
                description: "Conservative savings with steady returns",
                totalValue: "$1.2B",
                participants: 345000
            },
            {
                id: 8,
                name: "Liquidity Mining",
                type: "defi",
                apy: 22.4,
                duration: "Flexible",
                minimum: 200,
                risk: "High",
                description: "Provide liquidity and earn trading fees",
                totalValue: "$234M",
                participants: 23000
            },
            {
                id: 9,
                name: "DOT Staking",
                type: "staking",
                apy: 9.2,
                duration: "Flexible",
                minimum: 1,
                risk: "Medium",
                description: "Polkadot network staking rewards",
                totalValue: "$178M",
                participants: 45000
            },
            {
                id: 10,
                name: "USDC Savings",
                type: "savings",
                apy: 7.5,
                duration: "Flexible",
                minimum: 10,
                risk: "Low",
                description: "USD Coin savings with competitive rates",
                totalValue: "$2.1B",
                participants: 567000
            },
            {
                id: 11,
                name: "ADA Staking",
                type: "staking",
                apy: 5.5,
                duration: "Flexible",
                minimum: 10,
                risk: "Medium",
                description: "Cardano staking with sustainable returns",
                totalValue: "$123M",
                participants: 67000
            },
            {
                id: 12,
                name: "Cross-Chain Farming",
                type: "defi",
                apy: 18.7,
                duration: "Flexible",
                minimum: 300,
                risk: "High",
                description: "Multi-chain yield optimization",
                totalValue: "$345M",
                participants: 18000
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.renderPortfolio();
        this.startRealTimeUpdates();
        this.setupCalculator();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterProducts(e.target.dataset.filter);
            });
        });

        // Sort dropdown
        document.getElementById('sortBy')?.addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });

        // Category tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchCategory(e.target.dataset.category);
            });
        });

        // Calculator inputs
        document.getElementById('calcAmount')?.addEventListener('input', () => {
            this.updateCalculation();
        });

        document.getElementById('calcDuration')?.addEventListener('change', () => {
            this.updateCalculation();
        });

        // Subscribe buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('subscribe-btn')) {
                e.preventDefault();
                this.showSubscribeModal(e.target.dataset.productId);
            }
        });
    }

    renderProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        container.innerHTML = this.earnProducts.map(product => `
            <div class="product-card" data-type="${product.type}">
                <div class="product-header">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <span class="product-type ${product.type}">${product.type.toUpperCase()}</span>
                    </div>
                    <div class="product-apy">
                        <span class="apy-value">${product.apy}%</span>
                        <span class="apy-label">APY</span>
                    </div>
                </div>
                <div class="product-details">
                    <div class="product-description">
                        ${product.description}
                    </div>
                    <div class="product-stats">
                        <div class="stat">
                            <span class="stat-label">Duration</span>
                            <span class="stat-value">${product.duration}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Minimum</span>
                            <span class="stat-value">${product.minimum}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Risk</span>
                            <span class="stat-value risk-${product.risk.toLowerCase()}">${product.risk}</span>
                        </div>
                    </div>
                    <div class="product-metrics">
                        <div class="metric">
                            <span class="metric-label">Total Value</span>
                            <span class="metric-value">${product.totalValue}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Participants</span>
                            <span class="metric-value">${product.participants.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-primary subscribe-btn" data-product-id="${product.id}">
                        Subscribe
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderPortfolio() {
        const container = document.getElementById('portfolioGrid');
        if (!container) return;

        if (this.currentPortfolio.length === 0) {
            container.innerHTML = `
                <div class="empty-portfolio">
                    <i class="fas fa-chart-line"></i>
                    <h3>No Active Investments</h3>
                    <p>Start earning by subscribing to one of our products</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.currentPortfolio.map(investment => `
            <div class="portfolio-item">
                <div class="portfolio-header">
                    <div class="portfolio-info">
                        <h4>${investment.productName}</h4>
                        <span class="portfolio-type ${investment.type}">${investment.type}</span>
                    </div>
                    <div class="portfolio-returns">
                        <span class="return-value positive">+$${investment.returns.toFixed(2)}</span>
                        <span class="return-percentage positive">+${investment.returnPercentage.toFixed(2)}%</span>
                    </div>
                </div>
                <div class="portfolio-details">
                    <div class="portfolio-stats">
                        <div class="stat">
                            <span class="stat-label">Invested</span>
                            <span class="stat-value">$${investment.amount.toFixed(2)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Current Value</span>
                            <span class="stat-value">$${investment.currentValue.toFixed(2)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">APY</span>
                            <span class="stat-value">${investment.apy}%</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Duration</span>
                            <span class="stat-value">${investment.duration}</span>
                        </div>
                    </div>
                </div>
                <div class="portfolio-actions">
                    <button class="btn-secondary" onclick="earnEngine.unsubscribe(${investment.id})">
                        Unsubscribe
                    </button>
                </div>
            </div>
        `).join('');

        this.updatePortfolioSummary();
    }

    updatePortfolioSummary() {
        const totalInvested = this.currentPortfolio.reduce((sum, inv) => sum + inv.amount, 0);
        const totalCurrent = this.currentPortfolio.reduce((sum, inv) => sum + inv.currentValue, 0);
        const totalReturns = totalCurrent - totalInvested;

        const summaryElement = document.getElementById('portfolioSummary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Total Invested</span>
                        <span class="summary-value">$${totalInvested.toFixed(2)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Current Value</span>
                        <span class="summary-value">$${totalCurrent.toFixed(2)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Total Returns</span>
                        <span class="summary-value ${totalReturns >= 0 ? 'positive' : 'negative'}">
                            ${totalReturns >= 0 ? '+' : ''}$${totalReturns.toFixed(2)}
                        </span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Daily Earnings</span>
                        <span class="summary-value positive">+$${(totalInvested * 0.0003).toFixed(2)}</span>
                    </div>
                </div>
            `;
        }
    }

    filterProducts(filter) {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            if (filter === 'all' || card.dataset.type === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    sortProducts(sortBy) {
        let sortedProducts = [...this.earnProducts];

        switch (sortBy) {
            case 'apy-high':
                sortedProducts.sort((a, b) => b.apy - a.apy);
                break;
            case 'apy-low':
                sortedProducts.sort((a, b) => a.apy - b.apy);
                break;
            case 'value-high':
                sortedProducts.sort((a, b) => {
                    const aVal = parseFloat(a.totalValue.replace('$', '').replace('B', ''));
                    const bVal = parseFloat(b.totalValue.replace('$', '').replace('B', ''));
                    return bVal - aVal;
                });
                break;
            case 'risk-low':
                const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                sortedProducts.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
                break;
        }

        this.earnProducts = sortedProducts;
        this.renderProducts();
    }

    switchCategory(category) {
        const categories = document.querySelectorAll('.earn-category');
        categories.forEach(cat => {
            if (cat.dataset.category === category || category === 'all') {
                cat.style.display = 'block';
            } else {
                cat.style.display = 'none';
            }
        });
    }

    setupCalculator() {
        const calcForm = document.getElementById('calculatorForm');
        if (calcForm) {
            calcForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateCalculation();
            });
        }
    }

    updateCalculation() {
        const amount = parseFloat(document.getElementById('calcAmount')?.value || 0);
        const duration = document.getElementById('calcDuration')?.value || '30';
        const apy = parseFloat(document.getElementById('calcAPY')?.textContent || '5');

        if (amount > 0) {
            const days = parseInt(duration);
            const dailyRate = apy / 100 / 365;
            const estimatedReturn = amount * dailyRate * days;

            const resultElement = document.getElementById('calcResult');
            if (resultElement) {
                resultElement.innerHTML = `
                    <div class="calc-result">
                        <div class="result-item">
                            <span>Estimated Return:</span>
                            <span class="result-value">$${estimatedReturn.toFixed(2)}</span>
                        </div>
                        <div class="result-item">
                            <span>Total Value:</span>
                            <span class="result-value">$${(amount + estimatedReturn).toFixed(2)}</span>
                        </div>
                        <div class="result-item">
                            <span>Effective APY:</span>
                            <span class="result-value">${apy}%</span>
                        </div>
                    </div>
                `;
            }
        }
    }

    showSubscribeModal(productId) {
        const product = this.earnProducts.find(p => p.id == productId);
        if (!product) return;

        // In a real application, this would show a modal
        const amount = prompt(`Enter amount to invest in ${product.name} (Minimum: ${product.minimum}):`);
        if (amount && parseFloat(amount) >= product.minimum) {
            this.subscribeToProduct(product, parseFloat(amount));
        }
    }

    subscribeToProduct(product, amount) {
        if (amount > this.userBalance) {
            alert('Insufficient balance');
            return;
        }

        const investment = {
            id: Date.now(),
            productName: product.name,
            type: product.type,
            amount: amount,
            apy: product.apy,
            duration: product.duration,
            currentValue: amount,
            returns: 0,
            returnPercentage: 0,
            startDate: new Date().toISOString()
        };

        this.currentPortfolio.push(investment);
        this.userBalance -= amount;

        this.renderPortfolio();
        this.updateUserBalance();

        alert(`Successfully invested $${amount.toFixed(2)} in ${product.name}`);
    }

    unsubscribe(investmentId) {
        const investmentIndex = this.currentPortfolio.findIndex(inv => inv.id === investmentId);
        if (investmentIndex !== -1) {
            const investment = this.currentPortfolio[investmentIndex];
            this.userBalance += investment.currentValue;
            this.currentPortfolio.splice(investmentIndex, 1);

            this.renderPortfolio();
            this.updateUserBalance();

            alert('Successfully unsubscribed from investment');
        }
    }

    updateUserBalance() {
        const balanceElement = document.getElementById('userBalance');
        if (balanceElement) {
            balanceElement.textContent = `$${this.userBalance.toFixed(2)}`;
        }
    }

    startRealTimeUpdates() {
        // Update portfolio values every 5 seconds
        setInterval(() => {
            this.currentPortfolio.forEach(investment => {
                const dailyReturn = investment.amount * (investment.apy / 100 / 365);
                const secondsPerDay = 86400;
                const incrementalReturn = dailyReturn / secondsPerDay * 5; // 5 second updates

                investment.currentValue += incrementalReturn;
                investment.returns = investment.currentValue - investment.amount;
                investment.returnPercentage = (investment.returns / investment.amount) * 100;
            });

            this.renderPortfolio();
        }, 5000);
    }
}

// Initialize earn engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.earnEngine = new EarnEngine();
});

// Global functions
function filterEarnProducts() {
    const searchTerm = document.getElementById('earnSearch')?.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}

function showEarnDetails(productId) {
    const product = window.earnEngine?.earnProducts.find(p => p.id == productId);
    if (product) {
        alert(`${product.name}\n\nAPY: ${product.apy}%\nDuration: ${product.duration}\nMinimum: ${product.minimum}\nRisk: ${product.risk}\n\n${product.description}`);
    }
}