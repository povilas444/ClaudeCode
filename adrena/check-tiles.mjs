import { chromium } from 'playwright';
const BASE = 'http://localhost:3000';
const browser = await chromium.launch();
let pass = 0, fail = 0;

for (const theme of ['light', 'dark']) {
  for (const width of [375, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(t => localStorage.setItem('adrena-theme', t), theme);
    await page.reload({ waitUntil: 'networkidle' });

    // Scroll to sport tiles
    await page.locator('#sports-home-grid').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const tiles = await page.locator('.sport-home-tile').count();
    console.log(`[${theme}/${width}] tiles: ${tiles}`);
    tiles === 8 ? pass++ : fail++;

    // Count images that actually loaded (naturalWidth > 0)
    const loaded = await page.$$eval('.sport-home-tile img', imgs =>
      imgs.filter(i => i.complete && i.naturalWidth > 0).length
    );
    console.log(`[${theme}/${width}] images loaded: ${loaded}/8 (5 Unsplash expected, 3 own photos may be missing)`);
    loaded >= 5 ? pass++ : fail++;

    // Screenshot the section
    await page.locator('#sporto-sakos').screenshot({ path: `tiles-${theme}-${width}.png` });

    await ctx.close();
  }
}
await browser.close();
console.log(`\nPassed: ${pass}  Failed: ${fail}`);
