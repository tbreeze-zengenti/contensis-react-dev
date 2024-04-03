---
sidebar_position: 3
---

# Mappers

The purpose of a mapper function is to take in properties, process them, then return an object with some modifications /
transformations applied.

## Simple example

Typescript definitions have been omitted from this example for simplicity.

```
const newsArticleMapper = (props) => {
  return {
    title: props.entryTitle,
    content: props.canvas,
    author: props.author.title,
    published: props.sys.version.published,
  };
};
```

## Approches

There are two main approaches to creating a mapping function; Typescript & JSON path mapper.

### Typescript

This approach requires setting up type definitions so you can get the benefits of type safety.
If you are confident with Typescript and the benefits it would be recommended taking this approach.

```
import { RouteEntry } from '~/util/routeEntry.type';
import { NewsArticleProps } from './newsArticle.template';
import { ContentTypeNewsArticle } from '~/models/generated/contentTypesAndComponents.model';
import metaMapper from '~/components/meta/meta.mapper';

export default (
  props: RouteEntry<ContentTypeNewsArticle>
): NewsArticleProps => {
  return {
    meta: metaMapper(props),
    title: props.entryTitle,
    content: props?.content ? { data: props.content } : undefined,
    published: props.sys.version?.published,
  };
};
```

### JSON path mapper

This is a utility created to simplify mapping. First define a mapping template, then pass the template along with the
properties in.
This approach helps streamline the mapping process and promotes consistency in transformations.
Note: this does not provide any type definitions.

```
import { mapJson } from '@zengenti/contensis-react-base/util';
import { metaMapper } from '~/components/meta/meta.mapper

const newsArticleMapper = {
  meta: metaMapper,
  title: 'entryTitle',
  content: 'content',
  published: 'sys.version.published',
};
mapJson(props, newsArticleMapper);
```

For more information on JSON path mapper read the [documentation](https://www.npmjs.com/package/jsonpath-mapper).