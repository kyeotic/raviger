import React, { useCallback, useEffect } from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import {
  useRoutes,
  usePath,
  useLocationChange,
  useHash,
  navigate
} from '../src/main.js'

beforeEach(() => {
  act(() => navigate('/'))
})

describe('useLocationChange', () => {
  function Route({ onChange, isActive, basePath }) {
    useLocationChange(onChange, { isActive, basePath })
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
  test('setter gets null when provided basePath is missing', async () => {
    let watcher = jest.fn()
    render(<Route onChange={watcher} basePath="/home" />)

    act(() => navigate('/foo'))
    expect(watcher).toBeCalledWith(null)
    act(() => navigate('/home'))
    expect(watcher).toBeCalledWith('/')
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

  test('has correct path for nested base path', async () => {
    function Harness({ routes, basePath }) {
      const route = useRoutes(routes, { basePath })
      return route
    }

    const nestedRoutes = {
      '/': () => <Route />,
      '/about': () => <Route />,
      '/info': () => <Route />
    }
    const routes = {
      '/': () => <Route />,
      '/about': () => <Route />,
      '/nested*': () => <Harness basePath="/foo/nested" routes={nestedRoutes} />
    }

    const { getByTestId } = render(<Harness routes={routes} basePath="/foo" />)
    act(() => navigate('/foo'))
    expect(getByTestId('path')).toHaveTextContent('/')

    act(() => navigate('/foo/nested/about'))
    expect(getByTestId('path')).toHaveTextContent('/about')

    // Yes, check twice
    // This is a regression check for this bug: https://github.com/kyeotic/raviger/issues/50
    act(() => navigate('/foo/nested/info'))
    expect(getByTestId('path')).toHaveTextContent('/')
    act(() => navigate('/foo/nested/info'))
    expect(getByTestId('path')).toHaveTextContent('/')
  })

  test('usePath is not called when unmounting', async () => {
    const homeFn = jest.fn()
    function Home() {
      const path = usePath()
      useEffect(() => {
        // console.log('home', path)
        homeFn(path)
      }, [path])
      return <span data-testid="path">{path}</span>
    }
    const aboutFn = jest.fn()
    function About() {
      const path = usePath()
      useEffect(() => {
        // console.log('about', path)
        aboutFn(path)
      }, [path])
      return <span data-testid="path">{path}</span>
    }

    const routes = {
      '/': () => <Home />,
      '/about': () => <About />
    }
    function Harness({ routes, basePath }) {
      // console.log('start harness update')
      const route = useRoutes(routes, { basePath })
      const onGoHome = useCallback(
        () => setTimeout(() => navigate('/'), 50),
        // () => setTimeout(() => act(() => navigate('/')), 50),
        []
      )
      // console.log('harness update', route.props.children.props.children.type)
      return (
        <div>
          {route}
          <button data-testid="home-btn" onClick={onGoHome}>
            Go Home
          </button>
        </div>
      )
    }

    act(() => navigate('/about'))
    const { getByTestId } = render(<Harness routes={routes} />)
    expect(getByTestId('path')).toHaveTextContent('/about')
    expect(aboutFn).toHaveBeenCalledTimes(1)

    aboutFn.mockClear()

    // console.log('reset')
    // act(() => navigate('/'))
    act(() => void fireEvent.click(getByTestId('home-btn')))
    // console.log('acted')
    // Wait for the internal setTimeout
    await act(() => delay(100))

    expect(getByTestId('path')).toHaveTextContent('/')
    expect(homeFn).toHaveBeenCalledTimes(1)
    expect(aboutFn).toHaveBeenCalledTimes(0)
  })

  test('returns null when provided basePath is missing', async () => {
    function Route() {
      let path = usePath('/home')
      return <span data-testid="path">{path || 'not found'}</span>
    }
    act(() => navigate('/'))
    const { getByTestId } = render(<Route />)
    act(() => navigate('/about'))

    expect(getByTestId('path')).toHaveTextContent('not found')
  })
})

describe('useHash', () => {
  function Route({ skip }) {
    let hash = useHash({ stripHash: skip ? false : undefined })
    return <span data-testid="hash">{hash}</span>
  }
  test('returns original hash', async () => {
    act(() => navigate('/#test'))
    const { getByTestId } = render(<Route />)

    expect(getByTestId('hash')).toHaveTextContent('test')
  })

  test('returns updated hash', async () => {
    act(() => navigate('/#test'))
    const { getByTestId } = render(<Route />)
    act(() => navigate('/#updated'))

    expect(getByTestId('hash')).toHaveTextContent('updated')
  })
  test('returns hash without stripping when stripHash is false', async () => {
    act(() => navigate('/#test'))
    const { getByTestId } = render(<Route skip />)

    expect(getByTestId('hash')).toHaveTextContent('#test')
  })
})

async function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}
