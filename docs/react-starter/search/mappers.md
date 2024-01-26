---
title: Mappers
sidebar_position: 3
---

# Mappers

You can supply an object called `mappers` to the search saga and React components or hooks. This object must contain the following keys, with a function beneath each key.

| Name        | Type     | Arguments                                    | Description                                                                                                                                                                                                                                                                     |
| ----------- | -------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| filterItems | function | (items[])                                    | When loading filter items dynamically, the search state expects a filter item to be presented in the format of { title, key, path, isSelected }. This function can be used to iterate over the returned items and map them to the expected format                               |
| navigate    | function | ({ state, facet, orderBy, pageIndex, term }) | When applying a search action we will usually navigate to a new route that reflects the user's choices from actions performed, this can be used to apply specific routing logic and must return an object of { path, search, hash } which will form the next url                |
| results     | function | (items, facet, context)                      | A function to take a list of items from our raw API response and return a list of results that represent component props ready to render out in a results list (see `mapEntriesToResults` example below for an example)                                                         |
| resultsInfo | function | (state)                                      | Produce a keyed object containing any props that you require to summarise your search results. Each key can be produced by using exposed redux selectors, or your own Immutable selectors, or a composite containing logic and results from different areas of the search state |

This can be easily summarised in an `index.ts` file inside your feature's `transformations` folder

```
import mapEntriesToResults from './entry-to-cardprops.mapper';
import mapEntriesToFilterItems from './entry-to-filteritem.mapper';
import mapStateToResultsInformation from './state-to-resultsinformationprops.mapper';
import mapStateToSearchUri from './state-to-searchuri';

export default {
  filterItems: mapEntriesToFilterItems,
  navigate: mapStateToSearchUri,
  results: mapEntriesToResults,
  resultsInfo: mapStateToResultsInformation,
};
```

To avoid all of the customisation potential, as a bare minimum `mappers` must be supplied as a single function that accepts an array of `entry[]` that returns a list of mapped results.


## mapEntriesToResults

A mapper function which will take the raw entry items array returned from the API response and will map each entry, based on their ContentTypeID, to a discrete result object - which should represent component props - so the data inside each entry is normalised and ready for use without further remapping or destructuring inside our components.

Essentially each entry gets mapped to a result card and is available in the facet state as `Result[]`.

```ts title="An example mapper applied to a Content Type ID of 'news'"
const newsMapper = {
    title: 'entryTitle',
    image: 'entryThumbnail',
}

export const mappers = {
    news: newsMapper,
};
```

### mapStateToResultsInformation

This is just an example of how this mapper could be used. Its intended use is to keep summary and pagination logic away from your View layer.

```
import { selectors } from '@zengenti/contensis-react-base/search';
import { fromJS } from 'immutable';

import { default as mapJson } from '~/core/util/json-mapper';

const {
  getCurrent,
  getListing,
  getResults,
  getSearchTerm,
  getTotalCount,
} = selectors.selectListing;

const listingTitle = state => getListing(state).get('title');
const searchTerm = state => getSearchTerm(state);
const totalCount = state => getTotalCount(state);

const searchSummaryTemplate = {
  currentListing: state => getCurrent(state),
  currentPageCount: state => getResults(state).size,
  listingTitle,
  noResultsText: state =>
    totalCount(state) === 0 ? `No results were found` : '',
  searchTerm,
  totalCount,
};

const mapStateToResultsInformation = state =>
  fromJS(mapJson(state, searchSummaryTemplate)).toJS();

export default mapStateToResultsInformation;
```