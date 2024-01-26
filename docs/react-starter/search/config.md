---
title: Config
sidebar_position: 2
---

# Overview

:::caution
This page is under construction. Some sections may be incomplete or missing.
:::

The Search Config (`/search.config.ts`) is an object-like interface for defining search parameters. The `facets`, `listings`, and `minilist` objects provide the configurations for their respective hooks; `useFacets`, `useListing`, and `useMinilist`.

Every search object follows the same pattern and full TypeScript support is available.


## Search Config

| Name     | Type     | Format           | Description                                                                                     |
| -------- | -------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| tabs     | object[] | Tab              | An array of tabs                                                                                |
| facets   | object   | { [key]: Facet } | An object with a key for each facet that is required for the search                             |
| listings | object   | { [key]: Facet } | An object with a key for each independent listing that is required for the site                 |
| minilist | object   | { [key]: Facet } | An object with a key for each independently identifiable minilist that is required for the site 

### Tab

| Name         | Type     | Format       | Description                                                                                                                                                                                                                                                     |
| ------------ | -------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id           | number   |              | The zero-based incrementing id assigned to the tab                                                                                                                                                                                                              |
| label        | string   |              | The tab's label for rendering                                                                                                                                                                                                                                   |
| defaultFacet | string   |              | The initially displayed facet (if not the first specified)                                                                                                                                                                                                      |
| totalCount   | string[] | Facet[key][] | The facets which make up the tab's total results (useful if you do not want a mixed-results facet to interfere with the total, or if you only want to count the mixed-results facet results and not facets which are a filtered set of another facet's results) |

### Facet

| Name        | Type   | Format             | Description                                                                  |
| ----------- | ------ | ------------------ | ---------------------------------------------------------------------------- |
| [key]       | string | key-safe-no-spaces | The facet key used to identify the facet                                     |
| isDefault   | bool   | optional           | The first facet to be shown if no facet is supplied via a route parameter    |
| isDisabled  | bool   | optional           | Set to `true` to temporarily disable the facet                               |
| tabId       | number |                    | Use 0 for default or the id assigned to the tab                              |
| title       |        |                    |                                                                              |
| projectId   | string | optional           | Use this to target the search to a project other than the default configured |
| queryParams | object | QueryParams        | Query params object to drive the search for this facet                       |
| filters     | object | { [key]: Filter }  | An object with a key for each filter that is required in this facet          |

### QueryParams

| Name                 | Type     | Format                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | -------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| contentTypeIds       | string[] |                       | An array of contentTypeIds to search over (sys.dataFormat == 'entry'); Prefix an entry with a "!" to exclude that content type from the search                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| assetTypes           | string[] | optional              | An array of assetTypes to search over (sys.dataFormat == 'asset'); Prefix an entry with a "!" to exclude that content type from the search                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| webpageTemplates     | string[] | optional              | An array of webpageTemplates to search over (sys.dataFormat == 'webpage'); Prefix an entry with a "!" to exclude that webpage template from the search                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| fields               | string[] |                       | An array of fields to return for each entry in the items[]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| linkDepth            | number   | optional              | The linkDepth to apply to the facet search (defaults to 0)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| featuredResults      | object   | FeaturedResults       | An object containing the configuration to drive fetching featured search results separately from the main search results                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| includeInSearch      | string[] | optional              | An array of field ids relating to boolean field types in the destination content types to control whether or not the entry can be shown in search results                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| loadMorePaging       | boolean  | optional              | Include this parameter to change the pagination behaviour of your search. Load more paging will retain previously fetched search results, appending additional pages of results to the existing results array, rather than replacing the results[] when switching pages normally                                                                                                                                                                                                                                                                                                                              |
| orderBy              | string[] |                       | An array of orderBy expressions to add to the search query                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| pageSize             | number   |                       | The number of items returned per page in the search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| useSearchTerm        | boolean  | optional              | Allow a configured minilist to read the search.term set in state (default is false) works with minilists only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| weightedSearchFields | object[] | WeightedSearchField[] | An array of WeightedSearchField to include in the search query. If you do not include this configuration, your search term will be queries against a default set of fields that exist in every content type. It is recommended to specify weightedSearchFields for each contentTypeId specified in your queryParams so you can search for terms that exist within custom entry fields and weight the results returned from each field according to their relevance. The default fields include `entryTitle`, `entryDescription`, `keywords`, `sys.uri` and `searchContent` (available in Contensis v14+ only) |
| customWhere          | object[] | CustomWhereClause[]   | An array of CustomWhereClause to include in the search query                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### FeaturedResults

| Name          | Type              | Format   | Description                                                                                                                                                                                             |
| ------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fieldId       | string / string[] | optional | The field we are looking for to distinguish the featured resuls from regular search results. It is possible to provide an array of fieldIds to wrap multiple field expressions inside an `or` operator. |
| fieldValue    | any               | optional | The value for the field we are looking for to distinguish the featured resuls from regular search results                                                                                               |
| contentTypeId | string / string[] | optional | Instead of using a field to distinguish the featured results from regular search results we can get results that exist inside a special content type containing featured search results in entry data.  |
| count         | number            |          | The number of featured results to return (and exclude from the main search results)                                                                                                                     |

### WeightedSearchField

| Name    | Type              | Format | Description                                                                                                                                                           |
| ------- | ----------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fieldId | string / string[] |        | The field we are applying the weighted search term to. It is possible to provide an array of fieldIds to wrap the weighted search expression inside an `or` operator. |
| weight  | number            |        | The weight value we are supplying to the Delivery API to rank the search results                                                                                      |

### CustomWhereClause

N.B. This shares syntax with adding where operators to a search query when using the Delivery API via HTTP, and should be used sparingly for exceptional cases where the standard query falls short. We can also wrap clauses in `not`, `and`, and `or` expressions.

| Name       | Type   | Format | Description                                            |
| ---------- | ------ | ------ | ------------------------------------------------------ |
| field      | string |        | The field we wish to query                             |
| [operator] | any    |        | The value we want to evaluate with the chosen operator |


### Filter

| Name          | Type              | Format                                 | Description                                                                                                                                                                                                                                                                                                                                                 |
| ------------- | ----------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [key]         | string            | key-safe-no-spaces                     | The filter key used to identify the filter, and in any route parameters or query string                                                                                                                                                                                                                                                                     |
| title         | string            | The title to render next to the filter |                                                                                                                                                                                                                                                                                                                                                             |
| contentTypeId | string            | optional                               | The content type id we will dynamically load entries from and load into state under the items[]                                                                                                                                                                                                                                                             |
| fieldId       | string / string[] | optional                               | The content type field(s) we will apply the filter key to, to filter the list of returned results. You can use 'sys.contentTypeId' to filter your results by a specific content type id defined as a FilterItem[].key. Supply an array of fieldIds to have the search filter your results by any provided values in multiple fields for a given filter key. |
| fieldOperator | string            | optional                               | The Delivery API operator we will use when applying any selected filter                                                                                                                                                                                                                                                                                     |
| items         | object[]          | FilterItem[]                           | Supply an empty array or a hardcoded list of FilterItem depending on the type of filter we require. To filter by a list of content types, supply an array of FilterItem[{ key, title }]                                                                                                                                                                     |
| logicOperator | string            | optional                               | The Delivery API logical operator we will use when applying any selected filter, e.g. 'and', 'or' - default is 'or'.                                                                                                                                                                                                                                        |
| renderable    | bool              | optional                               | Add false to indicate we do not wish to render this filter in our exposed `filter` prop                                                                                                                                                                                                                                                                     |
| customWhere   | object[]          | optional CustomWhereClause             | An array of CustomWhereClause to include in the search query when dynamically loading entries via the contentTypeId key                                                                                                                                                                                                                                     |

### FilterItem

| Name       | Type   | Format   | Description                                              |
| ---------- | ------ | -------- | -------------------------------------------------------- |
| key        | string |          | This will usually be the entry id or the taxonomy key    |
| title      | string |          | The title to render next to the filter item              |
| path       | string | optional | This will usually be the entry slug or the taxonomy path |
| isSelected | bool   | optional | Whether the filter is in a selected state                |
