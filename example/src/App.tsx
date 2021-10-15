import * as React from 'react'
import {} from 'react-dom'

import { useRoutes, Link, usePath, useQueryParams, Redirect } from '../../src/main'
import Nav from './Nav'
import Form from './Form'

const routes = {
  '/': () => <span>Home</span>,
  '/about': () => <span>about</span>,
  '/contact': () => <span>contact</span>,
  '/form': () => <Form />,
  '/weird (route)': () => <span>Weird Route</span>,
  '/users/:userId': ({ userId }: { userId: string }) => <span>User: {userId}</span>,
  '/filter': () => <Filter />,
  '/redirect': () => <Redirect to={'/filter'} />,
  '/redirect-external': () => <Redirect to={'http://example.com'} />,
  '/deep*': () => <Deep />,
  '/*': () => <DisplayPath />,
}

let renders = 0
const App = () => {
  renders++
  const route = useRoutes(routes)
  const path = usePath()
  // console.log('rendered', renders)
  return (
    <div>
      <Nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/form">Form</Link>
        <Link href={`/${encodeURIComponent('weird (route)')}`}>Weird (Route)</Link>
        <Link href="/users/1">Tom</Link>
        <Link href="/users/2">Jane</Link>
        <Link href="/deep">Deep Root</Link>
        <Link href="/fallthrough">Fallthrough 1</Link>
        <Link href="/fallthrough/nested">Fallthrough Nested</Link>
        <Link href="/filter">Filters</Link>
        <Link href="/redirect">Redirect</Link>
        <Link href="/redirect-external">Redirect External</Link>
      </Nav>
      <div></div>
      <span style={{ display: 'block' }}>Root Path: {path}</span>
      <span style={{ display: 'block' }}>Render Count: {renders}</span>
      {route}
    </div>
  )
}

// App.whyDidYouRender = {
//   logOnDifferentValues: true
// }

export default App

const DeepAbout = () => (
  <Nav>
    <Link href="/contact">Deep Contact</Link>
    <Link href="/contact" basePath="/">
      Root Contact
    </Link>
  </Nav>
)

const deepRoutes = {
  '/': () => <DisplayPath />,
  '/about': () => <DeepAbout />,
  '/contact': () => <DisplayPath />,
}

function Deep() {
  const route = useRoutes(deepRoutes, { basePath: '/deep' })
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
  const [{ type, name }, setQuery] = useQueryParams()
  return (
    <Nav>
      <Link href="/filter?type=projects">Filter Projects</Link>
      <Link href="/filter?type=apis">Filter APIs</Link>
      <Link href="/filter?type=apis#this">Filter APIs /w Hash</Link>
      <p>Filter: {type || ''}</p>
      <p>Query: {name || ''}</p>
      <input
        type="text"
        placeholder="Enter a query"
        value={name || ''}
        onChange={(e) => setQuery({ name: e.target.value }, { replace: false })}
      />
    </Nav>
  )
}

function DisplayPath() {
  const path = usePath()
  return <span>Star Path: {path}</span>
}
