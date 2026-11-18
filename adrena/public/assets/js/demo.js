/* demo.js — Adrena phone prototype (prototipas.html only) */
(function () {
  'use strict';

  /* ---- Configurable video content ---- */
  const VIDEOS = [
    {src:'../media/video-kaitavimas.mp4',       who:'Adrenos komanda', ini:'A', col:'#FF5A36', sport:'Kaitavimas',       place:'Ant vandens',    text:'Vėjas pagavo kaitą, važiuojam!',              likes:48, g:'#0E1B2C'},
    {src:'../media/video-sniego-kaitavimas.mp4', who:'Adrenos komanda', ini:'A', col:'#FF5A36', sport:'Sniego kaitavimas', place:'Užšalęs ežeras', text:'Žiemą kaitavimas nesibaigia: slidės ir ledas', likes:31, g:'#0E1B2C'},
    {src:'../media/video-slidinejimas.mp4',      who:'Adrenos komanda', ini:'A', col:'#FF5A36', sport:'Slidinėjimas',     place:'Kalnai',          text:'Rytas ant šviežio sniego',                    likes:22, g:'#0E1B2C'},
  ];

  /* ---- Helpers ---- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* ---- Sports & providers ---- */
  const ICON = {
    wind: '<path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    wave: '<path d="M2 15c3-4 6-4 9 0s6 4 9 0M2 9c3-4 6-4 9 0s6 4 9 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    mtn:  '<path d="M2 20 9 7l4 7 3-4 6 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    sky:  '<path d="M3 12c0-5 4-8 9-8s9 3 9 8M3 12l9 8 9-8M12 4v16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    rock: '<path d="M4 20 8 6l5 4 3-5 4 15z M9 14h.01M14 12h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>',
    dive: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  };
  const SPORTS = [
    {id:'kaitavimas',   name:'Kaitavimas',           g:'linear-gradient(135deg,#0FA3A0,#0E5E7E)', ic:'wind', wx:'wind', cert:'IKO'},
    {id:'banglentes',   name:'Banglentės',           g:'linear-gradient(135deg,#1C7ED6,#0E4E6E)', ic:'wave', wx:'wave', cert:'ISA'},
    {id:'vandenlentes', name:'Vandenlentės',         g:'linear-gradient(135deg,#0E6E8C,#163E63)', ic:'wave', wx:'none'},
    {id:'slides',       name:'Slidės ir snieglentės',g:'linear-gradient(135deg,#7FA7C9,#3D5A80)', ic:'mtn',  wx:'none'},
    {id:'parasparnis',  name:'Parasparnis',          g:'linear-gradient(135deg,#FF8A3D,#E2542F)', ic:'sky',  wx:'wind'},
    {id:'parasiutas',   name:'Parašiutas',           g:'linear-gradient(135deg,#FF5A36,#A83256)', ic:'sky',  wx:'none'},
    {id:'laipiojimas',  name:'Laipiojimas',          g:'linear-gradient(135deg,#9A7A52,#4E3B2A)', ic:'rock', wx:'none'},
    {id:'nardymas',     name:'Nardymas',             g:'linear-gradient(135deg,#1E4E7A,#0E1B2C)', ic:'dive', wx:'none'},
  ];
  const P = (name, place, cert, rating, n, years, students, offers, reviews) => ({name, place, cert, rating, n, years, students, offers, reviews});
  const O = (t, dur, price, inc) => ({t, dur, price, inc});
  const PROVIDERS = {
    kaitavimas:[
      P('Marių vėjas','Kuršių marios, Pervalka','IKO 2 lygio instruktorius',4.9,38,7,420,
        [O('Pirmoji pamoka','2 val.',85,['Įranga','Hidrokostiumas','Radijo ryšys','Grupė iki 2']),O('Pradedančiųjų kursas','4 val.',155,['Įranga','Hidrokostiumas','IKO kortelė','Grupė iki 2']),O('Individuali pamoka','2 val.',120,['Įranga','Hidrokostiumas','1 mokinys'])],
        [['Gabija','Pirmą kartą stovėjau ant lentos jau antroje pamokoje. Instruktorius ramus ir aiškiai paaiškina.'],['Mantas','Patiko, kad pamoka buvo perkelta dėl vėjo be jokio vargo.']]),
      P('Nerijos kaitai','Nida','IKO 1 lygio instruktorius',4.8,21,4,180,
        [O('Pirmoji pamoka','2 val.',90,['Įranga','Hidrokostiumas','Grupė iki 3']),O('Pradedančiųjų kursas','4 val.',165,['Įranga','Hidrokostiumas','Grupė iki 3'])],
        [['Ieva','Puiki vieta pradedantiesiems, seklus vanduo.']]),
      P('Agnė M.','Klaipėda, Melnragė','IKO 1 lygio instruktorė',4.7,12,3,90,
        [O('Pirmoji pamoka','2 val.',75,['Įranga','Hidrokostiumas','1–2 mokiniai'])],
        [['Rokas','Labai kantri ir draugiška.']]),
    ],
    banglentes:[P('Bangų klubas','Klaipėda, Melnragė','ISA instruktorius',4.8,19,5,260,[O('Pirmoji pamoka','1,5 val.',45,['Lenta','Hidrokostiumas','Grupė iki 6'])],[['Lukas','Smagu, net jei bangos nedidelės.']])],
    vandenlentes:[P('Marių vandenlenčių parkas','Kauno marios','Vandenlenčių treneris',4.7,54,6,900,[O('Valanda parke','1 val.',30,['Lenta','Liemenė','Šalmas'])],[['Eglė','Treneris padėjo atsistoti iš pirmo karto.']])],
    slides:[P('Kalnų mokykla','Druskininkai','Slidinėjimo instruktorius',4.8,33,9,700,[O('Pirmoji pamoka','1 val.',40,['Slidės ir batai','Keltuvo bilietas'])],[['Domas','Pirmą dieną jau leidausi nuo kalno.']])],
    parasparnis:[P('Kopų sparnai','Neringa','Tandemo piloto licencija',4.9,27,11,1300,[O('Tandemo skrydis','20 min.',95,['Įranga','Skrydžio vaizdo įrašas'])],[['Austėja','Nerealus vaizdas į marias.']])],
    parasiutas:[P('Laisvo kritimo klubas','Pociūnų aerodromas','Tandemo instruktorius',4.9,41,14,2500,[O('Tandemo šuolis','1 diena',260,['Instruktažas','Įranga','Pažymėjimas'])],[['Karolis','Geriausia gimtadienio dovana.']])],
    laipiojimas:[P('Uolų sienelė','Vilnius','Laipiojimo instruktorius',4.7,60,8,1100,[O('Įvadinė pamoka','1,5 val.',25,['Batai','Diržas','Apsauga'])],[['Ugnė','Labai saugu ir aišku.']])],
    nardymas:[P('Ežerų nardymo centras','Prie Molėtų','PADI instruktorius',4.8,17,10,600,[O('Bandomasis nardymas','3 val.',110,['Įranga','Hidrokostiumas','Teorija'])],[['Jonas','Pirmas kartas po vandeniu, nepamirštama.']])],
  };

  /* ---- Weather sample data ---- */
  const WIND  = [7, 9, 3, 8, 12, 5, 9];
  const WAVE  = [0.6, 1.1, 0.3, 0.9, 1.4, 0.5, 1.0];
  const DN    = ['Sk','Pr','An','Tr','Kt','Pn','Št'];
  const DACC  = ['sekmadienį','pirmadienį','antradienį','trečiadienį','ketvirtadienį','penktadienį','šeštadienį'];
  const TIMES = ['10:00','13:00','16:00'];
  const days  = Array.from({length:7}, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; });
  const cap   = s => s.charAt(0).toUpperCase() + s.slice(1);
  const sp    = id => SPORTS.find(s => s.id === id);

  function wxOf(sport, i) {
    const t = sp(sport).wx;
    if (t === 'wind') { const v = WIND[i]; const c = v < 5 ? 'bad' : v < 6 || v > 10 ? 'warn' : 'good'; return {c, label: v + ' m/s', v}; }
    if (t === 'wave') { const v = WAVE[i]; const c = v < 0.5 ? 'bad' : v < 0.8 ? 'warn' : 'good'; return {c, label: String(v).replace('.', ',') + ' m', v}; }
    const bad = i === 2; return {c: bad ? 'bad' : 'good', label: bad ? 'liūtis' : (12 - i) + '°', v:0};
  }

  /* ---- State ---- */
  const fresh = () => ({
    user:null, stack:['welcome'], tab:null, sport:'kaitavimas', prov:0, offer:0,
    day:null, time:null, people:1, pay:'card', bookings:[], quiz:{step:0, a:[]},
    liked:{}, videos:VIDEOS.map(v => ({...v})), filters:{}, interests:[],
    gift:{amt:100}, resched:null, pushTimer:null,
  });
  let S = fresh();

  const app    = $('#app');
  const cur    = () => S.stack[S.stack.length - 1];
  const go     = name => { S.stack.push(name); render(true); };
  const back   = () => { if (S.stack.length > 1) S.stack.pop(); render(true); };
  const tab    = name => { S.stack = [name]; render(true); };
  const toastFn = msg => {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200);
  };

  const backBar  = title => `<div class="a-back"><button data-a="back" aria-label="Atgal"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><b>${title}</b></div>`;
  const ic       = (k, sz = 22) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24">${ICON[k]}</svg>`;
  const verified = '<span class="ver"><svg width="11" height="11" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Patikrintas</span>';
  const minPrice = p => Math.min(...p.offers.map(o => o.price));

  /* ---- Screens ---- */
  const SCREENS = {
    welcome() {
      return `<div class="welcome">
        <div>
          <svg width="64" height="64" viewBox="8 8 84 84" aria-hidden="true"><defs><linearGradient id="wg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FF5A36"/><stop offset="1" stop-color="#FF8A3D"/></linearGradient><mask id="wm" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/></mask></defs><path d="M18 84 L50 16 L82 84" fill="none" stroke="url(#wg)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" mask="url(#wm)"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#0FA3A0" stroke-width="9" stroke-linecap="round"/></svg>
          <div class="a-h1">Adrenalinas, kurį gali išmokti</div>
          <p>Rask patikrintą instruktorių, užsisakyk pamoką ir sek savo progresą.</p>
        </div>
        <div style="display:grid;gap:10px">
          <button class="a-btn" data-a="go" data-v="signup">Sukurti paskyrą</button>
          <button class="a-btn sec" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.3)" data-a="guest">Tęsti be paskyros</button>
        </div>
      </div>`;
    },
    signup() {
      const ints = ['Kaitavimas','Banglentės','Slidės','Parasparnis','Laipiojimas','Nardymas'];
      return backBar('Nauja paskyra') + `<div class="pad">
        <div class="a-h1" style="font-size:23px">Susipažinkime</div>
        <p class="a-muted" style="margin:6px 0 18px">Tai demonstracija: duomenys niekur nesiunčiami.</p>
        <div class="field"><label for="su-name">Vardas</label><input id="su-name" autocomplete="off" placeholder="pvz., Gabija" maxlength="20"></div>
        <div class="field"><label for="su-city">Miestas</label><select id="su-city"><option>Vilnius</option><option selected>Kaunas</option><option>Klaipėda</option><option>Šiauliai</option><option>Panevėžys</option><option>Kitas</option></select></div>
        <div class="field"><label>Kas tave domina?</label><div class="chips">${ints.map(t => `<button class="chip ${S.interests.includes(t) ? 'on' : ''}" data-a="int" data-v="${t}">${t}</button>`).join('')}</div></div>
        <label class="check"><input type="checkbox" id="su-ok">Sutinku su Adrenos naudojimo sąlygomis ir privatumo politika</label>
        <button class="a-btn" data-a="signup">Sukurti paskyrą</button>
      </div>`;
    },
    home() {
      const q = (S.q || '').toLowerCase();
      const list = SPORTS.filter(s => s.name.toLowerCase().includes(q));
      const pop = PROVIDERS.kaitavimas.slice(0, 2).map((p, i) => ({p, s:'kaitavimas', i}))
        .concat([{p:PROVIDERS.parasparnis[0], s:'parasparnis', i:0},{p:PROVIDERS.banglentes[0], s:'banglentes', i:0}]);
      return `<div class="pad">
        <div class="row"><div><div class="a-muted">Labas${S.user ? ', ' + esc(S.user.name) : ''}!</div><div class="a-h1">Ką nori išbandyti?</div></div>
        <div class="avatar" style="background:#0FA3A0;width:38px;height:38px">${esc((S.user ? S.user.name : 'S').charAt(0).toUpperCase())}</div></div>
        <label class="search"><svg width="18" height="18" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="#5B6975" stroke-width="2.2"/><path d="M16.5 16.5 21 21" stroke="#5B6975" stroke-width="2.2" stroke-linecap="round"/></svg><input id="q" placeholder="Kaitavimas, slidės, nardymas…" value="${esc(S.q || '')}" aria-label="Paieška"></label>
        <button class="quiz-cta" data-a="quiz"><span class="q">?</span><span><b>Nežinau, ką išbandyti</b><span>3 klausimai ir tau tinkamos veiklos</span></span></button>
        <div class="a-h2">Veiklos</div>
        <div class="sport-grid">${list.map(s => `<button class="sport" style="background:${s.g}" data-a="sport" data-v="${s.id}">${ic(s.ic, 70)}${s.name}</button>`).join('') || '<p class="a-muted">Nieko nerasta.</p>'}</div>
        <div class="a-h2">Populiaru šią savaitę</div>
        <div class="hscroll">${pop.map(({p, s, i}) => `<button class="a-card mini" data-a="prov" data-s="${s}" data-v="${i}"><div class="cov" style="background:${sp(s).g}"></div><div class="in"><b style="font-size:14px">${esc(p.name)}</b><div class="a-muted">${sp(s).name} · nuo ${minPrice(p)} €</div><div style="font-size:13px;margin-top:3px"><span class="star">★ ${String(p.rating).replace('.', ',')}</span> <span class="a-muted">(${p.n})</span></div></div></button>`).join('')}</div>
        <button class="gift" data-a="go" data-v="gift"><b>Dovanok adrenaliną</b><span style="font-size:13.5px">Dovanų kuponas bet kuriai veiklai. Gavėjas pats pasirinks laiką.</span></button>
      </div>`;
    },
    quiz() {
      const Q = [
        {t:'Kur norėtum sportuoti?', o:[['vanduo','Ant vandens','Jūra, marios, ežerai'],['oras','Ore','Skrydžiai ir šuoliai'],['sniegas','Ant sniego','Kalnai ir trasos'],['zeme','Ant žemės','Uolos ir sienelės']]},
        {t:'Kiek adrenalino nori?',  o:[['1','Šiek tiek','Ramiai išbandyti'],['2','Vidutiniškai','Noriu pajusti greitį'],['3','Daug!','Kuo ekstremaliau, tuo geriau']]},
        {t:'Su kuo eisi?',           o:[['vienas','Vienas','Noriu išmokti pats'],['draugai','Su draugais','Grupinė pamoka'],['seima','Su šeima','Tinka ir vaikams']]},
      ];
      const st = S.quiz.step;
      if (st >= Q.length) {
        const [kur, lvl] = S.quiz.a;
        const map = {vanduo:['kaitavimas','banglentes','vandenlentes'],oras:['parasparnis','parasiutas'],sniegas:['slides'],zeme:['laipiojimas','slides']};
        let res = map[kur] || ['kaitavimas'];
        if (lvl === '1' && kur === 'vanduo') res = ['vandenlentes','banglentes','kaitavimas'];
        if (lvl === '3' && kur === 'oras')   res = ['parasiutas','parasparnis'];
        if (res.length < 2) res = res.concat(kur === 'sniegas' ? ['kaitavimas'] : ['nardymas']);
        return backBar('Tau tinka') + `<div class="pad">
          <div class="a-h1" style="font-size:23px">Štai ką rekomenduojame</div>
          <p class="a-muted" style="margin:6px 0 16px">Pagal tavo atsakymus</p>
          <div style="display:grid;gap:10px">${res.slice(0, 3).map((id, i) => `<button class="sport" style="background:${sp(id).g};height:96px;width:100%" data-a="sport" data-v="${id}">${ic(sp(id).ic, 70)}<span>${i === 0 ? '<span style="display:block;font-size:11px;font-weight:600;opacity:.85">GERIAUSIAI TINKA</span>' : ''}${sp(id).name}</span></button>`).join('')}</div>
          <button class="a-btn sec" style="margin-top:16px" data-a="quizAgain">Atsakyti iš naujo</button>
        </div>`;
      }
      const q = Q[st];
      return backBar('Nežinau, ką išbandyti') + `<div class="pad">
        <div class="qdots">${Q.map((_, i) => `<i class="${i <= st ? 'on' : ''}"></i>`).join('')}</div>
        <div class="a-h1" style="font-size:23px;margin-bottom:16px">${q.t}</div>
        ${q.o.map(o => `<button class="a-card qopt" data-a="qa" data-v="${o[0]}">${o[1]}<span>${o[2]}</span></button>`).join('')}
      </div>`;
    },
    results() {
      const s = sp(S.sport); let list = (PROVIDERS[s.id] || []).map((p, i) => ({p, i}));
      if (S.filters.cheap) list = list.filter(x => minPrice(x.p) <= 80);
      const ni = days.findIndex((_, i) => wxOf(s.id, i).c === 'good');
      const nextTxt = ni < 0 ? '' : ' · artimiausia tinkama diena: ' + DACC[days[ni].getDay()] + ' (' + wxOf(s.id, ni).label + ')';
      return backBar(s.name) + `<div class="pad">
        <div class="chips" style="margin-bottom:14px">
          <button class="chip on">Pradedantiesiems</button>
          <button class="chip ${S.filters.cheap ? 'on' : ''}" data-a="filter" data-v="cheap">Iki 80 €</button>
          <button class="chip">Šią savaitę</button>
        </div>
        <p class="a-muted" style="margin-bottom:10px">Rasta: ${list.length}${s.wx !== 'none' ? nextTxt : ''}</p>
        ${list.map(({p, i}) => `<button class="a-card prov" data-a="prov" data-s="${s.id}" data-v="${i}"><div class="cov" style="background:${s.g}"></div><div style="min-width:0">
          <div class="row"><b>${esc(p.name)}</b>${verified}</div>
          <div class="a-muted">${esc(p.place)}</div>
          <div class="row" style="margin-top:4px;font-size:13.5px"><span><span class="star">★ ${String(p.rating).replace('.', ',')}</span> <span class="a-muted">(${p.n})</span></span><b>nuo ${minPrice(p)} €</b></div>
        </div></button>`).join('') || '<div class="empty">Pagal šį filtrą nieko nėra.</div>'}
      </div>`;
    },
    profile() {
      const s = sp(S.sport), p = PROVIDERS[s.id][S.prov];
      return `<div class="pad"><div class="cover" style="background:${s.g}">
          <button data-a="back" aria-label="Atgal" style="position:absolute;top:10px;left:14px;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.9);display:grid;place-items:center;cursor:pointer"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#0E1B2C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <span style="color:#fff;opacity:.4;position:absolute;right:10px;bottom:-6px">${ic(s.ic, 110)}</span>
        </div>
        <div style="margin-top:14px" class="row"><div class="a-h1" style="font-size:22px">${esc(p.name)}</div>${verified}</div>
        <div class="a-muted">${esc(p.place)} · ${s.name}</div>
        <div class="a-card" style="display:grid;grid-template-columns:repeat(3,1fr);text-align:center;padding:12px 6px;margin-top:14px">
          <div><b class="star">★ ${String(p.rating).replace('.', ',')}</b><div class="a-muted" style="font-size:11.5px">${p.n} atsiliepimai</div></div>
          <div><b>${p.years} m.</b><div class="a-muted" style="font-size:11.5px">patirtis</div></div>
          <div><b>${p.students}+</b><div class="a-muted" style="font-size:11.5px">mokinių</div></div>
        </div>
        <div class="a-card" style="padding:10px 12px;margin-top:10px;font-size:13.5px;display:flex;gap:8px;align-items:center"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2 20 6v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" fill="#E3F4EB" stroke="#178A55" stroke-width="2"/></svg><span><b>${esc(p.cert)}</b> · sertifikatas ir draudimas patikrinti</span></div>
        <div class="a-h2">Ką siūlo</div>
        ${p.offers.map((o, i) => `<button class="a-card offer ${S.offer === i ? 'on' : ''}" data-a="offer" data-v="${i}"><span class="radio"></span><span><b>${o.t}</b><div class="a-muted">${o.dur}</div><div class="inc">${o.inc.map(x => `<span>${x}</span>`).join('')}</div></span><b>${o.price} €</b></button>`).join('')}
        <div class="a-h2">Atsiliepimai</div>
        ${p.reviews.map(r => `<div class="a-card review"><div class="row"><b>${r[0]}</b><span class="star">★★★★★</span></div><p style="margin-top:4px;color:#3D4A55">${r[1]}</p></div>`).join('')}
      </div>
      <div class="sticky-b"><button class="a-btn" data-a="go" data-v="booking">Pasirinkti laiką</button></div>`;
    },
    booking() {
      const s = sp(S.sport), p = PROVIDERS[s.id][S.prov];
      const taken = {1:['13:00'], 3:['10:00'], 6:['16:00']};
      const wxName = s.wx === 'wind' ? 'Vėjas' : s.wx === 'wave' ? 'Bangos' : 'Orai';
      return backBar(S.resched != null ? 'Perkelti pamoką' : 'Pasirink laiką') + `<div class="pad">
        <div class="a-muted">${esc(p.name)} · ${p.offers[S.offer].t}</div>
        <div class="a-h2" style="margin-top:12px">Diena <span class="a-muted" style="font-weight:500;font-family:var(--f-body)">· ${wxName.toLowerCase()} prognozė</span></div>
        <div class="days">${days.map((d, i) => { const w = wxOf(s.id, i); return `<button class="day ${S.day === i ? 'on' : ''}" data-a="day" data-v="${i}"><small>${DN[d.getDay()]}</small><b>${d.getDate()}</b><span class="wx ${w.c}">${w.label}</span></button>`; }).join('')}</div>
        <div class="legend"><span><i style="background:#178A55"></i>Tinka</span><span><i style="background:#B86E00"></i>Ribinės</span><span><i style="background:#9AA6AE"></i>Netinka</span></div>
        ${S.day != null && wxOf(s.id, S.day).c === 'bad' ? '<div class="guard" style="margin-top:12px;background:#FBF0DC;color:#7A4A00">Šią dieną sąlygos netinka. Rinkis dieną su žaliu ženklu.</div>' : ''}
        <div class="a-h2">Laikas</div>
        <div class="times">${TIMES.map(t => { const dis = S.day == null || wxOf(s.id, S.day).c === 'bad' || (taken[S.day] || []).includes(t); return `<button class="time ${S.time === t && !dis ? 'on' : ''}" data-a="time" data-v="${t}" ${dis ? 'disabled' : ''}>${t}</button>`; }).join('')}</div>
        ${S.resched != null ? '' : `<div class="a-h2">Dalyviai</div>
        <div class="a-card row" style="padding:10px 14px"><span>Žmonių skaičius</span><div class="stepper"><button data-a="ppl" data-v="-1" aria-label="Mažiau">–</button><b>${S.people}</b><button data-a="ppl" data-v="1" aria-label="Daugiau">+</button></div></div>
        <p class="a-muted" style="margin-top:8px">Eini su draugais? Kiekvienas gaus kvietimą.</p>`}
      </div>
      <div class="sticky-b"><button class="a-btn" data-a="${S.resched != null ? 'reschedDo' : 'toPay'}" ${S.day == null || !S.time || wxOf(s.id, S.day).c === 'bad' ? 'disabled' : ''}>${S.resched != null ? 'Patvirtinti naują laiką' : 'Tęsti'}</button></div>`;
    },
    payment() {
      const s = sp(S.sport), p = PROVIDERS[s.id][S.prov], o = p.offers[S.offer], d = days[S.day];
      const total = o.price * S.people;
      const methods = [['card','Banko kortelė'],['wallet','Apple Pay / Google Pay'],['bank','Bankinė nuoroda']];
      return backBar('Apmokėjimas') + `<div class="pad">
        <div class="a-card sum">
          <div class="row"><span>Veikla</span><span>${s.name}, ${o.t.toLowerCase()}</span></div>
          <div class="row"><span>Instruktorius</span><span>${esc(p.name)}</span></div>
          <div class="row"><span>Data</span><span>${cap(DACC[d.getDay()])}, ${d.getMonth()+1}-${String(d.getDate()).padStart(2,'0')} ${S.time}</span></div>
          <div class="row"><span>Vieta</span><span>${esc(p.place)}</span></div>
          <div class="row"><span>Dalyviai</span><span>${S.people} × ${o.price} €</span></div>
          <div class="row total"><span>Iš viso</span><span>${total} €</span></div>
        </div>
        <div class="a-h2">Mokėjimo būdas</div>
        ${methods.map(m => `<button class="a-card pay ${S.pay === m[0] ? 'on' : ''}" data-a="pay" data-v="${m[0]}"><span class="radio"></span>${m[1]}</button>`).join('')}
        <div class="guard" style="margin-top:10px"><svg width="22" height="22" viewBox="0 0 24 24" style="flex:none">${ICON.wind}</svg><span><b>Orų apsauga</b>Jei oras bus netinkamas, nemokamai perkelsime pamoką arba grąžinsime pinigus.</span></div>
      </div>
      <div class="sticky-b"><button class="a-btn" data-a="pay-now">Apmokėti ${total} €</button></div>`;
    },
    confirm() {
      const b = S.bookings[S.bookings.length - 1]; if (!b) return SCREENS.home();
      const s = sp(b.sport), p = PROVIDERS[s.id][b.prov];
      return `<div class="pad" style="text-align:center">
        <div class="okmark"><svg width="38" height="38" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#178A55" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="a-h1" style="font-size:24px">Užsakymas patvirtintas!</div>
        <p class="a-muted" style="margin-top:4px">${s.name} su „${esc(p.name)}" · ${b.dayTxt}, ${b.time}</p>
      </div>
      <div class="pad" style="padding-top:0">
        <div class="map"><svg viewBox="0 0 300 110" preserveAspectRatio="none"><path d="M0 70 C60 40 120 90 180 60 S260 30 300 50 V110 H0Z" fill="#9FD3DE"/><path d="M0 70 C60 40 120 90 180 60 S260 30 300 50" fill="none" stroke="#fff" stroke-width="2"/></svg><div style="position:absolute;left:58%;top:28%;transform:translate(-50%,-100%)"><svg width="26" height="32" viewBox="0 0 24 30"><path d="M12 29s10-10 10-17A10 10 0 0 0 2 12c0 7 10 17 10 17z" fill="#FF5A36"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg></div><span style="position:absolute;left:10px;bottom:8px;font-size:12px;font-weight:700;background:#fff;padding:3px 8px;border-radius:6px">${esc(p.place)}</span></div>
        <div class="a-h2">Ką pasiimti</div>
        <ul class="list"><li>Rankšluostį ir maudymosi kostiumėlį</li><li>Kremą nuo saulės ir akinius</li><li>Vandens butelį</li></ul>
        <div style="display:grid;gap:9px;margin-top:18px">
          <button class="a-btn sec" data-a="cal">Pridėti į kalendorių</button>
          <button class="a-btn" data-a="tab" data-v="bookings">Mano užsakymai</button>
        </div>
        <p class="a-muted" style="text-align:center;margin-top:12px">Artėjant pamokai stebėsime orų prognozę.</p>
      </div>`;
    },
    alert() {
      const b = activeBooking(); if (!b) return SCREENS.bookings();
      const s = sp(b.sport); const nd = b.newDay;
      const metric = s.wx === 'wind' ? 'm/s' : s.wx === 'wave' ? 'm' : '';
      const vals = days.map((_, i) => wxOf(s.id, i));
      const vmax = Math.max(...vals.map(v => v.v || 1));
      return backBar('Pranešimas dėl oro') + `<div class="pad">
        <div class="a-h1" style="font-size:22px">${cap(b.dayTxt)} ${s.wx === 'wind' ? 'vėjas bus per silpnas' : s.wx === 'wave' ? 'bangos bus per mažos' : 'prognozuojama liūtis'}</div>
        <p class="a-muted" style="margin-top:6px">${s.wx === 'none' ? 'Saugumui pamokos tą dieną nevyks.' : 'Prognozė atnaujinta: ' + b.badLabel + '. Pamokai reikia bent ' + (s.wx === 'wind' ? '6 m/s' : '0,8 m') + '.'}</p>
        ${s.wx !== 'none' ? `<div class="a-card" style="margin-top:14px;padding-bottom:8px"><div class="wxchart">${vals.map((v, i) => `<div><span>${String(v.v).replace('.',',')}</span><i style="height:${Math.max(6, v.v/vmax*52)}px;background:${i===b.day?'#9AA6AE':i===nd?'#FF5A36':'#BFE3E1'}"></i>${DN[days[i].getDay()]}</div>`).join('')}</div><p class="a-muted" style="padding:6px 12px 0;font-size:12px">${s.wx==='wind'?'Vėjas':'Bangos'}, ${metric}. Pilka – tavo diena, oranžinė – siūloma.</p></div>` : ''}
        <div class="a-card" style="padding:14px;margin-top:12px;border-color:#FF5A36;box-shadow:0 0 0 1.5px #FF5A36 inset"><div class="a-muted" style="font-size:12px;font-weight:700">SIŪLOMAS LAIKAS</div><b style="font-size:17px">${cap(DACC[days[nd].getDay()])}, ${b.time}</b><div class="a-muted">${wxOf(s.id, nd).label} · ${s.wx==='none'?'giedra':'tinka pamokai'}</div></div>
        <div style="display:grid;gap:9px;margin-top:14px">
          <button class="a-btn" data-a="accept">Priimti siūlomą laiką</button>
          <button class="a-btn sec" data-a="otherTime">Pasirinkti kitą laiką</button>
          <button class="a-btn sec" data-a="refund">Atgauti pinigus</button>
        </div>
      </div>`;
    },
    bookings() {
      return `<div class="pad"><div class="a-h1">Mano užsakymai</div>
        ${S.bookings.length ? '<div style="margin-top:16px">' + S.bookings.slice().reverse().map(b => {
          const s = sp(b.sport), p = PROVIDERS[s.id][b.prov];
          const st = b.status==='ok'?['ok','Patvirtinta']:b.status==='moved'?['moved','Perkelta']:b.status==='ref'?['ref','Pinigai grąžinti']:['moved','Laukia sprendimo'];
          return `<div class="a-card bk"><div class="row"><b>${s.name}</b><span class="status ${st[0]}">${st[1]}</span></div><div class="a-muted">${esc(p.name)} · ${esc(p.place)}</div><div style="font-size:14px;margin-top:4px"><b>${cap(b.dayTxt)}, ${b.time}</b> · ${b.total} €</div>${b.status==='pending'?'<button class="a-btn" style="margin-top:10px;padding:10px" data-a="go" data-v="alert">Peržiūrėti pranešimą</button>':''}</div>`;
        }).join('') + '</div>'
        : `<div class="empty"><p>Dar neturi užsakymų.</p><button class="a-btn" style="margin-top:14px" data-a="sport" data-v="kaitavimas">Rasti pamoką</button></div>`}
        ${S.bookings.some(b=>b.status==='ok'||b.status==='moved')&&!S.bookings.some(b=>b.status==='pending')&&!S.alerted?'<button class="a-btn sec" style="margin-top:6px" data-a="simAlert">Imituoti orų pranešimą</button>':''}
      </div>`;
    },
    progress() {
      const learned = ['Saugumo taisyklės ir vėjo langas','Kaito valdymas sausumoje','Kūno tempimas vandenyje (body drag)'];
      return `<div class="pad"><div class="a-h1">Mano progresas</div>
        <p class="a-muted" style="margin-top:4px">Pavyzdys: taip atrodys po pirmos pamokos</p>
        <div class="a-card" style="padding:16px;margin-top:14px">
          <div class="row"><b style="font-size:16px">Kaitavimas</b><span class="a-muted" style="font-family:var(--f-mono);font-size:12px">IKO</span></div>
          <div class="lvl">${[1,2,3,4].map(i=>`<i class="${i<=1?'on':''}"></i>`).join('')}</div>
          <div class="a-muted">IKO 1 lygis iš 4 · Discovery</div>
          <div class="a-h2" style="margin-top:14px;font-size:15px">Jau išmokai</div>
          <ul class="list">${learned.map(l=>`<li>${l}</li>`).join('')}</ul>
          <div style="background:#F2F5F6;border-radius:12px;padding:10px 12px;margin-top:12px;font-size:13.5px"><b>Instruktoriaus komentaras</b><p style="color:#3D4A55;margin-top:2px">Puikiai jauti kaitą. Kitą kartą bandysime vandens startą.</p></div>
        </div>
        <div class="a-card" style="padding:16px;margin-top:10px;border-color:#FF5A36;box-shadow:0 0 0 1.5px #FF5A36 inset">
          <div class="a-muted" style="font-size:12px;font-weight:700">TAVO KITAS ŽINGSNIS</div>
          <b style="font-size:16px">IKO 2 lygis (Intermediate): vandens startas ir plaukimas lenta</b>
          <p class="a-muted">Rekomenduojamos 2 pamokos</p>
          <button class="a-btn" style="margin-top:10px" data-a="prov" data-s="kaitavimas" data-v="0">2 pamokų paketas – 160 €</button>
        </div>
        <div class="a-h2">Išbandyk ir kitas veiklas</div>
        <div class="sport-grid">${['banglentes','vandenlentes'].map(id=>`<button class="sport" style="background:${sp(id).g}" data-a="sport" data-v="${id}">${ic(sp(id).ic,70)}${sp(id).name}</button>`).join('')}</div>
      </div>`;
    },
    community() {
      return `<div class="pad"><div class="a-h1">Bendruomenė</div>
        <p class="a-muted" style="margin:4px 0 14px">Dalinkis savo akimirkomis ir įkvėpk kitus</p>
        <label class="upload" for="vidUp"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 16V4M6 10l6-6 6 6M4 20h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Įkelti savo video</label>
        <input type="file" id="vidUp" accept="video/*" hidden>
        <div class="feed" style="margin-top:14px">${S.videos.map((v, i) => `<article class="a-card post">
          <div class="media" style="background:${v.g||'#0E1B2C'}">${v.src?`<video src="${esc(v.src)}" muted loop playsinline autoplay controls preload="metadata"></video>`:`<div class="ph"><span class="play"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff"/></svg></span><b style="font-size:15px">${esc(v.sport)} · ${esc(v.place)}</b><span style="opacity:.8">Vaizdo įrašas netrukus</span></div>`}</div>
          <div class="meta"><div class="row"><div class="who"><span class="avatar" style="background:${v.col}">${esc(v.ini)}</span><span><b>${esc(v.who)}</b><br><span class="a-muted" style="font-size:12px">${esc(v.sport)} · ${esc(v.place)}</span></span></div>
          <button class="like ${S.liked[i]?'on':''}" data-a="like" data-v="${i}" aria-label="Patinka"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="${S.liked[i]?'currentColor':'none'}" stroke="currentColor" stroke-width="2"/></svg>${v.likes+(S.liked[i]?1:0)}</button></div>
          <p style="font-size:14px">${esc(v.text)}</p></div></article>`).join('')}</div>
      </div>`;
    },
    gift() {
      const amts = [50,100,150,250];
      return backBar('Dovanų kuponas') + `<div class="pad">
        <div class="gift" style="margin-top:0;cursor:default"><span style="font-size:12px;font-weight:700;opacity:.85">ADRENA DOVANŲ KUPONAS</span><b style="font-size:30px;margin-top:6px">${S.gift.amt} €</b><span style="font-size:13px">Galioja 12 mėnesių visoms veikloms</span></div>
        <div class="a-h2">Suma</div>
        <div class="chips">${amts.map(a=>`<button class="chip ${S.gift.amt===a?'on':''}" data-a="amt" data-v="${a}">${a} €</button>`).join('')}</div>
        <div class="field" style="margin-top:16px"><label for="g-to">Kam dovanoji?</label><input id="g-to" placeholder="Gavėjo vardas" maxlength="24" autocomplete="off"></div>
        <div class="field"><label for="g-msg">Sveikinimas</label><textarea id="g-msg" placeholder="Su gimtadieniu! Laikas išmokti kaituoti."></textarea></div>
      </div>
      <div class="sticky-b"><button class="a-btn" data-a="giftDo">Pirkti kuponą (demo)</button></div>`;
    },
    giftOk() {
      return `<div class="pad" style="text-align:center;padding-top:40px">
        <div class="okmark"><svg width="38" height="38" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#178A55" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="a-h1" style="font-size:24px">Kuponas paruoštas!</div>
        <p class="a-muted" style="margin:8px 0 22px">${S.gift.to?esc(S.gift.to)+' gaus':'Gavėjas gaus'} ${S.gift.amt} € kuponą el. paštu ir galės išsirinkti veiklą, instruktorių bei laiką.</p>
        <button class="a-btn" data-a="tab" data-v="home">Į pradžią</button>
      </div>`;
    },
  };

  /* ---- Tabs ---- */
  const TABS = [
    ['home',      'Atrask',      '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
    ['bookings',  'Užsakymai',   '<rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
    ['community', 'Bendruomenė', '<rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9v6l5-3z" fill="currentColor"/>'],
    ['progress',  'Progresas',   '<path d="M4 19 10 12l4 4 6-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
  ];
  const ROOT_TAB = {home:'home',quiz:'home',results:'home',profile:'home',booking:'home',payment:'home',confirm:'bookings',gift:'home',giftOk:'home',bookings:'bookings',alert:'bookings',community:'community',progress:'progress'};

  /* ---- Render ---- */
  function render(resetScroll) {
    const name = cur();
    app.innerHTML = SCREENS[name]();
    const noTabs = name === 'welcome' || name === 'signup';
    const tb = $('#tabbar');
    tb.hidden = noTabs;
    if (!noTabs) {
      const pending = S.bookings.some(b => b.status === 'pending');
      tb.innerHTML = TABS.map(t => `<button data-a="tab" data-v="${t[0]}" class="${ROOT_TAB[name]===t[0]?'on':''}" style="${ROOT_TAB[name]===t[0]?'color:#D9431F':''}"><span style="position:relative"><svg viewBox="0 0 24 24">${t[2]}</svg>${t[0]==='bookings'&&pending?'<i style="position:absolute;top:-2px;right:-4px;width:8px;height:8px;border-radius:50%;background:#FF5A36"></i>':''}</span>${t[1]}</button>`).join('');
    }
    if (resetScroll) app.scrollTop = 0;
    const q = $('#q');
    if (q) q.addEventListener('input', () => { S.q = q.value; const pos = q.selectionStart; render(false); const nq = $('#q'); nq.focus(); nq.setSelectionRange(pos, pos); });
    const up = $('#vidUp');
    if (up) up.addEventListener('change', () => {
      const f = up.files && up.files[0]; if (!f) return;
      const url = URL.createObjectURL(f);
      S.videos.unshift({src:url, who:S.user?S.user.name:'Tu', ini:(S.user?S.user.name:'T').charAt(0).toUpperCase(), col:'#0FA3A0', sport:'Mano klipas', place:'Ką tik', text:'Mano naujausias klipas', likes:0, g:'#0E1B2C'});
      S.liked = Object.fromEntries(Object.entries(S.liked).map(([k,v])=>[+k+1,v]));
      render(true); toastFn('Įkelta! Matoma tik tavo naršyklėje');
    });
  }

  /* ---- Helpers ---- */
  const activeBooking = () => S.bookings.find(b => b.status === 'pending');
  const nextGood = (sport, from) => { for (let i=1;i<7;i++){const j=(from+i)%7;if(wxOf(sport,j).c==='good')return j;}return(from+1)%7; };

  function makeBooking() {
    const s = sp(S.sport), o = PROVIDERS[s.id][S.prov].offers[S.offer], d = days[S.day];
    S.bookings.push({sport:s.id,prov:S.prov,offer:S.offer,day:S.day,time:S.time,people:S.people,total:o.price*S.people,dayTxt:DACC[d.getDay()],status:'ok'});
  }
  function triggerAlert() {
    const b = S.bookings.slice().reverse().find(x=>x.status==='ok'||x.status==='moved'); if (!b) return;
    const s = sp(b.sport);
    b.status='pending'; b.newDay=nextGood(b.sport,b.day);
    b.badLabel=s.wx==='wind'?'tik 3 m/s':s.wx==='wave'?'tik 0,3 m':'liūtis';
    S.alerted=true;
    const push=$('#push');
    push.innerHTML=`<span class="ic"><svg width="24" height="24" viewBox="8 8 84 84"><path d="M18 84 L50 16 L82 84" fill="none" stroke="#FF8A3D" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#0FA3A0" stroke-width="9" stroke-linecap="round"/></svg></span><span><b>Adrena · dabar</b><p>${cap(b.dayTxt)} ${s.wx==='wind'?'nepakankamas vėjas':s.wx==='wave'?'per mažos bangos':'prognozuojama liūtis'}. Siūlome ${DACC[days[b.newDay].getDay()]} ${b.time}.</p></span>`;
    push.classList.add('show');
    clearTimeout(push._h); push._h=setTimeout(()=>push.classList.remove('show'),7000);
    render(false);
  }

  $('#push').addEventListener('click', () => { $('#push').classList.remove('show'); S.stack=['bookings','alert']; render(true); });

  /* ---- Click handler ---- */
  app.addEventListener('click', handle);
  $('#tabbar').addEventListener('click', handle);
  function handle(e) {
    const el = e.target.closest('[data-a]'); if (!el) return;
    const a = el.dataset.a, v = el.dataset.v;
    switch (a) {
      case 'back': back(); break;
      case 'go':   go(v); break;
      case 'tab':  tab(v); break;
      case 'guest': S.user=null; tab('home'); break;
      case 'int': { const i=S.interests.indexOf(v); i<0?S.interests.push(v):S.interests.splice(i,1); el.classList.toggle('on'); break; }
      case 'signup': {
        const name=$('#su-name').value.trim();
        if (!name){ toastFn('Įrašyk vardą'); $('#su-name').focus(); return; }
        if (!$('#su-ok').checked){ toastFn('Pažymėk sutikimą su sąlygomis'); return; }
        S.user={name,city:$('#su-city').value}; tab('home'); toastFn('Sveiki atvykę, '+name+'!'); break;
      }
      case 'quiz':     S.quiz={step:0,a:[]}; go('quiz'); break;
      case 'qa':       S.quiz.a.push(v); S.quiz.step++; render(true); break;
      case 'quizAgain':S.quiz={step:0,a:[]}; render(true); break;
      case 'sport':    S.sport=v; S.filters={}; go('results'); break;
      case 'filter':   S.filters[v]=!S.filters[v]; render(false); break;
      case 'prov':     S.sport=el.dataset.s; S.prov=+v; S.offer=0; S.day=null; S.time=null; S.people=1; S.resched=null; go('profile'); break;
      case 'offer':    S.offer=+v; render(false); break;
      case 'day':      S.day=+v; S.time=null; render(false); break;
      case 'time':     S.time=v; render(false); break;
      case 'ppl':      S.people=Math.min(6,Math.max(1,S.people+ +v)); render(false); break;
      case 'toPay':    go('payment'); break;
      case 'pay':      S.pay=v; render(false); break;
      case 'pay-now': {
        el.disabled=true; el.textContent='Apdorojama…';
        setTimeout(()=>{ makeBooking(); S.stack=['bookings','confirm']; render(true); clearTimeout(S.pushTimer); S.pushTimer=setTimeout(()=>{ if(!S.alerted)triggerAlert(); },6000); },900);
        break;
      }
      case 'cal':      toastFn('Demo: pamoka pridėta į kalendorių'); break;
      case 'simAlert': triggerAlert(); break;
      case 'accept': { const b=activeBooking(); b.day=b.newDay; b.dayTxt=DACC[days[b.day].getDay()]; b.status='moved'; tab('bookings'); toastFn('Pamoka perkelta į '+b.dayTxt); break; }
      case 'otherTime':{ const b=activeBooking(); S.resched=S.bookings.indexOf(b); S.sport=b.sport; S.prov=b.prov; S.offer=b.offer; S.day=null; S.time=null; go('booking'); break; }
      case 'reschedDo':{ const b=S.bookings[S.resched]; b.day=S.day; b.time=S.time; b.dayTxt=DACC[days[S.day].getDay()]; b.status='moved'; S.resched=null; tab('bookings'); toastFn('Naujas laikas patvirtintas'); break; }
      case 'refund':   { const b=activeBooking(); b.status='ref'; tab('bookings'); toastFn(b.total+' € grąžinsime per 1–3 d. d.'); break; }
      case 'like': {
        S.liked[v]=!S.liked[v];
        el.classList.toggle('on',!!S.liked[v]);
        el.querySelector('path').setAttribute('fill',S.liked[v]?'currentColor':'none');
        el.lastChild.textContent=S.videos[v].likes+(S.liked[v]?1:0);
        break;
      }
      case 'amt':    S.gift.amt=+v; render(false); break;
      case 'giftDo': S.gift.to=($('#g-to')||{}).value||''; S.stack=['home','giftOk']; render(true); break;
    }
  }

  /* ---- Scenario buttons ---- */
  function ensureUser() { if (!S.user) S.user={name:'Gabija',city:'Kaunas'}; }
  function sampleBooking() {
    S.sport='kaitavimas'; S.prov=0; S.offer=0; S.people=1; S.time='10:00';
    S.day=days.findIndex((_,i)=>wxOf('kaitavimas',i).c==='good'&&wxOf('kaitavimas',(i+1)%7).c!=='bad');
    if (S.day<0) S.day=1;
    makeBooking();
  }
  $('#scn').addEventListener('click', e => {
    const b=e.target.closest('[data-scn]'); if (!b) return;
    const k=b.dataset.scn;
    if (window.matchMedia('(max-width:900px)').matches) $('.phone').scrollIntoView({behavior:'smooth',block:'center'});
    $('#push').classList.remove('show');
    if (k==='signup'){  S.stack=['welcome','signup']; render(true); }
    if (k==='quiz'){    ensureUser(); S.quiz={step:0,a:[]}; S.stack=['home','quiz']; render(true); }
    if (k==='book'){    ensureUser(); S.sport='kaitavimas'; S.filters={}; S.stack=['home','results']; render(true); }
    if (k==='alert'){   ensureUser(); if(!S.bookings.some(x=>x.status==='ok'||x.status==='moved'))sampleBooking(); S.alerted=false; S.stack=['bookings']; render(true); setTimeout(triggerAlert,500); }
    if (k==='progress'){ensureUser(); S.stack=['progress']; render(true); }
    if (k==='community'){ensureUser(); S.stack=['community']; render(true); }
  });
  $('#resetDemo').addEventListener('click', ()=>{ clearTimeout(S.pushTimer); $('#push').classList.remove('show'); S=fresh(); render(true); });

  /* ---- Real weather fallback for kiting ---- */
  (function tryRealWeather() {
    if (window.location.protocol === 'file:') return;
    if (!window.fetch) return;
    var base = window.location.pathname.replace(/\\/g,'/').indexOf('/en/') !== -1 ? '..' : '';
    fetch(base + '/api/weather?place=svencele')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.slots) return;
        // Group slots by day, pick midday representative
        var byDay = {};
        data.slots.forEach(function (s) {
          var day = s.time.substring(0, 10);
          var h = parseInt(s.time.substring(11, 13), 10);
          if (!byDay[day] || Math.abs(h - 12) < Math.abs(parseInt(byDay[day].time.substring(11, 13), 10) - 12)) {
            byDay[day] = s;
          }
        });
        var daySlots = Object.values(byDay).slice(0, 7);
        daySlots.forEach(function (s, i) {
          if (i < WIND.length && s.wind != null) WIND[i] = Math.round(s.wind * 10) / 10;
        });
      })
      .catch(function () {}); // silent — stays on sample data
  })();

  /* ---- Clock ---- */
  function tick(){ const d=new Date(); $('#clock').textContent=d.getHours()+':'+String(d.getMinutes()).padStart(2,'0'); }
  tick(); setInterval(tick,30000);

  /* ---- Init ---- */
  render(true);

})();
