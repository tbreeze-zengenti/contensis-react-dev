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

## Parameters

## Mappers



### Node Options

Since CRB3 Redux state no longer automatically loads node children from SiteView for performance reasons. To load node children to state you need to configure the nodeOptions parameter on your route along with enabling the required node data in the [withEvents customNavigation](#customnavigation) object.

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

### Inject Redux

With version 3.0 of the Contensis React Base we’re leveraging `@loadable` to load our pages/components. We can also use this approach to dynamically load parts of our Redux Store. The `injectRedux` parameter available to our routes enables us to do this.

By default the React Starter comes with an `injectSearch` function that we can pass to injectRedux to load the Search State on our routes. The `injectRedux` function can be found within `/app/src/redux/dynamic.ts`.

### Link Depth 

The `linkDepth` parameter allows you to override the global `linkDepth` for the App on a *specific* route. This is great if you need to drill down through various linked entries to access a value however it does bring with it a hit to performance. You can mitigate this hit to performance by populating the `field` paramater (see [Managing Large Entries](#managing-large-entries)) for routes with a custom link depth.

If you need to update the link depth on Static Routes see [Fetch Node](#fetch-node)

### Managing Large Entries

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

### Fetch Node

The `fetchNode` parameter is only available on a Static Route. By enabling this paramater your static route will query entry data from the node it finds in the Site View tree under the specific path. Therefore, a static route with a `path` defined as `/blog/specific-blog-page` will only fetch data from a Site View node on your CMS with the *same* path.

Fetch Node can be set via a `boolean` however the full object gives you access to: `entryMapper`, `linkDepth`, `fields`, & `params`.

## With Events

WithEvents is a part of our Routing setup & it enables us to trigger events under our routes.

### OnRouteLoad

The OnRouteLoad event is the first event our app encounters when routing. We trigger this event **before** fetch entry data. On any OnRouteLoad event we can access the following parameters: `location`, `path`, `staticRoute`, & `statePath`.

This event exposes the `routeLoadOptions` object which allows us to control elements of our app setup. 

### OnRouteLoaded
The OnRouteLoaded event is the second event our app encounters when routing. We trigger this event **after** fetching entry data. On any OnRouteLoad event we can access the following parameters: `location`, `path`, `staticRoute`, & `entry`.

#### CustomNavigation

The CustomNavigation object enables us to populate the App's Redux store with data for `ancestors`, `children`, `siblings` & `tree` data from Site View. This can be enabled with a boolean or by specificing a `number` depth. Enabling these options are essential for getting [Node Options](#node-options) parameters to work on routes.


### DefaultLang

Enables us to set a default language for the app. By default it's set to `en-GB`.

### EntryLinkDepth

This option allows us to set a global link depth for **all** requests made by the App. 

:::warning
The default `entryLinkDepth` should only be updated if you understand the consequences as it can lead to unnecessarily large paylods of data.
:::

### PreventScrollTop

This `boolean` toggle allows you to enable or disable the global scroll top action that React Router triggers when routing. For finer control you can access the `location` or `path` object to create rules.

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