// Phase 7 automated check — run with: node check.mjs
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const PAGES = [
  { url: '/',                  name: 'Pradžia',       page: 'home' },
  { url: '/kaip-veikia.html', name: 'Kaip veikia',   page: 'how' },
  { url: '/prototipas.html',  name: 'Prototipas',    page: 'proto' },
  { url: '/instruktoriams.html', name: 'Instruktoriams', page: 'instr' },
  { url: '/apie.html',        name: 'Apie',          page: 'about' },
  { url: '/kontaktai.html',   name: 'Kontaktai',     page: 'contact' },
  { url: '/privatumas.html',  name: 'Privatumas',    page: 'privacy' },
];
const WIDTHS = [375, 1280];
const THEMES = ['light', 'dark'];
const DEMO_SCENARIOS = ['signup', 'quiz', 'book', 'alert', 'progress', 'community'];

let pass = 0, fail = 0;
const issues = [];

function ok(msg)   { pass++; console.log('  ✓', msg); }
function bad(msg)  { fail++; issues.push(msg); console.log('  ✗', msg); }

const browser = await chromium.launch({ headless: false, slowMo: 60 });

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: 800 },
      colorScheme: theme === 'dark' ? 'dark' : 'light',
      storageState: { cookies: [], origins: [] },
    });
    // Set localStorage theme
    const setupPage = await ctx.newPage();
    await setupPage.goto(BASE);
    await setupPage.evaluate(t => localStorage.setItem('adrena-theme', t), theme);
    await setupPage.close();

    for (const { url, name } of PAGES) {
      const page = await ctx.newPage();
      const consoleErrors = [];
      page.on('console', m => {
        // Skip resource-load errors (media 404s are expected; real JS errors have different text)
        if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) {
          consoleErrors.push(m.text());
        }
      });
      page.on('pageerror', e => consoleErrors.push(e.message));

      console.log(`\n[${theme} / ${width}px] ${name}`);

      try {
        const res = await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 12000 });
        if (res.status() !== 200) {
          bad(`${name} HTTP ${res.status()}`);
          await page.close(); continue;
        }

        // Header and footer injected
        const headerText = await page.locator('#site-header .brand').count();
        headerText > 0 ? ok('header logo present') : bad(`${name}: header logo missing`);
        const footerText = await page.locator('#site-footer').count();
        footerText > 0 ? ok('footer present') : bad(`${name}: footer missing`);

        // No console errors
        if (consoleErrors.length === 0) {
          ok('no console errors');
        } else {
          consoleErrors.forEach(e => bad(`${name} console error: ${e}`));
        }

        // All internal links resolve (no 404s)
        const hrefs = await page.$$eval('a[href]', as =>
          as.map(a => a.getAttribute('href')).filter(h => h && !h.startsWith('http') && !h.startsWith('mailto') && !h.startsWith('#') && !h.startsWith('tel'))
        );
        for (const href of [...new Set(hrefs)]) {
          const target = href.startsWith('/') ? BASE + href : BASE + '/' + href;
          const r = await page.request.get(target).catch(() => null);
          if (!r || r.status() === 404) bad(`${name}: broken link → ${href}`);
        }
        if (hrefs.length > 0) ok(`${hrefs.length} internal links checked`);

        // Active nav class
        const activeNav = await page.locator('.nav a.active, .nav a.cta-s').count();
        activeNav > 0 ? ok('nav active state present') : bad(`${name}: no active nav item`);

        // Favicon
        const favicon = await page.locator('link[rel="icon"]').count();
        favicon > 0 ? ok('favicon present') : bad(`${name}: favicon missing`);

      } catch (e) {
        bad(`${name} @ ${width}px/${theme}: ${e.message}`);
      }
      await page.close();
    }

    // ---- Phone demo check (prototipas) ----
    if (width === 375) {
      console.log(`\n[${theme} / ${width}px] Demo scenarios`);
      const demoPage = await ctx.newPage();
      const demoErrors = [];
      demoPage.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) demoErrors.push(m.text()); });
      demoPage.on('pageerror', e => demoErrors.push(e.message));
      await demoPage.goto(BASE + '/prototipas.html', { waitUntil: 'networkidle' });

      for (const scn of DEMO_SCENARIOS) {
        try {
          await demoPage.locator(`[data-scn="${scn}"]`).click();
          await demoPage.waitForTimeout(400);
          const appContent = await demoPage.locator('#app').innerText();
          appContent.length > 10 ? ok(`demo scenario: ${scn}`) : bad(`demo scenario ${scn}: empty app`);
          // Reset
          await demoPage.locator('#resetDemo').click();
          await demoPage.waitForTimeout(200);
        } catch (e) {
          bad(`demo scenario ${scn}: ${e.message}`);
        }
      }

      if (demoErrors.length === 0) ok('demo: no console errors');
      else demoErrors.forEach(e => bad(`demo console error: ${e}`));
      await demoPage.close();
    }

    // ---- Form "not configured" check ----
    if (width === 1280 && theme === 'light') {
      console.log('\n[forms] Not-configured state');
      for (const { url: furl, name: fname } of [
        { url: '/#laukianciuju-sarasas', name: 'waitlist (index)' },
        { url: '/instruktoriams.html#prisijungti', name: 'instructor' },
        { url: '/kontaktai.html', name: 'contact' },
      ]) {
        const fp = await ctx.newPage();
        fp.on('pageerror', e => bad(`form page error: ${e.message}`));
        await fp.goto(BASE + furl, { waitUntil: 'networkidle' });
        const form = fp.locator('form[data-form-type]').first();
        const btn = form.locator('.form-submit');
        if (await btn.count() > 0) {
          await btn.click();
          await fp.waitForTimeout(400);
          const statusText = await form.locator('.form-status').textContent().catch(() => '');
          statusText.length > 5 ? ok(`${fname}: shows status on submit`) : bad(`${fname}: no status after submit`);
        } else {
          bad(`${fname}: submit button not found`);
        }
        await fp.close();
      }
    }

    await ctx.close();
  }
}

await browser.close();

console.log(`\n${'─'.repeat(50)}`);
console.log(`Passed: ${pass}   Failed: ${fail}`);
if (issues.length) {
  console.log('\nIssues to fix:');
  issues.forEach((i, n) => console.log(`  ${n + 1}. ${i}`));
}
