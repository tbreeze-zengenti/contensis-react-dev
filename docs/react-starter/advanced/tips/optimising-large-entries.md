---
sidebar_position: 6
title: Optimizing large entries
---

# Optimizing large entries

When accessing large entries, particularly those with a `linkDepth` greater than `1`, you can end up returning fields you do **not** need. These un-needed fields add extra weight to the page. To combat this, use the `fields` option.

The `fields` option allows you to pass an array of strings, `string[]`, to build the query for a specific route. So instead of returning the entire `entry` object the query will only return the `fields` specific from that entry.

The `schema.ts` file in React Starter is a good place for storing your fields. These can then be passed to the `fields` option using the spread operator; `fields: [...BaseFields]`.

```typescript title="An example of how the fields option can be defined on a Content Type Mapping route"
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
