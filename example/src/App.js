import React from 'react'
import { useRoutes, Link, usePath, useQueryParams } from '../../src/main.js'
import Nav from './Nav.js'

const routes = {
  '/': () => <span>Home</span>,
  '/about': () => <span>about</span>,
  '/contact': () => <span>contact</span>,
  '/users/:userId': ({ userId }) => <span>User: {userId}</span>,
  '/filter': () => <Filter />,
  '/deep*': () => <Deep />,
  '/*': () => <DisplayPath />
}

export default function App() {
  let route = useRoutes(routes)
  let path = usePath()
  return (
    <div>
      <Nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/users/1">Tom</Link>
        <Link href="/users/2">Jane</Link>
        <Link href="/deep">Deep Root</Link>
        <Link href="/fallthrough">Fallthrough 1</Link>
        <Link href="/fallthrough/nested">Fallthrough Nested</Link>
        <Link href="/filter">Filters</Link>
      </Nav>
      <div></div>
      <span style={{ display: 'block' }}>Root Path: {path}</span>
      {route}
    </div>
  )
}

const deepRoutes = {
  '/': () => <DisplayPath />,
  '/about': () => <DisplayPath />,
  '/contact': () => <DisplayPath />
}

function Deep() {
  let route = useRoutes(deepRoutes, '/deep')
  return (
    <div>
      <Nav>
        <Link href="/deep">Deep Home</Link>
        <Link href="/deep/about">About</Link>
        <Link href="/deep/Contact">Contact</Link>
      </Nav>
      {route}
    </div>
  )
}

function Filter() {
  let [{ type, name }, setQuery] = useQueryParams()
  return (
    <Nav>
      <Link href="/filter?type=projects">Filter Projects</Link>
      <Link href="/filter?type=apis">Filter APIs</Link>
      <p>Filter: {type || ''}</p>
      <p>Query: {name || ''}</p>
      <input
        type="text"
        placeholder="Enter a query"
        value={name || ''}
        onChange={e => setQuery({ name: e.target.value }, false)}
      />
    </Nav>
  )
}

function DisplayPath() {
  let path = usePath()
  return <span>Path: {path}</span>
}
