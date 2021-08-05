import React, { useRef } from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { navigate, Link, ActiveLink } from '../src'

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
  test('navigates to href with basePath', async () => {
    act(() => navigate('/'))
    const { getByTestId } = render(
      <Link href="/foo" basePath="/bar" className="base" data-testid="link">
        go to foo
      </Link>
    )
    act(() => void fireEvent.click(getByTestId('link')))
    expect(document.location.pathname).toEqual('/bar/foo')
  })
  test('navigates to href with basePath without root slash', async () => {
    act(() => navigate('/'))
    const { getByTestId } = render(
      <Link href="/foo" basePath="bar" className="base" data-testid="link">
        go to foo
      </Link>
    )
    act(() => void fireEvent.click(getByTestId('link')))
    expect(document.location.pathname).toEqual('/bar/foo')
  })
  test('fires onClick', async () => {
    let spy = jest.fn()
    act(() => navigate('/'))
    const { getByTestId } = render(
      <Link href="/foo" className="base" data-testid="link" onClick={spy}>
        go to foo
      </Link>
    )
    act(() => void fireEvent.click(getByTestId('link')))
    expect(document.location.pathname).toEqual('/foo')
    expect(spy).toHaveBeenCalled()
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
  test('passes ref to anchor element', async () => {
    act(() => navigate('/'))

    let ref: any
    function LinkTest() {
      const linkRef = useRef<HTMLAnchorElement>(null)
      ref = linkRef
      return (
        <Link href="/foo" target="_blank" data-testid="linkref" ref={linkRef}>
          go to foo
        </Link>
      )
    }
    const { getByTestId } = render(<LinkTest />)
    expect(getByTestId('linkref')).toBe(ref?.current)
    expect(ref?.current).toBeInstanceOf(HTMLAnchorElement)
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
