---
title: "navigate"
permalink: /navigate/
nav_order: 5
---

# `navigate`

This function causes programmatic navigation and causes all **raviger** hooks to re-render. Internally it used by the `<Link>` component.

## API

```typescript
export function navigate(url: string, replace?: boolean): void
export function navigate(
  url: string,
  query?: QueryParam | URLSearchParams,
  replace?: boolean,
  state?: unknown
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
  navigate(`/users/${user.id}`, true)
}
```

## Navigating with Query Params

To navigate with a serialized query string pass an object as the second parameter.

```jsx
import { navigate } from 'raviger'

export async function createUser () {
  let user = await createUser()
  navigate(`/users/${user.id}` { ref: 'create page' })
}
```

## Navigating with History State

By default the `state` is `null`. You can control the `state` passed to `history.pushState | history.replaceState` using the fourth parameter

```jsx
import { navigate } from 'raviger'

export async function createUser () {
  let user = await createUser()
  navigate(`/users/${user.id}`, undefined, undefined, { user: user })
}
```

## Detecting `navigate` events

`navigate` has two modes: intra-domain navigation and extra-domain navigation. When navigating outside the current origin navigation is done directly, and no `popstate` event is dispatched. When navigating to the current origin a custom `popstate` event is dispatched. The event has a `__tag: 'raviger:navigation'` property is attached to help programmatically distinguish these events from `popstate` events dispatched from other sources, such as the browser **back button**.