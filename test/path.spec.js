import React from 'react'
import { render, act } from '@testing-library/react'
import { useRoutes, usePath, useLocationChange, navigate } from '../src/main.js'

beforeEach(() => {
  act(() => navigate('/'))
})

describe('useLocationChange', () => {
  function Route({ onChange, isActive }) {
    useLocationChange(onChange, { isActive })
    return null
  }
  test('setter gets updated path', async () => {
    let watcher = jest.fn()
    render(<Route onChange={watcher} />)

    act(() => navigate('/foo'))
    expect(watcher).toBeCalledWith('/foo')
    act(() => navigate('/base'))
    expect(watcher).toBeCalledWith('/base')
  })
  test('setter is not updated when isActive is false', async () => {
    let watcher = jest.fn()
    render(<Route onChange={watcher} isActive={false} />)
    act(() => navigate('/foo'))

    expect(watcher).not.toBeCalled()
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
      const route = useRoutes(routes, { basePath })
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

    // Yes, check twice
    // This is a regression check for this bug: https://github.com/kyeotic/raviger/issues/34
    act(() => navigate('/nested/about'))
    expect(getByTestId('path')).toHaveTextContent('/about')
    expect(getByTestId('path')).not.toHaveTextContent('/nested')
  })
})
