// Markets Page JavaScript
class MarketsManager {
    constructor() {
        this.cryptocurrencies = [
            {
                id: 'bitcoin',
                symbol: 'BTC',
                name: 'Bitcoin',
                price: 43256.78,
                change24h: 2.34,
                volume24h: 23400000000,
                marketCap: 847200000000,
                high24h: 44123.45,
                low24h: 42987.65,
                sparkline: [42000, 42500, 43000, 43500, 43256],
                icon: '₿',
                iconColor: '#F7931A',
                category: ['layer1']
            },
            {
                id: 'ethereum',
                symbol: 'ETH',
                name: 'Ethereum',
                price: 2234.56,
                change24h: -1.23,
                volume24h: 15600000000,
                marketCap: 268400000000,
                high24h: 2287.89,
                low24h: 2198.76,
                sparkline: [2250, 2240, 2230, 2245, 2234],
                icon: 'Ξ',
                iconColor: '#627EEA',
                category: ['layer1', 'defi']
            },
            {
                id: 'binance-coin',
                symbol: 'BNB',
                name: 'Binance Coin',
                price: 312.45,
                change24h: 0.89,
                volume24h: 1200000000,
                marketCap: 48300000000,
                high24h: 318.90,
                low24h: 305.67,
                sparkline: [310, 312, 314, 313, 312],
                icon: 'BNB',
                iconColor: '#F0B90B',
                category: ['layer1', 'defi']
            },
            {
                id: 'cardano',
                symbol: 'ADA',
                name: 'Cardano',
                price: 0.4567,
                change24h: 3.45,
                volume24h: 450000000,
                marketCap: 16200000000,
                high24h: 0.4678,
                low24h: 0.4389,
                sparkline: [0.44, 0.45, 0.46, 0.455, 0.4567],
                icon: 'ADA',
                iconColor: '#0033AD',
                category: ['layer1']
            },
            {
                id: 'solana',
                symbol: 'SOL',
                name: 'Solana',
                price: 98.76,
                change24h: -2.34,
                volume24h: 890000000,
                marketCap: 43200000000,
                high24h: 102.34,
                low24h: 96.54,
                sparkline: [100, 99, 98, 97, 98],
                icon: 'SOL',
                iconColor: '#00FFA3',
                category: ['layer1', 'defi']
            },
            {
                id: 'ripple',
                symbol: 'XRP',
                name: 'Ripple',
                price: 0.5234,
                change24h: 1.23,
                volume24h: 1230000000,
                marketCap: 28700000000,
                high24h: 0.5345,
                low24h: 0.5123,
                sparkline: [0.52, 0.525, 0.53, 0.528, 0.5234],
                icon: 'XRP',
                iconColor: '#23292F',
                category: ['layer1']
            },
            {
                id: 'polkadot',
                symbol: 'DOT',
                name: 'Polkadot',
                price: 7.23,
                change24h: 0.67,
                volume24h: 234000000,
                marketCap: 9100000000,
                high24h: 7.45,
                low24h: 6.98,
                sparkline: [7.1, 7.2, 7.3, 7.25, 7.23],
                icon: 'DOT',
                iconColor: '#E6007A',
                category: ['layer1', 'defi']
            },
            {
                id: 'dogecoin',
                symbol: 'DOGE',
                name: 'Dogecoin',
                price: 0.0789,
                change24h: 5.67,
                volume24h: 567000000,
                marketCap: 11200000000,
                high24h: 0.0823,
                low24h: 0.0745,
                sparkline: [0.075, 0.077, 0.079, 0.078, 0.0789],
                icon: 'Ð',
                iconColor: '#C2A633',
                category: ['meme']
            },
            {
                id: 'polygon',
                symbol: 'MATIC',
                name: 'Polygon',
                price: 0.8234,
                change24h: -0.89,
                volume24h: 345000000,
                marketCap: 7650000000,
                high24h: 0.8456,
                low24h: 0.8012,
                sparkline: [0.82, 0.83, 0.84, 0.825, 0.8234],
                icon: 'MATIC',
                iconColor: '#8247E5',
                category: ['layer2', 'defi']
            },
            {
                id: 'chainlink',
                symbol: 'LINK',
                name: 'Chainlink',
                price: 12.34,
                change24h: 2.34,
                volume24h: 456000000,
                marketCap: 6900000000,
                high24h: 12.67,
                low24h: 11.98,
                sparkline: [12.1, 12.2, 12.4, 12.3, 12.34],
                icon: 'LINK',
                iconColor: '#2A5ADA',
                category: ['defi']
            },
            {
                id: 'uniswap',
                symbol: 'UNI',
                name: 'Uniswap',
                price: 5.67,
                change24h: -1.23,
                volume24h: 234000000,
                marketCap: 4300000000,
                high24h: 5.89,
                low24h: 5.45,
                sparkline: [5.7, 5.6, 5.8, 5.65, 5.67],
                icon: 'UNI',
                iconColor: '#FF007A',
                category: ['defi', 'layer2']
            },
            {
                id: 'avalanche',
                symbol: 'AVAX',
                name: 'Avalanche',
                price: 23.45,
                change24h: 3.21,
                volume24h: 567000000,
                marketCap: 8900000000,
                high24h: 24.12,
                low24h: 22.87,
                sparkline: [23.1, 23.3, 23.6, 23.4, 23.45],
                icon: 'AVAX',
                iconColor: '#E84142',
                category: ['layer1', 'defi']
            }
        ];

        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredCryptos = [...this.cryptocurrencies];
        this.currentView = 'table';
        this.currentFilter = 'all';
        this.currentSort = 'marketCap';
        this.searchQuery = '';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderMarkets();
        this.startRealTimeUpdates();
        this.updateMarketStats();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterAndSortCryptos();
        });
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.searchQuery = '';
                this.filterAndSortCryptos();
                searchInput.focus();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterAndSortCryptos();
            });
        });

        // Market tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                // Tab switching logic would go here
            });
        });

        // Sort dropdown
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndSortCryptos();
        });

        // Header sort (clickable th) - delegate
        document.addEventListener('click', (e) => {
            const th = e.target.closest('.markets-table th.sortable');
            if (!th) return;
            const key = th.dataset.sort;
            if (this.currentSort === key) {
                this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
            } else {
                this.currentSort = key;
                this.currentSortDir = key === 'name' || key === 'rank' ? 'asc' : 'desc';
            }
            this.updateHeaderSortIndicators();
            this.filterAndSortCryptos();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.toggleView();
            });
        });

        // Density toggle
        document.querySelectorAll('.density-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.density-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const container = document.querySelector('.table-container');
                if (!container) return;
                if (btn.dataset.density === 'compact') {
                    container.classList.add('compact');
                } else {
                    container.classList.remove('compact');
                }
            });
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderMarkets();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredCryptos.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderMarkets();
            }
        });
    }

    filterAndSortCryptos() {
        // Filter by category
        if (this.currentFilter === 'all') {
            this.filteredCryptos = [...this.cryptocurrencies];
        } else {
            this.filteredCryptos = this.cryptocurrencies.filter(crypto =>
                crypto.category.includes(this.currentFilter)
            );
        }

        // Filter by search query
        if (this.searchQuery) {
            this.filteredCryptos = this.filteredCryptos.filter(crypto =>
                crypto.name.toLowerCase().includes(this.searchQuery) ||
                crypto.symbol.toLowerCase().includes(this.searchQuery)
            );
        }

        // Quick filter (gainers/losers/trending)
        if (this.currentQuick === 'gainers') {
            this.filteredCryptos = [...this.filteredCryptos]
                .filter(c => c.change24h > 0)
                .sort((a,b) => b.change24h - a.change24h)
                .slice(0, 20);
        } else if (this.currentQuick === 'losers') {
            this.filteredCryptos = [...this.filteredCryptos]
                .filter(c => c.change24h < 0)
                .sort((a,b) => a.change24h - b.change24h)
                .slice(0, 20);
        } else if (this.currentQuick === 'trending') {
            const trendScore = (c) => {
                const s = c.sparkline;
                if (!s || s.length < 2) return 0;
                return (s[s.length-1] - s[0]) / s[0];
            };
            this.filteredCryptos = [...this.filteredCryptos]
                .sort((a,b) => Math.abs(trendScore(b)) - Math.abs(trendScore(a)))
                .slice(0, 20);
        }

        // Sort
        const dir = this.currentSortDir === 'asc' ? 1 : -1;
        this.filteredCryptos.sort((a, b) => {
            switch (this.currentSort) {
                case 'marketCap':
                    return dir * (a.marketCap - b.marketCap);
                case 'volume':
                    return dir * (a.volume24h - b.volume24h);
                case 'price':
                    return dir * (a.price - b.price);
                case 'change':
                    return dir * (a.change24h - b.change24h);
                case 'name':
                    return dir * a.name.localeCompare(b.name);
                case 'rank':
                    return dir * (this.cryptocurrencies.indexOf(a) - this.cryptocurrencies.indexOf(b));
                default:
                    return 0;
            }
        });

        this.currentPage = 1;
        this.renderMarkets();
    }

    renderMarkets() {
        if (this.currentView === 'table') {
            this.renderTableView();
        } else {
            this.renderGridView();
        }
        this.renderPagination();
        this.updateHeaderSortIndicators();
    }

    renderTableView() {
        const tbody = document.getElementById('marketsTableBody');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredCryptos.slice(startIndex, endIndex);

        tbody.innerHTML = pageData.map((crypto, index) => `
            <tr onclick=\"marketsManager.showMarketDetail('${crypto.id}')\">
                <td class=\"fav-cell\" onclick=\"event.stopPropagation(); marketsManager.toggleFavorite('${crypto.id}')\" title=\"Toggle favorite\">
                    <i class=\"fas fa-star ${this.isFavorite(crypto.id) ? 'fav-on' : 'fav-off'}\"></i>
                </td>
                <td class=\"rank\">${startIndex + index + 1}</td>
                <td class="coin-info">
                    <div class="coin-icon" style="background: ${crypto.iconColor}; color: white;">
                        ${crypto.icon}
                    </div>
                    <div>
                        <div class="coin-name">${crypto.name}</div>
                        <div class="coin-symbol">${crypto.symbol}</div>
                    </div>
                </td>
                <td class=\"price\">$${crypto.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                <td class=\"change ${crypto.change24h >= 0 ? 'positive' : 'negative'}\">${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h.toFixed(2)}%</td>
                <td class=\"volume\">$${(crypto.volume24h / 1e9).toFixed(1)}B</td>
                <td class=\"market-cap\">$${(crypto.marketCap / 1e9).toFixed(1)}B</td>
                <td class=\"sparkline\">
                    <canvas id=\"sparkline-${crypto.id}\" width=\"100\" height=\"30\"></canvas>
                </td>
                <td>
                    <button class=\"action-btn\" onclick=\"event.stopPropagation(); marketsManager.goToTrade('${crypto.symbol}USDT')\">
                        Trade
                    </button>
                </td>
            </tr>
        `).join('');

        // Draw sparklines
        pageData.forEach(crypto => {
            this.drawSparkline(`sparkline-${crypto.id}`, crypto.sparkline, crypto.change24h >= 0);
        });
    }

    renderGridView() {
        const grid = document.getElementById('marketsGrid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredCryptos.slice(startIndex, endIndex);

        grid.innerHTML = pageData.map(crypto => `
            <div class="market-card" onclick="marketsManager.showMarketDetail('${crypto.id}')">
                <div class="market-card-header">
                    <div class="market-card-info">
                        <div class="market-card-rank">#${this.filteredCryptos.findIndex(c => c.id === crypto.id) + 1}</div>
                        <div class="coin-icon" style="background: ${crypto.iconColor}; color: white; width: 24px; height: 24px;">
                            ${crypto.icon}
                        </div>
                        <div>
                            <div class="market-card-name">${crypto.name}</div>
                            <div class="market-card-symbol">${crypto.symbol}</div>
                        </div>
                    </div>
                    <div class="market-card-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}">
                        ${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h}%
                    </div>
                </div>
                <div class="market-card-price">$${crypto.price.toLocaleString()}</div>
                <div class="market-card-sparkline">
                    <canvas id="sparkline-grid-${crypto.id}" width="260" height="60"></canvas>
                </div>
                <div class="market-card-stats">
                    <div class="market-card-stat">
                        <span class="market-card-stat-label">Volume (24h)</span>
                        <span class="market-card-stat-value">$${(crypto.volume24h / 1000000).toFixed(1)}M</span>
                    </div>
                    <div class="market-card-stat">
                        <span class="market-card-stat-label">Market Cap</span>
                        <span class="market-card-stat-value">$${(crypto.marketCap / 1000000000).toFixed(1)}B</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Draw sparklines for grid view
        pageData.forEach(crypto => {
            this.drawSparkline(`sparkline-grid-${crypto.id}`, crypto.sparkline, crypto.change24h >= 0);
        });
    }

    drawSparkline(canvasId, data, isPositive) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        if (data.length < 2) return;

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        ctx.beginPath();
        ctx.strokeStyle = isPositive ? '#0ECB81' : '#F6465D';
        ctx.lineWidth = 2;

        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    updateHeaderSortIndicators() {
        document.querySelectorAll('.markets-table th.sortable').forEach(th => {
            th.classList.remove('sorted-asc','sorted-desc');
            if (th.dataset.sort === this.currentSort) {
                th.classList.add(this.currentSortDir === 'asc' ? 'sorted-asc' : 'sorted-desc');
            }
        });
    }

    // Favorites helpers
    loadFavorites() {
        try {
            const raw = localStorage.getItem('markets_favorites');
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }

    saveFavorites() {
        try { localStorage.setItem('markets_favorites', JSON.stringify(this.favorites)); } catch (e) {}
    }

    isFavorite(id) {
        return this.favorites.includes(id);
    }

    toggleFavorite(id) {
        if (this.isFavorite(id)) {
            this.favorites = this.favorites.filter(x => x !== id);
        } else {
            this.favorites.push(id);
        }
        this.saveFavorites();
        this.renderMarkets();
    }

    toggleView() {
        const tableView = document.getElementById('tableView');
        const gridView = document.getElementById('gridView');

        if (this.currentView === 'table') {
            tableView.style.display = 'block';
            gridView.style.display = 'none';
        } else {
            tableView.style.display = 'none';
            gridView.style.display = 'grid';
        }

        this.renderMarkets();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredCryptos.length / this.itemsPerPage);
        const pageNumbers = document.getElementById('pageNumbers');

        // Generate page numbers
        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}"
                            onclick="marketsManager.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += '<span>...</span>';
            }
        }

        pageNumbers.innerHTML = paginationHTML;

        // Update pagination buttons
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderMarkets();
    }

    showMarketDetail(cryptoId) {
        const crypto = this.cryptocurrencies.find(c => c.id === cryptoId);
        if (!crypto) return;

        // Update modal content
        document.getElementById('modalMarketName').textContent = crypto.name;
        document.getElementById('modalCurrentPrice').textContent = `$${crypto.price.toLocaleString()}`;
        document.getElementById('modalPriceChange').textContent = `${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h}%`;
        document.getElementById('modalPriceChange').className = `price-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`;
        document.getElementById('modalHigh24h').textContent = `$${crypto.high24h.toLocaleString()}`;
        document.getElementById('modalLow24h').textContent = `$${crypto.low24h.toLocaleString()}`;
        document.getElementById('modalMarketCap').textContent = `$${(crypto.marketCap / 1000000000).toFixed(1)}B`;
        document.getElementById('modalVolume').textContent = `$${(crypto.volume24h / 1000000000).toFixed(1)}B`;

        showModal('marketDetailModal');
    }

    goToTrade(pair) {
        window.location.href = `trade.html?symbol=${pair}`;
    }

    addToWatchlist(symbol) {
        // Watchlist functionality would be implemented here
        alert(`Added ${symbol} to watchlist`);
    }

    startRealTimeUpdates() {
        // Update prices every 3 seconds
        setInterval(() => {
            this.updatePrices();
            this.updateMarketStats();
        }, 3000);
    }

    updatePrices() {
        this.cryptocurrencies.forEach(crypto => {
            // Simulate price changes
            const changePercent = (Math.random() - 0.5) * 0.5; // -0.25% to +0.25%
            crypto.price *= (1 + changePercent / 100);
            crypto.change24h += changePercent * 0.1; // Small impact on 24h change

            // Update sparkline
            crypto.sparkline.push(crypto.price);
            if (crypto.sparkline.length > 50) {
                crypto.sparkline.shift();
            }

            // Update high/low
            crypto.high24h = Math.max(crypto.high24h, crypto.price);
            crypto.low24h = Math.min(crypto.low24h, crypto.price);
        });

        this.filterAndSortCryptos();
    }

    updateMarketStats() {
        const totalMarketCap = this.cryptocurrencies.reduce((sum, crypto) => sum + crypto.marketCap, 0);
        const totalVolume = this.cryptocurrencies.reduce((sum, crypto) => sum + crypto.volume24h, 0);
        const btcMarketCap = this.cryptocurrencies.find(c => c.id === 'bitcoin')?.marketCap || 0;
        const btcDominance = (btcMarketCap / totalMarketCap * 100);

        document.getElementById('totalMarketCap').textContent = `$${(totalMarketCap / 1000000000000).toFixed(2)}T`;
        document.getElementById('totalVolume').textContent = `$${(totalVolume / 1000000000).toFixed(1)}B`;
        document.getElementById('btcDominance').textContent = `${btcDominance.toFixed(1)}%`;
    }
}

// Initialize markets manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.marketsManager = new MarketsManager();
});
