---
sidebar_position: 2
---

# useListing

`useListing` is the hook for dedicated listing and category pages. It supports both text search and UI filters, and binds its state to the URL.

## When to use `useListing`

Use `useListing` for any **dedicated listing or category page** — a page whose primary purpose is showing a filtered, browsable set of results. This includes pages with text search input.

For a global, multi-tab search UI with facet switching, use [`useFacets`](/docs/react-starter/search/hooks/use-facets) instead.

## Key differences from `useFacets`

| | `useFacets` | `useListing` |
|---|---|---|
| Search term prop | `currentSearchTerm` | `searchTerm` |
| Filter state prop | `facetFilters` | `filters` |
| Filter init | Always defined | Values may be `undefined` during initialisation — guard before rendering |
| Use case | Global multi-tab search | Dedicated listing page |

## Prop API

| Prop | Type | Description |
|------|------|-------------|
| `results` | `T[]` | Mapped result items |
| `isLoading` | `boolean` | `true` while results are being fetched |
| `resultsInfo` | `object` | `{ resultsText, noResultsText, ...custom }` |
| `searchTerm` | `string` | Current free-text search term |
| `updateSearchTerm` | `(term: string) => void` | Update the search term |
| `filters` | `Filters` | Filter definitions from config — values may be `undefined` during init |
| `selectedFilters` | `{ [key: string]: string[] }` | Selected item keys per filter group |
| `updateSelectedFilters` | `(filterGroupKey: string, itemKey: string) => void` | Toggle a filter — **group key first, item value second** |
| `clearFilters` | `(opts?) => void` | Clear filters, optionally also the search term |
| `paging` | `Paging` | `{ pageIndex, pageSize, totalCount, pageCount }` |
| `updatePageIndex` | `(index: number) => void` | Navigate to a page |

## Complete template skeleton

```tsx title="src/app/templates/plantListing/plantListing.template.tsx"
import type { Filter } from '@zengenti/contensis-react-base/models/search/models/SearchState';
import { useListing } from '@zengenti/contensis-react-base/search';

import SearchTransformations from '~/search/search.transformations';
import type { SearchResultProps } from '~/search/searchResults.mapper';

const PlantListing = () => {
  const {
    results,
    isLoading,
    resultsInfo: { resultsText, noResultsText },
    searchTerm,           // note: not currentSearchTerm
    updateSearchTerm,
    selectedFilters,
    filters,              // note: not facetFilters — values may be undefined during init
    updateSelectedFilters,
    clearFilters,
    paging,               // paging.pageIndex, paging.pageSize, paging.totalCount
    updatePageIndex,
  } = useListing<SearchResultProps>({ mappers: SearchTransformations });

  return (
    <div>
      {/* Optional text search input */}
      <input
        type="search"
        defaultValue={searchTerm}
        onKeyDown={e =>
          e.key === 'Enter' &&
          updateSearchTerm((e.target as HTMLInputElement).value)
        }
      />

      {/* Filter UI — cast entries to guard against undefined values during init */}
      {filters &&
        (Object.entries(filters) as [string, Filter | undefined][]).map(([key, filter]) => {
          if (!filter) return null; // values are undefined during initialisation
          return (
            <fieldset key={key}>
              <legend>{filter.title}</legend>
              {filter.items?.map(item => (
                <label key={item.key}>
                  <input
                    type={filter.isSingleSelect ? 'radio' : 'checkbox'}
                    checked={selectedFilters[key]?.includes(item.key) ?? false}
                    onChange={() => updateSelectedFilters(key, item.key)}
                    {/* group key first, item value second ↑ */}
                  />
                  {item.title}
                </label>
              ))}
            </fieldset>
          );
        })}

      {isLoading && <p>Loading...</p>}
      {!isLoading && noResultsText && <p>{noResultsText}</p>}

      {!isLoading && results.length > 0 && (
        <>
          <ul>
            {results.map(item => (
              <li key={item.id}>
                <a href={item.uri}>{item.title}</a>
              </li>
            ))}
          </ul>

          <p>{resultsText}</p>

          <button
            disabled={paging.pageIndex === 0}
            onClick={() => updatePageIndex(paging.pageIndex - 1)}
          >
            Previous
          </button>
          <button
            disabled={(paging.pageIndex + 1) * paging.pageSize >= paging.totalCount}
            onClick={() => updatePageIndex(paging.pageIndex + 1)}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default PlantListing;
```

## Route wiring

```typescript title="src/app/routes/staticRoutes.ts"
import { listings } from '~/schema/search.schema';

{
  path: '/plants',
  component: PlantListing,
  searchOptions: {
    listingType: listings.plants, // note: listingType, not facet; always use schema constant
  },
},
```

## Registering the template

```typescript title="src/app/templates/index.ts"
import loadable from '@loadable/component';

export const PlantListing = loadable(
  () => import('~/templates/plantListing/plantListing.template')
);
```

:::caution
**`filters` values**: Unlike `useFacets`'s `facetFilters`, the `filters` object from `useListing` has values typed as `Filter | undefined` during initialisation. Always guard with `if (!filter) return null` before rendering.

**`updateSelectedFilters` argument order**: group key first, item value second. Reversing these causes a runtime crash.
:::
