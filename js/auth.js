// Authentication System for Binance Clone

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
        this.setupFormValidation();
        this.setupPasswordStrength();
        this.setupGoogleSignIn();
    }

    // Modal Management
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.clearForm('loginForm');
        this.clearErrors();

        // Focus on email input
        setTimeout(() => {
            document.getElementById('loginEmail').focus();
        }, 100);
    }

    showRegisterModal() {
        const modal = document.getElementById('registerModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.clearForm('registerForm');
        this.clearErrors();

        // Focus on email input
        setTimeout(() => {
            document.getElementById('registerEmail').focus();
        }, 100);
    }

    showTwoFactorModal() {
        const modal = document.getElementById('twoFactorModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.clearForm('twoFactorForm');
        this.clearErrors();

        // Focus on 2FA code input
        setTimeout(() => {
            document.getElementById('twoFactorCode').focus();
        }, 100);
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.clearErrors();
    }

    // Form Management
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            // Clear password strength indicator
            if (formId === 'registerForm') {
                this.updatePasswordStrength('');
            }
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });

        const inputs = document.querySelectorAll('.form-group input');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }

    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (inputElement) {
            // Keep Binance yellow theme even on error
            inputElement.style.borderColor = 'var(--color-primary)';
        }
    }

    // User Management
    loadUsers() {
        const stored = localStorage.getItem('binance_users');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('binance_users', JSON.stringify(this.users));
    }

    createUser(userData) {
        const user = {
            id: this.generateUserId(),
            email: userData.email,
            password: this.hashPassword(userData.password),
            name: userData.email.split('@')[0], // Default name from email
            referralCode: userData.referralCode || '',
            twoFactorEnabled: false,
            twoFactorSecret: '',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            preferences: {
                theme: 'dark',
                language: 'en',
                notifications: true
            }
        };

        this.users.push(user);
        this.saveUsers();
        return user;
    }

    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    findUserById(userId) {
        return this.users.find(user => user.id === userId);
    }

    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            // Update user in list
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            const updated = this.users[userIndex];
            this.saveUsers();

            // Keep currentUser reference in sync
            if (this.currentUser && this.currentUser.id === updated.id) {
                this.currentUser = { ...updated };
                // Reflect immediately in header/UI where available
                this.updateUIForLoggedInUser(this.currentUser);
            }
            return updated;
        }
        return null;
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // Simple hash for demo purposes (in production, use proper hashing)
        return btoa(password + 'binance_salt');
    }

    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    // Authentication State
    login(user, rememberMe = false) {
        this.currentUser = user;

        // Update last login
        this.updateUser(user.id, { lastLogin: new Date().toISOString() });

        // Store session
        const sessionData = {
            userId: user.id,
            rememberMe: rememberMe,
            expires: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 30 days or 24 hours
        };

        localStorage.setItem('binance_session', JSON.stringify(sessionData));

        this.updateUIForLoggedInUser(user);
        this.showNotification('Login successful!', 'success');

        // Optional post-login redirect
        try {
            const redirect = localStorage.getItem('post_login_redirect');
            if (redirect) {
                localStorage.removeItem('post_login_redirect');
                setTimeout(() => { window.location.href = redirect; }, 300);
            }
        } catch (e) {}
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('binance_session');
        this.updateUIForLoggedOutUser();
        this.showNotification('Logged out successfully', 'info');
    }

    checkAuthState() {
        const sessionData = localStorage.getItem('binance_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                if (session.expires > Date.now()) {
                    const user = this.findUserById(session.userId);
                    if (user) {
                        this.currentUser = user;
                        this.updateUIForLoggedInUser(user);
                        return;
                    }
                }
                // Session expired or user not found
                localStorage.removeItem('binance_session');
            } catch (error) {
                localStorage.removeItem('binance_session');
            }
        }
        this.updateUIForLoggedOutUser();
    }

    // UI Updates
    updateUIForLoggedInUser(user) {
        // Hide login/register buttons
        const loginBtn = document.querySelector('.btn-login');
        const registerBtn = document.querySelector('.btn-register');

        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';

        // Show user button (click to My Page)
        const walletBtn = document.querySelector('.btn-wallet');
        if (walletBtn) {
            walletBtn.style.display = 'flex';
            walletBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name || '我的'}`;
            walletBtn.onclick = () => { window.location.href = 'account.html'; };
        }

        // Update user menu info
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');

        if (userNameElement) userNameElement.textContent = user.name;
        if (userEmailElement) userEmailElement.textContent = user.email;
    }

    updateUIForLoggedOutUser() {
        // Show login/register buttons
        const loginBtn = document.querySelector('.btn-login');
        const registerBtn = document.querySelector('.btn-register');

        if (loginBtn) {
            loginBtn.style.display = 'block';
            loginBtn.onclick = () => this.showLoginModal();
        }
        if (registerBtn) {
            registerBtn.style.display = 'block';
            registerBtn.onclick = () => this.showRegisterModal();
        }

        // Hide user button
        const walletBtn = document.querySelector('.btn-wallet');
        if (walletBtn) {
            walletBtn.style.display = 'none';
            walletBtn.onclick = null;
            walletBtn.innerHTML = `<i class="fas fa-wallet"></i> Wallet`;
        }

        // Hide user menu dropdown
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.remove('active');
        }
    }

    toggleUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.toggle('active');

            // Close menu when clicking outside
            const handleClickOutside = (event) => {
                if (!userMenu.contains(event.target) && !event.target.closest('.btn-wallet')) {
                    userMenu.classList.remove('active');
                    document.removeEventListener('click', handleClickOutside);
                }
            };

            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 100);
        }
    }

    // Form Validation
    setupFormValidation() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Two-factor form
        const twoFactorForm = document.getElementById('twoFactorForm');
        if (twoFactorForm) {
            twoFactorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTwoFactorSetup();
            });
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password.length >= 8;
    }

    validateTwoFactorCode(code) {
        return /^\d{6}$/.test(code);
    }

    // Authentication Handlers
    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        this.clearErrors();

        // Validation
        if (!email) {
            this.showError('loginEmail', 'Email is required');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('loginEmail', 'Please enter a valid email');
            return;
        }

        if (!password) {
            this.showError('loginPassword', 'Password is required');
            return;
        }

        // Find user
        const user = this.findUserByEmail(email);
        if (!user) {
            this.showError('loginEmail', 'User not found');
            return;
        }

        // Verify password
        if (!this.verifyPassword(password, user.password)) {
            this.showError('loginPassword', 'Incorrect password');
            return;
        }

        // Simulate loading
        const submitBtn = document.querySelector('#loginForm .btn-auth');
        submitBtn.disabled = true;
        submitBtn.classList.add('auth-loading');
        submitBtn.textContent = 'Logging in...';

        // Simulate API call
        setTimeout(() => {
            this.login(user, rememberMe);
            this.closeModal('loginModal');

            submitBtn.disabled = false;
            submitBtn.classList.remove('auth-loading');
            submitBtn.textContent = 'Log In';

            // If 2FA is enabled, show 2FA modal
            if (user.twoFactorEnabled) {
                this.showTwoFactorModal();
            }
        }, 1500);
    }

    async handleRegister() {
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const referralCode = document.getElementById('referralCode').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;

        this.clearErrors();

        // Validation
        if (!email) {
            this.showError('registerEmail', 'Email is required');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('registerEmail', 'Please enter a valid email');
            return;
        }

        if (!password) {
            this.showError('registerPassword', 'Password is required');
            return;
        }

        if (!this.validatePassword(password)) {
            this.showError('registerPassword', 'Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            this.showError('agreeTerms', 'You must agree to the terms and conditions');
            return;
        }

        // Check if user already exists
        if (this.findUserByEmail(email)) {
            this.showError('registerEmail', 'User already exists with this email');
            return;
        }

        // Simulate loading
        const submitBtn = document.querySelector('#registerForm .btn-auth');
        submitBtn.disabled = true;
        submitBtn.classList.add('auth-loading');
        submitBtn.textContent = 'Creating account...';

        // Simulate API call
        setTimeout(() => {
            // Create user
            const userData = { email, password, referralCode };
            const user = this.createUser(userData);

            // Login automatically
            this.login(user, true);
            this.closeModal('registerModal');

            submitBtn.disabled = false;
            submitBtn.classList.remove('auth-loading');
            submitBtn.textContent = 'Sign Up';

            // Show welcome message
            this.showNotification('Account created successfully! Welcome to Binance Clone!', 'success');
        }, 2000);
    }

    async handleTwoFactorSetup() {
        const code = document.getElementById('twoFactorCode').value.trim();
        const trustDevice = document.getElementById('trustDevice').checked;

        this.clearErrors();

        if (!code) {
            this.showError('twoFactorCode', 'Code is required');
            return;
        }

        if (!this.validateTwoFactorCode(code)) {
            this.showError('twoFactorCode', 'Please enter a valid 6-digit code');
            return;
        }

        // Simulate loading
        const submitBtn = document.querySelector('#twoFactorForm .btn-auth');
        submitBtn.disabled = true;
        submitBtn.classList.add('auth-loading');
        submitBtn.textContent = 'Verifying...';

        // Simulate API call
        setTimeout(() => {
            // Enable 2FA for user
            this.updateUser(this.currentUser.id, {
                twoFactorEnabled: true,
                twoFactorSecret: 'demo_secret_' + Math.random().toString(36).substr(2, 9)
            });

            this.closeModal('twoFactorModal');

            submitBtn.disabled = false;
            submitBtn.classList.remove('auth-loading');
            submitBtn.textContent = 'Verify & Complete Setup';

            this.showNotification('Two-factor authentication enabled successfully!', 'success');
        }, 1500);
    }

    // Password Strength
    setupPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value);
            });
        }
    }

    updatePasswordStrength(password) {
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        if (!strengthFill || !strengthText) return;

        let strength = 0;
        let strengthLabel = 'Password strength';

        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 12.5;
        if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;

        strengthFill.className = 'strength-fill';

        if (strength >= 75) {
            strengthFill.classList.add('strong');
            strengthLabel = 'Strong password';
        } else if (strength >= 50) {
            strengthFill.classList.add('medium');
            strengthLabel = 'Medium password';
        } else if (strength > 0) {
            strengthFill.classList.add('weak');
            strengthLabel = 'Weak password';
        }

        strengthText.textContent = strengthLabel;
    }

    // Event Listeners
    setupEventListeners() {
        // Modal close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.closeModal(activeModal.id);
                }
            }
        });

        // Form input validation
        this.setupInputValidation();

        // Cross-tab/page sync via localStorage events
        window.addEventListener('storage', (e) => {
            if (!e) return;
            if (e.key === 'binance_users' || e.key === 'binance_session') {
                try {
                    const sessionRaw = localStorage.getItem('binance_session');
                    if (!sessionRaw) {
                        // No session anymore
                        this.currentUser = null;
                        this.updateUIForLoggedOutUser();
                        return;
                    }
                    const session = JSON.parse(sessionRaw);
                    const freshUser = this.findUserById(session.userId);
                    if (freshUser) {
                        this.currentUser = freshUser;
                        this.updateUIForLoggedInUser(freshUser);
                    }
                } catch (err) {
                    // Fallback to re-check auth state on parse issues
                    this.checkAuthState();
                }
            }
        });

        // Password visibility toggles
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.toggle-password');
            if (!btn) return;
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;
            const isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    setupInputValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                const email = e.target.value.trim();
                if (email && !this.validateEmail(email)) {
                    this.showError(e.target.id, 'Please enter a valid email');
                } else {
                    this.clearFieldError(e.target.id);
                }
            });
        });

        // Password validation
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                const password = e.target.value;
                if (password && !this.validatePassword(password)) {
                    this.showError(e.target.id, 'Password must be at least 8 characters');
                } else {
                    this.clearFieldError(e.target.id);
                }
            });
        });
    }

    clearFieldError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);

        if (errorElement) {
            errorElement.textContent = '';
        }

        if (inputElement) {
            inputElement.style.borderColor = '';
        }
    }

    // Social Login (Simulated)
    handleSocialLogin(provider) {
        this.showNotification(`Connecting to ${provider}...`, 'info');

        setTimeout(() => {
            // Simulate social login
            const mockUser = {
                id: this.generateUserId(),
                email: `user_${Date.now()}@${provider.toLowerCase()}.com`,
                name: `${provider} User`,
                password: this.hashPassword('social_login'),
                twoFactorEnabled: false,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                preferences: {
                    theme: 'dark',
                    language: 'en',
                    notifications: true
                }
            };

            this.createUser(mockUser);
            this.login(mockUser, true);
            this.closeModal('loginModal');
            this.closeModal('registerModal');
        }, 1500);
    }

    // Google Identity Services (real client-side integration)
    setupGoogleSignIn() {
        const clientId = (window.APP_CONFIG && window.APP_CONFIG.googleClientId) ||
            (document.querySelector('meta[name="google-client-id"]')?.content || '').trim();

        if (!clientId) return; // no client id configured
        if (typeof window.google === 'undefined' || !window.google.accounts?.id) {
            // Google script may load later; retry once on load
            window.addEventListener('load', () => this.setupGoogleSignIn());
            return;
        }

        try {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => this.handleGoogleCredential(response.credential)
            });

            const container = document.getElementById('googleSignIn');
            if (container) {
                window.google.accounts.id.renderButton(container, {
                    theme: 'outline',
                    size: 'large',
                    width: 400,
                });
            }
        } catch (e) {
            console.warn('Google Sign-In init failed:', e);
        }
    }

    handleGoogleCredential(credential) {
        // Decode JWT (client-side; for demo only, not secure verification)
        try {
            const payload = this.decodeJwtPayload(credential);
            const email = payload.email || `user_${payload.sub}@google.local`;
            let user = this.findUserByEmail(email);
            if (!user) {
                user = this.createUser({ email, password: 'google_oauth' });
                user.name = payload.name || (payload.given_name ? `${payload.given_name}` : email.split('@')[0]);
                this.saveUsers();
            }
            this.login(user, true);
            this.closeModal('loginModal');
            this.closeModal('registerModal');
            this.showNotification('Signed in with Google', 'success');
        } catch (e) {
            console.warn('Failed to parse Google credential', e);
            this.showNotification('Google sign-in failed', 'error');
        }
    }

    decodeJwtPayload(jwt) {
        const parts = jwt.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT');
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(atob(b64).split('').map(c => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(json);
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        if (window.binanceApp && window.binanceApp.showNotification) {
            window.binanceApp.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Public API
    getUserData() {
        return this.currentUser ? {
            id: this.currentUser.id,
            email: this.currentUser.email,
            name: this.currentUser.name,
            twoFactorEnabled: this.currentUser.twoFactorEnabled,
            createdAt: this.currentUser.createdAt,
            preferences: this.currentUser.preferences
        } : null;
    }
}

// Global functions for onclick handlers
let authManager;

function showLoginModal() {
    if (authManager) {
        authManager.showLoginModal();
    }
}

function showRegisterModal() {
    if (authManager) {
        authManager.showRegisterModal();
    }
}

function closeModal(modalId) {
    if (authManager) {
        authManager.closeModal(modalId);
    }
}

function switchToRegister() {
    if (authManager) {
        authManager.closeModal('loginModal');
        authManager.showRegisterModal();
    }
}

function switchToLogin() {
    if (authManager) {
        authManager.closeModal('registerModal');
        authManager.showLoginModal();
    }
}

function logout() {
    if (authManager) {
        authManager.logout();
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();

    // Make auth manager globally available
    window.authManager = authManager;

    // Set up social login buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-social')) {
            const btn = e.target.closest('.btn-social');
            const icon = btn.querySelector('i');
            let provider = 'Unknown';

            if (icon.classList.contains('fa-google')) {
                provider = 'Google';
            } else if (icon.classList.contains('fa-apple')) {
                provider = 'Apple';
            }

            if (authManager) {
                authManager.handleSocialLogin(provider);
            }
        }
    });
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager };
}
