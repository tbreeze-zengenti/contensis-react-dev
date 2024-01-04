---
sidebar_position: 1
image: https://i.imgur.com/mErPwqL.png
---

# Installation

React Starter is a starter project built upon Zengenti's Contensis React Base framework. It's intended purpose is to help kickstart development with Contensis & React.

## Requirements

- [Node.js](https://nodejs.org/en) version 18 or above

We recommend using [nvm](https://github.com/nvm-sh/nvm) for managing multiple versions of Node.

## Installation

To install a new React Starter project, use the following commands:

```
npx contensis-react-starter my-project
cd my-project
npm i
```

Alternatively, you can clone the project directly from [GitLab repository](https://gitlab.zengenti.com/starter-projects/react-starter).


:::caution
If you encounter installation issues when running `npm i`, please try the following:  
`rm -rf /node_modules && npm i --legacy-peer-deps`
:::