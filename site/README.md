# grokpages.com

Static site for the Awesome Grok Bot Pages list. Listings are parsed from the repository [`README.md`](../README.md) at build time. Adding a Page means editing that README only. The site does not keep a second copy of the entries.

Astro builds plain HTML, the same shape as Open Orchestrators. There is no host adapter, so the `dist/` folder can go to Netlify or Cloudflare Pages without extra config.

## Develop

```bash
npm ci
npm test
npm run dev
```

## Thumbnails

Screenshots of each public Page live in `src/assets/thumbnails/`. The capture script is `scripts/capture-thumbnails.mjs`. It waits for fonts and, for Bot Org Chart, refuses to save a shot until the "Chief of staff" label is in the page.

```bash
npx playwright install --with-deps chromium
npm run capture
```

`npm run capture -- --missing` skips Pages that already have a screenshot. The build fails if a listing has no thumbnail.

## Build

```bash
npm test
npm run build
```

Output is `dist/`. Open Graph images are generated into `public/og/` during the build and are not committed.

## Deploy

Hosting is not set up in this repo. Point either host at the `site` directory.

| Host | Root directory | Build command | Output |
| --- | --- | --- | --- |
| Netlify | `site` | `npm run build` | `dist` |
| Cloudflare Pages | `site` | `npm run build` | `dist` |

Canonical URL: `https://grokpages.com`.

Open Graph cards use [Inter](https://github.com/rsms/inter), under the SIL Open Font License in `assets/fonts/OFL.txt`. The pages themselves use Geist, loaded from the font files shipped with the site.
