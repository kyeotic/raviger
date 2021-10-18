---
title: "useRoutes"
permalink: /use-routes/
nav_order: 1
---

# `useRoutes`

This hook is the main entry point for an application using raviger.

## API

```typescript
function useRoutes(
  routes: { [key: string]: (props: { [k: string]: any }) => JSX.Element },
  options?: {
    basePath?: string
    routeProps?: { [k: string]: any }
    overridePathParams?: boolean // default true
    matchTrailingSlash?: boolean // default true
    excludeProviders?: boolean // default false
  }
): JSX.Element
```

## Basic

The first parameter is an object of path keys whose values are functions that return a **ReactElement** (or null when no match is found). The paths should start with a forward-slash `/` and then contain literal matches (`/base`), path variables (`/:userId`), and a `*` for catch-all wildcards. Path variables will be provided to the matching route-function.

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

## Custom Route Results

It is possible to supply routes that return _anything_. By default any match will be wrapped in React Context providers for BasePath and Path, but you can change this with the [`excludeProviders`](#excludeProviders) option. Doing so will make any result safe to invoke by `useRoutes`, allowing for some special use-cases.

```js
const match = useRoutes({
  // The returned data could be anything!
  "/foo": () => ({ element: <Foo />, useSpecialLayout: true }),
  "/bar": () => ({ element: <Bar />, useSpecialLayout: false }),
  "/baz": () => ({ element: <Baz />, useSpecialLayout: false }),
}, { excludeProviders: true });
```

To make this work with typescript there is a generic overload for `useRoutes` that takes uses the generic-type as the return type from the function. Here is a working example

```ts
import { useRoutes, CustomRoutes } from 'raviger'

interface RouteResult {
  element: ReactNode
  useSpecialLayout: boolean
}
const routes = {
  // The returned data could be anything!
  "/foo": () => ({ element: <Foo />, useSpecialLayout: true }),
  "/bar": () => ({ element: <Bar />, useSpecialLayout: false }),
  "/baz": () => ({ element: <Baz />, useSpecialLayout: false }),
} as CustomRoutes<RouteResult>

const match = useRoutes<RouteResult>(routes, { excludeProviders: true });
```

## excludeProviders

By default `useRoutes` returns either `null` for no match or the provided route-function-result wrapped in React Context providers for BasePath and Path. If you don't want these providers, perhaps because you are using [custom route results](#custom-route-results), you can omit them by setting `excludeProviders: true`