/* demo.js — Adrena phone prototype (prototipas.html and en/prototype.html) */
(function () {
  'use strict';

  // Language: L('lietuviškai', 'in English')
  const EN = document.documentElement.lang === 'en';
  const L = (lt, en) => EN ? en : lt;

  /* ---- Configurable video content ---- */
  const VIDEOS = [
    {src:'../media/video-kaitavimas.mp4',       who:L('Adrenos komanda', 'Adrena team'), ini:'A', col:'#FF5A36', sport:L('Kaitavimas', 'Kitesurfing'),       place:L('Ant vandens', 'On the water'),    text:L('Vėjas pagavo kaitą, važiuojam!', 'The wind caught the kite, here we go!'),              likes:48, g:'#0E1B2C'},
    {src:'../media/video-sniego-kaitavimas.mp4', who:L('Adrenos komanda', 'Adrena team'), ini:'A', col:'#FF5A36', sport:L('Sniego kaitavimas', 'Snowkiting'), place:L('Užšalęs ežeras', 'Frozen lake'), text:L('Žiemą kaitavimas nesibaigia: slidės ir ledas', 'Kiting does not stop in winter: skis and ice'), likes:31, g:'#0E1B2C'},
    {src:'../media/video-slidinejimas.mp4',      who:L('Adrenos komanda', 'Adrena team'), ini:'A', col:'#FF5A36', sport:L('Slidinėjimas', 'Skiing'),     place:L('Kalnai', 'Mountains'),          text:L('Rytas ant šviežio sniego', 'Morning on fresh snow'),                    likes:22, g:'#0E1B2C'},
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
    {id:'kaitavimas',   name:L('Kaitavimas', 'Kitesurfing'),           g:'linear-gradient(135deg,#0FA3A0,#0E5E7E)', ic:'wind', wx:'wind', cert:'IKO'},
    {id:'banglentes',   name:L('Banglentės', 'Surfing'),           g:'linear-gradient(135deg,#1C7ED6,#0E4E6E)', ic:'wave', wx:'wave', cert:'ISA'},
    {id:'vandenlentes', name:L('Vandenlentės', 'Wakeboarding'),         g:'linear-gradient(135deg,#0E6E8C,#163E63)', ic:'wave', wx:'none'},
    {id:'slides',       name:L('Slidės ir snieglentės', 'Skiing & snowboarding'),g:'linear-gradient(135deg,#7FA7C9,#3D5A80)', ic:'mtn',  wx:'none'},
    {id:'parasparnis',  name:L('Parasparnis', 'Paragliding'),          g:'linear-gradient(135deg,#FF8A3D,#E2542F)', ic:'sky',  wx:'wind'},
    {id:'parasiutas',   name:L('Parašiutas', 'Skydiving'),           g:'linear-gradient(135deg,#FF5A36,#A83256)', ic:'sky',  wx:'none'},
    {id:'laipiojimas',  name:L('Laipiojimas', 'Climbing'),          g:'linear-gradient(135deg,#9A7A52,#4E3B2A)', ic:'rock', wx:'none'},
    {id:'nardymas',     name:L('Nardymas', 'Diving'),             g:'linear-gradient(135deg,#1E4E7A,#0E1B2C)', ic:'dive', wx:'none'},
  ];
  const P = (name, place, cert, rating, n, years, students, offers, reviews) => ({name, place, cert, rating, n, years, students, offers, reviews});
  const O = (t, dur, price, inc) => ({t, dur, price, inc});
  const PROVIDERS = {
    kaitavimas:[
      P('Marių vėjas',L('Kuršių marios, Pervalka', 'Curonian Lagoon, Pervalka'),L('IKO 2 lygio instruktorius', 'IKO level 2 instructor'),4.9,38,7,420,
        [O(L('Pirmoji pamoka', 'First lesson'),L('2 val.', '2 h'),85,[L('Įranga', 'Gear'),L('Hidrokostiumas', 'Wetsuit'),L('Radijo ryšys', 'Radio contact'),L('Grupė iki 2', 'Group of up to 2')]),O(L('Pradedančiųjų kursas', 'Beginner course'),L('4 val.', '4 h'),155,[L('Įranga', 'Gear'),L('Hidrokostiumas', 'Wetsuit'),L('IKO kortelė', 'IKO card'),L('Grupė iki 2', 'Group of up to 2')]),O(L('Individuali pamoka', 'Private lesson'),L('2 val.', '2 h'),120,[L('Įranga', 'Gear'),L('Hidrokostiumas', 'Wetsuit'),L('1 mokinys', '1 student')])],
        [['Gabija',L('Pirmą kartą stovėjau ant lentos jau antroje pamokoje. Instruktorius ramus ir aiškiai paaiškina.', 'I was standing on the board by my second lesson. The instructor is calm and explains things clearly.')],['Mantas',L('Patiko, kad pamoka buvo perkelta dėl vėjo be jokio vargo.', 'I liked that the lesson was moved because of the wind with no hassle.')]]),
      P('Nerijos kaitai','Nida',L('IKO 1 lygio instruktorius', 'IKO level 1 instructor'),4.8,21,4,180,
        [O(L('Pirmoji pamoka', 'First lesson'),L('2 val.', '2 h'),90,[L('Įranga', 'Gear'),L('Hidrokostiumas', 'Wetsuit'),L('Grupė iki 3', 'Group of up to 3')]),O(L('Pradedančiųjų kursas', 'Beginner course'),L('4 val.', '4 h'),165,[L('Įranga', 'Gear'),L('Hidrokostiumas', 'Wetsuit'),L('Grupė iki 3', 'Group of up to 3')])],
        [['Ieva',L('Puiki vieta pradedantiesiems, seklus vanduo.', 'Great spot for beginners, shallow water.')]]),
      P('Agnė M.',L('Klaipėda, Melnragė', 'Klaipėda, Melnragė'),L('IKO 1 lygio instruktorė', 'IKO level 1 instructor'),4.7,12,3,90,
        [O(L('Pirmoji pamoka', 'First lesson'),L('2 val.', '2 h'),75,[L('Įranga', 'Gear'),L('Hidrokostiumas', 'Wetsuit'),L('1–2 mokiniai', '1–2 students')])],
        [['Rokas',L('Labai kantri ir draugiška.', 'Very patient and friendly.')]]),
    ],
    banglentes:[P('Bangų klubas',L('Klaipėda, Melnragė', 'Klaipėda, Melnragė'),L('ISA instruktorius', 'ISA instructor'),4.8,19,5,260,[O(L('Pirmoji pamoka', 'First lesson'),L('1,5 val.', '1.5 h'),45,[L('Lenta', 'Board'),L('Hidrokostiumas', 'Wetsuit'),L('Grupė iki 6', 'Group of up to 6')])],[['Lukas',L('Smagu, net jei bangos nedidelės.', 'Fun even when the waves are small.')]])],
    vandenlentes:[P(L('Marių vandenlenčių parkas', 'Lagoon wake park'),L('Kauno marios', 'Kaunas Reservoir'),L('Vandenlenčių treneris', 'Wakeboard coach'),4.7,54,6,900,[O(L('Valanda parke', 'An hour in the park'),L('1 val.', '1 h'),30,[L('Lenta', 'Board'),L('Liemenė', 'Vest'),L('Šalmas', 'Helmet')])],[['Eglė',L('Treneris padėjo atsistoti iš pirmo karto.', 'The coach got me standing on the first try.')]])],
    slides:[P(L('Kalnų mokykla', 'Mountain school'),'Druskininkai',L('Slidinėjimo instruktorius', 'Ski instructor'),4.8,33,9,700,[O(L('Pirmoji pamoka', 'First lesson'),L('1 val.', '1 h'),40,[L('Slidės ir batai', 'Skis and boots'),L('Keltuvo bilietas', 'Lift pass')])],[['Domas',L('Pirmą dieną jau leidausi nuo kalno.', 'I was skiing down the slope on day one.')]])],
    parasparnis:[P(L('Kopų sparnai', 'Dune Wings'),'Neringa',L('Tandemo piloto licencija', 'Tandem pilot licence'),4.9,27,11,1300,[O(L('Tandemo skrydis', 'Tandem flight'),L('20 min.', '20 min'),95,[L('Įranga', 'Gear'),L('Skrydžio vaizdo įrašas', 'Flight video')])],[['Austėja',L('Nerealus vaizdas į marias.', 'An unreal view over the lagoon.')]])],
    parasiutas:[P(L('Laisvo kritimo klubas', 'Freefall club'),L('Pociūnų aerodromas', 'Pociūnai airfield'),L('Tandemo instruktorius', 'Tandem instructor'),4.9,41,14,2500,[O(L('Tandemo šuolis', 'Tandem jump'),L('1 diena', '1 day'),260,[L('Instruktažas', 'Briefing'),L('Įranga', 'Gear'),L('Pažymėjimas', 'Certificate')])],[['Karolis',L('Geriausia gimtadienio dovana.', 'Best birthday present ever.')]])],
    laipiojimas:[P(L('Uolų sienelė', 'Rock wall'),'Vilnius',L('Laipiojimo instruktorius', 'Climbing instructor'),4.7,60,8,1100,[O(L('Įvadinė pamoka', 'Intro lesson'),L('1,5 val.', '1.5 h'),25,[L('Batai', 'Shoes'),L('Diržas', 'Harness'),L('Apsauga', 'Belay')])],[['Ugnė',L('Labai saugu ir aišku.', 'Very safe and clear.')]])],
    nardymas:[P(L('Ežerų nardymo centras', 'Lake dive centre'),L('Prie Molėtų', 'Near Molėtai'),L('PADI instruktorius', 'PADI instructor'),4.8,17,10,600,[O(L('Bandomasis nardymas', 'Try dive'),L('3 val.', '3 h'),110,[L('Įranga', 'Gear'),L('Hidrokostiumas', 'Wetsuit'),L('Teorija', 'Theory')])],[['Jonas',L('Pirmas kartas po vandeniu, nepamirštama.', 'First time under water, unforgettable.')]])],
  };

  /* ---- Weather sample data ---- */
  const WIND  = [7, 9, 3, 8, 12, 5, 9];
  const WAVE  = [0.6, 1.1, 0.3, 0.9, 1.4, 0.5, 1.0];
  const DN    = EN ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['Sk','Pr','An','Tr','Kt','Pn','Št'];
  const DACC  = EN ? ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] : ['sekmadienį','pirmadienį','antradienį','trečiadienį','ketvirtadienį','penktadienį','šeštadienį'];
  const TIMES = ['10:00','13:00','16:00'];
  const days  = Array.from({length:7}, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; });
  const cap   = s => s.charAt(0).toUpperCase() + s.slice(1);
  const sp    = id => SPORTS.find(s => s.id === id);

  function wxOf(sport, i) {
    const t = sp(sport).wx;
    if (t === 'wind') { const v = WIND[i]; const c = v < 5 ? 'bad' : v < 6 || v > 10 ? 'warn' : 'good'; return {c, label: v + ' m/s', v}; }
    if (t === 'wave') { const v = WAVE[i]; const c = v < 0.5 ? 'bad' : v < 0.8 ? 'warn' : 'good'; return {c, label: (EN ? String(v) : String(v).replace('.', ',')) + ' m', v}; }
    const bad = i === 2; return {c: bad ? 'bad' : 'good', label: bad ? L('liūtis', 'downpour') : (12 - i) + '°', v:0};
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

  const backBar  = title => `<div class="a-back"><button data-a="back" aria-label="${L('Atgal', 'Back')}"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><b>${title}</b></div>`;
  const ic       = (k, sz = 22) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24">${ICON[k]}</svg>`;
  const verified = '<span class="ver"><svg width="11" height="11" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' + L('Patikrintas', 'Verified') + '</span>';
  const minPrice = p => Math.min(...p.offers.map(o => o.price));

  /* ---- Screens ---- */
  const SCREENS = {
    welcome() {
      return `<div class="welcome">
        <div>
          <svg width="64" height="64" viewBox="8 8 84 84" aria-hidden="true"><defs><linearGradient id="wg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FF5A36"/><stop offset="1" stop-color="#FF8A3D"/></linearGradient><mask id="wm" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round"/></mask></defs><path d="M18 84 L50 16 L82 84" fill="none" stroke="url(#wg)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" mask="url(#wm)"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#0FA3A0" stroke-width="9" stroke-linecap="round"/></svg>
          <div class="a-h1">${L('Adrenalinas, kurį gali išmokti', 'Adrenaline you can learn')}</div>
          <p>${L('Rask patikrintą instruktorių, užsisakyk pamoką ir sek savo progresą.', 'Find a verified instructor, book a lesson and track your progress.')}</p>
        </div>
        <div style="display:grid;gap:10px">
          <button class="a-btn" data-a="go" data-v="signup">${L('Sukurti paskyrą', 'Create account')}</button>
          <button class="a-btn sec" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.3)" data-a="guest">${L('Tęsti be paskyros', 'Continue without an account')}</button>
        </div>
      </div>`;
    },
    signup() {
      const ints = EN ? ['Kitesurfing','Surfing','Skiing','Paragliding','Climbing','Diving'] : [L('Kaitavimas', 'Kitesurfing'),L('Banglentės', 'Surfing'),'Slidės',L('Parasparnis', 'Paragliding'),L('Laipiojimas', 'Climbing'),L('Nardymas', 'Diving')];
      return backBar(L('Nauja paskyra', 'New account')) + `<div class="pad">
        <div class="a-h1" style="font-size:23px">${L('Susipažinkime', 'Let\'s get to know you')}</div>
        <p class="a-muted" style="margin:6px 0 18px">${L('Tai demonstracija: duomenys niekur nesiunčiami.', 'This is a demo: nothing you enter is sent anywhere.')}</p>
        <div class="field"><label for="su-name">${L('Vardas', 'Name')}</label><input id="su-name" autocomplete="off" placeholder="${L('pvz., Gabija', 'e.g. Gabija')}" maxlength="20"></div>
        <div class="field"><label for="su-city">${L('Miestas', 'City')}</label><select id="su-city"><option>Vilnius</option><option selected>Kaunas</option><option>Klaipėda</option><option>Šiauliai</option><option>Panevėžys</option><option>${L('Kitas', 'Other')}</option></select></div>
        <div class="field"><label>${L('Kas tave domina?', 'What are you into?')}</label><div class="chips">${ints.map(t => `<button class="chip ${S.interests.includes(t) ? 'on' : ''}" data-a="int" data-v="${t}">${t}</button>`).join('')}</div></div>
        <label class="check"><input type="checkbox" id="su-ok">${L('Sutinku su Adrenos naudojimo sąlygomis ir privatumo politika', 'I agree to the Adrena terms of use and privacy policy')}</label>
        <button class="a-btn" data-a="signup">${L('Sukurti paskyrą', 'Create account')}</button>
      </div>`;
    },
    home() {
      const q = (S.q || '').toLowerCase();
      const list = SPORTS.filter(s => s.name.toLowerCase().includes(q));
      const pop = PROVIDERS.kaitavimas.slice(0, 2).map((p, i) => ({p, s:'kaitavimas', i}))
        .concat([{p:PROVIDERS.parasparnis[0], s:'parasparnis', i:0},{p:PROVIDERS.banglentes[0], s:'banglentes', i:0}]);
      return `<div class="pad">
        <div class="row"><div><div class="a-muted">${L('Labas', 'Hi')}${S.user ? ', ' + esc(S.user.name) : ''}!</div><div class="a-h1">${L('Ką nori išbandyti?', 'What do you want to try?')}</div></div>
        <div class="avatar" style="background:#0FA3A0;width:38px;height:38px">${esc((S.user ? S.user.name : 'S').charAt(0).toUpperCase())}</div></div>
        <label class="search"><svg width="18" height="18" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="#5B6975" stroke-width="2.2"/><path d="M16.5 16.5 21 21" stroke="#5B6975" stroke-width="2.2" stroke-linecap="round"/></svg><input id="q" placeholder="${L('Kaitavimas, slidės, nardymas…', 'Kitesurfing, skiing, diving…')}" value="${esc(S.q || '')}" aria-label="${L('Paieška', 'Search')}"></label>
        <button class="quiz-cta" data-a="quiz"><span class="q">?</span><span><b>${L('Nežinau, ką išbandyti', 'Not sure what to try')}</b><span>${L('3 klausimai ir tau tinkamos veiklos', '3 questions and the activities that suit you')}</span></span></button>
        <div class="a-h2">${L('Veiklos', 'Activities')}</div>
        <div class="sport-grid">${list.map(s => `<button class="sport" style="background:${s.g}" data-a="sport" data-v="${s.id}">${ic(s.ic, 70)}${s.name}</button>`).join('') || '<p class="a-muted">' + L('Nieko nerasta.', 'Nothing found.') + '</p>'}</div>
        <div class="a-h2">${L('Populiaru šią savaitę', 'Popular this week')}</div>
        <div class="hscroll">${pop.map(({p, s, i}) => `<button class="a-card mini" data-a="prov" data-s="${s}" data-v="${i}"><div class="cov" style="background:${sp(s).g}"></div><div class="in"><b style="font-size:14px">${esc(p.name)}</b><div class="a-muted">${sp(s).name} · ${L('nuo', 'from')} ${minPrice(p)} €</div><div style="font-size:13px;margin-top:3px"><span class="star">★ ${(EN ? String(p.rating) : String(p.rating).replace('.', ','))}</span> <span class="a-muted">(${p.n})</span></div></div></button>`).join('')}</div>
        <button class="gift" data-a="go" data-v="gift"><b>${L('Dovanok adrenaliną', 'Gift some adrenaline')}</b><span style="font-size:13.5px">${L('Dovanų kuponas bet kuriai veiklai. Gavėjas pats pasirinks laiką.', 'A gift voucher for any activity. They pick the time themselves.')}</span></button>
      </div>`;
    },
    quiz() {
      const Q = [
        {t:L('Kur norėtum sportuoti?', 'Where would you like to do sport?'), o:[['vanduo',L('Ant vandens', 'On the water'),L('Jūra, marios, ežerai', 'Sea, lagoon, lakes')],['oras',L('Ore', 'In the air'),L('Skrydžiai ir šuoliai', 'Flights and jumps')],['sniegas',L('Ant sniego', 'On snow'),L('Kalnai ir trasos', 'Mountains and slopes')],['zeme',L('Ant žemės', 'On land'),L('Uolos ir sienelės', 'Rocks and walls')]]},
        {t:L('Kiek adrenalino nori?', 'How much adrenaline do you want?'),  o:[['1',L('Šiek tiek', 'A little'),L('Ramiai išbandyti', 'Try it calmly')],['2',L('Vidutiniškai', 'Medium'),L('Noriu pajusti greitį', 'I want to feel the speed')],['3',L('Daug!', 'Lots!'),L('Kuo ekstremaliau, tuo geriau', 'The more extreme, the better')]]},
        {t:L('Su kuo eisi?', 'Who are you going with?'),           o:[['vienas',L('Vienas', 'Alone'),L('Noriu išmokti pats', 'I want to learn on my own')],['draugai',L('Su draugais', 'With friends'),L('Grupinė pamoka', 'Group lesson')],['seima',L('Su šeima', 'With family'),L('Tinka ir vaikams', 'Good for kids too')]]},
      ];
      const st = S.quiz.step;
      if (st >= Q.length) {
        const [kur, lvl] = S.quiz.a;
        const map = {vanduo:['kaitavimas','banglentes','vandenlentes'],oras:['parasparnis','parasiutas'],sniegas:['slides'],zeme:['laipiojimas','slides']};
        let res = map[kur] || ['kaitavimas'];
        if (lvl === '1' && kur === 'vanduo') res = ['vandenlentes','banglentes','kaitavimas'];
        if (lvl === '3' && kur === 'oras')   res = ['parasiutas','parasparnis'];
        if (res.length < 2) res = res.concat(kur === 'sniegas' ? ['kaitavimas'] : ['nardymas']);
        return backBar(L('Tau tinka', 'Your match')) + `<div class="pad">
          <div class="a-h1" style="font-size:23px">${L('Štai ką rekomenduojame', 'Here\'s what we recommend')}</div>
          <p class="a-muted" style="margin:6px 0 16px">${L('Pagal tavo atsakymus', 'Based on your answers')}</p>
          <div style="display:grid;gap:10px">${res.slice(0, 3).map((id, i) => `<button class="sport" style="background:${sp(id).g};height:96px;width:100%" data-a="sport" data-v="${id}">${ic(sp(id).ic, 70)}<span>${i === 0 ? '<span style="display:block;font-size:11px;font-weight:600;opacity:.85">' + L('GERIAUSIAI TINKA', 'BEST MATCH') + '</span>' : ''}${sp(id).name}</span></button>`).join('')}</div>
          <button class="a-btn sec" style="margin-top:16px" data-a="quizAgain">${L('Atsakyti iš naujo', 'Answer again')}</button>
        </div>`;
      }
      const q = Q[st];
      return backBar(L('Nežinau, ką išbandyti', 'Not sure what to try')) + `<div class="pad">
        <div class="qdots">${Q.map((_, i) => `<i class="${i <= st ? 'on' : ''}"></i>`).join('')}</div>
        <div class="a-h1" style="font-size:23px;margin-bottom:16px">${q.t}</div>
        ${q.o.map(o => `<button class="a-card qopt" data-a="qa" data-v="${o[0]}">${o[1]}<span>${o[2]}</span></button>`).join('')}
      </div>`;
    },
    results() {
      const s = sp(S.sport); let list = (PROVIDERS[s.id] || []).map((p, i) => ({p, i}));
      if (S.filters.cheap) list = list.filter(x => minPrice(x.p) <= 80);
      const ni = days.findIndex((_, i) => wxOf(s.id, i).c === 'good');
      const nextTxt = ni < 0 ? '' : L(' · artimiausia tinkama diena: ', ' · next good day: ') + DACC[days[ni].getDay()] + ' (' + wxOf(s.id, ni).label + ')';
      return backBar(s.name) + `<div class="pad">
        <div class="chips" style="margin-bottom:14px">
          <button class="chip on">${L('Pradedantiesiems', 'Beginners')}</button>
          <button class="chip ${S.filters.cheap ? 'on' : ''}" data-a="filter" data-v="cheap">${L('Iki 80 €', 'Up to €80')}</button>
          <button class="chip">${L('Šią savaitę', 'This week')}</button>
        </div>
        <p class="a-muted" style="margin-bottom:10px">${L('Rasta', 'Found')}: ${list.length}${s.wx !== 'none' ? nextTxt : ''}</p>
        ${list.map(({p, i}) => `<button class="a-card prov" data-a="prov" data-s="${s.id}" data-v="${i}"><div class="cov" style="background:${s.g}"></div><div style="min-width:0">
          <div class="row"><b>${esc(p.name)}</b>${verified}</div>
          <div class="a-muted">${esc(p.place)}</div>
          <div class="row" style="margin-top:4px;font-size:13.5px"><span><span class="star">★ ${(EN ? String(p.rating) : String(p.rating).replace('.', ','))}</span> <span class="a-muted">(${p.n})</span></span><b>${L('nuo', 'from')} ${minPrice(p)} €</b></div>
        </div></button>`).join('') || '<div class="empty">' + L('Pagal šį filtrą nieko nėra.', 'Nothing matches this filter.') + '</div>'}
      </div>`;
    },
    profile() {
      const s = sp(S.sport), p = PROVIDERS[s.id][S.prov];
      return `<div class="pad"><div class="cover" style="background:${s.g}">
          <button data-a="back" aria-label="${L('Atgal', 'Back')}" style="position:absolute;top:10px;left:14px;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.9);display:grid;place-items:center;cursor:pointer"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#0E1B2C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <span style="color:#fff;opacity:.4;position:absolute;right:10px;bottom:-6px">${ic(s.ic, 110)}</span>
        </div>
        <div style="margin-top:14px" class="row"><div class="a-h1" style="font-size:22px">${esc(p.name)}</div>${verified}</div>
        <div class="a-muted">${esc(p.place)} · ${s.name}</div>
        <div class="a-card" style="display:grid;grid-template-columns:repeat(3,1fr);text-align:center;padding:12px 6px;margin-top:14px">
          <div><b class="star">★ ${(EN ? String(p.rating) : String(p.rating).replace('.', ','))}</b><div class="a-muted" style="font-size:11.5px">${p.n} ${L('atsiliepimai', 'reviews')}</div></div>
          <div><b>${p.years} ${L('m.', 'yrs')}</b><div class="a-muted" style="font-size:11.5px">${L('patirtis', 'experience')}</div></div>
          <div><b>${p.students}+</b><div class="a-muted" style="font-size:11.5px">${L('mokinių', 'students')}</div></div>
        </div>
        <div class="a-card" style="padding:10px 12px;margin-top:10px;font-size:13.5px;display:flex;gap:8px;align-items:center"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2 20 6v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" fill="#E3F4EB" stroke="#178A55" stroke-width="2"/></svg><span><b>${esc(p.cert)}</b> · ${L('sertifikatas ir draudimas patikrinti', 'certificate and insurance verified')}</span></div>
        <div class="a-h2">${L('Ką siūlo', 'What they offer')}</div>
        ${p.offers.map((o, i) => `<button class="a-card offer ${S.offer === i ? 'on' : ''}" data-a="offer" data-v="${i}"><span class="radio"></span><span><b>${o.t}</b><div class="a-muted">${o.dur}</div><div class="inc">${o.inc.map(x => `<span>${x}</span>`).join('')}</div></span><b>${o.price} €</b></button>`).join('')}
        <div class="a-h2">${L('Atsiliepimai', 'Reviews')}</div>
        ${p.reviews.map(r => `<div class="a-card review"><div class="row"><b>${r[0]}</b><span class="star">★★★★★</span></div><p style="margin-top:4px;color:#3D4A55">${r[1]}</p></div>`).join('')}
      </div>
      <div class="sticky-b"><button class="a-btn" data-a="go" data-v="booking">${L('Pasirinkti laiką', 'Choose a time')}</button></div>`;
    },
    booking() {
      const s = sp(S.sport), p = PROVIDERS[s.id][S.prov];
      const taken = {1:['13:00'], 3:['10:00'], 6:['16:00']};
      const wxName = s.wx === 'wind' ? L('Vėjas', 'Wind') : s.wx === 'wave' ? L('Bangos', 'Waves') : L('Orai', 'Weather');
      return backBar(S.resched != null ? L('Perkelti pamoką', 'Reschedule lesson') : L('Pasirink laiką', 'Pick a time')) + `<div class="pad">
        <div class="a-muted">${esc(p.name)} · ${p.offers[S.offer].t}</div>
        <div class="a-h2" style="margin-top:12px">${L('Diena', 'Day')} <span class="a-muted" style="font-weight:500;font-family:var(--f-body)">· ${wxName.toLowerCase()} ${L('prognozė', 'forecast')}</span></div>
        <div class="days">${days.map((d, i) => { const w = wxOf(s.id, i); return `<button class="day ${S.day === i ? 'on' : ''}" data-a="day" data-v="${i}"><small>${DN[d.getDay()]}</small><b>${d.getDate()}</b><span class="wx ${w.c}">${w.label}</span></button>`; }).join('')}</div>
        <div class="legend"><span><i style="background:#178A55"></i>${L('Tinka', 'Good')}</span><span><i style="background:#B86E00"></i>${L('Ribinės', 'Borderline')}</span><span><i style="background:#9AA6AE"></i>${L('Netinka', 'Not suitable')}</span></div>
        ${S.day != null && wxOf(s.id, S.day).c === 'bad' ? '<div class="guard" style="margin-top:12px;background:#FBF0DC;color:#7A4A00">' + L('Šią dieną sąlygos netinka. Rinkis dieną su žaliu ženklu.', 'Conditions are not suitable that day. Pick a day with a green tag.') + '</div>' : ''}
        <div class="a-h2">${L('Laikas', 'Time')}</div>
        <div class="times">${TIMES.map(t => { const dis = S.day == null || wxOf(s.id, S.day).c === 'bad' || (taken[S.day] || []).includes(t); return `<button class="time ${S.time === t && !dis ? 'on' : ''}" data-a="time" data-v="${t}" ${dis ? 'disabled' : ''}>${t}</button>`; }).join('')}</div>
        ${S.resched != null ? '' : `<div class="a-h2">${L('Dalyviai', 'People')}</div>
        <div class="a-card row" style="padding:10px 14px"><span>${L('Žmonių skaičius', 'Number of people')}</span><div class="stepper"><button data-a="ppl" data-v="-1" aria-label="${L('Mažiau', 'Fewer')}">–</button><b>${S.people}</b><button data-a="ppl" data-v="1" aria-label="${L('Daugiau', 'More')}">+</button></div></div>
        <p class="a-muted" style="margin-top:8px">${L('Eini su draugais? Kiekvienas gaus kvietimą.', 'Going with friends? Each of them gets an invite.')}</p>`}
      </div>
      <div class="sticky-b"><button class="a-btn" data-a="${S.resched != null ? 'reschedDo' : 'toPay'}" ${S.day == null || !S.time || wxOf(s.id, S.day).c === 'bad' ? 'disabled' : ''}>${S.resched != null ? L('Patvirtinti naują laiką', 'Confirm new time') : L('Tęsti', 'Continue')}</button></div>`;
    },
    payment() {
      const s = sp(S.sport), p = PROVIDERS[s.id][S.prov], o = p.offers[S.offer], d = days[S.day];
      const total = o.price * S.people;
      const methods = [['card',L('Banko kortelė', 'Bank card')],['wallet','Apple Pay / Google Pay'],['bank',L('Bankinė nuoroda', 'Bank link')]];
      return backBar(L('Apmokėjimas', 'Payment')) + `<div class="pad">
        <div class="a-card sum">
          <div class="row"><span>${L('Veikla', 'Activity')}</span><span>${s.name}, ${o.t.toLowerCase()}</span></div>
          <div class="row"><span>${L('Instruktorius', 'Instructor')}</span><span>${esc(p.name)}</span></div>
          <div class="row"><span>${L('Data', 'Date')}</span><span>${cap(DACC[d.getDay()])}, ${EN ? d.getDate() + '/' + (d.getMonth()+1) : (d.getMonth()+1) + '-' + String(d.getDate()).padStart(2,'0')} ${S.time}</span></div>
          <div class="row"><span>${L('Vieta', 'Place')}</span><span>${esc(p.place)}</span></div>
          <div class="row"><span>${L('Dalyviai', 'People')}</span><span>${S.people} × ${o.price} €</span></div>
          <div class="row total"><span>${L('Iš viso', 'Total')}</span><span>${total} €</span></div>
        </div>
        <div class="a-h2">${L('Mokėjimo būdas', 'Payment method')}</div>
        ${methods.map(m => `<button class="a-card pay ${S.pay === m[0] ? 'on' : ''}" data-a="pay" data-v="${m[0]}"><span class="radio"></span>${m[1]}</button>`).join('')}
        <div class="guard" style="margin-top:10px"><svg width="22" height="22" viewBox="0 0 24 24" style="flex:none">${ICON.wind}</svg><span><b>${L('Orų apsauga', 'Weather protection')}</b>${L('Jei oras bus netinkamas, nemokamai perkelsime pamoką arba grąžinsime pinigus.', 'If the weather is not right, we move your lesson for free or refund you.')}</span></div>
      </div>
      <div class="sticky-b"><button class="a-btn" data-a="pay-now">${L('Apmokėti', 'Pay')} ${total} €</button></div>`;
    },
    confirm() {
      const b = S.bookings[S.bookings.length - 1]; if (!b) return SCREENS.home();
      const s = sp(b.sport), p = PROVIDERS[s.id][b.prov];
      return `<div class="pad" style="text-align:center">
        <div class="okmark"><svg width="38" height="38" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#178A55" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="a-h1" style="font-size:24px">${L('Užsakymas patvirtintas!', 'Booking confirmed!')}</div>
        <p class="a-muted" style="margin-top:4px">${s.name} ${L('su', 'with')} „${esc(p.name)}" · ${b.dayTxt}, ${b.time}</p>
      </div>
      <div class="pad" style="padding-top:0">
        <div class="map"><svg viewBox="0 0 300 110" preserveAspectRatio="none"><path d="M0 70 C60 40 120 90 180 60 S260 30 300 50 V110 H0Z" fill="#9FD3DE"/><path d="M0 70 C60 40 120 90 180 60 S260 30 300 50" fill="none" stroke="#fff" stroke-width="2"/></svg><div style="position:absolute;left:58%;top:28%;transform:translate(-50%,-100%)"><svg width="26" height="32" viewBox="0 0 24 30"><path d="M12 29s10-10 10-17A10 10 0 0 0 2 12c0 7 10 17 10 17z" fill="#FF5A36"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg></div><span style="position:absolute;left:10px;bottom:8px;font-size:12px;font-weight:700;background:#fff;padding:3px 8px;border-radius:6px">${esc(p.place)}</span></div>
        <div class="a-h2">${L('Ką pasiimti', 'What to bring')}</div>
        <ul class="list"><li>${L('Rankšluostį ir maudymosi kostiumėlį', 'A towel and swimwear')}</li><li>${L('Kremą nuo saulės ir akinius', 'Sunscreen and sunglasses')}</li><li>${L('Vandens butelį', 'A water bottle')}</li></ul>
        <div style="display:grid;gap:9px;margin-top:18px">
          <button class="a-btn sec" data-a="cal">${L('Pridėti į kalendorių', 'Add to calendar')}</button>
          <button class="a-btn" data-a="tab" data-v="bookings">${L('Mano užsakymai', 'My bookings')}</button>
        </div>
        <p class="a-muted" style="text-align:center;margin-top:12px">${L('Artėjant pamokai stebėsime orų prognozę.', 'We will keep an eye on the forecast as your lesson gets closer.')}</p>
      </div>`;
    },
    alert() {
      const b = activeBooking(); if (!b) return SCREENS.bookings();
      const s = sp(b.sport); const nd = b.newDay;
      const metric = s.wx === 'wind' ? 'm/s' : s.wx === 'wave' ? 'm' : '';
      const vals = days.map((_, i) => wxOf(s.id, i));
      const vmax = Math.max(...vals.map(v => v.v || 1));
      return backBar(L('Pranešimas dėl oro', 'Weather alert')) + `<div class="pad">
        <div class="a-h1" style="font-size:22px">${cap(b.dayTxt)}${EN ? ':' : ''} ${s.wx === 'wind' ? L('vėjas bus per silpnas', 'wind will be too light') : s.wx === 'wave' ? L('bangos bus per mažos', 'waves will be too small') : L('prognozuojama liūtis', 'heavy rain forecast')}</div>
        <p class="a-muted" style="margin-top:6px">${s.wx === 'none' ? L('Saugumui pamokos tą dieną nevyks.', 'For safety, there are no lessons that day.') : L('Prognozė atnaujinta: ', 'Forecast updated: ') + b.badLabel + L('. Pamokai reikia bent ', '. The lesson needs at least ') + (s.wx === 'wind' ? '6 m/s' : L('0,8 m', '0.8 m')) + '.'}</p>
        ${s.wx !== 'none' ? `<div class="a-card" style="margin-top:14px;padding-bottom:8px"><div class="wxchart">${vals.map((v, i) => `<div><span>${EN ? String(v.v) : String(v.v).replace('.',',')}</span><i style="height:${Math.max(6, v.v/vmax*52)}px;background:${i===b.day?'#9AA6AE':i===nd?'#FF5A36':'#BFE3E1'}"></i>${DN[days[i].getDay()]}</div>`).join('')}</div><p class="a-muted" style="padding:6px 12px 0;font-size:12px">${s.wx==='wind'?L('Vėjas', 'Wind'):L('Bangos', 'Waves')}, ${metric}. ${L('Pilka – tavo diena, oranžinė – siūloma.', 'Grey is your day, orange is the suggestion.')}</p></div>` : ''}
        <div class="a-card" style="padding:14px;margin-top:12px;border-color:#FF5A36;box-shadow:0 0 0 1.5px #FF5A36 inset"><div class="a-muted" style="font-size:12px;font-weight:700">${L('SIŪLOMAS LAIKAS', 'SUGGESTED TIME')}</div><b style="font-size:17px">${cap(DACC[days[nd].getDay()])}, ${b.time}</b><div class="a-muted">${wxOf(s.id, nd).label} · ${s.wx==='none'?L('giedra', 'clear'):L('tinka pamokai', 'good for the lesson')}</div></div>
        <div style="display:grid;gap:9px;margin-top:14px">
          <button class="a-btn" data-a="accept">${L('Priimti siūlomą laiką', 'Accept suggested time')}</button>
          <button class="a-btn sec" data-a="otherTime">${L('Pasirinkti kitą laiką', 'Pick another time')}</button>
          <button class="a-btn sec" data-a="refund">${L('Atgauti pinigus', 'Get a refund')}</button>
        </div>
      </div>`;
    },
    bookings() {
      return `<div class="pad"><div class="a-h1">${L('Mano užsakymai', 'My bookings')}</div>
        ${S.bookings.length ? '<div style="margin-top:16px">' + S.bookings.slice().reverse().map(b => {
          const s = sp(b.sport), p = PROVIDERS[s.id][b.prov];
          const st = b.status==='ok'?['ok',L('Patvirtinta', 'Confirmed')]:b.status==='moved'?['moved',L('Perkelta', 'Moved')]:b.status==='ref'?['ref',L('Pinigai grąžinti', 'Refunded')]:['moved',L('Laukia sprendimo', 'Needs your decision')];
          return `<div class="a-card bk"><div class="row"><b>${s.name}</b><span class="status ${st[0]}">${st[1]}</span></div><div class="a-muted">${esc(p.name)} · ${esc(p.place)}</div><div style="font-size:14px;margin-top:4px"><b>${cap(b.dayTxt)}, ${b.time}</b> · ${b.total} €</div>${b.status==='pending'?'<button class="a-btn" style="margin-top:10px;padding:10px" data-a="go" data-v="alert">' + L('Peržiūrėti pranešimą', 'View alert') + '</button>':''}</div>`;
        }).join('') + '</div>'
        : `<div class="empty"><p>${L('Dar neturi užsakymų.', 'No bookings yet.')}</p><button class="a-btn" style="margin-top:14px" data-a="sport" data-v="kaitavimas">${L('Rasti pamoką', 'Find a lesson')}</button></div>`}
        ${S.bookings.some(b=>b.status==='ok'||b.status==='moved')&&!S.bookings.some(b=>b.status==='pending')&&!S.alerted?'<button class="a-btn sec" style="margin-top:6px" data-a="simAlert">' + L('Imituoti orų pranešimą', 'Simulate a weather alert') + '</button>':''}
      </div>`;
    },
    progress() {
      const learned = EN ? ['Safety rules and the wind window','Kite control on land','Body dragging in the water'] : ['Saugumo taisyklės ir vėjo langas','Kaito valdymas sausumoje','Kūno tempimas vandenyje (body drag)'];
      return `<div class="pad"><div class="a-h1">${L('Mano progresas', 'My progress')}</div>
        <p class="a-muted" style="margin-top:4px">${L('Pavyzdys: taip atrodys po pirmos pamokos', 'Example: this is how it looks after your first lesson')}</p>
        <div class="a-card" style="padding:16px;margin-top:14px">
          <div class="row"><b style="font-size:16px">${L('Kaitavimas', 'Kitesurfing')}</b><span class="a-muted" style="font-family:var(--f-mono);font-size:12px">IKO</span></div>
          <div class="lvl">${[1,2,3,4].map(i=>`<i class="${i<=1?'on':''}"></i>`).join('')}</div>
          <div class="a-muted">${L('IKO 1 lygis iš 4 · Discovery', 'IKO level 1 of 4 · Discovery')}</div>
          <div class="a-h2" style="margin-top:14px;font-size:15px">${L('Jau išmokai', 'You\'ve learned')}</div>
          <ul class="list">${learned.map(l=>`<li>${l}</li>`).join('')}</ul>
          <div style="background:#F2F5F6;border-radius:12px;padding:10px 12px;margin-top:12px;font-size:13.5px"><b>${L('Instruktoriaus komentaras', 'Instructor\'s note')}</b><p style="color:#3D4A55;margin-top:2px">${L('Puikiai jauti kaitą. Kitą kartą bandysime vandens startą.', 'You have a great feel for the kite. Next time we will try a water start.')}</p></div>
        </div>
        <div class="a-card" style="padding:16px;margin-top:10px;border-color:#FF5A36;box-shadow:0 0 0 1.5px #FF5A36 inset">
          <div class="a-muted" style="font-size:12px;font-weight:700">${L('TAVO KITAS ŽINGSNIS', 'YOUR NEXT STEP')}</div>
          <b style="font-size:16px">${L('IKO 2 lygis (Intermediate): vandens startas ir plaukimas lenta', 'IKO level 2 (Intermediate): water start and riding the board')}</b>
          <p class="a-muted">${L('Rekomenduojamos 2 pamokos', '2 lessons recommended')}</p>
          <button class="a-btn" style="margin-top:10px" data-a="prov" data-s="kaitavimas" data-v="0">${L('2 pamokų paketas – 160 €', '2-lesson pack – €160')}</button>
        </div>
        <div class="a-h2">${L('Išbandyk ir kitas veiklas', 'Try other activities too')}</div>
        <div class="sport-grid">${['banglentes','vandenlentes'].map(id=>`<button class="sport" style="background:${sp(id).g}" data-a="sport" data-v="${id}">${ic(sp(id).ic,70)}${sp(id).name}</button>`).join('')}</div>
      </div>`;
    },
    community() {
      return `<div class="pad"><div class="a-h1">${L('Bendruomenė', 'Community')}</div>
        <p class="a-muted" style="margin:4px 0 14px">${L('Dalinkis savo akimirkomis ir įkvėpk kitus', 'Share your moments and inspire others')}</p>
        <label class="upload" for="vidUp"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 16V4M6 10l6-6 6 6M4 20h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>${L('Įkelti savo video', 'Upload your video')}</label>
        <input type="file" id="vidUp" accept="video/*" hidden>
        <div class="feed" style="margin-top:14px">${S.videos.map((v, i) => `<article class="a-card post">
          <div class="media" style="background:${v.g||'#0E1B2C'}">${v.src?`<video src="${esc(v.src)}" muted loop playsinline autoplay controls preload="metadata"></video>`:`<div class="ph"><span class="play"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff"/></svg></span><b style="font-size:15px">${esc(v.sport)} · ${esc(v.place)}</b><span style="opacity:.8">${L('Vaizdo įrašas netrukus', 'Video coming soon')}</span></div>`}</div>
          <div class="meta"><div class="row"><div class="who"><span class="avatar" style="background:${v.col}">${esc(v.ini)}</span><span><b>${esc(v.who)}</b><br><span class="a-muted" style="font-size:12px">${esc(v.sport)} · ${esc(v.place)}</span></span></div>
          <button class="like ${S.liked[i]?'on':''}" data-a="like" data-v="${i}" aria-label="${L('Patinka', 'Like')}"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="${S.liked[i]?'currentColor':'none'}" stroke="currentColor" stroke-width="2"/></svg>${v.likes+(S.liked[i]?1:0)}</button></div>
          <p style="font-size:14px">${esc(v.text)}</p></div></article>`).join('')}</div>
      </div>`;
    },
    gift() {
      const amts = [50,100,150,250];
      return backBar(L('Dovanų kuponas', 'Gift voucher')) + `<div class="pad">
        <div class="gift" style="margin-top:0;cursor:default"><span style="font-size:12px;font-weight:700;opacity:.85">${L('ADRENA DOVANŲ KUPONAS', 'ADRENA GIFT VOUCHER')}</span><b style="font-size:30px;margin-top:6px">${S.gift.amt} €</b><span style="font-size:13px">${L('Galioja 12 mėnesių visoms veikloms', 'Valid for 12 months on every activity')}</span></div>
        <div class="a-h2">${L('Suma', 'Amount')}</div>
        <div class="chips">${amts.map(a=>`<button class="chip ${S.gift.amt===a?'on':''}" data-a="amt" data-v="${a}">${a} €</button>`).join('')}</div>
        <div class="field" style="margin-top:16px"><label for="g-to">${L('Kam dovanoji?', 'Who\'s it for?')}</label><input id="g-to" placeholder="${L('Gavėjo vardas', 'Their name')}" maxlength="24" autocomplete="off"></div>
        <div class="field"><label for="g-msg">${L('Sveikinimas', 'Message')}</label><textarea id="g-msg" placeholder="${L('Su gimtadieniu! Laikas išmokti kaituoti.', 'Happy birthday! Time to learn to kite.')}"></textarea></div>
      </div>
      <div class="sticky-b"><button class="a-btn" data-a="giftDo">${L('Pirkti kuponą (demo)', 'Buy voucher (demo)')}</button></div>`;
    },
    giftOk() {
      return `<div class="pad" style="text-align:center;padding-top:40px">
        <div class="okmark"><svg width="38" height="38" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#178A55" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="a-h1" style="font-size:24px">${L('Kuponas paruoštas!', 'Voucher ready!')}</div>
        <p class="a-muted" style="margin:8px 0 22px">${EN ? (S.gift.to ? esc(S.gift.to) : 'They') + ' will get a €' + S.gift.amt + ' voucher by email and can choose the activity, instructor and time.' : (S.gift.to ? esc(S.gift.to) + ' gaus' : 'Gavėjas gaus') + ' ' + S.gift.amt + ' € kuponą el. paštu ir galės išsirinkti veiklą, instruktorių bei laiką.'}</p>
        <button class="a-btn" data-a="tab" data-v="home">${L('Į pradžią', 'Back to start')}</button>
      </div>`;
    },
  };

  /* ---- Tabs ---- */
  const TABS = [
    ['home',      L('Atrask', 'Discover'),      '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
    ['bookings',  L('Užsakymai', 'Bookings'),   '<rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
    ['community', L('Bendruomenė', 'Community'), '<rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9v6l5-3z" fill="currentColor"/>'],
    ['progress',  L('Progresas', 'Progress'),   '<path d="M4 19 10 12l4 4 6-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
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
      S.videos.unshift({src:url, who:S.user?S.user.name:L('Tu', 'You'), ini:(S.user?S.user.name:'T').charAt(0).toUpperCase(), col:'#0FA3A0', sport:L('Mano klipas', 'My clip'), place:L('Ką tik', 'Just now'), text:L('Mano naujausias klipas', 'My latest clip'), likes:0, g:'#0E1B2C'});
      S.liked = Object.fromEntries(Object.entries(S.liked).map(([k,v])=>[+k+1,v]));
      render(true); toastFn(L('Įkelta! Matoma tik tavo naršyklėje', 'Uploaded! Only visible in your browser'));
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
    b.badLabel=s.wx==='wind'?L('tik 3 m/s', 'only 3 m/s'):s.wx==='wave'?L('tik 0,3 m', 'only 0.3 m'):L('liūtis', 'downpour');
    S.alerted=true;
    const push=$('#push');
    push.innerHTML=`<span class="ic"><svg width="24" height="24" viewBox="8 8 84 84"><path d="M18 84 L50 16 L82 84" fill="none" stroke="#FF8A3D" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 64 C27 52 39 52 50 62 S73 72 84 58" fill="none" stroke="#0FA3A0" stroke-width="9" stroke-linecap="round"/></svg></span><span><b>Adrena · ${L('dabar', 'now')}</b><p>${cap(b.dayTxt)}${EN ? ':' : ''} ${s.wx==='wind'?L('nepakankamas vėjas', 'not enough wind'):s.wx==='wave'?L('per mažos bangos', 'waves too small'):L('prognozuojama liūtis', 'heavy rain forecast')}. ${L('Siūlome', 'We suggest')} ${DACC[days[b.newDay].getDay()]} ${b.time}.</p></span>`;
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
        if (!name){ toastFn(L('Įrašyk vardą', 'Enter your name')); $('#su-name').focus(); return; }
        if (!$('#su-ok').checked){ toastFn(L('Pažymėk sutikimą su sąlygomis', 'Please accept the terms')); return; }
        S.user={name,city:$('#su-city').value}; tab('home'); toastFn(L('Sveiki atvykę, ', 'Welcome, ')+name+'!'); break;
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
        el.disabled=true; el.textContent=L('Apdorojama…', 'Processing…');
        setTimeout(()=>{ makeBooking(); S.stack=['bookings','confirm']; render(true); clearTimeout(S.pushTimer); S.pushTimer=setTimeout(()=>{ if(!S.alerted)triggerAlert(); },6000); },900);
        break;
      }
      case 'cal':      toastFn(L('Demo: pamoka pridėta į kalendorių', 'Demo: lesson added to your calendar')); break;
      case 'simAlert': triggerAlert(); break;
      case 'accept': { const b=activeBooking(); b.day=b.newDay; b.dayTxt=DACC[days[b.day].getDay()]; b.status='moved'; tab('bookings'); toastFn(L('Pamoka perkelta į ', 'Lesson moved to ')+b.dayTxt); break; }
      case 'otherTime':{ const b=activeBooking(); S.resched=S.bookings.indexOf(b); S.sport=b.sport; S.prov=b.prov; S.offer=b.offer; S.day=null; S.time=null; go('booking'); break; }
      case 'reschedDo':{ const b=S.bookings[S.resched]; b.day=S.day; b.time=S.time; b.dayTxt=DACC[days[S.day].getDay()]; b.status='moved'; S.resched=null; tab('bookings'); toastFn(L('Naujas laikas patvirtintas', 'New time confirmed')); break; }
      case 'refund':   { const b=activeBooking(); b.status='ref'; tab('bookings'); toastFn(EN ? 'We will refund €'+b.total+' within 1–3 working days' : b.total+' € grąžinsime per 1–3 d. d.'); break; }
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
