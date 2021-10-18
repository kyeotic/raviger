---
title: "RouterProvider"
permalink: /router-provider/
nav_order: 99
---

# STOP

This component exists for advanced use-cases. Most applications will be better of by using the [`useRoutes`](/use-routes) hook, which sets up this provider automatically.

# `RouterProvider`

This component provides the React Context providers for `useBasePath` and `usePath`. It is useful if your application is divided in such a way that putting `useRoutes` at the top is infeasible, or if your app doesn't use `useRoutes` at all.


```ts
function RouterProvider(props: {
  basePath?: string
  path?: string
  children?: React.ReactNode
}): JSX.Element
```

Both `basePath` and `path` can be safely omitted, leaving their default context values in place.

## Example

```ts
import { RouterProvider } from 'raviger'

function App() {
  return (
      <RouterProvider basePath={basePath} path={path}>
        { /* main content */}
      </RouterProvider>
    )
}

```