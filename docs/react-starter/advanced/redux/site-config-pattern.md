---
sidebar_position: 2
---

# Site Config Pattern

A Site Config is a common way of defining site-wide settings that are consumed via Redux.

### What is a Site Config used for?

A site config is useful for anything that’s going to be used site-wide such as;

- The website’s `<title>` tag
- Storing a list of social media address
- Building a Content Type driven nested navigation

### How is it setup?

The Site Config pattern inside the develop branch of React Starter (redux/siteConfig) has everything required to access a Content Type called `siteSettings`. To use it for your project you will have to extend the `siteConfigMapper` to suit your data & create selectors to access that data.

### Change the Content Type

To access a Content Type without the ID of `siteSettings` you can amend the value of `ContentTypes.config` in the Schema file.

### How do I access my data?

The process of accessing data from the Site Config is similiar to the process of mapping data to components.

As an example here is the shape of the API call returned from Leif’s `siteSettings` content type:

```json
"entryThumbnail": null,
"linkedinLink": "<https://www.linkedin.com/showcase/contensis>",
"twitterLink": "<https://twitter.com/contensis?lang=en>",
"entryDescription": null,
"logo": {},
"sys": {},
"copyrightDate": "2021-01-01T00:00:00",
"entryTitle": "Leif",
"facebookLink": "<https://en-gb.facebook.com/>",
"copyrightName": "Leif"

```

To create an object of Social Media links you could map to these values in the `SiteConfigMapper` like so:

```jsx
export const SiteConfigMapper = {
  title: 'copyrightName',
	social: {
		linkedin: 'linkedinLink',
		twitter: 'twitterLink',
		facebook: 'facebookLink'
	},
};

```

With that mapping in place it’s possible to see the App’s state update in Redux Dev Tools.

To access the Social you’ll need a Selector. These allow you to use hooks provided by Redux to access a portion of your App’s state. In the Site Config selectors file you can create one to access the social object:

```jsx
export const selectSocial = (state: any) => {
  return state.siteConfig.config?.social;
};

```

The return simply drills down through the state object, which is everything we can see in Redux Dev Tools.

Now that you have a Selector set up you can call the `useSelector` hook. This hooks calls the data for us to work with like any other element in React.

As an example here’s a simple component that renders a link for every value inside of the Social object:

```jsx

import React from 'react';

import { useSelector } from 'react-redux';
import { selectSocial } from '~/redux/siteConfig/selectors';

const SocialList = ({}) => {
	const social = useSelector(selectSocial);
	return (
		<>
			<a href={social.linkedin}>LinkedIn Profile</a>
			<a href={social.twitter}>Twitter Handle</a>
			<a href={social.facebook}>Facebook Page</a>
		</>
	)
}
```

:::note
All of the steps above are reference the Leif CMS project, which is the default CMS that React Starter is connected to, so you can follow them to see how they work.
:::