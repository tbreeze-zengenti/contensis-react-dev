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

## Third-party data with a minilist

A minilist isn't limited to the Contensis Delivery API. Instead of referencing a config block in `search.config.ts`, you can pass a **config on the fly** that points the minilist at a custom, non-Contensis API using the `customApi` option. CRB fetches from your endpoint and runs the response through your mapper, giving you the same store-backed `results`/`isLoading`/`paging` model, just sourced externally.

:::note Minilists fetch client-side
Like every minilist, a `customApi` minilist initialises inside a `useEffect` gated on `selectSearchExists`, so the fetch runs **in the browser after hydration** — not during SSR. The data is therefore absent from the first server-rendered paint. If you need third-party data present at first paint (for SEO, or to avoid a loading flash), use the route-lifecycle saga in [Fetching third-party data](../../advanced/redux/ssr-fetch.md) instead. Reach for a `customApi` minilist when you want an embedded, client-side widget with the minilist's built-in loading/paging/mapping ergonomics and SSR isn't required.
:::

The example below queries the public [OMDb API](https://www.omdbapi.com/):

```typescript title="src/app/search/minilists/useMovies.minilist.ts"
import { useEffect, useState } from 'react';
import { useMinilist } from '@zengenti/contensis-react-base/search';
import { useSelector } from 'react-redux';
import { selectSearchExists } from '~/redux/selectors';
import type { UseMinilistProps } from '@zengenti/contensis-react-base/search';

type MovieProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
};

// Map the third-party response shape into your own result type
const omdbapiResultMapper = (body: any): MovieProps[] => {
  return body?.Search?.map((r: any): MovieProps => ({
    id: r.imdbID,
    title: r.Title + ' ' + r.Year,
    description: '',
    image: r?.Poster !== 'N/A' ? r.Poster : null,
    link: 'https://www.imdb.com/title/' + r.imdbID,
  }));
};

const minilistInitState = { id: '' } as UseMinilistProps;

export default () => {
  const isSearchSetup = useSelector(selectSearchExists);
  const [minilistOptions, setMinilistOptions] = useState(minilistInitState);

  useEffect(() => {
    if (!isSearchSetup) return; // search Redux is injected dynamically — wait for it

    setMinilistOptions({
      id: 'movies',
      // config created on the fly rather than read from search.config.ts
      config: {
        title: 'Custom Api',
        customApi: {
          uri: 'http://www.omdbapi.com/?apikey=b194ff96',
        },
      },
      mappers: {
        // returns extra query params appended to the customApi uri
        customApi: () => ({
          s: 'dawn of the dead', // -> &s=dawn of the dead
        }),
        // maps the raw response body into MovieProps[]
        results: omdbapiResultMapper,
      },
    });
  }, [isSearchSetup]);

  return useMinilist<MovieProps>(minilistOptions);
};
```

Key differences from a Contensis-backed minilist:

- **`config` inline, not `id` lookup** — you build the config object in the hook instead of registering it in `search.config.ts`. The `id` (`'movies'`) just namespaces the minilist's Redux state.
- **`config.customApi.uri`** — the base URL CRB fetches from. Append fixed query params here, or add dynamic ones via the `customApi` mapper.
- **`mappers.customApi`** — returns an object of query params merged onto the `uri` for each request (the equivalent of `queryParams` for a Contensis minilist).
- **`mappers.results`** — transforms the raw third-party response body into your typed result array.

The `selectSearchExists` guard still applies — the minilist Redux state is dynamically injected regardless of the data source.

:::caution Secrets and CORS
The example embeds an API key directly in the `uri`, which means the request runs from the browser and the key is public. That's fine for a free demo key, but for anything sensitive keep the call server-side — proxy it through your SSR/Express layer — or use the Redux saga pattern in [Fetching third-party data](../../advanced/redux/ssr-fetch.md) instead.
:::

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
