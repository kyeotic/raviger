---
title: "Redirect"
permalink: /redirect/
nav_order: 5
---

A React component for causing a browser redirect

## API

```typescript
export interface RedirectProps {
  to: string
  query?: QueryParam | URLSearchParams
  replace?: boolean
  merge?: boolean
}
export const Redirect: React.FC<RedirectProps>
```

## Basic

If rendered this component will force a redirect. Usefult as a route function

```jsx
import { useRoutes, Redirect } from 'raviger'

const routes = {
  '/': ({ title }) => <Home title={title} />,
  '/about': ({ title }) => <About />,
  '/redirect': () => <Redirect to='/about' />
}

export default function App() {
  let route = useRoutes(routes)
  return (
    <div>
      {route}
    </div>
  )
}
```

By default it will navigate with `replace` and `merge` both `true`.

## replace

If `replace` is `true` the redirect will not create a new entry in the history stack. `default = true`

## query

Provide an object or URLSearchParams to be appended to the `url`. Will be merged over the current query values if `merge: true`

## merge

If `merge` is `true` the redirect will use existing `location.hash` and `location.query` values. Useful for rewriting URLs without losing their intended state. `default = true`