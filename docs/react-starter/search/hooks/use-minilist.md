---
sidebar_position: 3
title: useMinilist
---

# useMinilist

`useMinilist` lets you embed a self-contained results list anywhere on a page — without a dedicated search route. Common use cases:

- A "Related Articles" section at the bottom of a blog post
- A homepage "Latest Posts" widget
- Any embedded results list that doesn't need URL-bound state

## Why the `selectSearchExists` guard is required

CRB's search Redux state is **dynamically injected** the first time a search route loads. On pages with no search route (a plain content page, a homepage), the search slice is `undefined`.

Calling `useMinilist` before the state exists throws a runtime error. The guard — `useSelector(selectSearchExists)` — waits until CRB has injected the state before initialising the minilist.

**Never call `useMinilist` directly in a component.** Always wrap it in the hook file pattern below.

## Step-by-step

### 1. Register the key in `search.schema.ts`

```typescript title="src/app/schema/search.schema.ts"
export const minilists = {
  all: 'all',
  relatedArticles: 'relatedArticles', // add here
};
```

### 2. Add config in `search.config.ts`

```typescript title="src/app/search/search.config.ts"
minilist: {
  [minilists.relatedArticles]: {
    title: 'Related Articles',
    queryParams: {
      contentTypeIds: [contentTypes.blogPost],
      fields: [...baseFields],
      pageSize: 5,
      customWhere: [whereSysUri], // always include
    },
  },
},
```

### 3. Create the hook file

```typescript title="src/app/search/minilists/relatedArticles.minilist.ts"
import { useEffect, useState } from 'react';
import { useMinilist } from '@zengenti/contensis-react-base/search';
import type { UseMinilistProps } from '@zengenti/contensis-react-base/search';
import { useSelector } from 'react-redux';
import { minilists } from '~/schema/search.schema';
import searchTransformations from '~/search/search.transformations';
import type { SearchResultProps } from '~/search/searchResults.mapper';
import { selectSearchExists } from '~/redux/selectors';

const minilistInitState: UseMinilistProps = {
  id: '',
  mapper: searchTransformations.results,
};

export default () => {
  const isSearchSetup = useSelector(selectSearchExists);
  const [minilistOptions, setMinilistOptions] = useState(minilistInitState);

  useEffect(() => {
    // Search Redux is dynamically injected — wait until it is ready
    if (!isSearchSetup) return;
    setMinilistOptions({
      id: minilists.relatedArticles,
      mappers: searchTransformations,
    });
  }, [isSearchSetup]);

  return useMinilist<SearchResultProps>(minilistOptions);
};
```

### 4. Use the hook in any component

```tsx title="src/app/components/relatedArticles/relatedArticles.component.tsx"
import useRelatedArticles from '~/search/minilists/relatedArticles.minilist';

const RelatedArticles = () => {
  const { results, isLoading } = useRelatedArticles();

  if (isLoading) return <p>Loading...</p>;
  if (!results.length) return null;

  return (
    <section>
      <h2>Related Articles</h2>
      <ul>
        {results.map(item => (
          <li key={item.id}>
            <a href={item.uri}>{item.title}</a>
          </li>
        ))}
      </ul>
    </section>
  );
};
```

## Prop API

Props returned by `useMinilist<T>(options)`:

| Prop | Type | Description |
|------|------|-------------|
| `results` | `T[]` | Mapped result items |
| `isLoading` | `boolean` | `true` while fetching |
| `resultsInfo` | `object` | `{ resultsText, noResultsText, ...custom }` |
| `paging` | `Paging` | `{ pageCount, pageIndex, pageSize, totalCount }` |
| `title` | `string` | Minilist title from config |
| `sortOrder` | `string[]` | Current sort expressions |
| `selectedFilters` | `object` | Selected filter state |
| `updatePageIndex` | `(index: number) => void` | Navigate to a page |
| `updatePageSize` | `(size: number) => void` | Change page size |
| `updateSelectedFilters` | `(groupKey, itemKey) => void` | Toggle a filter |
| `updateSortOrder` | `(orderBy: string[]) => void` | Change sort |

**Not available in `useMinilist`:** `updateSearchTerm`, `clearFilters`, `updateCurrentFacet`, `updateCurrentTab`.

## Advanced options

### Excluding the current page entry

Pass `excludeIds` to prevent the current page's own entry appearing in the results:

```typescript
useEffect(() => {
  if (!isSearchSetup || !currentEntryId) return;
  setMinilistOptions({
    id: minilists.relatedArticles,
    mappers: searchTransformations,
    excludeIds: [currentEntryId],
  });
}, [isSearchSetup, currentEntryId]);
```

### Syncing with the main search term

Set `queryParams.useSearchTerm: true` in the minilist config to have the minilist respond to the same free-text term as the main search facet on the page:

```typescript title="src/app/search/search.config.ts"
minilist: {
  [minilists.relatedArticles]: {
    queryParams: {
      contentTypeIds: [contentTypes.blogPost],
      fields: [...baseFields],
      customWhere: [whereSysUri],
      useSearchTerm: true, // minilist mirrors the main search term
    },
  },
},
```

When `useSearchTerm: true`, the hook also returns `searchTerm: string`.
