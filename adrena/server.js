// Adrena local server
// Serves public/ as static files
// GET /api/weather?place=<code>  — proxies api.meteo.lt with 30-min cache
// (LHMT logic is in lib/lhmt.js; on Netlify the same thing runs as netlify/functions/weather.mjs)
// No npm dependencies required.

'use strict';

const http  = require('http');
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

const { ALLOWED_PLACES, CACHE_MS, fetchWeather, trimForecast } = require('./lib/lhmt');

// In-memory weather cache: place → { data, expires }
const weatherCache = new Map();

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
