---
sidebar_position: 4
---

# Theming

This project has a simple TypeScript implementation of Styled Components. The values within styled.d.ts must be maintained as you expand your theme to keep TypeScript happy.

## Variables

### Colors

A  basic example of working with multiple color palettes is provided.

### Layout

A handful of pre-defined breakpoints that are utilised to generated `min` & `max` media queries.

A basic spacing object is provided which is based upon an 8px grid.


## Global Styles

A custom reset is provided along with `normalize.css`(you can disable normalize by commenting it out). A basic CSS Variables setup is in place should you wish to use them. Various helper classes are available too (for example `.sr-only` for accomodating screen readers).