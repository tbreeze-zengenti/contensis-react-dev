---
sidebar_position: 6
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

## Why do we use it?

We use TypeScript because it makes our code **predictable** & **readable**. 

It’s predictable because everything stays as it was defined - a string can’t suddenly become a Boolean. This increases the chance that everything works as intended.

It’s readable because the types allow the code to be self-expressive, providing a form of built-in documentation. 

### Code Completion

A benefit of TypeScript is that it allows us to leverage Intelligent Code Completion (ICC).

ICC (better known as Intellisense in VS Code) will provide prompts based on the types to help you select the correct values & functions.