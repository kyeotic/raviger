import React from 'react'
import {
  useRoutes,
  Link,
  usePath,
  useQueryParams,
  Redirect
} from '../../src/main.js'
import Nav from './Nav.js'
import Form from './Form.js'

const routes = {
  '/': () => <span>Home</span>,
  '/about': () => <span>about</span>,
  '/contact': () => <span>contact</span>,
  '/form': () => <Form />,
  '/users/:userId': ({ userId }) => <span>User: {userId}</span>,
  '/filter': () => <Filter />,
  '/redirect': () => <Redirect to={'/filter'} />,
  '/deep*': () => <Deep />,
  '/*': () => <DisplayPath />
}

let renders = 0
const App = () => {
  renders++
  let route = useRoutes(routes)
  let path = usePath()
  // console.log('rendered', renders)
  return (
    <div>
      <Nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/form">Form</Link>
        <Link href="/users/1">Tom</Link>
        <Link href="/users/2">Jane</Link>
        <Link href="/deep">Deep Root</Link>
        <Link href="/fallthrough">Fallthrough 1</Link>
        <Link href="/fallthrough/nested">Fallthrough Nested</Link>
        <Link href="/filter">Filters</Link>
        <Link href="/redirect">Redirect</Link>
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

const deepRoutes = {
  '/': () => <DisplayPath />,
  '/about': () => <DisplayPath />,
  '/contact': () => <DisplayPath />
}

function Deep() {
  let route = useRoutes(deepRoutes, { basePath: '/deep' })
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
      <Link href="/filter?type=apis#this">Filter APIs /w Hash</Link>
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
