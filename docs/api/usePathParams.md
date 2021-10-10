---
title: "usePathParams"
permalink: /use-path-params/
nav_order: 8
---

# usePathParams

A hook for extracting the path parameters from a path or array of paths. It uses the same path-matching syntax, as well as the `basePath` and `matchTrailingSlash` options, as [useRoutes](/use-routes).

In most use cases `useRoutes` is a better way to provide components with their path parameters as it centralizes the routing knowledge in your application and reduces the dependency of individual pages on the url structure. `usePathParams` also does not establish React Contexts for `usePath` and `useBasePath` like `useRoutes` does; it is not a *routing* hook, it is a *path* hook.

```ts
function usePathParams<T extends Record<string, unknown>>(route: string, options?: PathParamOptions): [boolean, T | null]
function usePathParams<T extends Record<string, unknown>>(routes: string[], options?: PathParamOptions): [string, T] | [null, null]

interface PathParamOptions {
  basePath?: string
  matchTrailingSlash?: boolean
}
```

> If no `basePath` is provided the hook will inherit it from the context of any active `useRoutes` ancestor.

## Matching a single path

When called with a string as the first parameter `usePathParams<T>` returns `[didMatch: boolean, props: T | null]`.

* `didMatch` indicates whether the path matched the current URL
* `props` is `null` when the path did not match, and an object containing the URL props when the path did match.

```tsx
function NavBar () {
  const [isUser, props] = usePathParams('/user/:userId')

  return {
    <>
      <Link href="/contact">Contact</Link>
      { isUser && <UserProfile id={props.userId}>}
    </>
  }
}
```

## Matching an array of paths

When called with an array of strings as the first parameter `usePathParams<T>` returns an array of either `[null, null]` when no path matched, or `[path: string, props: T]` when a match was found

```tsx
function NavBar () {
  const [path, props] = useMatch(['/', '/user/:userId'])

  return {
    <>
      <Link href="/contact">Contact</Link>
      { path !== '/' && <Link href="/home">Go Back</Link>}
      { path === '/user/:userId' && <UserProfile id={props.userId}>}
    </>
  }
}
```