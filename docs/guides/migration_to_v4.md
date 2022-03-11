---
title: "Migration Guide - v4"
permalink: /migraiton-to-v4/
nav_order: 99
---

# v4 Migration Guide

Raviger v4 comes with several high-impact breaking changes.

- **BREAKING**: `navigate` now has `options` object instead of overloads
- **BREAKING**: `useNavigate` uses updated `navigate` params
- **BREAKING**: `useLocationChange` now invokes the setter with a `RavigerLocation` object instead of the `path`

## navigate

The changes to `navigate` create a more readable API but require manual changes to migrate to. This guide will provide some find/replace regexs, but they do not account for calls that might be broken onto multiple lines. You will need to inspect every call to `navigate` in your app to ensure it is changed correctly.

Here are some sample migrations


```js
// Replace
/*
  find: navigate\((.+?)(, (true|false))\)
  replace: navigate($1, { replace: $3 })
*/
navigate('/path', true) // -> navigate('/path', { replace: true })
navigate('/path', false) // -> navigate('/path', { replace: false })

// Query
/*
  find: navigate\((.+?),\s?(\{.+?\})\)
  replace: navigate($1, { query: $2 })
*/
navigate('/path', { name: 'raviger' }) // -> navigate('/path', { query: { name: 'raviger' } })

// State
navigate('/path', undefined, undefined, { name: 'raviger'}) // -> navigate('/path', { state: { name: 'raviger' } })
```

The old `navigate` signature had complex combinations of overloads, so it is unlikely that simple substitutions will cover all the cases in even smaller applications. I'm sorry for the pain this change is going to cause, and doubly sorry because I already knew of the code smell of boolean arguments in functions with more than two parameters. I should have used an **options object** to begin with and I won't be making exceptions like this again.


## useLocationChange

Before v4 useLocationChange provided just the **path** to its `setFn`. It now provides a `window.location` like object that contains a `path` (and `pathname`, just to be consistent with `window.location`). While this new signature is strictly more useful, changes to your application can be avoided by adding a small utility method that emulates the previous behavior. You can replace all old usage of `useLocationChange` with this wrapper and be done.

```typescript
export function usePathChange(
  setFn: (path: string | null) => void,
  options: LocationChangeOptionParams = {}
): void {
  useLocationChange(
    useCallback((location: RavigerLocation) => setFn(location.path), [setFn]),
    options
  )
}
```