import React from 'react'
import { render, act } from '@testing-library/react'
import { useRedirect, navigate, Redirect } from '../src/main.js'

beforeEach(() => {
  act(() => navigate('/'))
})

describe('useRedirect', () => {
  function Mock() {
    useRedirect('/fail', '/catch', { name: 'kyeotic' })
    useRedirect('/miss', '/catch')
    return <span>Mock</span>
  }
  test('route is unchanged when predicate does not match', async () => {
    act(() => navigate('/'))
    render(<Mock />)
    expect(window.location.toString()).toEqual('http://localhost/')
    act(() => navigate('/test'))
    expect(window.location.toString()).toEqual('http://localhost/test')
  })
  test('route is changed when predicate matches', async () => {
    act(() => navigate('/fail'))
    expect(window.location.toString()).toEqual('http://localhost/fail')
    render(<Mock />)
    expect(window.location.toString()).toEqual(
      'http://localhost/catch?name=kyeotic'
    )
  })
  test('route handles empty redirect', async () => {
    act(() => navigate('/'))
    expect(window.location.toString()).toEqual('http://localhost/')
    render(<Mock />)
    act(() => navigate('/miss'))
    expect(window.location.toString()).toEqual('http://localhost/catch')
  })
})

describe('Redirect', () => {
  test('redirects to "to" without merge', async () => {
    render(<Redirect to="/foo" merge={false} />)
    expect(window.location.toString()).toEqual('http://localhost/foo')
  })
  test('redirects to "to" without merge and query', async () => {
    act(() => navigate('/?things=act'))
    render(<Redirect to="/foo" merge={false} />)
    expect(window.location.toString()).toEqual('http://localhost/foo')
  })
  test('redirects to "to" with merge (default) and query', async () => {
    act(() => navigate('/?things=act'))
    render(<Redirect to="/foo" />)
    expect(window.location.toString()).toEqual(
      'http://localhost/foo?things=act'
    )
  })
  test('redirects to "to" with merge and query/hash', async () => {
    act(() => navigate('/?things=act#test'))
    render(<Redirect to="/foo" merge />)
    expect(window.location.toString()).toEqual(
      'http://localhost/foo?things=act#test'
    )
  })
})
