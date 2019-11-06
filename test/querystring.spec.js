import React from 'react'
import { render, act } from '@testing-library/react'
import { navigate, useQueryParams } from '../src/main.js'

beforeAll(() => {
  act(() => navigate('/'))
})

describe('useQueryParams', () => {
  function Route() {
    let [query] = useQueryParams()
    return <span data-testid="label">{JSON.stringify(query)}</span>
  }
  test('parses query', async () => {
    act(() => navigate('/about', { foo: 'bar' }))
    const { getByTestId } = render(<Route />)
    expect(getByTestId('label')).toHaveTextContent(
      JSON.stringify({ foo: 'bar' })
    )
  })
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('navigation updates query', async () => {
    const q1 = { foo: 'bar' }
    const q2 = { bar: 'foo' }
    act(() => navigate('/about', q1))
    const { getByTestId } = render(<Route />)
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify(q1))
    act(() => navigate('/check', q2))
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify(q2))
    console.log(window.location.href)
    // Jest doesn't appear to do this...
    act(() => window.history.back())
    console.log(window.location.href)
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify(q1))
  })
})
