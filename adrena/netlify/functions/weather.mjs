// Netlify Function: GET /api/weather?place=<code>
// Production replacement for the /api/weather proxy in server.js.
// Same response shape, so the frontend calls /api/weather unchanged.

import lhmt from '../../lib/lhmt.js';

const { ALLOWED_PLACES, CACHE_MS, fetchWeather, trimForecast } = lhmt;

// Per-instance cache (lives while the function stays warm)
const cache = new Map();

function json(status, body, extra) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}

export default async (req) => {
  const place = (new URL(req.url).searchParams.get('place') || '').toLowerCase().trim();
  if (!ALLOWED_PLACES.has(place)) {
    return json(400, { error: 'Unknown place code' });
  }

  // Netlify's CDN caches each place for 30 min, so LHMT is hit rarely
  const cdnCache = {
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Netlify-CDN-Cache-Control': 'public, s-maxage=' + CACHE_MS / 1000 + ', stale-while-revalidate=600',
    'Netlify-Vary': 'query=place',
  };

  const cached = cache.get(place);
  if (cached && cached.expires > Date.now()) return json(200, cached.data, cdnCache);

  try {
    const trimmed = trimForecast(await fetchWeather(place));
    cache.set(place, { data: trimmed, expires: Date.now() + CACHE_MS });
    return json(200, trimmed, cdnCache);
  } catch (e) {
    console.error('[weather]', e.message);
    return json(502, { error: 'Weather service temporarily unavailable' });
  }
};

export const config = { path: '/api/weather' };
