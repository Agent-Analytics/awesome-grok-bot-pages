# Awesome Grok Bot Pages [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated list of public Grok Bot Pages: dashboards, trackers, tools and reports built with Grok Bot.

[Contributing](./CONTRIBUTING.md)

Grok Bot Pages are interactive pages that Grok Bot builds and hosts. This list collects Pages that anyone can open without signing in and that work for a stranger with no context: real data or a working control, no placeholder text, and no private details. Every entry credits its author and includes the prompt used to build it. Sections follow the Grok Bot plugin categories.

## Contents

- [Latest Additions](#latest-additions)
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

- [Bot Org Chart](https://bot-org-chart-example-ujfc.pages.grok.bot/) - An org chart of your bots: you at the top, Grok Bot as the chief of staff you talk to, the specialist bots it delegates to, their routines and status, and dashed hand-offs between them (example data). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  <details><summary>Prompt</summary>

  ```text
  Make me a Grok Bot Page called "Bot Org Chart" that shows how my bots are organized. Put me at the top. Under me put my main Grok Bot, labeled "Chief of staff": it is the bot I talk to, and it delegates work to my specialist bots. Draw an arrow from it to each specialist bot. Draw a dashed line between two bots only where one really hands work to the other, and list those hand-offs under the chart. Give each bot a simple blob avatar with two eyes, in the same shape and color as in my bot list, a one-line role, its routines with schedule and whether each is on or paused, its status (working, idle or waiting on me), and a link to open its chat. Fill it from my real bots, their descriptions and their routines, and don't invent anything. Add a routine that refreshes the Page every day at 8:00. If I want to share it, make a separate copy with mock bots and mock data, with no names, emails or other personal details, and label it example data.
  ```

  </details>

- [Mission Control](https://mission-control-example-sgmr.pages.grok.bot/) - One Page showing what each bot is doing, what waits on you, and which routines run next (example data). Inspired by [Alex Finn's video](https://youtu.be/Nk242TnA7-8). By Alex Finn ([@AlexFinn](https://x.com/AlexFinn)). Example Page by Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
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
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Page called "Site Analytics Dashboard (example)" with realistic mock data for three fictional sites: acme-notes.app, Acme blog and Acme docs. For each site, show a card with total visits for the last 7 days as a big number, a one-line note comparing this week to the 30-day daily average, and a daily visits line chart over 30 days with a dashed 7-day average. Add a weekly signups columns card and a landing visitors to Start free clicks to signups funnel card. Label every card "Agent Analytics (example data)" and say once in the summary that all data is example data. End with a "Why Agent Analytics for this dashboard" section of 3 or 4 bullets taken from the agentanalytics.sh landing page, a "How to make this Page" section of steps (connect the Agent Analytics MCP, paste the prompt, ask for a daily refresh routine, share a mock-data copy), and a "Links" section of link cards for Agent Analytics (https://agentanalytics.sh), Grok Bot (https://x.ai/bot), Awesome Grok Bot Pages (https://github.com/Agent-Analytics/awesome-grok-bot-pages) and the setup guide (https://docs.agentanalytics.sh/installation/).
  ```

  </details>

## Productivity

Planners, trackers and task boards.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Data Analytics

Dashboards and metrics.

Maintainers' pick: dashboards pair well with [Agent Analytics](https://agentanalytics.sh), which has an MCP server (`https://mcp.agentanalytics.sh/mcp`) so Grok Bot can pull real site stats into a Page. [Setup guide](https://docs.agentanalytics.sh/installation/). Any analytics provider is welcome.

- [Site Analytics Dashboard](https://site-analytics-dashboard-example-xahy.pages.grok.bot/) - One dashboard of daily visits, signups and landing conversion, built from Agent Analytics data (example data). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Page called "Site Analytics Dashboard (example)" with realistic mock data for three fictional sites: acme-notes.app, Acme blog and Acme docs. For each site, show a card with total visits for the last 7 days as a big number, a one-line note comparing this week to the 30-day daily average, and a daily visits line chart over 30 days with a dashed 7-day average. Add a weekly signups columns card and a landing visitors to Start free clicks to signups funnel card. Label every card "Agent Analytics (example data)" and say once in the summary that all data is example data. End with a "Why Agent Analytics for this dashboard" section of 3 or 4 bullets taken from the agentanalytics.sh landing page, a "How to make this Page" section of steps (connect the Agent Analytics MCP, paste the prompt, ask for a daily refresh routine, share a mock-data copy), and a "Links" section of link cards for Agent Analytics (https://agentanalytics.sh), Grok Bot (https://x.ai/bot), Awesome Grok Bot Pages (https://github.com/Agent-Analytics/awesome-grok-bot-pages) and the setup guide (https://docs.agentanalytics.sh/installation/).
  ```

  </details>

## Infrastructure

Uptime, deploys and cloud costs.

No Pages yet. [Add yours](#create-your-page-and-get-listed).

## Agent Orchestration

Mission controls and bot activity.

- [Mission Control](https://mission-control-example-sgmr.pages.grok.bot/) - One Page showing what each bot is doing, what waits on you, and which routines run next (example data). Inspired by [Alex Finn's video](https://youtu.be/Nk242TnA7-8). By Alex Finn ([@AlexFinn](https://x.com/AlexFinn)). Example Page by Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
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

## Bot Management

Org charts, roles and hand-offs between your bots.

- [Bot Org Chart](https://bot-org-chart-example-ujfc.pages.grok.bot/) - An org chart of your bots: you at the top, Grok Bot as the chief of staff you talk to, the specialist bots it delegates to, their routines and status, and dashed hand-offs between them (example data). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  <details><summary>Prompt</summary>

  ```text
  Make me a Grok Bot Page called "Bot Org Chart" that shows how my bots are organized. Put me at the top. Under me put my main Grok Bot, labeled "Chief of staff": it is the bot I talk to, and it delegates work to my specialist bots. Draw an arrow from it to each specialist bot. Draw a dashed line between two bots only where one really hands work to the other, and list those hand-offs under the chart. Give each bot a simple blob avatar with two eyes, in the same shape and color as in my bot list, a one-line role, its routines with schedule and whether each is on or paused, its status (working, idle or waiting on me), and a link to open its chat. Fill it from my real bots, their descriptions and their routines, and don't invent anything. Add a routine that refreshes the Page every day at 8:00. If I want to share it, make a separate copy with mock bots and mock data, with no names, emails or other personal details, and label it example data.
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
4. Open a pull request that adds your entry to the right section of this README, in the [entry format](#entry-format).

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
- The "Made with Grok Bot" backlink footer is strongly requested but not required.
- Pages that go private or get deleted are removed.

## Entry format

````markdown
- [Title](public page link) - One factual sentence. By Name ([@github](https://github.com/handle), [@x](https://x.com/handle)).
  <details><summary>Prompt</summary>

  ```text
  The prompt used to build the Page.
  ```

  </details>
````

- A name is required, plus at least one of a GitHub handle or an X handle. Both are fine.
- The prompt block is required. Keep the blank line after `<summary>` and the two-space indentation so GitHub renders the code block inside it.
- An optional `Inspired by [source](url).` can go before `By`.
- Keep the description to one factual sentence about what the Page shows or does.

## Contributing

Before submitting a pull request, please star this repository.

Listing contributions only need to add an entry to `README.md`. New Pages may also appear in Latest Additions. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full review criteria.

## License

[CC0 1.0](./LICENSE)
