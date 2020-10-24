import React, { useMemo, useState, useCallback } from 'react'
import { BasePathContext, PathContext } from './context.js'
import { useLocationChange, getCurrentPath, joinUrlPath } from './path.js'

export function useRoutes(
  routes,
  {
    basePath = '',
    routeProps = {},
    overridePathParams = true,
    matchTrailingSlash = false
  } = {}
) {
  // path is the browser url location
  const [path, setPath] = useState(getCurrentPath())

  routes = useMemo(() => mapRoutes(routes, basePath), [
    basePath,
    hashRoutes(routes)
  ])

  useLocationChange(setPath, { basePath, inheritBasePath: !basePath })
  // Get the current route
  const route = matchRoute(routes, path, {
    basePath,
    routeProps,
    overridePathParams,
    matchTrailingSlash
  })
  // No match should not return an empty Provider, just null
  if (!route) return null
  return (
    <BasePathContext.Provider value={basePath}>
      <PathContext.Provider value={path}>{route}</PathContext.Provider>
    </BasePathContext.Provider>
  )
}

function matchRoute(
  routes,
  path,
  { routeProps, overridePathParams, matchTrailingSlash }
) {
  // path.length > 1 ensure we still match on the root route "/" when matchTrailingSlash is set
  if (
    matchTrailingSlash &&
    path &&
    path[path.length - 1] === '/' &&
    path.length > 1
  ) {
    path = path.substring(0, path.length - 1)
  }
  const routeMatchers = useMemo(
    () => Object.keys(routes).map(createRouteMatcher),
    [hashRoutes(routes)]
  )

  // Hacky method for find + map
  let routeMatch
  routeMatchers.find(([routePath, regex, groups]) => {
    const match = path.match(regex)
    if (!match) return null
    const result = [routePath, {}]
    if (groups && groups.length) {
      result[1] = groups.reduce((props, prop, i) => {
        props[prop] = match[i + 1]
        return props
      }, {})
    }
    return (routeMatch = result)
  })
  if (!routeMatch) return null
  const [routePath, props] = routeMatch
  return routes[routePath](
    overridePathParams
      ? { ...props, ...routeProps }
      : { ...routeProps, ...props }
  )
}

function createRouteMatcher(routePath) {
  const route = [
    routePath,
    new RegExp(
      `${routePath.substr(0, 1) === '*' ? '' : '^'}${routePath
        .replace(/:[a-zA-Z]+/g, '([^/]+)')
        .replace(/\*/g, '')}${routePath.substr(-1) === '*' ? '' : '$'}`,
      'i'
    )
  ]

  const propList = routePath.match(/:[a-zA-Z]+/g)
  route.push(propList ? propList.map(paramName => paramName.substr(1)) : [])
  return route
}

// React doesn't like when the hook dependency array changes size
// >> Warning: The final argument passed to useMemo changed size between renders. The order and size of this array must remain constant.
// It is recommended to use a hashing function to produce a single, stable value
// https://github.com/facebook/react/issues/14324#issuecomment-441489421
function hashRoutes(routes) {
  const paths = Object.keys(routes).sort()
  return paths.join(':')
}

function mapRoutes(routes, basePath = '') {
  return Object.fromEntries(
    Object.entries(routes).map(([path, route]) => [
      joinUrlPath(basePath, path),
      route
    ])
  )
}
