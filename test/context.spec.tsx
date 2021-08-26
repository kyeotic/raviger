import React from 'react'
import { render, act } from '@testing-library/react'

import { useRoutes, navigate, RouteOptionParams, RouteParams } from '../src/main'
import { useRouter } from '../src/context'

beforeEach(() => {
  act(() => navigate('/'))
})

describe('useRouter', () => {
  function Harness({ routes, options }: { routes: RouteParams; options?: RouteOptionParams }) {
    const route = useRoutes(routes, options) || <span data-testid="label">not found</span>
    return route
  }

  function Route({ label }: { label: string }) {
    const { basePath, path } = useRouter()
    return (
      <div>
        <span data-testid="basePath">{basePath}</span>
        <span data-testid="path">{path}</span>
        <span data-testid="label">{label}</span>
      </div>
    )
  }
  const routes: RouteParams = {
    '/': () => <Route label="home" />,
    '/about': () => <Route label="about" />,
  }

  test('provides basePath', async () => {
    const { getByTestId } = render(<Harness routes={routes} options={{ basePath: '/home' }} />)

    act(() => navigate('/home'))
    expect(getByTestId('basePath')).toHaveTextContent('home')
  })

  test('provides path', async () => {
    const { getByTestId } = render(<Harness routes={routes} />)

    act(() => navigate('/about'))
    expect(getByTestId('path')).toHaveTextContent('about')
  })

  test('provides null path when basePath is missing', async () => {
    const { getByTestId } = render(<Harness routes={routes} options={{ basePath: '/home' }} />)

    act(() => navigate('/about'))
    expect(getByTestId('label')).toHaveTextContent('not found')
  })
})
