import React from 'react'
import { render, act } from '@testing-library/react'
import {
  navigate,
  useNavigate,
  useRoutes,
  useNavigationPrompt,
  QueryParam,
  RouteParams,
} from '../src'

const originalConfirm = window.confirm
const originalReplaceState = window.history.replaceState
const originalPushState = window.history.pushState

beforeEach(() => {
  window.confirm = originalConfirm
  window.history.replaceState = originalReplaceState
  window.history.pushState = originalPushState
  act(() => navigate('/'))
})

afterEach(async () => {
  window.confirm = originalConfirm
  window.history.replaceState = originalReplaceState
  window.history.pushState = originalPushState
  // We must wait for the intercept reset op
  return new Promise<void>((resolve) => setTimeout(() => resolve(), 7))
})

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
          navigateWithBasePath(newPath, query, replace)
        }}
      >
        click to navigate
      </button>
    )
  }

  const routes: RouteParams = {
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

    const { container } = render(
      <App basePath={basePath} newPath={newPath} query={query} />
    )
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

    const { container } = render(
      <App basePath={basePath} newPath={newPath} replace />
    )
    act(() => navigate(`${basePath}/`))

    window.history.replaceState = jest.fn()
    const button = container.querySelector('button')
    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect((window.history.replaceState as jest.Mock).mock.calls).toHaveLength(
      1
    )
    expect(
      (window.history.replaceState as jest.Mock).mock.calls[0]
    ).toHaveLength(3)
    expect((window.history.replaceState as jest.Mock).mock.calls[0][2]).toEqual(
      basePath + newPath
    )
    jest.clearAllMocks()
  })
})

describe('useNavigationPrompt', () => {
  function Route({
    block = true,
    prompt,
  }: {
    block: boolean
    prompt?: string
  }) {
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
    let event = window.document.createEvent('Event')
    event.initEvent('beforeunload', true, true)
    window.dispatchEvent(event)

    expect(document.location.pathname).toEqual('/')
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

    navigate(url, false)
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, true)
    expect(window.history.replaceState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, null, true)
    expect(window.history.replaceState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, null, false)
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, undefined, true)
    expect(window.history.replaceState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, undefined, false)
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, {})
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, {}, true)
    expect(window.history.replaceState).toHaveBeenCalled()
    jest.clearAllMocks()

    navigate(url, {}, false)
    expect(window.history.pushState).toHaveBeenCalled()
    jest.clearAllMocks()
  })
})
