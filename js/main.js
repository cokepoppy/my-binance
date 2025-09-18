// Main JavaScript for Binance Clone

class BinanceApp {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.simulateRealTimeData();
    }

    init() {
        // Initialize components
        this.initCharts();
        this.initMarketFilters();
        this.initNavigation();
        this.initAnimations();
        this.initHeroChart();
    }

    setupEventListeners() {
        // Header navigation - only handle special cases, don't prevent default navigation
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Only prevent default for special links or if href is #
                if (href === '#' || href.includes('#')) {
                    e.preventDefault();
                    this.handleNavigationClick(link);
                } else {
                    // Let normal navigation happen for page links
                    // Just update active class for visual feedback
                    document.querySelectorAll('.main-nav a').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Market filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMarketFilter(btn);
            });
        });

        // CTA buttons
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleButtonClick(btn, e);
            });
        });

        // Language selector
        const languageSelector = document.querySelector('.language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('click', () => {
                this.handleLanguageSelector();
            });
        }

        // Fallback handlers for auth buttons (in case auth.init not yet bound)
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (window.authManager) window.authManager.showLoginModal();
            });
        }
        const registerBtn = document.querySelector('.btn-register');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                if (window.authManager) window.authManager.showRegisterModal();
            });
        }

        // Initialize language from saved preference
        this.initLanguageSelector();

        // Scroll animations
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Market item hover effects
        document.querySelectorAll('.market-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.handleMarketItemHover(item);
            });
            item.addEventListener('mouseleave', () => {
                this.handleMarketItemLeave(item);
            });
        });
    }

    initCharts() {
        // Initialize sparkline charts for market items
        document.querySelectorAll('.sparkline').forEach(canvas => {
            this.drawSparkline(canvas);
        });
    }

    drawSparkline(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Generate random price data
        const dataPoints = 20;
        const data = [];
        for (let i = 0; i < dataPoints; i++) {
            data.push(Math.random() * 30 + 10);
        }

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Determine if price is up or down
        const isPositive = data[data.length - 1] > data[0];
        const color = isPositive ? '#0ECB81' : '#F6465D';

        // Draw sparkline
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((value, index) => {
            const x = (index / (dataPoints - 1)) * width;
            const y = height - (value / 40) * height;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    initMarketFilters() {
        // Set default filter
        const defaultFilter = document.querySelector('.filter-btn.active');
        if (defaultFilter) {
            this.filterMarketItems(defaultFilter.textContent.trim());
        }
    }

    initNavigation() {
        // Highlight current page
        const currentPath = window.location.pathname;
        document.querySelectorAll('.main-nav a').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    initAnimations() {
        // Fade in animations on page load
        document.querySelectorAll('.feature-card, .market-item').forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';

            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleNavigationClick(link) {
        // Remove active class from all links
        document.querySelectorAll('.main-nav a').forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');

        // Get the href attribute and navigate to the page
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            console.log(`Navigating to: ${href}`);
            window.location.href = href;
        }
    }

    handleMarketFilter(btn) {
        // Remove active class from all filter buttons
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Filter market items
        const filterType = btn.textContent.trim();
        this.filterMarketItems(filterType);
    }

    filterMarketItems(type) {
        const marketItems = document.querySelectorAll('.market-item');

        marketItems.forEach(item => {
            // Simple filtering logic (in real app, this would be more sophisticated)
            if (type === 'All' || Math.random() > 0.3) {
                item.style.display = 'grid';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    handleButtonClick(btn, e) {
        const buttonText = btn.textContent.trim();
        console.log(`Button clicked: ${buttonText}`);

        // Add ripple effect
        this.createRippleEffect(btn, e);

        // Simulate different actions based on button text
        if (buttonText.includes('Trading') || buttonText.includes('Started')) {
            this.showNotification('Redirecting to trading platform...', 'info');
        } else if (buttonText.includes('Crypto')) {
            this.showNotification('Opening crypto purchase interface...', 'info');
        } else if (buttonText === 'Log In') {
            if (window.authManager) {
                window.authManager.showLoginModal();
            } else {
                this.showNotification('Login system not available', 'error');
            }
        } else if (buttonText === 'Register') {
            if (window.authManager) {
                window.authManager.showRegisterModal();
            } else {
                this.showNotification('Registration system not available', 'error');
            }
        }
    }

    handleLanguageSelector() {
        // Simple language selector simulation
        const languages = ['EN', '中文', '日本語', '한국어', 'Español', 'Français'];
        const currentLang = document.querySelector('.language-selector span');
        if (!currentLang) return;
        const currentIndex = languages.indexOf(currentLang.textContent);
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLang = languages[nextIndex];

        currentLang.textContent = nextLang;
        try { localStorage.setItem('binance_lang', nextLang); } catch (e) {}
        this.showNotification(`Language changed to ${nextLang}`, 'success');
    }

    initLanguageSelector() {
        const stored = (() => { try { return localStorage.getItem('binance_lang'); } catch (e) { return null; } })();
        const langEl = document.querySelector('.language-selector span');
        if (langEl && stored) {
            langEl.textContent = stored;
        }
    }

    handleScroll() {
        const header = document.querySelector('.header');
        const scrolled = window.scrollY > 50;

        if (scrolled) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        } else {
            header.style.boxShadow = 'none';
        }

        // Animate elements on scroll
        this.animateOnScroll();
    }

    handleMarketItemHover(item) {
        // Add hover effect
        item.style.transform = 'translateY(-4px)';
        item.style.boxShadow = '0 8px 25px rgba(240, 185, 11, 0.1)';

        // Update sparkline with animation
        const sparkline = item.querySelector('.sparkline');
        if (sparkline) {
            this.drawSparkline(sparkline);
        }
    }

    handleMarketItemLeave(item) {
        // Remove hover effect
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = 'none';
    }

    simulateRealTimeData() {
        // Update prices every 3 seconds
        setInterval(() => {
            this.updateMarketPrices();
        }, 3000);

        // update ticker every 2 seconds
        setInterval(() => {
            this.updateTicker();
        }, 2000);

        // update hero chart every 1s
        this.heroChartTimer = setInterval(() => {
            this.updateHeroChart();
        }, 1000);
    }

    initHeroChart() {
        const container = document.getElementById('heroChartContainer');
        const canvas = document.getElementById('heroChartCanvas');
        if (!container || !canvas) return;

        // Basic responsive sizing
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = container.clientWidth;
            const h = container.clientHeight;
            // Ensure a minimum height
            const targetH = Math.max(260, h || 320);
            canvas.style.width = w + 'px';
            canvas.style.height = targetH + 'px';
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(targetH * dpr);
            this.drawHeroChart();
        };
        window.addEventListener('resize', utils.debounce(resize, 150));

        // Seed series
        this.heroSeries = [];
        this.heroBasePrice = 43256.78;
        for (let i = 0; i < 60; i++) {
            this.heroBasePrice += (Math.random() - 0.5) * 20;
            this.heroSeries.push(this.heroBasePrice);
        }
        resize();
    }

    updateHeroChart() {
        const canvas = document.getElementById('heroChartCanvas');
        if (!canvas || !this.heroSeries) return;
        // push new point with small random change
        const last = this.heroSeries[this.heroSeries.length - 1] || this.heroBasePrice || 43256.78;
        const next = last * (1 + (Math.random() - 0.5) * 0.0008); // +/-0.04%
        this.heroSeries.push(next);
        if (this.heroSeries.length > 120) this.heroSeries.shift();
        this.drawHeroChart();
    }

    drawHeroChart() {
        const canvas = document.getElementById('heroChartCanvas');
        if (!canvas || !this.heroSeries) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        // Clear
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        // Grid
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        for (let i = 0; i <= 5; i++) {
            const y = (i / 5) * height;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * width;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }

        // Compute scale
        const data = this.heroSeries;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const pad = (max - min) * 0.1 || 1;
        const yMin = min - pad;
        const yMax = max + pad;

        // Path
        ctx.lineWidth = 2;
        const rising = data[data.length - 1] >= data[0];
        const color = rising ? '#0ECB81' : '#F6465D';
        ctx.strokeStyle = color;
        ctx.beginPath();
        data.forEach((p, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((p - yMin) / (yMax - yMin)) * height;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Fill under curve
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, rising ? 'rgba(14,203,129,0.25)' : 'rgba(246,70,93,0.25)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Price label
        ctx.fillStyle = '#EAECEF';
        ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
        const last = data[data.length - 1];
        const changePct = ((last - data[0]) / data[0]) * 100;
        ctx.fillText(`BTC/USDT  ${last.toFixed(2)}  (${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%)`, 12, 18);
        ctx.restore();
    }

    updateMarketPrices() {
        document.querySelectorAll('.market-item').forEach(item => {
            const priceElement = item.querySelector('.coin-price');
            const changeElement = item.querySelector('.coin-change');

            if (priceElement && changeElement) {
                // Simulate price change
                const currentPrice = parseFloat(priceElement.textContent.replace('$', '').replace(',', ''));
                const changePercent = (Math.random() - 0.5) * 0.1; // -0.05% to +0.05%
                const newPrice = currentPrice * (1 + changePercent / 100);

                // Update price
                priceElement.textContent = `$${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                // Update change percentage
                const currentChange = parseFloat(changeElement.textContent.replace('%', '').replace('+', ''));
                const newChange = currentChange + changePercent;

                changeElement.textContent = `${newChange >= 0 ? '+' : ''}${newChange.toFixed(2)}%`;
                changeElement.className = `coin-change ${newChange >= 0 ? 'positive' : 'negative'}`;

                // Update sparkline
                const sparkline = item.querySelector('.sparkline');
                if (sparkline) {
                    this.drawSparkline(sparkline);
                }
            }
        });
    }

    updateTicker() {
        const tickerPrice = document.querySelector('.ticker-price');
        const tickerChange = document.querySelector('.ticker-change');

        if (tickerPrice && tickerChange) {
            const currentPrice = parseFloat(tickerPrice.textContent.replace('$', '').replace(',', ''));
            const change = (Math.random() - 0.5) * 100; // -$50 to +$50
            const newPrice = currentPrice + change;

            tickerPrice.textContent = `$${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            const changePercent = (change / currentPrice) * 100;
            tickerChange.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
            tickerChange.className = `ticker-change ${changePercent >= 0 ? 'positive' : 'negative'}`;
        }
    }

    animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .market-item');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-fade-in');
            }
        });
    }

    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (event?.clientX ?? rect.width / 2) - rect.left - size / 2;
        const y = (event?.clientY ?? rect.height / 2) - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 20px;
                    background-color: var(--color-bg-card);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    color: var(--color-text-primary);
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }

                .notification.success {
                    border-color: var(--color-success);
                    background-color: rgba(14, 203, 129, 0.1);
                }

                .notification.error {
                    border-color: var(--color-danger);
                    background-color: rgba(246, 70, 93, 0.1);
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .notification i {
                    font-size: 18px;
                }

                .notification.success i {
                    color: var(--color-success);
                }

                .notification.error i {
                    color: var(--color-danger);
                }

                .notification.info i {
                    color: var(--color-primary);
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.binanceApp = new BinanceApp();
    // Ensure auth UI refreshes once available
    setTimeout(() => {
        if (window.authManager && typeof window.authManager.checkAuthState === 'function') {
            window.authManager.checkAuthState();
        }
    }, 0);
});

// Add some additional utility functions
const utils = {
    formatNumber: (num) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    },

    formatPercent: (num) => {
        return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BinanceApp, utils };
}
