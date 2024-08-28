---
sidebar_position: 1
---

# Custom Headers

To define custom headers in your React application, leverage the handleResponses parameter in the ZengentiAppServer configuration. The ZengentiAppServer, located in server.ts, acts as the Express server that serves your React app.

The handleResponses option provides access to the Express request, response, content, and send objects, allowing you to customize headers and manage responses effectively.

```jsx title="An example of how to set a surrogate-control header using a custom response handler"
const responseHandler = (
  request: any,
  response: any,
  content: any,
  send: keyof typeof ResponseMethod = 'send'
) => {
    // Set a surrogate-control header with a max-age of 60 seconds
    response.set({ 'surrogate-control': 'max-age=60' });
   // Send the content as a response using the specified method
    response[send](content);
};

// Starting the ZengentiAppServer with the custom response handler
ZengentiAppServer.start(
  ReactApp,
  {
    // Other server args...
    // Pass the custom response handler to handleResponses
    handleResponses: (request, response, content, send) =>
      responseHandler(request, response, content, send),
  }
);
```