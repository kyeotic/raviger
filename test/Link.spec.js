import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { Link, ActiveLink, navigate } from '../src/main.js'

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

describe('Link', () => {
  test('renders', async () => {
    const { getByTestId } = render(
      <Link href="/foo" className="base" data-testid="link">
        go to foo
      </Link>
    )

    act(() => navigate('/'))
    expect(getByTestId('link')).toHaveTextContent('go to foo')
  })
  test('navigates to href', async () => {
    act(() => navigate('/'))
    const { getByTestId } = render(
      <Link href="/foo" className="base" data-testid="link">
        go to foo
      </Link>
    )
    act(() => void fireEvent.click(getByTestId('link')))
    expect(document.location.pathname).toEqual('/foo')
  })
})
describe('ActiveLink', () => {
  test('adds active class when active', async () => {
    const { getByTestId } = render(
      <ActiveLink
        href="/foo"
        className="base"
        activeClass="extra"
        exactActiveClass="double"
        data-testid="link"
      >
        go to foo
      </ActiveLink>
    )

    act(() => navigate('/'))
    expect(getByTestId('link')).toHaveClass('base')

    act(() => navigate('/foo'))
    expect(getByTestId('link')).toHaveClass('extra')
    expect(getByTestId('link')).toHaveClass('double')

    act(() => navigate('/foo/bar'))
    expect(getByTestId('link')).toHaveClass('extra')
    expect(getByTestId('link')).not.toHaveClass('double')
  })
})
