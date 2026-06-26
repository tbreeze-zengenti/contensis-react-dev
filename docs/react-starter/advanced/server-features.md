---
sidebar_position: 4
title: Server features
---

# Server features

A **server feature** is a function that receives the Express app instance and registers
routes or middleware on it. This is the supported way to add server-side behaviour to a
React Starter project — custom API endpoints, proxies, redirects, health checks, or anything
that must run in Node rather than the browser.

The Express server itself is created by `@zengenti/contensis-react-base` (CRB) via
`ZengentiAppServer`; you do not instantiate it yourself. Instead you hand CRB a function that
configures the app once it has been built.

## How it works

`ZengentiAppServer.start()` (in `src/server/server.ts`) takes a configuration object as its
second argument and a **server features** function as its third:

```typescript title="src/server/server.ts"
import ZengentiAppServer from '@zengenti/contensis-react-base';
import ServerFeatures from './features/configure';

ZengentiAppServer.start(
  ReactApp,
  {
    // ...routes, reducers, sagas, templates, etc.
  },
  ServerFeatures // <- runs once the Express app is ready
);
```

`ServerFeatures` is `src/server/features/configure.ts`. CRB calls it with the live Express
`app`, and it delegates to individual feature functions:

```typescript title="src/server/features/configure.ts"
import { Express } from 'express';
import sitemap from './sitemap';
import robots from './robots';

const configureFeatures = (app: Express) => {
  if (!app) return null;
  robots(app);
  sitemap(app);
};

export default configureFeatures;
```

Each feature is a small function that takes the `app` and attaches handlers. The starter
ships two: [`sitemap`](./sitemap.md) (`app.get('/sitemap.xml', ...)`) and `robots`
(`app.use('/robots.txt', express.static(...))`). They are the reference pattern for anything
you add.

## Adding a server feature

### 1. Create the feature file

Add a folder under `src/server/features/`. A feature exports a default function that receives
the Express app:

```typescript title="src/server/features/health/index.ts"
import { Express } from 'express';

const health = (app: Express) => {
  app.get('/_health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
};

export default health;
```

### 2. Register it in `configure.ts`

```typescript title="src/server/features/configure.ts"
import health from './health';

const configureFeatures = (app: Express) => {
  if (!app) return null;
  robots(app);
  sitemap(app);
  health(app); // <- register the new feature
};
```

That's it — the route is live the next time the server starts.

## Proxying a third-party API

The most common reason to add a feature is to call a third-party API **server-side** so an
API key never reaches the browser. The feature fetches from the upstream API, then returns a
trimmed response to the client:

```typescript title="src/server/features/weatherProxy/index.ts"
import { Express } from 'express';

const weatherProxy = (app: Express) => {
  app.get('/api/weather', async (req, res) => {
    try {
      const upstream = await fetch(
        `https://api.example.com/weather?city=${encodeURIComponent(
          String(req.query.city ?? '')
        )}`,
        {
          headers: {
            // resolved from the project's build-time environment (see the caution below);
            // only ever read here on the server, never in the client bundle
            Authorization: `Bearer ${process.env.WEATHER_API_KEY}`,
          },
        }
      );

      if (!upstream.ok) {
        res.status(upstream.status).json({ error: `Upstream ${upstream.status}` });
        return;
      }

      const data = await upstream.json();
      // only forward the fields the client actually needs
      res.json({ temp: data.current.temp_c, summary: data.current.condition.text });
    } catch (error) {
      res.status(502).json({ error: 'Weather lookup failed' });
    }
  });
};

export default weatherProxy;
```

Your client code then calls your own origin (`/api/weather?city=...`) — a same-origin request
with no key and no CORS concerns.

:::caution Keep keys out of the *client* bundle
Reading a key in a server feature keeps it off the browser — the request comes from your own
origin, so there is no key in the client JavaScript and no CORS. Do **not** add keys to
`webpack/define-config.js`: values there are compiled into the bundle via `DefinePlugin`, and
the development build ships them to the browser (the Delivery API access token is only safe
there because it is a read-only delivery token, not a secret).

Be aware of how values reach the running server, though. Environment values are resolved at
**build time** (the `.env` file is read by `custom-env` in `define-config.js`), and **Contensis
Blocks do not yet support runtime environment variables** — so anything the server needs has to
be baked into the Docker image when it is built. A key used in a server feature therefore lives
inside the built image, not injected at runtime. That is a real improvement over exposing it in
the browser, but treat the image as sensitive (restrict who can pull it), and for genuinely
high-value credentials front the API with a separate secured service rather than embedding the
secret in the block.
:::

### Can I just hardcode the key as a `const`?

A reasonable question, since the feature only runs on the server. **From a browser standpoint,
yes — it's no less safe than the env approach.** The client bundle is built from
`src/client/client-entrypoint.ts` and the server bundle from `src/server/server.ts`; a feature
is only ever imported by the server entry, so a `const` declared in it compiles into
`dist/server.js` and is never sent to the browser. And because there is no runtime env in a
Block, the value is baked into the image either way.

But a hardcoded `const` is still the worse option:

- **It commits the secret to git** — it lives in tracked source and in history forever. This is
  exactly what the "never commit secrets" rule exists to prevent.
- **It's a single fixed value** — you can't vary it between dev and production builds without
  editing code; reading from the build environment lets each build supply its own.
- **It gains you no real secrecy** — given build-time baking, neither a `const` nor an env value
  is truly hidden. For genuinely sensitive credentials, front the API with a separate secured
  service instead of embedding the key in the block at all.

So prefer `process.env`/the build-time config over a literal — mainly for per-environment
swapping and to keep secrets out of source — while understanding the security difference between
the two is small in the current Blocks model.

## Choosing where to fetch

A server feature is the third option alongside the two client/SSR approaches. Pick by where
the call must run and whether the data is needed at first paint:

| Approach | Runs | Secret-safe | Use when |
| -------- | ---- | ----------- | -------- |
| **Server feature** (this page) | Node (always) | ✅ | The API needs a secret key, or you need a same-origin endpoint / proxy |
| [Redux saga + route lifecycle](./redux/ssr-fetch.md) | Node (during SSR) | ✅ if SSR-only | The data must be present in the first server-rendered paint (SEO, no loading flash) |
| [`customApi` minilist](../search/hooks/use-minilist.md#third-party-data-with-a-minilist) or `useEffect` + `fetch` | Browser | ❌ | A non-secret, client-side embedded widget where SSR isn't required |

These compose: a saga or a `customApi` minilist can point its request at a server feature you
expose on your own origin, getting the SSR/widget ergonomics on the client while the secret
stays on the server.

## Things to watch out for

- **Route ordering** — features run before CRB's catch-all React route handler, so a path you
  register here takes precedence. Namespace your endpoints (e.g. under `/api/`) to avoid
  clashing with content routes.
- **`fetch` on the server** — Node 18+ provides a global `fetch`; confirm your SSR runtime
  supports it, otherwise import a polyfill.
- **Errors** — always handle upstream failures and return a sensible status. An unhandled
  rejection in a route handler can take down the request.
