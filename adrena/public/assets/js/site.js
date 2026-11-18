/* site.js — header/footer injection, nav, theme, copy buttons, gallery */
(function () {
  'use strict';

  /* ---- Configurable content ---- */
  // Gallery: masonry, every item keeps its real shape (ar = width/height), so nothing is cropped.
  // cls hero = full-width row on top. alt is screen-reader text only (no captions on photos).
  // home: true = shown in the homepage strip.
  const GALLERY = [
    {src:'../media/video-slidinejimas.mp4',       ar:'16/9', cls:'hero', alt:'Slidinėjimas per šviežią sniegą, vaizdas iš slidininko akių'},
    {src:'../media/kaitavimas-suolis.webp',       ar:'3/4',  alt:'Kaituotojas šuolio metu prieš mėlyną dangų', home:true},
    {src:'../media/video-kaitavimas.mp4',         ar:'9/16', alt:'Kaitavimas mariose, vaizdas iš kaituotojo akių', home:true},
    {src:'../media/vandenlente-saulelydis.webp',  ar:'3/4',  alt:'Vandenlentė už valties saulėlydžio metu', home:true},
    {src:'../media/kaitavimas-mariose.webp',      ar:'3/4',  alt:'Kaituotojas seklioje marių įlankoje'},
    {src:'../media/video-sniego-kaitavimas.mp4',  ar:'9/16', alt:'Sniego kaitavimas ant užšalusio ežero', home:true},
    {src:'../media/kaitavimas-krante.webp',       ar:'3/4',  alt:'Kaituotojas ruošiasi startui ant kranto'},
    {src:'../media/snieglente-sniege.webp',       ar:'3/4',  alt:'Snieglentininkas sniege su snieglente rankoje'},
    {src:'../media/banglentes-papludimys.webp',   ar:'3/4',  alt:'Du banglentininkai su lentomis paplūdimyje', pos:'50% 45%'},
  ];

  /* ---- Helpers ---- */
  const esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  };
  const wavePattern = '<svg viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M-10 70 C20 50 50 50 80 66 S140 84 210 56" fill="none" stroke="#fff" stroke-width="3"/><path d="M-10 92 C25 76 55 76 85 88 S145 102 210 80" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/></svg>';

  /* ---- Theme (also run early via inline script) ---- */
  var savedTheme = localStorage.getItem('adrena-theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  /* ---- Language / path detection ---- */
  var pathname = window.location.pathname.replace(/\\/g, '/');
  var inEN = pathname.indexOf('/en/') !== -1 || pathname.match(/\/en$/);
  var isEN = document.documentElement.lang === 'en' || !!inEN;
  var base = inEN ? '../' : '';

  var PAGE_MAP = {
    lt: { home:'index.html', how:'kaip-veikia.html', wind:'vejas.html', proto:'prototipas.html', instr:'instruktoriams.html', about:'apie.html', contact:'kontaktai.html', privacy:'privatumas.html' },
    en: { home:'index.html', how:'how-it-works.html', wind:'wind.html', proto:'prototype.html', instr:'for-instructors.html', about:'about.html', contact:'contact.html', privacy:'privacy.html' },
  };

  var activePage = document.body && document.body.dataset.page || '';

  var otherLangDir  = isEN ? '' : 'en/';
  var otherLangFile = isEN ? (PAGE_MAP.lt[activePage] || 'index.html') : (PAGE_MAP.en[activePage] || 'index.html');
  var langHref = base + otherLangDir + otherLangFile;

  /* ---- SVGs ---- */
  var logoHeader = '<svg viewBox="0 20 404 92" role="img" aria-hidden="true"><g transform="translate(-6 16.5) scale(0.93)"><defs><linearGradient id="hg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FF5A36"/><stop offset="1" stop-color="#FF8A3D"/></linearGradient><mask id="hm" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/></mask></defs><path d="M18 84 L50 16 L82 84" fill="none" stroke="url(#hg)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" mask="url(#hm)"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#0FA3A0" stroke-width="9" stroke-linecap="round"/></g><g transform="translate(100 0)"><g fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><circle cx="21.5" cy="80" r="17"/><path d="M38.5 63 V97"/><circle cx="76.5" cy="80" r="17"/><path d="M93.5 36 V97"/><path d="M114.5 97 V63 M114.5 80 A17 17 0 0 1 131.5 63"/><path d="M148.5 80 H182.5 A17 17 0 1 0 177.5 92"/><path d="M203.5 63 V97 M203.5 80 A17 17 0 0 1 237.5 80 V97"/><circle cx="275.5" cy="80" r="17"/><path d="M292.5 63 V97"/></g></g></svg>';
  var logoFooter = '<svg viewBox="0 20 404 92" aria-label="Adrena" role="img"><g transform="translate(-6 16.5) scale(0.93)"><defs><linearGradient id="fg2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FF5A36"/><stop offset="1" stop-color="#FF8A3D"/></linearGradient><mask id="fm2" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/></mask></defs><path d="M18 84 L50 16 L82 84" fill="none" stroke="url(#fg2)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" mask="url(#fm2)"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#0FA3A0" stroke-width="9" stroke-linecap="round"/></g><g transform="translate(100 0)"><g fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><circle cx="21.5" cy="80" r="17"/><path d="M38.5 63 V97"/><circle cx="76.5" cy="80" r="17"/><path d="M93.5 36 V97"/><path d="M114.5 97 V63 M114.5 80 A17 17 0 0 1 131.5 63"/><path d="M148.5 80 H182.5 A17 17 0 1 0 177.5 92"/><path d="M203.5 63 V97 M203.5 80 A17 17 0 0 1 237.5 80 V97"/><circle cx="275.5" cy="80" r="17"/><path d="M292.5 63 V97"/></g></g></svg>';
  var themeIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

  /* ---- Nav ---- */
  var NAV_LT = [
    {key:'home',    href:base+'index.html',          label:'Pradžia'},
    {key:'how',     href:base+'kaip-veikia.html',    label:'Kaip veikia'},
    {key:'wind',    href:base+'vejas.html',          label:'Vėjo prognozė'},
    {key:'proto',   href:base+'prototipas.html',     label:'Išbandyk', cta:true},
    {key:'instr',   href:base+'instruktoriams.html', label:'Instruktoriams'},
    {key:'about',   href:base+'apie.html',           label:'Apie mus'},
    {key:'contact', href:base+'kontaktai.html',      label:'Kontaktai'},
  ];
  var NAV_EN = [
    {key:'home',    href:base+'index.html',           label:'Home'},
    {key:'how',     href:base+'how-it-works.html',    label:'How it works'},
    {key:'wind',    href:base+'wind.html',            label:'Wind forecast'},
    {key:'proto',   href:base+'prototype.html',       label:'Try it', cta:true},
    {key:'instr',   href:base+'for-instructors.html', label:'For instructors'},
    {key:'about',   href:base+'about.html',           label:'About us'},
    {key:'contact', href:base+'contact.html',         label:'Contact'},
  ];
  var NAV = isEN ? NAV_EN : NAV_LT;

  /* ---- Inject header ---- */
  var headerEl = document.getElementById('site-header');
  if (headerEl) {
    headerEl.className = 'top';
    headerEl.innerHTML =
      '<div class="wrap">' +
        '<a class="brand" href="' + base + 'index.html" aria-label="Adrena">' + logoHeader + '</a>' +
        '<button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="main-nav">' + (isEN ? 'Menu' : 'Meniu') + '</button>' +
        '<nav class="nav" id="main-nav" aria-label="' + (isEN ? 'Main navigation' : 'Pagrindinis meniu') + '">' +
          NAV.map(function (n) {
            var cls = n.cta ? 'cta-s' : activePage === n.key ? 'active' : '';
            return '<a href="' + n.href + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + n.label + '</a>';
          }).join('') +
          '<button class="theme-toggle" id="themeToggle" aria-label="' + (isEN ? 'Toggle theme' : 'Keisti temą') + '">' + themeIcon + '</button>' +
        '</nav>' +
      '</div>';
  }

  /* ---- Inject footer ---- */
  var footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML =
      '<div class="wrap">' +
        '<a href="' + base + 'index.html" aria-label="Adrena">' + logoFooter + '</a>' +
        '<span>© 2026 Adrena · Mokinių bendrovė</span>' +
        '<a href="' + base + (isEN ? 'en/privacy.html' : 'privatumas.html') + '">' + (isEN ? 'Privacy policy' : 'Privatumo politika') + '</a>' +
      '</div>';
  }

  /* ---- Delegated events ---- */
  document.addEventListener('click', function (e) {
    // Theme toggle
    if (e.target.closest('#themeToggle')) {
      var cur = document.documentElement.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('adrena-theme', next); } catch (err) {}
    }
    // Mobile menu open/close
    if (e.target.closest('#menuBtn')) {
      var nav = document.getElementById('main-nav');
      var open = nav.classList.toggle('open');
      document.getElementById('menuBtn').setAttribute('aria-expanded', String(open));
    }
    // Close menu when a link is clicked
    if (e.target.closest('#main-nav a')) {
      var n2 = document.getElementById('main-nav');
      if (n2) n2.classList.remove('open');
      var mb = document.getElementById('menuBtn');
      if (mb) mb.setAttribute('aria-expanded', 'false');
    }
    // Copy buttons
    var copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      var target = document.getElementById(copyBtn.dataset.copy);
      if (!target) return;
      var original = copyBtn.textContent;
      var done = function () {
        copyBtn.textContent = isEN ? 'Copied' : 'Nukopijuota';
        setTimeout(function () { copyBtn.textContent = original; }, 1600);
      };
      try { navigator.clipboard.writeText(target.textContent).then(done, function () { selectText(target); done(); }); }
      catch (err) { selectText(target); done(); }
    }
  });

  function selectText(el) {
    var r = document.createRange();
    r.selectNodeContents(el);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  /* ---- Gallery rendering ---- */
  var isVideo = function (g) { return /\.(mp4|webm)$/i.test(g.src); };
  var ratio = function (g) { var p = String(g.ar || '1/1').split('/'); return (+p[0]) / (+p[1] || 1); };

  function itemHTML(g, plain) {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pos = 'object-position:' + (g.pos || '50% 50%');
    var media = isVideo(g)
      ? '<video src="' + esc(g.src) + '" poster="' + esc(g.src.replace(/\.(mp4|webm)$/i, '-poster.webp')) + '" muted loop playsinline' + (reduceMotion ? '' : ' autoplay') + ' preload="' + (reduceMotion ? 'none' : 'auto') + '" aria-label="' + esc(g.alt) + '" style="' + pos + '"></video>'
      : '<img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" loading="lazy" style="' + pos + '" onerror="this.closest(\'.g-item\').style.display=\'none\'">';
    // Videos keep their exact shape; photos start at 6:7 and stretch to fill the column (cover crop)
    var shape = plain ? '' : ' style="aspect-ratio:' + (isVideo(g) ? g.ar : '6/7') + '"';
    return '<figure class="g-item' + (isVideo(g) ? ' is-video' : '') + '"' + shape + '>' + media + '</figure>';
  }

  // Split items into n columns (keeping order) so the columns end level.
  // Brute force is fine for a small gallery (n^k combinations).
  function splitColumns(items, n, gapRatio) {
    var k = items.length, best = null, bestCost = Infinity, total = Math.pow(n, k);
    if (total > 200000) { // too many: round-robin fallback
      var rr = []; for (var c = 0; c < n; c++) rr.push([]);
      items.forEach(function (g, i) { rr[i % n].push(g); }); return rr;
    }
    for (var code = 0; code < total; code++) {
      var h = [], cnt = [], photos = [], x = code;
      for (var c2 = 0; c2 < n; c2++) { h.push(0); cnt.push(0); photos.push(0); }
      for (var i = 0; i < k; i++) {
        var col = x % n; x = Math.floor(x / n);
        h[col] += isVideo(items[i]) ? 1 / ratio(items[i]) : 7 / 6;
        cnt[col]++; if (!isVideo(items[i])) photos[col]++;
      }
      if (cnt.indexOf(0) !== -1) continue;
      for (var c3 = 0; c3 < n; c3++) h[c3] += (cnt[c3] - 1) * gapRatio;
      var max = Math.max.apply(null, h), cost = max;
      // A column with no photos cannot stretch, so it must not be shorter than the rest
      for (var c4 = 0; c4 < n; c4++) if (!photos[c4]) cost += (max - h[c4]) * 10;
      if (cost < bestCost) { bestCost = cost; best = code; }
    }
    var cols = []; for (var c5 = 0; c5 < n; c5++) cols.push([]);
    for (var j = 0, y = best; j < k; j++) { cols[y % n].push(items[j]); y = Math.floor(y / n); }
    return cols;
  }

  function renderGallery(containerId, items, plain) {
    var el = document.getElementById(containerId || 'gallery');
    if (!el) return;
    items = items || GALLERY;
    if (plain) { el.innerHTML = items.map(function (g) { return itemHTML(g, true); }).join(''); return; }

    var mq = window.matchMedia('(max-width: 760px)');
    var lastN = 0;
    function layout() {
      var n = mq.matches ? 2 : 3;
      if (n === lastN) return; lastN = n;
      var hero = items.filter(function (g) { return g.cls === 'hero'; });
      var rest = items.filter(function (g) { return g.cls !== 'hero'; });
      var colW = Math.max(100, (el.clientWidth - 12 * (n - 1)) / n);
      var cols = splitColumns(rest, n, 12 / colW);
      el.innerHTML =
        hero.map(function (g) { return itemHTML(g).replace('class="g-item', 'class="g-item hero'); }).join('') +
        '<div class="g-cols">' + cols.map(function (col) {
          return '<div class="g-col">' + col.map(function (g) { return itemHTML(g); }).join('') + '</div>';
        }).join('') + '</div>';
    }
    layout();
    if (mq.addEventListener) mq.addEventListener('change', layout); else mq.addListener(layout);
  }

  if (document.getElementById('gallery'))       renderGallery('gallery', GALLERY);
  if (document.getElementById('gallery-strip')) renderGallery('gallery-strip', GALLERY.filter(function (g) { return g.home; }), true);

  /* ---- Home sport tiles ---- */
  // One place to swap photos. img2x present = WebP with srcset; otherwise single size.
  var SPORT_TILES = [
    { id:'kaitavimas',   name:'Kaitavimas',            link:'prototipas.html', grad:'135deg,#0FA3A0,#0E5E7E', pos:'40% 22%', alt:'Kaituotojas ant bangų saulėlydžio metu', img:base+'media/sports/kaitavimas.webp' },
    { id:'banglentes',   name:'Banglentės',            link:'prototipas.html', grad:'135deg,#1C7ED6,#0E4E6E', pos:'50% 50%', alt:'Banglentininkas ant bangos saulėlydžio metu', img:base+'media/sports/banglentes.webp', img2x:base+'media/sports/banglentes_2x.webp' },
    { id:'vandenlentes', name:'Vandenlentės',          link:'prototipas.html', grad:'135deg,#0E6E8C,#163E63', pos:'35% 30%', alt:'Vandenlentininkas šokinėja nuo kliūties vandenlenčių parke', img:base+'media/sports/vandenlentes.webp' },
    { id:'slides',       name:'Slidės ir snieglentės', link:'prototipas.html', grad:'135deg,#7FA7C9,#3D5A80', pos:'45% 45%', alt:'Snieglentininkas posūkyje ant šlaito', img:base+'media/sports/slides.webp' },
    { id:'parasparnis',  name:'Parasparnis',           link:'prototipas.html', grad:'135deg,#FF8A3D,#E2542F', pos:'50% 50%', alt:'Parasparnis saulėlydžio danguje', img:base+'media/sports/parasparnis.webp', img2x:base+'media/sports/parasparnis_2x.webp' },
    { id:'parasiutas',   name:'Parašiutas',            link:'prototipas.html', grad:'135deg,#FF5A36,#A83256', pos:'50% 50%', alt:'Parašiutininkas su parašiutu danguje', img:base+'media/sports/parasiutas.webp', img2x:base+'media/sports/parasiutas_2x.webp' },
    { id:'laipiojimas',  name:'Laipiojimas',           link:'prototipas.html', grad:'135deg,#9A7A52,#4E3B2A', pos:'50% 50%', alt:'Laipiotojas ant uolos', img:base+'media/sports/laipiojimas.webp', img2x:base+'media/sports/laipiojimas_2x.webp' },
    { id:'nardymas',     name:'Nardymas',              link:'prototipas.html', grad:'135deg,#1E4E7A,#0E1B2C', pos:'50% 50%', alt:'Naras mėlyname vandenyje', img:base+'media/sports/nardymas.webp', img2x:base+'media/sports/nardymas_2x.webp' },
  ];

  var sportGrid = document.getElementById('sports-home-grid');
  if (sportGrid) {
    sportGrid.innerHTML = SPORT_TILES.map(function (t) {
      var srcset = t.img2x ? ' srcset="' + esc(t.img) + ' 900w, ' + esc(t.img2x) + ' 1800w" sizes="(max-width:760px) 50vw, 25vw"' : '';
      var tileBg = 'background:linear-gradient(' + t.grad + ')';
      var overlay = 'background:linear-gradient(to top, rgba(14,27,44,.9) 0%, rgba(14,27,44,.1) 55%, transparent 100%)';
      return '<a href="' + esc(t.link) + '" class="sport-home-tile" aria-label="' + esc(t.name) + '" style="' + tileBg + '">' +
        '<img src="' + esc(t.img) + '"' + srcset + ' alt="' + esc(t.alt) + '" loading="lazy" width="450" height="300" style="object-position:' + t.pos + '" onerror="this.style.display=\'none\'">' +
        '<span class="tile-overlay" style="' + overlay + '"></span>' +
        '<span class="tile-label">' + esc(t.name) + '</span>' +
      '</a>';
    }).join('');
  }

  /* ---- Scroll reveal ---- */
  function setupReveal() {
    if (!window.IntersectionObserver) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var selectors = [
      '.sec-head', '.compare', '.edge', '.vs-wrap', '.vs-legend',
      '.flow', '.tech', '.impact', '.measure',
      '.values', '.instr', '.team', '.biz',
      '.gallery', '.gallery-strip', '.partners',
      '.faq', '.c-list', '.demo-side', '.phone-wrap',
      '.demo-teaser-text', '.form-box',
    ];
    var els = document.querySelectorAll(selectors.join(','));
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });
    els.forEach(function (el) { el.classList.add('reveal'); obs.observe(el); });
  }
  setTimeout(setupReveal, 80);

  /* ---- Gallery lightbox ---- */
  (function () {
    var lb = null;
    var items = [];
    var idx = 0;

    function open(images, startIdx) {
      items = images; idx = startIdx;
      lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', isEN ? 'Photo' : 'Nuotrauka');
      lb.innerHTML =
        '<img src="" alt="">' +
        '<button class="lb-close" aria-label="' + (isEN ? 'Close' : 'Uždaryti') + '">✕</button>' +
        (items.length > 1
          ? '<button class="lb-prev" aria-label="' + (isEN ? 'Previous' : 'Ankstesnė') + '"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
            '<button class="lb-next" aria-label="' + (isEN ? 'Next' : 'Kita') + '"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg></button>'
          : '');
      document.body.appendChild(lb);
      document.body.style.overflow = 'hidden';
      show(idx);
      lb.addEventListener('click', function (e) {
        if (e.target === lb || e.target.closest('.lb-close')) close();
        if (e.target.closest('.lb-prev')) { idx = (idx - 1 + items.length) % items.length; show(idx); }
        if (e.target.closest('.lb-next')) { idx = (idx + 1) % items.length; show(idx); }
      });
    }

    function show(i) {
      var img = lb.querySelector('img');
      img.src = items[i].src;
      img.alt = items[i].alt || '';
    }

    function close() {
      if (!lb) return;
      lb.remove(); lb = null;
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function (e) {
      if (!lb) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft')  { idx = (idx - 1 + items.length) % items.length; show(idx); }
      if (e.key === 'ArrowRight') { idx = (idx + 1) % items.length; show(idx); }
    });

    document.addEventListener('click', function (e) {
      var item = e.target.closest('.g-item');
      if (!item) return;
      var img = item.querySelector('img');
      if (!img) return;
      var gallery = item.closest('.gallery, .gallery-strip');
      if (!gallery) return;
      var allImgs = Array.from(gallery.querySelectorAll('.g-item img')).map(function (i) {
        return { src: i.src, alt: i.alt };
      });
      var startIdx = allImgs.findIndex(function (x) { return x.src === img.src; });
      open(allImgs, Math.max(0, startIdx));
    });
  })();

  /* ---- Formspree form submissions ---- */
  /* All forms share one Formspree form; form_type tells the submissions apart. */
  var FORM_SUBJECT = {
    'waitlist':   'Adrena: nauja registracija į laukiančiųjų sąrašą',
    'instructor': 'Adrena: nauja instruktoriaus užklausa',
    'contact':    'Adrena: nauja žinutė',
  };

  var MSG = isEN ? {
    sending:       'Sending...',
    success:       'Thank you! We got your message and will get back to you soon.',
    notConfigured: 'This form is not set up yet. Please email us at rasauadrena@gmail.com.',
    networkErr:    'Something went wrong. Please try again or email us at rasauadrena@gmail.com.',
  } : {
    sending:       'Siunčiama...',
    success:       'Ačiū! Gavome tavo žinutę ir netrukus susisieksime.',
    notConfigured: 'Forma dar nesukonfigūruota. Parašyk mums el. paštu rasauadrena@gmail.com.',
    networkErr:    'Kažkas nepavyko. Bandyk dar kartą arba parašyk mums el. paštu rasauadrena@gmail.com.',
  };

  var fsCfg = (window.ADRENA_CONFIG && window.ADRENA_CONFIG.formspree) || {};

  document.querySelectorAll('form[data-form-type]').forEach(function (form) {
    form.removeAttribute('onsubmit');
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var type      = form.dataset.formType;
      var statusEl  = form.querySelector('.form-status');
      var submitBtn = form.querySelector('.form-submit');

      function showStatus(cls, msg) {
        if (!statusEl) return;
        statusEl.className = 'form-status ' + cls;
        statusEl.textContent = msg;
        statusEl.hidden = false;
        statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (!fsCfg.formId) { showStatus('error', MSG.notConfigured); return; }

      /* Browser validation */
      if (!form.checkValidity()) { form.reportValidity(); return; }

      /* Honeypot: bots fill hidden fields */
      var hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) return;

      var origLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = MSG.sending;
      }
      if (statusEl) statusEl.hidden = true;

      var data = new FormData(form);
      data.append('form_type', type);
      data.append('page_lang', isEN ? 'en' : 'lt');
      if (FORM_SUBJECT[type]) data.append('_subject', FORM_SUBJECT[type]);

      fetch((fsCfg.endpoint || 'https://formspree.io/f/') + fsCfg.formId, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data,
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; })
            .then(function (j) { return { ok: r.ok, body: j || {} }; });
        })
        .then(function (res) {
          if (res.ok && res.body.ok !== false) {
            form.reset();
            showStatus('success', MSG.success);
            return;
          }
          var errs = (res.body.errors || [])
            .map(function (er) { return er && er.message; })
            .filter(Boolean);
          showStatus('error', errs.length ? errs.join(' ') : MSG.networkErr);
        })
        .catch(function () {
          showStatus('error', MSG.networkErr);
        })
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origLabel;
          }
        });
    });
  });

})();
