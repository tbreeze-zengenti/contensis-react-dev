---
sidebar_position: 8
---

# Storybook

React Starter ships with [Storybook](https://storybook.js.org/) v8.2.9 as a component development environment. Storybook lets you build and test UI components in isolation, independently of the running application.

## Running locally

```bash
npm run storybook
```

This starts Storybook at [http://localhost:6006](http://localhost:6006).

## Writing stories

Story files live alongside their components and follow the `*.stories.tsx` naming convention.

### Story organisation

Use the `title` property to group stories in the sidebar. The convention is `Category / Subcategory / ComponentName`:

```tsx title="src/app/components/blogCard/blogCard.stories.tsx"
import type { Meta, StoryObj } from '@storybook/react';
import BlogCard from './blogCard.component';

const meta: Meta<typeof BlogCard> = {
  title: 'Components / Cards / BlogCard',
  component: BlogCard,
  args: {
    title: 'Getting started with React Starter',
    description: 'A quick guide to the project structure and conventions.',
    imageUrl: '/images/placeholder.jpg',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'featured', 'compact'],
    },
    isLoading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BlogCard>;

// Default story — uses the args defined in meta
export const Default: Story = {};

// Override specific args per story
export const Featured: Story = {
  args: {
    variant: 'featured',
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
  },
};
```

### `args` and `argTypes`

- **`args`** — default prop values applied to every story in the file. Individual stories can override any arg.
- **`argTypes`** — configure the Storybook Controls panel for each prop:

| Control type | Config |
|---|---|
| Dropdown select | `control: 'select', options: [...]` |
| Toggle | `control: 'boolean'` |
| Colour picker | `control: 'color'` |
| Number range | `control: { type: 'range', min: 0, max: 100 }` |
| Hidden from controls | `table: { disable: true }` |

### ThemeProvider decorator

Components that use Styled Components theme tokens need a `ThemeProvider` in stories. Add it as a decorator in `.storybook/preview.tsx` to apply it globally, or per-story:

```tsx title="src/app/components/card/card.stories.tsx"
import { ThemeProvider } from 'styled-components';
import { theme } from '~/theme';

const meta: Meta<typeof Card> = {
  title: 'Components / Card',
  component: Card,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

:::tip
The global `preview.tsx` already wraps stories with a `ThemeProvider` in the boilerplate — you only need a per-story decorator if a story needs a different theme variant.
:::

## Storybook configuration

The Storybook configuration lives in `.storybook/`:

| File | Purpose |
|------|---------|
| `main.ts` | Storybook build config — addons, framework, story glob patterns |
| `preview.tsx` | Global decorators and parameters applied to every story |
| `middleware.js` | Custom Express middleware for the Storybook dev server |

## Deploying Storybook to Blocks

Storybook can be deployed as a static site alongside the main application. The `manifest.storybook.json` in the project root defines the Blocks deployment configuration for Storybook. Run `npm run build-storybook` to generate the static output, then follow your standard Blocks deployment process.
