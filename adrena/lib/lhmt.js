// LHMT (api.meteo.lt) forecast helpers, shared by server.js (local)
// and netlify/functions/weather.mjs (production). Requires Node 18+ (global fetch).

'use strict';

// Allowed place codes (whitelist to prevent abuse)
const ALLOWED_PLACES = new Set([
  'svencele',
  'neringa-nida',
  'neringa-pervalka',
  'klaipeda',
  'kauno-marios',
  'palanga',
]);

const CACHE_MS = 30 * 60 * 1000; // 30 minutes

async function fetchWeather(place) {
  const apiUrl = 'https://api.meteo.lt/v1/places/' + place + '/forecasts/long-term';
  const res = await fetch(apiUrl, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (res.status !== 200) throw new Error('LHMT returned ' + res.status);
  try { return await res.json(); }
  catch (e) { throw new Error('Invalid JSON from LHMT'); }
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

module.exports = { ALLOWED_PLACES, CACHE_MS, fetchWeather, trimForecast };
