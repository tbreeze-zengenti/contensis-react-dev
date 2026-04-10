---
sidebar_position: 4
title: Filters
---

# Filters

This guide covers two ways to restrict search results: `customWhere` query clauses (applied at the API level) and `SearchFilter` UI filters (driven by user interaction).

## Part 1: `customWhere` query syntax

`customWhere` lets you add static restrictions to a search query. The clauses use **HTTP API object notation** — different from the `Op` calls used in direct Delivery API queries inside sagas.

```typescript
import type { CustomWhereClause, WhereClause } from
  '@zengenti/contensis-react-base/models/search/models/Search';
```

### Operators

| Operator | Example |
|----------|---------|
| `equalTo` | `{ field: 'fields.category', equalTo: 'indoor' }` |
| `contains` | `{ field: 'fields.description', contains: 'tropical' }` |
| `startsWith` | `{ field: 'fields.slug', startsWith: 'blog-' }` |
| `endsWith` | `{ field: 'fields.slug', endsWith: '-2024' }` |
| `in` | `{ field: 'fields.tags', in: ['drought-tolerant', 'fast-growing'] }` — value **must** be an array |
| `exists` | `{ field: 'sys.uri', exists: true }` |
| `between` | `{ field: 'fields.price', between: [10, 50] }` — inclusive |
| `greaterThan` | `{ field: 'sys.version.created', greaterThan: '2024-01-01T00:00:00Z' }` |
| `greaterThanOrEqualTo` | `{ field: 'fields.rating', greaterThanOrEqualTo: 4 }` |
| `lessThan` | `{ field: 'fields.price', lessThan: 100 }` |
| `lessThanOrEqualTo` | `{ field: 'fields.price', lessThanOrEqualTo: 99.99 }` |
| `freeText` | `{ field: 'entryTitle', freeText: 'spider plant' }` |
| `distanceWithin` | `{ field: 'fields.location', distanceWithin: { lat: 51.5, lon: -0.1, distance: '10mi' } }` |

### Logical composition

```typescript
// NOT — wraps a single WhereClause (not an array)
{ not: { field: 'sys.versionStatus', equalTo: 'archived' } }

// OR — any one of these conditions
{ or: [
  { field: 'fields.category', equalTo: 'indoor' },
  { field: 'fields.category', equalTo: 'tropical' },
] }

// AND — all of these conditions
{ and: [
  { field: 'fields.inStock', equalTo: true },
  { field: 'fields.price', lessThan: 50 },
] }
```

:::caution
`not` wraps a **single** `WhereClause` — not an array. You cannot nest `and`/`or` inside `not`.

Do **not** use `Op` calls inside `customWhere`. `Op.equalTo('field', 'value')` is the JS SDK used in sagas for direct Delivery API queries. In `search.config.ts`, always use the object notation above.
:::

The top-level `customWhere` array elements are **implicitly AND'd** together with the rest of the query.

### Real-world examples

```typescript
// Items published this year, not archived, in stock
const customWhere: CustomWhereClause = [
  { field: 'sys.uri', exists: true },
  { field: 'sys.version.created', greaterThan: '2026-01-01T00:00:00Z' },
  { not: { field: 'sys.versionStatus', equalTo: 'archived' } },
  { field: 'fields.inStock', equalTo: true },
];

// Products in a price range, in one of two categories
const customWhere: CustomWhereClause = [
  { field: 'sys.uri', exists: true },
  { field: 'fields.price', between: [10, 100] },
  { or: [
    { field: 'fields.category', equalTo: 'pot' },
    { field: 'fields.category', equalTo: 'accessories' },
  ] },
];
```

---

## Part 2: `SearchFilter` — UI-driven filters

`SearchFilter` lets users narrow results by selecting values from a filter panel. CRB handles the Redux state and query generation automatically — no custom sagas needed.

### `SearchFilter` type

```typescript
type SearchFilter = {
  title: string;              // Label shown in the filter UI
  fieldId: string | string[]; // CMS field path(s) to filter on
  items: FilterItem[];        // Selectable values
  fieldOperator?: string;     // How items match: 'equalTo' | 'in' | 'contains' | 'between' | etc.
  logicOperator?: string;     // How multiple selections combine: 'or' (default) | 'and'
  isSingleSelect?: boolean;   // true = radio behavior (one item at a time)
  isGrouped?: boolean;        // Sync selected values across facets sharing this key
  renderable?: boolean;       // false = hidden — drives query but not shown in UI
  aggregations?: boolean;     // true = CRB returns result counts per item
  contentTypeId?: string;     // Dynamically load items from CMS entries of this type
  path?: string;              // Dynamically load items from a taxonomy path
  customWhere?: CustomWhereClause; // Extra restriction when loading dynamic items
  defaultValue?: string;      // Placeholder text when nothing is selected
  i18n?: { [language: string]: string }; // Per-language title translations
};
```

:::caution
Always set `isSingleSelect` explicitly (`true` or `false`) on every filter. If omitted, the template reads it as `undefined` and silently defaults to multi-select, regardless of intent.
:::

### Basic OR filter

```typescript
filters: {
  category: {
    title: 'Category',
    fieldId: 'fields.category',
    fieldOperator: 'equalTo',
    isSingleSelect: false,   // always set explicitly
    logicOperator: 'or',     // multiple selections = OR (default)
    items: [
      { key: 'indoor',   title: 'Indoor' },
      { key: 'outdoor',  title: 'Outdoor' },
      { key: 'tropical', title: 'Tropical' },
    ],
  },
},
```

### Single-select `between` filter

```typescript
priceRange: {
  title: 'Price Range',
  fieldId: 'fields.price',
  fieldOperator: 'between',
  isSingleSelect: true,
  items: [
    { key: '0,10',   title: 'Under £10' },
    { key: '10,50',  title: '£10 – £50' },
    { key: '50,200', title: '£50 – £200' },
  ],
},
```

### Filter with aggregation counts

```typescript
roomType: {
  title: 'Room Type',
  fieldId: 'fields.roomType',
  fieldOperator: 'equalTo',
  isSingleSelect: false,
  aggregations: true, // CRB fetches result counts per item (e.g. "Bathroom (12)")
  items: [
    { key: 'living-room', title: 'Living Room' },
    { key: 'bathroom',    title: 'Bathroom' },
  ],
},
```

### Hidden filter

```typescript
publishedOnly: {
  title: '',
  fieldId: 'sys.versionStatus',
  fieldOperator: 'equalTo',
  renderable: false, // never shown in UI — drives query only
  items: [{ key: 'published', title: 'Published' }],
},
```

### Dynamic filters from CMS entries

Set `contentTypeId` and leave `items` as an empty array. CRB fetches and populates filter items from CMS entries at runtime.

```typescript
author: {
  title: 'Author',
  fieldId: 'author.sys.id',           // linked entry — must use .sys.id
  fieldOperator: 'equalTo',
  isSingleSelect: false,
  contentTypeId: contentTypes.person, // CRB loads person entries as filter items
  items: [],                          // populated at runtime
},
```

:::caution
**Linked entry filters must use `.sys.id`**. When a field is a linked entry (`dataType: object`), filtering on just the field name never matches — the stored value is an object, not a scalar. Always use `fieldName.sys.id`:

```typescript
// ❌ Wrong — 'author' is a linked entry object
fieldId: 'author',

// ✅ Correct — match on the linked entry's ID
fieldId: 'author.sys.id',
```

**`linkDepth` dependency**: dynamic filters on linked entry fields require `linkDepth: 1` (or a matching `fieldLinkDepths` entry) in `queryParams`. Without it, the linked entry in results resolves to a `{ sys }` stub — filter selections still narrow results correctly, but `entry.author?.entryTitle` in the mapper returns `undefined`.
:::

## Dispatching filter selections

```typescript
const { updateSelectedFilters, selectedFilters, clearFilters } =
  useFacets<SearchResultProps>({ mappers: SearchTransformations });

// Toggle a filter value — FILTER GROUP KEY first, ITEM VALUE second
updateSelectedFilters(filterKeys.category, 'indoor');
//                    ^^^^^^^^^^^^^^^^^^^  ^^^^^^^
//                    group key first      item value second

// Check if a value is selected — selectedFilters values are string[]
const isSelected = selectedFilters[filterKeys.category]?.includes('indoor') ?? false;

// Clear all filters
clearFilters();

// Clear search term only
clearFilters({ term: true });

// Clear specific filter groups
clearFilters({ keys: [filterKeys.category] });
```

:::caution
**Argument order**: `updateSelectedFilters(groupKey, itemKey)` — group key comes **first**, item value comes **second**. Reversing these causes a runtime crash: `Cannot read properties of undefined (reading 'isSingleSelect')`.

**`selectedFilters` type**: values are `string[]` — use `Array.includes()` to check selection state, not `.some(f => f.key === x)`.
:::

### Filter key constants

Define filter keys as constants in `search.schema.ts`:

```typescript title="src/app/schema/search.schema.ts"
export const filterKeys = {
  category: 'category',
  priceRange: 'priceRange',
  author: 'author',
};
```

The same `updateSelectedFilters`/`clearFilters` API works identically in `useListing` and `useMinilist`.
