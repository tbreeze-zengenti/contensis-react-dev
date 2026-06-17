---
sidebar_position: 6
title: Optimizing large entries
---

# Optimizing large entries

When accessing large entries, particularly those with a `linkDepth` greater than `1`, you can end up returning fields you do **not** need. There are two distinct concerns to optimise here, and it is important not to confuse them:

- **Payload size** — how much JSON is sent to the front end. Controlled by the `fields` option.
- **Query performance** — how much linked-entry resolution the API performs. Controlled by `linkDepth` and `fieldLinkDepths`.

## Reducing the payload with `fields`

The `fields` option allows you to pass an array of strings, `string[]`, to build the query for a specific route. So instead of returning the entire `entry` object the query will only return the `fields` specified from that entry.

This trims the **front-end payload**, but it does **not** improve query performance: the API still resolves every linked entry up to `linkDepth` before projecting the unwanted fields out of the response. `fields` shrinks what is sent over the wire, not the work the query does.

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

## Improving query performance with `fieldLinkDepths`

To make the query itself faster, control how much link resolution it performs. Raising the global `linkDepth` resolves **every** linked field to that depth, which is expensive. Instead, use `fieldLinkDepths` to resolve links only on the named fields your mapper needs, keyed as `{ fieldName: depth }`:

```typescript title="Pairing fields (payload) with fieldLinkDepths (performance)"
const contentTypeMappings: ContentTypeMapping[] = [
  {
    contentTypeID: 'article',
    component: Article,
    entryMapper: entryMapper(articleMapper),
    fields: [...ArticleFields], // trims the payload
    linkDepth: 0,
    fieldLinkDepths: {
      author: 1, // resolves only the linked author entry
      category: 1, // resolves only the linked category entry
    },
  },
];
```

Prefer `fieldLinkDepths` over raising the global `linkDepth`, and use it **instead** of `linkDepth` once your baseline depth is already `2` or higher (raising it further is exponentially expensive). `fieldLinkDepths` requires Contensis 16+, supports a maximum depth of `10`, and has a recommended maximum of `4`.

:::tip
`fields` trims the payload; `fieldLinkDepths` trims the work. Use `fields` to shrink the response, and `fieldLinkDepths` — **not** a higher `linkDepth` — to keep the query fast.
:::

See the [Entry link depth](/docs/react-starter/routing#field-specific-link-depth) routing guidance and the search-context [`fieldLinkDepths` vs `linkDepth`](/docs/react-starter/search/config#fieldlinkdepths-vs-linkdepth) reference for more detail.
