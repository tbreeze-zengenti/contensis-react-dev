# Optimising Large Entries

When accessing large entries, particularly those with a `linkDepth` greater than `1`, we can end up returning fields we do **not** need. These un-required fields add extra weight to the page. To combat this we can utilise the `fields` option. 

The `fields` option allows us to pass an array of strings, `string[]`, to build our query for this specific route. So instead of returning the entire `entry` object the query will only return the `fields` specific from that entry.

The `schema.ts` file in React Starter is a good place for storing your fields. These can then be passed to the `fields` option using the spread operator; `fields: [...BaseFields]`.

```jsx title="An example of how the fields option can be defined on a Content Type Mapping route"
import { ContentTypeMapping } from '@zengenti/contensis-react-base';

import { entryMapper } from '../util/json-mapper';

import { Article } from '~/dynamic/pages';
import articleMapper from '~/pages/Home/home.mapper';

const ArticleFields = [
	'entryTitle',
	'entryDescription',
	'image.sys.uri',
	'sys.publishedDate',
];

const contentTypeMappings: ContentTypeMapping[] = [
  {
    contentTypeID: 'article',
    component: Article,
    entryMapper: entryMapper(articleMapper),
    fields: [...ArticleFields],
  },
];

export default contentTypeMappings;
```
