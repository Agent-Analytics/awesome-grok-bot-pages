# Contributing to Awesome Grok Bot Pages

Awesome Grok Bot Pages lists public Grok Bot Pages that are useful to a stranger. The goal is not to list every Page. The goal is a set of Pages anyone can open and use without context.

## Good contributions

- Add a public Page that meets the listing rules.
- Fix broken links or remove Pages that went private or were deleted.
- Tighten descriptions to be more factual.

## Requirements for new submissions

Every new submission must meet these at review time:

- **Public link:** the Page link opens without signing in.
- **Mock or public data:** public Pages use mock or public data, never personal info. If your Page shows personal or business data, list a public copy with realistic mock data.
- **No private data:** no personal emails, names of private people, account IDs, inbox items or file paths.
- **Content rules:** the Page follows the Grok Bot Pages content rules.
- **Useful to a stranger:** real data or a working control, and no placeholder text.
- **Credit:** a name plus a GitHub handle, an X handle, or both.
- **Prompt:** the prompt used to build the Page, with no private details. A creator showcase whose creator has not shared a prompt is listed without a Prompt block.
- **Star:** you starred this repository before opening the pull request.

Encouraged:

- An `Inspired by [source](url).` credit when the Page builds on someone else's idea.
- The "Made with Grok Bot" footer on the Page with the line `Listed on Awesome Grok Bot Pages: https://github.com/Agent-Analytics/awesome-grok-bot-pages`. This is strongly requested but not required.

Pages that go private or get deleted are removed.

## How to add an entry

Listing contributions only need to update [`README.md`](./README.md).

1. Star this repository before opening your pull request. It is required to get listed.
2. Build or open your Page in Grok Bot and paste the snippet from the README's "Create your Page and get listed" section.
3. Make the Page public with the share control on the Page.
4. Add your entry to the matching README section and remove that section's "No Pages yet" line if yours is the first. You may also add it to Latest Additions.
5. Fill in the pull request checklist.

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
- The prompt block is required and must contain no private details, except for a creator showcase whose creator has not shared a prompt. The snippet in the README asks Grok Bot to write one.
- An optional `Inspired by [source](url).` can go before `By`.
- The `Template page` line links the entry's page on grokbotpages.com. The slug is the title in lowercase with hyphens, for example `side-project-mission-control`. The page goes live once the pull request is merged.
- Keep the blank line after `<summary>` and the two-space indentation so GitHub renders the code block inside it.

Sections: Latest Additions, Mission Control, Productivity, Data Analytics, Infrastructure, Agent Orchestration, Bot Management, Payments and Finance, Sales, Marketing, Inbox and Collaboration, Research, Design, Documents and Files, Scheduling and Support.

## Copy rules

- One factual sentence per entry.
- No unverifiable claims, superlatives or marketing copy.
- Link the Page directly, not through a shortener.
