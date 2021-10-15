---
title: "usePathParams"
permalink: /use-path-params/
nav_order: 8
---

# usePathParams

A hook for extracting the path parameters from a path or array of paths. It uses the same path-matching syntax, as well as the `basePath` and `matchTrailingSlash` options, as [useRoutes](/use-routes).

In most use cases `useRoutes` is a better way to provide components with their path parameters as it centralizes the routing knowledge in your application and reduces the dependency of individual pages on the url structure. `usePathParams` also does not establish React Contexts for `usePath` and `useBasePath` like `useRoutes` does; it is not a *routing* hook, it is a *path* hook.

```ts
function usePathParams<T extends Record<string, unknown>>(
  routes: string | string[],
  options?: PathParamOption
): [string, T] | [null, null]

interface PathParamOptions {
  basePath?: string
  matchTrailingSlash?: boolean
}
```

> If no `basePath` is provided the hook will inherit it from the context of any active `useRoutes` ancestor.

* `basePath`: Override the `basePath` from the context, if any is present. (`'/'` can be used to clear any inherited `basePath`)
* If `matchTrailingSlash` is true (which it is by default) a route with a `/` on the end will still match a defined route without a trialing slash. For example, `'/about': () => <About />` would match the path `/about/`. If `matchTrailingSlash` is false then a trailing slash will cause a match failure unless the defined route also has a trailing slash.

## Matching paths

`usePathParams` accepts either a single string or an array of strings as the first parameter. In either case it returns an array of either `[null, null]` when no path matched, or `[path: string, props: T]` when a match was found.

* `path` is `null` when the path did not match, and the path-pattern string when the path did match.
* `props` is `null` when the path did not match, and an object containing the URL props when the path did match.

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