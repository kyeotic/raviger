# raviger



<p align="center">
    <a href="https://bundlephobia.com/package/raviger@latest" alt="Bundlephobia">
        <img src="https://badgen.net/bundlephobia/min/raviger" /></a>
    <a href="https://bundlephobia.com/package/raviger@latest" alt="Bundlephobia gzip">
        <img src="https://badgen.net/bundlephobia/minzip/raviger" /></a>
    <a href="https://github.com/kyeotic/raviger/actions" alt="Builds">
        <img src="https://github.com/kyeotic/raviger/workflows/Tests/badge.svg" /></a>
</p>


**R**eact N**avig**at**or**. A React hook-based router that updates on **all** url changes. Heavily inspired by [hookrouter](https://github.com/Paratron/hookrouter).

Zero dependencies. Tiny footprint.


# Installation

```
npm i raviger
```

# Docs

Complete documentation is available [here on GitHub Pages](https://kyeotic.github.io/raviger/)

# Quick Start

```jsx
import { useRoutes, Link, useQueryParams } from 'raviger'

const routes = {
  '/': () => <Home />,
  '/about': () => <About />,
  '/users/:userId': ({ userId }) => <User id={userId} />
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

## Query Strings

```javascript
import { useQueryParams } from 'raviger'

function UserList ({ users }) {
  const [{ startsWith }, setQuery] = useQueryParams()

  return (
    <div>
    <label>
      Filter by Name
      <input value={startsWith || ''} onChange={(e) => setQuery({ startsWith: e.target.value})} />
    </label>
    {users.filter(u => !startsWith || u.name.startsWith(startsWith).map(user => (
      <p key={user.name}>{user.name}</p>
    )))}
    </div>
  )
}
```

## Navigation

The preferred method for navigation is the `<Link>` component, which uses all the same properties as the standard `<a>` element, and requires `href`. Internally `<Link>` uses `history.pushState` to ensure navigation without a page refresh. If you need to perform programmatic navigation raviger exports a `navigate` function.

Some routing libraries only trigger React component updates if navigation was triggered using specific methods, such as a specific instance of **history**. **raviger** listens for all `popstate` events and checks for changes. You can even have two isolated React instances on a page and URL changes will properly trigger **raviger** hooks.
