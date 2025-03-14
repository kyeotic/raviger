/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { act } from 'react'
import { render } from '@testing-library/react'
import { mockNavigation, delay } from './utils'

import {
  navigate,
  useNavigate,
  useRoutes,
  useNavigationPrompt,
  QueryParam,
  Routes,
} from '../src/main'

mockNavigation()

describe('useNavigate', () => {
  function Route({
    newPath,
    query,
    replace,
  }: {
    newPath: string
    query?: QueryParam | URLSearchParams
    replace?: boolean
  }) {
    const navigateWithBasePath = useNavigate()
    return (
      <button
        onClick={() => {
          navigateWithBasePath(newPath, { query, replace })
        }}
      >
        click to navigate
      </button>
    )
  }

  const routes: Routes<string> = {
    // @ts-expect-error there come from RouteProps, find a way to type them
    '/*': ({ newPath, query, replace }) => (
      <Route newPath={newPath} query={query} replace={replace} />
    ),
  }

  function App({
    basePath,
    newPath,
    query,
    replace,
  }: {
    basePath?: string
    newPath?: any
    query?: any
    replace?: boolean
  }) {
    const route = useRoutes(routes, {
      basePath,
      routeProps: { newPath, query, replace },
    })
    return route
  }

  test('navigate with a basePath', async () => {
    const basePath = '/base'
    const newPath = '/path'

    const { container } = render(<App basePath={basePath} newPath={newPath} />)
    act(() => navigate(`${basePath}/`))

    const button = container.querySelector('button')
    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(document.location.pathname).toEqual(basePath + newPath)
  })

  test('navigate without a basePath', async () => {
    const newPath = '/path'

    const { container } = render(<App newPath={newPath} />)
    act(() => navigate('/'))

    const button = container.querySelector('button')
    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(document.location.pathname).toEqual(newPath)
  })

  test('navigate to a relative path', async () => {
    const basePath = '/base'
    const newPath = 'relative'

    const { container } = render(<App basePath={basePath} newPath={newPath} />)
    act(() => navigate(`${basePath}/page`))

    const button = container.querySelector('button')
    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(document.location.pathname).toEqual(`${basePath}/${newPath}`)
  })

  test('navigate with a query', async () => {
    const basePath = '/base'
    const newPath = '/path'
    const query = { foo: 'bar' }

    const { container } = render(<App basePath={basePath} newPath={newPath} query={query} />)
    act(() => navigate(`${basePath}/`))

    const button = container.querySelector('button')
    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(document.location.pathname).toEqual(basePath + newPath)
    expect(document.location.search).toEqual('?foo=bar')
  })

  test('navigate without history', async () => {
    const basePath = '/base'
    const newPath = '/path'

    const { container } = render(<App basePath={basePath} newPath={newPath} replace />)
    act(() => navigate(`${basePath}/`))

    window.history.replaceState = jest.fn()
    const button = container.querySelector('button')
    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    const calls = (window.history.replaceState as jest.Mock).mock.calls

    expect(calls).toHaveLength(1)
    expect(calls[0]).toHaveLength(3)
    expect(calls[0][2]).toEqual(basePath + newPath)
    jest.clearAllMocks()
  })
})

describe('useNavigationPrompt', () => {
  function Route({ block = true, prompt }: { block: boolean; prompt?: string }) {
    useNavigationPrompt(block, prompt)
    return null
  }
  test('navigation does not block when prompt is false', async () => {
    render(<Route block={false} />)
    act(() => navigate('/foo'))

    expect(document.location.pathname).toEqual('/foo')
  })

  test('navigation does not block when prompt is accepted', async () => {
    window.confirm = jest.fn().mockImplementation(() => true)
    act(() => navigate('/'))
    render(<Route block />)
    act(() => navigate('/foo'))

    expect(document.location.pathname).toEqual('/foo')
  })

  test('navigation blocks when prompt is declined', async () => {
    window.confirm = jest.fn().mockImplementation(() => false)
    act(() => navigate('/'))
    render(<Route block />)
    act(() => navigate('/foo'))

    expect(document.location.pathname).toEqual('/')
  })

  test('window navigation blocks when prompt is declined', async () => {
    window.confirm = jest.fn().mockImplementation(() => false)
    act(() => navigate('/'))
    render(<Route block />)
    const event = window.document.createEvent('Event')
    event.initEvent('beforeunload', true, true)
    window.dispatchEvent(event)

    expect(document.location.pathname).toEqual('/')
  })

  test('popstate navigation restores scroll when prompt is declined', async () => {
    window.confirm = jest.fn().mockImplementation(() => false)
    window.scrollTo = jest.fn()
    act(() => navigate('/'))
    render(<Route block />)

    // Modify scroll to check restoration
    Object.defineProperty(window, 'scrollX', {
      value: 10,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 12,
    })

    dispatchEvent(new PopStateEvent('popstate', undefined))

    expect(document.location.pathname).toEqual('/')

    // Wait for scroll restoration
    await delay(10)
    expect(window.scrollTo).toHaveBeenCalledWith(10, 12)
  })

  test('navigation is confirmed with custom prompt', async () => {
    window.confirm = jest.fn().mockImplementation(() => false)
    act(() => navigate('/'))
    render(<Route block prompt="custom" />)
    act(() => navigate('/foo'))

    expect(window.confirm).toHaveBeenCalledWith('custom')
  })
})

describe('navigate', () => {
  test('replace is correctly set in all cases', async () => {
    window.history.replaceState = jest.fn()
    window.history.pushState = jest.fn()
    const url = '/foo'

    navigate(url, { replace: false })
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, { replace: true })
    expect(window.history.replaceState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, { replace: true })
    expect(window.history.replaceState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, { replace: false })
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, { replace: true })
    expect(window.history.replaceState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, { replace: false })
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, { query: {} })
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, { replace: true, query: {} })
    expect(window.history.replaceState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, { replace: false, query: {} })
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()
  })
  test('handles changing origins', async () => {
    const currentHref = window.location.href
    window.history.replaceState = jest.fn()
    window.history.pushState = jest.fn()
    window.location.assign = jest.fn()

    navigate('http://localhost.new/')

    expect(window.history.pushState).not.toHaveBeenCalled()
    expect(window.history.replaceState).not.toHaveBeenCalled()
    expect(window.location.assign).toHaveBeenCalledWith('http://localhost.new/')

    navigate(currentHref)
  })
  test('navigate dispatches custom event', () => {
    window.history.replaceState = jest.fn()
    window.history.pushState = jest.fn()

    const listen = jest.fn()

    window.addEventListener('popstate', listen)

    navigate('/foo')

    window.removeEventListener('popstate', listen)

    expect(listen).toHaveBeenCalledWith(expect.objectContaining({ __tag: 'raviger:navigation' }))
    jest.clearAllMocks()
  })
})
