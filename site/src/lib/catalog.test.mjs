import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { CatalogError, parseReadme } from './catalog.mjs';

const readmePath = new URL('../../../README.md', import.meta.url);
const readme = readFileSync(readmePath, 'utf8');

const snippet = `Get this Page ready to list on Awesome Grok Bot Pages. See https://github.com/Agent-Analytics/awesome-grok-bot-pages for the list.`;

const prompt = `Build me a dashboard Page called "Mission Control" that shows what all my bots are doing. Refresh it every hour on weekdays with a routine.`;

function listed(entryLines) {
  return `## Latest Additions

Newest listings, also shown in their section.

${entryLines}

## Productivity

Planners, trackers and task boards.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Agent Orchestration

Mission controls and bot activity.

${entryLines}

## Create your Page and get listed

1. Build or open your Page in Grok Bot.
2. Paste the snippet below into the same chat.
3. Make the Page public with the share control on the Page.
4. Open a pull request, in the [entry format](#entry-format).

Before you make a Page public, swap any personal or business data for realistic mock data or public data.

\`\`\`text
${snippet}
\`\`\`
`;
}

const mission = `- [Mission Control](https://example.com/mission/) - What each bot is doing (example data). Inspired by [Alex Finn's video](https://youtu.be/Nk242TnA7-8). By Alex Finn ([@AlexFinn](https://x.com/AlexFinn)). Example Page by Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  <details><summary>Prompt (Alex Finn, from <a href="https://x.com/AlexFinn/status/1">his post on X</a>)</summary>

  \`\`\`text
  ${prompt}
  \`\`\`

  </details>`;

test('parses the repository README', () => {
  const catalog = parseReadme(readme);
  assert.ok(catalog.pages.length >= 4);
  assert.equal(catalog.featuredSlug, catalog.latest[0]);
  assert.equal(new Set(catalog.pages.map((page) => page.url)).size, catalog.pages.length);

  const titles = catalog.categories.map((category) => category.title);
  let last = -1;
  for (const name of ['Productivity', 'Data Analytics', 'Agent Orchestration', 'Bot Management', 'Scheduling and Support']) {
    const index = titles.indexOf(name);
    assert.ok(index > last, name);
    last = index;
  }

  assert.ok(catalog.categories.some((category) => category.empty));
  assert.ok(catalog.categories.some((category) => !category.empty));
  assert.ok(catalog.snippet.includes('Awesome Grok Bot Pages'));
  assert.ok(catalog.steps.length >= 4);
  assert.match(catalog.links.repo, /^https:\/\/github\.com\/Agent-Analytics\/awesome-grok-bot-pages$/);
  assert.equal(catalog.links.contributing, `${catalog.links.repo}/blob/main/CONTRIBUTING.md`);

  const missionPage = catalog.bySlug['mission-control'];
  assert.ok(missionPage);
  assert.equal(missionPage.author.name, 'Alex Finn');
  assert.equal(missionPage.author.handles[0].network, 'X');
  assert.equal(missionPage.examplePageBy.name, 'Danny Shmueli');
  assert.equal(missionPage.examplePageBy.handles[0].network, 'GitHub');
  assert.equal(missionPage.inspired.label, "Alex Finn's video");
  assert.equal(missionPage.categorySlug, 'agent-orchestration');
  assert.equal(missionPage.exampleData, true);
  assert.match(missionPage.prompt, /^Build me a dashboard Page called "Mission Control"/);
  assert.equal(missionPage.prompt.startsWith(' '), false);
  assert.ok(missionPage.promptSummary.some((segment) => segment.type === 'link' && segment.href.includes('x.com')));

  const decisions = catalog.bySlug['decisions-console'];
  assert.equal(decisions.inspired.handles[0].handle, 'JordanRafealov');
  assert.equal(decisions.author.name, 'Danny Shmueli');
  assert.equal(decisions.categorySlug, 'agent-orchestration');
  assert.equal(decisions.exampleData, true);
  assert.equal(decisions.summary.includes('(example data)'), false);

  const org = catalog.bySlug['bot-org-chart'];
  assert.equal(org.categorySlug, 'bot-management');
  assert.equal(org.inspired, null);
  assert.match(org.prompt, /Chief of staff/);

  const analytics = catalog.bySlug['site-analytics-dashboard'];
  assert.equal(analytics.categorySlug, 'data-analytics');
  const data = catalog.categories.find((category) => category.slug === 'data-analytics');
  assert.ok(data.maintainersPick.segments.some((segment) => segment.type === 'link' && segment.text === 'Agent Analytics'));
  assert.ok(data.pages.includes('site-analytics-dashboard'));

  for (const page of catalog.pages) {
    assert.ok(page.prompt.length > 40, page.slug);
    assert.ok(page.author.handles.length >= 1, page.slug);
    assert.ok(page.categorySlug, page.slug);
    assert.match(page.url, /^https:\/\//);
  }
});

test('parses a minimal catalog with credits, an empty category, and a maintainers pick', () => {
  const catalog = parseReadme(listed(mission));
  assert.equal(catalog.pages.length, 1);
  assert.equal(catalog.featuredSlug, 'mission-control');
  assert.equal(catalog.categories.find((category) => category.slug === 'productivity').empty, true);
  assert.equal(catalog.bySlug['mission-control'].host, 'example.com');
  assert.equal(catalog.note.startsWith('Before you make a Page public'), true);
  const step = catalog.steps[3];
  assert.ok(step.some((segment) => segment.type === 'link' && segment.href.endsWith('#entry-format')));
});

test('fails when an entry has no prompt block', () => {
  const broken = listed('- [Broken](https://example.com/broken) - A page. By Ada ([@ada](https://github.com/ada)).');
  assert.throws(() => parseReadme(broken), CatalogError);
});

test('fails when a category is both empty and filled', () => {
  const markdown = listed(mission).replace(
    'No Pages yet. [Add yours](#create-your-page-and-get-listed).',
    `No Pages yet. [Add yours](#create-your-page-and-get-listed).\n\n${mission}`,
  );
  assert.throws(() => parseReadme(markdown), /both "No Pages yet" and entries/);
});

test('fails when latest and category prompts disagree', () => {
  const other = mission.replace('Refresh it every hour', 'Refresh it every day');
  const markdown = `## Latest Additions

Newest listings, also shown in their section.

${mission}

## Productivity

Planners.

${other}

## Create your Page and get listed

1. One.
2. Two.
3. Three.
4. Four.

\`\`\`text
${snippet}
\`\`\`
`;
  assert.throws(() => parseReadme(markdown), /disagrees/);
});

test('fails when the credit line has no handle', () => {
  const bad = mission.replace('By Alex Finn ([@AlexFinn](https://x.com/AlexFinn)).', 'By Alex Finn.');
  assert.throws(() => parseReadme(listed(bad)), CatalogError);
});
