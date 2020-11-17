---
title: "useBasePath"
permalink: /use-base-path/
nav_order: 8
---

Get the `basePath` set by a parent `useRoutes` component (empty string if none)

## API

```typescript
export function useBasePath(): string
```

## Basic

```jsx
import { useRoutes, useBasePath } from 'raviger'

function Home () {
  let basePath = useBasePath()
  // Will be 'app' when render by the parent below
  return <span>{basePath}</span>
}

const routes = {
  '/': () => <Home />
}

export default function App() {
  return useRoutes(routes, { basePath: 'app' })
  )
}
```
