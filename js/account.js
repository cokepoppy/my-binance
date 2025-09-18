document.addEventListener('DOMContentLoaded', () => {
  // If not authenticated, redirect to homepage and show login
  const ensureAuth = () => {
    if (!window.authManager || !window.authManager.isAuthenticated()) {
      try {
        localStorage.setItem('post_login_redirect', 'account.html');
      } catch (e) {}
      window.location.href = 'index.html';
    }
  };

  // wait a tick to allow auth to initialize
  setTimeout(() => {
    ensureAuth();
    const data = window.authManager?.getUserData();
    if (!data) return;

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('accName', data.name || '—');
    setText('accEmail', data.email || '—');
    setText('accId', data.id || '—');
    setText('acc2fa', data.twoFactorEnabled ? 'Enabled' : 'Disabled');
    if (data.createdAt) {
      const d = new Date(data.createdAt);
      setText('accCreated', d.toLocaleString());
    }

    // Prefill editable fields
    const nameInput = document.getElementById('accNameInput');
    if (nameInput) nameInput.value = data.name || '';

    const goTrade = document.getElementById('btnGotoTrade');
    if (goTrade) goTrade.addEventListener('click', () => { window.location.href = 'trade.html'; });

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) btnLogout.addEventListener('click', () => {
      window.authManager.logout();
      window.location.href = 'index.html';
    });

    // Save profile changes
    const btnSave = document.getElementById('btnSaveProfile');
    const saveStatus = document.getElementById('profileSaveStatus');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const newName = (document.getElementById('accNameInput')?.value || '').trim();
        if (!newName) {
          if (saveStatus) saveStatus.textContent = 'Name cannot be empty';
          if (window.binanceApp) window.binanceApp.showNotification('Name cannot be empty', 'error');
          return;
        }
        const current = window.authManager?.getCurrentUser?.();
        if (!current) return;
        const updated = window.authManager.updateUser(current.id, { name: newName });
        // Update local display
        setText('accName', updated.name || '—');
        if (saveStatus) saveStatus.textContent = 'Saved';
        if (window.binanceApp) window.binanceApp.showNotification('Profile updated', 'success');
        // Clear status after brief delay
        setTimeout(() => { if (saveStatus) saveStatus.textContent = ''; }, 1500);
      });
    }
  }, 0);
});
