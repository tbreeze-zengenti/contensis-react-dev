---
sidebar_position: 3 
---

# Mappers

There are various different mappers available for Search: `results`, `resultsInfo`, `navigate`, `filterItems`, `customApi`. Each mapper has a default behaviour, provided by CRB, but in the Starter Project we export our own `results` and `resultsInfo` mapper from the `entry-to-cardprops.mapper.ts` and `state-to-resultsionformationprops.mapper.ts` files respectively. In most circumstances you will only ever have to update these mappers, however, the `navigate` and `filterItems` mappers can be useful in some siutations.

:::caution
This page is under construction. Some sections may be incomplete or missing.
:::

## Results

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

## ResultsInfo

The `resultsInfo` mapper allows us to manipulate the return value of `resultsInfo` on any search hook by amending the `searchSummaryTemplate` object. When rendering our search results we can then access parts of the `searchSummaryTemplate` via the `resultsInfo` prop on any given search-hook. 

## Navigate

## FilterItems
