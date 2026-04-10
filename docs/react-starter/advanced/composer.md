---
sidebar_position: 1
title: Composer
---

# Composer

## CMS setup

First, inside Contensis add a **Composer** field to your chosen Content Type and include a **Rich Text** field inside the composer.

Assign a value of `content` to the Composer field and a value of `richText` to the Rich Text field.

## Creating a Composer component

Next, create a Markup component that will render the content of the Rich Text field.

The Markup component is made up of the following files: 

- `markup.component.tsx`
- `markup.styled.ts`
- `markup.type.ts`
- `markup.mapper.ts`

```tsx title="Example Markup component file"
import React from 'react';

import { MarkupProps } from './markup.types';
import MarkupStyled from './markup.styled';

const Markup = ({ className, text}: MarkupProps) => {
  return (
    <MarkupStyled
      className={`markup ${className ? className : ''}`}
      dangerouslySetInnerHTML={{
        __html: text
      }}
    />
  );
};

export default Markup;
```

Both `markup.types.ts` and `markup.mapper` have requirements for this component to operate in the Composer.

`markup.types.ts` must contain a `_type` prop with a `string` reference to the CMS value. In this case `textArea` is the value assigned to the Rich Text field.

```tsx title="Example Markup Types file, with the unique '_type' key"
export type MarkupProps = {
  _type?: 'richText';
  className?: string;
  text: string;
};
```

`markup.mapper.ts` must contain the correct mapping of props to CMS values, as this mapper is imported into the Composer. 

```tsx title="Example Markup mapper file"
export const MarkupMapper= {
  text: '.',
};
```

:::tip
For this component the CMS value returned is a `string`, so you can map the prop `html` to `.` without having to reference a value directly.
:::

## Structuring the schema

With the component created, define some data in `schema.ts` as a reference for the Composer.

Inside `schema.ts` there is a predefined export called `ComposerComponents`. Use it to store a list of keys and values for each component.

The `key` can be named anything — here it is `markup` — but the `value` **must match** the `_type` value defined earlier.

```tsx title="The ComposerComponents object in the Schema file"
export const ComposerComponents = {
  // Insert composer components
  markup: 'richText',
};
```

## Dynamic loading

The latest version of Contensis React Base (CRB) uses `@loadable` to load components.

Add the `Markup` component to `/dynamic/composer.ts` to import it dynamically into the Composer.

Every composer component follows this structure.

```tsx title="Example of the loadable setup for Composer components"
import loadable from '@loadable/component';

// Import ComponentProps here
import { MarkupProps } from '~/features/markup/markup.types';

// Export each ComposerComponent using this structure
export const Markup = loadable<MarkupProps>(
  () =>
    import(
      /* webpackChunkName: "markup" */ '~/features/markup/markup.component'
    )
);
```

:::tip
In the React Starter, components, pages, and composer components are dynamically loaded.

Ensure your Composer is loading in `dynamic/components`. By default it is commented out.
:::

## Creating the Composer

With everything in place, build the Composer.

#### Data model

Inside a new `composer` directory (preferably inside the same directory as your components) create `composer.types.ts` to define the model for the Composer.

In this model, add all component props to `ComposerItemProps` and export them as `items`.

```tsx 
// Import ComponentProps here
import { MarkupProps } from '../markup/markup.types';

export interface ComposerProps {
  items: ComposerItemProps;
}

export type ComposerItemProps = MarkupProps;
```

When you add another component to the model, `ComposerItemProps` must be updated to include every imported `ComponentProps`. This can be achieved by separating all the `ComponentProps` with a `|` operator.

```tsx title="Adding more components to the Composer types"
export type ComposerItemProps = (
    | MarkupProps
    | ComponentProps
);
```

#### Rendering

Next, create `composer.tsx` which will contain the logic that determines which component is rendered.

This component maps through `items` and checks the `_type` values — if there is a match, it renders that component.

Import every component via `dynamic/composer`.

```tsx title="The Composer component controls which component renders"
import React from 'react';

import { Markup } from '~/dynamic/composer';

import { ComposerItemProps, ComposerProps } from './composer.types';

const Composer = ({ items }: ComposerProps) => {
  if (!items || !Array.isArray(items)) return null;

  return (
    <>
      {items.map((props: ComposerItemProps, index: number) => {
        if (!props._type) return null;
        switch (props._type) {
          case 'richText':
            return <Markup key={`composer-${index}-${props._type}`} {...props} />;

          default:
            console.error('Composer Component ', props._type, ' not found');
            return null;
        }
      })}
    </>
  );
};

export default Composer;
```

:::tip
Keys are generated using the item's index and `_type` (e.g. `composer-0-richText`). Contensis does not provide unique IDs for Composer fields, so index-based keys are the recommended approach. Avoid random keys as they cause unnecessary re-renders.
:::

#### Mapping

Create a mapper file for the composer called `composer.mapper.tsx`.

Import the specific component mappers (e.g. `markup.mapper`) and export them to `composerPropsMapping` using the `ComposerComponents` defined in the `schema` file as keys.

```tsx title="Creating the mapping object for the Composer"
import { ComposerComponents } from '~/core/schema';

import { MarkupMapping } from '~/features/markup/markup.mapper';

export const composerPropsMapping = {
  [ComposerComponents.markup]: MarkupMapping,
};
```

### Adding it to a page

With all that done, the Composer can be rendered.

This example creates a basic Page with the appropriate `props` and `mapper` to render the Composer.

#### Page interface

In the interface export, reference all props found within the Composer. Import `ComposerProps` and assign them to a prop inside the interface. 

```tsx 
import { RouteComponentProps } from '@zengenti/contensis-react-base';

import { ComposerProps } from '~/components/composer/composer.types';

export interface MappedPage {
  title: string;
  contentComposerProps: ComposerProps;
}

export type PageProps = RouteComponentProps<MappedPage>;
```

#### Rendering on the page

On the Page component, import the `Composer` component and pass it the prop assigned in the interface as a spread prop `{...prop}`.

In this example the prop is `contentComposerProps`.

```tsx
import React from 'react';

import { PageProps, MappedPage } from './page.types';
import PageStyled from './page.styled';

import { Composer } from '~/dynamic/components';

const Page = ({ mappedEntry }: PageProps) => {
  const { title, contentComposerProps } = mappedEntry || ({} as MappedPage);

  return (
    <PageStyled>
      {title && <h1>{title}</h1>}
      <Composer {...contentComposerProps} />
    </PageStyled>
  );
};

export default Page;
```

#### Mapping items 

Finally, create a specific function inside the Page’s mapper file to map through the Composer.

The prop `contentComposerProps` is mapped to `items` so that the Composer file can iterate over them.

Inside `items`, `content` is the value assigned to the Composer field in the CMS.

The function inside `items` uses the `mapComposer` function from `@zengenti/contensis-react-base` to apply the correct mapping to each `_type` it finds.

```tsx
import { mapComposer } from '~/core/util/json-mapper';

import { composerPropsMapping } from '~/components/composer/transformations/composer-to-props.mapper';

export const pageMapping = {
  title: 'entryTitle',
  contentComposerProps: {
    items: ({ content }: any) => mapComposer(content, composerPropsMapping),
  },
};
```