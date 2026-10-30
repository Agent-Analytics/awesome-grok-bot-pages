// Builds dist/ from ../README.md. Run: npm run build
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parse, slugify } from './parse.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const SITE = 'https://grokpages.com';
const GROK = 'https://x.ai/bot';
const AA = 'https://agentanalytics.sh';
const d = parse();
const REPO = d.repo;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// repo: this list. page: a hosted Grok Page. other: everything else (profiles, docs, video, product sites).
export function targetType(url) {
  let u;
  try { u = new URL(url); } catch { return 'other'; }
  if (url.startsWith(REPO)) return 'repo';
  if (u.hostname.endsWith('.pages.grok.bot')) return 'page';
  return 'other';
}
const trackAttrs = (event, params) => {
  const bits = [`data-track="${event}"`];
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null) continue;
    bits.push(`data-${k.replace(/_/g, '-')}="${esc(v)}"`);
  }
  return bits.join(' ');
};
const ext = (url, text, cls = '', event = '', params = null) => {
  const clsAttr = cls ? ` class="${cls}"` : '';
  const track = event ? ` ${trackAttrs(event, params)}` : '';
  return `<a href="${esc(url)}"${clsAttr}${track} target="_blank" rel="noopener">${text}</a>`;
};
const outbound = (url, text, position, cls = '') => ext(url, text, cls, 'outbound_clicked', { target_url: url, target_type: targetType(url), position });
const liveLink = (e, text, position, cls = '') => ext(e.url, text, cls, 'template_opened', { page_slug: e.slug, position });
const copyButton = (slug, position, label, cls) => {
  const event = slug === 'snippet' ? 'snippet_copied' : 'prompt_copied';
  const slugAttr = slug === 'snippet' ? '' : ` data-page-slug="${esc(slug)}"`;
  return `<button type="button" class="${cls}" data-copy="${esc(slug)}" data-track="${event}"${slugAttr} data-position="${position}">${label}</button>`;
};
// Minimal inline markdown: links and code. Relative #anchors point at the README on GitHub.
const md = (s, position) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => {
    const url = u.startsWith('#') ? `${REPO}${u}` : u;
    return position ? outbound(url, t, position) : ext(url, t);
  });
const catSlug = (name) => slugify(name);
const ghAnchor = (name) => '#' + name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/ /g, '-');
const isAA = (e) => e.categories.includes('Data Analytics') || /Agent Analytics/.test(e.description);

const GH = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

const handles = (hs) => hs.map((h) => outbound(h.url, esc(h.handle), 'credit')).join(', ');
const personInline = (p) => `${esc(p.name)}${p.handles.length ? ' ' + handles(p.handles) : ''}`;
function creditLine(e) {
  const parts = [];
  if (e.inspired) parts.push(`Inspired by ${outbound(e.inspired.source.url, esc(e.inspired.source.text), 'credit')}${e.inspired.handles.length ? ' (' + handles(e.inspired.handles) + ')' : ''}`);
  parts.push('By ' + e.by.map(personInline).join(', '));
  if (e.pageBy) parts.push('Example Page by ' + personInline(e.pageBy));
  return parts.join(' · ');
}
const tags = (e) => e.categories.map((c) => `<a class="tag" href="/#c=${catSlug(c)}" data-track="category_filtered" data-category="${catSlug(c)}" data-source="link">${esc(c)}</a>`).join(' ') + (e.exampleData ? '<span class="ex">Example data</span>' : '');
const aaLine = (e) => (isAA(e) ? `<p class="aa">Data from ${outbound(AA, 'Agent Analytics', 'credit')}, recommended for dashboard data.</p>` : '');
const shotImg = (e, cls = '', eager = false) => `<img src="/shots/${e.slug}.webp" width="960" height="600" alt="Screenshot of the ${esc(e.title)} Page"${eager ? '' : ' loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ''}>`;
const actions = (e, sm, livePosition) => `<div class="act">${liveLink(e, 'Open Page <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>', livePosition, 'btn pri' + sm)}${copyButton(e.slug, 'card', 'Copy prompt', 'btn' + sm)}<a class="btn ghost${sm}" href="/t/${e.slug}/">Details<span class="sr-only"> for ${esc(e.title)}</span></a></div>`;
const dataBlob = (obj) => `<script type="application/json" id="site-data">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

function layout({ title, description, pathName, body, data }) {
  const url = SITE + pathName;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0a0a0a">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="grokpages.com">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="grokpages.com: Copy a Grok Bot Page, with screenshots of the listed templates">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/og.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><a class="wm" href="/" aria-label="grokpages.com home">grokpages<span>.com</span></a>
<nav aria-label="Main"><a href="/#templates">Templates</a><a href="/#get-listed">Get listed</a>${outbound(GROK, 'Grok Bot', 'header')}${outbound(REPO, GH + ' GitHub', 'header', 'gh')}</nav></header>
<main id="main">
${body}
</main>
<footer class="site-footer"><div class="in"><div><a class="wm" href="/">grokpages<span>.com</span></a><p>Templates for Grok Bot Pages, listed from the Awesome Grok Bot Pages repo.</p></div>
<div class="fcols"><div><h2>Project</h2>${outbound(REPO, 'GitHub repo', 'footer')}${ext(REPO + '/blob/main/CONTRIBUTING.md', 'Contributing', '', 'get_listed_clicked', { target: 'contributing' })}${outbound(REPO + '#listing-rules', 'Listing rules', 'footer')}</div>
<div><h2>Build</h2>${outbound(GROK, 'Grok Bot', 'footer')}${outbound(AA, 'Agent Analytics', 'footer')}<span class="sm">Recommended for dashboard data</span></div></div>
<div class="fb">Every Page listed is public and uses mock or public data. List content is CC0 1.0.</div></div></footer>
<div id="live" class="sr-only" aria-live="polite"></div>
${dataBlob(data)}
<script src="/assets/app.js" defer></script>
<!-- Agent Analytics tracker, async so a slow tracker.js does not delay app.js or DOMContentLoaded. page_view is automatic. Home is / and a template is /t/:slug/. Cloudflare serves this 404 file at the missing path, so that page_view path is the requested URL rather than /404.html, and page_type is not sent: the tracker fires page_view before window.aa exists and does not replay a queue. -->
<script async src="https://api.agentanalytics.sh/tracker.js" data-project="grokpages.com" data-token="aat_7a16c5a08900e1aa55e2d7a97f26167b063a0d5d73a4477c"></script>
</body>
</html>
`;
}

function getListed() {
  const steps = d.steps.map((s, i) => i === 3
    ? `Open a pull request that adds your entry to the right section of the README, in the ${outbound(REPO + '#entry-format', 'entry format', 'how_to')}.`
    : md(s, 'how_to'));
  return `<section class="gl" id="get-listed" aria-labelledby="gl-h"><div><h2 id="gl-h">Get your Page listed</h2>
<ol>${steps.map((s) => `<li>${s}</li>`).join('')}</ol>
<p class="note">${esc(d.notice)}</p>
<div class="glb">${copyButton('snippet', 'section_button', 'Copy snippet', 'btn pri')}${ext(REPO + '/edit/main/README.md', 'Open a pull request', 'btn', 'get_listed_clicked', { target: 'open_pr' })}${ext(REPO + '/blob/main/CONTRIBUTING.md', 'Contributing guide', 'btn ghost', 'get_listed_clicked', { target: 'contributing' })}</div>
<div class="dash"><h3>Need data for a dashboard?</h3><p>${md(d.dashboardNote, 'how_to')}</p></div></div>
<div class="code"><div class="codeh"><span>Snippet</span>${copyButton('snippet', 'code_header', 'Copy', 'btn sm')}</div><pre>${esc(d.snippet)}</pre></div></section>`;
}

function home() {
  const [newest, ...rest] = d.entries;
  const chips = [`<li><button type="button" class="chip" data-filter="all" data-name="All" data-track="category_filtered" data-category="all" data-source="click" aria-pressed="true">All <b>${d.entries.length}</b></button></li>`,
    ...d.categories.map((c) => `<li><button type="button" class="chip${c.count ? '' : ' empty'}" data-filter="${c.slug}" data-name="${esc(c.name)}" data-track="category_filtered" data-category="${c.slug}" data-source="click" aria-pressed="false" title="${esc(c.blurb)}">${esc(c.name)} <b>${c.count}</b><span class="sr-only"> ${c.count === 1 ? 'Page' : 'Pages'}</span></button></li>`)].join('');
  const cats = (e) => e.categories.map(catSlug).join(' ');
  const card = (e) => `<li class="card" data-cats="${cats(e)}"><a class="shot" href="/t/${e.slug}/" tabindex="-1" aria-hidden="true">${shotImg(e)}</a><div class="body"><div>${tags(e)}</div>
<h3><a href="/t/${e.slug}/">${esc(e.title)}</a></h3><p>${esc(e.short)}</p><p class="cr">${creditLine(e)}</p>${aaLine(e)}${actions(e, ' sm', 'grid')}</div></li>`;
  const body = `<section class="hero" aria-labelledby="hero-h"><span class="pill">Grok Bot Pages templates</span><h1 id="hero-h">Copy a <em>Grok Bot Page.</em></h1>
<p>Every template is a live public Page plus the exact prompt that built it.</p>
<div class="cta"><a class="btn pri" href="#get-listed">Get your Page listed</a><a class="btn" href="#templates">Browse templates</a></div></section>
<section class="wrap" id="templates" aria-labelledby="tpl-h"><h2 id="tpl-h" class="sr-only">Templates</h2>
<ul class="chips" aria-label="Filter templates by category">${chips}</ul>
<p class="status" id="filter-status" aria-live="polite">Showing all ${d.entries.length} Pages</p>
<p class="lbl" data-all-only>Newest addition</p>
<article class="feat" data-cats="${cats(newest)}"><a class="shot" href="/t/${newest.slug}/" tabindex="-1" aria-hidden="true">${shotImg(newest, '', true)}</a><div class="body"><div>${tags(newest)}</div>
<h3><a href="/t/${newest.slug}/">${esc(newest.title)}</a></h3><p>${esc(newest.short)}</p><p class="cr">${creditLine(newest)}</p>${aaLine(newest)}
<div class="pv" aria-hidden="true">${esc(newest.prompt)}</div>${actions(newest, '', 'featured')}</div></article>
<p class="lbl" data-all-only>All templates</p>
<ul class="grid">${rest.map(card).join('')}</ul>
<div class="empty-state" id="empty" hidden><p>No Pages in <strong data-empty-name></strong> yet.</p><a class="btn pri" href="#get-listed">Add yours</a></div>
</section>
${getListed()}`;
  return layout({
    title: 'grokpages.com: Grok Bot Pages templates with their prompts',
    description: `Live public Grok Bot Pages and the exact prompts that built them. ${d.entries.length} templates: ${d.entries.map((e) => e.title).join(', ')}.`,
    pathName: '/', body,
    data: { snippet: d.snippet, prompts: Object.fromEntries(d.entries.map((e) => [e.slug, e.prompt])) },
  });
}

function initials(n) { return n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(); }
function detail(e) {
  const host = new URL(e.url).host;
  const people = [...e.by.map((p) => [p, e.pageBy ? 'Prompt and idea' : 'Author']), ...(e.pageBy ? [[e.pageBy, 'Example Page']] : [])];
  const related = d.entries.filter((o) => o.slug !== e.slug && o.categories.some((c) => e.categories.includes(c)));
  const links = [
    liveLink(e, 'Open live Page <span aria-hidden="true">↗</span>', 'links_box', 'l'),
    e.inspired && outbound(e.inspired.source.url, esc(e.inspired.source.text) + ' <span aria-hidden="true">↗</span>', 'links_box', 'l'),
    e.promptSource && outbound(e.promptSource.url, `Prompt source: ${esc(e.promptSource.text)} <span aria-hidden="true">↗</span>`, 'links_box', 'l'),
    outbound(REPO + ghAnchor(e.categories[0]), 'Entry on GitHub <span aria-hidden="true">↗</span>', 'links_box', 'l'),
  ].filter(Boolean);
  const cat = e.categories[0];
  const body = `<div class="wrap">
<nav class="crumb" aria-label="Breadcrumb"><a href="/">Templates</a> / <a href="/#c=${catSlug(cat)}">${esc(cat)}</a> / <span aria-current="page">${esc(e.title)}</span></nav>
<div class="dtop"><div><div>${tags(e)}</div><h1>${esc(e.title)}</h1><p>${esc(e.description)}</p>${aaLine(e)}</div>
<div class="cta">${copyButton(e.slug, 'detail_top', 'Copy prompt', 'btn')}${liveLink(e, 'Open live Page <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>', 'detail_top', 'btn pri')}</div></div>
<figure class="frame"><div class="chrome" aria-hidden="true"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url">${esc(host)}</span></div>
<div class="viewport" tabindex="0" role="region" aria-label="Full-page screenshot of ${esc(e.title)}, scrollable"><img src="/shots/${e.slug}-full.webp" alt="Full-page screenshot of the ${esc(e.title)} Page in dark mode" loading="eager" decoding="async"></div>
<figcaption>Screenshot of the live Page in dark mode. ${liveLink(e, 'Open the live Page', 'caption')} to use it.</figcaption></figure>
<div class="dbody"><div><h2>Prompt</h2><div class="code"><div class="codeh"><span>${e.promptSource ? `By ${esc(e.promptSource.by)}, from ${outbound(e.promptSource.url, esc(e.promptSource.text), 'credit')}` : 'Prompt'}</span>${copyButton(e.slug, 'prompt_block', 'Copy prompt', 'btn sm')}</div><pre>${esc(e.prompt)}</pre></div>
<div class="how"><h2>How to use it</h2><ol><li>Copy the prompt and paste it into a chat with ${outbound(GROK, 'Grok Bot', 'how_to')}.</li><li>Swap in your own bots, accounts or data sources where the prompt asks for them.</li><li>If the prompt does not create a refresh routine, ask Grok Bot for one.</li><li>To share your version, make a copy with mock data and make that copy public. Then ${'<a href="/#get-listed">get it listed</a>'}.</li></ol></div></div>
<aside aria-label="About this template"><section class="box"><h2>Credit</h2>${people.map(([p, role]) => `<div class="per"><div class="av" aria-hidden="true">${initials(p.name)}</div><div><b>${esc(p.name)}</b><small>${role}</small>${p.handles.map((h) => outbound(h.url, `${esc(h.handle)} on ${h.platform}`, 'credit')).join('')}</div></div>`).join('')}
${e.inspired ? `<p>Inspired by ${outbound(e.inspired.source.url, esc(e.inspired.source.text), 'credit')}${e.inspired.handles.length ? ' (' + handles(e.inspired.handles) + ')' : ''}.</p>` : ''}</section>
<section class="box"><h2>Links</h2><ul>${links.map((l) => `<li>${l}</li>`).join('')}</ul></section>
${isAA(e) ? `<section class="box"><h2>Data source</h2><p>${md(d.dashboardNote, 'how_to')}</p></section>` : ''}
<section class="box"><h2>More in ${esc(cat)}</h2>${related.length ? `<ul>${related.map((o) => `<li><a class="rel" href="/t/${o.slug}/" data-track="related_clicked" data-page-slug="${e.slug}" data-target-slug="${o.slug}"><img src="/shots/${o.slug}.webp" alt="" width="96" height="60" loading="lazy"><span><b>${esc(o.title)}</b><small>${esc(o.inspired ? 'Inspired by ' + o.inspired.source.text.replace(/'s video$/, '') : 'By ' + o.by.map((p) => p.name).join(', '))}</small></span></a></li>`).join('')}</ul>` : `<p>No other Pages in ${esc(cat)} yet. <a href="/#get-listed">Add yours</a>.</p>`}</section></aside></div></div>`;
  return layout({ title: `${e.title}: Grok Bot Page template | grokpages.com`, description: e.short, pathName: `/t/${e.slug}/`, body,
    data: { prompts: { [e.slug]: e.prompt } } });
}

function notFound() {
  return layout({ title: 'Page not found | grokpages.com', description: 'This page does not exist.', pathName: '/404.html',
    body: `<section class="hero"><h1>Not found.</h1><p>That page is not on grokpages.com.</p><div class="cta"><a class="btn pri" href="/">Browse templates</a></div></section>`, data: {} });
}

// ---- write
async function writeDist() {
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'assets/fonts'), { recursive: true });
fs.cpSync(path.join(root, 'public'), dist, { recursive: true });
fs.copyFileSync(path.join(root, 'src/styles.css'), path.join(dist, 'assets/styles.css'));
fs.copyFileSync(path.join(root, 'src/app.js'), path.join(dist, 'assets/app.js'));
fs.copyFileSync(path.join(root, 'src/favicon.svg'), path.join(dist, 'favicon.svg'));
const fonts = path.join(root, 'node_modules/geist/dist/fonts');
fs.copyFileSync(path.join(fonts, 'geist-sans/Geist-Variable.woff2'), path.join(dist, 'assets/fonts/Geist-Variable.woff2'));
fs.copyFileSync(path.join(fonts, 'geist-mono/GeistMono-Variable.woff2'), path.join(dist, 'assets/fonts/GeistMono-Variable.woff2'));
fs.copyFileSync(path.join(root, 'node_modules/geist/LICENSE.txt'), path.join(dist, 'assets/fonts/LICENSE.txt')); // SIL OFL 1.1 travels with the fonts
const svg = fs.readFileSync(path.join(root, 'src/favicon.svg'));
await sharp(svg).resize(32).png().toFile(path.join(dist, 'favicon-32.png'));
await sharp(svg).resize(180).png().toFile(path.join(dist, 'apple-touch-icon.png'));
await sharp(svg).resize(32).png().toFile(path.join(dist, 'favicon.ico')); // PNG-in-ICO is fine for modern browsers

const missing = d.entries.filter((e) => !fs.existsSync(path.join(root, 'public/shots', `${e.slug}.webp`)));
if (missing.length) console.warn('Missing screenshots, run npm run shots:', missing.map((e) => e.slug).join(', '));

const pages = { 'index.html': home(), '404.html': notFound() };
for (const e of d.entries) pages[`t/${e.slug}/index.html`] = detail(e);
for (const [p, html] of Object.entries(pages)) {
  if (html.includes('\u2014')) throw new Error(`Em dash found in ${p}`);
  fs.mkdirSync(path.dirname(path.join(dist, p)), { recursive: true });
  fs.writeFileSync(path.join(dist, p), html);
}
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', ...d.entries.map((e) => `/t/${e.slug}/`)].map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${Object.keys(pages).length} pages into dist/ (${d.entries.length} templates, ${d.categories.length} categories)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await writeDist();
