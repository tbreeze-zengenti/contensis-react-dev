---
sidebar_position: 4
---

# Assets

## Static assets

Static files (images, fonts, icons, `robots.txt`, web manifest, etc.) live in the **`public/`** directory. Anything placed here is served directly at the root URL with no processing by webpack.

```
public/
├── icon/          # App icons
├── index.html     # HTML entry point template
├── robots.txt     # Robots directives
└── manifest.webmanifest
```

## Webpack asset handling

Asset processing is configured in **`webpack/webpack.config.assets.js`**. This config handles:

- Image optimisation and file-loader rules for `.png`, `.jpg`, `.gif`, `.svg`
- Font file handling (`.woff`, `.woff2`, `.ttf`, `.eot`)
- Inline SVG support

The base webpack configuration (`webpack.config.base.js`) imports this assets config so it applies to both development and production builds.

## Importing assets in components

Import image and SVG assets directly into your component files. Webpack resolves and bundles them automatically:

```tsx
import logo from '~/assets/images/logo.svg';
import heroImage from '~/assets/images/hero.png';

const Header = () => (
  <header>
    <img src={logo} alt="Logo" />
  </header>
);
```

For SVGs you want to use inline (so they can be styled with CSS), import them as React components using the SVG loader:

```tsx
import { ReactComponent as ArrowIcon } from '~/assets/icons/arrow.svg';

const Button = () => (
  <button>
    Click me <ArrowIcon aria-hidden="true" />
  </button>
);
```
