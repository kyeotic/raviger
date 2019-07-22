import React from 'react'
import { useRoutes, Link, usePath, useQueryParams } from '../../src/main.js'

const routes = {
  '/': () => <span>Home</span>,
  '/about': () => <span>about</span>,
  '/contact': () => <span>contact</span>,
  '/users/:userId': ({ userId }) => <span>User: {userId}</span>,
  '/filter': () => <Filter />,
  '/deep*': () => <Deep />,
  '/*': () => <Fallthrough />
}

const deepRoutes = {
  '/': () => <Fallthrough />,
  '/about': () => <Fallthrough />,

  '/nested/about': () => <Fallthrough />
}

function Deep() {
  return useRoutes(deepRoutes, '/deep')
}

function Filter() {
  let [{ type, name }, setQuery] = useQueryParams()
  return (
    <div>
      <p>Filter: {type || ''}</p>
      <p>Name: {name || ''}</p>
      <input
        type="text"
        value={name || ''}
        onChange={e => setQuery({ name: e.target.value }, false)}
      />
    </div>
  )
}

function Fallthrough() {
  let path = usePath()
  return <span>Path: {path}</span>
}

export default function App() {
  let route = useRoutes(routes)
  let path = usePath()
  return (
    <div>
      <div>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/users/1">Tom</Link>
        <Link href="/users/2">Jane</Link>
        <Link href="/deep">Deep Root</Link>
        <Link href="/deep/about">Deep About</Link>
        <Link href="/deep/nested/about">Deep Nested</Link>
        <Link href="/filter">Clear Filter</Link>
        <Link href="/filter?type=projects">Filter Projects</Link>
        <Link href="/filter?type=apis">Filter APIs</Link>
        <Link href="/fallthrough">Fallthrough 1</Link>
        <Link href="/fallthrough/nested">Fallthrough Nested</Link>
      </div>
      <span style={{ display: 'block' }}>Root Path: {path}</span>
      {route}
    </div>
  )
}
