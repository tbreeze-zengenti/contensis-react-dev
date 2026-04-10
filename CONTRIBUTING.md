# Contributing to the React Starter Documentation

Thank you for contributing. This guide covers everything you need to write a doc page that gets merged without back-and-forth.

## Contents

- [Welcome and scope](#welcome-and-scope)
- [Prerequisites and local setup](#prerequisites-and-local-setup)
- [Repository structure](#repository-structure)
- [Content types](#content-types)
- [Writing style](#writing-style)
- [Markdown and MDX conventions](#markdown-and-mdx-conventions)
- [Submitting a pull request](#submitting-a-pull-request)

---

## Welcome and scope

This repository contains the documentation site for the [React Starter](https://github.com/contensis/react-starter) — a project that bootstraps developers onto the Contensis CMS. Contributions of all sizes are welcome: a one-sentence typo fix is as valuable as a new page.

**In scope:** new pages, updates to existing pages, navigation improvements, typo and grammar fixes.  
**Out of scope:** feature requests for the React Starter itself (open those in the React Starter repo), and changes to the Node Starter docs (separate plan needed).

---

## Prerequisites and local setup

1. Clone the repo: `git clone https://github.com/contensis/contensis-react-dev.git`
2. Install dependencies: `npm install`
3. Start the dev server: `npm start`
4. Open `http://localhost:3000` in your browser

Node.js 18+ is required.

---

## Repository structure

```
docs/                      ← all documentation pages (Markdown/MDX)
  introduction.md          ← root landing page
  react-starter/
    getting-started/       ← install and environment setup
    basics/                ← components, pages, mappers, theming, etc.
    routing/               ← routing setup and events
    search/                ← search architecture, config, hooks
    deployment/            ← Blocks, Docker, CI/CD
    advanced/              ← auth, canvas, composer, Redux, tips
  node-starter/            ← Node Starter getting started (separate scope)
blog/                      ← release notes and security advisories
src/                       ← Docusaurus theme customisation — leave alone
sidebars.js                ← sidebar configuration — update when adding pages
docusaurus.config.js       ← site config — leave alone unless asked
```

Do not edit auto-generated files or the `docs/plans/` directory (internal planning docs, excluded from the build).

---

## Content types

Each page should serve exactly one purpose. Choose the right type before writing:

| Type | Purpose | Example pages |
|---|---|---|
| **Tutorial** | Walk a new developer through a complete task from start to finish | Installation, Getting started |
| **How-to guide** | Solve a specific real-world task | Adding authentication, Deploying with Docker |
| **Reference** | Precise, exhaustive technical lookup | Hook API docs, Config options |
| **Conceptual** | Explain why something works the way it does | Redux store architecture, Routing overview |

Do not mix types on a single page. If you find yourself explaining how something works in the middle of a tutorial, that explanation belongs on a separate conceptual page.

---

## Writing style

### Language

**American English.** This is a consistency standard, not a cultural judgment. Examples: "color" not "colour", "standardize" not "standardise", "license" not "licence". If you write British spellings, reviewers will suggest the correction — no awkwardness intended.

When in doubt, follow the [Google Developer Documentation Style Guide](https://developers.google.com/style). That guide is the authoritative reference for anything this document does not cover explicitly.

### Voice and tense

- **Second person** ("you"): "You can configure this in…" not "We recommend configuring this in…"
- **Present tense**: "This hook returns the current route" not "This hook will return the current route"
- **Active voice**: "The component renders a list" not "A list is rendered by the component"
- Reserve "we" for cases where the team is speaking directly about a product decision: "We designed this pattern to…"

### Tone

- Approachable, direct, and respectful — write like a knowledgeable colleague explaining something clearly
- Never use: **easy**, **simple**, **just**, **quickly**, **straightforward** — what is easy for one person may not be easy for another
- No exclamation marks in body text
- No Latin abbreviations: "for example" not "e.g.", "that is" not "i.e.", "and so on" not "etc."

### Headings

**Sentence case** for natural-language headings — capitalise only the first word and proper nouns:
- `## Getting started` not `## Getting Started`
- `## Content type routes` not `## Content Type Routes`
- `## TypeScript support` not `## TypeScript Support` (TypeScript is a proper noun)

**Preserve canonical casing** for headings that are code symbols:
- `## onRouteLoad` not `## Onrouteload` (it is a code symbol, not a natural-language phrase)
- `## customNavigation` not `## CustomNavigation`

These are two different rules — do not apply sentence case to code symbol headings.

### Links

Use descriptive link text: "Read the [configuration guide](./config.md)" not "click [here](./config.md)".

---

## Terminology

Use these terms consistently. Deviations will be flagged in review.

| Term | Correct usage | Do not use |
|---|---|---|
| **React Starter** | The starter project (this repository) | "starter project", "the boilerplate" |
| **Contensis React Base (CRB)** | The underlying framework `@zengenti/contensis-react-base` | "Zengenti Base Package", "the base" without expansion |
| **component** | A React `.component.tsx` file in `src/app/components/` | Do not conflate with "CMS Component" |
| **CMS Component** | An embedded field schema in Contensis (no `sys.id`) | Not the same as a React component |
| **mapper** | A pure function transforming a CMS `Entry` to typed props | "transformer" |
| **Composer** | The Contensis Composer field type | "page builder", "composer" (lowercase) |
| **template** | A page-level component in `src/app/templates/` | "page component" |
| **`onRouteLoaded`** | The correct event hook name (past tense, with `-d`) | `onRouteLoad` (without `-d`) causes a crash |
| **Elasticsearch** | The search engine (one word, this capitalisation) | "Elastic Search", "ElasticSearch" |

---

## Markdown and MDX conventions

### Required frontmatter

Every doc page must include:

```markdown
---
sidebar_position: 1
title: Page title
---
```

- `sidebar_position` controls ordering within autogenerated sidebar sections. Use unique integers within a directory.
- `title` controls the browser `<title>` tag and OpenGraph title. It may differ from the H1 heading when you need a more specific meta title.

### Headings

Use a single `# H1` as the page title. All subsequent headings start at `##`. Do not skip levels.

### Code blocks

Always specify a language identifier:

```
```ts
// TypeScript-only code
```

```tsx
// TypeScript + JSX (React components with TypeScript)
```

```jsx
// Pure JavaScript JSX (no TypeScript types)
```

```bash
# Shell commands
```
```

Add a `title=` attribute when the code represents a specific file in the project:

```
```ts title="src/app/redux/store.ts"
```

### Admonitions

Use Docusaurus admonitions to call out important information. Match the type to the content:

| Type | Use for |
|---|---|
| `:::info` | Terminology disambiguation, factual context |
| `:::tip` | Best practices, shortcuts, recommended patterns |
| `:::caution` | Potential pitfalls, things that may cause unexpected behaviour |
| `:::danger` | Destructive or irreversible actions, security risks |

Do not use `:::warning` — it is not an official Docusaurus v2 admonition type.

### Internal cross-links

Use relative paths with the `.md` extension — Docusaurus validates these at build time:

```markdown
See the [Routing guide](../routing/routing.md) for more detail.
```

Do not use absolute paths (`/docs/react-starter/...`) — they bypass build-time validation.

---

## Submitting a pull request

1. Create a branch from `main`: `git checkout -b docs/your-topic-name`
2. Make your changes
3. Run `npm run build` locally to confirm no broken links or build errors
4. Push and open a PR against `main`
5. A reviewer will respond within a few working days

The CI build runs `docusaurus build` with `onBrokenLinks: "throw"` — broken internal links will fail the build. Fix them before pushing.
