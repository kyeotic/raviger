---
title: "useRoutes"
permalink: /use-routes/
nav_order: 1
---

# `useRoutes`

This hook is the main entry point for an application using raviger. Returns the result of matching against a route (wrapped in a [RouterProvider]/router-provider), or `null` of no match was found.

## API

```typescript
function useRoutes(
  routes: { [key: string]: (props: { [k: string]: any }) => JSX.Element }
   | { path: string, fn: (props: { [k: string]: any }) => JSX.Element },
  options?: {
    basePath?: string
    routeProps?: { [k: string]: any }
    overridePathParams?: boolean // default true
    matchTrailingSlash?: boolean // default true
  }
): JSX.Element
```

## Basic

The first parameter is an object of path keys whose values are functions that return a **ReactElement** (or null when no match is found). The paths should start with a forward-slash `/` and then contain literal matches (`/base`), path variables (`/:userId`, in the format `: + [a-zA-Z_]+`), and a `*` for catch-all wildcards. Path variables will be provided to the matching route-function.

```jsx
import { useRoutes, Link } from 'raviger'

const routes = {
  '/': () => <Home />,
  '/about': () => <About />,
  '/users/:userId': ({ userId }) => <User id={userId} />
}

function NavBar () {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/users/1">Tom</Link>
      <Link href="/users/2">Jane</Link>
    </div>
  )
}

export default function App() {
  let route = useRoutes(routes)
  return (
    <div>
      <NavBar />
      {route}
    </div>
  )
}
```

If `matchTrailingSlash` is true (which it is by default) a route with a `/` on the end will still match a defined route without a trialing slash. For example, `'/about': () => <About />` would match the path `/about/`. If `matchTrailingSlash` is false then a trailing slash will cause a match failure unless the defined route also has a trailing slash.

## Using a Base Path

The `basePath` option sets a base path that causes all routes to match as if they had the base path prepended to them. It also sets the base path on the router's context, making it available to hooks and `<Link>` components lower in matching *route's* tree. If `basePath` is provided and missing from the current path `null` is returned.

```jsx
import { useRoutes } from 'raviger'

const routes = {
  '/': () => <Home />,
  '/about': () => <About />,
  '/users/:userId': ({ userId }) => <User id={userId} />
}

export default function App() {
  // For the path "/app/about" the <About> route will match
  let route = useRoutes(routes, { basePath: 'app' })
  return (
    <div>
      {route}
    </div>
  )
}
```

## Sharing Props with routes

The `routeProps` option can be used to pass data to the matching route. This is useful for sharing props that won't appear in the route's path, or reducing duplication in path parameter declarations.

```jsx
import { useRoutes } from 'raviger'

const routes = {
  '/': ({ title }) => <Home title={title} />,
  '/about': ({ title }) => <About />
}

export default function App() {
  let route = useRoutes(routes, { routeProps: { title: 'App' } })
  return (
    <div>
      {route}
    </div>
  )
}
```

This can be combined with the `overridePathParams` option to provide a value that is used even if a path parameter would match for the route. In the below example if `maybeGetUserId` returns an ID it will be provided to the `<User>` component instead of the value from the path, otherwise the route param will be used.

```jsx
import { useRoutes } from 'raviger'

const routes = {
  '/': () => <Home />,
  '/about': () => <About />,
  '/users/:userId': ({ userId }) => <User id={userId} />
}

export default function App() {
  let  userId = maybeGetUserId()
  let route = useRoutes(routes, { routeProps: { userId }, overridePathParams: true })
  return (
    <div>
      {route}
    </div>
  )
}
```

## Using an Array to Control Priority

Raviger will normally match routes in the order they are defined in the routes object, allowing you to control matching priority. However, this behavior is not guaranteed by JS, and if you dynamically construct routes you may have difficulty ordering object keys.

For this case, raviger supports taking an array of `{ path, fn }` objects, where the priority is determined by position in the array.

Consider this case:

```javascript
{
  '/comp1/*': () => <h1>Just Comp-1</h1>,
  '/comp1/view2/*': () => <h1>Comp-1-view-2</h1>,
  '/comp1/view1/*': () => <h1>Comp-1-view1</h1>,
  '/comp2/*': () => <h1>Comp-2</h1>
}
```

If the app tries to route to /comp1/view1, instead of matching route /comp1/view1/* it matches /comp1/*. This can be fixed if we define the routes like this

```javascript
[

  { path: '/comp1/view2/*', fn:() => <h1>Comp-1-view-2</h1>, },
  { path: '/comp1/view1/*', fn:() => <h1>Comp-1-view1</h1>, },
  { path: '/comp1/*', fn:() => <h1>Just Comp-1</h1>, },
  { path: '/comp2/*', fn:() => <h1>Comp-2</h1> },
]
```