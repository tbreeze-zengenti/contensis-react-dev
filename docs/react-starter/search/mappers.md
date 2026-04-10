---
title: Mappers
sidebar_position: 3
---

# Mappers

Search mappers transform raw Contensis data into the shape your components and hooks need. There are three mapper slots, all registered in a single `search.transformations.ts` file.

## The `SearchTransformations` object

```typescript title="src/app/search/search.transformations.ts"
import type { SearchTransformations } from '@zengenti/contensis-react-base/models/search';
import searchResultsMapper from '~/search/searchResults.mapper';
import searchResultsInformationMapper from '~/search/searchResultsInformation.mapper';

export default {
  results: searchResultsMapper,               // Entry[] → T[]
  resultsInfo: searchResultsInformationMapper, // AppState → { resultsText, noResultsText, ...custom }
} as SearchTransformations;
```

A third slot — `filterItems` — is only needed when using dynamic filters that load items from the CMS (see [Dynamic filter items](#dynamic-filter-items) below).

:::caution
There is exactly **one** `search.transformations.ts` file. Do not create `blogSearch.transformations.ts`, `plantSearch.transformations.ts`, etc. All result mappers are registered in `searchResults.mapper.ts` via a switch on `entry.sys.contentTypeId`.
:::

## `searchResults.mapper.ts`

This mapper receives raw CMS entries and returns typed component props. It uses a `switch` on `entry.sys.contentTypeId` to apply the right mapping per content type.

### When `baseMapper` is enough

The Contensis Delivery API automatically resolves `entryTitle`, `entryDescription`, and `entryThumbnail` based on each content type's `entryTitleField`, `entryDescriptionField`, and `entryThumbnailField` settings in the CMS. This means `baseMapper` returns the correct title, description, and thumbnail for every content type — regardless of whether the underlying CMS field is named `productName` or `heading`.

**Only write a custom mapper if you need to expose additional fields** (e.g. a rating, a price, a kicker) beyond `{ id, title, uri, description, thumbnail }`.

### Adding a content-type-specific mapper

```typescript title="src/app/search/searchResults.mapper.ts"
import type { ContentTypeBlogPost } from '~/types/contentTypes/blogPost.type';
import type { Image } from 'contensis-delivery-api';

// 1. Result props type for this content type
export type BlogSearchResultProps = ResultProps<{
  title: string;
  uri?: string;
  kicker?: string;
  thumbnailImage?: Image;
  categoryTitle?: string;
}>;

// 2. Mapper function
const blogMapper = (entry: ContentTypeBlogPost): BlogSearchResultProps => ({
  id: entry.sys.id,
  uri: entry.sys.uri ?? undefined,
  title: entry.title,
  kicker: entry.kicker,
  thumbnailImage: entry.thumbnailImage,
  categoryTitle: entry.category?.entryTitle,
});

// 3. Switch — list every content type in contentTypeIds explicitly
switch (entry.sys.contentTypeId) {
  case contentTypes.blogPost:
    return blogMapper(entry as ContentTypeBlogPost);
  default:
    return baseMapper(entry); // intentional fallback
}

// 4. Update the SearchResultProps union
export type SearchResultProps = BaseSearchResultProps | BlogSearchResultProps;
```

Add any extra fields to the corresponding config:

```typescript title="src/app/search/search.config.ts"
fields: [...baseFields, 'title', 'kicker', 'thumbnailImage', 'category'],
fieldLinkDepths: { category: 1 },
```

### Mapper receives facet context

The mapper signature includes optional `facet` and `context` parameters for context-aware mapping:

```typescript
const searchResultsMapper: SearchResultsMapper<SearchResultProps> = (
  entries,
  facet,   // e.g. 'plants', 'news' — current facet key
  context, // 'facets' | 'listings' | 'minilist'
) => {
  return entries.map(entry => {
    if (context === 'minilist') return compactMapper(entry);
    return baseMapper(entry);
  });
};
```

## `searchResultsInformation.mapper.ts`

This mapper receives the full Redux state and returns summary text and any extra keys you want available via `resultsInfo` in the hooks:

```typescript title="src/app/search/searchResultsInformation.mapper.ts"
import { selectors } from '@zengenti/contensis-react-base/search';

const { getPaging, getTotalCount, getIsLoaded } = selectors.selectFacets;

export default (state: AppState) => {
  const totalCount = getTotalCount(state) ?? 0;
  const paging = getPaging(state);
  const isLoaded = getIsLoaded(state) ?? false;
  const start = (paging?.pageIndex ?? 0) * (paging?.pageSize ?? 10) + 1;
  const end = Math.min(start + (paging?.pageSize ?? 10) - 1, totalCount);

  return {
    resultsText: totalCount > 0 ? `Showing ${start}–${end} of ${totalCount} results` : '',
    noResultsText: isLoaded && totalCount === 0 ? 'No results found.' : '',
    // Extra keys are accessible as resultsInfo.totalCount etc. in the hook
    totalCount,
    isLoaded,
  };
};
```

## Dynamic filter items

When a `SearchFilter` uses `contentTypeId` to load filter items from the CMS at runtime, add a `filterItems` mapper to `search.transformations.ts`:

```typescript title="src/app/search/searchFilterItems.mapper.ts"
import type { FilterItemsMapper } from '@zengenti/contensis-react-base/search';

const filterItemsMapper: FilterItemsMapper = (entries) =>
  entries.map(entry => ({
    key: entry.sys.id,    // used in the API query
    title: entry.entryTitle, // shown in the filter UI
  }));

export default filterItemsMapper;
```

Register it in `search.transformations.ts`:

```typescript title="src/app/search/search.transformations.ts"
import filterItemsMapper from '~/search/searchFilterItems.mapper';

export default {
  results: searchResultsMapper,
  resultsInfo: searchResultsInformationMapper,
  filterItems: filterItemsMapper, // only needed for dynamic CMS-loaded filter items
} as SearchTransformations;
```

You only need this when a filter config uses `contentTypeId: someType` and `items: []` — without it, dynamic filter items will not be mapped to the expected `{ key, title }` shape.
