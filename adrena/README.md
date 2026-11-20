# Adrena

Marketing website for Adrena — a Lithuanian extreme sports lesson booking app. Built as a school mini-company (mokinių bendrovė) project by Marius and Povilas.

The site is a **multi-page static website** with:
- 8 pages in Lithuanian (`public/`) and English (`public/en/`), with an LT | EN switch in the header and footer
- Homepage hero: a sunset kitesurf photo (`public/assets/hero-kite.webp` / `.jpg`) with the rider cut out (`hero-kite-cutout.webp` / `.png`, same 1920x1440 frame) and layered in front of the headline. To swap the photo, replace both files with a new photo + matching cutout of the same size.
- Kitesurf film under the hero: `public/assets/hero.webm`, `hero.mp4` (1080p60, seconds 56–69 of the Red Bull kiteboarding film) and `hero-poster.jpg`. The old 720p `media/kaitavimas-fpv.mp4` stays as a last fallback.
- A fully clickable phone prototype of the app
- Live weather from LHMT (api.meteo.lt) via a local proxy
- Waitlist, instructor signup, and contact forms via Formspree

---

## Running locally

**Requirements:** Node.js 18 or later (no other dependencies needed to run the site).

```bash
cd adrena
npm start
```

Open **http://localhost:3000** in your browser.

The server:
- Serves everything in `public/` as static files
- Proxies weather requests to `api.meteo.lt` at `GET /api/weather?place=<code>`
- Caches each weather location for 30 minutes

---

## Adding media files

Put your photos and videos in `public/media/`. The site references these files:

| File | Used in |
|------|---------|
| `marius.jpg` | Team page, gallery |
| `povilas-snieglente.jpg` | Team page, gallery |
| `vandenlente.jpg` | Gallery |
| `foto-7530.jpg` | Gallery |
| `foto-0807.jpg` | Gallery |
| `video-kaitavimas.mp4` | Gallery, phone demo community |
| `video-sniego-kaitavimas.mp4` | Gallery, phone demo community |
| `video-slidinejimas.mp4` | Gallery, phone demo community |

The site works without media files — it shows wave placeholders instead.

---

## Contact forms (Formspree)

The site has three forms: waitlist (`index.html`), instructor signup (`instruktoriams.html`) and contact message (`kontaktai.html`). They all send to **one** [Formspree](https://formspree.io) form.

### Where the form ID lives

The ID is set only in `public/assets/js/config.js`, never in the HTML:

```js
window.ADRENA_CONFIG = {
  formspree: {
    formId: 'xkjrbqaw',                    // from formspree.io/f/<formId>
    endpoint: 'https://formspree.io/f/',
  },
};
```

To switch to a different Formspree form, change `formId`. If it is empty, submitting shows a friendly "not configured" message with the team's email address.

### How submission works

`site.js` handles every `form[data-form-type]`:

- Submits with `fetch` (POST, `new FormData(form)`, header `Accept: application/json`), so form data never appears in the URL
- Disables the submit button while sending, then resets the form and shows a thank-you on success
- On failure shows Formspree's own error messages, or a friendly fallback
- Shows messages in the `.form-status` box under each form (`role="status"`, `aria-live="polite"`), in Lithuanian or English to match the page language

### Telling the forms apart

Because all three forms share one Formspree form, each submission gets these extra fields:

| Field | Value |
|-------|-------|
| `form_type` | `waitlist`, `instructor` or `contact` (from the form's `data-form-type`) |
| `_subject` | Email subject per form type, e.g. "Adrena: nauja instruktoriaus užklausa" |
| `page_lang` | `lt` or `en` |

Filter or sort by `form_type` in the Formspree dashboard or your inbox.

### Adding a new form

Give it `class="sf-form"`, `method="POST"`, a `data-form-type` value, a `name` on every input, a submit button with class `form-submit`, and an empty `<div class="form-status" role="status" aria-live="polite" hidden></div>`. To give it its own email subject, add an entry to `FORM_SUBJECT` in `site.js`.

### Formspree notes

- Free plan: 50 submissions/month, **shared by all three forms**
- Data stored on Formspree servers (US). See their [privacy policy](https://formspree.io/legal/privacy-policy).
- Spam protection: a honeypot `_gotcha` field is included in all forms.

---

## Weather widget

The live weather strip (homepage) and forecast widget (Kaip veikia page) fetch from LHMT via the local proxy at `/api/weather`. They only work when the server is running — opening the HTML files directly as `file://` shows a friendly placeholder.

**Available place codes:** `svencele`, `neringa-nida`, `neringa-pervalka`, `klaipeda`, `kauno-marios`, `palanga`.

To add a new location, add its code to the `ALLOWED_PLACES` whitelist in `server.js`.

**Attribution required:** "Duomenų šaltinis: Lietuvos hidrometeorologijos tarnyba · api.meteo.lt · CC BY-SA 4.0" — this is shown automatically next to every widget.

---

## Deploying

### Netlify / Vercel (recommended)

1. Push the repo to GitHub.
2. Import the repo on Netlify or Vercel.
3. **Build command:** _(none — this is a static site)_
4. **Publish directory:** `public`
5. For the weather proxy, convert `server.js`'s `fetchWeather` + `trimForecast` functions into a serverless function:
   - **Netlify:** create `netlify/functions/weather.js` and configure a redirect from `/api/weather` → `/.netlify/functions/weather`.
   - **Vercel:** create `api/weather.js` (Vercel automatically routes `/api/*`).
   
   The logic is already isolated — copy `fetchWeather`, `trimForecast`, `ALLOWED_PLACES`, and `CACHE_MS` from `server.js`.

### Any Node host (Railway, Render, Fly.io)

The existing `server.js` works as-is on any Node host. Set the `PORT` environment variable if needed.

```bash
PORT=8080 npm start
```

---

## Project structure

```
adrena/
├── server.js              Node server: static files + /api/weather proxy
├── package.json
├── README.md
└── public/
    ├── index.html          Pradžia (homepage)
    ├── kaip-veikia.html    Kaip veikia
    ├── prototipas.html     Išbandyk (phone demo)
    ├── instruktoriams.html Instruktoriams
    ├── apie.html           Apie mus
    ├── kontaktai.html      Kontaktai
    ├── privatumas.html     Privatumo politika
    ├── favicon.svg
    ├── en/                 English versions (Phase 6 — currently redirects to LT)
    ├── assets/
    │   ├── css/style.css
    │   └── js/
    │       ├── config.js   Formspree form ID (edit this)
    │       ├── site.js     Header, footer, nav, theme, gallery, forms
    │       ├── weather.js  Live weather widgets
    │       └── demo.js     Phone prototype
    └── media/              Photos and videos (add your files here)
```

---

## Design system

**Colours:** coral `#FF5A36` · orange `#FF8A3D` · teal `#0FA3A0` · dark sea `#0E1B2C`

**Fonts:** Archivo (display/body) · Archivo Narrow (labels/mono) — loaded from Google Fonts

**Themes:** light and dark, via `prefers-color-scheme` + manual toggle (saved to `localStorage`)

**Breakpoints:** mobile-first, tested at 375 px, 768 px, 1280 px
