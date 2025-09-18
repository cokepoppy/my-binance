// Support Page JavaScript
class SupportEngine {
    constructor() {
        this.tickets = [];
        this.faqs = [
            {
                id: 1,
                question: "How do I create a Binance account?",
                answer: "Creating a Binance account is simple. Click on the 'Register' button in the top right corner, fill in your email address, create a strong password, and complete the verification process. You'll need to verify your email and enable two-factor authentication for security.",
                category: "account",
                views: 15600,
                helpful: 145
            },
            {
                id: 2,
                question: "How long does a deposit take to process?",
                answer: "Deposit processing times vary by cryptocurrency and network conditions. Typically, Bitcoin deposits take 10-60 minutes, Ethereum deposits take 5-20 minutes, and other altcoins may vary. Network congestion can affect processing times.",
                category: "deposit",
                views: 12300,
                helpful: 132
            },
            {
                id: 3,
                question: "What are the trading fees on Binance?",
                answer: "Binance charges a standard 0.1% trading fee for both makers and takers. Fees can be reduced by holding BNB (Binance Coin) in your account. VIP users with high trading volumes enjoy lower fee tiers starting from 0.02%.",
                category: "trading",
                views: 18900,
                helpful: 167
            },
            {
                id: 4,
                question: "How do I enable two-factor authentication?",
                answer: "To enable 2FA, go to your account settings, click on 'Security', and select 'Two-Factor Authentication'. Download an authenticator app like Google Authenticator, scan the QR code, and save your backup key in a safe place.",
                category: "security",
                views: 9800,
                helpful: 189
            },
            {
                id: 5,
                question: "What is the minimum deposit amount?",
                answer: "Minimum deposit amounts vary by cryptocurrency. For Bitcoin, it's 0.0001 BTC, for Ethereum it's 0.001 ETH, and for USDT it's 1 USDT. Always check the deposit page for the most current minimum amounts.",
                category: "deposit",
                views: 7600,
                helpful: 98
            }
        ];

        this.helpCategories = [
            {
                id: 'account',
                name: 'Account & Security',
                icon: 'fas fa-user-circle',
                description: 'Login, 2FA, verification, and account security',
                articles: 156,
                color: '#F0B90B'
            },
            {
                id: 'trading',
                name: 'Trading & Fees',
                icon: 'fas fa-chart-line',
                description: 'How to trade, fee structure, and trading limits',
                articles: 234,
                color: '#0ECB81'
            },
            {
                id: 'deposit',
                name: 'Deposits & Withdrawals',
                icon: 'fas fa-download',
                description: 'How to deposit and withdraw cryptocurrencies',
                articles: 189,
                color: '#627EEA'
            },
            {
                id: 'wallet',
                name: 'Wallet Management',
                icon: 'fas fa-wallet',
                description: 'Managing your crypto wallet and balances',
                articles: 145,
                color: '#F6465D'
            },
            {
                id: 'security',
                name: 'Security',
                icon: 'fas fa-shield-alt',
                description: 'Security best practices and protection',
                articles: 98,
                color: '#E84142'
            },
            {
                id: 'api',
                name: 'API & Developers',
                icon: 'fas fa-code',
                description: 'API documentation and developer resources',
                articles: 267,
                color: '#00D4AA'
            }
        ];

        this.communityStats = {
            members: 2500000,
            discussions: 50000,
            successRate: 95,
            onlineAgents: 45
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderFAQs();
        this.setupSearch();
        this.setupLiveChat();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // FAQ toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                this.toggleFAQ(e.target.closest('.faq-item'));
            }
        });

        // Category cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-card')) {
                const categoryId = e.target.closest('.category-card').dataset.category;
                this.showCategoryArticles(categoryId);
            }
        });

        // Quick action cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.action-card')) {
                const action = e.target.closest('.action-card').dataset.action;
                this.handleQuickAction(action);
            }
        });

        // Search functionality
        document.querySelector('.search-bar input')?.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // Newsletter form
        document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.subscribeNewsletter();
        });

        // Community forum actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="joinCommunity"]')) {
                this.joinCommunity();
            } else if (e.target.matches('[onclick*="browseForum"]')) {
                this.browseForum();
            }
        });
    }

    renderFAQs() {
        const container = document.querySelector('.faq-container');
        if (!container) return;

        container.innerHTML = this.faqs.map(faq => `
            <div class="faq-item" data-category="${faq.category}">
                <div class="faq-question">
                    <h3>${faq.question}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                    <div class="faq-feedback">
                        <span class="views">${faq.views.toLocaleString()} views</span>
                        <span class="helpful">${faq.helpful} found this helpful</span>
                        <button onclick="supportEngine.markFAQHelpful(${faq.id})" class="helpful-btn">
                            <i class="fas fa-thumbs-up"></i> Helpful
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleFAQ(faqItem) {
        const wasActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!wasActive) {
            faqItem.classList.add('active');

            // Track view
            const faqId = parseInt(faqItem.dataset.id);
            const faq = this.faqs.find(f => f.id === faqId);
            if (faq) {
                faq.views += 1;
            }
        }
    }

    showCategoryArticles(categoryId) {
        const category = this.helpCategories.find(cat => cat.id === categoryId);
        if (!category) return;

        // In a real application, this would navigate to category page
        // For now, show a modal with category information
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${category.name}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="category-info">
                        <i class="${category.icon}" style="color: ${category.color}; font-size: 3rem; margin-bottom: 1rem;"></i>
                        <p>${category.description}</p>
                        <div class="category-stats">
                            <span><i class="fas fa-file-alt"></i> ${category.articles} articles</span>
                            <span><i class="fas fa-eye"></i> ${(category.articles * 50).toLocaleString()} views</span>
                        </div>
                    </div>
                    <div class="popular-articles">
                        <h3>Popular Articles</h3>
                        <ul>
                            ${this.getPopularArticles(categoryId).map(article => `
                                <li>
                                    <a href="#" onclick="supportEngine.showArticle(${article.id}); return false;">
                                        ${article.title}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    getPopularArticles(categoryId) {
        // Return mock popular articles for category
        const articles = {
            account: [
                { id: 101, title: "How to reset your password" },
                { id: 102, title: "Account verification process" },
                { id: 103, title: "Setting up 2FA for beginners" }
            ],
            trading: [
                { id: 201, title: "Understanding limit orders" },
                { id: 202, title: "How to read trading charts" },
                { id: 203, title: "Risk management strategies" }
            ],
            deposit: [
                { id: 301, title: "Deposit confirmation times" },
                { id: 302, title: "Supported deposit methods" },
                { id: 303, title: "Troubleshooting deposit issues" }
            ],
            wallet: [
                { id: 401, title: "Creating multiple wallets" },
                { id: 402, title: "Wallet security best practices" },
                { id: 403, title: "Understanding wallet types" }
            ],
            security: [
                { id: 501, title: "Protecting your account from hackers" },
                { id: 502, title: "Recognizing phishing attempts" },
                { id: 503, title: "Device security recommendations" }
            ],
            api: [
                { id: 601, title: "Getting started with Binance API" },
                { id: 602, title: "API rate limits explained" },
                { id: 603, title: "Creating your first trading bot" }
            ]
        };

        return articles[categoryId] || [];
    }

    handleQuickAction(action) {
        switch (action) {
            case 'live-chat':
                this.startLiveChat();
                break;
            case 'submit-ticket':
                this.submitTicket();
                break;
            case 'phone-support':
                this.callSupport();
                break;
            default:
                this.showContactOptions();
        }
    }

    startLiveChat() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content chat-modal">
                <div class="modal-header">
                    <h2>Live Chat Support</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="chat-container">
                        <div class="chat-messages">
                            <div class="message bot">
                                <div class="message-content">
                                    <p>Hello! Welcome to Binance Support. How can I help you today?</p>
                                </div>
                            </div>
                        </div>
                        <div class="chat-input">
                            <input type="text" placeholder="Type your message..." id="chatInput">
                            <button onclick="supportEngine.sendChatMessage()">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Focus on input
        setTimeout(() => {
            document.getElementById('chatInput')?.focus();
        }, 100);
    }

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message) return;

        const chatMessages = document.querySelector('.chat-messages');

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<div class="message-content"><p>${message}</p></div>`;
        chatMessages.appendChild(userMessage);

        // Clear input
        input.value = '';

        // Simulate bot response
        setTimeout(() => {
            const botResponse = this.generateBotResponse(message);
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = `<div class="message-content"><p>${botResponse}</p></div>`;
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateBotResponse(message) {
        const responses = [
            "I understand your concern. Let me help you with that.",
            "Thank you for reaching out. I'm here to assist you.",
            "I'll do my best to resolve your issue. Can you provide more details?",
            "That's a great question. Let me find the information you need.",
            "I'm here to help. Could you elaborate on what you're experiencing?",
            "Thank you for contacting support. I'll guide you through this process."
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    submitTicket() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Submit Support Ticket</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="ticketForm">
                        <div class="form-group">
                            <label for="ticketSubject">Subject</label>
                            <input type="text" id="ticketSubject" required>
                        </div>
                        <div class="form-group">
                            <label for="ticketCategory">Category</label>
                            <select id="ticketCategory" required>
                                <option value="">Select a category</option>
                                <option value="account">Account Issues</option>
                                <option value="trading">Trading Problems</option>
                                <option value="deposit">Deposit/Withdrawal</option>
                                <option value="technical">Technical Issues</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="ticketDescription">Description</label>
                            <textarea id="ticketDescription" rows="5" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="ticketPriority">Priority</label>
                            <select id="ticketPriority" required>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-primary">Submit Ticket</button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Handle form submission
        document.getElementById('ticketForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTicket();
        });
    }

    createTicket() {
        const ticket = {
            id: Date.now(),
            subject: document.getElementById('ticketSubject').value,
            category: document.getElementById('ticketCategory').value,
            description: document.getElementById('ticketDescription').value,
            priority: document.getElementById('ticketPriority').value,
            status: 'open',
            createdAt: new Date().toISOString()
        };

        this.tickets.push(ticket);

        // Close modal
        document.querySelector('.modal')?.remove();

        alert(`Ticket #${ticket.id} created successfully! We'll respond within 24 hours.`);
    }

    callSupport() {
        alert('Phone Support: +1 (555) 123-4567\n\nHours: Mon-Fri 9AM-6PM EST\n\nFor emergency support, please use live chat.');
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            this.renderFAQs();
            return;
        }

        const searchResults = this.faqs.filter(faq =>
            faq.question.toLowerCase().includes(query.toLowerCase()) ||
            faq.answer.toLowerCase().includes(query.toLowerCase())
        );

        const container = document.querySelector('.faq-container');
        if (container) {
            if (searchResults.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>No results found</h3>
                        <p>Try searching with different keywords or browse our help categories.</p>
                    </div>
                `;
            } else {
                container.innerHTML = searchResults.map(faq => `
                    <div class="faq-item" data-category="${faq.category}">
                        <div class="faq-question">
                            <h3>${this.highlightSearchTerm(faq.question, query)}</h3>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="faq-answer">
                            <p>${this.highlightSearchTerm(faq.answer, query)}</p>
                            <div class="faq-feedback">
                                <span class="views">${faq.views.toLocaleString()} views</span>
                                <span class="helpful">${faq.helpful} found this helpful</span>
                                <button onclick="supportEngine.markFAQHelpful(${faq.id})" class="helpful-btn">
                                    <i class="fas fa-thumbs-up"></i> Helpful
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    highlightSearchTerm(text, term) {
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    markFAQHelpful(faqId) {
        const faq = this.faqs.find(f => f.id === faqId);
        if (faq) {
            faq.helpful += 1;
            alert('Thank you for your feedback!');
        }
    }

    joinCommunity() {
        alert('Join our community forum to connect with other traders and get help from experienced users!');
    }

    browseForum() {
        alert('Browse our community forum to find answers and share your knowledge with others!');
    }

    setupLiveChat() {
        // Initialize live chat status
        this.updateLiveChatStatus();
    }

    updateLiveChatStatus() {
        const statusElements = document.querySelectorAll('.status.online');
        const isOnline = this.communityStats.onlineAgents > 0;

        statusElements.forEach(element => {
            if (isOnline) {
                element.textContent = 'Online Now';
                element.className = 'status online';
            } else {
                element.textContent = 'Offline';
                element.className = 'status offline';
            }
        });
    }

    subscribeNewsletter() {
        const email = document.querySelector('.newsletter-form input[type="email"]').value;
        if (email) {
            alert('Thank you for subscribing to our support newsletter!');
            document.querySelector('.newsletter-form').reset();
        }
    }

    startRealTimeUpdates() {
        // Update community stats every 30 seconds
        setInterval(() => {
            this.updateCommunityStats();
        }, 30000);

        // Update live chat status every minute
        setInterval(() => {
            this.updateLiveChatStatus();
        }, 60000);
    }

    updateCommunityStats() {
        // Simulate small changes in community stats
        this.communityStats.members += Math.floor(Math.random() * 100) - 50;
        this.communityStats.discussions += Math.floor(Math.random() * 10) - 5;
        this.communityStats.onlineAgents += Math.floor(Math.random() * 5) - 2;

        // Ensure values don't go negative
        this.communityStats.members = Math.max(0, this.communityStats.members);
        this.communityStats.discussions = Math.max(0, this.communityStats.discussions);
        this.communityStats.onlineAgents = Math.max(0, this.communityStats.onlineAgents);

        // Update UI
        this.updateCommunityStatsUI();
    }

    updateCommunityStatsUI() {
        const statElements = document.querySelectorAll('.stat-item h3');
        if (statElements.length >= 3) {
            statElements[0].textContent = `${(this.communityStats.members / 1000000).toFixed(1)}M+ Members`;
            statElements[1].textContent = `${this.communityStats.discussions.toLocaleString()}+ Discussions`;
            statElements[2].textContent = `${this.communityStats.successRate}% Success Rate`;
        }
    }
}

// Initialize support engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.supportEngine = new SupportEngine();
});

// Global functions
function toggleFAQ(faqItem) {
    window.supportEngine?.toggleFAQ(faqItem);
}

function showCategory(categoryId) {
    window.supportEngine?.showCategoryArticles(categoryId);
}

function startLiveChat() {
    window.supportEngine?.startLiveChat();
}

function submitTicket() {
    window.supportEngine?.submitTicket();
}

function callSupport() {
    window.supportEngine?.callSupport();
}

function joinCommunity() {
    window.supportEngine?.joinCommunity();
}

function browseForum() {
    window.supportEngine?.browseForum();
}