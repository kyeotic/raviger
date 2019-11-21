import React, { useRef } from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { Link, ActiveLink, navigate } from '../src/main.js'

beforeEach(() => {
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
  test('doesnt navigate for target=blank', async () => {
    act(() => navigate('/'))
    const { getByTestId } = render(
      <Link href="/foo" className="base" target="_blank" data-testid="link">
        go to foo
      </Link>
    )
    act(() => void fireEvent.click(getByTestId('link')))
    expect(document.location.pathname).toEqual('/')
  })
  test('passes linkRef to anchor element', async () => {
    act(() => navigate('/'))

    let ref
    function LinkTest() {
      const linkRef = useRef()
      ref = linkRef
      return (
        <Link
          href="/foo"
          target="_blank"
          data-testid="linkref"
          linkRef={linkRef}
        >
          go to foo
        </Link>
      )
    }
    const { getByTestId } = render(<LinkTest />)
    expect(getByTestId('linkref')).toBe(ref.current)
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
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
