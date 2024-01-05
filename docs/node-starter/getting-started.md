---
sidebar_position: 1
---

# Getting Started

Node Starter is a starter project for creating an Express (Node.js) web app ready for Blocks deployment.

## Setup

- Populate all `.env` parameters
- Update details inside `package.json`
- `npm i` to install packages

### Deployment

- Create a Role (with required permissions) and API key pair in Contensis
- Define CI variables in Gitlab
- Update gitlab-ci.yml

## Running Locally

### Node

To run service locally in node just run `npm run start`

To build and run compiled code run `npm run build && npm run serve`

### Docker

To build image locally run `docker build --force-rm -t node-starter -f docker/ci-build.Dockerfile .` (Docker desktop must be running)

Initialise docker container from image then go to `http://host.docker.internal:3001/` to view endpoints

## Configuring Site View

Once deployed you will need to configure Site View nodes, with this app's Block renderer, to all the routes you wish to access from your main app.
