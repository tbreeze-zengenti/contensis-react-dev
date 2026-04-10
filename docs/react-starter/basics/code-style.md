---
sidebar_position: 9
title: Code style
---

# Code Style

This guide covers naming conventions, Styled Components patterns, and file organization. Following these conventions keeps the codebase consistent and predictable.

## Naming conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `UserProfile`, `NavigationMenu` |
| Component files | camelCase | `userProfile.component.tsx` |
| Directories | camelCase | `userProfile/` |
| Props types | PascalCase + `Props` | `UserProfileProps` |
| Styled components | PascalCase + `Styled` | `UserProfileStyled` |
| Mappers | camelCase + `Mapper` | `userProfileMapper` |
| Constants | UPPER_SNAKE_CASE | `MAX_ITEMS`, `API_URL` |
| Hooks | camelCase with `use` prefix | `useUserData`, `useScroll` |

## Import order

Organize imports in this order, with a blank line between each group:

```typescript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. External libraries
import { useSelector } from 'react-redux';
import { styled } from 'styled-components';

// 3. Internal modules (absolute paths via ~ or - aliases)
import { selectUser } from '~/redux/selectors';
import { Button } from '~/components/button';

// 4. Relative imports
import { cardMapper } from './card.mapper';
import type { CardProps } from './card.component';
```

## Component structure order

Within a component file, follow this order:

```typescript
// 1. Types
export type ComponentProps = {
  title: string;
  isActive?: boolean;
};

// 2. Component
const Component = ({ title, isActive }: ComponentProps) => {
  // hooks first
  const [open, setOpen] = useState(false);

  // handlers
  const handleClick = () => setOpen(true);

  // render
  return (
    <ComponentStyled $isActive={isActive} onClick={handleClick}>
      {title}
    </ComponentStyled>
  );
};

// 3. Styled components (after main component)
const ComponentStyled = styled.div<{ $isActive?: boolean }>`
  // styles
`;

// 4. Export
export default Component;
```

## Styled Components patterns

### Basic pattern

```typescript
import { styled } from 'styled-components';

const CardStyled = styled.div`
  padding: ${({ theme }) => theme.spacing.m};
  background: white;
`;
```

### Accessing theme tokens

Always access design tokens via the theme — never hardcode values:

```typescript
// ✅ Use theme tokens
const Title = styled.h1`
  color: ${({ theme }) => theme.colors.zengenti};
  padding: ${({ theme }) => theme.spacing.s};

  @media ${({ theme }) => theme.mq.min.tablet} {
    padding: ${({ theme }) => theme.spacing.m};
  }
`;

// ❌ Avoid hardcoded values
const Title = styled.h1`
  color: #002033;
  padding: 24px;
`;
```

### Transient props (`$` prefix)

Props intended only for styling — not passed to the DOM — must be prefixed with `$`. This prevents React from forwarding them to the HTML element:

```typescript
type StyledProps = {
  $isActive: boolean;
  $variant: 'primary' | 'secondary';
};

const ButtonStyled = styled.button<StyledProps>`
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.contensis : 'transparent'};
  font-weight: ${({ $variant }) => ($variant === 'primary' ? 700 : 400)};
`;

// Usage — $ props are consumed by styled-components, not forwarded to <button>
<ButtonStyled $isActive={true} $variant="primary">
  Click me
</ButtonStyled>
```

### Extending base components

```typescript
const BaseButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.s};
  border-radius: 4px;
  border: none;
  cursor: pointer;
`;

// Extend with additional styles
const PrimaryButton = styled(BaseButton)`
  background: ${({ theme }) => theme.colors.contensis};
  color: white;
`;

const OutlineButton = styled(BaseButton)`
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.contensis};
`;
```

## Linting and formatting

Run before committing:

```bash
# Check for lint errors
npm run lint

# Auto-fix fixable lint errors
npm run lint:fix
```

Key rules enforced by ESLint and Prettier:

- No unused variables
- Single quotes for strings
- Trailing commas in multiline structures
- 2-space indentation
- Maximum line length of 100 characters
