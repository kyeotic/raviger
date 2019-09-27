import React from 'react'
import { render, act } from '@testing-library/react'
import { navigate, useQueryParams } from '../src/main.js'

describe('useQueryParams', () => {
  test('parses query', async () => {
    function Route() {
      let [query] = useQueryParams()
      return <span data-testid="label">{JSON.stringify(query)}</span>
    }
    act(() => navigate('/about', { foo: 'bar' }))
    const { getByTestId } = render(<Route />)
    expect(getByTestId('label')).toHaveTextContent(
      JSON.stringify({ foo: 'bar' })
    )
  })
})
