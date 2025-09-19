// Markets v3 – higher fidelity mimic
(function(){
  class V3 {
    constructor(){
      this.data=this.seed();
      this.state={search:'',filter:'all',quick:'all',view:'table',density:(localStorage.getItem('v3_density')||'comfortable'),quote:(localStorage.getItem('v3_quote')||'USD'),sortKey:'marketCap',sortDir:'desc',page:1,perPage:12};
      this.favs=this.loadFavs();
      this.cache(); this.bind(); this.refreshKPI(); this.applyView(); this.applyDensity(); this.render(); this.ticker();
    }
    cache(){
      this.$tbody=document.getElementById('v3Body');
      this.$grid=document.getElementById('v3Grid');
      this.$tableWrap=document.getElementById('v3TableWrap');
      this.$gridWrap=document.getElementById('v3GridWrap');
      this.$pages=document.getElementById('v3Pages');
    }
    bind(){
      const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
      $('#v3Search').addEventListener('input',e=>{this.state.search=e.target.value.toLowerCase();this.state.page=1;this.render();});
      $('#v3Clear').addEventListener('click',()=>{const i=$('#v3Search');i.value='';this.state.search=''; this.render(); i.focus();});
      $$('.chip').forEach(b=>b.addEventListener('click',()=>{$$('.chip').forEach(x=>x.classList.remove('active')); b.classList.add('active'); this.state.filter=b.dataset.filter; this.state.page=1; this.render(); }));
      $$('.qk').forEach(b=>b.addEventListener('click',()=>{$$('.qk').forEach(x=>x.classList.remove('active')); b.classList.add('active'); this.state.quick=b.dataset.quick; this.state.page=1; this.render(); }));
      $$('.v-btn').forEach(b=>b.addEventListener('click',()=>{$$('.v-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); this.state.view=b.dataset.view; this.applyView(); this.render(); }));
      $$('.d-btn').forEach(b=>b.addEventListener('click',()=>{$$('.d-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); this.state.density=b.dataset.density; localStorage.setItem('v3_density',this.state.density); this.applyDensity(); }));
      $$('.q-btn').forEach(b=>b.addEventListener('click',()=>{$$('.q-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); this.state.quote=b.dataset.quote; localStorage.setItem('v3_quote',this.state.quote); this.render(); }));
      document.addEventListener('click',e=>{ const th=e.target.closest('.table thead th.s'); if(!th) return; const k=th.dataset.sort; if(this.state.sortKey===k){ this.state.sortDir=this.state.sortDir==='asc'?'desc':'asc'; } else { this.state.sortKey=k; this.state.sortDir=(k==='name'||k==='rank')?'asc':'desc'; } this.updateSortIndicators(); this.render(); });
      $('#v3Prev').addEventListener('click',()=>{ if(this.state.page>1){ this.state.page--; this.render(); }});
      $('#v3Next').addEventListener('click',()=>{ const t=this.totalPages(); if(this.state.page<t){ this.state.page++; this.render(); }});
    }
    applyView(){ this.$tableWrap.style.display=this.state.view==='table'?'block':'none'; this.$gridWrap.style.display=this.state.view==='grid'?'block':'none'; }
    applyDensity(){ const root=document.querySelector('main.container.v3'); if(this.state.density==='compact'){ root.classList.add('compact'); } else { root.classList.remove('compact'); } }
    seed(){
      const base=[
        {id:'btc',symbol:'BTC',name:'Bitcoin',price:43256.78,change24h:2.34,volume24h:23400000000,marketCap:847200000000,high24h:44123.45,low24h:42987.65,spark:[42000,42500,43000,43500,43256],color:'#F7931A',icon:'₿',cat:['layer1']},
        {id:'eth',symbol:'ETH',name:'Ethereum',price:2234.56,change24h:-1.23,volume24h:15600000000,marketCap:268400000000,high24h:2287.89,low24h:2198.76,spark:[2250,2240,2230,2245,2234],color:'#627EEA',icon:'Ξ',cat:['layer1','defi']},
        {id:'bnb',symbol:'BNB',name:'BNB',price:312.45,change24h:0.89,volume24h:1200000000,marketCap:48300000000,high24h:318.90,low24h:305.67,spark:[310,312,314,313,312],color:'#F0B90B',icon:'BNB',cat:['layer1','defi']},
        {id:'sol',symbol:'SOL',name:'Solana',price:98.76,change24h:-2.34,volume24h:890000000,marketCap:43200000000,high24h:102.34,low24h:96.54,spark:[100,99,98,97,98],color:'#00FFA3',icon:'SOL',cat:['layer1','defi']},
        {id:'xrp',symbol:'XRP',name:'Ripple',price:0.5234,change24h:1.23,volume24h:1230000000,marketCap:28700000000,high24h:0.5345,low24h:0.5123,spark:[0.52,0.525,0.53,0.528,0.5234],color:'#23292F',icon:'XRP',cat:['layer1']},
        {id:'ada',symbol:'ADA',name:'Cardano',price:0.4567,change24h:3.45,volume24h:450000000,marketCap:16200000000,high24h:0.4678,low24h:0.4389,spark:[0.44,0.45,0.46,0.455,0.4567],color:'#0033AD',icon:'ADA',cat:['layer1']},
        {id:'doge',symbol:'DOGE',name:'Dogecoin',price:0.0789,change24h:5.67,volume24h:567000000,marketCap:11200000000,high24h:0.0823,low24h:0.0745,spark:[0.075,0.077,0.079,0.078,0.0789],color:'#C2A633',icon:'Ð',cat:['meme']},
        {id:'dot',symbol:'DOT',name:'Polkadot',price:7.23,change24h:0.67,volume24h:234000000,marketCap:9100000000,high24h:7.45,low24h:6.98,spark:[7.1,7.2,7.3,7.25,7.23],color:'#E6007A',icon:'DOT',cat:['layer1','defi']},
        {id:'matic',symbol:'MATIC',name:'Polygon',price:0.8234,change24h:-0.89,volume24h:345000000,marketCap:7650000000,high24h:0.8456,low24h:0.8012,spark:[0.82,0.83,0.84,0.825,0.8234],color:'#8247E5',icon:'MATIC',cat:['layer2','defi']},
        {id:'link',symbol:'LINK',name:'Chainlink',price:12.34,change24h:2.34,volume24h:456000000,marketCap:6900000000,high24h:12.67,low24h:11.98,spark:[12.1,12.2,12.4,12.3,12.34],color:'#2A5ADA',icon:'LINK',cat:['defi']},
        {id:'uni',symbol:'UNI',name:'Uniswap',price:5.67,change24h:-1.23,volume24h:234000000,marketCap:4300000000,high24h:5.89,low24h:5.45,spark:[5.7,5.6,5.8,5.65,5.67],color:'#FF007A',icon:'UNI',cat:['defi','layer2']},
        {id:'avax',symbol:'AVAX',name:'Avalanche',price:23.45,change24h:3.21,volume24h:567000000,marketCap:8900000000,high24h:24.12,low24h:22.87,spark:[23.1,23.3,23.6,23.4,23.45],color:'#E84142',icon:'AVAX',cat:['layer1','defi']},
      ];
      return base;
    }
    ticker(){ setInterval(()=>{ this.data.forEach(c=>{ const p=(Math.random()-0.5)*0.4; c.price*=1+p/100; c.change24h+=p*0.05; c.spark.push(c.price); if(c.spark.length>50) c.spark.shift(); c.high24h=Math.max(c.high24h,c.price); c.low24h=Math.min(c.low24h,c.price); }); this.refreshKPI(); this.render(); }, 3000); }
    loadFavs(){ try{ const x=localStorage.getItem('v3_favs'); return x?JSON.parse(x):[] }catch{return []} }
    saveFavs(){ try{ localStorage.setItem('v3_favs', JSON.stringify(this.favs)); }catch{} }
    isFav(id){ return this.favs.includes(id); }
    toggleFav(id){ if(this.isFav(id)){ this.favs=this.favs.filter(x=>x!==id);} else { this.favs.push(id);} this.saveFavs(); this.render(); }
    refreshKPI(){ const mc=this.data.reduce((s,c)=>s+c.marketCap,0), vol=this.data.reduce((s,c)=>s+c.volume24h,0), btc=this.data.find(x=>x.id==='btc')?.marketCap||0; const dom=btc/mc*100; this.animate('#v3Cap',v=>'$'+(v/1e12).toFixed(2)+'T', (this.prevMc??mc), mc); this.animate('#v3Vol',v=>'$'+(v/1e9).toFixed(1)+'B', (this.prevVol??vol), vol); this.animate('#v3Dom',v=>v.toFixed(1)+'%', (this.prevDom??dom), dom); this.prevMc=mc; this.prevVol=vol; this.prevDom=dom; }
    animate(sel,fmt,from,to){ const el=document.querySelector(sel); const d=400; const t0=performance.now(); const step=(t)=>{ const p=Math.min(1,(t-t0)/d); const v=from+(to-from)*p; el.textContent=fmt(v); if(p<1) requestAnimationFrame(step);}; requestAnimationFrame(step); }
    filterAll(){ let list=[...this.data]; if(this.state.filter==='watchlist'){ const set=new Set(this.favs); list=list.filter(c=>set.has(c.id)); } else if(this.state.filter!=='all'){ list=list.filter(c=>c.cat.includes(this.state.filter)); }
      if(this.state.search){ list=list.filter(c=>c.name.toLowerCase().includes(this.state.search)||c.symbol.toLowerCase().includes(this.state.search)); }
      if(this.state.quick==='gainers'){ list=list.filter(c=>c.change24h>0).sort((a,b)=>b.change24h-a.change24h).slice(0,20); }
      else if(this.state.quick==='losers'){ list=list.filter(c=>c.change24h<0).sort((a,b)=>a.change24h-b.change24h).slice(0,20); }
      else if(this.state.quick==='trending'){ const score=c=>{const s=c.spark; return s.length>1?(s[s.length-1]-s[0])/s[0]:0}; list=list.sort((a,b)=>Math.abs(score(b))-Math.abs(score(a))).slice(0,20); }
      else if(this.state.quick==='new'){ /* demo: show前6条 */ list=list.slice(0,6); }
      const dir=this.state.sortDir==='asc'?1:-1; list.sort((a,b)=>{ switch(this.state.sortKey){ case 'marketCap': return dir*(a.marketCap-b.marketCap); case 'volume': return dir*(a.volume24h-b.volume24h); case 'price': return dir*(a.price-b.price); case 'change': return dir*(a.change24h-b.change24h); case 'rank': return dir*(this.data.indexOf(a)-this.data.indexOf(b)); case 'name': return dir*a.name.localeCompare(b.name); default: return 0; }});
      this.filtered=list;
    }
    render(){ this.filterAll(); if(this.state.view==='table'){ this.renderTable(); } else { this.renderGrid(); } this.renderPages(); this.updateSortIndicators(); }
    updateSortIndicators(){ document.querySelectorAll('.table thead th.s').forEach(th=>{ th.classList.remove('sorted-asc','sorted-desc'); if(th.dataset.sort===this.state.sortKey){ th.classList.add(this.state.sortDir==='asc'?'sorted-asc':'sorted-desc'); }}); }
    formatPrice(v){ return '$'+v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }
    formatNumB(v){ return '$'+(v/1e9).toFixed(1)+'B'; }
    renderTable(){ const s=(this.state.page-1)*this.state.perPage; const pg=this.filtered.slice(s,s+this.state.perPage); const rows=pg.map((c,i)=>{
        const fav=`<td class="fav"><i class="fas fa-star ${this.isFav(c.id)?'on':''}" data-fav="${c.id}"></i></td>`;
        const rank=`<td>${s+i+1}</td>`;
        const pair=`<td><div class="pair"><div class="icon" style="background:${c.color}">${c.icon}</div><div><div class="name">${c.name}</div><div class="sym">${c.symbol}</div></div></div></td>`;
        const price=`<td class="num">${this.formatPrice(c.price)}</td>`;
        const chg=`<td class="num"><span class="chg ${c.change24h>=0?'pos':'neg'}">${c.change24h>=0?'+':''}${c.change24h.toFixed(2)}%</span></td>`;
        const rangePct=(c.price-c.low24h)/(c.high24h-c.low24h || 1); const range=`<td><div class="range"><span class="min">${this.formatPrice(c.low24h)}</span><div class="bar"><div class="bar-fill" style="width:${(rangePct*100).toFixed(0)}%"></div></div><span class="max">${this.formatPrice(c.high24h)}</span></div></td>`;
        const vol=`<td class="num">${this.formatNumB(c.volume24h)}</td>`;
        const mc=`<td class="num">${this.formatNumB(c.marketCap)}</td>`;
        const spark=`<td><canvas class="spark" id="s-${c.id}" width="100" height="30"></canvas></td>`;
        const act=`<td class="act"><button class="trade" data-trade="${c.symbol}USDT">Trade</button></td>`;
        return `<tr>${fav}${rank}${pair}${price}${chg}${range}${vol}${mc}${spark}${act}</tr>`;
      }).join('');
      this.$tbody.innerHTML=rows;
      this.$tbody.querySelectorAll('i[data-fav]').forEach(el=>el.addEventListener('click',(e)=>{e.stopPropagation();this.toggleFav(el.dataset.fav);}));
      this.$tbody.querySelectorAll('button[data-trade]').forEach(el=>el.addEventListener('click',(e)=>{e.stopPropagation();window.location.href=`trade.html?symbol=${el.dataset.trade}`;}));
      pg.forEach(c=>this.drawSpark(`s-${c.id}`,c.spark,c.change24h>=0));
    }
    renderGrid(){ const s=(this.state.page-1)*this.state.perPage; const pg=this.filtered.slice(s,s+this.state.perPage); this.$grid.innerHTML=pg.map(c=>`
      <div class="card">
        <div class="card-h"><div class="card-left"><div class="icon" style="background:${c.color}">${c.icon}</div><div><div class="name">${c.name}</div><div class="sym">${c.symbol}</div></div></div><i class="fas fa-star ${this.isFav(c.id)?'on':''}" data-fav="${c.id}"></i></div>
        <div class="card-price">${this.formatPrice(c.price)}</div>
        <div class="card-chg ${c.change24h>=0?'pos':'neg'}">${c.change24h>=0?'+':''}${c.change24h.toFixed(2)}%</div>
        <canvas class="spark" id="sg-${c.id}" width="260" height="60"></canvas>
      </div>`).join('');
      this.$grid.querySelectorAll('i[data-fav]').forEach(el=>el.addEventListener('click',(e)=>{e.stopPropagation();this.toggleFav(el.dataset.fav);}));
      pg.forEach(c=>this.drawSpark(`sg-${c.id}`,c.spark,c.change24h>=0));
    }
    drawSpark(id,data,pos){ const c=document.getElementById(id); if(!c) return; const ctx=c.getContext('2d'); const w=c.width,h=c.height; ctx.clearRect(0,0,w,h); const min=Math.min(...data),max=Math.max(...data),pad=(max-min)*0.1||1; const yMin=min-pad,yMax=max+pad; const color=pos?'#0ECB81':'#F6465D'; ctx.strokeStyle=color; ctx.lineWidth=2; ctx.beginPath(); let lastX=0; data.forEach((v,i)=>{ const x=i/(data.length-1)*w; const y=h-((v-yMin)/(yMax-yMin))*h; if(i===0){ ctx.moveTo(x,y);} else { ctx.lineTo(x,y);} lastX=x; }); ctx.stroke(); const grad=ctx.createLinearGradient(0,0,0,h); grad.addColorStop(0,pos?'rgba(14,203,129,.2)':'rgba(246,70,93,.2)'); grad.addColorStop(1,'rgba(0,0,0,0)'); ctx.lineTo(lastX,h); ctx.lineTo(0,h); ctx.closePath(); ctx.fillStyle=grad; ctx.fill(); }
    totalPages(){ return Math.max(1, Math.ceil(this.filtered.length/this.state.perPage)); }
    renderPages(){ const t=this.totalPages(); const html=[...Array(t)].map((_,i)=>`<button class="page ${i+1===this.state.page?'active':''}" data-pg="${i+1}">${i+1}</button>`).join(''); this.$pages.innerHTML=html; this.$pages.querySelectorAll('button[data-pg]').forEach(b=>b.addEventListener('click',()=>{this.state.page=parseInt(b.dataset.pg,10); this.render();})); document.getElementById('v3Prev').disabled=this.state.page===1; document.getElementById('v3Next').disabled=this.state.page===t; }
  }
  document.addEventListener('DOMContentLoaded',()=>{ window.marketsV3=new V3(); });
})();

