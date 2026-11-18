/* forecast.js — Vėjo prognozė page logic (vejas.html only) */
(function () {
  'use strict';

  /* ---- Utilities ---- */
  const VILNIUS = 'Europe/Vilnius';

  function toMs(utcStr) {
    return new Date(utcStr.endsWith('Z') ? utcStr : utcStr + 'Z').getTime();
  }

  function toVilnius(utcStr, opts) {
    return new Intl.DateTimeFormat('lt-LT', Object.assign({ timeZone: VILNIUS }, opts))
      .format(new Date(utcStr.endsWith('Z') ? utcStr : utcStr + 'Z'));
  }

  function hourStr(utcStr) {
    return toVilnius(utcStr, { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function dayKey(utcStr) {
    return toVilnius(utcStr, { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  function dayLabel(utcStr) {
    return toVilnius(utcStr, { weekday: 'short', day: 'numeric', month: 'numeric' });
  }

  function isNightHour(utcStr) {
    const h = parseInt(toVilnius(utcStr, { hour: '2-digit', hour12: false }), 10);
    return h < 6 || h >= 22;
  }

  function isDaylight(utcStr) {
    const h = parseInt(toVilnius(utcStr, { hour: '2-digit', hour12: false }), 10);
    return h >= 6 && h < 21;
  }

  const DIR_LT = ['Š', 'ŠR', 'R', 'PR', 'P', 'PV', 'V', 'ŠV'];
  function dirLabel(deg) {
    if (deg == null) return '—';
    return DIR_LT[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
  }

  function arrowSvg(fromDeg, label) {
    if (fromDeg == null) return '<span>—</span>';
    const rot = ((fromDeg + 180) % 360);
    return `<svg width="14" height="14" viewBox="0 0 24 24" aria-label="${label || dirLabel(fromDeg)}" title="${Math.round(fromDeg)}°" style="transform:rotate(${rot}deg);display:inline-block;vertical-align:middle;flex:none"><path d="M12 3l5 9H7z" fill="currentColor"/></svg>`;
  }

  const COND_ICONS = {
    'clear': '☀',
    'mostly-clear': '🌤',
    'partly-cloudy': '⛅',
    'cloudy-with-sunny-intervals': '⛅',
    'overcast': '☁',
    'cloudy': '☁',
    'light-drizzle': '🌦',
    'drizzle': '🌦',
    'light-rain': '🌧',
    'moderate-rain': '🌧',
    'rain': '🌧',
    'heavy-rain': '🌧',
    'sleet': '🌨',
    'light-snow': '❄',
    'snow': '❄',
    'heavy-snow': '❄',
    'thunderstorm': '⛈',
    'fog': '🌫',
    'mist': '🌫',
  };
  function condIcon(code) {
    if (!code) return '—';
    return COND_ICONS[code] || '◌';
  }

  /* ---- Unit conversion ---- */
  const UNITS = { 'ms': 1, 'kn': 1.944, 'kmh': 3.6 };
  const UNIT_LABEL = { 'ms': 'm/s', 'kn': 'kn', 'kmh': 'km/h' };

  function cvt(ms, unit) {
    if (ms == null) return null;
    return Math.round(ms * (UNITS[unit] || 1) * 10) / 10;
  }
  function cvtStr(ms, unit) {
    const v = cvt(ms, unit);
    return v != null ? String(v) : '—';
  }

  /* ---- State ---- */
  const S = {
    spotId:  SPOTS[0].id,
    sportId: 'kaitavimas_prad',
    unit:    'ms',
    data:    null,
    fetchedAt: null,
    loading: false,
  };

  /* ---- Prefs ---- */
  function savePrefs() {
    try { localStorage.setItem('adrena-wx-spot', S.spotId); localStorage.setItem('adrena-wx-sport', S.sportId); localStorage.setItem('adrena-wx-unit', S.unit); } catch (e) {}
  }
  function loadPrefs() {
    try {
      S.spotId  = localStorage.getItem('adrena-wx-spot')  || SPOTS[0].id;
      S.sportId = localStorage.getItem('adrena-wx-sport') || 'kaitavimas_prad';
      S.unit    = localStorage.getItem('adrena-wx-unit')  || 'ms';
    } catch (e) {}
  }
  function applyUrlParams() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('vieta'))   S.spotId  = p.get('vieta');
    if (p.get('sportas')) S.sportId = p.get('sportas');
  }

  /* ---- Data fetching ---- */
  const BASE = window.location.protocol === 'file:' ? null : '';
  const dataCache = {};

  function fetchData(spotId) {
    if (BASE === null) return Promise.reject(new Error('Atidaryti serverį su npm start'));
    if (dataCache[spotId] && Date.now() - dataCache[spotId].at < 30 * 60 * 1000) {
      return Promise.resolve(dataCache[spotId].data);
    }
    return fetch(BASE + '/api/weather?place=' + encodeURIComponent(spotId))
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) {
        dataCache[spotId] = { data: d, at: Date.now() };
        S.fetchedAt = new Date();
        return d;
      });
  }

  /* ---- Nearest slot index ---- */
  function nowSlotIdx(slots) {
    if (!slots || !slots.length) return 0;
    const now = Date.now();
    let best = 0, bestDiff = Infinity;
    slots.forEach(function (s, i) {
      const diff = Math.abs(toMs(s.time) - now);
      if (diff < bestDiff) { best = i; bestDiff = diff; }
    });
    return best;
  }

  /* ---- Render: "Dabar" summary card ---- */
  function renderNow(slots) {
    const idx = nowSlotIdx(slots);
    const s = slots[idx];
    if (!s) return '';
    const w = cvt(s.wind, S.unit), g = cvt(s.gust, S.unit), ul = UNIT_LABEL[S.unit];
    const v = verdict(S.sportId, s.wind, s.gust, s.windDir, S.spotId, s.cond);
    const reason = verdictReason(S.sportId, s.wind, s.gust, s.cond);
    const vLabels = { good: 'Tinka', warn: 'Ribinės sąlygos', bad: 'Netinka' };
    const temp = s.temp != null ? Math.round(s.temp) + '°C' : '';
    const feels = s.feels != null && Math.abs(s.feels - s.temp) >= 2 ? ` (jaučiasi ${Math.round(s.feels)}°)` : '';

    return `<div class="wx-now-card">
      <div class="wx-now-top">
        <div class="wx-now-wind">
          <span class="wx-now-val">${w != null ? w : '—'}</span>
          <span class="wx-now-unit">${ul}</span>
          ${s.gust ? `<span class="wx-now-gust">gūsiai ${g} ${ul}</span>` : ''}
        </div>
        <div class="wx-now-meta">
          ${arrowSvg(s.windDir, dirLabel(s.windDir))}
          <span class="wx-now-dir">${dirLabel(s.windDir)}</span>
          <span class="wx-now-cond">${condIcon(s.cond)}</span>
          <span class="wx-now-temp">${temp}${feels}</span>
        </div>
      </div>
      <div class="wx-verdict wx-verdict-${v}">
        <span class="wx-verdict-label">${vLabels[v]}</span>
        <span class="wx-verdict-reason">${reason}</span>
      </div>
    </div>`;
  }

  /* ---- Render: best windows ---- */
  function renderBestWindows(slots) {
    const windows = [];
    let cur = null;
    slots.forEach(function (s) {
      if (!isDaylight(s.time)) return;
      const v = verdict(S.sportId, s.wind, s.gust, s.windDir, S.spotId, s.cond);
      if (v === 'good') {
        if (!cur) cur = { start: s.time, end: s.time, wind: [s.wind], count: 1 };
        else { cur.end = s.time; cur.wind.push(s.wind); cur.count++; }
      } else {
        if (cur && cur.count >= 2) windows.push(cur);
        cur = null;
      }
    });
    if (cur && cur.count >= 2) windows.push(cur);

    // Only show future windows
    const now = Date.now();
    const future = windows.filter(function (w) { return toMs(w.end) > now; }).slice(0, 3);

    if (!future.length) {
      return `<div class="wx-best"><div class="wx-best-title">Geriausias laikas</div><p class="wx-best-none">Artimiausiu metu tinkamų sąlygų nerasta.</p></div>`;
    }

    const rows = future.map(function (w) {
      const wMin = Math.min(...w.wind).toFixed(1), wMax = Math.max(...w.wind).toFixed(1);
      const wCvt = m => cvt(m, S.unit), ul = UNIT_LABEL[S.unit];
      return `<div class="wx-best-row">
        <span class="wx-best-day">${dayLabel(w.start)}</span>
        <span class="wx-best-time">${hourStr(w.start)}–${hourStr(w.end)}</span>
        <span class="wx good">${cvt(parseFloat(wMin), S.unit)}–${cvt(parseFloat(wMax), S.unit)} ${ul}</span>
      </div>`;
    }).join('');

    return `<div class="wx-best">
      <div class="wx-best-title">Geriausias laikas artimiausiu metu</div>
      ${rows}
    </div>`;
  }

  /* ---- Render: forecast table ---- */
  function renderTable(slots) {
    // Group by day key (Vilnius)
    const days = {}, dayOrder = [];
    slots.forEach(function (s, i) {
      const dk = dayKey(s.time);
      if (!days[dk]) { days[dk] = []; dayOrder.push(dk); }
      days[dk].push({ s, i });
    });

    const nowIdx = nowSlotIdx(slots);
    const ul = UNIT_LABEL[S.unit];

    // Day header row
    let dayHdr = '<tr class="fc-row-day"><th class="fc-label fc-label-sticky" scope="col"></th>';
    dayOrder.forEach(function (dk) {
      const first = days[dk][0];
      dayHdr += `<th class="fc-day-head" colspan="${days[dk].length}" scope="colgroup">${dayLabel(first.s.time)}</th>`;
    });
    dayHdr += '</tr>';

    // Time row
    let timeRow = `<tr class="fc-row-time"><th class="fc-label fc-label-sticky" scope="row">Laikas</th>`;
    slots.forEach(function (s, i) {
      const cls = ['fc-cell', i === nowIdx ? 'is-now' : '', isNightHour(s.time) ? 'is-night' : ''].filter(Boolean).join(' ');
      // Add day-start border
      const dk = dayKey(s.time);
      const isFirst = days[dk][0].i === i;
      const style = isFirst && i > 0 ? ' style="border-left:2px solid var(--line)"' : '';
      timeRow += `<td class="${cls}"${style}>${hourStr(s.time)}</td>`;
    });
    timeRow += '</tr>';

    function dataRow(label, fn, extraClass) {
      let row = `<tr class="${extraClass || ''}"><th class="fc-label fc-label-sticky" scope="row">${label}</th>`;
      slots.forEach(function (s, i) {
        const { html, style } = fn(s, i);
        const dk = dayKey(s.time);
        const isFirst = days[dk][0].i === i && i > 0;
        const cls = ['fc-cell', i === nowIdx ? 'is-now' : '', isNightHour(s.time) ? 'is-night' : ''].filter(Boolean).join(' ');
        const borderStyle = isFirst ? 'border-left:2px solid var(--line);' : '';
        row += `<td class="${cls}" style="${borderStyle}${style || ''}">${html}</td>`;
      });
      return row + '</tr>';
    }

    const windRow = dataRow(`Vėjas ${ul}`, function (s) {
      const v = cvt(s.wind, S.unit), st = windCellStyle(s.wind);
      return { html: v != null ? String(v) : '—', style: `background:${st.bg};color:${st.text};font-weight:700` };
    }, 'fc-row-wind');

    const gustRow = dataRow(`Gūsiai ${ul}`, function (s) {
      const v = cvt(s.gust, S.unit), st = windCellStyle(s.gust);
      return { html: v != null ? String(v) : '—', style: `background:${st.bg};color:${st.text}` };
    }, 'fc-row-gust');

    const dirRow = dataRow('Kryptis', function (s) {
      return { html: arrowSvg(s.windDir, dirLabel(s.windDir)) + `<span class="fc-dir-lbl">${dirLabel(s.windDir)}</span>` };
    });

    const tempRow = dataRow('Temp °C', function (s) {
      return { html: s.temp != null ? Math.round(s.temp) + '°' : '—' };
    });

    const cloudRow = dataRow('Debesys', function (s) {
      return { html: s.cloud != null ? s.cloud + '%' : '—' };
    });

    const precipRow = dataRow('Krituliai mm', function (s) {
      const v = s.precip != null ? s.precip.toFixed(1) : '—';
      const style = s.precip > 0.5 ? 'color:#1565C0;font-weight:600' : '';
      return { html: v, style };
    });

    const condRow = dataRow('Sąlygos', function (s) {
      return { html: `<span title="${s.cond || ''}">${condIcon(s.cond)}</span>` };
    });

    const suitRow = dataRow('Tinkamas', function (s) {
      const v = verdict(S.sportId, s.wind, s.gust, s.windDir, S.spotId, s.cond);
      const sym = { good: '■', warn: '⚠', bad: '✕' };
      return { html: `<span class="fc-suit wx ${v}">${sym[v]}</span>`, style: '' };
    }, 'fc-row-suit');

    return `<div class="fc-wrap" role="region" aria-label="Orų prognozės lentelė" tabindex="0">
      <table class="fc-table" aria-rowcount="${9}">
        <thead>${dayHdr}${timeRow}</thead>
        <tbody>${windRow}${gustRow}${dirRow}${tempRow}${cloudRow}${precipRow}${condRow}${suitRow}</tbody>
      </table>
    </div>`;
  }

  /* ---- Render: wind chart ---- */
  function renderChart(slots) {
    if (!slots || slots.length < 2) return '';
    const sport = SPORTS[S.sportId];
    const W = Math.max(slots.length * 22, 300);
    const H = 150;
    const PL = 32, PR = 8, PT = 14, PB = 24;
    const CW = W - PL - PR, CH = H - PT - PB;

    const winds = slots.map(s => cvt(s.wind, S.unit) || 0);
    const gusts = slots.map(s => cvt(s.gust, S.unit) || cvt(s.wind, S.unit) || 0);
    const maxV = Math.ceil(Math.max(...gusts) + 2);
    const minV = 0;

    function xOf(i) { return PL + (i / (slots.length - 1)) * CW; }
    function yOf(v) { return PT + (1 - (v - minV) / (maxV - minV)) * CH; }

    const goodMin = cvt(sport.wind.good[0], S.unit);
    const goodMax = cvt(sport.wind.good[1], S.unit);
    const bandY1 = yOf(Math.min(goodMax, maxV));
    const bandY2 = yOf(Math.max(goodMin, minV));

    const windPts = slots.map((_, i) => `${i ? 'L' : 'M'}${xOf(i).toFixed(1)},${yOf(winds[i]).toFixed(1)}`).join('');
    const areaPath = windPts + ` L${xOf(slots.length - 1).toFixed(1)},${(PT + CH).toFixed(1)} L${PL},${(PT + CH).toFixed(1)} Z`;
    const gustPts  = slots.map((_, i) => `${i ? 'L' : 'M'}${xOf(i).toFixed(1)},${yOf(gusts[i]).toFixed(1)}`).join('');

    const nowIdx = nowSlotIdx(slots);
    const nowX = xOf(nowIdx).toFixed(1);

    // Y-axis ticks every 5 units
    let yTicks = '';
    for (let v = 0; v <= maxV; v += 5) {
      const y = yOf(v);
      yTicks += `<text x="${PL - 4}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" font-size="9" fill="currentColor" opacity=".55">${v}</text>`;
      yTicks += `<line x1="${PL}" y1="${y.toFixed(1)}" x2="${PL + CW}" y2="${y.toFixed(1)}" stroke="currentColor" opacity=".06"/>`;
    }

    // Day separator lines
    let dayLines = '';
    const daysSeen = new Set();
    slots.forEach(function (s, i) {
      const dk = dayKey(s.time);
      if (!daysSeen.has(dk) && i > 0) {
        const x = xOf(i).toFixed(1);
        dayLines += `<line x1="${x}" y1="${PT}" x2="${x}" y2="${PT + CH}" stroke="currentColor" opacity=".2"/>`;
      }
      daysSeen.add(dk);
    });

    return `<div class="wx-chart-outer">
      <div class="wx-chart-wrap">
        <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;overflow:visible" aria-label="Vėjo diagrama">
          ${yTicks}
          <rect x="${PL}" y="${bandY1.toFixed(1)}" width="${CW}" height="${Math.max(0, bandY2 - bandY1).toFixed(1)}" fill="#0FA3A0" opacity=".12" rx="2"/>
          ${dayLines}
          <line x1="${PL}" y1="${PT}" x2="${PL}" y2="${PT + CH}" stroke="currentColor" opacity=".2"/>
          <line x1="${PL}" y1="${PT + CH}" x2="${PL + CW}" y2="${PT + CH}" stroke="currentColor" opacity=".2"/>
          <path d="${areaPath}" fill="#0FA3A0" opacity=".18"/>
          <path d="${windPts}" fill="none" stroke="#0FA3A0" stroke-width="2" stroke-linejoin="round"/>
          <path d="${gustPts}" fill="none" stroke="#FF8A3D" stroke-width="1.5" stroke-dasharray="4 3" stroke-linejoin="round"/>
          <line x1="${nowX}" y1="${PT}" x2="${nowX}" y2="${PT + CH}" stroke="#FF5A36" stroke-width="1.5" stroke-dasharray="3 3" opacity=".8"/>
        </svg>
      </div>
      <div class="wx-chart-legend">
        <span><svg width="16" height="4" style="vertical-align:middle"><rect y="1" width="16" height="2" rx="1" fill="#0FA3A0"/></svg> Vėjas</span>
        <span><svg width="16" height="4" style="vertical-align:middle"><line x1="0" y1="2" x2="16" y2="2" stroke="#FF8A3D" stroke-width="2" stroke-dasharray="4 3"/></svg> Gūsiai</span>
        <span><svg width="16" height="8" style="vertical-align:middle"><rect y="1" width="16" height="6" rx="1" fill="#0FA3A0" opacity=".2"/></svg> Tinkamas diapazonas</span>
        <span><svg width="10" height="10" style="vertical-align:middle"><line x1="5" y1="0" x2="5" y2="10" stroke="#FF5A36" stroke-width="1.5" stroke-dasharray="3 3"/></svg> Dabar</span>
      </div>
    </div>`;
  }

  /* ---- Render: legend ---- */
  function renderLegend() {
    const sport = SPORTS[S.sportId];
    if (!sport) return '';
    const ul = UNIT_LABEL[S.unit];
    const w = sport.wind;
    const good0 = cvt(w.good[0], S.unit), good1 = cvt(w.good[1], S.unit);
    const warn0 = w.warnLow ? cvt(w.warnLow[0], S.unit) : null;
    const warn1 = w.warnHigh ? cvt(w.warnHigh[1], S.unit) : null;

    let sportRule = `${sport.name}: `;
    if (warn0 != null) sportRule += `${warn0}–${good0} ${ul} ribinės, `;
    sportRule += `${good0}–${good1} ${ul} tinkama, `;
    if (warn1 != null) sportRule += `${good1}–${warn1} ${ul} ribinės, `;
    sportRule += `virš ${warn1 || good1} ${ul} netinka`;
    if (sport.maxGustDelta) sportRule += `. Gūsiai >vėjas+${cvt(sport.maxGustDelta, S.unit)} ${ul} → ribinės`;
    if (sport.noThunder) sportRule += '. Perkūnija – netinka';
    if (sport.noOffshore) sportRule += '. Atlandinis vėjas – netinka';

    return `<div class="wx-legend">
      <div class="wx-legend-verdicts">
        <span class="wx good">■ Tinka</span>
        <span class="wx warn">⚠ Ribinės sąlygos</span>
        <span class="wx bad">✕ Netinka</span>
      </div>
      <div class="wx-legend-scale">
        ${WIND_SCALE.map(s => `<span style="background:${s.bg};color:${s.text}">${s.max < 999 ? '&lt;'+s.max : '18+'}</span>`).join('')}
        <span class="wx-legend-unit">${ul}</span>
      </div>
      <p class="wx-legend-rule">${sportRule}.</p>
      <p class="wx-safety">⚠ Prognozės gali keistis. Visada patikrink sąlygas vietoje ir su instruktoriumi. Niekada nesportuok atlandiniam vėjui ar perkūnijai.</p>
    </div>`;
  }

  /* ---- Full render cycle ---- */
  function render() {
    const $ = s => document.querySelector(s);
    const slots = S.data && S.data.slots;

    if (S.loading) {
      ['#wx-now', '#wx-best', '#wx-table', '#wx-chart', '#wx-legend'].forEach(function (id) {
        const el = $(id);
        if (el) el.innerHTML = `<div class="wx-skeleton"></div>`;
      });
      return;
    }

    if (!slots || !slots.length) {
      const msg = `<p class="wx-err-msg">Prognozė šiuo metu nepasiekiama. Bandyk vėliau.</p>`;
      ['#wx-now', '#wx-best'].forEach(id => { const el = $(id); if (el) el.innerHTML = msg; });
      $('#wx-table') && ($('#wx-table').innerHTML = '');
      $('#wx-chart') && ($('#wx-chart').innerHTML = '');
      return;
    }

    const nowEl = $('#wx-now'); if (nowEl) nowEl.innerHTML = renderNow(slots);
    const bestEl = $('#wx-best'); if (bestEl) bestEl.innerHTML = renderBestWindows(slots);
    const tableEl = $('#wx-table'); if (tableEl) tableEl.innerHTML = renderTable(slots);
    const chartEl = $('#wx-chart'); if (chartEl) chartEl.innerHTML = renderChart(slots);
    const legendEl = $('#wx-legend'); if (legendEl) legendEl.innerHTML = renderLegend();

    // Updated timestamp
    const updEl = $('#wx-updated');
    if (updEl && S.fetchedAt) {
      const h = S.fetchedAt.getHours(), m = S.fetchedAt.getMinutes();
      updEl.textContent = 'Atnaujinta ' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
    }
  }

  /* ---- Load and render ---- */
  function load() {
    S.loading = true;
    render();
    fetchData(S.spotId).then(function (data) {
      S.data = data;
      S.loading = false;
      render();
    }).catch(function () {
      S.data = null;
      S.loading = false;
      render();
    });
  }

  /* ---- UI setup ---- */
  function setupSpotTabs() {
    const wrap = document.getElementById('spot-tabs');
    if (!wrap) return;
    wrap.innerHTML = SPOTS.map(function (sp) {
      return `<button class="spot-tab${sp.id === S.spotId ? ' on' : ''}" data-spot="${sp.id}">
        <span class="spot-tab-name">${sp.name}</span>
        <span class="spot-tab-desc">${sp.desc}</span>
      </button>`;
    }).join('');
    wrap.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-spot]');
      if (!btn) return;
      S.spotId = btn.dataset.spot;
      wrap.querySelectorAll('.spot-tab').forEach(b => b.classList.toggle('on', b.dataset.spot === S.spotId));
      savePrefs();
      load();
    });
  }

  function setupControls() {
    const sportSel = document.getElementById('sport-select');
    if (sportSel) {
      sportSel.innerHTML = Object.entries(SPORTS).map(([k, v]) =>
        `<option value="${k}"${k === S.sportId ? ' selected' : ''}>${v.name}</option>`
      ).join('');
      sportSel.addEventListener('change', function () {
        S.sportId = sportSel.value;
        savePrefs();
        render(); // no refetch needed
      });
    }

    document.querySelectorAll('[data-unit]').forEach(function (btn) {
      btn.classList.toggle('on', btn.dataset.unit === S.unit);
      btn.addEventListener('click', function () {
        S.unit = btn.dataset.unit;
        document.querySelectorAll('[data-unit]').forEach(b => b.classList.toggle('on', b.dataset.unit === S.unit));
        savePrefs();
        render();
      });
    });

    const refreshBtn = document.getElementById('wx-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        delete dataCache[S.spotId];
        load();
      });
    }
  }

  /* ---- Hero mini card for index.html ---- */
  function initHeroCard() {
    const card = document.getElementById('hero-cond-live');
    if (!card || BASE === null) return;
    card.innerHTML = '<span class="cond-loading">Orai kraunami…</span>';
    fetchData('svencele').then(function (data) {
      if (!data || !data.slots || !data.slots.length) throw new Error('no data');
      const slots = data.slots;
      const nowIdx = nowSlotIdx(slots);
      const s = slots[nowIdx];
      const w = s.wind != null ? s.wind.toFixed(1) : '—';
      const g = s.gust != null ? s.gust.toFixed(1) : null;
      const v = verdict('kaitavimas_prad', s.wind, s.gust, s.windDir, 'svencele', s.cond);
      const pct = s.wind != null ? Math.min(100, (s.wind / 15) * 100) : 50;
      card.innerHTML = `
        <div class="cond-top">
          <div><div class="cond-place">Svencelė · Kuršių marios</div>${hourStr(s.time)} · kaitavimas</div>
          <a href="vejas.html?vieta=svencele&sportas=kaitavimas_prad" class="cond-tag" style="color:inherit;text-decoration:none">Plačiau →</a>
        </div>
        <div class="cond-big">
          <b>${w}</b>
          <span>m/s${g ? ` · gūsiai ${g}` : ''}<br>${arrowSvg(s.windDir, dirLabel(s.windDir))} ${dirLabel(s.windDir)}</span>
        </div>
        <div class="meter" aria-hidden="true">
          <div class="meter-bar"><div class="meter-ok"></div><div class="meter-dot" style="left:${pct.toFixed(0)}%"></div></div>
          <div class="meter-scale"><span>0</span><span>6–10 m/s tinka pradedantiesiems</span><span>15</span></div>
        </div>
        <div class="cond-status">
          <span>${s.temp != null ? Math.round(s.temp) + '°C · ' : ''}${condIcon(s.cond)}</span>
          <span class="pill-ok wx ${v}" style="border-radius:99px;padding:5px 11px;font-size:13.5px">${{good:'Tinka',warn:'Ribinės',bad:'Netinka'}[v]}</span>
        </div>`;
    }).catch(function () {
      card.innerHTML = '<div class="cond-status" style="justify-content:center;padding:16px 0;color:var(--band-muted)">Prognozė šiuo metu nepasiekiama</div>';
    });
  }

  /* ---- Init ---- */
  function init() {
    // Hero card (index.html)
    if (document.getElementById('hero-cond-live')) { initHeroCard(); return; }

    // Forecast page (vejas.html)
    loadPrefs();
    applyUrlParams();
    setupSpotTabs();
    setupControls();
    load();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
