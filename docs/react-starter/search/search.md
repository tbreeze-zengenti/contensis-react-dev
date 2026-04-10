---
title: Overview
sidebar_position: 1
---

# Overview

Contensis React Base (CRB) provides a complete search system backed by Contensis's Elasticsearch implementation. React Starter gives you a boilerplate configuration layer on top of it, plus hooks for connecting React components to search state.

## Architecture

Search in React Starter is built on three layers:

1. **Config** — defines what to search for (content types, facets, listings, minilists) via `search.config.ts`
2. **Mappers** — transform raw Delivery API results into the shape your components need
3. **Hooks** — `useFacets`, `useListing`, and `useMinilist` from CRB connect React components to search Redux state

### What the app owns vs what CRB owns

CRB provides all search Redux state, sagas, and action creators. **Never create your own search reducers, sagas, or action type constants** — they will conflict with CRB at runtime.

Your app only provides:

| File | Purpose |
|------|---------|
| `src/app/search/search.config.ts` | Declares facets, listings, and minilists with their query parameters |
| `src/app/search/search.transformations.ts` | The `SearchTransformations` object passed to all hooks |
| `src/app/search/searchResults.mapper.ts` | Maps raw CMS `Entry[]` to typed component props |
| `src/app/search/searchResultsInformation.mapper.ts` | Maps Redux state to result counts and status text |
| `src/app/schema/search.schema.ts` | String key constants for all facets, listings, and minilists |
| `src/app/routes/withEvents.ts` | Wires `searchConfig` into CRB via `onRouteLoaded` |
| `src/app/templates/<name>/` | Page template that calls `useFacets` or `useListing` |
| `src/app/search/minilists/<name>.minilist.ts` | Wrapper hook around `useMinilist` |

## The three search contexts

| Context | Hook | Config key | Route binding | Use case |
|---------|------|------------|--------------|---------|
| **Facet** | `useFacets` | `searchConfig.facets` | `searchOptions.facet` | Multi-tab search UI with facet switching; URL-bound state |
| **Listing** | `useListing` | `searchConfig.listings` | `searchOptions.listingType` | Dedicated listing/category page; supports text search and filters |
| **Minilist** | `useMinilist` | `searchConfig.minilist` | None — no route needed | Embedded results widget; local state, not URL-bound |

## Wiring search to routes

Search state is **dynamically injected** when a search route loads. This happens in `withEvents.ts` via `onRouteLoaded`:

```typescript title="src/app/routes/withEvents.ts"
import searchTransformations from '~/search/search.transformations';
import { searchConfig } from '~/search/search.config';

onRouteLoaded: function* onRouteLoaded({ params }) {
  return yield {
    searchOptions: {
      config: searchConfig,          // passes ALL facets, listings, and minilists
      mappers: searchTransformations, // required — omitting this silently breaks result mapping
      params,
    },
  };
},
```

:::caution
This **must** be in `onRouteLoaded`, not `onRouteLoad`. Using the wrong lifecycle hook means search Redux is never injected and hooks will receive no data. Omitting `mappers` is a silent failure — results will render without the title/URI/description mapping.
:::

## Schema constants

Always define facet, listing, and minilist keys as constants in `src/app/schema/search.schema.ts`. Never use string literals directly in routes or config:

```typescript title="src/app/schema/search.schema.ts"
export const facets = {
  all: 'all',
  news: 'news',
};

export const listings = {
  plants: 'plants',
};

export const minilists = {
  relatedArticles: 'relatedArticles',
};

export const freeTextWeights = {
  title: 10,
  description: 5,
  body: 1,
};
```

Use these constants in routes and config:

```typescript
// ✅ Correct — refactor-safe
{ path: '/search', searchOptions: { facet: facets.all } }

// ❌ Wrong — typo-prone, silently broken if the key changes
{ path: '/search', searchOptions: { facet: 'all' } }
```

## `baseFields` and `whereSysUri`

Two patterns are required in every facet, listing, and minilist config:

**`baseFields`** — always start your field projection with `baseFields` from `src/app/schema/fields.schema.ts`. This ensures every result has the minimum fields needed for a result card (`entryTitle`, `entryDescription`, `entryThumbnail`, `sys.id`, `sys.uri`, etc.):

```typescript
import { baseFields } from '~/schema/fields.schema';

queryParams: {
  fields: [...baseFields, 'author', 'category'], // always spread baseFields first
}
```

**`whereSysUri`** — always include this clause in `customWhere` to exclude non-routable entries (drafts, config entries, etc.) from results:

```typescript
const whereSysUri = { field: 'sys.uri', exists: true };

queryParams: {
  customWhere: [whereSysUri],
}
```

## Next steps

- [Config](/docs/react-starter/search/config) — full `SearchQueryParams` reference and annotated example
- [Mappers](/docs/react-starter/search/mappers) — how to write `searchResults.mapper.ts` and `searchResultsInformation.mapper.ts`
- [Filters](/docs/react-starter/search/filters) — `customWhere` query syntax and `SearchFilter` UI filters
- [`useFacets`](/docs/react-starter/search/hooks/use-facets) — hook API and full template skeleton
- [`useListing`](/docs/react-starter/search/hooks/use-listing) — hook API and full template skeleton
- [`useMinilist`](/docs/react-starter/search/hooks/use-minilist) — embedded widget hook
- [Advanced](/docs/react-starter/search/advanced) — tabs, compositions, featured results, i18n
