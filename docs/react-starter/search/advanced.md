---
sidebar_position: 5
---

# Advanced Search

This guide covers tabs, compositions, featured results, internationalisation, version status, and custom API integration.

## Tabs

Tabs partition a search UI into named sections — each tab shows a subset of facets and has its own URL-bound state.

### Configure tabs

```typescript title="src/app/schema/search.schema.ts"
export const tabs = { all: 0, news: 1, products: 2 };
```

```typescript title="src/app/search/search.config.ts"
{
  tabs: [
    { id: tabs.all,      label: 'All' },
    { id: tabs.news,     label: 'News' },
    { id: tabs.products, label: 'Products' },
  ],
  facets: {
    [facets.all]:      { tabId: tabs.all,      title: 'All',      queryParams: { ... } },
    [facets.news]:     { tabId: tabs.news,     title: 'News',     queryParams: { ... } },
    [facets.articles]: { tabId: tabs.news,     title: 'Articles', queryParams: { ... } },
    [facets.plants]:   { tabId: tabs.products, title: 'Plants',   queryParams: { ... } },
  },
}
```

The `Tab` type:

```typescript
type Tab = {
  id: number;            // Zero-based tab identifier
  label: string;         // Display label
  defaultFacet?: string; // Facet key to show when this tab is first activated
  totalCount?: string;   // Facet key whose totalCount is shown as the tab's count badge
};
```

### Use tabs in a template

```tsx
const {
  currentTabIndex,
  updateCurrentTab,
  updateCurrentFacet,
  facetTitles,       // [{ key, title, isSelected, totalCount }] for the current tab
  searchTotalCount,  // sum of all facets' totalCount
} = useFacets<T>({ mappers: SearchTransformations });

// Tab navigation
{searchConfig.tabs?.map(tab => (
  <button
    key={tab.id}
    onClick={() => updateCurrentTab(tab.id)}
    aria-selected={currentTabIndex === tab.id}
  >
    {tab.label}
  </button>
))}

// Facet navigation within the current tab
{facetTitles.map(({ key, title, isSelected, totalCount }) => (
  <button
    key={key}
    onClick={() => updateCurrentFacet(key)}
    aria-selected={isSelected}
  >
    {title} ({totalCount})
  </button>
))}
```

---

## Compositions

Compositions group related facets or listings under a shared title for sub-navigation — useful when a search page has many facets that benefit from logical grouping.

### Configure compositions

```typescript title="src/app/search/search.config.ts"
{
  compositions: {
    gardening: { title: 'Gardening', facets:   ['plants', 'pots', 'tools'] },
    interior:  { title: 'Interior',  listings: ['rooms', 'furniture'] },
  },
  facets: {
    plants: { ... },
    pots:   { ... },
    tools:  { ... },
  },
  listings: {
    rooms:     { ... },
    furniture: { ... },
  },
}
```

### Use compositions in a template

```typescript
const { composition, currentComposition } = useFacets<T>({ mappers: SearchTransformations });
// composition: { title: string; facets: string[] } for the active composition
// currentComposition: key of the active composition
```

---

## Featured results

Featured results execute a **secondary query** alongside the main search, returning flagged entries in a separate `featured` array. The main results are unaffected.

### Configure featured results

```typescript
queryParams: {
  contentTypeIds: [contentTypes.plant],
  fields: [...baseFields],
  customWhere: [whereSysUri],
  featuredResults: {
    fieldId: 'fields.isFeatured', // Boolean CMS field
    fieldValue: true,             // Value that marks an entry as featured
    count: 3,                     // Number of featured results to retrieve
  },
},
```

### Use in a template

```tsx
const { results, featured } = useFacets<T>({ mappers: SearchTransformations });

{featured.length > 0 && (
  <section>
    <h2>Featured</h2>
    <ul>{featured.map(item => <li key={item.id}>{item.title}</li>)}</ul>
  </section>
)}

<ul>{results.map(item => <li key={item.id}>{item.title}</li>)}</ul>
```

`featured` is typed as `T[]` — the same type as `results`.

---

## Internationalisation (i18n)

### Restrict results to a language

```typescript
queryParams: {
  contentTypeIds: [...],
  fields: [...baseFields],
  customWhere: [whereSysUri],
  languages: ['en-GB'], // only return entries in this language
},
```

### Per-language facet and filter titles

Add an `i18n` map to facet and filter configs:

```typescript
[facets.plants]: {
  title: 'Plants',
  i18n: { 'de-DE': 'Pflanzen', 'fr-FR': 'Plantes' },
  queryParams: { ... },
  filters: {
    category: {
      title: 'Category',
      i18n: { 'de-DE': 'Kategorie', 'fr-FR': 'Catégorie' },
      fieldId: 'fields.category',
      fieldOperator: 'equalTo',
      items: [{ key: 'indoor', title: 'Indoor' }],
    },
  },
},
```

### Pass language to the hook

```typescript
useFacets<T>({ mappers: SearchTransformations, defaultLang: 'de-DE' });
useListing<T>({ mappers: SearchTransformations, defaultLang: 'de-DE' });
```

When `defaultLang` is set, CRB uses the `i18n` translations for titles and builds localised filter key URLs. The hook also returns `localisedCurrent` — the active facet key translated for the active language.

---

## `versionStatus` override

Override the version filter per facet — useful when different environments serve different content statuses:

```typescript
queryParams: {
  contentTypeIds: [...],
  fields: [...baseFields],
  customWhere: [whereSysUri],
  versionStatus: 'published', // 'latest' | 'published'
},
```

In practice, read this from an environment variable rather than hardcoding it:

```typescript title="src/app/search/search.config.ts"
import { deliveryApiVersionStatus } from '~/util/config';

queryParams: {
  versionStatus: deliveryApiVersionStatus, // 'latest' on dev, 'published' on prod
},
```

---

## Custom API integration

Replace the Contensis Delivery API with a custom REST endpoint for a specific listing — useful for searching third-party data sources while keeping the same CRB Redux state structure.

### Configure a custom API listing

```typescript
listings: {
  [listings.externalProducts]: {
    title: 'Products',
    queryParams: {
      contentTypeIds: [],
      fields: [...baseFields],
      pageSize: 12,
    },
    customApi: {
      uri: 'https://api.example.com/search', // CRB appends query params as a GET query string
    },
  },
},
```

### Custom query string mapping

To control how CRB builds the query string for your endpoint, add a `customApi` mapper to `search.transformations.ts`:

```typescript title="src/app/search/search.transformations.ts"
export default {
  results: searchResultsMapper,
  resultsInfo: searchResultsInformationMapper,
  customApi: (params) => ({
    q: params.searchTerm,
    page: String(params.pageIndex),
    size: String(params.pageSize),
  }),
} as SearchTransformations;
```
