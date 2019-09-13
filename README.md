# raviger

![Bundlephobia  minified](https://badgen.net/bundlephobia/min/raviger)
![Bundlephobia gzip + minified](https://badgen.net/bundlephobia/minzip/raviger)
![Build](https://github.com/kyeotic/raviger/workflows/Tests/badge.svg)


**R**eact N**avig**at**or**. A React hook-based router that updates on **all** url changes. Heavily inspired by [hookrouter](https://github.com/Paratron/hookrouter).

Zero dependencies. Tiny footprint.


# Installation

```
npm i raviger
```

# Quick Start

```jsx
import { useRoutes, Link, useQueryParams } from 'raviger'

const routes = {
  '/': () => <Home />,
  '/about': () => <About />,
  '/users/:userId': ({ userId }) => <User id={userId} />
}

export default function App() {
  let route = useRoutes(routes)
  return (
    <div>
      <div>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/users/1">Tom</Link>
        <Link href="/users/2">Jane</Link>
      </div>
      {route}
    </div>
  )
}
```

## Query Strings

```javascript
import { useQueryParams } from 'raviger'

function UserList ({ users }) {
  const [{ startsWith }, setQuery] = useQueryParams()

  return (
    <div>
    <label>
      Filter by Name
      <input value={startsWith || ''} onChange={(e) => setQuery({ startsWith: e.target.value})} />
    </label>
    {users.filter(u => !startsWith || u.name.startsWith(startsWith).map(user => (
      <p key={user.name}>{user.name}</p>
    )))}
    </div>
  )
}
```

### Custom Query Serialization

Its possible to override either the querystring *serializer*, *deserializer*, or both, by providing functions to `useQueryParams`. Use a custom wrapper hook to reuse throughout your application.

```javascript
import { useQueryParams } from 'raviger'
import qs from 'qs'

export function useCustomQuery() {
  return useQueryParams(qs.parse, qs.stringify)
}
```

## Navigation

The preferred method for navigation is the `<Link>` component, which uses all the same properties as the standard `<a>` element, and requires `href`. Internally `<Link>` uses `history.pushState` to ensure navigation without a page refresh. If you need to perform programmatic navigation raviger exports a `navigate` function.

Some routing libraries only trigger React component updates if navigation was triggered using specific methods, such as a specific instance of **history**. **raviger** listens for all `popstate` events and checks for changes. You can even have two isolated React instances on a page and URL changes will properly trigger **raviger** hooks.

# API

## **useRoutes**

This hook is the main entry point for raviger.

* **useRoutes(routeMap, { basePath, routeProps, overridePathParams }): Route**

The first parameter is an object of path keys whose values are functions that return a **ReactElement**. The paths should start with a forward-slash `/` and then contain literal matches (`/base`), path variables (`/:userId`), and a `*` for catch-all wildcards. 

### Options

* **basePath** a `basePath` that all routes must begin with, and all `Link`s in the sub-tree will be prepended with. This can be used for sites hosted at a base path, or for nested routers.
* **routeProps** additional props to pass to the matched route. They will be merged into any path parameters that are matched with the route.
* **overridePathParams** (_default: true_) If `true` **routeProps** will override path parameters of the same name when passed to the matched route. If `false` the path parameters will be override **routeProps** of the same name.

## **navigate**

This function causes programmatic navigation and cuases all raviger hooks to re-render. Internally it used by the `<Link>` component.

* **navigate(url, replace = false): void**

The url should be relative to the root, e.g. (`/some/path`). If the second parameter is truthy then `replaceState` will be used instead of `pushState`.

* **navigate(url, query, replace = false): void**

Navigate with a serialized query string. This will use `URLSearchParams` to serialize the `query` object. 

### Custom Query Serialization for Navigate

If you need to customize serialization, you can write a wrapper in your app like this one:

```javascript
import {navigate as nav} from 'raviger'
import qs from 'qs
export function navigate (path, query, replace) {
  return nav(path + '?' + qs.stringify(query)), replace)
}
```

## **usePath**

Hook to return the current path portion.

* **usePath(basePath): string**

Like `useRoutes` it takes a `basePath` that will be removed from the returned path if present. This hook will cause re-rendering anytime the URL is changed, either with `<Link>` components, `navigate` or the `setQueryParams` function returned from `useQueryParams`.

## **useBasePath**

Hook to return the basePath provided to any parent `useRoutes` components.

* **useBasePath(): string**

If no `useRoutes` parent component exists, or no `basePath` was provided, an empty string is returned.

## **useQueryParams**

This hooks, like `useState`, returns an array of `[queryParams, setQueryParams]` that contain the current deserialized query parameters and a setter function.

* **useQueryParams(parseFn, serializeFn): [queryParams, setQueryParams]**

The default parse and serialize functions utilized the browser built-in `URLSearchParams`. You can provide custom parse and serialize functions to control this behavior.

### **setQueryParams**

The second return value from **useQueryParams**, used to update the query string.

* **setQueryParams(newQueryParamsObj, replace = true)**

The first parameter takes an object that will be serialized into new query string parameters and sent to **navigate**. It will use the `serializeFn` provided to **useQueryParams**, or the default.

The second parameter, if provided as falsy, will *merge* the provided query paramters into the current query parameters. This is useful if you only want to update the provided values but keep the rest.

## **Link**

This component takes all the same parameters as the built-in `<a>` tag. It's `onClick` will be extended to perform local navigation, and if it is inside a component returned from `useRoutes` it will have the provided `basePath` preprended to its `href`.

## **useRedirect**

A redirect hook. 

* **useRedirect(predicateUrl, targetUrl, queryObj, replace)**

If `predicateUrl` is the current path, redirect to the `targetUrl`. `queryObj` is optional, and uses the same serializer that `useQueryParams` uses by default. If `replace` (default: true) it will replace the current URL (back button will skip the `predicateUrl`).