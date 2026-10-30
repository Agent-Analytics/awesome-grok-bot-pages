import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { loadCatalog, metaDescription } from '../src/lib/catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/og');
const regular = path.join(root, 'assets/fonts/Inter-Regular.ttf');
const semibold = path.join(root, 'assets/fonts/Inter-SemiBold.ttf');

const catalog = loadCatalog();
mkdirSync(outDir, { recursive: true });

const cards = [
  {
    file: 'home.png',
    kicker: 'grokpages.com',
    title: 'Copy a Grok Bot Page.',
    description: 'Every template is a live public Page plus the exact prompt that built it.',
    footer: 'Public templates',
  },
  ...catalog.pages.map((page) => ({
    file: `${page.slug}.png`,
    kicker: 'grokpages.com',
    title: page.title,
    description: metaDescription(page.summary),
    footer: page.exampleData ? `${page.categoryTitle} · Example data` : page.categoryTitle,
  })),
];

for (const card of cards) {
  const png = renderCard(card);
  writeFileSync(path.join(outDir, card.file), png);
  console.log(`og ${card.file}`);
}

function renderCard({ kicker, title, description, footer }) {
  const titleLines = wrap(title, title.length > 28 ? 22 : 28).slice(0, 3);
  const titleSize = titleLines.some((line) => line.length > 22) ? 58 : 68;
  const titleLine = titleSize + 10;
  const titleY = 230;
  const descY = titleY + titleLines.length * titleLine + 28;
  const descLines = wrap(description, 62).slice(0, 2);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <defs>
    <radialGradient id="glow" cx="50%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#7877c6" stop-opacity="0.42"/>
      <stop offset="70%" stop-color="#7877c6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="80" y="128" fill="#a3a3a3" font-family="Inter" font-size="26" font-weight="400">${esc(kicker)}</text>
  <text x="80" y="${titleY}" fill="#fafafa" font-family="Inter" font-size="${titleSize}" font-weight="600">${tspans(titleLines, titleLine)}</text>
  <text x="80" y="${descY}" fill="#a3a3a3" font-family="Inter" font-size="28" font-weight="400">${tspans(descLines, 40)}</text>
  <text x="80" y="568" fill="#a5a5f0" font-family="Inter" font-size="24" font-weight="600">${esc(footer)}</text>
</svg>`;

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: {
      fontFiles: [regular, semibold],
      loadSystemFonts: false,
      defaultFontFamily: 'Inter',
    },
  });
  return resvg.render().asPng();
}

function tspans(lines, lineHeight) {
  return lines
    .map((line, index) => `<tspan x="80" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`)
    .join('');
}

function wrap(text, max) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function esc(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
