import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { navigate, useQueryParams } from '../src/main'

beforeEach(() => {
  act(() => navigate('/'))
})

describe('useQueryParams', () => {
  function Route() {
    const [query] = useQueryParams()
    return <span data-testid="label">{JSON.stringify(query)}</span>
  }
  test('parses query', async () => {
    act(() => navigate('/about', { query: { foo: 'bar' } }))
    const { getByTestId } = render(<Route />)
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify({ foo: 'bar' }))
  })
  test('navigation updates query', async () => {
    const q1 = { foo: 'bar' }
    const q2 = { bar: 'foo' }
    act(() => navigate('/about', { query: q1 }))
    const { getByTestId } = render(<Route />)
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify(q1))
    act(() => navigate('/check', { query: q2 }))
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify(q2))
    // Jest doesn't appear to do this...
    // act(() => window.history.back())
    act(() => navigate('/about', { query: q1 }))
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify(q1))
  })
})

describe('setQueryParams', () => {
  function Route({
    replace,
    historyReplace,
    foo = 'bar',
  }: {
    replace?: boolean
    historyReplace?: boolean
    foo?: string | null
  }) {
    const [query, setQuery] = useQueryParams()
    return (
      <button data-testid="update" onClick={() => setQuery({ foo }, { replace, historyReplace })}>
        Set Query: {query.foo}
      </button>
    )
  }
  test('updates query', async () => {
    act(() => navigate('/about', { query: { bar: 'foo' } }))
    const { getByTestId } = render(<Route replace />)

    act(() => void fireEvent.click(getByTestId('update')))
    expect(document.location.search).toEqual('?foo=bar')
  })
  test('handles encoded values', async () => {
    act(() => navigate('/about', { query: { foo: 'foo' } }))
    const { getByTestId } = render(<Route replace={false} foo={'%100'} />)

    act(() => void fireEvent.click(getByTestId('update')))
    expect(document.location.search).toContain(`foo=${encodeURIComponent('%100')}`)
    expect(getByTestId('update')).toHaveTextContent('Set Query: %100')
  })
  test('merges query', async () => {
    act(() => navigate('/about', { query: { bar: 'foo' } }))
    const { getByTestId } = render(<Route replace={false} />)

    act(() => void fireEvent.click(getByTestId('update')))
    expect(document.location.search).toContain('bar=foo')
    expect(document.location.search).toContain('foo=bar')
  })
  test('merges query without null', async () => {
    act(() => navigate('/about', { query: { bar: 'foo' } }))
    const { getByTestId } = render(<Route replace={false} foo={null} />)

    act(() => void fireEvent.click(getByTestId('update')))
    expect(document.location.search).toContain('bar=foo')
    expect(document.location.search).not.toContain('foo=')
  })
  test('removes has when replace is true', async () => {
    act(() => navigate('/about#test'))
    const { getByTestId } = render(<Route replace />)
    act(() => void fireEvent.click(getByTestId('update')))
    expect(document.location.hash).toEqual('')
  })
  test('retains has when replace is false', async () => {
    act(() => navigate('/about#test'))
    const { getByTestId } = render(<Route replace={false} />)
    act(() => void fireEvent.click(getByTestId('update')))
    expect(document.location.hash).toEqual('#test')
  })

  test('uses history.replaceState when historyReplace is true', async () => {
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState')
    replaceStateSpy.mockClear()
    act(() => navigate('/about', { query: { bar: 'foo' } }))
    const { getByTestId } = render(<Route historyReplace={true} />)
    act(() => void fireEvent.click(getByTestId('update')))
    expect(replaceStateSpy).toHaveBeenCalled()
    expect(document.location.search).toEqual('?foo=bar')
    replaceStateSpy.mockRestore()
  })

  test('uses history.pushState when historyReplace is false', async () => {
    const pushStateSpy = jest.spyOn(window.history, 'pushState')
    pushStateSpy.mockClear()
    act(() => navigate('/about', { query: { bar: 'foo' } }))
    const { getByTestId } = render(<Route historyReplace={false} />)
    act(() => void fireEvent.click(getByTestId('update')))
    expect(pushStateSpy).toHaveBeenCalled()
    expect(document.location.search).toEqual('?foo=bar')
    pushStateSpy.mockRestore()
  })
})
