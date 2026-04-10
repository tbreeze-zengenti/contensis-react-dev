---
title: Overview
sidebar_position: 1
---

# Overview

Contensis React Base provides a wrapper for working with Contensis's Elastic search implementation. The Starter Project offers a boilerplate approach to configuring this implementation, whilst CRB also provides a variety of Hooks for rendering and interacting with the results.

## Architecture

Search in React Starter is built on three layers that work together:

1. **Config** — defines what to search for (content types, facets, listings, minilists) via `search.config.ts`
2. **Mappers** — transform raw Delivery API results into the shape your components need
3. **Hooks** — provided by Contensis React Base (`useFacets`, `useListing`, `useMinilist`) for connecting React components to search state

The search config is loaded at route change time via `withEvents` (`onRouteLoaded`). The hooks read from Redux state and handle pagination, filtering, and navigation automatically.

## Config

The Search Config (`/search.config.ts`) is an object-like interface for defining search parameters. The `facets`, `listings`, and `minilist` objects provide the configurations for the `useFacets`, `useListing`, and `useMinilist` hooks to query.

Every search object follows the same pattern and there is full TypeScript support available.

## Mappers

There are various different mappers available for Search: `results`, `resultsInfo`, `navigate`, `filterItems`, `customApi`. Each mapper has a default behaviour, provided by CRB, but in the Starter Project we export our own `results` and `resultsInfo` mapper from the `entry-to-cardprops.mapper.ts` and `state-to-resultsionformationprops.mapper.ts` files respectively. In most circumstances you will only ever have to update these mappers, however, the `navigate` and `filterItems` mappers can be useful in some siutations.


## Hooks

Several hooks are available from Contensis React Base to help working with search.
