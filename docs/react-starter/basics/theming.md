---
sidebar_position: 4
---

# Theming

React Starter uses [Styled Components](https://styled-components.com/) for styling, with a TypeScript-typed theme that provides consistent design tokens across all components.

## Theme structure

The theme lives in `src/app/theme/` and is composed of four files:

| File | Purpose |
|------|---------|
| `colors.ts` | Brand colour palette |
| `layout.ts` | Spacing scale, breakpoints, media queries, grid settings |
| `styled.d.ts` | TypeScript declaration that types the `DefaultTheme` |
| `globalStyles.ts` | Global CSS reset and base styles |

The theme object is assembled in `src/app/theme/index.ts` and passed to `ThemeProvider` at the application root.

## Colours

`colors.ts` defines the brand colour palette. Extend this file to add your project's colours:

```typescript title="src/app/theme/colors.ts"
export const colors = {
  contensis: '#37bfa7',
  zengenti: '#002033',
  // Add your project colours here
};
```

Reference colours in Styled Components via `theme.colors.*`:

```typescript
const Heading = styled.h1`
  color: ${({ theme }) => theme.colors.zengenti};
`;
```

## Spacing

`layout.ts` exports a spacing scale based on an 8px grid:

```typescript title="src/app/theme/layout.ts"
export const spacing = {
  xxxs: '0.25rem',  //  4px
  xxs:  '0.5rem',   //  8px
  xs:   '1rem',     // 16px
  s:    '1.5rem',   // 24px
  m:    '2rem',     // 32px
  l:    '2.5rem',   // 40px
  xl:   '4rem',     // 64px
  xxl:  '5rem',     // 80px
  xxxl: '7.5rem',   // 120px
};
```

Use spacing tokens instead of hardcoded values:

```typescript
const Card = styled.div`
  padding: ${({ theme }) => theme.spacing.m};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;
```

## Breakpoints and media queries

`layout.ts` also exports breakpoints (in `rem`) and pre-built `min`/`max` media query strings:

```typescript title="src/app/theme/layout.ts"
export const breakpoints = {
  mobile:       30,   // 480px
  tablet:       48,   // 768px
  laptop:       62,   // 992px
  desktop:      68.75, // 1100px
  largeDesktop: 90,   // 1440px
};

export const mq = {
  min: {
    mobile:  `only screen and (min-width: 30rem)`,
    tablet:  `only screen and (min-width: 48rem)`,
    laptop:  `only screen and (min-width: 62rem)`,
    // ...
  },
  max: { /* same keys */ },
};
```

Use `theme.mq` in Styled Components:

```typescript
const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xs};

  @media ${({ theme }) => theme.mq.min.tablet} {
    padding: ${({ theme }) => theme.spacing.m};
  }
`;
```

## Theme type declaration

`styled.d.ts` tells TypeScript what shape the `DefaultTheme` has, enabling autocomplete and type checking in all Styled Components:

```typescript title="src/app/theme/styled.d.ts"
import 'styled-components';
import { colors } from './colors';
import { breakpoints, grid, mq, spacing } from '~/theme/layout';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof colors;
    breakpoints: typeof breakpoints;
    mq: typeof mq;
    spacing: typeof spacing;
    grid: typeof grid;
  }
}
```

:::caution
Keep `styled.d.ts` in sync whenever you add new tokens to `colors.ts` or `layout.ts`. TypeScript will flag any access to undeclared theme properties.
:::

## Global styles

`globalStyles.ts` uses `createGlobalStyle` to apply a CSS reset and base styles across the application. It is rendered once at the app root alongside `ThemeProvider`. Common things it provides:

- `box-sizing: border-box` for all elements
- Margin resets
- Font-size inflation prevention
- Base `font-family` and `line-height`

You can extend `globalStyles.ts` to add project-wide CSS variables or helper classes (e.g. `.sr-only` for screen reader text).

## Applying the theme

For how to write Styled Components that consume these tokens — including transient props (`$`), extending base components, and import order — see the [Code Style](/docs/react-starter/basics/code-style) guide.
