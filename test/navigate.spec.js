import React from 'react'
import { render, act } from '@testing-library/react'
import { useNavigationPrompt, navigate } from '../src/main.js'

const originalConfirm = window.confirm
const originalReplaceState = window.history.replaceState
const originalPushState = window.history.pushState

beforeEach(() => {
  window.confirm = originalConfirm
  window.history.replaceState = originalReplaceState
  window.history.pushState = originalPushState
  act(() => navigate('/'))
})

afterEach(() => {
  window.confirm = originalConfirm
  window.history.replaceState = originalReplaceState
  window.history.pushState = originalPushState
})

describe('useNavigationPrompt', () => {
  function Route({ block = true, prompt }) {
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
