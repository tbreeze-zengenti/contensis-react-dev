---
sidebar_position: 1
---

# Components

:::info Component vs CMS Component
In this project, **component** refers to a React component — a `.component.tsx` file in `src/app/components/`. A **CMS Component** is a different concept: a reusable embedded field schema defined in the Contensis CMS itself (no `sys.id`, not an entry). The two are unrelated.
:::

## Directory structure

Every component lives in its own directory under `src/app/components/`:

```
src/app/components/
└── card/
    ├── card.component.tsx      # Main component (required)
    ├── card.mapper.ts          # CMS data transformer (required if CMS-backed)
    ├── card.stories.tsx        # Storybook story (recommended)
    ├── card.styled.ts          # Styled components — split out if file gets large (optional)
    ├── card.types.ts           # Types — split out if file gets large (optional)
    └── index.ts                # Re-export (optional)
```

Page-level templates follow the same convention but live in `src/app/templates/`.

## Component file pattern

```tsx title="src/app/components/card/card.component.tsx"
import React from 'react';
import { styled } from 'styled-components';

// 1. Props type — always exported, never inlined
export type CardProps = {
  title: string;
  description?: string;
  imageUrl?: string;
  onClick?: () => void;
};

// 2. Component
const Card = ({ title, description, imageUrl, onClick }: CardProps) => {
  return (
    <CardStyled onClick={onClick}>
      {imageUrl && <CardImage src={imageUrl} alt={title} />}
      <CardContent>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
    </CardStyled>
  );
};

// 3. Styled components — defined after the main component
const CardStyled = styled.div`
  border-radius: 4px;
  overflow: hidden;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.m};
`;

const CardTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xxs};
`;

const CardDescription = styled.p`
  margin: 0;
`;

// 4. Default export
export default Card;
```

For Styled Components patterns (transient props, theme access, extending base components), see the [Code Style](/docs/react-starter/basics/code-style) guide.

## Mapper file pattern

Mappers transform raw Contensis CMS entries into the typed props your component expects. They live alongside the component and are used by the search system and page templates.

```typescript title="src/app/components/card/card.mapper.ts"
import type { Entry } from 'contensis-delivery-api';
import type { CardProps } from './card.component';

// Extend the base Entry type with your content type's fields
type CmsCardEntry = Entry & {
  cardTitle: string;
  cardDescription?: string;
  cardImage?: {
    asset?: { sys?: { uri: string } };
  };
};

export const cardMapper = (entry: CmsCardEntry): CardProps => ({
  title: entry.cardTitle,
  description: entry.cardDescription,
  imageUrl: entry.cardImage?.asset?.sys?.uri ?? '',
});
```

### Mapper best practices

- **Handle `null` and `undefined`**: CMS data may be incomplete — use optional chaining (`?.`) and nullish coalescing (`??`)
- **Type both input and output**: Type the raw CMS entry and the returned props
- **Keep mappers pure**: No side effects — mappers should only transform data, never fetch or dispatch
- **Use `Entry &`**: Extend the `Entry` base type rather than defining a separate type from scratch

## Icon components

SVG icons are converted to React components and registered in a dictionary:

```tsx title="src/app/components/icon/icons/close.tsx"
import React from 'react';

export const Close = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" {...props}>
    <title>Close</title>
    <path fill="currentColor" d="M2 15.435..." />
  </svg>
);
```

```typescript title="src/app/components/icon/icon.dictionary.ts"
import { Close } from './icons/close';
import { Menu } from './icons/menu';
import { Search } from './icons/search';

export const iconDictionary = {
  close: Close,
  menu: Menu,
  search: Search,
};
```

## Composer integration

Components that appear in the Contensis Composer field must be exported via `@loadable/component` from `src/app/components/index.ts`:

```typescript title="src/app/components/index.ts"
import loadable from '@loadable/component';

export const Card = loadable(() => import('./card/card.component'));
export const Hero = loadable(() => import('./hero/hero.component'));
```

See the [Composer](/docs/react-starter/advanced/composer) guide for how these are registered and rendered.

## Component checklist

Before considering a component done:

- [ ] Props type defined and exported (`ComponentNameProps`)
- [ ] Styled components use `theme.*` tokens — no hardcoded values
- [ ] Mapper file exists if the component receives CMS data
- [ ] Storybook story created with `args` and `argTypes`
- [ ] `@loadable` export added to `src/app/components/index.ts` if used in Composer
- [ ] Added to the Composer `componentMap` if used in a Composer field
- [ ] TypeScript strict mode passes (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
