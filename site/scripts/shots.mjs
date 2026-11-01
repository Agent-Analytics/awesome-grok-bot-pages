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
// The Page renders inside a host iframe under a 40px bar. Shots are the Page only:
// the host bar is hidden, and a column that leaves large empty side margins is cropped tight.
function contentFrame(page) {
  return page.frames().find((f) => f.parentFrame() && f.url().includes('/__cursor/frame'));
}
async function frameHeight(page) {
  const frame = contentFrame(page);
  const frames = frame ? [frame] : page.frames();
  let h = 0;
  for (const f of frames) {
    try {
      const sh = await f.evaluate(() => document.documentElement.scrollHeight);
      if (sh > h) h = sh;
    } catch { /* detached or cross-origin frame */ }
  }
  return h || 900;
}
async function showPageOnly(page, width, height) {
  await page.setViewportSize({ width, height });
  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
    const iframe = document.querySelector('iframe');
    if (!iframe) return;
    iframe.style.position = 'fixed';
    iframe.style.inset = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.style.margin = '0';
    document.documentElement.style.margin = '0';
    document.body.style.margin = '0';
  });
}
async function contentClip(page) {
  const frame = contentFrame(page);
  if (!frame) return null;
  return frame.evaluate(() => {
    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0, n = 0;
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width < 48 || r.height < 12) continue;
      const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || s.display === 'none' || s.opacity === '0') continue;
      const bordered = ['Top', 'Right', 'Bottom', 'Left'].some((side) => parseFloat(s[`border${side}Width`]) > 0);
      const hasText = [...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim());
      if (!bordered && !hasText) continue;
      const x = r.left + window.scrollX;
      const y = r.top + window.scrollY;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, r.right + window.scrollX);
      maxY = Math.max(maxY, r.bottom + window.scrollY);
      n++;
    }
    if (!n || !Number.isFinite(minX)) return null;
    return {
      x: Math.max(0, Math.floor(minX)),
      y: Math.max(0, Math.floor(minY)),
      width: Math.ceil(maxX - minX),
      height: Math.ceil(maxY - minY),
      viewW: document.documentElement.clientWidth,
    };
  });
}
// WebP cannot store a side longer than 16383px. A tight crop of a very tall column
// cannot also be scaled to 1200px wide, so the full shot widens just enough to fit.
const WEBP_MAX = 16383;
async function trimMargins(buf, clip, targetWidth, pad = 0) {
  if (!clip) return buf;
  const meta = await sharp(buf).metadata();
  const rightGap = clip.viewW - (clip.x + clip.width);
  const tight = clip.x >= 80 || rightGap >= 80;
  if (!tight && !targetWidth) return buf;
  let left = tight ? Math.max(0, clip.x - pad) : 0;
  let top = tight ? Math.max(0, clip.y - pad) : 0;
  let right = tight ? Math.min(meta.width, clip.x + clip.width + pad) : meta.width;
  let bottom = tight ? Math.min(meta.height, clip.y + clip.height + pad) : meta.height;
  let width = Math.max(1, right - left);
  let height = Math.max(1, bottom - top);
  if (targetWidth) {
    const need = Math.ceil(height * targetWidth / (WEBP_MAX - 64));
    if (need > width) {
      const extra = need - width;
      const growLeft = Math.min(left, Math.floor(extra / 2));
      const growRight = Math.min(meta.width - (left + width), extra - growLeft);
      left -= growLeft;
      width += growLeft + growRight;
    }
  }
  console.log('crop', `${left},${top} ${width}x${height} from ${meta.width}x${meta.height}`);
  return sharp(buf).extract({ left, top, width, height }).toBuffer();
}
// full: the whole Page. Otherwise the 1440x900 or 390x844 viewport, still with the host bar removed.
async function shotPage(page, width, full) {
  const frame = contentFrame(page);
  if (frame) await frame.evaluate(() => document.fonts?.ready).catch(() => {});
  let height = full ? await frameHeight(page) : (width >= 1000 ? 900 : 844);
  height = Math.min(Math.max(height, 844), 16000);
  await showPageOnly(page, width, height);
  await page.waitForTimeout(full ? 800 : 300);
  if (full && frame) {
    await frame.evaluate(async () => {
      const step = Math.max(window.innerHeight, 600);
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 16));
      }
      window.scrollTo(0, 0);
    }).catch(() => {});
    const grown = Math.min(await frameHeight(page), 16000);
    if (grown > height) {
      height = grown;
      await showPageOnly(page, width, height);
      await page.waitForTimeout(400);
    }
  }
  const targetWidth = full && width >= 1000 ? 1200 : 0;
  // A few pixels of the page background so glyphs are not flush with the crop.
  const pad = !full && width >= 1000 ? 32 : 0;
  return trimMargins(await page.screenshot(), await contentClip(page), targetWidth, pad);
}
let failed = 0;
for (const e of entries) {
  if (only.length && !only.includes(e.slug)) continue;
  const page = await (mobileOnly ? mobileCtx : ctx).newPage();
  try {
    await page.goto(e.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    if (!mobileOnly) {
      const thumb = await shotPage(page, 1440, false);
      const full = await shotPage(page, 1440, true);
      const thumbInfo = await sharp(thumb).resize(960, 600, { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(path.join(out, `${e.slug}.webp`));
      const fullInfo = await sharp(full).resize(1200).webp({ quality: 72 }).toFile(path.join(out, `${e.slug}-full.webp`));
      manifest[e.slug] = { ...(manifest[e.slug] || {}), url: e.url, captured: new Date().toISOString(), thumb: [thumbInfo.width, thumbInfo.height], full: [fullInfo.width, fullInfo.height] };
      console.log('ok', e.slug, fullInfo.width + 'x' + fullInfo.height, 'thumb', thumbInfo.width + 'x' + thumbInfo.height);
    }
    const mp = mobileOnly ? page : await mobileCtx.newPage();
    if (!mobileOnly) {
      await mp.goto(e.url, { waitUntil: 'networkidle', timeout: 60000 });
      await mp.waitForTimeout(2500);
    }
    const mobileShot = await shotPage(mp, 390, true);
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
