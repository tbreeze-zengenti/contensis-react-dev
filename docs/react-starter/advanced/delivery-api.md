---
sidebar_position: 2
---

# Delivery API

When writing code that calls the Contensis Delivery API, use the exports available from `@zengenti/contensis-react-base/util`. These come pre-connected to the current project, support SSR cache invalidation, and provide full TypeScript intellisense.

## `useDeliveryApi` hook (recommended)

The primary recommended approach is the `useDeliveryApi` hook. It returns a delivery API instance that is scoped to the current component tree and the current SSR request, making it safe under high concurrency.

```typescript
import { useDeliveryApi } from '@zengenti/contensis-react-base/util';
```

### Using with Redux / sagas

Because the hook must be called inside a React component, pass the returned `deliveryApi` reference through your Redux action payload so it is available inside sagas:

```tsx
import { useDeliveryApi } from '@zengenti/contensis-react-base/util';

const SomeReduxComponent = () => {
  const deliveryApi = useDeliveryApi();
  const dispatch = useDispatch();
  const myData = useSelector(state => state.myData);

  useEffect(() => {
    if (!myData) {
      dispatch({ type: 'FETCH_DATA', deliveryApi });
    }
  }, []);

  return <MyComponentToRender data={myData} />;
};
```

Then consume it in the saga:

```typescript
import { takeEvery, put } from 'redux-saga/effects';
import type { SSRContext } from '@zengenti/contensis-react-base';

export const sagas = [takeEvery('FETCH_DATA', fetchData)];

export function* fetchData(action: { deliveryApi: SSRContext['api'] }) {
  const { deliveryApi } = action;
  const query = getDataQuery();
  const payload = yield deliveryApi.search(query, 1);

  yield put({
    type: 'FETCHED_DATA',
    myData: payload?.items || [],
  });
}
```

### Raw client access via `getClient()`

If you need access to parts of the Delivery API not exposed by the helper methods, call `getClient()` on the `deliveryApi` instance:

```tsx
import { useDeliveryApi } from '@zengenti/contensis-react-base/util';

const SomeComponent = () => {
  const deliveryApi = useDeliveryApi();
  const client = deliveryApi.getClient();
  // Use the full contensis-delivery-api client
  return null;
};
```

## Routing hooks (`onRouteLoad` / `onRouteLoaded`)

Both routing hooks in `withEvents` receive an `ssr` argument. This is the same `SSRContext` returned by `useSSRContext` in your component tree. The `ssr` object exposes an `api` field with the same browser-cached, environment-aware delivery methods.

Pass `ssr` to any sagas or custom logic called within these hooks to ensure SSR cache invalidation is applied:

```typescript
onRouteLoad: function* onRouteLoad({ ssr }) {
  yield all([call(getSiteConfigSaga, ssr)]);
  return yield routeLoadOptions;
},
```

See the [WithEvents](../routing/with-events) documentation for full details.

## Static imports (avoid in SSR)

Two alternative static imports exist but are **not recommended** for SSR applications:

```typescript
// Direct delivery API — avoid in SSR
import { deliveryApi } from '@zengenti/contensis-react-base/util';

// Cached search (client-side caching until next page reload) — avoid in SSR
import { cachedSearch } from '@zengenti/contensis-react-base/util';
```

:::warning
Under high concurrency, static imports can cause incorrect SSR cache invalidation headers to be generated for concurrent requests. Always use the `useDeliveryApi` hook or pass `ssr` through routing hooks instead.
:::

## Why use the base package methods?

| Benefit | Detail |
|---------|--------|
| **Zero config** | Pre-connected to the `ALIAS` and `PROJECT` from your `.env` file. No client instantiation needed. |
| **SSR cache invalidation** | Response handlers ensure server-rendered pages are invalidated when their content changes in the CMS. Without this, stale content could persist for up to 1 hour. |
| **Future-proofing** | New features and bug fixes land in `contensis-react-base` — your app code stays unchanged. |
| **Secure Delivery API** | Upcoming support for fetching sensitive content from the Delivery API depends on these wrapped methods. |
