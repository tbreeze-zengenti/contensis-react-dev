---
sidebar_position: 1
title: Cache keys
---

# Cache Keys

When writing backing code that makes calls to the Delivery API, it is **strongly recommended** to use the exports available in the `contensis-react-base/util` package. They come pre-connected to the current Contensis project and use a delivery client that is hooked up with handlers that allow cache invalidation to work for pages rendered in SSR. They have been updated to provide full TypeScript intellisense which is invaluable for both TypeScript and JavaScript developers.

### Strongly recommended approach

The methods available in these imports allow you to make the API calls needed to surface regular content. They provide a wrapped instance of the `contensis-delivery-api` [npm package](https://www.npmjs.com/package/contensis-delivery-api) JavaScript client that works with your app.

For the most reliable SSR experience, a new hook is available that can be called within any React component and ensures everything is sourced from the same component tree (and scoped to the current request in SSR).
```typescript
import { useDeliveryApi } from '@zengenti/contensis-react-base/util';
```

To use this in redux-saga backing code, pass the delivery API reference obtained from the hook call in the action payload when dispatching from within the component.

```tsx
const SomeReduxComponent = () => {
  const deliveryApi = useDeliveryApi();
  const dispatch = useDispatch();
  const myData = useSelector(state => state.myData);

  useEffect(() => {
    if (!myData) {
      dispatch({
        type: 'FETCH_DATA',
        deliveryApi
      });
    }
  }, []);


  return (<MyComponentToRender data={myData} />);
}
```
In the redux-saga code, access the API from the action payload:

```typescript
export const sagas = [
  takeEvery('FETCH_DATA', fetchData),
];

export function* fetchData(action: { deliveryApi: SSRContext['api'] }) {
  const { deliveryApi } = action;
  const query = getDataQuery();
  const payload = yield deliveryApi.search(query, 1);
  
  yield put({
    type: 'FETCHED_DATA',
    myData: payload?.items || [];
  });
}

```

A simpler but less reliable alternative is to import the same API utility directly:

This approach is no longer recommended. The objects returned by the `useDeliveryApi` and `useSSRContext` hooks are context-based and reference the component tree being rendered. Under high concurrent load, cache invalidation headers in SSR are not generated correctly for every concurrent request when using the static imports of the API helpers.

``` typescript
import { deliveryApi } from '@zengenti/contensis-react-base/util';
```

The next example provides a similar Delivery API implementation except calls made client-side are cached locally until the next page reload preventing needless duplicate api calls.

This approach is no longer recommended, for the same SSR reason described above.
``` typescript
import { cachedSearch } from '@zengenti/contensis-react-base/util';
```

Alternatively, calling `getClient()` will return a 'connected' instance of the normal [delivery api client](https://github.com/contensis/contensis-delivery-api#examples) so you could access any part of the Delivery API that might not be available in the existing methods like this

```tsx
import { useDeliveryApi } from '@zengenti/contensis-react-base/util';

const SomeComponent = () => {
  const deliveryApi = useDeliveryApi();
  const client = deliveryApi.getClient();

  return null;
}
```
You can see an example implementation here: https://gitlab.zengenti.com/starter-projects/react-starter/-/blob/master/src/app/redux/siteConfig/sagas.ts

Use any of these approaches that work best for your implementation.

### Why it's recommended

#### Zero config

The imported method will already be connected to the default `ALIAS` and `PROJECT` provided in the `.env` file with the necessary credentials to make everything work. You don't need to do anything to instantiate and authenticate your Delivery client, these methods should just work with your app.

#### Cache invalidation

These methods contain special response handlers that, in pages that use server-side rendering in production, will ensure these pages are rendered with the necessary headers and keys that will allow the cached server-rendered content to become invalidated when any of the content requested by that page changes.

Any other method used to fetch and render data from the Delivery API will not contain the response handlers to handle server-side cache invalidation and as such cannot guarantee pages that were server-rendered will not become instantly invalidated when that requested content has changed in the CMS. Instead these pages could take up to 1 hour in production to reflect changes made to the content fetched directly from the API using other methods.

Pages that contain content that is rendered purely client-side is unaffected by this issue but using these methods ensure the cache invalidation will perform optimally should any of this content become server-rendered in the future.

#### Existing pattern

These exported methods have existed since React was adopted for building web apps with Contensis. They have been used across many implementations and have been developed and enhanced many times, designed to work best with Contensis Cloud deployments.

Refactor existing similar implementations to use these imported methods from `contensis-react-base/util` to get the best experience with deployments to Contensis Cloud.

#### Future-proofing

Having these wrapped methods available as imports from `contensis-react-base` package means everybody can get the same experience without updating app code each time new features are introduced or bugs are fixed.

#### Secure Delivery API

This feature is currently under development and is dependent on importing wrapped methods as above for fetching sensitive content from the Delivery API in your own backing code.