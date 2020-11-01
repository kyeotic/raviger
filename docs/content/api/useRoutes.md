---
title: "useRoutes"
weight: 1
date: 2019-09-27T15:06:34-07:00
---

This hook is the main entry point for an application using raviger.

## API

{{< highlight typescript >}}
function useRoutes(
  routes: { [key: string]: (props: { [k: string]: any }) => JSX.Element },
  options?: {
    basePath?: string
    routeProps?: { [k: string]: any }
    overridePathParams?: boolean
    matchTrailingSlash?: boolean
  }
): JSX.Element
{{< /highlight >}}



## Basic

The first parameter is an object of path keys whose values are functions that return a **ReactElement** (or null when no match is found). The paths should start with a forward-slash `/` and then contain literal matches (`/base`), path variables (`/:userId`), and a `*` for catch-all wildcards. Path variables will be provided to the matching route-function.

{{< highlight jsx >}}
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
{{< /highlight >}}

## Using a Base Path

The `basePath` option sets a base path that causes all routes to match as if they had the base path prepended to them. It also sets the base path on the router's context, making it available to hooks and `<Link>` components lower in matching *route's* tree. If `basePath` is provided and missing from the current path `null` is returned.

{{< highlight jsx >}}
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
{{< /highlight >}}

## Sharing Props with routes

The `routeProps` option can be used to pass data to the matching route. This is useful for sharing props that won't appear in the route's path, or reducing duplication in path parameter declarations.

{{< highlight jsx >}}
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
{{< /highlight >}}

This can be combined with the `overridePathParams` option to provide a value that is used even if a path parameter would match for the route. IN this example if `maybeGetUserId` returns an ID it will be provided to the `<User>` component instead of the value from the path.

{{< highlight jsx >}}
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
{{< /highlight >}}

