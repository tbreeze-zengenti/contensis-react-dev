---
sidebar_position: 1
---

# Maintenance

Advice on maintaining your project.

## Node.js

We recommend you ensure that your project runs on a maintained version of Node.js at all times. Node.js typically requires upgrading every 18-24 months. Refer to the [Node.js schedule](https://nodejs.org/en/about/previous-releases) for more details.


An `.nvmrc` file is included in the project root to specify the Node.js version for the project. This file is useful for switching versions with [NVM](https://github.com/nvm-sh/nvm) or utilising auto-switching scripts.

:::tip
Maintaining the `.nvmrc` file with upgrades and **enforcing** NVM usages within your team can help to prevent user-specific issues during development.

You can find auto-switching scripts for various terminals (Base, ZSH, etc.) that read the `.nvmrc` file and switch to the correct Node.js version automatically.
:::

### Upgrading Node

Before upgrading your Node.js version, it's helpful if you have Docker installed locally and have some familiarity with Dockerised applications.

We **highly recommend** handling Node.js upgrades in a feature branch to avoid blocking development in other branches.

To upgrade your Node.js version, follow these steps:
1. Update `.nvmrc` to the desired version
2. Install/switch to the desired version `nvm use #`
3. Run `npm install` 
    * Optionally, you can delete `node_modules` and `package-lock.json` before this step for a cleaner install. This may be required due to changes in the install process between Node.js/NPM versions.
4. Run `npm run build` and ensure your build completes successfully
5. Update the Node.js version in `docker/ci-build.DockerFile` and `docker/nodebuilder.DockerFile`
    * Typically, you can just bump the version number after `node:` in each file. If needed, find the correct Node.js image on [Docker Hub](https://hub.docker.com/_/node).
6. If you have Docker installed, you can test your project locally before pushing to GitLab by building and running your container. Use the included utilities by running `./localbuild.sh`. If successful, run `./localrun.sh` and visit `localhost:3001` to preview your project.
    * If `./localbuild.sh` fails, you will likely be presented with an error message to help with debugging.
7. If you don't have Docker installed, you will have to push to GitLab to test your upgrade in the CI.

## Dependencies (package.json)

We recommend you regularly check for dependency updates and aim to upgrade [MINOR or PATCH versions](https://semver.org/) when available.

We **highly recommend** handling dependency updates in a feature branch to avoid blocking development in other branches.

### Maintaining dependencies

Maintaining dependencies can be complex, especially with a large number of dependencies or a long period between updates. Fortunately, tools within NPM can simplify this process:

- [`npm outdated`](https://docs.npmjs.com/cli/v10/commands/npm-outdated)
    * This command generates a table of outdated dependencies, showing the current version, latest version, and the wanted version.
- [`npm update`](https://docs.npmjs.com/cli/v10/commands/npm-update)
    * This command updates all dependencies based on the [semver constraints](https://docs.npmjs.com/about-semantic-versioning) specified in the `package.json`.

The default dependencies in React Starter have defined semver constraints, allowing you to run npm outdated and npm update to upgrade to the latest MINOR and PATCH versions as shown in the "wanted" column of the outdated list. However, due diligence is required for packages installed by you or another developer.

