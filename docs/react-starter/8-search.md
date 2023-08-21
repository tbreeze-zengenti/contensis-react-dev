---
sidebar_position: 8
---

# Search

## Config

## Mappers

## useFacets

## useListing

A Listing is a feature of the Search package which allows us to display a page of results.

### When to use useListing?

A Listing is best used for rendering large filterable lists of data:

- Displaying a page of Cards with filtering/facets
- Rendering paged content such as a blog

## useMinilist

The MiniList is a feature of the Search package which allows us to return a selection of search results within a component or page.

### When to use useMinilist?

Since MiniLists are designed to return small selections of data they are perfect for:

- Displaying a selection of Cards on a Homepage
- Returning a list of related Entries at the end of an entry
- Fetching data from an external API

### How to use useMinilist

To get started with a Minilist you’ll need a Content Type in your CMS Project that you wish to fetch. For demonstration purposes we'll be returning `blogPost` to create a Minilist that renders 3 blog posts. 

#### Query

Next you'll need to define your query inside `search.config.ts`. Inside the query you'll need to define the `contentTypeID` you wish to fetch along with a few other parameters.

```ts title="A query object for a minilist"
minilist: {
    blogs: { // Reference to our Schema Minilists object
      title: 'Related Blogs', // A title for our Listing
      queryParams: { // QueryParams allow us to build a query
        contentTypeIds: ['blogPost'], // Reference to the ContentTypeID we want to fetch
        fields: ['entryTitle'], // An array of Fields we want to return from BlogPost
        pageSize: 3, // The number of entries to return
        orderBy: ['entryTitle'] // The order we want our entries to return in
      },
    },
  } as { [key: string]: Listing },
```

#### Mapper

Our hook will require a mapper to map the queried data to the relevant component props. We can define a mapper for `blogPost` Content Type's in `entry-to-cardprops.mapper.ts`. This is a special mapper that allows us to define mappings for Content Types that are queried by Search.

Once the fields are defined the export `mappers` object must contain a `key` that refers to the `contentTypeId`, in this instance that key is `blogPost`.

```ts title="Adding 'blogPost' mappings to our Search mapper (entry-to-cardprops.mapper.ts)"
const blogPostMapping = { 
    title: 'entryTitle',
    description: 'entryDescription',
    image: 'image.asset.sys.uri',
    id: 'sys.id',
};

export const mappers = {
    blogPost: blogPostMapping,
};
```

#### Loading Search

For performance reasons we do **not** load Search state on any route. To load Search state we need to inject it to the required route.

To do this you simply need to `injectRedux` to any route your Minilist will exist on & import the `injectSearch` utility included in the project. This will enable Search state on the desired routes.

For this example we're going to add it to our `blogPost` Content Type routing so that we can render a Minilist on every blog post.

```ts title="Injecting Search state to a variety of Route types"
// ContentTypeMappings example
const contentTypeMappings: ContentTypeMapping[] = [
  {
    contentTypeID: ContentTypes.blogPost,
    component: BlogPost,
    injectRedux: injectSearch,
  },
];

// Static Route example
{
    path: '/a-specificly-named-blog-post-for-some-reason',
    component: BlogPost,
    injectRedux: injectSearch,
},
```

#### Rendering

The `useMinilist` hook is executed client-side so there's a few steps to jump through to get it working.

**Steps need adding - full example for the time being**

```tsx title="Example of useMinilist"
import React, { useState, useEffect } from 'react';
import {
    useMinilist,
    UseMinilistProps,
} from '@zengenti/contensis-react-base/search';

import mappers from '~/search/transformations';

import ResultCard from '~/components/resultCard/resultCard';
import { ResultCardProps } from '~/components/resultCard/resultCard.types';

const minilistInitState = {
  id: '',
  mapper: (e: any = []) => e,
} as UseMinilistProps;

const BlogPage = () => {
    // We use state to store our Minilist query/data
    const [blogsMinilist, setBlogsMinilist] =
    useState(minilistInitState);

useEffect(() => {
    // We can use a setTimeout to allow the async search bundles to
    // fully register before triggering a minilist in a static route
    setTimeout(() => {
        setBlogsMinilist({
            id: 'blogs', // The ID is the `key` of your Search Config object
            mapper: mappers.results,
        });
    }, 500);
}, []);

// We destructure the props from `useMinilist` that we need
// and pass `blogsMinilist` to the hook to access them
const { results, title } =
useMinilist<ResultCardProps>(blogsMinilist);

return (
    <div>
        <h2>{title}</h2>
        {/* When rendering we can simply spread our result since the mapper 
            we created is mapping the search data to our component's props.
            It is important however to provide a unique key for React,
            so we specifiy that our `key` is the result's `id` prop.
        */} 
        {results.map(result => (
            <ResultCard key={result.id} {...result} />
        ))}
    </div>
);
}

export default BlogPage;
```

#### Extras

##### Replacing setTimeout

Using `setTimeout` to ensure our Search state is available is fine in development but not so good in production. The best method for checking if the Search state is ready is Redux itself. We can use a selector to check if Search state exists, if it does it's safe to execute our `useEffect`.

```ts title="A boolean selector for querying Search state"
export const selectIsSearchLoaded = (state: any): boolean =>
    state.search != null && state.search != undefined;
```

We can then replace `setTimeout` and conditionally check if our Search state is present. Adding `isSearchLoaded` as the `useEffect`'s depdendency means that when it is ready our `useEffect` will trigger.

```tsx title="Replacing setTimeout with a selector"

// Will return true or false
const isSearchLoaded = useSelector(selectIsSearchLoaded);

useEffect(() => {
    if (isSearchLoaded) {
        setBlogsMinilist({
            id: 'blogs', 
            mapper: mappers.results,
        });
    }
}, [isSearchLoaded]);

```
