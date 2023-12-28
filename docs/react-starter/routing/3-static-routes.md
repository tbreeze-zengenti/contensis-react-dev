---
sidebar_position: 3
---

# Static Routes

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

## Options

### Fetch Node

The `fetchNode` parameter is only available on a Static Route. By enabling this paramater your static route will query entry data from the node it finds in the Site View tree under the specific path. Therefore, a static route with a `path` defined as `/blog/specific-blog-page` will only fetch data from a Site View node on your CMS with the *same* path.

Fetch Node can be set via a `boolean` however the full object gives you access to: `entryMapper`, `linkDepth`, `fields`, & `params`.


### Node Options

To load child or sibling nodes to state you need to configure the `nodeOptions`` parameter on your route along with enabling the required node data in the [withEvents customNavigation](#customnavigation) object.

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

