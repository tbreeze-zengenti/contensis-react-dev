---
sidebar_position: 2
---

# Content Type Mapping

Routes loaded via Content Type Mappings are based on the Content Types in the current project. At it’s most basic the contentTypeID will pair a component (normally a page component) with the corresponding Content Type value from the CMS. 

An example Content Type Mapping file can be found below - this example was copied from the React Starter repository. 

```jsx title="src/app/routes/ContentTypeMappings.ts"
import { ContentTypeMapping } from '@zengenti/contensis-react-base';

import { ContentTypes } from '../schema';
import { entryMapper } from '../util/json-mapper';

import { Home } from '~/dynamic/pages';
import homeMapper from '~/pages/Home/home.mapper';

const contentTypeMappings: ContentTypeMapping[] = [
  {
    contentTypeID: [ContentTypes.home],
    component: Home,
    entryMapper: entryMapper(homeMapper),
  },
];

export default contentTypeMappings;
```

## Options

### Inject Redux

With version 3.0 of the Contensis React Base we’re leveraging `@loadable` to load our pages/components. We can also use this approach to dynamically load parts of our Redux Store. The `injectRedux` parameter available to our routes enables us to do this.

By default the React Starter comes with an `injectSearch` function that we can pass to injectRedux to load the Search State on our routes. The `injectRedux` function can be found within `/app/src/redux/dynamic.ts`.



### Entry Link Depth

See [Entry Link Depth](docs/react-starter/Routing/entry-link-depth) for more information.

