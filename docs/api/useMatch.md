---
title: "useMatch"
permalink: /use-match/
nav_order: 7
---

# useMatch

A hook for detecting whether a provided path or array of paths is currently active. It uses the same path-matching syntax, as well as the `basePath` and `matchTrailingSlash` options, as [useRoutes](/use-routes).

This can be useful for implementing components that have route-conditional logic, such as Navigation Bars that hide menus on certain pages.

```ts
function useMatch(route: string, options?: PathParamOptions): boolean
function useMatch(routes: string[], options?: PathParamOptions): string | null

interface PathParamOptions {
  basePath?: string
  matchTrailingSlash?: boolean
}
```

> If no `basePath` is provided the hook will inherit it from the context of any active `useRoutes` ancestor.

## Matching a single path

When called with a string as the first parameter `useMatch` returns a boolean if the current path matches

```tsx
function NavBar () {
  const isHome = useMatch('/home')

  return {
    <>
      <Link href="/contact">Contact</Link>
      { isHome && <Link href="/home">Go Back</Link>}
    </>
  }
}
```

## Matching an array of paths

When called with an array of strings as the first parameter `useMatch` returns either `null` if none of them match the path, or it returns the matching path.

```tsx
function Page () {
  const page = useMatch(['/', '/about'])

  return {
    <>
      <h1>{page === '/' ? 'Home' : page === '/about' ? 'About Us' : 'Default Title' } </h1>
    </>
  }
}
```