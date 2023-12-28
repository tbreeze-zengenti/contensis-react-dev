---
sidebar_position: 1
image: https://i.imgur.com/mErPwqL.png
---

# Installation

React Starter is a starter project built upon Zengenti's Contensis React Base framework. It's intended purpose is to help kickstart develop with Contensis & React.

## Requirements

- [Node.js](https://nodejs.org/en) version 18 or above (which can be check by running `node -v`). We recommend using [nvm](https://github.com/nvm-sh/nvm) for managing multiple versions of Node.

## Installation

1. To install the project you can run the following `git clone` command to clone a fresh copy of the [develop branch](https://gitlab.zengenti.com/starter-projects/react-starter) - remember to replace `/new-project` with your desired location. ```git clone git@gitlab.zengenti.com:starter-projects/react-starter.git /new-project```

2. After cloning you'll need to navigate to the installation folder & delete the `.git` folder. This will remove the Git history for the starter project. You can do this in your terminal by running `rm -rf .git` in the installation folder.

3. Following this you can run `git init` to establish a fresh Git history. It's recommended that you stage all the changes & make an initial commit at this point.

4. Finally, you can run `npm i` to install the required dependencies.

:::note
If you encounter any installation issues you should remove your /node_modules folder & run `npm install --legacy-peer-deps`.
:::