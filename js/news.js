// News Page JavaScript
class NewsEngine {
    constructor() {
        this.currentCategory = 'all';
        this.articles = [
            {
                id: 1,
                title: "Bitcoin Reaches New All-Time High as Institutional Adoption Accelerates",
                excerpt: "Bitcoin has surged past $45,000 for the first time in history, driven by increased institutional adoption and growing mainstream acceptance...",
                content: "Bitcoin has achieved a historic milestone, surpassing the $45,000 mark for the first time ever. This remarkable surge is fueled by unprecedented institutional interest, with major corporations and investment firms adding BTC to their balance sheets. The cryptocurrency market as a whole has benefited from this momentum, with the total market capitalization exceeding $2 trillion.",
                category: "market",
                author: "Sarah Johnson",
                date: "January 15, 2024",
                readTime: "5 min read",
                image: "https://picsum.photos/seed/bitcoin-news/600/400.jpg",
                featured: true,
                views: 156000,
                likes: 2300
            },
            {
                id: 2,
                title: "Ethereum 2.0 Upgrade Shows Promising Results",
                excerpt: "The latest Ethereum network upgrade demonstrates significant improvements in scalability and energy efficiency...",
                content: "Ethereum's latest upgrade has delivered impressive results, with transaction speeds increasing by 60% and energy consumption decreasing by 99.9%. The successful implementation of the upgrade marks a major milestone in Ethereum's transition to a more sustainable and scalable blockchain ecosystem.",
                category: "technology",
                author: "Mike Chen",
                date: "January 14, 2024",
                readTime: "3 min read",
                image: "https://picsum.photos/seed/ethereum-upgrade/400/250.jpg",
                featured: false,
                views: 89000,
                likes: 1200
            },
            {
                id: 3,
                title: "EU Approves Comprehensive Crypto Regulatory Framework",
                excerpt: "The European Union has voted to implement new regulations that provide clear guidelines for cryptocurrency operations...",
                content: "The European Parliament has approved the Markets in Crypto-Assets (MiCA) regulation, establishing a comprehensive framework for cryptocurrency regulation across the EU. This landmark decision provides legal certainty for crypto businesses and protects investors while fostering innovation in the digital asset space.",
                category: "regulation",
                author: "Emma Williams",
                date: "January 13, 2024",
                readTime: "4 min read",
                image: "https://picsum.photos/seed/crypto-regulation/400/250.jpg",
                featured: false,
                views: 124000,
                likes: 1800
            },
            {
                id: 4,
                title: "DeFi Platform Announces Record-Breaking Yield Farming Opportunities",
                excerpt: "A leading decentralized finance platform introduces new mechanisms for users to earn higher yields on their crypto assets...",
                content: "Innovative DeFi protocols are pushing the boundaries of yield generation, with some platforms offering unprecedented returns through sophisticated liquidity mining strategies. These developments are attracting both retail and institutional investors seeking higher yields in the current market environment.",
                category: "defi",
                author: "David Park",
                date: "January 12, 2024",
                readTime: "6 min read",
                image: "https://picsum.photos/seed/defi-platform/400/250.jpg",
                featured: false,
                views: 76000,
                likes: 900
            },
            {
                id: 5,
                title: "Revolutionary Blockchain Technology Promises 100x Speed Improvement",
                excerpt: "A new blockchain protocol claims to achieve unprecedented transaction speeds while maintaining security and decentralization...",
                content: "Breakthrough blockchain technology is promising to solve the scalability trilemma, offering transaction speeds 100 times faster than existing networks while maintaining security and decentralization. This innovation could revolutionize the blockchain industry and enable mass adoption of cryptocurrency technology.",
                category: "technology",
                author: "Lisa Zhang",
                date: "January 11, 2024",
                readTime: "5 min read",
                image: "https://picsum.photos/seed/blockchain-tech/400/250.jpg",
                featured: false,
                views: 98000,
                likes: 1400
            },
            {
                id: 6,
                title: "NFT Marketplace Sees Unprecedented Growth in Digital Art Sales",
                excerpt: "Digital art sales on major NFT marketplaces have reached new heights, with several pieces selling for millions...",
                content: "The NFT market is experiencing explosive growth, with digital art collections achieving record-breaking sales volumes. Major artists and creators are embracing the technology, while institutional collectors are entering the market, driving prices and trading volumes to unprecedented levels.",
                category: "nft",
                author: "James Rodriguez",
                date: "January 10, 2024",
                readTime: "4 min read",
                image: "https://picsum.photos/seed/nft-marketplace/400/250.jpg",
                featured: false,
                views: 112000,
                likes: 1600
            },
            {
                id: 7,
                title: "Crypto Market Cap Surpasses $2 Trillion Mark",
                excerpt: "The total cryptocurrency market capitalization has exceeded $2 trillion for the first time, signaling growing investor confidence...",
                content: "The cryptocurrency market has achieved another historic milestone, with total market capitalization surpassing $2 trillion. This achievement reflects growing institutional adoption and increasing mainstream acceptance of digital assets as a legitimate investment class.",
                category: "market",
                author: "Rachel Green",
                date: "January 9, 2024",
                readTime: "3 min read",
                image: "https://picsum.photos/seed/crypto-market/400/250.jpg",
                featured: false,
                views: 145000,
                likes: 2100
            },
            {
                id: 8,
                title: "Central Banks Explore CBDC Development Amid Digital Currency Boom",
                excerpt: "Multiple central banks worldwide are accelerating their Central Bank Digital Currency development programs...",
                content: "Central banks across the globe are intensifying efforts to develop their own digital currencies, responding to the growing popularity of cryptocurrencies and the need for modernized payment systems. These initiatives could reshape the global financial landscape.",
                category: "regulation",
                author: "Thomas Anderson",
                date: "January 8, 2024",
                readTime: "5 min read",
                image: "https://picsum.photos/seed/cbdc-development/400/250.jpg",
                featured: false,
                views: 87000,
                likes: 1100
            }
        ];

        this.marketSentiment = {
            fearGreedIndex: 78,
            marketCapDominance: "BTC: 48.5%",
            volume24h: "$234.5B",
            btcDominance: 48.5,
            ethDominance: 18.2,
            altcoinDominance: 33.3
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderNews();
        this.renderMarketAnalysis();
        this.setupNewsletter();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // Search functionality
        document.getElementById('newsSearch')?.addEventListener('input', (e) => {
            this.searchArticles(e.target.value);
        });

        // Newsletter form
        document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.subscribeNewsletter();
        });

        // Article click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.news-card')) {
                const articleId = e.target.closest('.news-card').dataset.articleId;
                this.showArticle(articleId);
            }
        });
    }

    renderNews() {
        const container = document.getElementById('newsGrid');
        if (!container) return;

        const filteredArticles = this.currentCategory === 'all'
            ? this.articles
            : this.articles.filter(article => article.category === this.currentCategory);

        container.innerHTML = filteredArticles.map(article => `
            <article class="news-card" data-category="${article.category}" data-article-id="${article.id}">
                <div class="card-image">
                    <img src="${article.image}" alt="${article.title}">
                    <span class="article-tag">${this.getCategoryLabel(article.category)}</span>
                </div>
                <div class="card-content">
                    <h3>${article.title}</h3>
                    <p class="card-excerpt">${article.excerpt}</p>
                    <div class="card-meta">
                        <span class="date">${article.date}</span>
                        <span class="read-time">${article.readTime}</span>
                        <span class="views">${article.views.toLocaleString()} views</span>
                    </div>
                </div>
            </article>
        `).join('');

        // Update featured article
        this.updateFeaturedArticle();
    }

    updateFeaturedArticle() {
        const featuredArticle = this.articles.find(article => article.featured);
        if (!featuredArticle) return;

        const featuredContainer = document.querySelector('.featured-article');
        if (featuredContainer) {
            featuredContainer.innerHTML = `
                <div class="article-content">
                    <span class="article-tag featured">Featured</span>
                    <h1>${featuredArticle.title}</h1>
                    <p class="article-excerpt">${featuredArticle.excerpt}</p>
                    <div class="article-meta">
                        <span class="author">By ${featuredArticle.author}</span>
                        <span class="date">${featuredArticle.date}</span>
                        <span class="read-time">${featuredArticle.readTime}</span>
                    </div>
                    <button class="btn-primary" onclick="newsEngine.showArticle(${featuredArticle.id})">Read Full Article</button>
                </div>
                <div class="article-image">
                    <img src="${featuredArticle.image}" alt="${featuredArticle.title}">
                </div>
            `;
        }
    }

    renderMarketAnalysis() {
        // Update sentiment indicators
        const sentimentContainer = document.querySelector('.sentiment-indicators');
        if (sentimentContainer) {
            sentimentContainer.innerHTML = `
                <div class="sentiment-item">
                    <span class="label">Fear & Greed Index:</span>
                    <span class="value ${this.getSentimentClass(this.marketSentiment.fearGreedIndex)}">
                        ${this.getSentimentLabel(this.marketSentiment.fearGreedIndex)} (${this.marketSentiment.fearGreedIndex})
                    </span>
                </div>
                <div class="sentiment-item">
                    <span class="label">Market Cap Dominance:</span>
                    <span class="value">${this.marketSentiment.marketCapDominance}</span>
                </div>
                <div class="sentiment-item">
                    <span class="label">Volume (24h):</span>
                    <span class="value">${this.marketSentiment.volume24h}</span>
                </div>
            `;
        }

        // Render dominance chart
        this.renderDominanceChart();
    }

    renderDominanceChart() {
        const chartContainer = document.querySelector('.chart-placeholder');
        if (!chartContainer) return;

        // Create a simple canvas chart for market dominance
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        chartContainer.innerHTML = '';
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const data = [
            { label: 'BTC', value: this.marketSentiment.btcDominance, color: '#F7931A' },
            { label: 'ETH', value: this.marketSentiment.ethDominance, color: '#627EEA' },
            { label: 'Others', value: this.marketSentiment.altcoinDominance, color: '#3498DB' }
        ];

        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;

        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;

            ctx.beginPath();
            ctx.arc(150, 100, 80, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(150, 100);
            ctx.fillStyle = item.color;
            ctx.fill();

            // Add labels
            const labelX = 150 + Math.cos(currentAngle + sliceAngle / 2) * 100;
            const labelY = 100 + Math.sin(currentAngle + sliceAngle / 2) * 100;

            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${item.label}: ${item.value}%`, labelX, labelY);

            currentAngle += sliceAngle;
        });
    }

    getCategoryLabel(category) {
        const labels = {
            market: 'Market Analysis',
            regulation: 'Regulation',
            technology: 'Technology',
            defi: 'DeFi',
            nft: 'NFT'
        };
        return labels[category] || category;
    }

    getSentimentClass(index) {
        if (index >= 75) return 'greed';
        if (index <= 25) return 'fear';
        return 'neutral';
    }

    getSentimentLabel(index) {
        if (index >= 75) return 'Greed';
        if (index <= 25) return 'Fear';
        return 'Neutral';
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.renderNews();
    }

    searchArticles(searchTerm) {
        const cards = document.querySelectorAll('.news-card');
        const term = searchTerm.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const excerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();

            if (title.includes(term) || excerpt.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    showArticle(articleId) {
        const article = this.articles.find(a => a.id == articleId);
        if (!article) return;

        // In a real application, this would navigate to article detail page
        // For now, show the article content in a modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content article-modal">
                <div class="modal-header">
                    <h2>${article.title}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="article-meta">
                        <span class="author">By ${article.author}</span>
                        <span class="date">${article.date}</span>
                        <span class="read-time">${article.readTime}</span>
                    </div>
                    <img src="${article.image}" alt="${article.title}" style="width: 100%; margin: 20px 0;">
                    <div class="article-content">
                        <p>${article.content}</p>
                    </div>
                    <div class="article-actions">
                        <button class="btn-primary" onclick="likeArticle(${article.id})">
                            <i class="fas fa-heart"></i> Like (${article.likes})
                        </button>
                        <button class="btn-secondary" onclick="shareArticle(${article.id})">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupNewsletter() {
        const form = document.querySelector('.newsletter-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                if (email) {
                    alert('Thank you for subscribing to our newsletter!');
                    form.reset();
                }
            });
        }
    }

    subscribeNewsletter() {
        const email = document.querySelector('.newsletter-form input[type="email"]').value;
        if (email) {
            // In a real application, this would send to a backend
            alert('Successfully subscribed to newsletter!');
            document.querySelector('.newsletter-form').reset();
        }
    }

    startRealTimeUpdates() {
        // Update market sentiment every 30 seconds
        setInterval(() => {
            this.updateMarketSentiment();
        }, 30000);

        // Update article views every minute
        setInterval(() => {
            this.updateArticleViews();
        }, 60000);
    }

    updateMarketSentiment() {
        // Simulate small changes in market sentiment
        this.marketSentiment.fearGreedIndex += (Math.random() - 0.5) * 2;
        this.marketSentiment.fearGreedIndex = Math.max(0, Math.min(100, this.marketSentiment.fearGreedIndex));

        // Update volume
        const volumeChange = (Math.random() - 0.5) * 10;
        const currentVolume = parseFloat(this.marketSentiment.volume24h.replace('$', '').replace('B', ''));
        this.marketSentiment.volume24h = `$${(currentVolume + volumeChange).toFixed(1)}B`;

        this.renderMarketAnalysis();
    }

    updateArticleViews() {
        // Simulate increasing view counts
        this.articles.forEach(article => {
            article.views += Math.floor(Math.random() * 50) + 10;
        });

        // Update view counts in the displayed articles
        document.querySelectorAll('.news-card').forEach(card => {
            const articleId = parseInt(card.dataset.articleId);
            const article = this.articles.find(a => a.id === articleId);
            if (article) {
                const viewElement = card.querySelector('.views');
                if (viewElement) {
                    viewElement.textContent = `${article.views.toLocaleString()} views`;
                }
            }
        });
    }
}

// Initialize news engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.newsEngine = new NewsEngine();
});

// Global functions
function likeArticle(articleId) {
    const article = window.newsEngine?.articles.find(a => a.id === articleId);
    if (article) {
        article.likes += 1;
        alert(`Liked! Total likes: ${article.likes}`);
    }
}

function shareArticle(articleId) {
    const article = window.newsEngine?.articles.find(a => a.id === articleId);
    if (article) {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Article link copied to clipboard!');
        }
    }
}