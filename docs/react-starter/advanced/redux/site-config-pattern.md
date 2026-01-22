---
sidebar_position: 2
---

# Site Config Pattern

The **Site Config Pattern** is a standardized method for retrieving entry data in advance of the server-side render, utilizing **Redux** and **Redux Sagas**.

The “Site Config” refers to a global site configuration entry, typically used for managing data that is required across the entire site, such as header navigation, footer menus, social media links, and other global settings.

## What is a Site Config used for?

A **Site Config** is useful for any data that is global and needs to be available across all pages of the site. Examples include:

- The website’s `<title>` tag
- A list of social media links
- Configuration for the main navigation or footer menus
- Global settings or metadata that are shared across multiple pages

## How is it set up?

The **React Starter** project includes an implementation of the Site Config pattern as standard. It is located in the siteConfig directory. The pattern consists of the following key components:

1. **Redux Saga**: Handles server-side data fetching for the site configuration entry.
2. **TypeScript Mapper**: Transforms the raw entry data from the CMS into a format suitable for use in React components.
3. **Redux Slice**: Manages the state of the site configuration, including loading, error handling, and storing the mapped data.

Additionally, the `getSiteConfigSaga` is invoked in the `onRouteLoad` function within `withEvents.ts` to ensure the site configuration data is fetched on every route load, if necessary.

## Key Components of the Site Config Pattern

### 1. Redux Slice (`siteConfig.slice.ts`)

The Redux slice is responsible for managing the state of the site configuration. It includes:

- **Initial State**: Defines the default state of the site configuration, including `isLoading`, `isReady`, `isError`, and `mappedEntry`.
- **Reducers**:
  - `getSiteConfig`: Sets the `isLoading` flag to `true` when the saga starts fetching the site configuration.
  - `setSiteConfig`: Updates the state with the mapped site configuration data and sets `isReady` to `true`.
  - `getSiteConfigError`: Handles errors during the fetching process by setting the `isError` flag and storing the error details.
- **Selectors**: Provides utility functions to access specific parts of the state, such as `selectSiteConfigReady` and `selectSiteConfigEntry`.

:::info
When extending the site configuration, update the `initialState` to reflect the new fields and review whether additional selectors are needed to expose them consistently to components.
:::

### 2. Redux Saga (`sagas.ts`)

The `getSiteConfigSaga` is the core of the pattern. It handles the asynchronous fetching of the site configuration entry from the CMS using the `contensis-delivery-api`. Key steps include:

- **Checking State**: The saga first checks if the site configuration is already loaded using the `selectSiteConfigReady` selector.
- **Building the Query**: A `Query` object is created to fetch the site configuration entry. The query uses:
  - `sys.versionStatus` to fetch the correct version of the entry (e.g., published or preview).
  - `sys.contentTypeId` to specify the content type of the site configuration entry.
  - `siteConfigFields` to define the fields to retrieve.
- **Fetching Data**: The `api.search` method is used to fetch the entry data.
- **Mapping Data**: The `siteConfigMapper` transforms the raw entry data into a format suitable for the Redux state.
- **Updating State**: The saga dispatches either `setSiteConfig` (on success) or `getSiteConfigError` (on failure) to update the Redux state.

::info
When adding new fields to the site configuration entry, update the siteConfigFields array in fields.schema.ts so they are included in the search query.
:::

### 3. TypeScript Mapper (`siteConfig.mapper.ts`)

The mapper transforms the raw site configuration entry data into a format that is easier to use in React components. For example:

```tsx
export const siteConfigMapper = (
  config: ContentTypeSiteConfiguration,
): SiteConfigMappedProps => {
  return {
    title: config.entryTitle,
  };
};
```

:::info
Ensure the ContentTypeSiteConfiguration type is kept in sync with the corresponding CMS Content Type so the mapper can safely transform all required fields.
:::

### 4. Route Integration (`withEvents.ts`)

The `getSiteConfigSaga` is invoked in the `onRouteLoad` function within `withEvents.ts`. This ensures that the site configuration is fetched on every route load, if necessary.

```tsx
yield all([call(getSiteConfigSaga, ssr)]);
```

## How to Update the Site Config Pattern

If you need to update or extend the Site Config pattern, follow these steps:

1. **Add New Fields to the Site Configuration**:
   - Update the `siteConfigFields` array in `fields.schema.ts` to include the new fields you want to fetch from the CMS.
2. **Update the Mapper**:
   - Modify the `siteConfig.mapper.ts` file to map the new fields from the CMS entry to the `SiteConfigMappedProps` type.
   - Update the `ContentTypeSiteConfiguration` and `SiteConfigMappedProps` types to include the new fields.
3. **Update the Redux Slice**:
   - If necessary, update the `initialState` type in `siteConfig.slice.ts` to include new state properties.
   - Add new reducers if additional state management logic is required.
4. **Update the Saga**:
   - Modify the `getSiteConfigSaga` in `sagas.ts` to handle any changes to the query or additional logic for fetching the new fields.

By following these steps, you can effectively update and extend the Site Config pattern to meet the evolving needs of your application. This pattern ensures that global data is consistently and efficiently managed across your React application.

## Accessing Data Using Redux Selectors

Once the Site Config data is stored in Redux, you can access it using **Selectors**, which extract specific data from the state.

### Example: Accessing Social Media Links

Here’s a sample API response from the site config pattern:

```tsx
{
  "linkedinLink": "https://www.linkedin.com/showcase/contensis",
  "twitterLink": "https://twitter.com/contensis?lang=en",
  "facebookLink": "https://en-gb.facebook.com/",
  "entryTitle": "Leif",
  "copyrightName": "Leif"
}
```

Using the **Site Config Mapper**, you can transform this data into a structured format:

```tsx
export const siteConfigMapper = (
  config: ContentTypeSiteConfiguration,
): SiteConfigMappedProps => {
  return {
    title: config.entryTitle,
    social: {
      linkedin: config.linkedinLink,
      twitter: config.twitterLink,
      facebook: config.facebookLink,
    },
  };
};
```

:::info
Ensure `ContentTypeSiteConfiguration`, `SiteConfigMappedProps`, and the `initialState` are updated to reflect any changes.
:::

To access the `social` object, create a selector:

```tsx
export const selectSocial = (state: ReduxState) =>
  state.siteConfig?.mappedEntry?.social;
```

### Using the Selector in a Component

With the selector in place, use the `useSelector` hook to access the `social` object in a React component:

```tsx
import React from "react";
import { useSelector } from "react-redux";
import { selectSocial } from "~/redux/siteConfig/siteConfig.slice";

const SocialList = () => {
  const social = useSelector(selectSocial);

  if (!social) return null;

  return (
    <div>
      <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      <a href={social.twitter} target="_blank" rel="noopener noreferrer">
        Twitter
      </a>
      <a href={social.facebook} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
    </div>
  );
};

export default SocialList;
```

### Key Steps to Add New Data

1. **Update the CMS Content Type**: Add new fields in the CMS.
2. **Update `siteConfigFields`**: Add the new fields in `fields.schema.ts`.
3. **Update the Mapper**: Modify `siteConfig.mapper.ts` to map the new fields.
4. **Update the Redux State**: Update `siteConfig.slice.ts` if new state properties are needed.
5. **Create a Selector**: Add a selector to access the new data.
6. **Use the Selector**: Use `useSelector` in your components to access and render the data.
