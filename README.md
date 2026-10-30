# Awesome Grok Bot Pages [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated list of public Grok Bot Pages: dashboards, trackers, tools and reports built with Grok Bot.

Browse the list at [grokbotpages.com](https://grokbotpages.com/), with a screenshot and a copyable prompt for every Page.

[Contributing](./CONTRIBUTING.md)

Grok Bot Pages are interactive pages that Grok Bot builds and hosts. This list collects Pages that anyone can open without signing in and that work for a stranger with no context: real data or a working control, no placeholder text, and no private details. Every entry credits its author and includes the prompt used to build it. Sections follow the Grok Bot plugin categories.

## Contents

- [Latest Additions](#latest-additions)
- [Mission Control](#mission-control)
- [Productivity](#productivity)
- [Data Analytics](#data-analytics)
- [Infrastructure](#infrastructure)
- [Agent Orchestration](#agent-orchestration)
- [Bot Management](#bot-management)
- [Payments and Finance](#payments-and-finance)
- [Sales](#sales)
- [Marketing](#marketing)
- [Inbox and Collaboration](#inbox-and-collaboration)
- [Research](#research)
- [Design](#design)
- [Documents and Files](#documents-and-files)
- [Scheduling and Support](#scheduling-and-support)
- [Create your Page and get listed](#create-your-page-and-get-listed)
  - [Need data for a dashboard?](#need-data-for-a-dashboard)
  - [Example prompt: Site analytics dashboard](#example-prompt-site-analytics-dashboard)
- [Listing rules](#listing-rules)
- [Entry format](#entry-format)
- [Contributing](#contributing)

## Latest Additions

Newest listings, also shown in their section.

- [Side Project Mission Control](https://side-project-mission-control-example-zxug.pages.grok.bot/) - One screen for a solo builder running a product with bots: site and deploy status, today's key numbers, a shipping queue, bot activity and a ranked list of what needs you (example data). Inspired by [Alex Finn's video](https://youtu.be/Nk242TnA7-8). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/side-project-mission-control/](https://grokbotpages.com/t/side-project-mission-control/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Side Project Mission Control" for the product I run with my bots. Use whatever I have connected: GitHub (or my git host) for open PRs, the last deploy and CI, my analytics (for example the Agent Analytics MCP) for visits, signups and clicks on my main call-to-action, my uptime or error tracker if I have one, and my bots and routines for the activity feed. At the top, show a status strip: is the site up, the last deploy and whether it passed, open PRs with how many wait on me or fail CI, and new errors in the last 24 hours. Then show today's key numbers (visits, signups, CTA clicks) with a sparkline each, today's value and the change against the 7-day average, with a switch between 14 days and 24 hours and a hover readout. Then a "Needs you" list ranked by urgency: each item says which bot asks, what to do in one line, where to do it, about how long it takes, a Why toggle, and a "Hide here" button that only hides it on the Page (say so next to it); add a sort for most urgent or quickest first. Then a shipping queue in three columns, In review, Blocked and Done this week, with an area filter, a Show done toggle and a Details toggle per item. End with a bot activity feed filterable by bot. Every control must really work on the Page; no buttons that do nothing. Anything not connected shows as empty. Then create a routine that refreshes the Page every weekday morning.
  ```

  </details>

- [Decisions Console](https://decisions-console-example-cblp.pages.grok.bot/) - Only the decisions your bots are waiting on you for, ranked by due time, money at stake and age, with division goal gauges, a bot roster and a stale-items log. Filter, sort, open details and hide items; on your own copy each item gets an Open chat link to the asking bot (example data). Inspired by [Jordan Rafealov's video](https://www.youtube.com/watch?v=UClMrBShiYc) ([@JordanRafealov](https://x.com/JordanRafealov)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/decisions-console/](https://grokbotpages.com/t/decisions-console/).
  <details><summary>Prompt</summary>

  ```text
  Build me a Grok Bot Page called "Decisions Console" that shows only what needs me. You are my chief of staff: collect every decision my bots are waiting on me for. At the top, show a goal gauge for each of my divisions or main goals, with the goal, today's number, the target and the date. In the middle, show a "Waiting on you" queue ranked by due time, then money at stake, then age. Each item shows the asking bot, the decision in one line, when it is due and how long it has waited. Give each item an "Open chat" link to the asking bot: a plain <a> with target="_top" and href grokbot://app/v1/agent?id=<that bot's id>. Also give it a Details toggle with the reason and the source, and a "Mark done" button. A Page can't answer a bot, so Mark done only hides the item on the Page, and the Page must say so next to the buttons. Add a filter by division and a sort by due time, age or money. On the side, list my bots by division with a status dot (working, waiting on me, idle) and a short log of anything waiting over 72 hours. At the bottom, show bots working, waiting on me, cleared today with my streak, and a countdown to the next routine. Use only real data from my bots and routines. If something is missing, show "unknown" instead of guessing. Then create a routine that refreshes this Page every hour on weekdays. If I want to share it, make a separate copy with mock data and label it example data.
  ```

  </details>

- [Bot Org Chart](https://bot-org-chart-example-ujfc.pages.grok.bot/) - An org chart of your bots: you at the top, Grok Bot as the chief of staff you talk to, the specialist bots it delegates to, their routines and status, and dashed hand-offs between them (example data). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-org-chart/](https://grokbotpages.com/t/bot-org-chart/).
  <details><summary>Prompt</summary>

  ```text
  Make me a Grok Bot Page called "Bot Org Chart" that shows how my bots are organized. Put me at the top. Under me put my main Grok Bot, labeled "Chief of staff": it is the bot I talk to, and it delegates work to my specialist bots. Draw an arrow from it to each specialist bot. Draw a dashed line between two bots only where one really hands work to the other, and list those hand-offs under the chart. Give each bot a simple blob avatar with two eyes, in the same shape and color as in my bot list, a one-line role, its routines with schedule and whether each is on or paused, its status (working, idle or waiting on me), and an Open chat link: a plain <a> with target="_top" and href grokbot://app/v1/agent?id=<that bot's id>. Fill it from my real bots, their descriptions and their routines, and don't invent anything. Add a routine that refreshes the Page every day at 8:00. If I want to share it, make a separate copy with mock bots and mock data, with no names, emails or other personal details, and label it example data.
  ```

  </details>

- [Mission Control](https://mission-control-example-sgmr.pages.grok.bot/) - One Page showing what each bot is doing, what waits on you, and which routines run next (example data). Inspired by [Alex Finn's video](https://youtu.be/Nk242TnA7-8). By Alex Finn ([@AlexFinn](https://x.com/AlexFinn)). Example Page by Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/mission-control/](https://grokbotpages.com/t/mission-control/).
  <details><summary>Prompt (Alex Finn, from <a href="https://x.com/AlexFinn/status/2115612249826148795">his post on X</a>)</summary>

  ```text
  Build me a dashboard Page called "Mission Control" that shows what all my bots are doing. Refresh it every hour on weekdays with a routine.

  Layout:
  1. Top bar: a live clock and 3–5 stat cards for numbers I care about (ask me which ones, then pull them from my connected accounts).
  2. Left column, "Waiting on me": every open question or approval my bots are waiting on me for, newest first. Each item gets an Open button that jumps straight to that bot's chat, and an eye button that blurs it so I can keep it private on camera.
  3. Middle, "Activity timeline": tasks my bots finished, newest first, with each bot's picture and a one-line plain-English summary.
  4. Right column, "Upcoming routines": my scheduled routines with their next run time and which bot owns each one.
  5. Top of everything "The office": a fun 2D top-down office. Bots that are working sit at desks typing, with a little speech bubble saying what they're on. Idle bots wander around. Add a heatmap of activity by hour for the last 7 days.

  Use only real data from my bots, routines and accounts. If something is missing, show it as empty instead of making it up. Make it dark and clean.
  ```

  </details>

- [Site Analytics Dashboard](https://site-analytics-dashboard-example-xahy.pages.grok.bot/) - One dashboard of daily visits, signups and landing conversion, built from Agent Analytics data (example data). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/site-analytics-dashboard/](https://grokbotpages.com/t/site-analytics-dashboard/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Page called "Site Analytics Dashboard (example)" with realistic mock data for three fictional sites: acme-notes.app, Acme blog and Acme docs. For each site, show a card with total visits for the last 7 days as a big number, a one-line note comparing this week to the 30-day daily average, and a daily visits line chart over 30 days with a dashed 7-day average. Add a weekly signups columns card and a landing visitors to Start free clicks to signups funnel card. Label every card "Agent Analytics (example data)" and say once in the summary that all data is example data. End with a "Why Agent Analytics for this dashboard" section of 3 or 4 bullets taken from the agentanalytics.sh landing page, a "How to make this Page" section of steps (connect the Agent Analytics MCP, paste the prompt, ask for a daily refresh routine, share a mock-data copy), and a "Links" section of link cards for Agent Analytics (https://agentanalytics.sh), Grok Bot (https://x.ai/bot), Awesome Grok Bot Pages (https://github.com/Agent-Analytics/awesome-grok-bot-pages) and the setup guide (https://docs.agentanalytics.sh/installation/).
  ```

  </details>

## Mission Control

One screen for what your bots and projects are doing and what waits on you.

- [Mission Control](https://mission-control-example-sgmr.pages.grok.bot/) - One Page showing what each bot is doing, what waits on you, and which routines run next (example data). Inspired by [Alex Finn's video](https://youtu.be/Nk242TnA7-8). By Alex Finn ([@AlexFinn](https://x.com/AlexFinn)). Example Page by Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/mission-control/](https://grokbotpages.com/t/mission-control/).
  <details><summary>Prompt (Alex Finn, from <a href="https://x.com/AlexFinn/status/2115612249826148795">his post on X</a>)</summary>

  ```text
  Build me a dashboard Page called "Mission Control" that shows what all my bots are doing. Refresh it every hour on weekdays with a routine.

  Layout:
  1. Top bar: a live clock and 3–5 stat cards for numbers I care about (ask me which ones, then pull them from my connected accounts).
  2. Left column, "Waiting on me": every open question or approval my bots are waiting on me for, newest first. Each item gets an Open button that jumps straight to that bot's chat, and an eye button that blurs it so I can keep it private on camera.
  3. Middle, "Activity timeline": tasks my bots finished, newest first, with each bot's picture and a one-line plain-English summary.
  4. Right column, "Upcoming routines": my scheduled routines with their next run time and which bot owns each one.
  5. Top of everything "The office": a fun 2D top-down office. Bots that are working sit at desks typing, with a little speech bubble saying what they're on. Idle bots wander around. Add a heatmap of activity by hour for the last 7 days.

  Use only real data from my bots, routines and accounts. If something is missing, show it as empty instead of making it up. Make it dark and clean.
  ```

  </details>

- [Side Project Mission Control](https://side-project-mission-control-example-zxug.pages.grok.bot/) - One screen for a solo builder running a product with bots: site and deploy status, today's key numbers, a shipping queue, bot activity and a ranked list of what needs you (example data). Inspired by [Alex Finn's video](https://youtu.be/Nk242TnA7-8). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/side-project-mission-control/](https://grokbotpages.com/t/side-project-mission-control/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Side Project Mission Control" for the product I run with my bots. Use whatever I have connected: GitHub (or my git host) for open PRs, the last deploy and CI, my analytics (for example the Agent Analytics MCP) for visits, signups and clicks on my main call-to-action, my uptime or error tracker if I have one, and my bots and routines for the activity feed. At the top, show a status strip: is the site up, the last deploy and whether it passed, open PRs with how many wait on me or fail CI, and new errors in the last 24 hours. Then show today's key numbers (visits, signups, CTA clicks) with a sparkline each, today's value and the change against the 7-day average, with a switch between 14 days and 24 hours and a hover readout. Then a "Needs you" list ranked by urgency: each item says which bot asks, what to do in one line, where to do it, about how long it takes, a Why toggle, and a "Hide here" button that only hides it on the Page (say so next to it); add a sort for most urgent or quickest first. Then a shipping queue in three columns, In review, Blocked and Done this week, with an area filter, a Show done toggle and a Details toggle per item. End with a bot activity feed filterable by bot. Every control must really work on the Page; no buttons that do nothing. Anything not connected shows as empty. Then create a routine that refreshes the Page every weekday morning.
  ```

  </details>

## Productivity

Planners, trackers and task boards.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Data Analytics

Dashboards and metrics.

Maintainers' pick: dashboards pair well with [Agent Analytics](https://agentanalytics.sh), which has an MCP server (`https://mcp.agentanalytics.sh/mcp`) so Grok Bot can pull real site stats into a Page. [Setup guide](https://docs.agentanalytics.sh/installation/). Any analytics provider is welcome.

- [Site Analytics Dashboard](https://site-analytics-dashboard-example-xahy.pages.grok.bot/) - One dashboard of daily visits, signups and landing conversion, built from Agent Analytics data (example data). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/site-analytics-dashboard/](https://grokbotpages.com/t/site-analytics-dashboard/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Page called "Site Analytics Dashboard (example)" with realistic mock data for three fictional sites: acme-notes.app, Acme blog and Acme docs. For each site, show a card with total visits for the last 7 days as a big number, a one-line note comparing this week to the 30-day daily average, and a daily visits line chart over 30 days with a dashed 7-day average. Add a weekly signups columns card and a landing visitors to Start free clicks to signups funnel card. Label every card "Agent Analytics (example data)" and say once in the summary that all data is example data. End with a "Why Agent Analytics for this dashboard" section of 3 or 4 bullets taken from the agentanalytics.sh landing page, a "How to make this Page" section of steps (connect the Agent Analytics MCP, paste the prompt, ask for a daily refresh routine, share a mock-data copy), and a "Links" section of link cards for Agent Analytics (https://agentanalytics.sh), Grok Bot (https://x.ai/bot), Awesome Grok Bot Pages (https://github.com/Agent-Analytics/awesome-grok-bot-pages) and the setup guide (https://docs.agentanalytics.sh/installation/).
  ```

  </details>

## Infrastructure

Uptime, deploys and cloud costs.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Agent Orchestration

Decisions your bots are waiting on you for.

- [Decisions Console](https://decisions-console-example-cblp.pages.grok.bot/) - Only the decisions your bots are waiting on you for, ranked by due time, money at stake and age, with division goal gauges, a bot roster and a stale-items log. Filter, sort, open details and hide items; on your own copy each item gets an Open chat link to the asking bot (example data). Inspired by [Jordan Rafealov's video](https://www.youtube.com/watch?v=UClMrBShiYc) ([@JordanRafealov](https://x.com/JordanRafealov)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/decisions-console/](https://grokbotpages.com/t/decisions-console/).
  <details><summary>Prompt</summary>

  ```text
  Build me a Grok Bot Page called "Decisions Console" that shows only what needs me. You are my chief of staff: collect every decision my bots are waiting on me for. At the top, show a goal gauge for each of my divisions or main goals, with the goal, today's number, the target and the date. In the middle, show a "Waiting on you" queue ranked by due time, then money at stake, then age. Each item shows the asking bot, the decision in one line, when it is due and how long it has waited. Give each item an "Open chat" link to the asking bot: a plain <a> with target="_top" and href grokbot://app/v1/agent?id=<that bot's id>. Also give it a Details toggle with the reason and the source, and a "Mark done" button. A Page can't answer a bot, so Mark done only hides the item on the Page, and the Page must say so next to the buttons. Add a filter by division and a sort by due time, age or money. On the side, list my bots by division with a status dot (working, waiting on me, idle) and a short log of anything waiting over 72 hours. At the bottom, show bots working, waiting on me, cleared today with my streak, and a countdown to the next routine. Use only real data from my bots and routines. If something is missing, show "unknown" instead of guessing. Then create a routine that refreshes this Page every hour on weekdays. If I want to share it, make a separate copy with mock data and label it example data.
  ```

  </details>

## Bot Management

Org charts, roles and hand-offs between your bots.

- [Bot Org Chart](https://bot-org-chart-example-ujfc.pages.grok.bot/) - An org chart of your bots: you at the top, Grok Bot as the chief of staff you talk to, the specialist bots it delegates to, their routines and status, and dashed hand-offs between them (example data). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-org-chart/](https://grokbotpages.com/t/bot-org-chart/).
  <details><summary>Prompt</summary>

  ```text
  Make me a Grok Bot Page called "Bot Org Chart" that shows how my bots are organized. Put me at the top. Under me put my main Grok Bot, labeled "Chief of staff": it is the bot I talk to, and it delegates work to my specialist bots. Draw an arrow from it to each specialist bot. Draw a dashed line between two bots only where one really hands work to the other, and list those hand-offs under the chart. Give each bot a simple blob avatar with two eyes, in the same shape and color as in my bot list, a one-line role, its routines with schedule and whether each is on or paused, its status (working, idle or waiting on me), and an Open chat link: a plain <a> with target="_top" and href grokbot://app/v1/agent?id=<that bot's id>. Fill it from my real bots, their descriptions and their routines, and don't invent anything. Add a routine that refreshes the Page every day at 8:00. If I want to share it, make a separate copy with mock bots and mock data, with no names, emails or other personal details, and label it example data.
  ```

  </details>

## Payments and Finance

Spending, budgets, crypto and legal.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Sales

Pipelines and CRM views.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Marketing

Campaigns and growth reports.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Inbox and Collaboration

Mail and team digests.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Research

Explainers and sourced reports.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Design

Galleries, generative art and games.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Documents and Files

Memos and doc summaries.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Scheduling and Support

Calendars and tickets.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Create your Page and get listed

1. Build or open your Page in Grok Bot.
2. Paste the snippet below into the same chat.
3. Make the Page public with the share control on the Page.
4. Star [this repository](https://github.com/Agent-Analytics/awesome-grok-bot-pages). A star is required to get listed.
5. Open a pull request that adds your entry to the right section of this README, in the [entry format](#entry-format).

Before you make a Page public, swap any personal or business data for realistic mock data or public data.

```text
Get this Page ready to list on Awesome Grok Bot Pages. Remove any private details and placeholder text, and check that it works for a stranger with no context. At the bottom, add a "Made with Grok Bot" section with one line: "Listed on Awesome Grok Bot Pages: https://github.com/Agent-Analytics/awesome-grok-bot-pages". Then give me a one-sentence description for the listing and tell me how to make the Page public. If the Page shows personal or business data, make a public copy with realistic mock data instead. Also write a short, reusable prompt that would recreate this Page, without my private details. Then create a routine that refreshes this Page with fresh data on a schedule (for example daily).
```

### Need data for a dashboard?

[Agent Analytics](https://agentanalytics.sh) has an MCP server (`https://mcp.agentanalytics.sh/mcp`) so Grok Bot can pull real site stats into a Page. See the [setup guide](https://docs.agentanalytics.sh/installation/). Any analytics provider is welcome. Keep the private Page with real data for yourself and list a public copy with mock data.

### Example prompt: Site analytics dashboard

```text
Build me a wide Page called "Site analytics dashboard". Use the Agent Analytics MCP (https://mcp.agentanalytics.sh/mcp) to pull the last 30 days for each of my sites. For each site, show a card with total visits for the last 7 days as a big number, a one-line note comparing this week to the 30-day daily average, and a daily visits line chart with a dashed 7-day average. Add a weekly signups columns card and a landing visitors to Start free clicks to signups funnel card. Label every card with its data source. Then create a routine that refreshes this Page with fresh data every day at 8:00 AM.
```

## Listing rules

- The link is public and opens without signing in.
- Public Pages use mock or public data, never personal info.
- The Page contains no private data: no personal emails, names of private people, account IDs, inbox items or file paths.
- The Page follows the Grok Bot Pages content rules.
- The Page has real data or a working control, and no placeholder text.
- The entry credits a name plus a GitHub handle, an X handle, or both.
- The entry includes the prompt used to build the Page, with no private details.
- The contributor starred this repository before opening the pull request.
- The "Made with Grok Bot" backlink footer is strongly requested but not required.
- Pages that go private or get deleted are removed.

## Entry format

````markdown
- [Title](public page link) - One factual sentence. By Name ([@github](https://github.com/handle), [@x](https://x.com/handle)).
  Template page: [grokbotpages.com/t/slug/](https://grokbotpages.com/t/slug/).
  <details><summary>Prompt</summary>

  ```text
  The prompt used to build the Page.
  ```

  </details>
````

- A name is required, plus at least one of a GitHub handle or an X handle. Both are fine.
- The prompt block is required. Keep the blank line after `<summary>` and the two-space indentation so GitHub renders the code block inside it.
- An optional `Inspired by [source](url).` can go before `By`.
- The `Template page` line links the entry's page on grokbotpages.com. The slug is the title in lowercase with hyphens, for example `side-project-mission-control`. The page goes live once the pull request is merged.
- Keep the description to one factual sentence about what the Page shows or does.

## Contributing

Star this repository before opening your pull request. It is required to get listed.

Listing contributions only need to add an entry to `README.md`. New Pages may also appear in Latest Additions. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full review criteria.

## License

[CC0 1.0](./LICENSE)
