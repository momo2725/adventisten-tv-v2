'use client'
export default function Home() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" async></script>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --ci-tl: #6EC6D1;
          --ci-td: #29B8C5;
          --ci-gl: #6E6E6E;
          --ci-gd: #565655;
          --ci-ol: #F6A231;
          --ci-od: #F28B0D;
          --bg:      #0b1214;
          --surface: #111a1c;
          --surface2:#162022;
          --surface3:#1c292c;
          --text:    #ffffff;
          --text2:   #c8dcdf;
          --muted:   #7da4a8;
          --border:  #1e3236;
          --transition: 700ms cubic-bezier(0.4,0,0.2,1);
          --font: 'Sarabun', sans-serif;
        }
        html,body { width:100%; height:100%; background:var(--bg); color:var(--text); font-family:var(--font); overflow:hidden; }
        #topbar { position:fixed; top:0; left:0; right:0; z-index:200; height:6px; background: linear-gradient(90deg, var(--ci-td) 0%, var(--ci-tl) 100%); }
        #header { position:fixed; top:6px; left:0; right:0; z-index:100; height:70px; background:#080f10; display:flex; align-items:center; padding:0 44px; border-bottom:1px solid var(--border); }
        .logo-block { display:flex; align-items:center; gap:0; margin-right:36px; }
        .logo-box { background: radial-gradient(ellipse at 30% 30%, var(--ci-tl), var(--ci-td)); padding:6px 16px; font-family:var(--font); font-weight:800; font-size:28px; color:#fff; letter-spacing:-0.5px; line-height:1; }
        .logo-sub { font-family:var(--font); font-weight:600; font-size:12px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; padding-left:16px; border-left:1px solid var(--border); margin-left:16px; line-height:1.4; }
        .header-divider { flex:1; }
        .live-pill { display:flex; align-items:center; gap:8px; background: linear-gradient(135deg, var(--ci-td), var(--ci-tl)); padding:5px 16px; font-family:var(--font); font-weight:700; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-right:28px; }
        .live-pill::before { content:''; width:7px; height:7px; border-radius:50%; background:#fff; animation:blink 1.2s ease-in-out infinite; }
        #clock { font-family:var(--font); font-size:22px; font-weight:300; color:var(--muted); letter-spacing:1px; }
        #weather-widget { display:flex; align-items:center; gap:12px; margin-right:32px; padding-right:32px; border-right:1px solid var(--border); }
        #weather-icon { font-size:28px; line-height:1; }
        #weather-info { display:flex; flex-direction:column; gap:1px; }
        #weather-temp { font-family:var(--font); font-weight:700; font-size:24px; color:var(--ci-tl); line-height:1; }
        #weather-desc { font-family:var(--font); font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; }
        #weather-city { font-family:var(--font); font-size:11px; color:var(--ci-gd); letter-spacing:1px; }
        #breaking { position:fixed; top:76px; left:0; right:0; z-index:99; height:40px; display:flex; align-items:center; background:var(--surface2); border-bottom:1px solid var(--border); overflow:hidden; }
        #breaking-label { flex-shrink:0; height:100%; padding:0 20px; display:flex; align-items:center; background: linear-gradient(135deg, var(--ci-td), var(--ci-tl)); font-family:var(--font); font-weight:700; font-size:11px; letter-spacing:2px; text-transform:uppercase; white-space:nowrap; }
        #ticker-outer { flex:1; overflow:hidden; height:100%; display:flex; align-items:center; }
        #ticker-track { display:flex; align-items:center; white-space:nowrap; animation:ticker 90s linear infinite; font-family:var(--font); font-size:16px; font-weight:400; color:var(--text2); padding-left:24px; }
        #ticker-track span { padding:0 32px; }
        #ticker-track .sep { color:var(--ci-td); font-weight:700; padding:0 4px; }
        #countdown-badge { flex-shrink:0; display:flex; align-items:center; gap:6px; padding:0 16px; height:100%; border-left:1px solid var(--border); font-family:var(--font); font-size:12px; color:var(--muted); letter-spacing:1px; }
        #countdown-num { font-size:18px; font-weight:700; color:var(--ci-tl); min-width:26px; text-align:center; }
        #stage { position:fixed; top:116px; bottom:44px; left:0; right:0; overflow:hidden; }
        .slide { position:absolute; inset:0; display:grid; grid-template-columns:3fr 2fr; opacity:0; transform:translateX(24px); transition:opacity var(--transition), transform var(--transition); pointer-events:none; }
        .slide.active { opacity:1; transform:translateX(0); pointer-events:auto; }
        .slide.exit { opacity:0; transform:translateX(-24px); }
        .slide-image { position:relative; overflow:hidden; background:#000; }
        .slide-image img { width:100%; height:100%; object-fit:cover; display:block; }
        .slide-image .img-overlay { position:absolute; inset:0; background: linear-gradient(to right, transparent 50%, rgba(11,18,20,0.97) 100%), linear-gradient(to top, rgba(0,30,34,0.6) 0%, transparent 45%); }
        .slide-image .no-img { width:100%; height:100%; background: radial-gradient(ellipse at 40% 40%, var(--surface3), var(--bg)); display:flex; align-items:center; justify-content:center; }
        .no-img svg { opacity:0.12; }
        .img-category { position:absolute; top:28px; left:28px; background: linear-gradient(135deg, var(--ci-td), var(--ci-tl)); font-family:var(--font); font-weight:700; font-size:12px; letter-spacing:2px; text-transform:uppercase; padding:5px 14px; }
        .img-counter { position:absolute; bottom:28px; left:28px; font-family:var(--font); font-size:12px; font-weight:300; color:rgba(255,255,255,0.45); letter-spacing:2px; }
        .slide-qr { position:absolute; bottom:20px; right:20px; background:#fff; padding:6px; border-radius:4px; width:80px; height:80px; display:flex; align-items:center; justify-content:center; }
        .slide-qr canvas, .slide-qr img { width:68px!important; height:68px!important; }
        .slide-content { background: radial-gradient(ellipse at 80% 20%, var(--surface3) 0%, var(--surface) 60%); display:flex; flex-direction:column; justify-content:center; padding:52px 56px; position:relative; border-left:1px solid var(--border); }
        .slide-content::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background: linear-gradient(90deg, var(--ci-td), var(--ci-tl)); }
        .slide-category { font-family:var(--font); font-weight:700; font-size:13px; letter-spacing:3px; text-transform:uppercase; color:var(--ci-td); margin-bottom:18px; }
        .slide-title { font-family:var(--font); font-weight:800; font-size:clamp(34px,3.2vw,54px); line-height:1.1; color:#fff; margin-bottom:22px; letter-spacing:-0.3px; }
        .slide-desc { font-family:var(--font); font-size:17px; font-weight:300; line-height:1.7; color:var(--text2); display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; margin-bottom:28px; }
        .slide-date-block { margin-top:auto; padding-top:22px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:4px; }
        .slide-date-label { font-family:var(--font); font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--muted); }
        .slide-date-value { font-family:var(--font); font-size:19px; font-weight:600; color:var(--ci-tl); letter-spacing:0.3px; }
        .slide-source-badge { display:inline-block; margin-top:8px; background:var(--surface3); border:1px solid var(--border); padding:3px 10px; font-family:var(--font); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); border-radius:2px; }
        #progress-bar { position:fixed; bottom:44px; left:0; right:0; z-index:100; height:3px; background:var(--surface3); }
        #progress-fill { height:100%; background: linear-gradient(90deg, var(--ci-td), var(--ci-tl)); width:0%; transition:width linear; }
        #statusbar { position:fixed; bottom:0; left:0; right:0; z-index:100; height:44px; background:#080f10; border-top:1px solid var(--border); display:flex; align-items:center; padding:0 44px; gap:24px; }
        .status-label { font-family:var(--font); font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ci-td); }
        .status-feed { font-family:var(--font); font-size:13px; font-weight:300; color:var(--muted); }
        .status-spacer { flex:1; }
        #dot-strip { display:flex; align-items:center; gap:6px; }
        .sdot { width:6px; height:6px; border-radius:50%; background:var(--surface3); transition:all 0.3s; }
        .sdot.active { background:var(--ci-td); width:18px; border-radius:3px; }
        #fs-btn { position:fixed; top:20px; right:14px; z-index:300; background:none; border:none; cursor:pointer; opacity:0.25; transition:opacity 0.2s; padding:4px; }
        #fs-btn:hover { opacity:0.8; }
        #fs-btn svg { fill:#fff; width:20px; height:20px; }
        #loading { position:fixed; inset:0; z-index:300; background:#080f10; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; }
        .logo-box-lg { background: radial-gradient(ellipse at 30% 30%, var(--ci-tl), var(--ci-td)); padding:12px 26px; font-family:var(--font); font-weight:800; font-size:44px; color:#fff; letter-spacing:-1px; }
        .spinner { width:36px; height:36px; border:2px solid var(--surface3); border-top-color:var(--ci-td); border-radius:50%; animation:spin 0.9s linear infinite; }
        #loading p { font-family:var(--font); font-size:13px; font-weight:300; color:var(--muted); letter-spacing:2px; text-transform:uppercase; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div id="topbar"></div>

      <div id="loading">
        <div className="logo-box-lg">ADV</div>
        <div className="spinner" id="spinner"></div>
        <p id="loading-msg">Feed wird geladen …</p>
      </div>

      <button id="fs-btn" title="Vollbild" aria-label="Vollbild">
        <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
      </button>

      <header id="header">
        <div className="logo-block">
          <div className="logo-box">ADV</div>
          <div className="logo-sub">Adventisten<br/>Deutschland</div>
        </div>
        <div className="header-divider"></div>
        <div id="weather-widget">
          <div id="weather-icon">—</div>
          <div id="weather-info">
            <div id="weather-temp">—°</div>
            <div id="weather-desc">Berlin</div>
            <div id="weather-city">DE</div>
          </div>
        </div>
        <div className="live-pill">Live</div>
        <div id="clock"></div>
      </header>

      <div id="breaking">
        <div id="breaking-label">Aktuell</div>
        <div id="ticker-outer"><div id="ticker-track"></div></div>
        <div id="countdown-badge">
          <span style={{fontSize:'10px',letterSpacing:'1px',fontWeight:'600'}}>NÄCHSTE</span>
          <span id="countdown-num">30</span>
          <span style={{fontSize:'10px'}}>s</span>
        </div>
      </div>

      <main id="stage"></main>
      <div id="progress-bar"><div id="progress-fill"></div></div>

      <div id="statusbar">
        <span className="status-label">Feed</span>
        <span className="status-feed">adventisten.de · APD</span>
        <div className="status-spacer"></div>
        <div id="dot-strip"></div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        const FEED_URL   = '/feed.json';
        const DISPLAY_MS = 30000;
        const MAX        = 15;
        let articles = [], current = 0, countdownInterval = null;

        const FEEDS = [
          { url: 'https://www.apd.info/news/rss',                label: 'APD' },
          { url: 'https://adventisten.de/aktuelles/news/rss',    label: 'Adventisten' },
        ];

        // CORS-Proxy-Kette: Browser probiert alle der Reihe nach
        const PROXIES = [
          (u) => 'https://corsproxy.io/?url=' + encodeURIComponent(u),
          (u) => 'https://api.allorigins.win/get?url=' + encodeURIComponent(u),
          (u) => 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(u),
        ];

        document.getElementById('fs-btn').addEventListener('click', () => {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
          else document.exitFullscreen().catch(()=>{});
        });
        window.addEventListener('click', function tryFs() {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
          window.removeEventListener('click', tryFs);
        }, { once: true });

        function updateClock() {
          document.getElementById('clock').textContent =
            new Date().toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
        }
        setInterval(updateClock, 1000); updateClock();

        async function fetchWeather() {
          try {
            const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405&current=temperature_2m,weathercode&timezone=Europe%2FBerlin');
            const data = await res.json();
            const temp = Math.round(data.current.temperature_2m);
            const code = data.current.weathercode;
            document.getElementById('weather-icon').textContent = weatherIcon(code);
            document.getElementById('weather-temp').textContent = temp + '°C';
            document.getElementById('weather-desc').textContent = weatherDesc(code);
            document.getElementById('weather-city').textContent = 'Berlin, DE';
          } catch(e) {}
        }
        function weatherIcon(c) {
          if(c===0) return '☀️'; if(c<=2) return '⛅'; if(c<=3) return '☁️';
          if(c<=48) return '🌫️'; if(c<=57) return '🌦️'; if(c<=67) return '🌧️';
          if(c<=77) return '❄️'; if(c<=82) return '🌧️'; if(c<=99) return '⛈️';
          return '🌡️';
        }
        function weatherDesc(c) {
          if(c===0) return 'Klar'; if(c<=2) return 'Teils bewölkt'; if(c<=3) return 'Bewölkt';
          if(c<=48) return 'Neblig'; if(c<=57) return 'Nieselregen'; if(c<=67) return 'Regen';
          if(c<=77) return 'Schnee'; if(c<=82) return 'Schauer'; if(c<=99) return 'Gewitter';
          return '';
        }
        fetchWeather(); setInterval(fetchWeather, 10*60*1000);

        function waitForQR(cb) {
          if (window.QRCode) { cb(window.QRCode); return; }
          const t = setInterval(() => { if (window.QRCode) { clearInterval(t); cb(window.QRCode); } }, 200);
        }
        function makeQR(container, url) {
          if (!url) return;
          waitForQR(QRCode => {
            try {
              new QRCode(container, { text: url, width:68, height:68, colorDark:'#000', colorLight:'#fff', correctLevel: QRCode.CorrectLevel.M });
            } catch(e) {}
          });
        }

        function startCountdown() {
          if (countdownInterval) clearInterval(countdownInterval);
          let secs = Math.round(DISPLAY_MS / 1000);
          const el = document.getElementById('countdown-num');
          if (el) el.textContent = secs;
          countdownInterval = setInterval(() => {
            secs--;
            if (el) el.textContent = Math.max(0, secs);
            if (secs <= 0) clearInterval(countdownInterval);
          }, 1000);
        }

        function stripHTML(h) { const d = document.createElement('div'); d.innerHTML = h; return (d.textContent||d.innerText||'').replace(/\\s+/g,' ').trim(); }
        function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

        function formatDate(pubDate) {
          if (!pubDate) return '';
          try { return new Date(pubDate).toLocaleDateString('de-DE', {weekday:'long',day:'2-digit',month:'long',year:'numeric'}); }
          catch(e) { return pubDate; }
        }

        function parseRSSXML(xml, sourceLabel) {
          const doc = new DOMParser().parseFromString(xml, 'text/xml');
          if (doc.querySelector('parsererror')) return [];
          return Array.from(doc.querySelectorAll('item')).map(item => {
            const title   = item.querySelector('title')?.textContent?.trim() || '';
            const rawDesc = item.querySelector('description')?.textContent || '';
            const desc    = stripHTML(rawDesc);
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            const cat     = item.querySelector('category')?.textContent?.trim() || sourceLabel;
            const link    = item.querySelector('link')?.textContent?.trim() || '';
            let img = '';
            const enc = item.querySelector('enclosure');
            if (enc) img = enc.getAttribute('url') || '';
            if (!img) { const t = item.querySelector('thumbnail'); if(t) img = t.getAttribute('url') || t.textContent?.trim() || ''; }
            if (!img) { const m = rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i); if(m) img = m[1]; }
            const rawDate = pubDate ? new Date(pubDate).getTime() : 0;
            return { title, desc, date: formatDate(pubDate), pubDate, rawDate, cat, img, link };
          }).filter(a => a.title);
        }

        function parseRSS2JSON(data, sourceLabel) {
          if (data.status !== 'ok' || !data.items) return [];
          return data.items.map(item => {
            const pubDate = item.pubDate || '';
            return {
              title: item.title || '',
              desc: stripHTML(item.description || item.content || ''),
              date: formatDate(pubDate),
              pubDate,
              rawDate: pubDate ? new Date(pubDate).getTime() : 0,
              cat: (item.categories && item.categories[0]) || sourceLabel,
              img: item.thumbnail || (item.enclosure && item.enclosure.link) || '',
              link: item.link || '',
            };
          }).filter(a => a.title);
        }

        async function fetchViaProxy(proxyUrl, proxyIdx, sourceLabel) {
          const ctrl = new AbortController();
          const tid = setTimeout(() => ctrl.abort(), 12000);
          try {
            const res = await fetch(proxyUrl, { signal: ctrl.signal });
            clearTimeout(tid);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            if (proxyIdx === 2) {
              const data = await res.json();
              return parseRSS2JSON(data, sourceLabel);
            } else if (proxyIdx === 1) {
              const data = await res.json();
              if (!data.contents) return [];
              return parseRSSXML(data.contents, sourceLabel);
            } else {
              const xml = await res.text();
              return parseRSSXML(xml, sourceLabel);
            }
          } catch(e) {
            clearTimeout(tid);
            throw e;
          }
        }

        async function fetchOneFeed(feedUrl, sourceLabel) {
          for (let i = 0; i < PROXIES.length; i++) {
            const proxyUrl = PROXIES[i](feedUrl);
            try {
              const items = await fetchViaProxy(proxyUrl, i, sourceLabel);
              if (items.length > 0) {
                console.log('[ADV] Proxy', i, 'OK:', sourceLabel, items.length, 'items');
                return items;
              }
            } catch(e) {
              console.warn('[ADV] Proxy', i, 'fehlgeschlagen für', sourceLabel, ':', e.message);
            }
          }
          return [];
        }

        async function fetchFeed() {
          // 1) Versuche statische feed.json (GitHub Actions)
          try {
            const ctrl = new AbortController();
            const tid = setTimeout(() => ctrl.abort(), 8000);
            const res = await fetch(FEED_URL + '?t=' + Date.now(), { signal: ctrl.signal });
            clearTimeout(tid);
            if (res.ok) {
              const data = await res.json();
              if (data.items && data.items.length > 0) {
                console.log('[ADV] Static feed.json OK:', data.items.length, 'items');
                return data.items.slice(0, MAX).map(a => ({
                  ...a, date: a.date || formatDate(a.pubDate),
                }));
              }
              console.log('[ADV] Static feed.json leer — Fallback auf Client-Side fetch');
            }
          } catch(e) {
            console.warn('[ADV] Static feed.json:', e.message);
          }

          // 2) Fallback: Client-Side via CORS-Proxy
          const allItems = [];
          for (const { url, label } of FEEDS) {
            const items = await fetchOneFeed(url, label);
            allItems.push(...items);
          }
          if (allItems.length === 0) throw new Error('Alle Quellen nicht erreichbar');
          allItems.sort((a, b) => (b.rawDate || 0) - (a.rawDate || 0));
          return allItems.slice(0, MAX);
        }

        function buildSlides() {
          const stage = document.getElementById('stage');
          stage.innerHTML = '';
          articles.forEach((a,i) => {
            const s = document.createElement('div');
            s.className = 'slide';
            const qrId = 'qr-' + i;
            s.innerHTML =
              '<div class="slide-image">' +
                (a.img
                  ? '<img src="'+esc(a.img)+'" alt="" loading="lazy"><div class="img-overlay"></div>'
                  : '<div class="no-img"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="0.5"><rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>') +
                '<div class="img-category">'+esc(a.cat)+'</div>' +
                '<div class="img-counter">'+String(i+1).padStart(2,'0')+' / '+articles.length+'</div>' +
                (a.link ? '<div class="slide-qr" id="'+qrId+'"></div>' : '') +
              '</div>' +
              '<div class="slide-content">' +
                '<div class="slide-category">'+esc(a.cat)+'</div>' +
                '<h2 class="slide-title">'+esc(a.title)+'</h2>' +
                (a.desc ? '<p class="slide-desc">'+esc(a.desc)+'</p>' : '') +
                '<div class="slide-date-block">' +
                  '<span class="slide-date-label">Veröffentlicht</span>' +
                  '<span class="slide-date-value">'+esc(a.date)+'</span>' +
                  (a.cat ? '<span class="slide-source-badge">'+esc(a.cat)+'</span>' : '') +
                '</div>' +
              '</div>';
            stage.appendChild(s);
            if (a.link) {
              requestAnimationFrame(() => makeQR(document.getElementById(qrId), a.link));
            }
          });
        }

        function buildDots() {
          document.getElementById('dot-strip').innerHTML =
            articles.map((_,i) => '<div class="sdot'+(i===0?' active':'')+'"></div>').join('');
        }

        function buildTicker() {
          const items = articles.map(a => '<span>'+esc(a.cat)+' — '+esc(a.title)+'</span><span class="sep"> // </span>').join('');
          document.getElementById('ticker-track').innerHTML = items + items;
        }

        function updateDots(idx) {
          document.querySelectorAll('.sdot').forEach((d,i) => d.classList.toggle('active', i===idx));
        }

        function startProgress() {
          const f = document.getElementById('progress-fill');
          f.style.transition = 'none'; f.style.width = '0%';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            f.style.transition = 'width '+DISPLAY_MS+'ms linear';
            f.style.width = '100%';
          }));
        }

        function showSlide(idx) {
          const prev = document.querySelector('.slide.active');
          if (prev) {
            prev.classList.remove('active');
            prev.classList.add('exit');
            setTimeout(() => prev.classList.remove('exit'), 750);
          }
          document.querySelectorAll('.slide')[idx]?.classList.add('active');
          updateDots(idx);
          startProgress();
          startCountdown();
        }

        async function refresh() {
          try {
            const fresh = await fetchFeed();
            if (fresh.length) { articles = fresh; buildSlides(); buildDots(); buildTicker(); showSlide(current % articles.length); }
          } catch(e) { console.warn('[ADV] Refresh:', e); }
        }

        (async () => {
          try {
            articles = await fetchFeed();
            if (!articles.length) throw new Error('Feed leer.');
            buildSlides(); buildDots(); buildTicker();
            document.getElementById('loading').style.display = 'none';
            showSlide(0);
            setInterval(() => { current = (current+1) % articles.length; showSlide(current); }, DISPLAY_MS);
            setInterval(refresh, 5*60*1000);
          } catch(e) {
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('loading-msg').textContent = 'Feed nicht erreichbar – wird erneut versucht.';
            setTimeout(() => location.reload(), 60000);
          }
        })();
      `}} />
    </>
  )
}
