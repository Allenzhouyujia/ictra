
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS='http://www.w3.org/2000/svg';
  const el=(n,a={},p)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;};

  /* ---------- horizontal bar charts (to scale, direct labels, hover tooltips) ---------- */
  document.querySelectorAll('.hbar').forEach(box=>{
    let spec; try{spec=JSON.parse(box.dataset.chart);}catch(e){return;}
    const color=box.dataset.color||'var(--accent)';
    const rowH=38, labelW=230, W=560, padR=86, H=spec.items.length*rowH+8;
    const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':spec.items.map(i=>i[0]+': '+i[1]+spec.unit).join('; ')},box);
    svg.style.fontFamily='IBM Plex Sans, system-ui, sans-serif'; svg.style.fontSize='13px';
    const x0=labelW, span=W-labelW-padR, dec=spec.dec??1;
    // gridlines at 0, 50%, 100% of max
    [0,.5,1].forEach(f=>{el('line',{x1:x0+span*f,x2:x0+span*f,y1:0,y2:H-8,stroke:'var(--grid)','stroke-width':1},svg);});
    spec.items.forEach((it,i)=>{
      const y=i*rowH+4, bw=Math.max(3,span*it[1]/spec.max);
      const g=el('g',{},svg);
      el('title',{},g).textContent=`${it[0]}: ${it[1]}${spec.unit}`;
      const lbl=el('text',{x:x0-12,y:y+rowH/2+1,'text-anchor':'end',fill:'var(--ink-2)'},g); lbl.textContent=it[0];
      el('rect',{x:x0,y:y+8,width:bw,height:rowH-16,rx:4,fill:color},g);
      const v=el('text',{x:x0+bw+8,y:y+rowH/2+1,fill:'var(--ink)','font-weight':'600'},g); v.style.fontVariantNumeric='tabular-nums';
      v.textContent=(Number.isInteger(it[1])?it[1]:it[1].toFixed(dec))+spec.unit;
    });
    el('line',{x1:x0,x2:x0,y1:0,y2:H-8,stroke:'var(--axis)','stroke-width':1.5},svg);
  });

  /* ---------- onset schematic ---------- */
  (function(){
    const svg=document.getElementById('onsetFig'); if(!svg) return;
    const W=1040, left=150, right=W-30, w=right-left, onsetT=14, T=34; // seconds
    const X=t=>left+w*t/T;
    const rows=[{name:'EEG',sub:'brain · µV',y:70,c:'var(--eeg)'},{name:'Heart rate',sub:'from ECG · bpm',y:180,c:'var(--ecg)'},{name:'EMG',sub:'muscle · envelope',y:290,c:'var(--emg)'}];
    svg.style.fontFamily='IBM Plex Sans, system-ui, sans-serif';
    // onset band
    el('rect',{x:X(onsetT),y:14,width:X(T)-X(onsetT),height:338,fill:'var(--alert)','fill-opacity':.06},svg);
    el('line',{x1:X(onsetT),x2:X(onsetT),y1:14,y2:352,stroke:'var(--alert)','stroke-width':1.5,'stroke-dasharray':'5 4'},svg);
    const ot=el('text',{x:X(onsetT)-8,y:26,'text-anchor':'end',fill:'var(--alert)','font-size':12,'font-weight':600},svg); ot.textContent='seizure onset (EEG) →';
    // time ticks
    for(let t=0;t<=T;t+=5){const x=X(t);el('line',{x1:x,x2:x,y1:352,y2:358,stroke:'var(--axis)'},svg);const tt=el('text',{x:x,y:372,'text-anchor':'middle','font-size':11,fill:'var(--muted)'},svg);tt.textContent=(t-onsetT>0?'+':'')+(t-onsetT)+' s';}
    el('line',{x1:left,x2:right,y1:352,y2:352,stroke:'var(--axis)'},svg);
    rows.forEach(r=>{
      const n=el('text',{x:left-14,y:r.y-4,'text-anchor':'end',fill:'var(--ink)','font-weight':600,'font-size':14},svg); n.textContent=r.name;
      const s=el('text',{x:left-14,y:r.y+13,'text-anchor':'end',fill:'var(--muted)','font-size':11},svg); s.textContent=r.sub;
      el('line',{x1:left,x2:right,y1:r.y+36,y2:r.y+36,stroke:'var(--grid)'},svg);
    });
    // EEG: small irregular -> large 3 Hz rhythm with a brief electrodecrement at onset
    let pts=[];
    for(let i=0;i<=1400;i++){const t=T*i/1400;let v;
      if(t<onsetT) v=6*Math.sin(2*Math.PI*10*t)+4*Math.sin(2*Math.PI*2.3*t+1)+2*Math.sin(2*Math.PI*17*t);
      else if(t<onsetT+1.2) v=1.5*Math.sin(2*Math.PI*22*t);
      else {const a=Math.min(1,(t-onsetT-1.2)/3);v=(8+26*a)*Math.sin(2*Math.PI*3*t)+5*a*Math.sin(2*Math.PI*9*t);}
      pts.push(X(t).toFixed(1)+','+(rows[0].y+8-v).toFixed(1));}
    el('polyline',{points:pts.join(' '),fill:'none',stroke:rows[0].c,'stroke-width':1.6},svg);
    const e1=el('text',{x:X(onsetT+1.4),y:rows[0].y+58,'font-size':11,fill:'var(--ink-2)'},svg); e1.textContent='brief electrodecrement, then rhythmic 3 Hz discharges';
    // Heart rate: 72 baseline -> 130 within 10 s, starting ~2 s before onset
    pts=[]; const hrY=v=>rows[1].y+36-(v-60)/(140-60)*62;
    for(let i=0;i<=400;i++){const t=T*i/400;const t0=onsetT-2;let hr=72+1.5*Math.sin(2*Math.PI*0.25*t);if(t>t0){const a=1/(1+Math.exp(-(t-t0-4)*1.1));hr=72+58*a;}pts.push(X(t).toFixed(1)+','+hrY(hr).toFixed(1));}
    el('polyline',{points:pts.join(' '),fill:'none',stroke:rows[1].c,'stroke-width':2.2,'stroke-linejoin':'round'},svg);
    [72,130].forEach(v=>{const t=el('text',{x:right+4,y:hrY(v)+4,'font-size':11,fill:'var(--muted)'},svg);t.textContent=v;});
    const h1=el('text',{x:X(onsetT-2)-6,y:hrY(72)-14,'text-anchor':'end','font-size':11,fill:'var(--ink-2)'},svg); h1.textContent='ictal tachycardia can start seconds before EEG onset';
    const h2=el('text',{x:X(onsetT+6),y:hrY(130)-8,'font-size':11,fill:'var(--ink-2)'},svg); h2.textContent='+80% above baseline';
    // EMG: sparse low bursts -> dense high-frequency activation (tonic then clonic)
    pts=[];
    const rnd=(s=>()=>{s=(s*16807)%2147483647;return s/2147483647;})(42);
    for(let i=0;i<=2400;i++){const t=T*i/2400;let amp;
      if(t<onsetT) amp=(t%6>4.6&&t%6<5.1)?6:1.2;
      else if(t<onsetT+9) amp=28; else amp=((t-onsetT)%0.7<0.35)?30:2;
      const v=(rnd()*2-1)*amp; pts.push(X(t).toFixed(1)+','+(rows[2].y+6-v).toFixed(1));}
    el('polyline',{points:pts.join(' '),fill:'none',stroke:rows[2].c,'stroke-width':1},svg);
    const m1=el('text',{x:X(onsetT+0.4),y:rows[2].y-30,'font-size':11,fill:'var(--ink-2)'},svg); m1.textContent='tonic phase: sustained high-frequency activation';
    const m2=el('text',{x:X(onsetT+9.4),y:rows[2].y+48,'font-size':11,fill:'var(--ink-2)'},svg); m2.textContent='clonic phase: rhythmic bursts';
    const m0=el('text',{x:X(0.4),y:rows[2].y-30,'font-size':11,fill:'var(--muted)'},svg); m0.textContent='ordinary movement: brief, low, irregular';
  })();

  /* ---------- k of n ---------- */
  (function(){
    const box=document.getElementById('kofn'); if(!box) return;
    const p=[0.05,0.08,0.86,0.12,0.09,0.31,0.78,0.91,0.95];
    const thr=0.70,k=3,n=5; let fired=-1;
    p.forEach((v,i)=>{const win=p.slice(Math.max(0,i-n+1),i+1);const hits=win.filter(x=>x>=thr).length;const alert=fired<0&&hits>=k;if(alert)fired=i;
      const d=document.createElement('div');d.className='w'+(v>=thr?' hit':'')+(i>=fired&&fired>=0?' alert':'');
      d.innerHTML=`<i><b style="height:${Math.round(v*100)}%"></b></i>${v.toFixed(2)}<br><span class="muted">t${i+1}</span>`;box.appendChild(d);});
    const t=document.createElement('div');t.className='thr';t.textContent=`threshold τ = ${thr} · k = ${k} of n = ${n} · alert fires at t${fired+1}; the isolated spike at t3 never does`;box.appendChild(t);
  })();

  /* ---------- phone mini traces + elapsed ---------- */
  (function(){
    const mk=(id,f)=>{const e=document.getElementById(id);if(!e)return;const pts=[];for(let i=0;i<=150;i++){const x=i*2;pts.push(x+','+(13-f(i/150)).toFixed(1));}e.setAttribute('points',pts.join(' '));};
    mk('miniEeg',u=>u<0.45?3*Math.sin(u*60):9*Math.sin(u*45));
    mk('miniEcg',u=>{const b=u<0.45?0.09:0.05;const ph=(u%b)/b;return ph<0.08?10:(ph<0.14?-4:0.5*Math.sin(u*30));});
    mk('miniEmg',u=>u<0.45?(Math.sin(u*300)*1.2):(Math.sin(u*997)*8*Math.sign(Math.sin(u*180))));
    const e=document.getElementById('elapsed'); if(!e||reduce) return; let s=12; setInterval(()=>{s++;e.textContent='00:'+String(s%60).padStart(2,'0');},1000);
  })();

  /* ---------- hero signal strip ---------- */
  (function(){
    const c=document.getElementById('strip'); if(!c) return; const ctx=c.getContext('2d');
    const W=c.width,H=c.height, lanes=[{k:'eeg',y:55,h:40},{k:'ecg',y:150,h:40},{k:'emg',y:245,h:40}];
    const css=k=>getComputedStyle(document.documentElement).getPropertyValue('--'+k).trim();
    const N=W; const buf={eeg:new Float32Array(N),ecg:new Float32Array(N),emg:new Float32Array(N)};
    let t=0, head=0, phase='normal', pTarget=0.04, p=0.04, cycle=0, lastHR=0;
    const state=document.getElementById('stripState'), fill=document.getElementById('pfill'), pv=document.getElementById('pval');
    const CYCLE=22, ONSET=11, END=19; // seconds
    let seed=7; const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647-0.5;};
    function sample(dt){
      t+=dt; cycle+=dt; if(cycle>CYCLE){cycle=0;}
      const sz=cycle>ONSET&&cycle<END, ramp=sz?Math.min(1,(cycle-ONSET)/2.5):0;
      // EEG
      let e=0.35*Math.sin(2*Math.PI*10*t)+0.25*Math.sin(2*Math.PI*2.1*t)+0.12*rnd();
      if(sz) e=(0.4+1.4*ramp)*Math.sin(2*Math.PI*3*t)+0.3*ramp*Math.sin(2*Math.PI*9*t)+0.1*rnd();
      // ECG at HR
      const hr=sz?72+58*ramp:72; const beat=hr/60; const ph=(t*beat)%1;
      let q=0.05*Math.sin(2*Math.PI*ph*2);
      if(ph<0.04) q=-0.2; else if(ph<0.09) q=1.0; else if(ph<0.13) q=-0.35; else if(ph>0.3&&ph<0.45) q=0.25*Math.sin(Math.PI*(ph-0.3)/0.15);
      // EMG
      let m=0.08*rnd(); if(!sz&&cycle%7>5.6&&cycle%7<6.0) m=0.45*rnd(); if(sz) m=(0.6+0.8*ramp)*rnd();
      buf.eeg[head]=e; buf.ecg[head]=q; buf.emg[head]=m; head=(head+1)%N;
      pTarget=sz?Math.min(0.97,0.04+0.93*Math.min(1,(cycle-ONSET)/4)):Math.max(0.04,pTarget-dt*0.5);
      p+=(pTarget-p)*Math.min(1,dt*3);
      const alert=p>=0.70;
      if(alert&&phase!=='alert'){phase='alert';state.className='state alert';state.innerHTML='<i class="dot"></i>ALERT · 3 of 5 windows above threshold · caregiver notified';}
      if(!alert&&phase==='alert'&&p<0.3){phase='normal';state.className='state';state.innerHTML='<i class="dot"></i>Monitoring · simulated signals';}
      fill.style.width=(p*100).toFixed(1)+'%'; fill.style.background=alert?css('alert'):css('accent'); pv.textContent=p.toFixed(2);
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      ctx.strokeStyle=css('grid'); ctx.lineWidth=1;
      for(let x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      lanes.forEach(l=>{
        ctx.strokeStyle=css(l.k); ctx.lineWidth=l.k==='emg'?1.2:1.8; ctx.beginPath();
        for(let i=0;i<N;i++){const idx=(head+i)%N;const v=buf[l.k][idx];const y=l.y+l.h/2-v*l.h/2*(l.k==='ecg'?1.4:1);if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);}
        ctx.stroke();
        ctx.fillStyle=css('muted'); ctx.font='12px IBM Plex Mono, monospace'; ctx.fillText(l.k.toUpperCase(),12,l.y-10);
      });
      // playhead
      ctx.strokeStyle=css('axis'); ctx.beginPath(); ctx.moveTo(W-1,0); ctx.lineTo(W-1,H); ctx.stroke();
    }
    // prefill
    for(let i=0;i<N;i++) sample(1/160);
    draw();
    if(reduce) return;
    let last=performance.now();
    function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;const steps=Math.max(1,Math.round(dt*160));for(let i=0;i<steps;i++)sample(1/160);draw();requestAnimationFrame(loop);}
    requestAnimationFrame(loop);
  })();
})();
