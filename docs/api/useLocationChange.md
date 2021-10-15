---
title: "useLocationChange"
permalink: /use-location-change/
nav_order: 10
---

# `useLocationChange`

This hook invokes a setter whenever the page location is updated.

## API

```typescript
export function useLocationChange(
  setFn: (path: string) => any,
  options?: {
    inheritBasePath: boolean
    basePath: string
    isActive: () => boolean | boolean
    onInitial?: boolean
  }
): void
```

**Note**: `options.inheritBasePath` defaults to `true` (even if `options` is not provided), and takes precedence over `options.basePath` if `true`. If no BasePath is in the context to inherit `options.basePath` will be used as a fallback, if present. If `basePath` is provided, either by parameter or by context, and is missing from the current path `null` is sent to the `setFn` callback.

By default this hook will not run on the initial mount for the component. You can get the location on the first render (mount) by setting `onInitial: true` in the `options` argument.

## Basic

The first parameter is a setter-function that is invoked with the new path whenever the url is changed. It does not automatically cause a re-render of the parent component (see _re-rendering_ below).

```jsx
import { useLocationChange } from 'raviger'
import { pageChanged } from './monitoring'

function App () {
  useLocationChange(pageChanged)

  return (
    // ...
  )
}
```

You should try to provide the same function (referential-equality) to `useLocationChange` whenever possible. If you are unable to create the function outside the component scope use [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback) to get a memoized function.

```jsx
import { useCallback } from 'react'
import { useLocationChange } from 'raviger'
import { pageChanged } from './monitoring'

function App () {
  const onChange = useCallback(path => pageChanged('App', path), [])
  useLocationChange(onChange)

  return (
    // ...
  )
}
```

## Conditional Updates

When `options.isActive` is both **defined** and **falsey** the `setFn` will not be invoked during location changes. If it is **undefined** or **truthy** the `setFn` will be invoked.

## Re-rendering

**useLocationChange** does not itself cause re-rendering. If you are trying to get the current path in your component that is better done with the [usePath](/api/link) hook, which returns the value. However, it is possible to trigger re-rendering by combining **useLocationChange** with **useState**.

```jsx
import { useState } from 'react'
import { useLocationChange } from 'raviger'

function Route () {
  const [path, setPath] = useState('/')
  useLocationChange(setPath)

  return (
    // ...
  )
}
```
