---
sidebar_position: 1
title: Installation
---

# Installation

React Starter is a starter project built upon Zengenti's Contensis React Base framework. It's intended purpose is to help kickstart development with Contensis & React.

## Requirements

- [Node.js](https://nodejs.org/en) version 20 or above (as specified in `.nvmrc`) — which can be checked by running `node -v`

It is recommended to use [nvm](https://github.com/nvm-sh/nvm) for managing multiple versions of Node.

## Installation

To create and install a new React Starter project, use the following commands:

```bash
npx contensis-react-starter my-project
cd my-project
npm install
```

:::caution
If you encounter issues when running npm install, try the following:  
`rm -rf /node_modules && npm i --legacy-peer-deps`
:::

### Cloning fresh from GitLab

Alternatively, you can clone the project directly from the [GitLab repository](https://gitlab.zengenti.com/starter-projects/react-starter). However, you will need to remove and reinitialise Git within the repository:

```bash
git clone https://gitlab.zengenti.com/starter-projects/react-starter.git my-project
cd my-project
rm -rf .git
npm install
```

After installation, you can reinitialise Git with the following commands:
```bash
git init
git add .
git commit -m "Initial commit"
```

### Existing project

If you are joining an existing project or one created on your behalf by Zengenti, simply clone and install the repository:

```bash
git clone https://gitlab.zengenti.com/group-name/my-project-name.git my-project
cd my-project
npm install
```


## Running the development server

To begin developing locally you'll need to familiarise yourself with these commands:

- `npm start` - start the application in development mode (http://localhost:3000/)
- `npm run storybook` - start storybook in development mode (http://localhost:6006/)
- `npm run build:server` - build the application and start the server-side application from source code (allowing you to connect a debugger and stop on code that is executed server-side) (http://localhost:3001/)

## Project structure

After installation, the project is organised as follows:

```
my-project/
├── src/
│   ├── app/                        # All application code
│   │   ├── components/             # Reusable React components
│   │   ├── templates/              # Page-level template components
│   │   ├── routes/                 # Route definitions (static + content-type)
│   │   ├── redux/                  # Custom Redux slices, selectors, sagas
│   │   ├── search/                 # Search config, mappers, and minilist hooks
│   │   ├── schema/                 # Constants: content type IDs, field lists, search keys
│   │   ├── theme/                  # Styled Components theme (colors, spacing, breakpoints)
│   │   ├── types/                  # Global TypeScript type definitions
│   │   └── util/                   # Utility functions and custom hooks
│   ├── server/                     # Express SSR server entry point
│   └── client/                     # Browser client entry point
├── public/                         # Static assets served as-is (favicons, fonts, images)
├── webpack/                        # Webpack configuration
├── docker/                         # Docker configuration for Contensis Blocks deployment
├── .env                            # Environment variables (not committed)
├── .nvmrc                          # Node.js version pin
└── package.json
```

Most day-to-day development happens inside `src/app/`. Each subdirectory has a dedicated section in these docs — see the sidebar for guides on components, routing, search, and more.
