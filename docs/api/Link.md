---
title: "Link"
permalink: /link/
nav_order: 3
---

A React component for rendering a `<a>` that uses *history* navigation for local URLs. Supports `ref` forwarding.

## API

```typescript
export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  basePath?: string
}
export const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>
```

## Basic

This component is the preferred method of navigation, alongside the **navigate** function.

This component takes all the same parameters as the built-in `<a>` tag. It's `onClick` will be extended to perform local navigation, and if it is inside a component returned from `useRoutes` it will have the provided `basePath` preprended to its `href`.

```jsx
<Link href="/foo">
  go to foo
</Link>
```

## BasePath

If a `<Link>` component is inside a router context (there is a `useRoutes` in its parent heirarchy) the `basePath` will be inherited. You can also provide a `basePath` as a `<Link>` prop, which will override an inherited one.

```jsx
import { useRoutes, Link } from 'raviger'

function Home () {
  return (
    <div>
      <Link href="/foo" /> {/* href = /app/foo */}
      <Link href="/foo" basePath="/bar" /> {/* href = /bar/foo */}
    </div>
  )
}

const routes = {
  '/': () => <Home />
}

export default function App() {
  return useRoutes(routes, { basePath: 'app' })
  )
}
```


## Ref Passing

`Link` supports the standard [forwardRef](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components) API.