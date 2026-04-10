---
sidebar_position: 3
---

# Sitemap

A sitemap is automatically generated and served at `/sitemap.xml` in production. It is built from two sources:

- All entries with a valid `sys.uri`
- Every `path` defined in `StaticRoutes`

## Configuration

Sitemap options are controlled from **`sitemap.config.ts`** in the project root.

## Options

| Option | Type | Description |
|--------|------|-------------|
| `languages` | `string[]` | Specify the languages your project supports (e.g. `['en-GB', 'fr-FR']`). |
| `noIndexField` | `string` | The field ID used on entries to declare them as `noindex`. Matching entries are omitted from the sitemap. |
| `priorityMap` | `object` | Map paths or Content Type IDs to specific sitemap priority values. |
| `additions` | `string[]` | Additional URLs to include in the sitemap — useful for microsites hosted on the same domain. |
| `excludeContentTypes` | `string[]` | Content Type IDs to exclude from the sitemap entirely. |
| `excludePaths` | `string[]` | Static route paths or URL patterns to exclude from the sitemap. |

## Example

```typescript title="sitemap.config.ts"
export default {
  languages: ['en-GB'],
  noIndexField: 'noIndex',
  priorityMap: {
    '/': 1.0,
    'blogPost': 0.8,
  },
  additions: [],
  excludeContentTypes: ['internalPage'],
  excludePaths: ['/admin'],
};
```
