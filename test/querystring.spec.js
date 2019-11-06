import React from 'react'
import { render, act } from '@testing-library/react'
import { navigate, useQueryParams } from '../src/main.js'

beforeEach(() => {
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
  test('navigation updates query', async () => {
    const q1 = { foo: 'bar' }
    const q2 = { bar: 'foo' }
    act(() => navigate('/about', q1))
    const { getByTestId } = render(<Route />)
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify(q1))
    act(() => navigate('/check', q2))
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify(q2))
    // Jest doesn't appear to do this...
    // act(() => window.history.back())
    act(() => navigate('/about', q1))
    expect(getByTestId('label')).toHaveTextContent(JSON.stringify(q1))
  })
})
