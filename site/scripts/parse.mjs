// Parses ../README.md into site data: categories, entries, snippet, dashboard note.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const README = path.resolve(here, '../../README.md');
export const REPO = 'https://github.com/Agent-Analytics/awesome-grok-bot-pages';

export const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const mdLinks = (s) => [...s.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => ({ text: m[1], url: m[2] }));
const stripMd = (s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`([^`]+)`/g, '$1').trim();
const handleOf = (l) => {
  const host = new URL(l.url).hostname.replace(/^www\./, '');
  const platform = host === 'x.com' || host === 'twitter.com' ? 'X' : host === 'github.com' ? 'GitHub' : host;
  return { handle: l.text, url: l.url, platform };
};
// "Name ([@a](url), [@b](url))" -> { name, handles }
const person = (s) => {
  const m = s.trim().match(/^([^([]+?)\s*\((.*)\)\s*$/);
  if (!m) return { name: stripMd(s), handles: [] };
  return { name: m[1].trim(), handles: mdLinks(m[2]).map(handleOf) };
};

function sections(md) {
  const out = [];
  const parts = md.split(/^## /m).slice(1);
  for (const p of parts) {
    const nl = p.indexOf('\n');
    out.push({ title: p.slice(0, nl).trim(), body: p.slice(nl + 1) });
  }
  return out;
}

function parseEntries(body) {
  const entries = [];
  const re = /^- \[([^\]]+)\]\(([^)]+)\) - (.+)\n([\s\S]*?)(?=^- \[|(?![\s\S]))/gm;
  for (const m of body.matchAll(re)) {
    const [, title, url, line, rest] = m;
    const sum = rest.match(/<summary>([\s\S]*?)<\/summary>/);
    const code = rest.match(/```text\n([\s\S]*?)```/);
    if (!code) throw new Error(`No prompt block for ${title}`);
    const prompt = code[1].split('\n').map((l) => l.replace(/^ {2}/, '')).join('\n').trim();
    const rcode = rest.match(/<summary>Routine prompt[^<]*<\/summary>\s*```text\n([\s\S]*?)```/);
    const routine = rcode ? rcode[1].split('\n').map((l) => l.replace(/^ {2}/, '')).join('\n').trim() : null;
    let promptSource = null;
    if (sum) {
      const a = sum[1].match(/^Prompt \(([^,]+), from <a href="([^"]+)">([^<]+)<\/a>\)/);
      if (a) promptSource = { by: a[1].trim(), url: a[2], text: a[3] };
    }
    // split the entry line into description, Inspired by, By, Example Page by
    const marks = [...line.matchAll(/(?:^|\.\s)(Inspired by |By |Example Page by )/g)];
    const desc = (marks.length ? line.slice(0, marks[0].index + 1) : line).trim();
    let inspired = null, by = [], pageBy = null;
    marks.forEach((mk, i) => {
      const start = mk.index + mk[0].length;
      const end = i + 1 < marks.length ? marks[i + 1].index + 1 : line.length;
      const seg = line.slice(start, end).trim().replace(/\.$/, '');
      if (mk[1] === 'Inspired by ') {
        const links = mdLinks(seg);
        inspired = { source: links[0], handles: links.slice(1).map(handleOf) };
      } else if (mk[1] === 'By ') by = seg.split(/\),\s*(?=[A-Z])/).map((s, j, a) => person(j < a.length - 1 ? s + ')' : s));
      else pageBy = person(seg);
    });
    const exampleData = /\(example data\)/i.test(desc);
    const description = stripMd(desc).replace(/\s*\(example data\)/i, '').replace(/\s+\./g, '.');
    const short = description.match(/^.*?\.(?=\s|$)/)?.[0] ?? description;
    entries.push({ title, slug: slugify(title), url, description, short, exampleData, inspired, by, pageBy, prompt, routine, promptSource });
  }
  return entries;
}

export function parse() {
  const md = fs.readFileSync(README, 'utf8');
  const secs = sections(md);
  const latestSec = secs.find((s) => s.title === 'Latest Additions');
  const createIdx = secs.findIndex((s) => s.title.startsWith('Create your Page'));
  const latestIdx = secs.indexOf(latestSec);
  const catSecs = secs.slice(latestIdx + 1, createIdx);
  const bySlug = new Map();
  const categories = catSecs.map((s) => {
    const blurb = s.body.trim().split('\n')[0].trim();
    const entries = parseEntries(s.body);
    for (const e of entries) {
      const prev = bySlug.get(e.slug);
      if (prev) prev.categories.push(s.title);
      else bySlug.set(e.slug, { ...e, categories: [s.title] });
    }
    return { name: s.title, slug: slugify(s.title), blurb, count: entries.length };
  });
  // Order: Latest Additions first (newest first), then anything else in README order.
  const latest = parseEntries(latestSec.body).map((e) => e.slug);
  const order = [...latest, ...[...bySlug.keys()].filter((k) => !latest.includes(k))];
  const entries = order.filter((k) => bySlug.has(k)).map((k) => bySlug.get(k));
  for (const k of latest) if (!bySlug.has(k)) console.warn(`Latest entry ${k} is not in any category section`);

  const create = secs[createIdx].body;
  const snippet = create.match(/```text\n([\s\S]*?)```/)[1].trim();
  const steps = [...create.split('```')[0].matchAll(/^\d+\.\s+(.+)$/gm)].map((m) => m[1]);
  const notice = create.split('```')[0].split('\n').find((l) => l.startsWith('Before you make'))?.trim();
  const dash = create.match(/### Need data for a dashboard\?\n\n([^\n]+)/)?.[1];
  const intro = md.match(/^> (.+)$/m)?.[1];
  return { repo: REPO, intro, categories, entries, snippet, steps, notice, dashboardNote: dash };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(parse(), null, 2));
