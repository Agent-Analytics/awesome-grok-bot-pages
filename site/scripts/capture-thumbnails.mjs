import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadCatalog } from '../src/lib/catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'src/assets/thumbnails');
const missingOnly = process.argv.includes('--missing');
const checkOnly = process.argv.includes('--check');
const only = process.argv.find((arg) => arg.startsWith('--only='))?.slice('--only='.length);

const catalog = loadCatalog();
const targets = catalog.pages.filter((page) => {
  if (only && page.slug !== only) return false;
  if (!missingOnly && !checkOnly) return true;
  return !existsSync(path.join(outDir, `${page.slug}.webp`));
});

if (only && !catalog.pages.some((page) => page.slug === only)) {
  console.error(`No Page with slug "${only}".`);
  process.exit(1);
}

if (checkOnly) {
  if (targets.length) {
    console.error(`Missing thumbnails:\n${targets.map((page) => page.slug).join('\n')}`);
    process.exit(1);
  }
  console.log('Thumbnails present.');
  process.exit(0);
}

if (!targets.length) {
  console.log('Thumbnails present. Nothing to capture.');
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    locale: 'en-US',
  });

  for (const pageInfo of targets) {
    await capture(context, pageInfo);
  }
} finally {
  await browser.close();
}

async function capture(context, pageInfo) {
  const page = await context.newPage();
  page.setDefaultTimeout(30_000);
  const fonts = [];
  page.on('response', (response) => {
    const type = response.headers()['content-type'] || '';
    const url = response.url();
    if (/\.(?:woff2?|ttf|otf)(?:\?|$)/i.test(url) || /font/i.test(type)) {
      fonts.push(`${response.status()} ${url}`);
    }
  });

  console.log(`capturing ${pageInfo.slug} ${pageInfo.url}`);
  await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForSelector('iframe', { timeout: 20_000 });
  await page.waitForFunction(() => {
    const iframe = document.querySelector('iframe');
    const fallback = document.getElementById('frame-fallback');
    if (!iframe || iframe.hidden) return false;
    if (fallback && !fallback.hidden) return false;
    return iframe.getBoundingClientRect().height > 200;
  }, { timeout: 20_000 });

  await page
    .waitForFunction(() => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--shell-print-height');
      return Number.parseInt(raw, 10) > 400;
    }, { timeout: 12_000 })
    .catch(() => {});

  const frame = page.frames().find((candidate) => candidate !== page.mainFrame());
  await settleFrame(frame);

  if (pageInfo.slug === 'bot-org-chart') {
    await waitForOrgChart(page, frame);
  } else {
    await page.waitForTimeout(1200);
  }

  const contentHeight = await page.evaluate(() => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--shell-print-height');
    const declared = Number.parseInt(raw, 10);
    const iframe = document.querySelector('iframe');
    const iframeHeight = iframe ? iframe.getBoundingClientRect().height : 0;
    return Math.max(Number.isFinite(declared) ? declared : 0, iframeHeight, 900);
  });
  const height = Math.min(Math.max(Math.ceil(contentHeight) + 48, 1000), 1680);
  await page.setViewportSize({ width: 1440, height });
  await settleFrame(frame);
  if (pageInfo.slug === 'bot-org-chart') {
    await waitForOrgChart(page, frame);
    await revealOrgChart(frame);
    await page.waitForTimeout(300);
  } else {
    await page.waitForTimeout(500);
  }

  const buffer = await page.screenshot({ type: 'png', animations: 'disabled' });
  const stats = await sharp(buffer).stats();
  const spread = Math.max(...stats.channels.map((channel) => channel.stdev));
  if (spread < 8) {
    throw new Error(`${pageInfo.slug}: screenshot looks blank (stdev ${spread.toFixed(1)}).`);
  }

  const out = path.join(outDir, `${pageInfo.slug}.webp`);
  await sharp(buffer).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  console.log(`  wrote ${path.relative(root, out)} viewport=${height} stdev=${spread.toFixed(1)}`);
  if (fonts.length) console.log(`  fonts:\n    ${fonts.slice(0, 12).join('\n    ')}`);
  await page.close();
}

async function settleFrame(frame) {
  if (!frame) return;
  await frame.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    const images = [...document.images];
    await Promise.all(images.map((img) => (img.complete ? null : img.decode().catch(() => {}))));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }).catch((error) => {
    console.warn(`  frame settle: ${error.message}`);
  });
}

async function waitForOrgChart(page, frame) {
  const deadline = Date.now() + 20_000;
  let last = '';
  while (Date.now() < deadline) {
    const snap = await readLabels(frame);
    last = JSON.stringify(snap).slice(0, 500);
    const blob = `${snap.text}\n${snap.svg.join('\n')}\n${snap.labels.join('\n')}`;
    if (/chief of staff/i.test(blob)) {
      await page.waitForTimeout(1000);
      return;
    }
    await page.waitForTimeout(400);
  }
  throw new Error(
    `Bot Org Chart labels did not render (expected "Chief of staff"). Refusing to save a blank thumbnail. Last frame text: ${last}`,
  );
}

// Chart labels and arrows are tagged paper-base. The page's theme CSS then paints
// them with the background color, so several screenshot tools save a blank chart.
// The fill and stroke attributes are already the visible colors. Drop those two
// hooks inside the chart so the thumbnail shows the names and the arrows.
async function revealOrgChart(frame) {
  if (!frame) return;
  await frame.evaluate(() => {
    const root = document.getElementById('org-chart') || document.body;
    for (const el of root.querySelectorAll('text, tspan')) {
      if (el.getAttribute('data-grok-adapt-fill') === 'paper-base') {
        el.removeAttribute('data-grok-adapt-fill');
      }
    }
    for (const el of root.querySelectorAll('path, line, polyline')) {
      if (el.getAttribute('data-grok-adapt-stroke') === 'paper-base') {
        el.removeAttribute('data-grok-adapt-stroke');
      }
    }
  });
}

async function readLabels(frame) {
  if (!frame) return { text: '', svg: [], labels: [] };
  return frame.evaluate(() => {
    const text = document.body?.innerText || '';
    const svg = [...document.querySelectorAll('text, tspan')]
      .map((node) => (node.textContent || '').trim())
      .filter(Boolean);
    const labels = [...document.querySelectorAll('[aria-label], [title]')]
      .map((node) => node.getAttribute('aria-label') || node.getAttribute('title') || '')
      .filter(Boolean);
    return { text: text.slice(0, 2000), svg: svg.slice(0, 50), labels: labels.slice(0, 50) };
  }).catch((error) => ({ text: '', svg: [], labels: [`error: ${error.message}`] }));
}
