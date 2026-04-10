---
title: "feat: Improve public docs using agent documentation"
type: feat
status: completed
date: 2026-04-10
---

# ✨ Improve Public Docs Using Agent Documentation

## Overview

The React Starter project has a set of internal agent documentation files (`.github/agents/docs/`) that describe production-quality patterns for components, TypeScript, code style, and testing. These docs are currently only available to AI agents and developers who know where to look. The goal is to surface this content into the public-facing Docusaurus site, filling well-documented gaps and improving thin or stub pages.

## Problem Statement / Motivation

Several pages in the public docs are stubs, very thin, or explicitly marked as under construction. Meanwhile, the agent instruction files at `~/ai/agents/react/.github/instructions/` contain validated, production-quality examples that directly address these gaps. Developers following the public docs are missing:

- A project structure overview (`installation.md` stub heading with no content)
- A meaningful theming guide (`theming.md` is 3 short paragraphs with no code)
- Concrete Storybook story patterns and organisation conventions
- Naming and code style conventions (covered by agent docs but absent from public docs)
- TypeScript utility types, `React.forwardRef`, and advanced patterns
- Component checklists and mapper best practices
- **Search is particularly badly served**: `useFacets` and `useListing` are just a title and a caution banner; `useMinilist` is outdated (uses `setTimeout`, hand-rolled selector, old mapper API); `config.md` is missing 6+ QueryParams fields; filters has no practical guide; advanced features (tabs, compositions, featured results, i18n) have zero public documentation

## Source Agent Documentation

The agent docs to draw from:

| File | Location | Key content |
|------|----------|-------------|
| `components.md` | `rs/base/.github/agents/docs/` | Directory structure, component pattern, mapper pattern, Composer integration, icon components, component checklist |
| `typescript.md` | `rs/base/.github/agents/docs/` | Strict mode, props types vs interfaces, generics for API responses, utility types, React types, `React.forwardRef` |
| `code-style.md` | `rs/base/.github/agents/docs/` | Naming conventions table, Styled Components transient props, import order, component structure order |
| `testing.md` | `rs/base/.github/agents/docs/` | Storybook story structure, `args`/`argTypes`, story organisation, decorators, Jest mapper tests |
| `components.md` (PS) | `professional-services/react/.github/agents/docs/` | Same structure with project-specific theme token references (`theme.colors.surface.secondary`, `theme.colors.type.default.primary`) |
| `ubiquitous-language.md` (PS) | `professional-services/react/.github/agents/docs/` | Disambiguation table — "blocks", "component", "mapper", "composition" — add terminology callouts to relevant docs (e.g. `:::info` admonition in `components.md` clarifying "component" vs "CMS Component") |
| `buildSearch.md` | `ai/agents/react/.github/instructions/` | Architecture ownership boundary, three search contexts, step-by-step facet/listing/minilist setup, `onRouteLoaded` wiring, `baseFields`/`whereSysUri` pattern, common mistakes table |
| `buildSearchConfig.md` | `ai/agents/react/.github/instructions/` | Full `SearchQueryParams` reference (including `fieldLinkDepths`, `fuzzySearch`, `versionStatus`, `languages`, `internalPaging`), complete annotated `search.config.ts` example |
| `buildSearchFilters.md` | `ai/agents/react/.github/instructions/` | `customWhere` HTTP object notation (all operators, logical composition, real-world examples), `SearchFilter` type (all fields), `updateSelectedFilters` argument order gotcha, dynamic filters, linked entry `.sys.id` requirement |
| `buildSearchMinilist.md` | `ai/agents/react/.github/instructions/` | `selectSearchExists` guard pattern, step-by-step minilist setup, full `useMinilist` prop API, `excludeIds`, `useSearchTerm` |
| `buildSearchTemplates.md` | `ai/agents/react/.github/instructions/` | Hook selection guide, full `useFacets` prop API, full `useListing` prop API, complete template skeletons for both hooks |
| `buildSearchMapper.md` | `ai/agents/react/.github/instructions/` | `searchResults.mapper.ts` switch pattern, `SearchResultProps` union type, `baseMapper` sufficiency check, `searchResultsInformation.mapper.ts` with CRB selectors, `filterItems` mapper, `search.transformations.ts` structure |
| `buildSearchAdvanced.md` | `ai/agents/react/.github/instructions/` | Tabs, compositions, featured results, i18n (`defaultLang`, `languages`, `i18n` on facets/filters), `versionStatus` override, custom API integration |

## Proposed Solution

For each target doc, extract relevant content from the agent docs, adapt it for a public-facing developer audience (remove internal-agent framing), and integrate it consistently using the existing Docusaurus patterns (code blocks with `title=` attributes, admonition blocks, API reference tables).

### Target Documents and Changes

#### 1. `docs/react-starter/getting-started/installation.md`

**Gap:** The "Project structure" section heading has no content.

**Action:** Add a project structure section using the directory tree from `AGENTS.md` (`src/app/{components,templates,routes,redux,search,schema,theme,types,util}`, `src/server/`, `src/client/`) with a brief description of each directory's role.

---

#### 2. `docs/react-starter/basics/typescript.md`

**Gap:** Currently covers only path aliases (`~/*`, `-/*`). Misses utility types, React types, `forwardRef`, and the TS/interface choice.

**Action:** Expand with sections from agent `typescript.md`:
- Strict mode (`tsconfig.json` snippet)
- Props types vs interfaces (prefer `type`, with rationale)
- Generics for API responses (Contensis `Entry` pattern)
- Utility types (`Partial`, `Pick`, `Omit`)
- React types (`React.ReactNode`, event handlers, `React.forwardRef`)
- Avoiding `any` (use `unknown`, generics)

---

#### 3. `docs/react-starter/basics/storybook.md`

**Gap:** Exists but lacks concrete `args`/`argTypes` examples, story organisation conventions, and decorator patterns.

**Action:** Add or expand with content from agent `testing.md`:
- Full story file example with `Meta` and `StoryObj` types
- `args` (default values) and `argTypes` (select, boolean, color, range controls)
- Story title organisation convention (`"Components / Cards / BlogCard"`)
- Decorator pattern for `ThemeProvider` wrapping
- `build-storybook` command (already present but can be reinforced)

---

#### 4. `docs/react-starter/basics/theming.md`

**Gap:** Three short paragraphs, no code examples. This is one of the weakest docs in the site.

**Action:** Substantially expand using actual project theme files. `theming.md` owns the *what* of the theme — structure and tokens. All Styled Components *how-to-write* patterns (transient props, theme access syntax, extending components) belong in `code-style.md` (item 6) — do not duplicate them here.

- How the theme is structured (`colors.ts`, `layout.ts`, `styled.d.ts`)
- The `ThemeProvider` wrapper and `GlobalStyles` component
- Available token categories (colours, spacing, typography, breakpoints) with the actual values from `src/app/theme/`
- Cross-link to `code-style.md` for the Styled Components syntax that consumes these tokens

---

#### 5. `docs/react-starter/basics/components.md`

**Gap:** Covers naming and location conventions but lacks a complete component pattern, mapper best practices, and a pre-completion checklist.

**Action:** Expand with content from agent `components.md`:
- Full annotated component file example (props type, component, styled components, export)
- Mapper file example with `Entry &` extension pattern and optional chaining
- Mapper best practices (handle null/undefined, keep pure, type both in/out)
- Icon component pattern
- Component checklist (TypeScript passes, lint passes, mapper exists if CMS-backed, story exists, `@loadable` export if Composer-used)

---

#### 6. New: `docs/react-starter/basics/code-style.md` *(new file)*

**Gap:** No dedicated code style doc exists.

**Action:** Create a new doc using agent `code-style.md`. `code-style.md` is the single owner of all Styled Components *how-to-write* content — do not duplicate these patterns in `theming.md` or `components.md`.

- Naming conventions table (components, files, directories, props, styled, mappers, constants, hooks)
- Styled Components patterns: basic pattern, transient `$` props, accessing theme tokens, extending base components
- Import order convention (React → external → internal absolute → relative)
- Component structure order (types → component → styled → export)
- ESLint & Prettier commands (`npm run lint:fix`)
- Add to `sidebars.js` in the `basics` section

---

#### 7. `docs/react-starter/basics/assets.md` *(sidebar position fix)*

**Status:** `theming.md` and `assets.md` both have `sidebar_position: 4`. Renumber `assets.md` to resolve the collision — do this as part of the `theming.md` update.

---

### Search Documentation (from `buildSearch*` instructions)

The search section of the public docs has the most critical gaps. The following are listed from highest to lowest priority.

---

#### 8. `docs/react-starter/search/search.md` *(overview — expand)*

**Gap:** The architecture section describes the three layers (config, mappers, hooks) but gives no ownership boundary, no file map, and no `onRouteLoaded` wiring explanation.

**Action:** Expand using `buildSearch.md`:
- **Ownership boundary table**: App owns `search.config.ts`, `search.transformations.ts`, `searchResults.mapper.ts`, `searchResultsInformation.mapper.ts`, `search.schema.ts`, `withEvents.ts`, templates, and minilist hooks. CRB owns all Redux state, sagas, action creators — never create your own.
- **Three search contexts table**: Facet (`useFacets`, `searchOptions.facet`), Listing (`useListing`, `searchOptions.listingType`), Minilist (`useMinilist`, no route needed)
- **`onRouteLoaded` wiring** with both `config` and `mappers` required, and the critical gotcha (`onRouteLoaded` not `onRouteLoad`)
- **Schema constants pattern** — always define facet/listing/minilist keys in `search.schema.ts`, never use string literals in routes or config
- **`baseFields` and `whereSysUri`** — always start with `fields: [...baseFields]` and always include `customWhere: [whereSysUri]`

---

#### 9. `docs/react-starter/search/hooks/use-facets.md` *(currently: title + caution banner only)*

**Gap:** Entirely empty — title and caution banner only.

**Action:** Fill completely from `buildSearchTemplates.md`:
- When to use `useFacets` vs `useListing` (multi-tab search UI with facet switching)
- Full prop API reference table (results, isLoading, pageIsLoading, resultsInfo, totalCount, pageSize, currentPageIndex, paging, featured, currentSearchTerm, updateSearchTerm, selectedFilters, facetFilters, updateSelectedFilters, clearFilters, updatePageIndex, updatePageSize, updateSortOrder, updateCurrentFacet, updateCurrentTab, sortOrder, currentFacet, currentTabIndex, searchTotalCount, facetTitles)
- Complete template skeleton showing: search input, filter UI (iterating `facetFilters`, `selectedFilters` as `string[]`), loading state, empty state, results list, pagination
- `updateSelectedFilters(groupKey, itemKey)` — argument order gotcha

---

#### 10. `docs/react-starter/search/hooks/use-listing.md` *(currently: title + caution banner + 2 bullets)*

**Gap:** Near-empty stub.

**Action:** Fill completely from `buildSearchTemplates.md`:
- When to use `useListing` — dedicated listing pages (always, even when text search is needed)
- Key differences from `useFacets`: `searchTerm` (not `currentSearchTerm`), `filters` (not `facetFilters`), `filters` values may be `undefined` during init
- Full prop API reference table
- Complete template skeleton showing filter `undefined` guard, text search input, results, pagination via `paging.pageIndex`/`paging.totalCount`
- Route wiring using `listingType` (not `facet`) with schema constant

---

#### 11. `docs/react-starter/search/hooks/use-minilist.md` *(update — outdated content)*

**Gap:** Uses `setTimeout` hack, hand-rolled `selectIsSearchLoaded` selector, old single-function `mapper:` API (not `mappers:`), and `injectRedux: injectSearch` pattern that may no longer apply.

**Action:** Update from `buildSearchMinilist.md`:
- Replace `setTimeout` with `selectSearchExists` from `~/redux/selectors` (built-in, not hand-rolled)
- Replace `mapper: mappers.results` with `mappers: searchTransformations` (full `SearchTransformations` object)
- Update file naming to `searchResults.mapper.ts` / `search.transformations.ts`
- Add `excludeIds` option for excluding the current page's entry
- Add `useSearchTerm: true` config option for syncing with main search term
- Add full `useMinilist` prop API (documenting what's *not* available: `updateSearchTerm`, `clearFilters`, `updateCurrentFacet`)
- Keep the "when to use" content — it's good

---

#### 12. `docs/react-starter/search/config.md` *(expand — missing fields)*

**Gap:** Missing 6+ `QueryParams` fields and has no practical example. The `customWhere` section has no operator reference.

**Action:** Expand from `buildSearchConfig.md`:
- Add missing `QueryParams` fields to the reference table: `fieldLinkDepths`, `fuzzySearch`, `versionStatus`, `languages`, `omitDefaultSearchFields`, `internalPaging`
- Add `fieldLinkDepths` explanation and comparison with `linkDepth` (prefer `fieldLinkDepths`, mandatory when `linkDepth ≥ 2`)
- Add pagination modes comparison table (default, `loadMorePaging`, `internalPaging`)
- Add complete annotated `search.config.ts` example showing facets, listings, and minilist together
- Add `freeTextWeights` constants pattern to `WeightedSearchField` section

---

#### 13. `docs/react-starter/search/mappers.md` *(update — outdated content)*

**Gap:** References old file names (`entry-to-cardprops.mapper.ts`), uses the deprecated `json-mapper`/Immutable API for `resultsInfo`, and doesn't cover the switch pattern, `SearchResultProps` union type, or `filterItems` mapper.

**Action:** Update from `buildSearchMapper.md`:
- Update file references to `searchResults.mapper.ts`, `searchResultsInformation.mapper.ts`, `search.transformations.ts`
- Explain the `switch (entry.sys.contentTypeId)` pattern with explicit cases per content type
- `SearchResultProps` union type with `ResultProps<T>` utility
- `baseMapper` sufficiency — CRB resolves `entryTitle`/`entryDescription`/`entryThumbnail` automatically; only write custom mappers for extra fields
- `searchResultsInformation.mapper.ts` using modern CRB selectors (`selectors.selectFacets`)
- `filterItems` mapper — when it's needed (dynamic filters from CMS) and the `FilterItemsMapper` type
- `search.transformations.ts` structure showing all three mapper slots
- `SearchResultsMapper` signature with `facet` and `context` parameters

---

#### 14. New: `docs/react-starter/search/filters.md` *(new file)*

**Gap:** No dedicated filter guide exists. `config.md` has a `Filter` reference table but no `customWhere` operator reference, no practical examples, and no gotcha warnings.

**Action:** Create new doc from `buildSearchFilters.md`:
- **Part 1: `customWhere` query syntax** — all operators (`equalTo`, `contains`, `startsWith`, `endsWith`, `in`, `exists`, `between`, `greaterThan`, `greaterThanOrEqualTo`, `lessThan`, `lessThanOrEqualTo`, `freeText`, `distanceWithin`), logical composition (`not`/`or`/`and`), real-world composed examples, HTTP object notation vs `Op` calls (different APIs)
- **Part 2: `SearchFilter` UI filters** — type definition (all fields including `isSingleSelect`, `aggregations`, `isGrouped`, `renderable`, `i18n`), basic OR filter example, single-select `between` filter, aggregation counts, hidden filter, dynamic filters from CMS (`contentTypeId`, `linkDepth` dependency)
- Linked entry filter gotcha: use `fieldName.sys.id`, not just `fieldName`
- `updateSelectedFilters` argument order (group key first, item key second) with the crash consequence
- `selectedFilters` type is `{ [k: string]: string[] }` — use `includes()` not `.some()`
- `filterKeys` constants pattern in `search.schema.ts`
- Add to `sidebars.js` in the `search` section

---

#### 15. New: `docs/react-starter/search/advanced.md` *(new file)*

**Gap:** Tabs, compositions, featured results, i18n, and custom API integration have zero public documentation.

**Action:** Create new doc from `buildSearchAdvanced.md`:
- **Tabs**: `tabs` config, `tabId` on facets, `updateCurrentTab`/`currentTabIndex`/`facetTitles` from `useFacets`
- **Compositions**: `compositions` config, `composition`/`currentComposition` from `useFacets`, when to use (many facets needing sub-navigation grouping)
- **Featured results**: `featuredResults` config, `featured` array from hook, rendering pattern
- **i18n**: `languages` in `queryParams`, `i18n` on facets and filters, `defaultLang` hook param, `localisedCurrent`
- **`versionStatus` override**: per-facet override and environment variable pattern
- **Custom API**: `customApi.uri` on a listing, custom query string mapper in `search.transformations.ts`
- Add to `sidebars.js` in the `search` section

---

## Technical Considerations

- **No invention**: All content should come from the agent docs or the actual React Starter source at `react-starter-repository/react-starter/`. Do not write patterns that aren't validated in the codebase.
- **Public audience framing**: Agent docs are written for AI agents ("You build…", "Your output:"). Reframe for human developers ("This guide explains…", "Use this pattern to…").
- **Docusaurus conventions**: Use `title="path/to/file.ts"` on code blocks, `:::tip` for best practices, `:::caution` for gotchas. Internal links use `/docs/react-starter/...` absolute paths.
- **Cross-references**: Where the agent docs cross-reference each other (`See [TypeScript Standards](typescript.md)`), convert these to Docusaurus site links.
- **Sidebar order**: Any new files need adding to `sidebars.js` and assigning a `sidebar_position` that doesn't collide.
- **Overlap with existing content**: `components.md` already documents naming and location — expand don't duplicate. `storybook.md` already has a running/building section — add story-writing sections below.

## System-Wide Impact

- **Sidebar**: `sidebars.js` needs updating only if a new file (`code-style.md`) is added.
- **No code changes**: This is a documentation-only change. No risk to runtime behaviour.
- **Sidebar position collision**: `assets.md` and `theming.md` both declare `sidebar_position: 4` — fix this as part of the theming update.

## Acceptance Criteria

- [x] `installation.md` has a populated "Project structure" section with annotated directory tree
- [x] `typescript.md` covers strict mode, `type` vs interface, generics, utility types, React types, and avoiding `any`
- [x] `storybook.md` has a complete story example with `args`/`argTypes` and story title organisation convention
- [x] `theming.md` has code examples showing theme token access, transient props, and component extension
- [x] `components.md` has a full component pattern example, mapper best practices, and a component checklist
- [x] `code-style.md` is a new file covering naming conventions, import order, and Styled Components patterns
- [x] `code-style.md` is registered in `sidebars.js`
- [x] `sidebar_position` collision between `assets.md` and `theming.md` is resolved
- [x] `search.md` overview has the ownership boundary table, three contexts table, and `onRouteLoaded` wiring
- [x] `use-facets.md` is fully written with complete prop API and template skeleton
- [x] `use-listing.md` is fully written with complete prop API and template skeleton
- [x] `use-minilist.md` uses `selectSearchExists` guard, `mappers: searchTransformations`, and documents `excludeIds`
- [x] `config.md` includes `fieldLinkDepths`, `fuzzySearch`, `versionStatus`, `languages`, `internalPaging`, and a complete annotated example
- [x] `mappers.md` references current file names and shows the switch pattern, `SearchResultProps` union, and modern `resultsInfo` mapper
- [x] `filters.md` is a new file covering `customWhere` operators, `SearchFilter` type, and `updateSelectedFilters` gotcha
- [x] `advanced.md` is a new file covering tabs, compositions, featured results, and i18n
- [x] `filters.md` and `advanced.md` are registered in `sidebars.js`
- [x] All code examples are tested against the actual React Starter source — no invented APIs
- [x] No agent-internal framing ("You are…", "Your output:") appears in public docs
- [x] All internal cross-links use Docusaurus absolute paths (`/docs/react-starter/...`)

## Dependencies & Risks

- **Agent doc accuracy**: The agent docs reference theme token paths (`theme.colors.surface.secondary`) that may differ between `base/` and `professional-services/react/` projects. Verify against `react-starter-repository/react-starter/src/app/theme/` before publishing.
- **Version drift**: The agent docs were written against a specific version of the React Starter. Cross-check any API references (e.g. `contensis-delivery-api` types, `@loadable/component` usage) against the CHANGELOG before copying.
- **`useMinilist` API changes**: The public doc uses `injectRedux: injectSearch` — verify against the actual React Starter source whether this is still the mechanism or whether `searchOptions` on the route now handles it. Do not remove it if still valid.
- **Outdated mapper examples**: `mappers.md` references `json-mapper` and `fromJS` (Immutable.js). Verify `searchResultsInformation.mapper.ts` in `react-starter-repository` before replacing — if Immutable is still used, don't remove it.
- **Scope boundary**: `ci-cd.md` (empty) and other non-search stubs are out of scope — this plan covers only what the agent instruction files directly supply.

## Sources & References

### Agent Documentation (Primary Sources)

- `rs/base/.github/agents/AGENTS.md` — Project structure, tech stack, tools table
- `rs/base/.github/agents/docs/components.md` — Component pattern, mapper pattern, Composer integration, icon components, checklist
- `rs/base/.github/agents/docs/typescript.md` — TypeScript standards
- `rs/base/.github/agents/docs/code-style.md` — Naming, Styled Components, import order
- `rs/base/.github/agents/docs/testing.md` — Storybook stories, Jest mapper tests
- `professional-services/react/.github/agents/docs/ubiquitous-language.md` — Terminology disambiguation

### Search Agent Instructions (Primary Sources)

- `ai/agents/react/.github/instructions/buildSearch.md` — Architecture, ownership boundary, three contexts, step-by-step, wiring, common mistakes
- `ai/agents/react/.github/instructions/buildSearchConfig.md` — Full `SearchQueryParams` reference, annotated config example
- `ai/agents/react/.github/instructions/buildSearchFilters.md` — `customWhere` operators, `SearchFilter` type, dispatch gotchas
- `ai/agents/react/.github/instructions/buildSearchMinilist.md` — `selectSearchExists` guard, full `useMinilist` prop API, advanced options
- `ai/agents/react/.github/instructions/buildSearchTemplates.md` — Hook selection, full `useFacets`/`useListing` prop APIs, template skeletons
- `ai/agents/react/.github/instructions/buildSearchMapper.md` — `searchResults.mapper.ts` pattern, `SearchResultProps` union, `search.transformations.ts`
- `ai/agents/react/.github/instructions/buildSearchAdvanced.md` — Tabs, compositions, featured results, i18n, custom API

### Docusaurus Files to Edit

- `docs/react-starter/getting-started/installation.md:68` — Project structure stub
- `docs/react-starter/basics/typescript.md` — Expand significantly
- `docs/react-starter/basics/storybook.md` — Expand story-writing section
- `docs/react-starter/basics/theming.md` — Major expansion
- `docs/react-starter/basics/components.md` — Add full pattern + checklist
- `docs/react-starter/basics/assets.md` — Fix `sidebar_position` collision
- `docs/react-starter/search/search.md` — Add ownership boundary, `onRouteLoaded` wiring, schema constants pattern
- `docs/react-starter/search/hooks/use-minilist.md` — Update to modern `selectSearchExists` / `searchTransformations` pattern
- `docs/react-starter/search/hooks/use-facets.md` — Fill completely
- `docs/react-starter/search/hooks/use-listing.md` — Fill completely
- `docs/react-starter/search/config.md` — Add missing `QueryParams` fields and annotated example
- `docs/react-starter/search/mappers.md` — Update to modern mapper pattern
- `sidebars.js` — Register `code-style.md`, `filters.md`, `advanced.md`

### New Files to Create

- `docs/react-starter/basics/code-style.md` — New doc from agent `code-style.md`
- `docs/react-starter/search/filters.md` — New doc from `buildSearchFilters.md`
- `docs/react-starter/search/advanced.md` — New doc from `buildSearchAdvanced.md`

### Verification Sources

- `react-starter-repository/react-starter/src/app/theme/` — Authoritative theme token values
- `react-starter-repository/react-starter/src/app/components/` — Authoritative component patterns
- `react-starter-repository/react-starter/src/app/search/` — Verify current mapper file names and API
- `react-starter-repository/react-starter/src/app/redux/selectors.ts` — Verify `selectSearchExists` is exported
- `react-starter-repository/react-starter/CHANGELOG.md` — Version context
