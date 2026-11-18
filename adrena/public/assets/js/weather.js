/* weather.js — live weather widgets via /api/weather proxy */
(function () {
  'use strict';

  /* ---- Sport colour rules (mirror demo.js) ---- */
  function wxClass(sport, wind, cond) {
    if (sport === 'kaitavimas' || sport === 'parasparnis') {
      if (wind < 5) return 'bad';
      if (wind < 6 || wind > 10) return 'warn';
      return 'good';
    }
    if (sport === 'banglentes') {
      // wave sport — cond code drives quality; we approximate from wind
      if (wind < 2) return 'bad';
      if (wind < 4) return 'warn';
      return 'good';
    }
    // All others: thunderstorm / heavy rain = bad
    if (cond && /thunder|storm|thunder|heavy-rain/i.test(cond)) return 'bad';
    return 'good';
  }

  const WX_LABEL_LT = { good: 'Tinka', warn: 'Ribinės', bad: 'Netinka' };
  const WX_LABEL_EN = { good: 'Good',  warn: 'Marginal', bad: 'Poor'   };

  var isEN = document.documentElement.lang === 'en';
  var WX_LABEL = isEN ? WX_LABEL_EN : WX_LABEL_LT;

  var PLACE_NAMES = {
    'svencele':         isEN ? 'Svencelė (Curonian Lagoon)' : 'Svencelė (Kuršių marios)',
    'neringa-nida':     'Nida',
    'neringa-pervalka': 'Pervalka',
    'klaipeda':         isEN ? 'Klaipėda / Melnragė' : 'Klaipėda / Melnragė',
    'kauno-marios':     isEN ? 'Kaunas reservoir' : 'Kauno marios',
    'palanga':          'Palanga',
  };

  var STRIP_PLACES = ['svencele', 'neringa-nida', 'klaipeda'];

  /* ---- API helpers ---- */
  var BASE = (function () {
    if (window.location.protocol === 'file:') return null;
    var inEN = window.location.pathname.replace(/\\/g, '/').indexOf('/en/') !== -1;
    return inEN ? '..' : '';
  })();

  function fetchWeather(place) {
    if (BASE === null) return Promise.reject(new Error('no-server'));
    return fetch(BASE + '/api/weather?place=' + encodeURIComponent(place))
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
  }

  /* Nearest slot to now (look back up to 3 h) */
  function currentSlot(slots) {
    if (!slots || !slots.length) return null;
    var now = Date.now();
    var best = null, bestDiff = Infinity;
    slots.forEach(function (s) {
      var t = new Date(s.time.endsWith('Z') ? s.time : s.time + 'Z').getTime();
      var diff = Math.abs(t - now);
      if (diff < bestDiff && t >= now - 3 * 3600 * 1000) { best = s; bestDiff = diff; }
    });
    return best || slots[0];
  }

  /* ---- Direction arrow (meteorological: FROM which wind blows) ---- */
  function dirArrow(deg) {
    if (deg == null) return '';
    return '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate(' + deg + 'deg);flex:none">' +
      '<path d="M12 3l5 10H7z" fill="currentColor"/>' +
      '</svg>';
  }

  /* ---- Render one strip card ---- */
  function renderCard(place, slot) {
    var cls  = wxClass('kaitavimas', slot.wind, slot.cond);
    var name = PLACE_NAMES[place] || place;
    var wind = slot.wind != null ? slot.wind.toFixed(1) : '—';
    var gust = slot.gust != null ? slot.gust.toFixed(1) : null;
    var temp = slot.temp != null ? Math.round(slot.temp) + '°C' : '';
    return '<div class="wx-spot">' +
      '<span class="wx-spot-name">' + name + '</span>' +
      '<span class="wx-spot-wind">' +
        dirArrow(slot.windDir) +
        '<b class="wx-spot-val">' + wind + '</b>' +
        '<span class="wx-spot-unit">m/s</span>' +
        (gust ? '<span class="wx-spot-gust">↑' + gust + '</span>' : '') +
      '</span>' +
      (temp ? '<span class="wx-spot-temp">' + temp + '</span>' : '') +
      '<span class="wx ' + cls + '">' + WX_LABEL[cls] + '</span>' +
    '</div>';
  }

  function errorCard(place) {
    return '<div class="wx-spot wx-spot-err"><span class="wx-spot-name">' +
      (PLACE_NAMES[place] || place) + '</span>' +
      '<span class="wx-err">' + (isEN ? 'Unavailable' : 'Nepasiekiama') + '</span></div>';
  }

  function loadingCard(place) {
    return '<div class="wx-spot wx-spot-loading"><span class="wx-spot-name">' +
      (PLACE_NAMES[place] || place) + '</span>' +
      '<span class="wx-loading-dot"></span></div>';
  }

  /* ---- Weather strip (homepage) ---- */
  function initStrip() {
    var inner = document.getElementById('wx-strip-inner');
    if (!inner) return;
    if (BASE === null) {
      inner.innerHTML = '<span class="wx-loading">' +
        (isEN ? 'Weather available when running via npm start' : 'Orai pasiekiami paleidus npm start') +
        '</span>';
      return;
    }
    inner.innerHTML = STRIP_PLACES.map(loadingCard).join('');
    Promise.allSettled(
      STRIP_PLACES.map(function (p) { return fetchWeather(p).then(function (d) { return { p: p, d: d }; }); })
    ).then(function (results) {
      inner.innerHTML = results.map(function (r, i) {
        if (r.status === 'rejected') return errorCard(STRIP_PLACES[i]);
        var slot = currentSlot(r.value.d.slots);
        return slot ? renderCard(STRIP_PLACES[i], slot) : errorCard(STRIP_PLACES[i]);
      }).join('');
    });
  }

  /* ---- 7-day forecast widget (kaip-veikia.html) ---- */
  function initForecastWidget() {
    var widget = document.getElementById('wx-forecast-widget');
    if (!widget) return;
    var place = widget.dataset.place || 'svencele';
    var sport = widget.dataset.sport || 'kaitavimas';

    if (BASE === null) {
      widget.innerHTML = '<p class="wx-loading">' +
        (isEN ? 'Start the server with npm start to see live weather.' : 'Paleisk serverį su npm start, kad matytum gyvus orus.') +
        '</p>';
      return;
    }

    widget.innerHTML = '<p class="wx-loading">' + (isEN ? 'Loading weather…' : 'Kraunami orai…') + '</p>';

    fetchWeather(place).then(function (data) {
      if (!data || !data.slots) throw new Error('no data');

      // Group slots into days, pick the best representative slot per day
      var byDay = {};
      data.slots.forEach(function (s) {
        var day = s.time.substring(0, 10);
        var h = parseInt(s.time.substring(11, 13), 10);
        if (!byDay[day] || Math.abs(h - 12) < Math.abs(parseInt(byDay[day].time.substring(11, 13), 10) - 12)) {
          byDay[day] = s;
        }
      });

      var daySlots = Object.values(byDay).slice(0, 7);
      var DN = isEN
        ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        : ['Sk', 'Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št'];

      var html = '<div class="wx-forecast">';
      daySlots.forEach(function (s) {
        var d   = new Date(s.time.endsWith('Z') ? s.time : s.time + 'Z');
        var cls = wxClass(sport, s.wind, s.cond);
        var w   = s.wind != null ? s.wind.toFixed(1) : '—';
        var t   = s.temp != null ? Math.round(s.temp) + '°' : '';
        html += '<div class="wx-day">' +
          '<span class="wx-day-name">' + DN[d.getDay()] + '</span>' +
          '<b class="wx-day-date">' + d.getDate() + '</b>' +
          dirArrow(s.windDir) +
          '<span class="wx-day-wind">' + w + ' m/s</span>' +
          (t ? '<span class="wx-day-temp">' + t + '</span>' : '') +
          '<span class="wx ' + cls + '">' + WX_LABEL[cls] + '</span>' +
        '</div>';
      });
      html += '</div>';
      html += '<p class="wx-credit">' +
        (isEN ? 'Source: Lithuanian Hydrometeorological Service · api.meteo.lt · CC BY-SA 4.0'
               : 'Duomenų šaltinis: Lietuvos hidrometeorologijos tarnyba · api.meteo.lt · CC BY-SA 4.0') +
        '</p>';
      widget.innerHTML = html;
    }).catch(function () {
      widget.innerHTML = '<p class="wx-err">' +
        (isEN ? 'Weather data temporarily unavailable.' : 'Orų duomenys laikinai nepasiekiami.') +
        '</p>';
    });
  }

  /* ---- Export for demo.js ---- */
  window.adrenaWeather = {
    fetchWeather: fetchWeather,
    currentSlot:  currentSlot,
    wxClass:      wxClass,
  };

  /* ---- Init ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initStrip(); initForecastWidget(); });
  } else {
    initStrip();
    initForecastWidget();
  }

})();
