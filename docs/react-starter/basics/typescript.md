---
sidebar_position: 6
title: TypeScript
---

# TypeScript

TypeScript is a superset of JavaScript - it contains all the features of JavaScript but with some added benefits. TypeScript provides “type safety” to JavaScript & compiles to JavaScript for the browser to understand it.

To understand TypeScript & type safety, consider this simple example:

```tsx
const foo = "bar";
foo = true;
foo = 92;
```

Since `foo` has no defined type it can have any value. It’s difficult to know what `foo` *should* be.

Using TypeScript you can define a type of string:

```tsx
const foo: string = "bar";
```

Now if you attempt to set `foo` to a value that *isn’t* a string the compiler will throw an error. This is type safety & it can help to keep code consistent whilst reducing bugs.

## Why use TypeScript?

TypeScript makes the code **predictable** & **readable**. 

It’s predictable because everything stays as it was defined - a string can’t suddenly become a Boolean. This increases the chance that everything works as intended.

It’s readable because the types allow the code to be self-expressive, providing a form of built-in documentation. 

### Code completion

A benefit of TypeScript is that it enables Intelligent Code Completion (ICC).

ICC (better known as Intellisense in VS Code) will provide prompts based on the types to help you select the correct values & functions.

## Path aliases

React Starter configures two TypeScript path aliases in `tsconfig.json` to avoid long relative import paths:

| Alias | Resolves to | Use for |
|-------|------------|---------|
| `~/*` | `./src/app/*` | App-layer imports (components, hooks, redux, etc.) |
| `-/*` | `./` | Root-level imports (config files, webpack helpers, etc.) |

**Before** (relative path):

```tsx
import Meta from '../../../components/meta/meta.component';
```

**After** (using alias):

```tsx
import Meta from '~/components/meta/meta.component';
```

The `~` alias covers everything under `src/app/`, which is where the vast majority of imports will point. The `-` alias is rarely needed in day-to-day development but is useful when importing from the project root (e.g. `tsconfig.json` paths or root-level utilities).

## Strict mode

React Starter enables TypeScript strict mode. This catches a broad class of errors at compile time rather than runtime:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

With `strictNullChecks` enabled, `null` and `undefined` are not assignable to other types unless explicitly declared. Use optional chaining (`?.`) and nullish coalescing (`??`) to handle them safely.

## Props: `type` vs `interface`

Define component props as exported `type` aliases rather than `interface`. This keeps the style consistent across the project:

```tsx
// ✅ Preferred
export type CardProps = {
  title: string;
  description?: string;
  imageUrl?: string;
};

// ❌ Avoid in this project
interface CardProps {
  title: string;
}
```

## Generics for CMS data

Use TypeScript generics when working with Contensis Delivery API responses. Extend the `Entry` base type to add your content type's specific fields:

```typescript
import type { Entry } from 'contensis-delivery-api';

type BlogPost = Entry & {
  title: string;
  body: string;
  author: AuthorProps;
};
```

## Utility types

Use TypeScript's built-in utility types to derive new types from existing ones rather than duplicating type definitions:

```typescript
// Partial — all properties become optional
type PartialCardProps = Partial<CardProps>;

// Pick — select a subset of properties
type CardTitleProps = Pick<CardProps, 'title' | 'description'>;

// Omit — exclude specific properties
type CardWithoutImage = Omit<CardProps, 'imageUrl'>;
```

## React types

```typescript
import React from 'react';

// Children
type LayoutProps = {
  children: React.ReactNode;
};

// Event handlers
type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

// Forwarded refs
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

## Avoiding `any`

Never use `any` without a clear justification. Prefer these alternatives:

```typescript
// ✅ Use unknown for genuinely unknown types — forces you to narrow before use
const parseResponse = (data: unknown): UserData => {
  if (typeof data !== 'object' || data === null) throw new Error('Invalid');
  return data as UserData;
};

// ✅ Use generics for flexible but still type-safe functions
const fetchData = <T>(url: string): Promise<T> => {
  return fetch(url).then(res => res.json());
};

// ❌ Avoid — defeats the purpose of TypeScript
const handleData = (data: any) => { ... };
```