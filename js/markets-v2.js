// Markets v2 (Binance-style)
(function(){
  class MarketsV2 {
    constructor(){
      this.all = this.seed();
      this.filtered = [...this.all];
      this.page = 1; this.perPage = 12;
      this.view = 'table';
      this.filter = 'all';
      this.quick = 'all';
      this.sortKey = 'marketCap';
      this.sortDir = 'desc';
      this.favs = this.loadFavs();
      this.init();
    }
    init(){
      this.cache();
      this.bind();
      this.updateKPI();
      this.applyDensity(localStorage.getItem('v2_density')||'comfortable');
      this.render();
      this.ticker();
    }
    cache(){
      this.$tableBody = document.getElementById('v2TableBody');
      this.$grid = document.getElementById('v2Grid');
      this.$tableWrap = document.getElementById('v2TableWrap');
      this.$gridWrap = document.getElementById('v2GridWrap');
      this.$pages = document.getElementById('v2Pages');
    }
    bind(){
      const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];
      const search=qs('#v2Search'), clear=qs('#v2SearchClear');
      search.addEventListener('input',e=>{ this.search = e.target.value.toLowerCase(); this.page=1; this.render(); });
      clear.addEventListener('click',()=>{ search.value=''; this.search=''; this.render(); search.focus(); });

      qsa('.chip').forEach(btn=>btn.addEventListener('click',()=>{
        qsa('.chip').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        this.filter = btn.dataset.filter; this.page=1; this.render();
      }));

      qsa('.quick-btn').forEach(btn=>btn.addEventListener('click',()=>{
        qsa('.quick-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); this.quick = btn.dataset.quick; this.page=1; this.render();
      }));

      qsa('.view-btn').forEach(btn=>btn.addEventListener('click',()=>{
        qsa('.view-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); this.view = btn.dataset.view;
        this.$tableWrap.style.display = this.view==='table'?'block':'none';
        this.$gridWrap.style.display = this.view==='grid'?'block':'none';
        this.render();
      }));

      qsa('.density-btn').forEach(btn=>btn.addEventListener('click',()=>{
        qsa('.density-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); this.applyDensity(btn.dataset.density);
      }));

      document.addEventListener('click',e=>{
        const th = e.target.closest('.markets-table-v2 th.sortable');
        if (th){ const k=th.dataset.sort; if(this.sortKey===k){ this.sortDir = this.sortDir==='asc'?'desc':'asc'; } else { this.sortKey=k; this.sortDir = (k==='name'||k==='rank')?'asc':'desc'; } this.render(); this.updateSortIndicators(); }
      });

      document.getElementById('v2Prev').addEventListener('click',()=>{ if(this.page>1){ this.page--; this.render(); }});
      document.getElementById('v2Next').addEventListener('click',()=>{ const total=this.totalPages(); if(this.page<total){ this.page++; this.render(); }});
    }
    seed(){
      // demo data
      const base=[
        {id:'bitcoin',symbol:'BTC',name:'Bitcoin',price:43256.78,change24h:2.34,volume24h:23400000000,marketCap:847200000000, spark:[42000,42500,43000,43500,43256], icon:'₿', color:'#F7931A', cat:['layer1']},
        {id:'ethereum',symbol:'ETH',name:'Ethereum',price:2234.56,change24h:-1.23,volume24h:15600000000,marketCap:268400000000, spark:[2250,2240,2230,2245,2234], icon:'Ξ', color:'#627EEA', cat:['layer1','defi']},
        {id:'bnb',symbol:'BNB',name:'BNB',price:312.45,change24h:0.89,volume24h:1200000000,marketCap:48300000000, spark:[310,312,314,313,312], icon:'BNB', color:'#F0B90B', cat:['layer1','defi']},
        {id:'sol',symbol:'SOL',name:'Solana',price:98.76,change24h:-2.34,volume24h:890000000,marketCap:43200000000, spark:[100,99,98,97,98], icon:'SOL', color:'#00FFA3', cat:['layer1','defi']},
        {id:'xrp',symbol:'XRP',name:'Ripple',price:0.5234,change24h:1.23,volume24h:1230000000,marketCap:28700000000, spark:[0.52,0.525,0.53,0.528,0.5234], icon:'XRP', color:'#23292F', cat:['layer1']},
        {id:'ada',symbol:'ADA',name:'Cardano',price:0.4567,change24h:3.45,volume24h:450000000,marketCap:16200000000, spark:[0.44,0.45,0.46,0.455,0.4567], icon:'ADA', color:'#0033AD', cat:['layer1']},
        {id:'doge',symbol:'DOGE',name:'Dogecoin',price:0.0789,change24h:5.67,volume24h:567000000,marketCap:11200000000, spark:[0.075,0.077,0.079,0.078,0.0789], icon:'Ð', color:'#C2A633', cat:['meme']},
        {id:'dot',symbol:'DOT',name:'Polkadot',price:7.23,change24h:0.67,volume24h:234000000,marketCap:9100000000, spark:[7.1,7.2,7.3,7.25,7.23], icon:'DOT', color:'#E6007A', cat:['layer1','defi']},
        {id:'matic',symbol:'MATIC',name:'Polygon',price:0.8234,change24h:-0.89,volume24h:345000000,marketCap:7650000000, spark:[0.82,0.83,0.84,0.825,0.8234], icon:'MATIC', color:'#8247E5', cat:['layer2','defi']},
        {id:'link',symbol:'LINK',name:'Chainlink',price:12.34,change24h:2.34,volume24h:456000000,marketCap:6900000000, spark:[12.1,12.2,12.4,12.3,12.34], icon:'LINK', color:'#2A5ADA', cat:['defi']},
        {id:'uni',symbol:'UNI',name:'Uniswap',price:5.67,change24h:-1.23,volume24h:234000000,marketCap:4300000000, spark:[5.7,5.6,5.8,5.65,5.67], icon:'UNI', color:'#FF007A', cat:['defi','layer2']},
        {id:'avax',symbol:'AVAX',name:'Avalanche',price:23.45,change24h:3.21,volume24h:567000000,marketCap:8900000000, spark:[23.1,23.3,23.6,23.4,23.45], icon:'AVAX', color:'#E84142', cat:['layer1','defi']},
      ];
      return base;
    }
    ticker(){ setInterval(()=>{ this.all.forEach(c=>{ const p=(Math.random()-0.5)*0.4; c.price*=1+p/100; c.change24h+=p*0.05; c.spark.push(c.price); if(c.spark.length>50) c.spark.shift(); }); this.updateKPI(); this.render(); }, 3000); }
    loadFavs(){ try{ const x=localStorage.getItem('v2_favs'); return x?JSON.parse(x):[] }catch{return []} }
    saveFavs(){ try{ localStorage.setItem('v2_favs', JSON.stringify(this.favs)); }catch{} }
    isFav(id){ return this.favs.includes(id); }
    toggleFav(id){ if(this.isFav(id)){ this.favs=this.favs.filter(x=>x!==id);} else { this.favs.push(id);} this.saveFavs(); this.render(); }
    applyDensity(d){ localStorage.setItem('v2_density', d); const w=this.$tableWrap; if(!w) return; if(d==='compact'){ w.classList.add('compact'); } else { w.classList.remove('compact'); } }
    updateKPI(){
      const mc=this.all.reduce((s,c)=>s+c.marketCap,0), vol=this.all.reduce((s,c)=>s+c.volume24h,0), btc=this.all.find(x=>x.id==='bitcoin')?.marketCap||0; const dom=btc/mc*100;
      this.kpiPrev=this.kpiPrev||{mc,vol,dom};
      this.animateKPI('kpiMarketCap', this.kpiPrev.mc, mc, v=>'$'+(v/1e12).toFixed(2)+'T');
      this.animateKPI('kpiVolume', this.kpiPrev.vol, vol, v=>'$'+(v/1e9).toFixed(1)+'B');
      this.animateKPI('kpiBTCDom', this.kpiPrev.dom, dom, v=>v.toFixed(1)+'%');
      this.kpiPrev={mc,vol,dom};
    }
    animateKPI(id, from, to, fmt){ const el=document.getElementById(id); const dur=500; const t0=performance.now(); const step=(t)=>{ const p=Math.min(1,(t-t0)/dur); const v=from+(to-from)*p; el.textContent=fmt(v); if(p<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }
    totalPages(){ return Math.max(1, Math.ceil(this.filtered.length/this.perPage)); }
    updateSortIndicators(){ document.querySelectorAll('.markets-table-v2 th.sortable').forEach(th=>{ th.classList.remove('sorted-asc','sorted-desc'); if(th.dataset.sort===this.sortKey){ th.classList.add(this.sortDir==='asc'?'sorted-asc':'sorted-desc'); }}); }
    filterAll(){ let list=[...this.all]; if(this.filter==='watchlist'){ const set=new Set(this.favs); list=list.filter(c=>set.has(c.id)); } else if(this.filter!=='all'){ list=list.filter(c=>c.cat.includes(this.filter)); }
      if(this.search){ list=list.filter(c=>c.name.toLowerCase().includes(this.search)||c.symbol.toLowerCase().includes(this.search)); }
      if(this.quick==='gainers'){ list=list.filter(c=>c.change24h>0).sort((a,b)=>b.change24h-a.change24h).slice(0,20); }
      else if(this.quick==='losers'){ list=list.filter(c=>c.change24h<0).sort((a,b)=>a.change24h-b.change24h).slice(0,20); }
      else if(this.quick==='trending'){ const score=(c)=>{const s=c.spark;return s.length>1?(s[s.length-1]-s[0])/s[0]:0}; list=list.sort((a,b)=>Math.abs(score(b))-Math.abs(score(a))).slice(0,20); }
      const dir=this.sortDir==='asc'?1:-1; list.sort((a,b)=>{ switch(this.sortKey){ case 'marketCap': return dir*(a.marketCap-b.marketCap); case 'volume': return dir*(a.volume24h-b.volume24h); case 'price': return dir*(a.price-b.price); case 'change': return dir*(a.change24h-b.change24h); case 'rank': return dir*(this.all.indexOf(a)-this.all.indexOf(b)); case 'name': return dir*a.name.localeCompare(b.name); default:return 0; }});
      this.filtered=list;
    }
    render(){ this.filterAll(); if(this.view==='table'){ this.renderTable(); } else { this.renderGrid(); } this.renderPages(); this.updateSortIndicators(); }
    renderTable(){ const start=(this.page-1)*this.perPage; const page=this.filtered.slice(start,start+this.perPage); const rows=page.map((c,i)=>{
        const fav=`<td class="fav-cell"><i class="fas fa-star ${this.isFav(c.id)?'fav-on':'fav-off'}" data-fav="${c.id}"></i></td>`;
        const rank=`<td>${start+i+1}</td>`;
        const pair=`<td><div class="pair-cell"><div class="pair-icon" style="background:${c.color}">${c.icon}</div><div><div class="pair-name">${c.name}</div><div class="pair-symbol">${c.symbol}</div></div></div></td>`;
        const price=`<td class="num">$${c.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>`;
        const chg=`<td class="num chg ${c.change24h>=0?'pos':'neg'}">${c.change24h>=0?'+':''}${c.change24h.toFixed(2)}%</td>`;
        const vol=`<td class="num">$${(c.volume24h/1e9).toFixed(1)}B</td>`;
        const mc=`<td class="num">$${(c.marketCap/1e9).toFixed(1)}B</td>`;
        const spark=`<td><canvas class="spark" id="spark-${c.id}" width="100" height="30"></canvas></td>`;
        const act=`<td class="trade-cell"><button class="trade-btn" data-trade="${c.symbol}USDT">Trade</button></td>`;
        return `<tr>${fav}${rank}${pair}${price}${chg}${vol}${mc}${spark}${act}</tr>`;
      }).join('');
      this.$tableBody.innerHTML=rows;
      // events for fav / trade
      this.$tableBody.querySelectorAll('i[data-fav]').forEach(el=>el.addEventListener('click',(e)=>{ e.stopPropagation(); this.toggleFav(el.dataset.fav); }));
      this.$tableBody.querySelectorAll('button[data-trade]').forEach(el=>el.addEventListener('click',(e)=>{ e.stopPropagation(); window.location.href=`trade.html?symbol=${el.dataset.trade}`; }));
      // draw sparks
      page.forEach(c=>this.drawSpark(`spark-${c.id}`, c.spark, c.change24h>=0));
    }
    renderGrid(){ const start=(this.page-1)*this.perPage; const page=this.filtered.slice(start,start+this.perPage); this.$grid.innerHTML=page.map(c=>`
      <div class="card">
        <div class="card-head">
          <div class="card-left"><div class="pair-icon" style="background:${c.color}">${c.icon}</div><div><div class="pair-name">${c.name}</div><div class="pair-symbol">${c.symbol}</div></div></div>
          <i class="fas fa-star ${this.isFav(c.id)?'fav-on':'fav-off'}" data-fav="${c.id}"></i>
        </div>
        <div class="card-price">$${c.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
        <div class="card-chg ${c.change24h>=0?'pos':'neg'}">${c.change24h>=0?'+':''}${c.change24h.toFixed(2)}%</div>
        <canvas class="spark" id="spark-grid-${c.id}" width="260" height="60"></canvas>
      </div>
    `).join('');
      this.$grid.querySelectorAll('i[data-fav]').forEach(el=>el.addEventListener('click',(e)=>{ e.stopPropagation(); this.toggleFav(el.dataset.fav); }));
      page.forEach(c=>this.drawSpark(`spark-grid-${c.id}`, c.spark, c.change24h>=0));
    }
    drawSpark(id,data,pos){ const canvas=document.getElementById(id); if(!canvas) return; const ctx=canvas.getContext('2d'); const w=canvas.width, h=canvas.height; ctx.clearRect(0,0,w,h); const min=Math.min(...data), max=Math.max(...data), pad=(max-min)*0.1||1; const yMin=min-pad, yMax=max+pad; const color=pos?'#0ECB81':'#F6465D'; ctx.strokeStyle=color; ctx.lineWidth=2; ctx.beginPath(); let firstY=0, lastX=0; data.forEach((v,i)=>{ const x=i/(data.length-1)*w; const y=h-((v-yMin)/(yMax-yMin))*h; if(i===0){ ctx.moveTo(x,y); firstY=y; } else { ctx.lineTo(x,y); } lastX=x; }); ctx.stroke();
      // fill under curve
      const grad=ctx.createLinearGradient(0,0,0,h); grad.addColorStop(0, pos?'rgba(14,203,129,0.20)':'rgba(246,70,93,0.20)'); grad.addColorStop(1,'rgba(0,0,0,0)'); ctx.lineTo(lastX,h); ctx.lineTo(0,h); ctx.closePath(); ctx.fillStyle=grad; ctx.fill(); }
    renderPages(){ const total=this.totalPages(); const html=[...Array(total)].map((_,i)=>`<button class="page-number ${i+1===this.page?'active':''}" data-pg="${i+1}">${i+1}</button>`).join(''); this.$pages.innerHTML=html; this.$pages.querySelectorAll('button[data-pg]').forEach(b=>b.addEventListener('click',()=>{ this.page=parseInt(b.dataset.pg,10); this.render(); }));
      document.getElementById('v2Prev').disabled=this.page===1; document.getElementById('v2Next').disabled=this.page===total; }
  }
  document.addEventListener('DOMContentLoaded',()=>{ window.marketsV2=new MarketsV2(); });
})();
