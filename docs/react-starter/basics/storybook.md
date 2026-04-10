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

Story files live alongside their components and follow the `*.stories.tsx` naming convention. Example:

```tsx title="src/app/components/button/button.stories.tsx"
import type { Meta, StoryObj } from '@storybook/react';
import Button from './button.component';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Click me',
    variant: 'primary',
  },
};
```

## Storybook configuration

The Storybook configuration lives in `.storybook/`:

| File | Purpose |
|------|---------|
| `main.ts` | Storybook build config — addons, framework, story glob patterns |
| `preview.tsx` | Global decorators and parameters applied to every story |
| `middleware.js` | Custom Express middleware for the Storybook dev server |

## Deploying Storybook to Blocks

Storybook can be deployed as a static site alongside the main application. The `manifest.storybook.json` in the project root defines the Blocks deployment configuration for Storybook. Run `npm run build-storybook` to generate the static output, then follow your standard Blocks deployment process.
