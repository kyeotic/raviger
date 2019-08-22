import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { useRoutes, usePath, useQueryParams, navigate } from '../src/router.js'

// this is just a little hack to silence a warning that we'll get until we
// upgrade to 16.9: https://github.com/facebook/react/pull/14853
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  act(() => navigate('/'))
  console.error = originalError
})

describe('useRoutes', () => {
  function Harness({ routes, basePath }) {
    const route = useRoutes(routes, basePath)
    return route
  }

  function Route({ label }) {
    let path = usePath()
    return (
      <span data-testid="label">
        {label} {path}
      </span>
    )
  }
  const routes = {
    '/': () => <Route label="home" />,
    '/about': () => <Route label="about" />,
    '/users/:userId': ({ userId }) => <Route label={`User ${userId}`} />
  }

  test('matches current route', async () => {
    const { getByTestId } = render(<Harness routes={routes} />)

    act(() => navigate('/'))
    expect(getByTestId('label')).toHaveTextContent('home')
  })
  test('matches updated route', async () => {
    const { getByTestId } = render(<Harness routes={routes} />)

    act(() => navigate('/'))
    expect(getByTestId('label')).toHaveTextContent('home')

    act(() => navigate('/about'))
    expect(getByTestId('label')).toHaveTextContent('about')
  })
  test('matches route with parameters', async () => {
    const { getByTestId } = render(<Harness routes={routes} />)

    act(() => navigate('/users/1'))
    expect(getByTestId('label')).toHaveTextContent('User 1')
  })
})

describe('usePath', () => {
  function Route() {
    let path = usePath()
    return <span data-testid="path">{path}</span>
  }
  test('returns original path', async () => {
    act(() => navigate('/'))
    const { getByTestId } = render(<Route />)

    expect(getByTestId('path')).toHaveTextContent('/')
  })

  test('returns updated path', async () => {
    act(() => navigate('/'))
    const { getByTestId } = render(<Route />)
    act(() => navigate('/about'))

    expect(getByTestId('path')).toHaveTextContent('/about')
  })

  test('does not include parent router base path', async () => {
    function Harness({ routes, basePath }) {
      const route = useRoutes(routes, basePath)
      return route
    }

    const nestedRoutes = {
      '/': () => <Route />,
      '/about': () => <Route />
    }
    const routes = {
      '/': () => <Route />,
      '/about': () => <Route />,
      '/nested*': () => <Harness basePath="/nested" routes={nestedRoutes} />
    }

    const { getByTestId } = render(<Harness routes={routes} />)
    act(() => navigate('/'))
    expect(getByTestId('path')).toHaveTextContent('/')

    act(() => navigate('/about'))
    expect(getByTestId('path')).toHaveTextContent('/about')

    act(() => navigate('/nested/about'))
    expect(getByTestId('path')).toHaveTextContent('/about')
  })
})

describe('useQueryParams', () => {
  function Route({ label }) {
    let [params, setQuery] = useQueryParams()
    return (
      <span data-testid="params" onClick={() => setQuery({ name: 'click' })}>
        {label}
        {JSON.stringify(params)}
      </span>
    )
  }
  test('returns current params', async () => {
    act(() => navigate('/?name=test'))
    const { getByTestId } = render(<Route />)

    expect(getByTestId('params')).toHaveTextContent('name":"test')
  })

  test('returns updated params', async () => {
    act(() => navigate('/?name=test'))
    const { getByTestId } = render(<Route />)
    act(() => navigate('/?name=updated'))

    expect(getByTestId('params')).toHaveTextContent('name":"updated')
  })

  test('sets query', async () => {
    act(() => navigate('/?name=test'))
    const { getByTestId } = render(<Route />)
    act(() => void fireEvent.click(getByTestId('params')))

    expect(getByTestId('params')).toHaveTextContent('name":"click')
  })
})

describe('navigate', () => {
  test('updates the url', async () => {
    act(() => navigate('/'))
    expect(window.location.toString()).toEqual('http://localhost/')
    act(() => navigate('/home'))
    expect(window.location.toString()).toEqual('http://localhost/home')
    // console.log(window.location.toString())
  })
  test('allows query string objects', async () => {
    // console.log(URLSearchParams)
    act(() => navigate('/', { q: 'name', env: 'test' }))
    expect(window.location.search).toContain('q=name')
    expect(window.location.search).toContain('env=test')
  })
})
