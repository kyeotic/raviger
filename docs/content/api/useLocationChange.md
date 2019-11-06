---
title: "useLocationChange"
date: 2019-11-05T09:44:14-08:00
weight: 10
---


This hook invokes a setter whenever the page location is updated.

## API

{{< highlight typescript >}}
export function useLocationChange(
  setFn: (path: string) => any,
  options?: {
    inheritBasePath: boolean
    basePath: string
    isActive: () => boolean | boolean
  }
): void
{{< /highlight >}}

**Note**: `options.inheritBasePath` is treated as `true` unless it is set to `false` (even if `options` is not provided), and takes precedence over `options.basePath` if `true`.

## Basic

The first paramter is a setter-function that is invoked with the new path whenever the url is changed. It does not automatically cause a re-render of the parent component (see _re-rendering_ below).

{{< highlight jsx>}}
import { useLocationChange } from 'raviger'
import { pageChanged } from './monitoring'

function App () {
  useLocationChange(pageChanged)

  return (
    // ...
  )
}
{{< /highlight>}}

You should try to provide the same function (referential-equality) to **useLocationChange** whenever possible. If you are unable to create the function outside the component scope use **useCallback** to get a memoized function.

{{< highlight jsx>}}
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
{{< /highlight>}}

## Conditional Updates

When `options.isActive` is both **defined** and **falsey** the `setFn` will not be invoked during location changes. If it is **undefined** or **truthy** `setFn` will be invoked.

## Re-rendering

**useLocationChange** does not itself cause re-rendering. If you are trying to get the current path in your component that is better done with the [usePath](/api/link) hook, which returns the value. However, it is possible to trigger re-rendering by combining **useLocationChange** with **useState**.

{{< highlight jsx>}}
import { useState } from 'react'
import { useLocationChange } from 'raviger'

function Route () {
  const [path, setPath] = useState('/')
  useLocationChange(setPath)

  return (
    // ...
  )
}
{{< /highlight>}}
