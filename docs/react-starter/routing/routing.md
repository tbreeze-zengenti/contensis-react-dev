---
sidebar_position: 1
title: Routing overview
---

# Overview

An overview of the routing setup in React Starter.

## Content type routes

Routes loaded via Content Type Routes are based on the Content Types in the current project. At its most basic the `contentTypeID` will pair a component (normally a page component) with the corresponding Content Type value from the CMS.

An example Content Type Mapping file can be found below — this example was copied from the React Starter repository. 

```typescript title="src/app/routes/ContentTypeRoutes.ts"
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

## Static routes

Static Routes are a “what you see is what you get” form of routing. They enable you to define a `path` under which a specific `component` will load.

An example Static Route file can be found below — this example was copied from the React Starter repository.

```typescript title="src/app/routes/staticRoutes.ts"
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

### Fetching entry data on a static route

The `fetchNode` argument is unique to Static Routes. By enabling this argument your static route will query entry data from the node it finds in the Site View tree under the location defined in `path`.

Fetch Node is a dynamic argument, it can be defined as a `boolean` or an `object`. The object gives you access to: `entryMapper`, `linkDepth`, `fields`, & `params`.

## Entry link depth

The `linkDepth` parameter allows you to override the global `linkDepth` for the App on a *specific* route. This is great if you need to drill down through various linked entries to access a value however it does bring with it a hit to performance, as the API resolves *every* linked field to that depth.

Note that the `fields` argument does **not** mitigate this performance hit — it only trims the returned JSON (see [Optimizing large entries](/docs/react-starter/advanced/tips/optimising-large-entries)). To reduce the actual query cost of a deep route, resolve links selectively with `fieldLinkDepths` rather than raising the global `linkDepth`.

### Field-specific link depth

The `fieldLinkDepths` parameter resolves links only on the named fields your mapper actually needs, keyed as `{ fieldName: depth }`, so unrelated linked fields are left as `{ sys }` stubs instead of being resolved. It is supported on both `ContentTypeMapping` routes and the `fetchNode` object.

Prefer `fieldLinkDepths` over raising the global `linkDepth`. It avoids over-fetching, and it **must** be used in place of `linkDepth` once your baseline depth is already `2` or higher — raising the global depth resolves all linked fields and is exponentially expensive.

```typescript title="Resolving links selectively on a Content Type Mapping route"
const contentTypeMappings: ContentTypeMapping[] = [
  {
    contentTypeID: 'article',
    component: Article,
    entryMapper: entryMapper(articleMapper),
    fields: [...ArticleFields],
    linkDepth: 0,
    fieldLinkDepths: {
      author: 1, // resolve the linked author entry
      category: 1, // resolve the linked category entry
    },
  },
];
```

:::caution
`fieldLinkDepths` requires Contensis 16+. The maximum depth is `10`, but keep it to a recommended maximum of `4` — and only raise the depth on fields you genuinely need to traverse.
:::

For the equivalent guidance in a Contensis search, see [`fieldLinkDepths` vs `linkDepth`](/docs/react-starter/search/config#fieldlinkdepths-vs-linkdepth).


## Inject Redux

From version 3.0 of Contensis React Base, `@loadable` is used to load pages and components. You can also use this approach to dynamically load parts of the Redux store. The `injectRedux` parameter available to your routes enables this.

By default the React Starter comes with an `injectSearch` function that you can pass to the `injectRedux` argument to load the search state on your routes.

The `injectRedux` function can be found within `/app/src/redux/dynamic.ts`.


