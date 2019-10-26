import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { Link, ActiveLink, navigate } from '../src/main.js'

afterAll(() => {
  act(() => navigate('/'))
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
