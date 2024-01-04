---
sidebar_position: 2
---

# Environment

A file called `.env` is required in the project root, this contains the core pieces of information to connect to your Contensis environment.

Inside an `.env` we strictly require the following keys in order to connect to the Contensis: `ALIAS`, `PROJECT`, `ACCESS_TOKEN`.

### Alias

The alias is what we call the part of a CMS URL that changes. This is the part of the URL located between `cms-` and `.cloud.contensis.com`.

For example our Contensis instance for Leif can be found at [cms-leif.cloud.contensis.com](https://www.notion.so/Environments-env-e10a086c22bf457397b18713f2fca26e?pvs=21) so our ALIAS is `leif`.

### Project

Project refers to the ID of the project within Contensis. You can obtain this by going to Settings → General while you have the desired project selected, the field “API Name” is the one you want.

:::tip
Nearly all the URLs in modern Contensis screens & API calls with also contain the project ID. For example, if you go to the Entries screen in your CMS you will see the website ID in the URL.
:::

### Access Token

The Delivery API Access Token is required to access the data from the CMS. It can be obtained by heading to Contensis Classic → Management Console (cog icon) → Global Settings → and then search for DeliveryAPI_AccessToken.

:::tip
The Access Token is for a specific CMS & not unique to a CMS project. Therefore if you’re working from the same CMS but under a different project you can use the same Access Token.
:::

### Public URL

The public-facing URL for this web application, it is not required for connecting to the Contensis CMS.

## Multiple Environments

You may create more env files for different CMS environments by applying a suffix `.{suffix}` to the file name. For example a development env might look like: `.env.development`

To activate an alternative env upon start/build you need to reference the `.{suffix}` in this script: `npm --env={suffix} run-script start`.

You can also add new scripts to your `package.json` to speed up running these alternative environements: `"start:dev": "npm --env={suffix} run-script start",`