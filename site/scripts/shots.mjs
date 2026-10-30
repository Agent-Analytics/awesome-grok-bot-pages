// Captures dark-scheme screenshots of every listed Page from its live pages.grok.bot URL.
// Output: public/shots/<slug>.webp (card thumbnail, 960x600) and <slug>-full.webp (full Page, 1200px wide).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { parse } from './parse.mjs';
import { launch } from './browser.mjs';

const out = path.resolve(import.meta.dirname, '../public/shots');
fs.mkdirSync(out, { recursive: true });
const only = process.argv.slice(2);
const { entries } = parse();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
const manifest = fs.existsSync(path.join(out, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'manifest.json'))) : {};
let failed = 0;
for (const e of entries) {
  if (only.length && !only.includes(e.slug)) continue;
  const page = await ctx.newPage();
  try {
    await page.goto(e.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    const thumb = await page.screenshot();
    // The Page content scrolls inside an inner frame, so grow the window to the frame's height.
    const frame = page.frames().find((f) => f !== page.mainFrame()) ?? page.mainFrame();
    let h = 900;
    for (let i = 0; i < 3; i++) {
      h = await frame.evaluate(() => document.documentElement.scrollHeight);
      await page.setViewportSize({ width: 1440, height: Math.min(h + 40, 8000) });
      await page.waitForTimeout(1200);
    }
    const full = await page.screenshot();
    await sharp(thumb).resize(960).webp({ quality: 80 }).toFile(path.join(out, `${e.slug}.webp`));
    const fullInfo = await sharp(full).resize(1200).webp({ quality: 72 }).toFile(path.join(out, `${e.slug}-full.webp`));
    manifest[e.slug] = { url: e.url, captured: new Date().toISOString(), thumb: [960, 600], full: [fullInfo.width, fullInfo.height] };
    console.log('ok', e.slug, fullInfo.width + 'x' + fullInfo.height);
  } catch (err) {
    failed++;
    console.error('FAIL', e.slug, err.message);
  }
  await page.close();
}
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await browser.close();
process.exit(failed ? 1 : 0);
