// Serves dist/, click-tests chips and copy buttons, checks links and runs axe.
// Usage: npm test [-- <screenshot dir>]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { server } from './serve.mjs';
import { parse } from './parse.mjs';
import { launch } from './browser.mjs';

const require = createRequire(import.meta.url);
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const shotDir = process.argv[2];
const d = parse();
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;
const b = await launch();
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok, info }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? '  ' + info : ''}`); };

const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(base + '/', { waitUntil: 'networkidle' });
const visible = () => page.$$eval('[data-cats]', (els) => els.filter((e) => !e.hidden).length);
check('all templates visible on load', (await visible()) === d.entries.length, `${await visible()} of ${d.entries.length}`);
if (await page.locator('[data-more-cats]').isVisible()) await page.click('[data-more-cats]');
for (const c of d.categories) {
  await page.click(`[data-filter="${c.slug}"]`);
  const n = await visible();
  const emptyShown = await page.isVisible('#empty');
  const pressed = await page.getAttribute(`[data-filter="${c.slug}"]`, 'aria-pressed');
  check(`chip ${c.name}`, n === c.count && emptyShown === (c.count === 0) && pressed === 'true', `${n} cards, empty state ${emptyShown ? 'shown' : 'hidden'}, hash ${new URL(page.url()).hash}`);
}
await page.click('[data-filter="all"]');
check('chip All restores', (await visible()) === d.entries.length && (await page.isVisible('[data-all-only]')));
// deep link
await page.goto(base + '/#c=agent-orchestration', { waitUntil: 'networkidle' });
check('deep link #c=agent-orchestration', (await visible()) === d.categories.find((c) => c.slug === 'agent-orchestration').count);
await page.goto(base + '/#c=design', { waitUntil: 'networkidle' });
const emptyContrast = await page.evaluate(() => {
  const lin = (c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  const L = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  const parse = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
  const ratio = (fg, bg) => { const a = L(parse(fg)); const b = L(parse(bg)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
  const chip = document.querySelector('[data-filter="design"]');
  const cs = getComputedStyle(chip);
  const count = getComputedStyle(chip.querySelector('b'));
  const bg = cs.backgroundColor;
  const li = chip.parentElement;
  return {
    text: ratio(cs.color, bg),
    count: ratio(count.color, bg),
    fg: cs.color,
    bg,
    cfg: count.color,
    pressed: chip.getAttribute('aria-pressed'),
    visible: !li.hidden && getComputedStyle(li).display !== 'none' && chip.getBoundingClientRect().width > 0,
    empty: !document.getElementById('empty').hidden,
  };
});
check('selected empty chip contrast', emptyContrast.pressed === 'true' && emptyContrast.visible && emptyContrast.empty && emptyContrast.text >= 4.5 && emptyContrast.count >= 4.5, `text ${emptyContrast.text.toFixed(2)}:1 ${emptyContrast.fg} on ${emptyContrast.bg}, count ${emptyContrast.count.toFixed(2)}:1 ${emptyContrast.cfg}`);
await page.goto(base + '/', { waitUntil: 'networkidle' });
// copy buttons
for (const e of d.entries) {
  await page.evaluate(() => navigator.clipboard.writeText(''));
  await page.click(`[data-cats] [data-copy="${e.slug}"]`);
  await page.waitForTimeout(150);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check(`copy prompt ${e.slug}`, clip === e.prompt, `${clip.length} chars`);
}
await page.click('.gl .glb [data-copy="snippet"]');
await page.waitForTimeout(150);
check('copy snippet', (await page.evaluate(() => navigator.clipboard.readText())) === d.snippet);
check('button shows Copied', (await page.textContent('.gl .glb [data-copy="snippet"]')) === 'Copied');
// fallback path: no Clipboard API
const p2 = await ctx.newPage();
await p2.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { value: undefined }); });
await p2.goto(base + '/', { waitUntil: 'networkidle' });
const execCalls = await p2.evaluate(() => { let n = 0; const o = document.execCommand.bind(document); document.execCommand = (c) => { if (c === 'copy') n++; return o(c); }; document.querySelector('[data-copy="snippet"]').click(); return n; });
check('copy fallback uses execCommand when Clipboard API is missing', execCalls === 1);
await p2.close();
// links and assets
const hrefs = new Set();
for (const u of ['/', ...d.entries.map((e) => `/t/${e.slug}/`)]) {
  await page.goto(base + u, { waitUntil: 'networkidle' });
  (await page.$$eval('a[href], img[src], link[href], script[src], source[srcset]', (els) => els.map((e) => e.getAttribute('href') || e.getAttribute('src') || e.getAttribute('srcset')))).forEach((h) => hrefs.add(h));
  const broken = await page.$$eval('img', (imgs) => imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
  check(`images load ${u}`, broken.length === 0, broken.join(' '));
  const txt = await page.content();
  check(`no em dash ${u}`, !txt.includes('\u2014'));
  await page.addScriptTag({ content: axeSrc });
  const ax = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'best-practice'] })).violations.map((v) => `${v.id}(${v.nodes.length})`));
  check(`axe ${u}`, ax.length === 0, ax.join(', '));
}
const internal = [...hrefs].filter((h) => h.startsWith('/') && !h.startsWith('//')).map((h) => h.split('#')[0]).filter(Boolean);
const bad = [];
for (const h of new Set(internal)) { const r = await fetch(base + h); if (r.status !== 200) bad.push(`${h} ${r.status}`); }
check('internal links and assets return 200', bad.length === 0, `${new Set(internal).size} checked ${bad.join(' ')}`);
const extLinks = [...hrefs].filter((h) => /^https?:/.test(h));
console.log(`External links (${extLinks.length}, not fetched):\n  ` + [...new Set(extLinks)].sort().join('\n  '));
// detail copy
await page.goto(base + '/t/mission-control/', { waitUntil: 'networkidle' });
await page.click('.codeh [data-copy="mission-control"]');
await page.waitForTimeout(150);
check('detail page copy prompt', (await page.evaluate(() => navigator.clipboard.readText())) === d.entries.find((e) => e.slug === 'mission-control').prompt);
// keyboard focus visible on a chip
await page.goto(base + '/', { waitUntil: 'networkidle' });
if (await page.locator('[data-more-cats]').isVisible()) await page.click('[data-more-cats]');
await page.focus('[data-filter="sales"]');
await page.keyboard.press('Enter');
check('chip works from keyboard', (await page.getAttribute('[data-filter="sales"]', 'aria-pressed')) === 'true');
const outline = await page.$eval('[data-filter="sales"]', (e) => getComputedStyle(e).outlineStyle);
check('focus ring on keyboard focus', outline !== 'none', outline);
check('no console or page errors', errors.length === 0, errors.join(' | '));

const loadAll = async (pg) => { await pg.evaluate(async () => { document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }); await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); }); };
if (shotDir) {
  fs.mkdirSync(shotDir, { recursive: true });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await loadAll(page);
  await page.screenshot({ path: path.join(shotDir, 'home-desktop-full.png'), fullPage: true });
  await page.click('[data-filter="agent-orchestration"]');
  await page.screenshot({ path: path.join(shotDir, 'home-desktop-filtered.png'), fullPage: true });
  await page.goto(base + '/t/mission-control/', { waitUntil: 'networkidle' });
  await loadAll(page);
  await page.screenshot({ path: path.join(shotDir, 'detail-mission-control-desktop.png'), fullPage: true });
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await m.newPage();
  await mp.goto(base + '/', { waitUntil: 'networkidle' });
  await loadAll(mp);
  await mp.screenshot({ path: path.join(shotDir, 'home-mobile.png') });
  await mp.screenshot({ path: path.join(shotDir, 'home-mobile-full.png'), fullPage: true });
  await mp.goto(base + '/t/mission-control/', { waitUntil: 'networkidle' });
  await loadAll(mp);
  await mp.screenshot({ path: path.join(shotDir, 'detail-mission-control-mobile.png'), fullPage: true });
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  check('mobile detail has no horizontal overflow', !overflow);
  await mp.goto(base + '/', { waitUntil: 'networkidle' });
  check('mobile home has no horizontal overflow', !(await mp.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)));
  await m.close();
  console.log('Screenshots in', shotDir);
}
const mNav = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mNavPage = await mNav.newPage();
await mNavPage.goto(base + '/', { waitUntil: 'networkidle' });
const navAt390 = await mNavPage.evaluate(() => {
  const want = ['Templates', 'Get listed'];
  const nav = document.querySelector('.site-header nav');
  const found = want.map((label) => [...nav.querySelectorAll('a')].find((a) => a.textContent.trim() === label));
  const box = found.map((a) => {
    if (!a) return null;
    const s = getComputedStyle(a);
    const r = a.getBoundingClientRect();
    return { t: a.textContent.trim(), display: s.display, w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left), right: Math.round(r.right) };
  });
  const vw = document.documentElement.clientWidth;
  const ok = box.every((a) => a && a.display !== 'none' && a.w > 8 && a.h > 8 && a.h < 28 && a.left >= 0 && a.right <= vw + 1);
  return { ok, box, overflow: document.documentElement.scrollWidth > vw };
});
check('mobile nav links visible at 390px', navAt390.ok && !navAt390.overflow, JSON.stringify(navAt390.box));
await mNavPage.goto(base + '/t/mission-control/', { waitUntil: 'networkidle' });
const mobileShot = await mNavPage.evaluate(() => {
  const img = document.querySelector('.viewport img');
  return { src: img ? img.currentSrc : '', w: img ? img.naturalWidth : 0 };
});
check('mobile detail uses 390px capture', mobileShot.src.includes('-full-mobile.webp') && mobileShot.w > 0 && mobileShot.w <= 800, `${mobileShot.src} ${mobileShot.w}px`);
await mNav.close();
await b.close();
server.close();
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
