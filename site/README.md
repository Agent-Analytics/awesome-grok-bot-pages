# grokpages.com site

Static site for [grokpages.com](https://grokpages.com). Everything on it is generated from the repo's `README.md`: categories, entries, credits, prompts and the get-listed snippet. Add or edit an entry in the README and rebuild; there is no separate data file.

## Build

Needs Node 20 or later. The screenshot, OG and test scripts also need Chrome or Chromium (set `CHROME_PATH` if it is not in a standard place).

```sh
cd site
npm install
npm run build        # README.md -> dist/
npm run serve        # http://localhost:4321
npm test             # serves dist/, click-tests chips and copy buttons, checks links, runs axe
```

The number of checks grows with the README: one per category chip and per entry. With the current 4 entries `npm test` runs 43 checks. `npm test -- <dir>` also writes screenshots to `<dir>` and adds 2 mobile overflow checks (45).

When a Page is added or changes:

```sh
npm run shots                # all Pages, dark scheme, from their live pages.grok.bot URLs
npm run shots -- mission-control   # one Page by slug
npm run og                   # rebuild public/og.png (1200x630) from the hero and newest 4 screenshots
npm run build
```

Commit the files in `public/shots/` and `public/og.png`; the build copies them into `dist/`.

## Layout

- `scripts/parse.mjs`: README parser. `node scripts/parse.mjs` prints the parsed data.
- `scripts/build.mjs`: writes `dist/index.html`, `dist/t/<slug>/index.html`, `404.html`, `sitemap.xml`, `robots.txt`, favicons and fonts. Fails if any page contains an em dash.
- `src/`: `styles.css`, `app.js` (category filter and copy buttons, no dependencies), `favicon.svg`.
- `public/`: committed screenshots (`shots/<slug>.webp` 960x600 card, `shots/<slug>-full.webp` full Page at 1200px, `shots/<slug>-full-mobile.webp` full Page captured at 390px) and `og.png`.

## Hosting

Cloudflare Pages, connected by Git to this repo. Every push to `main` deploys; there are no manual deploys. Settings: production branch `main`, root directory `site`, build command `npm ci && npm run build`, output directory `dist`, `NODE_VERSION=22`. Custom domains are grokpages.com and www.grokpages.com; grokbotpages.com and its www redirect (301) to https://grokpages.com with the path and query kept. Pages link with root paths (`/assets/...`, `/t/<slug>/`), so serve it at the domain root.

