import React, { useCallback, useEffect, act } from 'react'
import { render, fireEvent } from '@testing-library/react'
import { navigate, useLocationChange, usePath, useRoutes, useHash, Routes } from '../src/main'

beforeEach(() => {
  act(() => navigate('/'))
})

describe('useLocationChange', () => {
  function Route({
    onChange,
    isActive,
    basePath,
    onInitial = false,
  }: {
    onChange: (path: string | null) => void
    isActive?: boolean
    basePath?: string
    onInitial?: boolean
  }) {
    useLocationChange(({ path }) => onChange(path), { isActive, basePath, onInitial })
    return null
  }
  test("setter doesn't get updated on mount", async () => {
    const watcher = jest.fn()
    render(<Route onChange={watcher} />)

    expect(watcher).not.toHaveBeenCalled()
  })
  test('setter is updated on mount when onInitial is true', async () => {
    const watcher = jest.fn()
    render(<Route onChange={watcher} onInitial />)

    expect(watcher).toHaveBeenCalled()
  })
  test('setter gets updated path', async () => {
    const watcher = jest.fn()
    render(<Route onChange={watcher} />)

    act(() => navigate('/foo'))
    expect(watcher).toHaveBeenCalledWith('/foo')
    act(() => navigate('/base'))
    expect(watcher).toHaveBeenCalledWith('/base')
  })
  test('setter is not updated when isActive is false', async () => {
    const watcher = jest.fn()
    render(<Route onChange={watcher} isActive={false} />)
    act(() => navigate('/foo'))

    expect(watcher).not.toHaveBeenCalled()
  })
  test('setter gets null when provided basePath is missing', async () => {
    const watcher = jest.fn()
    render(<Route onChange={watcher} basePath="/home" />)

    act(() => navigate('/foo'))
    expect(watcher).toHaveBeenCalledWith(null)
    act(() => navigate('/home'))
    expect(watcher).toHaveBeenCalledWith('/')
  })
})

describe('usePath', () => {
  function Route() {
    const path = usePath()
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
    function Harness({ routes, basePath }: { routes: Routes<string>; basePath?: string }) {
      const route = useRoutes(routes, { basePath })
      return route
    }

    const nestedRoutes = {
      '/': () => <Route />,
      '/about': () => <Route />,
    }
    const routes = {
      '/': () => <Route />,
      '/about': () => <Route />,
      '/nested*': () => <Harness basePath="/nested" routes={nestedRoutes} />,
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
    function Harness({ routes, basePath }: { routes: Routes<string>; basePath?: string }) {
      const route = useRoutes(routes, { basePath })
      return route
    }

    const nestedRoutes = {
      '/': () => <Route />,
      '/about': () => <Route />,
      '/info': () => <Route />,
    }
    const routes = {
      '/': () => <Route />,
      '/about': () => <Route />,
      '/nested*': () => <Harness basePath="/foo/nested" routes={nestedRoutes} />,
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

  // tracks regression of https://github.com/kyeotic/raviger/issues/64
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
      '/about': () => <About />,
    }
    function Harness({ routes, basePath }: { routes: Routes<string>; basePath?: string }) {
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

    // console.log('start')
    // start with about mounted
    act(() => navigate('/about'))
    const { getByTestId } = render(<Harness routes={routes} />)

    expect(getByTestId('path')).toHaveTextContent('/about')
    expect(aboutFn).toHaveBeenCalledTimes(1)
    // console.log('preset')

    // reset
    aboutFn.mockClear()

    // console.log('reset')
    // act(() => navigate('/'))

    // go home with async
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
      const path = usePath('/home')
      return <span data-testid="path">{path || 'not found'}</span>
    }
    act(() => navigate('/'))
    const { getByTestId } = render(<Route />)
    act(() => navigate('/about'))

    expect(getByTestId('path')).toHaveTextContent('not found')
  })

  test('has correct path after navigate during mount', async () => {
    const trace = jest.fn()

    const routes = {
      '/': () => <Main />,
      '/sub': () => <Sub />,
    }

    function App() {
      const route = useRoutes(routes)

      trace(usePath())

      return route
    }

    function Main() {
      return <span data-testid="render">main</span>
    }

    function Sub() {
      navigate('/')
      return <span data-testid="hash">sub</span>
    }

    act(() => navigate('/sub'))

    const { getByTestId } = render(<App />)

    expect(trace).toHaveBeenCalledWith('/')
    expect(getByTestId('render')).toHaveTextContent('main')
  })
})

describe('useHash', () => {
  function Route({ skip }: { skip?: boolean }) {
    const hash = useHash({ stripHash: skip ? false : undefined })
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
    expect(getByTestId('hash')).toHaveTextContent('test')

    act(() => navigate('/#updated'))
    expect(getByTestId('hash')).toHaveTextContent('updated')
  })
  test('returns hash without stripping when stripHash is false', async () => {
    act(() => navigate('/#test'))
    const { getByTestId } = render(<Route skip />)

    expect(getByTestId('hash')).toHaveTextContent('#test')
  })
})

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), ms))
}
