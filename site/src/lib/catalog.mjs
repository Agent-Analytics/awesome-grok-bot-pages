import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function findReadme() {
  const candidates = [
    path.resolve(process.cwd(), '../README.md'),
    path.resolve(process.cwd(), 'README.md'),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../README.md'),
  ];
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    const text = readFileSync(candidate, 'utf8');
    if (text.includes('## Latest Additions')) return candidate;
  }
  throw new CatalogError(
    `Could not find the awesome-list README.md (a file with "## Latest Additions"). Looked in:\n${candidates.map((item) => `  - ${item}`).join('\n')}`,
  );
}

const GET_LISTED_TITLE = 'Create your Page and get listed';
const LATEST_TITLE = 'Latest Additions';

export class CatalogError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CatalogError';
  }
}

export function loadCatalog() {
  const readmePath = findReadme();
  return parseReadme(readFileSync(readmePath, 'utf8'));
}

export function parseReadme(markdown) {
  if (typeof markdown !== 'string' || !markdown.trim()) {
    throw new CatalogError('README is empty.');
  }

  const sections = splitSections(markdown);
  if (!sections.length) {
    throw new CatalogError('README has no ## sections.');
  }

  const latest = sections.find((section) => section.title === LATEST_TITLE);
  if (!latest) {
    throw new CatalogError(`README is missing "## ${LATEST_TITLE}".`);
  }

  const getListed = sections.find((section) => section.title === GET_LISTED_TITLE);
  if (!getListed) {
    throw new CatalogError(`README is missing "## ${GET_LISTED_TITLE}".`);
  }

  const listing = parseGetListed(getListed.body);
  const byIdentity = new Map();
  const bySlug = new Map();
  const latestSlugs = [];

  const latestEntries = parseListingSection(markdown, latest, { kind: 'latest' });
  for (const entry of latestEntries) {
    const page = insertPage(byIdentity, bySlug, entry, { fromLatest: true });
    latestSlugs.push(page.slug);
  }

  const latestIndex = sections.findIndex((section) => section.title === LATEST_TITLE);
  const getListedIndex = sections.findIndex((section) => section.title === GET_LISTED_TITLE);
  if (getListedIndex < latestIndex) {
    throw new CatalogError(`"## ${GET_LISTED_TITLE}" must come after "## ${LATEST_TITLE}".`);
  }

  const categories = [];
  for (const section of sections.slice(latestIndex + 1, getListedIndex)) {
    const category = {
      title: section.title,
      slug: slugify(section.title),
      description: '',
      maintainersPick: null,
      pages: [],
    };
    if (categories.some((item) => item.slug === category.slug)) {
      throw new CatalogError(`Duplicate category "${section.title}".`);
    }

    const entries = parseListingSection(markdown, section, { kind: 'category' });
    const prose = proseBeforeListings(section.body, section.title);
    const parsedProse = parseProse(prose, section.title);
    category.description = parsedProse.description;
    if (parsedProse.maintainers) {
      category.maintainersPick = {
        segments: parseInline(parsedProse.maintainers, listing.repo, `${section.title} maintainers' pick`),
      };
    }

    for (const entry of entries) {
      const page = insertPage(byIdentity, bySlug, entry, { category });
      category.pages.push(page.slug);
    }
    categories.push(category);
  }

  if (!categories.length) {
    throw new CatalogError(`README has no category sections between "${LATEST_TITLE}" and "${GET_LISTED_TITLE}".`);
  }

  for (const page of byIdentity.values()) {
    if (!page.categorySlug) {
      throw new CatalogError(
        `"${page.title}" is in Latest Additions but not in a category section. Add it under a category, or remove it from Latest Additions.`,
      );
    }
  }

  const orderedSlugs = [];
  const seen = new Set();
  for (const slug of latestSlugs) {
    if (!seen.has(slug)) {
      orderedSlugs.push(slug);
      seen.add(slug);
    }
  }
  for (const category of categories) {
    for (const slug of category.pages) {
      if (!seen.has(slug)) {
        orderedSlugs.push(slug);
        seen.add(slug);
      }
    }
  }

  const pages = orderedSlugs.map((slug) => bySlug.get(slug));
  const featuredSlug = latestSlugs[0] ?? null;
  for (const page of pages) {
    page.featured = page.slug === featuredSlug;
  }

  return {
    pages,
    bySlug: Object.fromEntries(pages.map((page) => [page.slug, page])),
    latest: latestSlugs,
    featuredSlug,
    categories: categories.map((category) => ({
      ...category,
      empty: category.pages.length === 0,
    })),
    steps: listing.steps,
    note: listing.note,
    snippet: listing.snippet,
    links: listing.links,
  };
}

function splitSections(markdown) {
  const matches = [...markdown.matchAll(/^## (.+)$/gm)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length + 1;
    const end = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
    return {
      title: match[1].trim(),
      body: markdown.slice(start, end),
      bodyStart: start,
    };
  });
}

function parseGetListed(body) {
  const steps = [...body.matchAll(/^\d+\.\s+(.+)$/gm)].map((match) => match[1].trim());
  if (steps.length < 4) {
    throw new CatalogError(
      `"${GET_LISTED_TITLE}" needs at least 4 numbered steps. Found ${steps.length}.`,
    );
  }

  const fence = body.match(/```text\r?\n([\s\S]*?)```/);
  if (!fence) {
    throw new CatalogError(`"${GET_LISTED_TITLE}" is missing the \`\`\`text snippet.`);
  }
  const snippet = dedent(fence[1]);
  if (!snippet.includes('Awesome Grok Bot Pages')) {
    throw new CatalogError('Get-listed snippet does not mention Awesome Grok Bot Pages.');
  }

  const repoMatch = snippet.match(/https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/);
  if (!repoMatch) {
    throw new CatalogError('Get-listed snippet is missing the GitHub repository URL.');
  }
  const repo = repoMatch[0];

  const noteMatch = body.match(/^Before you make a Page public[\s\S]*?(?=\n```|\n###|\n## |$)/m);
  const note = noteMatch ? noteMatch[0].replace(/\s+/g, ' ').trim() : null;

  return {
    snippet,
    note,
    steps: steps.map((step, index) => parseInline(step, repo, `get-listed step ${index + 1}`)),
    repo,
    links: {
      repo,
      contributing: `${repo}/blob/main/CONTRIBUTING.md`,
      listingRules: `${repo}/blob/main/README.md#listing-rules`,
      license: `${repo}/blob/main/LICENSE`,
      compare: `${repo}/compare`,
      grokBot: 'https://x.ai/bot',
      agentAnalytics: 'https://agentanalytics.sh',
      agentAnalyticsDocs: 'https://docs.agentanalytics.sh/installation/',
    },
  };
}

function parseListingSection(markdown, section, { kind }) {
  const { title, body } = section;
  const empty = /^No Pages yet\.\s+\[Add yours\]\([^)]+\)\.\s*$/m.test(body);
  const entryMatches = [...body.matchAll(/^- \[[^\]]+\]\(https:\/\/[^)]+\) - [\s\S]*?<\/details>/gm)];
  const bulletCount = (body.match(/^- \[[^\]]+\]\(/gm) || []).length;
  const detailsCount = (body.match(/<details>/g) || []).length;

  if (empty && entryMatches.length) {
    throw new CatalogError(
      `${title}: has both "No Pages yet" and entries. Remove the empty line when the first Page is added.`,
    );
  }
  if (!empty && entryMatches.length === 0) {
    throw new CatalogError(
      `${title}: expected Page entries or a line reading "No Pages yet. [Add yours](#create-your-page-and-get-listed).".`,
    );
  }
  if (bulletCount !== entryMatches.length || detailsCount !== entryMatches.length) {
    throw new CatalogError(
      `${title}: found ${bulletCount} entry links and ${detailsCount} <details> blocks, parsed ${entryMatches.length}. Check that each entry has one <details> prompt and that prompts do not contain "</details>".`,
    );
  }
  if (kind === 'latest' && empty) {
    return [];
  }

  return entryMatches.map((match) => {
    const line = markdown.slice(0, section.bodyStart + match.index).split('\n').length;
    return parseEntry(title, match[0], line);
  });
}

function proseBeforeListings(body, title) {
  const entryAt = body.search(/^- \[/m);
  const emptyAt = body.search(/^No Pages yet\./m);
  const cuts = [entryAt, emptyAt].filter((index) => index >= 0);
  if (!cuts.length) {
    throw new CatalogError(`${title}: missing entries and the empty-state line.`);
  }
  return body.slice(0, Math.min(...cuts));
}

function parseProse(prose, title) {
  const paragraphs = prose
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  let description = null;
  let maintainers = null;
  for (const paragraph of paragraphs) {
    if (/^Maintainers' pick:/.test(paragraph)) {
      if (maintainers) {
        throw new CatalogError(`${title}: more than one Maintainers' pick paragraph.`);
      }
      maintainers = paragraph;
      continue;
    }
    if (!description) {
      description = paragraph;
      continue;
    }
    throw new CatalogError(`${title}: unexpected extra paragraph: "${paragraph.slice(0, 100)}"`);
  }
  if (!description) {
    throw new CatalogError(`${title}: missing the one-line description under the heading.`);
  }
  return { description, maintainers };
}

function parseEntry(sectionTitle, block, line) {
  const where = `${sectionTitle}: line ${line}`;
  const newline = block.indexOf('\n');
  const firstLine = (newline === -1 ? block : block.slice(0, newline)).trim();
  const head = firstLine.match(/^- \[(?<title>[^\]]+)\]\((?<url>https:\/\/[^)\s]+)\) - (?<rest>.+)$/);
  if (!head) {
    throw new CatalogError(`${where}: entry must look like "- [Title](https://...) - One sentence. By Name ([@handle](https://...))."`);
  }

  const title = head.groups.title.trim();
  const url = head.groups.url;
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new CatalogError(`${where}: invalid URL "${url}".`);
  }
  if (parsedUrl.protocol !== 'https:') {
    throw new CatalogError(`${where}: URL must be https.`);
  }

  const parts = splitCredit(head.groups.rest, where);
  const summaryMatch = block.match(/<summary>([\s\S]*?)<\/summary>/);
  if (!summaryMatch) {
    throw new CatalogError(`${where}: missing <summary> in the prompt <details> block.`);
  }
  const fence = block.match(/```text\r?\n([\s\S]*?)```/);
  if (!fence) {
    throw new CatalogError(`${where}: prompt must be a \`\`\`text code block inside <details>.`);
  }
  const prompt = dedent(fence[1]);
  if (prompt.length < 40) {
    throw new CatalogError(`${where}: prompt is too short to be the prompt that built the Page.`);
  }

  const exampleData = /\(example data\)/i.test(parts.description);
  const summary = exampleData
    ? parts.description.replace(/\s*\(example data\)/gi, '').replace(/\s+/g, ' ').replace(/\s+\./g, '.').trim()
    : parts.description;

  return {
    title,
    url,
    host: parsedUrl.host,
    description: parts.description,
    summary,
    exampleData,
    inspired: parts.inspired ? parseInspired(parts.inspired, where) : null,
    author: parsePerson(parts.author, where),
    examplePageBy: parts.examplePageBy ? parsePerson(parts.examplePageBy, where) : null,
    prompt,
    promptSummary: parseSummary(summaryMatch[1], where),
    readmeLine: line,
    identity: identityOf(url),
  };
}

function splitCredit(rest, where) {
  let body = rest.trim();
  let examplePageBy = null;
  const example = body.match(/^(?<main>[\s\S]+?)\s+Example Page by (?<example>.+)$/);
  if (example && /\sBy\s/.test(example.groups.main)) {
    body = example.groups.main.trim();
    examplePageBy = example.groups.example.trim();
  }

  const by = body.match(/^(?<main>[\s\S]+?)\s+By (?<author>.+)$/);
  if (!by) {
    throw new CatalogError(`${where}: missing "By Name ([@handle](...))" credit.`);
  }

  let description = by.groups.main.trim();
  let inspired = null;
  const inspiredMatch = description.match(/^(?<desc>[\s\S]+?)\s+Inspired by (?<inspired>.+)$/);
  if (inspiredMatch) {
    description = inspiredMatch.groups.desc.trim();
    inspired = inspiredMatch.groups.inspired.trim();
  }
  if (!description) {
    throw new CatalogError(`${where}: missing the description before the credit.`);
  }
  return {
    description,
    inspired,
    author: by.groups.author.trim(),
    examplePageBy,
  };
}

function parsePerson(raw, where) {
  const text = raw.trim().replace(/\.$/, '');
  const match = text.match(/^(?<name>[^([]+?)\s+\((?<handles>.+)\)$/);
  if (!match) {
    throw new CatalogError(
      `${where}: could not parse credit "${raw}". Expected "Name ([@handle](https://...))".`,
    );
  }
  const name = match.groups.name.trim();
  if (!name) {
    throw new CatalogError(`${where}: credit is missing a name.`);
  }
  const handles = parseHandles(match.groups.handles, where, raw);
  return { name, handles };
}

function parseInspired(raw, where) {
  const text = raw.trim().replace(/\.$/, '');
  const links = [...text.matchAll(/\[(?<label>[^\]]+)\]\((?<url>https:\/\/[^)\s]+)\)/g)];
  if (!links.length) {
    throw new CatalogError(`${where}: "Inspired by" needs a link.`);
  }
  let source = null;
  const handles = [];
  for (const link of links) {
    if (link.groups.label.startsWith('@')) {
      handles.push(handleFrom(link.groups.label.slice(1), link.groups.url));
    } else if (!source) {
      source = { label: link.groups.label, url: link.groups.url };
    }
  }
  if (!source) {
    throw new CatalogError(`${where}: "Inspired by" is missing the source link (a title, not only an @handle).`);
  }
  return { ...source, handles };
}

function parseHandles(raw, where, original) {
  const links = [...raw.matchAll(/\[@(?<handle>[^\]]+)\]\((?<url>https:\/\/[^)\s]+)\)/g)];
  if (!links.length) {
    throw new CatalogError(`${where}: credit "${original}" needs a GitHub or X handle.`);
  }
  const leftover = raw
    .replace(/\[@[^\]]+\]\(https:\/\/[^)\s]+\)/g, '')
    .replace(/[,\s]/g, '');
  if (leftover) {
    throw new CatalogError(`${where}: unrecognized credit text "${leftover}" in "${original}".`);
  }
  return links.map((link) => handleFrom(link.groups.handle, link.groups.url));
}

function handleFrom(handle, url) {
  return { handle, url, network: networkName(url) };
}

function networkName(url) {
  const host = new URL(url).hostname.replace(/^www\./, '');
  if (host === 'github.com') return 'GitHub';
  if (host === 'x.com' || host === 'twitter.com') return 'X';
  if (host === 'youtube.com' || host === 'youtu.be') return 'YouTube';
  return host;
}

function parseSummary(summary, where) {
  const trimmed = summary.trim().replace(/\s+/g, ' ');
  if (!/^Prompt\b/.test(trimmed)) {
    throw new CatalogError(`${where}: <summary> must start with "Prompt".`);
  }
  const segments = [];
  const re = /<a href="(https?:\/\/[^"]+)">([^<]+)<\/a>/g;
  let last = 0;
  for (const match of trimmed.matchAll(re)) {
    if (match.index > last) {
      segments.push({ type: 'text', value: trimmed.slice(last, match.index) });
    }
    segments.push({ type: 'link', text: match[2], href: match[1] });
    last = match.index + match[0].length;
  }
  if (last < trimmed.length) {
    segments.push({ type: 'text', value: trimmed.slice(last) });
  }
  const plain = segments.filter((segment) => segment.type === 'text').map((segment) => segment.value).join('');
  if (/[<>]/.test(plain)) {
    throw new CatalogError(`${where}: unsupported HTML in the prompt summary. Only <a href="https://..."> is allowed.`);
  }
  return segments;
}

function parseInline(text, repo, where) {
  const source = text.replace(/\s+/g, ' ').trim();
  const segments = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;
  let last = 0;
  for (const match of source.matchAll(re)) {
    if (match.index > last) {
      segments.push({ type: 'text', value: source.slice(last, match.index) });
    }
    if (match[3] != null) {
      segments.push({ type: 'code', value: match[3] });
    } else {
      segments.push({ type: 'link', text: match[1], href: resolveHref(match[2], repo, where) });
    }
    last = match.index + match[0].length;
  }
  if (last < source.length) {
    segments.push({ type: 'text', value: source.slice(last) });
  }
  if (!segments.length) {
    throw new CatalogError(`${where}: empty text.`);
  }
  return segments;
}

function resolveHref(href, repo, where) {
  if (href.startsWith('#')) return `${repo}/blob/main/README.md${href}`;
  if (href.startsWith('./')) return `${repo}/blob/main/${href.slice(2)}`;
  if (href.startsWith('https://') || href.startsWith('http://')) return href;
  throw new CatalogError(`${where}: unsupported link "${href}".`);
}

function insertPage(byIdentity, bySlug, entry, { fromLatest = false, category = null } = {}) {
  const existing = byIdentity.get(entry.identity);
  if (!existing) {
    const slug = slugify(entry.title);
    if (bySlug.has(slug)) {
      throw new CatalogError(`"${entry.title}" and "${bySlug.get(slug).title}" share the slug "${slug}".`);
    }
    const page = {
      ...entry,
      slug,
      categorySlug: category?.slug ?? null,
      categoryTitle: category?.title ?? null,
      featured: false,
    };
    byIdentity.set(entry.identity, page);
    bySlug.set(slug, page);
    return page;
  }

  if (fromLatest) {
    throw new CatalogError(`"${entry.title}" is listed twice in Latest Additions.`);
  }
  assertSameEntry(existing, entry);
  if (category) {
    if (existing.categorySlug === category.slug) {
      throw new CatalogError(`"${entry.title}" is listed twice in ${category.title}.`);
    }
    if (existing.categorySlug && existing.categorySlug !== category.slug) {
      throw new CatalogError(
        `"${entry.title}" is listed in both "${existing.categoryTitle}" and "${category.title}". Keep a Page in one category.`,
      );
    }
    existing.categorySlug = category.slug;
    existing.categoryTitle = category.title;
  }
  return existing;
}

function assertSameEntry(existing, entry) {
  const fields = [
    ['title', existing.title, entry.title],
    ['description', normalizeSpace(existing.description), normalizeSpace(entry.description)],
    ['prompt', existing.prompt, entry.prompt],
    ['author', JSON.stringify(existing.author), JSON.stringify(entry.author)],
    ['inspired', JSON.stringify(existing.inspired), JSON.stringify(entry.inspired)],
    ['examplePageBy', JSON.stringify(existing.examplePageBy), JSON.stringify(entry.examplePageBy)],
  ];
  for (const [name, left, right] of fields) {
    if (left !== right) {
      const at = firstDiff(String(left), String(right));
      throw new CatalogError(
        `"${existing.title}" disagrees between Latest Additions and its category (${name} differs near: "${String(right).slice(Math.max(0, at - 24), at + 24)}"). Keep both copies identical.`,
      );
    }
  }
}

function dedent(text) {
  const trimmed = text.replace(/^\r?\n/, '').replace(/[ \t]*$/, '');
  const lines = trimmed.split('\n');
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^[ \t]*/)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines
    .map((line) => (line.trim().length === 0 ? '' : line.slice(min)))
    .join('\n')
    .trim();
}

function identityOf(url) {
  const parsed = new URL(url);
  parsed.hash = '';
  parsed.search = '';
  if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }
  return parsed.toString();
}

export function slugify(title) {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) throw new CatalogError(`Cannot make a URL slug from "${title}".`);
  return slug;
}

export function initials(name) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function metaDescription(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= 155) return clean;
  const cut = clean.slice(0, 152);
  const space = cut.lastIndexOf(' ');
  const base = space > 90 ? cut.slice(0, space) : cut;
  return `${base}...`;
}

function normalizeSpace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function firstDiff(left, right) {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) return index;
  }
  return length;
}
