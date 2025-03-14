import React, { act } from 'react'
import { render } from '@testing-library/react'
import { navigate, useRedirect, Redirect, useRoutes } from '../src/main'

beforeEach(() => {
  act(() => navigate('/'))
})

describe('useRedirect', () => {
  function Mock() {
    useRedirect('/fail', '/catch', { query: { name: 'kyeotic' } })
    useRedirect('/miss', '/catch')
    return <span>Mock</span>
  }

  test('route is unchanged when predicate does not match', async () => {
    act(() => navigate('/'))
    render(<Mock />)
    expect(window.location.toString()).toEqual('http://localhost/')
    act(() => navigate('/test'))
    expect(window.location.toString()).toEqual('http://localhost/test')
  })

  test('route is changed when predicate matches', async () => {
    act(() => navigate('/fail'))
    expect(window.location.toString()).toEqual('http://localhost/fail')
    render(<Mock />)
    expect(window.location.toString()).toEqual('http://localhost/catch?name=kyeotic')
  })

  test('route handles empty redirect', async () => {
    act(() => navigate('/'))
    expect(window.location.toString()).toEqual('http://localhost/')
    render(<Mock />)
    act(() => navigate('/miss'))
    expect(window.location.toString()).toEqual('http://localhost/catch')
  })
})

describe('Redirect', () => {
  test('redirects to "to" without merge', async () => {
    render(<Redirect to="/foo" merge={false} />)
    expect(window.location.toString()).toEqual('http://localhost/foo')
  })

  test('redirects to "to" without merge and query', async () => {
    act(() => navigate('/?things=act'))
    render(<Redirect to="/foo" merge={false} />)
    expect(window.location.toString()).toEqual('http://localhost/foo')
  })

  test('redirects to "to" with merge (default) and query', async () => {
    act(() => navigate('/?things=act'))
    render(<Redirect to="/foo" />)
    expect(window.location.toString()).toEqual('http://localhost/foo?things=act')
  })

  test('redirects to "to" with merge and query/hash', async () => {
    act(() => navigate('/?things=act#test'))
    render(<Redirect to="/foo" merge />)
    expect(window.location.toString()).toEqual('http://localhost/foo?things=act#test')
  })

  test('redirects to "to" with query when merge', async () => {
    act(() => navigate('/?things=act#test'))
    render(<Redirect to="/foo" query={{ stuff: 'junk' }} merge />)
    expect(window.location.toString()).toEqual('http://localhost/foo?things=act&stuff=junk#test')
  })

  test('redirects to "to" with query when not merge', async () => {
    act(() => navigate('/?things=act#test'))
    render(<Redirect to="/foo" query={{ stuff: 'junk' }} merge={false} />)
    expect(window.location.toString()).toEqual('http://localhost/foo?stuff=junk')
  })
  test('redirects from useRoutes', async () => {
    const Page = () => {
      return <span data-testid="label">pass</span>
    }
    const routes = {
      '/redirect': () => <Redirect to={'/real/page'} />,
      '/real/page': () => <Page />,
      '*': () => <Redirect to={'/real/page'} />,
    }

    function Harness() {
      const route = useRoutes(routes) || <span data-testid="label">not found</span>
      return route
    }

    act(() => navigate('/'))
    const { getByTestId } = render(<Harness />)

    // Home
    expect(getByTestId('label')).toHaveTextContent('pass')

    // real
    act(() => navigate('/real/page'))
    expect(getByTestId('label')).toHaveTextContent('pass')

    // redirect
    act(() => navigate('/redirect'))
    expect(getByTestId('label')).toHaveTextContent('pass')

    // catch all redirect
    act(() => navigate('/fake'))
    expect(getByTestId('label')).toHaveTextContent('pass')
  })
})
