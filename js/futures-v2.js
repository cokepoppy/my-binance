// Futures v2 Landing Interactions
class FuturesLandingV2 {
    constructor() {
        this.kpis = {
            volume: { target: 234_500_000_000, prefix: '$', suffix: '', scale: 1 },
            oi: { target: 45_200_000_000, prefix: '$', suffix: '', scale: 1 },
            markets: { target: 320, prefix: '', suffix: '', scale: 1 }
        };
        this.ticker = { price: 43256.78, changePct: 2.34 };
        this.init();
    }

    init() {
        this.bindTabs();
        this.animateKpis();
        this.simulateData();
    }

    bindTabs() {
        const tabs = document.querySelectorAll('.tabs .tab');
        const panels = document.querySelectorAll('.tab-panel');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const id = tab.dataset.tab;
                tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                panels.forEach(p => {
                    const isActive = p.id === `panel-${id}`;
                    p.toggleAttribute('hidden', !isActive);
                    p.classList.toggle('active', isActive);
                });
            });
        });
    }

    animateKpis() {
        const duration = 900; // ms
        const start = performance.now();
        const els = {
            volume: document.querySelector('[data-kpi="volume"]'),
            oi: document.querySelector('[data-kpi="oi"]'),
            markets: document.querySelector('[data-kpi="markets"]'),
        };
        const formatNumber = (num) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
        const step = (t) => {
            const p = Math.min(1, (t - start) / duration);
            // ease-out
            const e = 1 - Math.pow(1 - p, 3);
            Object.entries(this.kpis).forEach(([key, cfg]) => {
                const val = Math.floor(cfg.target * e / cfg.scale);
                if (!els[key]) return;
                let text = `${cfg.prefix}${formatNumber(val)}`;
                if (cfg.suffix) text += cfg.suffix;
                els[key].textContent = text;
            });
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    simulateData() {
        // Update ticker
        setInterval(() => {
            const priceEl = document.querySelector('.ticker-price');
            const chgEl = document.querySelector('.ticker-change');
            if (!priceEl || !chgEl) return;
            const drift = (Math.random() - 0.5) * 60; // +/- $30
            this.ticker.price = Math.max(1000, this.ticker.price + drift);
            const pct = (drift / Math.max(1, this.ticker.price - drift)) * 100;
            this.ticker.changePct = Math.max(-9.99, Math.min(9.99, this.ticker.changePct + pct * 0.1));
            priceEl.textContent = `$${this.ticker.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            chgEl.textContent = `${this.ticker.changePct >= 0 ? '+' : ''}${this.ticker.changePct.toFixed(2)}%`;
            chgEl.classList.toggle('positive', this.ticker.changePct >= 0);
            chgEl.classList.toggle('negative', this.ticker.changePct < 0);
        }, 2000);

        // Update funding and change chips lightly
        const bumpRow = (row) => {
            const priceCell = row.querySelector('[data-price]');
            const chgChip = row.querySelector('[data-chg]');
            const fundingCell = row.querySelector('[data-funding]');
            if (!priceCell || !chgChip || !fundingCell) return;
            const cur = parseFloat(priceCell.textContent.replace(/[$,]/g, ''));
            const step = (Math.random() - 0.5) * (cur * 0.0008);
            const next = Math.max(0.01, cur + step);
            priceCell.textContent = `$${next.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const chg = parseFloat(chgChip.textContent.replace('%', '')) + (Math.random() - 0.5) * 0.2;
            chgChip.textContent = `${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%`;
            chgChip.classList.toggle('pos', chg >= 0);
            chgChip.classList.toggle('neg', chg < 0);
            // funding drift
            const f = (parseFloat(fundingCell.textContent) || 0) + (Math.random() - 0.5) * 0.001;
            fundingCell.textContent = `${f.toFixed(4)}%`;
        };
        setInterval(() => {
            document.querySelectorAll('#usdtmBody tr, #coinmBody tr').forEach(bumpRow);
        }, 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.futuresLandingV2 = new FuturesLandingV2();
});

