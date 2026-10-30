// Serves dist/, click-tests chips and copy buttons, checks links and runs axe.
// Usage: npm test [-- <screenshot dir>]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { server } from './serve.mjs';
import { parse } from './parse.mjs';
import { launch } from './browser.mjs';
import { targetType } from './build.mjs';

const require = createRequire(import.meta.url);
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const shotDir = process.argv[2];
const d = parse();
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;
const b = await launch();
// Keep every test browser off the live Agent Analytics project: answer api.agentanalytics.sh locally in each context
// (an empty tracker.js and a 204 for anything else), so nothing reaches production and no load errors are logged.
// Page-level routes below (stubbed or delayed tracker) still run first.
const newContext = b.newContext.bind(b);
b.newContext = async (opts) => {
  const c = await newContext(opts);
  await c.route('https://api.agentanalytics.sh/**', (route) => (new URL(route.request().url()).pathname === '/tracker.js'
    ? route.fulfill({ status: 200, contentType: 'text/javascript', body: '' })
    : route.fulfill({ status: 204, body: '' })));
  return c;
};
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok, info }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? '  ' + info : ''}`); };

const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(base + '/', { waitUntil: 'networkidle' });
const visible = () => page.$$eval('[data-cats]', (els) => els.filter((e) => !e.hidden).length);
const chipOrder = await page.$$eval('[data-filter]', (els) => els.map((e) => e.getAttribute('data-filter')));
const mission = d.entries.find((e) => e.slug === 'mission-control');
const missionDetail = await (await fetch(base + '/t/mission-control/')).text();
check(
  'Mission Control is the first category',
  d.categories[0]?.name === 'Mission Control'
    && d.categories[0].slug === 'mission-control'
    && d.categories[1]?.name === 'Productivity'
    && chipOrder[0] === 'all'
    && chipOrder[1] === 'mission-control'
    && mission?.categories[0] === 'Mission Control'
    && !mission.categories.includes('Agent Orchestration')
    && missionDetail.includes('href="/#c=mission-control">Mission Control</a>'),
  chipOrder.slice(0, 3).join(' '),
);
check('all templates visible on load', (await visible()) === d.entries.length, `${await visible()} of ${d.entries.length}`);
const chipGate = await page.$$eval('.chips [data-filter]', (els) => els.map((el) => ({
  slug: el.getAttribute('data-filter'),
  empty: el.classList.contains('empty'),
  hidden: el.parentElement.hidden,
})));
const bySlug = Object.fromEntries(chipGate.map((c) => [c.slug, c]));
const gateMiss = d.categories.filter((c) => {
  const chip = bySlug[c.slug];
  if (!chip) return true;
  const shouldHide = c.count === 0;
  return chip.empty !== shouldHide || chip.hidden !== shouldHide;
});
const missionCat = d.categories.find((c) => c.slug === 'mission-control');
check(
  'only zero-page categories are hidden',
  gateMiss.length === 0 && missionCat?.count === 2 && bySlug['mission-control'] && !bySlug['mission-control'].hidden && !bySlug.all?.hidden,
  `mission ${missionCat?.count}; ${gateMiss.map((c) => `${c.slug}:${c.count}`).join(' ')}`,
);
if (await page.locator('[data-more-cats]').isVisible()) await page.click('[data-more-cats]');
for (const c of d.categories) {
  await page.click(`[data-filter="${c.slug}"]`);
  const n = await visible();
  const emptyShown = await page.isVisible('#empty');
  const pressed = await page.getAttribute(`[data-filter="${c.slug}"]`, 'aria-pressed');
  const hash = new URL(page.url()).hash;
  check(`chip ${c.name}`, n === c.count && emptyShown === (c.count === 0) && pressed === 'true' && hash === `#c=${c.slug}`, `${n} cards, empty state ${emptyShown ? 'shown' : 'hidden'}, hash ${hash}`);
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

// Primary domain: canonical, og:url, sitemap and robots point at grokbotpages.com, and no page
// mentions grokpages.com except the Agent Analytics project id in the tracker snippet.
const SITE = 'https://grokbotpages.com';
const dist = path.resolve(import.meta.dirname, '..', 'dist');
for (const u of ['/', ...d.entries.map((e) => `/t/${e.slug}/`)]) {
  const html = fs.readFileSync(path.join(dist, u, 'index.html'), 'utf8');
  const canon = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)">/)?.[1];
  const ogImg = html.match(/<meta property="og:image" content="([^"]+)">/)?.[1];
  check(`canonical and og:url on ${SITE} ${u}`, canon === SITE + u && ogUrl === SITE + u && ogImg === SITE + '/og.png', `${canon} ${ogUrl}`);
  const stray = html.replaceAll('data-project="grokpages.com"', '').match(/grokpages\.com/g);
  check(`no grokpages.com mention ${u}`, !stray, stray ? `${stray.length} found` : '');
}
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const wantLocs = ['/', ...d.entries.map((e) => `/t/${e.slug}/`)].map((u) => SITE + u);
check('sitemap lists every page on grokbotpages.com', JSON.stringify(locs) === JSON.stringify(wantLocs), `${locs.length} urls`);
check('robots.txt Sitemap line on grokbotpages.com', fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8').includes(`Sitemap: ${SITE}/sitemap.xml`));
const nf = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
check('404 title on grokbotpages.com', nf.includes('<title>Page not found | grokbotpages.com</title>'));

// Agent Analytics wiring. The tracker request is aborted so a test stub is not replaced
// by the localhost dev logger, and so the no-global case stays empty.
const SNIPPET = '<script async src="https://api.agentanalytics.sh/tracker.js" data-project="grokpages.com" data-token="aat_7a16c5a08900e1aa55e2d7a97f26167b063a0d5d73a4477c"></script>';
const POS = {
  template_opened: ['featured', 'grid', 'detail_top', 'caption', 'links_box'],
  prompt_copied: ['card', 'detail_top', 'prompt_block'],
  snippet_copied: ['section_button', 'code_header'],
  outbound_clicked: ['header', 'footer', 'credit', 'links_box', 'how_to'],
};
const entryBySlug = Object.fromEntries(d.entries.map((e) => [e.slug, e]));
const catSlugs = new Set(d.categories.map((c) => c.slug));
const siblingsOf = (e) => d.entries.filter((o) => o.slug !== e.slug && o.categories.some((c) => e.categories.includes(c)));
const readTracks = (pg) => pg.$$eval('[data-track]', (els) => els.map((el) => ({
  event: el.getAttribute('data-track'),
  href: el.getAttribute('href'),
  page_slug: el.getAttribute('data-page-slug'),
  position: el.getAttribute('data-position'),
  category: el.getAttribute('data-category'),
  source: el.getAttribute('data-source'),
  target: el.getAttribute('data-target'),
  target_url: el.getAttribute('data-target-url'),
  target_type: el.getAttribute('data-target-type'),
  target_slug: el.getAttribute('data-target-slug'),
  copy: el.getAttribute('data-copy'),
  filter: el.getAttribute('data-filter'),
})));
const aaEvents = (pg) => pg.evaluate(() => window.__aaEvents.slice());
async function expectEvents(pg, expected, label) {
  const got = await aaEvents(pg);
  const ok = got.length === expected.length && expected.every((exp, i) => {
    const g = got[i];
    if (!g || g.name !== exp.name) return false;
    const keys = Object.keys(exp.props).sort();
    const gotKeys = Object.keys(g.props).sort();
    return keys.join(',') === gotKeys.join(',') && keys.every((k) => g.props[k] === exp.props[k]);
  });
  check(label, ok, JSON.stringify(got));
}
const clearAa = (pg) => pg.evaluate(() => { window.__aaEvents = []; });
const fire = (pg, selector) => pg.evaluate((sel) => {
  const el = document.querySelector(sel);
  el.addEventListener('click', (e) => e.preventDefault(), { capture: true });
  el.click();
}, selector);

const paths = ['/', ...d.entries.map((e) => `/t/${e.slug}/`), '/404.html'];
const seen = { positions: new Set(), types: new Set(), targets: new Set(), sources: new Set() };
for (const pathName of paths) {
  const raw = await (await fetch(base + pathName)).text();
  check(`snippet once ${pathName}`, raw.split(SNIPPET).length - 1 === 1 && !raw.includes('aa.set'));
  if (pathName === '/') {
    const appAt = raw.indexOf('<script src="/assets/app.js" defer></script>');
    check('app.js is not blocked on the tracker', appAt !== -1 && appAt < raw.indexOf(SNIPPET));
  }
  await page.goto(base + pathName, { waitUntil: 'domcontentloaded' });
  const tracks = await readTracks(page);
  const bare = await page.$$eval('a[href]', (els) => els.filter((a) => /^https?:/i.test(a.getAttribute('href') || '') && !a.getAttribute('data-track')).map((a) => a.getAttribute('href')));
  const problems = [];
  if (bare.length) problems.push('untracked ' + bare.join(' '));
  const detailSlug = pathName.startsWith('/t/') ? pathName.split('/')[2] : '';
  for (const t of tracks) {
    if (t.event === 'category_filtered') {
      seen.sources.add(t.source);
      if (!['click', 'link'].includes(t.source)) problems.push('bad source ' + t.source);
      if (t.source === 'click' && (t.category !== t.filter || (t.category !== 'all' && !catSlugs.has(t.category)))) problems.push('chip ' + t.category);
      if (t.source === 'link' && (!catSlugs.has(t.category) || t.href !== `/#c=${t.category}`)) problems.push('tag ' + t.category);
    } else if (t.event === 'template_opened') {
      seen.positions.add('template_opened:' + t.position);
      const entry = entryBySlug[t.page_slug];
      if (!POS.template_opened.includes(t.position) || !entry || t.href !== entry.url) problems.push('template ' + t.position + ' ' + t.page_slug);
    } else if (t.event === 'prompt_copied') {
      seen.positions.add('prompt_copied:' + t.position);
      if (!POS.prompt_copied.includes(t.position) || t.copy !== t.page_slug || !entryBySlug[t.page_slug]) problems.push('prompt ' + t.position);
    } else if (t.event === 'snippet_copied') {
      seen.positions.add('snippet_copied:' + t.position);
      if (!POS.snippet_copied.includes(t.position) || t.copy !== 'snippet' || t.page_slug) problems.push('snippet ' + t.position);
    } else if (t.event === 'get_listed_clicked') {
      seen.targets.add(t.target);
      const hrefOk = t.target === 'open_pr' ? (t.href || '').includes('/edit/main/README.md') : t.target === 'contributing' && (t.href || '').includes('/blob/main/CONTRIBUTING.md');
      if (!hrefOk) problems.push('get_listed ' + t.target + ' ' + t.href);
    } else if (t.event === 'outbound_clicked') {
      seen.positions.add('outbound_clicked:' + t.position);
      seen.types.add(t.target_type);
      if (!POS.outbound_clicked.includes(t.position) || !['repo', 'page', 'other'].includes(t.target_type)) problems.push('outbound enum ' + t.position + ' ' + t.target_type);
      if (t.target_url !== t.href || t.target_type !== targetType(t.href)) problems.push('outbound ' + t.href + ' typed ' + t.target_type);
      if (d.entries.some((e) => e.url === t.href)) problems.push('live page marked outbound ' + t.href);
    } else if (t.event === 'related_clicked') {
      if (t.page_slug !== detailSlug || !entryBySlug[t.target_slug] || t.target_slug === t.page_slug || t.href !== `/t/${t.target_slug}/`) problems.push('related ' + t.page_slug + ' -> ' + t.target_slug);
    } else problems.push('unknown event ' + t.event);
  }
  if (pathName === '/') {
    const chips = tracks.filter((t) => t.event === 'category_filtered' && t.source === 'click');
    if (chips.length !== d.categories.length + 1) problems.push('chip count ' + chips.length);
    if (!chips.some((t) => t.category === 'all')) problems.push('missing all chip');
    const featured = tracks.filter((t) => t.event === 'template_opened' && t.position === 'featured');
    if (featured.length !== 1 || featured[0].page_slug !== d.entries[0].slug) problems.push('featured');
    const grid = tracks.filter((t) => t.event === 'template_opened' && t.position === 'grid');
    if (grid.length !== d.entries.length - 1) problems.push('grid ' + grid.length);
    if (tracks.filter((t) => t.event === 'prompt_copied' && t.position === 'card').length !== d.entries.length) problems.push('card copies');
    if (!tracks.some((t) => t.event === 'snippet_copied' && t.position === 'section_button')) problems.push('section_button');
    if (!tracks.some((t) => t.event === 'snippet_copied' && t.position === 'code_header')) problems.push('code_header');
    if (tracks.filter((t) => t.event === 'get_listed_clicked' && t.target === 'open_pr').length !== 1) problems.push('open_pr');
  } else if (detailSlug) {
    for (const position of ['detail_top', 'caption', 'links_box']) {
      const n = tracks.filter((t) => t.event === 'template_opened' && t.position === position && t.page_slug === detailSlug).length;
      if (n !== 1) problems.push(position + ' ' + n);
    }
    for (const position of ['detail_top', 'prompt_block']) {
      if (!tracks.some((t) => t.event === 'prompt_copied' && t.position === position && t.page_slug === detailSlug)) problems.push('copy ' + position);
    }
    const related = tracks.filter((t) => t.event === 'related_clicked');
    if (related.length !== siblingsOf(entryBySlug[detailSlug]).length) problems.push('related count ' + related.length);
    if (tracks.some((t) => t.event === 'snippet_copied' || t.position === 'featured' || t.position === 'grid' || t.position === 'card')) problems.push('detail has home-only track');
  } else if (tracks.some((t) => ['template_opened', 'prompt_copied', 'snippet_copied', 'category_filtered', 'related_clicked'].includes(t.event))) {
    problems.push('404 has page-only events');
  }
  check(`data-track wiring ${pathName}`, problems.length === 0, problems.join(' | '));
}
const needPos = ['template_opened:featured', 'template_opened:grid', 'template_opened:detail_top', 'template_opened:caption', 'template_opened:links_box', 'prompt_copied:card', 'prompt_copied:detail_top', 'prompt_copied:prompt_block', 'snippet_copied:section_button', 'snippet_copied:code_header', 'outbound_clicked:header', 'outbound_clicked:footer', 'outbound_clicked:credit', 'outbound_clicked:links_box', 'outbound_clicked:how_to'];
check('every position is used', needPos.every((p) => seen.positions.has(p)), [...seen.positions].sort().join(' '));
check('outbound target types and get-listed targets', seen.types.has('repo') && seen.types.has('other') && ![...seen.types].some((t) => t !== 'repo' && t !== 'other') && ['open_pr', 'contributing'].every((t) => seen.targets.has(t)) && ['click', 'link'].every((s) => seen.sources.has(s)));
const typeCases = [
  [d.repo, 'repo'],
  [d.repo + '#listing-rules', 'repo'],
  [d.repo + '/edit/main/README.md', 'repo'],
  ['https://x.ai/bot', 'other'],
  ['https://agentanalytics.sh', 'other'],
  ['https://docs.agentanalytics.sh/installation/', 'other'],
  ['https://www.youtube.com/watch?v=UClMrBShiYc', 'other'],
  ['https://youtu.be/Nk242TnA7-8', 'other'],
  ['https://x.com/AlexFinn/status/2115612249826148795', 'other'],
  ['https://mission-control-example-sgmr.pages.grok.bot/', 'page'],
  ['https://bot-org-chart-example-ujfc.pages.grok.bot/', 'page'],
];
const typeMiss = typeCases.filter(([url, kind]) => targetType(url) !== kind).map(([url, kind]) => `${url} expected ${kind} got ${targetType(url)}`);
check('targetType is repo, grok page, or other', typeMiss.length === 0, typeMiss.join(' | '));

const barePage = await ctx.newPage();
const bareErrors = [];
barePage.on('pageerror', (e) => bareErrors.push(e.message));
await barePage.route('https://api.agentanalytics.sh/**', (route) => route.abort());
await barePage.goto(base + '/', { waitUntil: 'domcontentloaded' });
const some = d.categories.find((c) => c.count > 0);
await barePage.click(`[data-filter="${some.slug}"] b`);
await barePage.click('.gl .glb [data-copy="snippet"]');
await barePage.waitForTimeout(150);
check('handler no-ops without the AA global', bareErrors.length === 0 && (await barePage.evaluate(() => window.aa)) == null && (await barePage.getAttribute(`[data-filter="${some.slug}"]`, 'aria-pressed')) === 'true' && (await barePage.textContent('.gl .glb [data-copy="snippet"]')) === 'Copied');
await barePage.evaluate(() => { window.aa = {}; });
await barePage.click('[data-filter="all"]');
check('handler ignores aa without track', bareErrors.length === 0 && (await barePage.getAttribute('[data-filter="all"]', 'aria-pressed')) === 'true');
await barePage.evaluate(() => { window.aa = { track: () => { throw new Error('tracker failed'); } }; });
await barePage.click(`[data-filter="${some.slug}"]`);
check('throwing tracker does not break the page', bareErrors.length === 0 && (await barePage.getAttribute(`[data-filter="${some.slug}"]`, 'aria-pressed')) === 'true');
await barePage.close();

const ap = await ctx.newPage();
await ap.route('https://api.agentanalytics.sh/**', (route) => route.abort());
await ap.addInitScript(() => {
  window.__aaEvents = [];
  window.aa = { track: (name, props) => { window.__aaEvents.push({ name, props }); } };
});
await ap.goto(base + `/#c=${some.slug}`, { waitUntil: 'domcontentloaded' });
await expectEvents(ap, [{ name: 'category_filtered', props: { category: some.slug, results_count: some.count, source: 'link' } }], 'landing #c= fires category_filtered source link');
await clearAa(ap);
await ap.click('[data-filter="all"]');
await expectEvents(ap, [{ name: 'category_filtered', props: { category: 'all', results_count: d.entries.length, source: 'click' } }], 'All chip fires category_filtered source click');
await clearAa(ap);
// A DOM click, not Playwright's click: Playwright follows the hash without firing hashchange.
await ap.evaluate((slug) => document.querySelector(`a.tag[data-category="${slug}"]`).click(), some.slug);
await expectEvents(ap, [{ name: 'category_filtered', props: { category: some.slug, results_count: some.count, source: 'link' } }], 'category tag fires one source=link event');
await clearAa(ap);
const empty = d.categories.find((c) => c.count === 0);
if (await ap.locator('[data-more-cats]').isVisible()) await ap.click('[data-more-cats]');
await ap.click(`[data-filter="${empty.slug}"] b`);
await expectEvents(ap, [{ name: 'category_filtered', props: { category: empty.slug, results_count: 0, source: 'click' } }], 'chip click fires category_filtered with results_count');
await ap.click('[data-filter="all"]');
await clearAa(ap);
await fire(ap, 'article.feat a[data-track="template_opened"]');
await expectEvents(ap, [{ name: 'template_opened', props: { page_slug: d.entries[0].slug, position: 'featured' } }], 'featured open fires template_opened only');
await clearAa(ap);
await ap.click(`article.feat [data-copy="${d.entries[0].slug}"]`);
await ap.waitForTimeout(150);
await expectEvents(ap, [{ name: 'prompt_copied', props: { page_slug: d.entries[0].slug, position: 'card', success: true } }], 'card copy fires one prompt_copied after success');
await clearAa(ap);
await ap.click('.gl .glb [data-copy="snippet"]');
await ap.waitForTimeout(150);
await expectEvents(ap, [{ name: 'snippet_copied', props: { position: 'section_button', success: true } }], 'section snippet copy fires snippet_copied');
await clearAa(ap);
await fire(ap, '.glb a[data-target="open_pr"]');
await expectEvents(ap, [{ name: 'get_listed_clicked', props: { target: 'open_pr' } }], 'open pull request fires get_listed_clicked only');
await clearAa(ap);
await fire(ap, 'header a[data-track="outbound_clicked"]');
const headerHref = await ap.getAttribute('header a[data-track="outbound_clicked"]', 'href');
await expectEvents(ap, [{ name: 'outbound_clicked', props: { target_url: headerHref, target_type: targetType(headerHref), position: 'header' } }], 'header external link fires outbound_clicked only');
const withRelated = d.entries.find((e) => siblingsOf(e).length > 0);
const detailEntry = withRelated || d.entries[0];
if (!detailEntry) {
  console.log('SKIP  related link fires related_clicked only  the list has no entries');
} else {
  await ap.goto(base + `/t/${detailEntry.slug}/`, { waitUntil: 'domcontentloaded' });
  await clearAa(ap);
  if (withRelated) {
    await fire(ap, 'a.rel');
    await expectEvents(ap, [{ name: 'related_clicked', props: { page_slug: withRelated.slug, target_slug: siblingsOf(withRelated)[0].slug } }], 'related link fires related_clicked only');
  } else {
    console.log('SKIP  related link fires related_clicked only  no entry shares a category with another, so there is no related link');
  }
  await clearAa(ap);
  await fire(ap, 'figure figcaption a[data-track="template_opened"]');
  await expectEvents(ap, [{ name: 'template_opened', props: { page_slug: detailEntry.slug, position: 'caption' } }], 'caption open fires template_opened only');
  await clearAa(ap);
  await ap.evaluate(() => {
    window.__aaEvents = [];
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('no')) } });
    document.execCommand = () => false;
  });
  await ap.click('.codeh [data-copy]');
  await ap.waitForTimeout(150);
  await expectEvents(ap, [{ name: 'prompt_copied', props: { page_slug: detailEntry.slug, position: 'prompt_block', success: false } }], 'failed copy fires prompt_copied success false');
}
await ap.close();

// Tracker download held open: landing and clicks queue, then flush in order when aa.track appears.
const qp = await ctx.newPage();
let releaseHold;
const hold = new Promise((resolve) => { releaseHold = resolve; });
await qp.route('https://api.agentanalytics.sh/**', async (route) => { await hold; await route.abort(); });
await qp.addInitScript(() => { window.__aaEvents = []; });
await qp.goto(base + `/#c=${some.slug}`, { waitUntil: 'domcontentloaded' });
await qp.evaluate(() => { for (var i = 0; i < 40; i++) document.querySelector('[data-filter="all"]').click(); });
check('events wait while the tracker is still loading', (await aaEvents(qp)).length === 0 && (await qp.evaluate(() => window.aa)) == null);
await qp.evaluate(() => { window.aa = { track: (name, props) => { window.__aaEvents.push({ name, props }); } }; });
await qp.waitForTimeout(400);
const flushed = await aaEvents(qp);
check('queued landing flushes before later clicks', flushed.length === 32 && flushed[0].name === 'category_filtered' && flushed[0].props.source === 'link' && flushed[0].props.category === some.slug && flushed[0].props.results_count === some.count && flushed[1].props.source === 'click' && flushed[1].props.category === 'all' && flushed[1].props.results_count === d.entries.length && flushed.every((ev, i) => i === 0 || (ev.props.source === 'click' && ev.props.category === 'all')));
releaseHold();
await qp.close();

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
