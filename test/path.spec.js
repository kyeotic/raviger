import React from 'react'
import { render, act } from '@testing-library/react'
import { useLocationChange, navigate } from '../src/main.js'

afterAll(() => {
  act(() => navigate('/'))
})

describe('useLocationChange', () => {
  function Route({ onChange = () => {} }) {
    useLocationChange(onChange)
    return null
  }
  test('navigation does not block when prompt is false', async () => {
    render(<Route block={false} />)
    act(() => navigate('/foo'))

    expect(document.location.pathname).toEqual('/foo')
  })
})
