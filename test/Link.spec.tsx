/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import { render, act, fireEvent } from '@testing-library/react'

import { useRoutes, navigate, Link, ActiveLink } from '../src/main'

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

  test('allows basePath to be overridden for absolute links', async () => {
    // act(() => navigate('/'))

    act(() => navigate('/top'))
    function Host() {
      return (
        <>
          <Link href="/nested" basePath="/" data-testid="nested">
            nested
          </Link>
        </>
      )
    }
    function App() {
      return useRoutes(
        {
          '/': () => <Host />,
        },
        { basePath: '/top' }
      )
    }

    const { getByTestId } = render(<App />)
    act(() => void fireEvent.click(getByTestId('nested')))

    expect(document.location.pathname).toEqual('/nested')
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
    const spy = jest.fn()
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

  test('navigates to href with basePath', async () => {
    act(() => navigate('/'))
    const { getByTestId } = render(
      <ActiveLink
        href="/foo"
        basePath="/bar"
        className="base"
        activeClass="active"
        exactActiveClass="exact"
        data-testid="link"
      >
        go to foo
      </ActiveLink>
    )

    expect(getByTestId('link')).not.toHaveClass('active')
    expect(getByTestId('link')).not.toHaveClass('exact')

    act(() => void fireEvent.click(getByTestId('link')))
    expect(document.location.pathname).toEqual('/bar/foo')

    expect(getByTestId('link')).toHaveClass('active')
    expect(getByTestId('link')).toHaveClass('exact')
  })

  test('href without leading slash', async () => {
    act(() => navigate('/bar/foo'))
    const { getByTestId } = render(
      <ActiveLink
        href="test"
        className="base"
        activeClass="active"
        exactActiveClass="exact"
        data-testid="link"
      >
        go to foo
      </ActiveLink>
    )

    expect(getByTestId('link')).not.toHaveClass('active')
    expect(getByTestId('link')).not.toHaveClass('exact')

    act(() => void fireEvent.click(getByTestId('link')))
    expect(document.location.pathname).toEqual('/bar/test')

    expect(getByTestId('link')).toHaveClass('active')
    expect(getByTestId('link')).toHaveClass('exact')
  })

  test('empty classname on active link', async () => {
    const { getByTestId } = render(
      <ActiveLink href="/foo" activeClass="extra" exactActiveClass="double" data-testid="link">
        go to foo
      </ActiveLink>
    )

    act(() => navigate('/'))
    expect(getByTestId('link')).not.toHaveAttribute('class')

    act(() => navigate('/foo'))
    expect(getByTestId('link')).toHaveAttribute('class', 'double extra')

    act(() => navigate('/foo/bar'))
    expect(getByTestId('link')).toHaveAttribute('class', 'extra')
  })
})
