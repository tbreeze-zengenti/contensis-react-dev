# Contensis Forms

Requires the Contensis environment to be running version 16.1+.

## Install the forms package

```sh
npm i @contensis/forms --save
```

### Recommended: Update canvas-react render package

This update supports adding a block renderer for `_formContentType` and fixes handling unknown block types (`v1.1.0+`)

You do not need to install this update if you are not rendering any Canvas content in your app yet

```sh
npm i @contensis/canvas-react --save
```

### Optional: Update contensis-react-base package

This update adds new reverse proxies used in development only (`v3.2.2+`)

Alternatively you can avoid using reverse proxies by specifying the `apiUrl` prop in the `form.tsx` component

```sh
npm i @zengenti/contensis-react-base@prerelease --save
```

### Or: Install all packages together

```sh
npm i @contensis/forms @contensis/canvas-react @zengenti/contensis-react-base@prerelease --save
```

## Render a form

`formId` is the only prop required to render a form.

### In a page

Import the `<Form .../>` component from the `~/dynamic` or `~/components` folder

As a bare minimum add the `formId` prop. This can be hard coded to a specific form instance, or could be mapped into the component tree from a content entry, using the raw API id or preferably using the new "Resource picker" content type field.

### In canvas content

Canvas rendering packages do not include a built-in render method for rendering Forms. This prevents your app potentially bundling multiple versions of `@contensis/forms` package.

We need to provide a Form component as a block renderer (override) in your Canvas component for example: `<RenderContextProvider blocks={{ _formContentType: FormBlock }}>`.

In the canvas block renderer, map the prop value: `block?.value?.contentType?.id` to the `formId` prop in your imported `<Form />` component

## Troubleshooting

`Unexpected end of JSON input` message is rendered when the CMS does not have the new forms API. Check the CMS is running on Contensis 16.1 as a minimum.

`Authorization has been denied for this request` message is rendered when the form requires the user to be logged in already

Custom render states can be applied supplying your own components to the `error`, `loading`, `disabled` props in `<ContensisForm .../>` component