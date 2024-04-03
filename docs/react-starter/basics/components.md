---
sidebar_position: 1
---

# Components

## Simple example

``` src/app/components/recipe/recipe.component.tsx
import React from 'react';
const Recipe = () => {
    return (
        <ol>
            <li>Boil 1 cups of water.</li>
            <li>Add 1 spoons of tea and 0.5 spoons of spice.</li>
            <li>Add 0.5 cups of milk to boil and sugar to taste.</li>
        </ol>
    );
};
export default Recipe;
```

## File structure

Components reside within the `src/app/components` directory.
For consistency, it's recommended to name component files using the following
convention: `{componentName}.component.tsx`

## Recommended reading

To learn about creating React components we recommend following the
https://react.dev tutorials

- https://react.dev/learn/your-first-component
- https://react.dev/learn/typescript#typescript-with-react-components

### Benefits of Component-Based Architecture

- Improved Maintainability: Breaking down your UI into reusable components makes your code easier to understand, modify,
  and test.
- Increased Reusability: Components can be used multiple times throughout your application, reducing code duplication
  and promoting efficiency.
- Enhanced Readability: Well-defined components clearly separate concerns and promote a clean codebase.



