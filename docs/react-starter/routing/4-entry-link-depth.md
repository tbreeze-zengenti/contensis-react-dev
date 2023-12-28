---
sidebar_position: 4
---

# Entry Link Depth 

Entry Link Depth is how we define the depth of a query. 

:::info
By default Contensis React Base defaults the Entry Link Depth to `2` for all queries returned via a Content Type Mapping route.
:::

## Setting a Global Entry Link Depth

With Events can define a global link depth.

## Define the Entry Link Depth on each Route

The `linkDepth` parameter allows you to override the global `linkDepth` for the App on a *specific* route. This is great if you need to drill down through various linked entries to access a value however it does bring with it a hit to performance. You can mitigate this hit to performance by populating the `field` paramater (see [Optimising Large Entries](/react-starter/advanced/tips/optimising-large-entries)) for routes with a custom link depth.

If you need to update the link depth on Static Routes see [Fetch Node](#/react-starter/routing/static-routes#fetch-node)
