import React, { useMemo, useState, useLayoutEffect } from 'react'

import { BasePathContext, PathContext } from './context'
import { isNode, setSsrPath, getSsrPath } from './node'
import { getFormattedPath, usePath } from './path'

export interface RouteParams {
  [key: string]: (params?: Record<string, string>) => JSX.Element
}
export interface PathParamOptions {
  basePath?: string
  matchTrailingSlash?: boolean
}
export interface RouteOptionParams extends PathParamOptions {
  routeProps?: { [k: string]: any }
  overridePathParams?: boolean
}
interface RouteMatcher {
  path: string
  regex: RegExp
  props: string[]
}

export function useRoutes(
  routes: RouteParams,
  {
    basePath = '',
    routeProps = {},
    overridePathParams = true,
    matchTrailingSlash = true,
  }: RouteOptionParams = {}
): JSX.Element | null {
  /*
    This is a hack to setup a listener for the path while always using this latest path
    The issue with usePath is that, in order to not re-render nested components when
    their parent router changes the path, it uses the context's path
    But since that path has to get _set_ here in useRoutes something has to give
    If usePath returns latest it causes render thrashing
    If useRoutes hacks itself into the latest path nothing bad happens (...afaik)
  */

  const path = usePath(basePath) && getFormattedPath(basePath)

  // Handle potential <Redirect /> use in routes
  useRedirectDetection(basePath, path)

  // Get the current route
  const route = useMatchRoute(routes, path, {
    routeProps,
    overridePathParams,
    matchTrailingSlash,
  })
  // No match should not return an empty Provider, just null
  if (!route || path === null) return null
  return (
    <BasePathContext.Provider value={basePath}>
      <PathContext.Provider value={path}>{route}</PathContext.Provider>
    </BasePathContext.Provider>
  )
}

function useMatchRoute(
  routes: RouteParams,
  path: string | null,
  {
    routeProps,
    overridePathParams,
    matchTrailingSlash,
  }: Omit<RouteOptionParams, 'basePath' | 'matchTrailingSlash'> & { matchTrailingSlash: boolean }
) {
  path = trailingMatch(path, matchTrailingSlash)
  const routeMatchers = useMatchers(Object.keys(routes))

  if (path === null) return null

  // Hacky method for find + map
  let pathParams: RegExpMatchArray | null = null
  const routeMatch = routeMatchers.find(({ regex }) => {
    pathParams = (path ?? '').match(regex)
    return !!pathParams
  })

  if (!routeMatch || pathParams === null) return null

  const props = routeMatch.props.reduce((props: any, prop, i) => {
    // The following `match` can't be null because the above return asserts it
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    props[prop] = pathParams![i + 1]
    return props
  }, {})

  return routes[routeMatch.path](
    overridePathParams ? { ...props, ...routeProps } : { ...routeProps, ...props }
  )
}

const emptyPathResult: [null, null] = [null, null]

export function usePathParams<T extends Record<string, string>>(
  route: string,
  options?: PathParamOptions
): [string, T | null]
export function usePathParams<T extends Record<string, string>>(
  routes: string[],
  options?: PathParamOptions
): [string, T] | [null, null]
export function usePathParams<T extends Record<string, string>>(
  routeOrRoutes: string | string[],
  options: PathParamOptions = {}
): [boolean, T | null] | [string, T] | [null, null] {
  const [path, matchers] = usePathOptions(routeOrRoutes, options)
  const emptyResult: [boolean, null] | [null, null] = emptyPathResult

  if (path === null) return emptyResult

  const [routeMatch, props] = getMatchParams(path, matchers)

  if (!routeMatch) return emptyResult
  return ([routeMatch.path, props] as [string, T])
}

export function useMatch(route: string, options?: PathParamOptions): string | null
export function useMatch(routes: string[], options?: PathParamOptions): string | null
export function useMatch(
  routeOrRoutes: string | string[],
  options: PathParamOptions = {}
): string | null {
  const [path, matchers] = usePathOptions(routeOrRoutes, options)

  const match = matchers.find(({ regex }) => path?.match(regex))

  return match?.path ?? null
}

function usePathOptions(
  routeOrRoutes: string | string[],
  { basePath, matchTrailingSlash = true }: PathParamOptions
): [string | null, RouteMatcher[]] {
  const routes = (!Array.isArray(routeOrRoutes) ? [routeOrRoutes] : routeOrRoutes) as string[]

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const matchers = useMatchers(routes)

  return [trailingMatch(usePath(basePath), matchTrailingSlash), matchers]
}

function useMatchers(routes: string[]): RouteMatcher[] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => routes.map(createRouteMatcher), [hashParams(routes)])
}

function getMatchParams(
  path: string,
  routeMatchers: RouteMatcher[]
): [RouteMatcher, Record<string, unknown>] | [null, null] {
  // Hacky method for find + map
  let pathParams: RegExpMatchArray | null = null
  const routeMatch = routeMatchers.find(({ regex }) => {
    pathParams = path.match(regex)
    return !!pathParams
  })

  if (!routeMatch || pathParams === null) return emptyPathResult

  const props = routeMatch.props.reduce((props: any, prop, i) => {
    // The following `match` can't be null because the above return asserts it
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    props[prop] = pathParams![i + 1]
    return props
  }, {})

  return [routeMatch, props]
}

function createRouteMatcher(path: string): RouteMatcher {
  return {
    path,
    regex: new RegExp(
      `${path.substr(0, 1) === '*' ? '' : '^'}${path
        .replace(/:[a-zA-Z]+/g, '([^/]+)')
        .replace(/\*/g, '')}${path.substr(-1) === '*' ? '' : '$'}`,
      'i'
    ),
    props: (path.match(/:[a-zA-Z]+/g) ?? []).map((paramName) => paramName.substr(1)),
  }
}

export function setPath(path: string): void {
  if (!isNode) {
    throw new Error('This method should only be used in NodeJS environments')
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const url = require('url')
  setSsrPath(url.resolve(getSsrPath(), path))
}

// React doesn't like when the hook dependency array changes size
// >> Warning: The final argument passed to useMemo changed size between renders. The order and size of this array must remain constant.
// It is recommended to use a hashing function to produce a single, stable value
// https://github.com/facebook/react/issues/14324#issuecomment-441489421
function hashParams(params: string[]): string {
  return [...params].sort().join(':')
}

// React appears to suppress parent's re-rendering when a child's
// useLayoutEffect updates internal state
// the `navigate` call in useRedirect *does* cause usePath/useLocationChange
// to fire, but without this hack useRoutes suppresses the update
// TODO: find a better way to cause a synchronous update from useRoutes
function useRedirectDetection(basePath: string, path: string | null) {
  const [, forceRender] = useState(false)
  useLayoutEffect(() => {
    if (path !== getFormattedPath(basePath)) {
      forceRender((s) => !s)
    }
  }, [basePath, path])
}

function trailingMatch(path: string | null, matchTrailingSlash: boolean): string | null {
  if (path === null) return path
  // path.length > 1 ensure we still match on the root route "/" when matchTrailingSlash is set
  if (matchTrailingSlash && path && path[path.length - 1] === '/' && path.length > 1) {
    path = path.substring(0, path.length - 1)
  }
  return path
}
