---
title: "useMatch"
permalink: /use-match/
nav_order: 7
---

# useMatch

A hook for detecting whether a provided path or array of paths is currently active. It uses the same path-matching syntax, as well as the `basePath` and `matchTrailingSlash` options, as [useRoutes](/use-routes).

This can be useful for implementing components that have route-conditional logic, such as Navigation Bars that hide menus on certain pages.

```ts
function useMatch(routes: string | string[], options?: PathParamOptions): string | null

interface PathParamOptions {
  basePath?: string
  matchTrailingSlash?: boolean
}
```

> If no `basePath` is provided the hook will inherit it from the context of any active `useRoutes` ancestor.

* `basePath`: Override the `basePath` from the context, if any is present. (`'/'` can be used to clear any inherited `basePath`)
* If `matchTrailingSlash` is true (which it is by default) a route with a `/` on the end will still match a defined route without a trialing slash. For example, `'/about': () => <About />` would match the path `/about/`. If `matchTrailingSlash` is false then a trailing slash will cause a match failure unless the defined route also has a trailing slash.

## Matching a single path

`useMatch` either returns `null` if the path-pattern does not match the current path, or it returns the matching path.

```tsx
function NavBar () {
  const match = useMatch('/home') // returns "/home"

  return {
    <>
      <Link href="/contact">Contact</Link>
      { !!match && <Link href="/home">Go Back</Link>}
    </>
  }
}
```

## Matching an array of paths

`useMatch` returns either `null` if none of them match the path, or it returns the matching path.

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