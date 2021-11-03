---
title: "usePathParams"
permalink: /use-path-params/
nav_order: 8
---

# usePathParams

A hook for extracting the path parameters from a path or array of paths. It uses the same path-matching syntax, as well as the `basePath` and `matchTrailingSlash` options, as [useRoutes](/use-routes).

In most use cases `useRoutes` is a better way to provide components with their path parameters as it centralizes the routing knowledge in your application and reduces the dependency of individual pages on the url structure. `usePathParams` also does not establish React Contexts for `usePath` and `useBasePath` like `useRoutes` does; it is not a *routing* hook, it is a *path* hook.

```ts
// This is a simplified type contract, the real one is quite complex
// It is not valid, but it concisely conveys the real input and ouput types 
function usePathParams<T extends string | string[]>(
  routes: T,
  options?: PathParamOption
): T extends string[] ? [string, ExtractPathParams<T[keyof T]>] : ExtractPathParams<T>

interface PathParamOptions {
  basePath?: string
  matchTrailingSlash?: boolean
}
```

> If no `basePath` is provided the hook will inherit it from the context of any active `useRoutes` ancestor.

* `basePath`: Override the `basePath` from the context, if any is present. (`'/'` can be used to clear any inherited `basePath`)
* If `matchTrailingSlash` is true (which it is by default) a route with a `/` on the end will still match a defined route without a trialing slash. For example, `'/about': () => <About />` would match the path `/about/`. If `matchTrailingSlash` is false then a trailing slash will cause a match failure unless the defined route also has a trailing slash.

## Matching a single path

When called with a single path pattern `usePathParams` returns either `null`, if the path didn't match, or an object with the extracted path parameters, if the path did match.

```tsx
// with path = /home
const props = useMatch('/users') // props === null

// with path = /users
const props = useMatch('/users') // props === {}

// with path = /users/tester
const props = useMatch('/users/:userId') // props === { userId: 'tester' }
```

## Matching multiple paths

When called with an array of path patterns `usePathParams` returns `[null, null]`, if the path didn't math, or `[string, ExtractPathParams<T[keyof T]>]`, if the path did match. The path-matching return is the literal path-pattern that matched and the extracted path parameters.

```tsx
// with path = /home
const [path, props] = useMatch(['/users']) // [null, null]

// with path = /users
const [path, props] = useMatch(['/users']) // ['/users', {}]

// with path = /users/tester
const [path, props] = useMatch('/users/:userId') // ['/users/:userId', { userId: 'tester' }]
```

## Community Contributions

The `props` returned from either mode are strongly typed using the parameter names of the input. If you are using typescript you can get type checking by discriminating the `null` value, or the `path` when using the array input.

```ts
const params = usePathParams([
  "/groups",
  "/groups/:groupId",
]);

if (params[0] === "/groups") {
  const props = params[1]; // {}
}
if (params[0] === "/groups/:groupId") {
  const props = params[1]; // { groupId: string }
}
```

These typescript typings were contributed by [zoontek](https://github.com/kyeotic/raviger/pull/109#issuecomment-950228780). I am incredibly grateful for them.

