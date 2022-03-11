---
title: "navigate"
permalink: /navigate/
nav_order: 5
---

# `navigate`

This function causes programmatic navigation and causes all **raviger** hooks to re-render. Internally it used by the `<Link>` component.

## API

```typescript
export function navigate(
  url: string,
  options?: {
    /**
     * Use a `replace` instead of `push` for navigation
     * @default false */
    replace?: boolean
    /** Values to serialize as a querystring, which will be appended to the `url` */
    query?: QueryParam | URLSearchParams
    /**  value to pass as the state/data to history push/replace*/
    state?: unknown
  }
): void
```

**Note**: `navigate` does not consider any `basePath` that may be set.  The `useNavigate` hook should be used if you want to prepend the `basePath` to the URL when navigating.

## Basic

the `navigate` function is intended to be used outside of components to perform page navigation programmatically. 

```jsx
import { navigate } from 'raviger'

export async function createUser () {
  let user = await createUser()
  navigate(`/users/${user.id}`)
}
```

Normal navigation adds an entry to the browsers **history** stack, enabling the **back button** to return to the previous location. To instead change the page without adding to the history stack use the `replace` option. This is sometimes desirable when creating objects as the creation-page form may no longer be a valid location

```jsx
import { navigate } from 'raviger'

export async function createUser () {
  let user = await createUser()
  navigate(`/users/${user.id}`, { replace: true })
}
```

## Navigating with Query Params

To navigate with a serialized query string pass an object to the `query` option.

```jsx
import { navigate } from 'raviger'

export async function createUser () {
  let user = await createUser()
  navigate(`/users/${user.id}`, { query: { ref: 'create page' }})
}
```

## Navigating with History State

By default the `state` is `null`. You can control the `state` passed to `history.pushState | history.replaceState` using the `state` option.

```jsx
import { navigate } from 'raviger'

export async function createUser () {
  let user = await createUser()
  navigate(`/users/${user.id}`, { state: { user: user } })
}
```

## Detecting `navigate` events

`navigate` has two modes: intra-domain navigation and extra-domain navigation. When navigating outside the current origin navigation is done directly, and no `popstate` event is dispatched. When navigating to the current origin a custom `popstate` event is dispatched. The event has a `__tag: 'raviger:navigation'` property is attached to help programmatically distinguish these events from `popstate` events dispatched from other sources, such as the browser **back button**.