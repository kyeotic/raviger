import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { navigate, useRoutes } from '../src/router.js'
import { useRedirect } from '../src/redirect'

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

describe('useRedirect', () => {
  function Mock() {
    useRedirect('/fail', '/catch', { name: 'kyeotic' })
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
})
