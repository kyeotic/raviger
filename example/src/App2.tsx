import * as React from 'react'
import { useRoutes, Redirect } from '../../src/main'

// import './styles.css'

const Page = () => {
  return <div>Hi from /bar/foo</div>
}

const routes = {
  '/bar': () => <Redirect to={'/bar/foo'} />,
  '/bar/foo': () => <Page />,
  '*': () => <Redirect to={'/bar/foo'} />,
}

export default function App() {
  return (
    <div>
      If it works as expected it should say <b>Hi from /bar/foo</b> below the
      buttons:
      <br />
      <button onClick={() => (window.location.href = '/')}>
        Retry from / (doesn't render Page)
      </button>
      <br />
      <button onClick={() => (window.location.href = '/bar')}>
        Retry from /bar (doesn't render Page)
      </button>
      <br />
      <button onClick={() => (window.location.href = '/bar/foo')}>
        Retry from /bar/foo (works)
      </button>
      <br />
      {useRoutes(routes)}
    </div>
  )
}
