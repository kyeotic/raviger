---
title: "useNavigate"
permalink: /use-navigate/
nav_order: 5
---

A hook for imperative route changes that include any configured `basePath`

## API

```typescript
type NavigateWithReplace = (url: string, replace?: boolean) => void;
type NavigateWithQuery = (url: string, query?: URLSearchParams, replace?: boolean) => void;

export function useNavigate(optBasePath?: string): NavigateWithReplace & NavigateWithQuery;
```

The function returned by `useNavigate` has the same signature as the non-hook [navigate function](/api/navigate).  The only difference is that this function considers the `basePath` when navigating.

## Basic

```jsx
import { useRoutes, useNavigate } from 'raviger'

function Home () {
  const navigate = useNavigate()

  // pathname will be /app/about after navigation
  return <button onClick={() => navigate('/about')}>about</button>
}

function About () {
  const navigate = useNavigate()

  // pathname will be /app/ after navigation
  return <button onClick={() => navigate('/')}>home</button>
}

const routes = {
  '/': () => <Home />
  '/about': () => <About />
}

export default function App() {
  return useRoutes(routes, { basePath: '/app' })
}
```

## Outside a Router

If the `useNavigate` hook is used inside a router context (there is a `useRoutes` in its parent heirarchy), the `basePath` will be inherited.  If the hook is used outside a router context, or if you want to override the `basePath`, you can call the `useNavigate` hook with an `optBasePath` argument.

## Query Params and Replacing State

As with the non-hook `navigate` function, the function returned by `useNavigate` can be called with query params or with a boolean indicating whether to replace the current history entry rather than adding to the history.
