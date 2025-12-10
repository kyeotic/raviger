---
title: "useRedirect"
permalink: /use-redirect/
nav_order: 2
---

# `useRedirect`

This hook causes a browser redirect to occur if its `predicateUrl` matches.

## API

```typescript
export function useRedirect(
  predicateUrl: string,
  targetUrl: string,
  options?: {
    query?: QueryParam | URLSearchParams
    replace?: boolean
    merge?: boolean
    state?: unknown
  }
): void
```

## Basic

If `predicateUrl` is the current path, redirect to the `targetUrl`. `queryObj` is optional, and uses the same serializer that `useQueryParams` uses by default. If `replace` (default: true) it will replace the current URL (back button will skip the `predicateUrl`). If `merge` is true the `query` will be merged with the current url query. `state` is optional, and can be used to set the page's state in the history stack.

See [navigate()](/api/navigate) for more details on this function's paramaters. `useRedirect()` calls `navigate()` internally.

```jsx
import { useRedirect } from 'raviger'

function Route () {
  // Will redirect to '/new' if current path is '/old'
  useRedirect('/old', '/new', { query: { name: 'kyeotic' } })
  return <span>Home</span>
}
```

