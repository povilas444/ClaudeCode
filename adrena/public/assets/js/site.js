/* site.js — header/footer injection, nav, theme, copy buttons, gallery */
(function () {
  'use strict';

  /* ---- Configurable content ---- */
  // Gallery: masonry, every item keeps its real shape (ar = width/height), so nothing is cropped.
  // cls hero = full-width row on top. alt is screen-reader text only (no captions on photos).
  // home: true = shown in the homepage strip.
  const GALLERY = [
    {src:'../media/video-slidinejimas.mp4',       ar:'16/9', cls:'hero', alt:'Slidinėjimas per šviežią sniegą, vaizdas iš slidininko akių', en:'Skiing through fresh powder, seen from the skier\'s eyes'},
    {src:'../media/kaitavimas-suolis.webp',       ar:'3/4',  alt:'Kaituotojas šuolio metu prieš mėlyną dangų', en:'Kitesurfer mid-jump against a blue sky', home:true},
    {src:'../media/video-kaitavimas.mp4',         ar:'9/16', alt:'Kaitavimas mariose, vaizdas iš kaituotojo akių', en:'Kitesurfing on the lagoon, seen from the rider\'s eyes', home:true},
    {src:'../media/vandenlente-saulelydis.webp',  ar:'3/4',  alt:'Vandenlentė už valties saulėlydžio metu', en:'Wakeboarding behind a boat at sunset', home:true},
    {src:'../media/kaitavimas-mariose.webp',      ar:'3/4',  alt:'Kaituotojas seklioje marių įlankoje', en:'Kitesurfer in a shallow lagoon bay'},
    {src:'../media/video-sniego-kaitavimas.mp4',  ar:'9/16', alt:'Sniego kaitavimas ant užšalusio ežero', en:'Snowkiting on a frozen lake', home:true},
    {src:'../media/kaitavimas-krante.webp',       ar:'3/4',  alt:'Kaituotojas ruošiasi startui ant kranto', en:'Kitesurfer getting ready to launch on the shore'},
    {src:'../media/snieglente-sniege.webp',       ar:'3/4',  alt:'Snieglentininkas sniege su snieglente rankoje', en:'Snowboarder in the snow holding a board'},
    {src:'../media/banglentes-papludimys.webp',   ar:'3/4',  alt:'Du banglentininkai su lentomis paplūdimyje', en:'Two surfers with their boards on the beach', pos:'50% 45%'},
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
  var here = base + (isEN ? 'en/' : '');   // folder of the current language

  var PAGE_MAP = {
    lt: { home:'index.html', how:'kaip-veikia.html', wind:'vejas.html', proto:'prototipas.html', instr:'instruktoriams.html', about:'apie.html', contact:'kontaktai.html', privacy:'privatumas.html' },
    en: { home:'index.html', how:'how-it-works.html', wind:'wind.html', proto:'prototype.html', instr:'for-instructors.html', about:'about.html', contact:'contact.html', privacy:'privacy.html' },
  };

  var activePage = document.body && document.body.dataset.page || '';
  var P = isEN ? PAGE_MAP.en : PAGE_MAP.lt;
  if (isEN) GALLERY.forEach(function (g) { if (g.en) g.alt = g.en; });

  var otherLangDir  = isEN ? '' : 'en/';
  var otherLangFile = isEN ? (PAGE_MAP.lt[activePage] || 'index.html') : (PAGE_MAP.en[activePage] || 'index.html');
  var langHref = base + otherLangDir + otherLangFile;

  /* ---- SVGs ---- */
  var logoHeader = '<svg viewBox="0 20 404 92" role="img" aria-hidden="true"><g transform="translate(-6 16.5) scale(0.93)"><defs><mask id="hm" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/></mask></defs><path d="M18 84 L50 16 L82 84" fill="none" style="stroke:var(--logo-a,#C8381B)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" mask="url(#hm)"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" style="stroke:var(--logo-w,#1D5BB5)" stroke-width="9" stroke-linecap="round"/></g><g transform="translate(100 0)"><g fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><circle cx="21.5" cy="80" r="17"/><path d="M38.5 63 V97"/><circle cx="76.5" cy="80" r="17"/><path d="M93.5 36 V97"/><path d="M114.5 97 V63 M114.5 80 A17 17 0 0 1 131.5 63"/><path d="M148.5 80 H182.5 A17 17 0 1 0 177.5 92"/><path d="M203.5 63 V97 M203.5 80 A17 17 0 0 1 237.5 80 V97"/><circle cx="275.5" cy="80" r="17"/><path d="M292.5 63 V97"/></g></g></svg>';
  var logoFooter = '<svg viewBox="0 20 404 92" aria-label="Adrena" role="img"><g transform="translate(-6 16.5) scale(0.93)"><defs><mask id="fm2" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/></mask></defs><path d="M18 84 L50 16 L82 84" fill="none" style="stroke:var(--logo-a,#C8381B)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" mask="url(#fm2)"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" style="stroke:var(--logo-w,#1D5BB5)" stroke-width="9" stroke-linecap="round"/></g><g transform="translate(100 0)"><g fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><circle cx="21.5" cy="80" r="17"/><path d="M38.5 63 V97"/><circle cx="76.5" cy="80" r="17"/><path d="M93.5 36 V97"/><path d="M114.5 97 V63 M114.5 80 A17 17 0 0 1 131.5 63"/><path d="M148.5 80 H182.5 A17 17 0 1 0 177.5 92"/><path d="M203.5 63 V97 M203.5 80 A17 17 0 0 1 237.5 80 V97"/><circle cx="275.5" cy="80" r="17"/><path d="M292.5 63 V97"/></g></g></svg>';
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
    {key:'home',    href:here+'index.html',           label:'Home'},
    {key:'how',     href:here+'how-it-works.html',    label:'How it works'},
    {key:'wind',    href:here+'wind.html',            label:'Wind forecast'},
    {key:'proto',   href:here+'prototype.html',       label:'Try it', cta:true},
    {key:'instr',   href:here+'for-instructors.html', label:'For instructors'},
    {key:'about',   href:here+'about.html',           label:'About us'},
    {key:'contact', href:here+'contact.html',         label:'Contact'},
  ];
  var NAV = isEN ? NAV_EN : NAV_LT;

  /* LT | EN switch: the current language is plain text, the other one links to the same page in that language */
  function langSwitch() {
    var lt = isEN ? '<a href="' + langHref + '" hreflang="lt" lang="lt">LT</a>' : '<span aria-current="true">LT</span>';
    var en = isEN ? '<span aria-current="true">EN</span>' : '<a href="' + langHref + '" hreflang="en" lang="en">EN</a>';
    return '<div class="lang-switch" role="group" aria-label="' + (isEN ? 'Language' : 'Kalba') + '">' + lt + en + '</div>';
  }

  /* ---- Inject header ---- */
  var headerEl = document.getElementById('site-header');
  if (headerEl) {
    headerEl.className = 'top';
    headerEl.innerHTML =
      '<div class="wrap">' +
        '<a class="brand" href="' + here + 'index.html" aria-label="Adrena">' + logoHeader + '</a>' +
        '<button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="main-nav">' + (isEN ? 'Menu' : 'Meniu') + '</button>' +
        '<nav class="nav" id="main-nav" aria-label="' + (isEN ? 'Main navigation' : 'Pagrindinis meniu') + '">' +
          NAV.map(function (n) {
            var cls = n.cta ? 'cta-s' : activePage === n.key ? 'active' : '';
            return '<a href="' + n.href + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + n.label + '</a>';
          }).join('') +
          '<div class="nav-tools">' + langSwitch() +
            '<button class="theme-toggle" id="themeToggle" aria-label="' + (isEN ? 'Toggle theme' : 'Keisti temą') + '">' + themeIcon + '</button>' +
          '</div>' +
        '</nav>' +
      '</div>';
  }

  /* ---- Inject footer ---- */
  var footerEl = document.getElementById('site-footer');
  var T = isEN ? {
    tagline: 'Every extreme sport. One app.', pages: 'Pages', contact: 'Contact', partner: 'Partner', sponsor: 'Sponsors',
    partnerDesc: 'IKO certified kite centre in Svencelė', sponsorCta: 'Become an Adrena sponsor →',
    company: 'Student company', privacy: 'Privacy policy',
  } : {
    tagline: 'Visas ekstremalus sportas. Vienoje programėlėje.', pages: 'Puslapiai', contact: 'Kontaktai', partner: 'Partneris', sponsor: 'Rėmėjai',
    partnerDesc: 'IKO sertifikuotas kaitavimo centras Svencelėje', sponsorCta: 'Tapk Adrenos rėmėju →',
    company: 'Mokinių bendrovė', privacy: 'Privatumo politika',
  };

  if (footerEl) {
    footerEl.innerHTML =
      '<div class="wrap foot-grid">' +
        '<div class="foot-brand">' +
          '<a href="' + here + 'index.html" aria-label="Adrena">' + logoFooter + '</a>' +
          '<p class="foot-tagline">' + T.tagline + '</p>' +
          langSwitch() +
        '</div>' +
        '<nav class="foot-col" aria-label="' + T.pages + '"><h3>' + T.pages + '</h3>' +
          NAV.map(function (n) { return '<a href="' + n.href + '">' + n.label + '</a>'; }).join('') +
        '</nav>' +
        '<div class="foot-col"><h3>' + T.contact + '</h3>' +
          '<a href="mailto:rasauadrena@gmail.com">rasauadrena@gmail.com</a>' +
          '<a href="https://www.instagram.com/adrena_extreme/" target="_blank" rel="noopener">Instagram @adrena_extreme ↗</a>' +
        '</div>' +
        '<div class="foot-col"><h3>' + T.partner + '</h3>' +
          '<a class="foot-partner" href="https://www.pucia.lt" target="_blank" rel="noopener">PUČIA.LT ↗</a>' +
          '<span class="foot-note">' + T.partnerDesc + '</span>' +
          '<h3 style="margin-top:16px">' + T.sponsor + '</h3>' +
          '<a href="' + here + P.contact + '">' + T.sponsorCta + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="wrap foot-bottom">' +
        '<span>© 2026 Adrena · ' + T.company + '</span>' +
        '<a href="' + here + P.privacy + '">' + T.privacy + '</a>' +
      '</div>';
  }

  /* ---- Final call to action before the footer (pages without their own sign-up form) ---- */
  var NO_CTA = { home: 1, instr: 1 };
  var mainEl = document.querySelector('main');
  if (mainEl && footerEl && !NO_CTA[activePage]) {
    var band = document.createElement('section');
    band.className = 'cta-band';
    band.innerHTML =
      '<svg class="deco" aria-hidden="true" viewBox="0 0 320 160"><g fill="none" style="stroke:var(--sun)" stroke-width="8" stroke-linecap="round"><path d="M8 40h200a28 28 0 1 0-28-28"/><path d="M8 80h260a28 28 0 1 1-28 28"/><path d="M48 120h96"/></g></svg>' +
      '<div class="wrap">' +
        '<div>' +
          '<div class="eyebrow" style="color:var(--sun)">' + (isEN ? 'Waitlist' : 'Laukiančiųjų sąrašas') + '</div>' +
          '<h2 style="margin-top:16px">' + (isEN ? 'Be first when <em>Adrena</em> launches' : 'Būk pirmas, kai <em>Adrena</em> startuos') + '</h2>' +
          '<p>' + (isEN ? 'Join the waitlist for free. We will let you know as soon as you can book your first lesson.'
                       : 'Prisijunk prie laukiančiųjų sąrašo nemokamai. Pranešime, kai tik galėsi užsisakyti pirmą pamoką.') + '</p>' +
        '</div>' +
        '<div class="cta-actions">' +
          '<a class="btn btn-light" href="' + here + 'index.html#' + (isEN ? 'waitlist' : 'laukianciuju-sarasas') + '">' + (isEN ? 'Join the waitlist' : 'Prisijunk prie sąrašo') + ' <span class="arr" aria-hidden="true">→</span></a>' +
          (activePage === 'proto' ? '' : '<a class="btn btn-ghost" href="' + here + P.proto + '">' + (isEN ? 'Try the app' : 'Išbandyk programėlę') + '</a>') +
        '</div>' +
      '</div>';
    mainEl.appendChild(band);
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
      ? '<video src="' + esc(g.src) + '" poster="' + esc(g.src.replace(/\.(mp4|webm)$/i, '-poster.webp')) + '" muted loop playsinline' + (reduceMotion ? '' : ' autoplay') + ' preload="' + (reduceMotion ? 'none' : 'metadata') + '" aria-label="' + esc(g.alt) + '" style="' + pos + '"></video>'
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
  var SPORT_EN = { kaitavimas:'Kitesurfing', banglentes:'Surfing', vandenlentes:'Wakeboarding', slides:'Skiing & snowboarding',
    parasparnis:'Paragliding', parasiutas:'Skydiving', laipiojimas:'Climbing', nardymas:'Diving' };
  var SPORT_TILES = [
    { id:'kaitavimas',   name:'Kaitavimas',            link:'prototipas.html', grad:'135deg,#0FA3A0,#0E5E7E', pos:'55% 50%', alt:'Kaituotojas šuolio metu su lenta rankoje', img:base+'media/sports/kaitavimas-v2.webp' },
    { id:'banglentes',   name:'Banglentės',            link:'prototipas.html', grad:'135deg,#1C7ED6,#0E4E6E', pos:'45% 50%', alt:'Banglentininkas šoka virš bangos keteros', img:base+'media/sports/banglentes-v2.webp' },
    { id:'vandenlentes', name:'Vandenlentės',          link:'prototipas.html', grad:'135deg,#0E6E8C,#163E63', pos:'40% 35%', alt:'Vandenlentininkas apsiverčia ore virš tramplino', img:base+'media/sports/vandenlentes-v2.webp' },
    { id:'slides',       name:'Slidės ir snieglentės', link:'prototipas.html', grad:'135deg,#7FA7C9,#3D5A80', pos:'40% 40%', alt:'Slidininkas šoka per purų sniegą', img:base+'media/sports/slides-v2.webp' },
    { id:'parasparnis',  name:'Parasparnis',           link:'prototipas.html', grad:'135deg,#FF8A3D,#E2542F', pos:'50% 35%', alt:'Parasparnis skrenda virš kalnų sutemų danguje', img:base+'media/sports/parasparnis-v2.webp' },
    { id:'parasiutas',   name:'Parašiutas',            link:'prototipas.html', grad:'135deg,#FF5A36,#A83256', pos:'50% 50%', alt:'Parašiutininkas su parašiutu danguje', img:base+'media/sports/parasiutas.webp', img2x:base+'media/sports/parasiutas_2x.webp' },
    { id:'laipiojimas',  name:'Laipiojimas',           link:'prototipas.html', grad:'135deg,#9A7A52,#4E3B2A', pos:'50% 50%', alt:'Laipiotojas ant uolos', img:base+'media/sports/laipiojimas.webp', img2x:base+'media/sports/laipiojimas_2x.webp' },
    { id:'nardymas',     name:'Nardymas',              link:'prototipas.html', grad:'135deg,#1E4E7A,#0E1B2C', pos:'50% 50%', alt:'Naras mėlyname vandenyje', img:base+'media/sports/nardymas.webp', img2x:base+'media/sports/nardymas_2x.webp' },
  ];

  var sportGrid = document.getElementById('sports-home-grid');
  if (sportGrid) {
    sportGrid.innerHTML = SPORT_TILES.map(function (t) {
      var name = isEN ? SPORT_EN[t.id] : t.name;
      var srcset = t.img2x ? ' srcset="' + esc(t.img) + ' 900w, ' + esc(t.img2x) + ' 1800w" sizes="(max-width:1023px) 50vw, 300px"' : '';
      // the gradient only shows if the photo fails to load; the visible name is the link text
      return '<a href="' + esc(here + P.proto) + '" class="sport-home-tile" style="background:linear-gradient(' + t.grad + ')">' +
        '<img src="' + esc(t.img) + '"' + srcset + ' alt="" loading="lazy" decoding="async" width="450" height="300" style="object-position:' + t.pos + '" onerror="this.style.display=\'none\'">' +
        '<span class="tile-overlay"></span>' +
        '<span class="tile-label">' + esc(name) + '<span class="arr" aria-hidden="true">→</span></span>' +
      '</a>';
    }).join('');
  }

  /* ---- Scroll reveal ---- */
  function setupReveal() {
    if (!window.IntersectionObserver) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var selectors = [
      '.sec-head', '.row-head .lead', '.compare', '.edge', '.vs-wrap', '.vs-legend',
      '.flow > li', '.tech > div', '.impact > div', '.measure',
      '.values > .value', '.instr', '.team > .member', '.biz',
      '.gallery', '.gallery-strip', '.partners > *', '.sports-home-grid > a',
      '.faq', '.c-list', '.demo-side', '.phone-wrap',
      '.demo-teaser-text', '.form-box', '.form-card', '.cta-band .wrap > *',
    ];
    var els = document.querySelectorAll(selectors.join(','));
    // siblings in a grid come in one after another (60ms apart, capped)
    els.forEach(function (el) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      if (sib > 0) el.style.setProperty('--rd', Math.min(sib, 7) * 60 + 'ms');
    });
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

  var reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Loader: counter + filling wave, first visit per session ---- */
  (function () {
    var root = document.documentElement;
    if (!root.classList.contains('is-loading')) return;
    var el = document.createElement('div');
    el.className = 'loader'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="loader-inner"><div class="loader-count">0</div><div class="loader-wave"><i></i></div></div>';
    document.body.appendChild(el);
    root.classList.remove('is-loading');
    var count = el.querySelector('.loader-count'), wave = el.querySelector('.loader-wave');
    var start = null, DUR = 900;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / DUR), e = 1 - Math.pow(1 - k, 3);
      count.textContent = Math.round(e * 100);
      wave.style.setProperty('--p', e);
      if (k < 1) requestAnimationFrame(step);
      else setTimeout(function () {
        el.classList.add('done');
        setTimeout(function () { el.remove(); }, 700);
      }, 150);
    }
    requestAnimationFrame(step);
  })();

  /* ---- Film clip: 0.8x speed, plays only while on screen, poster only for reduced motion ---- */
  (function () {
    var frame = document.querySelector('.film-frame');
    if (!frame) return;
    var v = frame.querySelector('video');
    // until hero-poster.jpg is added, fall back to the old poster
    var fb = v.getAttribute('data-fallback-poster');
    if (fb) { var pi = new Image(); pi.onerror = function () { v.poster = fb; }; pi.src = v.poster; }
    if (reduceMotionMQ.matches) {
      v.removeAttribute('autoplay'); v.autoplay = false; v.preload = 'none';
      v.load(); // drop any started playback and show the poster
      return;
    }
    var setRate = function () { v.defaultPlaybackRate = 0.8; v.playbackRate = 0.8; };
    setRate();
    v.addEventListener('loadedmetadata', setRate);
    v.addEventListener('play', setRate);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else v.pause();
        });
      }, { threshold: 0.15 }).observe(frame);
    }
    var ticking = false;
    function upd() {
      ticking = false;
      var r = frame.getBoundingClientRect(), vh = window.innerHeight;
      var f = (vh - r.top) / (vh * 0.6);
      frame.style.setProperty('--f', Math.max(0, Math.min(1, f)).toFixed(3));
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  })();

  /* ---- Header takes the hero colour while the red area is under it ---- */
  (function () {
    var hero = document.querySelector('section.hero');
    var film = document.querySelector('section.film');
    var top = document.getElementById('site-header');
    if (!hero || !top) return;
    function redBottom() {
      if (film) { var r = film.getBoundingClientRect(); return r.top + r.height / 2; }
      return hero.getBoundingClientRect().bottom;
    }
    function upd() { top.classList.toggle('on-hero', redBottom() > 80); }
    upd(); window.addEventListener('scroll', upd, { passive: true });
  })();

  /* ---- Header turns into a blurred translucent bar once the page scrolls ---- */
  (function () {
    var top = document.getElementById('site-header');
    if (!top) return;
    var on = null;
    function upd() { var s = window.scrollY > 8; if (s !== on) { on = s; top.classList.toggle('scrolled', s); } }
    upd(); window.addEventListener('scroll', upd, { passive: true });
  })();

  /* ---- Stacked cards fan out as you scroll (--p 0 = stacked, 1 = spread) ---- */
  (function () {
    var fans = document.querySelectorAll('.edge');
    if (!fans.length || reduceMotionMQ.matches) return;
    var ticking = false;
    function upd() {
      ticking = false;
      var vh = window.innerHeight;
      fans.forEach(function (f) {
        var r = f.getBoundingClientRect();
        var p = (vh * 0.9 - r.top) / (vh * 0.55);
        f.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
      });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  })();

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
