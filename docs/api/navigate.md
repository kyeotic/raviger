---
title: "navigate"
permalink: /navigate/
nav_order: 5
---

This function causes programmatic navigation and causes all **raviger** hooks to re-render. Internally it used by the `<Link>` component.

## API

```typescript
export function navigate(url: string, replace?: boolean): void
export function navigate(
  url: string,
  query?: QueryParam | URLSearchParams,
  replace?: boolean
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
