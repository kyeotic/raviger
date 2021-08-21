---
title: "useQueryParams"
permalink: /use-query-params/
nav_order: 6
---

A hook for reading and updating the query string parameters on the page. Updates on all URL changes. Returns an array that, much like React's own [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate), has a value and a setter function. The value is a parsed querystring object, and the setter takes an object that it will serialize into the query string.

## API


```typescript
export function useQueryParams(
  parseFn?: (query: string) => QueryParam,
  serializeFn?: (query: QueryParam) => string
): [QueryParam, (query: QueryParam, replace?: boolean) => void]
```

## Basic

The default parse and serialize functions utilize the browser's built-in `URLSearchParams`. You can provide custom parse and serialize functions to override this behavior.

```jsx
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

## Updating the Query with merge

The second return value from `useQueryParams` is a function that updates the query string. By default it overwrites the entire query, but it can merge with the query object by setting the second param to `{ replace: false }`.

```jsx
import { useQueryParams } from 'raviger'

function UserList ({ users }) {
  const [{ startsWith }, setQuery] = useQueryParams()
  return (
    <input value={startsWith || ''} onChange={(e) => setQuery({ startsWith: e.target.value}, { replace: false })} />
  )
}
```

The `replace: false` setting also preserves the `location.hash`. The intent should be thought of as updating only the part of the URL that the `setQuery` object describes.

> Warning: using `setQuery` inside of a `useEffect` (or other on-mount/on-update lifecycle methods) can result in unwanted navigations, which show up as duplicate entries in the browser history stack.

## Custom serialization and parsing

Its possible to override either the querystring *serializer*, *deserializer*, or both, by providing functions to `useQueryParams`. Use a custom wrapper hook to reuse throughout your application.

```javascript
import { useQueryParams } from 'raviger'
import qs from 'qs'

export function useCustomQuery() {
  return useQueryParams(qs.parse, qs.stringify)
}
```
