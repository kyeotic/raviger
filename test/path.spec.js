import React from 'react'
import { render, act } from '@testing-library/react'
import { useLocationChange, navigate } from '../src/main.js'

beforeEach(() => {
  act(() => navigate('/'))
})

describe('useLocationChange', () => {
  function Route({ onChange, isActive }) {
    useLocationChange(onChange, { isActive })
    return null
  }
  test('setter gets updated path', async () => {
    let watcher = jest.fn()
    render(<Route onChange={watcher} />)
    act(() => navigate('/foo'))

    expect(watcher).toBeCalledWith('/foo')
  })
  test('setter is not updated when isActive is false', async () => {
    let watcher = jest.fn()
    render(<Route onChange={watcher} isActive={false} />)
    act(() => navigate('/foo'))

    expect(watcher).not.toBeCalled()
  })
})
