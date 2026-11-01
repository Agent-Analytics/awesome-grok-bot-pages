// Captures dark-scheme screenshots of every listed Page from its live pages.grok.bot URL.
// Output: public/shots/<slug>.webp (card thumbnail, 960x600), <slug>-full.webp (full Page, 1200px wide),
// and <slug>-full-mobile.webp (full Page captured at a 390px viewport).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { parse } from './parse.mjs';
import { launch } from './browser.mjs';

const out = path.resolve(import.meta.dirname, '../public/shots');
fs.mkdirSync(out, { recursive: true });
const mobileOnly = process.argv.includes('--mobile-only');
const only = process.argv.slice(2).filter((a) => a !== '--mobile-only');
const { entries } = parse();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', isMobile: true, hasTouch: true });
const manifest = fs.existsSync(path.join(out, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'manifest.json'))) : {};
// The Page content scrolls inside an inner frame, so grow the window to the frame's height.
async function fullShot(page, width) {
  for (let i = 0; i < 3; i++) {
    // The Page lives in an iframe that can attach after first paint. Measure every frame
    // each pass so a late frame still grows the window instead of leaving a one-screen shot.
    let h = 0;
    for (const f of page.frames()) {
      try {
        const sh = await f.evaluate(() => document.documentElement.scrollHeight);
        if (sh > h) h = sh;
      } catch { /* detached or cross-origin frame */ }
    }
    await page.setViewportSize({ width, height: Math.min(Math.max(h + 40, 844), 8000) });
    await page.waitForTimeout(1200);
  }
  return page.screenshot();
}
let failed = 0;
for (const e of entries) {
  if (only.length && !only.includes(e.slug)) continue;
  const page = await (mobileOnly ? mobileCtx : ctx).newPage();
  try {
    await page.goto(e.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    if (!mobileOnly) {
      const thumb = await page.screenshot();
      const full = await fullShot(page, 1440);
      await sharp(thumb).resize(960).webp({ quality: 80 }).toFile(path.join(out, `${e.slug}.webp`));
      const fullInfo = await sharp(full).resize(1200).webp({ quality: 72 }).toFile(path.join(out, `${e.slug}-full.webp`));
      manifest[e.slug] = { ...(manifest[e.slug] || {}), url: e.url, captured: new Date().toISOString(), thumb: [960, 600], full: [fullInfo.width, fullInfo.height] };
      console.log('ok', e.slug, fullInfo.width + 'x' + fullInfo.height);
    }
    const mp = mobileOnly ? page : await mobileCtx.newPage();
    if (!mobileOnly) {
      await mp.goto(e.url, { waitUntil: 'networkidle', timeout: 60000 });
      await mp.waitForTimeout(2500);
    }
    const mobileShot = await fullShot(mp, 390);
    const mobileInfo = await sharp(mobileShot).resize(390).webp({ quality: 72 }).toFile(path.join(out, `${e.slug}-full-mobile.webp`));
    manifest[e.slug] = { ...(manifest[e.slug] || {}), url: e.url, mobile: [mobileInfo.width, mobileInfo.height] };
    console.log('ok mobile', e.slug, mobileInfo.width + 'x' + mobileInfo.height);
    if (!mobileOnly) await mp.close();
  } catch (err) {
    failed++;
    console.error('FAIL', e.slug, err.message);
  }
  await page.close();
}
await mobileCtx.close();
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await browser.close();
process.exit(failed ? 1 : 0);
