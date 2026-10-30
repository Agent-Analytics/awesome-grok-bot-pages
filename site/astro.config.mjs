import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { loadCatalog } from './src/lib/catalog.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const catalog = loadCatalog();
const thumbDir = path.join(root, 'src/assets/thumbnails');
const missing = catalog.pages.filter(
  (page) => !fs.existsSync(path.join(thumbDir, `${page.slug}.webp`)),
);

if (missing.length) {
  const lines = missing.map((page) => `  - ${page.slug}.webp  ${page.url}`).join('\n');
  throw new Error(
    `README listings are missing screenshots:\n${lines}\nFrom site/, run: npm run capture`,
  );
}

export default defineConfig({
  site: 'https://grokpages.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
