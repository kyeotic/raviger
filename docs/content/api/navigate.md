---
title: "navigate"
date: 2019-09-30T18:25:04-07:00
weight: 5
---

This function causes programmatic navigation and causes all **raviger** hooks to re-render. Internally it used by the `<Link>` component.

## API

{{< highlight typescript>}}
export function navigate(url: string, replace?: boolean): void
export function navigate(
  url: string,
  query?: QueryParam | URLSearchParams,
  replace?: boolean
): void
{{< /highlight >}}

## Basic

the `navigate` function is intended to be used outside of components to perform page navigation programmatically. 

{{< highlight jsx>}}
import { navigate } from 'raviger'

export async function createUser () {
  let user = await createUser()
  navigate(`/users/${user.id}`)
}
{{< /highlight >}}


Normal navigation adds an entry to the browsers **history** stack, enabling the **back button** to return to the previous location. To instead change the page without adding to the history stack use the `replace` option. This is sometimes desirable when creating objects as the creation-page form may no longer be a valid location

{{< highlight jsx>}}
import { navigate } from 'raviger'

export async function createUser () {
  let user = await createUser()
  navigate(`/users/${user.id}`, true)
}
{{< /highlight >}}

## Navigating with Query Params

To navigate with a serialized query string pass an object as the second parameter.

{{< highlight jsx>}}
import { navigate } from 'raviger'

export async function createUser () {
  let user = await createUser()
  navigate(`/users/${user.id}` { ref: 'create page' })
}
{{< /highlight >}}
