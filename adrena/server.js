// Adrena local server
// Serves public/ as static files
// GET /api/weather?place=<code>  — proxies api.meteo.lt with 30-min cache
// No npm dependencies required.

'use strict';

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

const PORT   = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.txt':  'text/plain; charset=utf-8',
};

// Allowed place codes (whitelist to prevent abuse)
const ALLOWED_PLACES = new Set([
  'svencele',
  'neringa-nida',
  'neringa-pervalka',
  'klaipeda',
  'kauno-marios',
  'palanga',
]);

// In-memory weather cache: place → { data, expires }
const weatherCache = new Map();
const CACHE_MS = 30 * 60 * 1000; // 30 minutes

function fetchWeather(place) {
  return new Promise(function (resolve, reject) {
    const apiUrl = 'https://api.meteo.lt/v1/places/' + place + '/forecasts/long-term';
    const req = https.get(apiUrl, { headers: { Accept: 'application/json' } }, function (res) {
      let body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
        if (res.statusCode !== 200) {
          return reject(new Error('LHMT returned ' + res.statusCode));
        }
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('Invalid JSON from LHMT')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, function () { req.destroy(new Error('LHMT timeout')); });
  });
}

function trimForecast(raw) {
  if (!raw || !Array.isArray(raw.forecastTimestamps)) return null;
  const now    = Date.now();
  const cutoff = now + 7 * 24 * 60 * 60 * 1000;
  // Return ALL available slots (hourly for first ~2 days, then 3-hourly).
  // Clients filter/group as needed; strip widget uses currentSlot(), forecast table uses all.
  const slots  = raw.forecastTimestamps.filter(function (t) {
    const ts = new Date(t.forecastTimeUtc + 'Z').getTime();
    return ts >= now - 60 * 60 * 1000 && ts <= cutoff; // include 1h back so "now" always has a slot
  }).map(function (t) {
    return {
      time:     t.forecastTimeUtc,
      temp:     t.airTemperature,
      feels:    t.feelsLikeTemperature,
      wind:     t.windSpeed,
      gust:     t.windGust,
      windDir:  t.windDirection,
      cloud:    t.cloudCover,
      pressure: t.seaLevelPressure,
      humidity: t.relativeHumidity,
      precip:   t.totalPrecipitation,
      cond:     t.conditionCode,
    };
  });
  return { place: raw.place ? raw.place.code : null, slots: slots };
}

function serveStatic(req, res, filePath) {
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache', // always revalidate so edits show up on refresh
      'Accept-Ranges': 'bytes',
    };
    // Range requests: Safari will not play <video> without them
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (m && (m[1] || m[2])) {
      let start = m[1] ? +m[1] : data.length - +m[2];
      let end = m[1] && m[2] ? Math.min(+m[2], data.length - 1) : data.length - 1;
      if (start < 0) start = 0;
      if (start > end) { res.writeHead(416, { 'Content-Range': 'bytes */' + data.length }); res.end(); return; }
      headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + data.length;
      res.writeHead(206, headers);
      res.end(data.subarray(start, end + 1));
      return;
    }
    res.writeHead(200, headers);
    res.end(data);
  });
}

const server = http.createServer(function (req, res) {
  const parsed   = url.parse(req.url, true);
  const pathname = parsed.pathname.replace(/\.\./g, ''); // prevent traversal

  res.setHeader('Access-Control-Allow-Origin', '*');

  // ---- Weather API ----
  if (pathname === '/api/weather') {
    const place = (parsed.query.place || '').toLowerCase().trim();
    if (!ALLOWED_PLACES.has(place)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unknown place code' }));
      return;
    }
    const cached = weatherCache.get(place);
    if (cached && cached.expires > Date.now()) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cached.data));
      return;
    }
    fetchWeather(place).then(function (raw) {
      const trimmed = trimForecast(raw);
      weatherCache.set(place, { data: trimmed, expires: Date.now() + CACHE_MS });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(trimmed));
    }).catch(function (e) {
      console.error('[weather]', e.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Weather service temporarily unavailable' }));
    });
    return;
  }

  // ---- Static files ----
  let filePath = path.join(PUBLIC, pathname === '/' ? 'index.html' : pathname);

  // No extension → try .html
  if (!path.extname(filePath)) filePath += '.html';

  // Directory → serve index.html inside it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Security: must stay inside PUBLIC
  if (!filePath.startsWith(PUBLIC + path.sep) && filePath !== PUBLIC) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  serveStatic(req, res, filePath);
});

server.listen(PORT, function () {
  console.log('Adrena server: http://localhost:' + PORT);
});
