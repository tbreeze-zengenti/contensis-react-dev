---
sidebar_position: 2
title: Routing with events
---

# With Events

WithEvents is part of the routing setup and enables you to trigger events under your routes.

## onRouteLoad

The `onRouteLoad` event is the first event the app encounters when routing. It fires **before** fetching entry data. On any `onRouteLoad` event you can access the following parameters: `location`, `path`, `staticRoute`, `statePath`, and `ssr`.

This event exposes the `routeLoadOptions` object which allows you to control elements of your app setup.

The `ssr` parameter is an `SSRContext` object — the same object returned by the `useSSRContext` hook in your component tree. Pass it to any sagas or custom logic called within `onRouteLoad` to ensure SSR cache invalidation works correctly.

```typescript
onRouteLoad: function* onRouteLoad({ ssr }) {
  const routeLoadOptions: RouteLoadOptions = {
    customNavigation: {
      ancestors: false,
      children: false,
      siblings: false,
      tree: true,
    },
  };
  yield all([call(getSiteConfigSaga, ssr)]);
  return yield routeLoadOptions;
},
```

## onRouteLoaded
The `onRouteLoaded` event is the second event the app encounters when routing. It fires **after** fetching entry data. On any `onRouteLoaded` event you can access the following parameters: `location`, `path`, `staticRoute`, `entry`, and `ssr`.

Like `onRouteLoad`, the `ssr` parameter should be passed through to any backing sagas that make Delivery API calls.

## customNavigation

The `customNavigation` object populates the Redux store with `ancestors`, `children`, `siblings`, and `tree` data from Site View. Each key accepts a `boolean` (or a `number` depth for tree). These options are required for [Node Options](#node-options) parameters to work on routes.

```typescript
customNavigation: {
  ancestors: false,  // boolean
  children: false,   // boolean
  siblings: false,   // boolean
  tree: true,        // boolean or number depth
}
```


## defaultLang

Sets a default language for the app. Defaults to `en-GB`.

## entryLinkDepth

Sets a global link depth for **all** requests made by the app. 

:::caution
The default `entryLinkDepth` should only be updated if you understand the consequences as it can lead to unnecessarily large payloads.
:::

## preventScrollTop

A `boolean` toggle that enables or disables the global scroll-to-top action React Router triggers on navigation. For finer control, access the `location` or `path` object to create conditional rules.

## Loading search

By default, WithEvents loads search listings under specific routes. The `listingType` or `contentTypeId` specified in a route is compared in the following conditional to determine whether a listing should be loaded:

```typescript title="The section of the withEvents file that loads Search Listings"

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