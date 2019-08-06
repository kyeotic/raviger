import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { useRoutes, navigate } from '../src/router.js'

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
  console.error = originalError
})

function Harness({ routes, basePath }) {
  const route = useRoutes(routes, basePath)
  return route
}

function Route({ label }) {
  return <span data-testid="label">{label}</span>
}

describe('useRoutes', () => {
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
