---
title: Overview
sidebar_position: 1
---

# Overview

:::caution
This page is under construction. Some sections may be incomplete or missing.
:::

Contensis React Base provides a wrapper for working with Contensis's Elastic search implementation. The Starter Project offers a boilerplate approach to configuring this implementation, whilst CRB also provides a variety of Hooks for rendering and interacting with the results.

## Config

The Search Config (`/search.config.ts`) is an object-like interface for defining search parameters. The `facets`, `listings`, and `minilist` objects provide the configurations for the `useFacets`, `useListing`, and `useMinilist` hooks to query.

Every search object follows the same pattern and there is full TypeScript support available.

## Inject Redux

With version 3.0 of the Contensis React Base we’re leveraging `@loadable` to load our pages/components. We can also use this approach to dynamically load parts of our Redux Store. The `injectRedux` parameter available to our routes enables us to do this.

By default the React Starter comes with an `injectSearch` function that we can pass to the `injectRedux` argument to load the Search State on our routes. 

The `injectRedux` function can be found within `/app/src/redux/dynamic.ts`.


## Mappers

There are various different mappers available for Search: `results`, `resultsInfo`, `navigate`, `filterItems`, `customApi`. Each mapper has a default behaviour, provided by CRB, but in the Starter Project we export our own `results` and `resultsInfo` mapper from the `entry-to-cardprops.mapper.ts` and `state-to-resultsionformationprops.mapper.ts` files respectively. In most circumstances you will only ever have to update these mappers, however, the `navigate` and `filterItems` mappers can be useful in some siutations.

### Results

The `results` mapper provides a method for mapping search result data to component props using the JSON Path Mapper syntax.

Every mapping object created in this mapper can be assigned to a `contentTypeId` in the exported `mappers` object by using the `contentTypeId` as a key and the map object as the value. Every search result that returns that `contentTypeId` will then use that mapping configuration.

```ts title="An example mapper applied to a Content Type ID of 'news'"
const newsMapper = {
    title: 'entryTitle',
    image: 'entryThumbnail',
}

export const mappers = {
    news: newsMapper,
};
```

### ResultsInfo

The `resultsInfo` mapper allows us to manipulate the return value of `resultsInfo` on any search hook by amending the `searchSummaryTemplate` object. When rendering our search results we can then access parts of the `searchSummaryTemplate` via the `resultsInfo` prop on any given search-hook. 

### Navigate

### FilterItems

## Hooks

Several hooks are available from Contensis React Base to help working with search.
