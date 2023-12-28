---
sidebar_position: 1
---

# Components

## Composer

### CMS Setup

Firstly, inside Contensis we’ll need to add a **Composer** field to our chosen Content Type & then include a **Rich Text** field inside the composer. 

We’ll assign a value of `content` to our Composer field & a value of `richText` to our Rich Text field.

### Creating a “Composer Component”

Next we’ll need to create a Markup component that will render the content of our Rich Text field. 

Our Markup component is made up of the following files: 

- `markup.component.tsx`
- `markup.styled.ts`
- `markup.type.ts`
- `markup.mapper.ts`

```jsx title="Example Markup component file"
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

Both `markup.types.ts` & `markup.mapper` have requirements for this component to operate in the Composer. 

`markup.types.ts` must contain a `_type` prop with a `string` reference to our CMS value. In this case we’re referencing `textArea` as that’s the value we assigned to our Rich Text field.

```jsx title="Example Markup Types file, with the unique '_type' key"
export type MarkupProps = {
  _type?: 'richText';
  className?: string;
  text: string;
};
```

`markup.mapper.ts` must contain the correct mapping of props to CMS values as we’ll be importing this mapper into our Composer. 

```jsx title="Example Markup mapper file"
export const MarkupMapper= {
  text: '.',
};
```

:::tip
For this component the CMS value returned is a `string` so we can map the prop `html` to `.` without having to reference a value directly.
:::

### Structuring the Schema

With our component created we’ll next need to define some data in our `schema.ts` file as a reference for our Composer.

Inside `schema.ts` there’s a predefined export called `ComposerComponents`. Here we can store a list of keys & values for each component. 

The `key` can be named whatever suits, so he we’re referencing our component & naming it `markup`, but the `value` **must match** the `_type` value we defined earlier.

```jsx title="The ComposerComponents object in the Schema file"
export const ComposerComponents = {
  // Insert composer components
  markup: 'richText',
};
```

### Dynamic Loading

The latest version of the Zengenti Base Package utilises `@loadable` to load components.

With this in mind we’ll need to add our new `Markup` component to `/dynamic/composer.ts` in order to import it *dynamically* into our Composer.

Every composer component will need to follow this structure.

```jsx title="Example of the loadable setup for Composer components"
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
Currently in the react-starter project components, pages, & composer components are dynamically loaded.

Therefore if you’re using the starter project you’ll need to ensure that your Composer is loading in `dynamic/components`. By default it will be commented out.
:::

### Creating the Composer

With everything in place we can finally build our Composer.

#### Data model

Firstly, inside a new `composer` directory (preferrably inside the same directory as our components) we can create `composer.types.ts` to define the model for our Composer.

In this model we’ll add all of our component props to `ComposerItemProps` & export them as `items`.

```jsx 
// Import ComponentProps here
import { MarkupProps } from '../markup/markup.types';

export interface ComposerProps {
  items: ComposerItemProps;
}

export type ComposerItemProps = MarkupProps;
```

When you add another Component to the model the ComposerItemProps will need to be amended to include every imported ComponentProps. This can be achieve by seperating all the ComponentProps with a | operator.

```jsx title="Adding more components to the Composer types"
export type ComposerItemProps = (
    | MarkupProps
    | ComponentProps
);
```

#### Rendering

Next we’ll need to create `composer.tsx` which will contain the logic that determines which component is rendered. 

This component will map through `items` & check the `_type` values, if there’s a match it will render that component.

For every component we’ll need to import it via the `dynamic/composer`.

```jsx title="The Composer component controls which component renders"
import React from 'react';
import uniqueID from '~/core/util/unique';

import { Markup } from '~/dynamic/composer';

import { ComposerItemProps, ComposerProps } from './composer.types';

const Composer = ({ items }: ComposerProps) => {
  if (!items || !Array.isArray(items)) return null;

  return (
    <>
      {items.map((props: ComposerItemProps) => {
        if (!props._type) return null;
				switch (props._type) {
          case 'richText':
            return <Markup key={id()} {...props} />;

          default:
            console.error(
              'Composer Component ',
              (props as any)._type,
              ' not found'
            );
            break;
        }
      })}
    </>
  );
};

export default Composer;
```

#### Mapping

To wrap up we’ll need to create a mapper file for the composer called `composer.mapper.tsx`.

In our mapper we’ll import our specific component mappers, `markup.mapper` in this instance, & export them to `composerPropsMapping` using the `ComposerComponents` we defined in the `schema` file as a key.

```jsx title="Creating the mapping object for the Composer"
import { ComposerComponents } from '~/core/schema';

import { MarkupMapping } from '~/features/markup/markup.mapper';

export const composerPropsMapping = {
  [ComposerComponents.markup]: MarkupMapping,
};
```

### Adding it to a Page

With all that done we can finally render our Composer.

For this example we’ll create a basic Page with the appropriate `props` & `mapper` to render our Composer.

#### Page Interface

In our interface export we need to reference all of the props found within our Composer. To do this we import our ComposerProps & assign them to a prop inside the interface. 

```jsx 
import { RouteComponentProps } from '@zengenti/contensis-react-base';

import { ComposerProps } from '~/components/composer/composer.types';

export interface MappedPage {
  title: string;
  contentComposerProps: ComposerProps;
}

export type PageProps = RouteComponentProps<MappedPage>;
```

#### Rendering on the Page

On our Page component we’ll need to import the `Composer` component & pass it `prop` we assigned in the interface as a spread prop `{...prop}`.

In this example `prop` is `contentComposerProps`.

```jsx
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

#### Mapping Items 

Finally we’ll need to create a specific function inside the Page’s mapper file to map through our Composer.

The `prop` we defined, `contentComposerProps` in this example, is mapped to `items` so that our Composer file can map over `items`. 

Inside `items` we’re defining `content` which is the value we assigned to the Composer field in the CMS.

The function inside of `items` is utilising the `mapComposer` function from `@zengenti/contensis-react-base` to apply to correct mapping to each `_type` it finds.

```jsx
import { mapComposer } from '~/core/util/json-mapper';

import { composerPropsMapping } from '~/components/composer/transformations/composer-to-props.mapper';

export const pageMapping = {
  title: 'entryTitle',
  contentComposerProps: {
    items: ({ content }: any) => mapComposer(content, composerPropsMapping),
  },
};
```