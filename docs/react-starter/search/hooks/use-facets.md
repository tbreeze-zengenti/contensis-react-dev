---
sidebar_position: 1
---

# useFacets

`useFacets` is the hook for multi-tab, faceted search UIs. It manages URL-bound state for free-text search, facet switching, filters, and pagination.

## When to use `useFacets`

Use `useFacets` when building a **global search page** with multiple content type groups and tab or facet switching (e.g. "All / News / Products").

For a dedicated listing or category page — even one with text search — use [`useListing`](/docs/react-starter/search/hooks/use-listing) instead.

## Prop API

All props returned by `useFacets<T>({ mappers })`:

### Results

| Prop | Type | Description |
|------|------|-------------|
| `results` | `T[]` | Mapped result items for the current facet and page |
| `isLoading` | `boolean` | `true` while results are being fetched |
| `pageIsLoading` | `boolean` | `true` while a specific page is loading (separate from facet-wide loading) |
| `featured` | `T[]` | Featured results (only populated when `featuredResults` is configured) |
| `totalCount` | `number` | Total number of matching results |
| `pageSize` | `number` | Current results per page |
| `currentPageIndex` | `number` | Zero-based current page index |
| `paging` | `Paging` | Full paging state: `pageCount`, `pageIndex`, `pageSize`, `totalCount`, `pagesLoaded` |
| `resultsInfo` | `object` | `{ resultsText, noResultsText, ...custom }` from `searchResultsInformationMapper` |

### Free-text search

| Prop | Type | Description |
|------|------|-------------|
| `currentSearchTerm` | `string` | The active free-text search term |
| `updateSearchTerm` | `(term: string) => void` | Update the search term (triggers a new search) |

### Filters

| Prop | Type | Description |
|------|------|-------------|
| `selectedFilters` | `{ [key: string]: string[] }` | Selected item keys per filter group — each value is a `string[]` |
| `facetFilters` | `SearchFilters` | Filter definitions from config (use to render filter UI) |
| `updateSelectedFilters` | `(filterGroupKey: string, itemKey: string) => void` | Toggle a filter — **group key first, item value second** |
| `clearFilters` | `(clear?: { term?: boolean; keys?: boolean \| string[] }) => void` | Clear all filters, or just the term, or specific filter keys |

### Navigation

| Prop | Type | Description |
|------|------|-------------|
| `updatePageIndex` | `(index: number) => void` | Navigate to a page |
| `updatePageSize` | `(size: number) => void` | Change results per page |
| `updateSortOrder` | `(orderBy: string[], facet?: string) => void` | Change sort expression |
| `updateCurrentFacet` | `(facet: string) => void` | Switch to a different facet |
| `updateCurrentTab` | `(id: number) => void` | Switch to a different tab |
| `sortOrder` | `string[]` | Current sort order expressions |
| `currentFacet` | `string` | Key of the active facet |
| `currentTabIndex` | `number` | Index of the active tab |
| `searchTotalCount` | `number` | Sum of `totalCount` across all facets |
| `facetTitles` | `{ key: string; title: string; isSelected: boolean; totalCount: number }[]` | Facet labels for the current tab |

## Complete template skeleton

```tsx title="src/app/templates/search/search.template.tsx"
import { useFacets } from '@zengenti/contensis-react-base/search';
import SearchTransformations from '~/search/search.transformations';
import type { SearchResultProps } from '~/search/searchResults.mapper';

const SearchPage = () => {
  const {
    results,
    isLoading,
    resultsInfo: { resultsText, noResultsText },
    totalCount,
    pageSize,
    currentPageIndex,
    currentSearchTerm,
    updateSearchTerm,
    selectedFilters,
    facetFilters,
    updateSelectedFilters,
    clearFilters,
    updatePageIndex,
  } = useFacets<SearchResultProps>({ mappers: SearchTransformations });

  return (
    <div>
      {/* Free-text search input */}
      <input
        type="search"
        defaultValue={currentSearchTerm}
        onKeyDown={e =>
          e.key === 'Enter' &&
          updateSearchTerm((e.target as HTMLInputElement).value)
        }
      />

      {/* Filter UI — iterate facetFilters from config */}
      {facetFilters &&
        Object.entries(facetFilters).map(([key, filter]) => (
          <fieldset key={key}>
            <legend>{filter.title}</legend>
            {filter.items.map(item => (
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
        ))}

      <button onClick={() => clearFilters()}>Clear all filters</button>

      {/* Loading state */}
      {isLoading && <p>Loading...</p>}

      {/* Empty state */}
      {!isLoading && noResultsText && <p>{noResultsText}</p>}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <>
          <p>{resultsText}</p>

          <ul>
            {results.map(item => (
              <li key={item.id}>
                <a href={item.uri}>{item.title}</a>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <button
            disabled={currentPageIndex === 0}
            onClick={() => updatePageIndex(currentPageIndex - 1)}
          >
            Previous
          </button>
          <button
            disabled={(currentPageIndex + 1) * pageSize >= totalCount}
            onClick={() => updatePageIndex(currentPageIndex + 1)}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default SearchPage;
```

## Route wiring

```typescript title="src/app/routes/staticRoutes.ts"
import { facets } from '~/schema/search.schema';

{
  path: '/search/:facet?',
  component: SearchPage,
  searchOptions: {
    facet: facets.all,  // always use schema constant — never a string literal
  },
},
```

## Registering the template

```typescript title="src/app/templates/index.ts"
import loadable from '@loadable/component';

export const SearchPage = loadable(
  () => import('~/templates/search/search.template')
);
```

:::caution
**`updateSelectedFilters` argument order**: the filter group key comes **first**, the item value comes **second**. Reversing these causes a runtime crash: `Cannot read properties of undefined (reading 'isSingleSelect')`.

**`selectedFilters` type**: values are `string[]` — use `Array.includes()` to check selection state, not `.some(f => f.key === x)`.
:::
