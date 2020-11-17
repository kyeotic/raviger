---
title: Home
permalink: /
nav_order: 1
---


# raviger

**R**eact N**avig**at**or**. A React hook-based router that updates on **all** url changes. Heavily inspired by [hookrouter](https://github.com/Paratron/hookrouter).

Zero dependencies. Tiny footprint.

# Quick Start

Getting started with [raviger](https://github.com/kyeotic/raviger)

## Installation

```
npm i raviger
```

## Quick Start

This basic setup shows how to display an `<App>` component that renders a route based on the current path, with links to different routes.

```jsx
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
```