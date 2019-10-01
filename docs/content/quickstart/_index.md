+++
title = "Quick Start"
date = 2019-09-26T19:40:47-07:00
weight = 1
chapter = true
+++

# Quick Start

Getting started with [raviger](https://github.com/kyeotic/raviger)

## Installation

```
npm i raviger
```

## Quick Start

This basic setup shows how to display an `<App>` component that renders a route based on the current path, with links to different routes.

{{< highlight jsx >}}
import { useRoutes, Link, useQueryParams } from 'raviger'
import { Home, About, Users } from './Pages.js'

const routes = {
  '/': () => <Home />,
  '/about': () => <About />,
  '/users/:userId': ({ userId }) => <Users id={userId} />
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
{{< /highlight>}}