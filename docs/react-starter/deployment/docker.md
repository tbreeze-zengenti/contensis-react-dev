---
sidebar_position: 1
---
# Docker

Docker is a tool that packages apps and everything they need (like code, libraries, and settings) into containers, making them easy to run anywhere.

These containers are lightweight, fast to start, and consistent, so whether you run them on your laptop, a server, or in the cloud, the app behaves exactly the same. It simplifies the process of developing, testing, and deploying applications across different environments.

## How do we use Docker?

Our deployment system, called [Blocks](https://www.contensis.com/community/blog/introducing-blocks-a-new-way-to-build-headless-websites), is designed to work with Docker containers. The React Starter project is designed to work seamlessly with Docker containers. It includes configuration files (/docker/*.dockerfile) that provide Docker with step-by-step instructions for building and running the application.

When changes are pushed to the code repository (React Starter is pre-configured for GitLab), the system automatically builds a new Docker container reflecting the latest updates, making it ready for deployment without manual setup.

## Why do we use Docker?

Docker is essential to the infrastructure behind Blocks, offering consistent and reliable environments. This eliminates issues caused by differences in local setups like mismatched versions of Node.js and ensures that the project runs the same way in every environment, from local development to production deployment.

## Testing React Starter based apps locally

If you need to debug an issue that occurs **only** in production (e.g., on a Block), you can build and run your React application in Docker on your local machine. This setup mirrors the production environment, allowing you to troubleshoot with an identical version.

React Starter includes two shell scripts that simplify building and running the Dockerized app. These scripts are named `localbuild.sh` and `localrun.sh`.

Both scripts rely on a `.env` file for configuration, where the ALIAS and PROJECT variables determine the Docker image's name.

### Building & Running

1. Make sure Docker is running on your local machine.
2. Ensure your React app is **not** running so that [localhost:3001](http://localhost:3001) is available.
3. Navigate to your project directory.
4. In your terminal, execute `./localbuild.sh` and follow the prompts.
    1. After the build completes, open the Docker app and go to the **Images** tab. You should see your project image named using the `ALIAS-PROJECT` format (a).
5. In the terminal, run `./localrun.sh`.
6. Open [http://localhost:3001](http://localhost:3001/) to access your app, now running inside a Docker container.
    1. While the app is running, you can check the **Containers** tab in the Docker app, where you'll find the container running under a randomly generated name (b).

### Container Options

The Docker application's GUI offers several options for managing and interacting with containers.

#### Accessing the Container Terminal

While a container is running, you can open a terminal inside it to inspect files or check the Node.js version. In the **Actions** column of the Docker GUI, use the three-dots menu next to the active container and select **Open in Terminal**. This gives you access to the container's internal terminal.

#### Stopping a Container

In some cases, the Docker container might not stop when using `CTRL/CMD + C` in the terminal after running `localrun.sh`. If this happens, you can stop the container directly from the Docker GUI. Navigate to the **Containers** tab, locate the active container (indicated by green text and a **RUNNING** status), and click **STOP** to terminate it.