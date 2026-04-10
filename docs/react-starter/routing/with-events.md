
# With Events

WithEvents is a part of our Routing setup & it enables us to trigger events under our routes.

## OnRouteLoad

The OnRouteLoad event is the first event our app encounters when routing. We trigger this event **before** fetching entry data. On any `onRouteLoad` event we can access the following parameters: `location`, `path`, `staticRoute`, `statePath`, & `ssr`.

This event exposes the `routeLoadOptions` object which allows us to control elements of our app setup.

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

## OnRouteLoaded
The OnRouteLoaded event is the second event our app encounters when routing. We trigger this event **after** fetching entry data. On any `onRouteLoaded` event we can access the following parameters: `location`, `path`, `staticRoute`, `entry`, & `ssr`.

Like `onRouteLoad`, the `ssr` parameter should be passed through to any backing sagas that make Delivery API calls.

## CustomNavigation

The `customNavigation` object enables us to populate the App's Redux store with data for `ancestors`, `children`, `siblings` & `tree` data from Site View. Each key accepts a `boolean` (or a `number` depth for tree). Enabling these options are essential for getting [Node Options](#node-options) parameters to work on routes.

```typescript
customNavigation: {
  ancestors: false,  // boolean
  children: false,   // boolean
  siblings: false,   // boolean
  tree: true,        // boolean or number depth
}
```


## DefaultLang

Enables us to set a default language for the app. By default it's set to `en-GB`.

## EntryLinkDepth

This option allows us to set a global link depth for **all** requests made by the App. 

:::warning
The default `entryLinkDepth` should only be updated if you understand the consequences as it can lead to unnecessarily large payloads.
:::

## PreventScrollTop

This `boolean` toggle allows you to enable or disable the global scroll top action that React Router triggers when routing. For finer control you can access the `location` or `path` object to create rules.

## Loading Search

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