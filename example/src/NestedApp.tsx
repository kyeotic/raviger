import React, { Component } from 'react'
import { render } from 'react-dom'
import {
  useRoutes,
  usePath,
  useBasePath,
  useQueryParams,
  navigate,
  Link
} from '../../src/main.js'

const NotFound = () => {
  return (
    <div style={{ border: '1px solid red' }} data-testid="label">
      not found
    </div>
  )
}

function Harness({ routes, basePath }) {
  const route = useRoutes(routes, { basePath }) || <NotFound />

  const contextPath = usePath()
  const contextBasePath = useBasePath()

  return (
    <>
      <div style={{ border: '1px solid blue' }}>
        <h1>Router wrapper</h1>
        <p>Path: {contextPath}</p>
        <p>BasePath: {contextBasePath}</p>
      </div>
      {route}
    </>
  )
}

function Route({ label, extra }) {
  let path = usePath()
  let basePath = useBasePath()
  return (
    <div style={{ border: '1px solid green' }}>
      <h1>Route</h1>
      <p data-testid="label">Label: "{label}"</p>
      <p>Path: "{path}"</p>
      <p>Base Path: "{basePath}"</p>
      <p>Param: "{extra}"</p>
    </div>
  )
}

const nestedRoutes = {
  '/': () => <Route label="nested root" />,
  '/about': () => <Route label="nested about" />,
  '/test': () => <Route label="nested test" />
}

const routes = {
  '/': () => <Route label="root" />,
  '/test/*': () => <Harness basePath={`/foo/test`} routes={nestedRoutes} />,
  '/:param*': ({ param }) => (
    <Harness basePath={`/foo/${param}`} routes={nestedRoutes} />
  )
}

export default function App() {
  return (
    <div>
      <Harness routes={routes} basePath="/foo" />

      <Link href="/foo/">root</Link>
      <br />
      <Link href="/foo/1234/about">nested with a param About</Link>
      <br />
      <Link href="/foo/1234/test">nested with a param Test</Link>
    </div>
  )
}
