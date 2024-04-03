---
sidebar_position: 2
---

# Pages

Pages are simply React functional components that layout smaller components.

## Simple example

``` src/app/components/pages/newsArticle.page.tsx
import React from 'react';
import MainLayout from '~/pages/mainLayout/mainLayout.template';

const NewsArticle = () => {
    return (
        <MainLayout>
          <h1>My First news article</h1>
          <article>
            <p>Lorem ipsum and other such content.</p>
          </article>
        </MainLayout>
    );
};
export default NewsArticle;
```

## File structure

Pages reside within the `src/app/pages` directory.
For consistency, it's recommended to name component files using the following
convention: `{componentName}.page.tsx`

## Layouts

In the above example a wrapping component is used `<MainLayout>`.
This is a layout component that can wrap around a page allowing for global components to be used. Layouts usually
include common elements like a header, navigation bar, and footer.

``` src/app/components/pages/mainLayout.page.tsx
import React from 'react';
import Navbar from '~/components/navbar/navbar.component';

const MainLayout = ({ children }) => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main id="main">
        {children}
      </main>
    </div>
  );
};
export default MainLayout;
```