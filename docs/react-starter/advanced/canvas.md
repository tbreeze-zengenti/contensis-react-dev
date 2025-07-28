---
sidebar_position: 1
---

# Canvas

## Resources

There is an example of a basic `<Canvas>` component available in React Starter that utilises the following packages:


### Renderer

There are several rendering packages available for Canvas that cover a variety of languages - including React.

**Each package has it’s own excellent documentation that also includes example usage.** 

[GitHub - contensis/canvas](https://github.com/contensis/canvas)

[npm: @contensis/canvas-react](https://www.npmjs.com/package/@contensis/canvas-react)

## Testing the Water

If you’re new to Canvas a good way to get started is to pull a fresh copy of React Starter. Inside you’ll find a Canvas component that uses the Canvas package to render data. This component has been configured & mapped onto the Article page within the project. 

To see it in action you can add a fresh static route to fetch & render a blog from Leif.

```tsx
import { entryMapper } from '@zengenti/contensis-react-base/util';
import articleMapper from '~/pages/Article/article.mapper';
import ArticlePage from '~/pages/Article/article.page';

const staticRoutes: StaticRoute[] = [
	... other routes,
	{
    path: '/blog/indoor-plant-care-top-tips-for-looking-after-your-indoor-plants',
    exact: true,
    fetchNode: {
      params: [],
      entryMapper: entryMapper(articleMapper),
    },
    component: ArticlePage,
  },
];
```

Now when you navigate to that path you’ll find Canvas data being mapped & rendered onto a page. 

### Routed Links

By default the `@contensis/canvas-react` library’s renderer will output `<a>` tags for every link in a Canvas field. It’s **recommended** that you provide an override to ensure that links in a Canvas field are output as React Router links instead.

```jsx
import Link from '../link/link';

const Canvas = ({ data }: { data: Block[] | null }) => {
  return (
    <RenderContextProvider blocks={{ _link: Link }} >
      <Renderer data={data} />
    </RenderContextProvider>
  );
};
```

### Inline Entry Fields Link Depth

Canvas fields will respect the fields & link depth defined on a query - or in the world of CRB, the fields & link depth defined on a route. 

By default an Inline Entry will return all fields (if none are declared) up to the link depth declared on the route. This behaviour can quickly bloat the size of the query. In order to combat this it’s important to consider what fields & depth you need on a given route when working with Inline Entries.