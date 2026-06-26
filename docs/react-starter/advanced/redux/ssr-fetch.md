---
sidebar_position: 3
title: Fetching third-party data
---

# Fetching third-party data

In a Contensis React Base (CRB) project you should not call `fetch` directly inside a
component. Doing so breaks server-side rendering (SSR) and leaves you with no loading or
error state in the store. The recommended pattern is to perform the network call inside a
**Redux saga**, triggered from the route lifecycle.

This is the same machinery used for Contensis Delivery API calls — you simply swap the
`api.search(...)` call for your own `fetch`.

## 1. Create the slice

Create a slice to hold the data along with `isLoading`, `isReady`, and `error` flags, for
example `src/app/redux/weather/weather.slice.ts`.

```typescript
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ReduxState } from '../redux.type';
import type { WeatherMappedProps } from './weather.mapper';

export type WeatherState = {
  mappedEntry: WeatherMappedProps | null;
  isLoading: boolean;
  isReady: boolean;
  isError: boolean;
  error: string | null;
};

const initialState: WeatherState = {
  mappedEntry: null,
  isLoading: false,
  isReady: false,
  isError: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    getWeather(state) {
      state.isLoading = true;
    },
    setWeather(state, action: PayloadAction<WeatherMappedProps>) {
      state.mappedEntry = action.payload;
      state.isLoading = false;
      state.isReady = true;
      state.isError = false;
      state.error = null;
    },
    getWeatherError(state, action: PayloadAction<string>) {
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { getWeather, setWeather, getWeatherError } = weatherSlice.actions;
export default weatherSlice.reducer;

export const selectWeather = (state: ReduxState) => state?.weather;
export const selectWeatherReady = (state: ReduxState) =>
  selectWeather(state)?.isReady;
export const selectWeatherEntry = (state: ReduxState) =>
  selectWeather(state)?.mappedEntry;
```

## 2. Perform the fetch in a saga

Do the network call inside the saga worker. Unlike a Delivery API saga, a third-party saga
does **not** destructure `{ api }` from `SSRContext` — that is the Delivery API client. You
call `fetch` yourself, wrapped in `call()` so it is yielded correctly and remains testable.

```typescript
import { takeLatest, put, call } from 'redux-saga/effects';

import { getWeather, setWeather, getWeatherError } from './weather.slice';
import { weatherMapper } from './weather.mapper';

export const WeatherSagas = [takeLatest(getWeather.type, getWeatherSaga)];

export function* getWeatherSaga(): Generator<unknown, void, unknown> {
  try {
    const res = (yield call(fetch, 'https://api.example.com/weather')) as Response;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = yield call([res, 'json']); // res.json()
    yield put({ type: setWeather.type, payload: weatherMapper(data) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put({ type: getWeatherError.type, payload: message });
  }
}
```

**Choosing the watcher effect:**

| Effect        | Use when                                                                 |
| ------------- | ------------------------------------------------------------------------ |
| `takeEvery`   | Analytics, fire-and-forget events                                        |
| `takeLatest`  | Refetchable data — only the most recent result is needed                 |
| `takeLeading` | One-shot page-load fetch — must not be interrupted or duplicated         |

## 3. Wire it into the store

Register the new slice in the four standard files:

- **`src/app/redux/reducers.ts`** — register the reducer:

  ```typescript
  import weatherReducer from './weather/weather.slice';

  const reducers = combineReducers({
    // existing reducers...
    weather: weatherReducer,
  });
  ```

- **`src/app/redux/sagas.ts`** — spread the watcher array:

  ```typescript
  import { WeatherSagas } from './weather/sagas';

  const featureSagas = [...SiteConfigSagas, ...WeatherSagas];
  ```

- **`src/app/redux/redux.type.ts`** — add the state key. It **must** be optional, or SSR
  hydration will crash before the slice loads:

  ```typescript
  import type { WeatherState } from './weather/weather.slice';

  export interface ReduxState extends AppState {
    weather?: WeatherState;
  }
  ```

- **`src/app/redux/selectors.ts`** — re-export the selectors:

  ```typescript
  export {
    selectWeather,
    selectWeatherReady,
    selectWeatherEntry,
  } from './weather/weather.slice';
  ```

## 4. Trigger the saga from the route lifecycle

Fire the saga in `onRouteLoad` (`src/app/routes/withEvents.ts`) so the data is fetched
server-side and present on the first paint:

```typescript
onRouteLoad: function* onRouteLoad({ ssr }) {
  yield all([
    call(getSiteConfigSaga, ssr),
    call(getWeatherSaga),
  ]);
  return yield routeLoadOptions;
},
```

:::tip Inspecting the SSR fetch in the browser
By default the route lifecycle runs on the server, so the saga's network call won't appear
in your browser's dev tools on the first load. Append `?dynamic=true` to the URL to force the
app into client-side rendering (CSR) — the route lifecycle then runs in the browser, and you
can watch the saga's `fetch` fire in the Network tab. This is handy for debugging a
route-lifecycle fetch in a deployed environment without server access.
:::

## 5. Read the data in a component

```typescript
import { useSelector } from 'react-redux';
import { selectWeatherEntry } from '~/redux/selectors';

const Weather = () => {
  const weather = useSelector(selectWeatherEntry);
  // ...
};
```

## Saga vs `fetch` in `useEffect`

A common React pattern is to fetch inside a `useEffect` hook in the component itself:

```typescript
const Weather = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/weather')
      .then(res => res.json())
      .then(setWeather);
  }, []);

  // ...
};
```

This works in a client-only React app, but in a CRB project it is the wrong default. `useEffect`
**never runs on the server** — effects only fire after the component mounts in the browser. That
has several consequences:

| Concern              | `useEffect` + `fetch`                                            | Saga + route lifecycle                                                  |
| -------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **SSR**              | Skipped on the server; data is missing from the first paint     | Runs server-side; data is present in the initial HTML                   |
| **SEO**              | Crawlers see an empty shell until JS hydrates and fetches        | Crawlers see fully rendered content                                     |
| **Loading / error** | Hand-rolled `useState` in every component                       | Centralised in the slice (`isLoading`, `isReady`, `error`)              |
| **State sharing**    | Local to the component; refetched on every mount                | Lives in the store; any component can read it via a selector            |
| **Hydration**        | Causes a flash of empty content, then a re-render once fetched   | No flash — server and client render the same content                    |
| **Secrets / CORS**   | Runs in the browser; API keys are exposed                       | Runs server-side during SSR, but re-runs in the browser on client navigation — proxy via a [server feature](../server-features.md#proxying-a-third-party-api) if a real secret is involved |
| **Testability**      | Requires mounting the component and mocking `fetch`             | Saga is a plain generator — test by stepping through yielded effects    |

**Rule of thumb:** anything needed for the initial render — and anything tied to page load — must
go through a saga so it is part of the SSR pass. Reach for `useEffect` + `fetch` only for genuinely
client-side, post-load interactions (for example, a button click or polling) where SSR and SEO are
irrelevant.

## Things to watch out for

- **SSR and `fetch`** — sagas run on the server during SSR. Node 18+ provides a global
  `fetch`; confirm your SSR runtime supports it, otherwise import a polyfill.
- **Always map the response** — pass the third-party payload through a `.mapper.ts` before
  it reaches the store. The mapper is a shape and security boundary; it prevents unexpected
  fields from leaking into the client.
- **CORS and secrets** — if the API requires an API key, do not call it from the browser.
  Keep the call server-side only, or proxy it through your SSR/Express layer with a
  [server feature](../server-features.md#proxying-a-third-party-api).
- **Client-only fetches** — for a one-off, client-side-only fetch (for example, a button
  click that is not needed for SSR), a `useEffect` + `fetch` in the component is acceptable.
  Anything tied to page load should go through a saga so it is part of the SSR render. For an
  embedded widget (a "related items" list, a sidebar feed) backed by a third-party API where SSR
  isn't required, a `customApi` minilist is another client-side option — see
  [useMinilist › Third-party data with a minilist](../../search/hooks/use-minilist.md#third-party-data-with-a-minilist).
