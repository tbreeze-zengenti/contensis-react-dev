---
sidebar_position: 1
---

# Overview

An overview of the routing setup in React Starter.

:::caution
This page is under construction. Some sections may be incomplete or missing.
:::

## Content Type Mapping

Routes loaded via Content Type Mappings are based on the Content Types in the current project. At it’s most basic the `contentTypeID` will pair a component (normally a page component) with the corresponding Content Type value from the CMS. 

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

Static Routes are a “what you is see what you get” form of routing. They enable you to define a `path` under which a specific `component` will load. 

An example Static Route file can be found below - this example was copied from the React Starter repository.

```jsx title="src/app/routes/staticRoutes.ts"
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

### Fetching Entry Data on a Static Route

The `fetchNode` argument is unique to Static Routes. By enabling this argument your static route will query entry data from the node it finds in the Site View tree under the location defined in `path`.

Fetch Node is a dynamic argument, it can be defined as a `boolean` or an `object`. The object gives you access to: `entryMapper`, `linkDepth`, `fields`, & `params`.

## Entry Link Depth

The `linkDepth` parameter allows you to override the global `linkDepth` for the App on a *specific* route. This is great if you need to drill down through various linked entries to access a value however it does bring with it a hit to performance.

You can mitigate this hit to performance by populating the `field` argument (see [Optimising Large Entries](/react-starter/advanced/tips/optimising-large-entries)) for routes with a custom link depth.


## Inject Redux

With version 3.0 of the Contensis React Base we’re leveraging `@loadable` to load our pages/components. We can also use this approach to dynamically load parts of our Redux Store. The `injectRedux` parameter available to our routes enables us to do this.

By default the React Starter comes with an `injectSearch` function that we can pass to the `injectRedux` argument to load the Search State on our routes. 

The `injectRedux` function can be found within `/app/src/redux/dynamic.ts`.


