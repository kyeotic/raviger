---
title: "Redirect"
date: 2020-03-04T20:17:12-08:00
weight: 5
---

A React component for causing a browser redirect

## API

{{< highlight typescript >}}
export interface RedirectProps {
  to: string
  replace?: boolean
  merge?: boolean
}
export const Redirect: React.FC<RedirectProps>
{{< /highlight >}}

## Basic

If rendered this component will force a redirect. Usefult as a route function

{{< highlight jsx>}}
<import { useRoutes, Redirect } from 'raviger'

const routes = {
  '/': ({ title }) => <Home title={title} />,
  '/about': ({ title }) => <About />,
  '/redirect': () => <Redirect to='/about' />
}

export default function App() {
  let route = useRoutes(routes)
  return (
    <div>
      {route}
    </div>
  )
}
{{< /highlight >}}

By default it will navigate with `replace` and `merge` both `true`.

## replace

If `replace` is `true` the redirect will not create a new entry in the history stack. `default = true`

## merge

If `merge` is `true` the redirect will use existing `location.hash` and `location.query` values. Useful for rewriting URLs without losing their intended state. `default = true`