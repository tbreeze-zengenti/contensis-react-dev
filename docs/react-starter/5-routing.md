---
sidebar_position: 5
---

# Routing

## Content Type Routes

Routes loaded via Content Type Mappings are based on the Content Types in the current project. At it’s most basic the contentTypeID will pair a component (normally a page component) with the corresponding Content Type value from the CMS. 

An example Content Type Mapping file can be found below - this example was copied from the React Starter repository. 

```jsx title="src/app/routes/ContentTypeMappings.ts"
import { ContentTypeMapping } from '@zengenti/contensis-react-base';

import { ContentTypes } from '../schema';
import { entryMapper } from '../util/json-mapper';

import { Home } from '~/dynamic/pages';
import homeMapper from '~/pages/Home/home.mapper';

const contentTypeMappings: ContentTypeMapping[] = [
  {
    contentTypeID: [ContentTypes.home],
    component: Home,
    entryMapper: entryMapper(homeMapper),
  },
];

export default contentTypeMappings;
```

## Static Routes

Static Routes are a sort of “what you see what you get” form of routing. They enable you to define a `path` under which a specific `component` will load. 

An example Static Route file can be found below - this example was copied from the React Starter repository.

```jsx title="src/app/routes/StaticRoutes/ts"
import { StaticRoute } from '@zengenti/contensis-react-base';
import { CorePages, Home, Search } from '~/dynamic/pages';
import { injectSearch } from '../redux/dynamic';

const staticRoutes: StaticRoute[] = [
  {
    path: '/',
    exact: true,
    fetchNode: true,
    component: Home,
  },
  {
    path: '/search/:facet?',
    component: Search,
    // Dynamically load search package and search config into redux
    injectRedux: injectSearch,
  },
  // ********************************
  // ˅˅ Do not delete these routes ˅˅
  {
    path: '/404',
    component: CorePages[404],
  },
  {
    path: '/zenInfo',
    ssrOnly: true,
    component: CorePages.ZenInfo,
  },
  // ˄˄ Do not delete these routes ˄˄
  // ********************************
];

export default staticRoutes;
```

## Node Options

Since CRB3 Redux state no longer automatically loads node children from SiteView for performance reasons. To load node children to state you need to configure the nodeOptions parameter on your route.

Here’s an example of the options available:

```jsx
{
    contentTypeID: 'contentTypeId',
    component: Page,
    entryMapper: entryMapper(mapper),
    nodeOptions: {
      children: {
        depth: 1,
        linkDepth: 0,
        fields: ['summary', 'title', 'sys.uri'],
      },
      siblings: {
        linkDepth: 0,
        fields: ['summary', 'title', 'sys.uri'],
      },
    },
  },
```

## Inject Redux

With version 3.0 of the Contensis React Base we’re leveraging `@loadable` to load our pages/components. We can also use this approach to dynamically load parts of our Redux Store. The `injectRedux` parameter available to our routes enables us to do this.

By default the React Starter comes with an `injectSearch` function that we can pass to injectRedux to load the Search State on our routes. The `injectRedux` function can be found within `/app/src/redux/dynamic.ts`.


## Managing Large Entries

When accessing large entries, particularly those with a `linkDepth` greater than `1`, we can end up returning fields we do **not** need. These un-required fields add extra weight to the page. To combat this we can utilise the `fields` option. 

The `fields` option allows us to pass an array of strings, `string[]`, to build our query for this specific route. So instead of returning the entire `entry` object the query will only return the `fields` specific from that entry.

The `schema.ts` file in React Starter is a good place for storing your fields. These can then be passed to the `fields` option using the spread operator; `fields: [...BaseFields]`.

```jsx title="An example of how the fields option can be defined on a Content Type Mapping route"
import { ContentTypeMapping } from '@zengenti/contensis-react-base';

import { entryMapper } from '../util/json-mapper';

import { Article } from '~/dynamic/pages';
import articleMapper from '~/pages/Home/home.mapper';

const ArticleFields = [
	'entryTitle',
	'entryDescription',
	'image.sys.uri',
	'sys.publishedDate',
];

const contentTypeMappings: ContentTypeMapping[] = [
  {
    contentTypeID: 'article',
    component: Article,
    entryMapper: entryMapper(articleMapper),
    fields: [...ArticleFields],
  },
];

export default contentTypeMappings;
```

## With Events

WithEvents is a part of our Routing setup & it enables us to trigger events under our routes.

### Listings

By default we use WithEvents to load Search Listings under specific Routes. The listingType or contentTypeId specified in a route is compared in the following conditional statement to determine whether a Listing should be loaded:

```jsx title="The section of the withEvents file that loads Search Listings"

    const contentTypeId = entry?.sys?.contentTypeId;
    const listingType =
      staticRoute?.route?.listingType || ListingPages[contentTypeId];

    if (path.startsWith('/search') || listingType) {
      const { setRouteFilters, mappers } =
        (yield injectSearchAssets()) as InjectSearchAssets;

      yield call(setRouteFilters, {
        listingType,
        mappers,
        params,
      });
    }
```