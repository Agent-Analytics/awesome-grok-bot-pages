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

- [Command Center](https://pending.invalid/command-center/) - A wide dashboard for when you lose track of what your bots did: a Waiting on me list tagged by action type (approval, yes or no, reply, sign, action) with due items first, a day-by-day timeline filterable by bot, and In progress and Finished tabs (example data). Inspired by [Moritz Kremb's post on X](https://x.com/moritzkremb/status/2114787902932857293) ([@moritzkremb](https://x.com/moritzkremb)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/command-center/](https://grokbotpages.com/t/command-center/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Command Center" so I never lose the overview of what my bots did. You are my chief of staff: ask each of my bots what it is waiting on me for, what it is working on and what it finished, and use their routines and recent runs. Lay it out in three columns. Left: "Waiting on me", each item with the asking bot, one line on what to do, a tag (Due today, Approval, Yes/no, Reply, Sign or Action), due items first, a filter by tag and a "Show why" switch that reveals the reason. Middle: a timeline of bot activity grouped by day, with day tabs that show a count and a filter by bot. Right: "In progress" and "Finished" tabs with a count each. A Page can't answer a bot, so say once that I answer in each bot's chat. Use only real data, and show "unknown" instead of guessing. Then create a routine that refreshes the Page often enough to stay current, for example every two hours while I work. If I want to share it, make a separate copy with mock bots and mock data and label it example data.
  ```

  </details>

- [Agent Status Board](https://pending.invalid/agent-status-board/) - A card for every bot with its role, whether it needs you, what it needs from you, what it is doing now, its backlog and when it was last active, plus a filter by state and a chart of who is using the most (example data). Inspired by [Ashni's post on X](https://x.com/ashnichrist/status/2112998428456194373) ([@ashnichrist](https://x.com/ashnichrist)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/agent-status-board/](https://grokbotpages.com/t/agent-status-board/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Agent Status Board" with one card per bot I have. Each card shows the bot's name and role, a status pill (Needs you, Blocked, Busy or Idle), a "Needs from you" box when it is waiting on me, what it is doing now, its backlog and when it was last active. At the top, show a summary line like "5 need you, 1 blocked, 2 busy, 8 idle" and a filter with those states and a count each, plus a "Show backlog" switch. Below the cards, show which bots used the most of my plan this week, from my plan usage summary. Put bots that need me first. Use only real data from my bots, routines and recent runs, and show "unknown" instead of guessing. Say on the Page that its controls only change the view. Then create a routine that refreshes the Page every hour. If I want to share it, make a separate copy with mock bots and mock data and label it example data.
  ```

  </details>

- [Bot Fleet Ops](https://pending.invalid/bot-fleet-ops/) - A morning audit of the whole bot fleet: a red, yellow or green light per bot, how much of the weekly plan is used, a forecast of whether it lasts until the reset, and what to pause, merge or tighten, with what-if switches that update the forecast (example data). Inspired by [Brian Roemmele's Mission Control post on X](https://x.com/BrianRoemmele/status/2111201533971103942) ([@BrianRoemmele](https://x.com/BrianRoemmele)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-fleet-ops/](https://grokbotpages.com/t/bot-fleet-ops/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Bot Fleet Ops" that audits all my bots every morning. Start from my plan usage summary: how much of the weekly plan is used, when it resets, and which bots and routines used the most. Show used so far, the pace per day over the last two days, the forecast at the reset as a straight line from that pace, and a forecast light: green under 90%, yellow from 90% to 100%, red over 100%. Give every bot a red, yellow or green light with its share of usage, one line on what it found and a suggested action: Keep, Pause, Merge or Tighten. List the top three fixes with about how much each would save per day, each with a what-if switch that updates the forecast on the Page only; say that nothing changes in my bots until I say yes in chat. Show usage by day as columns. Show every number's source and mark estimates. Then create a routine that rebuilds the Page every weekday morning. If I want to share it, make a separate copy with mock bots and mock numbers and label it example data.
  ```

  </details>

- [Bot Tune-up Report](https://pending.invalid/bot-tune-up-report/) - A weekly audit of every bot for wasted runs: scheduled checks with nothing to do, retry loops, bloated chats, repeated research, duplicate or idle bots and dropped logins, with ranked fixes and a week-over-week chart (example data). Inspired by [Brian Roemmele's Optimizer post on X](https://x.com/BrianRoemmele/status/2112337968820334676) ([@BrianRoemmele](https://x.com/BrianRoemmele)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-tune-up-report/](https://grokbotpages.com/t/bot-tune-up-report/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Bot Tune-up Report" that audits all my bots and routines for waste. Check for: scheduled checks that wake up with nothing to do, retry loops that repeat the same error, chats so long that every run re-reads them, research that repeats across bots or runs, duplicate or idle bots, and logins or connections that dropped and make runs fail. Show one ranked table of findings with the bot, the check, what you found in one line, the fix, the impact (High, Medium or Low) and about how long the fix takes. Add a filter by check and a "High impact only" switch. Keep this week's counts and show a stacked column chart of findings over the last four weekly audits. Don't change, pause or delete anything; I approve each fix in chat, and say so on the Page. Then create a routine that reruns the audit every Monday morning. If I want to share it, make a separate copy with mock bots and label it example data.
  ```

  </details>

- [Weekly Usage Audit](https://pending.invalid/weekly-usage-audit/) - Where a week of bot usage went, read from your usage export: tokens by bot and day, the biggest runs and whether each led to a decision or just rehashed, fixes with their math, and what a bot can own versus what needs you (example data). Inspired by [Brian Roemmele's usage audit post on X](https://x.com/BrianRoemmele/status/2112249592133935133) ([@BrianRoemmele](https://x.com/BrianRoemmele)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/weekly-usage-audit/](https://grokbotpages.com/t/weekly-usage-audit/).
  <details><summary>Prompt</summary>

  ```text
  I'm attaching my usage export. Build me a wide Grok Bot Page called "Weekly Usage Audit" from it. Show total tokens per bot for the week as bars, then a heatmap of bots by day with a switch between tokens and number of runs. Then list the runs worth a look: the biggest runs, runs that repeat without adding anything new, and runs that ended with nothing changed, each marked Decision, Rehash or No change, with a filter by bot. Then a table of fixes to test next week, such as capping sources, skipping recaps when nothing changed, moving hourly checks to on-change or daily, and merging overlapping routines, each with how much it saves and a "Show the math" switch that shows how you got the number. End with two lists: work a bot can own on a schedule, and work that still needs my judgment. Every number must come from the export; mark anything estimated. If I want to share it, make a separate copy with mock bots and mock numbers and label it example data.
  ```

  </details>

- [Bot Activity Dashboard](https://pending.invalid/bot-activity-dashboard/) - One snapshot of every bot, refreshed twice a day: counts for Waiting on me, In progress and Finished, a tab for each with recurring work showing its schedule, and an activity timeline filterable by day and bot (example data). Inspired by [@byalexai's post on X](https://x.com/byalexai/status/2114837470680318365) ([@byalexai](https://x.com/byalexai)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-activity-dashboard/](https://grokbotpages.com/t/bot-activity-dashboard/).
  <details><summary>Prompt</summary>

  ```text
  Build me a Grok Bot Page called "Bot Activity Dashboard". Ask each of my bots what it is waiting on me for, what it is working on and what it finished, and read their routines and recent runs. At the top, show when the snapshot was taken and when the next refresh is, and three counts: Waiting on me, In progress and Finished. Then tabs for those three with a count each. Waiting items show the bot, what it needs and when it asked. In-progress items that recur show their schedule, like "Daily about 21:30", and when they last ran. Finished items show what was done and when. Below, show an activity timeline with day tabs that show a count and a filter by bot. Say that I answer waiting items in each bot's chat. Use only real data and show "unknown" instead of guessing. Then create a routine that refreshes the Page twice a day, at 9:00 and 21:00. If I want to share it, make a separate copy with mock bots and mock data and label it example data.
  ```

  </details>

- [Bot Crew Office](https://pending.invalid/bot-crew-office/) - An office floor of your bot crew: every bot at a desk with a callsign and live state, a GO or NO-GO list for what needs you that shows the exact reply to paste in that bot's chat, an activity feed and Now, Day, Dusk and Night lighting (example data). Inspired by [Carnage's post on X](https://x.com/0xCarnagee/status/2115623287707381874) ([@0xCarnagee](https://x.com/0xCarnagee)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-crew-office/](https://grokbotpages.com/t/bot-crew-office/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Bot Crew Office" that shows my bots as a crew in an office. Give each bot a short callsign and draw it as a desk tile on an office floor, with a colored dot for its state: coding, browsing, in terminal, thinking, needs you, error, done or idle. Add a Now, Day, Dusk and Night switch that changes the office lighting. Next to the office, show a GO / NO-GO list of everything a bot is waiting on me for: the callsign, the question in one line, and GO and NO-GO choices. A Page can't answer a bot, so picking one only shows the exact reply to paste into that bot's chat, and the Page must say nothing is sent. Add an activity feed of the latest events and a crew list with what each bot is doing now. Use only real data from my bots, routines and recent runs. Then create a routine that refreshes the Page every hour while I work. If I want to share it, make a separate copy with mock bots and label it example data.
  ```

  </details>

- [My Bots Dashboard](https://pending.invalid/my-bots-dashboard/) - A plain one-page overview of every bot with a section switcher: what needs you (your calls, blocked items and possible duplicate bots), the bots at a glance and by area, today's routines and usage (example data). Inspired by [Emily Nguyen's post on X](https://x.com/emilyntech/status/2113117549890273584) ([@emilyntech](https://x.com/emilyntech)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/my-bots-dashboard/](https://grokbotpages.com/t/my-bots-dashboard/).
  <details><summary>Prompt</summary>

  ```text
  Build me a plain, white Grok Bot Page called "My Bots Dashboard" with a switcher at the top for: All, Needs you, At a glance, Bots by area, Today's routines and Usage. Needs you: a callout like "3 open, 1 blocked", then each item marked "your call", "blocked" (for example a connection that expired) or "review" for a possible duplicate bot, with the bot and one line on what to do. At a glance: number of bots, routines, routines that failed today and possible duplicates. Bots by area: a table of areas like Home, Money, Work and Health with the bots in each. Today's routines: each routine with its time, bot and whether it worked, failed or runs later, and flag routines that overlap. Usage: how much of my weekly plan is used, when it resets and which bots used the most, from my plan usage summary. Use only real data and show "unknown" instead of guessing. Then create a routine that refreshes the Page every morning. If I want to share it, make a separate copy with mock bots and label it example data.
  ```

  </details>

- [Mission Board](https://pending.invalid/mission-board/) - A phone-friendly board with what is waiting on you at the top so approvals don't get buried, active missions with progress in the middle and the daily briefs at the bottom (example data). Inspired by [Marcell Hazzard's post on X](https://x.com/Marcellhazzard/status/2115638752030937510) ([@Marcellhazzard](https://x.com/Marcellhazzard)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/mission-board/](https://grokbotpages.com/t/mission-board/).
  <details><summary>Prompt</summary>

  ```text
  Build me a narrow, phone-friendly Grok Bot Page called "Mission Board". At the top, a "Waiting on me" list with a count, so approvals don't get buried: each item shows what to do, which bot asks and when it is due, with today's items marked and a "Due today" switch. Say that I answer each item in that bot's chat. In the middle, my active missions or projects, each with how far along it is and one line on what is next. At the bottom, the daily briefs my bots send me, such as inbox, money and calendar, with a switch between today and yesterday. Collect the list from my bots, so it fills up on its own as they ask for things. Use only real data and show "unknown" instead of guessing. Then create a routine that refreshes the Page every morning and after a bot asks me for something. If I want to share it, make a separate copy with mock data and label it example data.
  ```

  </details>

- [Routine Run Board](https://pending.invalid/routine-run-board/) - Every routine on one board, refreshed each morning: when it last ran, whether it worked, its last five runs, and what is waiting on your approval, with filters by result and bot (example data). Inspired by [Vikrant Shukla's post on X](https://x.com/vikrantshukla/status/2113158413186187736) ([@vikrantshukla](https://x.com/vikrantshukla)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/routine-run-board/](https://grokbotpages.com/t/routine-run-board/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Routine Run Board" with every routine across all my bots. At the top, show counts: routines, worked, failed and waiting on me. Then a "Waiting on your approval" list with what each routine needs from me, the bot and when it asked, and say that I approve in that bot's chat. Then a table of all routines with the routine, bot, schedule, last run, result (worked, failed, waiting or skipped), its last five runs as symbols, and a note such as why it failed. Add a filter by result with counts and a filter by bot. The app keeps the 20 most recent run records per routine, so also append each morning's results to a run log file and read it for anything older. Use only real data and show "unknown" instead of guessing. Then create a routine that refreshes the Page every morning before I start. If I want to share it, make a separate copy with mock routines and label it example data.
  ```

  </details>

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

- [Command Center](https://pending.invalid/command-center/) - A wide dashboard for when you lose track of what your bots did: a Waiting on me list tagged by action type (approval, yes or no, reply, sign, action) with due items first, a day-by-day timeline filterable by bot, and In progress and Finished tabs (example data). Inspired by [Moritz Kremb's post on X](https://x.com/moritzkremb/status/2114787902932857293) ([@moritzkremb](https://x.com/moritzkremb)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/command-center/](https://grokbotpages.com/t/command-center/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Command Center" so I never lose the overview of what my bots did. You are my chief of staff: ask each of my bots what it is waiting on me for, what it is working on and what it finished, and use their routines and recent runs. Lay it out in three columns. Left: "Waiting on me", each item with the asking bot, one line on what to do, a tag (Due today, Approval, Yes/no, Reply, Sign or Action), due items first, a filter by tag and a "Show why" switch that reveals the reason. Middle: a timeline of bot activity grouped by day, with day tabs that show a count and a filter by bot. Right: "In progress" and "Finished" tabs with a count each. A Page can't answer a bot, so say once that I answer in each bot's chat. Use only real data, and show "unknown" instead of guessing. Then create a routine that refreshes the Page often enough to stay current, for example every two hours while I work. If I want to share it, make a separate copy with mock bots and mock data and label it example data.
  ```

  </details>

- [Bot Activity Dashboard](https://pending.invalid/bot-activity-dashboard/) - One snapshot of every bot, refreshed twice a day: counts for Waiting on me, In progress and Finished, a tab for each with recurring work showing its schedule, and an activity timeline filterable by day and bot (example data). Inspired by [@byalexai's post on X](https://x.com/byalexai/status/2114837470680318365) ([@byalexai](https://x.com/byalexai)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-activity-dashboard/](https://grokbotpages.com/t/bot-activity-dashboard/).
  <details><summary>Prompt</summary>

  ```text
  Build me a Grok Bot Page called "Bot Activity Dashboard". Ask each of my bots what it is waiting on me for, what it is working on and what it finished, and read their routines and recent runs. At the top, show when the snapshot was taken and when the next refresh is, and three counts: Waiting on me, In progress and Finished. Then tabs for those three with a count each. Waiting items show the bot, what it needs and when it asked. In-progress items that recur show their schedule, like "Daily about 21:30", and when they last ran. Finished items show what was done and when. Below, show an activity timeline with day tabs that show a count and a filter by bot. Say that I answer waiting items in each bot's chat. Use only real data and show "unknown" instead of guessing. Then create a routine that refreshes the Page twice a day, at 9:00 and 21:00. If I want to share it, make a separate copy with mock bots and mock data and label it example data.
  ```

  </details>

- [Mission Board](https://pending.invalid/mission-board/) - A phone-friendly board with what is waiting on you at the top so approvals don't get buried, active missions with progress in the middle and the daily briefs at the bottom (example data). Inspired by [Marcell Hazzard's post on X](https://x.com/Marcellhazzard/status/2115638752030937510) ([@Marcellhazzard](https://x.com/Marcellhazzard)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/mission-board/](https://grokbotpages.com/t/mission-board/).
  <details><summary>Prompt</summary>

  ```text
  Build me a narrow, phone-friendly Grok Bot Page called "Mission Board". At the top, a "Waiting on me" list with a count, so approvals don't get buried: each item shows what to do, which bot asks and when it is due, with today's items marked and a "Due today" switch. Say that I answer each item in that bot's chat. In the middle, my active missions or projects, each with how far along it is and one line on what is next. At the bottom, the daily briefs my bots send me, such as inbox, money and calendar, with a switch between today and yesterday. Collect the list from my bots, so it fills up on its own as they ask for things. Use only real data and show "unknown" instead of guessing. Then create a routine that refreshes the Page every morning and after a bot asks me for something. If I want to share it, make a separate copy with mock data and label it example data.
  ```

  </details>

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

- [Bot Crew Office](https://pending.invalid/bot-crew-office/) - An office floor of your bot crew: every bot at a desk with a callsign and live state, a GO or NO-GO list for what needs you that shows the exact reply to paste in that bot's chat, an activity feed and Now, Day, Dusk and Night lighting (example data). Inspired by [Carnage's post on X](https://x.com/0xCarnagee/status/2115623287707381874) ([@0xCarnagee](https://x.com/0xCarnagee)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-crew-office/](https://grokbotpages.com/t/bot-crew-office/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Bot Crew Office" that shows my bots as a crew in an office. Give each bot a short callsign and draw it as a desk tile on an office floor, with a colored dot for its state: coding, browsing, in terminal, thinking, needs you, error, done or idle. Add a Now, Day, Dusk and Night switch that changes the office lighting. Next to the office, show a GO / NO-GO list of everything a bot is waiting on me for: the callsign, the question in one line, and GO and NO-GO choices. A Page can't answer a bot, so picking one only shows the exact reply to paste into that bot's chat, and the Page must say nothing is sent. Add an activity feed of the latest events and a crew list with what each bot is doing now. Use only real data from my bots, routines and recent runs. Then create a routine that refreshes the Page every hour while I work. If I want to share it, make a separate copy with mock bots and label it example data.
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

- [Agent Status Board](https://pending.invalid/agent-status-board/) - A card for every bot with its role, whether it needs you, what it needs from you, what it is doing now, its backlog and when it was last active, plus a filter by state and a chart of who is using the most (example data). Inspired by [Ashni's post on X](https://x.com/ashnichrist/status/2112998428456194373) ([@ashnichrist](https://x.com/ashnichrist)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/agent-status-board/](https://grokbotpages.com/t/agent-status-board/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Agent Status Board" with one card per bot I have. Each card shows the bot's name and role, a status pill (Needs you, Blocked, Busy or Idle), a "Needs from you" box when it is waiting on me, what it is doing now, its backlog and when it was last active. At the top, show a summary line like "5 need you, 1 blocked, 2 busy, 8 idle" and a filter with those states and a count each, plus a "Show backlog" switch. Below the cards, show which bots used the most of my plan this week, from my plan usage summary. Put bots that need me first. Use only real data from my bots, routines and recent runs, and show "unknown" instead of guessing. Say on the Page that its controls only change the view. Then create a routine that refreshes the Page every hour. If I want to share it, make a separate copy with mock bots and mock data and label it example data.
  ```

  </details>

- [Bot Fleet Ops](https://pending.invalid/bot-fleet-ops/) - A morning audit of the whole bot fleet: a red, yellow or green light per bot, how much of the weekly plan is used, a forecast of whether it lasts until the reset, and what to pause, merge or tighten, with what-if switches that update the forecast (example data). Inspired by [Brian Roemmele's Mission Control post on X](https://x.com/BrianRoemmele/status/2111201533971103942) ([@BrianRoemmele](https://x.com/BrianRoemmele)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-fleet-ops/](https://grokbotpages.com/t/bot-fleet-ops/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Bot Fleet Ops" that audits all my bots every morning. Start from my plan usage summary: how much of the weekly plan is used, when it resets, and which bots and routines used the most. Show used so far, the pace per day over the last two days, the forecast at the reset as a straight line from that pace, and a forecast light: green under 90%, yellow from 90% to 100%, red over 100%. Give every bot a red, yellow or green light with its share of usage, one line on what it found and a suggested action: Keep, Pause, Merge or Tighten. List the top three fixes with about how much each would save per day, each with a what-if switch that updates the forecast on the Page only; say that nothing changes in my bots until I say yes in chat. Show usage by day as columns. Show every number's source and mark estimates. Then create a routine that rebuilds the Page every weekday morning. If I want to share it, make a separate copy with mock bots and mock numbers and label it example data.
  ```

  </details>

- [Bot Tune-up Report](https://pending.invalid/bot-tune-up-report/) - A weekly audit of every bot for wasted runs: scheduled checks with nothing to do, retry loops, bloated chats, repeated research, duplicate or idle bots and dropped logins, with ranked fixes and a week-over-week chart (example data). Inspired by [Brian Roemmele's Optimizer post on X](https://x.com/BrianRoemmele/status/2112337968820334676) ([@BrianRoemmele](https://x.com/BrianRoemmele)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/bot-tune-up-report/](https://grokbotpages.com/t/bot-tune-up-report/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Bot Tune-up Report" that audits all my bots and routines for waste. Check for: scheduled checks that wake up with nothing to do, retry loops that repeat the same error, chats so long that every run re-reads them, research that repeats across bots or runs, duplicate or idle bots, and logins or connections that dropped and make runs fail. Show one ranked table of findings with the bot, the check, what you found in one line, the fix, the impact (High, Medium or Low) and about how long the fix takes. Add a filter by check and a "High impact only" switch. Keep this week's counts and show a stacked column chart of findings over the last four weekly audits. Don't change, pause or delete anything; I approve each fix in chat, and say so on the Page. Then create a routine that reruns the audit every Monday morning. If I want to share it, make a separate copy with mock bots and label it example data.
  ```

  </details>

- [Weekly Usage Audit](https://pending.invalid/weekly-usage-audit/) - Where a week of bot usage went, read from your usage export: tokens by bot and day, the biggest runs and whether each led to a decision or just rehashed, fixes with their math, and what a bot can own versus what needs you (example data). Inspired by [Brian Roemmele's usage audit post on X](https://x.com/BrianRoemmele/status/2112249592133935133) ([@BrianRoemmele](https://x.com/BrianRoemmele)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/weekly-usage-audit/](https://grokbotpages.com/t/weekly-usage-audit/).
  <details><summary>Prompt</summary>

  ```text
  I'm attaching my usage export. Build me a wide Grok Bot Page called "Weekly Usage Audit" from it. Show total tokens per bot for the week as bars, then a heatmap of bots by day with a switch between tokens and number of runs. Then list the runs worth a look: the biggest runs, runs that repeat without adding anything new, and runs that ended with nothing changed, each marked Decision, Rehash or No change, with a filter by bot. Then a table of fixes to test next week, such as capping sources, skipping recaps when nothing changed, moving hourly checks to on-change or daily, and merging overlapping routines, each with how much it saves and a "Show the math" switch that shows how you got the number. End with two lists: work a bot can own on a schedule, and work that still needs my judgment. Every number must come from the export; mark anything estimated. If I want to share it, make a separate copy with mock bots and mock numbers and label it example data.
  ```

  </details>

- [My Bots Dashboard](https://pending.invalid/my-bots-dashboard/) - A plain one-page overview of every bot with a section switcher: what needs you (your calls, blocked items and possible duplicate bots), the bots at a glance and by area, today's routines and usage (example data). Inspired by [Emily Nguyen's post on X](https://x.com/emilyntech/status/2113117549890273584) ([@emilyntech](https://x.com/emilyntech)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/my-bots-dashboard/](https://grokbotpages.com/t/my-bots-dashboard/).
  <details><summary>Prompt</summary>

  ```text
  Build me a plain, white Grok Bot Page called "My Bots Dashboard" with a switcher at the top for: All, Needs you, At a glance, Bots by area, Today's routines and Usage. Needs you: a callout like "3 open, 1 blocked", then each item marked "your call", "blocked" (for example a connection that expired) or "review" for a possible duplicate bot, with the bot and one line on what to do. At a glance: number of bots, routines, routines that failed today and possible duplicates. Bots by area: a table of areas like Home, Money, Work and Health with the bots in each. Today's routines: each routine with its time, bot and whether it worked, failed or runs later, and flag routines that overlap. Usage: how much of my weekly plan is used, when it resets and which bots used the most, from my plan usage summary. Use only real data and show "unknown" instead of guessing. Then create a routine that refreshes the Page every morning. If I want to share it, make a separate copy with mock bots and label it example data.
  ```

  </details>

- [Routine Run Board](https://pending.invalid/routine-run-board/) - Every routine on one board, refreshed each morning: when it last ran, whether it worked, its last five runs, and what is waiting on your approval, with filters by result and bot (example data). Inspired by [Vikrant Shukla's post on X](https://x.com/vikrantshukla/status/2113158413186187736) ([@vikrantshukla](https://x.com/vikrantshukla)). By Danny Shmueli ([@dannyshmueli](https://github.com/dannyshmueli)).
  Template page: [grokbotpages.com/t/routine-run-board/](https://grokbotpages.com/t/routine-run-board/).
  <details><summary>Prompt</summary>

  ```text
  Build me a wide Grok Bot Page called "Routine Run Board" with every routine across all my bots. At the top, show counts: routines, worked, failed and waiting on me. Then a "Waiting on your approval" list with what each routine needs from me, the bot and when it asked, and say that I approve in that bot's chat. Then a table of all routines with the routine, bot, schedule, last run, result (worked, failed, waiting or skipped), its last five runs as symbols, and a note such as why it failed. Add a filter by result with counts and a filter by bot. The app keeps the 20 most recent run records per routine, so also append each morning's results to a run log file and read it for anything older. Use only real data and show "unknown" instead of guessing. Then create a routine that refreshes the Page every morning before I start. If I want to share it, make a separate copy with mock routines and label it example data.
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
