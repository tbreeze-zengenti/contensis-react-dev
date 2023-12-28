---
sidebar_position: 1
---

# The Store



## Selectors and Actions

Contensis React Base also provides a variety of Selectors and Actions for accessing or manipulating your application's Store. Generally, the naming of these Selectors and Actions correlate with the object structure of the Store. 

You can import each collection like so:

```ts title="Default imports available from CRB"
import { navigation } from '@zengenti/contensis-react-base/redux';
import { routing } from '@zengenti/contensis-react-base/redux';
import { version } from '@zengenti/contensis-react-base/redux';
```

```ts title="An extensive list of the Actions and Selectors available"
// Navigation
const {
  hasNavigationTree,
  selectNavigationRoot,
  selectNavigationChildren,
  selectNavigationDepends,
} = navigation.selectors;

const {
  loadNavigationTree
} = navigation.actions;

// Routing
const {
  selectBreadcrumb,
  selectCurrentAncestors,
  selectCurrentChildren,
  selectCurrentHash,
  selectCurrentHostname,
  selectCurrentLocation,
  selectCurrentNode,
  selectCurrentPath,
  selectCurrentProject,
  selectCurrentSearch,
  selectCurrentSiblings,
  selectCurrentTreeID,
  selectIsNotFound,
  selectMappedEntry,
  selectQueryStringAsObject,
  selectRouteEntry,
  selectRouteEntryContentTypeId,
  selectRouteEntryEntryId,
  selectRouteEntryID,
  selectRouteEntryLanguage,
  selectRouteEntrySlug,
  selectRouteErrorMessage,
  selectRouteIsError,
  selectRouteLoading,
  selectRouteStatusCode,
  selectStaticRoute,
  selectSurrogateKeys,
} = routing.selectors;

const {
  setCurrentProject,
  setNavigationPath,
  setNotFound,
  setRoute,
  setRouteEntry,
  setSurrogateKeys
} = routing.actions;

// Version
const {
  selectCommitRef,
  selectBuildNumber,
  selectVersionStatus,
} = version.selectors

const {
  setVersion,
  setVersionStatus
} = version.actions;
```

