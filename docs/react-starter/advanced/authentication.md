---
sidebar_position: 1
---

# Authentication

CRB affords two forms of Authentication:

- Contensis-based
- Azure-based SSO (WSFED)

:::tip
The latest version of Contensis React Base is recommended whenever configuring a project for any form of authorised routing. 
:::

## Contensis-based login

Contensis-based authentication allows users to log in using their Contensis accounts. This approach requires a custom login page, and using React hooks from Contensis React Base helps simplify the implementation. When a user accesses a protected route, they are redirected to this login page. After successful authentication, they’re automatically returned to their original destination.

### Define Authorised Groups

Access control is based on group membership. Define which groups are allowed access to protected routes.

- Group **name** and **ID** can be found in:
    
    *Contensis → Settings → Groups*
    
- Group **ID** is in the URL of the group settings page.

```tsx
export const authorisedGroups = [
  {
    name: 'Group Name',
    id: 'uuid',
  },
];
```

### Define protected routes

Use `requireLogin` to restrict access to specific routes.

- Supports both `staticRoutes` and `contentTypeRoutes`.
- You can assign different groups to different routes.

```tsx
  {
    path: '/',
		...
    requireLogin: authorisedGroups,
  },
```

### Setup login page

To enable login functionality, a login page must be created. This page should include a form that triggers the `useLogin` hook upon submission. The hook's response will provide the current authentication status and handle the login process.

This example shows the **basic setup** for getting a login page working. It does **not** cover error handling or validation states, but these can be added later for a more robust implementation.

```tsx title="Sample login.tsx page"
import React, { FormEvent } from 'react';
import { useLogin } from '@zengenti/contensis-react-base/user';

/**
 * A React functional component that renders a login form.
 * - If the user is not authenticated, it displays a form with fields for username and password.
 * - If the user is authenticated, it displays a message showing the logged-in user's email.
 */
const Login = () => {
  /**
   * Uses the `useLogin` hook to manage authentication state and actions.
   */
  const { isAuthenticated, loginUser, user } = useLogin();

  /**
   * Handles the form submission event, preventing the default behavior and extracting
   * the username and password values from the form. It then calls the `loginUser` function
   * with the extracted credentials.
   */
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;
    loginUser(username, password);
  };

  return (
    <div className="login-form">
      {!isAuthenticated ? (
        <>
          <h1>Login</h1>
          <form onSubmit={e => handleSubmit(e)}>
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" required />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" required />
            </div>
            <button type="submit">Submit</button>
          </form>
        </>
      ) : (
        <p>
          Logged in as <strong>{user?.email}</strong>
        </p>
      )}
    </div>
  );
};

export default Login;
```

### Define the Login Route

Once the login page is created, you need to define a route for it. By default, CRB (Contensis React Base) uses the `/account/login` path for login pages. To ensure the page is accessible, you should define this route in your application's routing configuration.

```tsx title="A static route for the login"
{
	path: '/account/login',
	component: Login,
}
```

<aside>

:::tip
You can access detailed information about the authentication state and the currently authenticated user from the **user state** within the Redux store. 
:::

</aside>

### Setup error page

Ensure your app can handle failed logins or unauthorized access.

The system will automatically redirect unauthenticated users or users lacking permissions to an **Access Denied** page.

You must define this route in your routing configuration and ensure the node and renderer is in place for Blocks-based sites.

```tsx title="A static route for the access denied page"
{
	path: '/account/access-denied',
	component: myErrorPage,
}
```

## Azure-based SSO (WSFED)

WS-Federation (WSFED) enables seamless authentication via Azure Active Directory without a custom login page. When a user accesses a protected route, they are redirected to the Azure SSO login portal. Upon successful authentication, they’re sent back to the original route.

### Configure environment variables

To enable WSFED login, set the following environment variable:

```bash
WSFED_LOGIN=TRUE
```

Ensure the variable is included in `define-config.js`, which exposes these values to your application.

```tsx
const {
  ...
  WSFED_LOGIN,
} = process.env;

/** Optionally the values can be set for development/production respectively
	* WSFED_LOGIN: boolean;
	*/
const development = {
  WSFED_LOGIN,
  ...
};

const production = {
	WSFED_LOGIN,
	...
};
```

**Note**: Any change to `.env` or `define-config.js` requires restarting the app.

### Define Authorised Groups

Access control is based on group membership. Define which groups are allowed access to protected routes.

- Group **name** and **ID** can be found in:
    
    *Contensis → Settings → Groups*
    
- Group **ID** is in the URL of the group settings page.

```tsx
export const authorisedGroups = [
  {
    name: 'Group Name',
    id: 'uuid',
  },
];

```

### Define protected routes

Use `requireLogin` to restrict access to specific routes.

- Supports both `staticRoutes` and `contentTypeRoutes`.
- You can assign different groups to different routes.

```tsx
  {
    path: '/',
		...
    requireLogin: authorisedGroups,
  },
```

<aside>
💡

You can access detailed information about the authentication state and the currently authenticated user from the **user state** within the Redux store. 

</aside>

### Setup error pages

Ensure your app can handle failed logins or unauthorized access.

The system will automatically redirect unauthenticated users or users lacking permissions to an **Access Denied** page.

You must define this route in your routing configuration and ensure the node and renderer is in place for Blocks-based sites.

```tsx title="A static route for the access denied page"
{
	path: '/account/access-denied',
	component: myErrorPage,
}
```

## Legacy project considerations

Old CRB based projects may include reference to `oidc`, it’s important to remove these package references when working with CRB 3.1+:

- Look for `oidc` or `oidc-client` usage.
- These should **not** be listed under Webpack `externals`.
- They also should **not** be installed via your `package.json`. It’s okay if they exist in `package-lock.json`.

Check your Webpack config:

```tsx
module.exports = {
	...
	externals: ['oidc-client'], // ❌ Remove this if present
}
```

## Hooks reference

Contensis React Base affords the following hooks for authentication.

### useLogin

| **Property / Method** | **Type** | **Description** |
| --- | --- | --- |
| `loginUser(username, password)` | `function` | Logs in a user with the provided username and password. |
| `logoutUser(redirectPath?)` | `function` | Logs out the current user. Optionally accepts a redirect path to navigate after logout. |
| `errorMessage` | `string` | Authentication-related error message, if any. |
| `isAuthenticated` | `boolean` | Indicates whether the user is currently authenticated. |
| `isAuthenticationError` | `boolean` | Indicates if an authentication-specific error has occurred. |
| `isError` | `boolean` | Indicates if a general error has occurred. |
| `isLoading` | `boolean` | Indicates if an authentication-related operation is currently in progress. |
| `user` | `object` | The currently authenticated user's information. |

The following properties on `useLogin` are deprecated:

| **Deprecated Property** | **Use Instead** |
| --- | --- |
| `authenticationError` | `isAuthenticationError` |
| `authenticationErrorMessage` | `errorMessage` |
| `error` | `isError` |

### useRegistration

| **Property / Method** | **Type** | **Description** |
| --- | --- | --- |
| `registerUser(user, mappers)` | `function` | Dispatches the user registration action with provided user data and optional mappers. |
| `error` | `any` | The error state from the user registration process, if any. |
| `isLoading` | `boolean` | Indicates whether the registration process is currently in progress. |
| `isSuccess` | `boolean` | Indicates whether the registration process completed successfully. |
| `user` | `object` | The registered user data retrieved from the state after a successful registration. |

### useForgotPassword

| **Property / Method** | **Type** | **Description** |
| --- | --- | --- |
| `isLoading` | `boolean` | Indicates if the password reset request is currently being sent. |
| `isSuccess` | `boolean` | Indicates if the password reset request was successfully sent. |
| `error` | `object | null` | Contains error information if the password reset request failed. |
| `requestPasswordReset(userEmailObject)` | `function` | Dispatches an action to request a password reset using the provided user email object. |
| `setNewPassword` | `object` | See below. |

#### setNewPassword object

| **Property / Method** | **Type** | **Description** |
| --- | --- | --- |
| `setNewPassword.queryString` | `string` | The current query string from the state (usually includes token info). |
| `setNewPassword.isLoading` | `boolean` | Indicates if the reset password request is currently being sent. |
| `setNewPassword.isSuccess` | `boolean` | Indicates if the reset password request was successfully sent. |
| `setNewPassword.error` | `object | null` | Contains error information if the reset password request failed. |
| `setNewPassword.submit(resetPasswordObject)` | `function` | Dispatches an action to reset the password using the provided object. |

### useChangePassword

| **Property / Method** | **Type** | **Description** |
| --- | --- | --- |
| `isLoading` | `boolean` | Indicates if the change password request is in progress. |
| `isSuccess` | `boolean` | Indicates if the change password request was successful. |
| `userId` | `string` | The unique identifier of the current user. |
| `isLoggedIn` | `boolean` | Indicates if the user is currently authenticated. |
| `error` | `string | null` | The error message, if any, from the change password request. |
| `changePassword(userId, currentPassword, newPassword)` | `function` | Dispatches an action to change the user's password. Takes `userId`, `currentPassword`, and `newPassword` as parameters. |