---
sidebar_position: 7
---

# Meta

The `Meta` component manages all `<head>` tags for a page using [`react-helmet`](https://github.com/nfl/react-helmet). It handles the page title, description, Open Graph tags, Twitter Card tags, canonical URLs, robots directives, Insytful analytics metadata, and RSS feed links.

## Usage

Import and render `Meta` at the top of your page component, passing the relevant props:

```tsx
import React from 'react';
import Meta from '~/components/meta/meta.component';

const NewsArticlePage = ({ mappedEntry }) => {
  const { title, description, heroImage } = mappedEntry || {};

  return (
    <>
      <Meta
        pageTitle={title}
        description={description}
        ogImage={heroImage?.url}
        ogImageAltText={heroImage?.altText}
        ogType="article"
      />
      {/* rest of page */}
    </>
  );
};

export default NewsArticlePage;
```

## Props

```tsx
export type MetaProps = {
  pageTitle: string;
  description?: string;
  locale?: string;

  ogDescription?: string;
  ogImage?: string;
  ogImageAltText?: string;
  ogType?: 'article' | 'profile' | 'website' | 'video';

  twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterHandle?: string;
  authorTwitterHandle?: string;

  insytful?: boolean;
  noIndex?: boolean;
  noFollow?: boolean;

  rssFeedPath?: string;
};
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pageTitle` | `string` | — | **Required.** The page title. Rendered as `{pageTitle} \| React Starter`. |
| `description` | `string` | — | Meta description. Also used as the Twitter description and OG fallback. |
| `locale` | `string` | `en_GB` | OG locale tag. |
| `ogDescription` | `string` | — | Open Graph description. Falls back to `description` if not supplied. |
| `ogImage` | `string` | — | URL of the Open Graph / Twitter share image. |
| `ogImageAltText` | `string` | — | Alt text for the OG/Twitter image. |
| `ogType` | `'article' \| 'profile' \| 'website' \| 'video'` | `website` | Open Graph content type. |
| `twitterCardType` | `'summary' \| 'summary_large_image' \| 'app' \| 'player'` | `summary` | Twitter Card type. |
| `twitterHandle` | `string` | — | Twitter handle for the site (e.g. `@MyBrand`). |
| `authorTwitterHandle` | `string` | — | Twitter handle for the content author. |
| `insytful` | `boolean` | `true` | When `true`, injects `IDL:ProjectId` and `IDL:EntryId` meta tags for Insytful analytics. |
| `noIndex` | `boolean` | `false` | Adds `noindex` to the robots meta tag. |
| `noFollow` | `boolean` | `false` | Adds `nofollow` to the robots meta tag. |
| `rssFeedPath` | `string` | — | Path to an RSS feed. Adds a `<link rel="alternate" type="application/rss+xml">` tag. |

## Canonical URL

The component automatically generates a canonical URL by combining a `canonicalDomain` (from `~/util/canonicalDomain`) with the current route's canonical path from the Redux store. No manual configuration is needed.

## Insytful metadata

When `insytful` is `true` (the default), the component reads the current `projectId` and `entryId` from the Redux store and injects them as:

```html
<meta name="IDL:ProjectId" content="..." />
<meta name="IDL:EntryId" content="..." />
```

Set `insytful={false}` on pages where you do not want Insytful to track the entry (e.g. search results pages or 404 pages).

## noIndex / noFollow

Both flags can be used together or independently. When either is `true`, a `robots` meta tag is rendered:

```html
<!-- noIndex only -->
<meta name="robots" content="noindex" />

<!-- both -->
<meta name="robots" content="noindex, nofollow" />
```
